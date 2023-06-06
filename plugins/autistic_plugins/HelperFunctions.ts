// Methods to make my life easier
// Thanks kind strangers from StackOverflow

export const helpers = {
    // Replaces an array of characters with another array
    // Something like str_replace in PHP
    replaceArray: (input: string, search: Array<string>, replace: Array<string>): string => {
        return input.replace(new RegExp('(' + search.map(
            (i): string => {
                return i.replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&')
            }).join('|') + ')', 'g'),
            (s): string => {
                return replace[search.indexOf(s)]
            })
            .replace(/\s+/g, ' ')
    }
}