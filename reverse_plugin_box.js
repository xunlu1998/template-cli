const Arrow = require("./arrow");
const ModelPair = require("../model_pair");
/**
 * 反向直插盒 100030
 * @xunlu
 */
module.exports = class ReversePluginBox extends ModelPair {
  /**
   * @param {*} L 长
   * @param {*} W 宽
   * @param {*} H 高
   * @param {*} D 纸厚
   * @param {*} scale 缩放
   * @param {*} id 内损
   * @param {*} ed 外增
   * @param {*} options 配置
   */
  constructor(L = Number, W = Number, H = Number, D = Number, scale = 1, id, ed, options = {}) {
    super(L, W, H, D, scale, id, ed, options);

    this.arrCheck = [];
    this.arrCheck1 = [];

    // 防尘翼参数
    this.AX = this.getcheck(
      this.getAX(),
      0,
      this.roundM(Math.min((this.W + 2 * this.id) / 3, 5 * this.scale + this.D), this.scale, 0.5),
      "防尘翼间隙"
    );
    this.R = this.getcheck(
      this.getR(),
      this.roundM(1.2 * this.D, this.scale, 0.05),
      Math.min(this.roundM(1.5 * this.D), this.AX / 2),
      "防尘翼内部倒角"
    );
    this.of = this.getcheck(this.D, 0, Math.min(this.D, this.R), "高低位");
    // 定义全局变量保存刀模(制造)尺寸
    this.kl = this.L + 2 * this.id;
    this.kw = this.W + 2 * this.id;
    this.kh = this.H + 2 * this.id + this.of;

    /**
     * 定义全局变量保存设计图参数
     */
    // 未用参数
    this.Y1 = 0;
    this.CR1 = 0;
    this.Y2 = 0;
    this.E = 0;
    // 主要参数
    this.W1 = this.getW1();
    // 糊口参数
    this.sb = this.getcheck(this.getStickyBit(), 5 * this.scale, this.W1 - this.scale, "糊口参数");
    this.gt = this.getGT();
    // 上盖参数
    this.CX = this.D;
    this.slot = this.getcheck(this.getC(), 5 * this.scale, this.roundM(this.kh / 2), "插舌长度");
    this.CR = this.getcheck(
      this.ceilM(this.slot / 2),
      0,
      this.roundM(Math.min(this.slot - this.Y1, this.kl / 4)),
      "插舌倒角"
    );

    this.ct = this.getcheck(
      0,
      0,
      (Math.min(30, 0.5 * Math.atan((this.kl / 2 - this.CX) / this.slot)) * 180) / Math.PI,
      "角度偏移",
      true
    );
    this.W2 = this.kw - this.Y1;

    this.AXX = this.getcheck(this.getAXX(), 0, this.AX + 2 * this.scale, "上开口");

    this.S = this.getS();
    this.AS = this.AX;
    this.NX = this.getcheck(this.getNX(), 0, this.roundM(this.kw / 5), "公锁X坡度");
    this.NY = this.getcheck(this.getNY(), 0, this.roundM(this.kw / 5), "公锁Y坡度");
    this.AR = this.getcheck(this.getAR().init, 0, this.getAR().max, this.getAR().name);
    this.A = this.getcheck(
      Math.min(this.ceilM(this.kw / 2 + this.slot / 2), this.floorM(this.kl / 2)),
      Math.max(this.S + this.NY + this.AR, this.roundM(this.slot / 2)),
      this.roundM(this.kl - 1 * this.scale),
      "防尘翼长度"
    );
    this.AX1 = this.D;
    this.att = this.getcheck(
      this.kw > 8 * this.scale && this.kw <= 20 * this.scale ? 0 : 13,
      0,
      45,
      "防尘翼坡度角度",
      true
    );

    // 定义全局变量保存坐标轴方便定位
    this.y1 = this.slot + this.W2;
    this.y2 = this.y1 + this.kh;
    this.y3 = this.y2 + Math.max(this.A, this.W2 + this.slot + this.of);
    this.x1 = this.sb + this.kl;
    this.x2 = this.x1 + this.kw;
    this.x3 = this.x2 + this.kl;
    this.x4 = this.x3 + this.W1;

    console.log(this.getS());
  }

  // 定义函数获取设计图参数
  getW1() {
    let init = this.D;
    init < 0.6 * this.scale
      ? (init = 0.5 * this.scale)
      : init < 4.2 * this.scale
      ? (init = 1 * this.scale)
      : init < 8.5 * this.scale
      ? (init = 2 * this.scale)
      : (init = 3 * this.scale);
    return this.kw - init;
  }

  /**
   * 糊口参数
   */
  getStickyBit() {
    // this.arrCheck1 = [];
    let step = this.kl * 2 + this.kw + this.W1;
    if (step < 250 * this.scale) step = 13 * this.scale;
    else if (step < 500 * this.scale) step = 16 * this.scale;
    else if (step < 600 * this.scale) step = 19 * this.scale;
    else if (step < 700 * this.scale) step = 25 * this.scale;
    else if (step < 800 * this.scale) step = 35 * this.scale;
    else step = 45 * this.scale;

    return step;
  }
  /**
   * 糊口角度
   */
  getGT() {
    let max = Math.min(45, (Math.atan(this.kh / 2 / this.sb) * 180) / Math.PI);
    return this.getcheck(15, 0, max, "糊口角度", true);
  }

  /**
   * 插舌长度
   */
  getC() {
    let L = this.kl;
    let H = this.kh;
    let slot = 0;
    if (L < 40 * this.scale) {
      slot = this.floorM(Math.min(10 * this.scale, this.kh / 4));
    } else if (L >= 40 * this.scale && L < 60 * this.scale) {
      slot = 11 * this.scale;
    } else if (L >= 60 * this.scale && L < 100 * this.scale) {
      slot = 13 * this.scale;
    } else if (L >= 100 * this.scale && L < 130 * this.scale) {
      slot = 15 * this.scale;
    } else if (L >= 130 * this.scale && L < 180 * this.scale) {
      slot = 20 * this.scale;
    } else {
      slot = 25 * this.scale;
    }
    return slot;
  }

  /**
   * 防尘翼间隙
   */
  getAX() {
    let s0, s1;
    if (this.W + 2 * this.id >= 30 * this.scale) {
      s0 = this.roundM(3 * this.scale + this.D, this.scale, 0.05);
    } else {
      s0 = this.roundM(2 * this.scale + this.D, this.scale, 0.05);
    }
    // s1 = this.roundM(Math.min(this.kw / 3, 5 * this.scale + this.D), this.scale, 0.5);

    return s0;
  }
  /**
   * 上开口
   */
  getAXX() {
    let s0;
    if (this.AX === 0) {
      s0 = 0;
    } else {
      s0 = this.D <= 1.5 * this.scale ? this.AX + this.scale : this.AX + 2 * this.scale;
    }

    return s0;
  }
  /**
   * 防尘翼内部倒角
   */
  getR() {
    let init = this.roundM(
      this.D > 0.5 * this.scale ? 1.2 * this.D : 1.3 * this.D,
      this.scale,
      0.05
    );
    return init;
  }
  /**
   * 公锁长度
   */
  getS() {
    let s = this.STEP([this.kl, 6, 65, 8, 150, 11]);
    if (this.kl < 30 * this.scale) {
      return this.roundM(this.kl / 10);
    } else {
      return this.MINMAX(s - 2 * this.scale, s - 2 * this.scale, s - 0.75 * this.scale);
    }
  }
  /**
   * 公锁X坡度
   */
  getNX() {
    let W = this.kw;
    let s = W > 8 * this.scale && W <= 30 * this.scale ? 2 * this.scale : 3 * this.scale;
    let s1 = this.roundM(W / 5);

    return s;
  }

  /**
   * 公锁Y坡度
   */
  getNY() {
    let W = this.kw;
    let s = W > 8 * this.scale && W <= 30 * this.scale ? 2 * this.scale : 3 * this.scale;
    let s1 = this.roundM(W / 5, this.scale);

    return s;
  }

  /**
   * 防尘翼倒角
   */
  getAR() {
    let L = this.kl;
    let W = this.kw;
    let s1 = this.floorM(Math.min((W / 2 + this.slot / 2) / 4, L / 2));
    let s = W > 8 * this.scale && W <= 30 * this.scale ? 2 * this.scale : s1;
    let s2 = Math.min(
      this.floorM(Math.min((W / 2 + this.slot / 2) / 2, L / 2)),
      this.roundM(W / 3)
    );
    return {
      init: s,
      max: s2,
      name: "防尘翼倒角"
    };
  }

  check() {
    let arr = [
      { ename: this.kl, cname: "长度", min: 15 * this.scale, max: 2000 * this.scale },
      { ename: this.kw, cname: "宽度", min: 10 * this.scale, max: this.kl },
      { ename: this.kh, cname: "高度", min: 20 * this.scale, max: 2000 * this.scale },
      ...this.arrCheck
    ];
    return this.forCheck(arr);
  }

  //长宽高箭头指示数据:通用
  sizeArrowData(type, w, h, sizeType) {
    let limit = this.getArrowLimit(sizeType);
    let valueL = this.getArrowL(sizeType);
    let valueW = this.getArrowW(sizeType);
    let valueH = this.getArrowH(sizeType);
    let arrow = new Arrow(w, h);
    //箭头
    let arrowL = arrow.arrowHorizontal(
      this.sb,
      this.x1,
      this.y1 + this.kh / 3,
      limit,
      "L=" + this.divide(valueL, this.scale)
    );
    let arrowW = arrow.arrowHorizontal(
      this.x1,
      this.x2,
      this.y1 + this.of + (this.kh - this.of) / 2,
      limit,
      "W=" + this.divide(valueW, this.scale)
    );
    let arrowH = arrow.arrowVertical(
      this.x2 + this.kl / 2,
      this.y1 + this.of,
      this.y2 + this.of,
      limit,
      "H=" + this.divide(valueH, this.scale)
    );
    return this.filterArrow(type, arrowL, arrowW, arrowH);
  }

  // base
  getAngle(x, y, r) {
    let c = Math.sqrt(x * x + y * y);
    return Math.atan(y / x) + Math.asin(r / c);
  }

  /**
   *
   * 获取面数据
   */
  getFaceData() {
    return [
      {
        name: "H",
        w: this.kl,
        h: this.kh,
        x: this.sb,
        y: this.y1,
        dlist: () => {
          return [
            { mtd: "M", x: this.sb, y: this.y1 },
            { mtd: "L", x: this.x1, y: this.y1, foldline: "H_HT2" },
            { mtd: "L", x: this.x1, y: this.y2, foldline: "FR_H" },
            { mtd: "L", x: this.sb, y: this.y2 },
            { mtd: "Z" }
          ];
        }
      },
      {
        name: "HL",
        w: this.sb,
        h: this.kh - this.of,
        x: 0,
        y: this.y1 + this.of,
        dlist: () => {
          return [
            { mtd: "M", x: this.sb, y: this.y1 + this.of },
            { mtd: "L", x: this.sb, y: this.y2, foldline: "H_HL", rotate: true },
            { mtd: "L", x: 0, y: this.y2 - this.getT1() },
            { mtd: "L", x: 0, y: this.y1 + this.of + this.getT1() },
            { mtd: "Z" }
          ];
        }
      },
      {
        name: "HT2",
        w: this.L + 2 * this.id,
        h: this.W2,
        x: this.sb,
        y: this.y1 - this.W2,
        dlist: () => {
          return [
            { mtd: "M", x: this.sb, y: this.y1 - this.W2 },
            { mtd: "L", x: this.x1, y: this.y1 - this.W2 },
            { mtd: "L", x: this.x1, y: this.y1 },
            { mtd: "L", x: this.sb, y: this.y1 },
            { mtd: "Z" }
          ];
        }
      },
      {
        name: "HT1",
        w: this.L + 2 * this.id - this.CX * 2,
        h: this.slot,
        x: this.sb + this.CX,
        y: this.y1 - this.W2 - this.slot,
        dlist: () => {
          let x = this.slot - this.CR + this.CR * Math.cos(((90 - this.ct) * Math.PI) / 180);
          return [
            { mtd: "M", x: this.sb + this.CX, y: this.y1 - this.W2 },
            {
              mtd: "L",
              x: this.sb + this.CX + x / Math.tan(((90 - this.ct) * Math.PI) / 180),
              y: this.y1 - this.W2 - x
            },
            {
              mtd: "Q",
              cx:
                this.sb +
                this.CX +
                x / Math.tan(((90 - this.ct) * Math.PI) / 180) +
                this.CR * Math.cos((this.ct * Math.PI) / 180) -
                this.CR * Math.tan((((90 - this.ct) / 2) * Math.PI) / 180),
              cy: this.y1 - this.W2 - this.slot,
              x:
                this.sb +
                this.CX +
                x / Math.tan(((90 - this.ct) * Math.PI) / 180) +
                this.CR * Math.cos((this.ct * Math.PI) / 180),
              y: this.y1 - this.W2 - this.slot
            },
            {
              mtd: "L",
              x:
                this.x1 -
                this.CX -
                x / Math.tan(((90 - this.ct) * Math.PI) / 180) -
                this.CR * Math.cos((this.ct * Math.PI) / 180),
              y: this.y1 - this.W2 - this.slot
            },
            {
              mtd: "Q",
              cx:
                this.x1 -
                this.CX -
                x / Math.tan(((90 - this.ct) * Math.PI) / 180) -
                this.CR * Math.cos((this.ct * Math.PI) / 180) +
                this.CR * Math.tan((((90 - this.ct) / 2) * Math.PI) / 180),
              cy: this.y1 - this.W2 - this.slot,
              x: this.x1 - this.CX - x * Math.tan((this.ct * Math.PI) / 180),
              y: this.y1 - this.W2 - x
            },
            { mtd: "L", x: this.x1 - this.CX, y: this.y1 - this.W2 },
            {
              mtd: "L",
              x: this.sb + this.CX,
              y: this.y1 - this.W2,
              foldline: "HT2_HT1",
              rotate: true
            }
          ];
        }
      },
      {
        name: "FR",
        w: this.kw,
        h: this.kh - this.of,
        x: this.x1,
        y: this.y1,
        dlist: () => {
          return [
            { mtd: "M", x: this.x1, y: this.y1 },
            {
              mtd: "Q",
              cx: this.x1,
              cy: this.y1 + this.R,
              x: this.x1 + this.R,
              y: this.y1 + this.R
            },
            ...this.getROF({
              x: this.x1 + this.R,
              y: this.y1,
              R: this.R,
              of: this.R - this.of,
              T: this.getAngle(this.AX - this.R, this.AS - this.of, this.R)
            }).RB.Bottom,

            { mtd: "L", x: this.x2, y: this.y1 + this.of, foldline: "FR_FRT" },
            { mtd: "L", x: this.x2, y: this.y2 + this.of, foldline: "F_FR" },
            {
              mtd: "Q",
              cx: this.x2,
              cy: this.y2 + this.of - this.R,
              x: this.x2 - this.R,
              y: this.y2 + this.of - this.R
            },
            ...this.getROF({
              x: this.x2 - this.R,
              y: this.y2 + this.of,
              R: this.R,
              of: this.R - this.of,
              T: this.getAngle(this.AX - this.R, this.AS - this.of, this.R)
            }).LT.Top,
            { mtd: "L", x: this.x1, y: this.y2, foldline: "FR_FRB" },
            { mtd: "L", x: this.x1, y: this.y1 }
          ];
        }
      },
      {
        name: "FRT",
        w: this.W + 2 * this.id,
        h: this.A,
        x: this.x1,
        y: this.y1 + this.of - this.A,
        dlist: () => {
          return [
            ...this.getROF({
              x: this.x1 + this.R,
              y: this.y1,
              R: this.R,
              of: this.R - this.of,
              T: this.getAngle(this.AX - this.R, this.AS - this.of, this.R)
              // foldline:"F_F"
            }).RB.Top,

            { mtd: "L", x: this.x1 + this.AX, y: this.y1 + this.of - this.AS },
            // modify
            { mtd: "L", x: this.x1 + this.AXX, y: this.y1 + this.of - this.A },
            {
              mtd: "L",
              x: this.x2 - this.AX1 - this.NX - this.getARX1() - this.getARX3(),
              y: this.y1 + this.of - this.A
            },
            {
              mtd: "Q",
              cx: this.x2 - this.AX1 - this.NX - this.getARX1() - this.getARX2(),
              cy: this.y1 + this.of - this.A,
              x: this.x2 - this.AX1 - this.NX - this.getARX1(),
              y: this.y1 + this.of - this.A + this.getARY()
            },
            { mtd: "L", x: this.x2 - this.AX1 - this.NX, y: this.y1 + this.of - this.S - this.NY },
            { mtd: "L", x: this.x2 - this.AX1, y: this.y1 + this.of - this.S },
            { mtd: "L", x: this.x2 - this.AX1, y: this.y1 + this.of },
            { mtd: "Z" }
          ];
        }
      },
      {
        name: "FRB",
        w: this.W + 2 * this.id - this.AX1,
        h: this.A,
        x: this.x1 + this.AX1,
        y: this.y2,
        dlist: () => {
          return [
            ...this.getROF({
              x: this.x2 - this.R,
              y: this.y2 + this.of,
              R: this.R,
              of: this.R - this.of,
              T: this.getAngle(this.AX - this.R, this.AS - this.of, this.R)
            }).LT.Bottom,
            { mtd: "L", x: this.x2 - this.AX, y: this.y2 + this.AS },
            { mtd: "L", x: this.x2 - this.AXX, y: this.y2 + this.A },
            {
              mtd: "L",
              x: this.x1 + this.AX1 + this.NX + this.getARX1() + this.getARX3(),
              y: this.y2 + this.A
            },
            {
              mtd: "Q",
              cx: this.x1 + this.AX1 + this.NX + this.getARX1() + this.getARX2(),
              cy: this.y2 + this.A,
              x: this.x1 + this.AX1 + this.NX + this.getARX1(),
              y: this.y2 + this.A - this.getARY()
            },
            { mtd: "L", x: this.x1 + this.AX1 + this.NX, y: this.y2 + this.S + this.NY },
            { mtd: "L", x: this.x1 + this.AX1, y: this.y2 + this.S },
            { mtd: "L", x: this.x1 + this.AX1, y: this.y2 },
            { mtd: "Z" }
          ];
        }
      },
      {
        name: "F",
        w: this.L + 2 * this.id,
        h: this.H + 2 * this.id + this.of,
        x: this.x2,
        y: this.y1 + this.of,
        dlist: () => {
          return [
            { mtd: "M", x: this.x2, y: this.y1 + this.of },
            { mtd: "L", x: this.x3, y: this.y1 + this.of },
            { mtd: "L", x: this.x3, y: this.y2 + this.of, foldline: "F_FL" },
            { mtd: "L", x: this.x2, y: this.y2 + this.of, foldline: "F_FB2" },
            { mtd: "Z" }
          ];
        }
      },
      {
        name: "FB2",
        w: this.L + 2 * this.id,
        h: this.W2,
        x: this.x2,
        y: this.y2 + this.of,
        dlist: () => {
          return [
            { mtd: "M", x: this.x2, y: this.y2 + this.of },
            { mtd: "L", x: this.x3, y: this.y2 + this.of },
            { mtd: "L", x: this.x3, y: this.y2 + this.of + this.W2 },
            { mtd: "L", x: this.x2, y: this.y2 + this.of + this.W2 },
            { mtd: "Z" }
          ];
        }
      },
      {
        name: "FB1",
        w: this.L + 2 * this.id - this.CX * 2,
        h: this.slot,
        x: this.x2 + this.CX,
        y: this.y2 + this.of + this.W2,
        dlist: () => {
          let x = this.slot - this.CR + this.CR * Math.cos(((90 - this.ct) * Math.PI) / 180);
          return [
            { mtd: "M", x: this.x2 + this.CX, y: this.y2 + this.of + this.W2 },
            {
              mtd: "L",
              x: this.x3 - this.CX,
              y: this.y2 + this.of + this.W2,
              foldline: "FB2_FB1",
              rotate: true
            },
            {
              mtd: "L",
              x: this.x3 - this.CX - x / Math.tan(((90 - this.ct) * Math.PI) / 180),
              y: this.y2 + this.of + this.W2 + x
            },
            {
              mtd: "Q",
              cx:
                this.x3 -
                this.CX -
                x / Math.tan(((90 - this.ct) * Math.PI) / 180) -
                this.CR * Math.cos((this.ct * Math.PI) / 180) +
                this.CR * Math.tan((((90 - this.ct) / 2) * Math.PI) / 180),
              cy: this.y2 + this.of + this.W2 + this.slot,
              x:
                this.x3 -
                this.CX -
                x / Math.tan(((90 - this.ct) * Math.PI) / 180) -
                this.CR * Math.cos((this.ct * Math.PI) / 180),
              y: this.y2 + this.of + this.W2 + this.slot
            },
            {
              mtd: "L",
              x:
                this.x2 +
                this.CX +
                x / Math.tan(((90 - this.ct) * Math.PI) / 180) +
                this.CR * Math.cos((this.ct * Math.PI) / 180),
              y: this.y2 + this.of + this.W2 + this.slot
            },
            {
              mtd: "Q",
              cx:
                this.x2 +
                this.CX +
                x / Math.tan(((90 - this.ct) * Math.PI) / 180) +
                this.CR * Math.cos((this.ct * Math.PI) / 180) -
                this.CR * Math.tan((((90 - this.ct) / 2) * Math.PI) / 180),
              cy: this.y2 + this.of + this.W2 + this.slot,
              x: this.x2 + this.CX + x / Math.tan(((90 - this.ct) * Math.PI) / 180),
              y: this.y2 + this.of + this.W2 + x
            },
            { mtd: "Z" }
          ];
        }
      },
      {
        name: "FL",
        w: this.W1,
        h: this.H + 2 * this.id - this.of,
        x: this.x3,
        y: this.y1 + this.of,
        dlist: () => {
          return [
            { mtd: "M", x: this.x3, y: this.y1 + this.of },
            { mtd: "L", x: this.x4, y: this.y1 + this.of, foldline: "FL_FLT" },
            { mtd: "L", x: this.x4, y: this.y2 },
            ...this.getROF({
              x: this.x3 + this.R,
              y: this.y2 + this.of,
              R: this.R,
              of: this.R - this.of,
              T: this.getAngle(this.AX - this.R, this.AS - this.of, this.R),
              foldline: "FL_FLB"
            }).RT.Top,
            {
              mtd: "Q",
              cx: this.x3,
              cy: this.y2 + this.of - this.R,
              x: this.x3,
              y: this.y2 + this.of
            },
            { mtd: "Z" }
          ];
        }
      },
      {
        name: "FLT",
        w: this.W1 - this.AX1,
        h: this.A,
        x: this.x3 + this.AX1,
        y: this.y1 + this.of - this.A,
        dlist: () => {
          return [
            { mtd: "M", x: this.x3 + this.AX1, y: this.y1 + this.of },
            { mtd: "L", x: this.x3 + this.AX1, y: this.y1 + this.of - this.S },
            { mtd: "L", x: this.x3 + this.AX1 + this.NX, y: this.y1 + this.of - this.S - this.NY },
            {
              mtd: "L",
              x: this.x3 + this.AX1 + this.NX + this.getARX1(),
              y: this.y1 + this.of - this.A + this.getARY()
            },
            {
              mtd: "Q",
              cx: this.x3 + this.AX1 + this.NX + this.getARX1() + this.getARX2(),
              cy: this.y1 + this.of - this.A,
              x: this.x3 + this.AX1 + this.NX + this.getARX1() + this.getARX3(),
              y: this.y1 + this.of - this.A
            },
            {
              mtd: "L",
              x: this.x3 + this.kw - this.AXX,
              y: this.y1 + this.of - this.A
            },
            {
              mtd: "L",
              x: this.x3 + this.kw - this.AX,
              y: this.y1 + this.of - this.AS
            },
            { mtd: "L", x: this.x4, y: this.y1 + this.of },
            { mtd: "Z" }
          ];
        }
      },
      {
        name: "FLB",
        w: this.W1,
        h: this.A,
        x: this.x3,
        y: this.y2,
        dlist: () => {
          return [
            { mtd: "M", x: this.x4, y: this.y2 },
            { mtd: "L", x: this.x4, y: this.y2 + this.S },
            { mtd: "L", x: this.x4 - this.NX, y: this.y2 + this.S + this.NY },
            {
              mtd: "L",
              x: this.x4 - this.NX - this.getARX1(),
              y: this.y2 + this.A - this.getARY()
            },
            {
              mtd: "Q",
              cx: this.x4 - this.NX - this.getARX1() - this.getARX2(),
              cy: this.y2 + this.A,
              x: this.x4 - this.NX - this.getARX1() - this.getARX3(),
              y: this.y2 + this.A
            },
            { mtd: "L", x: this.x3 + this.AXX, y: this.y2 + this.A },
            { mtd: "L", x: this.x3 + this.AX, y: this.y2 + this.AS },
            ...this.getROF({
              x: this.x3 + this.R,
              y: this.y2 + this.of,
              R: this.R,
              of: this.R - this.of,
              T: this.getAngle(this.AX - this.R, this.AS - this.of, this.R)
            }).RT.Bottom,
            { mtd: "Z" }
          ];
        }
      }
    ];
  }
  /**


* 获取切割线数据
* @param type 数据类型 array || svg
*/
  getCutLineData(type) {
    let x = this.slot - this.CR + this.CR * Math.cos(((90 - this.ct) * Math.PI) / 180);
    let arr = [
      //HT1-2
      { mtd: "M", x: this.sb, y: this.y1 },
      { mtd: "L", x: this.sb, y: this.y1 - this.W2 },
      { mtd: "L", x: this.sb + this.CX, y: this.y1 - this.W2 },
      {
        mtd: "L",
        x: this.sb + this.CX + x / Math.tan(((90 - this.ct) * Math.PI) / 180),
        y: this.y1 - this.W2 - x
      },
      {
        mtd: "Q",
        cx:
          this.sb +
          this.CX +
          x / Math.tan(((90 - this.ct) * Math.PI) / 180) +
          this.CR * Math.cos((this.ct * Math.PI) / 180) -
          this.CR * Math.tan((((90 - this.ct) / 2) * Math.PI) / 180),
        cy: this.y1 - this.W2 - this.slot,
        x:
          this.sb +
          this.CX +
          x / Math.tan(((90 - this.ct) * Math.PI) / 180) +
          this.CR * Math.cos((this.ct * Math.PI) / 180),
        y: this.y1 - this.W2 - this.slot
      },
      {
        mtd: "L",
        x:
          this.x1 -
          this.CX -
          x / Math.tan(((90 - this.ct) * Math.PI) / 180) -
          this.CR * Math.cos((this.ct * Math.PI) / 180),
        y: this.y1 - this.W2 - this.slot
      },
      {
        mtd: "Q",
        cx:
          this.x1 -
          this.CX -
          x / Math.tan(((90 - this.ct) * Math.PI) / 180) -
          this.CR * Math.cos((this.ct * Math.PI) / 180) +
          this.CR * Math.tan((((90 - this.ct) / 2) * Math.PI) / 180),
        cy: this.y1 - this.W2 - this.slot,
        x: this.x1 - this.CX - x * Math.tan((this.ct * Math.PI) / 180),
        y: this.y1 - this.W2 - x
      },
      { mtd: "L", x: this.x1 - this.CX, y: this.y1 - this.W2 },
      { mtd: "L", x: this.x1, y: this.y1 - this.W2 },
      { mtd: "L", x: this.x1, y: this.y1 },
      {
        mtd: "Q",
        cx: this.x1,
        cy: this.y1 + this.R,
        x: this.x1 + this.R,
        y: this.y1 + this.R
      },
      ...this.getROF({
        x: this.x1 + this.R,
        y: this.y1,
        R: this.R,
        of: this.R - this.of,
        T: this.getAngle(this.AX - this.R, this.AS - this.of, this.R)
      }).RB.Bottom.slice(1),
      //FRT
      ...this.getROF({
        x: this.x1 + this.R,
        y: this.y1,
        R: this.R,
        of: this.R - this.of,
        T: this.getAngle(this.AX - this.R, this.AS - this.of, this.R)
        // foldline:"F_F"
      }).RB.Top.slice(1),
      { mtd: "L", x: this.x1 + this.AX, y: this.y1 + this.of - this.AS },
      // modify
      { mtd: "L", x: this.x1 + this.AXX, y: this.y1 + this.of - this.A },
      {
        mtd: "L",
        x: this.x2 - this.AX1 - this.NX - this.getARX1() - this.getARX3(),
        y: this.y1 + this.of - this.A
      },
      {
        mtd: "Q",
        cx: this.x2 - this.AX1 - this.NX - this.getARX1() - this.getARX2(),
        cy: this.y1 + this.of - this.A,
        x: this.x2 - this.AX1 - this.NX - this.getARX1(),
        y: this.y1 + this.of - this.A + this.getARY()
      },
      { mtd: "L", x: this.x2 - this.AX1 - this.NX, y: this.y1 + this.of - this.S - this.NY },
      { mtd: "L", x: this.x2 - this.AX1, y: this.y1 + this.of - this.S },
      { mtd: "L", x: this.x2 - this.AX1, y: this.y1 + this.of },
      //FLT
      { mtd: "L", x: this.x3 + this.AX1, y: this.y1 + this.of },
      { mtd: "L", x: this.x3 + this.AX1, y: this.y1 + this.of - this.S },
      { mtd: "L", x: this.x3 + this.AX1 + this.NX, y: this.y1 + this.of - this.S - this.NY },
      {
        mtd: "L",
        x: this.x3 + this.AX1 + this.NX + this.getARX1(),
        y: this.y1 + this.of - this.A + this.getARY()
      },
      {
        mtd: "Q",
        cx: this.x3 + this.AX1 + this.NX + this.getARX1() + this.getARX2(),
        cy: this.y1 + this.of - this.A,
        x: this.x3 + this.AX1 + this.NX + this.getARX1() + this.getARX3(),
        y: this.y1 + this.of - this.A
      },
      { mtd: "L", x: this.x3 + this.kw - this.AXX, y: this.y1 + this.of - this.A },
      { mtd: "L", x: this.x3 + this.kw - this.AX, y: this.y1 + this.of - this.AS },
      { mtd: "L", x: this.x4, y: this.y1 + this.of },
      //FLB
      { mtd: "L", x: this.x4, y: this.y2 + this.S },
      { mtd: "L", x: this.x4 - this.NX, y: this.y2 + this.S + this.NY },
      {
        mtd: "L",
        x: this.x4 - this.NX - this.getARX1(),
        y: this.y2 + this.A - this.getARY()
      },
      {
        mtd: "Q",
        cx: this.x4 - this.NX - this.getARX1() - this.getARX2(),
        cy: this.y2 + this.A,
        x: this.x4 - this.NX - this.getARX1() - this.getARX3(),
        y: this.y2 + this.A
      },
      { mtd: "L", x: this.x3 + this.AXX, y: this.y2 + this.A },
      { mtd: "L", x: this.x3 + this.AX, y: this.y2 + this.AS },
      ...this.getROF({
        x: this.x3 + this.R,
        y: this.y2 + this.of,
        R: this.R,
        of: this.R - this.of,
        T: this.getAngle(this.AX - this.R, this.AS - this.of, this.R)
      }).RT.Bottom,
      //FL
      ...this.getROF({
        x: this.x3 + this.R,
        y: this.y2 + this.of,
        R: this.R,
        of: this.R - this.of,
        T: this.getAngle(this.AX - this.R, this.AS - this.of, this.R),
        foldline: "FL_FLB"
      }).RT.Top,
      {
        mtd: "Q",
        cx: this.x3,
        cy: this.y2 + this.of - this.R,
        x: this.x3,
        y: this.y2 + this.of
      },
      //FB1-2
      { mtd: "L", x: this.x3, y: this.y2 + this.of + this.W2 },
      { mtd: "L", x: this.x3 - this.CX, y: this.y2 + this.of + this.W2 },
      {
        mtd: "L",
        x: this.x3 - this.CX - x / Math.tan(((90 - this.ct) * Math.PI) / 180),
        y: this.y2 + this.of + this.W2 + x
      },
      {
        mtd: "Q",
        cx:
          this.x3 -
          this.CX -
          x / Math.tan(((90 - this.ct) * Math.PI) / 180) -
          this.CR * Math.cos((this.ct * Math.PI) / 180) +
          this.CR * Math.tan((((90 - this.ct) / 2) * Math.PI) / 180),
        cy: this.y2 + this.of + this.W2 + this.slot,
        x:
          this.x3 -
          this.CX -
          x / Math.tan(((90 - this.ct) * Math.PI) / 180) -
          this.CR * Math.cos((this.ct * Math.PI) / 180),
        y: this.y2 + this.of + this.W2 + this.slot
      },
      {
        mtd: "L",
        x:
          this.x2 +
          this.CX +
          x / Math.tan(((90 - this.ct) * Math.PI) / 180) +
          this.CR * Math.cos((this.ct * Math.PI) / 180),
        y: this.y2 + this.of + this.W2 + this.slot
      },
      {
        mtd: "Q",
        cx:
          this.x2 +
          this.CX +
          x / Math.tan(((90 - this.ct) * Math.PI) / 180) +
          this.CR * Math.cos((this.ct * Math.PI) / 180) -
          this.CR * Math.tan((((90 - this.ct) / 2) * Math.PI) / 180),
        cy: this.y2 + this.of + this.W2 + this.slot,
        x: this.x2 + this.CX + x / Math.tan(((90 - this.ct) * Math.PI) / 180),
        y: this.y2 + this.of + this.W2 + x
      },
      { mtd: "L", x: this.x2 + this.CX, y: this.y2 + this.of + this.W2 },
      { mtd: "L", x: this.x2, y: this.y2 + this.of + this.W2 },
      { mtd: "L", x: this.x2, y: this.y2 + this.of },

      //FR
      {
        mtd: "Q",
        cx: this.x2,
        cy: this.y2 + this.of - this.R,
        x: this.x2 - this.R,
        y: this.y2 + this.of - this.R
      },
      ...this.getROF({
        x: this.x2 - this.R,
        y: this.y2 + this.of,
        R: this.R,
        of: this.R - this.of,
        T: this.getAngle(this.AX - this.R, this.AS - this.of, this.R)
      }).LT.Top,
      //FRB
      ...this.getROF({
        x: this.x2 - this.R,
        y: this.y2 + this.of,
        R: this.R,
        of: this.R - this.of,
        T: this.getAngle(this.AX - this.R, this.AS - this.of, this.R)
      }).LT.Bottom.slice(1),
      { mtd: "L", x: this.x2 - this.AX, y: this.y2 + this.AS },
      { mtd: "L", x: this.x2 - this.AXX, y: this.y2 + this.A },
      {
        mtd: "L",
        x: this.x1 + this.AX1 + this.NX + this.getARX1() + this.getARX3(),
        y: this.y2 + this.A
      },
      {
        mtd: "Q",
        cx: this.x1 + this.AX1 + this.NX + this.getARX1() + this.getARX2(),
        cy: this.y2 + this.A,
        x: this.x1 + this.AX1 + this.NX + this.getARX1(),
        y: this.y2 + this.A - this.getARY()
      },
      { mtd: "L", x: this.x1 + this.AX1 + this.NX, y: this.y2 + this.S + this.NY },
      { mtd: "L", x: this.x1 + this.AX1, y: this.y2 + this.S },
      { mtd: "L", x: this.x1 + this.AX1, y: this.y2 },
      { mtd: "L", x: this.sb, y: this.y2 },
      //HL
      { mtd: "L", x: 0, y: this.y2 - this.getT1() },
      { mtd: "L", x: 0, y: this.y1 + this.of + this.getT1() },
      { mtd: "L", x: this.sb, y: this.y1 + this.of },
      { mtd: "L", x: this.sb, y: this.y1 },
      { mtd: "Z" }
    ];
    return type === "svg" ? this.filterD(arr) : arr;
  }

  /**
   * 获取折叠线
   */
  getFoldLineData() {
    let dis = 0.001;
    // return [];
    return this.getFoldLine(this.getFaceData());
  }

  /**
   * 获取出血线
   * @param {string}  svg || array
   */
  getBleedingLine(type) {
    let limit = (this.options.bleed || 3) * this.scale;
    let arr = [
      //HT1-2
      { mtd: "M", x: this.sb, y: this.CR },
      { mtd: "Q", cx: this.sb, cy: 0, x: this.sb + this.CR, y: 0 },
      { mtd: "L", x: this.x1 - this.CR + limit * 2, y: 0 },
      { mtd: "Q", cx: this.x1 + limit * 2, cy: 0, x: this.x1 + limit * 2, y: this.CR },
      { mtd: "L", x: this.x1 + limit * 2, y: this.y1 + this.of - this.A },

      //FRT
      { mtd: "L", x: this.x2 - this.AX1 - this.AR + limit * 2, y: this.y1 + this.of - this.A },
      {
        mtd: "Q",
        cx: this.x2 - this.AX1 + limit * 2,
        cy: this.y1 + this.of - this.A,
        x: this.x2 - this.AX1 + limit * 2,
        y: this.y1 + this.of - this.A + this.AR
      },
      { mtd: "L", x: this.x2 - this.AX1 + limit * 2, y: this.y1 + this.of },
      { mtd: "L", x: this.x3 + this.AX1, y: this.y1 + this.of },

      //FLT
      { mtd: "L", x: this.x3 + this.AX1, y: this.y1 + this.of - this.A + this.AR },
      {
        mtd: "Q",
        cx: this.x3 + this.AX1,
        cy: this.y1 + this.of - this.A,
        x: this.x3 + this.AX1 + this.AR,
        y: this.y1 + this.of - this.A
      },
      { mtd: "L", x: this.x4 - this.CR / 2 + limit * 2, y: this.y1 + this.of - this.A },
      {
        mtd: "Q",
        cx: this.x4 + limit * 2,
        cy: this.y1 + this.of - this.A,
        x: this.x4 + limit * 2,
        y: this.y1 + this.of - this.A + this.CR / 2
      },

      //FLB
      { mtd: "L", x: this.x4 + limit * 2, y: this.y2 + this.A - this.AR + limit * 2 },
      {
        mtd: "Q",
        cx: this.x4 + limit * 2,
        cy: this.y2 + this.A + limit * 2,
        x: this.x4 - this.AR + limit * 2,
        y: this.y2 + this.A + limit * 2
      },
      { mtd: "L", x: this.x3 + limit * 2, y: this.y2 + this.A + limit * 2 },

      //FB1-2
      { mtd: "L", x: this.x3 + limit * 2, y: this.y3 - this.CR + limit * 2 },
      {
        mtd: "Q",
        cx: this.x3 + limit * 2,
        cy: this.y3 + limit * 2,
        x: this.x3 - this.CR + limit * 2,
        y: this.y3 + limit * 2
      },
      { mtd: "L", x: this.x2 + this.CR, y: this.y3 + limit * 2 },
      {
        mtd: "Q",
        cx: this.x2,
        cy: this.y3 + limit * 2,
        x: this.x2,
        y: this.y3 - this.CR + limit * 2
      },
      { mtd: "L", x: this.x2, y: this.y2 + this.A + limit * 2 },

      //FRB
      { mtd: "L", x: this.x1 + this.AX1 + this.AR, y: this.y2 + this.A + limit * 2 },
      {
        mtd: "Q",
        cx: this.x1 + this.AX1,
        cy: this.y2 + this.A + limit * 2,
        x: this.x1 + this.AX1,
        y: this.y2 + this.A - this.AR + limit * 2
      },
      { mtd: "L", x: this.x1 + this.AX1, y: this.y2 + limit * 2 },
      { mtd: "L", x: this.sb + this.CR / 2, y: this.y2 + limit * 2 },
      {
        mtd: "Q",
        cx: this.sb,
        cy: this.y2 + limit * 2,
        x: this.sb,
        y: this.y2 - this.CR / 2 + limit * 2
      },
      { mtd: "Z" }
    ];
    return type === "svg" ? this.filterD(arr) : arr;
  }

  /**
   * 获取镂空数据
   * @param type 数据类型 array || svg
   */
  getHolesData(type) {
    let arr = [];
    return this.filterHoles(type, arr);
  }

  // 调整3D视图
  transform() {
    return {
      position: {
        x: -this.x2 - this.kl / 2,
        y: this.y2 + this.of - this.kh / 2,
        z: this.kw / 2
      },
      renderY: this.y2 + this.of,
      rotate: {
        x: Math.PI,
        y: 0,
        z: 0
      }
    };
  }

  // 定义动画
  animationDefind() {
    let arr = [
      [
        { name: "H_HL", rotate: 90.2 },
        { name: "F_FR", rotate: 89.8 },
        { name: "FR_H", rotate: 89.8 }
      ],
      [{ name: "F_FL", rotate: -89.8 }],
      [
        { name: "FR_FRB", rotate: -89.8 },
        { name: "FL_FLB", rotate: -89.8 }
      ],
      [{ name: "FB2_FB1", rotate: 90.2 }],
      [{ name: "F_FB2", rotate: -89.8 }],
      [
        { name: "FR_FRT", rotate: -89.8 },
        { name: "FL_FLT", rotate: -89.8 }
      ],
      [{ name: "HT2_HT1", rotate: 90.2 }],
      [{ name: "H_HT2", rotate: -89.8 }]
    ];
    return this.filterAnimate(arr, this.getFoldLineData());
  }
  /**
   * 获取动画步数
   */
  getAnimationStep() {
    return 6;
  }

  /**
   * 定义函数获取刀模尺寸
   */
  getKnifeSize() {
    return {
      L: this.L + this.id * 2,
      W: this.W + this.id * 2,
      H: this.H + this.id * 2 + this.of
    };
  }

  /**
   * 定义函数获取内尺寸
   */
  getSize() {
    return {
      L: this.L,
      W: this.W,
      H: this.H,
      D: this.D,
      id: this.id,
      ed: this.ed
    };
  }

  /**
   * 定义函数获取总尺寸
   */
  getTotalSize() {
    return {
      x: this.x4,
      y: this.y3
    };
  }

  /**
   * 格式化为svg的路径
   */
  getFaceDataToSvg() {
    return this.getFaceSvgData(this.getFaceData());
  }

  /**
   * 获取外尺寸
   */
  getOuterSize() {
    return {
      L: this.L + 2 * this.D,
      W: this.W + 2 * this.D,
      H: this.H + 4 * this.D
    };
  }

  /**
   * 获取外尺寸增量算法
   */
  getOutSizeAdd() {
    return {
      L: { d: 2 },
      W: { d: 2 },
      H: { d: 4 }
    };
  }

  /**
   * 获取刀模尺寸算量
   */
  getKnifeSizeAdd() {
    return {
      L: { id: 2 },
      W: { id: 2 },
      H: { id: 2, of: 1 }
    };
  }

  /**
   * 封装方法
   */
  // 糊口
  getT() {
    return this.sb * Math.tan((this.gt * Math.PI) / 180);
  }
};
