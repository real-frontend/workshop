module.exports = function(grunt) {
  grunt.initConfig({
    dir: {
      dev: 'htdocs/_dev/',
      release: 'htdocs/release/',
      coffee: 'files/_coffee/',
      js: 'files/js/',
      scss: 'files/_scss/',
      css: 'files/css/',
      img: 'files/img/'
    },
    bower: {
      install: {
        options: {
          targetDir: '_lib/',
          install: true,
          cleanTargetDir: false,
          cleanBowerDir: true
        }
      }
    },
    copy: {
      init: {
        files: [
          {
            expand: true,
            cwd: '_lib/jquery/',
            src: 'jquery.js',
            dest: '<%= dir.dev %><%= dir.js %>',
            filter: 'isFile',
            dot: false
          }, {
            expand: true,
            cwd: '_lib/html5-boilerplate/js/vendor/',
            src: ["**/modernizr*.js"],
            dest: '<%= dir.dev %><%= dir.js %>',
            filter: 'isFile',
            dot: false
          }, {
            expand: true,
            cwd: '_lib/html5-boilerplate/',
            src: ["index.html"],
            dest: '<%= dir.dev %>',
            filter: 'isFile',
            dot: false
          }
        ]
      },
      build: {
        files: [
          {
            expand: true,
            cwd: "<%= dir.dev %>",
            src: ["**/*.html"],
            dest: "<%= dir.release %>",
            filter: 'isFile',
            dot: false
          }, {
            expand: true,
            cwd: "<%= dir.dev %><%= dir.css %>",
            src: ["**/*.css"],
            dest: "<%= dir.release %><%= dir.css %>",
            filter: 'isFile',
            dot: false
          }, {
            expand: true,
            cwd: "<%= dir.dev %><%= dir.img %>",
            src: ["**/*.{gif,jpeg,jpg,png,svg,webp}"],
            dest: "<%= dir.release %><%= dir.img %>",
            filter: 'isFile',
            dot: false
          }, {
            expand: true,
            cwd: "<%= dir.dev %><%= dir.js %>",
            src: ["**/*.js"],
            dest: "<%= dir.release %><%= dir.js %>",
            filter: 'isFile',
            dot: false
          }
        ]
      }
    },
    clean: {
      init: ["_lib/"],
      build: ["<%= dir.release %>"]
    },
    sass: {
      dist: {
        options: {
          style: 'expanded',
          sourcemap: 'none'
        },
        files: [
          {
            expand: true,
            cwd: '<%= dir.dev %><%= dir.scss %>',
            src: ['*.scss'],
            dest: '<%= dir.dev %><%= dir.css %>',
            ext: '.css'
          }
        ]
      }
    },
    coffee: {
      options: {
        bare: true
      },
      files: {
        expand: true,
        cwd: "<%= dir.dev %><%= dir.coffee %>",
        src: ["**/*.coffee"],
        dest: "<%= dir.dev %><%= dir.js %>",
        ext: ".js"
      }
    },
    connect: {
      server: {
        options: {
          base: '<%= dir.dev %>'
        }
      }
    },
    watch: {
      options: {
        livereload: true
      },
      html: {
        files: "<%= dir.dev %>**/*.html"
      },
      sass: {
        files: "<%= dir.dev %><%= dir.scss %>**/*.scss",
        tasks: ["sass"]
      },
      js: {
        files: "<%= dir.dev %><%= dir.coffee %>**/*.coffee",
        tasks: ['coffee']
      }
    },
    cssmin: {
      combine: {
        files: {
          '<%= dir.dev %><%= dir.css %>main_min.css': ['<%= dir.dev %><%= dir.css %>normalize.css', '<%= dir.dev %><%= dir.css %>main.css']
        }
      }
    },
    uglify: {
      js: {
        files: {
          '<%= dir.dev %><%= dir.js %>script_min.js': ['<%= dir.dev %><%= dir.js %>script_a.js', '<%= dir.dev %><%= dir.js %>script_b.js']
        }
      }
    }
  });
  require('load-grunt-tasks')(grunt);
  grunt.registerTask("init", function() {
    grunt.task.run('bower:install');
    grunt.task.run('copy:init');
    grunt.file.defaultEncoding = 'utf8';
    grunt.file.mkdir('htdocs');
    grunt.file.mkdir('htdocs/_dev');
    grunt.file.mkdir('htdocs/_dev/files');
    grunt.file.mkdir('htdocs/_dev/files/css');
    grunt.file.mkdir('htdocs/_dev/files/img');
    grunt.file.mkdir('htdocs/_dev/files/_scss');
    grunt.file.mkdir('htdocs/_dev/files/_coffee');
    grunt.file.mkdir('htdocs/_dev/files/js');
    grunt.file.mkdir('htdocs/release');
    grunt.file.mkdir('htdocs/release/files');
    grunt.file.mkdir('htdocs/release/files/css');
    grunt.file.mkdir('htdocs/release/files/img');
    grunt.file.mkdir('htdocs/release/files/js');
    return grunt.task.run('clean:init');
  });
  grunt.registerTask("default", ['connect', 'watch']);
  return grunt.registerTask("release", ['uglify', 'clean:build', 'copy:build', 'uglify']);
};
