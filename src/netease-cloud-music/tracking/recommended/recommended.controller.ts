import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  ParseIntPipe,
} from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { RecommendedService } from './recommended.service'

@Controller()
export class RecommendedController {
  constructor(private readonly recommendedService: RecommendedService) {}

  @Post('songs')
  async create(
    @Body() data: Prisma.NeteaseCloudMusicRecommendedSongsCreateInput,
  ) {
    return this.recommendedService.create(data)
  }

  @Get('songs')
  async findAllByUserId(@Query('userId', ParseIntPipe) userId: number) {
    return this.recommendedService.findAllByUserId(userId)
  }
}
