import { PartialType } from '@nestjs/mapped-types';
import { RegisterDoctorDto } from './register-doctor.dto';

export class UpdateDoctorDto extends PartialType(RegisterDoctorDto) {}
