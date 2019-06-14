<template>
  <div class="evaluation">
    <div class="evaluation-top">
      <div>
        评价
        <span>（{{listYoutoMeData.total}}条/{{listYoutoMeData.group_total}}个团）</span>
      </div>
      <div>
        <!-- <div>导出Word</div>
        <div>删除</div>-->
      </div>
    </div>
    <div class="evaluation-box">
      <Loading v-if="loadingDiv" style="opacity:.7"></Loading>
      <p v-if="listYoutoMeData.total == 0">暂无评论！</p>
      <div v-for="(item, index) in listYoutoMeData.data" :key="index" class="evaluation-item">
        <div class="from">来源：{{item.rg_name}}（{{item.comment_amount}}条/{{item.mem_amount}}人）</div>
        <div
          class="metoyou"
          v-for="(item1, index) in listYoutoMeData.data[index].comments"
          :key="index"
        >
          <div>
            <img v-if="item1.reply_icon != ''" :src="head_icon+item1.reply_icon" alt>
            <img v-else :src="icon.firendHead" alt>
            <div>
              <div>{{item1.reply_name}}</div>
              <div>
                <span>{{$base.timestampToTime(item1.date)}}</span>
              </div>
            </div>
          </div>
          <div>
            <div class="box-star">
              <img v-for="num in item1.star" :key="num.index" :src="icon.evaluation_click" alt>
              <img
                v-for="num in (5-item1.star)"
                :key="num.index"
                :src="icon.evaluation_default"
                alt
              >
            </div>
            <div class="box-flag" v-if="item1.tags != null">
              <div v-for="flag in item1.tags" :key="flag.val">{{flag.name}}</div>
            </div>
            <div class="box-content">{{item1.content}}</div>
            <div class="box-replys" v-if="item1.replys!=null">
              <div v-for="(reply,len) in item1.replys" :key="len">
                <div>
                  <span>{{reply.name}}</span>回复：
                </div>
                <div>{{reply.content}}</div>
              </div>
            </div>
          </div>
        </div>
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
      baseinfo: {},
      listMetoYouData: {}, //我对他人的评价
      listYoutoMeData: {}, //他人对我的评价
      icon: {
        evaluation_click: this.OSSIMG + "icon_evaluation_click.png",
        evaluation_default: this.OSSIMG + "icon_evaluation_default.png",
        load: this.OSSIMG + "icon_send_loading.gif",
        firendHead: this.OSSIMG + "icon_head1.png"
      },
      loadingDiv: true
    };
  },
  props: ["routeNav"],
  watch: {
    routeNav() {
      if (this.routeNav == "evaluation") {
        this.loadingDiv = true;
        this.GetEvaluationList();
      }
    }
  },
  created() {},
  components: {
    Loading
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
      // that.GetEvaluationList()
    }
  },
  methods: {
    GetEvaluationList() {
      $.ajax({
        url: this.urlHost + "visitor/group/tocomments", //评价列表(别人对我的评价 团内/团外 )
        type: "post",
        data: {
          access_token: this.loginVisitor.access_token,
          page: 1,
          rows: 10
        },
        dataType: "json",
        success: res => {
          this.loadingDiv = false;
          if (res.success === "00000000") {
            this.listYoutoMeData = res.obj;
            // console.log(res.obj)
          } else {
            this.$base.err(res, this);
          }
        },
        error: err => {
          this.$message({
            message: "网络异常！",
            type: "error",
            align: true
          });
          console.log(err);
          this.loadingDiv = false;
        }
      });
      // $.ajax({
      //     url: this.urlHost+'visitor/group/comments',     //评价列表(别人对我/他人的评价 团内/团外 )
      //     type: "post",
      //     data: {"access_token": this.loginVisitor.access_token, "page": 1, "rows": 10},
      //     dataType: "json",
      //     success: (res)=> {
      //         if(res.success === '00000000'){
      //             this.listYoutoMeData = res.obj
      //             // console.log(res.obj)
      //         }else{
      //             this.$message({
      //                 message: res.msg,
      //                 type: 'error',
      //                 center: true
      //             })
      //         }
      //     },
      //     error: (err)=> {
      //         console.log(err)
      //     }
      // })
    }
  }
};
</script>

<style lang="less" scoped>
.evaluation {
  position: relative;
  background: #fff;
  height: 100%;
  width: 1004px;
  border-radius: 0 8px 8px 0;
  .evaluation-top {
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
      display: flex;
      > div {
        cursor: pointer;
        border-radius: 2px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        color: #fff;
        font-size: 14px;
        &:hover {
          opacity: 0.7;
        }
      }
      > div:nth-child(1) {
        margin-right: 20px;
        width: 88px;
        background: #99cbfb;
      }
      > div:nth-child(2) {
        width: 52px;
        background: #fc9292;
      }
    }
  }
  .evaluation-box {
    position: relative;
    height: calc(100% - 52px);
    border-radius: 0 0 8px 0;
    overflow-y: auto;
    p {
      text-align: center;
      margin-top: 30px;
      color: #999;
      font-size: 18px;
    }
    .evaluation-item {
      margin: 10px 0 0 40px;
      border-bottom: 1px solid #ccc;
      padding-bottom: 10px;

      .metoyou {
        margin-top: 10px;
        border-bottom: 1px dashed #ededed;
        padding-bottom: 10px;
        > div:nth-child(1) {
          display: flex;
          img {
            width: 38px;
            height: 38px;
            border-radius: 4px;
            margin-right: 16px;
          }
          > div {
            > div:nth-child(2) {
              color: #999;
              font-size: 12px;
              margin-top: 2px;
            }
          }
        }
        > div:nth-child(2) {
          margin-top: 10px;
          margin-left: 54px;
          .box-star {
            img {
              margin-right: 5px;
            }
          }
          .box-flag {
            display: flex;
            margin-top: 10px;
            > div {
              border: 1px solid #666;
              border-radius: 50px;
              height: 34px;
              line-height: 34px;
              padding: 0 26px;
              margin-right: 16px;
            }
          }
          .box-content {
            margin-top: 10px;
          }
          .box-replys {
            margin-right: 40px;
            padding: 12px 14px;
            margin-top: 10px;
            background: #eee;
            color: #777;
            border-radius: 4px;
            > div {
              display: flex;
              > div {
                line-height: 22px;
              }
              > div:nth-child(1) {
                white-space: nowrap;
              }
              span {
                margin-right: 10px;
              }
            }
          }
        }
      }
      .metoyou:last-child {
        border-bottom: 0;
      }
    }
    > div:last-child {
      border-bottom: 0;
    }
    .from {
      text-align: right;
      color: #666;
      font-size: 14px;
      // padding: 10px
    }
  }
}
</style>