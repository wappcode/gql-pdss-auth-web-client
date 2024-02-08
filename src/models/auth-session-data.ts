import { AuthSession } from './auth-session';
import { AuthSessionUser } from './auth-user';

export type SessionDataPermissionAccess = 'DENY' | 'ALLOW';
export interface SessionDataPermission {
  resource: string;
  access: SessionDataPermissionAccess;
  value: string;
  scope?: string;
}
export interface SessionData {
  data: AuthSession;
  user: AuthSessionUser;
  roles?: string[];
  permissions?: SessionDataPermission[];
  jwt?: string;
}
