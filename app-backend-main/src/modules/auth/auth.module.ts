import { Global, Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { envConfig } from '@config';
import { AuthController, RolesController, UsersController } from '@auth/controllers';
import { authProviders } from '@auth/providers';
import { DatabaseModule } from '@database/database.module';
import { MenusController } from './controllers/menus.controller';
import { UsersService } from './services/users.service';
import { JwtStrategy } from '@auth/strategies';
import { APP_GUARD } from '@nestjs/core';
import { AccountGuard, JwtGuard } from '@auth/guards';
import { MailModule } from '@modules/common/mail/mail.module';
import { AuthService } from '@auth/services/auth.service';
import { RolesService } from '@auth/services/roles.service';
import { MenusService } from '@auth/services/menus.service';
import { coreProviders } from '@modules/core/core.provider';
import { HttpModule } from '@nestjs/axios';
import { RefreshJwtStrategy } from '@auth/strategies/refresh-jwt.strategy';
import { CataloguesService } from '@modules/common/catalogue/catalogue.service';
import { CacheModule } from '@nestjs/cache-manager';

@Global()
@Module({
  imports: [
    CacheModule.register(),
    HttpModule,
    DatabaseModule,
    MailModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [envConfig.KEY],
      useFactory: (configService: ConfigType<typeof envConfig>) => {
        return {
          secret: configService.jwt.secret,
          signOptions: {
            expiresIn: configService.jwt.expires,
          },
        };
      },
    }),
  ],
  controllers: [AuthController, MenusController, RolesController, UsersController],
  providers: [
    JwtStrategy,
    RefreshJwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AccountGuard,
    },
    ...authProviders,
    ...coreProviders,
    AuthService,
    RolesService,
    UsersService,
    MenusService,
    CataloguesService,
  ],
  exports: [...authProviders, UsersService, RolesService, MenusService, JwtModule, PassportModule],
})
export class AuthModule {}
