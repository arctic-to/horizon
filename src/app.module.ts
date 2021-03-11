import { Module } from '@nestjs/common'
import { RouterModule } from 'nest-router'

import { routes } from './routes'
import { LikeModule } from './tracking/netease-cloud-music/like/like.module'
import { NeteaseCloudMusicModule } from './tracking/netease-cloud-music/netease-cloud-music.module'
import { RecommendedModule } from './tracking/netease-cloud-music/recommended/recommended.module'
import { TrackingModule } from './tracking/tracking.module'

@Module({
  imports: [
    RouterModule.forRoutes(routes),
    TrackingModule,
    NeteaseCloudMusicModule,
    RecommendedModule,
    LikeModule,
  ],
})
export class AppModule {}
