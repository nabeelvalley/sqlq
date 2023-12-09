import {Args, Command, Flags, ux} from '@oclif/core'
import {PrismaClient} from '@prisma/client'
import {format, printFormatted} from '../../output.js'
import {sqlqdb} from '../../database.js'
import {AppCommand} from '../../AppCommand.js'

export default class Get extends AppCommand {
  static args = {
    id: Args.integer({description: 'ID of item in history list', required: true}),
  }

  static description = 'Get query from history'

  static examples = []

  static flags = {
    format,
  }

  async run(): Promise<any> {
    const {flags, args} = await this.parse(Get)
    const {id} = args
    const {format} = flags

    const result = await this.load(
      'Searching',
      this.db.history.findFirst({
        where: {
          id,
        },
      }),
    )

    if (!result) {
      ux.error(`History with id '${id}' not found`)
    }

    printFormatted(format, result)
  }
}
