/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import type { User } from '@prisma/client';
import { SalesBookingRepository } from '../repository/sales-booking.repository';
import {
  SalesBookingBuyer,
  SalesBookingRecord,
} from '../../salesforce/modules/salesBooking/types/get-sales-booking.type';
import {
  SalesBookingBuyerDto,
  SalesBookingDto,
} from '../dto/get-sales-booking.dto';
import { PaginatedResultWithMessage } from '../../common/interfaces/paginated-result-with-message.interface';
import { paginate } from '../../common/utils/paginate.util';
import { unauthorizedException } from '../../common/utils/validators.util';
import { SalesforceClient } from '../../salesforce/network/salesforce.client';

@Injectable()
export class SalesBookingService {
  constructor(
    private readonly salesBookingRepository: SalesBookingRepository,
    private readonly salesforceClient: SalesforceClient,
  ) {}

  /**
   * Fetches every sales booking owned by the Salesforce user our client-credentials grant
   * authenticates as, maps them to `SalesBookingDto`, and returns the requested page.
   *
   * @param user - Authenticated user.
   * @param pageNumber - 1-based page number. Defaults to 1.
   * @param pageSize - Page size. Defaults to 10.
   * @returns The requested page of the user's sales bookings, with pagination metadata alongside `message`.
   */
  async getAllSalesBookings(
    user: User,
    pageNumber?: string,
    pageSize?: string,
  ): Promise<PaginatedResultWithMessage<SalesBookingDto[]>> {
    unauthorizedException(!!user, 'Unauthorized');

    const userId = await this.salesforceClient.getUserId();
    const response =
      await this.salesBookingRepository.getAllSalesBookings(userId);
    const paged = paginate(response.data, pageNumber, pageSize);

    return {
      message: response.message,
      pagination: {
        pageNumber: paged.pageNumber,
        pageSize: paged.pageSize,
        total: paged.total,
        totalPages: paged.totalPages,
        hasNext: paged.hasNext,
        hasPrevious: paged.hasPrevious,
      },
      data: paged.items.map((booking) => this.toSalesBookingDto(booking)),
    };
  }

  /**
   * Maps a raw Salesforce `SalesBookingRecord` into the API's `SalesBookingDto` shape.
   *
   * @param booking - Raw sales booking record returned by the Salesforce Apex REST endpoint.
   * @returns The sales booking shaped for API consumers.
   */
  private toSalesBookingDto(booking: SalesBookingRecord): SalesBookingDto {
    return {
      id: booking.salesBookingId,
      tokenAmount: booking.tokenAmount,
      signedRaFormUploaded: booking.SignedRAformUploaded,
      sellingPrice:
        booking.sellingPrice !== null ? Number(booking.sellingPrice) : null,
      secondaryBuyers: booking.secondaryBuyers.map((buyer) =>
        this.toBuyerDto(buyer),
      ),
      primaryBuyers: booking.primaryBuyers.map((buyer) =>
        this.toBuyerDto(buyer),
      ),
      paymentPlan: booking.paymentPlan
        ? {
            id: booking.paymentPlan.paymentPlanId,
            lineItems: booking.paymentPlan.lineItems,
          }
        : null,
      opportunityName: booking.opportunityName,
      modeOfPayment: booking.modeOfPayment,
      leadId: booking.leadId,
      isSpaSigned: booking.isSPASigned,
      isSpaFormSent: booking.isSPAFormSent,
      isRaFormSent: booking.isRAFormSent,
      isRaFormGenerated: booking.isRAFormgenerated,
      isKycConfirmed: booking.isKYCConfirm,
      isAmlConfirmed: booking.isAMLConfirmed,
      inventoryData: booking.inventoryData
        ? {
            unitPrice: booking.inventoryData.unitPrice,
            unitName: booking.inventoryData.unitName,
            projectName: booking.inventoryData.projectName,
            projectId: booking.inventoryData.projectId,
            inventoryId: booking.inventoryData.inventoryId,
            buildingId: booking.inventoryData.buildingId,
          }
        : null,
      documents: booking.documents,
      dealType: booking.dealType,
      dealStatus: booking.dealStatus,
      createdDate: booking.createdDate,
      commissions: booking.comissions,
      bookingDate: booking.bookingDate,
    };
  }

  /**
   * Maps a raw Salesforce buyer record into the API's `SalesBookingBuyerDto` shape.
   *
   * @param buyer - Raw buyer record returned by the Salesforce Apex REST endpoint.
   * @returns The buyer shaped for API consumers.
   */
  private toBuyerDto(buyer: SalesBookingBuyer): SalesBookingBuyerDto {
    return {
      tradeLicenseNumber: buyer.tradeLicenseNumber,
      remarks: buyer.remarks,
      ownershipPercentage: buyer.ownershipPercentage,
      nationality: buyer.nationality,
      nationalId: buyer.nationalId,
      nationalExpiryDate: buyer.nationalExpiryDate,
      mobileCountryCode: buyer.mobileCountryCode,
      mobile: buyer.mobile,
      middleName: buyer.MiddleName,
      leadId: buyer.leadId,
      lastName: buyer.lastName,
      fullNameEmiratesId: buyer.fullnameEmiratesId,
      firstName: buyer.firstName,
      eoiId: buyer.eoiId,
      emiratesIdExpiryDate: buyer.emiratesIdExpiryDate,
      emiratesId: buyer.emiratesId,
      email: buyer.email,
      documents: buyer.documents,
      dateOfBirth: buyer.dateOfBirth,
      countryOfResidence: buyer.countryOfResidence,
      countryOfRegistration: buyer.countryOfRegistration,
      companyRegistrationPlace: buyer.companyRegistrationPlace,
      companyRegistrationDate: buyer.companyRegistrationDate,
      companyName: buyer.companyName,
      companyEmail: buyer.companyEmail,
      companyTradeLicenseRegistrationType:
        buyer.Company_Trade_License_Registration_Type,
      city: buyer.city,
      buyerType: buyer.buyerType,
      authorizedPersonName: buyer.authorizedPersonName,
      authorizedPersonDesignation: buyer.authorizedPersonDesignation,
      address: buyer.address,
      accountId: buyer.accountId,
    };
  }
}
