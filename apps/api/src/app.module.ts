import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { AdminSessionGuard } from './admin-session.guard';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, PrismaService, AdminSessionGuard],
})
export class AppModule {}
