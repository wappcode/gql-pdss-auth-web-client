
import { AuthSessionStorage, SessionDataStored } from '../models/auth-session-storage';
import { getCookie, setCookie } from './cookies';

const defaultAuthStorageKey = 'gqlpdssauthsessionstoragekey';
const defaultAuthStorageTimelife = 30 * 60 * 1000;
let authStorageKey: string | undefined;
let authStorage: AuthSessionStorage | undefined;
let authStorageTimeLife: number;
let authSessiondataStored: unknown | undefined;

const parseJsonSafely = <T>(value?: string): T | undefined => {
  if (typeof value !== 'string' || value.trim().length < 1) {
    return undefined;
  }
  try {
    const data: T = JSON.parse(value);
    return data;
  } catch (e) {
    console.error(e);
  }
};
const readSessionDataFromWebStorage = <T>(storage: Storage): T | undefined => {
  const key = getAuthStorageKey();
  const dataString = storage.getItem(key);
  if (typeof dataString !== 'string' || dataString.length < 1) {
    return undefined;
  }
  try {
    const dataStored: SessionDataStored<T> = JSON.parse(dataString);
    const { expires, data } = dataStored;
    const currentDate = new Date();
    if (currentDate.getTime() > new Date(expires).getDate()) {
      return undefined;
    }

    return data;
  } catch (e) {
    console.error(e);
  }
};
const writeSessionDataToWebStorage = <T>(
  storage: Storage,
  data: T,
  lifetimeInMiliSeconds: number
) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + lifetimeInMiliSeconds);
  const storedData: SessionDataStored<T> = { expires, data };
  const dataStr = JSON.stringify(storedData);
  const key = getAuthStorageKey();
  storage.setItem(key, dataStr);
};
export const parseJwtPayload = <T>(jwt?: string): T | undefined => {
  if (typeof jwt !== 'string' || jwt.length < 1) {
    return undefined;
  }
  const jwtData = jwt.split('.');
  try {
    const dataDecoded = atob(jwtData[1]);
    const data = JSON.parse(dataDecoded);
    return data;
  } catch (e) {
    return undefined;
  }
};

export const readSessionDataFromMemory = <T>(): T | undefined => {
  if (!authSessiondataStored) {
    return undefined;
  }
  const { data, expires } = authSessiondataStored as (SessionDataStored<T>);
  const currentDate = new Date();
  if (currentDate.getTime() > expires.getTime()) {
    return undefined;
  }
  return data;
};

export const setAuthStorageLifetime = (timelifeInMiliseconds: number) => {
  if (!timelifeInMiliseconds || isNaN(timelifeInMiliseconds)) {
    throw new Error('Set auth storage timelife more than once is not allowed');
  }
  authStorageTimeLife = timelifeInMiliseconds;
};

export const getAuthStorageLifetime = (): number => {
  return authStorageTimeLife ?? defaultAuthStorageTimelife;
};

export const setAuthStorageKey = (key: string) => {
  if (typeof authStorageKey === 'string' && authStorageKey.length > 0) {
    throw new Error('Set auth storage key more than once is not allowed');
  }
  authStorageKey = key;
};

export const getAuthStorageKey = (): string => {
  return authStorageKey ?? defaultAuthStorageKey;
};

export const setAuthStorage = (storage: AuthSessionStorage) => {
  if (typeof authStorage === 'string' && authStorage.length > 0) {
    throw new Error('Set auth storage more than once is not allowed');
  }
  authStorage = storage;
};

export const getAuthStorage = (): AuthSessionStorage => {
  return authStorage ?? 'SCRIPT';
};

export const readSessionDataFromLocalStorage = <T>() => {
  return readSessionDataFromWebStorage<T>(window.localStorage);
};
export const readSessionDataFromSessionStorage = <T>() => {
  return readSessionDataFromWebStorage<T>(window.sessionStorage);
};

export const readSessionDataFromCookies = <T>(): T | undefined => {
  const key = getAuthStorageKey();
  const userStr = getCookie(key);
  const user = parseJsonSafely<T>(userStr);
  if (!user) {
    return undefined;
  }
  return user;
};

export const writeSessionDataToSessionStorage = <T>(
  data: T,
  lifetimeInMiliSeconds: number
) => {
  writeSessionDataToWebStorage(window.sessionStorage, data, lifetimeInMiliSeconds);
};
export const writeSessionDataToLocalStorage = <T>(
  data: T,
  lifetimeInMiliSeconds: number
) => {
  writeSessionDataToWebStorage(window.localStorage, data, lifetimeInMiliSeconds);
};
export const writeSessionDataToCookies = <T>(
  data: T,
  lifetimeInMiliSeconds: number
) => {
  const key = getAuthStorageKey();
  const userStr = JSON.stringify(data);
  setCookie(key, userStr, lifetimeInMiliSeconds);

};
export const writeSessionDataToMemory = <T>(data: T, lifetimeInMiliSeconds: number) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + lifetimeInMiliSeconds);
  authSessiondataStored = { expires, data };
};

export const getAuthSessionData = <T>(): T | undefined => {
  const storage = getAuthStorage();
  if (storage == 'COOKIES') {
    return readSessionDataFromCookies();
  }
  if (storage == 'LOCALSTORAGE') {
    return readSessionDataFromLocalStorage();
  }
  if (storage == 'SESSIONSTORAGE') {
    return readSessionDataFromSessionStorage();
  }
  if (storage == 'SCRIPT') {
    return readSessionDataFromMemory();
  }
  return undefined;
};

export const setAuthSessionData = <T>(data: T): T=> {
  const storage = getAuthStorage();
  const lifetimeInMiliSeconds = getAuthStorageLifetime();

  if (storage == 'COOKIES') {
    writeSessionDataToCookies(data, lifetimeInMiliSeconds);
  }
  if (storage == 'LOCALSTORAGE') {
    writeSessionDataToLocalStorage(data, lifetimeInMiliSeconds);
  }
  if (storage == 'SESSIONSTORAGE') {
    writeSessionDataToSessionStorage(data, lifetimeInMiliSeconds);
  }
  if (storage == 'SCRIPT') {
    writeSessionDataToMemory(data, lifetimeInMiliSeconds);
  }
  return data;
};

export const clearSessionDataFromMemory = () => {
  authSessiondataStored = undefined;
};
export const clearSessionDataFromCookies = () => {
  writeSessionDataToCookies(undefined, 0);
};
export const clearSessionDataFromLocalStorage = () => {
  const key = getAuthStorageKey();
  localStorage.removeItem(key);
};
export const clearSessionDataFromSessionStorage = () => {
  const key = getAuthStorageKey();
  sessionStorage.removeItem(key);
};
export const clearAuthSessionData = () => {
  const storage = getAuthStorage();
  if (storage == 'COOKIES') {
    return clearSessionDataFromCookies();
  }
  if (storage == 'LOCALSTORAGE') {
    return clearSessionDataFromLocalStorage();
  }
  if (storage == 'SESSIONSTORAGE') {
    return clearSessionDataFromSessionStorage();
  }
  if (storage == 'SCRIPT') {
    return clearSessionDataFromMemory();
  }
};
