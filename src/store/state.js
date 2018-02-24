import { playMode } from '@/common/js/config'
import { loadSearch } from '@/common/js/cache'

const state = {
  // 选中的歌手
  singer: {},

  // 播放器相关
  playing: false, // 是否播放
  fullScreen: false, // 播放器是否展开
  playlist: [], // 播放列表(根据播放模式变化)
  sequenceList: [], // 原始播放列表
  mode: playMode.sequence, // 播放模式
  currentIndex: -1, // 当前播放索引

  // 选中的歌单
  disc: {},

  // 选中的top排行中的歌单
  topList: {},

  // 搜索历史
  searchHistory: loadSearch(),  
}

export default state