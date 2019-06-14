<template>
  <div class="trlnote" v-if="show" :class="{'overhide': overType}">
    <div class="guidediv" v-show="guideType" @click="guideType = false">
      <div>
        <div>请在浏览器中打开此页面进行操作</div><img :src="icon.zhiyin" alt="">
      </div>
    </div>
    <div class="top">
      <div class="box-info">
        <div class="icon">
          <img v-if="infoData.icon == '' || infoData.icon == null" :src="icon.firendHead" alt>
          <img v-else :src="head_icon+infoData.icon" alt>
        </div>
        <div class="name">
          <div>{{infoData.name}}</div>
          <div>{{$base.tampToTime(infoData.date)}}</div>
        </div>
        <div class="down"  @click="submitFn">
          <i class="el-icon-arrow-down"></i>
        </div>
      </div>
      <div class="box-images imgsBox" v-if="infoData.imgs != null">
        <div class="images4" v-if="infoData.show_flg == 4">
          <div class="swiper-container">
            <div class="swiper-wrapper">
              <div class="swiper-slide" v-for="(item, index) in infoData.imgs" :key="index">
                <img
                  v-if="infoData.imgs!=undefined"
                  :src="imgs_travel_notes+item.url+infoData.prefix+infoData.watermark+'/resize,p_100'"
                  alt
                >
              </div>
            </div>
            <div
              class="swiper-pagination"
              style="top:10px;text-align:right;margin-left:-10px;color:#fff;"
            ></div>
          </div>
        </div>
        <div
          v-if="infoData.show_flg == 1"
          :class="{'images1':infoData.imgs.length===1,'images2':infoData.imgs.length===2,'images3':infoData.imgs.length>2}"
        >
          <div v-if="infoData.imgs.length>2">
            <div
              @click="imgView(index)"
              v-for="(item, index) in infoData.imgs"
              :key="index"
              :style="{'background':'url('+imgs_travel_notes+item.url+infoData.prefix+infoData.watermark+')'}"
            ></div>
          </div>
          <div v-else v-for="(item, index) in infoData.imgs" :key="index">
            <img
              @click="imgView(index)"
              v-if="infoData.imgs!=undefined"
              :src="imgs_travel_notes+item.url+infoData.prefix+infoData.watermark"
              alt
            >
          </div>
        </div>
      </div>
      <div
        class="box-audio"
        @click="audioPlay(voice_file+infoData.audio.url,1)"
        v-if="infoData.audio != null"
      >
        <div>
          <div class="cur">
            <img :src="audioType == 1 ? icon.viucegif : icon.icon_youji" alt>
          </div>
          <div>{{$base.sTotime(time)}}</div>
        </div>
      </div>
      <div class="box-video" v-if="infoData.video != null">
        <img :src="video_snapshot+infoData.snapshot" alt="">
        <div class="rel-play">
          <i
            @click="playVideo(video_travel_notes+infoData.video.url)"
            class="el-icon-caret-right"
          ></i>
        </div>
        <!-- <video id="my_video" width="100%" controls>
          <source :src="video_travel_notes+infoData.video.url" type="video/mp4">
          <source :src="video_travel_notes+infoData.video.url" type="video/webm">
        </video> -->
      </div>
      <div class="box-msg">{{infoData.content}}</div>
      <div class="box-location imgfonts" v-if="infoData.poi_name!= '' && infoData.poi_name != null">
        <img :src="icon.position" alt>
        {{infoData.poi_name}}
      </div>
      <div class="box-people imgfonts">
        <img :src="icon.browse" alt>
        浏览人数{{infoData.browse_people}}
      </div>
    </div>
    <div class="box-end">
      <div @click="submitFn">
        <img :src="icon.share" alt>
        <span>{{infoData.relay_num}}</span>
      </div>
      <div class="end-right">
        <div @click="submitFn">
          <img :src="icon.like_click" alt>
          <span>{{infoData.laud_num}}</span>
        </div>
        <div @click="submitFn">
          <img :src="icon.collection" alt>
          <span>{{infoData.collect_num}}</span>
        </div>
        <div @click="submitFn">
          <img :src="icon.comments" alt>
          <span>{{infoData.comment_num}}</span>
        </div>
      </div>
    </div>
    <div class="box-fixed">
      <div @click="submitFn">
        <!-- <img :src="icon.open_app" alt=""> -->
      </div>
      <!-- <div>关注公总号</div> -->
    </div>

    <!-- 评论 -->
    <div class="comments" v-if="comments.data.length>0">
      <div class="comments-item" v-for="(item, index) in comments.data" :key="index">
        <div class="item-icon">
          <img v-if="item.icon == '' || item.icon == null" :src="icon.firendHead" alt>
          <img v-else :src="head_icon+item.icon" alt>
        </div>
        <div class="item-content">
          <div class="content-name">{{item.name}}</div>
          <div class="content-date">{{$base.timestampToTime(item.create_date)}}</div>
          <div class="content-msg">{{item.rtnc_content}}</div>
          <div class="content-more" v-if="item.nt_comn.length>0">
            共{{item.nt_comn.length}}条回复
            <span @click="submitFn">点击查看</span>
          </div>
        </div>
        <div class="item-img" @click="submitFn">
          <img :src="icon.comments" alt>
        </div>
      </div>
      <div class="comments-more">
        <div @click="submitFn">查看更多评论</div>
      </div>
    </div>

    <!-- 更多内容 -->
    <div class="trinotes" v-if="trlnotes.data.length>0">
      <div>更多内容</div>
      <div v-for="(item, index) in trlnotes.data" :key="index" class="bgcc">
        <div class="top" @click="hrefCl(index)">
          <div class="box-info">
            <div class="icon">
              <img v-if="item.icon == '' || item.icon == null" :src="icon.firendHead" alt>
              <img v-else :src="head_icon+item.icon" alt>
            </div>
            <div class="name">
              <div>{{item.name}}</div>
              <div>{{$base.tampToTime(item.date)}}</div>
            </div>
            <div class="down" @click="submitFn">
              <i class="el-icon-arrow-down"></i>
            </div>
          </div>
          <div class="box-images" v-if="item.imgs != null">
            <div class="images4" v-if="item.show_flg == 4">
              <div class="swiper-containerz">
                <div class="swiper-wrapper">
                  <div class="swiper-slide" v-for="(imgItem, index) in item.imgs" :key="index">
                    <img v-if="item.imgs!=undefined" :src="imgs_travel_notes+imgItem.url" alt>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="item.show_flg == 1"
              :class="{'images1':item.imgs.length===1,'images2':item.imgs.length===2,'images3':item.imgs.length>2}"
            >
              <div v-if="item.imgs.length>2">
                <div
                  v-for="(imgItem, index) in item.imgs"
                  :key="index"
                  :style="{'background':'url('+imgs_travel_notes+imgItem.url+')'}"
                ></div>
              </div>
              <div v-else v-for="(imgItem, index) in item.imgs" :key="index">
                <img v-if="item.imgs!=undefined" :src="imgs_travel_notes+imgItem.url" alt>
              </div>
            </div>
          </div>
          <!-- <div class="box-audio" v-if="item.audio != null">
            <div>
              <div class="cur">
                <img :src="icon.icon_youji" alt>
              </div>
              <div>{{$base.sTotime(item.audio.time_len)}}</div>
            </div>
          </div>-->

          <div class="box-video" v-if="item.video != null">
            <video id="my_video" width="100%" height="200px" controls>
              <source :src="video_travel_notes+item.video.url" type="video/mp4">
              <source :src="video_travel_notes+item.video.url" type="video/webm">
            </video>
          </div>
          <div class="box-msg">
            {{item.contentVal}}
            <span
              class="box-msg-lengs"
              v-if="item.content.length>100"
              @click="submitFn"
            >全文</span>
          </div>
          <div class="box-location imgfonts" v-if="item.poi_name != ''">
            <img :src="icon.position" alt>
            {{item.poi_name}}
          </div>
          <div class="box-people imgfonts">
            <img :src="icon.browse" alt>
            浏览人数{{item.browse_people}}
          </div>
        </div>
        <div class="box-end">
          <div @click="submitFn">
            <img :src="icon.share" alt>
            <span>{{item.relay_num}}</span>
          </div>
          <div class="end-right">
            <div @click="submitFn">
              <img :src="icon.like_click" alt>
              <span>{{item.laud_num}}</span>
            </div>
            <div @click="submitFn">
              <img :src="icon.collection" alt>
              <span>{{item.collect_num}}</span>
            </div>
            <div @click="submitFn">
              <img :src="icon.comments" alt>
              <span>{{item.comment_num}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="videoDialogPh">
      <el-dialog :lock-scroll="true" :visible.sync="dialogVisible.playVideo">
        <video ref="video" id="my_videos" width="100%" height="500vh" controls>
          <source :src="videoUrl" type="video/mp4">
          <source :src="videoUrl" type="video/webm">
        </video>
      </el-dialog>
    </div>

    <div class="swiper-containerPage" id="origin-img" v-show="swiperStatus">
      <div class="swiper-wrapper"></div>
      <div class="swiper-pagination" style="top:10px;color:#fff;"></div>
    </div>
  </div>
</template>

<script>
import Swiper from "swiper";
export default {
  data() {
    return {
      id: "",
      infoData: {}, //详情
      comments: { data: [] }, //评论
      trlnotes: { data: [] }, //推荐
      show: false,
      guideType: false,
      audioType: -1,
      swiperStatus: false,
      time: "",
      icon: {
        forendHead: this.OSSIMG + "icon_head1.png",
        like_click: this.OSSIMG + "icon_dz_default.png",
        share: this.OSSIMG + "icon_youji_share.png",
        collection: this.OSSIMG + "icon_details_collection_del.png",
        comments: this.OSSIMG + "icon_comment.png",
        position: this.OSSIMG + "icon_yj_position.png",
        browse: this.OSSIMG + "icon_youji_browse_del.png",
        viucegif: this.OSSIMG + "icon_voice1_gif.gif",
        voice3: this.OSSIMG + "icon_voice3.png",
        open_app: this.OSSIMG + "open_app.png",
        icon_youji: this.OSSIMG + "icon_youji_voice.png",
        animation_youji_1: this.OSSIMG + "animation_youji_1.png",
        animation_youji_2: this.OSSIMG + "animation_youji_2.png",
        animation_youji_3: this.OSSIMG + "animation_youji_3.png",
        animation_youji_4: this.OSSIMG + "animation_youji_4.png",
        animation_youji_5: this.OSSIMG + "animation_youji_5.png",
        animation_youji_6: this.OSSIMG + "animation_youji_6.png",
        animation_youji_7: this.OSSIMG + "animation_youji_7.png",
        zhiyin: this.OSSIMG + "zhiyin.png"
      },
      dialogVisible: {
        playVideo: false,
      },
      videoUrl: '',
      overType: false
    };
  },
  watch: {
    guideType() {
      if(this.guideType){
        // $("body,html").css({
        //   "height": '100%',
        //   "overflow": "hidden"
        // });
        this.overType = true;
      }else {
        // $("body,html").css({
        //   "height": 'auto',
        //   "overflow": "auto"
        // });
        this.overType = false;
      }
    },
    audioType() {
      const that = this;
      if (this.audioType == 1) {
        that.icon.viucegif = that.icon.animation_youji_1;
        var i = 1;
        that.startAnimation = setInterval(() => {
          i++;
          if (i > 7) {
            i = 1;
          }
          that.icon.viucegif = this.OSSIMG + "animation_youji_" + i + ".png";
        }, 300);
      }
      if (this.audioType == -1) {
        clearInterval(that.startAnimation);
      }
    },
    "dialogVisible.playVideo"() {
      let type = this.dialogVisible.playVideo;
      if(type) {
        this.overType = true;
          
        setTimeout(() => {
          document.getElementById("my_videos").play();
        }, 0);
      }else {
        this.overType = false;
        document.getElementById("my_videos").stop();
      }
    },
    swiperStatus() {
      const that = this;
      if (this.swiperStatus) {
        $("body").css("overflow", "hidden");
        setTimeout(() => {
          //切换图状态禁止页面缩放
          document.addEventListener("touchstart", function(event) {
            if (event.touches.length > 1 && that.swiperStatus) {
              event.preventDefault();
            }
          });
          var lastTouchEnd = 0;
          document.addEventListener(
            "touchend",
            function(event) {
              var now = new Date().getTime();
              if (now - lastTouchEnd <= 300) {
                event.preventDefault();
              }
              lastTouchEnd = now;
            },
            false
          );

          document.addEventListener("touchmove", function(e) {
            if (that.swiperStatus) {
              e.preventDefault();
            }
          });
        }, 0);
      } else {
        $("body").css("overflow", "auto");
      }
    }
  },
  created() {
    if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
        /*window.location.href="你的手机版地址";*/
    }
    else {
        /*window.location.href="你的电脑版地址";    */
        this.$message('请在手机上查看！');
        return;
    }
    this.id = this.$router.history.current.query.id;
    // console.log(this.$router);
    this.GetInfo();
    this.GetComments();
    this.GetTrInotes();
  },
  mounted() {},
  methods: {
    //游记详情
    GetInfo() {
      const that = this;
      $.ajax({
        url: that.urlHost + "/visitor/open/trlnote",
        type: "post",
        data: {
          id: that.id
        },
        dataType: "json",
        success: res => {
          if (res.success === "00000000") {
            that.infoData = res.obj;
            this.show = true;
            if (that.infoData.audio != null) {
              this.time = that.infoData.audio.time_len;
            }
            if (that.infoData.content.length > 500) {
              that.infoData.contentVal =
                that.infoData.content.substr(0, 500) + "...";
            } else {
              that.infoData.contentVal = that.infoData.content;
            }
            setTimeout(() => {
              this._initSwiper();
            }, 1000);
          } else {
            this.show = false;
            that.$message.error(res.msg);
          }
        },
        error: err => {}
      });
    },
    //游记评论列表
    GetComments() {
      const that = this;
      $.ajax({
        url: that.urlHost + "/visitor/open/comments",
        type: "post",
        data: {
          id: that.id
        },
        dataType: "json",
        success: res => {
          if (res.success === "00000000") {
            that.comments = res.obj;
            for (let i = 0; i < that.comments.data.length; i++) {
              if (that.comments.data[i].rtnc_content.length > 30) {
                that.comments.data[i].rtnc_content =
                  that.comments.data[i].rtnc_content.substr(0, 30) + "...";
              }
            }
          } else {
            // this.show = false;
            that.$message.error(res.msg);
          }
        },
        error: err => {}
      });
    },
    //游记推荐列表
    GetTrInotes() {
      const that = this;
      $.ajax({
        url: that.urlHost + "/visitor/open/trlnotes",
        type: "post",
        data: {},
        dataType: "json",
        success: res => {
          if (res.success === "00000000") {
            that.trlnotes = res.obj;
            for (let i = 0; i < that.trlnotes.data.length; i++) {
              if (that.trlnotes.data[i].content.length > 100) {
                that.trlnotes.data[i].contentVal =
                  that.trlnotes.data[i].content.substr(0, 100) + "...";
              } else {
                that.trlnotes.data[i].contentVal =
                  that.trlnotes.data[i].content;
              }
            }
          } else {
            // this.show = false;
            that.$message.error(res.msg);
          }
        },
        error: err => {}
      });
    },
    //
    hrefCl(index) {
      // window.location.href = window.location.origin + "/h5_trlnote/" + id;
      this.childIndex = index;
      var list = [];
      for (let i = 0; i < this.trlnotes.data.length; i++) {
        if (this.trlnotes.data[i].show_flg === 4) {
          list.push(this.trlnotes.data[i]);
        }
      }
      for (let i = 0; i < list.length; i++) {
        if (list[i].rtn_id === this.trlnotes.data[index].rtn_id) {
          this.swiperChildIndex = i;
        }
      }
    },
    // 语音播放
    audioPlay(url, index) {
      const that = this;
      if (that.currentAudio == undefined) {
        that.currentAudio = new Audio(url);
        that.currentAudio.play();
        that.start = setInterval(() => {
          that.time = that.time - 1000;
        }, 1000);
        that.audioType = index;
        that.currentAudio.addEventListener(
          "ended",
          function() {
            that.audioType = -1;
            clearInterval(that.start);
            that.currentAudio = undefined;
            that.time = that.infoData.audio.time_len;
          },
          false
        );
      } else {
        if (that.currentAudio.src == url) {
          if (that.currentAudio.paused) {
            that.audioType = index;
            that.currentAudio.play();
          } else {
            that.audioType = -1;
            clearInterval(that.start);
            that.time = that.infoData.audio.time_len;
            that.currentAudio.pause();
            that.currentAudio = undefined;
          }
        } else {
          that.audioType = -1;
          clearInterval(that.start);
          that.time = that.infoData.audio.time_len;
          that.currentAudio.pause();
          that.currentAudio = undefined;
          that.currentAudio = new Audio(url);
          that.currentAudio.play();
          that.audioType = index;
          that.currentAudio.addEventListener(
            "ended",
            function() {
              that.audioType = -1;
              clearInterval(that.start);
              that.time = that.infoData.audio.time_len;
            },
            false
          );
        }
      }
    },
    //视频播放
    playVideo(url) {
      const that = this;
      that.dialogVisible.playVideo = true;
      this.overType = true;
      this.videoUrl = url;
    },
    imgView(index) {
      const that = this;
      var imgs = that.infoData.imgs;
      for (let i = 0; i < imgs.length; i++) {
        that.swiperPage.virtual.appendSlide(
          '<div class="swiper-zoom-container"><img src="' +
            that.imgs_travel_notes +
            imgs[i].url +
            '" /></div>'
        );
      }
      that.swiperPage.slideTo(index);
      $("#origin-img").fadeIn("fast");
      that.swiperStatus = true;
    },
    //初始化swiper插件
    _initSwiper() {
      const that = this;
      var mySwiper = new Swiper(".swiper-container", {
        effect: "coverflow",
        loop: true,
        autoplay: {
          stopOnLastSlide: true,
          disableOnInteraction: false,
          delay: 3000
        },
        pagination: {
          el: ".swiper-pagination",
          type: "fraction"
        },
        on: {
          click: function() {
            var clickIndex = mySwiper.activeIndex;
            var imgs = that.infoData.imgs;
            for (let i = 0; i < imgs.length; i++) {
              that.swiperPage.virtual.appendSlide(
                '<div class="swiper-zoom-container"><img src="' +
                  that.imgs_travel_notes +
                  imgs[i].url +
                  '" /></div>'
              );
            }
            // console.log(that.swiperPage);
            that.swiperPage.slideTo(clickIndex-1);
            $("#origin-img").fadeIn("fast");
            that.swiperStatus = true;
          }
        }
        // loop: true,
      });
      var mySwiperz = new Swiper(".swiper-containerz", {
        preventInteractionOnTransition: false,
        autoplay: false,
        on: {
          click: function() {
            if (that.swiperChildIndex > 0) {
              var clickIndex = mySwiperz[that.swiperChildIndex].activeIndex;
            } else {
              var clickIndex = 0;
            }
            var imgs = that.trlnotes.data[that.childIndex].imgs;
            for (let i = 0; i < imgs.length; i++) {
              that.swiperPage.virtual.appendSlide(
                '<div class="swiper-zoom-container"><img src="' +
                  that.imgs_travel_notes +
                  imgs[i].url +
                  '" /></div>'
              );
            }
            that.swiperPage.slideTo(clickIndex);
            $("#origin-img").fadeIn("fast");
            that.swiperStatus = true;
          }
        }
      });
      that.swiperPage = new Swiper(".swiper-containerPage", {
        zoom: true,
        width: window.innerWidth,
        virtual: true,
        spaceBetween: 20,
        pagination: {
          el: ".swiper-pagination",
          type: "fraction"
        },
        on: {
          click: function() {
            $("#origin-img").fadeOut("fast");
            this.virtual.slides.length = 0;
            this.virtual.cache = [];
            that.swiperStatus = false;
          }
        }
      });
    },
    submitFn() {
      //判断浏览器
      const that = this;
      var u = navigator.userAgent;
      var ua = navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        // 在微信中打开
        that.guideType = true;
        return;
      }
      if (ua.match(/WeiBo/i) == "weibo") {
        // 微博
        that.guideType = true;
        return;
      }
      var d = new Date();
      var t0 = d.getTime();
      var openAppUrl =
        "aetosgo://?type=0&show_flg=" +
        that.infoData.show_flg +
        "&rtn_num=" +
        that.infoData.rtn_num;
      if (u.indexOf("Android") > -1 || u.indexOf("Linux") > -1) {
        //Android
        if (this.openApp(openAppUrl)) {
          this.openApp(openAppUrl);
        } else {
          //由于打开需要1～2秒，利用这个时间差来处理－－打开app后，返回h5页面会出现页面变成app下载页面，影响用户体验
          var delay = setInterval(function() {
            var d = new Date();
            var t1 = d.getTime();
            // alert(t1-t0)
            if (t1 - t0 < 1060 && t1 - t0 > 1000) {
              // alert('请下载APP');
              window.location.href = that.homeHost + "/download";
            }
            if (t1 - t0 >= 1060) {
              clearInterval(delay);
            }
          }, 1000);
        }
      } else if (u.indexOf("iPhone") > -1) {
        window.location.href = "aetosgo:";
        setTimeout(() => {
          window.location.href = that.homeHost + "/download";
        }, 2000);
        // }
      }
    },
    openApp(src) {
      // 通过iframe的方式试图打开APP，如果能正常打开，会直接切换到APP，并自动阻止a标签的默认行为
      // 否则打开a标签的href链接
      var ifr = document.createElement("iframe");
      ifr.src = src;
      ifr.style.display = "none";
      document.body.appendChild(ifr);
      window.setTimeout(function() {
        document.body.removeChild(ifr);
      }, 1000);
    }
  }
};
</script>

