export interface OrganizationMember {
    name: string;
    email: string;
    access_level: string;
  }
  
  export interface OrganizationResponse {
    
    organizations: {
      organization_id: string; // Assuming ObjectId is converted to string
      name: string;
      description: string;
      organization_members: OrganizationMember[];
    }[];

    total: number;
    page: number;
    limit: number;
  }
  
  export interface UpdatedOrganizationResponse {
    organization_id: string;
    name: string;
    description: string;
  }