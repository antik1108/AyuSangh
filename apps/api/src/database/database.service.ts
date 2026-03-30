import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * DatabaseService
 *
 * Provides a singleton PrismaClient instance with proper lifecycle management.
 * This service follows NestJS best practices by using composition over inheritance,
 * ensuring type safety and proper dependency injection.
 *
 * @example
 * constructor(private database: DatabaseService) {}
 * const refreshToken = await this.database.refreshToken.create({ ... });
 */
@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly prismaClient: PrismaClient;

  constructor() {
    this.prismaClient = new PrismaClient();
  }

  /**
   * Lifecycle hook - established database connection on module initialization
   */
  async onModuleInit(): Promise<void> {
    await this.prismaClient.$connect();
  }

  /**
   * Lifecycle hook - gracefully closes database connection on module destruction
   */
  async onModuleDestroy(): Promise<void> {
    await this.prismaClient.$disconnect();
  }

  /**
   * Direct access to PrismaClient for advanced operations and type-safe model access
   * All Prisma models (user, hospital, doctor, etc.) are fully typed and accessible
   */
  get client(): PrismaClient {
    return this.prismaClient;
  }

  // ============================================================
  // Type-safe model delegates
  // Exposing model accessors with full type support
  // ============================================================

  /**
   * User model delegate - fully typed access to user operations
   */
  get user(): PrismaClient['user'] {
    return this.prismaClient.user;
  }

  /**
   * Hospital model delegate - fully typed access to hospital operations
   */
  get hospital(): PrismaClient['hospital'] {
    return this.prismaClient.hospital;
  }

  /**
   * Doctor model delegate - fully typed access to doctor operations
   */
  get doctor(): PrismaClient['doctor'] {
    return this.prismaClient.doctor;
  }

  /**
   * Review model delegate - fully typed access to review operations
   */
  get review(): PrismaClient['review'] {
    return this.prismaClient.review;
  }

  /**
   * RefreshToken model delegate - fully typed access to refresh token operations
   */
  get refreshToken(): PrismaClient['refreshToken'] {
    return this.prismaClient.refreshToken;
  }

  /**
   * Favourite model delegate - fully typed access to favourite operations
   */
  get favourite(): PrismaClient['favourite'] {
    return this.prismaClient.favourite;
  }

  /**
   * InstitutionImage model delegate - fully typed access to institution image operations
   */
  get institutionImage(): PrismaClient['institutionImage'] {
    return this.prismaClient.institutionImage;
  }

  /**
   * Location model delegate - fully typed access to location operations
   */
  get location(): PrismaClient['location'] {
    return this.prismaClient.location;
  }

  /**
   * CommunityPost model delegate - fully typed access to community post operations
   */
  get communityPost(): PrismaClient['communityPost'] {
    return this.prismaClient.communityPost;
  }

  /**
   * Cost model delegate - fully typed access to cost operations
   */
  get cost(): PrismaClient['cost'] {
    return this.prismaClient.cost;
  }

  // ============================================================
  // Prisma client methods for advanced operations
  // ============================================================

  /**
   * Direct SQL query execution for complex queries
   * @example
   * const result = await this.database.$queryRaw`SELECT ...`
   */
  get $queryRaw(): PrismaClient['$queryRaw'] {
    return this.prismaClient.$queryRaw.bind(this.prismaClient);
  }

  /**
   * Transaction support for atomic multi-operation sequences
   * @example
   * await this.database.$transaction(async (tx) => { ... })
   */
  get $transaction(): PrismaClient['$transaction'] {
    return this.prismaClient.$transaction.bind(this.prismaClient);
  }
}
