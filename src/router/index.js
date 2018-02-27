import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* 路由懒加载 */
const Recommend = () => import('@/components/recommend/recommend')
const Singer = () => import('@/components/singer/singer')
const Rank = () => import('@/components/rank/rank')
const Search = () => import('@/components/search/search')
const SingerDetail = () => import('@/components/singer-detail/singer-detail')
const Disc = () => import('@/components/disc/disc')
const TopList = () => import('@/components/top-list/top-list')

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
    { path: '/rank', name: 'rank', component: Rank,
      children: [
        { path: ':id', name: 'top-list', component: TopList }
      ]
    },
    { path: '/search', name: 'search', component: Search,
      children: [
        { path: ':id', name: 'search-detail-singer', component: SingerDetail }
      ]
    }
  ]
})
