import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Get,
  Query,
  ParseArrayPipe,
} from '@nestjs/common'

import { AddTagDto, GenerateTagsDto } from './dto'
import { TagsService } from './tags.service'

@Controller()
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  async find(
    @Query('userId', ParseIntPipe) userId: number,
    @Query('songIds', ParseArrayPipe) songIds: number[],
  ) {
    return this.tagsService.find(userId, songIds)
  }

  @Post('generate')
  async generate(@Body() data: GenerateTagsDto) {
    return this.tagsService.generate(data)
  }

  @Post()
  async add(@Body() data: AddTagDto) {
    return this.tagsService.add(data)
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Body('songId') songId: number,
  ) {
    return this.tagsService.remove(id, songId)
  }
}
