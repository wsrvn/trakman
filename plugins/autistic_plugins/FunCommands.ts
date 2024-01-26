import config from './Config.js'
import messages from '../../config/Messages.js'
import charmap from '../../src/data/SpecialCharmap.js'
import { helpers as h } from './HelperFunctions.js'
import { DOMParser } from "xmldom";
import xpath from "xpath";

/**
 * Fun stuff for AS
 * @author wiseraven
 */

tm.commands.add(
  {
    aliases: config.commands.gradient.aliases,
    help: config.commands.gradient.help,
    params: [{ name: 'text', type: 'multiword' }],
    callback: async (info: tm.MessageInfo, text: string): Promise<void> => {
      const message: string = tm.utils.makeGradient(text, h.getRandomChars(3), h.getRandomChars(3))
      if (config.commands.gradient.logResult) {
        // Maybe try the popup entry thing?
        tm.log.trace(`/gradient result: ${message}`)
      }
      tm.sendMessage(tm.utils.strVar(config.commands.gradient.message,
        {
          nickname: info.nickname,
          message: message
        }
      ), config.commands.gradient.public ? undefined : info.login, false)
    },
    privilege: config.commands.gradient.privilege
  },
  {
    aliases: config.commands.mapchars.aliases,
    help: config.commands.mapchars.help,
    params: [{ name: 'text', type: 'multiword' }],
    callback: async (info: tm.MessageInfo, text: string): Promise<void> => {
      let res: string = ``
      let char: string | undefined = undefined
      let key: string[] = []
      for (let c of text.toLowerCase()) {
        key = charmap[c as keyof typeof charmap]
        if (key !== undefined) {
          char = key[~~(Math.random() * key.length)]
        }
        res += char ?? c
        char = undefined
      }
      const message: string = res
      if (config.commands.mapchars.logResult) {
        // Maybe try the popup entry thing?
        tm.log.trace(`/mapchars result: ${message}`)
      }
      tm.sendMessage(tm.utils.strVar(config.commands.mapchars.message,
        {
          nickname: info.nickname,
          message: message
        }
      ), config.commands.mapchars.public ? undefined : info.login, false)
    },
    privilege: config.commands.mapchars.privilege
  },
  {
    aliases: config.commands.randomtext.aliases,
    help: config.commands.randomtext.help,
    params: [{ name: 'text', type: 'multiword' }],
    callback: async (info: tm.MessageInfo, text: string): Promise<void> => {
      let res: string = ``
      for (let c of text) {
        if (config.commands.randomtext.applyRandomModifier) {
          for (let i: number = 0; i < config.commands.randomtext.modifierAmount; i++) {
            res += `$` + h.getRandomChars(1, config.commands.randomtext.possibleModifiers.join(''))
          }
        }
        if (config.commands.randomtext.applyRandomColour) {
          res += `$` + h.getRandomChars(3)
        }
        res += c + ` $z$s`
      }
      const message: string = res
      if (config.commands.randomtext.logResult) {
        // Maybe try the popup entry thing?
        tm.log.trace(`/randomtext result: ${message} `)
      }
      tm.sendMessage(tm.utils.strVar(config.commands.mapchars.message,
        {
          nickname: info.nickname,
          message: message
        }
      ), config.commands.randomtext.public ? undefined : info.login, false)
    },
    privilege: config.commands.randomtext.privilege
  },
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
        await h.displayManialinks(amount, undefined, true, await h.getDbImages())
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
    aliases: config.commands.addimage.aliases,
    help: config.commands.addimage.help,
    params: [{ name: 'url' }],
    callback: async (info: tm.MessageInfo, url: string): Promise<void> => {
      // Check if it's a real URL?
      h.pushDbImage(url)
      tm.sendMessage(tm.utils.strVar(config.commands.addimage.message, { url: tm.utils.fixProtocol(url) }), info.login)
    },
    privilege: config.commands.addimage.privilege
  },
  {
    aliases: config.commands.addimages.aliases,
    help: config.commands.addimages.help,
    params: [{ name: 'url' }],
    callback: async (info: tm.MessageInfo, url: string): Promise<void> => {
      let urls = ""
      if (url.charAt(url.length-1) !== '/') {
        urls = url + "/"
      } else {
        urls = url
      }
      const link = new URL(urls)
      const domain = link.protocol + "//" + link.hostname
      const response = await fetch(urls, {method: 'GET'}).catch((err: Error) => err)
      if (response instanceof Error) {
        tm.sendMessage("Failed getting directory listing.", info.login)
        return
      }
      const html: string | Error = await response.text().catch((err: Error) => err)
      if (html instanceof Error) {
        tm.sendMessage("Failed getting directory listing.", info.login)
        return
      }
      const xml: Document = new DOMParser({
        locator: {},
        errorHandler: {
          warning: function(w) {},
          error: function(e) {},
          fatalError: function (f) {}
        }
      }).parseFromString(html, "text/xml")
      xpath.select(`//a/@href`, xml).map(a => (a as any).value).forEach(a => {
        if (a.charAt(0) === '/') {
          h.pushDbImage(domain + a)
        } else {
          h.pushDbImage(urls + a)
        }
      })
      tm.sendMessage(tm.utils.strVar(config.commands.addimages.message, { url: tm.utils.fixProtocol(url) }), info.login)
    },
    privilege: config.commands.addimage.privilege
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