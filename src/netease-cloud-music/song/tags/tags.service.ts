import { Injectable } from '@nestjs/common'
import { NeteaseCloudMusicTag } from '@prisma/client'
import { isHangul } from 'hangul-js'
import { isKana, isKanji, isRomaji } from 'wanakana'

import { NcmHttpService } from '@/netease-cloud-music/http/http.service'
import { PrismaService } from '@/prisma.service'

import { AddTagDto, GenerateTagsDto } from './dto'

enum Language {
  English = 'English',
  Chinese = '中文',
  Japanese = '日本語',
  Korean = '한국어',
  Absolute = '纯音乐',
}

@Injectable()
export class TagsService {
  constructor(
    private prisma: PrismaService,
    private httpService: NcmHttpService,
  ) {}

  private async getUncollectedSongDefaultTagName(songId: number) {
    const { data } = await this.httpService
      .fetchSongDetail([songId])
      .toPromise()
    const songName = data.songs[0].name
    if (!songName) return

    const charArray = [...songName]
    if (charArray.some(isKana)) return Language.Japanese
    if (charArray.some(isHangul)) return Language.Korean
    if (charArray.some(isKanji)) return Language.Chinese
    if (charArray.every(isRomaji)) return Language.English
  }

  private async getSongDefaultTagName(songId: number) {
    const { data } = await this.httpService.fetchLyric(songId).toPromise()
    if (data.nolyric) return Language.Absolute
    if (data.uncollected || !data.lrc || typeof data.lrc.lyric !== 'string') {
      return this.getUncollectedSongDefaultTagName(songId)
    }

    const charArray = [...data.lrc.lyric]
    if (charArray.some(isKana)) return Language.Japanese
    if (charArray.some(isHangul)) return Language.Korean

    if (data.tlyric?.lyric) return Language.English
    return this.getUncollectedSongDefaultTagName(songId)
  }

  private async ensureTagsExist(userId: number) {
    const count = await this.prisma.neteaseCloudMusicTag.count({
      where: { userId },
    })
    if (!count) {
      await this.prisma.neteaseCloudMusicTag.createMany({
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

  async find(userId: number, playlistId: number) {
    const { data } = await this.httpService
      .fetchPlaylistDetail(playlistId)
      .toPromise()

    const songIds = data.playlist.trackIds.map(({ id }) => id)
    const songs = await this.prisma.neteaseCloudMusicSong.findMany({
      where: { userId, songId: { in: songIds } },
      include: { tags: { select: { id: true, name: true } } },
    })
    return songs.map((song) => [song.songId, song.tags])
  }

  async generate({ userId, songIds }: GenerateTagsDto) {
    const tagMap = new Map<string, NeteaseCloudMusicTag>()
    const tags = await this.ensureTagsExist(userId)
    tags.forEach((tag) => tagMap.set(tag.name, tag))

    for (const songId of songIds) {
      const defaultTagName = await this.getSongDefaultTagName(songId)
      if (!defaultTagName) continue

      const tag = tagMap.get(defaultTagName)!
      const songRecord = await this.prisma.neteaseCloudMusicSong.findFirst({
        where: { userId, songId },
      })
      if (songRecord) {
        await this.prisma.neteaseCloudMusicSong.update({
          where: { id: songRecord.id },
          data: {
            tags: { set: [{ id: tag.id }] },
          },
        })
      } else {
        await this.prisma.neteaseCloudMusicSong.create({
          data: {
            userId,
            songId,
            tags: { connect: [{ id: tag.id }] },
          },
        })
      }
    }
  }

  async add({ userId, songId, tagId, tagName }: AddTagDto) {
    if (tagId === undefined && !tagName) return

    let song = await this.prisma.neteaseCloudMusicSong.findFirst({
      where: { songId, userId },
    })

    if (!song) {
      song = await this.prisma.neteaseCloudMusicSong.create({
        data: {
          songId,
          userId,
        },
      })
    }

    return this.prisma.neteaseCloudMusicSong.update({
      where: { id: song.id },
      data: {
        tags:
          tagId !== undefined
            ? { connect: { id: tagId } }
            : { create: { userId, name: tagName! } },
      },
      include: { tags: true },
    })
  }

  async remove(songId: number, userId: number, tagId: number) {
    const song = await this.prisma.neteaseCloudMusicSong.findFirst({
      where: { songId, userId },
    })
    if (!song) return

    return this.prisma.neteaseCloudMusicSong.update({
      where: { id: song.id },
      data: { tags: { disconnect: { id: tagId } } },
      include: { tags: true },
    })
  }
}
