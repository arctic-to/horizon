// Nested Route: https://github.com/nestjs/nest/issues/255
import { Routes } from 'nest-router'

import { NeteaseCloudMusicModule } from './netease-cloud-music/netease-cloud-music.module'
import { SongModule } from './netease-cloud-music/song/song.module'
import { SongTagsModule } from './netease-cloud-music/song/tags/tags.module'
import { TagsModule } from './netease-cloud-music/tags/tags.module'
import { LikeModule } from './netease-cloud-music/tracking/like/like.module'
import { RecommendedModule } from './netease-cloud-music/tracking/recommended/recommended.module'
import { TrackingModule } from './netease-cloud-music/tracking/tracking.module'

export const routes: Routes = [
  {
    path: '/netease-cloud-music',
    module: NeteaseCloudMusicModule,
    children: [
      {
        path: '/tags',
        module: TagsModule,
      },
      {
        path: '/song',
        module: SongModule,
        children: [
          {
            path: '/tags',
            module: SongTagsModule,
          },
        ],
      },
      {
        path: '/tracking',
        module: TrackingModule,
        children: [
          {
            path: '/recommended',
            module: RecommendedModule,
          },
          {
            path: '/like',
            module: LikeModule,
          },
        ],
      },
    ],
  },
]
