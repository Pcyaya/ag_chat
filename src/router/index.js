import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login/login'
import index from '@/components/index/index'
import msg from '@/components/index/msg/msg'                            //消息
import trip from '@/components/index/trip/trip'                         //行程安排
import notice from '@/components/index/notice/notice'                   //游团通知
import travel from '@/components/index/travel/travel'                   //游记
import evaluation from '@/components/index/evaluation/evaluation'       //评论
import unbind from '@/components/index/unbind/unbind'       //绑定手机
import list from '@/components/list/list'                         //生存锦囊
import itemlist from '@/components/list/itemlist'                         //生存锦囊
import rules from '@/components/h5/rules/rules'                    //游币规则

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: 'chat',
  routes: [
    // {
    //   path: '/',
    //   redirect: '/chart/'
    // },
    {
      path: '/',
      name: 'login',
      component: login,
      beforeEnter: (to, from, next) => {
        document.getElementById('titleId').innerHTML = '登录-艾侗游web端'
        next()
      }
    },
    //h5页面
    {
      path: '/h5_trlnote',
      name: 'h5_trlnote',
      component: resolve => require(['@/components/h5/trlnote/trlnote'],resolve),
      beforeEnter: (to, from, next) => {
        document.getElementById('titleId').innerHTML = '游记分享';
        $('head').append('<meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />');
        next();
      },
      children: [
        {
          path: '/h5_trlnote/:id',
          // component:resolve => require(['@/components/h5/trlnote/trlnote'],resolve),
        }
      ]
    },
    {
      path: '/list',
      name: 'list',
      component: list,
      beforeEnter: (to, from, next) =>{
        $('head').append('<meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />');
        document.getElementById('titleId').innerHTML = '生存锦囊'
        next()
      }
    },
    {
      path: '/itemlist',
      name: 'itemlist',
      component: itemlist,
      beforeEnter: (to, from, next) =>{
        $('head').append('<meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />');
        document.getElementById('titleId').innerHTML = '锦囊详情'
        next()
      },
    },
    {
      path: '/rules',
      name: 'rules',
      component: rules,
      beforeEnter: (to, from, next) =>{
        $('head').append('<meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />');
        document.getElementById('titleId').innerHTML = '游币规则'
        next()
      },
    },
    {
      path: '/index',
      name: 'index',
      component: index,
      beforeEnter: (to, from, next) => {
        document.getElementById('titleId').innerHTML = '首页-艾侗游web端'
        next()
      },
      children:[
        //消息
        {
          path: '/msg',
          name: 'msg',
          component: msg,
          beforeEnter: (to, from, next) => {
            document.getElementById('titleId').innerHTML = '消息'
            
            // <script id="-mob-share" src="http://f1.webshare.mob.com/code/mob-share.js?appkey=cf386a73cf567c60246f076248675192"></script>
            next()
          }
        },
        // 行程安排
        {
          path: '/trip',
          name: 'trip',
          component: trip,
          beforeEnter: (to, from, next) => {
            document.getElementById('titleId').innerHTML = '行程安排'
            next()
          }
        },
        // 游团通知
        {
          path: '/notice',
          name: 'notice',
          component: notice,
          beforeEnter: (to, from, next) => {
            document.getElementById('titleId').innerHTML = '游团通知'
            next()
          }
        },
        //游记
        {
          path: '/travel',
          name: 'travel',
          component: travel,
          beforeEnter: (to, from, next) => {
            document.getElementById('titleId').innerHTML = '游记'
            next()
          }
        },
        //评论
        {
          path: '/evaluation',
          name: 'evaluation',
          component: evaluation,
          beforeEnter: (to, from, next) => {
            document.getElementById('titleId').innerHTML = '评论'
            next()
          }
        },
        //绑定手机
        {
          path: '/unbind',
          name: 'unbind',
          component: unbind,
          beforeEnter: (to, from, next) => {
            document.getElementById('titleId').innerHTML = '绑定手机'
            next()
          }
        }
      ]
    }
  ]
})
