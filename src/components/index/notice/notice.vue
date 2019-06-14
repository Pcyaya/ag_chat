<template>
  <div class="notice">
    <div class="notice-top">
      <div>
        游团通知
        <span>（{{total == '' ? 0:total}}条）</span>
      </div>
      <div>
      </div>
    </div>
    <div class="notice-box">
      <Loading v-if="loadingDiv" style="opacity:.7"></Loading>
      <div class="notice-box-left" ref="noticeView">
        <div
          v-for="(item, index) in listNoticeData"
          :key="index"
          :class="{'bg_f5': intlength == index}"
          @click="GetInfoNotice(item, index)"
        >
          <div>{{item.title}}</div>
          <div>
            <div>{{item.content}}</div>
            <div class="noticeVoice" v-if="item.audios != null">
              <div>
                <img :src="icon.voice3" alt>
              </div>
              <div>{{item.audios[0].content}}s</div>
            </div>
            <div class="noticeImg" v-if="item.imgs != null">
              <img v-lazy="msg_img+item.imgs[0].url" alt>
            </div>
            <div>
              {{$base.timestampToTime(item.create_date)}}
              <span>{{item.rg_name}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="notice-box-right" v-if="itemNoticeData != ''">
        <div v-if="JSON.stringify(itemNoticeData) === '{}'" style="text-align:center;"><i class="el-icon-loading"></i> 加载中...</div>
        <div v-else>
          <div>{{itemNoticeData.title}}</div>
          <div>
            <div>发布时间：{{$base.timestampToTime(itemNoticeData.create_date)}}</div>
            <div>来&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;源：{{itemNoticeData.name}}</div>
          </div>
          <div>{{itemNoticeData.content}}</div>
          <div
            class="noticeVoice"
            v-if="itemNoticeData.show_flg == 2 || itemNoticeData.show_flg == 4 || itemNoticeData.show_flg == 6 || itemNoticeData.show_flg == 7"
          >
            <div class="cur" @click="audioPlay(voice_file+itemNoticeData.audios[0].url)">
              <img :src="audioType == 1 ? icon.viucegif : icon.voice3" alt>
            </div>
            <div>{{itemNoticeData.audios[0].content}}s</div>
          </div>
          <div class="noticeImg">
            <div
              v-for="(item, index) in itemNoticeData.imgs"
              :key="index"
              :class="{'imgOne':itemNoticeData.imgs.length == 1}"
            >
              <img
                v-lazy="msg_img+item.url"
                alt
                @click="msgImgView(itemNoticeData.imgs,index,msg_img)"
              >
            </div>
          </div>
          <div class="noticeDate">
            <div v-if="itemNoticeData.date != 0">
              <img :src="icon.notice_remind" alt>
              <span>{{$base.timestampToTime(itemNoticeData.date)}}</span>
            </div>
            <div v-else></div>
            <div class="info-del">
              <i class="el-icon-delete" @click="GetNotedel(itemNoticeData.rgm_num)"></i>
            </div>
          </div>
        </div>
        <!-- <div>
          <i class="el-icon-delete cur" @click="GetNotedel(itemNoticeData.rgm_num)"></i>
        </div> -->
      </div>
    </div>
    <viewimg v-if="imgType" :imgurl="imgurlList" @typeBy="typeBy"></viewimg>
  </div>
</template>

<script>
import Loading from "../../loading/loading";
import viewimg from "./../../viewimg/viewimg";
export default {
  data() {
    return {
      loginVisitor: {},
      baseinfo: {},
      total: "",
      rgm_num: '',
      listNoticeData: [],
      itemNoticeData: "",
      intlength: -1,
      icon: {
        notice2: this.OSSIMG + "icon_notice2.png",
        notice_remind: this.OSSIMG + "icon_notice_remind.png",
        bg_voice: this.OSSIMG + "bg_voice.png",
        voice1: this.OSSIMG + "icon_voice1.png",
        voice2: this.OSSIMG + "icon_voice2.png",
        voice3: this.OSSIMG + "icon_voice3.png",
        viucegif: this.OSSIMG + "icon_voice1_gif.gif",
        add_pic: this.OSSIMG + "icon_add_pic.png"
      },
      audioType: 0,
      page: 1,
      loadingDiv: true,
      imgType: false,
      imgurlList: [],
    };
  },
  props: ["routeNav"],
  watch: {
    routeNav() {
      if (this.routeNav == "notice") {
        this.loadingDiv = true;
        this.listNoticeData = [];
        // this.itemNoticeData = '';
        this.page = 1;
        this.GetListNotice();
        // this.intlength = -1;
      }
    }
  },
  mounted() {
    const that = this;
    let loginVisitor = localStorage.getItem("loginVisitor");
    let baseinfo = localStorage.getItem("baseinfo");
    if (loginVisitor == "") {
      that.$message({
        message: "登录超时，请重新登录！",
        type: "error"
      });
      localStorage.setItem("loginVisitor", "");
      that.$router.push({
        path: "/"
      });
    } else {
      that.loginVisitor = JSON.parse(loginVisitor);
      that.baseinfo = JSON.parse(baseinfo);
      // that.GetListNotice()
    }
  },
  components: {
    Loading,
    viewimg
  },
  methods: {
    EventFn() {
      const that = this;
      if (
        that.$refs.noticeView.scrollTop + this.$refs.noticeView.offsetHeight >=
        that.$refs.noticeView.scrollHeight
      ) {
        this.page++;
        this.GetListNotice();
      }
    },
    // 列表
    GetListNotice() {
      this.loadingDiv = true;
      const that = this;
      if (JSON.stringify(that.$refs) != "{}") {
        that.$refs.noticeView.removeEventListener(
          "scroll",
          that.EventFn,
          false
        );
      }
      $.ajax({
        url: this.urlHost + "visitor/notes",
        type: "post",
        data: {
          access_token: this.loginVisitor.access_token,
          page: this.page,
          rows: 10
        },
        dataType: "json",
        success: res => {
          this.loadingDiv = false;
          if (res.success === "00000000") {
            if (res.obj.data != null) {
              this.total = res.obj.total;
              for (let i = 0; i < res.obj.data.length; i++) {
                this.listNoticeData.push(res.obj.data[i]);
              }
              that.$refs.noticeView.addEventListener("scroll", that.EventFn, false);
            }else {
              that.$message('暂无更多游团通知！');
              that.$refs.noticeView.removeEventListener("scroll", that.EventFn, false);
            }
          } else {
            this.$base.err(res, this);
          }
        },
        error: err => {
          // console.log(err);
          this.loadingDiv = false;
          this.$message({
            message: "网络异常！",
            type: "error",
            center: true
          });
        }
      });
    },
    //游团通知详情
    GetInfoNotice(data, index) {
      this.intlength = index;
      if(this.rgm_num !== data.rgm_num) {
        this.itemNoticeData = {}
      }
      this.rgm_num = data.rgm_num;
      $.ajax({
        url: this.urlHost + "visitor/group/noteinfo",
        type: "post",
        data: {
          access_token: this.loginVisitor.access_token,
          rgm_num: data.rgm_num,
          read: 1
        },
        dataType: "json",
        success: res => {
          if (res.success === "00000000") {
            this.itemNoticeData = res.obj;
            this.itemNoticeData["name"] = data.rg_name;
          } else {
            this.$base.err(res, this);
          }
        },
        error: err => {
          // console.log(err);
        }
      });
    },
    //删除游团通知
    GetNotedel(rgm_num) {
      this.$confirm("自己创建的游团通知，删除后，相应的团中的游团通知也会被删除，非自己创建的游团通知，删除，不影响原团中的游团通知？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          $.ajax({
            url: this.urlHost + "visitor/group/notedel",
            type: "post",
            data: {
              access_token: this.loginVisitor.access_token,
              rgm_num: rgm_num
            },
            dataType: "json",
            success: res => {
              if (res.success === "00000000") {
                this.$message({
                  message: "已删除！",
                  type: "success",
                  center: true
                });
                this.total--;
                this.listNoticeData.splice(this.intlength, 1);
                this.intlength = -1;
                this.itemNoticeData = "";
              } else {
                this.$base.err(res, this);
              }
            },
            error: err => {
              // console.log(err);
            }
          });
        })
        .catch(() => {});
    },
    // 语音播放
    audioPlay(url) {
      const that = this;
      if (that.currentAudio == undefined) {
        that.currentAudio = new Audio(url);
        that.currentAudio.play();
        that.audioType = 1;
        that.currentAudio.addEventListener(
          "ended",
          function() {
            that.audioType = -1;
          },
          false
        );
      } else {
        if (that.currentAudio.src == url) {
          if (that.currentAudio.paused) {
            that.audioType = 1;
            that.currentAudio.play();
          } else {
            that.audioType = -1;
            that.currentAudio.pause();
            that.currentAudio = undefined;
          }
        } else {
          that.audioType = -1;
          that.currentAudio.pause();
          that.currentAudio = undefined;
          that.currentAudio = new Audio(url);
          that.currentAudio.play();
          that.audioType = 1;
          that.currentAudio.addEventListener(
            "ended",
            function() {
              that.audioType = -1;
            },
            false
          );
        }
      }
    },
    typeBy(t) {
      this.imgType = t;
    },
    viewBtn(data, index) {
      if(!Array.isArray(data)){
        this.imgurlList = {
          imgs:[data],
          index: 0
        }
      }else {
        this.imgurlList = {
          imgs:data,
          index
        }
      }
      this.imgType = true;
    },
    //图片预览
    msgImgView(imgs, index, url) {
      // console.log(imgs)
      let imgsData = [];
      for (let i in imgs) {
        imgsData.push(url + imgs[i].url);
      }
      for (let i = 0; i < imgsData.length; i++) {
        if (url + imgs[index].url == imgsData[i]) {
          this.viewBtn(imgsData, i)
        }
      }
    },
  }
};
</script>

