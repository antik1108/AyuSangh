import { CommunityRepository } from './community.repository';
export declare class CommunityService {
    private readonly repo;
    constructor(repo: CommunityRepository);
    getAllPosts(): Promise<({
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
    createPost(data: any): Promise<{
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
