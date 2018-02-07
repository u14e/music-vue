/*
 * @Author: u14e 
 * @Date: 2018-02-05 14:49:50 
 * @Last Modified by: u14e
 * @Last Modified time: 2018-02-06 12:12:09
 */

import jsonp from '@/common/js/jsonp'
import { commonParams, options } from './config'
import axios from 'axios'

// 热门推荐
export function getRecommend () {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })

  return jsonp(url, data, options)
}

// 歌单
export function getDiscList () {
  const url = '/api/getDiscList'

  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    needNewCode: 0,
    hostUin: 0,
    sortTd: 5,
    rnd: Math.random(),
    categoryId: 10000000,
    sin: 0,
    ein: 29,
    picmid: 1,
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}