export declare class AdminUserDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}
export declare class LocationDto {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}
export declare class RegisterHospitalDto {
    name: string;
    description?: string;
    admin: AdminUserDto;
    location: LocationDto;
}
