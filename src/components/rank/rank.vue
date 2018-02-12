<template>
  <div class="rank" ref="rank">
    <scroll class="toplist" :data="topList" ref="toplist">
      <ul>
        <li class="item"
          v-for="item in topList" :key="item.id"
          @click="selectItem(item)"
        >
          <div class="icon">
            <img width="100" height="100" v-lazy="item.picUrl">
          </div>
          <ul class="songlist">
            <li class="song"
              v-for="(song, index) in item.songList"
              :key="index"
            >
              <span>{{ index + 1 }}</span>
              <span>{{song.singername }}-{{ song.songname }}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="!topList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import { getTopList } from '@/api/rank'
import { ERR_OK } from '@/api/config'
import Scroll from '@/base/scroll/scroll'
import Loading from '@/base/loading/loading'
import { playlistMixin } from '@/common/js/mixin'
import { mapMutations } from 'vuex'

export default {
  mixins: [playlistMixin],
  data () {
    return {
      topList: []
    }
  },
  created () {
    this._getTopList()
  },
  methods: {
    _getTopList () {
      getTopList().then(res => {
        if (res.code === ERR_OK) {
          this.topList = res.data.topList
        } else {
          console.error(res.message)
        }
      })
    },
    selectItem (item) {
      this.$router.push({ name: 'top-list', params: { id: item.id } })
      this.setTopList(item)
    },
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.rank.style.bottom = bottom
      this.$refs.toplist.refresh()
    },
    ...mapMutations({
      setTopList: 'SET_TOP_LIST'
    })
  },
  components: {
    Scroll,
    Loading
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'
@import '~common/stylus/mixin'

.rank
  position fixed
  top 88px
  bottom 0
  width 100%
  .toplist
    height 100%
    overflow hidden
    .item
      display flex
      margin 0 20px
      padding-top 20px
      height 100px
      &:last-child
        padding-bottom 20px
      .icon
        flex 0 0 100px
        width 100px
        height 100px
      .songlist
        flex 1
        display flex
        flex-direction column
        justify-content center
        height 100px
        padding 0 20px
        overflow hidden
        background-color $color-highlight-background
        color $color-text-d
        font-size $font-size-small
        .song
          no-wrap()
          line-height 26px
  .loading-container
    position absolute
    top 50%
    transform translateY(-50%)
    width 100%
</style>
