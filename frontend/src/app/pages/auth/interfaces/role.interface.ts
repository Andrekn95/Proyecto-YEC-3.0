export interface RoleInterface {
  id: string;
  name: string;
  code: string;
  icon: string;
}

export interface CreateRoleDto extends Omit<RoleInterface, 'id'> {
}

export interface UpdateRoleDto extends Partial<Omit<RoleInterface, 'id'>> {
}

export interface ReadRoleDto extends Partial<RoleInterface> {
}
