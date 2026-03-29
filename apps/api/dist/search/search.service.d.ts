import { HospitalService } from '../hospital/hospital.service';
import { DoctorService } from '../doctor/doctor.service';
import { DatabaseService } from '../database/database.service';
type SearchResult = {
    hospitals: unknown[];
    doctors: unknown[];
};
export declare class SearchService {
    private readonly hospitalService;
    private readonly doctorService;
    private readonly prisma;
    private readonly cacheTtlMs;
    private readonly searchCache;
    constructor(hospitalService: HospitalService, doctorService: DoctorService, prisma: DatabaseService);
    globalSearch(query: string): Promise<SearchResult>;
    cleanupTestData(): Promise<{
        message: string;
    }>;
}
export {};
