import { InstitutionType } from '@prisma/client';
declare class InstitutionLocationDto {
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
}
export declare class CreateInstitutionDto {
    name: string;
    type: InstitutionType;
    description?: string;
    location: InstitutionLocationDto;
    phone?: string;
    services?: string[];
    photos?: string[];
    bookingLink?: string;
}
export {};
