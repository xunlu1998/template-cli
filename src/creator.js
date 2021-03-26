const chalk = require("chalk");
const fs = require("fs-extra");
const inquirer = require("inquirer");
const memFs = require("mem-fs");
const memFsEditor = require("mem-fs-editor");
const path = require("path");

class Creator {
  constructor() {
    // 创建内存store
    const store = memFs.create();
    this.fs = memFsEditor.create(store);
    // 存储命令行获取的数据，
    this.options = {
      type: "",
      id: "",
      description: "",
      author: "",
      name: ""
    };

    // 当前根目录
    this.rootPath = path.resolve(__dirname, "../");
    // 模板目录
    this.tplDirpath = path.join(this.rootPath, "template");
  }
  // 初始化；
  // ...
  init() {
    console.log(chalk.green("my cli 开始"));
    console.log();
    this.ask().then(answers => {
      this.options = Object.assign({}, this.options, answers);
      this.write();
    });
  }
  // ...

  // 和命令行交互；
  ask() {
    // 问题
    const questions = [
      {
        type: "rawlist",
        name: "type",
        message: "你要画甚么盒子",
        choices: ["管式盒", "文件夹/封套", "纸箱", "其他"]
      },
      {
        type: "input",
        name: "id",
        message: "盒子的编号呢",
        validate: function(value) {
          var pass = value.match(/^\d{6}$/);
          if (pass) {
            return true;
          }
          return "请输入正确的编号";
        }
      },
      {
        type: "input",
        name: "description",
        message: "我想盒子应该有中文名称"
      },
      {
        type: "input",
        name: "author",
        message: "不得不留下你的名字",
        validate: function(input) {
          if (!input) {
            return "请输入你的名字";
          }
          return true;
        }
      },
      {
        type: "input",
        name: "name",
        message: "这个项目叫甚么好呢",
        validate(input) {
          if (!input) {
            return "请输入项目名称!";
          }

          if (fs.existsSync(input)) {
            return "项目名已重复!";
          }

          return true;
        }
      },
      // 制作尺寸
      {
        type: "input",
        name: "KSLid",
        message: "你需要输入长度制作尺寸IIL的系数",
        validate: function(value) {
          var valid = !isNaN(parseFloat(value));
          return valid || "Please enter a number";
        },
        filter: Number
      },
      {
        type: "input",
        name: "KSWid",
        message: "你需要输入宽度制作尺寸IIL的系数",
        validate: function(value) {
          var valid = !isNaN(parseFloat(value));
          return valid || "Please enter a number";
        },
        filter: Number
      },
      {
        type: "input",
        name: "KSHid",
        message: "你需要输入高度制作尺寸IIL的系数",
        validate: function(value) {
          var valid = !isNaN(parseFloat(value));
          return valid || "Please enter a number";
        },
        filter: Number
      },
      {
        type: "input",
        name: "KSHd",
        message: "你需要输入高度制作尺寸CCAL的系数",
        validate: function(value) {
          var valid = !isNaN(parseFloat(value));
          return valid || "Please enter a number";
        },
        filter: Number
      },
      {
        type: "input",
        name: "KSHof",
        message: "你需要输入高度制作尺寸of的系数",
        validate: function(value) {
          var valid = !isNaN(parseFloat(value));
          return valid || "Please enter a number";
        },
        filter: Number
      },
      // 外尺寸
      {
        type: "input",
        name: "OSLd",
        message: "你需要输入长度外尺寸CCAL的系数",
        validate: function(value) {
          var valid = !isNaN(parseFloat(value));
          return valid || "Please enter a number";
        },
        filter: Number
      },
      {
        type: "input",
        name: "OSWd",
        message: "你需要输入宽度外尺寸CCAL的系数",
        validate: function(value) {
          var valid = !isNaN(parseFloat(value));
          return valid || "Please enter a number";
        },
        filter: Number
      },
      {
        type: "input",
        name: "OSHd",
        message: "你需要输入高度外尺寸CCAL的系数",
        validate: function(value) {
          var valid = !isNaN(parseFloat(value));
          return valid || "Please enter a number";
        },
        filter: Number
      }
    ];

    // 返回promise
    return inquirer.prompt(questions);
  }

  // 拷贝&写数据；
  write() {
    console.log(chalk.green("my cli 构建开始"));
    const tplBuilder = require("../template/index.js");
    tplBuilder(this, this.options, () => {
      console.log(chalk.green("my cli 构建完成"));
      console.log();
      console.log(chalk.grey(`开始项目:  npm run dev`));
      // console.log(chalk.grey(`开始项目:  cd ${this.options.name} && npm install`));
    });
  }

  getTplPath(file) {
    return path.join(this.tplDirpath, file);
  }
  copyTpl(file, to, data = {}) {
    const tplPath = this.getTplPath(file);
    this.fs.copyTpl(tplPath, to, data);
  }
  copy(file, to) {
    const tplPath = this.getTplPath(file);
    this.fs.copy(tplPath, to);
  }
}

module.exports = Creator;
