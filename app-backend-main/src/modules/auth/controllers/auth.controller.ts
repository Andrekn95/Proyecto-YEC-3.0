import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PublicRoute, User } from '@auth/decorators';
import { UserEntity } from '@auth/entities';
import { PasswordChangedDto, SignInDto, SignUpExternalDto, TermsDto } from '@auth/dto';
import { ResponseHttpInterface } from '@utils/interfaces';
import { AuthService } from '@auth/services/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateSecurityQuestionDto } from '@auth/dto/security-questions/create-security-question.dto';
import { EmailResetSecurityQuestionDto } from '@auth/dto/security-questions/email-reset-security-question.dto';
import { PasswordResetDto } from '@auth/dto/auth/password-reset.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'SignIn' })
  @PublicRoute()
  @Post('sign-in')
  async signIn(@Body() payload: SignInDto): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.authService.signIn(payload);

    return {
      data: serviceResponse,
      message: 'Acceso Correcto',
      title: 'Bienvenido/a',
    };
  }

  @Post('sign-out')
  async signOut(@User() user: UserEntity) {
    const serviceResponse = await this.authService.signOut(user.id);

    return {
      data: serviceResponse,
      message: 'Sesión cerrada correctamente',
      title: 'Cerrar Sesión',
    };
  }

  @PublicRoute()
  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh-token')
  async refreshToken(@User() user: UserEntity): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.authService.refreshToken(user);

    return {
      data: serviceResponse,
      message: 'Refresh Token',
      title: 'Refresh Token',
    };
  }

  @ApiOperation({ summary: 'SignUpExternal' })
  @PublicRoute()
  @Post('sign-up-external')
  async signUpExternal(@Body() payload: SignUpExternalDto): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.authService.signUpExternal(payload);

    return {
      data: serviceResponse,
      message: 'Por favor inicie sesión',
      title: 'Usuario creado correctamente',
    };
  }

  @ApiOperation({ summary: 'Change Password' })
  @Patch('passwords')
  async changePassword(
    @User() user: UserEntity,
    @Body() payload: PasswordChangedDto,
  ): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.authService.changePassword(user.id, payload);

    return {
      data: serviceResponse,
      message: 'La contraseña fue cambiada',
      title: 'Contraseña Actualizada',
    };
  }

  @Post('transactional-codes')
  async requestTransactionalCode(@User() user: UserEntity): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.authService.requestTransactionalCode(user.id);

    return {
      data: serviceResponse,
      message: `Su código fue enviado a ${serviceResponse}`,
      title: 'Código Enviado',
    };
  }

  @PublicRoute()
  @Get('transactional-codes/:identification/password-reset')
  async requestTransactionalPasswordResetCode(
    @Param('identification') identification: string,
  ): Promise<ResponseHttpInterface> {
    const serviceResponse =
      await this.authService.requestTransactionalPasswordResetCode(identification);

    return {
      data: serviceResponse,
      message: `Su código fue enviado a "${serviceResponse}"`,
      title: 'Código Enviado',
    };
  }

  @PublicRoute()
  @Get('transactional-codes/:email/signup')
  async requestTransactionalSignupCode(
    @Param('email') email: string,
  ): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.authService.requestTransactionalSignupCode(email);

    return {
      data: serviceResponse,
      message: `Su código fue enviado a "${serviceResponse}"`,
      title: 'Código Enviado',
    };
  }

  @PublicRoute()
  @Patch('transactional-codes/:token/verify')
  async verifyTransactionalCode(
    @Param('token') token: string,
    @Body('requester') requester: string,
  ): Promise<ResponseHttpInterface> {
    await this.authService.verifyTransactionalCode(token, requester);

    return {
      data: null,
      message: `Tu identidad ha sido confirmada`,
      title: 'El código ingresado es válido',
    };
  }

  @PublicRoute()
  @Patch('passwords/reset')
  async resetPassword(@Body() payload: PasswordResetDto): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.authService.resetPassword(payload);

    return {
      data: serviceResponse,
      message: `Por favor inicie sesión`,
      title: 'Contraseña Reseteada',
    };
  }

  @PublicRoute()
  @Get(':identification/exist')
  async verifyExistUser(
    @Param('identification') identification: string,
  ): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.authService.verifyExistUser(identification);

    return {
      data: serviceResponse,
      message: `Existe Identificacion`,
      title: 'Existe',
    };
  }

  @PublicRoute()
  @Get(':email/email-exist')
  async verifyExistEmail(@Param('email') email: string): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.authService.verifyExistEmail(email);

    return {
      data: serviceResponse,
      message: `Existe Identificacion`,
      title: 'Existe',
    };
  }

  @PublicRoute()
  @Get(':identification/registered')
  async verifyRegisteredUser(
    @Param('identification') identification: string,
  ): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.authService.verifyRegisteredUser(identification);

    return {
      data: serviceResponse.data,
      message: `Usuario registrado`,
      title: 'Usuario registrado',
    };
  }

  @PublicRoute()
  @Get(':identification/updated')
  async verifyUpdatedUser(
    @Param('identification') identification: string,
    @Query('userId') userId: string,
  ): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.authService.verifyUpdatedUser(identification, userId);

    return {
      data: serviceResponse,
      message: `Usuario registrado`,
      title: 'Usuario registrado',
    };
  }

  @Post('security-questions')
  async createSecurityQuestions(
    @User() user: UserEntity,
    @Body() payload: CreateSecurityQuestionDto,
  ): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.authService.createSecurityQuestions(user.id, payload);

    return {
      data: serviceResponse,
      message: `Creadas correctamente`,
      title: 'Preguntas de seguridad',
    };
  }

  @PublicRoute()
  @Patch(':userId/security-questions/verify')
  async verifySecurityQuestionsAndResetEmail(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() payload: EmailResetSecurityQuestionDto,
  ): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.authService.verifySecurityQuestionsAndResetEmail(
      userId,
      payload,
    );

    return {
      data: serviceResponse,
      message: `Correo Actualizado correctamente`,
      title: 'Actualizado',
    };
  }

  @PublicRoute()
  @Post('verify-email')
  async verifyEmail(@Body('token') token: string): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.authService.verifyEmail(token);

    return {
      data: serviceResponse,
      message: `Correo Verificado`,
      title: 'Verificado',
    };
  }

  @PublicRoute()
  @Post('request-verify-email')
  async requestVerifyEmail(@Body('username') username: string): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.authService.requestVerifyEmail(username);

    return {
      data: serviceResponse,
      message: `Revise su correo asociado`,
      title: 'Solicitud Recibida',
    };
  }

  @Patch('terms-conditions/accept')
  async acceptTerms(
    @User() user: UserEntity,
    @Body() payload: TermsDto,
  ): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.authService.acceptTerms(user.id, payload);

    return {
      data: serviceResponse,
      message: `Existe Identificacion`,
      title: 'Existe',
    };
  }
}
