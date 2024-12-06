import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CustomerModule } from './Customer/Customer.Module';
import { CustomerEntity } from './Customer/Customer.Entity';
import { OrderModule } from './Order/Order.module';
import { ProductModule } from './Product/Product.Module';
import { AuthModule } from './Auth/Auth.Module';
import { AdminModule } from './Admin/Admin.Module';
import { OrderEntity } from './Order/Order.Entity';
import { OrderItemModule } from './OrderItems/OrderItem.Module';
import { OrderItemsEntity } from './OrderItems/OrderItem.Entity';

@Module({
  imports: [
    // EmpModule,
    // UserModule,
    CustomerModule,
    OrderModule,
    ProductModule,
    AuthModule,
    AdminModule,
    OrderItemModule,
    TypeOrmModule.forRootAsync({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.local.env',
          // envFilePath:".prod.env",
        }),
      ],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [CustomerEntity, OrderEntity,OrderItemsEntity,__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get<boolean>('DB_SYNC'),
        // logging: true,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor() {
    console.log('Running');
  }
}
