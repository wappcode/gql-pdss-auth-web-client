import {
  GQLQueryData,
  GQLQueryObject,
  QueryExecutor,
  gqlparse,
  queryDataToQueryObject,
  throwGQLErrors
} from 'graphql-client-utilities';
import { ResourcePermission } from '../models/auth-session-data';
import { clearAuthSessionData, getAuthSessionData, setAuthSessionData } from './session-storage';
import { AuthenticatedUser } from '../models/authenticated-user';

/**
 * Determina si se ha iniciado sesión
 */
export const isSigned = (): boolean => {
  const data = getAuthSessionData();
  return !!data;
};

/**
 * Alias de getAuthSessionData 
 * @returns
 */
export const getUser = <T>(): T | undefined => {
  const data = getAuthSessionData<T>();
  return data;
};

/**
 * Recupera los roles relacionados al usuario logueado
 * @returns
 */
export const getRoles = <T extends { roles: string[] }>(): string[] => {
  const data = getAuthSessionData<T>();
  const roles = data?.roles ?? [];
  return roles;
};

/**
 * Recupera true si el usuario tiene el rol
 * @param role
 * @returns
 */
export const hasRole = <T extends { roles: string[] }>(role: string): boolean => {
  const data = getAuthSessionData<T>();
  const roles = data?.roles ?? [];
  return roles.includes(role);
};

/**
 * Recupera true si el usuario tiene almenos uno de los roles de la lista
 * @param roles
 * @returns
 */
export const hasAnyRole = <T extends { roles: string[] }>(roles: string[]): boolean => {
  const userRoles = getRoles<T>();
  return userRoles.some((role) => roles.includes(role));
};

/**
 * Recupera true solo si el usuario tiene todos los roles de la lista
 * @param roles
 * @returns
 */
export const hasAllRoles = <T extends { roles: string[] }>(roles: string[]): boolean => {
  const userRoles = getRoles<T>();
  return userRoles.every((role) => roles.includes(role));
};
/**
 * Mapea un string con formato "resource:value:scope" a un SessionDataPermission
 * @param permissionString
 * @returns
 */
export const mapStringToPermission = (permissionString: string): ResourcePermission => {
  const [resource, value, scope] = permissionString.split(':');
  return {
    resource,
    value,
    scope: scope ?? undefined,
    access: 'ALLOW'
  };
};

/**
 * Recupera los permisos del usuario
 * @returns
 */
export const getPermissions = <T extends { permissions: string[] }>(): ResourcePermission[] => {
  const data = getAuthSessionData<T>();
  const permissions = (data?.permissions ?? []);
  return permissions.map(mapStringToPermission);
};

/**
 * Recupera el permiso activo mas reciente que tenga acceso allowed
 * Si el permiso activo tiene access deny retorna undefined
 * @param resource
 * @param permissionValue
 * @returns
 */
export const findPermission = <T extends { permissions: string[] }>(
  resource: string,
  permissionValue: string
): ResourcePermission | undefined => {
  const userPermissions = getPermissions<T>();
  const permission = userPermissions.find(
    (perm) => perm.resource == resource && (perm.value == permissionValue || perm.value.trim().toUpperCase() == 'ALL')
  );
  return permission?.access.trim().toUpperCase() == 'ALLOW' ? permission : undefined;
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
  return permission?.access.trim().toUpperCase() == 'ALLOW';
};

/**
 * Recupera true si el usuario tiene alguno de los permisos para alguno de los recursos
 * @param resources
 * @param permissionValues
 * @param scopes
 * @returns
 */
export const hasAnyPermission = (
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


export const getAuthenticatedUserFragment = (): GQLQueryObject => {
  const fragment = gqlparse`
  fragment sessionData on SessionData {
    fullName
    firstName
    lastName
    username
    email
    picture
    roles
    permissions
  }
  `;
  return fragment;
};

export const login = async <T>(
  queryExecutor: QueryExecutor,
  username: string,
  password: string,
  fragment?: GQLQueryData
): Promise<T | undefined> => {
  const finalFragment = fragment ? queryDataToQueryObject(fragment) : getAuthenticatedUserFragment();
  const query = gqlparse`
  query QueryLogin($username: String!, $password: String!){
  
    sessionData:login(username: $username, password: $password){
      
      ...${finalFragment.operationName}
    }
    
  }
    ${finalFragment.query}
  `;

  return queryExecutor<{ sessionData: T | undefined }>(query, { username, password })
    .then(throwGQLErrors)
    .then((result) => result.data.sessionData)
    .then(setAuthSessionData);
};

export const logout = async (): Promise<void> => {
  clearAuthSessionData();
};


/**
 * Recupera el usuario autenticado realizando una consulta al servidor con la api gql-pdss-auth
 * Para otras apis usar query personalizado 
 * @param queryExecutor 
 * @param fragment 
 * @returns 
 */
export const getAuthenticatedUser = async (
  queryExecutor: QueryExecutor,
  fragment?: GQLQueryData
): Promise<AuthenticatedUser | undefined> => {
  const finalFragment = fragment ? queryDataToQueryObject(fragment) : getAuthenticatedUserFragment();
  const query = gqlparse`
  query QuerySignedUser{
    sessionData: getSessionData{
      ...${finalFragment.operationName}
    }
  }
  ${finalFragment.query}
  `;
  return queryExecutor<{ sessionData: AuthenticatedUser | undefined }>(query)
    .then(throwGQLErrors)
    .then((result) => result.data.sessionData)
    .then(setAuthSessionData);
};
