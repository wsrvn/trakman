import config from './Config.js'
import fetch from 'node-fetch'
import { helpers as h } from './HelperFunctions.js'

/**
 * Public API access for Trakman
 * @author wiseraven
 */

tm.commands.add(
    {
        aliases: config.commands.urbandictionary.aliases,
        help: config.commands.urbandictionary.help,
        params: [{ name: 'query', type: 'multiword', optional: true }],
        callback: async (info: tm.MessageInfo, query?: string): Promise<void> => {
            let isRandom: boolean = false
            if (query === undefined) {
                if (config.commands.urbandictionary.warnAboutRandom) {
                    tm.sendMessage(config.commands.urbandictionary.usingRandom, info.login)
                }
                isRandom = true
            }
            const url: string = isRandom
                ? config.commands.urbandictionary.apiRandom
                : tm.utils.strVar(config.commands.urbandictionary.apiUrl, { query: query?.replace(' ', '+') })
            const response = await fetch(url).catch((err: Error) => err)
            if (response instanceof Error) {
                tm.sendMessage(config.commands.urbandictionary.fetchError, info.login)
                return
            }
            const json: any = await response.json().catch((err: Error) => err)
            if (json?.list?.[0] === undefined || json instanceof Error) {
                tm.sendMessage(tm.utils.strVar(config.commands.urbandictionary.noResult, {
                    word: tm.utils.strip(info.text)
                }), info.login)
                return
            }
            // Get the data
            const resultIndex: number = config.commands.urbandictionary.getRandomResult ? ~~(Math.random() * json?.list?.length) : 0
            const rating: number = json?.list?.[resultIndex]?.thumbs_up - json?.list?.[resultIndex]?.thumbs_down
            const date: string = tm.utils.formatDate(new Date(json?.list?.[resultIndex]?.written_on), true)
            const word: string = `$L[${tm.utils.fixProtocol(json?.list?.[resultIndex].permalink)}]${tm.utils.strip(json?.list?.[resultIndex]?.word)}$L`
            const definition: string = h.replaceArray(tm.utils.strip(json?.list?.[resultIndex]?.definition), [`[`, `]`, `\n`, `$`], [``, ``, ` `, `$$`])
            // Send out the message
            tm.sendMessage(
                tm.utils.strVar(config.commands.urbandictionary.definitionInfo, {
                    rating: rating,
                    date: date
                }), config.commands.urbandictionary.public ? undefined : info.login
            )
            tm.sendMessage(
                tm.utils.strVar(config.commands.urbandictionary.definitionResult, {
                    word: word,
                    definition: definition
                }), config.commands.urbandictionary.public ? undefined : info.login
            )
        },
        privilege: config.commands.urbandictionary.privilege,
        disableForMuted: true
    },
    {
        aliases: config.commands.wikipedia.aliases,
        help: config.commands.wikipedia.help,
        params: [{ name: 'query', type: 'multiword', optional: true }],
        callback: async (info: tm.MessageInfo, query?: string): Promise<void> => {
            let isRandom: boolean = false
            if (query === undefined) {
                if (config.commands.wikipedia.warnAboutRandom) {
                    tm.sendMessage(config.commands.wikipedia.usingRandom, info.login)
                }
                isRandom = true
            }
            const url: string = isRandom
                ? config.commands.wikipedia.apiRandom
                : tm.utils.strVar(config.commands.wikipedia.apiUrl, { query: query?.replace(' ', '_') })
            const response = await fetch(url).catch((err: Error) => err)
            if (response instanceof Error) {
                tm.sendMessage(config.commands.wikipedia.fetchError, info.login)
                return
            }
            const json: any = await response.json().catch((err: Error) => err)
            if (json?.extract === undefined || json instanceof Error) {
                tm.sendMessage(tm.utils.strVar(config.commands.wikipedia.noResult, {
                    word: tm.utils.strip(info.text)
                }), info.login)
                return
            }
            // Get the data
            const date: string = tm.utils.formatDate(new Date(json?.timestamp), true)
            const name: string = `$L[${tm.utils.fixProtocol(json?.content_urls?.desktop?.page)}]${tm.utils.strip(json?.title)}$L`
            const extract: string = h.replaceArray(tm.utils.strip(json?.extract), [`[`, `]`, `\n`, `$`], [``, ``, ` `, `$$`])
            // Send out the message
            tm.sendMessage(
                tm.utils.strVar(config.commands.wikipedia.articleInfo, {
                    date: date
                }), config.commands.wikipedia.public ? undefined : info.login
            )
            tm.sendMessage(
                tm.utils.strVar(config.commands.wikipedia.articleResult, {
                    name: name,
                    extract: extract
                }), config.commands.wikipedia.public ? undefined : info.login
            )
        },
        privilege: config.commands.wikipedia.privilege,
        disableForMuted: true
    },
    {
        aliases: config.commands.rule34.aliases,
        help: config.commands.rule34.help,
        params: [{ name: 'query', type: 'multiword', optional: true }],
        callback: async (info: tm.MessageInfo, query?: string): Promise<void> => {
            let tags: string[] | undefined = query?.split(' ')
            if (tags === undefined) {
                if (config.commands.rule34.warnAboutRandom) {
                    tm.sendMessage(config.commands.rule34.usingRandom, info.login)
                }
                tags = config.commands.rule34.defaultTags
            }
            const url: string = tm.utils.strVar(config.commands.rule34.apiUrl, {
                fetchAmount: ~~config.commands.rule34.fetchAmount,
                query: tags.join('+')
            })
            const response = await fetch(url).catch((err: Error) => err)
            if (response instanceof Error) {
                tm.sendMessage(config.commands.rule34.fetchError, info.login)
                return
            }
            const json: any = await response.json().catch((err: Error) => err)
            if (json?.[0] === undefined || json instanceof Error) { // Check if first exists
                tm.sendMessage(tm.utils.strVar(config.commands.rule34.noResult, {
                    tags: tm.utils.strip(tags.join(', '))
                }), info.login)
                return
            }
            const randomIndex: number = config.commands.rule34.useRandom ? ~~h.getRandom(0, Object.keys(json).length - 1) : 0
            // Get the data
            const rating: string = json?.[randomIndex]?.rating
            const date: string = tm.utils.formatDate(new Date(json?.[randomIndex]?.change * 1000), true)
            const receivedTags: Array<string> = json?.[randomIndex]?.tags.split(' ').slice(0, config.commands.rule34.shownTagsAmount)
            const imageUrl: string = `$L[${tm.utils.fixProtocol(json?.[randomIndex]?.file_url)}]Click here$L`
            // Send out the message
            tm.sendMessage(
                tm.utils.strVar(config.commands.rule34.artworkInfo, {
                    rating: rating,
                    date: date
                }), config.commands.rule34.public ? undefined : info.login
            )
            tm.sendMessage(
                tm.utils.strVar(config.commands.rule34.artworkResult, {
                    tags: receivedTags.join(`, `),
                    url: imageUrl
                }), config.commands.rule34.public ? undefined : info.login
            )
        },
        privilege: config.commands.rule34.privilege,
        disableForMuted: true
    }
)
