//generator的核心入口
const Generator = require("yeoman-generator");

module.exports = class extends Generator {
  prompting() {
    return this.prompt([
      {
        type: "input",
        name: "name",
        message: "Your project name",
        default: this.appname,
      },
    ]).then((answers) => {
      console.log(answers);
      this.answers = answers;
    });
  }
  writing() {
    //this.fs.write(this.destinationPath("temp.txt"), Math.random().toString());
    const tmpl = this.templatePath("foo.txt");
    const output = this.destinationPath("foo.txt");
    const context = this.answers;
    this.fs.copyTpl(tmpl, output, context);
  }
};
