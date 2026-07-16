import { Module } from '@nestjs/common';
import { PaymentGatewayModule } from '../paymentGateway/payment-gateway.module';
import { SalesBookingPaymentController } from './controller/sales-booking-payment.controller';
import { SalesBookingPaymentService } from './service/sales-booking-payment.service';
import { SalesBookingCardPaymentRepository } from './repository/sales-booking-card-payment.repository';

// Will also need to import SalesBookingModule once
// SalesBookingPaymentService.recordDeposit calls a real Salesforce endpoint.
@Module({
  imports: [PaymentGatewayModule],
  controllers: [SalesBookingPaymentController],
  providers: [SalesBookingPaymentService, SalesBookingCardPaymentRepository],
})
export class SalesBookingPaymentModule {}
