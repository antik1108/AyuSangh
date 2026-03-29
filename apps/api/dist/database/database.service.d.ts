import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
export declare class DatabaseService implements OnModuleInit, OnModuleDestroy {
    private readonly prismaClient;
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    get client(): PrismaClient;
    get user(): import("@prisma/client").Prisma.UserDelegate<import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    get hospital(): import("@prisma/client").Prisma.HospitalDelegate<import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    get doctor(): import("@prisma/client").Prisma.DoctorDelegate<import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    get review(): import("@prisma/client").Prisma.ReviewDelegate<import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    get refreshToken(): import("@prisma/client").Prisma.RefreshTokenDelegate<import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    get favourite(): import("@prisma/client").Prisma.FavouriteDelegate<import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    get institutionImage(): import("@prisma/client").Prisma.InstitutionImageDelegate<import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    get location(): import("@prisma/client").Prisma.LocationDelegate<import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    get communityPost(): import("@prisma/client").Prisma.CommunityPostDelegate<import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    get cost(): import("@prisma/client").Prisma.CostDelegate<import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    get $queryRaw(): <T = unknown>(query: TemplateStringsArray | import("@prisma/client/runtime/library").Sql, ...values: any[]) => import("@prisma/client").Prisma.PrismaPromise<T>;
    get $transaction(): {
        <P extends import("@prisma/client").Prisma.PrismaPromise<any>[]>(arg: [...P], options?: {
            isolationLevel?: import("@prisma/client").Prisma.TransactionIsolationLevel;
        }): import("@prisma/client/runtime/library").JsPromise<import("@prisma/client/runtime/library").UnwrapTuple<P>>;
        <R>(fn: (prisma: Omit<PrismaClient, import("@prisma/client/runtime/library").ITXClientDenyList>) => import("@prisma/client/runtime/library").JsPromise<R>, options?: {
            maxWait?: number;
            timeout?: number;
            isolationLevel?: import("@prisma/client").Prisma.TransactionIsolationLevel;
        }): import("@prisma/client/runtime/library").JsPromise<R>;
    };
}
