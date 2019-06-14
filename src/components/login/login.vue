<template>
  <div class="login" v-show="closediv" v-if="contentShow" @click="hostType = false">
    <div v-if="serviceType == 0" class="bb">测试版</div>
    <div class="content">
      <div class="box-left">
        <div class="logo">
          <div>
            <img :src="logoUrl" alt>
          </div>
        </div>
        <div class="infromlogin">
          <span>用户登录</span>
          <img :src="leftUrl" alt>
        </div>
      </div>
      <div class="box-right">
        <div class="login-type">
          <span v-if="loginT == '0'" @click="phoneLogin">使用短信登录</span>
          <span v-else @click="qrLogin">扫描二维码登录</span>
        </div>
        <div v-if="loginT == '0'" class="login-qr">
          <div class="codes"></div>
          <div>
            <span style="font-size:101%">
              <span style="font-size:102%">使</span>用
            </span>手机APP扫描登录艾侗游
          </div>
        </div>
        <div v-else class="login-input">
          <div>Account</div>
          <div>
            <img :src="userUrl" alt>
            <input
              ref="phone"
              @keyup.enter="loading"
              @dblclick="hostType = true"
              type="text"
              onkeyup="this.value=this.value.replace(/[^\d]/g,'') "
              maxlength="11"
              v-model="phoneData.phone"
              placeholder="请输入账户信息"
            >
            <i
              @click.stop="hostType = !hostType"
              :class="{'el-icon-arrow-down': !hostType,'el-icon-arrow-up': hostType}"
            ></i>
            <div class="host-list" v-if="hostType">
              <div v-for="(item, index) in hostListData" :key="index" @click="hostClick(item)">
                <div>
                  <img :src="item.icon" alt>
                  <div>
                    <div class="host-name">{{item.name}}</div>
                    <div class="host-phone">{{item.phone}}</div>
                  </div>
                </div>
                <div>
                  <i @click.stop="hostRemove(hostListData,index)" class="el-icon-close"></i>
                </div>
              </div>
            </div>
          </div>
          <div>Verify code</div>
          <div>
            <input
              type="text"
              ref="code"
              maxlength="6"
              @keyup.enter="loading"
              v-model="phoneData.code"
              placeholder="请输入验证码"
            >
            <div class="inputBtn">
              <span class="col_clicked" v-if="phoneData.phone.length!=11 && !sendMsgDisabled">获取验证码</span>
              <span
                :class="{'col_click':phoneData.phone.length==11}"
                v-else-if="!sendMsgDisabled"
                @click="getcode"
              >获取验证码</span>
              <span class="col_clicked" v-else>重新获取({{time}})</span>
            </div>
          </div>
          <div>
            <el-button @click="loading" type="primary">登录</el-button>
          </div>
          <span class="qwei">
            <div>第三方账号登录:</div>
            <div>
              <img
                @mouseout="icon.qq = OSSIMG +'qq.png'"
                @mouseover="icon.qq = OSSIMG +'qq_hover.png'"
                :src="icon.qq"
                @click="qqLogin(2)"
                alt
              >
              <img
                @mouseout="icon.wechat = OSSIMG +'wechat.png'"
                @mouseover="icon.wechat = OSSIMG +'wechat_hover.png'"
                :src="icon.wechat"
                @click="qqLogin(1)"
                alt
              >
            </div>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../../../static/code/jquery.qrcode.min.js";
