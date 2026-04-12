import { DoctorService } from './doctor.service';
export declare class DoctorController {
    private readonly doctorService;
    constructor(doctorService: DoctorService);
    searchDoctors(specialization?: string): unknown;
    getDoctor(id: string): unknown;
    registerDoctor(data: any): unknown;
}
