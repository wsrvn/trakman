import config from './Config.js'
import messages from '../../config/Messages.js'
import fs from 'node:fs/promises'
import { helpers as h } from './HelperFunctions.js'

tm.commands.add(
  {
    aliases: config.commands.mls.aliases,
    help: config.commands.mls.help,
    params: [{ name: 'amount', type: 'int' }, { name: 'size', type: 'int', optional: true }],
    callback: async (info: tm.MessageInfo, amount: number, size?: number): Promise<void> => {
      amount = ~~(Math.abs(amount))
      // todo size check
      if (info.privilege === 4 || amount <= config.commands.shared.notOwnerLimit) {
        await h.displayManialinks(amount, size)
        await new Promise(resolve => setTimeout(resolve, config.commands.shared.clearInterval * 1000))
        await h.hideManialinks(amount)
      } else {
        tm.sendMessage(messages.noPermission, info.login)
        return
      }
    },
    privilege: config.commands.mls.privilege
  },
  {
    aliases: config.commands.imls.aliases,
    help: config.commands.imls.help,
    params: [{ name: 'amount', type: 'int', optional: true }],
    callback: async (info: tm.MessageInfo, amount?: number): Promise<void> => {
      amount = ~~(Math.abs(amount ?? 1))
      if (info.privilege === 4 || amount <= config.commands.shared.notOwnerLimit) {
        // TODO MOVE THIS TO THE DATABASE (init in main file i guess)
        await h.displayManialinks(amount, undefined, true, (await fs.readFile(`/home/wiseraven/Downloads/imlsimages.txt`)).toString().split(`\n`))
        await new Promise(resolve => setTimeout(resolve, config.commands.shared.clearInterval * 1000))
        await h.hideManialinks(amount)
      } else {
        tm.sendMessage(messages.noPermission, info.login)
        return
      }
    },
    privilege: config.commands.imls.privilege
  },
  {
    aliases: config.commands.smls.aliases,
    help: config.commands.smls.help,
    params: [{ name: 'amount', type: 'int' }, { name: 'size', type: 'int', optional: true }],
    callback: async (info: tm.MessageInfo, amount: number, size?: number): Promise<void> => {
      amount = ~~(Math.abs(amount))
      const seed: number = h.getRandom(1, 10)
      if (info.privilege === 4 || amount <= config.commands.shared.notOwnerLimit) {
        await h.displayManialinks(amount, size, false, undefined, 'MedalsBig', 'MedalSlot',
          {
            xfunc: (a: number): number => {
              return (a * Math.cos(Math.PI / 180 * (720 / seed * a)))
            },
            yfunc: (a: number): number => {
              return (a * Math.sin(Math.PI / 180 * (720 / seed * a)))
            },
          }
        )
        await new Promise(resolve => setTimeout(resolve, config.commands.shared.clearInterval * 1000))
        await h.hideManialinks(amount)
      } else {
        tm.sendMessage(messages.noPermission, info.login)
        return
      }
    },
    privilege: config.commands.smls.privilege
  },
)