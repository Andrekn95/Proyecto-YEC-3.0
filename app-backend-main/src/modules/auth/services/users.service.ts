import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  CreateUserDto,
  UpdateAdditionalInformationDto,
  UpdateProfileDto,
  UpdateUserDto,
} from '@auth/dto';
import { EmailVerificationsEntity, UserEntity } from '@auth/entities';
import { ServiceResponseHttpInterface } from '@utils/interfaces';
import { AuthRepositoryEnum, MailSubjectEnum, MailTemplateEnum } from '@utils/enums';
import { PaginationDto } from '@utils/pagination';
import { envConfig } from '@config';
import { ConfigType } from '@nestjs/config';
import { MailDataInterface } from '@modules/common/mail/interfaces/mail-data.interface';
import { MailService } from '@modules/common/mail/mail.service';
import { createHash, randomUUID } from 'node:crypto';
import { RoleEnum } from '@auth/enums';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { id } from 'date-fns/locale';
import { CataloguesService } from '@modules/common/catalogue/catalogue.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(AuthRepositoryEnum.userRepository)
    private repository: Repository<UserEntity>,
    @Inject(AuthRepositoryEnum.emailVerificationRepository)
    private emailVerificationRepository: Repository<EmailVerificationsEntity>,
    @Inject(envConfig.KEY) private configService: ConfigType<typeof envConfig>,
    private readonly mailService: MailService,
    private readonly httpService: HttpService,
    private readonly cataloguesService: CataloguesService,
  ) {}

  async create(payload: CreateUserDto): Promise<UserEntity> {
    const entityExist = await this.repository.findOne({
      where: [{ identification: payload.email }, { username: payload.username }],
    });

    if (entityExist) throw new BadRequestException('El registro ya existe');

    let passwordChanged = !payload.passwordChanged;
    let securityQuestionAcceptedAt: null | Date = null;

    if (payload.email.includes('@produccion.gob.ec')) {
      passwordChanged = true;
      securityQuestionAcceptedAt = new Date();
    }

    const entity = this.repository.create({
      ...payload,
      passwordChanged,
      securityQuestionAcceptedAt,
    });

    const userCreated = await this.repository.save(entity);

    const { token, hashedToken, expiresAt } = this.generateEmailVerificationToken();

    await this.emailVerificationRepository.save({
      userId: userCreated.id,
      token: hashedToken,
      expiresAt,
    });

    const mailData: MailDataInterface = {
      to: userCreated.email || userCreated.personalEmail,
      subject: MailSubjectEnum.INTERNAL_ACCOUNT_CREATED,
      template: MailTemplateEnum.INTERNAL_ACCOUNT_CREATED,
      data: {
        user: userCreated,
        token,
        expiresAt,
      },
    };

    await this.mailService.sendMail(mailData);

    return userCreated;
  }

  async findAll(params: PaginationDto): Promise<ServiceResponseHttpInterface> {
    await this.repository.find();
    return {
      data: {},
      pagination: {},
    };
  }

  async findOne(id: string): Promise<UserEntity> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: {
        roles: true,
        identificationType: true,
      },
      select: { password: false },
    });

    if (!entity) {
      throw new NotFoundException('Registro no encontrado (find one)');
    }

    return entity;
  }

  async update(id: string, payload: UpdateUserDto): Promise<UserEntity> {
    const entity = await this.repository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new NotFoundException('Registro no encontrado');
    }

    this.repository.merge(entity, { ...payload, passwordChanged: !payload.passwordChanged });

    return await this.repository.save(entity);
  }

  async delete(id: string): Promise<UserEntity> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException('Registro no encontrado para eliminar');
    }

    return await this.repository.softRemove(entity);
  }

  async deleteAll(payload: UserEntity[]): Promise<UserEntity[]> {
    return await this.repository.softRemove(payload);
  }

  async catalogue(): Promise<UserEntity[]> {
    return await this.repository.find();
  }

  async activate(id: string): Promise<UserEntity> {
    const entity = await this.findOne(id);

    if (!entity) {
      throw new NotFoundException('Usuario no encontrado para reactivar');
    }

    entity.suspendedAt = null;
    entity.maxAttempts = this.configService.maxAttempts;

    return await this.repository.save(entity);
  }

  async suspend(id: string): Promise<UserEntity> {
    const entity = await this.findOne(id);

    if (!entity) {
      throw new NotFoundException('Usuario no encontrado para suspender');
    }

    entity.suspendedAt = new Date();

    return await this.repository.save(entity);
  }

  async findProfile(id: string): Promise<UserEntity> {
    const user = await this.repository.findOne({
      select: {
        id: true,
        avatar: true,
        birthdate: true,
        identification: true,
        name: true,
        email: true,
        emailVerifiedAt: true,
        lastname: true,
        personalEmail: true,
        username: true,
        cellPhone: true,
        phone: true,
      },
      where: {
        id,
      },
      relations: {
        roles: true,
        identificationType: true,
        bloodType: true,
        ethnicOrigin: true,
        gender: true,
        maritalStatus: true,
        nationality: true,
        sex: true,
      },
    });

    if (!user) {
      throw new NotFoundException('El perfil no existe');
    }

    return user;
  }

  async updateProfile(id: string, payload: UpdateProfileDto): Promise<UserEntity> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException('Usuario no encontrado para actualizar el perfil');
    }

    this.repository.merge(entity, payload);

    return await this.repository.save(entity);
  }

  async updateAdditionalInformation(
    id: string,
    payload: UpdateAdditionalInformationDto,
  ): Promise<UserEntity> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException('Usuario no encontrado para actualizar el perfil');
    }

    this.repository.merge(entity, payload);

    return await this.repository.save(entity);
  }

  async uploadAvatar(file: Express.Multer.File, id: string): Promise<UserEntity> {
    const entity = await this.repository.findOne({
      select: {
        id: true,
        avatar: true,
      },
      where: { id },
    });

    if (!entity) {
      throw new NotFoundException('Usuario no encontrado');
    }

    entity.avatar = `avatars/${file.filename}`;

    return await this.repository.save(entity);
  }

  private generateEmailVerificationToken() {
    const token = randomUUID();

    const hashedToken = createHash('sha256').update(token).digest('hex');

    const expiresAt = new Date();

    expiresAt.setHours(expiresAt.getHours() + 24);

    return {
      token,
      hashedToken,
      expiresAt,
    };
  }
}
