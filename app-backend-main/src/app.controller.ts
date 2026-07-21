import { Controller, Get, Inject, Post } from '@nestjs/common';
import { ResponseHttpInterface } from '@utils/interfaces';
import { DatabaseSeeder } from '@database/seeders';
import { PublicRoute } from '@auth/decorators';
import { envConfig } from '@config';
import { ConfigType } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(
    private readonly databaseSeeder: DatabaseSeeder,
    @Inject(envConfig.KEY) private configService: ConfigType<typeof envConfig>,
  ) {}

  @PublicRoute()
  @Post('init')
  async init(): Promise<ResponseHttpInterface> {
    if (this.configService.app.env === 'local') {
      await this.databaseSeeder.run();

      return {
        data: true,
        message: 'La base de datos fue precargada',
        title: 'Base de datos inicializada',
      };
    }

    return {
      data: true,
      message: 'Se encuentra en ambiente de producción',
      title: 'No es posible procesar su solicitud',
    };
  }

  @PublicRoute()
  @Get('greet')
  greetPublic() {
    return {
      data: 'Hello World',
      message: 'Hello World',
      title: 'Hello World',
    };
  }

  @Get('greet-private')
  greetPrivate() {
    return {
      data: 'Hello World Private',
      message: 'Hello World Private',
      title: 'Hello World Private',
    };
  }
}
