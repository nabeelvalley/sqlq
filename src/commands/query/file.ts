import {Args, Command, ux} from '@oclif/core'
import {PrismaClient} from '@prisma/client'
import {format, outfile, outputData} from '../../output.js'
import {sqlqdb} from '../../database.js'
import {AppCommand} from '../../AppCommand.js'
import {readFile} from 'fs/promises'

export default class File extends AppCommand {
  static args = {
    alias: Args.string({description: 'Alias for connection', required: true}),
    file: Args.file({description: 'Path to file containing SQL query', required: true, exists: true}),
  }

  static description = 'Query data from a database by file'

  static examples = []

  static flags = {
    format,
    outfile,
  }

  async run(): Promise<any> {
    const {args, flags} = await this.parse(File)
    const {alias, file} = args
    const {format, outfile} = flags

    const query = await readFile(file, 'utf-8')

    const connection = await this.getConnection(alias)
    this.assertConnectionExists(alias, connection)

    this.printQueryWithHistory(connection.driver, alias, connection.connectionString, query, format, outfile)
  }
}
