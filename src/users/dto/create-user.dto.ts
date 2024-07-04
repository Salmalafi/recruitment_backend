// create-user.dto.ts

import { Role } from "src/auth/role.enum";


export class CreateUserDto {
  readonly email: string;
  readonly password: string;
  readonly roles: Role[];
}



export class UpdateUserDto {
  readonly email?: string;
  readonly password?: string;
  readonly roles?: Role[];
}
