/* eslint-disable no-console */
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import chalk from 'chalk'
import { format } from 'sql-formatter'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: [{ emit: 'event', level: 'query' }],
    })
    this.$on('query' as 'beforeExit', (e: any) => {
      console.log(
        `[${chalk.grey(e.timestamp)}]`,
        chalk.green.bold(e.duration),
        chalk.white(e.params),
      )
      console.log(chalk.yellow(format(e.query)))
    })
  }
  async onModuleInit() {
    await this.$connect()
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}
