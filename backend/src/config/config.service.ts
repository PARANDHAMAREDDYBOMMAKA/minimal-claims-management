import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';

@Injectable()
export class ConfigService {
    private readonly envConfig: { [key: string]: string };

    constructor() {
        dotenv.config();
        this.envConfig = Object.keys(process.env).reduce((acc, key) => {
            if (process.env[key] !== undefined) {
                acc[key] = process.env[key] as string;
            }
            return acc;
        }, {} as { [key: string]: string });
    }

    get(key: string): string {
        return this.envConfig[key];
    }

    getNumber(key: string): number {
        return Number(this.envConfig[key]);
    }

    getBoolean(key: string): boolean {
        return this.envConfig[key] === 'true';
    }

    get jwtSecret(): string {
        return this.get('JWT_SECRET');
    }

    get jwtExpiresIn(): string {
        return this.get('JWT_EXPIRES_IN') || '1d';
    }

    get mongoUri(): string {
        return this.get('MONGO_URI');
    }

    get port(): number {
        return this.getNumber('PORT') || 3000;
    }
}