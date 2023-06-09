import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from '~/config/configuration';
import { AuthModule } from '~/module/common/auth/auth.module';
import { UsersModule } from '~/module/common/users/user.module';
import { JwtModule } from '@nestjs/jwt';
import { TableModule } from '~/module/private/tables/table.module';
import { ReservationModule } from '~/module/private/reservations/reservation.module';
import { GatewayModule } from '~/gateway/gateway.module';
import { SatisgiModule } from '~/module/private/satisgi/satisgi.module';
import { ProductModule } from '~/module/private/products/product.module';
import { UploadModule } from '~/module/private/uploads/upload.module';
import { CategoryModule } from '~/module/private/categories/category.module';
import { OrdersModule } from './module/private/orders/orders.module';
import { AppController } from './app.controller';
import { PaymentModule } from './module/private/payment/payment.module';
import { MomoModule } from './module/common/momo/momo.module';
import { AnalysisModule } from './module/private/analysis/analysis.module';
import { ReviewsModule } from './module/private/reviews/reviews.module';
import { CloudinaryModule } from './module/private/cloudinary/cloudinary.module';
import { MailModule } from './module/private/mail/mail.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { ReminderModule } from './module/private/reminder/reminder.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: () => {
        return {};
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    GatewayModule,
    MongooseModule.forRoot(process.env.DATABASE_CONNECTION),
    SatisgiModule,
    ProductModule,
    UploadModule,
    TableModule,
    CategoryModule,
    ReservationModule,
    AnalysisModule,
    OrdersModule,
    PaymentModule,
    MomoModule,
    ReviewsModule,
    CloudinaryModule,
    MailModule,
    MailerModule.forRoot({
      transport: 'smtps://user@domain.com:pass@smtp.domain.com',
      template: {
        dir: process.cwd() + '/src/module/private/mail/templates/',
        adapter: new EjsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    ReminderModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
