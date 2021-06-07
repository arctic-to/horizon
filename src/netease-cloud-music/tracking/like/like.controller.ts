import {
  Controller,
  Get,
  Post,
  Body,
  ParseIntPipe,
  Query,
} from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { LikeService } from './like.service'

@Controller()
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post()
  async create(@Body() data: Prisma.NeteaseCloudMusicLikeSongEventCreateInput) {
    return this.likeService.create(data)
  }

  @Get()
  async findAllByUserId(@Query('userId', ParseIntPipe) userId: number) {
    return this.likeService.findAllByUserId(userId)
  }
}
