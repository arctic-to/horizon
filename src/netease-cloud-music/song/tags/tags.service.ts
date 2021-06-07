import { Injectable } from '@nestjs/common'
import Prisma from '@prisma/client'
import { isHangul } from 'hangul-js'
import { isKana, isKanji, isRomaji } from 'wanakana'

import { fetchPlaylistDetail } from '@/netease-cloud-music/request'
import { fetchSongDetail } from '@/netease-cloud-music/request/song/detail'
import { PrismaService } from '@/prisma.service'

import { AddTagDto, GenerateTagsDto } from './dto'

enum Language {
  English = 'English',
  Chinese = '中文',
  Japanese = '日本語',
  Korean = '한국어',
}

function getTagNameBySongName(songName: string) {
  const charArray = [...songName]
  if (charArray.some(isKana)) return Language.Japanese
  if (charArray.some(isHangul)) return Language.Korean
  if (charArray.some(isKanji)) return Language.Chinese
  if (charArray.every(isRomaji)) return Language.English
}

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async ensureTagsExist(userId: number) {
    const count = this.prisma.neteaseCloudMusicTag.count({
      where: { userId },
    })
    if (!count) {
      this.prisma.neteaseCloudMusicTag.createMany({
        data: Object.values(Language).map((name) => ({
          userId,
          name,
        })),
      })
    }
    return this.prisma.neteaseCloudMusicTag.findMany({
      where: { userId },
    })
  }

  async find(userId: number, songIds: number[]) {
    return this.prisma.neteaseCloudMusicSong
      .findMany({
        where: { userId, songId: { in: songIds } },
        include: { tags: true },
      })
      .then((songs) => songs.map((song) => song.tags))
  }

  async generate(data: GenerateTagsDto) {
    const playlistDetailRes = await fetchPlaylistDetail(data.playlistId)
    const ids = playlistDetailRes.data.playlist.trackIds.map(({ id }) => id)
    const songDetailRes = await fetchSongDetail(ids)

    const tagMap = new Map<string, Prisma.NeteaseCloudMusicTag>()
    const tags = await this.ensureTagsExist(data.userId)
    tags.forEach((tag) => tagMap.set(tag.name, tag))

    const result: Prisma.NeteaseCloudMusicTag[][] = []
    const promises = songDetailRes.data.songs.map((song) => {
      const tagName = getTagNameBySongName(song.name)
      if (!tagName) {
        return
      }

      const tag = tagMap.get(tagName)!
      result.push([tag])
      return this.prisma.neteaseCloudMusicSong.create({
        data: {
          songId: song.id,
          userId: data.userId,
          tags: { connect: [{ id: tag.id }] },
        },
      })
    })

    return Promise.all(promises).then(() => result)
  }

  async add(data: AddTagDto) {
    return this.prisma.neteaseCloudMusicSong.updateMany({
      where: data,
      data,
    })
  }

  async remove(id: number, songId: number) {
    const tag = await this.prisma.neteaseCloudMusicTag.findUnique({
      where: { id },
      select: { songs: true },
    })
    const newSongs = tag?.songs.filter((song) => song.songId !== songId) ?? []

    return this.prisma.neteaseCloudMusicTag.update({
      where: { id },
      data: { songs: { set: newSongs } },
    })
  }
}
