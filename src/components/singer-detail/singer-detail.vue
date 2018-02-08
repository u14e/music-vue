<template>
  <transition>
    <div class="singer-detail">
      <music-list
        :songs="songs"
        :title="singer.name"
        :bgImage="singer.avatar"
      ></music-list>
    </div>  
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSingerDetail } from '@/api/singer'
import { ERR_OK } from '@/api/config'
import { createSong } from '@/common/js/song'
import MusicList from '../music-list/music-list'

export default {
  data () {
    return {
      songs: []
    }
  },
  computed: {
    ...mapGetters([
      'singer'
    ])
  },
  created () {
    this._getDetail()
  },
  methods: {
    _getDetail () {
      // 在歌手详情页刷新时，获取不到数据，直接返回歌手列表页
      if (!this.singer.id) {
        this.$router.back()
        return
      }

      getSingerDetail(this.singer.id).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.data.list)
        } else {
          console.error(res.message)
        }
      })
    },
    _normalizeSongs (list) {
      let ret = []

      list.forEach(item => {
        let { musicData } = item
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
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

<style lang="stylus" scoped>
@import '~common/stylus/variable'

.singer-detail
  position fixed
  z-index 100
  top 0
  bottom 0
  left 0
  right 0
  background-color $color-background

.v-enter-active, .v-leave-active
  transition all .3s
.v-enter, .v-leave-to
  transform translate3d(100%, 0, 0)
</style>
