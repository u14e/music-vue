/*
 * @Author: u14e 
 * @Date: 2018-02-05 14:49:50 
 * @Last Modified by: u14e
 * @Last Modified time: 2018-02-05 16:50:09
 */

import jsonp from '@/common/js/jsonp'
import { commonParams, options } from './config'

export function getRecommend () {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })

  return jsonp(url, data, options)
}