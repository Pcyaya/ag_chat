<template>
  <div class="phonebind">
    <div class="phonebind-box">
      <div class="phonebind-top">
        <div>绑定手机号</div>
        <div>
          <i @click="closebox" class="el-icon-close"></i>
        </div>
      </div>
      <div class="phonebind-content">
        <div class="cont-title">想要更好的体验艾侗游，请先绑定手机号</div>
        <div class="cont-phone">
          <el-input placeholder="输入手机号" maxlength="11" v-model="phoneNum" class="input-with-select">
            <!-- <el-select v-model="select" slot="prepend" placeholder="请选择">
              <el-option label="+86" value="1"></el-option>
              <el-option label="+852" value="2"></el-option>
              <el-option label="+853" value="3"></el-option>
            </el-select> -->
          </el-input>
        </div>
        <div class="cont-code">
          <el-input maxlength="6" v-model="code" placeholder="请输入验证码"></el-input>
          <span class="cont-code-span" v-if="phoneNum.length!=11 && !sendMsgDisabled">获取验证码</span>
          <el-button type="primary" v-else-if="!sendMsgDisabled" @click="GetCode">获取验证码</el-button>
          <span class="cont-code-span" v-else>重新获取({{time}})</span>
        </div>
        <div class="cont-bind-btn" @click="Getbind">
          <el-button>快速绑定</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      baseinfo: {},
      access_token: '',
      select: "1",
      phoneNum: "",
      code: "",
      time: 60,
      sendMsgDisabled: false,
    };
  },
  created(){
    this.baseinfo = JSON.parse(localStorage.getItem('baseinfo'));
    this.access_token = this.baseinfo.access_token
  },
  methods: {
    Getbind() {
      const that = this;
      $.ajax({
        url: this.urlHost + "visitor/provisional/phone",
        type: "post",
        data: { phone: this.phoneNum, code: this.code, access_token: this.access_token },
        dataType: "json",
        success: res=> {
          if(res.success === "00000000"){
            that.$emit("unbindType", false);
            that.$router.push({
              path: "/msg"
            });
            window.location.reload()
          }else {
            that.$message.error(res.msg)
          }
        },
        error: err=> {
          console.log("失败" + "====>" + JSON.stringify(err));
        }
      });
    },
    GetCode() {
      const that = this;
      if (this.phoneRE(this.phoneNum)) {
        $.ajax({
          url: this.urlHost + "visitor/provisional/code",
          type: "post",
          data: { phone: this.phoneNum, access_token: this.access_token },
          dataType: "json",
          success: res=> {
            // console.log(JSON.stringify(data));
            if(res.success === "00000000"){
              that.$message({
                message: "验证码已发送至您的手机!",
                type: "success"
              });
              that.send();
            }else {
              that.$message.error(res.msg)
            }
          },
          error: err=> {
            console.log("失败" + "====>" + JSON.stringify(err));
          }
        });
      }
    },
    closebox() {
      this.$emit("unbindType", false);
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
    },
    //手机验证
    phoneRE(phone) {
      const re = /^1[356789]\d{9}$/;
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
.phonebind {
  z-index: 111;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .phonebind-box {
    animation: mycont .5s;
    position: absolute;
    width: 400px;
    // height: 295px;
    background: #fff;
    color: #000;
    border-radius: 4px;
    box-shadow: 1px -1px 10px #999;
    .phonebind-top {
      display: flex;
      justify-content: space-between;
      padding: 10px 15px;
      border-bottom: 1px solid #ccc;
      i {
        color: #999;
        cursor: pointer;
        &:hover {
          color: #000;
        }
      }
    }
    .phonebind-content {
      // width: 100%;
      // height: 100%;
      //   height: calc(100% - 60px);
      background: #fefefe;
      padding: 20px 40px 30px 40px;
      border-radius: 0 0 4px 4px;
      display: flex;
      flex-direction: column;
      .cont-title {
        color: #999;
        font-size: 90%;
      }
      .cont-phone {
        margin-top: 20px;
        .input-with-select .el-input-group__prepend {
          background-color: #fff;
        }
        .el-select .el-input {
          width: 90px;
        }
      }
      .cont-code {
        margin-top: 20px;
        display: flex;
        .el-input{
          margin-right: 10px;
        }
        .cont-code-span{
          white-space:nowrap;
          width: 178px;
          height: 38px;
          line-height: 38px;
          text-align: center;
          font-size: 14px;
          color: #606266;
          border: 1px solid #dcdfe6;
          border-radius: 4px;
        }
      }
      .cont-bind-btn {
        margin-top: 30px;
        .el-button {
          width: 100%;
          // background: #f3f3f3;
          //   height: 30px;
          //   line-height: 30px;
        }
      }
    }
  }
}
</style>
