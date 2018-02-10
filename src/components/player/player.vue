<template>
  <div class="player" v-show="playlist.length>0">
    <transition>    
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img :src="currentSong.image" width="100%" height="100%">
        </div>
        <div class="top">
          <div class="back" @click="back"><i class="icon-back"></i></div>
          <h1 class="title">{{ currentSong.name }}</h1>
          <h2 class="subtitle">{{ currentSong.singer }}</h2>
        </div>
        <div class="middle">
          <div class="middle-l">
            <div class="cd-wrapper">
              <div class="cd">
                <img :src="currentSong.image" class="image" :class="cdCls">
              </div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="progress-wrapper">
            <span class="time time-l">{{ format(currentTime) }}</span>
            <div class="progress-bar-wrapper">
              <progress-bar
                :percent="percent"
                @percentChange="onProgressBarChange"
              ></progress-bar>
            </div>
            <span class="time time-r">{{ format(currentSong.duration) }}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i class="icon-sequence"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center" @click="togglePlaying" :class="disableCls">
              <i :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition>
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <div class="imgWrapper">
            <img :src="currentSong.image" :class="cdCls" width="40px" height="40px">
          </div>
        </div>
        <div class="text">
          <h2 class="name">{{ currentSong.name }}</h2>
          <p class="desc">{{ currentSong.singer }}</p>
        </div>
        <div class="control" @click.stop="togglePlaying">
          <i class="icon-mini" :class="miniIcon"></i>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio
      ref="audio"
      :src="currentSong.url"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
    ></audio>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import ProgressBar from '@/base/progress-bar/progress-bar'

export default {
  data () {
    return {
      songReady: false,
      currentTime: 0
    }
  },
  computed: {
    playIcon () {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    miniIcon () {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    cdCls () {
      return this.playing ? 'play' : 'play pause'
    },
    disableCls () {
      return this.songReady ? '' : 'disable'
    },
    percent () {
      return this.currentTime / this.currentSong.duration
    },
    ...mapGetters([
      'fullScreen',
      'playlist',
      'currentSong',
      'playing',
      'currentIndex'
    ])
  },
  methods: {
    back () {
      this.setFullScreen(false)
    },
    open () {
      this.setFullScreen(true)
    },
    togglePlaying () {
      this.setPlayingState(!this.playing)
    },
    next () {
      if (!this.songReady) return

      let index = this.currentIndex + 1
      if (index === this.playlist.length) {
        index = 0
      }
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.togglePlaying()
      }

      this.songReady = false
    },
    prev () {
      if (!this.songReady) return

      let index = this.currentIndex - 1
      if (index === -1) {
        index = this.playlist.length - 1
      }
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.togglePlaying()
      }

      this.songReady = false
    },
    // 歌曲加载成功
    ready () {  
      this.songReady = true
    },
    // 歌曲加载失败
    error () {
      this.songReady = true
    },
    updateTime (e) {
      this.currentTime = e.target.currentTime
    },
    onProgressBarChange (percent) {
      this.$refs.audio.currentTime = this.currentSong.duration * percent
      if (!this.playing) {
        this.togglePlaying()
      }
    },
    format (interval) {
      interval = Math.floor(interval)
      const minutes = Math.floor(interval / 60)
      const seconds = this._pad(interval % 60)
      return `${minutes}:${seconds}`
    },
    // 补位
    _pad (num, n = 2) {
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len++
      }
      return num
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX'
    })
  },
  watch: {
    currentSong () {
      this.$nextTick(() => {
        this.$refs.audio.play() // dom更新之后才能调用
      })
    },
    playing (newPlaying) {
      let audio = this.$refs.audio
      this.$nextTick(() => {
        newPlaying ? audio.play() : audio.pause() // 同上
      })
    }
  },
  components: {
    ProgressBar
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'
@import '~common/stylus/mixin'

.player
  .normal-player
    position fixed
    left 0
    right 0
    top 0
    bottom 0
    z-index 150
    background-color $color-background
    .background
      position absolute
      z-index -1
      left 0
      top 0
      width 100%
      height 100%
      filter blur(20px)
    .top
      position relative
      margin-bottom 25px
      .back
        position absolute
        top 0
        left 6px
        z-index 50
        .icon-back
          display block
          padding 10px
          font-size $font-size-large-x
          color $color-theme
          transform rotate(-90deg)
      .title
        width 70%
        margin 0 auto
        line-height 42px
        text-align center
      .subtitle
        line-height 20px
        text-align center
        font-size $font-size-medium
        color $color-text
    .middle
      position fixed
      top 80px
      width 100%
      bottom 170px
      white-space nowrap
      font-size 0
      .middle-l
        display inline-block
        vertical-align top
        position relative
        width 100%
        height 0
        padding-top 80%
        .cd-wrapper
          position absolute
          top 0
          left 10%
          width 80%
          height 100%
          box-sizing border-box
          .cd
            width 100%
            height 100%
            border-radius 50%
            .image
              position absolute
              left 0
              top 0
              width 100%
              height 100%
              box-sizing border-box
              border-radius 50%
              border 10px solid rgba(255, 255, 255, .1)
            .play
              animation rotate 20s linear infinite
            .pause
              animation-play-state paused
    .bottom
      position absolute
      bottom 50px
      width 100%
      .progress-wrapper
        display flex
        align-items center
        width 80%
        margin 0 auto
        padding 10px 0
        .time
          flex 0 0 30px
          width 30px
          line-height 30px
          font-size $font-size-small
          color $color-text
          &.time-l
            text-align left
          &.time-r
            text-align right
        .progress-bar-wrapper
          flex 1
      .operators
        display flex
        align-items center
        .icon
          flex 1
          color $color-theme
          &.disable
            color $color-theme-d
          i
            font-size 30px
        .i-left
          text-align right
        .i-center
          text-align center
          i
            font-size 40px
        .i-right
          text-align left
        .icon-favorite
          color $color-sub-theme
    &.v-enter-active, &.v-leave-active
      transition all .4s
      .top, .bottom, .middle
        transition all .4s
    &.v-enter, &.v-leave-to
      opacity 0
      .top
        transform translate3d(0, -100px, 0)
      .bottom
        transform translate3d(0, 100px, 0)
      .middle
        transform scale(0)
  .mini-player
    display flex
    align-items center
    position fixed
    left 0
    bottom 0
    height 60px
    width 100%
    background $color-highlight-background
    &.v-enter-active, &.v-leave-active
      transition all .4s
    &.v-enter, &.v-leave-to
      opacity 0
    .icon
      flex 0 0 40px
      width 40px
      height 40px
      padding 0 10px 0 20px
      .imgWrapper
        width 100%
        height 100%
        img
          border-radius 50%
          &.play
            animation rotate 20s linear infinite
          &.pause
            animation-play-state paused
    .text
      display flex
      flex-direction column
      justify-content center
      flex 1
      line-height 20px
      overflow hidden
      .name
        margin-bottom 2px
        no-wrap()
        font-size $font-size-medium
        color $color-text
      .desc
        no-wrap()
        font-size $font-size-small
        color $color-text-d
    .control
      flex 0 0 30px
      width 30px
      padding 0 10px
      .icon-playlist, .icon-play-mini, .icon-pause-mini
        font-size 30px
        color $color-theme-d

@keyframes rotate
  0%
    transform rotate(0)
  100%
    transform rotate(360deg)

</style>
