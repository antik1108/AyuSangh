import { BaseRepository } from '../common/repositories/base.repository';
import { Review } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
export declare class ReviewRepository extends BaseRepository<Review> {
    private readonly prisma;
    constructor(prisma: DatabaseService);
    findByHospital(hospitalId: string): Promise<Review[]>;
    findByDoctor(doctorId: string): Promise<Review[]>;
}
