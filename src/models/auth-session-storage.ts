
export type AuthSessionStorage =
  | "SCRIPT"
  | "LOCALSTORAGE"
  | "SESSIONSTORAGE"
  | "COOKIES";

export type SessionDataStored<T> = {
  data: T;
  expires: Date;
};