<style lang="less">
@import "./../../../../node_modules/swiper/dist/css/swiper.css";
.trlnote {
  position: absolute;
  width: 100%;
  .guidediv {
    z-index: 1995;
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .8);
    color: #fff;
    font-size: 18px;
    div{
      padding: 10px;
      // text-align: right;
      display: flex;
    }
  }
  .top {
    font-size: 1rem;
    padding: 6vw 0 0 4vw;
    .box-info {
      display: flex;
      .icon {
        max-height: 11vw;
        img {
          max-width: 11vw;
          max-height: 11vw;
          border-radius: 0.2rem;
        }
        margin-right: 3vw;
      }
      .name {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        font-size: 4vw;
        color: #666;
        > div:nth-child(2) {
          font-size: 3vw;
          color: #999;
        }
      }
      .down {
        color: #999;
        padding-right: 4vw;
        height: 11vw;
        line-height: 11vw;
      }
    }
    .box-images {
      margin-top: 4vw;
      .images1 {
        padding-right: 4vw;
      }
      .images2 {
        display: flex;
        padding-right: 4vw;
        > div {
          width: 49%;
          margin: 0 1% 0 0;
          img {
            max-height: 200px;
          }
        }
      }
      .images3 {
        > div {
          display: flex;
          flex-wrap: wrap;
          > div {
            width: 32%;
            padding-top: 32%;
            border-radius: 2px;
            margin: 0 1% 0.7% 0;
            background-size: cover !important;
          }
        }
      }
      .images4 {
        display: flex;
        flex-wrap: wrap;
        > div {
          background: rgba(0, 0, 0, 0.2);
          width: 60%;
          min-height: 300px;
          margin: 0 1% 0.1rem 0;
          overflow: hidden;
        }
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .box-audio {
      position: relative;
      height: 0;
      > div {
        z-index: 11;
        position: absolute;
        left: calc(60% - 5.05rem);
        bottom: 3vw;
        display: flex;
        justify-content: center;
        // background: rgba(0, 0, 0, 0.2);
        width: 5rem;
        > div:nth-child(1) {
          height: 6vw;
          img {
            height: 100%;
          }
          &:active {
            opacity: 0.8;
          }
        }
        > div:nth-child(2) {
          line-height: 6vw;
          margin-left: 0.5rem;
          color: #fff;
        }
      }
    }
    .box-video {
      margin-right: 4vw;
      margin-top: 4vw;
      // background: linear-gradient(#ccc, rgba(0, 0, 0, 0));
      img{
        height: 200px;
        width: 100%;
        object-fit: cover;
      }
      .rel-play {
          position: absolute;
          top: 80px;
          width: calc(100% - 4vw);
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          i {
            font-size: 40px;
            color: #666;
            border: 3px solid #666;
            background: #dedede;
            border-radius: 50px;
            cursor: pointer;
            &:active {
              opacity: 0.8;
            }
          }
        }
    }
    .box-msg {
      margin-top: 4vw;
      margin-right: 4vw;
      display: block;
      word-wrap: break-word;
      font-size: 4vw;
      .box-msg-lengs {
        float: right;
        color: #3b9df8;
        &:active {
          opacity: 0.8;
        }
      }
    }
    .box-location {
      margin-top: 4vw;
      color: #3b9df8;
    }
    .box-people {
      margin-top: 5vw;
      color: #999;
    }
    .imgfonts {
      font-size: 3vw;
      display: flex;
      align-items: center;
      img {
        height: 3vw;
        margin-right: 1vw;
      }
    }
  }
  .box-end {
    margin-top: 6vw;
    border-top: 1px solid #ddd;
    // border-bottom: 1px solid #ddd;
    padding: 3vw 0;
    margin-left: 4vw;
    display: flex;
    justify-content: space-between;
    img {
      // width: 22px;
      width: 5vw;
      // height: 5vw;
      object-fit: cover;
      margin-right: 2vw;
    }
    > div {
      display: flex;
      align-items: center;
    }
    .end-right {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      padding: 0 4vw;
      > div {
        margin-left: 10vw;
        display: flex;
        align-items: center;
      }
    }
  }
  .box-fixed {
    z-index: 1;
    position: fixed;
    bottom: 3rem;
    right: 0;
    color: #fff;
    > div:nth-child(1) {
      // background: linear-gradient(top, #74b9fc, #3b9df8);
      // margin-bottom: 1rem;
      // padding: 0.5rem;
      // text-align: right;
      // border-radius: 50px 0 0 50px;
      // width: 5rem;
      height: 9vw;
      width: 26vw;
      background: url("https://anygo-imag.oss-cn-beijing.aliyuncs.com/webImg/open_app.png");
      background-size: cover;
      &:active {
        // background: linear-gradient(top, #4ea6f8, #3b9df8);
        opacity: 0.9;
      }
    }
  }
  .comments {
    background: #f3f3f3;
    padding-top: 4vw;
    .comments-item {
      display: flex;
      background: #fff;
      padding-bottom: 6vw;
      .item-icon {
        padding: 4vw 2vw 1vw 4vw;
        img {
          width: 9vw;
          height: 9vw;
          border-radius: 0.2rem;
        }
        // margin-right: 0.1rem;
      }
      .item-content {
        padding: 4vw 0 6vw 0;
        flex: 1;
        border-bottom: 1px solid #ccc;
        .content-name {
          font-size: 4vw;
          color: #333;
        }
        .content-date {
          color: #aaa;
          margin-top: 1vw;
          font-size: 3vw;
        }
        .content-msg {
          font-size: 4vw;
          margin-top: 3vw;
        }
        .content-more {
          margin-top: 3vw;
          background: #f9f9f9;
          border-radius: 2px;
          height: 11vw;
          line-height: 11vw;
          padding-left: 3vw;
          color: #999;
          font-size: 4vw;
          span {
            color: #3a9cf7;
            &:active {
              opacity: 0.8;
            }
          }
        }
      }
      .item-img {
        padding: 4vw 4vw 1vw 2vw;
        border-bottom: 1px solid #ccc;
        img {
          width: 5vw;
          // height: 4vw;
          &:active {
            opacity: 0.8;
          }
        }
      }
    }
    .comments-more {
      background: #fff;
      padding: 0 4vw 6vw 4vw;
      > div {
        background: #3a9cf7;
        color: #fff;
        font-size: 4vw;
        text-align: center;
        padding: 3vw 0;
        border-radius: 4px;
        &:active {
          opacity: 0.8;
        }
      }
    }
  }
  .trinotes {
    background: #f3f3f3;
    > div:nth-child(1) {
      font-size: 4vw;
      border-bottom: 1px solid #ccc;
      margin-left: 4vw;
      padding: 4vw 0;
      color: #999;
    }
  }
  .videoDialogPh {
    .el-dialog {
      width: 100%;
      height: 100%;
      margin: 0!important;
      background: rgba(0, 0, 0, .4);
    }
    .el-dialog__body {
      padding: 10vh 0;
    }
  }
}
.overhide {
  overflow: hidden!important;
  height: 100%;
}
.el-message-box {
  width: auto;
}
#origin-img {
  position: fixed;
  z-index: 111111;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000;
}
#origin-img .swiper-slide img {
  width: 100%;
  vertical-align: middle;
}
.swiper-pagination {
  top: 1em;
  bottom: auto;
  color: #fff;
}
</style>
