import config from './Config.js'
import 'dotenv/config'
import type { DynamicTimeLimitMode } from './Types.js'

let isActive = config.isActive && config.isEnabled
let dynamicTimeLimitMode: DynamicTimeLimitMode = config.defaultMode as DynamicTimeLimitMode
let dynamicTimeLimitMultiplier = config.defaultMultiplier

const modeFunctions: { [mode in DynamicTimeLimitMode]: (map: tm.Map) => number } = {
  author: map => map.authorTime * dynamicTimeLimitMultiplier
}

function setStaticTimeLimitForNextMap() {
  const nextMap = tm.jukebox.queue[0]
  const timeLimit = modeFunctions[dynamicTimeLimitMode](nextMap)
  tm.timer.setTimeLimit(timeLimit)
}

function setDynamicTimeLimitForNextMap() {
  const timeLimit = modeFunctions[dynamicTimeLimitMode](tm.maps.current)
  tm.timer.setTimeLimit(timeLimit)
}

tm.addListener("ServerStateChanged", state => {
  if (!isActive) { return }
  if (state === "race" && tm.timer.isDynamic) {
    setDynamicTimeLimitForNextMap()
  }
  else if (state === "result" && !tm.timer.isDynamicOnNextRound) {
    setStaticTimeLimitForNextMap()
  }
})

tm.addListener("JukeboxChanged", () => {
  if (!isActive) { return }
  setStaticTimeLimitForNextMap()
})

tm.addListener("DynamicTimerStateChanged", state => {
  if (!isActive) { return }
  if (state === "enabled") {
    setDynamicTimeLimitForNextMap()
  }
  else if (state === "disabled") {
    setStaticTimeLimitForNextMap()
  }
})

tm.addListener("BeginMap", () => {
  if (!isActive || !config.sendTimeLimitMessage) { return }
  const timeLimit = modeFunctions[dynamicTimeLimitMode](tm.maps.current)
  tm.sendMessage(tm.utils.strVar(config.messages[dynamicTimeLimitMode], {
    limit: tm.utils.getVerboseTime(timeLimit),
    authorTime: tm.utils.getTimeString(tm.maps.current.authorTime)
  }))
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

  /**
   * Gets or sets the mode used to calculate the time limit.
   */
  set mode(mode: DynamicTimeLimitMode) {
    dynamicTimeLimitMode = mode
  },

  /**
   * Gets or sets the mode used to calculate the time limit.
   */
  get mode(): DynamicTimeLimitMode {
    return dynamicTimeLimitMode
  },

  /**
   * Gets or sets the multiplier used to calculate the time limit.
   */
  set multiplier(multiplier: number) {
    dynamicTimeLimitMultiplier = multiplier
  },

  /**
   * Gets or sets the multiplier used to calculate the time limit.
   */
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
