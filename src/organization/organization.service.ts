import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { Organization } from './entities/organization.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserService } from '../user/user.service';
import { GetOrganizationDto } from './dto/get-organization.dto';
import { GetOrganizationsPaginatedDto } from './dto/get-all-organizations-paginated.dto';
import { OrganizationResponse, UpdatedOrganizationResponse } from './interfaces/organization.interface';
import { UpdateOrganizationDto } from './dto/update-organization.dto';


@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel(Organization.name) private organizationModel: Model<Organization>,
    private userService: UserService // Inject UserService

  ) {}
  async createOrganization(createOrgDto: CreateOrganizationDto): Promise<Organization> {
    const { name, description } = createOrgDto;
  
    // Check if name and description are provided
    if (!name || !description) {
      throw new BadRequestException('Organization name and description are required.');
    }
  
    const newOrganization = new this.organizationModel({
      name,
      description,
      organization_members: [], // Initialize with an empty array if needed
    });
  
    return await newOrganization.save();
  }
  
  async getOrganizationById(organizationId: string): Promise<GetOrganizationDto> {
    // Find the organization by ID
    const organization = await this.organizationModel
      .findById(organizationId)
      .populate('organization_members', 'name email access_level') // Populate members with name and email
      .exec();

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    // Map organization members to the desired response format
    const organizationMembers = organization.organization_members.map(member => ({
      name: member.name,
      email: member.email,
      access_level: member.access_level, // Ensure this field exists in the User model
    }));

    return {
      organization_id: organization.id,
      name: organization.name,
      description: organization.description,
      organization_members: organizationMembers,
    };
  }
  
  async findAllOrganizations(
    paginationDto: GetOrganizationsPaginatedDto
  ): Promise<OrganizationResponse> {

    const { page, limit, sortBy, order } = paginationDto;

    // Calculate the skip value for pagination
    const skip = (page - 1) * limit;

    // Set sorting direction
    const sortDirection = order === 'asc' ? 1 : -1;

    // Query the database
    const organizations = await this.organizationModel
      .find()
      .populate('organization_members', 'name email access_level') // Populate members
      .sort({ [sortBy]: sortDirection }) // Sort by the specified field (default is createdAt)
      .skip(skip) // Apply pagination
      .limit(limit) // Set limit
      .exec();

    const totalOrganizations = await this.organizationModel.countDocuments();

    return {
      organizations: organizations.map(org => ({
        organization_id: org._id.toString(), // Convert ObjectId to string
        name: org.name,
        description: org.description,
        organization_members: org.organization_members.map(member => ({
          name: member.name,
          email: member.email,
          access_level: member.access_level,
        })),
      })),
      total: totalOrganizations,
      page,
      limit,
    };
  }
  async updateOrganization(
    organizationId: string,
    updateOrganizationDto: UpdateOrganizationDto
  ): Promise<UpdatedOrganizationResponse> {
    // Find the organization by ID
    const organization = await this.organizationModel.findById(organizationId);
    
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    // Update the organization fields
    organization.name = updateOrganizationDto.name || organization.name;
    organization.description = updateOrganizationDto.description || organization.description;

    // Save the updated organization
    await organization.save();

    return {
      organization_id: organization._id.toString(), // Convert ObjectId to string
      name: organization.name,
      description: organization.description,
    };
  }

  async deleteOrganization(organizationId: string): Promise<{ message: string }> {
    // Find the organization by ID and delete it
    const organization = await this.organizationModel.findByIdAndDelete(organizationId);
    
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    // Return a success message
    return { message: 'Organization deleted successfully' };
  }


  async inviteUser(organizationId: string, userEmail: string): Promise<{ message: string }> {
    // Find the organization
    const organization = await this.organizationModel.findById(organizationId);
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }
  
    // Log the fetched organization to inspect its fields
    console.log('Fetched organization:', organization);
  
    // Find the user by email
    const user = await this.userService.findByEmail(userEmail);
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    // Check if the user is already a member of the organization
    if (organization.organization_members.includes(user.id)) {
      return { message: `${userEmail} is already a member of the organization.` };
    }
  
    // Add the user's ID to the organization's members list
    organization.organization_members.push(user.id);
  
    // Check if name and description are set in the organization document
    if (!organization.name || !organization.description) {
      throw new BadRequestException('Organization name and description are required.');
    }
  
    // Attempt to save the organization
    try {
      await organization.save();
    } catch (error) {
      throw new BadRequestException('Failed to save organization: ' + error.message);
    }
  
    // Here you would implement your invitation logic, e.g., sending an email
    // For demonstration purposes, we'll just return a success message.
    return { message: `Invitation sent to ${userEmail} successfully and added to the organization.` };
  }
}


