import { resultConfig as cfg, icons, StaticHeader } from '../../UI.js'

/**
 * Banner image ratio is around 4:1
 */
export default {
  entries: 5,
  entryHeight: 2.15,
  image: 'https://trakman.ptrk.eu/icons/CrazyTrakman.png',
  imageLink: tm.config.controller.repo,
  width: cfg.width,
  background: StaticHeader.resultPreset.iconBackground,
  donateAmounts: [50, 100, 200, 500, 1000, 5000],
  textScale: 0.9,
  resultWidth: cfg.width,
  donateBackground: cfg.background,
  donateText: 'Donate',
  mainTextBackground: '',
  buttonHeight: 3,
  margin: cfg.margin,
  leftBorder: cfg.leftPosition,
  rightBorder: cfg.rightPosition,
  topBorder: cfg.topBorder,
  marginBig: cfg.marginBig
}
