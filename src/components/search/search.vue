<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query">
      <div class="shortcut">
        <div class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li class="item"
              v-for="(key, index) in hotKey" :key="index"
              @click="addQuery(key.k)"
            >
              <span>{{ key.k }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="search-result" v-show="query">
      <suggest :query="query"></suggest>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import SearchBox from '@/base/search-box/search-box'
import Suggest from '@/components/suggest/suggest'
import { getHotKey } from '@/api/search'
import { ERR_OK } from '@/api/config'
// import { playlistMixin } from '@/common/js/mixin'

export default {
  data () {
    return {
      hotKey: [],
      query: ''
    }
  },
  created () {
    this._getHotKey()
  },
  methods: {
    _getHotKey () {
      getHotKey().then(res => {
        if (res.code === ERR_OK) {
          this.hotKey = res.data.hotkey.slice(0, 10)
        } else {
          console.error(res.message)
        }
      })
    },
    addQuery (query) {
      this.$refs.searchBox.setQuery(query)
    },
    onQueryChange (query) {
      this.query = query
    }
  },
  components: {
    SearchBox,
    Suggest
  }
}
</script>

<style lang="stylus">
@import '~common/stylus/variable'

.search
  .search-box-wrapper
    margin 20px
  .shortcut-wrapper
    position fixed
    top 178px
    bottom 0
    width 100%
    .shortcut
      height 100%
      overflow hidden
      .hot-key
        margin 0 20px 20px
        .title
          margin-bottom 20px
          font-size $font-size-medium
          color $color-text-l
        .item
          display inline-block
          padding 5px 10px
          margin 0 20px 10px 0
          border-radius 6px
          background-color $color-highlight-background
          font-size $font-size-medium
          color $color-text-l
  .search-result
    position fixed
    top 178px
    bottom 0
    width 100%
</style>
