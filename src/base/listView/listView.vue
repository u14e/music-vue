<template>
  <scroll class="listview"
    :data="data"
    ref="listview" 
    :listenScroll="listenScroll"
    @scroll="scroll"
    :probeType="probeType"
  >
    <ul>
      <li class="list-group"
        v-for="(group, index) in data" 
        :key="index"
        :data-index="index"
        ref="listgroup"
      >
        <h2 class="list-group-title">{{ group.title }}</h2>
        <ul>
          <li class="list-group-item"
            v-for="item in group.items" 
            :key="item.id"
            @click="selectItem(item)"
          >
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut"
      @touchstart="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove"
    >
      <ul>
        <li class="item"
          :class="{'current': currentIndex === index}"
          v-for="(item, index) in shortcutList"
          :key="index"
          :data-index="index"
        >
          {{ item }}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h2 class="fixed-title">{{ fixedTitle }}</h2>
    </div>
    <div class="loading-container" v-show="!data.length">
      <loading></loading>
    </div>
  </scroll>
</template>

<script>
import Scroll from '@/base/scroll/scroll'
import { getData, prefixStyle } from '@/common/js/dom'
import Loading from '@/base/loading/loading'

const ANCHOR_HEIGHT = 18 // 锚点高度(css确定的)
const TITLE_HEIGHT = 30 // 标题高度(css确定的)
const transform = prefixStyle('transform')

export default {
  props: {
    data: Array,
    default: []
  },
  data () {
    return {
      scrollY: -1,
      currentIndex: 0, // 锚点的当前索引
      diff: -1
    }
  },
  watch: {
    data () {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY (newY) {
      const listHeight = this.listHeight
      // 当滚动到顶部时
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      // 在中间部分滚动
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i] // 高度下限
        let height2 = listHeight[i + 1] // 高度上限
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i
          this.diff = height2 + newY // 高度上限 - 滚动高度
          return
        }
      }
      // 当滚动到底部时，且newY大于最后一个元素的高度上限
      this.currentIndex = listHeight.length - 2
    },
    diff (newVal) {
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
      if (this.fixedTop === fixedTop) return
      this.fixedTop = fixedTop
      this.$refs.fixed.style[transform] = `translate3d(0, ${fixedTop}px, 0)`
    }
  },
  created () {
    this.touch = {}
    this.listenScroll = true
    this.listHeight = []
    this.probeType = 3
  },
  computed: {
    shortcutList () {
      return this.data.map(group => group.title.substr(0, 1))
    },
    fixedTitle () {
      if (this.scrollY > 0) {
        return ''
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  methods: {
    onShortcutTouchStart (e) {
      let anchorIndex = getData(e.target, 'index')

      let firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY
      this.touch.anchorIndex = anchorIndex // 初始化刚开始点击的锚点的索引

      this._scrollTo(anchorIndex)
    },
    onShortcutTouchMove (e) {
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      // y轴偏移，计算偏移几个锚点
      let delta = Math.floor((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT)
      let anchorIndex = +this.touch.anchorIndex + delta

      this._scrollTo(anchorIndex)
    },
    scroll (pos) {
      this.scrollY = pos.y
    },
    _scrollTo (index) {
      // 导航的上下内边距(为美化而设置的)touchstart时不要滚动
      if (!index && index !== 0) return
      // 导航的上下内边距(为美化而设置的)touchmove时
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }

      this.scrollY = -this.listHeight[index]
      this.$refs.listview.scrollToElement(this.$refs.listgroup[index], 0)      
    },
    _calculateHeight () {
      this.listHeight = []
      const list = this.$refs.listgroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    },
    selectItem (item) {
      this.$emit('select', item)
    }
  },
  components: {
    Scroll,
    Loading
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'

.listview
  position relative
  width 100%
  height 100%
  overflow hidden
  background-color $color-background
  .list-group
    padding-bottom 30px
    .list-group-title
      height 30px
      line-height 30px
      padding-left 20px
      font-size $font-size-small
      color $color-text-l
      background-color $color-highlight-background
    .list-group-item
      display flex
      align-items center 
      padding 20px 0 0 30px
      .avatar
        width 50px
        height 50px
        border-radius 50%
      .name
        margin-left 20px
        color $color-text-l
        font-size $font-size-medium
  .list-shortcut
    position absolute
    z-index 30
    right 0
    top 50%
    transform translateY(-50%)
    width 20px
    padding 20px 0
    border-radius 10px
    text-align center 
    background-color $color-background-d
    font-family Helvetica, sans-serif
    .item
      padding 3px
      line-height 1
      color $color-text-l
      font-size $font-size-small
      &.current
        color $color-theme
  .list-fixed
    position absolute
    top 0
    left 0
    width 100%
    .fixed-title
      height 30px
      line-height 30px
      padding-left 20px
      font-size $font-size-small
      color $color-text-l
      background-color $color-highlight-background
  .loading-container
    position absolute
    top 50%
    width 100%
    transform translateY(-50%)
</style>
