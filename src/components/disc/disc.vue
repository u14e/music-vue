<template>
  <transition>
    <music-list :songs="songs" :title="title" :bgImage="bgImage"></music-list>
  </transition>
</template>

<script>
import MusicList from '../music-list/music-list'
import { mapGetters } from 'vuex'
import { getSongList } from '@/api/recommend'
import { ERR_OK } from '@/api/config'
import { createSong } from '@/common/js/song'

export default {
  data () {
    return {
      songs: []
    }
  },
  computed: {
    title () {
      return this.disc.dissname
    },
    bgImage () {
      return this.disc.imgurl
    },
    ...mapGetters([
      'disc'
    ])
  },
  created () {
    this._getSongList()
  },
  methods: {
    _getSongList () {
      // 在歌单详情页刷新时，获取不到数据，直接返回歌单列表页
      if (!this.disc.dissid) {
        this.$router.back()
        return
      }

      getSongList(this.disc.dissid).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.cdlist[0].songlist)
        } else {
          console.error(res.message)
        }
      })
    },
    _normalizeSongs (list) {
      let ret = []

      list.forEach(item => {
        if (item.songid && item.albummid) {
          ret.push(createSong(item))
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

.v-enter-active, .v-leave-active
  transition all .3s
.v-enter, .v-leave-to
  transform translate3d(100%, 0, 0)
</style>
