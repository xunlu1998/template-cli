const Arrow = require("./arrow");
const Base = require("../base");
/**
 * <%= description %> <%= id %>
 * @<%= author %>
 */
module.exports = class  <%= name %> extends Base {
  /**
   * @param {*} L 长
   * @param {*} W 宽
   * @param {*} H 高
   * @param {*} D 纸厚
   * @param {*} scale 缩放
   * @param {*} id 内损
   * @param {*} ed 外损
   * @param {*} options 配置
   */
  constructor(L = Number, W = Number, H = Number, D = Number, scale = 1, id, ed, options = {}) {
    super();
    this.L = L * scale;
    this.W = W * scale;
    this.H = H * scale;
    this.D = D * scale;
    this.scale = scale;
    this.id = id * scale;
    this.ed = ed * scale;
    this.options = options;

    this.arrCheck = [];
    this.arrCheck1 = [];

    //定义刀模尺寸的长宽高
    this.knifeL = this.getKnifeSize().L;
    this.knifeW = this.getKnifeSize().W;
    this.knifeH = this.getKnifeSize().H;

    this.D1 = this.knifeH - this.D;
    this.L1 = this.getcheck(
      this.floorM(this.knifeL / 2),
      0,
      this.floorM(this.knifeL / 2),
      "内摇盖长度"
    );
    this.W1 = this.getcheck(
      this.floorM(this.knifeW / 2, this.scale, 0.5),
      0,
      this.floorM(this.knifeW / 2, this.scale, 0.5),
      "外摇盖宽度"
    );
    this.OF = this.D;
    this.L2 = this.getcheck(this.roundM(this.L1 / 2), 0, this.L1, "内卡开孔长度");
    this.W2 = this.getcheck(
      this.roundM(this.knifeW / 2),
      0,
      this.roundM(((this.knifeW - 2 * this.OF) * 2) / 3),
      "内卡开孔宽度"
    );

    this.x1 = this.L1;
    this.x2 = this.x1 + this.D1;
    this.x3 = this.x2 + this.knifeL;
    this.x4 = this.x3 + this.D1;
    this.x5 = this.x4 + this.L1;
    this.y1 = this.W1;
    this.y2 = this.y1 + this.knifeH;
    this.y3 = this.y2 + this.knifeW;
    this.y4 = this.y3 + this.knifeH;
    this.y5 = this.y4 + this.W1;
  }

  //检查
  check() {
    let arr = [
      { ename: this.knifeL, cname: "长度", min: 10 * this.scale, max: 2000 * this.scale },
      { ename: this.knifeW, cname: "宽度", min: 10 * this.scale, max: 2000 * this.scale },
      { ename: this.knifeH, cname: "高度", min: 10 * this.scale, max: 2000 * this.scale },
      ...this.arrCheck
    ];
    return this.forCheck(arr);
  }

  getCCAL() {
    return 15;
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
      this.x2,
      this.x3,
      this.knifeW / 3 + this.y2,
      limit,
      "L=" + this.divide(valueL, this.scale)
    );

    let arrowW = arrow.arrowVertical(
      this.x2 + this.knifeL / 4,
      this.y2,
      this.y3,
      limit,
      "W=" + this.divide(valueW, this.scale)
    );
    let arrowH = arrow.arrowVertical(
      this.x2 + this.knifeL / 4,
      this.y1,
      this.y2,
      limit,
      "H=" + this.divide(valueH, this.scale)
    );
    return this.filterArrow(type, arrowL, arrowW, arrowH);
  }

  /**
   * 3D动画
   * position:坐标轴位移
   * rotate:坐标轴旋转
   */
  transform() {
    return {
      position: {
        x: -this.x2 - this.knifeL / 2,
        y: -this.knifeH / 2,
        z: this.y2 + this.knifeW / 2
      },
      renderY: 0,
      rotate: {
        x: -Math.PI / 2,
        y: 0,
        z: 0
      }
    };
  }

  /**
   * 获取内尺寸
   */
  getSize() {
    return {
      L: this.L,
      W: this.W,
      H: this.H,
      D: this.D
    };
  }

  /**
   * 获取外尺寸
   */
  getOuterSize() {
    return {
      L: this.L + this.D *  <%= OSLd %>,
      W: this.W + this.D *  <%= OSWd %>,
      H: this.H + this.D *  <%= OSHd %>
    };
  }

  /**
   * 获取刀模尺寸
   */
  getKnifeSize() {
    return {
      L: this.L + this.id * <%= KSLid %>,
      W: this.W + this.id * <%= KSWid %>,
      H: this.H + this.id * <%= KSHid %> + this.D*<%= KSHd %>
    };
  }

  /**
   * 获取外尺寸增量算法
   */
  getOutSizeAdd() {
    return {
      L: { d:  <%= OSLd %> },
      W: { d:  <%= OSWd %> },
      H: { d:  <%= OSHd %> }
    };
  }

  /**
   * 获取刀模尺寸算量
   */
  getKnifeSizeAdd() {
    return {
      L: { id: <%= KSLid %> },
      W: { id: <%= KSWid %> },
      H: { id: <%= KSHid %>, d: <%= KSHd %> }
    };
  }

  /**
   * 获取总尺寸
   */
  getTotalSize() {
    return {
      x: this.x5,
      y: this.y5
    };
  }

  /**
   * 获取面数据
   *
   */
  getFaceData() {
    return [
      {
        name: "H",
        w: this.knifeL,
        h: this.knifeW,
        x: this.x2,
        y: this.y2,
        dlist: () => {
          return [
            { mtd: "M", x: this.x2, y: this.y2 },
            { mtd: "L", x: this.x3, y: this.y2, foldline: "H_HT" },
            { mtd: "L", x: this.x3, y: this.y3 },
            { mtd: "L", x: this.x2, y: this.y3, foldline: "H_HB" },
            { mtd: "Z" }
          ];
        }
      },
      {
        name: "HT",
        w: this.knifeL,
        h: this.knifeH,
        x: this.x2,
        y: this.y1,
        dlist: () => {
          return [
            { mtd: "M", x: this.x2, y: this.y1 },
            { mtd: "L", x: this.x3, y: this.y1, foldline: "HT_HT1" },
            { mtd: "L", x: this.x3, y: this.y2 },
            { mtd: "L", x: this.x2, y: this.y2 },
            { mtd: "Z" }
          ];
        }
      },
      {
        name: "HT1",
        w: this.knifeL,
        h: this.W1,
        x: this.x2,
        y: 0,
        dlist: () => {
          return [
            { mtd: "M", x: this.x2, y: 0 },
            { mtd: "L", x: this.x3, y: 0 },
            { mtd: "L", x: this.x3, y: this.y1 },
            { mtd: "L", x: this.x2, y: this.y1 },
            { mtd: "Z" }
          ];
        }
      },
      {
        name: "HB",
        w: this.knifeL,
        h: this.knifeH,
        x: this.x2,
        y: this.y3,
        dlist: () => {
          return [
            { mtd: "M", x: this.x2, y: this.y3 },
            { mtd: "L", x: this.x3, y: this.y3 },
            { mtd: "L", x: this.x3, y: this.y4 },
            { mtd: "L", x: this.x2, y: this.y4, foldline: "HB_HB1" },
            { mtd: "Z" }
          ];
        }
      },
      {
        name: "HB1",
        w: this.knifeL,
        h: this.W1,
        x: this.x2,
        y: this.y4,
        dlist: () => {
          return [
            { mtd: "M", x: this.x2, y: this.y4 },
            { mtd: "L", x: this.x3, y: this.y4 },
            { mtd: "L", x: this.x3, y: this.y5 },
            { mtd: "L", x: this.x2, y: this.y5 },
            { mtd: "Z" }
          ];
        }
      },
      {
        name: "HR",
        w: this.D1,
        h: this.knifeW - this.OF * 2,
        x: this.x1,
        y: this.y2 + this.OF,
        dlist: () => {
          return [
            { mtd: "M", x: this.x1, y: this.y2 + this.OF },
            { mtd: "L", x: this.x2, y: this.y2 + this.OF },
            { mtd: "L", x: this.x2, y: this.y3 - this.OF, foldline: "H_HR" },
            { mtd: "L", x: this.x1, y: this.y3 - this.OF },
            { mtd: "Z" }
          ];
        }
      },
      {
        name: "HR1",
        w: this.L1 - this.L2,
        h: this.knifeW - this.OF * 2,
        x: this.L2,
        y: this.y2 + this.OF,
        dlist: () => {
          return [
            { mtd: "M", x: 0, y: this.y2 + this.OF },
            { mtd: "L", x: this.x1, y: this.y2 + this.OF },
            { mtd: "L", x: this.x1, y: this.y3 - this.OF, foldline: "HR_HR1", rotate: true },
            { mtd: "L", x: 0, y: this.y3 - this.OF },
            { mtd: "L", x: 0, y: this.y3 - this.OF - (this.knifeW - this.OF * 2 - this.W2) / 2 },
            {
              mtd: "L",
              x: this.L2,
              y: this.y3 - this.OF - (this.knifeW - this.OF * 2 - this.W2) / 2
            },
            {
              mtd: "L",
              x: this.L2,
              y: this.y2 + this.OF + (this.knifeW - this.OF * 2 - this.W2) / 2
            },
            {
              mtd: "L",
              x: 0,
              y: this.y2 + this.OF + (this.knifeW - this.OF * 2 - this.W2) / 2
            },
            { mtd: "Z" }
          ];
        }
      },
      {
        name: "HL",
        w: this.D1,
        h: this.knifeW - this.OF * 2,
        x: this.x3,
        y: this.y2 + this.OF,
        dlist: () => {
          return [
            { mtd: "M", x: this.x3, y: this.y2 + this.OF },
            { mtd: "L", x: this.x4, y: this.y2 + this.OF },
            { mtd: "L", x: this.x4, y: this.y3 - this.OF },
            { mtd: "L", x: this.x3, y: this.y3 - this.OF },
            { mtd: "L", x: this.x3, y: this.y2 + this.OF, foldline: "H_HL" },
            { mtd: "Z" }
          ];
        }
      },
      {
        name: "HL1",
        w: this.L1 - this.L2,
        h: this.knifeW - this.OF * 2,
        x: this.x4,
        y: this.y2 + this.OF,
        dlist: () => {
          return [
            { mtd: "M", x: this.x4, y: this.y2 + this.OF },
            { mtd: "L", x: this.x5, y: this.y2 + this.OF },
            {
              mtd: "L",
              x: this.x5,
              y: this.y2 + this.OF + (this.knifeW - this.OF * 2 - this.W2) / 2
            },
            {
              mtd: "L",
              x: this.x5 - this.L2,
              y: this.y2 + this.OF + (this.knifeW - this.OF * 2 - this.W2) / 2
            },
            {
              mtd: "L",
              x: this.x5 - this.L2,
              y: this.y3 - this.OF - (this.knifeW - this.OF * 2 - this.W2) / 2
            },
            {
              mtd: "L",
              x: this.x5,
              y: this.y3 - this.OF - (this.knifeW - this.OF * 2 - this.W2) / 2
            },
            {
              mtd: "L",
              x: this.x5,
              y: this.y3 - this.OF
            },
            {
              mtd: "L",
              x: this.x4,
              y: this.y3 - this.OF
            },
            {
              mtd: "L",
              x: this.x4,
              y: this.y2 + this.OF,
              foldline: "HL_HL1",
              rotate: true
            },
            { mtd: "Z" }
          ];
        }
      }
    ];
  }

  /**
   * 格式化为svg的路径
   */
  getFaceDataToSvg() {
    return this.getFaceSvgData(this.getFaceData());
  }

  /**
   * 获取切割线数据
   * @param type 数据类型 'array','svg'
   */
  getCutLineData(type) {
    let arr = [
      { mtd: "M", x: 0, y: this.y2 + this.OF },
      { mtd: "L", x: this.x2, y: this.y2 + this.OF },
      { mtd: "L", x: this.x2, y: 0 },
      { mtd: "L", x: this.x3, y: 0 },
      { mtd: "L", x: this.x3, y: this.y2 + this.OF },
      { mtd: "L", x: this.x5, y: this.y2 + this.OF },
      {
        mtd: "L",
        x: this.x5,
        y: this.y2 + this.OF + (this.knifeW - this.OF * 2 - this.W2) / 2
      },
      {
        mtd: "L",
        x: this.x5 - this.L2,
        y: this.y2 + this.OF + (this.knifeW - this.OF * 2 - this.W2) / 2
      },
      {
        mtd: "L",
        x: this.x5 - this.L2,
        y: this.y3 - this.OF - (this.knifeW - this.OF * 2 - this.W2) / 2
      },
      {
        mtd: "L",
        x: this.x5,
        y: this.y3 - this.OF - (this.knifeW - this.OF * 2 - this.W2) / 2
      },
      {
        mtd: "L",
        x: this.x5,
        y: this.y3 - this.OF
      },
      {
        mtd: "L",
        x: this.x3,
        y: this.y3 - this.OF
      },
      {
        mtd: "L",
        x: this.x3,
        y: this.y5
      },
      {
        mtd: "L",
        x: this.x2,
        y: this.y5
      },
      {
        mtd: "L",
        x: this.x2,
        y: this.y3 - this.OF
      },
      { mtd: "L", x: 0, y: this.y3 - this.OF },
      { mtd: "L", x: 0, y: this.y3 - this.OF - (this.knifeW - this.OF * 2 - this.W2) / 2 },
      {
        mtd: "L",
        x: this.L2,
        y: this.y3 - this.OF - (this.knifeW - this.OF * 2 - this.W2) / 2
      },
      {
        mtd: "L",
        x: this.L2,
        y: this.y2 + this.OF + (this.knifeW - this.OF * 2 - this.W2) / 2
      },
      {
        mtd: "L",
        x: 0,
        y: this.y2 + this.OF + (this.knifeW - this.OF * 2 - this.W2) / 2
      },
      { mtd: "L", x: 0, y: this.y2 + this.OF },
      { mtd: "Z" }
    ];
    return type === "svg" ? this.filterD(arr) : arr;
  }

  /**
   * 获取折叠线
   */
  getFoldLineData() {
    let dis = 0.001;
    return this.getFoldLine(this.getFaceData());
  }

  /**
   * 获取动画步数
   */
  getAnimationStep() {
    return 5;
  }

  /**
   * 定义动画
   */
  animationDefind() {
    let arr = [
      [
        { name: "H_HR", rotate: 89.8 },
        { name: "H_HL", rotate: 89.8 },
        { name: "HR_HR1", rotate: 90.2 },
        { name: "HL_HL1", rotate: 90.2 }
      ],
      [
        { name: "H_HT", rotate: -89.8 },
        { name: "H_HB", rotate: -89.8 },
        { name: "HT_HT1", rotate: -89.8 },
        { name: "HB_HB1", rotate: -89.8 }
      ]
    ];
    return this.filterAnimate(arr, this.getFoldLineData());
  }

  /**
   * 获取镂空数据
   * @param type 数据类型 array || svg
   */
  getHolesData(type) {
    let arr = [];

    return this.filterHoles(type, arr);
  }

  /**
   * 获取出血线
   * @param {string}  svg or array
   */
  getBleedingLine(type) {
    let limit = (this.options.bleed || 3) * this.scale;
    let arr = [
      { mtd: "M", x: 0, y: this.y2 + this.OF },
      { mtd: "L", x: this.x2, y: this.y2 + this.OF },
      { mtd: "L", x: this.x2, y: 0 },
      { mtd: "L", x: this.x3 + limit * 2, y: 0 },
      { mtd: "L", x: this.x3 + limit * 2, y: this.y2 + this.OF },
      { mtd: "L", x: this.x5 + limit * 2, y: this.y2 + this.OF }
    ];
    if (this.W1 > limit * 2)
      arr.push(
        {
          mtd: "L",
          x: this.x5 + limit * 2,
          y: this.y2 + this.OF + (this.knifeW - this.OF * 2 - this.W2) / 2 + limit * 2
        },
        {
          mtd: "L",
          x: this.x5 - this.L2 + limit * 2,
          y: this.y2 + this.OF + (this.knifeW - this.OF * 2 - this.W2) / 2 + limit * 2
        },
        {
          mtd: "L",
          x: this.x5 - this.L2 + limit * 2,
          y: this.y3 - this.OF - (this.knifeW - this.OF * 2 - this.W2) / 2
        },
        {
          mtd: "L",
          x: this.x5 + limit * 2,
          y: this.y3 - this.OF - (this.knifeW - this.OF * 2 - this.W2) / 2
        },
        {
          mtd: "L",
          x: this.x5 + limit * 2,
          y: this.y3 - this.OF + limit * 2
        },
        {
          mtd: "L",
          x: this.x3 + limit * 2,
          y: this.y3 - this.OF + limit * 2
        },
        {
          mtd: "L",
          x: this.x3 + limit * 2,
          y: this.y5 + limit * 2
        },
        {
          mtd: "L",
          x: this.x2,
          y: this.y5 + limit * 2
        },
        {
          mtd: "L",
          x: this.x2,
          y: this.y3 - this.OF + limit * 2
        },
        { mtd: "L", x: 0, y: this.y3 - this.OF + limit * 2 },
        { mtd: "L", x: 0, y: this.y3 - this.OF - (this.knifeW - this.OF * 2 - this.W2) / 2 },
        {
          mtd: "L",
          x: this.L2,
          y: this.y3 - this.OF - (this.knifeW - this.OF * 2 - this.W2) / 2
        },
        {
          mtd: "L",
          x: this.L2,
          y: this.y2 + this.OF + (this.knifeW - this.OF * 2 - this.W2) / 2 + limit * 2
        },
        {
          mtd: "L",
          x: 0,
          y: this.y2 + this.OF + (this.knifeW - this.OF * 2 - this.W2) / 2 + limit * 2
        },
        { mtd: "L", x: 0, y: this.y2 + this.OF },
        { mtd: "Z" }
      );
    else
      arr.push(
        {
          mtd: "L",
          x: this.x5 + limit * 2,
          y: this.y3 - this.OF - (this.knifeW - this.OF * 2 - this.W2) / 2
        },
        {
          mtd: "L",
          x: this.x5 + limit * 2,
          y: this.y3 - this.OF + limit * 2
        },
        {
          mtd: "L",
          x: this.x3 + limit * 2,
          y: this.y3 - this.OF + limit * 2
        },
        {
          mtd: "L",
          x: this.x3 + limit * 2,
          y: this.y5 + limit * 2
        },
        {
          mtd: "L",
          x: this.x2,
          y: this.y5 + limit * 2
        },
        {
          mtd: "L",
          x: this.x2,
          y: this.y3 - this.OF + limit * 2
        },
        { mtd: "L", x: 0, y: this.y3 - this.OF + limit * 2 },
        { mtd: "L", x: 0, y: this.y2 + this.OF },
        { mtd: "Z" }
      );

    return type === "svg" ? this.filterD(arr) : arr;
  }
};
