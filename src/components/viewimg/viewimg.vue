<template>
  <div class="viewimg">
    <div class="dialogs">
      <div class="imgView">
        <el-dialog :visible.sync="zzimg">
          <div class="contents">
            <div class="contents-title">
              <span>{{imgData.index+1}}</span>/
              <span>{{imgData.imgs.length}}</span>
              <div class="rotating">
                <el-button type="text" @click="rotat">
                  <i class="el-icon-refresh"></i>
                </el-button>
              </div>
            </div>
            <div class="contents-img">
              <div v-if="imgData.imgs.length==1"></div>
              <div class="prev curz" v-else-if="imgData.index>0">
                <i @click="imgViewPre(imgData.imgs, imgData.index)" class="el-icon-arrow-left"></i>
              </div>
              <div v-else class="prev">
                <i class="el-icon-arrow-left"></i>
              </div>
              <div class="imgv">
                <div class="zzzdiv"
                  :class="{'curDown' : curDown}"
                  @mousedown="mouseDown"
                  @mouseup="mouseUp"
                  @dblclick="dbcbingimg($refs.domimg)"
                  @mousewheel="bigimg($refs.domimg)"></div>
                <span v-if="!imgshow">
                  <i class="el-icon-loading"></i> 加载中...
                </span>
                <img
                  ref="domimg"
                  class="moveimg"
                  :class="{'cursor-move':!bigimgtype,'mh100':bigimgtype}"
                  v-else
                  :src="imgViewUrl"
                  alt
                >
              </div>
              <div v-if="imgData.imgs.length==1"></div>
              <div class="nextv curz" v-else-if="imgData.index<imgData.imgs.length-1">
                <i @click="imgViewNext(imgData.imgs, imgData.index)" class="el-icon-arrow-right"></i>
              </div>
              <div v-else class="nextv">
                <i class="el-icon-arrow-right"></i>
              </div>
            </div>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imgData: this.imgurl,
      imgViewUrl: this.imgurl.imgs[this.imgurl.index],
      zzimg: true,
      current: 0,
      imgshow: false,
      bigimgtype: true,
      curDown: false,
      zoom: 100
    };
  },
  created() {},
  watch: {
    zzimg() {
      if (!this.zzimg) {
        this.typeT();
        this.zzimg = true;
      }
    },
    imgViewUrl() {
      this.current = 0;
      this.bigimgtype = true;
    },
    zoom(){
      
    }
  },
  mounted() {
    this.loadImg();
  },
  methods: {
    mouseDown() {
      this.curDown = true;
    },
    mouseUp() {
      this.curDown = false;
    },
    typeT() {
      this.$emit("typeBy", false);
    },
    //下一张
    imgViewPre(data, index) {
      if (index > 0) {
        index--;
        this.imgViewUrl = data[index];
        this.imgData.index = index;
        this.loadImg();
      }
    },
    //上一张
    imgViewNext(data, index) {
      if (index < data.length - 1) {
        index++;
        this.imgViewUrl = data[index];
        this.imgData.index = index;
        this.loadImg();
      }
    },
    //旋转图片
    rotat() {
      this.current = this.current + 90;
      $(".imgv img").css({
        transform: "rotate(" + this.current + "deg)",
        // transition: ".3s"
      });
    },
    loadImg() {
      this.imgshow = false;
      let bgImg = new Image();
      bgImg.src = this.imgViewUrl;
      bgImg.onerror = () => {
        this.$message("加载失败");
        this.imgshow = true;
      };
      bgImg.onload = () => {
        this.imgshow = true;
        this.zoom = 100;
        setTimeout(() => {
          this.moveDiv();
        }, 100);
      };
    },
    bigimg(obj) {
      this.zoom = parseInt(obj.style.zoom, 10) || this.zoom;
      this.zoom += event.wheelDelta / 12;
      if (this.zoom >= 30 && this.zoom <= 180) {
        obj.style.zoom = this.zoom + "%";
        this.bigimgtype = false;
      }
      return false;
    },
    dbcbingimg(obj) {
      this.zoom = parseInt(obj.style.zoom, 10) || this.zoom;
      if (this.bigimgtype) {
        obj.style.zoom = "180%";
        this.zoom = 180;
        this.bigimgtype = false;
      } else {
        obj.style.zoom = "100%";
        this.zoom = 100;
        // this.current = 0;
        // obj.style={
        //   left: 0,
        //   top: 0,
        // }
        this.bigimgtype = true;
      }
    },
    moveDiv() {
      let _move = false; //移动标记
      let _x, _y; //鼠标离控件左上角的相对位置
      $(".zzzdiv")
        .click(function() {})
        .mousedown(function(e) {
          _move = true;
          _x = e.pageX - parseInt($(".moveimg").css("left"));
          _y = e.pageY - parseInt($(".moveimg").css("top"));
          // $(".content").fadeTo(20, 0.9);//点击后开始拖动并透明显示
        });
      $(document)
        .mousemove(function(e) {
          if (_move) {
            let x = e.pageX - _x; //移动时根据鼠标位置计算控件左上角的绝对位置
            let y = e.pageY - _y;
            $(".moveimg").css({ top: y, left: x }); //控件新位置
          }
        })
        .mouseup(function() {
          _move = false;
          $(".moveimg").fadeTo("fast", 1); //松开鼠标后停止移动并恢复成不透明
        });
    }
  },
  props: ["imgurl", "type"]
};
</script>

