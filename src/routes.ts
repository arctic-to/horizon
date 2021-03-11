// Nested Route: https://github.com/nestjs/nest/issues/255
import { Routes } from 'nest-router'

import { LikeModule } from './tracking/netease-cloud-music/like/like.module'
import { NeteaseCloudMusicModule } from './tracking/netease-cloud-music/netease-cloud-music.module'
import { RecommendedModule } from './tracking/netease-cloud-music/recommended/recommended.module'
import { TrackingModule } from './tracking/tracking.module'

export const routes: Routes = [
  {
    path: '/tracking',
    module: TrackingModule,
    children: [
      {
        path: '/netease-cloud-music',
        module: NeteaseCloudMusicModule,
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
