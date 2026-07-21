import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MenuEntity, PermissionEntity, UserEntity } from '@auth/entities';

@Entity('roles', { schema: 'auth' })
export class RoleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    nullable: true,
  })
  deletedAt: Date;

  @Column({
    name: 'enabled',
    type: 'boolean',
    default: true,
    comment: 'true=visible, false=no visible',
  })
  enabled: boolean;

  /** Inverse Relationship **/
  @ManyToMany(() => UserEntity, (user) => user.roles)
  @JoinTable({
    name: 'role_user',
    joinColumn: { name: 'role_id' },
    inverseJoinColumn: { name: 'user_id' },
  })
  users: UserEntity[];

  @ManyToMany(() => MenuEntity)
  @JoinTable({
    name: 'menu_role',
    joinColumn: { name: 'role_id' },
    inverseJoinColumn: { name: 'menu_id' },
  })
  menus: MenuEntity[];

  @ManyToMany(() => PermissionEntity)
  @JoinTable({
    name: 'permission_role',
    joinColumn: { name: 'role_id' },
    inverseJoinColumn: { name: 'permission_id' },
  })
  permissions: PermissionEntity[];

  /** Columns **/
  @Column({
    name: 'code',
    type: 'varchar',
    unique: true,
    comment: 'Codigo del rol',
  })
  code: string;

  @Column({
    name: 'name',
    type: 'varchar',
    unique: true,
    comment: 'Nombre del rol',
  })
  name: string;

  @Column({
    name: 'icon',
    type: 'varchar',
    nullable: true,
    comment: 'Icono del rol',
  })
  icon: string;

  /** Before Actions **/
  @BeforeInsert()
  @BeforeUpdate()
  setCode() {
    if (!this.code) {
      return;
    }
    this.code = this.code.toLowerCase().trim();
  }
}
