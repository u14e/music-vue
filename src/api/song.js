/*
 * @Author: u14e 
 * @Date: 2018-02-09 00:27:20 
 * @Last Modified by: u14e
 * @Last Modified time: 2018-02-11 10:38:46
 */
import jsonp from '@/common/js/jsonp'
import { commonParams, options } from './config'
import { getUid } from '@/common/js/uid'
import axios from 'axios'

export function getVKey (songmid, filename) {
  const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg'

  const data = Object.assign({}, commonParams, {
    cid: '205361747',
    format: 'json',
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    uin: 0,
    songmid,
    filename,
    guid: getUid()
  })

  return jsonp(url, data, Object.assign({}, options, {
    param: 'callback'
  }))
}

export function getLyric (mid) {
  const url = '/api/lyric'

  const data = Object.assign({}, commonParams, {
    pcachetime: +new Date(),
    songmid: mid,
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    platform: 'yqq',
    needNewCode: 0
  })

  return axios.get(url, {
    params: data
  }).then(res => Promise.resolve(res.data))
}