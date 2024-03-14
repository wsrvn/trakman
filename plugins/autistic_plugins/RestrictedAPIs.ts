import config from './Config.js'
import fetch from 'node-fetch'
import xpath, { SelectedValue } from 'xpath'
import { DOMParser } from 'xmldom'
import { helpers as h } from './HelperFunctions.js'
import * as gt from '@vitalets/google-translate-api'

/**
 * Restricted API access for Trakman
 * @author wiseraven & lythx
 */

tm.commands.add(
    {
        aliases: config.commands.googletranslate.aliases,
        help: config.commands.googletranslate.help,
        params: [{ name: 'from' }, { name: 'to' }, { name: 'text', type: 'multiword' }],
        callback: async (info: tm.MessageInfo, from: string, to: string, text: string): Promise<void> => {
            const res = await gt.translate(text, { from, to })
                .catch((err: Error) => err)
            if (res instanceof Error) {
                tm.sendMessage(config.commands.googletranslate.fetchError, info.login)
                return
            }
            if (res.text === '' || res.text === text) {
                tm.sendMessage(
                    tm.utils.strVar(config.commands.googletranslate.translateError, {
                        input: tm.utils.strip(text)
                    }), info.login)
                return
            }
            tm.sendMessage(
                tm.utils.strVar(config.commands.googletranslate.translateInfo, {
                    input: tm.utils.strip(text),
                    from,
                    to,
                }), config.commands.googletranslate.public ? undefined : info.login
            )
            tm.sendMessage(
                tm.utils.strVar(config.commands.googletranslate.translateResult, {
                    result: tm.utils.strip(res.text),
                }), config.commands.googletranslate.public ? undefined : info.login
            )
        },
        privilege: config.commands.googletranslate.privilege
    },
    {
        aliases: config.commands.duckduckgo.aliases,
        help: config.commands.duckduckgo.help,
        params: [{ name: 'query', type: 'multiword' }],
        callback: async (info: tm.MessageInfo, query: string): Promise<void> => {
            // Real FormData, I believe this!
            const form = new URLSearchParams()
            form.append('q', `${query.split(' ').join('+')}`)
            const url: string = config.commands.duckduckgo.apiUrl // Nothing to modify
            const response = await fetch(url, {
                method: 'POST',
                body: form,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Referer': 'https://lite.duckduckgo.com/'
                }
            }).catch((err: Error) => err)
            if (response instanceof Error) {
                tm.sendMessage(config.commands.duckduckgo.fetchError, info.login)
                return
            }
            const html: string | Error = await response.text().catch((err: Error) => err)
            if (html instanceof Error) {
                tm.sendMessage(config.commands.duckduckgo.fetchError, info.login)
                return
            }
            const xml: Document = new DOMParser({
                locator: {},
                errorHandler: { // Suppress the errors, the parser is a bit stupid
                    warning: function (w) { },
                    error: function (e) { },
                    fatalError: function (f) { },
                }
            }).parseFromString(html, "text/xml")
            const res: SelectedValue[] = xpath.select(`//html/body/form/div[@class="filters"]/table`, xml);
            if (res.length < 3) {
                tm.sendMessage(
                    tm.utils.strVar(config.commands.duckduckgo.noResult, {
                        query: query
                    }), info.login
                )
                return
            }
            const table = res[2] as Node
            const rows = xpath.select(`.//tr`, table) as Node[]
            const titleNode = xpath.select(`(//a[@class="result-link"])[1]`, rows[0])[0] as Node
            const contentNode = xpath.select(`(//td[@class="result-snippet"])[1]`, rows[1])[0] as Node
            if (titleNode === undefined || contentNode === undefined) {
                tm.sendMessage(
                    tm.utils.strVar(config.commands.duckduckgo.noResult, {
                        query: query
                    }), info.login
                )
                return
            }
            // Don't think any of these can be undefined but yeah
            const resultTitle: string = `$L[${tm.utils.fixProtocol(((xpath.select(`(//a/@href)[1]`, titleNode) as Node[])[0].textContent) ?? ``)}]${titleNode.textContent}$L`
            const resultContent: string = h.replaceArray(tm.utils.strip(contentNode.textContent ?? ``), [`[`, `]`, `\n`, `$`], [``, ``, ` `, `$$`])
            tm.sendMessage(
                tm.utils.strVar(config.commands.duckduckgo.searchInfo, {
                    query: tm.utils.strip(query) // God knows what people might put
                }), config.commands.duckduckgo.public ? undefined : info.login
            )
            tm.sendMessage(
                tm.utils.strVar(config.commands.duckduckgo.searchResult, {
                    title: resultTitle,
                    snippet: resultContent
                }), config.commands.duckduckgo.public ? undefined : info.login
            )
        },
        privilege: config.commands.duckduckgo.privilege
    }
)