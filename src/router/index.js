import Vue from 'vue'
import Router from 'vue-router'
import Recommend from '@/components/recommend/recommend'
import Singer from '@/components/singer/singer'
import Rank from '@/components/rank/rank'
import Search from '@/components/search/search'
import SingerDetail from '@/components/singer-detail/singer-detail'
import Disc from '@/components/disc/disc'

Vue.use(Router)

/* eslint-disable object-property-newline */
export default new Router({
  routes: [
    { path: '/', redirect: '/recommend' },
    { path: '/recommend', name: 'recommend', component: Recommend,
      children: [
        { path: ':id', name: 'disc', component: Disc }
      ]
    },
    { path: '/singer', name: 'singer', component: Singer,
      children: [
        { path: ':id', name: 'singer-detail', component: SingerDetail }
      ]
    },
    { path: '/rank', name: 'rank', component: Rank },
    { path: '/search', name: 'search', component: Search }
  ]
})
