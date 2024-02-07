import { SessionData } from "./auth-session-data";

export type AuthSessionStorage =
  | "SCRIPT"
  | "LOCALSTORAGE"
  | "SESSIONSTORAGE"
  | "COOKIES";

export type SessionDataStored = {
  data: SessionData;
  expires: Date;
};
