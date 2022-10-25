import {
  defineComponent,
  nextTick,
  onMounted,
  reactive,
  ref,
  toRefs,
} from "vue";
export default defineComponent({
  name: "wordPad",
  components: {},
  props: {
    showCanvas: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { emit }) {
    // 绘制图像
    let ctx: any;
    // 路径点
    let points: any = [];
    // 手绘板图片
    let wordpadImg = "";

    // 核心逻辑代码
    //创建并显示画布
    const createCanvas = () => {
      ctx = uni.createCanvasContext("mycanvas", this); //创建绘图对象
      //设置画笔样式
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    };
    // 触摸开始
    const handleTouchstart = (e: any) => {
      console.log("e", e);
      let startX = e.changedTouches[0].x;
      let startY = e.changedTouches[0].y;
      let startPoint = {
        X: startX,
        Y: startY,
      };
      points.push(startPoint);
      //每次触摸开始，开启新的路径
      ctx.beginPath();
    };
    //触摸移动，获取到路径点
    const handleTouchmove = (e: any) => {
      let moveX = e.changedTouches[0].x;
      let moveY = e.changedTouches[0].y;
      let movePoint = {
        X: moveX,
        Y: moveY,
      };
      points.push(movePoint); //存点
      let len = points.length;
      if (len >= 2) {
        draw(); //绘制路径
      }
    };
    // 触摸结束，将未绘制的点清空防止对后续路径产生干扰
    const handleTouchend = () => {
      points = [];
    };

    // 绘制笔迹
    const draw = () => {
      let point1 = points[0];
      let point2 = points[1];
      points.shift();
      ctx.moveTo(point1.X, point1.Y);
      ctx.lineTo(point2.X, point2.Y);
      ctx.stroke();
      ctx.draw(true);
    };

    //完成绘画并保存到本地
    const handleFinish = () => {
      uni.canvasToTempFilePath(
        {
          canvasId: "mycanvas",
          width: 390,
          height: 500,
          success: (res) => {
            console.log(res);
            wordpadImg = res.tempFilePath;
            emit("closeCanvas");
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
    };
    //重新签名，清空画布
    const handleClear = () => {
      uni.getSystemInfo({
        success: (res) => {
          let canvasw = res.windowWidth;
          let canvash = res.windowHeight;
          ctx.clearRect(0, 0, canvasw, canvash);
          ctx.draw(true);
          if (wordpadImg) wordpadImg = "";
          emit("closeCanvas");
        },
      });
    };

    onMounted(() => {
      nextTick(() => {
        createCanvas();
      });
    });
    return {
      handleTouchstart,
      handleTouchmove,
      handleTouchend,
      handleFinish,
      handleClear,
    };
  },
});
