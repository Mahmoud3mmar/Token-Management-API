import { IsOptional, IsString, IsInt, Min ,IsEnum} from 'class-validator';
import { Type } from 'class-transformer';

export class GetOrganizationsPaginatedDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number;


  @IsOptional()
  sortBy?: string = 'createdAt'; // Default sorting field

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  order?: 'asc' | 'desc' = 'asc'; // Default sorting order
}
