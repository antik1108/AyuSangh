import { CommunityService } from './community.service';
export declare class CommunityController {
    private readonly communityService;
    constructor(communityService: CommunityService);
    getPosts(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        authorId: string;
        title: string;
        content: string;
    }[]>;
    createPost(req: any, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        authorId: string;
        title: string;
        content: string;
    }>;
}
