import { Role } from '~/constants/role.enum';

export interface JwtPayload {
  id: string;
  email: string;
  role: Role;
}
