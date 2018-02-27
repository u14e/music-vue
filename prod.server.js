const express = require('express')
const config = require('./config/index')
const axios = require('axios')

const app = express()

var apiRouter = express.Router()

apiRouter.get('/getDiscList', function(req, res) {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then(response => {
    res.json(response.data)
  }).catch(e => {
    console.error(e)
  })
})

apiRouter.get('/getCdInfo', function(req, res) {
  const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://y.qq.com/n/yqq/playlist/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then(response => {
    let ret = response.data
    if (typeof(ret) === 'string') {
      const reg = /^\w+\(({.+})\)$/
      const matches = ret.match(reg)
      if (matches) {
        ret = JSON.parse(matches[1])
      }
    }
    res.json(ret)
  }).catch(e => {
    console.error(e)
  })
})

apiRouter.get('/lyric', function(req, res) {
  const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then(response => {
    let ret = response.data
    if (typeof(ret) === 'string') {
      const reg = /^\w+\(({.+})\)$/
      const matches = ret.match(reg)
      if (matches) {
        ret = JSON.parse(matches[1])
      }
    }
    res.json(ret)
  }).catch(e => {
    console.error(e)
  })
})

app.use('/api', apiRouter)

app.use(express.static('./dist'))

const port = config.build.port

module.exports = app.listen(port, err => {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})