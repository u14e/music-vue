export const singer = state => state.singer

/* 播放器相关 */
export const playing = state => state.playing
export const fullScreen = state => state.fullScreen
export const playlist = state => state.playlist
export const sequenceList = state => state.sequenceList
export const mode = state => state.mode
export const currentIndex = state => state.currentIndex
export const currentSong = state => state.playlist[state.currentIndex] || {}

export const disc = state => state.disc

export const topList = state => state.topList

export const searchHistory = state => state.searchHistory