<style lang="less">
.viewimg {
  .dialogs {
    .imgView {
      .el-dialog {
        margin-top: 0 !important;
        width: 100%;
        height: 100%;
        overflow: auto;
        margin: 0 auto;
        background: rgba(0, 0, 0, 0.7);
      }
      .el-dialog__headerbtn {
        z-index: 1111;
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
        margin: 0;
      }
      .contents {
        position: absolute;
        width: 100%;
        height: 100%;
        .contents-title {
          z-index: 111;
          position: fixed;
          width: 100%;
          height: 8%;
          color: #fff;
          font-size: 18px;
          margin-bottom: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: .3s;
          &:hover{
            background: rgba(0, 0, 0, .3);
            transition: .3s;
          }
          > span {
            display: block;
            background: rgba(0, 0, 0, 0.5);
            width: 30px;
            height: 30px;
            line-height: 30px;
            border-radius: 50%;
            text-align: center;
            margin: 0 7px;
          }
          .rotating {
            display: flex;
            align-items: center;
            i {
              font-size: 20px;
              margin: 0 10px;
            }
          }
        }
        .contents-img {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 100%;
          .imgv {
            position: relative;
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            user-select: none;
            width: 100%;
            height: 100%;
            overflow: hidden;
            @keyframes myImg {
              from {
                transform: rotateX(90deg) scale(0) translateY(-50px);
              }
              to {
                transform: rotate(0deg) scale(1) translateY(0px);
              }
            }
            .zzzdiv{
              z-index: 2;
              position: absolute;
              width: 100%;
              height: 100%;
              cursor: grab;
              background: rgba(0, 0, 0, 0);
            }
            .curDown {
              cursor: grabbing!important;
            }
            .moveimg {
              z-index: 1;
              zoom: 1;
              position: relative;
              border-radius: 4px;
              animation: myImg 0.3s;
            }
            .cursor-move{
              cursor: move
            }
            .mh100{
              max-height: 100%;
            }
            span {
              font-size: 20px;
              i {
                color: #dedede;
              }
              color: #dedede;
            }
          }
          .prev,
          .nextv {
            color: #999;
            font-size: 400%;
          }
          .curz {
            cursor: pointer;
            &:hover {
              color: #fff;
            }
          }
        }
      }
    }
  }
}
</style>
