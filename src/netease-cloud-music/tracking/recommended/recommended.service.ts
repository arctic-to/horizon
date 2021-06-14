import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { PrismaService } from '@/prisma.service'

@Injectable()
export class RecommendedService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.NeteaseCloudMusicRecommendedSongsCreateInput) {
    return this.prisma.neteaseCloudMusicRecommendedSongs.create({ data })
  }

  async findAllByUserId(userId: number) {
    return this.prisma.neteaseCloudMusicRecommendedSongs.findMany({
      where: { userId },
    })
  }
}
