import { CommunityRepository } from './community.repository';
export declare class CommunityService {
    private readonly repo;
    constructor(repo: CommunityRepository);
    getAllPosts(): any;
    createPost(data: any): Promise<T>;
}
