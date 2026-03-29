import { HospitalService } from './hospital.service';
export declare class HospitalController {
    private readonly hospitalService;
    constructor(hospitalService: HospitalService);
    searchHospitals(name?: string, city?: string): Promise<{
        name: string;
        id: string;
        description: string | null;
        adminId: string;
        locationId: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getHospital(id: string): Promise<{
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
