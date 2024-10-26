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

@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  @UseGuards(AccessTokenGuard,AccessLevelsGuard)
  createOrganization(@Body() createOrganizationDto: CreateOrganizationDto): Promise<Organization> {
    return this.organizationService.createOrganization(createOrganizationDto);
  }

  @Get(':organizationId')
  @UseGuards(AccessTokenGuard,AccessLevelsGuard)
  async getOrganization(@Param('organizationId') organizationId: string): Promise<GetOrganizationDto> {
    return await this.organizationService.getOrganizationById(organizationId);
  }

  @Get()
  @UseGuards(AccessTokenGuard,AccessLevelsGuard)
  async getOrganizations(
    @Query() paginationDto: GetOrganizationsPaginatedDto
  ): Promise<any> {
    return this.organizationService.findAllOrganizations(paginationDto);
  }


  
  @Put(':organizationId')
  @UseGuards(AccessTokenGuard,AccessLevelsGuard)
  async updateOrganization(
    @Param('organizationId') organizationId: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto
  ): Promise<UpdatedOrganizationResponse> {
    return this.organizationService.updateOrganization(organizationId, updateOrganizationDto);
  }

  @Delete(':organizationId')
  @UseGuards(AccessTokenGuard,AccessLevelsGuard)
  async deleteOrganization(
    @Param('organizationId') organizationId: string
  ): Promise<{ message: string }> {
    return this.organizationService.deleteOrganization(organizationId);
  }


  @Post(':organizationId/invite')
  @UseGuards(AccessTokenGuard,AccessLevelsGuard)
  async inviteUser(
    @Param('organizationId') organizationId: string,
    @Body('email') userEmail: string
  ): Promise<{ message: string }> {
    return await this.organizationService.inviteUser(organizationId, userEmail);
  }
}
