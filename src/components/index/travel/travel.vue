<template>
  <div class="travel" @click="reomveType = false">
    <div></div>
    <div class="travel-left">
      <div>
        <!-- <div>发布游记</div> -->
        <div>
          <div v-if="navTab == 0" @click="scrollB()" :class="{'bg-d': navTab == 0}">
            <img :src="icon.all_youji" alt> 全部游记
          </div>
          <div v-else @click="GetTrInotes(0,1)" :class="{'bg-d': navTab == 0}">
            <img :src="icon.all_youji" alt> 全部游记
          </div>

          <div v-if="navTab == 2" @click="scrollB()" :class="{'bg-d': navTab == 2}">
            <img :src="icon.myyouji" alt>我的游记
          </div>
          <div v-else @click="GetTrInotes(2,1)" :class="{'bg-d': navTab == 2}">
            <img :src="icon.myyouji" alt>我的游记
          </div>

          <div v-if="navTab == 4" @click="scrollB()" :class="{'bg-d': navTab == 4}">
            <img :src="icon.commentary" alt>解说
          </div>
          <div v-else @click="GetTrInotes(4,1)" :class="{'bg-d': navTab == 4}">
            <img :src="icon.commentary" alt>解说
          </div>

          <div v-if="navTab == 6" @click="scrollB()" :class="{'bg-d': navTab == 6}">
            <img :src="icon.collection_left" alt>我的收藏
          </div>
          <div v-else @click="GetTrInotes(6,1)" :class="{'bg-d': navTab == 6}">
            <img :src="icon.collection_left" alt>我的收藏
          </div>
        </div>
      </div>
      <!-- <div>
                <div>大家都爱去</div>
                <div class="attrHot" v-for="(item, index) in [1,2,3]" :key="index">
                    <div></div>
                    <div>
                        <div>丽江</div>
                        <div>古城、四方街、玉水寨</div>
                    </div>
                </div>
                
      </div>-->
    </div>
    <div class="travel-right">
      <Loading v-if="loadingDiv" style="opacity:.7"></Loading>
      <div class="right-search" v-if="navTab<6">
        <i v-if="navTab == 0" class="el-icon-search"></i>
        <input v-if="navTab == 0" type="text" v-model="searchMsg" placeholder="搜索景点/昵称/关键词">
      </div>
      <div v-if="navTab<6" class="travel-right-box" ref="travelView">
        <div v-for="(item, index) in travelData" :key="index">
          <div v-if="item.source == 0" class="Nosource">
            <div>
              <div>
                <img v-if="item.icon == '' || item.icon == null" :src="icon.firendHead" alt>
                <img v-else-if="item.icon.indexOf('http')!=-1" :src="item.icon" alt>
                <img v-else :src="head_icon+item.icon" alt>
                <div>
                  <div>{{item.name}}</div>
                  <div>{{$base.timestampToTime(item.date)}}</div>
                </div>
              </div>
              <div>
                <div>浏览{{item.browse_people}}次</div>
                <div
                  @click="GetTrInoteLaud(item.rtn_num, $event)"
                  v-if="item.laud_flg == 0"
                  class="cur"
                >
                  <img :src="icon.like_default" alt>
                  <div>{{item.laud_num}}</div>
                </div>
                <div @click="GetTrInoteLaud(item.rtn_num, $event)" v-else class="cur">
                  <img :src="icon.like_click" alt>
                  <div>{{item.laud_num}}</div>
                </div>

                <div
                  @click="GetCollect(item.rtn_id, 1, $event)"
                  v-if="item.collect_flg == 0"
                  class="cur"
                >
                  <img :src="icon.collection_del" alt>
                  <div>{{item.collect_num}}</div>
                </div>
                <div @click="GetCollect(item.rtn_num, 0, $event)" v-else class="cur">
                  <img :src="icon.collection_click" alt>
                  <div>{{item.collect_num}}</div>
                </div>

                <div @click="relayData = item, isMy(item.num, $event)" class="cur">
                  <img :src="icon.share" alt>
                </div>
              </div>
            </div>
            <div class="imgs">
              <div
                v-for="(itemImg, index) in item.imgs"
                :key="index"
                @click="msgImgView(item.imgs, index, imgs_travel_notes, item.prefix+item.watermark)"
              >
                <img
                  v-lazy="imgs_travel_notes+itemImg.url+item.prefix+item.watermark+'/resize,p_50'"
                  alt
                >
              </div>
            </div>
            <div class="video" v-if="item.video != null">
              <!-- <img
                :src="video_travel_notes+item.video.url+'?x-oss-process=video/snapshot,t_27000,f_jpg'"
                onerror="this.style.display='none'"
              >-->
              <img :src="video_snapshot + item.snapshot" alt>
              <div class="rel-play">
                <i
                  @click="playVideo(video_travel_notes+item.video.url)"
                  class="el-icon-caret-right"
                ></i>
              </div>
            </div>
            <div class="audio"></div>
            <div class="voice" v-if="item.audio != null">
              <div class="cur" @click="audioPlay(voice_file+item.audio.url, index)">
                <img :src="audioType == index ? icon.viucegif : icon.voice3" alt>
              </div>
              <div>{{$base.sTotime(item.audio.time_len)}}</div>
            </div>
            <div class="title-name" v-if="item.title !== null && item.title !== ''">
              <img :src="icon.title_icon" alt>
              <span>{{item.title}}</span>
            </div>
            <div class="contents">
              {{item.contentL}}
              <div v-if="item.contentL.length>60">
                <span v-if="item.contentL.length<64" @click.stop="item.contentL = item.content">全文</span>
                <span v-else @click.stop="item.contentL = item.contentS">收起</span>
              </div>
            </div>
            <div class="poi" v-if="item.poi_name != '' && item.poi_name != null">
              <img :src="icon.position" alt>
              {{item.poi_name}}
            </div>
          </div>
          <div v-else-if="item.source == 1" class="source">
            <div>
              <div>
                <img v-if="item.icon == '' || item.icon == null" :src="icon.firendHead" alt>
                <img v-else-if="item.icon.indexOf('http')!=-1" :src="item.icon" alt>
                <img v-else :src="head_icon+item.icon" alt>
                <div>
                  <div>{{item.name}}</div>
                  <div>{{$base.timestampToTime(item.date)}}</div>
                </div>
              </div>
              <div>
                <div>浏览{{item.browse_people}}次</div>
                <div
                  @click="GetTrInoteLaud(item.rtn_num, $event)"
                  v-if="item.laud_flg == 0"
                  class="cur"
                >
                  <img :src="icon.like_default" alt>
                  <div>{{item.laud_num}}</div>
                </div>
                <div @click="GetTrInoteLaud(item.rtn_num, $event)" v-else class="cur">
                  <img :src="icon.like_click" alt>
                  <div>{{item.laud_num}}</div>
                </div>

                <div
                  @click="GetCollect(item.rtn_id, 1, $event)"
                  v-if="item.collect_flg == 0"
                  class="cur"
                >
                  <img :src="icon.collection_del" alt>
                  <div>{{item.collect_num}}</div>
                </div>
                <div @click="GetCollect(item.rtn_num, 0, $event)" v-else class="cur">
                  <img :src="icon.collection_click" alt>
                  <div>{{item.collect_num}}</div>
                </div>

                <div @click="relayData = item, isMy(item.num,$event)" class="cur">
                  <img :src="icon.share" alt>
                </div>
              </div>
            </div>
            <div>
              <div class="zfrom">
                转发源于
                <span>{{item.source_name || item.root_name}}</span>:
              </div>
              <div class="imgs">
                <div
                  v-for="(itemImg, index) in item.imgs"
                  :key="index"
                  @click="msgImgView(item.imgs, index, imgs_travel_notes, item.prefix+item.watermark)"
                >
                  <img
                    v-lazy="imgs_travel_notes+itemImg.url+item.prefix+item.watermark+'/resize,p_50'"
                    alt
                  >
                </div>
              </div>
              <div class="video" v-if="item.video != null">
                <!-- <img
                  :src="video_travel_notes+item.video.url+'?x-oss-process=video/snapshot,t_27000,f_jpg'"
                  onerror="this.style.display='none'"
                >-->
                <img :src="video_snapshot + item.snapshot" alt>
                <div class="rel-play">
                  <i
                    @click="playVideo(video_travel_notes+item.video.url)"
                    class="el-icon-caret-right"
                  ></i>
                </div>
              </div>

              <div class="title-name" v-if="item.title !== null && item.title !== ''">
                <img :src="icon.title_icon" alt>
                <span>{{item.title}}</span>
              </div>
              <div class="msgs">{{item.source_content}}</div>
            </div>

            <div class="contents">
              {{item.contentL}}
              <div v-if="item.contentL.length>60">
                <span v-if="item.contentL.length<64" @click.stop="item.contentL = item.content">全文</span>
                <span v-else @click.stop="item.contentL = item.contentS">收起</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="collect-box">
        <div class="collect-title">
          <div>
            <span
              :class="{'active': tagArr.indexOf(item.rtt_id)>-1}"
              @click="addTag(item.rtt_id)"
              v-for="(item, index) in tagshowDatas"
              :key="index"
            >
              {{`${item.rtt_name}`}}
              <div class="removeflg" v-if="reomveType">
                <div @click.stop="removeTag(item.rtt_id, index)">-</div>
              </div>
            </span>
          </div>
          <div>
            <span @click.stop="reomveType = !reomveType">管理</span>
          </div>
        </div>
        <div class="collect-content" ref="travelView">
          <div
            v-for="(item, index) in travelData"
            :key="index"
            @click="GetTravelInfo(item.rtn_num, item.tags)"
          >
            <div class="removeflg" v-if="reomveType">
              <div @click.stop="removeColl(item.rtn_num, index)">-</div>
            </div>
            <div class="info-title">
              <div>
                <img v-if="item.icon == '' || item.icon == null" :src="icon.firendHead" alt>
                <img v-else-if="item.icon.indexOf('http')!=-1" :src="item.icon" alt>
                <img v-else :src="head_icon+item.icon" alt>
                <div>{{item.name}}</div>
              </div>
              <div @click.stop="addTagdiv(item.rtn_id, item.tags)">
                <div>
                  <span v-for="(itemtag, len) in item.tags" :key="len">{{itemtag.rtt_name}}</span>
                </div>
                <i class="el-icon-edit-outline"></i>
              </div>
            </div>
            <div class="imgs">
              <div
                v-for="(itemImg, index) in item.imgs"
                :key="index"
                @click.stop="msgImgView(item.imgs, index, imgs_travel_notes, item.prefix+item.watermark)"
              >
                <img
                  v-lazy="imgs_travel_notes+itemImg.url+item.prefix+item.watermark+'/resize,p_50'"
                  alt
                >
              </div>
            </div>
            <div class="video" v-if="item.video != null">
              <!-- <img
                :src="video_travel_notes+item.video.url+'?x-oss-process=video/snapshot,t_27000,f_jpg'"
                onerror="this.style.display='none'"
              >-->
              <img :src="video_snapshot + item.snapshot" alt>
              <div class="rel-play">
                <i
                  @click.stop="playVideo(video_travel_notes+item.video.url)"
                  class="el-icon-caret-right"
                ></i>
              </div>
            </div>
            <div class="audio"></div>
            <div class="voice" v-if="item.audio != null">
              <div class="cur" @click.stop="audioPlay(voice_file+item.audio.url, index)">
                <img :src="audioType == index ? icon.viucegif : icon.voice3" alt>
              </div>
              <div>{{$base.sTotime(item.audio.time_len)}}</div>
            </div>

            <div class="title-name" v-if="item.title !== null && item.title !== ''">
              <img :src="icon.title_icon" alt>
              <span>{{item.title}}</span>
            </div>
            <div class="contents" @click.stop>
              {{item.contentL}}
              <div v-if="item.contentL.length>60">
                <span v-if="item.contentL.length<64" @click.stop="item.contentL = item.content">全文</span>
                <span v-else @click.stop="item.contentL = item.contentS">收起</span>
              </div>
            </div>
            <div class="date">收藏时间 {{$base.timestampToTime(item.date)}}</div>
          </div>
        </div>
      </div>
      <!-- <div v-else class="null-tit">暂无数据！</div> -->
    </div>
    <div class="dialogs">
      <!-- 游记转发 -->
      <div class="trinoteRelay">
        <el-dialog width="500px" :visible.sync="dialogVisible.trinoteRelay">
          <div class="trinoteRelay-box">
            <div>转发游记</div>
            <div>
              来源：
              <span>{{relayData.name}}</span> 的游记
            </div>
            <el-input type="textarea" placeholder="说点什么吧！" v-model="content"></el-input>
            <el-button type="primary" @click="GetTrInoteRelay(relayData.rtn_num)">转发</el-button>
          </div>
        </el-dialog>
      </div>
      <div class="travelInfo">
        <el-dialog width="620px" :visible.sync="dialogVisible.travelInfo">
          <!-- <div class="info-box-label">
            <div>
              标签：
              <span v-for="(item, index) in tagshowData" :key="index">{{`${item.rtt_name}`}}</span>
            </div>
            <div @click="addTagdiv">
              <i @click="addTagdiv" class="el-icon-edit-outline"></i>
            </div>
          </div>-->
          <div v-if="travelInfoData == ''" class="unloading">
            <i class="el-icon-loading"></i> 加载中...
          </div>
          <div class="travelInfo-box" v-else>
            <div class="info-title">
              <div>
                <img
                  v-if="travelInfoData.icon == '' || travelInfoData.icon == null"
                  :src="icon.firendHead"
                  alt
                >
                <img
                  v-else-if="travelInfoData.icon.indexOf('http')!=-1"
                  :src="travelInfoData.icon"
                  alt
                >
                <img v-else :src="head_icon+travelInfoData.icon" alt>
                <div>{{travelInfoData.name}}</div>
              </div>
            </div>
            <div class="imgs" v-if="travelInfoData.imgs != null && travelInfoData.imgs != ''">
              <div
                v-for="(itemImg, index) in travelInfoData.imgs"
                :key="index"
                @click.stop="msgImgView(travelInfoData.imgs, index, imgs_travel_notes, travelInfoData.prefix+travelInfoData.watermark)"
              >
                <img
                  v-lazy="imgs_travel_notes+itemImg.url+travelInfoData.prefix+travelInfoData.watermark+'/resize,p_50'"
                  alt
                >
              </div>
            </div>
            <div class="video" v-if="travelInfoData.video != null">
              <!-- <img
                :src="video_travel_notes+travelInfoData.video.url+'?x-oss-process=video/snapshot,t_27000,f_jpg'"
                onerror="this.style.display='none'"
              >-->
              <img :src="video_snapshot + travelInfoData.snapshot" alt>
              <div class="rel-play">
                <i
                  @click.stop="playVideo(video_travel_notes+travelInfoData.video.url)"
                  class="el-icon-caret-right"
                ></i>
              </div>
            </div>
            <div class="audio"></div>
            <div class="voice" v-if="travelInfoData.audio != null">
              <div class="cur" @click.stop="audioPlay(voice_file+travelInfoData.audio.url, 0)">
                <img :src="audioType == 0 ? icon.viucegif : icon.voice3" alt>
              </div>
              <div>{{$base.sTotime(travelInfoData.audio.time_len)}}</div>
            </div>

            <div
              class="title-name"
              v-if="travelInfoData.title !== null && travelInfoData.title !== ''"
            >
              <img :src="icon.title_icon" alt>
              <span>{{travelInfoData.title}}</span>
            </div>
            <div class="contents">{{travelInfoData.content}}</div>
            <div class="date">
              <div>收藏时间 {{$base.timestampToTime(travelInfoData.date)}}</div>
              <div>
                <i class="el-icon-delete"></i>
              </div>
            </div>
          </div>
        </el-dialog>
      </div>
      <div class="addTagDialog">
        <el-dialog
          :lock-scroll="true"
          width="460px"
          title="添加标签"
          :visible.sync="dialogVisible.addTag"
        >
          <div class="addTag-box">
            <div class="addTagBox-input">
              <el-input maxlength="20" v-model="addTagName" placeholder="输入标签"></el-input>
            </div>
            <div class="addTag-tag">
              <span v-for="(item, index) in tagshowData" :key="index">
                {{item.rtt_name}}
                <div class="removeflg">
                  <div @click="removeTag(item.rtt_id, index)">-</div>
                </div>
              </span>
            </div>
            <div class="addTag-btn">
              <el-button @click="GetAddTag" type="primary" size="mini">确定</el-button>
              <el-button @click="dialogVisible.addTag = false" size="mini">取消</el-button>
            </div>
          </div>
        </el-dialog>
      </div>
      <div class="videoDialog">
        <el-dialog :lock-scroll="true" :visible.sync="dialogVisible.playVideo">
          <video ref="video" id="my_video" width="100%" height="500vh" controls>
            <source :src="videoUrl" type="video/mp4">
            <source :src="videoUrl" type="video/webm">
          </video>
        </el-dialog>
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
      loginVisitor: {}, //个人信息（token）
      navTab: 0, //游记导航
      travelData: [], //游记列表
      travelInfoData: "", //游记详情
      relayData: {}, //转发的游记信息
      searchMsg: "",
      imgViewUrl: "",
      len: "",
      imgData: { imgs: [] },
      content: "",
      dialogVisible: {
        trinoteRelay: false,
        travelInfo: false,
        playVideo: false,
        addTag: false
      },
      icon: {
        firendHead: this.OSSIMG + "icon_head1.png",
        share: this.OSSIMG + "icon_share2.png",
        like_click: this.OSSIMG + "icon_like_click.png",
        like_default: this.OSSIMG + "icon_like_default.png",
        collection_del: this.OSSIMG + "icon_collection_del_web.png",
        collection_click: this.OSSIMG + "icon_collection_click_web.png",
        all_youji: this.OSSIMG + "icon_all_youji.png",
        myyouji: this.OSSIMG + "icon_myyouji.png",
        collection_left: this.OSSIMG + "icon_collection_left.png",
        commentary: this.OSSIMG + "icon_commentary.png",
        viucegif: this.OSSIMG + "icon_voice1_gif.gif",
        voice3: this.OSSIMG + "icon_voice3.png",
        position: this.OSSIMG + "icon_yj_position.png",
        title_icon: this.OSSIMG + "icon_title%402x.png"
      },
      audioType: -1,
      page: 1,
      loadingDiv: true,
      current: 0,
      videoUrl: "",
      has: "", //水印
      imgType: false,
      imgurlList: [],
      activebtn: 0,
      tagArr: [""],
      tagshowDatas: [],
      tagshowData: [
        // { rtt_id: "", rtt_name: "全部" },
        // { rtt_id: "1", rtt_name: "景点1" },
        // { rtt_id: "2", rtt_name: "景点sdf2" },
        // { rtt_id: "3", rtt_name: "景点3" },
        // { rtt_id: "4", rtt_name: "景sadfsad点4" },
        // { rtt_id: "2", rtt_name: "景点2" },
        // { rtt_id: "3", rtt_name: "景点sdfsdf3" },
        // { rtt_id: "4", rtt_name: "景sadfsad点4" },
        // { rtt_id: "2", rtt_name: "景点2" },
        // { rtt_id: "3", rtt_name: "景点sdfsdf3" },
      ],
      reomveType: false,
      addTagName: ""
    };
  },
  props: ["routeNav"],
  watch: {
    "dialogVisible.playVideo"() {
      if (this.dialogVisible.playVideo) {
        setTimeout(() => {
          try {
            // console.log(document.getElementById("my_video"));
            document.getElementById("my_video").play();
          } catch (e) {
            this.$message.warning("文件已损坏！");
          }
        }, 100);
      } else {
        document.getElementById("my_video").pause();
      }
    },
    routeNav() {
      if (this.routeNav == "travel") {
        this.loadingDiv = true;
        this.page = 1;
        this.travelData = [];
        this.GetTrInotes(0, 1);
      }
    },
    searchMsg() {
      const that = this;
      if ($.trim(this.searchMsg) != "") {
        this.GetlistSearch(this.searchMsg);
        if (that.$refs.travelView != undefined) {
          this.scrollB();
          that.$refs.travelView.removeEventListener(
            "scroll",
            that.EventFn,
            false
          );
        }
      } else {
        // let travelNav = localStorage.getItem("travelNav");
        this.GetTrInotes(0, 1);
      }
    },
    navTab() {
      if (this.navTab == 6) {
        this.GetTagshow();
      }
    }
  },
  components: {
    Loading,
    viewimg
  },
  mounted() {
    const that = this;
    let loginVisitor = localStorage.getItem("loginVisitor");
    let baseinfo = localStorage.getItem("baseinfo");
    let travelNav = localStorage.getItem("travelNav");
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
      if (this.navTab == 6) {
        this.GetTagshow();
      }
    }
  },
  methods: {
    //添加标签
    addTagdiv(rtn_id, tags) {
      const that = this;
      that.tagshowData = tags;
      that.rtn_id = rtn_id;
      that.dialogVisible.addTag = true;
    },
    //移除标签
    removeTag(rtt_id, index) {
      const that = this;
      that
        .$confirm("确认是否移除该标签？", "提示", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          $.ajax({
            url: that.urlHost + "visitor/trlnote/tag/romve",
            type: "post",
            data: {
              access_token: that.loginVisitor.access_token,
              rtt_id: rtt_id
            },
            dataType: "json",
            success: res => {
              if (res.success === "00000000") {
                that.tagshowData.splice(index, 1);
                that.GetTrInotes(6, 1);
                that.GetTagshow();
              } else {
                that.$base.err(res, that);
              }
            },
            error: err => {
              // console.log(err);
            }
          });
        })
        .catch(() => {});
    },
    GetAddTag() {
      const that = this;
      if (that.addTagName.trim() == "") {
        that.$message("标签名不能为空！");
        return;
      }
      $.ajax({
        url: that.urlHost + "visitor/trlnote/tag/issue",
        type: "post",
        data: {
          access_token: that.loginVisitor.access_token,
          rtn_id: that.rtn_id,
          name: that.addTagName
        },
        dataType: "json",
        success: res => {
          if (res.success === "00000000") {
            that.$message.success("添加成功！");
            that.addTagName = "";
            that.GetTagshow();
            that.GetTrInotes(6, 1);
            that.dialogVisible.addTag = false;
          } else {
            that.$base.err(res, that);
          }
        },
        error: err => {
          // console.log(err);
        }
      });
    },
    //游记详情
    GetTravelInfo(rtn_num, tags) {
      const that = this;
      that.dialogVisible.travelInfo = true;
      that.tagshowData = tags;
      if (rtn_num != that.travelInfoData.rtn_num) {
        that.travelInfoData = "";
      }
      $.ajax({
        url: that.urlHost + "visitor/trlnote",
        type: "post",
        data: {
          access_token: that.loginVisitor.access_token,
          rtn_num: rtn_num
        },
        dataType: "json",
        success: res => {
          if (res.success === "00000000") {
            that.travelInfoData = res.obj;
          } else {
            that.$base.err(res, that);
          }
        },
        error: err => {
          // console.log(err);
        }
      });
    },
    //视频播放
    playVideo(url) {
      this.dialogVisible.playVideo = true;
      setTimeout(() => {
        this.$refs.video.src = url;
      }, 0);
    },
    addTag(rtt_id) {
      const that = this;
      let tags;
      if (rtt_id == "") {
        if (that.tagArr.indexOf("") > -1) {
          return;
        }
        that.tagArr = [""];
      } else {
        let sum = that.tagArr.indexOf("");
        if (sum != -1) {
          that.tagArr.splice(sum, 1);
        }
        if (that.tagArr.indexOf(rtt_id) == -1) {
          that.tagArr.push(rtt_id);
        } else {
          let index = that.tagArr.indexOf(rtt_id);
          that.tagArr.splice(index, 1);
          if (that.tagArr < 1) {
            that.tagArr = [""];
          }
        }
      }
      if (that.tagArr.length < 1) {
        tags = "";
      } else {
        tags = that.tagArr.toString();
      }
      that.GetTrInotes(6, 1, tags);
    },
    // 标签列表
    GetTagshow() {
      const that = this;
      $.ajax({
        url: that.urlHost + "visitor/trlnote/tag/show",
        type: "post",
        data: {
          access_token: that.loginVisitor.access_token
        },
        dataType: "json",
        success: res => {
          if (res.success === "00000000") {
            that.tagshowDatas = res.obj;
            that.tagshowDatas.unshift({ rtt_id: "", rtt_name: "全部" });
            let tagsType = true;
            for (let i in that.tagArr) {
              if (
                that.tagshowDatas.some(item => {
                  return item.rtt_id == that.tagArr[i];
                })
              ) {
                tagsType = false;
              }
            }
            if (tagsType) {
              that.addTag("");
            }
          } else {
            that.$base.err(res, that);
          }
        },
        error: err => {
          // console.log(err);
        }
      });
    },
    //游记列表  flg 0->推荐 1->侗友（包含自己） 2->我的 3->他人发布 4->解说
    GetTrInotes(flg, page, tags) {
      const that = this;
      that.loadingDiv = true;
      if (page == undefined) {
        that.page++;
      } else {
        that.page = page;
      }
      that.navTab = flg;
      if (flg == 6) {
        var url = that.urlHost + "visitor/trlnote/collect";
        var data = {
          access_token: that.loginVisitor.access_token,
          tags: tags || "",
          page: that.page,
          rows: 10
        };
      } else {
        var url = that.urlHost + "visitor/trlnotes";
        var data = {
          access_token: that.loginVisitor.access_token,
          flg: flg,
          page: that.page,
          rows: 10
        };
      }

      $.ajax({
        url: url,
        type: "post",
        data: data,
        dataType: "json",
        success: res => {
          that.loadingDiv = false;
          if (res.success === "00000000") {
            if (res.obj == null || res.obj.data == null) {
              if (that.page == 1) {
                that.travelData = [];
                that.scrollB();
              }
              that.$message({
                message: "暂无更多游记！",
                align: true
              });
              that.$refs.travelView.removeEventListener(
                "scroll",
                that.EventFn,
                false
              );
            } else {
              if (page == 1) {
                that.scrollB();
                for (let i = 0; i < res.obj.data.length; i++) {
                  if (res.obj.data[i].content.length > 60) {
                    res.obj.data[i].contentL =
                      res.obj.data[i].content.substring(0, 60) + "...";
                    res.obj.data[i].contentS =
                      res.obj.data[i].content.substring(0, 60) + "...";
                  } else {
                    res.obj.data[i].contentL = res.obj.data[i].content;
                  }
                }
                that.travelData = res.obj.data;
              } else {
                for (let i = 0; i < res.obj.data.length; i++) {
                  if (res.obj.data[i].content.length > 60) {
                    res.obj.data[i].contentL =
                      res.obj.data[i].content.substring(0, 60) + "...";
                    res.obj.data[i].contentS =
                      res.obj.data[i].content.substring(0, 60) + "...";
                  } else {
                    res.obj.data[i].contentL = res.obj.data[i].content;
                  }
                  that.travelData.push(res.obj.data[i]);
                }
                that.searchMsg = "";
                if (JSON.stringify(that.$refs) != "{}") {
                  that.$refs.travelView.removeEventListener(
                    "scroll",
                    that.EventFn,
                    false
                  );
                }
              }
              setTimeout(() => {
                that.$refs.travelView.addEventListener(
                  "scroll",
                  that.EventFn,
                  false
                );
              }, 200);
            }
          } else {
            that.$base.err(res, that);
          }
        },
        error: err => {
          // console.log(err);
          that.loadingDiv = false;
          that.$message.error("网络异常！");
          if (that.page == 1) {
            that.travelData = [];
          }
        }
      });
    },
    EventFn(flg) {
      const that = this;
      if (
        that.$refs.travelView.scrollTop + this.$refs.travelView.offsetHeight >=
        that.$refs.travelView.scrollHeight
      ) {
        that.GetTrInotes(that.navTab);
      }
    },
    //游记列表搜索
    GetlistSearch(search) {
      $.ajax({
        url: this.urlHost + "visitor/trlnote/search",
        type: "post",
        data: {
          access_token: this.loginVisitor.access_token,
          search: search,
          page: 1,
          rows: 1000
        },
        dataType: "json",
        success: res => {
          if (res.success === "00000000") {
            if (res.obj == null) {
              this.travelData = [];
              this.$message("暂无搜索结果！");
            } else {
              this.travelData = res.obj.data;
            }
            // console.log(this.travelData)
          } else {
            this.$base.err(res, this);
          }
        },
        error: err => {
          console.log(err);
        }
      });
    },
    // 语音播放
    audioPlay(url, index) {
      // console.log(url+'~~~~'+index)
      const that = this;
      if (that.currentAudio == undefined) {
        that.currentAudio = new Audio(url);
        that.currentAudio.play();
        that.audioType = index;
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
            that.audioType = index;
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
          that.audioType = index;
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
    //游记点赞
    GetTrInoteLaud(rtn_num, event) {
      $.ajax({
        url: this.urlHost + "visitor/trlnote/laud",
        type: "post",
        data: {
          access_token: this.loginVisitor.access_token,
          rtn_num: rtn_num
        },
        dataType: "json",
        success: res => {
          if (res.success === "00000000") {
            this.$message.success(res.msg);
            for (let i = 0; i < this.travelData.length; i++) {
              if (rtn_num === this.travelData[i].rtn_num) {
                if (this.travelData[i].laud_flg == 0) {
                  this.travelData[i].laud_flg = 1;
                  this.travelData[i].laud_num++;
                } else {
                  this.travelData[i].laud_flg = 0;
                  this.travelData[i].laud_num--;
                }
              }
            }
          } else {
            this.$base.err(res, this);
          }
        },
        error: err => {
          console.log(err);
        }
      });
      event.cancelBubble = true;
    },
    //我的收藏移除
    removeColl(rtn_num, index) {
      const that = this;
      that
        .$confirm("确认是否从我的收藏移除？", "提示", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          $.ajax({
            url: that.urlHost + "visitor/trlnote/collect/remove",
            type: "post",
            data: {
              access_token: that.loginVisitor.access_token,
              rtn_num: rtn_num
            },
            dataType: "json",
            success: res => {
              if (res.success === "00000000") {
                that.$message.success("该游记已从我的收藏里移除！");
                that.travelData.splice(index, 1);
                that.GetTagshow();
              } else {
                that.$base.err(res, that);
              }
            },
            error: err => {
              console.log(err);
            }
          });
        })
        .catch(() => {});
    },
    //游记收藏
    GetCollect(rtn_num, flg, event) {
      const that = this;
      if (flg == 0) {
        var url = that.urlHost + "visitor/trlnote/collect/remove";
        var data = {
          access_token: that.loginVisitor.access_token,
          rtn_num: rtn_num
        };
      } else if (flg == 1) {
        var url = that.urlHost + "visitor/trlnote/collect/add";
        var data = {
          access_token: that.loginVisitor.access_token,
          rtn_id: rtn_num
        };
      }
      $.ajax({
        url: url,
        type: "post",
        data: data,
        dataType: "json",
        success: res => {
          if (res.success === "00000000") {
            for (let i = 0; i < that.travelData.length; i++) {
              if (
                rtn_num === that.travelData[i].rtn_num ||
                rtn_num === that.travelData[i].rtn_id
              ) {
                if (that.travelData[i].collect_flg == 0) {
                  that.travelData[i].collect_flg = 1;
                  that.travelData[i].collect_num++;
                } else {
                  that.travelData[i].collect_flg = 0;
                  that.travelData[i].collect_num--;
                }
              }
              if (that.navTab == 6) {
                if (rtn_num === that.travelData[i].rtn_num) {
                  that
                    .$confirm("确认是否从我的收藏移除？", "提示", {
                      confirmButtonText: "确认",
                      cancelButtonText: "取消",
                      type: "warning"
                    })
                    .then(() => {
                      that.$message.success("该游记已从我的收藏里移除！");
                      that.travelData.splice(i, 1);
                    })
                    .catch(() => {});
                }
              }
            }
          } else {
            that.$base.err(res, that);
          }
        },
        error: err => {
          console.log(err);
        }
      });
      event.cancelBubble = true;
    },
    isMy(num, event) {
      event.cancelBubble = true;
      if (num == this.loginVisitor.access_num) {
        this.$message({
          message: "不能转发自己的游记！",
          type: "error",
          center: true
        });
      } else if (this.loginVisitor.access_phone == 0) {
        this.$message.warning("需绑定手机号");
        this.$router.push({ path: "/unbind" });
      } else {
        this.dialogVisible.trinoteRelay = true;
      }
    },
    //游记转发
    GetTrInoteRelay(rtn_num) {
      $.ajax({
        url: this.urlHost + "visitor/trlnote/relay",
        type: "post",
        data: {
          access_token: this.loginVisitor.access_token,
          rtn_num: rtn_num,
          content: this.content
        },
        dataType: "json",
        success: res => {
          if (res.success === "00000000") {
            this.$message({
              message: res.msg,
              type: "success",
              center: true
            });
            this.GetTrInotes(this.navTab, 1);
            this.dialogVisible.trinoteRelay = false;
            this.content = "";
          } else {
            this.dialogVisible.trinoteRelay = false;
            this.$base.err(res, this);
          }
        },
        error: err => {
          console.log(err);
        }
      });
    },
    //滚动条至最上
    scrollB() {
      if (typeof $(".travel-right-box")[0] != "undefined") {
        $(".travel-right-box")[0].scrollTop = 0;
      }
    },
    typeBy(t) {
      this.imgType = t;
    },
    viewBtn(data, index) {
      if (!Array.isArray(data)) {
        this.imgurlList = {
          imgs: [data],
          index: 0
        };
      } else {
        this.imgurlList = {
          imgs: data,
          index
        };
      }
      this.imgType = true;
    },
    //图片预览
    msgImgView(imgs, index, url, has) {
      let imgsData = [];
      for (let i in imgs) {
        imgsData.push(url + imgs[i].url + has);
      }
      for (let i = 0; i < imgsData.length; i++) {
        if (url + imgs[index].url + has == imgsData[i]) {
          this.viewBtn(imgsData, i);
        }
      }
    }
  }
};
</script>

