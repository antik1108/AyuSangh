export declare abstract class BaseRepository<T> {
    protected readonly model: any;
    protected constructor(model: any);
    findById(id: string): Promise<T | null>;
    findAll(): Promise<T[]>;
    create(data: any): Promise<T>;
    update(id: string, data: any): Promise<T>;
    delete(id: string): Promise<T>;
}
