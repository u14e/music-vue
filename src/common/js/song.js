import { getVKey } from '@/api/song'
import { ERR_OK } from '@/api/config'
import { getUid } from './uid'

let urlMap = {}

export default class Song {
  constructor ({ id, mid, singer, name, album, duration, image }) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.filename = `C400${this.mid}.m4a`
    if (urlMap[this.id]) {
      this.url = urlMap[this.id]
    } else {
      this._getUrl()
    }
  }

  _getUrl () {
    if (this.url) return

    getVKey(this.mid, this.filename)
      .then(res => {
        if (res.code === ERR_OK) {
          const vkey = res.data.items[0].vkey
          this.url = `http://dl.stream.qqmusic.qq.com/${this.filename}?vkey=${vkey}&guid=${getUid()}&uin=0&fromtag=66`
          urlMap[this.id] = this.url          
        } else {
          console.error(res.errinfo)
        }
      })
  }
}

export function createSong (musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
  })
}

function filterSinger (singer) {
  let ret = []

  if (!singer) return ''

  singer.forEach(item => {
    ret.push(item.name)
  })

  return ret.join(',')
}