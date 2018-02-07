<template>
  <div class="singer">
    <list-view :data="singers"></list-view>
  </div>
</template>

<script>
import { getSingerList } from '@/api/singer'
import { ERR_OK } from '@/api/config'
import Singer from '@/common/js/singer'
import ListView from '@/base/listView/listView' 

const HOT_TITLE = '热门'
const HOT_SINGER_LEN = 10

export default {
  data () {
    return {
      singers: []
    }
  },
  created () {
    this._getSingerList()
  },
  methods: {
    _getSingerList () {
      getSingerList().then(res => {
        if (res.code === ERR_OK) {
          this.singers = this._normalizeSinger(res.data.list)
        }
      }).catch(err => {
        console.error(err)
      })
    },
    _normalizeSinger (list) {
      let map = {
        hot: {
          title: HOT_TITLE,
          items: []
        }
      }

      list.forEach((item, index) => {
        // 填充热门数据
        if (index < HOT_SINGER_LEN) {
          map['hot'].items.push(new Singer(item.Fsinger_mid, item.Fsinger_name))
        }

        // 填充字母表数据
        let key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer(item.Fsinger_mid, item.Fsinger_name))
      })

      // 将map转为有序列表
      let hot = []
      let ret = []
      for (let key in map) {
        let item = map[key]
        if (item.title.match(/[a-zA-Z]/)) {
          ret.push(item)
        } else if (item.title === HOT_TITLE) {
          hot.push(item)
        }
      }
      ret.sort((a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0))
      
      return hot.concat(ret)
    }
  },
  components: {
    ListView
  }
}
</script>

<style lang="stylus" scoped>
.singer
  position fixed
  top 88px
  width 100%
  bottom 0
</style>