export default {
  data() {
    return {
      loginVisitor: {},
      logoUrl: this.OSSIMG + "logo.png",
      leftUrl: this.OSSIMG + "icon_arrow.png",
      userUrl: this.OSSIMG + "icon_account.png",
      user_icon1: this.OSSIMG + "icon_personal_head.png",
      icon: {
        qq: this.OSSIMG + "qq.png",
        wechat: this.OSSIMG + "wechat.png"
      },
      active: {
        qq: false,
        wechat: false
      },
      loginT: "1",
      indexNav: null,
      phoneData: {
        phone: "",
        code: ""
      },
      qrData: "",
      time: 60,
      sendMsgDisabled: false,
      closediv: true,
      contentShow: false,
      hostListData: [],
      hostType: false,
      imgUrl: "https://anygo-imag.oss-cn-beijing.aliyuncs.com/webImg/bg.png"
    };
  },
  watch: {
    "phoneData.phone"() {
      for (let i = 0; i < this.hostListData.length; i++) {
        if (this.hostListData[i].phone == this.phoneData.phone) {
          this.userUrl = this.hostListData[i].icon;
          return;
        } else {
          this.userUrl = this.OSSIMG + "icon_account.png";
        }
      }
    }
  },
  created() {
    this.flgLogin();
    var hostList = localStorage.getItem("hostlist");
    this.hostListData = hostList == null ? [] : JSON.parse(hostList);
    if (this.hostListData.length > 0) {
      this.phoneData.phone = this.hostListData[0].phone;
    }
  },
  mounted() {
    this.loadImg();
    setTimeout(() => {
      this.$refs.phone.focus();
    }, 1000);
  },
  methods: {
    loadImg() {
      let bgImg = new Image();
      bgImg.src = this.imgUrl;
      bgImg.onerror = () => {
        console.log("img error");
      };
      bgImg.onload = () => {
        this.contentShow = true;
      };
    },
    //删除历史登录信息
    hostRemove(data, index) {
      data.splice(index, 1);
      localStorage.setItem("hostlist", JSON.stringify(data));
    },
    hostClick(item) {
      const that = this;
      that.phoneData.phone = item.phone;
      that.hostType = false;
      that.userUrl = item.icon;
    },
    //登录成功后本地存储
    hostLocal() {
      const that = this;
      if (that.baseinfo.access_phone != "") {
        for (let i = 0; i < that.hostListData.length; i++) {
          if (that.baseinfo.access_num == that.hostListData[i].num) {
            that.hostListData.splice(i, 1);
          }
        }
        if (that.baseinfo.icon == "" || that.baseinfo.icon == null) {
          that.baseinfo.icon = that.OSSIMG + "icon_account.png";
        } else if (that.baseinfo.icon.indexOf("http") != -1) {
        } else {
          that.baseinfo.icon = that.head_icon + that.baseinfo.icon;
        }
        that.hostListData.unshift({
          name: that.baseinfo.name,
          icon: that.baseinfo.icon,
          phone: that.baseinfo.access_phone,
          num: that.baseinfo.access_num
        });
        localStorage.setItem("hostlist", JSON.stringify(that.hostListData));
      }
    },
    //判断是否已登录
    logined() {
      let loginVisitor = localStorage.getItem("loginVisitor");
      if (loginVisitor == "" || loginVisitor == null) {
        this.getQr();
      } else {
        this.loginVisitor = JSON.parse(loginVisitor);
        $.ajax({
          url: this.urlHost + "visitor/baseinfo",
          type: "post",
          data: { access_token: this.loginVisitor.access_token },
          dataType: "json",
          success: res => {
            if (res.success === "00000000") {
              localStorage.setItem("baseinfo", JSON.stringify(res.obj));
              localStorage.setItem("share", "0");
              localStorage.setItem("historyMsg", "{}");
              this.baseinfo = res.obj;
              this.hostLocal();
              this.$router.push({
                path: "/msg"
              });
            } else if (res.success === "00100004") {
              this.$message({
                message: res.msg,
                type: "error"
              });
              this.getQr();
            } else {
              this.getQr();
            }
          },
          error: err => {
            this.loadings.close();
            this.$message.error("网络异常");
          }
        });
      }
    },
    openLoading(msg) {
      this.loadings = this.$loading({
        lock: true,
        text: msg,
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.8)"
      });
    },
    //登录   1->微信登录 2->QQ登录
    qqLogin(type) {
      if (type === 1) {
        window.location.href =
          "https://open.weixin.qq.com/connect/qrconnect?appid=" +
          this.wxQuery.appid +
          "&redirect_uri=" +
          this.wxQuery.redirect_uri +
          "&response_type=code&scope=snsapi_login&state=1#wechat_redirect";
      } else if (type === 2) {
        window.location.href =
          "https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=" +
          this.qqQuery.client_id +
          "&redirect_uri=" +
          this.qqQuery.redirect_uri +
          "&state=2&scope=get_user_info,list_album,upload_pic,do_like";
      }
    },
    //验证是否授权成功
    flgLogin() {
      if (this.serviceType == 0) {
        this.qqQuery = {
          client_id: "101551468",
          redirect_uri: "http://www.aetosgo.com:8080/chat",
          // redirect_uri: "http://192.168.1.77/chat",
          client_secret: "e279b4f209995ad1d5fd14714cfae194"
        };
        this.wxQuery = {
          appid: "wxee454b0600602b4e",
          redirect_uri: "http://www.aetosgo.com:8080/chat",
          // redirect_uri: "http://192.168.1.77/chat",
          secret: "5096d3e165e183ccd0170164dd2c5282"
        };
        if (window.location.href.indexOf(".com") != -1) {
          this.qqQuery.redirect_uri = "http://www.aetosgo.com:8080/chat";
          this.wxQuery.redirect_uri = "http://www.aetosgo.com:8080/chat";
        } else {
          this.qqQuery.redirect_uri = "http://192.168.1.77/chat";
          this.wxQuery.redirect_uri = "http://192.168.1.77/chat";
        }
      } else {
        this.qqQuery = {
          client_id: "101511269",
          redirect_uri: "http://www.aetosgo.com/chat",
          client_secret: "cf386a73cf567c60246f076248675192"
        };
        this.wxQuery = {
          appid: "wxee454b0600602b4e",
          redirect_uri: "http://www.aetosgo.com/chat",
          secret: "5096d3e165e183ccd0170164dd2c5282"
        };
      }

      const that = this;
      let code = that.$base.getQueryString("code");
      let state = that.$base.getQueryString("state");
      if (code != null) {
        if (state == 1 || state == 2) {
          this.openLoading("登录中...");
        } else if (state == 11 || state == 12) {
          this.openLoading("验证中...");
          this.closediv = false;
        }
        if (state == 1 || state == 11) {
          var url =
            that.wxURL +
            "sns/oauth2/access_token?appid=" +
            that.wxQuery.appid +
            "&secret=" +
            that.wxQuery.secret +
            "&code=" +
            code +
            "&grant_type=authorization_code";
        } else if (state == 2 || state == 12) {
          var url =
            that.QQURL +
            "oauth2.0/token?grant_type=authorization_code&client_id=" +
            that.qqQuery.client_id +
            "&client_secret=" +
            that.qqQuery.client_secret +
            "&code=" +
            code +
            "&redirect_uri=" +
            this.qqQuery.redirect_uri;
        }
        console.log(url);
        $.ajax({
          url,
          type: "GET",
          dataType: "text",
          success: data => {
            if (state == 1 || state == 11) {
              data = JSON.parse(data);
              let obj = {
                token: data.access_token,
                openid: data.unionid,
                state: state,
                unionid: data.unionid
              };
              // console.log(data)
              that.GetQQInfo(obj);
            } else if (state == 2 || state == 12) {
              let token = data.substr(
                data.indexOf("access_token") + 13,
                data.indexOf("&") - 13
              );
              console.log(data);
              if (token != "") {
                that.getAccessToken(token, state);
              } else {
                that.loadings.close();
                that.$message.error("授权失败！");
              }
            } else {
              that.loadings.close();
              that.$message.error("授权失败！");
            }
          },
          error: err => {
            that.loadings.close();
            that.$message.error("网络异常");
          }
        });
      } else {
        that.logined();
      }
    },
    //获取access_token
    getAccessToken(token, state) {
      const that = this;
      let url =
        that.serviceType == 1
          ? that.QQURL + "oauth2.0/me?access_token=" + token + "&unionid=1"
          : that.QQURL + "oauth2.0/me?access_token=" + token;
      $.ajax({
        url: url,
        type: "GET",
        dataType: "text",
        success: data => {
          let str = data.substring(data.indexOf("(") + 1, data.indexOf(")")),
            openid = JSON.parse(str).openid,
            unionid = JSON.parse(str).unionid,
            obj = {
              token: token,
              openid: openid,
              state: state,
              unionid: unionid
            };
          that.GetQQInfo(obj);
        },
        error: err => {
          that.loadings.close();
          that.$message.error("网络异常");
        }
      });
    },
    //获取QQ信息
    GetQQInfo(obj) {
      var token = obj.token,
        openid = obj.openid,
        state = obj.state,
        unionid = obj.unionid;
      const that = this;
      if (state == 1 || state == 11) {
        var url =
          that.wxURL +
          "sns/userinfo?access_token=" +
          token +
          "&openid=" +
          openid;
      } else if (state == 2 || state == 12) {
        var url =
          that.QQURL +
          "user/get_user_info?access_token=" +
          token +
          "&oauth_consumer_key=" +
          that.qqQuery.client_id +
          "&openid=" +
          openid;
      }
      $.ajax({
        url,
        type: "GET",
        dataType: "json",
        success: data => {
          // console.log(data)
          var icon =
            state == 2 || state == 12
              ? data.figureurl_qq_2
              : state == 1 || state == 11
              ? data.headimgurl
              : "";
          // let obj = {
          //   access_token: JSON.parse(localStorage.getItem('baseinfo')).access_token,
          //   openid: openid,
          //   name: data.nickname,
          //   icon: icon,
          //   flat: state,
          //   source: 3
          // };
          if (state == 1 || state == 2) {
            var obj = {
              openid: unionid || openid,
              name: data.nickname,
              icon: icon,
              flat: state,
              source: 3
            };
            that.GetLogin(obj, data);
          } else if (state == 11 || state == 12) {
            var obj = {
              access_token: JSON.parse(localStorage.getItem("baseinfo"))
                .access_token,
              openid: unionid || openid,
              name: data.nickname,
              icon: icon,
              flat: state == 11 ? 1 : state == 12 ? 2 : 0
            };
            that.GetLoginBind(obj, data);
          }
        },
        error: err => {
          that.loadings.close();
          that.$message.error("网络异常");
        }
      });
    },
    //第三方登录
    GetLogin(obj, list) {
      const that = this;
      $.ajax({
        url: that.urlHost + "login/provisional",
        type: "post",
        data: obj,
        dataType: "json",
        success: data => {
          this.loadings.close();
          if (data.success === "00000000") {
            data.obj.info = list;
            localStorage.setItem("loginVisitor", JSON.stringify(data.obj));
            localStorage.setItem("share", "0");
            localStorage.setItem("historyMsg", "{}");
            $.ajax({
              url: that.urlHost + "visitor/baseinfo",
              type: "post",
              data: { access_token: data.obj.access_token },
              dataType: "json",
              success: res => {
                if (res.success === "00000000") {
                  localStorage.setItem("baseinfo", JSON.stringify(res.obj));
                  localStorage.setItem("share", "0");
                  localStorage.setItem("historyMsg", "{}");
                  // localStorage.setItem("indexNav", "travel");
                  that.baseinfo = res.obj;
                  // console.log(this.qqQuery);
                  that.hostLocal();
                  if (that.baseinfo.access_flat > -1) {
                    localStorage.setItem("indexNewMsg", "false");
                  }
                  that.$router.push({
                    path: that.baseinfo.access_flat > -1 ? "/travel" : "/msg"
                  });
                } else {
                  that.$base.err(res, that);
                }
              },
              error: err => {
                that.loadings.close();
                that.$message.error("网络异常");
              }
            });
          } else {
            that.$message({
              message: data.msg,
              type: "error",
              center: true
            });
          }
        },
        error: err => {
          that.loadings.close();
          that.$message.error("网络异常");
        }
      });
    },
    //绑定
    GetLoginBind(obj, data) {
      const that = this;
      $.ajax({
        url: that.urlHost + "visitor/provisional",
        type: "post",
        data: obj,
        dataType: "json",
        success: res => {
          if (res.success === "00000000") {
            that.$message.success(res.msg);
          } else {
            that.$base.err(res, that);
          }
          setTimeout(() => {
            that.loadings.close();
          }, 1000);
          setTimeout(() => {
            that.logined();
            localStorage.setItem("settingOpen", 1);
          }, 2000);
        },
        error: err => {
          that.$message.error("网络异常");
        }
      });
    },
    //切换手机验证登录
    phoneLogin() {
      this.loginT = "1";
      setTimeout(() => {
        if (!this.sendMsgDisabled) {
          this.$refs.phone.focus();
        } else {
          this.$refs.code.focus();
        }
      }, 0);
    },
    //切换二维码扫描登录
    qrLogin() {
      this.loginT = "0";
      this.getQr();
    },
    //获取二维码
    getQr() {
      const that = this;
      $.ajax({
        url: that.urlHost + "code/qrcode",
        type: "post",
        data: { source: 3 },
        dataType: "json",
        success: data => {
          if (data.success === "00000000") {
            let qrCodeNum = data.obj.num;
            let download = data.obj.download;
            let qr = {
              tag: Number(data.obj.tag),
              num: qrCodeNum
            };
            $(".codes").html("");
            $(".codes").qrcode({
              width: 230,
              height: 230,
              text: download + "?qr=" + JSON.stringify(qr)
            });
            that.cennect(qrCodeNum);
          } else {
            that.$message({
              message: data.msg,
              type: "error",
              center: true
            });
          }
        },
        error: err => {
          that.loadings.close();
          that.$message.error("网络异常");
        }
      });
    },
    // websocket连接
    cennect(num) {
      const url = this.wsUrl + "qrcode=" + num + "&access_flg=1";
      let ws = new WebSocket(url);
      ws.onopen = data => {
        // console.log()
      };
      ws.onmessage = e => {
        const that = this;
        let objData = JSON.parse(e.data).obj;
        if (objData != null) {
          let operateType = objData.operate;
          let access_token = { access_token: objData.access_token };
          if (operateType == 0) {
            localStorage.setItem("loginVisitor", JSON.stringify(access_token));
            localStorage.setItem("share", "0");
            localStorage.setItem("historyMsg", "{}");
            $.ajax({
              url: that.urlHost + "visitor/baseinfo",
              type: "post",
              data: { access_token: objData.access_token },
              dataType: "json",
              success: res => {
                if (res.success === "00000000") {
                  localStorage.setItem("baseinfo", JSON.stringify(res.obj));
                  localStorage.setItem("share", "0");
                  localStorage.setItem("historyMsg", "{}");
                  that.baseinfo = res.obj;
                  that.hostLocal();
                  that.$router.push({
                    path: "/msg"
                  });
                } else {
                  that.$base.err(res, that);
                }
              },
              error: err => {
                console.error(err);
              }
            });
          } else if (operateType == 1) {
            this.$message({
              message: "拒绝登录！",
              type: "error"
            });
            this.getQr();
          } else if (operateType == 2) {
            this.$message({
              message: "拒绝登录！",
              type: "error"
            });
            this.getQr();
          } else if (operateType == 3) {
            this.$message({
              message: "二维码已过期！!",
              type: "error"
            });
            this.getQr();
          } else if (operateType == 4) {
            this.$message({
              message: "当前设备不支持扫码登陆!",
              type: "error"
            });
          }
        }
      };
    },
    // 手机验证
    loading() {
      const that = this;
      if (this.phoneRE()) {
        that.openLoading("登录中...");
        $.ajax({
          url: that.urlHost + "login/visitor",
          type: "post",
          data: {
            phone: that.phoneData.phone,
            code: that.phoneData.code,
            source: 3
          },
          dataType: "json",
          timeout: 3000,
          success: function(data) {
            if (data.success == "00000000") {
              localStorage.setItem("loginVisitor", JSON.stringify(data.obj));
              localStorage.setItem("share", "0");
              localStorage.setItem("historyMsg", "{}");
              $.ajax({
                url: that.urlHost + "visitor/baseinfo",
                type: "post",
                data: { access_token: data.obj.access_token },
                dataType: "json",
                success: res => {
                  if (res.success === "00000000") {
                    localStorage.setItem("baseinfo", JSON.stringify(res.obj));
                    localStorage.setItem("share", "0");
                    localStorage.setItem("historyMsg", "{}");
                    that.baseinfo = res.obj;
                    that.hostLocal();
                    that.$router.push({
                      path: "/msg"
                    });
                  } else {
                    that.$base.err(res, that);
                  }
                },
                error: err => {
                  that.loadings.close();
                  that.$message.error("网络异常");
                }
              });
            } else {
              that.loadings.close();
              that.$message.error(data.msg);
            }
          },
          error: err => {
            that.loadings.close();
            that.$message.error("网络异常");
          }
        });
      }
    },
    //手机验证正则
    phoneRE() {
      const re = /^1[356789]\d{9}$/;
      if (this.phoneData.phone === "") {
        this.$message({
          message: "请输入手机号!",
          type: "error"
        });
      } else if (!re.test(this.phoneData.phone)) {
        this.$message({
          message: "请输入正确的手机号!",
          type: "error"
        });
      } else {
        return true;
      }
    },
    //获取验证码
    getcode() {
      const that = this;
      if (this.phoneRE()) {
        $.ajax({
          url: this.urlHost + "code/visitor",
          type: "post",
          data: { phone: this.phoneData.phone },
          dataType: "json",
          success: function(data) {
            // console.log(JSON.stringify(data));
            that.$message({
              message: "验证码已发送至您的手机!",
              type: "success"
            });
            that.send();
            that.$refs.code.focus();
          },
          error: function(err) {
            console.log("失败" + "====>" + JSON.stringify(err));
          }
        });
      }
    },
    //验证码计时
    send() {
      let me = this;
      me.sendMsgDisabled = true;
      let interval = window.setInterval(function() {
        if (me.time-- <= 0) {
          me.time = 60;
          me.sendMsgDisabled = false;
          window.clearInterval(interval);
        }
      }, 1000);
    }
  }
};
</script>

