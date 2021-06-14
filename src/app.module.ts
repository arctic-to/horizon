import { Module } from '@nestjs/common'
import { RouterModule } from 'nest-router'

import { NeteaseCloudMusicModule } from './netease-cloud-music/netease-cloud-music.module'
import { SongModule } from './netease-cloud-music/song/song.module'
import { SongTagsModule } from './netease-cloud-music/song/tags/tags.module'
import { TagsModule } from './netease-cloud-music/tags/tags.module'
import { LikeModule } from './netease-cloud-music/tracking/like/like.module'
import { RecommendedModule } from './netease-cloud-music/tracking/recommended/recommended.module'
import { TrackingModule } from './netease-cloud-music/tracking/tracking.module'
import { routes } from './routes'

@Module({
  imports: [
    RouterModule.forRoutes(routes),
    NeteaseCloudMusicModule,
    TrackingModule,
    RecommendedModule,
    LikeModule,
    TagsModule,
    SongModule,
    SongTagsModule,
  ],
})
export class AppModule {}
