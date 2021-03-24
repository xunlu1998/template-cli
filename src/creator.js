const chalk = require("chalk");
const inquirer = require("inquirer");

class Creator {
  constructor() {
    // 存储命令行获取的数据，作为demo这里只要这两个；
    this.options = {
      id: "",
      description: "",
      author: "",
      name: "",
    };
  }
  // 初始化；
  // ...
  init() {
    console.log(chalk.green("my cli 开始"));
    console.log();
    this.ask().then((answers) => {
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
        type: "input",
        name: "id",
        message: "请输入盒子编号",
        validate: function (value) {
          var pass = value.match(/^\d{6}$/);
          if (pass) {
            return true;
          }
          return "请输入正确的编号";
        },
      },
      {
        type: "input",
        name: "description",
        message: "请输入盒子中文名称",
      },
      {
        type: "input",
        name: "author",
        message: "请输入你的名字",
        validate: function (input) {
          if (!input) {
            return "请输入你的名字";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "name",
        message: "请输入项目名称",
        validate(input) {
          if (!input) {
            return "请输入项目名称!";
          }

          //   if (fs.existsSync(input)) {
          //     return "项目名已重复!";
          //   }

          return true;
        },
      },
    ];

    // 返回promise
    return inquirer.prompt(questions);
  }

  // 拷贝&写数据；
  write() {}
}

module.exports = Creator;
