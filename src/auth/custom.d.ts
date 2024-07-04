// custom.d.ts
import { Role } from './role.enum';
import { User } from '../users/user.entity';

declare global {
  namespace Express {
    interface Request {
      user?: User & { roles?: Role[] };
    }
  }
}
