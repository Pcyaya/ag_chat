<template>
  <div class="trip">
    <Loading v-if="loadingDiv" style="opacity:.7"></Loading>
    <div class="trip-top">
      <div>
        行程安排
        <span>（{{total == '' ? 0:total}}条）</span>
      </div>
      <div>
        <!-- <el-dropdown trigger="click">
                    <span class="el-dropdown-link">
                        <i class="el-icon-arrow-down"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item class="clearfix">
                        <span @click="ClearBtn">一键清空</span>
                        </el-dropdown-item>
                        <el-dropdown-item class="clearfix">
                        <span @click="DateClear">清除已过期行程</span>
                        </el-dropdown-item>
                    </el-dropdown-menu>
        </el-dropdown>-->
      </div>
    </div>
    <div class="trip-box">
      <!-- <div v-if="listTripData==null" class="title">暂无行程安排！</div> -->
      <div class="trip-box-left" ref="tripView">
        <div v-for="(item,index) in listTripData" :key="index" class="item-div" :class="{'btn-act': btnIndex == index}"  @click="GetInfoTrip(item),btnIndex = index">
          <div>
            <div class="trip-box-title">{{item.title}}</div>
            <div>
              <span>{{$base.timestampToTime(item.rgm_date)}}</span>  
              <span class="trip-box-item">来源：{{item.rg_name}}</span> 
            </div>
          </div>
          <div class="trip-box-content">
            <div v-for="(childItem, i) in item.routedists" :key="i" :class="{'col_9':Date.now()>childItem.date}">
              <div>{{$base.tampToTime(childItem.date, 4)}}</div>
              <div>{{childItem.content}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="trip-box-right"  v-if="JSON.stringify(infoTripData) !== '{}'">
        <div v-if="infoTripData.other === ''" style="text-align:center;">
          <i class="el-icon-loading"></i> 加载中...
        </div>
        <div v-else>
          <div class="infoTrip-title">
            <div>标题：{{infoTripData.other.title}}</div>
            <div>
              <div>发布时间：{{$base.tampToTime(infoTripData.other.rgm_date)}}</div>
              <div>来源：{{from}}</div>
            </div>
          </div>
          <div class="infoTrip-content">
            <div v-for="(item, index) in infoTripData.resData" :key="index">
              <div class="dateY">
                <span>{{$base.tampToTime(item[0].date, 5)}}</span>
                <div class="rel-hr"></div>
              </div>
              <div v-for="(childItem, len) in item" :key="len" class="item-content">
                <div>{{$base.tampToTime(childItem.date, 4)}}</div>
                <div :class="{'col_9':Date.now()>childItem.date}">{{childItem.content}}</div>
              </div>
            </div>
          </div>
          <div class="trip-del">
            <div v-if="infoTripData.data[infoTripData.data.length-1].date>Date.now() && guide_flg == 2"><i @click="GetEditTrip"  class="el-icon-edit-outline i-btn"></i></div>
            <div><i @click="GetDelTrip(infoTripData.rgm_num)" class="el-icon-delete i-btn"></i></div>
          </div>
        </div>
      </div>
    </div>
    <div class="dialogs">
      <!-- 行程安排详情 -->
      <div class="infoTrip">
        <el-dialog :visible.sync="dialogVisible.infoTrip">
          <div class="infoTrip-box">
            <div class="top">
              <div>行程安排详情</div>
              <!-- <div><i @click="GetDelTrip(infoTripData.rgm_num)" class="el-icon-delete"></i></div> -->
              <div class="cur">
                <i @click="dialogVisible.infoTrip = false" class="el-icon-error"></i>
              </div>
            </div>
            <div v-if="JSON.stringify(infoTripData) === '{}'" style="text-align:center;">
              <i class="el-icon-loading"></i> 加载中...
            </div>
            <div v-else>
              <div>
                <div>{{infoTripData.other.title}}</div>
                <div>{{$base.timestampToTime(infoTripData.other.rgm_date)}}</div>
              </div>
              <el-table
                :data="infoTripData.data"
                :row-class-name="tableRowClassName"
                border
                style="width: 100%;"
              >
                <el-table-column align="center" prop="nyr" label="日期" width="100"></el-table-column>
                <el-table-column align="center" prop="time" width="100" label="时间"></el-table-column>
                <el-table-column align="center" prop="content" label="活动内容"></el-table-column>
              </el-table>
            </div>
            <div v-if="guide_flg == 2 && JSON.stringify(infoTripData) !== '{}'">
              <div
                class="auto"
                @click="GetEditTrip"
                v-if="infoTripData.data[infoTripData.data.length-1].date>Date.now()"
              >编辑行程安排</div>
              <div class="dis" title="无法编辑已过期行程" v-else>编辑行程安排</div>
            </div>
          </div>
        </el-dialog>
      </div>
      <!-- 编辑行程 -->
      <div class="addTrip">
        <el-dialog :visible.sync="dialogVisible.editTrip">
          <div class="addTrip-box" v-if="editTripData.title != undefined">
            <div class="top">
              <div>编辑行程安排</div>
              <div class="cur">
                <img @click="GetRoutedistTrip(editTripData)" :src="icon.share" alt>
              </div>
            </div>
            <div>
              <div>
                <span>标题</span>
                <input v-model="editTripData.title" maxlength="20" type="text">
              </div>
              <div>
                <el-date-picker
                  v-model="editTripData.date"
                  type="date"
                  align="center"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                  @change="changeTripDate(editTripData.list, editTripData.date)"
                  :picker-options="pickerOption"
                ></el-date-picker>
              </div>
              <div>
                <div v-for="(item,index) in editTripData.list[editTripData.date]" :key="index">
                  <div>
                    <el-time-picker
                      v-model="item.time"
                      format="HH:mm"
                      value-format="HH:mm"
                      @change="changeTime(item.time)"
                      @blur="changeTime(item.time)"
                      :disabled="disab(item.date)"
                      placeholder="选择时间"
                    ></el-time-picker>
                  </div>
                  <div>
                    <img :src="icon.divider" alt>
                  </div>
                  <div>
                    <el-input v-model="item.content" maxlength="100" :disabled="disab(item.date)" placeholder="内容"></el-input>
                  </div>
                  <div class="xz">(限：{{100-item.content.length}})</div>
                  <div style="margin-right:4px;">
                    <i
                      style="cursor:pointer;"
                      @click="closeAddInput(editTripData.list[editTripData.date],index)"
                      class="el-icon-circle-close"
                    ></i>
                  </div>
                </div>
              </div>
              <div v-for="item in proList" :key="item.id"></div>
            </div>
            <div>
              <img
                @click="addInput(editTripData.list, editTripData.date)"
                class="cur"
                :src="icon.add_arrang"
                alt
              >
            </div>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from "../../loading/loading";
export default {
  data() {
    return {
      loginVisitor: {},
      listTripData: [],
      icon: {
        divider: this.OSSIMG + "icon_divider11.png",
        add_arrang: this.OSSIMG + "icon_add_arrangement.png", //添加行程table
        share: this.OSSIMG + "icon_share2.png" //发送行程
      },
      dialogVisible: {
        infoTrip: false,
        editTrip: false
      },
      infoTripData: {},
      rgm_num: "",
      guide_flg: 0,
      editTripData: {}, //编辑行程
      proList: [],
      pickerOption: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
        }
      },
      page: 1,
      loadingDiv: true,
      total: "",
      btnIndex: -1,
    };
  },
  props: ["routeNav"],
  components: {
    Loading
  },
  watch: {
    routeNav() {
      if (this.routeNav == "trip") {
        this.loadingDiv = true;
        this.listTripData = [];
        this.page = 1;
        this.GetRoutedists();
      }
    },
    "dialogVisible.editTrip"() {
      setTimeout(() => {
        this.moveDiv("addTrip");
      }, 0);
      if (this.dialogVisible.editTrip == false) {
        setTimeout(() => {
          $(".addTrip .el-dialog").css({ top: 0, left: 50 });
        }, 300);
      }
    },
    "dialogVisible.infoTrip"() {
      setTimeout(() => {
        this.moveDiv("infoTrip");
      }, 0);
      if (this.dialogVisible.infoTrip == false) {
        setTimeout(() => {
          $(".infoTrip .el-dialog").css({ top: 0, left: 50 });
        }, 300);
      }
    }
  },
  mounted() {
    const that = this;
    let loginVisitor = localStorage.getItem("loginVisitor");
    if (loginVisitor == "" || loginVisitor == null) {
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
      // this.GetRoutedists() //行程列表（团外）
    }
  },
  methods: {
    EventFn() {
      const that = this;
      if (
        that.$refs.tripView.scrollTop + this.$refs.tripView.offsetHeight >=
        that.$refs.tripView.scrollHeight
      ) {
        this.page++;
        this.GetRoutedists();
      }
    },
    GetRoutedists() {
      this.loadingDiv = true;
      const that = this;
      if (JSON.stringify(that.$refs) != "{}") {
        that.$refs.tripView.removeEventListener("scroll", that.EventFn, false);
      }
      $.ajax({
        url: this.urlHost + "visitor/routedists",
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
              if (this.page == 1) {
                this.listTripData = res.obj.data;
              } else {
                for (let i = 0; i < res.obj.data.length; i++) {
                  this.listTripData.push(res.obj.data[i]);
                }
              }
              that.$refs.tripView.addEventListener(
                "scroll",
                that.EventFn,
                false
              );
            } else {
              that.$message("暂无更多行程安排！");
              that.$refs.tripView.removeEventListener(
                "scroll",
                that.EventFn,
                false
              );
            }
            // if (this.listTripData != null) {
            //   for (let i in this.listTripData) {
            //     if (this.listTripData[i].routedists.length == 2) {
            //       this.listTripData[i].routedists.push([]);
            //     } else if (this.listTripData[i].routedists.length == 1) {
            //       this.listTripData[i].routedists.push([]);
            //       this.listTripData[i].routedists.push([]);
            //     }
            //     for (let j in this.listTripData[i].routedists) {
            //       this.listTripData[i].routedists[
            //         j
            //       ].nyr = this.$base.tampToTime(
            //         this.listTripData[i].routedists[j].date,
            //         2
            //       );
            //       this.listTripData[i].routedists[
            //         j
            //       ].time = this.$base.tampToTime(
            //         this.listTripData[i].routedists[j].date,
            //         1
            //       );
            //     }
            //   }
            // }
          } else {
            this.$base.err(res, this);
          }
        },
        error: err => {
          console.log(err);
          this.loadingDiv = false;
          this.$message({
            message: "网络异常！",
            type: "error"
          });
        }
      });
    },
    //删除行程安排
    GetDelTrip(rgm_num) {
      this.$confirm("自己创建的行程安排，删除后，相应的团中的行程安排也会被删除，非自己创建的行程安排，删除，不影响原团中的行程安排？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          $.ajax({
            url: this.urlHost + "visitor/routedist/del",
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
                  type: "success"
                });
                this.total--;
                this.listTripData.splice(this.btnIndex, 1);
                this.btnIndex = -1;
                this.infoTripData = {};
              } else {
                this.$base.err(res, this);
              }
            },
            error: err => {
              console.log(err);
            }
          });
        })
        .catch(() => {});
    },
    //行程安排详情
    GetInfoTrip(rsobj) {
      if (rsobj.rgm_num !== this.rgm_num) {
        this.infoTripData.other = '';
        this.$forceUpdate();
      }
      this.rgm_num = rsobj.rgm_num;
      if(rsobj.rg_name){
        this.from = rsobj.rg_name;
      }
      $.ajax({
        url: this.urlHost + "visitor/routedist/details",
        type: "post",
        data: {
          access_token: this.loginVisitor.access_token,
          rgm_num: rsobj.rgm_num,
          read: 1
        },
        dataType: "json",
        success: res => {
          if (res.success === "00000000") {
            this.infoTripData = res.obj;
            let data = res.obj.data;
            let obj = {};
            for (let i in data) {
              let Y = this.$base.tampToTime(data[i].date, 5);
              obj[Y] = [];
            }
            for (let i in data) {
              let Ye = this.$base.tampToTime(data[i].date, 5);
              for (let j in obj) {
                if (j == Ye) {
                  obj[j].push(data[i]);
                }
              }
            }
            this.infoTripData.resData = obj;
            for (let i in this.infoTripData.data) {
              this.infoTripData.data[i].nyr = this.$base.tampToTime(
                this.infoTripData.data[i].date,
                2
              );
              this.infoTripData.data[i].time = this.$base.tampToTime(
                this.infoTripData.data[i].date,
                1
              );
            }
            this.guide_flg = rsobj.guide_flg;
          } else {
            this.$base.err(res, this);
          }
        },
        error: err => {
          console.log(err);
        }
      });
    },
    //编辑行程
    GetEditTrip() {
      let cloneData = this.$base.objDeepCopy(this.infoTripData);
      // console.log(this.infoTripData)
      this.editTripData = {
        rgm_num: cloneData.other.rgm_num,
        title: cloneData.other.title,
        routedists: cloneData.data,
        date: this.$base.tampToTime(cloneData.data[0].date, 2),
        list: {}
      };

      for (let i in this.editTripData.routedists) {
        this.editTripData.list[
          this.$base.tampToTime(this.editTripData.routedists[i].date, 2)
        ] = [];
      }
      for (let i in this.editTripData.routedists) {
        let strDate = this.$base.tampToTime(
          this.editTripData.routedists[i].date,
          2
        );
        for (let j in this.editTripData.list) {
          if (j == strDate) {
            this.editTripData.list[strDate].push(
              this.editTripData.routedists[i]
            );
          }
        }
      }
      // console.log(this.editTripData)
      this.dialogVisible.editTrip = true;
    },
    disab(date) {
      if (Date.now() < date || date == "") {
        return false;
      } else {
        return true;
      }
    },
    closeAddInput(date, index) {
      date[index].date = "";
      date.splice(index, 1);
      this.$forceUpdate();
    },
    //修改时间
    changeTime(time) {
      // console.log(time)
      this.proList.push(1);
    },
    //修改日期
    changeTripDate(obj, date) {
      this.proList.push(1);
      if (obj[date] == undefined) {
        obj[date] = [];
        for (let i = 0; i < 4; i++) {
          obj[date].push({
            title: "",
            content: "",
            date: "",
            end: 0,
            warn: 0,
            warn_flg: 0,
            nyr: date,
            time: ""
          });
        }
      }
    },
    //新增input框
    addInput(obj, date) {
      // console.log(obj)
      obj[date].push({
        title: "",
        content: "",
        date: "",
        end: 0,
        warn: 0,
        warn_flg: 0,
        nyr: date,
        time: ""
      });
      this.proList.push(1);
    },
    //编辑行程安排
    GetRoutedistTrip(data) {
      let objData = data;
      if (data.title == "") {
        this.$message({
          message: "标题不可为空！",
          type: "error"
        });
      } else {
        objData.routedists = [];
        for (let i in data.list) {
          for (let j in data.list[i]) {
            if (
              (data.list[i][j].time != "" || data.list[i][j].time != null) &&
              data.list[i][j].content != ""
            ) {
              data.list[i][j].title = data.title;
              data.list[i][j].date = this.$base.timeToTamp(
                data.list[i][j].nyr + " " + data.list[i][j].time
              );
              if (!isNaN(data.list[i][j].date)) {
                objData.routedists.push(data.list[i][j]);
              }
            }
          }
        }
        for (let k in objData.routedists) {
          delete objData.routedists[k].nyr;
          delete objData.routedists[k].time;
          delete objData.routedists[k].id;
        }
        if (objData.routedists.length < 1) {
          this.$message({
            message: "至少添加一条行程！",
            type: "error"
          });
        } else {
          // console.log((objData.routedists))
          $.ajax({
            url: this.urlHost + "visitor/routedist/edit",
            type: "post",
            data: {
              access_token: this.loginVisitor.access_token,
              rgm_num: objData.rgm_num,
              title: objData.title,
              routedists: JSON.stringify(objData.routedists)
            },
            dataType: "json",
            success: res => {
              if (res.success === "00000000") {
                this.$message({
                  message: res.msg,
                  type: "success"
                });
                objData.guide_flg = this.guide_flg;
                this.GetInfoTrip(objData);
                console.log(objData)
                this.page = 1;
                this.GetRoutedists();
                this.dialogVisible.editTrip = false;
              } else {
                this.$base.err(res, this);
              }
            },
            error: err => {
              console.log(err);
            }
          });
        }
      }
    },
    //一键清空
    ClearBtn() {
      this.$confirm("确认是否一键清空行程？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // this.$message({
          //     type: 'success',
          //     message: '已清空'
          // })
        })
        .catch(() => {});
    },
    //清空已过期
    DateClear() {
      this.$confirm("确认是否清空过期行程？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // this.$message({
          //     type: 'success',
          //     message: '已清空'
          // })
        })
        .catch(() => {});
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.date < Date.now()) {
        return "warning-row";
      }
    },
    moveDiv(dom) {
      let _move = false; //移动标记
      let _x, _y; //鼠标离控件左上角的相对位置
      $("." + dom + " .el-dialog .top")
        .click(function() {})
        .mousedown(function(e) {
          _move = true;
          _x = e.pageX - parseInt($("." + dom + " .el-dialog").css("left"));
          _y = e.pageY - parseInt($("." + dom + " .el-dialog").css("top"));
          // $(".addTrip .el-dialog").fadeTo(20, 0.3);//点击后开始拖动并透明显示
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
    }
  }
};
</script>

