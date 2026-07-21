import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateUserDto,
  UpdateAdditionalInformationDto,
  UpdateProfileDto,
  UpdateUserDto,
} from '@auth/dto';
import { UserEntity } from '@auth/entities';
import { ResponseHttpInterface } from '@utils/interfaces';
import { UsersService } from '../services/users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { getFileName, imageFilter } from '@utils/helpers';
import { PaginationDto } from '@utils/pagination';
import { Auth } from '@auth/decorators';
import { RoleEnum } from '@auth/enums';

@ApiTags('Users')
@Controller('auth/users')
@Auth(RoleEnum.admin)
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @ApiOperation({ summary: 'Create' })
  @Post()
  async create(@Body() payload: CreateUserDto): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.service.create(payload);

    return {
      data: serviceResponse,
      message: 'Usuario creado',
      title: 'Creado',
    };
  }

  @ApiOperation({ summary: 'Catalogue' })
  @Get('catalogue')
  async catalogue(): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.service.catalogue();

    return {
      data: serviceResponse,
      message: `catalogue`,
      title: `Catalogue`,
    };
  }

  @ApiOperation({ summary: 'Find All' })
  @Get()
  async findAll(@Query() params: PaginationDto): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.service.findAll(params);

    return {
      data: serviceResponse.data,
      pagination: serviceResponse.pagination,
      message: `index`,
      title: 'Success',
    };
  }

  @ApiOperation({ summary: 'Find One' })
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.service.findOne(id);

    return {
      data: serviceResponse,
      message: `find one ${id}`,
      title: `Success`,
    };
  }

  @ApiOperation({ summary: 'Update' })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateUserDto,
  ): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.service.update(id, payload);

    return {
      data: serviceResponse,
      message: `Usuario actualizado`,
      title: `Actualizado`,
    };
  }

  @ApiOperation({ summary: 'Activate' })
  @Patch(':id/activate')
  async activate(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.service.activate(id);

    return {
      data: serviceResponse,
      message: `Usuario activado`,
      title: `Activado`,
    };
  }

  @ApiOperation({ summary: 'Delete One' })
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.service.delete(id);

    return {
      data: serviceResponse,
      message: `Usuario eliminado`,
      title: `Eliminado`,
    };
  }

  @ApiOperation({ summary: 'Delete All' })
  @Patch('delete-all')
  async deleteAll(@Body() payload: UserEntity[]): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.service.deleteAll(payload);

    return {
      data: serviceResponse,
      message: `Usuarios eliminados`,
      title: `Eliminados`,
    };
  }

  @ApiOperation({ summary: 'Suspend One' })
  @Patch(':id/suspend')
  async suspend(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.service.suspend(id);

    return {
      data: serviceResponse,
      message: `Usuario suspendido`,
      title: `Suspendido`,
    };
  }

  @ApiOperation({ summary: 'Upload Avatar' })
  @Post(':id/avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: join(process.cwd(), 'public/assets/avatars'),
        filename: getFileName,
      }),
      fileFilter: imageFilter,
      limits: { fieldSize: 1 },
    }),
  )
  async uploadAvatar(
    @UploadedFile() avatar: Express.Multer.File,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.service.uploadAvatar(avatar, id);

    return {
      data: serviceResponse,
      message: 'Imagen Subida Correctamente',
      title: 'Imagen Subida',
    };
  }

  @ApiOperation({ summary: 'Find Profile' })
  @Auth()
  @Get(':id/profile')
  async findProfile(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.service.findProfile(id);

    return {
      data: serviceResponse,
      message: `profile`,
      title: `Success`,
    };
  }

  @ApiOperation({ summary: 'Update Profile' })
  @Auth()
  @Patch(':id/profile')
  async updateProfile(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateProfileDto,
  ): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.service.updateProfile(id, payload);

    return {
      data: serviceResponse,
      message: 'El perfil fue actualizado correctamente',
      title: 'Perfil Actualizado',
    };
  }

  @Auth()
  @ApiOperation({ summary: 'Update Additional Information' })
  @Patch(':id/additional-information')
  async updateAdditionalInformation(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateAdditionalInformationDto,
  ): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.service.updateAdditionalInformation(id, payload);

    return {
      data: serviceResponse,
      message: 'El perfil fue actualizado correctamente',
      title: 'Perfil Actualizado',
    };
  }
}
