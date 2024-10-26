import { SetMetadata } from "@nestjs/common";
// import { Role } from "../user/common utils/Role.enum";
import { AccessLevel } from "../user/common utils/AccessLevel.enum";

// export const Roles =(...Roles:Role[])=> SetMetadata('roles',Roles)

export const AccessLevels =(...AccessLevels:AccessLevel[])=> SetMetadata('access_levels',AccessLevels)