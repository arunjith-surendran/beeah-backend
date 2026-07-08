import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { LeadModule } from './lead/lead.module';
import { EoiModule } from './eoi/eoi.module';
import { ProjectModule } from './project/project.module';
import { UnitsModule } from './units/units.module';
import { CommissionModule } from './commission/commission.module';
import { CreateNewAccountModule } from './createNewAccount/create-new-account.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SalesBookingModule } from './salesBooking/sales-booking.module';
import { PaymentPlanModule } from './paymentPlan/payment-plan.module';
import { SalesOfferModule } from './salesOffer/sales-offer.module';
import { DocumentModule } from './document/document.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    AuthModule,
    LeadModule,
    EoiModule,
    ProjectModule,
    UnitsModule,
    CommissionModule,
    CreateNewAccountModule,
    DashboardModule,
    SalesBookingModule,
    PaymentPlanModule,
    SalesOfferModule,
    DocumentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
