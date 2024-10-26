import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { Organization } from './entities/organization.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserService } from '../user/user.service';


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
  

  
  
}


