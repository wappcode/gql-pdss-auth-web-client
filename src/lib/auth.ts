import { SessionData } from "../models/auth-session-data";
import { clearAuthSessionData, getAuthSessionData } from "./session-storage";

export const isSigned = (): boolean => {
  const data = getAuthSessionData();
  return !!data;
};

// TODO: Desarrollar
export const login = async (): Promise<SessionData | undefined> => {
  return undefined;
};

export const logout = async (): Promise<void> => {
  clearAuthSessionData();
};
