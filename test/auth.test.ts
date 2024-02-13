import { createQueryExecutor } from 'graphql-client-utilities';
import { describe, expect, test } from 'vitest';
import {
  getAuthUser,
  getJWT,
  getPermissions,
  getRoles,
  getSessionData,
  hasAllPermissions,
  hasAllRoles,
  hasPermission,
  hasRole,
  hasSomePermissions,
  hasSomeRoles,
  isSigned,
  login
} from '../src/lib/auth';
import {
  clearAuthSessionData,
  extractJWTDataFromSession,
  setAuthSessionData
} from '../src/lib/session-storage';
import { AuthJWTData, SessionData } from '../src/models';
import { API_URL, queryExecutor } from './query-executor';

const sessionData: SessionData = {
  user: {
    firstName: 'Pancho',
    lastName: 'López',
    username: 'pancholopez',
    fullName: 'Pancho López'
  },
  jwt: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdXRoX3RpbWUiOjE3MDc3OTM4NzIsInN1YiI6InAubG9wZXoiLCJiaXJ0aF9mYW1pbHlfbmFtZSI6IkxcdTAwZjNwZXoiLCJiaXJ0aF9naXZlbl9uYW1lIjoiUGFuY2hvIiwiZW1haWwiOiJwLmxvcGV6QGRlbW8ubG9jYWwubGFuIiwiZXhpIjoxMjAwLCJleHAiOjE3MDc3OTUwNzIsImZhbWlseV9uYW1lIjoiTFx1MDBmM3BleiIsImdpdmVuX25hbWUiOiJQYW5jaG8iLCJpc3MiOiJsb2NhbGhvc3QiLCJqdGkiOiJsb2NhbGhvc3Q6OnAubG9wZXoiLCJuYW1lIjoiUGFuY2hvIExcdTAwZjNwZXoiLCJwaWN0dXJlIjpudWxsLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJwLmxvcGV6Iiwicm9sZXMiOltdLCJpYXQiOjE3MDc3OTM4NzJ9.epvDSGh4E20DRyVRA5WpH6kszDx458984cxuRIASjEg',
  roles: ['staff', 'publisher'],
  permissions: [
    {
      resource: 'a',
      value: 'ALL',
      access: 'ALLOW',
      scope: 'ALL'
    },
    {
      resource: 'a',
      value: 'ALL',
      access: 'ALLOW',
      scope: 'XXXXX'
    },
    {
      resource: 'b',
      value: 'ALL',
      access: 'DENY',
      scope: 'ALL'
    },
    {
      resource: 'b',
      value: 'VIEW',
      access: 'ALLOW',
      scope: 'YYYY'
    },
    {
      resource: 'c',
      value: 'VIEW',
      access: 'DENY'
    },
    {
      resource: 'c',
      value: 'ALL',
      access: 'ALLOW'
    }
  ]
};
describe('Tests generales para auth', async () => {
  test('Test login and session data', async () => {
    const username = 'p.lopez';
    const password = 'demo###';
    const result = await login(queryExecutor, username, password);
    expect(result?.user.fullName).toBeTruthy();
    const jwt = result?.jwt;
    expect(jwt).toBeTruthy();
    const options: RequestInit = {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    };
    const queryExecutorAuth = createQueryExecutor(API_URL, undefined, options);

    let sessionData;
    try {
      sessionData = await getSessionData(queryExecutorAuth);
    } catch (error) {
      console.log('ERROR', error);
    }

    expect(sessionData?.user.username).toBeTruthy();
  });

  test('Test isSiged', () => {
    clearAuthSessionData();
    const signed = isSigned();
    expect(signed).toBeFalsy();
    setAuthSessionData(sessionData);
    const signedOk = isSigned();
    expect(signedOk).toBeTruthy();
  });

  test('Test getAuthUser', () => {
    clearAuthSessionData();

    setAuthSessionData(sessionData);
    const user = getAuthUser();
    expect(user).toBeTruthy();
  });
  test('Test Roles', () => {
    clearAuthSessionData();

    setAuthSessionData(sessionData);
    const roles = getRoles();
    expect(roles.length).toBeTruthy();

    const hasAdminRole = hasRole('admin');
    expect(hasAdminRole).toBeFalsy();
    const hasStaffRole = hasRole('staff');
    expect(hasStaffRole).toBeTruthy();

    const checkSomeRoles = hasSomeRoles(['folk', 'author']);
    expect(checkSomeRoles).toBeFalsy();
    const checkSomeRolesOK = hasSomeRoles(['staff', 'author']);
    expect(checkSomeRolesOK).toBeTruthy();

    const checkALLRoles = hasAllRoles(['staff', 'author']);
    expect(checkALLRoles).toBeFalsy();

    const checkALLRolesOk = hasAllRoles(['staff', 'publisher']);
    expect(checkALLRolesOk).toBeTruthy();
  });

  test('Test Permissions', () => {
    clearAuthSessionData();
    setAuthSessionData(sessionData);

    const permissions = getPermissions();
    expect(permissions).toBeTruthy();

    const permissionViewA = hasPermission('a', 'VIEW');
    expect(permissionViewA).toBeTruthy();
    const permissionViewAScoped = hasPermission('a', 'VIEW', 'ALL');
    expect(permissionViewAScoped).toBeTruthy();
    const permissionViewAScopedBad = hasPermission('a', 'VIEW', 'OWNERS');
    expect(permissionViewAScopedBad).toBeFalsy();

    const permissionBDeny = hasPermission('b', 'VIEW');
    expect(permissionBDeny).toBeFalsy();

    const permissionBViewScopedAllow = hasPermission('b', 'VIEW', 'ALL');
    expect(permissionBViewScopedAllow).toBeFalsy();

    const permissionSome = hasSomePermissions(['a', 'b'], ['VIEW']);
    expect(permissionSome).toBeTruthy();
    const permissionSomeScoped = hasSomePermissions(['b'], ['VIEW'], ['ALL']);
    expect(permissionSomeScoped).toBeFalsy();

    const permissionAll = hasAllPermissions(['a', 'b'], ['VIEW']);
    expect(permissionAll).toBeFalsy();
    const permissionAllOk = hasAllPermissions(['a', 'b'], ['VIEW'], ['ALL']);
    expect(permissionAllOk).toBeFalsy();
  });

  test('Test getJWT', () => {
    clearAuthSessionData();
    setAuthSessionData(sessionData);
    const jwt = getJWT();
    expect(jwt).toBeTruthy();
  });
  test('Test extractJWTData', () => {
    clearAuthSessionData();
    setAuthSessionData(sessionData);
    const jwtData = extractJWTDataFromSession<AuthJWTData>();
    expect(jwtData).toBeTruthy();
    expect(jwtData?.sub).toBe('p.lopez');
  });
});
