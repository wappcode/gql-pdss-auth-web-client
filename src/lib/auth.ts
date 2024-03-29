import {
  GQLQueryData,
  GQLQueryObject,
  QueryExecutor,
  gqlparse,
  queryDataToQueryObject,
  throwGQLErrors
} from 'graphql-client-utilities';
import { AuthSessionUser } from '../models';
import { SessionData, SessionDataPermission } from '../models/auth-session-data';
import { clearAuthSessionData, getAuthSessionData, setAuthSessionData } from './session-storage';

/**
 * Determina si se ha iniciado sesión
 */
export const isSigned = (): boolean => {
  const data = getAuthSessionData();
  return !!data;
};

/**
 * Recupera los datos del usuario logueado
 * @returns
 */
export const getAuthUser = (): AuthSessionUser | undefined => {
  const data = getAuthSessionData();
  return data?.user;
};

/**
 * Recupera los roles relacionados al usuario logueado
 * @returns
 */
export const getRoles = (): string[] => {
  const data = getAuthSessionData();
  const roles = data?.roles ?? [];
  return roles;
};

/**
 * Recupera true si el usuario tiene el rol
 * @param role
 * @returns
 */
export const hasRole = (role: string): boolean => {
  const data = getAuthSessionData();
  const roles = data?.roles ?? [];
  return roles.includes(role);
};

/**
 * Recupera true si el usuario tiene almenos uno de los roles de la lista
 * @param roles
 * @returns
 */
export const hasSomeRoles = (roles: string[]): boolean => {
  const data = getAuthSessionData();
  const userRoles = data?.roles ?? [];
  return userRoles.some((role) => roles.includes(role));
};

/**
 * Recupera true solo si el usuario tiene todos los roles de la lista
 * @param roles
 * @returns
 */
export const hasAllRoles = (roles: string[]): boolean => {
  const data = getAuthSessionData();
  const userRoles = data?.roles ?? [];
  return userRoles.every((role) => roles.includes(role));
};
/**
 * Recupera los permisos del usuario
 * @returns
 */
export const getPermissions = (): SessionDataPermission[] => {
  const data = getAuthSessionData();
  const permissions = data?.permissions ?? [];
  return permissions;
};

/**
 * Recupera el permiso activo mas reciente que tenga acceso allowed
 * Si el permiso activo tiene access deny retorna undefined
 * @param resource
 * @param permissionValue
 * @returns
 */
export const findPermission = (
  resource: string,
  permissionValue: string
): SessionDataPermission | undefined => {
  const data = getAuthSessionData();
  const userPermissions = data?.permissions ?? [];
  const permission = userPermissions.find(
    (perm) => perm.resource == resource && (perm.value == permissionValue || perm.value == 'ALL')
  );
  return permission?.access == 'ALLOW' ? permission : undefined;
};
/**
 * Recupera true si el usuario tiene permisos para el recurso
 * @param resource
 * @param permissionValue
 * @param scope
 * @returns
 */
export const hasPermission = (
  resource: string,
  permissionValue: string,
  scope?: string
): boolean => {
  const permission = findPermission(resource, permissionValue);
  if (!permission) {
    return false;
  }
  if (typeof scope === 'string' && scope.length > 0 && scope != permission.scope) {
    return false;
  }
  return permission?.access == 'ALLOW';
};

/**
 * Recupera true si el usuario tiene alguno de los permisos para alguno de los recursos
 * @param resources
 * @param permissionValues
 * @param scopes
 * @returns
 */
export const hasSomePermissions = (
  resources: string[],
  permissionValues: string[],
  scopes?: string[]
): boolean => {
  let result = false;

  if (!scopes || scopes.length == 0) {
    result = resources.some((resource) =>
      permissionValues.some((value) => hasPermission(resource, value))
    );
  } else {
    result = resources.some((resource) =>
      permissionValues.some((value) =>
        scopes.some((scope) => hasPermission(resource, value, scope))
      )
    );
  }

  return result;
};
/**
 * Recupera true solo si el usuario tiene todos los permisos para todos los recursos
 * @param resources
 * @param permissionValues
 * @param scopes
 * @returns
 */
export const hasAllPermissions = (
  resources: string[],
  permissionValues: string[],
  scopes?: string[]
): boolean => {
  let result = false;

  if (!scopes || scopes.length == 0) {
    result = resources.every((resource) =>
      permissionValues.every((value) => hasPermission(resource, value))
    );
  } else {
    result = resources.every((resource) =>
      permissionValues.every((value) =>
        scopes.every((scope) => hasPermission(resource, value, scope))
      )
    );
  }

  return result;
};
/**
 *
 * @returns Recupera el JWT asignado a la sesión
 */
export const getJWT = (): string | undefined => {
  const data = getAuthSessionData();

  return data?.jwt;
};

export const getSessionDataFragment = (): GQLQueryObject => {
  const fragment = gqlparse`
  fragment sessionData on SessionData {
    user{
      fullName
      firstName
      lastName
      username 
      email
      picture
   
    }
    roles,
    permissions{
      resource
      access
      value
      scope
    }
    jwt
  }
  `;
  return fragment;
};

export const login = async (
  queryExecutor: QueryExecutor,
  username: string,
  password: string,
  fragment?: GQLQueryData
): Promise<SessionData | undefined> => {
  const finalFragment = fragment ? queryDataToQueryObject(fragment) : getSessionDataFragment();
  const query = gqlparse`
  query QueryLogin($username: String!, $password: String!){
  
    sessionData:login(username: $username, password: $password){
      
      ...${finalFragment.operationName}
    }
    
  }
    ${finalFragment.query}
  `;

  return queryExecutor<{ sessionData: SessionData }>(query, { username, password })
    .then(throwGQLErrors)
    .then((result) => result.data.sessionData)
    .then(setAuthSessionData);
};

export const logout = async (): Promise<void> => {
  clearAuthSessionData();
};

export const getSessionData = async (
  queryExecutor: QueryExecutor,
  fragment?: GQLQueryData
): Promise<SessionData | undefined> => {
  const finalFragment = fragment ? queryDataToQueryObject(fragment) : getSessionDataFragment();
  const query = gqlparse`
  query QuerySignedUser{
    sessionData: getSessionData{
      ...${finalFragment.operationName}
    }
  }
  ${finalFragment.query}
  `;
  return queryExecutor<{ sessionData: SessionData }>(query)
    .then(throwGQLErrors)
    .then((result) => result.data.sessionData)
    .then(setAuthSessionData);
};
