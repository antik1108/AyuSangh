import { AuthService } from '../auth.service';
import { AuthenticatedUser } from '../types';
declare const LocalStrategy_base: any;
export declare class LocalStrategy extends LocalStrategy_base {
    private authService;
    constructor(authService: AuthService);
    validate(email: string, pass: string): Promise<AuthenticatedUser>;
}
export {};
