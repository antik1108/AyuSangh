import { JwtPayload } from '../types';
interface ValidatedUser {
    userId: string;
    email: string;
    role: string;
}
declare const JwtStrategy_base: any;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor();
    validate(payload: JwtPayload): Promise<ValidatedUser>;
}
export {};
