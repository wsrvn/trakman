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
  newTimeLimitMessage: `${p.admin}TimeAttack limit set to ${p.highlight}#{limit}${p.admin} seconds (Multiplier: ${p.highlight}#{multiplier}${p.admin}).`,
  sendTimeLimitMessage: true, // TODO
}