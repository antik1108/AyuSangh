import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
export declare class DatabaseService implements OnModuleInit, OnModuleDestroy {
    private readonly prismaClient;
    constructor();
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    get client(): PrismaClient;
    get user(): PrismaClient['user'];
    get hospital(): PrismaClient['hospital'];
    get doctor(): PrismaClient['doctor'];
    get review(): PrismaClient['review'];
    get refreshToken(): PrismaClient['refreshToken'];
    get favourite(): PrismaClient['favourite'];
    get institutionImage(): PrismaClient['institutionImage'];
    get location(): PrismaClient['location'];
    get communityPost(): PrismaClient['communityPost'];
    get cost(): PrismaClient['cost'];
    get accreditation(): PrismaClient['accreditation'];
    get $queryRaw(): PrismaClient['$queryRaw'];
    get $transaction(): PrismaClient['$transaction'];
}
