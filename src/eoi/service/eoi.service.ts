/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import type { User } from '@prisma/client';
import { EoiRepository } from '../repository/eoi.repository';
import { CreateEoiApexPayload } from '../../salesforce/modules/eoi/types/create-eoi.type';
import { EoiRecord } from '../../salesforce/modules/eoi/types/get-eois.type';
import { CreateEoiDto } from '../dto/create-eoi.dto';
import { CreateEoiResultDto } from '../dto/create-eoi-result.dto';
import { EoiDetailDto } from '../dto/get-eois.dto';
import { CreateModeOfPaymentApexPayload } from '../../salesforce/modules/eoi/types/create-mode-of-payment.type';
import { CreateModeOfPaymentDto } from '../dto/create-mode-of-payment.dto';
import { CreateModeOfPaymentResultDto } from '../dto/create-mode-of-payment-result.dto';
import { ModeOfPaymentDto } from '../dto/mode-of-payment.dto';
import { ResultWithMessage } from '../../common/interfaces/result-with-message.interface';
import { PaginatedResultWithMessage } from '../../common/interfaces/paginated-result-with-message.interface';
import { paginate } from '../../common/utils/paginate.util';
import {
  required,
  unauthorizedException,
} from '../../common/utils/validators.util';
import { SalesforceClient } from '../../salesforce/network/salesforce.client';

@Injectable()
export class EoiService {
  constructor(
    private readonly eoiRepository: EoiRepository,
    private readonly salesforceClient: SalesforceClient,
  ) {}

  /**
   * Builds the Salesforce `createEOI` payload from the client DTO and submits it.
   *
   * @param user - Authenticated user.
   * @param dto - New EOI's details, including buyer info and unit preferences.
   * @returns The created record/lead/account ids wrapped in a `{ message, data }` envelope.
   */
  async createEoi(
    user: User,
    dto: CreateEoiDto,
  ): Promise<ResultWithMessage<CreateEoiResultDto>> {
    unauthorizedException(!!user, 'Unauthorized');

    const response = await this.eoiRepository.createEoi(
      this.toApexPayload(dto),
    );

    return {
      message: response.message,
      data: {
        recordId: response.recordId,
        leadId: response.leadId,
        accountId: response.AccountId,
      },
    };
  }

