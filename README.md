# gql-pdss-auth-web-client

Utility library for authentication session handling in browser applications using graphql-client-utilities.

Best compatibility is with the PHP API package wappcode/gql-pdss-auth.

## PHP Backend Setup

Install the recommended PHP auth API package:

```bash
composer require wappcode/gql-pdss-auth
```

The library can also be used with other login/authentication processes.
In that case, use a custom request to fetch the authenticated user/session object and store it with setAuthSessionData.
The user/session data must include:

- roles: string[]
- permissions: string[]

Each permission string must use one of these formats:

- resource:permission_value:scope
- resource:permission_value

scope can be undefined. Example values:

- post:create
- post:view

Only allowed permissions should be included in the permissions list.

## Quick Start

```ts
import {
  setAuthStorage,
  setAuthStorageKey,
  setAuthStorageLifetime,
  login,
  hasRole,
  getUser
} from 'gql-pdss-auth-web-client';
import { createQueryExecutor } from 'graphql-client-utilities';

const queryExecutor = createQueryExecutor('https://your-api/graphql');

setAuthStorage('LOCALSTORAGE');
setAuthStorageKey('my-app-auth');
setAuthStorageLifetime(30 * 60 * 1000);

const session = await login(queryExecutor, 'user', 'password');
const isAdmin = hasRole<{ roles: string[] }>('admin');
const currentUser = getUser<typeof session>();
```

## Public API

The package entrypoint exports:

- Everything from src/lib/index.ts
- Everything from src/models/index.ts

## Authentication Utilities

### Session and user helpers

- isSigned(): boolean
  - Returns true when session data exists in the configured storage.

```ts
import { isSigned } from 'gql-pdss-auth-web-client';

const signedIn = isSigned();
```

- getUser<T>(): T | undefined
  - Returns current session data as generic type T.

```ts
import { getUser } from 'gql-pdss-auth-web-client';

type SessionUser = { username: string; roles: string[] };
const user = getUser<SessionUser>();
```

### Role helpers

- getRoles<T extends { roles: string[] }>(): string[]
  - Reads roles from current session object.

- hasRole<T extends { roles: string[] }>(role: string): boolean
  - Returns true if current user roles include role.

- hasAnyRole<T extends { roles: string[] }>(roles: string[]): boolean
  - Returns true if at least one provided role is present in user roles.

- hasAllRoles<T extends { roles: string[] }>(roles: string[]): boolean
  - Returns true when every user role is included in roles.

```ts
import { getRoles, hasRole, hasAnyRole, hasAllRoles } from 'gql-pdss-auth-web-client';

type RoleData = { roles: string[] };

const roles = getRoles<RoleData>();
const canPublish = hasRole<RoleData>('publisher');
const hasOne = hasAnyRole<RoleData>(['editor', 'publisher']);
const allMatch = hasAllRoles<RoleData>(['staff', 'publisher']);
```

### Permission helpers

- mapStringToPermission(permissionString: string): ResourcePermission
  - Converts resource:value:scope string into a permission object with access set to ALLOW.

- getPermissions<T extends { permissions: string[] }>(): ResourcePermission[]
  - Reads and maps permission strings from session data.

- findPermission<T extends { permissions: string[] }>(resource: string, permissionValue: string): ResourcePermission | undefined
  - Returns first ALLOW permission matching resource and permissionValue.
  - permission value ALL also matches.

- hasPermission(resource: string, permissionValue: string, scope?: string): boolean
  - Validates permission and optional scope.

- hasAnyPermission(resources: string[], permissionValues: string[], scopes?: string[]): boolean
  - Returns true if any combination matches.

- hasAllPermissions(resources: string[], permissionValues: string[], scopes?: string[]): boolean
  - Returns true only if all combinations match.

```ts
import {
  mapStringToPermission,
  getPermissions,
  findPermission,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions
} from 'gql-pdss-auth-web-client';

const parsed = mapStringToPermission('orders:VIEW:OWN');

type PermissionData = { permissions: string[] };
const permissions = getPermissions<PermissionData>();
const orderView = findPermission<PermissionData>('orders', 'VIEW');
const canView = hasPermission('orders', 'VIEW');
const canAny = hasAnyPermission(['orders', 'products'], ['VIEW', 'EDIT']);
const canAll = hasAllPermissions(['orders'], ['VIEW', 'EDIT'], ['OWN']);
```

### GraphQL auth helpers

- getAuthenticatedUserFragment(): GQLQueryObject
  - Returns default SessionData fragment used by login and getAuthenticatedUser.

- login<T>(queryExecutor: QueryExecutor, username: string, password: string, fragment?: GQLQueryData): Promise<T | undefined>
  - Executes login query.
  - Stores returned session data using current storage configuration.

- logout(queryExecutor: QueryExecutor): Promise<boolean>
  - Executes logout mutation.
  - Clears stored session data only when mutation returns true.

- getAuthenticatedUser(queryExecutor: QueryExecutor, fragment?: GQLQueryData): Promise<AuthenticatedUser | undefined>
  - Queries current session data from server and stores it.

```ts
import {
  getAuthenticatedUserFragment,
  login,
  logout,
  getAuthenticatedUser
} from 'gql-pdss-auth-web-client';
import { createQueryExecutor } from 'graphql-client-utilities';

const executor = createQueryExecutor('https://your-api/graphql');

const fragment = getAuthenticatedUserFragment();
const session = await login(executor, 'user', 'pass', fragment);

const authenticatedUser = await getAuthenticatedUser(executor);
const closed = await logout(executor);
```

## Session Storage Utilities

### Configuration