<style lang="less">
@keyframes mycont {
  from {
    transform: rotateX(90deg) scale(0) translateY(-50px);
  }
  to {
    transform: rotate(0deg) scale(1) translateY(0px);
  }
}
.trip {
  position: relative;
  background: #f3f3f3;
  // width: 1004px;
  height: 100%;
  border-radius: 0 8px 8px 0;
  .trip-top {
    padding: 15px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ccc;
    > div:nth-child(1) {
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
  .trip-box {
    position: relative;
    // background: red;
    flex: 1;
    height: calc(100% - 52px);
    display: flex;
    .trip-box-left {
      position: relative;
      height: 100%;
      width: 450px;
      overflow-y: auto;
      .trip-box-title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-right: 5px;
      }
      .trip-box-item {
        text-align: right;
        width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-right: 5px;
      }
      .item-div {
        // width: 430px;
        margin: 20px;
        border: 1px solid #ccc;
        background: #fff;
        border-radius: 4px;
        font-size: 16px;
        transition: all .2s;
        cursor: pointer;
        > div:nth-child(1) {
          padding: 13px;
          > div:nth-child(2) {
            margin-top: 6px;
            font-size: 12px;
            color: #999;
            >span:nth-child(2) {
              margin-left: 20px;
            }
          }
        }
        .el-table {
          border-radius: 0 0 8px 8px;
          color: #333;
          .el-table__row td:nth-child(3) {
            text-align: left;
          }
        }
      }
      .btn-act {
        background: #f9f9f9;
        opacity: .9;
      }
      .trip-box-content {
        padding: 20px 15px;
        font-size: 14px;
        color: #333;
        border-top: 1px solid #ccc;
        > div {
          > div:nth-child(2) {
            margin: 8px 0 22px 0;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
        > div:last-child {
          > div:nth-child(2) {
            margin-bottom: 0;
          }
        }
        .col_9 {
          color: #999;
        }
      }
    }
    .trip-box-right {
      background: #f9f9f9;
      min-width: 370px;
      // height: 100%;
      border-radius: 0 0 8px 0;
      overflow-y: auto;
      flex: 1;
      padding: 20px 25px;
      font-size: 16px;
    }
    .infoTrip-title {
      >div:nth-child(2) {
        font-size: 12px;
        margin-top: 14px;
        color: #999;
        >div:nth-child(2) {
          margin-top: 7px;
        }
      }
    }
    .infoTrip-content {
      .dateY {
          position: relative;
          text-align: center;
          margin: 25px 0;
          .rel-hr {
            position: absolute;
            top: 11px;
            border-bottom: 1px solid #e2e2e2;
            width: calc(100% - 40px);
            z-index: 1;
          }
          > span {
            position: relative;
            z-index: 2;
            background: #f9f9f9;
            padding: 0 10px;
            color: #ccc;
            font-size: 12px;
          }
        }
        .item-content {
          // padding: 20px 15px;
          font-size: 14px;
          color: #333;
          > div:nth-child(1) {
            color: #999;
          }
          > div:nth-child(2) {
            margin: 8px 0 22px 0;
            word-break: break-all;
            white-space: pre-wrap;
          }
          > div:last-child {
            > div:nth-child(2) {
              margin-bottom: 0;
            }
          }
          .col_9 {
            color: #999;
          }
        }
    }
    .trip-del {
      margin-top: 50px;
      display: flex;
      justify-content: flex-end;
      >div:nth-child(2) {
        margin-left: 13px;
      }
      i{
        color: #999;
      }
      .i-btn{
        cursor: pointer;
        transition: all .2s;
        &:hover {
          color: #3b9cf8;
        }
      }
    }
  }
  .dialogs {
    .addTrip {
      .el-dialog__headerbtn {
        display: none;
      }
      .el-dialog__wrapper {
        display: flex;
        align-items: center;
      }
      .el-dialog__header,
      .el-dialog__body {
        padding: 0;
      }
      .el-dialog {
        width: 500px;
        height: 650px;
        background: #f9f9f9;
        position: relative !important;
        top: 0;
        left: 50px;
      }
      .addTrip-box {
        font-size: 16px;
        color: #333;
        > div:nth-child(1) {
          display: flex;
          justify-content: space-between;
          padding: 15px 24px;
          background: #fff;
          cursor: move;
        }
        > div:nth-child(2) {
          border-top: 1px solid #ccc;
          height: 440px;
          overflow-y: auto;
          padding: 30px 24px;
          > div:nth-child(1) {
            border: 1px solid #ccc;
            background: #fff;
            height: 36px;
            line-height: 36px;
            span {
              padding: 0 16px;
              border-right: 1px solid #ccc;
            }
            input {
              margin-left: 16px;
              width: 350px;
              height: 24px;
              border: 0;
              outline: none;
            }
          }
          > div:nth-child(2) {
            margin: 20px 0;
            .el-date-editor.el-input,
            .el-date-editor.el-input__inner {
              width: 100%;
            }
          }
          > div:nth-child(3) {
            > div {
              border: 1px solid #ccc;
              border-bottom: 0;
              display: flex;
              align-items: center;
              height: 72px;
              img {
                width: 9px;
                height: 42px;
              }
              input {
                border: 0;
                background: #f9f9f9;
              }
              > div:nth-child(1) {
                .el-date-editor.el-input,
                .el-date-editor.el-input__inner {
                  width: 120px;
                }
              }
              > div:nth-child(3) {
                margin-left: 30px;
              }
            }
            > div:last-child {
              border-bottom: 1px solid #ccc;
            }
          }
        }
        > div:nth-child(3) {
          height: 84px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .xz {
          font-size: 12px;
          margin: 0 10px;
        }
      }
    }
  }
}
.warning-row {
  color: #ccc !important;
}
.title {
  position: relative;
  left: 400px;
  color: #999;
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
