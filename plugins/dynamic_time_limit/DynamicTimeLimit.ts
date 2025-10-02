import config from './Config.js'
import 'dotenv/config'
import type { DynamicTimeLimitMode } from './Types.js'

let isActive = config.isActive && config.isEnabled
let dynamicTimeLimitMode: DynamicTimeLimitMode = config.defaultMode as DynamicTimeLimitMode
let dynamicTimeLimitMultiplier = config.defaultMultiplier

const modeFunctions: { [mode in DynamicTimeLimitMode]: (map: tm.Map) => number } = {
  author: map => map.authorTime * dynamicTimeLimitMultiplier
}

function setStaticTimeLimitForNextMap()  {
  const nextMap = tm.jukebox.queue[0]
  const timeLimit = modeFunctions[dynamicTimeLimitMode](nextMap)
  tm.timer.setTimeLimit(timeLimit)  
}

tm.addListener("BeginMap", info => {
  if (!isActive) { return }
  if (tm.timer.isDynamic) {
    const timeLimit = modeFunctions[dynamicTimeLimitMode](info)
    tm.timer.setTime(timeLimit)
  } else {
    setStaticTimeLimitForNextMap()
  }
})

tm.addListener("JukeboxChanged", () => {
  if (!isActive) { return }
  setStaticTimeLimitForNextMap()
})

/**
 * Sets dynamic time limits (eg. based on author time)
 * @author lythx
 * @since 1.16.2
 */
export const dynamicTimeLimit = {
  /**
   * Activates the plugin on next map.
   * @returns Boolean indicating whether the plugin is enabled.
   */
  activate(): boolean {
    if (!config.isEnabled) { return false }
    isActive = true
    return true
  },
  /**
   * Deactivates the plugin on next map.
   * @returns Boolean indicating whether the plugin is enabled.
   */
  deactivate(): boolean {
    if (!config.isEnabled) { return false }
    isActive = false
    return true
  },

  set mode(mode: DynamicTimeLimitMode) {
    dynamicTimeLimitMode = mode
  },

  get mode(): DynamicTimeLimitMode {
    return dynamicTimeLimitMode
  },

  set multiplier(multiplier: number) {
    dynamicTimeLimitMultiplier = multiplier
  },

  get multiplier(): number {
    return dynamicTimeLimitMultiplier
  },

  /**
   * Boolean indicating whether the plugin is currently active.
   */
  get isActive(): boolean {
    return isActive
  },

  /**
   * Plugin status
   */
  isEnabled: config.isEnabled

}
