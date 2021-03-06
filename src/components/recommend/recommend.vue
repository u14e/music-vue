<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <div>
        <div v-if="recommends.length" class="slider-wrapper">
          <div class="slider-content">
            <slider>
              <div v-for="recommend in recommends" :key="recommend.id">
                <a :href="recommend.linkUrl">
                  <img @load="loadImage" :src="recommend.picUrl">
                </a>
              </div>
            </slider>
          </div>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li class="item"
              v-for="disc in discList"
              :key="disc.dissid"
              @click="selectItem(disc)"
            >
              <div class="icon">
                <img v-lazy="disc.imgurl" width="60" height="60">
              </div>
              <div class="text">
                <h2 class="name">{{ disc.creator.name }}</h2>
                <p class="desc">{{ disc.dissname }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import { getRecommend, getDiscList } from '@/api/recommend'
import { ERR_OK } from '@/api/config'
import Slider from '@/base/slider/slider'
import Scroll from '@/base/scroll/scroll'
import Loading from '@/base/loading/loading'
import { playlistMixin } from '@/common/js/mixin'
import { mapMutations } from 'vuex'

export default {
  mixins: [playlistMixin],
  data () {
    return {
      recommends: [],
      discList: [],
    }
  },
  created () {
    this._getRecommend()
    this._getDiscList()
  },
  methods: {
    selectItem (disc) {
      this.$router.push({ name: 'disc', params: { id: disc.dissid } })
      this.setDisc(disc)
    },
    _getRecommend () {
      getRecommend().then(res => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider
        }
      })
    },
    _getDiscList () {
      getDiscList().then(res => {
        if (res.code === ERR_OK) {
          this.discList = res.data.list
        } else {
          console.error(res.message)
        }
      })
    },
    loadImage () {
      if (!this.checkLoaded) {
        this.$refs.scroll.refresh()
        this.checkLoaded = true
      }
    },
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.recommend.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    ...mapMutations({
      setDisc: 'SET_DISC'
    })
  },
  components: {
    Slider,
    Scroll,
    Loading,
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'

.recommend
  position fixed
  top 88px
  width 100%
  bottom 0
  .recommend-content
    height 100%
    overflow hidden
    .slider-wrapper
      position relative
      width 100%
      height 0
      padding-top 40%
      overflow hidden
      .slider-content
        position absolute
        left 0
        top 0
        width 100%
        height 100%
  .recommend-list
    .list-title
      height 65px
      line-height 65px
      text-align center
      font-size $font-size-medium
      color $color-theme
    .item
      display flex
      box-sizing border-box
      align-items center
      padding 0 20px 20px
      .icon
        flex 0 0 60px
        width 60px
        padding-right 20px
        img
          display block
      .text
        display flex
        flex-direction column
        justify-content center        
        flex 1
        line-height 20px
        overflow hidden
        font-size $font-size-medium
        .name
          margin-bottom 10px
          color $color-text
        .desc
          color $color-text-d
  .loading-container
    position absolute
    top 50%
    width 100%
    transform translateY(-50%)
</style>
