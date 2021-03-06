<template>
  <transition>
    <div class="playlist" v-show="showFlag" @click="hide">
      <!-- @click.stop防止点击内部时冒泡触发playlist的click事件 -->
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="iconMode" @click="changeMode"></i>
            <span class="text">{{ modeText }}</span>
            <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
        </div>
        <scroll ref="listContent" class="list-content" :data="sequenceList">
          <transition-group name="list" tag="ul">
            <li class="item"
              ref="listItem"
              v-for="(item, index) in sequenceList" :key="item.id"
              @click="selectItem(item, index)"
            >
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text">{{ item.name }}</span>
              <span class="like" v-show="false"><i class="icon-not-favorite"></i></span>
              <span class="delete" @click.stop="deleteOne(item)"><i class="icon-delete"></i></span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate" v-show="false">
          <div class="add">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="confirm"
        @confirm="confirmClear"
        confirmBtnText="清空"
        text="是否清空播放列表"
      ></confirm>
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import Scroll from '@/base/scroll/scroll'
import Confirm from '@/base/confirm/confirm'
import { playMode } from '@/common/js/config'
import { playerMixin } from '@/common/js/mixin'

export default {
  mixins: [playerMixin],
  computed: {
    /* eslint-disable indent */
    modeText () {
      return this.mode === playMode.sequence 
                            ? '顺序播放' : this.mode === playMode.random
                            ? '随机播放' : '单曲循环'
    },
    ...mapGetters([
      'sequenceList',
      'currentSong',
      'mode',
      'playlist'
    ])
  },
  watch: {
    currentSong (newSong, oldSong) {
      if (!this.showFlag || newSong.id === oldSong.id) return
      this.scrollToCurrent(newSong)
    }
  },
  data () {
    return {
      showFlag: false
    }
  },
  methods: {
    show () {
      this.showFlag = true
      // 显示时，在list-content渲染完成后refresh组件scroll
      setTimeout(() => {
        this.$refs.listContent.refresh()
        this.scrollToCurrent(this.currentSong)
      }, 20)
    },
    hide () {
      this.showFlag = false
    },
    getCurrentIcon (item) {
      return item.id === this.currentSong.id ? 'icon-play' : ''
    },
    selectItem (item, index) {
      if (this.mode === playMode.random) {
        index = this.playlist.findIndex(song => song.id === item.id)
      }
      this.setCurrentIndex(index)
      this.setPlayingState(true)
    },
    scrollToCurrent (current) {
      const index = this.sequenceList.findIndex(song => song.id === current.id)
      this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 300)
    },
    deleteOne (item) {
      this.deleteSong(item)
      if (!this.playlist.length) {
        this.hide()
      }
    },
    showConfirm () {
      this.$refs.confirm.show()
    },
    confirmClear () {
      this.deleteSongList()
      this.hide()
    },
    ...mapMutations({
      'setCurrentIndex': 'SET_CURRENT_INDEX',
      'setPlayingState': 'SET_PLAYING_STATE',
    }),
    ...mapActions([
      'deleteSong',
      'deleteSongList'
    ])
  },
  components: {
    Scroll,
    Confirm,
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'
@import '~common/stylus/mixin'

.playlist
  position fixed
  top 0
  bottom 0
  left 0
  right 0
  z-index 200
  background-color $color-background-d
  &.v-enter-active, &.v-leave-active
    transition opacity .3s
    .list-wrapper
      transition all .3s
  &.v-enter, &.v-leave-to
    opacity 0
    .list-wrapper
      transform translate3d(0, 100%, 0)
  &.v-enter
  .list-wrapper
    position absolute
    left 0
    bottom 0
    width 100%
    background-color $color-highlight-background
    .list-header
      padding 20px 30px 10px 20px
      .title
        display flex
        align-items center
        .icon
          margin-right 10px
          font-size 30px
          color $color-theme-d
        .text
          flex 1
          font-size $font-size-medium
          color $color-text-l
        .clear
          extend-click()
          font-size $font-size-medium
          color $color-text-d
    .list-content
      max-height 240px
      overflow hidden
      .item
        display flex
        align-items center
        height 40px
        padding 0 30px 0 20px
        overflow hidden
        &.list-enter-active
        &.list-leave-active
          transition all .1s
        &.list-enter
        &.list-leave-to
          height 0
        .current
          flex 0 0 20px
          width 20px
          font-size $font-size-small
          color $color-theme-d
        .text
          flex 1
          no-wrap()
          font-size $font-size-medium
          color $color-text-d
        .like
          extend-click()
          margin-right 15px
          font-size $font-size-small
          color $color-theme
          .icon-favorite
            color $color-sub-theme
        .delete
          extend-click()
          font-size $font-size-small
          color $color-theme
    .list-operate
      width 140px
      margin 20px auto 30px
      .add
        display flex
        align-items center
        padding 8px 16px
        border 1px solid $color-text-l
        border-radius 100px
        color $color-text-l
        .icon-add
          margin-right 5px
          font-size $font-size-small-s
        .text
          font-size $font-size-small
    .list-close
      line-height 50px
      text-align center
      font-size $font-size-medium-x
      color $color-text-l
      background-color $color-background
</style>
