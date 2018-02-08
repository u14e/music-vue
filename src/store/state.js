import { playMode } from '@/common/js/config'

const state = {
  singer: {},
  // 播放器相关
  playing: false, // 是否播放
  fullScreen: false, // 播放器是否展开
  playlist: [], // 播放列表
  sequenceList: [], // 序列列表(根据播放模式变化)
  model: playMode.sequence, // 播放模式
  currentIndex: -1, // 当前播放缩影
}

export default state