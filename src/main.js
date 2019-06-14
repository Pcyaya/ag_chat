// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import $ from 'jquery'
import 'babel-polyfill'
import base from './js/base'
import VueLazyLoad from 'vue-lazyload'
// import wx from 'weixin-js-sdk'

Vue.use(ElementUI,$)
Vue.use(VueLazyLoad,{
  // error:require(''),
  loading:'https://anygo-imag.oss-cn-beijing.aliyuncs.com/webImg/icon_youji_default%403x.png',
  attempt: 1

})
Vue.config.productionTip = false
// Vue.prototype.OSSIMG = 'https://anygo-imag.oss-cn-beijing.aliyuncs.com/webImg/'           //oss切图地址
// Vue.prototype.head_icon = 'https://anygo-imag.oss-cn-beijing.aliyuncs.com/imgs_head/'     //头像
Vue.prototype.up_msg_img = 'https://anygo-imag.oss-cn-beijing.aliyuncs.com/message_imgs/'    //聊天图片
// Vue.prototype.voice_file = 'https://anygo-imag.oss-cn-beijing.aliyuncs.com/voice/'         //语音
// Vue.prototype.imgs_travel_notes = 'https://anygo-imag.oss-cn-beijing.aliyuncs.com/imgs_travel_notes/' //游记图片
// Vue.prototype.video_travel_notes = 'https://anygo-imag.oss-cn-beijing.aliyuncs.com/video/' //游记视频
Vue.prototype.OSSFILE = 'https://anygo-imag.oss-cn-beijing.aliyuncs.com/files/' //文件

Vue.prototype.OSSIMG = 'http://images.aetosgo.com/webImg/'           //oss切图地址
Vue.prototype.head_icon = 'http://images.aetosgo.com/imgs_head/'     //头像
Vue.prototype.msg_img = 'http://images.aetosgo.com/message_imgs/'    //聊天图片
Vue.prototype.voice_file = 'http://medias.aetosgo.com/voice/'         //语音
Vue.prototype.imgs_travel_notes = 'http://images.aetosgo.com/imgs_travel_notes/' //游记图片
Vue.prototype.video_travel_notes = 'http://videos.aetosgo.com/video/' //游记视频
Vue.prototype.video_snapshot = 'http://images.aetosgo.com/snapshot/';  //视频截图

Vue.prototype.$base = base
/**
 * oauth2.0/authorize 进入登录页面  
 *      response_type=code
 *      &client_id=101511269
 *      &redirect_uri=http://aetosgo.com/chat
 *      &state=client 
 * oauth2.0/token 获取access_token和refresh_token  
 *      grant_type=authorization_code
 *      &client_id=101511269
 *      &client_secret=cf386a73cf567c60246f076248675192
 *      &code=4F22851FC66CBC1728BBC14F47C9BC68
 *      &redirect_uri=http://aetosgo.com/chat
 * me 获取openid access_token=62B803A0E474C99849DAF7FADB524A35
 */
// Vue.prototype.QQURL = 'https://graph.qq.com/'   //qq第三方接口
Vue.prototype.QQURL = 'http://aetosgo.com/qq/'   //qq第三方接口
Vue.prototype.wxURL = 'http://aetosgo.com/wx/'  //微信

// let str = window.location.href.substring(window.location.href.lastIndexOf('1.4')+3,window.location.href.lastIndexOf('1.4')+7)
let str = window.location.href.substring(window.location.href.lastIndexOf('com')+3,window.location.href.lastIndexOf('com')+7)
// console.log(str)
if(str.indexOf(':80/') != -1 || str.indexOf(':') === -1){
    //正式
    Vue.prototype.urlHost = "http://aetosgo.com/anygo/"
    Vue.prototype.wsUrl = "ws://aetosgo.com/anygo/websocket?"
    Vue.prototype.homeHost = "http://aetosgo.com"
    Vue.prototype.serviceType = 1
}else {
    //测试
    Vue.prototype.urlHost = "http://aetosgo.com:8080/anygo/"        //服务器
    Vue.prototype.wsUrl = "ws://aetosgo.com:8080/anygo/websocket?"
    Vue.prototype.homeHost = "http://aetosgo.com:8080"
    Vue.prototype.serviceType = 0
}
// Vue.prototype.urlHost = "http://aetosgo.com/anygo/"
// Vue.prototype.urlHost = "http://localhost:9999/anygo/"          //本地
// Vue.prototype.urlHost = "http://aetosgo.com:8080/anygo/"  //服务器接口

// Vue.prototype.urlHost = "http://192.168.1.204:8080/anygo/"  //本地接口 王博文
// Vue.prototype.wsUrl = "ws://192.168.1.204:8080/anygo/websocket?"

// Vue.prototype.urlHost = "http://192.168.1.183:8080/anygo/"  //本地接口 徐金辉
// Vue.prototype.wsUrl = "ws://192.168.1.183:8080/anygo/websocket?"  //
 


// Vue.prototype.urlHost = "http://aetosgo.com/anygo/"
// Vue.prototype.wsUrl = "ws://aetosgo.com/anygo/websocket?"
// Vue.prototype.serviceType = 1

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
