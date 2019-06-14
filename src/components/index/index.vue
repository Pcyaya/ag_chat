<template>
  <div class="index" @click="userShow = false" v-if="share == 1">
    <phonebind v-if="openType" @unbindType="getUnbindType"></phonebind>
    <div v-if="serviceType == 0" class="bb">测试版</div>
    <div class="content" v-show="contentShow">
      <!-- <div class="move">
        <div></div>
      </div> -->
      <div class="box-left">
        <div class="box-left-top">
          <div v-if="baseinfo.icon == '' || baseinfo.icon == null ">
            <img @click="viewBtn(icon.user_icon)" :src="icon.user_icon" alt>
            <div class="baseinfo-headAu" v-if="baseinfo.access_valid == 1">
              <img :src="icon.head_au" alt>
            </div>
          </div>
          <div v-else-if="baseinfo.access_flat >0 || baseinfo.icon.indexOf('http') != -1">
            <img @click="viewBtn(baseinfo.icon)" class="headImg" :src="baseinfo.icon" alt>
            <div class="baseinfo-headAu" v-if="baseinfo.access_valid == 1">
              <img :src="icon.head_au" alt>
            </div>
          </div>
          <div v-else>
            <img
              @click="viewBtn(head_icon+baseinfo.icon)"
              class="headImg"
              :src="head_icon+baseinfo.icon"
              alt
            >
            <div class="baseinfo-headAu" v-if="baseinfo.access_valid == 1">
              <img :src="icon.head_au" alt>
            </div>
          </div>
          <div class="headName" @click.stop="userShow = !userShow">
            <span class="lengthd" :title="baseinfo.name">{{baseinfo.name}}</span>
            <img v-if="baseinfo.name" :src="icon.down" alt>
          </div>
          <div>
            <img :src="icon.borB" alt>
          </div>
        </div>
        <div
          class="box-left-rel"
          v-show="userShow"
          id="user-rel"
          @click.stop="userShow != userShow"
        >
          <div class="firendInfo-box">
            <div>
              <div>
                <img
                  @click="viewBtn(icon.user_icon1)"
                  class="cur"
                  v-if="myInfoData.icon == '' || myInfoData.icon == null"
                  :src="icon.user_icon1"
                  alt
                >
                <img
                  @click="viewBtn(myInfoData.icon)"
                  class="cur"
                  v-else-if="myInfoData.access_flat >0"
                  :src="myInfoData.icon"
                  alt
                >
                <img
                  @click="viewBtn(myInfoData.icon)"
                  class="cur"
                  v-else-if="myInfoData.access_flat >0 || myInfoData.icon.indexOf('http') != -1"
                  :src="myInfoData.icon"
                  alt
                >
                <img
                  @click="viewBtn(head_icon+myInfoData.icon)"
                  class="cur"
                  v-else
                  :src="head_icon+myInfoData.icon"
                  alt
                >
                <div class="baseinfo-headAu" v-if="myInfoData.valid == 1">
                  <img :src="icon.head_au" alt>
                </div>
              </div>
              <div>
                <div>{{myInfoData.name == '' ? myInfoData.num : myInfoData.name}}</div>
                <div>
                  <span>性别</span>
                  {{myInfoData.sex == 0 ? '男' : '女'}}
                </div>
                <div>
                  <span>年龄</span>
                  {{myInfoData.age}}岁 ({{$base.tampToTime(myInfoData.birth,2)}})
                </div>
              </div>
            </div>
            <div>
              <span>手机号</span>
              <div>{{$base.flgNull(myInfoData.phone)}}</div>
            </div>
            <div>
              <span>职业</span>
              <div>{{$base.flgNull(myInfoData.occupation)}}</div>
            </div>
            <div>
              <span>地区</span>
              <div>{{$base.flgNull(myInfoData.address)}}</div>
            </div>
            <div class="fx_rel">
              <div>
                <img v-show="1" title="发送消息" @mouseover="msgdown" @mouseout="msgup" :src="icon.msg_del" alt="">
                <img class="-mob-share-open" @mouseover="sharedown" @mouseout="shareup" @click="GetShare" title="分享名片" :src="icon.share_del" alt="">
              </div>
            </div>
          </div>
        </div>
        <div class="box-left-center">
          <div>
            <router-link to="/msg">
              <div>
                <img :src="icon.msg" alt>
              </div>
              <el-badge :is-dot="newAll" class="item">消息</el-badge>
            </router-link>
          </div>
          <div>
            <router-link to="/trip">
              <div>
                <img :src="icon.arrange" alt>
              </div>
              <span>行程安排</span>
            </router-link>
          </div>
          <div>
            <router-link to="/notice">
              <div>
                <img :src="icon.notice" alt>
              </div>
              <span>游团通知</span>
            </router-link>
          </div>
          <div>
            <router-link to="/travel">
              <div>
                <img :src="icon.youji" alt>
              </div>
              <span>游记</span>
            </router-link>
          </div>
          <div>
            <router-link to="/evaluation">
              <div>
                <img :src="icon.evaluation" alt>
              </div>
              <span>评价</span>
            </router-link>
          </div>
          <div></div>
        </div>
        <div>
          <img :src="icon.borB" alt>
        </div>
        <div class="box-left-footer">
          <div @click="settingBtn" class="setting">
            <div>
              <img :src="icon.setting" alt>
            </div>
            <span>设置</span>
          </div>
        </div>
      </div>
      <div class="box-right">
        <msg
          v-show="routeName == 'msg' || routeName == 'MSG'"
          @say="onSay"
          :enterType="enterD"
          :exitType="exitD"
          :routeNav="routeName"
        ></msg>
        <trip v-show="routeName == 'trip'" :routeNav="routeName"></trip>
        <notice v-show="routeName == 'notice'" :routeNav="routeName"></notice>
        <travel v-show="routeName == 'travel'" :routeNav="routeName"></travel>
        <evaluation v-show="routeName == 'evaluation'" :routeNav="routeName"></evaluation>
        <unbind v-show="routeName == 'unbind'"></unbind>

        <!-- <msg v-if="routeName == 'msg'" @say='onSay'></msg>
                <trip v-if="routeName == 'trip'"></trip>
                <notice v-if="routeName == 'notice'"></notice>
        <travel v-if="routeName == 'travel'"></travel>-->
        <!-- <router-view :enterType="enterD" :exitType="exitD" :routeNav='routeName' @say='onSay' /> -->
      </div>
    </div>
    <div class="dialogs">
      <div class="setting">
        <el-dialog :visible.sync="dialogVisible.setting">
          <div class="setting-top top">
            <div>设置</div>
            <div class="cur" @click="dialogVisible.setting = false"><img :src="icon.close_div" alt=""></div>
          </div>
          <div class="setting-content">
            <div class="setting-content-left">
              <div :class="{'col_act':setting_type == 0}" @click="setting_type = 0">
                <div><img v-if="setting_type == 0" :src="icon.account_select" alt=""><img v-else :src="icon.account_" alt=""></div>
                <div>账号设置</div>
              </div>
              <div :class="{'col_act':setting_type == 1}" @click="setting_type = 1">
                <div><img v-if="setting_type == 1" :src="icon.privacy_select" alt=""><img v-else :src="icon.privacy_" alt=""></div>
                <div>隐私设置</div>
              </div>
              <div :class="{'col_act':setting_type == 2}" @click="setting_type = 2">
                <div><img v-if="setting_type == 2" :src="icon.problem_select" alt=""><img v-else :src="icon.problem_" alt=""></div>
                <div>问题反馈</div>
              </div>
              <div :class="{'col_act':setting_type == 3}" @click="setting_type = 3">
                <div><img v-if="setting_type == 3" :src="icon.about_select" alt=""><img v-else :src="icon.about_" alt=""></div>
                <div>关于艾侗游</div>
              </div>
            </div>
            <div class="setting-content-right">
              <div class="right-account" :class="{'opa1':setting_type == 0}" v-show="setting_type == 0">
                <div>
                  <div v-if="baseinfo.access_flat<0" class="account-bind">
                    <div>手机号：</div>
                    <div>
                      <div>
                        <img :src="icon.phonenumber" alt>
                        {{baseinfo.access_phone}}
                      </div>
                      <div>
                        <el-button @click="dialogVisible.set_phone = true" size="mini" type="primary">更换手机号</el-button>
                      </div>
                    </div>
                    <div>第三方账号</div>
                    <div>
                      <div>
                        <img :src="icon.aetosgo_logo" alt="">
                        <img :src="icon.icon_change" alt="">
                        <img :src="icon.wechat_logo" alt="">
                      </div>
                      <div>
                        <div v-if="provinfo[0].flg == 1" @click="GetUnbindPhone(0)">{{provinfo[0].name}} <i class="el-icon-arrow-right"></i></div>
                        <el-button v-else @click="GetBindPhone(1)" size="mini" type="primary">绑定微信</el-button>
                      </div>
                    </div>
                    <div>
                      <div>
                        <img :src="icon.aetosgo_logo" alt="">
                        <img :src="icon.icon_change" alt="">
                        <img :src="icon.qq_logo" alt="">
                      </div>
                      <div>
                        <div v-if="provinfo[1].flg == 1" @click="GetUnbindPhone(1)">{{provinfo[1].name}} <i class="el-icon-arrow-right"></i></div>
                        <el-button v-else @click="GetBindPhone(2)" size="mini" type="primary">绑定QQ</el-button>
                      </div>
                    </div>
                  </div>
                  <div v-else class="setting-unbind">
                    绑定手机号才能获取更多操作哦！
                  </div>
                  <div class="setting-exit">
                    <span @click="exitBtn">退出登录</span>
                  </div>
                </div>
              </div>
              <div class="right-privacy" :class="{'opa1':setting_type == 1}" v-show="setting_type == 1">
                <div v-if="baseinfo.access_flat<0" class="privacy-bind">
                  <div>谁能查看我的手机号</div>
                  <div class="radiodiv">
                    <div>所有人</div>
                    <el-radio v-model="settingsData.rvs_phone" :label="2">&nbsp;</el-radio>
                  </div>
                  <div class="radiodiv">
                    <div>只有侗友</div>
                    <el-radio v-model="settingsData.rvs_phone" :label="1">&nbsp;</el-radio>
                  </div>
                  <div class="radiodiv">
                    <div>不允许任何人查看</div>
                    <el-radio v-model="settingsData.rvs_phone" :label="0">&nbsp;</el-radio>
                  </div>
                </div>
                <div v-else class="setting-unbind">
                  绑定手机号才能获取更多操作哦！
                </div>
              </div>
              <div class="right-problem" :class="{'opa1':setting_type == 2}" v-show="setting_type == 2">
                <div v-if="baseinfo.access_flat<0" class="problem-bind">
                  <div>
                    <div>问题类型</div>
                    <div>
                      <el-radio v-model="problemType" :label="1">音响</el-radio>
                      <el-radio v-model="problemType" :label="2">软件</el-radio>
                      <el-radio v-model="problemType" :label="3">建议</el-radio>
                    </div>
                  </div>
                  <div>
                    <el-input
                      type="textarea"
                      maxlength="500"
                      v-model="issue"
                      placeholder="请填写反馈内容！"
                    ></el-input>
                  </div>
                  <div>
                    <el-button type="primary" size="mini" @click="GetFreeback">确定</el-button>
                  </div>
                </div>
                <div v-else class="setting-unbind">
                  绑定手机号才能获取更多操作哦！
                </div>
              </div>
              <div class="right-about" :class="{'opa1':setting_type == 3}" v-show="setting_type == 3">
                <div class="about-tit">版本信息</div>
                <div>艾侗游1.0.1</div>
                <div class="about-tit">艾侗游官网</div>
                <div>
                  <span @click="aetosgo">{{homeHost}}</span>
                </div>
              </div>
            </div>
          </div>
        </el-dialog>
      </div>
      <div class="set_phone">
        <el-dialog :visible.sync="dialogVisible.set_phone">
          <div class="set_phone_box">
            <div>
              <el-steps :active="setPhoneActive" finish-status="success">
                <el-step title="步骤 1"></el-step>
                <el-step title="步骤 2"></el-step>
                <el-step title="步骤 3"></el-step>
              </el-steps>
            </div>
            <div>
              <div v-if="setPhoneActive == 1" class="active1">
                <div>
                  <el-input placeholder="请输入原绑定手机号！" v-model="setPhone.old.phone"></el-input>
                </div>
                <div>
                  <el-input class="oldPhone" placeholder="验证码" v-model="setPhone.old.code"></el-input>
                  <span
                    class="cur"
                    v-if="!sendMsgDisabled1"
                    @click="getcode(setPhone.old.phone,'sendMsgDisabled1','time1')"
                  >获取验证码</span>
                  <span style="cursor:not-allowed" v-else>重新获取({{time1}})</span>
                </div>
                <div>
                  <el-button @click="next(setPhone.old.phone, setPhone.old.code)" type="primary">下一步</el-button>
                </div>
              </div>
              <div v-if="setPhoneActive == 2" class="active2">
                <div>
                  <el-input placeholder="请输入需要绑定手机号！" v-model="setPhone.new.phone"></el-input>
                </div>
                <div>
                  <el-input class="newPhone" placeholder="验证码" v-model="setPhone.new.code"></el-input>
                  <span
                    class="cur"
                    v-if="!sendMsgDisabled2"
                    @click="getcode(setPhone.new.phone,'sendMsgDisabled2','time2')"
                  >获取验证码</span>
                  <span style="cursor:not-allowed" v-else>重新获取({{time2}})</span>
                </div>
                <div>
                  <el-button @click="pre">上一步</el-button>
                  <el-button
                    @click="next(setPhone.new.phone, setPhone.new.code, setPhone.old.code)"
                    type="primary"
                  >下一步</el-button>
                </div>
              </div>
              <div v-if="setPhoneActive == 3" class="active3">
                <div>
                  <div>
                    <i class="el-icon-success"></i>
                  </div>
                  <div>修改成功！</div>
                </div>
                <div>
                  <el-button type="primary" @click="okBtn">完成</el-button>
                </div>
              </div>
            </div>
          </div>
        </el-dialog>
      </div>
    </div>
    <div
      class="-mob-share-ui -mob-share-ui-theme -mob-share-ui-theme-slide-right"
      style="display: none"
       @click.stop="userShow = true"
    >
      <ul class="-mob-share-list">
        <li class="-mob-share-weibo" style="background-image: url(https://anygo-imag.oss-cn-beijing.aliyuncs.com/webImg/icon_microblog.png)">
          <p>新浪微博</p>
        </li>
        <li class="-mob-share-qq" style="background-image: url(https://anygo-imag.oss-cn-beijing.aliyuncs.com/webImg/icon_qq.png)">
          <p>QQ好友</p>
        </li>
        <li class="-mob-share-weixin" style="background-image: url(https://anygo-imag.oss-cn-beijing.aliyuncs.com/webImg/icon_wechat.png)">
          <p>微信</p>
        </li>
      </ul>
      <div class="-mob-share-close">取消</div>
    </div>
    <div class="-mob-share-ui-bg" @click.stop="userShow = true"></div>

    <viewimg v-if="imgType" :imgurl="imgurlList" @typeBy="typeBy"></viewimg>
  </div>