- setAuthStorageLifetime(timelifeInMiliseconds: number): void
  - Sets session lifetime in milliseconds.

- getAuthStorageLifetime(): number
  - Returns configured lifetime.
  - Default is 1800000 (30 minutes).

- setAuthStorageKey(key: string): void
  - Sets storage key name.

- getAuthStorageKey(): string
  - Returns storage key.
  - Default is gqlpdssauthsessionstoragekey.

- setAuthStorage(storage: AuthSessionStorage): void
  - Sets storage backend: SCRIPT, LOCALSTORAGE, SESSIONSTORAGE, or COOKIES.

- getAuthStorage(): AuthSessionStorage
  - Returns configured backend.
  - Default is SCRIPT.

```ts
import {
  setAuthStorage,
  setAuthStorageKey,
  setAuthStorageLifetime,
  getAuthStorage,
  getAuthStorageKey,
  getAuthStorageLifetime
} from 'gql-pdss-auth-web-client';

setAuthStorage('SESSIONSTORAGE');
setAuthStorageKey('auth-session');
setAuthStorageLifetime(15 * 60 * 1000);

console.log(getAuthStorage(), getAuthStorageKey(), getAuthStorageLifetime());
```

### Read and write session data

- getAuthSessionData<T>(): T | undefined
  - Reads session data from configured backend.

- setAuthSessionData<T>(data: T): T
  - Writes session data to configured backend and returns input data.

- clearAuthSessionData(): void
  - Clears session data from configured backend.

- readSessionDataFromMemory<T>(): T | undefined
- readSessionDataFromLocalStorage<T>(): T | undefined
- readSessionDataFromSessionStorage<T>(): T | undefined
- readSessionDataFromCookies<T>(): T | undefined
- writeSessionDataToMemory<T>(data: T, lifetimeInMiliSeconds: number): void
- writeSessionDataToLocalStorage<T>(data: T, lifetimeInMiliSeconds: number): void
- writeSessionDataToSessionStorage<T>(data: T, lifetimeInMiliSeconds: number): void
- writeSessionDataToCookies<T>(data: T, lifetimeInMiliSeconds: number): void
- clearSessionDataFromMemory(): void
- clearSessionDataFromLocalStorage(): void
- clearSessionDataFromSessionStorage(): void
- clearSessionDataFromCookies(): void

```ts
import {
  setAuthStorage,
  setAuthSessionData,
  getAuthSessionData,
  clearAuthSessionData
} from 'gql-pdss-auth-web-client';

type Session = {
  username: string;
  roles: string[];
  permissions: string[];
};

setAuthStorage('SCRIPT');
setAuthSessionData<Session>({
  username: 'p.lopez',
  roles: ['staff'],
  permissions: ['orders:VIEW:ALL']
});

const current = getAuthSessionData<Session>();
clearAuthSessionData();
```

### JWT helper

- parseJwtPayload<T>(jwt?: string): T | undefined
  - Decodes JWT payload from base64 payload segment.
  - Returns undefined when token is missing or invalid.

```ts
import { parseJwtPayload } from 'gql-pdss-auth-web-client';
import type { AuthJWTData } from 'gql-pdss-auth-web-client';

const payload = parseJwtPayload<AuthJWTData>(jwtToken);
```

## Cookie Utilities

- setCookie(name: string, value: string, lifetimeInMiliSeconds: number): void
  - Sets cookie with expires and path=/.

- getCookie(name: string): string | undefined
  - Reads cookie by name.

```ts
import { setCookie, getCookie } from 'gql-pdss-auth-web-client';

setCookie('lang', 'es', 24 * 60 * 60 * 1000);
const lang = getCookie('lang');
```



## Permission Types

- PermissionAccess
  - Union type: DENY | ALLOW.

- ResourcePermission
  - Permission object used by auth helpers.

```ts
import type { PermissionAccess, ResourcePermission } from 'gql-pdss-auth-web-client';

const access: PermissionAccess = 'ALLOW';
const permission: ResourcePermission = {
  resource: 'orders',
  value: 'VIEW',
  access,
  scope: 'OWN'
};
```

## Session Storage Types

- AuthSessionStorage
  - Union type: SCRIPT | LOCALSTORAGE | SESSIONSTORAGE | COOKIES.

- SessionDataStored<T>
  - Generic persisted structure with data and expires.

```ts
import type { AuthSessionStorage, SessionDataStored } from 'gql-pdss-auth-web-client';

const storage: AuthSessionStorage = 'LOCALSTORAGE';
const saved: SessionDataStored<{ username: string }> = {
  data: { username: 'user1' },
  expires: new Date()
};
```

## JWT Claims Type

- AuthJWTData
  - Interface describing supported JWT claim fields.

```ts
import type { AuthJWTData } from 'gql-pdss-auth-web-client';

const claims: Partial<AuthJWTData> = {
  sub: 'user-id',
  name: 'User Name',
  preferred_username: 'username',
  iss: 'issuer'
};
```

## Authenticated User Type

- AuthenticatedUser
  - Interface for authenticated user returned by auth queries.

```ts
import type { AuthenticatedUser } from 'gql-pdss-auth-web-client';

const user: AuthenticatedUser = {
  fullName: 'Pancho Lopez',
  firstName: 'Pancho',
  lastName: 'Lopez',
  username: 'p.lopez',
  email: 'p.lopez@example.com',
  picture: '',
  roles: ['staff'],
  permissions: ['orders:VIEW:ALL']
};
```

## Notes

- This library targets browser environments because it uses window, document, localStorage, sessionStorage, and atob.
- Configure storage settings once at application startup before login and session reads.
- setAuthStorageKey and setAuthStorage are designed to be called once per runtime instance.
