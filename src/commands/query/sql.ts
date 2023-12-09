import {Args, Command, ux} from '@oclif/core'
import {PrismaClient} from '@prisma/client'
import {format, printFormatted} from '../../output.js'
import {sqlqdb} from '../../database.js'
import {AppCommand} from '../../AppCommand.js'

export default class SQL extends AppCommand {
  static args = {
    alias: Args.string({description: 'Alias for connection', required: true}),
    query: Args.string({description: 'Query to run on database', required: true}),
  }

  static description = 'Query data from a database'

  static examples = []

  static flags = {
    format,
  }

  async run(): Promise<any> {
    const {args, flags} = await this.parse(SQL)
    const {alias, query} = args
    const {format} = flags

    const connection = await this.getConnection(alias)
    this.assertConnectionExists(alias, connection)

    const client = new PrismaClient({
      datasourceUrl: connection.connectionString,
    })

    try {
      const result = await this.load('Executing query', client.$queryRawUnsafe(query))
      printFormatted(format, result)
      await this.saveHistory(alias, query, true)
    } catch (err) {
      await this.saveHistory(alias, query, false)
      throw err
    }
  }
}