</template>

<script>
import msg from "./msg/msg";
import trip from "./trip/trip";
import notice from "./notice/notice";
import travel from "./travel/travel";
import evaluation from "./evaluation/evaluation";
import unbind from "./unbind/unbind";
import phonebind from "./../phonebind/phonebind";
import viewimg from "./../viewimg/viewimg"

export default {
  data() {
    return {
      icon: {
        user_icon: this.OSSIMG + "icon_tongyou_head.png",
        user_icon1: this.OSSIMG + "icon_personal_head.png",
        head_au: this.OSSIMG + "icon_youji_head_au.png",
        down: this.OSSIMG + "icon_down.png",
        msg: this.OSSIMG + "icon_message.png",
        arrange: this.OSSIMG + "icon_arrange.png",
        notice: this.OSSIMG + "icon_notice1.png",
        youji: this.OSSIMG + "icon_youji.png",
        evaluation: this.OSSIMG + "icon_evaluation.png",
        setting: this.OSSIMG + "icon_setting.png",
        borB: this.OSSIMG + "icon_divider.png",
        edit: this.OSSIMG + "icon_editor_default.png",
        share: this.OSSIMG + "icon_share_default.png",
        exit: this.OSSIMG + "icon_exit_default.png",
        sex0: this.OSSIMG + "icon_boy.png",
        sex1: this.OSSIMG + "icon_girl.png",
        phonenumber: this.OSSIMG + "icon_phonenumber_select.png",
        select_basicset: this.OSSIMG + "icon_select_basicset.png",
        unselect_basicset: this.OSSIMG + "icon_unselect_basicset.png",
        save_default: this.OSSIMG + "icon_save_default.png",
        save_click: this.OSSIMG + "icon_save_click.png",
        share_del: this.OSSIMG + "icon_share_del.png",
        share_click: this.OSSIMG + "icon_share_click.png",
        msg_del: this.OSSIMG + "icon_message1_del.png",
        msg_click: this.OSSIMG + "icon_message1_del.png",
        close_div: this.OSSIMG + "delete.png",
        aetosgo_logo: this.OSSIMG + "aetosgo_logo.png",
        icon_change: this.OSSIMG + "icon_change.png",
        about_: this.OSSIMG + "icon_about_setting.png",
        about_select: this.OSSIMG + "icon_about_setting_select.png",
        account_: this.OSSIMG + "icon_account_setting.png",
        account_select: this.OSSIMG + "icon_account_setting_select.png",
        privacy_: this.OSSIMG + "icon_privacy_setting.png",
        privacy_select: this.OSSIMG + "icon_privacy_setting_select.png",
        problem_: this.OSSIMG + "icon_problem_setting.png",
        problem_select: this.OSSIMG + "icon_problem_setting_select.png",
        qq_logo: this.OSSIMG + "qq_logo.png",
        wechat_logo: this.OSSIMG + "wechat_logo.png",
      },
      setting_type: 0,
      openType: false, //绑定手机状态
      loginVisitor: {}, //登录信息
      baseinfo: {}, //游客基本信息
      provinfo: [{ flg: 0 }, { flg: 0 }], //第三方账号信息
      myInfoData: {}, //个人资料
      current: 0,
      userShow: false, //用户信息
      newAll: false,
      len: "",
      routeName: "",
      routeNum: "",
      dialogVisible: {
        setting: false,
        set_phone: false,
        editInfo: false,
      },
      activeName: 0,
      viewPhone: 0,
      enterD: 0,
      exitD: "0",
      settingsData: {}, //游客基本信息
      issue: "", //问题反馈
      problemType: 2,
      setPhoneActive: 1,
      setPhone: {
        old: {
          phone: "",
          code: ""
        },
        new: {
          phone: "",
          code: ""
        }
      },
      sexD: [
        {
          id: 0,
          val: "男"
        },
        {
          id: 1,
          val: "女"
        }
      ],
      sendMsgDisabled1: false,
      sendMsgDisabled2: false,
      time1: 60,
      time2: 60,
      keymap: {},
      imgType: false,
      imgurlList: [],
      share: 0,
      imgUrl: "https://anygo-imag.oss-cn-beijing.aliyuncs.com/webImg/bg.png",
      contentShow: false,
    };
  },
  created() {
    this.share = localStorage.getItem("share");
    if (this.share == 0) {
      localStorage.setItem("share", "1");
      this.$router.go(0);
    }
  },
  mounted() {
    this.loadImg();
    let indexNewMsg = localStorage.getItem("indexNewMsg");
    this.routeName = this.$router.history.current.name;
    if (indexNewMsg == null) {
      this.newAll = false;
    } else {
      this.newAll = JSON.parse(indexNewMsg);
    }
    this.getInfo();
    this.moveDiv();
  },
  watch: {
    $route() {
      this.routeName = this.$router.history.current.name;
      // if(this.routeName == 'unbind' && this.baseinfo.access_flat<0){
      //   this.routeName = 'msg'
      // }
      // localStorage.setItem("indexNav", this.routeName);
      // console.log(this.routeName)
    },
    "dialogVisible.setting"() {
      if (this.dialogVisible.setting == false) {
        // this.activeName = 0
      }
      setTimeout(() => {
        this.moveSetting("setting");
      }, 0);
    },
    enterD() {
      // if (this.enterD == 0) {
      //   this.GetKeyEnter(0);
      // } else if (this.enterD == 1) {
      //   this.GetKeyEnter(1);
      // }
    },
    "settingsData.rvs_phone"() {
      this.GetPhone(this.settingsData.rvs_phone);
    },
    "dialogVisible.set_phone"() {
      // console.log(this.setPhoneActive)
      if (this.setPhoneActive == 3) {
        this.setPhoneActive = 1;
        this.setPhone = {
          old: {
            phone: this.baseinfo.access_phone,
            code: ""
          },
          new: {
            phone: "",
            code: ""
          }
        };
      }
    }
    // 'dialogVisible.editInfo'() {
    //     if(this.dialogVisible.editInfo == false){
    //         this.GetMyInfo()
    //     }
    // }
  },
  components: {
    msg,
    trip,
    notice,
    travel,
    evaluation,
    unbind,
    phonebind,
    viewimg
  },
  methods: {
    loadImg() {
      let bgImg = new Image();
      bgImg.src = this.imgUrl;
      bgImg.onerror = ()=> {
        console.log('img error');
      }
      bgImg.onload = () => {
        this.contentShow = true;
      }
    },
    //子组件传参
    getUnbindType(flg) {
      // console.log(flg)
      this.openType = flg;
    },
    typeBy(t) {
      this.imgType = t;
    },
    viewBtn(data, index, url) {
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
    onSay(ev) {
      // console.log("ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ"+ev)
      this.len = ev;
      if (ev > 0) {
        this.newAll = true;
      } else {
        this.newAll = false;
      }
      localStorage.setItem("indexNewMsg", this.newAll);
    },
    moveDiv() {
      let _move = false; //移动标记
      let _x, _y; //鼠标离控件左上角的相对位置
      $(".move")
        .click(function() {})
        .mousedown(function(e) {
          _move = true;
          _x = e.pageX - parseInt($(".content").css("left"));
          _y = e.pageY - parseInt($(".content").css("top"));
          // $(".content").fadeTo(20, 0.9);//点击后开始拖动并透明显示
        });
      $(document)
        .mousemove(function(e) {
          if (_move) {
            let x = e.pageX - _x; //移动时根据鼠标位置计算控件左上角的绝对位置
            let y = e.pageY - _y;
            $(".content").css({ top: y, left: x }); //控件新位置
          }
        })
        .mouseup(function() {
          _move = false;
          $(".content").fadeTo("fast", 1); //松开鼠标后停止移动并恢复成不透明
        });
    },
    moveSetting(dom) {
      let _move = false; //移动标记
      let _x, _y; //鼠标离控件左上角的相对位置
      $("." + dom + " .el-dialog .top")
        .click(function() {})
        .mousedown(function(e) {
          _move = true;
          _x = e.pageX - parseInt($("." + dom + " .el-dialog").css("left"));
          _y = e.pageY - parseInt($("." + dom + " .el-dialog").css("top"));
        });
      $(document)
        .mousemove(function(e) {
          if (_move) {
            let x = e.pageX - _x; //移动时根据鼠标位置计算控件左上角的绝对位置
            let y = e.pageY - _y;
            $("." + dom + " .el-dialog").css({ top: y, left: x }); //控件新位置
          }
        })
        .mouseup(function() {
          _move = false;
          $("." + dom + " .el-dialog").fadeTo("fast", 1); //松开鼠标后停止移动并恢复成不透明
        });
    },
    //获取用户信息
    getInfo() {
      const that = this;
      let loginVisitor = localStorage.getItem("loginVisitor");
      if (loginVisitor == "" || loginVisitor == null) {
        that.$message({
          message: "登录超时，请重新登录！",
          type: "error"
        });
        // localStorage.clear()
        localStorage.setItem("loginVisitor", "");
        that.$router.push({
          path: "/"
        });
      } else {
        that.loginVisitor = JSON.parse(loginVisitor);
        $.ajax({
          url: that.urlHost + "visitor/baseinfo",
          type: "post",
          data: { access_token: that.loginVisitor.access_token },
          dataType: "json",
          success: res => {
            if (res.success === "00000000") {
              localStorage.setItem("baseinfo", JSON.stringify(res.obj));
              that.baseinfo = res.obj;
              if (this.baseinfo.access_flat < 0) {
                that.getProvInfo();
                // that.GetKeyMap();
                that.GetMyInfo();
              }
            } else {
              that.$base.err(res, that);
            }
          },
          error: err => {
            console.error(err);
          }
        });
      }
    },
    //绑定成功从新登陆弹出
    bingSettingOpen() {
      var settingopen = localStorage.getItem("settingOpen");
      if (settingopen == 1) {
        this.dialogVisible.setting = true;
        this.activeName = settingopen;
        localStorage.setItem("settingOpen", 0);
      }
    },
    //第三方账号信息
    getProvInfo() {
      const that = this;
      $.ajax({
        url: that.urlHost + "visitor/provisionals",
        type: "post",
        data: { access_token: that.loginVisitor.access_token },
        dataType: "json",
        success: res => {
          if (res.success === "00000000") {
            that.provinfo = res.obj;
            that.bingSettingOpen();
          } else {
            that.$base.err(res, that);
          }
        },
        error: err => {
          console.error(err);
        }
      });
    },
    //绑定第三方账号
    GetBindPhone(type) {
      this.qqLogin(type);
      // console.log(this.routeName)
    },
    //解绑第三方账号
    GetUnbindPhone(type) {
      const that = this;
      const typeName = type == 0 ? "微信" : "QQ";
      that
        .$confirm("确认是否解除" + typeName + "绑定？", "提示", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          $.ajax({
            url: that.urlHost + "visitor/provisional/unbind",
            type: "post",
            data: {
              access_token: that.loginVisitor.access_token,
              id: that.provinfo[type].id
            },
            dataType: "json",
            success: res => {
              if (res.success === "00000000") {
                that.$message.success(res.msg);
                that.getProvInfo();
              } else {
                that.$base.err(res, that);
              }
            },
            error: err => {
              console.error(err);
            }
          });
        })
        .catch(() => {});
    },

    //登录   1->微信登录 2->QQ登录
    qqLogin(type) {
      if (this.serviceType == 0) {
        this.qqQuery = {
          client_id: "101551468",
          redirect_uri: "http://www.aetosgo.com:8080/chat",
          // redirect_uri: "http://192.168.1.67/chat",
          client_secret: "e279b4f209995ad1d5fd14714cfae194"
        };
        this.wxQuery = {
          appid: "wxee454b0600602b4e",
          redirect_uri: "http://www.aetosgo.com:8080/chat",
          // redirect_uri: "http://192.168.1.67/chat",
          secret: "5096d3e165e183ccd0170164dd2c5282"
        };
        if (window.location.href.indexOf(".com") != -1) {
          this.qqQuery.redirect_uri = "http://www.aetosgo.com:8080/chat";
          this.wxQuery.redirect_uri = "http://www.aetosgo.com:8080/chat";
        } else {
          this.qqQuery.redirect_uri = "http://192.168.1.67/chat";
          this.wxQuery.redirect_uri = "http://192.168.1.67/chat";
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
      if (type === 1) {
        window.location.href =
          "https://open.weixin.qq.com/connect/qrconnect?appid=" +
          this.wxQuery.appid +
          "&redirect_uri=" +
          this.wxQuery.redirect_uri +
          "&response_type=code&scope=snsapi_login&state=11#wechat_redirect";
      } else if (type === 2) {
        window.location.href =
          "https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=" +
          this.qqQuery.client_id +
          "&redirect_uri=" +
          this.qqQuery.redirect_uri +
          "&state=12&scope=get_user_info,list_album,upload_pic,do_like";
      }
    },
    //查看个人资料（自身）
    GetMyInfo() {
      const that = this;
      // if(that.userShow){
      //   that.userShow = false;
      // }else {
      //   that.userShow = true;
      // }
      // setTimeout(() => {
      //   that.userShow = true;
      // }, 10);
      $.ajax({
        url: that.urlHost + "visitor/info",
        type: "post",
        data: { access_token: that.loginVisitor.access_token },
        dataType: "json",
        success: res => {
          if (res.success === "00000000") {
            that.myInfoData = res.obj;
          } else {
            that.$base.err(res, that);
          }
        },
        error: err => {
          console.error(err);
        }
      });
    },
    //鼠标按下
    editDown() {
      this.icon.save_default = this.OSSIMG + "icon_save_click.png";
    },
    //鼠标抬起
    editUp() {
      this.icon.save_default = this.OSSIMG + "icon_save_default.png";
    },
    //清空聊天记录
    clearMsg() {
      this.$confirm("是否清空所有记录？", "提示").then(() => {
        localStorage.setItem("messages", "{}");
        // console.log(this.routeName)
        if (this.routeName == "MSG") {
          this.routeName = "msg";
        } else {
          this.routeName = "MSG";
        }
      });
    },
    // 退出登录
    exitBtn() {
      this.$confirm("确认是否退出？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // localStorage.clear()
          this.exitD = "1";
          setTimeout(() => {
            localStorage.setItem("loginVisitor", "");
            localStorage.setItem("baseinfo", "{}");
            this.$router.push({
              path: "/"
            });
          }, 300);
        })
        .catch(() => {
          // this.exitD = "1";
        });
    },
    //游客设置信息
    GetSettings() {
      const that = this;
      $.ajax({
        url: this.urlHost + "visitor/settings",
        type: "post",
        data: { access_token: this.loginVisitor.access_token },
        dataType: "json",
        success: res => {
          if (res.success === "00000000") {
            // console.log(res)
            this.settingsData = res.obj;
            // this.GetKeyMap();
          } else {
            this.$base.err(res, this);
          }
        },
        error: err => {
          console.error(err);
        }
      });
    },
    //设置陌生人发消息  0->禁止 1->允许
    GetMsr(type) {
      const that = this;
      $.ajax({
        url: this.urlHost + "visitor/setting/forbidden",
        type: "post",
        data: { access_token: this.loginVisitor.access_token, right_flg: type },
        dataType: "json",
        success: res => {
          if (res.success === "00000000") {
            this.GetSettings();
          } else {
            this.$base.err(res, this);
          }
        },
        error: err => {
          console.error(err);
        }
      });
    },
    //手机权限 0->不允许任何人  1->侗友 2->所有人
    GetPhone(type) {
      const that = this;
      $.ajax({
        url: this.urlHost + "visitor/setting/phone",
        type: "post",
        data: { access_token: this.loginVisitor.access_token, right_flg: type },
        dataType: "json",
        success: res => {
          if (res.success === "00000000") {
            this.GetSettings();
          } else {
            this.$base.err(res, this);
          }
        },
        error: err => {
          console.error(err);
        }
      });
    },
    //问题反馈
    GetFreeback() {
      const that = this;
      if ($.trim(this.issue) == "") {
        this.$message({
          message: "反馈内容不可为空！",
          type: "error",
          center: true
        });
      } else {
        $.ajax({
          url: this.urlHost + "freeback/issue",
          type: "post",
          data: {
            access_token: this.loginVisitor.access_token,
            type: this.problemType,
            content: this.issue
          },
          dataType: "json",
          success: res => {
            if (res.success === "00000000") {
              this.$message({
                message: "发送成功，我们会尽快解决您的问题的，谢谢！",
                type: "success",
                center: true
              });
              this.issue = "";
            } else {
              this.$base.err(res, this);
            }
          },
          error: err => {
            console.error(err);
          }
        });
      }
    },
    aetosgo() {
      window.open(this.homeHost);
    },
    // 鼠标移入移除效果
    msgdown() {
      this.icon.msg_del = this.OSSIMG + "icon_message1_click.png";
    },
    msgup() {
      this.icon.msg_del = this.OSSIMG + "icon_message1_del.png";
    },
    sharedown() {
      this.icon.share_del = this.OSSIMG + "icon_share_click.png";
    },
    shareup() {
      this.icon.share_del = this.OSSIMG + "icon_share_del.png";
    },
    exitover() {
      this.icon.exit = this.OSSIMG + "icon_exit__hover.png";
    },
    exitout() {
      this.icon.exit = this.OSSIMG + "icon_exit_default.png";
    },
    //设置
    settingBtn() {
      this.dialogVisible.setting = true;
      if (this.baseinfo.access_flat < 0) {
        this.setPhone.old.phone = this.baseinfo.access_phone;
        this.GetSettings();
      }
    },
    next(phone, code, pcode) {
      const that = this;
      // console.log(phone+'~'+code+'~'+pcode)
      if (pcode == undefined) {
        if (this.phoneRE(phone)) {
          if (code == "") {
            that.$message({
              message: "请输入验证码",
              type: "error"
            });
          } else {
            $.ajax({
              url: this.urlHost + "/visitor/phone",
              type: "post",
              data: {
                access_token: this.loginVisitor.access_token,
                phone: phone,
                code: code
              },
              dataType: "json",
              success: res => {
                // console.log(JSON.stringify(res));
                if (res.success === "00000000") {
                  that.$message({
                    message: "验证成功！",
                    type: "success"
                  });
                  that.setPhoneActive++;
                } else {
                  this.$base.err(res, this);
                }
              },
              error: function(err) {
                console.log("失败" + "====>" + JSON.stringify(err));
              }
            });
          }
        }
      } else {
        if (this.phoneRE(phone)) {
          if (code == "") {
            that.$message({
              message: "请输入验证码",
              type: "error"
            });
          } else {
            $.ajax({
              url: this.urlHost + "/visitor/phone",
              type: "post",
              data: {
                access_token: this.loginVisitor.access_token,
                phone: phone,
                code: code,
                pcode: pcode
              },
              dataType: "json",
              success: res => {
                // console.log(JSON.stringify(data));
                if (res.success === "00000000") {
                  that.$message({
                    message: "验证成功！",
                    type: "success"
                  });
                  that.setPhoneActive++;
                  that.getInfo();
                  that.time1 = 60;
                  that.time2 = 60;
                  that.sendMsgDisabled1 = false;
                  that.sendMsgDisabled2 = false;
                } else {
                  this.$base.err(res, this);
                }
              },
              error: function(err) {
                console.log("失败" + "====>" + JSON.stringify(err));
              }
            });
          }
        }
      }
    },
    pre() {
      this.setPhoneActive--;
    },
    okBtn() {
      this.dialogVisible.set_phone = false;
      this.setPhone = {
        old: {
          phone: this.baseinfo.access_phone,
          code: ""
        },
        new: {
          phone: "",
          code: ""
        }
      };
      setTimeout(() => {
        this.setPhoneActive = 1;
      }, 300);
    },
    //手机验证
    phoneRE(phone) {
      const re = /^1[3578]\d{9}$/;
      if (phone === "") {
        this.$message({
          message: "请输入手机号!",
          type: "error"
        });
      } else if (!re.test(phone)) {
        this.$message({
          message: "请输入正确的手机号!",
          type: "error"
        });
      } else {
        return true;
      }
    },
    //获取验证码
    getcode(phone, type, time) {
      const that = this;
      let business;
      if (this.phoneRE(phone)) {
        if (time == "time1") {
          //解绑
          business = 1;
        } else {
          //绑定
          business = 2;
        }
        //    console.log(business)
        $.ajax({
          url: this.urlHost + "/visitor/phone/code",
          type: "post",
          data: {
            access_token: this.loginVisitor.access_token,
            phone: phone,
            business: business
          },
          dataType: "json",
          success: res => {
            // console.log(JSON.stringify(data));
            if (res.success === "00000000") {
              that.$message({
                message: "验证码已发送至您的手机!",
                type: "success"
              });
              that.send(type, time);
              if (business == 1) {
                $(".oldPhone input").focus();
              } else {
                $(".newPhone input").focus();
              }
            } else {
              console.log(res);
              this.$base.err(res, this);
            }
          },
          error: function(err) {
            console.log("失败" + "====>" + JSON.stringify(err));
          }
        });
      }
    },
    //验证码计时
    send(type, time) {
      let me = this;
      me[type] = true;
      let interval = window.setInterval(function() {
        if (me[time]-- <= 0) {
          me[time] = 60;
          me[type] = false;
          window.clearInterval(interval);
        }
      }, 1000);
    },
    //分享
    GetShare() {
      const that = this;
      let qr = {
        num: this.baseinfo.access_num,
        tag: 2
      };
      // let url = this.baseinfo.namecard+'?qr='+JSON.stringify(qr)
      var url =
        this.baseinfo.namecard +
        "?qr=%7B%22num%22%3A%22" +
        this.baseinfo.access_num +
        "%22,%22tag%22%3A2%7D";
      window.mobShare.config({
        debug: true,
        appkey: "cf386a73cf567c60246f076248675192",
        params: {
          url: url,
          title: "艾侗游-个人名片",
          // description: '个人分享',
          reason: "",
          pic: "https://anygo-imag.oss-cn-beijing.aliyuncs.com/share/share.jpg",
          backgroundColor: "#fff"
        },
        callback: function(plat, params) {
          // console.log('params~~~~',params)
        }
      });
    },
    //快捷键
    GetKeyMap() {
      const that = this;
      $.ajax({
        url: this.urlHost + "keymap/value",
        type: "post",
        data: {
          access_token: this.loginVisitor.access_token,
          key: "key_map_00000"
        },
        dataType: "json",
        success: res => {
          if (res.success === "00000000") {
            // console.log(data)
            that.keymap = res.obj;
            that.$forceUpdate();
            if (res.obj.val == "13") {
              that.enterD = 0;
            } else {
              that.enterD = 1;
            }
          } else {
            this.$base.err(res, this);
          }
        },
        error: function(err) {
          console.log("失败" + "====>" + JSON.stringify(err));
        }
      });
    },
    //设置快捷键enter
    GetKeyEnter(type) {
      const that = this;
      if (type == 0) {
        $.ajax({
          url: this.urlHost + "/keymap/issue",
          type: "post",
          data: {
            access_token: this.loginVisitor.access_token,
            key: "key_map_00000",
            val: "13"
          },
          dataType: "json",
          success: res => {
            if (res.success === "00000000") {
              // console.log(res)
              // that.keymap = res.obj
            } else {
              this.$base.err(res, this);
            }
          },
          error: function(err) {
            console.log("失败" + "====>" + JSON.stringify(err));
          }
        });
      } else if (type == 1) {
        $.ajax({
          url: this.urlHost + "/keymap/issue",
          type: "post",
          data: {
            access_token: this.loginVisitor.access_token,
            key: "key_map_00000",
            val: "ctrl",
            val1: "13"
          },
          dataType: "json",
          success: res => {
            if (res.success === "00000000") {
              // console.log(res)
              // that.keymap = res.obj
            } else {
              this.$base.err(res, this);
            }
          },
          error: function(err) {
            console.log("失败" + "====>" + JSON.stringify(err));
          }
        });
      }
    }
  }
};
</script>

<style lang="less">
// @import "./../../../node_modules/swiper/dist/css/swiper.css";
@col_f: #fff;
@col_9: #999;

@keyframes myfirst {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes mycont {
  from {
    transform: rotateX(90deg) scale(0) translateY(-50px);
  }
  to {
    transform: rotate(0deg) scale(1) translateY(0px);
  }
}
@media (max-width: 950px)  {
  .content{
    max-height: 100%!important;
    height: 100%!important;
    margin: 0!important;
    left: 0!important;
    border-radius: 0!important;
    // transform: all .3s;
  }
  .box-left{
    border-radius: 0!important;
  }
}
.index {
  background: url("https://anygo-imag.oss-cn-beijing.aliyuncs.com/webImg/bg.png");
  background-size: cover;
  overflow: auto;
  position: absolute;
  width: 100%;
  height: 100%;
  animation: myfirst 1s;
  // display: flex;
  // align-items: center;
  // justify-content: center;
  .bb {
    z-index: 111111;
    position: fixed;
    top: 1px;
    left: calc(50% - 50px);
    width: 100px;
    text-align: center;
    color: #fff;
    text-shadow: -1px 0 red, 0 1px red, 1px 0 red, 0 -1px red;
    font-size: 16pt;
  }
  .content {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    // display: flex;
    // flex-direction: column;
    // justify-content: center;
    // align-items: center;
    background-color: @col_f;
    border-radius: 8px;
    box-shadow: 1px -1px 10px rgba(100, 100, 100, 0.3);
    max-width: 1168px;
    min-width: 920px;
    min-height: 630px;
    max-height: 756px;
    display: flex;
    animation: mycont 0.5s;
    transition: all .3s;
    .move {
      position: relative;
      width: 0;
      height: 0;
      div {
        z-index: -1;
        position: absolute;
        width: 850px;
        height: 43px;
        cursor: move;
      }
    }
    .box-left {
      background: #36465f;
      color: #fff;
      width: 164px;
      height: 100%;
      border-radius: 8px 0 0 8px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      user-select: none; //禁止选中
      .box-left-top {
        height: 170px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .headImg {
          z-index: 2;
          position: relative;
          width: 42px;
          height: 42px;
          border-radius: 4px;
          cursor: pointer;
        }
        .headName {
          margin-top: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          span {
            margin-right: 10px;
            max-width: 100px;
            text-align: center;
          }
          &:hover {
            color: #efefef;
          }
        }
        .baseinfo-headAu {
          position: relative;
          width: 0;
          height: 0;
          img {
            z-index: 3;
            position: absolute;
            top: -20px;
            left: 25px;
            width: 15px;
            border: 3px solid #36465f;
            border-radius: 50px;
          }
        }
      }
      .box-left-rel {
        position: relative;
        width: 0;
        height: 0;
        user-select: auto;
        .firendInfo-box {
          z-index: 1112;
          background: #fff;
          color: #666;
          font-size: 16px;
          position: absolute;
          top: -100px;
          left: 100px;
          width: 310px;
          border-radius: 4px;
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
          // display: flex;
          animation: mycont .3s;
          &:hover .fx_rel > div {
            display: flex;
            background: rgba(243, 243, 243, 0.8);
            transition: .3s;
            opacity: 1;
          }
          font-size: 16px;
          color: #333;
          user-select: text;
          padding: 20px;
          span {
            color: #999;
            margin-right: 20px;
            font-size: 15px;
            user-select: none;
          }
          > div:nth-child(1) {
            display: flex;
            align-items: center;
            padding-bottom: 15px;
            border-bottom: 1px solid #ddd;
            > div:nth-child(1) {
              > img {
                width: 72px;
                height: 72px;
                border-radius: 4px;
              }
            }
            > div:nth-child(2) {
              > div:nth-child(1) {
                font-size: 18px;
              }
              height: 80px;
              margin-left: 20px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            }
          }
          > div:nth-child(2),
          > div:nth-child(3),
          > div:nth-child(4) {
            font-size: 14px;
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
          }
          .fx_rel {
            position: relative;
            width: 0;
            height: 0;
            > div {
              opacity: 0;
              position: absolute;
              user-select: none;
              top: -26px;
              left: -20px;
              width: 300px;
              // height: 46px;
              display: flex;
              padding: 12px 25px;
              justify-content: flex-end;
              align-items: center;
              img{
                cursor: pointer;
                margin-left: 41px;
              }
            }
          }
          .baseinfo-headAu {
            position: relative;
            width: 0;
            height: 0;
            img {
              position: absolute;
              top: -30px;
              left: 46px;
              width: 24px;
              border: 3px solid #fff;
              border-radius: 50px;
            }
          }
        }
      }
      .box-left-center {
        margin-top: 3px;
        flex: 1;
        a {
          text-decoration: none;
          border-left: 5px solid #36465f;
          padding-left: 28px;
          color: #fff !important;
          height: 66px;
          display: flex;
          margin-top: 5px;
          align-items: center;
          div:nth-child(1) {
            margin-right: 18px;
            margin-top: 5px;
          }
        }
        > div:nth-child(4) {
          margin-top: 35px;
        }
      }
      .box-left-footer {
        height: 50px;
        .setting {
          height: 100%;
          padding-left: 28px;
          display: flex;
          align-items: center;
          cursor: pointer;
          div {
            margin-right: 18px;
          }
          span {
            margin-top: -6px;
          }
        }
      }
    }
    .box-right {
      border-radius: 0 8px 8px 0;
      background: #ccc;
      flex: 1;
    }
  }
  .dialogs {
    .setting {
      .el-dialog__headerbtn {
        display: none;
      }
      .el-dialog__header,
      .el-dialog__body {
        padding: 0;
      }
      .el-dialog__wrapper {
        display: flex;
        align-items: center;
      }
      .el-dialog {
        
        margin-top: 0 !important;
        position: relative;
        top: 0;
        left: 0;
        width: 586px;
      }
      .el-dialog__body {
        width: 586px;
        height: 522px;
        background: #fff;
        border-radius: 4px;
      }
      .setting-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        height: 55px;
        font-size: 18px;
        border-bottom: 1px solid #ccc;
        border-radius: 4px 4px 0 0;
        cursor: move;
        user-select: none;
        > div:nth-child(2) {
          width: 21px;
          height: 21px;
          border-radius: 50%;
          border: 1px solid #fff;
          text-align: center;
          cursor: pointer;
        }
      }
      .setting-content{
        border-radius: 0 0 4px 4px;
        height: calc(100% - 55px);
        display: flex;
        .setting-content-left{
          width: 102px;
          display: flex;
          flex-direction: column;
          user-select: none;
          >div{
            height: 106px;
            background: #f3f3f3;
            display: flex;
            flex-direction: column;
            // justify-content: center;
            align-items: center;
            margin-bottom: 1px;
            border-left: 4px solid #f3f3f3;
            cursor: pointer;
            // &:hover{
            //   opacity: .8;
            // }
            &:active{
              opacity: .9;
            }
            >div:nth-child(1){
              margin-top: 23px;
            }
          }
          >div:nth-last-child(1){
            height: 145px;
            border-radius: 0 0 0 2px;
          }
          .col_act{
            color: #3b9cf8!important;
            border-color: #3b9cf8!important;
          }
        }
        .setting-content-right{
          flex: 1;
          height: calc(100% - 1px);
          >div{
            opacity: 0;
            transition: all .5s;
            // background: #ccc;
            padding: 29px 60px;
            height: calc(100% - 58px);
            border-radius: 0 0 4px 0;
          }
          .opa1{
            opacity: 1;
          }
          .right-account{
            .account-bind{
              user-select: none;
              font-size: 16px;
              >div:nth-child(1){
                counter-reset: #aaa;
              }
              >div:nth-child(2){
                margin-top: 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                >div{
                  display: flex;
                  align-items: center;
                  img{
                    margin: 0 10px 0 20px;
                  }
                  user-select: text;
                }
              }
              >div:nth-child(3){
                border-top: 1px solid #ccc;
                padding-top: 30px;
                margin-top: 30px;
              }
              >div:nth-child(4),>div:nth-child(5){
                margin-top: 20px;
                background: #f9f9f9;
                padding: 29px 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                >div:nth-child(1){
                  display: flex;
                  align-items: center;
                  img:nth-child(2){
                    margin: 0 15px;
                  }
                }
                >div:nth-child(2){
                  color: #999;
                  font-size: 16px;
                  cursor: pointer;
                  &:hover{
                    opacity: .8;
                  }
                  &:active{
                    opacity: .9;
                  }
                }
              }
              >div:nth-child(5){
                margin-top: 5px;
              }
            }
            .setting-exit{
              margin-top: 20px;
              text-align: center;
              user-select: none;
              >span{
                color: red;
                font-size: 14px;
                cursor: pointer;
                transition: .1s;
                &:hover{
                  opacity: .8;
                }
                &:active{
                  opacity: .9;
                }
              }
            }
          }
          .right-privacy{
            .privacy-bind{
              >div:nth-child(1){
                font-size: 16px;
                color: #999;
                margin-bottom: 13px;
              }
              .radiodiv{
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 14px 6px 14px 20px;
                background: #f9f9f9;
                border-radius: 2px;
                margin-top: 6px;
              }
            }
          }
          .right-problem{
            .problem-bind{
              >div:nth-child(1){
                font-size: 16px;
                display: flex;
                >div:nth-child(1){
                  color: #999;
                  margin-right: 38px;
                }
                >div:nth-child(2){
                  flex: 1;
                  display: flex;
                  justify-content: space-between;
                }
              }
              >div:nth-child(2){
                margin-top: 34px;
                textarea {
                  resize: none;
                  height: 286px!important;
                }
              }
              >div:nth-child(3){
                margin-top: 21px;
                text-align: right;
              }
            }
          }
          .right-about{
            .about-tit{
              font-size: 16px;
              color: #999;
            }
            >div:nth-child(2),>div:nth-child(4){
              margin-top: 19px;
              padding: 8px 13px;
              border: solid 1px #ccc;
              border-radius: 2px;
              background: #f9f9f9;
              span{
                color: #3b9cf8;
                transition: .1s;
                cursor: pointer;
                &:hover{
                  opacity: .8;
                }
                &:active{
                  opacity: .9;
                }
              }
            }
          }
          .setting-unbind{
            height: 372px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
    }
    .set_phone {
      .el-dialog {
        margin-top: 22vh !important;
      }
      .active1 {
        width: 300px;
        margin: 0 auto;
        margin-top: 20px;
        > div:nth-child(2) {
          display: flex;
          margin-top: 10px;
          span {
            margin-left: 5px;
            display: block;
            background: #ccc;
            color: #fff;
            width: 150px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            border-radius: 6px;
          }
        }
        > div:nth-child(3) {
          margin-top: 20px;
          text-align: center;
          .el-button {
            width: 60%;
          }
        }
      }
      .active2 {
        width: 300px;
        margin: 0 auto;
        margin-top: 20px;
        > div:nth-child(2) {
          display: flex;
          margin-top: 10px;
          span {
            margin-left: 5px;
            display: block;
            background: #ccc;
            color: #fff;
            width: 150px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            border-radius: 6px;
          }
        }
        > div:nth-child(3) {
          margin-top: 20px;
          text-align: center;
          .el-button {
            width: 40%;
          }
        }
      }
      .active3 {
        width: 300px;
        margin: 0 auto;
        margin-top: 20px;
        text-align: center;
        > div:nth-child(1) {
          color: #999;
          margin: 30px 0;
          i {
            font-size: 38px;
            color: #1afa29;
            margin-bottom: 10px;
          }
        }
        > div:nth-child(2) {
          margin-top: 20px;
          .el-button {
            width: 60%;
          }
        }
      }
    }
    .editInfo {
      .el-dialog__headerbtn {
        display: none;
      }
      .el-dialog__header,
      .el-dialog__body {
        padding: 0;
      }
      .el-dialog {
        width: 500px;
        height: 700px;
        background: #fff;
        margin-top: 5vh !important;
      }
      .editInfo-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 20px;
        background: #35465e;
        font-size: 14px;
        color: #fff;
        > div:nth-child(2) {
          width: 21px;
          height: 21px;
          border-radius: 50%;
          border: 1px solid #fff;
          text-align: center;
          cursor: pointer;
        }
      }
      .editInfo-box {
        span {
          color: #999;
          font-size: 14px;
        }
        padding: 22px 14px;
        .el-date-editor.el-input,
        .el-date-editor.el-input__inner,
        .el-select {
          width: 100%;
        }
        > div:nth-child(1) {
          display: flex;
          align-items: center;
          > div:nth-child(1) {
            width: 140px;
            height: 140px;
            margin-right: 30px;
            img {
              width: 100%;
              height: 100%;
              border-radius: 4px;
              cursor: pointer;
            }
          }
          > div:nth-child(2) {
            flex: 1;
            height: 140px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            > div {
              display: flex;
              align-items: center;
              > span {
                width: 40px;
              }
            }
          }
        }
        > div:nth-child(2) {
          > div:nth-child(1) {
            margin-top: 30px;
          }
          > div {
            display: flex;
            align-items: center;
            margin-top: 10px;
            > span {
              width: 100px;
            }
          }
        }
        > div:nth-child(3) {
          margin-top: 30px;
          text-align: center;
        }
      }
    }
  }
}
.router-link-active {
  background: rgba(0, 0, 0, 0.3);
  border-left: 5px solid rgba(59, 156, 248, 0.8) !important;
}
</style>
