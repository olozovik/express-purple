import { inject, injectable } from 'inversify';
import { PrismaClient, UserModel } from '@prisma/client';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';

@injectable()
export class PrismaService {
    client: PrismaClient;

    constructor(@inject(TYPES.ILogger) private logger: ILogger) {
        this.client = new PrismaClient();
    }

    async connect(): Promise<void> {
        try {
            await this.client.$connect();
            this.logger.log('[PrismaService] The DB has been successfully connected.');
        } catch (e) {
            if (e instanceof Error) {
                this.logger.error(
                    `[PrismaService] An error occurred while connection to the DB. ${e.message}`,
                );
            }
        }
    }

    async disconnect(): Promise<void> {
        await this.client.$disconnect();
    }
}
