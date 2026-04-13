import { BaseRepository } from '../common/repositories/base.repository';
import { CommunityPost, Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
export declare class CommunityRepository extends BaseRepository<CommunityPost, Prisma.CommunityPostCreateInput, Prisma.CommunityPostUpdateInput> {
    private readonly prisma;
    constructor(prisma: DatabaseService);
    findAll(): Promise<({
        author: {
            id: string;
            email: string;
            role: import("@prisma/client").$Enums.Role;
            firstName: string | null;
            lastName: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        authorId: string;
        title: string;
        content: string;
    })[]>;
    create(data: Prisma.CommunityPostCreateInput): Promise<{
        author: {
            id: string;
            email: string;
            role: import("@prisma/client").$Enums.Role;
            firstName: string | null;
            lastName: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        authorId: string;
        title: string;
        content: string;
    }>;
}
