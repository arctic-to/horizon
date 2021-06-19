import { Module } from '@nestjs/common'

import { NcmHttpModule } from '@/netease-cloud-music/http/http.module'
import { PrismaService } from '@/prisma.service'

import { TagsController } from './tags.controller'
import { TagsService } from './tags.service'

@Module({
  imports: [NcmHttpModule],
  controllers: [TagsController],
  providers: [TagsService, PrismaService],
})
export class SongTagsModule {}
