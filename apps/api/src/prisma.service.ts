import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

function getDatabaseUrl(): string {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;

  // Try to load from root .env or apps/api/.env
  const pathsToTry = [
    path.join(process.cwd(), '.env'),
    path.join(process.cwd(), 'apps/api/.env'),
    path.join(__dirname, '../../.env'),
    path.join(__dirname, '../../../.env'),
    path.join(__dirname, '../.env'),
  ];

  for (const envPath of pathsToTry) {
    try {
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8');
        const match = content.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/);
        if (match && match[1]) {
          return match[1].trim();
        }
      }
    } catch (e) {
      // Ignore reading errors
    }
  }

  return 'mysql://root@localhost:3306/contest_voting_db';
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      datasources: {
        db: {
          url: getDatabaseUrl(),
        },
      },
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ Connected to MySQL database via Prisma.');
    } catch (err) {
      console.error('⚠️ Could not connect to MySQL database via Prisma. Fallback to local DB file mode.', err);
    }
  }
}
