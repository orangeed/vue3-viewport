<template>
  <view class="wordpad-wrap">
    <!-- 签名 -->
    <view class="main-content">
      <uni-card>
        <canvas
          class="mycanvas"
          canvas-id="mycanvas"
          ref="mycanvas"
          @touchstart="handleTouchstart"
          @touchmove="handleTouchmove"
          @touchend="handleTouchend"
        ></canvas>
      </uni-card>
    </view>
    <view class="main-content-footer">
      <button @click="handleClear">重新签名</button>
      <button @click="handleFinish" class="bg-primary text-white">
        提交签名
      </button>
    </view>
  </view>
</template>

<script>
var x = 20;
var y = 20;

export default {
  name: "WordPad",
  props: {
    showCanvas: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      // 绘制图像
      ctx: "",
      // 路径点
      points: [],
      // 手绘板图片
      wordpadImg: "",
      isShowWordpadImg: false,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.createCanvas();
    });
  },
  methods: {
    //清除画板
    handleObliterate() {
      if (this.wordpadImg) {
        this.wordpadImg = "";
        this.isShowWordpadImg = false;
      }
    },
    //关闭并清空画板
    handleClose() {
      this.$emit("closeCanvas");
      this.clear();
    },
    //清空画布
    handleClear() {
      uni.getSystemInfo({
        success: (res) => {
          let canvasw = res.windowWidth;
          let canvash = res.windowHeight;
          this.ctx.clearRect(0, 0, canvasw, canvash);
          this.ctx.draw(true);
        },
      });
    },
    //完成绘画并保存到本地
    handleFinish() {
      uni.canvasToTempFilePath(
        {
          canvasId: "mycanvas",
          success: (res) => {
            console.log(res);
            this.wordpadImg = res.tempFilePath;
            this.isShowWordpadImg = true;

            this.$emit("saveCanvas", this.wordpadImg);

            uni.showToast({
              title: "保存成功",
            });
          },
          fail: (err) => {
            console.log("err", err);
          },
        },
        this
      );
    },

    // 核心逻辑代码
    //创建并显示画布
    createCanvas() {
      this.ctx = uni.createCanvasContext("mycanvas", this); //创建绘图对象
      //设置画笔样式
      this.ctx.lineWidth = 4;
      this.ctx.lineCap = "round";
      this.ctx.lineJoin = "round";
    },
    // 触摸开始
    handleTouchstart(e) {
      let startX = e.changedTouches[0].x;
      let startY = e.changedTouches[0].y;
      let startPoint = {
        X: startX,
        Y: startY,
      };
      this.points.push(startPoint);
      //每次触摸开始，开启新的路径
      this.ctx.beginPath();
    },
    //触摸移动，获取到路径点
    handleTouchmove(e) {
      let moveX = e.changedTouches[0].x;
      let moveY = e.changedTouches[0].y;
      let movePoint = {
        X: moveX,
        Y: moveY,
      };
      this.points.push(movePoint); //存点
      let len = this.points.length;
      if (len >= 2) {
        this.draw(); //绘制路径
      }
    },
    // 触摸结束，将未绘制的点清空防止对后续路径产生干扰
    handleTouchend() {
      this.points = [];
    },

    // 绘制笔迹
    draw() {
      let point1 = this.points[0];
      let point2 = this.points[1];
      this.points.shift();
      this.ctx.moveTo(point1.X, point1.Y);
      this.ctx.lineTo(point2.X, point2.Y);
      this.ctx.stroke();
      this.ctx.draw(true);
    },
  },
};
</script>

<style lang="scss">
.wordpad-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  //   padding: 0 30rpx;
  box-sizing: border-box;
  .main-content {
    width: 100%;
    .mycanvas {
      width: 100%;
      height: calc(100vh - 100rpx);
      background-color: #ffffff;
    }
  }
  //底部按钮
  .main-content-footer {
    transform: rotate(-90deg);
    width: 100%;
    position: absolute;
    top: 50%;
    left: 38%;
    display: flex;
    // justify-content: space-between;
    font-size: 14px;
    justify-content: space-around;
    align-items: center;
    button {
      border-radius: 999px;
    }
  }
}
</style>
