/*
 * @Author: u14e 
 * @Date: 2018-02-05 14:26:50 
 * @Last Modified by: u14e
 * @Last Modified time: 2018-02-05 14:48:28
 */
import originJSONP from 'jsonp'

export default function jsonp (url, data, option) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
  
  return new Promise((resolve, reject) => {
    originJSONP(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

function param (data) {
  let url = ''
  for (let k in data) {
    let value = data[k] !== undefined ? data[k] : ''
    url += `&${k}=${encodeURIComponent(value)}`
  }
  return url ? `${url.substr(1)}` : ''
}