import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  SoftRemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { AuditLog } from './audit.entity';
import { getCurrentUser } from './audit-context';
import { isDeepStrictEqual } from 'node:util';

@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface {
  private readonly nonAuditableEntities = new Set(['AuditLog', 'role_user']);

  async afterInsert(event: InsertEvent<any>) {
    await this.log(event, 'CREATE', {
      newData: event.entity,
      entityId: event.entity?.id,
    });
  }

  async afterUpdate(event: UpdateEvent<any>) {
    if (!event.databaseEntity || !event.entity) return;

    const changes = this.getChangedFields(event);

    if (!Object.keys(changes.newChanges).length) return;

    await this.log(event, 'UPDATE', {
      newData: changes.newChanges,
      oldData: changes.oldChanges,
      entityId: event.entity.id,
    });
  }

  async afterRemove(event: RemoveEvent<any>) {
    await this.log(event, 'DELETE', {
      oldData: event.databaseEntity,
      entityId: event.entityId,
    });
  }

  async afterSoftRemove(event: SoftRemoveEvent<any>) {
    await this.log(event, 'SOFT_DELETE', {
      oldData: event.databaseEntity,
      entityId: event.entityId,
    });
  }

  private async log(event, action, data) {
    if (!event.metadata?.tableName) return;

    if (this.nonAuditableEntities.has(event.metadata.name)) return;

    const currentUser = getCurrentUser();

    const repo = event.queryRunner?.connection.getRepository(AuditLog);

    await repo?.save({
      action,
      entity: event.metadata.name,
      auditableId: data.entityId,
      oldData: data.oldData ?? null,
      newData: data.newData ?? null,
      userId: currentUser?.id ?? null,
    });
  }

  private getChangedFields(event: UpdateEvent<any>) {
    const newChanges = {};
    const oldChanges = {};

    for (const column of event.metadata.columns) {
      const key = column.propertyName;

      if (key === 'updatedAt') continue;

      if (!isDeepStrictEqual(event.databaseEntity[key], event.entity![key])) {
        newChanges[key] = event.entity![key];
        oldChanges[key] = event.databaseEntity[key];
      }
    }

    return { newChanges, oldChanges };
  }
}
