import { createNamespace } from 'cls-hooked';

export const auditNamespace = createNamespace('audit-context');

export const setCurrentUser = (user: any) => {
  auditNamespace.set('user', user);
};

export const getCurrentUser = () => {
  return auditNamespace.get('user');
};
