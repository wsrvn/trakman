import { icons, componentIds as ids } from '../../ui/UI.js'
const p = tm.utils.palette

export default {
  title: "Map List",
  icon: icons.mapList,
  textScale: 1,
  padding: 0.1,
  overlayBackground: '7777',
  defaultText: '-',
  colour: p.green,
  optionTitles: {
    jukebox: 'Jukebox'
  },
  texts: {
    map: 'Map #',
    queued: 'Queued',
    noRank: "--."
  },
  rows: 5,
  columns: 5,
  grid: {
    background: 'FFFA',
    margin: 0.15
  },
  navbar: [
    { name: 'Map Info', actionId: ids.TMXWindow }
    // TODO add detailed map info here too
  ],
  icons: [
    icons.ongoingMap,
    icons.tag,
    icons.personBuilder,
    icons.clockAuthor,
    icons.chartLocal,
    icons.karmaPulse
  ],
  iconWidth: 2,
  queueWidth: 5.2,
  queueNumberWidth: 2.9,
  timeWidth: 5,
  positionWidth: 3.1,
  iconBackground: "222C",
  contentBackground: "555C",
  plusImage: icons.addMap,
  minusImage: icons.removeMap,
  blankImage: icons.blank,
  public: true,
  messages: {
    error: `${p.error}Error while adding the map to queue.`,
    noPermission: `${p.error}You can't add more than one map to the queue.`,
    remove: `${p.highlight}#{player} ${p.vote}removed ${p.highlight}#{map}${p.vote} from the queue.`,
    add: `${p.highlight}#{player} ${p.vote}added ${p.highlight}#{map}${p.vote} to the queue.`
  },
  commands: {
    list: {
      aliases: ['l', 'ml', 'list'],
      help: `Display list of maps. Start with $a to author search. Options: jukebox, jb, name, karma, short, long, best, worst, worstkarma.`,
      privilege: 0
    },
    best: {
      aliases: ['best'],
      help: `Display list of maps sorted by rank ascending.`,
      privilege: 0
    },
    worst: {
      aliases: ['worst'],
      help: `Display list of maps sorted by rank descending.`,
      privilege: 0
    },
    jukebox: {
      aliases: ['jb', 'jukebox'],
      help: `Display jukebox.`,
      privilege: 0
    }
  }
}