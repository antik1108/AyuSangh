import { DatabaseService } from '../../database/database.service';

export abstract class BaseRepository {
  protected constructor(protected readonly database: DatabaseService) {}
}
