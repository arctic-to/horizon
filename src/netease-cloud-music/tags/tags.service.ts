import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { PrismaService } from '@/prisma.service'

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.NeteaseCloudMusicTagCreateInput) {
    return this.prisma.neteaseCloudMusicTag.create({ data })
  }

  async update(id: number, data: Prisma.NeteaseCloudMusicTagUpdateInput) {
    return this.prisma.neteaseCloudMusicTag.update({ where: { id }, data })
  }

  async delete(id: number) {
    return this.prisma.neteaseCloudMusicTag.delete({ where: { id } })
  }
}
