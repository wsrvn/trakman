import config from './Config.js'

// Methods to make my life easier
// Thanks kind strangers from StackOverflow

export const helpers = {
  /**
   * Replaces an array of characters with another array
   * @param input Input string
   * @param search Symbols to look for
   * @param replace Symbols to replace with
   * @returns String with replaced symbols
   */
  replaceArray: (input: string, search: Array<string>, replace: Array<string>): string => {
    return input.replace(new RegExp('(' + search.map(
      (i): string => {
        return i.replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&')
      }).join('|') + ')', 'g'),
      (s): string => {
        return replace[search.indexOf(s)]
      })
      .replace(/\s+/g, ' ')
  },

  /**
   * Function to prevent me from going insane
   * @param max Max value
   * @param min Min value
   * @returns Random number between max and min
   */
  getRandom: (max: number, min: number): number => {
    return Math.random() * (max - min) + min
  },

  getRandomChars: (length: number, dict: string = '1234567890abcdef'): string => {
    let res: string = ''
    for (let i: number = 0; i < length; i++) {
      res += dict.charAt(~~(Math.random() * dict.length))
    }
    return res
  },

  displayManialinks: async (amount: number, size?: number, useImages: boolean = false, imageSource?: string[], quadStyle?: string, quadSubstyle?: string,
    customPosFunctions?: {
      xfunc?: Function,
      yfunc?: Function
    }): Promise<void> => {
    let xmls: Array<string> = []
    let i: number = 0
    // SHUT UP
    let [posx, posy]: Array<Array<number>> = [[], []]
    let [key, value, image]: Array<string> = [``, ``, ``]
    const loop: NodeJS.Timeout = setInterval((): void => {
      if (i === amount - 1) {
        clearInterval(loop)
      }
      if (customPosFunctions !== undefined) {
        if (customPosFunctions.xfunc !== undefined) {
          posx[i] = customPosFunctions.xfunc(i)
        }
        if (customPosFunctions.yfunc !== undefined) {
          posy[i] = customPosFunctions.yfunc(i)
        }
      }
      // WORST IF STATEMENT?
      if (!useImages) {
        // TODO: Make it support Array<string> for quads
        key = quadStyle === undefined ? Object.keys(config.quads)[~~(Math.random() * Object.keys(config.quads).length)] : quadStyle
        value = quadSubstyle === undefined ? config.quads[key as keyof typeof config.quads][~~(Math.random() * Object.keys(config.quads).length)] : quadSubstyle
      } else if (useImages && imageSource !== undefined) {
        image = tm.utils.fixProtocol(imageSource[~~(Math.random() * imageSource.length)])
      } else {
        tm.log.warn(`Might have mixed something up, try again?`)
        clearInterval(loop)
      }
      xmls.push(
        `<manialink id ="${config.manialinkId + i}">
                    <frame posn="
                    ${posx[i] === undefined ? helpers.getRandom(config.commands.shared.framePosLimitX, -config.commands.shared.framePosLimitX) : posx[i]} 
                    ${posy[i] === undefined ? helpers.getRandom(config.commands.shared.framePosLimitY, -config.commands.shared.framePosLimitY) : posy[i]} 
                    ${helpers.getRandom(config.commands.shared.framePosLimitZ, -config.commands.shared.framePosLimitZ)}
                    ">
                    <quad posn="0 0 0" 
                    sizen="
                    ${size !== undefined ? size : helpers.getRandom(config.commands.shared.quadSizeLimit, -config.commands.shared.quadSizeLimit)} 
                    ${size !== undefined ? size : helpers.getRandom(config.commands.shared.quadSizeLimit, -config.commands.shared.quadSizeLimit)}
                    " 
                    halign="center" valign="center" 
                    ${useImages
          ?
          `image="${image}" url="${image}" `
          :
          `style="${key}" substyle="${value}" `}
                    action="${config.manialinkId + i}"/>
                    </frame>
                    </manialink>`
      )
      tm.sendManialink(xmls[i])
      i++
    }, config.commands.shared.updateInterval * 1000)
  },

  /**
   * Hides manialinks created by displayManialinks function
   * @param amount Amount of manialinks to hide
   */
  hideManialinks: async (amount: number): Promise<void> => {
    let xmls: Array<string> = []
    let i: number = 0
    const loop: NodeJS.Timeout = setInterval((): void => {
      if (i === amount - 1) {
        clearInterval(loop)
      }
      xmls.push(
        `<manialink id ="${config.manialinkId + i}">
                    <frame posn="0 0">
                    <quad posn="0 0 0" 
                    sizen="0 0" 
                    halign="center" 
                    valign="center"
                    />
                    </frame>
                    </manialink>`
      )
      tm.sendManialink(xmls[i])
      i++
    }, config.commands.shared.updateInterval * 1000)
  },

  /**
   * 
   * @returns All rows as an array from the 'images' table
   */
  getDbImages: async (): Promise<any | Error> => {
    const query: string = `select url from images`
    // COPE TYPESCRIPT IM A JS PROGRAMMER
    return ((await tm.db.query(query) as any).map((a: any) => a.url))
  },

  pushDbImage: async (url: string): Promise<void> => {
    const query: string = 'insert into images(url) values ($1)'
    await tm.db.query(query, url)
  },
}