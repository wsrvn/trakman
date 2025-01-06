import cfg from '../../config/RaceUi.js'
import icons from '../../config/Icons.js'

export default {
  entryHeight: 2.16,
  entries: 7,
  width: cfg.width,
  horizontalModeWidth: cfg.rightPosition - cfg.leftPosition - cfg.width - cfg.margin * 2,
  posX: cfg.leftPosition + cfg.marginBig + cfg.width,
  horizontalModePosX: cfg.leftPosition + cfg.width + cfg.margin,
  posY: cfg.topBorder - 2.16,
  side: false,
  title: "Best Cps",
  icon: icons.bestClock,
  margin: cfg.margin,
  background: cfg.background,
  columnProportions: [
    1,
    2.8,
    4
  ],
  selfColour: `${tm.utils.palette.green}F`,
  newestColour: `${tm.utils.palette.yellow}F`,
  textScale: 0.87,
  textPadding: 0.2,
  upIcon: icons.pageLeft,
  downIcon: icons.pageRight,
  upIconHover: icons.pageLeftHover,
  downIconHover: icons.pageRightHover,
  horizontal: true,
  horizontalMaxRows: 5,
  hidePanel: true,
}
