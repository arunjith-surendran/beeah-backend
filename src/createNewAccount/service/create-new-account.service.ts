/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateNewAccountRepository } from '../repository/create-new-account.repository';
import {
  BankDetailsPayload,
  CompanyInformationPayload,
  CreateNewAccountPayload,
  EmployeePayload,
  LicensePartnerPayload,
  ManagerPayload,
  OnboardingDocumentPayload,
  PersonalDetailsPayload,
  SignatoryDetailsPayload,
} from '../../salesforce/modules/createNewAccount/types/create-new-account.type';
import { ResultWithMessage } from '../../common/interfaces/result-with-message.interface';
import { CreateNewAccountDto } from '../dto/create-new-account.dto';
import { CompanyInformationDto } from '../dto/company-information.dto';
import { SignatoryDetailsDto } from '../dto/signatory-details.dto';
import { PersonalDetailsDto } from '../dto/personal-details.dto';
import { BankDetailsDto } from '../dto/bank-details.dto';
import { LicensePartnerDto } from '../dto/license-partner.dto';
import { ManagerDto } from '../dto/manager.dto';
import { EmployeeDto } from '../dto/employee.dto';
import { OnboardingDocumentDto } from '../dto/onboarding-document.dto';
import { CreateNewAccountResultDto } from '../dto/create-new-account-result.dto';
import { GetRequiredDocumentsDto } from '../dto/get-required-documents.dto';
import { RequiredDocumentDto } from '../dto/required-document.dto';
import { UploadOnboardingDocumentDto } from '../dto/upload-onboarding-document.dto';
import { UploadOnboardingDocumentResultDto } from '../dto/upload-onboarding-document-result.dto';
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
   * @param dto - Company or personal, bank, and document details submitted by the client.
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
        documentIds: dto.documents.map((doc) => doc.documentId),
      },
    };
  }

  /**
   * Maps the client DTO into the payload shape expected by the Apex REST endpoint.
   *
   * Company registrations send `companyInformation` (+ `signatoryDetails`, and optionally
   * `managers`/`employees`); individual (self-licensed) registrations send `personalDetails`
   * instead - exactly one of the two shapes must be present. Field names are otherwise passed
   * through as-is (camelCase): a direct Salesforce Apex REST call confirmed the endpoint expects
   * that same shape, not a renamed/PascalCase one.
   *
   * @param dto - Company or personal, bank, license partner, and document details submitted by the client.
   * @returns The Salesforce-shaped payload.
   */
  private toSalesforcePayload(
    dto: CreateNewAccountDto,
  ): CreateNewAccountPayload {
    this.assertExactlyOneRegistrationType(dto);

    return {
      companyInformation: dto.companyInformation
        ? this.toCompanyInformationPayload(dto.companyInformation)
        : undefined,
      signatoryDetails: dto.signatoryDetails
        ? this.toSignatoryDetailsPayload(dto.signatoryDetails)
        : undefined,
      personalDetails: dto.personalDetails
        ? this.toPersonalDetailsPayload(dto.personalDetails)
        : undefined,
      bankInfo: this.toBankPayload(dto.bankInfo),
      licensePartners: dto.licensePartners?.map((partner) =>
        this.toLicensePartnerPayload(partner),
      ),
      managers: dto.managers?.map((manager) => this.toManagerPayload(manager)),
      employees: dto.employees?.map((employee) =>
        this.toEmployeePayload(employee),
      ),
      documents: dto.documents.map((doc) => this.toDocumentPayload(doc)),
    };
  }

  /**
   * Ensures the client submitted exactly one of `companyInformation` (company) or
   * `personalDetails` (individual) - the two shapes have no required fields in common,
   * so allowing both or neither would silently produce an incomplete Salesforce payload.
   */
  private assertExactlyOneRegistrationType(dto: CreateNewAccountDto): void {
    if (!dto.companyInformation === !dto.personalDetails) {
      throw new BadRequestException(
        'Provide exactly one of "companyInformation" (company) or "personalDetails" (individual).',
      );
    }
  }

  private toCompanyInformationPayload(
    companyInformation: CompanyInformationDto,
  ): CompanyInformationPayload {
    return {
      subtype: companyInformation.subtype,
      type: companyInformation.type,
      agencyName: companyInformation.agencyName,
      tradeLicenseNumber: companyInformation.tradeLicenseNumber,
      tradeLicenseExpiry: companyInformation.tradeLicenseExpiry,
      email: companyInformation.email,
      phone: companyInformation.phone,
      addressLine1: companyInformation.addressLine1,
      addressLine2: companyInformation.addressLine2,
      country: companyInformation.country,
      city: companyInformation.city,
      poBox: companyInformation.poBox,
      authorityRegisteredWith: companyInformation.authorityRegisteredWith,
      brokerLicenseNumber: companyInformation.brokerLicenseNumber,
      brokerLicenseExpiry: companyInformation.brokerLicenseExpiry,
      haveTrn: companyInformation.haveTrn,
      trnNumber: companyInformation.trnNumber,
      ownerShipType: companyInformation.ownerShipType,
    };
  }

  private toSignatoryDetailsPayload(
    signatoryDetails: SignatoryDetailsDto,
  ): SignatoryDetailsPayload {
    return {
      firstName: signatoryDetails.firstName,
      lastName: signatoryDetails.lastName,
      nationality: signatoryDetails.nationality,
      passportNumber: signatoryDetails.passportNumber,
      passportExpiry: signatoryDetails.passportExpiry,
      emiratesId: signatoryDetails.emiratesId,
      eidExpiry: signatoryDetails.eidExpiry,
      authorizedSignatoryCountryCode:
        signatoryDetails.authorizedSignatoryCountryCode,
      authorizedSignatoryMobile: signatoryDetails.authorizedSignatoryMobile,
      authorizedSignatoryEmail: signatoryDetails.authorizedSignatoryEmail,
      role: signatoryDetails.role,
      srerdNumber: signatoryDetails.srerdNumber,
      brokerCardDetails: signatoryDetails.brokerCardDetails,
      srerdExpiry: signatoryDetails.srerdExpiry,
    };
  }

  private toPersonalDetailsPayload(
    personalDetails: PersonalDetailsDto,
  ): PersonalDetailsPayload {
    return {
      type: personalDetails.type,
      subType: personalDetails.subType,
      firstName: personalDetails.firstName,
      lastName: personalDetails.lastName,
      nationality: personalDetails.nationality,
      passportNumber: personalDetails.passportNumber,
      passportExpiry: personalDetails.passportExpiry,
      emiratesId: personalDetails.emiratesId,
      eidExpiry: personalDetails.eidExpiry,
      countryCode: personalDetails.countryCode,
      mobile: personalDetails.mobile,
      email: personalDetails.email,
      addressLine1: personalDetails.addressLine1,
      addressLine2: personalDetails.addressLine2,
      country: personalDetails.country,
      city: personalDetails.city,
      poBox: personalDetails.poBox,
      srerdNumber: personalDetails.srerdNumber,
      brokerCardDetails: personalDetails.brokerCardDetails,
      srerdExpiry: personalDetails.srerdExpiry,
    };
  }

  private toLicensePartnerPayload(
    partner: LicensePartnerDto,
  ): LicensePartnerPayload {
    return {
      name: partner.name,
      nationality: partner.nationality,
      emiratesId: partner.emiratesId,
      passportNo: partner.passportNo,
      role: partner.role,
      sharePercentage: partner.sharePercentage,
    };
  }

  private toManagerPayload(manager: ManagerDto): ManagerPayload {
    return {
      name: manager.name,
      nationality: manager.nationality,
      passportNo: manager.passportNo,
      emiratesId: manager.emiratesId,
    };
  }

  private toEmployeePayload(employee: EmployeeDto): EmployeePayload {
    return {
      name: employee.name,
      email: employee.email,
      phoneNumber: employee.phoneNumber,
      employeeId: employee.employeeId,
    };
  }

  private toBankPayload(bank: BankDetailsDto): BankDetailsPayload {
    return {
      bankName: bank.bankName,
      bankAccountName: bank.bankAccountName,
      bankAccountNumber: bank.bankAccountNumber,
      beneficiaryName: bank.beneficiaryName,
      ibanNumber: bank.ibanNumber,
      swiftCode: bank.swiftCode,
      currencyValue: bank.currencyValue,
      bankBranchName: bank.bankBranchName,
      bankAddress: bank.bankAddress,
    };
  }

  private toDocumentPayload(
    doc: OnboardingDocumentDto,
  ): OnboardingDocumentPayload {
    return {
      documentId: doc.documentId,
    };
  }

  /**
   * Uploads a single onboarding document ahead of the final create-new-account
   * submission, via the shared Salesforce `uploadDocument` Apex REST endpoint with
   * no recordId (no Salesforce record exists yet for it to attach to). The returned
   * documentId is referenced in the `documents` array of the create-new-account call
   * that follows.
   *
   * @param dto - File name, base64 content, and document type.
   * @returns The created document id wrapped in a `{ message, data }` envelope.
   */
  async uploadDocument(
    dto: UploadOnboardingDocumentDto,
  ): Promise<ResultWithMessage<UploadOnboardingDocumentResultDto>> {
    const response = await this.createNewAccountRepository.uploadDocument({
      fileName: dto.fileName,
      base64: dto.base64,
      documentType: dto.documentType,
    });

    if (!response.result.success) {
      throw new BadRequestException(
        response.result.errorMessage ?? response.message,
      );
    }

    return {
      message: response.message,
      data: {
        documentId: response.result.documentId,
        azureUrl: response.result.azureUrl,
      },
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