<style lang="less">
.notice {
  position: relative;
  background: #f3f3f3;
  height: 100%;
  // width: 1004px;
  border-radius: 0 8px 8px 0;
  .notice-top {
    padding: 15px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ccc;
    > div:nth-child(1) {
      color: #000;
      span {
        color: #999;
      }
    }
    > div:nth-child(2) {
      cursor: pointer;
      &:hover {
        opacity: 0.7;
      }
    }
  }
  .notice-box {
    // height: 704px;
    position: relative;
    height: calc(100% - 53px);
    display: flex;
    .notice-box-left {
      max-width: 48%;
      // min-width: 48.5%;
      flex: 1;
      overflow-y: auto;
      padding: 0 20px;
      > div {
        cursor: pointer;
        margin-top: 20px;
        border: 1px solid #e2e2e2;
        border-radius: 4px;
        background: #fff;
        overflow: hidden;
        > div:nth-child(1) {
          height: 42px;
          line-height: 42px;
          padding-left: 14px;
          border-bottom: 1px solid #e2e2e2;
        }
        > div:nth-child(2) {
          padding: 24px 14px;
          > div:nth-child(1) {
            font-size: 14px;
            width: 375px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .noticeVoice {
            display: flex;
            > div:nth-child(1) {
              background: url(https://anygo-imag.oss-cn-beijing.aliyuncs.com/webImg/bg_voice.png);
              width: 342px;
              height: 41px;
            }
            > div:nth-child(2) {
              line-height: 41px;
              margin-left: 20px;
            }
            img {
              margin-left: 10px;
            }
          }
          .noticeImg {
            margin-top: 24px;
            img {
              width: auto;
              max-height: 200px;
            }
          }
          > div:last-child {
            margin-top: 24px;
            font-size: 12px;
            color: #999;
            span {
              margin-left: 15px;
            }
          }
        }
      }
      > div:last-child {
        margin-bottom: 20px;
      }
    }
    .notice-box-right {
      width: 477px;
      border-radius: 0 0 8px 0;
      background: #f9f9f9;
      > div:nth-child(1) {
        padding: 20px 0 30px 20px;
        height: calc(100% - 50px);
        overflow-y: auto;
        > div:nth-child(2) {
          margin-top: 15px;
          font-size: 12px;
          color: #999;
          > div:nth-child(2) {
            margin-top: 10px;
          }
        }
        > div:nth-child(3) {
          margin-top: 30px;
          padding-right: 15px;
          word-break: break-all;
        }
        .noticeVoice {
          margin-top: 30px;
          display: flex;
          > div:nth-child(1) {
            background: url(https://anygo-imag.oss-cn-beijing.aliyuncs.com/webImg/bg_voice.png);
            width: 280px;
            height: 41px;
            border-radius: 0 4px 4px 0;
            display: flex;
            align-items: center;
          }
          > div:nth-child(2) {
            line-height: 41px;
            margin-left: 20px;
          }
          img {
            margin-left: 10px;
          }
        }
        .noticeImg {
          margin-top: 30px;
          display: flex;
          flex-wrap: wrap;
          .imgOne {
            width: calc(100% - 20px);
            height: 100%;
            object-fit: cover;
            cursor: pointer;
          }
          div {
            width: 145px;
            height: 145px;
            overflow: hidden;
            margin: 0 5px 5px 0;
          }
          img {
            cursor: pointer;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
        .noticeDate {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 120px;
          padding-right: 20px;
          >div:nth-child(1){
            font-size: 12px;
            color: #666;
            display: flex;
            align-items: center;
            img {
              margin-right: 10px;
            }
          }
          .info-del {
            i{
              color: #999;
              cursor: pointer;
              transition: all .2s;
              &:hover {
                color: #3b9cf8;
              }
            }
          }
        }
      }
      // > div:nth-child(2) {
      //   position: relative;
      //   // top: 10px;
      //   i {
      //     position: absolute;
      //     top: -44px;
      //     right: 18px;
      //     // top: 20px;
      //   }
      // }
    }
  }
}
.bg_f5 {
  background: #f5f5f5 !important;
}
.titleNotice {
  // position: relative;
  // top: 10px;
  // left: 400px;
  color: #999;
  margin-top: 30px;
  margin-right: 100px;
  text-align: right;
}
.cur {
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
  &:active {
    opacity: 1;
  }
}
</style>
