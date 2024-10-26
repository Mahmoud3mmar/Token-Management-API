import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { OrganizationController } from '../src/organization/organization.controller';
import { OrganizationService } from '../src/organization/organization.service';
import { Organization } from '../src/organization/entities/organization.entity';
import { CreateOrganizationDto } from '../src/organization/dto/create-organization.dto';
import { UserService } from '../src/user/user.service';
import { GetOrganizationDto } from '../src/organization/dto/get-organization.dto';
import { GetOrganizationsPaginatedDto } from 'src/organization/dto/get-all-organizations-paginated.dto';
import { OrganizationResponse, UpdatedOrganizationResponse } from '../src/organization/interfaces/organization.interface';
import { UpdateOrganizationDto } from '../src/organization/dto/update-organization.dto';

describe('OrganizationController', () => {
  let organizationController: OrganizationController;
  let organizationService: OrganizationService;
  
  const mockUserService = {
    // Define mock methods if necessary
  };
  

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationController],
      
      providers: [
        OrganizationService,
        { provide: UserService, useValue: mockUserService }, // Mock UserService
        {
          provide: getModelToken(Organization.name),
          useValue: {}, // Mock the Organization model
        },
      ],
    }).compile();

    organizationController = module.get<OrganizationController>(OrganizationController);
    organizationService = module.get<OrganizationService>(OrganizationService);
  });

  describe('createOrganization', () => {
    it('should create an organization', async () => {
      const createOrgDto: CreateOrganizationDto = {
        name: 'Test Organization',
        description: 'This is a test organization.',
      };

      const mockOrganization: Organization = {
        _id: '1', // Mongoose document _id
        name: createOrgDto.name,
        description: createOrgDto.description,
        organization_members: [], // Add other properties as required by your Organization entity
      } as Organization;

      jest
        .spyOn(organizationService, 'createOrganization')
        .mockResolvedValue(mockOrganization);

      const result = await organizationController.createOrganization(createOrgDto);

      expect(result).toEqual(mockOrganization);
      expect(organizationService.createOrganization).toHaveBeenCalledWith(createOrgDto);
      expect(organizationService.createOrganization).toHaveBeenCalledTimes(1);
    });
  });

  describe('getOrganization', () => {
    it('should return an organization by ID', async () => {
      const organizationId = '1';
      
      // Define a mock organization that matches the GetOrganizationDto structure
      const mockOrganization: GetOrganizationDto = {
        organization_id: organizationId, // Add this property
        name: 'Test Organization',
        description: 'This is a test organization.',
        organization_members: [],
      };
  
      jest
        .spyOn(organizationService, 'getOrganizationById')
        .mockResolvedValue(mockOrganization);
  
      const result = await organizationController.getOrganization(organizationId);
  
      expect(result).toEqual(mockOrganization);
      expect(organizationService.getOrganizationById).toHaveBeenCalledWith(organizationId);
      expect(organizationService.getOrganizationById).toHaveBeenCalledTimes(1);
    });
  
    it('should throw a BadRequestException if the organization is not found', async () => {
      const organizationId = 'invalid-id';
  
      jest
        .spyOn(organizationService, 'getOrganizationById')
        .mockRejectedValue(new BadRequestException('Organization not found'));
  
      await expect(organizationController.getOrganization(organizationId)).rejects.toThrow(BadRequestException);
      expect(organizationService.getOrganizationById).toHaveBeenCalledWith(organizationId);
      expect(organizationService.getOrganizationById).toHaveBeenCalledTimes(1);
    });
  });

  describe('getOrganizations', () => {
    it('should return a paginated list of organizations', async () => {
      const paginationDto: GetOrganizationsPaginatedDto = {
        page: 1,
        limit: 10,
      };

      // Mock response based on OrganizationResponse structure
      const mockOrganizationsResponse: OrganizationResponse = {
        organizations: [
          {
            organization_id: '1',
            name: 'Test Organization 1',
            description: 'This is test organization 1.',
            organization_members: [],
          },
          {
            organization_id: '2',
            name: 'Test Organization 2',
            description: 'This is a test organization 2.',
            organization_members: [],
          },
        ],
        total: 2,
        page: paginationDto.page,
        limit: paginationDto.limit,
      };

      jest
        .spyOn(organizationService, 'findAllOrganizations')
        .mockResolvedValue(mockOrganizationsResponse);

      const result = await organizationController.getOrganizations(paginationDto);

      expect(result).toEqual(mockOrganizationsResponse);
      expect(organizationService.findAllOrganizations).toHaveBeenCalledWith(paginationDto);
      expect(organizationService.findAllOrganizations).toHaveBeenCalledTimes(1);
    });

    it('should throw a BadRequestException if an error occurs', async () => {
      const paginationDto: GetOrganizationsPaginatedDto = {
        page: 1,
        limit: 10,
      };

      jest
        .spyOn(organizationService, 'findAllOrganizations')
        .mockRejectedValue(new BadRequestException('Error fetching organizations'));

      await expect(organizationController.getOrganizations(paginationDto)).rejects.toThrow(BadRequestException);
      expect(organizationService.findAllOrganizations).toHaveBeenCalledWith(paginationDto);
      expect(organizationService.findAllOrganizations).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateOrganization', () => {
    it('should update an organization', async () => {
      const organizationId = '1';
      const updateOrgDto: UpdateOrganizationDto = {
        name: 'Updated Organization',
        description: 'This organization has been updated.',
      };
  
      const mockUpdatedOrganization: UpdatedOrganizationResponse = {
        organization_id: organizationId,
        name: updateOrgDto.name,
        description: updateOrgDto.description,
      };
  
      jest
        .spyOn(organizationService, 'updateOrganization')
        .mockResolvedValue(mockUpdatedOrganization);
  
      const result = await organizationController.updateOrganization(organizationId, updateOrgDto);
  
      expect(result).toEqual(mockUpdatedOrganization);
      expect(organizationService.updateOrganization).toHaveBeenCalledWith(organizationId, updateOrgDto);
      expect(organizationService.updateOrganization).toHaveBeenCalledTimes(1);
    });
  
    it('should throw a BadRequestException if the organization ID is invalid', async () => {
      const organizationId = 'invalid-id';
      const updateOrgDto: UpdateOrganizationDto = {
        name: 'Updated Organization',
        description: 'This organization has been updated.',
      };
  
      jest
        .spyOn(organizationService, 'updateOrganization')
        .mockRejectedValue(new BadRequestException('Invalid organization ID'));
  
      await expect(organizationController.updateOrganization(organizationId, updateOrgDto)).rejects.toThrow(BadRequestException);
      expect(organizationService.updateOrganization).toHaveBeenCalledWith(organizationId, updateOrgDto);
      expect(organizationService.updateOrganization).toHaveBeenCalledTimes(1);
    });
  
    it('should throw a BadRequestException if an error occurs during the update', async () => {
      const organizationId = '1';
      const updateOrgDto: UpdateOrganizationDto = {
        name: 'Updated Organization',
        description: 'This organization has been updated.',
      };
  
      jest
        .spyOn(organizationService, 'updateOrganization')
        .mockRejectedValue(new BadRequestException('Error updating organization'));
  
      await expect(organizationController.updateOrganization(organizationId, updateOrgDto)).rejects.toThrow(BadRequestException);
      expect(organizationService.updateOrganization).toHaveBeenCalledWith(organizationId, updateOrgDto);
      expect(organizationService.updateOrganization).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteOrganization', () => {
    it('should delete an organization', async () => {
      const organizationId = '1';
      const mockResponse = { message: 'Organization deleted successfully' };
  
      jest
        .spyOn(organizationService, 'deleteOrganization')
        .mockResolvedValue(mockResponse);
  
      const result = await organizationController.deleteOrganization(organizationId);
  
      expect(result).toEqual(mockResponse);
      expect(organizationService.deleteOrganization).toHaveBeenCalledWith(organizationId);
      expect(organizationService.deleteOrganization).toHaveBeenCalledTimes(1);
    });
  
    it('should throw a BadRequestException if the organization ID is invalid', async () => {
      const organizationId = 'invalid-id';
  
      jest
        .spyOn(organizationService, 'deleteOrganization')
        .mockRejectedValue(new BadRequestException('Invalid organization ID'));
  
      await expect(organizationController.deleteOrganization(organizationId)).rejects.toThrow(BadRequestException);
      expect(organizationService.deleteOrganization).toHaveBeenCalledWith(organizationId);
      expect(organizationService.deleteOrganization).toHaveBeenCalledTimes(1);
    });
  
    it('should throw a BadRequestException if an error occurs during deletion', async () => {
      const organizationId = '1';
  
      jest
        .spyOn(organizationService, 'deleteOrganization')
        .mockRejectedValue(new BadRequestException('Error deleting organization'));
  
      await expect(organizationController.deleteOrganization(organizationId)).rejects.toThrow(BadRequestException);
      expect(organizationService.deleteOrganization).toHaveBeenCalledWith(organizationId);
      expect(organizationService.deleteOrganization).toHaveBeenCalledTimes(1);
    });
  });

  describe('inviteUser', () => {
    it('should invite a user to the organization', async () => {
      const organizationId = '1';
      const userEmail = 'test@example.com';
      const mockResponse = { message: 'User invited successfully' };
  
      jest
        .spyOn(organizationService, 'inviteUser')
        .mockResolvedValue(mockResponse);
  
      const result = await organizationController.inviteUser(organizationId, userEmail);
  
      expect(result).toEqual(mockResponse);
      expect(organizationService.inviteUser).toHaveBeenCalledWith(organizationId, userEmail);
      expect(organizationService.inviteUser).toHaveBeenCalledTimes(1);
    });
  
    it('should throw a BadRequestException if the email is invalid', async () => {
      const organizationId = '1';
      const invalidEmail = 'invalid-email';
  
      jest
        .spyOn(organizationService, 'inviteUser')
        .mockRejectedValue(new BadRequestException('Invalid email address'));
  
      await expect(organizationController.inviteUser(organizationId, invalidEmail)).rejects.toThrow(BadRequestException);
      expect(organizationService.inviteUser).toHaveBeenCalledWith(organizationId, invalidEmail);
      expect(organizationService.inviteUser).toHaveBeenCalledTimes(1);
    });
  
    it('should throw a BadRequestException if an error occurs during invitation', async () => {
      const organizationId = '1';
      const userEmail = 'test@example.com';
  
      jest
        .spyOn(organizationService, 'inviteUser')
        .mockRejectedValue(new BadRequestException('Error inviting user'));
  
      await expect(organizationController.inviteUser(organizationId, userEmail)).rejects.toThrow(BadRequestException);
      expect(organizationService.inviteUser).toHaveBeenCalledWith(organizationId, userEmail);
      expect(organizationService.inviteUser).toHaveBeenCalledTimes(1);
    });
  });
  
});
