#!/usr/bin/env node
const inquirer = require("inquirer");
const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
inquirer
  .prompt([
    {
      type: "input",
      name: "name",
      message: "Project name?",
    },
    {
      type: "input",
      name: "desc",
      message: "Project Description?",
    },
    {
      type: "input",
      name: "version",
      message: "Project Version",
    },
  ])
  .then((answer) => {
    //console.log(answers);
    //获取模版目
    const { name, version, desc } = answer;
    const tpl = path.join(__dirname, "tpl");
    const desDir = process.cwd();
    const fileName = `ex-${name}-v-${version}-${desc}`;
    const root = path.join(desDir, fileName);

    if (fs.existsSync(root)) {
      clearDir(root);
      writeDir(tpl, root);
    } else {
      fs.mkdirSync(root);
      writeDir(tpl, root);
    }

    function clearDir(readPath) {
      const files = fs.readdirSync(readPath);
      files.forEach((file) => {
        const filePath = path.join(readPath, file);
        if (fs.statSync(filePath).isDirectory()) {
          clearDir(filePath);
          fs.rmdirSync(filePath);
        } else {
          fs.unlinkSync(filePath);
        }
      });
    }

    function writeDir(readPath, writePath) {
      const files = fs.readdirSync(readPath);
      files.forEach((file) => {
        const filePath = path.join(readPath, file);
        const outFilePath = path.join(writePath, file);
        if (fs.statSync(filePath).isDirectory()) {
          fs.mkdirSync(outFilePath);
          writeDir(filePath, outFilePath);
        } else {
          ejs.renderFile(filePath, answer, (err, result) => {
            if (err) throw err;
            fs.writeFileSync(outFilePath, result);
          });
        }
      });
    }
  });
