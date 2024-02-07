import { AuthSession } from "./auth-session";
import { AuthSessionUser } from "./auth-user";

export interface SessionData {
  data: AuthSession;
  user: AuthSessionUser;
  roles?: string[];
  permissions?: string[];
  jwt?: string;
}
