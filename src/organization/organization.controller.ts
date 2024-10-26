import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put, UseGuards } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Organization } from './entities/organization.entity';
import { GetOrganizationDto } from './dto/get-organization.dto';
import { GetOrganizationsPaginatedDto } from './dto/get-all-organizations-paginated.dto';
import { UpdatedOrganizationResponse } from './interfaces/organization.interface';
import { AccessLevelsGuard } from '../auth/guards/role.guards';
import { AccessTokenGuard } from '../auth/guards/accessToken.guard';
import { AccessLevels } from '../auth/Roles.decorator';
import { AccessLevel } from '../user/common utils/AccessLevel.enum';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  @UseGuards(AccessTokenGuard,AccessLevelsGuard)
  @ApiOperation({ summary: 'Create Organization' })
  @ApiResponse({
    status: 201,
    description: 'Organization created successfully.',
    type: Organization,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data.',
  })
  createOrganization(@Body() createOrganizationDto: CreateOrganizationDto): Promise<Organization> {
    
    return this.organizationService.createOrganization(createOrganizationDto);
  }

  @Get(':organizationId')
  @UseGuards(AccessTokenGuard,AccessLevelsGuard)
  @ApiOperation({ summary: 'Get Organization by ID' })
  @ApiParam({ name: 'organizationId', required: true, description: 'ID of the organization' })
  @ApiResponse({
    status: 200,
    description: 'Organization details retrieved successfully.',
    type: GetOrganizationDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Organization not found.',
  })
  async getOrganization(@Param('organizationId') organizationId: string): Promise<GetOrganizationDto> {
    return await this.organizationService.getOrganizationById(organizationId);
  }

  @Get()
  @UseGuards(AccessTokenGuard,AccessLevelsGuard)
  @ApiOperation({ summary: 'Get All Organizations' })
  @ApiQuery({ name: 'paginationDto', required: false, description: 'Pagination parameters' })
  @ApiResponse({
    status: 200,
    description: 'List of organizations retrieved successfully.',
  })
  async getOrganizations(
    @Query() paginationDto: GetOrganizationsPaginatedDto
  ): Promise<any> {
    return this.organizationService.findAllOrganizations(paginationDto);
  }


  
  @Put(':organizationId')
  @UseGuards(AccessTokenGuard,AccessLevelsGuard)
  @ApiOperation({ summary: 'Update Organization by ID' })
  @ApiParam({ name: 'organizationId', required: true, description: 'ID of the organization to update' })
  @ApiResponse({
    status: 200,
    description: 'Organization updated successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Organization not found.',
  })
  async updateOrganization(
    @Param('organizationId') organizationId: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto
  ): Promise<UpdatedOrganizationResponse> {
    return this.organizationService.updateOrganization(organizationId, updateOrganizationDto);
  }

    @Delete(':organizationId')
    @UseGuards(AccessTokenGuard,AccessLevelsGuard)
    @ApiOperation({ summary: 'Delete Organization by ID' })
    @ApiParam({ name: 'organizationId', required: true, description: 'ID of the organization to delete' })
    @ApiResponse({
      status: 200,
      description: 'Organization deleted successfully.',
    })
    @ApiResponse({
      status: 404,
      description: 'Organization not found.',
    })
    async deleteOrganization(
      @Param('organizationId') organizationId: string
    ): Promise<{ message: string }> {
      return this.organizationService.deleteOrganization(organizationId);
    }


  @Post(':organizationId/invite')
  @UseGuards(AccessTokenGuard,AccessLevelsGuard)
  @ApiOperation({ summary: 'Invite User to Organization' })
  @ApiParam({ name: 'organizationId', required: true, description: 'ID of the organization' })
  @ApiResponse({
    status: 200,
    description: 'User invited successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid email address.',
  })
  async inviteUser(
    @Param('organizationId') organizationId: string,
    @Body('email') userEmail: string
  ): Promise<{ message: string }> {
    return await this.organizationService.inviteUser(organizationId, userEmail);
  }
}
