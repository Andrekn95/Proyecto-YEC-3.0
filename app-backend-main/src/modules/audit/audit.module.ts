import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuditSubscriber } from '@modules/audit/audit.subscriber';
import { AuditMiddleware } from '@modules/audit/audit.middleware';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [AuditSubscriber],
  exports: [AuditSubscriber],
})
export class AuditModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuditMiddleware) // el middleware que quieres aplicar
      .forRoutes('api/v1/:path'); // o puedes poner solo un controlador, por ejemplo: YourController
  }
}
