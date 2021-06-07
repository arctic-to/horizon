import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { PrismaService } from '@/prisma.service'

@Injectable()
export class LikeService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.NeteaseCloudMusicLikeSongEventCreateInput) {
    return this.prisma.neteaseCloudMusicLikeSongEvent.create({ data })
  }

  async findAllByUserId(userId: number) {
    return this.prisma.neteaseCloudMusicLikeSongEvent.findMany({
      where: { userId },
    })
  }
}
