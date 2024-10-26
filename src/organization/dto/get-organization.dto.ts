import { IsString, IsArray } from 'class-validator';

export class GetOrganizationDto {
  @IsString()
  organization_id: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsArray()
  organization_members: {
    name: string;
    email: string;
    access_level: string; // Ensure access level is handled in your User entity or logic
  }[];
}
