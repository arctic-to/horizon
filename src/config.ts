import { ConfigModule } from '@nestjs/config'

ConfigModule.forRoot({
  envFilePath: '.env.local',
})
