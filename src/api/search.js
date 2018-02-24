/*
 * @Author: u14e 
 * @Date: 2018-02-13 15:06:58 
 * @Last Modified by: u14e
 * @Last Modified time: 2018-02-13 17:19:42
 */

import jsonp from '@/common/js/jsonp'
import { commonParams, options } from './config'

export function getHotKey () {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    needNewCode: 1,
    _: +new Date(),
    uin: 0
  })

  return jsonp(url, data, options)
}

export function search (query, page, zhida, perpage = 20) {
  const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    needNewCode: 1,
    _: +new Date(),
    uin: 0,
    w: query,
    catZhida: zhida ? 1 : 0,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    perpage,
    n: perpage,
    p: page,
    remoteplace: 'txt.mqq.all',
  })

  return jsonp(url, data, options)
}