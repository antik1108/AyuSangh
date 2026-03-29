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
  private readonly prismaClient = new PrismaClient();

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

  get user() {
    return this.prismaClient.user;
  }

  get hospital() {
    return this.prismaClient.hospital;
  }

  get doctor() {
    return this.prismaClient.doctor;
  }

  get review() {
    return this.prismaClient.review;
  }

  get refreshToken() {
    return this.prismaClient.refreshToken;
  }

  get favourite() {
    return this.prismaClient.favourite;
  }

  get institutionImage() {
    return this.prismaClient.institutionImage;
  }

  get location() {
    return this.prismaClient.location;
  }

  get communityPost() {
    return this.prismaClient.communityPost;
  }

  get cost() {
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
  get $queryRaw() {
    return this.prismaClient.$queryRaw.bind(this.prismaClient);
  }

  /**
   * Transaction support for atomic multi-operation sequences
   * @example
   * await this.database.$transaction(async (tx) => { ... })
   */
  get $transaction() {
    return this.prismaClient.$transaction.bind(this.prismaClient);
  }
}
