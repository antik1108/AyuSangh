import { CommunityRepository } from './community.repository';
export declare class CommunityService {
    private readonly repo;
    constructor(repo: CommunityRepository);
    getAllPosts(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        authorId: string;
        title: string;
        content: string;
    }[]>;
    createPost(data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        authorId: string;
        title: string;
        content: string;
    }>;
}
