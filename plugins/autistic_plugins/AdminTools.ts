import config from './Config.js'

tm.commands.add(
    {
        aliases: config.commands.servermessage.aliases,
        help: config.commands.servermessage.help,
        params: [{ name: 'text', type: 'multiword', optional: true }],
        callback: async (info: tm.MessageInfo, text: string = ''): Promise<void> => {
            tm.sendMessage(tm.utils.strVar(config.commands.servermessage.message, {
                server: tm.config.server.name, // No strip
                message: text
            }), config.commands.servermessage.public ? undefined : info.login, false)
        },
        privilege: config.commands.servermessage.privilege
    },
    {
        aliases: config.commands.clearchat.aliases,
        help: config.commands.clearchat.help,
        callback: async (info: tm.MessageInfo): Promise<void> => {
            for (let i: number = 0; i < config.commands.clearchat.amount; i++) {
                tm.sendMessage(config.commands.clearchat.message, config.commands.clearchat.public ? undefined : info.login, false)
            }
        },
        privilege: config.commands.clearchat.privilege
    },
)