const p = tm.utils.palette

export default {
  // If false plugin cant be activated
  isEnabled: true,
  // This can be changed using an ingame command
  isActive: true,
  // Time calculation mode. For now it has only one option: "author"
  defaultMode: 'author',
  // Time multiplier eg. if mode = "author" and multilpier = 10, then the time will be
  // set to `authorTime * 10`
  defaultMultiplier: 10,
  // Message gets sent at round start
  sendTimeLimitMessage: true,
  // Each mode can have its own message
  messages: {
    author: `${p.admin}The current map's ${p.highlight}AT ${p.admin}is ${p.highlight}#{authorTime}${p.admin}, time limit set to ${p.highlight}#{limit}${p.admin}.`,
  },
}