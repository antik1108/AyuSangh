import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
export declare class DatabaseService implements OnModuleInit, OnModuleDestroy {
    private readonly prismaClient;
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    get client(): PrismaClient;
    get user(): any;
    get hospital(): any;
    get doctor(): any;
    get review(): any;
    get refreshToken(): any;
    get favourite(): any;
    get institutionImage(): any;
    get location(): any;
    get communityPost(): any;
    get cost(): any;
    get department(): any;
    get $queryRaw(): any;
    get $transaction(): any;
}
