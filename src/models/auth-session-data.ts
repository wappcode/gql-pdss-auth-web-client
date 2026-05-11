
export type PermissionAccess = 'DENY' | 'ALLOW';
export interface ResourcePermission {
  resource: string;
  access: PermissionAccess;
  value: string;
  scope?: string;
}
