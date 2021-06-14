import { Module } from '@nestjs/common'

import { PrismaService } from '@/prisma.service'

import { RecommendedController } from './recommended.controller'
import { RecommendedService } from './recommended.service'

@Module({
  controllers: [RecommendedController],
  providers: [RecommendedService, PrismaService],
})
export class RecommendedModule {}
