export declare abstract class BaseRepository<T, CreateInput, UpdateInput> {
    protected readonly model: {
        findUnique: (args: any) => Promise<T | null>;
        findMany: (args?: any) => Promise<T[]>;
        create: (args: {
            data: CreateInput;
        }) => Promise<T>;
        update: (args: {
            where: {
                id: string;
            };
            data: UpdateInput;
        }) => Promise<T>;
        delete: (args: {
            where: {
                id: string;
            };
        }) => Promise<T>;
    };
    protected constructor(model: {
        findUnique: (args: any) => Promise<T | null>;
        findMany: (args?: any) => Promise<T[]>;
        create: (args: {
            data: CreateInput;
        }) => Promise<T>;
        update: (args: {
            where: {
                id: string;
            };
            data: UpdateInput;
        }) => Promise<T>;
        delete: (args: {
            where: {
                id: string;
            };
        }) => Promise<T>;
    });
    findById(id: string): Promise<T | null>;
    findAll(): Promise<T[]>;
    create(data: CreateInput): Promise<T>;
    update(id: string, data: UpdateInput): Promise<T>;
    delete(id: string): Promise<T>;
}
