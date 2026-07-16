import { Module } from '@nestjs/common';
import { PaymentGatewayModule } from '../paymentGateway/payment-gateway.module';
import { EoiModule } from '../eoi/eoi.module';
import { EoiPaymentController } from './controller/eoi-payment.controller';
import { EoiPaymentService } from './service/eoi-payment.service';
import { EoiCardPaymentRepository } from './repository/eoi-card-payment.repository';

@Module({
  imports: [PaymentGatewayModule, EoiModule],
  controllers: [EoiPaymentController],
  providers: [EoiPaymentService, EoiCardPaymentRepository],
})
export class EoiPaymentModule {}
