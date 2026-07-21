import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DataSource, Not, Repository } from 'typeorm';
import * as Bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { add, addMinutes, differenceInSeconds, isBefore } from 'date-fns';
import {
  EmailVerificationsEntity,
  RoleEntity,
  TransactionalCodeEntity,
  UserEntity,
} from '@auth/entities';
import { PayloadTokenInterface, TokenInterface } from 'src/modules/auth/interfaces';
import {
  AuthRepositoryEnum,
  CatalogueTypeEnum,
  CatalogueUsersIdentificationTypeEnum,
  ConfigEnum,
  MailSubjectEnum,
  MailTemplateEnum,
} from '@utils/enums';
import { PasswordChangedDto, SignInDto, SignUpExternalDto, TermsDto } from '@auth/dto';
import { ServiceResponseHttpInterface } from '@utils/interfaces';
import { MailService } from '@modules/common/mail/mail.service';
import { envConfig } from '@config';
import { ConfigType } from '@nestjs/config';
import { MailDataInterface } from '@modules/common/mail/interfaces/mail-data.interface';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { SignInInterface } from '@auth/interfaces/sign-in.interface';
import { ErrorCodeEnum, MessageAuthEnum, RoleEnum } from '@auth/enums';
import { SecurityQuestionEntity } from '@auth/entities/security-question.entity';
import { CreateSecurityQuestionDto } from '@auth/dto/security-questions/create-security-question.dto';
import { EmailResetSecurityQuestionDto } from '@auth/dto/security-questions/email-reset-security-question.dto';
import { createHash, randomUUID } from 'node:crypto';
import { PasswordResetDto } from '@auth/dto/auth/password-reset.dto';
import { CataloguesService } from '@modules/common/catalogue/catalogue.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AuthRepositoryEnum.userRepository)
    private repository: Repository<UserEntity>,
    @Inject(AuthRepositoryEnum.roleRepository)
    private roleRepository: Repository<RoleEntity>,
    @Inject(AuthRepositoryEnum.transactionalCodeRepository)
    private transactionalCodeRepository: Repository<TransactionalCodeEntity>,
    @Inject(AuthRepositoryEnum.securityQuestionRepository)
    private securityQuestionRepository: Repository<SecurityQuestionEntity>,
    @Inject(AuthRepositoryEnum.emailVerificationRepository)
    private emailVerificationRepository: Repository<EmailVerificationsEntity>,
    @Inject(envConfig.KEY) private configService: ConfigType<typeof envConfig>,
    @Inject(ConfigEnum.PG_DATA_SOURCE)
    private readonly dataSource: DataSource,
    private readonly cataloguesService: CataloguesService,
    private jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly httpService: HttpService,
  ) {}

  async changePassword(id: string, payload: PasswordChangedDto): Promise<boolean> {
    const user = await this.repository.findOne({
      where: { id },
      select: { id: true, password: true, passwordChanged: true },
    });

    if (!user) {
      throw new NotFoundException({
        error: ErrorCodeEnum.NOT_FOUND,
        message: 'Usuario no encontrado para cambio de contraseña',
      });
    }

    if (payload.password !== payload.passwordConfirm) {
      throw new BadRequestException({
        error: 'Las contraseñas no coinciden',
        message: 'Por favor, asegúrate de escribir la misma contraseña en ambos campos',
      });
    }

    if (await this.checkPassword(payload.password, user, false)) {
      throw new BadRequestException({
        error: 'La nueva contraseña no puede ser igual a la actual',
        message: `Por seguridad, debes elegir una contraseña distinta a la que usas actualmente`,
      });
    }

    user.password = payload.password;
    user.passwordChanged = true;

    await this.repository.save(user);

    return true;
  }

  async signIn(payload: SignInDto): Promise<SignInInterface> {
    const user: UserEntity | null = await this.repository.findOne({
      select: {
        id: true,
        hasDisability: true,
        identification: true,
        lastname: true,
        name: true,
        maxAttempts: true,
        password: true,
        suspendedAt: true,
        emailVerifiedAt: true,
        username: true,
        birthdate: true,
        securityQuestionAcceptedAt: true,
        passwordChanged: true,
        termsAcceptedAt: true,
      },
      where: {
        username: payload.username,
      },
      relations: {
        roles: true,
        nationality: true,
        bloodType: true,
        sex: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException({
        error: ErrorCodeEnum.INVALID_USER,
        message: 'Usuario y/o contraseña no válidos',
      });
    }

    if (user?.suspendedAt)
      throw new ForbiddenException({
        error: ErrorCodeEnum.ACCOUNT_SUSPENDED,
        message: 'Su usuario se encuentra suspendido',
      });

    if (user?.maxAttempts === 0) {
      throw new ForbiddenException({
        error: ErrorCodeEnum.ACCOUNT_LOCKED,
        message: 'Ha excedido el número máximo de intentos permitidos',
      });
    }

    if (!user?.emailVerifiedAt)
      throw new ForbiddenException({
        error: ErrorCodeEnum.ACCOUNT_UNVERIFIED_EMAIL,
        message: 'Aún no has verificado tu correo electrónico',
      });

    if (payload.username.includes('@produccion.gob.ec')) {
      const response = await this.signInLDAP(payload);
      if (!response) {
        throw new UnauthorizedException({
          error: ErrorCodeEnum.INVALID_PASSWORD,
          message: `Usuario y/o contraseña no válidos, ${user.maxAttempts - 1} intentos restantes`,
        });
      }
    } else {
      if (!(await this.checkPassword(payload.password, user))) {
        throw new UnauthorizedException({
          error: ErrorCodeEnum.INVALID_PASSWORD,
          message: `Usuario y/o contraseña no válidos, ${user.maxAttempts - 1} intentos restantes`,
        });
      }
    }

    const { password, suspendedAt, maxAttempts, ...userRest } = user;

    const tokens = this.generateJwt(user);

    await this.repository.update(user.id, {
      activatedAt: new Date(),
      refreshToken: await Bcrypt.hash(tokens.refreshToken, 10),
    });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      auth: userRest,
      roles: userRest.roles,
    };
  }

  async signInLDAP(payload: SignInDto): Promise<boolean> {
    const url = `${this.configService.externalApis.urlLDAP}/${payload.username.split('@')[0]}/${payload.password}`;

    const response = await lastValueFrom(this.httpService.get(url));

    return response.data.data;
  }

  async signUpExternal(payload: SignUpExternalDto): Promise<UserEntity> {
    const user = await this.repository.findOne({
      where: [{ identification: payload.identification }, { email: payload.email }],
    });

    if (user && user.identification === payload.identification) {
      throw new BadRequestException({
        error: 'El usuario ya existe',
        message: 'Por favor ingrese otro RUC',
      });
    }

    if (user && user.email === payload.email) {
      throw new BadRequestException({
        error: 'El correo ya se encuentra en uso',
        message: 'Por favor ingrese otro correo',
      });
    }

    const role = await this.roleRepository.findOneBy({ code: RoleEnum.student });

    if (payload.password !== payload.passwordConfirm) {
      throw new BadRequestException({
        error: 'Las contraseñas no coinciden',
        message: 'Por favor, asegúrate de escribir la misma contraseña en ambos campos',
      });
    }
    const securityQuestions = payload.securityQuestions.map((q) =>
      this.securityQuestionRepository.create({
        code: q.code,
        question: q.question,
        answer: q.answer,
      }),
    );

    const identificationType = (await this.cataloguesService.findCache()).find(
      (item) =>
        item.code === CatalogueUsersIdentificationTypeEnum.ruc &&
        item.type === CatalogueTypeEnum.users_identification_type,
    );

    const entity = this.repository.create({
      ...payload,
      passwordChanged: true,
      emailVerifiedAt: new Date(),
      termsAcceptedAt: new Date(),
      securityQuestionAcceptedAt: new Date(),
      roles: [role!],
      identificationTypeId: identificationType?.id,
      securityQuestions,
    });

    const userSaved = await this.repository.save(entity);

    return userSaved;
  }

  async acceptTerms(id: string, payload: TermsDto): Promise<boolean> {
    const user = await this.repository.findOne({
      where: { id },
      select: { id: true, termsAcceptedAt: true },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado para cambio de contraseña');
    }

    user.termsAcceptedAt = payload.termsAcceptedAt ? new Date() : null;

    await this.repository.save(user);

    return true;
  }

  async refreshToken(user: UserEntity): Promise<TokenInterface> {
    const tokens = this.generateJwt(user);

    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async saveRefreshToken(userId: string, refreshToken: string) {
    await this.repository.update(userId, {
      refreshToken: await Bcrypt.hash(refreshToken, 10),
    });
  }

  async requestTransactionalCode(id: string): Promise<string> {
    const user = await this.repository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException({
        error: MessageAuthEnum.NOT_FOUND,
        message: 'Usuario no encontrado, intenta de nuevo',
      });
    }

    const transactionalCode = await this.transactionalCodeRepository.findOne({
      where: { requester: user.username },
      order: { createdAt: 'DESC' },
    });

    if (transactionalCode) {
      const now = new Date(); // UTC
      const cooldownTime = new Date(transactionalCode.createdAt.getTime() + 30 * 1000);

      if (now < cooldownTime) {
        const remainingSeconds = Math.ceil((cooldownTime.getTime() - now.getTime()) / 1000);

        throw new BadRequestException({
          data: { remainingSeconds },
          error: ErrorCodeEnum.REMAINING_TOKEN,
          message: `Por favor espera ${remainingSeconds} segundos.`,
        });
      }
    }

    const randomNumber = Math.random();
    const token = randomNumber.toString().substring(2, 8);

    const mailData: MailDataInterface = {
      to: user.email || user.personalEmail,
      subject: MailSubjectEnum.TRANSACTIONAL_CODE,
      template: MailTemplateEnum.TRANSACTIONAL_CODE,
      data: {
        token,
        user,
      },
    };

    await this.mailService.sendMail(mailData);

    const payload = { requester: user.username, token, type: 'auth' };

    await this.transactionalCodeRepository.save(payload);

    const value = user.email || user.personalEmail;

    return this.maskEmail(value);
  }

  async requestTransactionalPasswordResetCode(identification: string): Promise<string> {
    const user = await this.repository.findOneBy({ identification });

    if (!user) {
      throw new NotFoundException();
    }

    const transactionalCode = await this.transactionalCodeRepository.findOne({
      where: { requester: user.identification },
      order: { createdAt: 'DESC' },
    });

    console.log(transactionalCode);
    if (transactionalCode) {
      const cooldownTime = addMinutes(transactionalCode.createdAt, 1);
      console.log('cooldownTime password reset', cooldownTime);
      if (isBefore(new Date(), cooldownTime)) {
        const remainingSeconds = differenceInSeconds(cooldownTime, new Date());

        console.log(remainingSeconds);
        throw new BadRequestException({
          data: { remainingSeconds },
          error: ErrorCodeEnum.REMAINING_TOKEN,
          message: `Por favor espera ${remainingSeconds} segundos antes de solicitar uno nuevo.`,
        });
      }
    }

    const randomNumber = Math.random();
    const token = randomNumber.toString().substring(2, 8);

    const mailData: MailDataInterface = {
      to: user.email,
      subject: MailSubjectEnum.PASSWORD_RESET,
      template: MailTemplateEnum.TRANSACTIONAL_PASSWORD_RESET_CODE,
      data: {
        token,
        user,
      },
    };

    await this.mailService.sendMail(mailData);

    const payload = { requester: user.identification, token, type: 'password_reset' };

    await this.transactionalCodeRepository.save(payload);

    return this.maskEmail(user.email);
  }

  async requestTransactionalSignupCode(email: string): Promise<string> {
    const transactionalCode = await this.transactionalCodeRepository.findOne({
      where: { requester: email },
      order: { createdAt: 'DESC' },
    });

    if (transactionalCode) {
      const cooldownTime = addMinutes(transactionalCode.createdAt, 1);
      console.log('cooldownTime signup', cooldownTime);
      if (isBefore(new Date(), cooldownTime)) {
        const remainingSeconds = differenceInSeconds(cooldownTime, new Date());

        throw new BadRequestException({
          data: { remainingSeconds },
          error: ErrorCodeEnum.REMAINING_TOKEN,
          message: `Por favor espera ${remainingSeconds} segundos antes de solicitar uno nuevo.`,
        });
      }
    }

    const randomNumber = Math.random();

    const token = randomNumber.toString().substring(2, 8);

    const mailData: MailDataInterface = {
      to: email,
      subject: MailSubjectEnum.ACCOUNT_REGISTER,
      template: MailTemplateEnum.TRANSACTIONAL_SIGNUP_CODE,
      data: { token },
    };

    await this.mailService.sendMail(mailData);

    const entity = this.transactionalCodeRepository.create({
      requester: email,
      token,
      type: 'signup',
    });

    await this.transactionalCodeRepository.save(entity);

    return entity.requester;
  }

  async verifyTransactionalCode(token: string, requester: string): Promise<boolean> {
    const transactionalCode = await this.transactionalCodeRepository.findOne({
      where: { token },
    });

    if (!transactionalCode) {
      throw new BadRequestException({
        message: 'Código de seguridad no válido',
        error: MessageAuthEnum.TRANSACTIONAL_CODE_INVALID,
      });
    }

    if (transactionalCode.requester.toLowerCase() !== requester.toLowerCase()) {
      throw new BadRequestException({
        message: 'El usuario no corresponde al código seguridad generado',
        error: MessageAuthEnum.TRANSACTIONAL_CODE_NOT_MATCH,
      });
    }

    if (transactionalCode.isUsed) {
      throw new BadRequestException({
        message: 'El código ya fue usado',
        error: MessageAuthEnum.TRANSACTIONAL_CODE_USED,
      });
    }

    const maxDate = add(transactionalCode.createdAt, {
      minutes: this.configService.securityCodeExpiresIn,
    });

    if (isBefore(maxDate, new Date())) {
      throw new BadRequestException({
        message: 'El código ha expirado',
        error: MessageAuthEnum.TRANSACTIONAL_CODE_EXPIRED,
      });
    }

    transactionalCode.isUsed = true;

    await this.transactionalCodeRepository.save(transactionalCode);

    return true;
  }

  async resetPassword(payload: PasswordResetDto): Promise<boolean> {
    const user = await this.repository.findOne({
      where: { identification: payload.identification },
    });

    if (!user) {
      throw new NotFoundException({
        message: 'Usuario no encontrado para resetear contraseña, intenta de nuevo',
        error: MessageAuthEnum.NOT_FOUND,
      });
    }

    if (payload.password !== payload.passwordConfirm) {
      throw new BadRequestException({
        error: 'Las contraseñas no coinciden',
        message: 'Por favor, asegúrate de escribir la misma contraseña en ambos campos',
      });
    }

    this.repository.merge(user, {
      maxAttempts: this.configService.maxAttempts,
      password: payload.password,
      passwordChanged: true,
    });

    await this.repository.save(user);

    return true;
  }

  async verifyExistUser(identification: string): Promise<UserEntity | null> {
    return await this.repository.findOne({
      where: { identification },
      select: { id: true },
    });
  }

  async verifyExistEmail(email: string): Promise<UserEntity | null> {
    return await this.repository.findOne({
      where: { email },
      select: { id: true },
    });
  }

  async verifyUpdatedUser(identification: string, userId: string): Promise<UserEntity | null> {
    return await this.repository.findOne({
      where: { identification, id: Not(userId) },
      select: { id: true },
    });
  }

  async verifyRegisteredUser(identification: string): Promise<ServiceResponseHttpInterface> {
    const user = await this.repository.findOne({
      where: { identification },
      select: {
        id: true,
        name: true,
        lastname: true,
        email: true,
        securityQuestions: {
          id: true,
          code: true,
          question: true,
        },
      },
      relations: { securityQuestions: true },
    });

    if (!user) {
      throw new NotFoundException({
        error: 'Registro no encontrado',
        message: 'Intenta de nuevo',
      });
    }

    return {
      data: {
        ...user,
        email: user.email ? this.maskEmail(user.email) : '',
      },
    };
  }

  async verifySecurityQuestionsAndResetEmail(
    userId: string,
    payload: EmailResetSecurityQuestionDto,
  ): Promise<boolean> {
    const securityQuestions = await this.securityQuestionRepository.find({
      where: { userId },
    });

    const map = new Map(securityQuestions.map((q) => [q.code, q]));

    const isValid = payload.securityQuestions.every((q) => {
      const stored = map.get(q.code);
      return stored && Bcrypt.compareSync(q.answer.toLowerCase(), stored.answer);
    });

    if (!isValid) {
      throw new BadRequestException({
        error: 'Respuestas incorrectas',
        message: 'Las respuestas no coinciden, vuelva a intentar',
      });
    }

    const entity = await this.repository.preload({
      id: userId,
      email: payload.email,
    });

    await this.repository.save(entity!);

    return true;
  }

  async verifyEmail(token: string): Promise<boolean> {
    return await this.dataSource.transaction(async (manager) => {
      const hashedToken = createHash('sha256').update(token).digest('hex');

      const emailVerification = await manager.findOne(EmailVerificationsEntity, {
        where: { token: hashedToken },
        relations: { user: true },
      });

      if (!emailVerification) {
        throw new BadRequestException({
          error: ErrorCodeEnum.INVALID_TOKEN,
          message: 'Token no válido',
        });
      }

      if (emailVerification.user.emailVerifiedAt) {
        throw new BadRequestException({
          error: ErrorCodeEnum.ACCOUNT_VERIFIED_EMAIL,
          message: 'Tu cuenta ya fue verificada. Puedes iniciar sesión o continuar con el proceso.',
        });
      }

      if (emailVerification.usedAt) {
        throw new BadRequestException({
          error: ErrorCodeEnum.USED_TOKEN,
          message: 'Token ya fue usado',
        });
      }

      if (emailVerification.expiresAt < new Date()) {
        throw new BadRequestException({
          error: ErrorCodeEnum.EXPIRED_TOKEN,
          message: 'Token expirado',
        });
      }

      emailVerification.user.emailVerifiedAt = new Date();
      emailVerification.usedAt = new Date();

      await this.repository.save(emailVerification.user);
      await this.emailVerificationRepository.save(emailVerification);

      return true;
    });
  }

  async requestVerifyEmail(username: string): Promise<boolean> {
    return await this.dataSource.transaction(async (manager) => {
      const entityExist = await manager.findOne(UserEntity, {
        where: [{ identification: username }, { username: username }],
      });

      if (!entityExist) return false;

      const { token, hashedToken, expiresAt } = this.generateEmailVerificationToken();

      await this.emailVerificationRepository.save({
        userId: entityExist.id,
        token: hashedToken,
        expiresAt,
      });

      const mailData: MailDataInterface = {
        to: entityExist.email || entityExist.personalEmail,
        subject: MailSubjectEnum.EMAIL_VERIFICATION_RESEND,
        template: MailTemplateEnum.EMAIL_VERIFICATION_RESEND,
        data: {
          user: entityExist,
          token,
          expiresAt,
        },
      };

      await this.mailService.sendMail(mailData);

      return true;
    });
  }

  async signOut(id: string): Promise<boolean> {
    await this.repository.update(id, {
      refreshToken: null,
    });

    return true;
  }

  async createSecurityQuestions(
    userId: string,
    payload: CreateSecurityQuestionDto,
  ): Promise<SecurityQuestionEntity[]> {
    return await this.dataSource.transaction(async (manager) => {
      const questionsToDelete = await manager.find(SecurityQuestionEntity, {
        where: { userId },
      });

      if (questionsToDelete.length > 0) await manager.softRemove(questionsToDelete);

      const newQuestions = payload.securityQuestions.map((question) =>
        manager.create(SecurityQuestionEntity, {
          ...question,
          userId: userId,
        }),
      );

      const userToUpdate = await manager.preload(UserEntity, {
        id: userId,
        securityQuestionAcceptedAt: new Date(),
      });

      if (!userToUpdate) {
        throw new NotFoundException(`Usuario no encontrado`);
      }

      await manager.save(userToUpdate);

      return await manager.save(newQuestions);
    });
  }

  private generateJwt(user: UserEntity) {
    const payload: PayloadTokenInterface = {
      sub: user.id,
      username: user.username,
    };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.jwt.refreshSecret,
      expiresIn: this.configService.jwt.refreshExpires,
    });

    return { accessToken, refreshToken };
  }

  private async checkPassword(
    passwordCompare: string,
    user: UserEntity,
    reduceAttempts = true,
  ): Promise<boolean> {
    const isMatch = await Bcrypt.compare(passwordCompare, user.password);

    if (isMatch) {
      await this.repository.update(user.id, {
        maxAttempts: this.configService.maxAttempts,
      });
      return true;
    }

    if (!reduceAttempts) {
      return false;
    }

    const remainingAttempts = Math.max(user.maxAttempts - 1, 0);

    await this.repository.update(user.id, {
      maxAttempts: remainingAttempts,
    });

    return false;
  }

  private maskEmail(email: string): string {
    if (!email || !email.includes('@')) return email;

    const [user, domain] = email.split('@');

    if (user.length <= 3) {
      return `${user[0]}**@${domain}`;
    }

    const visible = user.slice(0, 3);
    const hidden = '*'.repeat(user.length - 3);

    return `${visible}${hidden}@${domain}`;
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
