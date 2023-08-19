import config from './Config.js'
import dconfig from '../donations/Config.js' // Donation
import { dedimania } from '../dedimania/Dedimania.js' // For /fr
import mconfig from '../messages/Config.js' // For /fj, /fl, /fr
import cconfig from '../commands/config/ChatCommands.config.js' // Bootme, PM
import { titles } from '../../config/Titles.js' // For /fj
import { helpers as h } from './HelperFunctions.js'

/**
 * Silly fake messages
 * @author wiseraven & wikson
 */

tm.commands.add(
    {
        aliases: config.commands.fakerec.aliases,
        help: config.commands.fakerec.help,
        params: [{ name: 'time' }],
        callback: (info: tm.MessageInfo, time: string): void => {
            const [secondsRegex, minutesRegex, hoursRegex]: Array<RegExp> =
                [/^[0-5]?[0-9]\.[0-9]{2}$/g, /^[0-5]?[0-9]\:[0-5][0-9]\.[0-9]{2}$/g, /^[0-9]\:[0-5][0-9]\:[0-5][0-9]\.[0-9]{2}$/g]
            if (secondsRegex.test(time) || minutesRegex.test(time) || hoursRegex.test(time)) {
                let [hundreths, seconds, minutes, hours] = time.split(/[.:]/g).map(a => Number(a)).reverse()
                hours ??= 0
                minutes ??= 0
                const finishTime: number = hundreths * 10 + seconds * 1000 + minutes * 1000 * 60 + hours * 1000 * 60 * 60
                // Local
                const prevPosition: number = tm.records.local.findIndex(a => a.login === info.login) + 1
                let prevObj: undefined | { time: number, position: number } = prevPosition === 0 ? undefined :
                    { time: tm.records.local[prevPosition - 1].time, position: prevPosition }
                if (prevObj !== undefined && prevObj.time < finishTime) {
                    tm.sendMessage(config.commands.fakerec.errorMessage, info.login)
                    return
                }
                if (prevPosition !== 0 && prevPosition > tm.records.maxLocalsAmount) {
                    prevObj = undefined
                }
                const position: number = tm.records.local.reduce((acc, cur): number => cur.time <= finishTime ? acc + 1 : acc, 1)
                if (position > tm.records.maxLocalsAmount) { return }
                const rs = tm.utils.getRankingString({ time: finishTime, position }, prevObj)
                tm.sendMessage(tm.utils.strVar(mconfig.record, {
                    nickname: tm.utils.strip(info.nickname, true),
                    status: rs.status,
                    position: tm.utils.getOrdinalSuffix(position),
                    time: tm.utils.getTimeString(finishTime),
                    difference: rs.difference !== undefined ? tm.utils.strVar(mconfig.recordDifference, {
                        position: prevPosition,
                        time: rs.difference
                    }) : ''
                }))
                // Dedimania
                const prevDediPosition: number = dedimania.records.findIndex(a => a.login === info.login) + 1
                let prevDediObj: undefined | { time: number, position: number } = prevPosition === 0 ? undefined :
                    { time: dedimania.records[prevPosition - 1].time, position: prevPosition }
                if (prevDediObj !== undefined && prevDediObj.time < finishTime) {
                    tm.sendMessage(config.commands.fakerec.errorMessage, info.login)
                    return
                }
                if (prevDediPosition !== 0 && prevDediPosition > dedimania.recordCountLimit) {
                    prevDediObj = undefined
                }
                const dediPosition: number = dedimania.records.reduce((acc, cur): number => cur.time <= finishTime ? acc + 1 : acc, 1)
                if (dediPosition > dedimania.recordCountLimit) { return }
                const drs = tm.utils.getRankingString({ time: finishTime, position: dediPosition }, prevDediObj)
                tm.sendMessage(tm.utils.strVar(mconfig.dediRecord, {
                    nickname: tm.utils.strip(info.nickname, true),
                    status: drs.status,
                    position: tm.utils.getOrdinalSuffix(dediPosition),
                    time: tm.utils.getTimeString(finishTime),
                    difference: drs.difference !== undefined ? tm.utils.strVar(mconfig.dediDifference, {
                        position: prevDediPosition,
                        time: drs.difference
                    }) : ''
                }))
            } else {
                tm.sendMessage(config.commands.fakerec.errorMessage, info.login)
            }
        },
        privilege: config.commands.fakerec.privilege
    },
    {
        aliases: config.commands.fakedon.aliases,
        help: config.commands.fakedon.help,
        params: [{ name: 'amount', type: 'int' }],
        callback: async (info: tm.MessageInfo, amount: number): Promise<void> => {
            if (amount < dconfig.minimalAmount) {
                tm.sendMessage(dconfig.amountTooLow, info.login)
                return
            }
            tm.sendMessage(tm.utils.strVar(dconfig.paymentSuccess, {
                nickname: tm.utils.strip(info.nickname),
                amount
            }), config.commands.fakedon.public ? undefined : info.login)
        },
        privilege: config.commands.fakedon.privilege
    },
    {
        aliases: config.commands.fakeleave.aliases,
        help: config.commands.fakeleave.help,
        params: [{ name: 'player', type: 'player', optional: true }],
        callback: async (info: tm.MessageInfo, player?: tm.Player): Promise<void> => {
            player ??= info
            const sessionTime: number = Date.now() - player.joinTimestamp
            tm.sendMessage(tm.utils.strVar(mconfig.leave, {
                nickname: tm.utils.strip(player.nickname, true),
                time: tm.utils.getVerboseTime(sessionTime)
            }), config.commands.fakeleave.public ? undefined : info.login)
        },
        privilege: config.commands.fakeleave.privilege
    },
    {
        aliases: config.commands.fakejoin.aliases,
        help: config.commands.fakejoin.help,
        params: [{ name: 'player', type: 'offlinePlayer' }],
        callback: async (info: tm.MessageInfo, player: tm.OfflinePlayer): Promise<void> => {
            tm.sendMessage(tm.utils.strVar(mconfig.join, {
                // This won't get any custom titles!
                title: titles.privileges[player.privilege as keyof typeof titles.privileges],
                nickname: tm.utils.strip(player.nickname, true),
                country: player.country,
                visits: player.visits
            }), config.commands.fakejoin.public ? undefined : info.login)
        },
        privilege: config.commands.fakejoin.privilege
    },
    {
        aliases: config.commands.fakeinv.aliases,
        help: config.commands.fakeinv.help,
        params: [{ name: 'player', type: 'player', optional: true }],
        callback: async (info: tm.MessageInfo, player?: tm.Player): Promise<void> => {
            player ??= info
            tm.sendMessage(tm.utils.strVar(config.commands.fakeinv.message, {
                nickname: player.nickname, // No strip
            }), config.commands.fakeinv.public ? undefined : info.login, false)
        },
        privilege: config.commands.fakeinv.privilege
    },
    {
        aliases: config.commands.fakepm.aliases,
        help: config.commands.fakepm.help,
        params: [
            { name: 'sender', type: 'player' },
            { name: 'recipient', type: 'player' },
            { name: 'text', type: 'multiword', optional: true }
        ],
        callback: async (info: tm.MessageInfo, sender: tm.Player, recipient: tm.Player, text: string = ''): Promise<void> => {
            let logins: string[] = []
            if (config.commands.fakepm.sendToSelf) { logins.push(info.login) }
            if (config.commands.fakepm.sendToRecipient) { logins.push(recipient.login) }
            if (config.commands.fakepm.sendToSender) { logins.push(sender.login) }
            tm.sendMessage(tm.utils.strVar(cconfig.pm.text, {
                sender: tm.utils.strip(sender.nickname, false),
                recipient: tm.utils.strip(recipient.nickname, false),
                message: text
            }), logins.length === 0 ? info.login : logins)
        },
        privilege: config.commands.fakepm.privilege
    },
    {
        aliases: config.commands.fakechat.aliases,
        help: config.commands.fakechat.help,
        params: [{ name: 'sender', type: 'player' }, { name: 'text', type: 'multiword', optional: true }],
        callback: async (info: tm.MessageInfo, sender: tm.Player, text: string = ''): Promise<void> => {
            tm.sendMessage(tm.utils.strVar(config.commands.fakechat.message, {
                sender: sender.nickname,
                message: text
            }), config.commands.fakechat.public ? undefined : info.login, false)
        },
        privilege: config.commands.fakechat.privilege
    }
)