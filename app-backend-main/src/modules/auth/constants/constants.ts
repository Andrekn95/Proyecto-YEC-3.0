export const IS_PUBLIC_ROUTE_KEY = 'isPublic';
export const ROLES_KEY = 'roles';
// export const MAX_ATTEMPTS = Number(process.env.MAX_ATTEMPTS);
// export const SECURITY_CODE_EXPIRES_IN = Number(process.env.SECURITY_CODE_EXPIRES_IN);

export function resolveMaxAttempts(): number {
  const v = Number(process.env.MAX_ATTEMPTS);
  return Number.isInteger(v) ? v : 5;
}
