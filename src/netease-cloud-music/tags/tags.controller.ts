import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { TagsService } from './tags.service'

@Controller()
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  async create(@Body() data: Prisma.NeteaseCloudMusicTagCreateInput) {
    return this.tagsService.create(data)
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Prisma.NeteaseCloudMusicTagUpdateInput,
  ) {
    return this.tagsService.update(+id, data)
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.tagsService.delete(+id)
  }
}
