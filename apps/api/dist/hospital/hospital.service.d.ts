import { HospitalRepository } from './hospital.repository';
export declare class HospitalService {
    private readonly hospitalRepo;
    constructor(hospitalRepo: HospitalRepository);
    search(name?: string, city?: string): Promise<{
        name: string;
        id: string;
        description: string | null;
        adminId: string;
        locationId: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getRepo(): HospitalRepository;
    getProfile(id: string): Promise<{
        name: string;
        id: string;
        description: string | null;
        adminId: string;
        locationId: string;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    registerHospital(data: any): Promise<{
        name: string;
        id: string;
        description: string | null;
        adminId: string;
        locationId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
