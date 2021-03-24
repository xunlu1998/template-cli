const path = require("path");
const fs = require("fs-extra");

module.exports = function (creator, options, callback) {
  const { id, description, author, name } = options;

  // 获取当前命令的执行目录，注意和项目目录区分
  const cwd = process.cwd();

  const projectPath = path.join(cwd, name);
  const buildPath = path.join(projectPath, "build");
  const pagePath = path.join(projectPath, "page");
  const srcPath = path.join(projectPath, "src");

  // 新建项目目录
  // 同步创建目录，以免文件目录不对齐
  fs.mkdirSync(projectPath);
  fs.mkdirSync(buildPath);
  fs.mkdirSync(pagePath);
  fs.mkdirSync(srcPath);

  callback();

  //   todo
  // https://juejin.cn/post/6844903802001162248
};