<style lang="less">
@media (max-width: 1100px) {
  // .travel-left{
  //   min-width: 0!important;
  //   width: 0!important;
  // }
}
.travel {
  position: relative;
  background: #f3f3f3;
  height: 100%;
  overflow: hidden;
  border-radius: 0 8px 8px 0;
  font-size: 16px;
  display: flex;
  .travel-left {
    height: 100%;
    min-width: 300px;
    overflow: hidden;
    background: #f9f9f9;
    > div:nth-child(1) {
      padding-top: 30px;
      height: 320px;
      > div:nth-child(1) {
        z-index: 2;
        position: relative;
        cursor: pointer;
        font-size: 14px;
        > div {
          padding-left: 30px;
          height: 50px;
          display: flex;
          align-items: center;
          img {
            margin-right: 12px;
          }
        }
      }
    }
    > div:nth-child(2) {
      > div:nth-child(1) {
        padding-bottom: 4px;
        padding: 36px 0 0 30px;
      }
      .attrHot {
        cursor: pointer;
        padding: 8px 0 8px 30px;
        display: flex;
        align-items: center;
        > div:nth-child(1) {
          width: 50px;
          height: 50px;
          background: #ccc;
          border-radius: 50%;
          margin-right: 12px;
        }
        > div:nth-child(2) {
          height: 40px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          > div:nth-child(1) {
            font-size: 14px;
          }
          > div:nth-child(2) {
            color: #999;
            font-size: 12px;
          }
        }
        &:hover {
          background: #ddd;
        }
      }
    }
  }
  .travel-right {
    position: relative;
    flex: 1;
    // width: 700px;
    // background: #fff;
    border-radius: 0 8px 8px 0;
    .right-search {
      margin: 30px 60px 0 42px;
      border-bottom: 1px solid #ccc;
      padding-bottom: 14px;
      height: 19px;
      i {
        color: #999;
      }
      input {
        z-index: 2;
        position: relative;
        outline: none;
        margin-left: 20px;
        width: 90%;
        border: 0;
        background: #f3f3f3;
      }
    }
    .travel-right-box {
      margin-right: 8px;
      padding: 0 45px 0 42px;
      height: calc(100% - 64px);
      overflow-y: auto;
      width: calc(100% - 87px);
      border-radius: 0 0 8px 0;
      > div {
        border-bottom: 1px solid #ccc;
        padding-bottom: 20px;
        .Nosource {
          margin-top: 20px;
          width: 100%;
          // background: #ccc;
          overflow: hidden;
          > div:nth-child(1) {
            // padding-right: 5px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            > div:nth-child(1) {
              display: flex;
              img {
                width: 38px;
                height: 38px;
                border-radius: 4px;
                margin-right: 14px;
              }
              > div {
                > div:nth-child(1) {
                  font-size: 14px;
                }
                > div:nth-child(2) {
                  margin-top: 2px;
                  font-size: 12px;
                  color: #999;
                }
              }
            }
            > div:nth-child(2) {
              display: flex;
              > div:nth-child(1) {
                border: 1px solid #ccc;
                width: 104px;
                height: 26px;
                line-height: 26px;
                text-align: center;
                margin-right: 28px;
                font-size: 14px;
                color: #999;
              }
              > div:nth-child(2),
              > div:nth-child(3),
              > div:nth-child(4) {
                border: 1px solid #ccc;
                width: 44px;
                height: 26px;
                line-height: 26px;
                text-align: center;
                background: #fff;
                font-size: 14px;
                color: #333;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              > div:nth-child(2),
              > div:nth-child(3) {
                border-right: 0;
                img {
                  margin-right: 5px;
                }
                > div {
                  margin-top: 3px;
                }
              }
            }
          }
          .imgs {
            margin-top: 16px;
            display: flex;
            flex-wrap: wrap;
            > div {
              cursor: pointer;
              margin: 0 5px 5px 0;
              width: 195px;
              height: 195px;
              overflow: hidden;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 4px;
              img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: all 0.3s 0.1s;
                &:hover {
                  transform: scale(1.3);
                }
              }
            }
            > div:nth-child(3n) {
              margin-right: 0;
            }
          }
          .video {
            position: relative;
            overflow: hidden;
            img {
              width: 100%;
              height: 100%;
              max-height: 300px;
              object-fit: cover;
            }
            .rel-play {
              position: absolute;
              top: 0;
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              i {
                font-size: 50px;
                color: #666;
                border: 3px solid #666;
                background: #dedede;
                border-radius: 50px;
                cursor: pointer;
                &:hover {
                  opacity: 0.8;
                }
              }
            }
          }
          .voice {
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
          .title-name {
            margin-top: 14px;
            color: #000;
            background: #fed980;
            padding: 5px 15px;
            border-radius: 50px;
            display: inline-block;
            img {
              position: relative;
              top: 4px;
              margin-right: 5px;
              width: 20px;
              height: 20px;
            }
          }
          .contents {
            margin-top: 10px;
            max-width: 600px;
            width: 100%;
            word-wrap: break-word;
            span {
              float: right;
              margin: -15px 15px 0 0;
              color: #3b9cf8;
              font-size: 14px;
              cursor: pointer;
              transition: all 0.1s;
              &:hover {
                opacity: 0.8;
              }
              &:active {
                opacity: 1;
              }
            }
          }
          .poi {
            margin-top: 19px;
            color: #3b9cf8;
            cursor: block;
            img {
              width: 12px;
              height: 16px;
              margin-right: 8px;
            }
          }
        }
        .source {
          margin-top: 40px;
          width: 606px;
          overflow: hidden;
          > div:nth-child(1) {
            // padding-right: 5px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            > div:nth-child(1) {
              display: flex;
              img {
                width: 38px;
                height: 38px;
                border-radius: 4px;
                margin-right: 14px;
              }
              > div {
                > div:nth-child(1) {
                  font-size: 14px;
                }
                > div:nth-child(2) {
                  margin-top: 2px;
                  font-size: 12px;
                  color: #999;
                }
              }
            }
            > div:nth-child(2) {
              display: flex;
              > div:nth-child(1) {
                border: 1px solid #ccc;
                width: 104px;
                height: 26px;
                line-height: 26px;
                text-align: center;
                margin-right: 28px;
                font-size: 14px;
                color: #999;
              }
              > div:nth-child(2),
              > div:nth-child(3),
              > div:nth-child(4) {
                border: 1px solid #ccc;
                width: 44px;
                height: 26px;
                line-height: 26px;
                text-align: center;
                background: #fff;
                font-size: 14px;
                color: #333;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              > div:nth-child(2),
              > div:nth-child(3) {
                border-right: 0;
                img {
                  margin-right: 5px;
                }
                > div {
                  margin-top: 3px;
                }
              }
            }
          }
          > div:nth-child(2) {
            background: #ddd;
            width: 100%;
            margin-top: 10px;
            color: #666;
            font-size: 14px;
            .zfrom {
              padding: 5px;
            }
            .msgs {
              word-wrap: break-word;
              margin: 5px;
            }
            span {
              color: #409eff;
            }
            .title-name {
              margin-top: 14px;

              background: #fed980;
              padding: 5px 15px;
              border-radius: 50px;
              display: inline-block;
              span {
                color: #000 !important;
              }
              img {
                position: relative;
                top: 4px;
                margin-right: 5px;
                width: 20px;
                height: 20px;
              }
            }
          }
          .imgs {
            margin-top: 16px;
            display: flex;
            flex-wrap: wrap;
            > div {
              cursor: pointer;
              margin: 0 5px 5px 0;
              width: 198.5px;
              height: 200px;
              border-radius: 4px;
              overflow: hidden;
              img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: all 0.3s 0.1s;
                &:hover {
                  transform: scale(1.3);
                }
              }
            }
            > div:nth-child(3n) {
              margin-right: 0;
            }
          }
          .video {
            position: relative;
            overflow: hidden;
            img {
              width: 100%;
              height: 100%;
              max-height: 300px;
              object-fit: cover;
            }
            .rel-play {
              position: absolute;
              top: 0;
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              i {
                font-size: 50px;
                color: #666;
                border: 3px solid #666;
                background: #dedede;
                border-radius: 50px;
                cursor: pointer;
                &:hover {
                  opacity: 0.8;
                }
              }
            }
          }

          .contents {
            margin-top: 14px;
            display: block;
            width: 600px;
            span {
              float: right;
              margin: -15px 15px 0 0;
              color: #3b9cf8;
              font-size: 14px;
              cursor: pointer;
              transition: all 0.1s;
              &:hover {
                opacity: 0.8;
              }
              &:active {
                opacity: 1;
              }
            }
          }
        }
      }
      > div:last-child {
        border-bottom: 0;
      }
    }
    .collect-box {
      padding: 0 0 0 42px;
      // width: 704px;
      height: calc(100%);
      overflow-y: auto;
      // width: calc(100% - 87px);
      border-radius: 0 8px 8px 0;
      background: #fff;
      color: #333;
      font-size: 16px;
      .collect-title {
        display: flex;
        margin-right: 45px;
        align-items: center;
        justify-content: space-between;
        margin-top: 21px;
        > div:nth-child(1) {
          position: relative;
          height: 50px;
          width: 530px;
          overflow-x: auto;
          display: flex;
          align-items: center;
          > span {
            padding: 8px 14px;
            font-size: 14px;
            border-radius: 4px;
            background: #fff;
            white-space: nowrap;
            border: 1px solid #ccc;
            margin-right: 10px;
            cursor: pointer;
            transition: all 0.1s;
            &:active {
              opacity: 1;
            }
          }
          .active {
            background: #3b9cf8;
            border-color: #3b9cf8;
            color: #fff;
          }
          .removeflg {
            position: relative;
            width: 100%;
            height: 0;
            > div {
              position: absolute;
              top: -32px;
              right: -18px;
              background: red;
              color: #fff;
              width: 15px;
              height: 15px;
              line-height: 15px;
              text-align: center;
              border-radius: 15px;
              cursor: pointer;
              transition: all 0.1s;
              user-select: none;
              &:hover {
                opacity: 0.8;
              }
              &:active {
                opacity: 1;
              }
            }
          }
          > span:nth-child(1) .removeflg {
            display: none;
          }
        }
        > div:nth-child(2) {
          &::before {
            content: "";
            margin-right: 20px;
            border-left: solid 1px #e2e2e2;
          }
          span {
            user-select: none;
            cursor: pointer;
            transition: all 0.1s;
            &:hover {
              opacity: 0.8;
            }
            &:active {
              opacity: 1;
            }
          }
        }
      }
      .collect-content {
        height: calc(100% - 81px);
        width: 626px;
        overflow-y: auto;
        padding: 10px 40px 0 0;
        font-size: 16px;
        > div {
          border: solid 1px #ccc;
          border-radius: 4px;
          margin-bottom: 20px;
          padding: 16px 14px;
          .info-title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            > div:nth-child(1) {
              display: flex;
              img {
                width: 28px;
                height: 28px;
                border-radius: 4px;
                margin-right: 11px;
              }
            }
            > div:nth-child(2) {
              color: #999;
              font-size: 12px;
              display: flex;
              align-items: center;
              height: 28px;
              line-height: 28px;
              cursor: pointer;
              transition: all 0.2s;
              &:hover {
                color: #666;
              }
              &:active {
                color: #333;
              }
              > div:nth-child(1) {
                > span {
                  font-size: 14px;
                  &::after {
                    content: "、";
                  }
                }
                > span:last-child {
                  &::after {
                    content: "";
                  }
                }
              }
              i {
                margin: 10px;
                position: relative;
                top: 1px;
              }
            }
          }
          .imgs {
            margin-top: 16px;
            display: flex;
            flex-wrap: wrap;
            > div {
              cursor: pointer;
              margin: 0 5px 5px 0;
              width: 189px;
              height: 193px;
              overflow: hidden;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 4px;
              img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: all 0.3s 0.1s;
                &:hover {
                  transform: scale(1.3);
                }
              }
            }
            > div:nth-child(3n) {
              margin-right: 0;
            }
          }
          .video {
            position: relative;
            overflow: hidden;
            img {
              width: 100%;
              height: 100%;
              max-height: 300px;
              object-fit: cover;
            }
            .rel-play {
              position: absolute;
              top: 0;
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              i {
                font-size: 50px;
                color: #666;
                border: 3px solid #666;
                background: #dedede;
                border-radius: 50px;
                cursor: pointer;
                &:hover {
                  opacity: 0.8;
                }
              }
            }
          }
          .voice {
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
          .title-name {
            margin-top: 14px;
            color: #000;
            background: #fed980;
            padding: 5px 15px;
            border-radius: 50px;
            display: inline-block;
            img {
              position: relative;
              top: 4px;
              margin-right: 5px;
              width: 20px;
              height: 20px;
            }
          }
          .contents {
            margin-top: 14px;
            max-width: 600px;
            width: 100%;
            word-wrap: break-word;
            span {
              float: right;
              margin: -15px 15px 0 0;
              color: #3b9cf8;
              font-size: 14px;
              cursor: pointer;
              transition: all 0.1s;
              &:hover {
                opacity: 0.8;
              }
              &:active {
                opacity: 1;
              }
            }
          }
          .date {
            font-size: 12px;
            color: #999;
            margin-top: 20px;
          }
        }
        .removeflg {
          position: relative;
          width: 100%;
          height: 0;
          > div {
            position: absolute;
            top: -25px;
            right: -18px;
            background: red;
            color: #fff;
            width: 15px;
            height: 15px;
            line-height: 15px;
            text-align: center;
            border-radius: 15px;
            cursor: pointer;
            transition: all 0.1s;
            user-select: none;
            &:hover {
              opacity: 0.8;
            }
            &:active {
              opacity: 1;
            }
          }
        }
      }
    }
  }
  .dialogs {
    .trinoteRelay {
      .trinoteRelay-box {
        text-align: center;
        > div:nth-child(1) {
          font-size: 18px;
        }
        > div:nth-child(2) {
          margin-top: 10px;
          font-size: 14px;
          color: #999;
          span {
            color: #409eff;
          }
        }
        .el-textarea {
          margin-top: 30px;
          .el-textarea__inner {
            resize: none;
            height: 150px;
          }
        }
        .el-button {
          margin-top: 40px;
          width: 60%;
        }
      }
    }
    .videoDialog {
      .el-dialog {
        // margin-top: 0 !important;
        // width: 90%;
        // height: 100%;
        // overflow: auto;
        // margin: 0 auto;
        background: rgba(0, 0, 0, 0.8);
      }
      .el-dialog__headerbtn {
        z-index: 1;
      }
      .el-icon-close {
        color: #fff;
        &:hover {
          opacity: 0.7;
        }
      }
      .el-dialog__header,
      .el-dialog__body {
        padding: 0;
      }
      video {
        height: 75vh;
        width: 100%;
      }
    }
    .travelInfo {
      .el-dialog {
        margin-top: 5vh !important;
      }
      .el-dialog__header {
        padding: 40px 20px 10px;
        border-bottom: 1px solid #ccc;
      }
      .el-dialog__body {
        padding: 0;
      }
      .info-box-label {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 11px 20px 7px 20px;
        background: #f9f9f9;
        color: #999;
        span {
          color: #3b9cf8;
          margin-left: 20px;
        }
        i {
          font-size: 14px;
        }
      }
      .unloading {
        margin-top: 20px;
        text-align: center;
        min-height: 300px;
      }
      .travelInfo-box {
        padding: 12px 20px;
        .info-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          > div:nth-child(1) {
            font-size: 16px;
            display: flex;
            img {
              width: 38px;
              height: 38px;
              border-radius: 4px;
              margin-right: 11px;
            }
          }
        }
        .imgs {
          margin-top: 16px;
          display: flex;
          flex-wrap: wrap;
          > div {
            cursor: pointer;
            margin: 0 5px 5px 0;
            width: 189px;
            height: 193px;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              transition: all 0.3s 0.1s;
              &:hover {
                transform: scale(1.3);
              }
            }
          }
          > div:nth-child(3n) {
            margin-right: 0;
          }
        }
        .video {
          position: relative;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
            max-height: 300px;
            object-fit: cover;
          }
          .rel-play {
            position: absolute;
            top: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            i {
              font-size: 50px;
              color: #666;
              border: 3px solid #666;
              background: #dedede;
              border-radius: 50px;
              cursor: pointer;
              &:hover {
                opacity: 0.8;
              }
            }
          }
        }
        .voice {
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
        .title-name {
          margin-top: 14px;
          color: #000;
          background: #fed980;
          padding: 5px 15px;
          border-radius: 50px;
          display: inline-block;
          img {
            position: relative;
            top: 4px;
            margin-right: 5px;
            width: 20px;
            height: 20px;
          }
        }
        .contents {
          margin-top: 14px;
          max-width: 600px;
          width: 100%;
          word-wrap: break-word;
          font-size: 16px;
        }
        .date {
          margin-top: 30px;
          display: flex;
          justify-content: space-between;
          color: #999;
          > div:nth-child(1) {
            font-size: 12px;
          }
          > div:nth-child(2) {
            i {
              font-size: 16px;
              cursor: pointer;
              &:hover {
                opacity: 0.8;
              }
              &:active {
                color: #666;
              }
            }
          }
        }
      }
    }
    .addTagDialog {
      .el-dialog__header {
        // padding: 40px 20px 10px;
        border-bottom: 1px solid #ccc;
        color: #333;
      }
      .el-dialog__body {
        padding: 0;
      }
      .addTag-box {
        padding: 30px 20px;
        .addTag-tag {
          display: flex;
          flex-wrap: wrap;
          > span {
            position: relative;
            white-space: nowrap;
            border: 1px solid #ccc;
            padding: 8px 14px;
            margin: 17px 17px 0 0;
            border-radius: 4px;
            .removeflg {
              position: relative;
              width: 100%;
              height: 100%;
              > div {
                position: absolute;
                top: -32px;
                right: -18px;
                background: red;
                color: #fff;
                width: 15px;
                height: 15px;
                line-height: 15px;
                text-align: center;
                border-radius: 15px;
                cursor: pointer;
                transition: all 0.1s;
                user-select: none;
                &:hover {
                  opacity: 0.8;
                }
                &:active {
                  opacity: 1;
                }
              }
            }
          }
        }
        .addTag-btn {
          margin-top: 30px;
          text-align: right;
        }
      }
    }
  }
}

.bg-d {
  background: #ddd;
}
.null-tit {
  text-align: center;
  color: #999;
  margin-top: 30px;
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