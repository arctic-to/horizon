import { Injectable } from '@nestjs/common'
import { NeteaseCloudMusicTag } from '@prisma/client'
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

  async find(userId: number, songIds: number[]) {
    return this.prisma.neteaseCloudMusicSong
      .findMany({
        where: { userId, songId: { in: songIds } },
        include: { tags: true },
      })
      .then((songs) => songs.map((song) => song.tags))
  }

  async generate({ userId, playlistId }: GenerateTagsDto) {
    const playlistDetailRes = await fetchPlaylistDetail(playlistId)
    const ids = playlistDetailRes.data.playlist.trackIds.map(({ id }) => id)
    const songDetailRes = await fetchSongDetail(ids)

    const tagMap = new Map<string, NeteaseCloudMusicTag>()
    const tags = await this.ensureTagsExist(userId)
    tags.forEach((tag) => tagMap.set(tag.name, tag))

    for (const song of songDetailRes.data.songs) {
      const tagName = getTagNameBySongName(song.name)
      if (!tagName) continue

      const tag = tagMap.get(tagName)!
      const songRecord = await this.prisma.neteaseCloudMusicSong.findFirst({
        where: { userId, songId: song.id },
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
            songId: song.id,
            tags: { connect: [{ id: tag.id }] },
          },
        })
      }
    }
  }

  async add({ userId, songId, tagId, tagName }: AddTagDto) {
    if (tagId === undefined && !tagName) return

    const song = await this.prisma.neteaseCloudMusicSong.findFirst({
      where: { songId },
    })
    if (!song) return

    return this.prisma.neteaseCloudMusicSong.update({
      where: { id: song.id },
      data: {
        tags:
          tagId !== undefined
            ? { connect: { id: tagId } }
            : { create: { userId, name: tagName! } },
      },
    })
  }

  async remove(tagId: number, songId: number) {
    const tag = await this.prisma.neteaseCloudMusicTag.findUnique({
      where: { id: tagId },
      select: { songs: true },
    })
    const newSongs = tag?.songs.filter((song) => song.songId === songId) ?? []

    return this.prisma.neteaseCloudMusicTag.update({
      where: { id: tagId },
      data: { songs: { set: newSongs.map(({ id }) => ({ id })) } },
    })
  }
}
