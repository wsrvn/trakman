import icons from '../../config/Icons.js'
import cfg from '../../config/RaceUi.js'
const p = tm.utils.palette

export default {
  height: 5.45,
  stuntsDynamicMarginTop: 5.5,
  stuntsHeight: 6.45 + 5.5,
  width: cfg.width,
  title: "Timer",
  icon: icons.clock,
  displayHeader: false,
  margin: cfg.margin,
  background: cfg.background,
  timerActionsPrivilege: 1,
  buttonWidth: 1.7,
  notDynamic: `${p.error}Dynamic timer is disabled.`,
  buttonOrder: ['pause', 'add', 'subtract'],
  pausedText: 'PAUSED',
  textYOffset: -0.3,
  icons: {
    pause: icons.pause,
    resume: icons.play,
    add: icons.plus,
    subtract: icons.minus,
  },
  iconsHover: {
    pause: icons.pauseGreen,
    resume: icons.playGreen,
    add: icons.plusGreen,
    subtract: icons.minusGreen
  },
  timeColours: ['FFF', tm.utils.palette.yellow, tm.utils.palette.red],
  colourChangeThresholds: [180, 60], //sec
  iconPadding: 0.3,
  timeAddedOnClick: 5 * 60 * 1000, //msec
  timeSubtractedOnClick: 5 * 60 * 1000, //msec
  pause: `${p.admin}#{title} ${p.highlight}#{adminName} ${p.admin}has ${p.highlight}paused ${p.admin}the timer.`,
  resume: `${p.admin}#{title} ${p.highlight}#{adminName} ${p.admin}has ${p.highlight}resumed ${p.admin}the timer.`,
  set: `${p.admin}#{title} ${p.highlight}#{adminName} ${p.admin}has set the remaining time to ${p.highlight}#{time}${p.admin}.`,
}