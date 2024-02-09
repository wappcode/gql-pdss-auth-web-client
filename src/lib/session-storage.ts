import { SessionData } from '../models/auth-session-data';
import { AuthSessionStorage, SessionDataStored } from '../models/auth-session-storage';
import { getCookie, setCookie } from './cookies';

const defaultAuthStorageKey = 'gqlpdssauthsessionstoragekey';
const defaultAuthStorageTimelife = 30 * 60 * 1000;
let authStorageKey: string | undefined;
let authStorage: AuthSessionStorage | undefined;
let authStorageTimeLife: number;
let authSessiondataStored: SessionDataStored | undefined;

const getAuthSessionDataFromBrowserStorage = (storage: Storage): SessionData | undefined => {
  const key = getAuthStorageKey();
  const dataString = storage.getItem(key);
  if (typeof dataString !== 'string' || dataString.length < 1) {
    return undefined;
  }
  try {
    const dataStored: SessionDataStored = JSON.parse(dataString);
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
const setAuthSessionDataToBrowserStorage = (
  storage: Storage,
  data: SessionData,
  lifetimeInMiliSeconds: number
) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + lifetimeInMiliSeconds);
  const storedData: SessionDataStored = { expires, data };
  const dataStr = JSON.stringify(storedData);
  const key = getAuthStorageKey();
  storage.setItem(key, dataStr);
};
export const getAuthSessionDataFromScript = (): SessionData | undefined => {
  if (!authSessiondataStored) {
    return undefined;
  }
  const { data, expires } = authSessiondataStored;
  const currentDate = new Date();
  if (currentDate.getTime() > expires.getTime()) {
    return undefined;
  }
  return data;
};

export const setAuthStorageTimelife = (timelifeInMiliseconds: number) => {
  if (!timelifeInMiliseconds || isNaN(timelifeInMiliseconds)) {
    throw new Error('Set auth storage timelife more than once is not allowed');
  }
  authStorageTimeLife = timelifeInMiliseconds;
};

export const getAuthStorageTimelife = (): number => {
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

export const getAuthSessionDataFromLocalStorage = () => {
  return getAuthSessionDataFromBrowserStorage(window.localStorage);
};
export const getAuthSessionDataFromSessionStorage = () => {
  return getAuthSessionDataFromBrowserStorage(window.sessionStorage);
};

export const getAuthSessionDataFromCookies = (): SessionData | undefined => {
  const key = getAuthStorageKey();

  const dataString = getCookie(key);
  if (typeof dataString !== 'string' || dataString.trim().length < 1) {
    return undefined;
  }
  try {
    const data: SessionData = JSON.parse(dataString);
    return data;
  } catch (e) {
    console.error(e);
  }
};

export const setAuthSessionDataToSessionStorage = (
  data: SessionData,
  lifetimeInMiliSeconds: number
) => {
  setAuthSessionDataToBrowserStorage(window.sessionStorage, data, lifetimeInMiliSeconds);
};
export const setAuthSessionDataToLocalStorage = (
  data: SessionData,
  lifetimeInMiliSeconds: number
) => {
  setAuthSessionDataToBrowserStorage(window.localStorage, data, lifetimeInMiliSeconds);
};
export const setAuthSessionDataToCookies = (data: SessionData, lifetimeInMiliSeconds: number) => {
  const dataStr = JSON.stringify(data);
  const key = getAuthStorageKey();
  setCookie(key, dataStr, lifetimeInMiliSeconds);
};
export const setAuthSessionDataToScript = (data: SessionData, lifetimeInMiliSeconds: number) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + lifetimeInMiliSeconds);
  authSessiondataStored = { expires, data };
};

export const getAuthSessionData = (): SessionData | undefined => {
  const storage = getAuthStorage();
  if (storage == 'COOKIES') {
    return getAuthSessionDataFromCookies();
  }
  if (storage == 'LOCALSTORAGE') {
    return getAuthSessionDataFromLocalStorage();
  }
  if (storage == 'SESSIONSTORAGE') {
    return getAuthSessionDataFromSessionStorage();
  }
  if (storage == 'SCRIPT') {
    return getAuthSessionDataFromScript();
  }
  return undefined;
};

export const setAuthSessionData = (data: SessionData): SessionData => {
  const storage = getAuthStorage();
  const lifetimeInMiliSeconds = getAuthStorageTimelife();

  if (storage == 'COOKIES') {
    setAuthSessionDataToCookies(data, lifetimeInMiliSeconds);
  }
  if (storage == 'LOCALSTORAGE') {
    setAuthSessionDataToLocalStorage(data, lifetimeInMiliSeconds);
  }
  if (storage == 'SESSIONSTORAGE') {
    setAuthSessionDataToSessionStorage(data, lifetimeInMiliSeconds);
  }
  if (storage == 'SCRIPT') {
    setAuthSessionDataToScript(data, lifetimeInMiliSeconds);
  }
  return data;
};

export const clearAuthSessionDataToScript = () => {
  authSessiondataStored = undefined;
};
export const clearAuthSessionDataToCookies = () => {
  const key = getAuthStorageKey();
  setCookie(key, '', 0);
};
export const clearAuthSessionDataToLocalStorage = () => {
  const key = getAuthStorageKey();
  localStorage.removeItem(key);
};
export const clearAuthSessionDataToSessionStorage = () => {
  const key = getAuthStorageKey();
  sessionStorage.removeItem(key);
};
export const clearAuthSessionData = () => {
  const storage = getAuthStorage();
  if (storage == 'COOKIES') {
    return clearAuthSessionDataToCookies();
  }
  if (storage == 'LOCALSTORAGE') {
    return clearAuthSessionDataToLocalStorage();
  }
  if (storage == 'SESSIONSTORAGE') {
    return clearAuthSessionDataToSessionStorage();
  }
  if (storage == 'SCRIPT') {
    return clearAuthSessionDataToScript();
  }
};