  /**
   * Fetches every EOI owned by the Salesforce user our client-credentials grant
   * authenticates as, maps them to `EoiDetailDto`, and returns the requested page.
   *
   * @param user - Authenticated user.
   * @param pageNumber - 1-based page number. Defaults to 1.
   * @param pageSize - Page size. Defaults to 10.
   * @returns The requested page of the user's EOIs, with pagination metadata alongside `message`.
   */
  async getEoisByUser(
    user: User,
    pageNumber?: string,
    pageSize?: string,
  ): Promise<PaginatedResultWithMessage<EoiDetailDto[]>> {
    unauthorizedException(!!user, 'Unauthorized');

    const userId = await this.salesforceClient.getUserId();
    const response = await this.eoiRepository.getEoisByUser(userId);
    const paged = paginate(response.eoiDetails, pageNumber, pageSize);

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
      data: paged.items.map((eoi) => this.toEoiDetailDto(eoi)),
    };
  }

  /**
   * Maps a raw Salesforce `EoiRecord` into the API's `EoiDetailDto` shape.
   *
   * @param eoi - Raw EOI record returned by the Salesforce Apex REST endpoint.
   * @returns The EOI shaped for API consumers, dropping internal Salesforce metadata.
   */
  private toEoiDetailDto(eoi: EoiRecord): EoiDetailDto {
    return {
      id: eoi.Id,
      name: eoi.Name,
      referenceNo: eoi.EOI_Reference_No__c,
      status: eoi.Status__c,
      projectId: eoi.Project__c,
      projectName: eoi.Project_Name1__c,
      buyerName: eoi.Buyer_Name__c,
      actualName: eoi.ActualName__c,
      firstName: eoi.First_Name__c,
      lastName: eoi.Last_Name__c,
      mobile: eoi.Mobile__c,
      eidNo: eoi.EID_No__c,
      agentFirstName: eoi.Agent_FirstName,
      agentLastName: eoi.Agent_LastName,
      buyerType: eoi.Buyer_Type__c,
      bookingType: eoi.Booking_Type__c,
      companyName: eoi.Company_Name__c,
      companyRegistrationPlace: eoi.Company_Registration_Place__c,
      companyRegistrationDate: eoi.Company_Registration_Date__c,
      tradeLicenseNo: eoi.Trade_License_No__c,
      tradeLicenseExpiryDate: eoi.Trade_License_Expiry_Date__c,
      email: eoi.Email_Address__c,
      address: eoi.First_Applicant_Address__c,
      country: eoi.Country__c,
      city: eoi.City__c,
      postalCode: eoi.Postal_Code__c,
      currency: eoi.Currency__c,
      totalDepositAmount: eoi.Total_Deposit_Amount__c,
      unallocatedAmount: eoi.Unallocated_Amount__c,
      token: eoi.Token__c,
      isConverted: eoi.Converted__c,
      leadId: eoi.Lead__c ?? null,
      accountId: eoi.Account__c ?? null,
      ownerId: eoi.OwnerId,
      createdDate: eoi.CreatedDate,
      lastModifiedDate: eoi.LastModifiedDate,
    };
  }

  /**
   * Maps the client DTO into the shape expected by the Salesforce `createEOI` Apex REST endpoint.
   *
   * @param dto - New EOI's details submitted by the client.
   * @returns The Salesforce-shaped payload.
   */
  private toApexPayload(dto: CreateEoiDto): CreateEoiApexPayload {
    return {
      Project_Id: dto.projectId,
      countryCode: dto.countryCode,
      countryOfResident: dto.countryOfResident,
      email: dto.email,
      firstName: dto.firstName,
      middleName: dto.middleName,
      lastName: dto.lastName,
      mobilePhone: dto.mobilePhone,
      leadSource: dto.leadSource,
      recordTypeDeveloperName: dto.recordTypeDeveloperName,
      preferences: dto.preferences.map((preference) => ({
        unitPrefernce: preference.unitPrefernce,
        noOfUnits: preference.noOfUnits,
        eoiAmount: preference.eoiAmount,
      })),
      city: dto.city,
      country: dto.country,
      nationality: dto.nationality,
      passportExpiry: dto.passportExpiry,
      eidNo: dto.eidNo,
      emiratesExpiry: dto.emiratesExpiry,
      firstApplicantAddress: dto.firstApplicantAddress,
      postalCode: dto.postalCode,
    };
  }

  /**
   * Records one or more mode-of-payment entries against an EOI.
   *
   * @param user - Authenticated user.
   * @param eoiId - Salesforce EOI id, taken from the route path.
   * @param dto - Mode-of-payment entries submitted by the client.
   * @throws {BadRequestException} When `eoiId` is missing or blank.
   * @returns The created record id wrapped in a `{ message, data }` envelope.
   */
  async createModeOfPayment(
    user: User,
    eoiId: string,
    dto: CreateModeOfPaymentDto,
  ): Promise<ResultWithMessage<CreateModeOfPaymentResultDto>> {
    unauthorizedException(!!user, 'Unauthorized');
    required(eoiId, 'eoiId');

    const response = await this.eoiRepository.createModeOfPayment(
      this.toModeOfPaymentApexPayload(eoiId, dto),
    );

    return {
      message: response.message,
      data: { recordId: response.recordId },
    };
  }

  /**
   * Maps the client DTO into the shape expected by the Salesforce `modeofpayments` Apex REST endpoint.
   *
   * @param eoiId - Salesforce EOI id.
   * @param dto - Mode-of-payment entries submitted by the client.
   * @returns The Salesforce-shaped payload.
   */
  private toModeOfPaymentApexPayload(
    eoiId: string,
    dto: CreateModeOfPaymentDto,
  ): CreateModeOfPaymentApexPayload {
    return {
      eoiId,
      modeOfPayments: dto.modeOfPayments.map((payment: ModeOfPaymentDto) => ({
        payment_Mode: payment.paymentMode,
        currencyType: payment.currencyType,
        depositAmount: payment.depositAmount,
        bankName: payment.bankName ?? null,
        transactionDate: payment.transactionDate ?? null,
        transactionNo: payment.transactionNo ?? null,
        chequeNumber: payment.chequeNumber ?? null,
        chequeDate: payment.chequeDate ?? null,
        thirdPartyCheque: payment.thirdPartyCheque,
      })),
    };
  }
}
