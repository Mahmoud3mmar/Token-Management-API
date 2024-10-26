import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { Organization } from './entities/organization.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserService } from '../user/user.service';
import { GetOrganizationDto } from './dto/get-organization.dto';


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
  
  
}


