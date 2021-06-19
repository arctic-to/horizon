import { HttpModule, Module } from '@nestjs/common'

import { NcmHttpService } from './http.service'

@Module({
  imports: [
    /** Env is empty before `Starting Nest application...`(instantiate App Module) */
    HttpModule.registerAsync({
      useFactory: () => ({
        baseURL: process.env.NETEASE_CLOUD_MUSIC_API!,
      }),
    }),
  ],
  providers: [NcmHttpService],
  exports: [NcmHttpService],
})
export class NcmHttpModule {}