<style lang="less" scoped>
@col_f: #fff;
@col_9: #999;
@active: #3a9cf7;
@keyframes myfirst {
  from {
    // width: 90%;
    // height: 90%;
    opacity: 0;
  }
  to {
    width: 100%;
    height: 100%;
  }
}
@keyframes mycont {
  from {
    top: -30%;
    opacity: 0.1;
  }
  to {
    top: 0%;
  }
  // 0% {
  //   top: -30%;
  //   opacity: 0.1;
  //   transform: rotateX(90deg) scale(0.5) translateY(-50px);
  // }
  // 100% {
  //   top: 0%;
  //   transform: rotate(0deg) scale(1) translateY(0px);
  // }
}
.login {
  background: url("https://anygo-imag.oss-cn-beijing.aliyuncs.com/webImg/bg.png");
  background-size: cover;
  overflow: auto;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  width: 100%;
  height: 100%;
  animation: myfirst 1s;
  // display: flex;
  // align-items: center;
  // justify-content: center;
  .bb {
    z-index: 1111;
    position: fixed;
    top: 1px;
    left: calc(50% - 50px);
    width: 100px;
    text-align: center;
    color: @col_f;
    text-shadow: -1px 0 red, 0 1px red, 1px 0 red, 0 -1px red;
    font-size: 16pt;
    animation: mycont 1s;
  }
  .content {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    background-color: @col_f;
    border-radius: 12px 10px 10px 12px;
    box-shadow: 1px -1px 10px rgba(100, 100, 100, 0.3);
    width: 764px;
    height: 494px;
    display: flex;
    animation: mycont 1s ease-in-out;
    .box-left {
      width: 260px;
      // height: 100%;
      border-radius: 10px 0 0 10px;
      background-color: #36465f;
      color: @col_f;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 80px 0 90px 0;
      padding-left: 52px;
      .logo {
        position: relative;
        user-select: none;
        animation: mycont 1s;
      }
      .infromlogin {
        user-select: none;
        border: 1px solid @col_f;
        // font-size: 18px;
        width: 160px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        border-radius: 4px;
        font-size: 18px;
        position: relative;
        animation: mycont 1s;
        img {
          margin-left: 10px;
        }
      }
    }
    .box-right {
      flex: 1;
      .login-type {
        user-select: none;
        flex: 1;
        padding: 28px 39px 0 0;
        text-align: right;
        color: @col_9;
        span {
          padding-bottom: 5px;
          border-bottom: 1px solid #888;
          cursor: pointer;
          color: #888;
        }
        :hover {
          color: @active;
          border-bottom-color: @active !important;
        }
      }
      .login-qr {
        display: flex;
        flex-direction: column;
        align-items: center;
        div:nth-child(1) {
          // background: @col_9;
          margin-top: 72px;
          // border: 1px solid #999;
          background: #eee;
          width: 230px;
          height: 230px;
        }
        div:nth-child(2) {
          margin-top: 67px;
          height: 17px;
          font-family: MicrosoftYaHei;
          font-size: 16px;
          font-weight: normal;
          font-stretch: normal;
          letter-spacing: 0px;
          color: #333;
        }
      }
      .login-input {
        display: flex;
        flex-direction: column;
        margin: 50px 0 0 82px;
        // font-size: 16px;
        input {
          outline: none;
          border: 0;
          font-size: 18px;
        }
        input::-webkit-input-placeholder {
          color: #646464;
          // font-size: 18px;
        }
        > div:nth-child(1) {
          color: @col_9;
        }
        > div:nth-child(2) {
          position: relative;
          width: 286px;
          padding-bottom: 3px;
          border-bottom: 1px solid @col_9;
          margin-top: 10px;
          display: flex;
          align-items: center;
          img {
            user-select: none;
            margin-right: 10px;
            width: 30px !important;
            height: 30px !important;
            border-radius: 30px;
          }
          input {
            width: 220px;
          }
          i {
            margin-left: 5px;
            // border: 1px solid @col_9;
            color: @col_9;
            font-size: 20px;
            cursor: pointer;
            &:hover {
              color: #333;
            }
          }
          .host-list {
            z-index: 111;
            background: #fff;
            position: absolute;
            left: 0;
            top: 33px;
            width: 284px;
            height: 150px;
            overflow: auto;
            padding: 5px 0;
            border: 1px solid @col_9;
            > div {
              padding: 10px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              user-select: none;
              > div:nth-child(1) {
                display: flex;
                img {
                  width: 40px;
                  height: 40px;
                  border-radius: 30px;
                }
                .host-phone {
                  font-size: 14px;
                  color: #666;
                }
              }
              &:hover {
                background: #ededed;
              }
            }
          }
        }
        > div:nth-child(3) {
          margin-top: 44px;
          color: @col_9;
        }
        > div:nth-child(4) {
          width: 286px;
          padding-bottom: 8px;
          border-bottom: 1px solid @col_9;
          margin-top: 10px;
          display: flex;
          input {
            width: 165px;
            // padding-bottom: 5px;
          }
          .inputBtn {
            position: relative;
            height: 0;
            span {
              user-select: none;
              position: absolute;
              top: -20px;
              // font-size: 95%;
              display: block;
              background: @col_9;
              color: @col_f;
              width: 122px;
              padding: 9.5px 0;
              text-align: center;
              border-radius: 6px;
            }
          }
          .col_click {
            background: @active!important;
            cursor: pointer;
          }
          .col_clicked {
            background: #ccc;
          }
        }
        > div:nth-child(5) {
          margin-top: 68px;
          .el-button {
            width: 284px;
            font-size: 20px;
          }
        }
        .qwei {
          margin-top: 60px;
          display: flex;
          align-items: center;
          font-size: 14px;
          color: #999;
          > div:nth-child(2) {
            flex: 1;
            padding: 0 120px 0 10px;
            display: flex;
            justify-content: space-around;
            img {
              cursor: pointer;
              user-select: none;
            }
          }
        }
      }
    }
  }
}
</style>
