import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Get,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'

import { AddTagDto, GenerateTagsDto } from './dto'
import { TagsService } from './tags.service'

@Controller()
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  async find(
    @Query('userId', ParseIntPipe) userId: number,
    @Query('playlistId', ParseIntPipe) playlistId: number,
  ) {
    return this.tagsService.find(userId, playlistId)
  }

  @Post('generate')
  @HttpCode(HttpStatus.ACCEPTED)
  async generate(@Body() data: GenerateTagsDto) {
    this.tagsService.generate(data)
  }

  @Post()
  async add(@Body() data: AddTagDto) {
    return this.tagsService.add(data)
  }

  @Delete(':tagId')
  async remove(
    @Param('tagId', ParseIntPipe) tagId: number,
    @Query('songId', ParseIntPipe) songId: number,
  ) {
    return this.tagsService.remove(tagId, songId)
  }
}
