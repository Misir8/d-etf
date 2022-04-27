import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { WyreModule } from './wyre/wyre.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot(),
    MailerModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        return {
          transport: {
            pool: true,
            host: config.get('SMTP_HOST'),
            port: config.get('SMTP_PORT'),
            // ignoreTLS: config.get('SMTP_TLS'),
            // secure: config.get('SMTP_SECURE'),
            auth: {
              user: config.get('SMTP_USER'),
              pass: config.get('SMTP_PASS'),
            },
            tls: {
              rejectUnauthorized: true,
            },
          },
          template: {
            dir: __dirname + './mail/template',
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    WyreModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
