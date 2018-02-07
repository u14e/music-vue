/*
 * @Author: u14e 
 * @Date: 2018-02-07 11:25:19 
 * @Last Modified by: u14e
 * @Last Modified time: 2018-02-07 11:28:53
 */
import jsonp from '@/common/js/jsonp'
import { commonParams, options } from './config'

export function getSingerList () {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
  
  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pageSize: 100,
    pagenum: 1,
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
  })

  return jsonp(url, data, options)
}