const p = tm.utils.palette
export default {
    commands: {
        // Free APIs
        // TODO: ipinfo, fact, quote, crypto, currency, animequote, etc.
        urbandictionary: {
            apiUrl: `https://api.urbandictionary.com/v0/define?term=#{query}`,
            apiRandom: `https://api.urbandictionary.com/v0/random`,
            warnAboutRandom: true,
            usingRandom: `${p.error}No query specified, fetching a random definition...`,
            getRandomResult: true, // Whether to get a random definition out of the resulting JSON
            noResult: `${p.error}Couldn't find the definition for "#{word}" on UrbanDictionary.`,
            fetchError: `${p.error}Couldn't get any response from the UrbanDictionary API.`,
            definitionInfo: `${p.message}[Urban Dictionary] ${p.highlight}Score${p.message}: ${p.highlight}#{rating}${p.message}. `
                + `${p.highlight}Submitted${p.message}: ${p.highlight}#{date}${p.message}.`,
            definitionResult: `${p.message}[Urban Dictionary] ${p.highlight}#{word} ${p.message}- ${p.highlight}#{definition}${p.message}.`,
            aliases: [`ud`, `urban`, `urbandictionary`],
            help: `Query UrbanDictionary for definitions.`,
            privilege: 0,
            public: true
        },
        wikipedia: {
            apiUrl: `https://en.wikipedia.org/api/rest_v1/page/summary/#{query}?redirect=true`,
            apiRandom: `https://en.wikipedia.org/api/rest_v1/page/random/summary`,
            warnAboutRandom: true,
            usingRandom: `${p.error}No query specified, fetching a random article...`,
            noResult: `${p.error}Couldn't find the article for "#{word}" on Wikipedia.`,
            fetchError: `${p.error}Couldn't get any response from the Wikipedia API.`,
            articleInfo: `${p.message}[Wikipedia] ${p.highlight}Last Edited${p.message}: ${p.highlight}#{date}${p.message}.`,
            articleResult: `${p.message}[Wikipedia] ${p.highlight}#{name} ${p.message}- ${p.highlight}#{extract}${p.message}.`,
            aliases: [`wp`, `wiki`, `wikipedia`],
            help: `Query Wikipedia for articles.`,
            privilege: 0,
            public: true
        },
        rule34: {
            apiUrl: `https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&limit=1&pid=#{randomIndex}&tags=#{query}`,
            warnAboutRandom: true,
            usingRandom: `${p.error}No query specified, fetching a generic artwork (tag: "1girls")...`,
            noResult: `${p.error}Couldn't find any artwork with "#{tags}" tags on Rule34.`,
            fetchError: `${p.error}Couldn't get any response from the Rule34 API.`,
            artworkInfo: `${p.message}[Rule34] ${p.highlight}Rating${p.message}: ${p.highlight}#{rating}${p.message}. `
                + `${p.highlight}Submitted${p.message}: ${p.highlight}#{date}${p.message}.`,
            artworkResult: `${p.message}[Rule34] ${p.highlight}Tags${p.message}: ${p.highlight}#{tags}${p.message}, `
                + `${p.highlight}Image URL${p.message}: ${p.highlight}#{url}${p.message}.`,
            aliases: [`r34`, `rule34`],
            help: `Query Rule34 for NSFW artwork.`,
            privilege: 0,
            public: true,
            maxPages: 10, // 10 would equal to 10 artworks accessible at one given moment (if there even is any artwork available)
            defaultTags: ['1girls'] // Tags to use when none are specified
        },
        // Restricted APIs
        // TODO: googletranslate, weather, thepiratebay, etc.
        googletranslate: {
            apiUrl: ``,

        },
        duckduckgo: {
            apiUrl: `https://lite.duckduckgo.com/lite`, // There's no official API that we could use
            noQuery: `${p.error}No query specified, nothing to look for.`,
            noResult: `${p.error}Couldn't find anything about "#{query}".`,
            fetchError: `${p.error}Couldn't get any response from DuckDuckGo.`,
            searchInfo: `${p.message}[DuckDuckGo] ${p.highlight}Query${p.message}: ${p.highlight}#{query}`,
            searchResult: `${p.message}[DuckDuckGo] ${p.highlight}#{title} ${p.message}- ${p.highlight}#{snippet}${p.message}.`,
            aliases: ['ddg', 'duckduckgo', 'search'],
            help: `Query DuckDuckGo for search results.`,
            privilege: 0,
            public: true
        },
        // Fun Stuff
        // TODO: rndt, srndt, urndt, grad, rs, keygen, ship, 8ball, etc.
        // Fakes
        // TODO: fakerec, fakedon, fakeleave, fakepm, fakeban, fakeinv, fakejoin, etc.
        // Admin Stuff
        // TODO: clearchat, clearchatlog (?), mls, imls, mlm, cmls, etc.
    }
}