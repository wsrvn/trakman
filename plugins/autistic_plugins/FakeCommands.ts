import config from './Config.js'
import dconfig from '../donations/Config.js' // Donation
import mconfig from '../messages/Config.js' // Join, Leave
import cconfig from '../commands/config/ChatCommands.config.js' // Bootme, PM
import { titles } from '../../config/Titles.js' // For /fj
import { helpers as h } from './HelperFunctions.js'

/**
 * Silly fake messages
 * @author wiseraven
 */

tm.commands.add(
    {
        aliases: config.commands.fakerec.aliases,
        help: config.commands.fakerec.help,
        params: [{ name: 'time' }],
        callback: async (info: tm.MessageInfo, time: string): Promise<void> => {
            //todo
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
)