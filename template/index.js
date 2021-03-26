const path = require("path");
const fs = require("fs-extra");
const chalk = require("chalk");

module.exports = function(creator, options, callback) {
  const { type, id, description, author, name } = options;

  // 获取当前命令的执行目录
  const cwd = process.cwd();

  const projectPath = path.join(cwd, "knifes"); // bxh-knife-master/knifes
  const libPath = path.join(projectPath, "lib");

  // fs.mkdirSync(projectPath);

  creator.copyTpl("pair/x4y4.js", path.join(libPath, "pair_copy.js"), {
    name,
    description,
    author,
    id,
    type
  });

  creator.fs.commit(() => {
    console.log();
    console.log(`${chalk.grey(`创建文件: ${libPath}/copy.js`)} ${chalk.green("✔ ")}`);

    callback();
  });
};
