import { createQueryExecutor } from 'graphql-client-utilities';
import { describe, expect, test } from 'vitest';
import {
  
  getAuthenticatedUser,
  getPermissions,
  getRoles,
  getUser,
  hasAllPermissions,
  hasAllRoles,
  hasAnyPermission,
  hasAnyRole,
  hasPermission,
  hasRole,
  isSigned,
  login
} from '../src/lib/auth';
import {
  clearAuthSessionData,
  parseJwtPayload,
  setAuthSessionData
} from '../src/lib/session-storage';
import { AuthenticatedUser, AuthJWTData } from '../src/models';
import { API_URL, queryExecutor } from './query-executor';
const jwt = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdXRoX3RpbWUiOjE3MDc3OTM4NzIsInN1YiI6InAubG9wZXoiLCJiaXJ0aF9mYW1pbHlfbmFtZSI6IkxcdTAwZjNwZXoiLCJiaXJ0aF9naXZlbl9uYW1lIjoiUGFuY2hvIiwiZW1haWwiOiJwLmxvcGV6QGRlbW8ubG9jYWwubGFuIiwiZXhpIjoxMjAwLCJleHAiOjE3MDc3OTUwNzIsImZhbWlseV9uYW1lIjoiTFx1MDBmM3BleiIsImdpdmVuX25hbWUiOiJQYW5jaG8iLCJpc3MiOiJsb2NhbGhvc3QiLCJqdGkiOiJsb2NhbGhvc3Q6OnAubG9wZXoiLCJuYW1lIjoiUGFuY2hvIExcdTAwZjNwZXoiLCJwaWN0dXJlIjpudWxsLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJwLmxvcGV6Iiwicm9sZXMiOltdLCJpYXQiOjE3MDc3OTM4NzJ9.epvDSGh4E20DRyVRA5WpH6kszDx458984cxuRIASjEg';

const sessionData: AuthenticatedUser = {
  firstName: 'Pancho',
  lastName: 'López',
  username: 'pancholopez',
  fullName: 'Pancho López',
  roles: ['staff', 'publisher'],
  email:'demo@demo.com',
  permissions: [
    'a:ALL:ALL',
    'a:ALL:XXXXX',
    'b:VIEW:YYYY:',
    'c:ALL'
  ]
  
  
};
describe('Tests generales para auth', async () => {
  test('Test login and session data', async () => {
    const username = 'p.lopez';
    const password = 'demo###';
    const result = await login<AuthenticatedUser>(queryExecutor, username, password);
    expect(result?.fullName).toBeTruthy();
 
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
    const user = getUser();
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

    const checkSomeRoles = hasAnyRole(['folk', 'author']);
    expect(checkSomeRoles).toBeFalsy();
    const checkSomeRolesOK = hasAnyRole(['staff', 'author']);
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

    const permissionBViewScopedAllow = hasPermission('b', 'VIEW', 'ALL');
    expect(permissionBViewScopedAllow).toBeFalsy();

    const permissionSome = hasAnyPermission(['a', 'b'], ['VIEW']);
    expect(permissionSome).toBeTruthy();
    const permissionSomeScoped = hasAllPermissions(['b'], ['VIEW'], ['ALL']);
    expect(permissionSomeScoped).toBeFalsy();

    const permissionAll = hasAllPermissions(['a', 'd'], ['VIEW']);
    expect(permissionAll).toBeFalsy();
    const permissionAllOk = hasAllPermissions(['a', 'b'], ['VIEW'], ['ALL']);
    expect(permissionAllOk).toBeFalsy();
  });


});
