<template>
  <div class="rules">
    <h4>1、什么是游币？</h4>
    <p>游币是艾侗游里面的货币单位，是上海艾侗游科技有限公司（以下简称：艾侗游）为用户提供的虚拟币，用户可以用游币进行兑换流量卡、优惠券或实物商品等。</p>
    <h4>2、游币的用途</h4>
    <p>目前已开通的是在游币商城兑换商品，如：艾侗游全站通用的优惠券、流量券、实物商品等。后期我们将扩大游币的使用范围，敬请期待。</p>
    <h4>3、如何获得游币？</h4>
    <el-table
      :data="tableData6"
      :span-method="objectSpanMethod"
      border
      style="width: 99%;margin-bottom:20px;"
    >
      <el-table-column prop="amount1" width="50px" align="center" label="角色"></el-table-column>
      <el-table-column prop="amount2" width="50px" align="center" label="获得方式"></el-table-column>
      <el-table-column prop="amount3" width="60px" align="center" label="游币值"></el-table-column>
      <el-table-column prop="amount4" align="center" label="说明"></el-table-column>
      <el-table-column prop="amount5" width="75px" align="center" label="发放时间"></el-table-column>
    </el-table>
    <h4>4、1游币等于多少人民币？</h4>
    <p>一个游币等于多少钱并不固定，通常情况艾侗游的运营收益越高，游币价值越高，敬请期待。</p>
    <h4>5、如何查看游币明细？</h4>
    <p>游币明细查看，点击进入“我的”—点击“游币”查看游币获取和消费明细。</p>
    <h4>6、游币如何消费？</h4>
    <h4>（1）	兑换流量券/优惠券</h4>
    <p>在游币页面，点击“兑换优惠券/流量券”进行兑换。</p>
    <h4>（2）	兑换实物商品</h4>
    <p>在游币页面，点击“实物商品”进行兑换流程操作。</p>
    <h4>7、用户违规行为处罚条例</h4>
    <p>用户获得游币后，有权以消耗游币的方式兑换或购买游币价商品，但其应遵守如下行为规范：</p>
    <p>（1）须通过正常途径获得游币，不得通过软件、程序等方式获取游币；</p>
    <p>（2）须维护良好的游币活动秩序，不得影响游币活动的正常运营；</p>
    <p>（3）在获取和使用游币的过程中，如果出现违规行为，我们有权扣除游币（含已使用的及未使用的）。</p>
    <h4>8、其他注意事项</h4>
    <p>（1）游币兑换或抽奖的礼品以艾侗游平台上的资料为准，如遇不可抗力因素，艾侗游保留更换其它等值奖项的权利；</p>
    <p>（2）艾侗游保留对活动进行变动和调整的权利，具体情形以艾侗游官方活动页面上文案表述为准；</p>
    <p>（3）其他未尽事宜，艾侗游拥有最终解释权。</p>
    <div class="footer-msg">以上信息及其他未尽事宜最终解释权归艾侗游所有</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData6: [
        {
          amount1: "仅限导游",
          amount2: "组建旅行团",
          amount3: "1/人",
          amount4:
            "1）旅行团开启≥3小时，游币按照旅行团人数和好评数计算；（结束时间为准）;\n2）旅行团开启≤3小时，游币旅行团人数（不重复）和好评数计算；一天最多两次有效团（结束时间为准）",
          amount5: "关闭旅行团后"
        },
        {
          amount1: "",
          amount2: "",
          amount3: "20/人",
          amount4: "新人注册第一次入团，奖励25游币给导游；",
          amount5: "注册入团成功后"
        },
        {
          amount1: "",
          amount2: "导游认证",
          amount3: "20",
          amount4: "导游实名认证，即可获得游币值",
          amount5: "资料完善成功后"
        },
        {
          amount1: "",
          amount2: "邀请评价",
          amount3: "10",
          amount4:
            "游客为带团人员服务好评后，导游即可获得游币值。（好评必须在行程结束后1天内进行点评，即可获得游币奖励，逾期发表好评，不再获得好评游币）",
          amount5: "提交好评后"
        },
        {
          amount1: "所有注册用户",
          amount2: "首次登录APP",
          amount3: "20",
          amount4: "首次成功登录APP后可获得游币值",
          amount5: "首次成功登录APP后"
        },
        {
          amount1: "",
          amount2: "签到领取",
          amount3: "1/2/3",
          amount4:
            "每天打开艾侗游签到赚游币，首日可领1个，连续第二天可领2个，第三天3个，最多每天可获得3个游币。不连续签到，将恢复到1个游币",
          amount5: "签到后"
        },
        {
          amount1: "",
          amount2: "完善个人资料",
          amount3: "5",
          amount4: "完善个人资料，即可获得游币值",
          amount5: "资料完善成功后(>60%)"
        },
        {
          amount1: "",
          amount2: "邀请好友注册",
          amount3: "25",
          amount4: "邀请好友注册成功，邀请人即可获得游币值",
          amount5: "好友成功登陆后"
        },
        {
          amount1: "",
          amount2: "发布游记",
          amount3: "2/1",
          amount4: "首次发布游记+2之后每次加1（每天最多10次）",
          amount5: "发布成功后"
        },
        {
          amount1: "",
          amount2: "",
          amount3: "1",
          amount4:
            "每天发布游记分享并转发/点赞/评论，10个及以上，即可获得游币值",
          amount5: "分享/转发/点赞/评论后(总数)"
        },
        {
          amount1: "",
          amount2: "",
          amount3: "1/20/50/200",
          amount4:
            "转发并被点赞10个及以上，即可获得1个游币值，点赞1000个及以上可获得20个游币值，点赞10000个及以上可获得50个游币值，点赞100000个及以上可获得200个游币值，最多奖励200个游币",
          amount5: "转发并被点赞后即可获得(总数)"
        },
        {
          amount1: "",
          amount2: "发布景点语音",
          amount3: "2/1",
          amount4: "首次景点语音+2之后每次加1（每天最多20次）",
          amount5: "发布成功后"
        }
      ]
    };
  },
  methods: {
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex === 0) {
          return {
            rowspan: 4,
            colspan: 1
          };
        } else if (rowIndex === 1) {
          return {
            rowspan: 0,
            colspan: 1
          };
        } else if (rowIndex === 2) {
          return {
            rowspan: 0,
            colspan: 1
          };
        } else if (rowIndex === 3) {
          return {
            rowspan: 0,
            colspan: 1
          };
        } else if (rowIndex === 4) {
          return {
            rowspan: 8,
            colspan: 1
          };
        } else if (rowIndex === 5) {
          return {
            rowspan: 0,
            colspan: 1
          };
        } else if (rowIndex === 6) {
          return {
            rowspan: 0,
            colspan: 1
          };
        } else if (rowIndex === 7) {
          return {
            rowspan: 0,
            colspan: 1
          };
        } else if (rowIndex === 8) {
          return {
            rowspan: 0,
            colspan: 1
          };
        } else if (rowIndex === 9) {
          return {
            rowspan: 0,
            colspan: 1
          };
        } else if (rowIndex === 10) {
          return {
            rowspan: 0,
            colspan: 1
          };
        } else if (rowIndex === 11) {
          return {
            rowspan: 0,
            colspan: 1
          };
        }
      }
      if (columnIndex === 1) {
        if (rowIndex === 0) {
          return {
            rowspan: 2,
            colspan: 1
          };
        } else if (rowIndex === 1) {
          return {
            rowspan: 0,
            colspan: 1
          };
        } else if (rowIndex === 8) {
          return {
            rowspan: 3,
            colspan: 1
          };
        } else if (rowIndex === 9) {
          return {
            rowspan: 0,
            colspan: 1
          };
        } else if (rowIndex === 10) {
          return {
            rowspan: 0,
            colspan: 1
          };
        }
      }
      // if(columnIndex === 1) {
      //     if(rowIndex == 2){
      //         return {
      //             rowspan: 2,
      //             colspan: 2
      //         }
      //     }
      // }
    }
  }
};
</script>

<style lang="less" scoped>
.rules {
  -webkit-overflow-scrolling: touch;
  padding: 20px 10px 0 10px;
  background-color: #fff;
  h4,
  p {
    padding-bottom: 20px;
  }
  h4 {
    color: #333;
  }
  p {
    color: #666;
  }
  .footer-msg {
    margin-top: 30px;
    border-top: 1px solid #999;
    color: #999;
    height: 70px;
    line-height: 70px;
    text-align: center;
    letter-spacing: -1px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .el-table__row {
    .cell {
      white-space: pre !important;
    }
  }
}
</style>
