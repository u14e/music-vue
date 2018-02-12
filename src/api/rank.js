/*
 * @Author: u14e 
 * @Date: 2018-02-12 17:33:37 
 * @Last Modified by: u14e
 * @Last Modified time: 2018-02-12 21:35:03
 */

import jsonp from '@/common/js/jsonp'
import { commonParams, options } from './config'

export function getTopList () {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'

  const data = Object.assign({}, commonParams, {
    uin: 0,
    platform: 'h5',
    needNewCode: 1,
    _: +new Date(),
  })
  
  return jsonp(url, data, options)
}

export function getMusicList (topid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'

  const data = Object.assign({}, commonParams, {
    uin: 0,
    platform: 'h5',
    needNewCode: 1,
    tpl: 3,
    page: 'detail',
    type: 'top',
    topid,
    _: +new Date()
  })

  return jsonp(url, data, options)
}