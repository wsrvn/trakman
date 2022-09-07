import { trakman as tm } from '../../../src/Trakman.js'
import config from '../config/AdminCommands.config.js'

const commands: TMCommand[] = [
  {
    aliases: ['k', 'kick'],
    help: 'Kick a specific player.',
    params: [{ name: 'login' }, { name: 'reason', type: 'multiword', optional: true }],
    callback: (info: TMMessageInfo, login: string, reason?: string): void => {
      const targetInfo: TMPlayer | undefined = tm.players.get(login)
      if (targetInfo === undefined) {
        tm.sendMessage(config.kick.error, info.login)
        return
      }
      const reasonString: string = reason === undefined ? '' : ` ${tm.utils.strVar(config.kick.reason, { reason: reason })}.`
      tm.sendMessage(tm.utils.strVar(config.kick.text, { title: tm.utils.getTitle(info), adminName: tm.utils.strip(info.nickname), name: tm.utils.strip(targetInfo.nickname) }) + `${reasonString}`, config.kick.public ? undefined : info.login)
      tm.client.callNoRes(`Kick`, [{ string: login }, { string: reason === undefined ? 'No reason specified' : reason }])
    },
    privilege: config.kick.privilege
  },
  {
    aliases: ['m', 'mute'],
    help: 'Mute a specific player.',
    params: [{ name: 'login' }, { name: 'duration', type: 'time', optional: true }, { name: 'reason', type: 'multiword', optional: true }],
    callback: async (info: TMMessageInfo, login: string, duration?: number, reason?: string): Promise<void> => {
      let targetInfo: TMOfflinePlayer | undefined = tm.players.get(login)
      if (targetInfo === undefined) {
        targetInfo = await tm.players.fetch(login)
      }
      const expireDate: Date | undefined = duration === undefined ? undefined : new Date(Date.now() + duration)
      const result: true | Error = await tm.admin.mute(login, info, targetInfo?.nickname, reason, expireDate)
      let logStr: string = targetInfo === undefined ? `(${login})` : `${tm.utils.strip(targetInfo.nickname)} (${targetInfo.login})`
      if (result instanceof Error) {
        tm.log.error(`Error while muting player ${logStr}`, result.message)
        tm.sendMessage(tm.utils.strVar(config.mute.error, { login: login }), info.login)
        return
      }
      const reasonString: string = reason === undefined ? '' : ` ${tm.utils.strVar(config.mute.reason, { reason: reason })}.`
      const durationString: string = duration === undefined ? '' : ` for ${tm.utils.palette.highlight}${tm.utils.msToTime(duration)}`
      tm.sendMessage(tm.utils.strVar(config.mute.text, { title: tm.utils.getTitle(info), adminName: tm.utils.strip(info.nickname), name: tm.utils.strip(targetInfo?.nickname ?? login), duration: durationString }) + `${reasonString}`, config.mute.public ? undefined : info.login)
    },
    privilege: config.mute.privilege
  },
  {
    aliases: ['um', 'unmute'],
    help: 'Unmute a specific player.',
    params: [{ name: 'login' }],
    callback: async (info: TMMessageInfo, login: string): Promise<void> => {
      let targetInfo: TMOfflinePlayer | undefined = tm.players.get(login)
      if (targetInfo === undefined) {
        targetInfo = await tm.players.fetch(login)
      }
      const result: boolean | Error = await tm.admin.unmute(login, info)
      let logStr: string = targetInfo === undefined ? `(${login})` : `${tm.utils.strip(targetInfo.nickname)} (${targetInfo.login})`
      if (result instanceof Error) {
        tm.log.error(`Error while unmuting player ${logStr}`, result.message)
        tm.sendMessage(tm.utils.strVar(config.unmute.error, { login: login }), info.login)
        return
      }
      if (result === false) {
        tm.sendMessage(tm.utils.strVar(config.unmute.notMuted, { login: login }), info.login)
        return
      }
      tm.sendMessage(tm.utils.strVar(config.unmute.text, { title: tm.utils.getTitle(info), adminName: tm.utils.strip(info.nickname), name: tm.utils.strip(targetInfo?.nickname ?? login) }), config.unmute.public ? undefined : info.login)
    },
    privilege: config.unmute.privilege
  },
  {
    aliases: ['fs', 'forcespec'],
    help: 'Force a player into spectator mode.',
    params: [{ name: 'login' }],
    callback: (info: TMMessageInfo, login: string): void => {
      const targetInfo: TMPlayer | undefined = tm.players.get(login)
      if (targetInfo === undefined) {
        tm.sendMessage(config.forcespec.error, info.login)
        return
      }
      tm.sendMessage(tm.utils.strVar(config.forcespec.text, { title: tm.utils.getTitle(info), adminName: tm.utils.strip(info.nickname) }), config.forcespec.public ? undefined : info.login)
      tm.multiCallNoRes(
        {
          method: 'ForceSpectator',
          params: [{ string: login }, { int: 1 }]
        },
        {
          method: 'ForceSpectator',
          params: [{ string: login }, { int: 0 }]
        }
      )
    },
    privilege: config.forcespec.privilege
  },
  {
    aliases: ['fp', 'forceplay'],
    help: 'Force a player into player mode.',
    params: [{ name: 'login' }],
    callback: (info: TMMessageInfo, login: string): void => {
      const targetInfo: TMPlayer | undefined = tm.players.get(login)
      if (targetInfo === undefined) {
        tm.sendMessage(config.forceplay.error, info.login)
        return
      }
      tm.sendMessage(tm.utils.strVar(config.forceplay.text, { title: tm.utils.getTitle(info), adminName: tm.utils.strip(info.nickname) }), config.forceplay.public ? undefined : info.login)
      tm.multiCallNoRes(
        {
          method: 'ForceSpectator',
          params: [{ string: login }, { int: 2 }]
        },
        {
          method: 'ForceSpectator',
          params: [{ string: login }, { int: 0 }]
        }
      )
    },
    privilege: config.forceplay.privilege
  },
  {
    aliases: ['kg', 'gk', 'kickghost', 'ghostkick'],
    help: 'Manipulate every soul on the server that you kicked someone.',
    params: [{ name: 'login' }],
    callback: (info: TMMessageInfo, login: string): void => {
      tm.sendMessage(tm.utils.strVar(config.kickghost.text, { title: tm.utils.getTitle(info), adminName: tm.utils.strip(info.nickname), name: login }), config.kickghost.public ? undefined : info.login)
      tm.client.callNoRes(`Kick`, [{ string: login }])
    },
    privilege: config.kickghost.privilege
  },
  {
    aliases: ['b', 'ban'],
    help: 'Ban a specific player.',
    params: [{ name: 'login' }, { name: 'duration', type: 'time', optional: true }, { name: 'reason', type: 'multiword', optional: true }],
    callback: async (info: TMMessageInfo, login: string, duration?: number, reason?: string): Promise<void> => {
      const targetInfo: TMPlayer | undefined = tm.players.get(login)
      if (targetInfo === undefined) {
        tm.sendMessage(config.ban.error, info.login)
        return
      }
      const expireDate: Date | undefined = duration === undefined ? undefined : new Date(Date.now() + duration)
      const result: true | Error = await tm.admin.ban(targetInfo.ip, targetInfo.login, info, targetInfo.nickname, reason, expireDate)
      let logStr: string = targetInfo === undefined ? `(${login})` : `${tm.utils.strip(targetInfo.nickname)} (${targetInfo.login})`
      if (result instanceof Error) {
        tm.log.error(`Error while banning player ${logStr}`, result.message)
        tm.sendMessage(tm.utils.strVar(config.ban.error, { login: login }), info.login)
        return
      }
      const reasonString: string = reason === undefined ? '' : ` ${tm.utils.strVar(config.ban.reason, { reason: reason })}.`
      const durationString: string = duration === undefined ? '' : ` for ${tm.utils.palette.highlight}${tm.utils.msToTime(duration)}`
      tm.sendMessage(tm.utils.strVar(config.ban.text, { title: tm.utils.getTitle(info), adminName: tm.utils.strip(info.nickname), name: tm.utils.strip(targetInfo?.nickname ?? login), duration: durationString }) + `${reasonString}`, config.ban.public ? undefined : info.login)
    },
    privilege: config.ban.privilege
  },
  {
    aliases: ['ub', 'unban'],
    help: 'Unban a specific player.',
    params: [{ name: 'login' }],
    callback: async (info: TMMessageInfo, login: string): Promise<void> => {
      const targetInfo: TMOfflinePlayer | undefined = await tm.players.fetch(login)
      const result: boolean | Error = await tm.admin.unban(login, info)
      let logStr: string = targetInfo === undefined ? `(${login})` : `${tm.utils.strip(targetInfo.nickname)} (${targetInfo.login})`
      if (result instanceof Error) {
        tm.log.error(`Error while unmuting player ${logStr}`, result.message)
        tm.sendMessage(tm.utils.strVar(config.unmute.error, { login: login }), info.login)
        return
      }
      if (result === false) {
        tm.sendMessage(tm.utils.strVar(config.unban.notBanned, { login: login }), info.login)
        return
      }
      tm.sendMessage(tm.utils.strVar(config.unban.text, { title: tm.utils.getTitle(info), adminName: tm.utils.strip(info.nickname), name: tm.utils.strip(targetInfo?.nickname ?? login) }), config.unban.public ? undefined : info.login)
    },
    privilege: config.unban.privilege
  },
  {
    aliases: ['bl', 'blacklist'],
    help: 'Blacklist a specific player.',
    params: [{ name: 'login' }, { name: 'duration', type: 'time', optional: true }, { name: 'reason', type: 'multiword', optional: true }],
    callback: async (info: TMMessageInfo, login: string, duration?: number, reason?: string): Promise<void> => {
      let targetInfo: TMOfflinePlayer | undefined = tm.players.get(login)
      if (targetInfo === undefined) {
        targetInfo = await tm.players.fetch(login)
      }
      const expireDate: Date | undefined = duration === undefined ? undefined : new Date(Date.now() + duration)
      const result: true | Error = await tm.admin.addToBlacklist(login, info, targetInfo?.nickname, reason, expireDate)
      let logStr: string = targetInfo === undefined ? `(${login})` : `${tm.utils.strip(targetInfo.nickname)} (${targetInfo.login})`
      if (result instanceof Error) {
        tm.log.error(`Error while blacklisting player ${logStr}`, result.message)
        tm.sendMessage(tm.utils.strVar(config.blacklist.error, { login: login }), info.login)
        return
      }
      const reasonString: string = reason === undefined ? '' : ` ${tm.utils.strVar(config.blacklist.reason, { reason: reason })}.`
      const durationString: string = duration === undefined ? '' : ` for ${tm.utils.palette.highlight}${tm.utils.msToTime(duration)}`
      tm.sendMessage(tm.utils.strVar(config.blacklist.text, { title: tm.utils.getTitle(info), adminName: tm.utils.strip(info.nickname), name: tm.utils.strip(targetInfo?.nickname ?? login), duration: durationString }) + `${reasonString}`, config.blacklist.public ? undefined : info.login)
    },
    privilege: config.blacklist.privilege
  },
  {
    aliases: ['ubl', 'unblacklist'],
    help: 'Remove a specific player from the blacklist.',
    params: [{ name: 'login' }],
    callback: async (info: TMMessageInfo, login: string): Promise<void> => {
      const targetInfo: TMOfflinePlayer | undefined = await tm.players.fetch(login)
      const result: boolean | Error = await tm.admin.unblacklist(login, info)
      let logStr: string = targetInfo === undefined ? `(${login})` : `${tm.utils.strip(targetInfo.nickname)} (${targetInfo.login})`
      if (result instanceof Error) {
        tm.log.error(`Error while removing player ${logStr} from the blacklist`, result.message)
        tm.sendMessage(tm.utils.strVar(config.unblacklist.error, { login: login }), info.login)
        return
      }
      if (result === false) {
        tm.sendMessage(tm.utils.strVar(config.unblacklist.notBlacklisted, { login: login }), info.login)
        return
      }
      tm.sendMessage(tm.utils.strVar(config.unblacklist.text, { title: tm.utils.getTitle(info), adminName: tm.utils.strip(info.nickname), name: tm.utils.strip(targetInfo?.nickname ?? login) }), config.unblacklist.public ? undefined : info.login)
    },
    privilege: config.unblacklist.privilege
  },
  {
    aliases: ['ag', 'addguest'],
    help: 'Add a player to the guestlist',
    params: [{ name: 'login' }],
    callback: async (info: TMMessageInfo, login: string): Promise<void> => {
      let targetInfo: TMOfflinePlayer | undefined = tm.players.get(login)
      if (targetInfo === undefined) {
        targetInfo = await tm.players.fetch(login)
      }
      const result: boolean | Error = await tm.admin.addGuest(login, info, targetInfo?.nickname)
      let logStr: string = targetInfo === undefined ? `(${login})` : `${tm.utils.strip(targetInfo.nickname)} (${targetInfo.login})`
      if (result instanceof Error) {
        tm.log.error(`Error while adding player ${logStr} to the guestlist`, result.message)
        tm.sendMessage(tm.utils.strVar(config.addguest.error, { login: login }), info.login)
        return
      }
      if (result === false) {
        tm.sendMessage(tm.utils.strVar(config.addguest.alreadyGuest, { login: login }), info.login)
        return
      }
      tm.sendMessage(tm.utils.strVar(config.addguest.text, { title: tm.utils.getTitle(info), adminName: tm.utils.strip(info.nickname), name: tm.utils.strip(targetInfo?.nickname ?? login) }), config.addguest.public ? undefined : info.login)
    },
    privilege: config.addguest.privilege
  },
  {
    aliases: ['rg', 'rmguest', 'removeguest'],
    help: 'Remove a player from the guestlist',
    params: [{ name: 'login' }],
    callback: async (info: TMMessageInfo, login: string): Promise<void> => {
      let targetInfo: TMOfflinePlayer | undefined = tm.players.get(login)
      if (targetInfo === undefined) {
        targetInfo = await tm.players.fetch(login)
      }
      const result: boolean | Error = await tm.admin.removeGuest(login, info)
      let logStr: string = targetInfo === undefined ? `(${login})` : `${tm.utils.strip(targetInfo.nickname)} (${targetInfo.login})`
      if (result instanceof Error) {
        tm.log.error(`Error while removing player ${logStr} from the guestlist`, result.message)
        tm.sendMessage(tm.utils.strVar(config.rmguest.error, { login: login }), info.login)
        return
      }
      if (result === false) {
        tm.sendMessage(tm.utils.strVar(config.rmguest.notGuest, { login: login }), info.login)
        return
      }
      tm.sendMessage(tm.utils.strVar(config.rmguest.text, { title: tm.utils.getTitle(info), adminName: tm.utils.strip(info.nickname), name: tm.utils.strip(targetInfo?.nickname ?? login) }), config.rmguest.public ? undefined : info.login)
    },
    privilege: config.rmguest.privilege
  }
]

tm.commands.add(...commands)