export const ROLES = ['owner', 'admin', 'manager', 'member', 'viewer'] as const;
export type Role = (typeof ROLES)[number];

export const PERMISSIONS = {
  // Contract
  'contract:create': ['owner', 'admin', 'manager', 'member'],
  'contract:read': ['owner', 'admin', 'manager', 'member', 'viewer'],
  'contract:update': ['owner', 'admin', 'manager', 'member'], // member: own only
  'contract:delete': ['owner', 'admin', 'manager'],

  // Alert
  'alert:create': ['owner', 'admin', 'manager', 'member'],
  'alert:respond': ['owner', 'admin', 'manager'],
  'alert:close': ['owner', 'admin', 'manager'],

  // Task
  'task:create': ['owner', 'admin', 'manager', 'member'],
  'task:update': ['owner', 'admin', 'manager', 'member'], // member: own only

  // Organization management
  'org:manage': ['owner', 'admin'],
  'org:invite': ['owner', 'admin'],
  'org:remove_member': ['owner', 'admin'],
  'org:delete': ['owner'],

  // Team management
  'team:manage': ['owner', 'admin', 'manager'],

  // Admin tooling (playground, debug surfaces, arbitrary-prompt LLM access)
  'admin:access': ['owner', 'admin'],
} as const satisfies Record<string, readonly Role[]>;

export type Permission = keyof typeof PERMISSIONS;

export function hasPermission(role: Role, permission: Permission): boolean {
  return (PERMISSIONS[permission] as readonly string[]).includes(role);
}

/** Check if a role can modify a resource owned by another user */
export function canModifyOthersResource(role: Role): boolean {
  return role === 'owner' || role === 'admin' || role === 'manager';
}
