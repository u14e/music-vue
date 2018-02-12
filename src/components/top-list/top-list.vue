<template>
  <transition>
    <music-list :title="title" :bgImage="bgImage" :songs="songs" :rank="rank"></music-list>
  </transition>
</template>

<script>
import MusicList from '../music-list/music-list'
import { mapGetters } from 'vuex'
import { getMusicList } from '@/api/rank'
import { ERR_OK } from '@/api/config'
import { createSong } from '@/common/js/song'

export default {
  data () {
    return {
      songs: [],
      rank: true
    }
  },
  computed: {
    title () {
      return this.topList.topTitle
    },
    bgImage () {
      if (this.songs.length > 0) {
        return this.songs[0].image
      }
      return ''
    },
    ...mapGetters([
      'topList'
    ])
  },
  created () {
    this._getMusicList()
  },
  methods: {
    _getMusicList () {
      // 在歌单详情页刷新时，获取不到数据，直接返回排行列表页
      if (!this.topList.id) {
        this.$router.back()
        return
      }
      
      getMusicList(this.topList.id).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.songlist)
        } else {
          console.error(res.message)
        }
      })
    },
    _normalizeSongs (toplist) {
      let ret = []

      toplist.forEach(item => {
        const { data } = item
        if (data.songid && data.albummid) {
          ret.push(createSong(data))
        }
      })

      return ret
    }
  },
  components: {
    MusicList
  }
}
</script>

<style lang="stylus">
@import '~common/stylus/variable'
@import '~common/stylus/mixin'

.hello
  position fixed
  z-index 100
  top 0
  left 0
  right 0
  bottom 0
  background-color $color-background
</style>
