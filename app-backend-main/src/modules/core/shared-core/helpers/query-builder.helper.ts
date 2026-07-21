import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

export class QueryBuilderHelper {
  static applySearch<T extends ObjectLiteral>(
    query: SelectQueryBuilder<T>,
    alias: string,
    fields: readonly string[],
    search?: string,
  ): void {
    if (!search?.trim()) {
      return;
    }

    const where = fields.map((field) => `${alias}.${field} ILIKE :search`).join(' OR ');

    query.andWhere(`(${where})`, {
      search: `%${search.trim()}%`,
    });
  }

  static applySorting<T extends ObjectLiteral>(
    query: SelectQueryBuilder<T>,
    alias: string,
    sort: string,
    order: 'ASC' | 'DESC',
  ): void {
    query.orderBy(`${alias}.${sort}`, order);
  }

  static applyPagination<T extends ObjectLiteral>(
    query: SelectQueryBuilder<T>,
    page = 1,
    limit = 10,
  ): void {
    query.skip((page - 1) * limit).take(limit);
  }
}
