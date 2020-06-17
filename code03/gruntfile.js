// 实现这个项目的构建任务

/*
编译输出scss文件 grunt-sass sass
编译输出js文件 grunt-babel @babel/core @babel/preset-env
拷贝public目录下文件和字体文件 grunt-contrib-copy
压缩输出图片文件 grunt-contrib-imagemin
编译输出html文件 grunt-web-swig
清理dist grunt-contrib-clean
启动一个服务器 grunt-browser-sync 
监听文件改动，自动编译，刷新页面 grunt-contrib-watch
压缩css js html grunt-contrib-uglify grunt-contrib-cssmin grunt-contrib-htmlmin

合并html中引用的资源 grunt-usemin（配置失败）
*/

const loadGruntTasks = require("load-grunt-tasks");
const sass = require("sass");

const config = {
  data: {
    menus: [
      {
        name: "Home",
        icon: "aperture",
        link: "index.html",
      },
      {
        name: "Features",
        link: "features.html",
      },
      {
        name: "About",
        link: "about.html",
      },
      {
        name: "Contact",
        link: "#",
        children: [
          {
            name: "Twitter",
            link: "https://twitter.com/w_zce",
          },
          {
            name: "About",
            link: "https://weibo.com/zceme",
          },
          {
            name: "divider",
          },
          {
            name: "About",
            link: "https://github.com/zce",
          },
        ],
      },
    ],
    pkg: require("./package.json"),
    date: new Date(),
  },
};

module.exports = (grunt) => {
  grunt.initConfig({
    clean: "dist",
    // 编译sass
    sass: {
      options: {
        implementation: sass,
        sourceMap: true,
      },
      main: {
        files: [
          {
            expand: true,
            cwd: "src/",
            src: "assets/styles/*.scss",
            dest: "dist",
            ext: ".css",
          },
        ],
      },
    },
    // 编译js
    babel: {
      options: {
        presets: ["@babel/preset-env"],
        sourceMap: true,
      },
      main: {
        files: [
          {
            expand: true,
            cwd: "src/",
            src: "assets/scripts/*.js",
            dest: "dist",
            ext: ".js",
          },
        ],
      },
    },
    // 压缩输出图片
    imagemin: {
      main: {
        files: [
          {
            expand: true,
            cwd: "src/",
            src: "assets/images/**.{png,jpg,svg}",
            dest: "dist",
          },
        ],
      },
    },
    // 拷贝字体和public
    copy: {
      main: {
        files: [
          {
            expand: true,
            cwd: "public/",
            src: ["**"],
            dest: "dist",
          },
          {
            expand: true,
            cwd: "src/",
            src: ["assets/fonts/**"],
            dest: "dist",
          },
        ],
      },
    },
    // 编译模板
    swig: {
      options: {
        swigOptions: {
          cache: false,
        },
        getData: config.data,
      },
      main: {
        files: [
          {
            expand: true,
            cwd: "src/",
            src: "**.html",
            dest: "dist",
          },
        ],
      },
    },
    // 启动服务器
    browserSync: {
      options: {
        notify: false,
        server: {
          baseDir: ["dist", "src", "public"],
          routes: {
            "/node_modules": "node_modules",
          },
        },
      },
      start: {
        bsFiles: {
          src: "dist",
        },
        options: {
          watchTask: false,
        },
      },
      dev: {
        bsFiles: {
          src: "dist",
        },
        options: {
          watchTask: true,
        },
      },
    },
    // 监听文件
    watch: {
      sass: {
        files: ["src/assets/styles/*.scss"],
        tasks: ["sass"],
      },
      scripts: {
        files: ["src/assets/scripts/*.js"],
        tasks: ["babel"],
      },
      imagemin: {
        files: ["src/assets/images/**"],
        tasks: ["imagemin"],
      },
      copy: {
        files: ["src/assets/fonts/**", "public/**"],
        tasks: ["copy"],
      },
      swig: {
        files: ["src/**.html"],
        tasks: ["swig"],
      },
    },
    // 压缩js
    uglify: {
      main: {
        files: [
          {
            expand: true,
            cwd: "dist/",
            src: ["**/*.js"],
            dest: "dist",
          },
        ],
      },
    },
    // 压缩css
    cssmin: {
      target: {
        files: [
          {
            expand: true,
            cwd: "dist/",
            src: ["**/*.css"],
            dest: "dist",
          },
        ],
      },
    },
    // 压缩html
    htmlmin: {
      main: {
        options: {
          removeComments: true,
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: true,
        },
        files: [
          {
            expand: true,
            cwd: "dist/",
            src: "**/*.html",
            dest: "dist",
          },
        ],
      },
    },

    // useref: {
    //   html: 'dist/**.html',
    //   temp: 'dist',
    // }
  });

  // 加载全部任务
  loadGruntTasks(grunt);

  // 编译
  grunt.registerTask("compile", ["clean", "sass", "babel", "swig"]);

  // 压缩
  grunt.registerTask("compress", ["uglify", "cssmin", "htmlmin"]);

  grunt.registerTask("build", ["compile", "copy", "imagemin", "compress"]);

  grunt.registerTask("dev", ["compile", "browserSync:dev", "watch"]);

  grunt.registerTask("start", ["browserSync:start"]);
};
