import { Module } from '@nestjs/common';
import { PaymentGatewayService } from './service/payment-gateway.service';
import { NgeniusClient } from './network/ngenius.client';
import { PaymentCallbackController } from './controller/payment-callback.controller';

// Reusable payment gateway - has no idea what an order is for (EOI, Sales
// Booking, or anything else), and never touches a database. Feature modules
// (e.g. EoiPaymentModule) import this, call PaymentGatewayService instead of
// talking to N-Genius directly, and store the result in their own table.
@Module({
  controllers: [PaymentCallbackController],
  providers: [PaymentGatewayService, NgeniusClient],
  exports: [PaymentGatewayService],
})
export class PaymentGatewayModule {}
