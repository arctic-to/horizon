import {
  HttpException,
  HttpService,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common'
import axios from 'axios'

import { LyricResponse } from './dto/lyric'
import { PlaylistDetailResponse } from './dto/playlist/detail'
import { SongDetailResponse } from './dto/song/detail'

@Injectable()
export class NcmHttpService {
  private readonly logger = new Logger(NcmHttpService.name)

  constructor(private httpService: HttpService) {
    this.httpService.axiosRef.interceptors.response.use(
      (res) => res,
      (err) => {
        if (axios.isAxiosError(err)) {
          this.logger.error(err.response?.data)
          throw new HttpException(
            err.response?.data,
            err.response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
          )
        }
        throw err
      },
    )
  }

  fetchSongDetail(ids: number[]) {
    return this.httpService.get<SongDetailResponse>(`/song/detail?ids=${ids}`)
  }

  fetchPlaylistDetail(id: number) {
    return this.httpService.get<PlaylistDetailResponse>(
      `/playlist/detail?id=${id}`,
    )
  }

  fetchLyric(id: number) {
    return this.httpService.get<LyricResponse>(`/lyric?id=${id}`)
  }
}
