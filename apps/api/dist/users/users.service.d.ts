import { DatabaseService } from '../database/database.service';
import { RegisterHospitalDto } from '../auth/dto/register-hospital.dto';
import { RegisterUserDto } from '../auth/dto/register-user.dto';
import { RegisterDoctorDto } from '../auth/dto/register-doctor.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: DatabaseService);
    findOneByEmail(email: string): unknown;
    findOneById(id: string): unknown;
    createPatient(data: RegisterUserDto): unknown;
    createHospitalAdmin(data: RegisterHospitalDto): unknown;
    createDoctor(data: RegisterDoctorDto): unknown;
}
