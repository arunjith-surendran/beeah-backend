/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import { CreateNewAccountRepository } from '../repository/create-new-account.repository';
import {
  BankDetailsPayload,
  CreateNewAccountPayload,
  OnboardingDetailsPayload,
  OnboardingDocumentPayload,
} from '../../salesforce/modules/createNewAccount/types/create-new-account.type';
import { ResultWithMessage } from '../../common/interfaces/result-with-message.interface';
import { CreateNewAccountDto } from '../dto/create-new-account.dto';
import { OnboardingDetailsDto } from '../dto/onboarding-details.dto';
import { BankDetailsDto } from '../dto/bank-details.dto';
import { OnboardingDocumentDto } from '../dto/onboarding-document.dto';
import { CreateNewAccountResultDto } from '../dto/create-new-account-result.dto';
import { GetRequiredDocumentsDto } from '../dto/get-required-documents.dto';
import { RequiredDocumentDto } from '../dto/required-document.dto';
import { AgencySubType } from '../dto/agency-sub-type.enum';
import { AgencyCategory } from '../dto/agency-category.enum';
import { AgencySubTypeGroupDto } from '../dto/agency-sub-type-group.dto';

const AGENCY_SUB_TYPES_BY_CATEGORY: Record<AgencyCategory, AgencySubType[]> = {
  [AgencyCategory.Company]: [
    AgencySubType.UaeAgency,
    AgencySubType.InternationalAgency,
  ],
  [AgencyCategory.Individual]: [AgencySubType.SelfLicensedResidence],
};

@Injectable()
export class CreateNewAccountService {
  constructor(
    private readonly createNewAccountRepository: CreateNewAccountRepository,
  ) {}

  /**
   * Builds the Salesforce onboarding payload from the client DTO and submits it.
   *
   * @param dto - Onboarding, bank, and document details submitted by the client.
   * @returns The created onboarding and bank record ids wrapped in a `{ message, data }` envelope.
   */
  async createNewAccount(
    dto: CreateNewAccountDto,
  ): Promise<ResultWithMessage<CreateNewAccountResultDto>> {
    const response = await this.createNewAccountRepository.createNewAccount(
      this.toSalesforcePayload(dto),
    );

    return {
      message: response.message,
      data: {
        onboardingId: response.onboardingId,
        bankId: response.bankId,
      },
    };
  }

  /**
   * Maps the client DTO into the onboarding/bank/document payload shape expected by the Apex REST endpoint.
   *
   * @param dto - Onboarding, bank, and document details submitted by the client.
   * @returns The Salesforce-shaped payload.
   */
  private toSalesforcePayload(
    dto: CreateNewAccountDto,
  ): CreateNewAccountPayload {
    return {
      onboarding: this.toOnboardingPayload(dto.onboarding),
      bank: this.toBankPayload(dto.bank),
      documents: dto.documents.map((doc) => this.toDocumentPayload(doc)),
    };
  }

  private toOnboardingPayload(
    onboarding: OnboardingDetailsDto,
  ): OnboardingDetailsPayload {
    return {
      SubType: onboarding.subType,
      AgencyName: onboarding.agencyName,
      Email: onboarding.email,
      Phone: onboarding.phone,
      Type: onboarding.type,
      Role: onboarding.role,
      PoBox: onboarding.poBox,
      OwnerShipType: onboarding.ownerShipType,
      CompanyReraRegistrationNumber: onboarding.companyReraRegistrationNumber,
      CompanyReraExpiry: onboarding.companyReraExpiry,
      AuthorizedWith: onboarding.authorizedWith,
      HaveTrn: onboarding.haveTrn,
      AuthorizedSignatoryEmail: onboarding.authorizedSignatoryEmail,
      AuthorizedSignatoryMobile: onboarding.authorizedSignatoryMobile,
      AuthorizedSignatoryCountryCode: onboarding.authorizedSignatoryCountryCode,
      AddressLine1: onboarding.addressLine1,
      AddressLine2: onboarding.addressLine2,
      City: onboarding.city,
      Country: onboarding.country,
      TradeLicenseNumber: onboarding.tradeLicenseNumber,
      TradeLicenseExpiry: onboarding.tradeLicenseExpiry,
    };
  }

  private toBankPayload(bank: BankDetailsDto): BankDetailsPayload {
    return {
      BankName: bank.bankName,
      BankAccountName: bank.bankAccountName,
      BankAccountNumber: bank.bankAccountNumber,
      IBANNumber: bank.ibanNumber,
      SwiftCode: bank.swiftCode,
      CurrencyValue: bank.currencyValue,
    };
  }

  private toDocumentPayload(
    doc: OnboardingDocumentDto,
  ): OnboardingDocumentPayload {
    return {
      documentType: doc.documentType,
      fileName: doc.fileName,
      base64Data: doc.base64Data,
      issueDate: doc.issueDate,
      expiryDate: doc.expiryDate,
    };
  }

  /**
   * Fetches the mandatory document checklist for a given agency sub-type.
   *
   * @param dto - The agency sub-type to fetch required documents for.
   * @returns The mandatory document list wrapped in a `{ message, data }` envelope.
   */
  async getRequiredDocuments(
    dto: GetRequiredDocumentsDto,
  ): Promise<ResultWithMessage<RequiredDocumentDto[]>> {
    const response = await this.createNewAccountRepository.getRequiredDocuments(
      { subType: dto.subType },
    );

    return {
      message: response.message,
      data: response.data,
    };
  }

  /**
   * Fetches the valid agency sub-types for every category, for populating the onboarding form.
   *
   * @returns The agency sub-types grouped by category, wrapped in a `{ message, data }` envelope.
   */
  getAgencySubTypes(): Promise<ResultWithMessage<AgencySubTypeGroupDto[]>> {
    const data = Object.values(AgencyCategory).map((category) => ({
      category,
      subTypes: AGENCY_SUB_TYPES_BY_CATEGORY[category],
    }));

    return Promise.resolve({
      message: 'Agency sub types fetched successfully',
      data,
    });
  }
}
