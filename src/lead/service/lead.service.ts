import { Injectable } from '@nestjs/common';
import type { User } from '@prisma/client';
import { LeadRepository } from '../repository/lead.repository';
import { LeadRecord } from '../../salesforce/modules/lead/types/get-leads.type';
import { ResultWithMessage } from '../../common/interfaces/result-with-message.interface';
import { PaginatedResultWithMessage } from '../../common/interfaces/paginated-result-with-message.interface';
import { paginate } from '../../common/utils/paginate.util';
import { unauthorizedException } from '../../common/utils/validators.util';
import { SalesforceClient } from '../../salesforce/network/salesforce.client';
import { CreateLeadDto, CreateLeadResponseDto } from '../dto/create-lead.dto';
import { LeadDetailDto } from '../dto/get-leads.dto';

@Injectable()
export class LeadService {
  constructor(
    private readonly leadRepository: LeadRepository,
    private readonly salesforceClient: SalesforceClient,
  ) {}

  /**
   * Builds the Salesforce lead payload from the client DTO and submits it. The interested
   * project is optional, matching the real Salesforce broker portal's lead-creation form.
   *
   * @param user - Authenticated user.
   * @param dto - Lead details submitted by the client.
   * @returns The created lead id wrapped in a `{ message, data }` envelope.
   */
  async createLead(
    user: User,
    dto: CreateLeadDto,
  ): Promise<ResultWithMessage<CreateLeadResponseDto>> {
    unauthorizedException(!!user, 'Unauthorized');

    const response = await this.leadRepository.createLead({
      interestedProject: dto.projectId,
      countryCode: dto.countryCode,
      countryOfResident: dto.countryOfResident,
      email: dto.email,
      firstName: dto.firstName,
      middleName: dto.middleName,
      lastName: dto.lastName,
      mobilePhone: dto.mobilePhone,
      recordTypeDeveloperName: dto.recordTypeDeveloperName,
      createdByPortalUser: dto.createdByPortalUser,
      company: dto.company,
      interestedPropertyType: dto.interestedPropertyType,
      noOfBedroom: dto.noOfBedroom,
      preferredLanguage: dto.preferredLanguage,
      budgetRange: dto.budgetRange,
      description: dto.description,
    });

    return {
      message: response.message,
      data: { leadId: response.leadId },
    };
  }

  /**
   * Fetches every lead owned by the Salesforce user our client-credentials grant
   * authenticates as, maps them to `LeadDetailDto`, and returns the requested page.
   *
   * @param user - Authenticated user.
   * @param pageNumber - 1-based page number. Defaults to 1.
   * @param pageSize - Page size. Defaults to 10.
   * @returns The requested page of the user's leads wrapped in a `{ message, data }` envelope.
   */
  async getLeadsByUser(
    user: User,
    pageNumber?: string,
    pageSize?: string,
  ): Promise<PaginatedResultWithMessage<LeadDetailDto[]>> {
    unauthorizedException(!!user, 'Unauthorized');

    const userId = await this.salesforceClient.getUserId();
    const response = await this.leadRepository.getLeadsByUser(userId);
    const paged = paginate(response.LeadDetails, pageNumber, pageSize);

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
      data: paged.items.map((lead) => this.toLeadDetailDto(lead)),
    };
  }

  /**
   * Maps a raw Salesforce `LeadRecord` into the API's `LeadDetailDto` shape.
   *
   * @param lead - Raw lead record returned by the Salesforce Apex REST endpoint.
   * @returns The lead shaped for API consumers, dropping internal Salesforce metadata.
   */
  private toLeadDetailDto(lead: LeadRecord): LeadDetailDto {
    return {
      id: lead.Id,
      leadId: lead.Lead_Id__c,
      name: lead.Name,
      firstName: lead.FirstName,
      lastName: lead.LastName,
      email: lead.Email,
      mobilePhone: lead.MobilePhone,
      mobileCountryCode: lead.Mobile_Country_Code__c,
      status: lead.Status,
      leadSource: lead.LeadSource,
      ownerId: lead.OwnerId,
      ownerName: lead.Owner_Name__c,
      accountId: lead.Account__c,
      displayProject: lead.Display_Project__c,
      currencyIsoCode: lead.CurrencyIsoCode,
      photoUrl: lead.PhotoUrl,
      isConverted: lead.IsConverted,
      createdDate: lead.CreatedDate,
      lastModifiedDate: lead.LastModifiedDate,
      assignedDate: lead.Assigned_Date__c,
    };
  }
}
