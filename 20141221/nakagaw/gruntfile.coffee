module.exports = (grunt)->
  grunt.initConfig
 
    dir:
      dev: 'htdocs/_dev/'
      release: 'htdocs/release/'
      coffee: 'files/_coffee/'
      js: 'files/js/'
      scss: 'files/_scss/'
      css: 'files/css/'
      img: 'files/img/'

    bower:
      install:
        options:
          targetDir: '_lib/'
          install: true
          cleanTargetDir: false
          cleanBowerDir: false

    copy:
      build:
        files:[
          { #html
            expand: true
            cwd: "<%= dir.dev %>"
            src: ["**/*.html"]
            dest: "<%= dir.release %>"
            filter: 'isFile'
            dot: false
          },
          { #css
            expand: true
            cwd: "<%= dir.dev %><%= dir.css %>"
            src: ["min.css"]
            dest: "<%= dir.release %><%= dir.css %>"
            filter: 'isFile'
            dot: false
          },
          { #img
            expand: true
            cwd: "<%= dir.dev %><%= dir.img %>"
            src: ["**/*.{gif,jpeg,jpg,png,svg,webp}"]
            dest: "<%= dir.release %><%= dir.img %>"
            filter: 'isFile'
            dot: false
          },
          { #js
            expand: true
            cwd: "<%= dir.dev %><%= dir.js %>"
            src: ["modernizr.js", "min.js"]
            dest: "<%= dir.release %><%= dir.js %>"
            filter: 'isFile'
            dot: false
          }
        ]

    clean: ["<%= dir.release %>"]

    sass: #sassコンパイル
      dist:
        options:
          #compass: true #compassを有効に
          style: 'expanded' #_devの段階では標準書式で出力する
          sourcemap: 'none'
        files:[
          {
            expand: true
            cwd: '<%= dir.dev %><%= dir.scss %>'
            src: ['*.scss']
            dest: '<%= dir.dev %><%= dir.css %>'
            ext: '.css'
          }
        ]

    autoprefixer:
      target:
        expand: true
        src: '<%= dir.dev %><%= dir.css %>*.css'
        dest: './'

    coffee: #coffeeコンパイル
      options:
        bare: true
      files:
        expand: true
        cwd: "<%= dir.dev %><%= dir.coffee %>"
        src: ["**/*.coffee"]
        dest: "<%= dir.dev %><%= dir.js %>"
        ext: ".js"

    connect: #webサーバー接続
      server:
        options:
          base: '<%= dir.dev %>'

    watch: #ファイル変更監視
      options:
        livereload: true
      html:
        files: "<%= dir.dev %>**/*.html"
      sass:
        files: "<%= dir.dev %><%= dir.scss %>**/*.scss"
        tasks: ["sass","autoprefixer","cssmin"]
      coffee:
        files: "<%= dir.dev %><%= dir.coffee %>**/*.coffee"
        tasks : ['coffee']
      js:
        files: "<%= dir.dev %><%= dir.js %>*.js"
        #tasks : ['uglify'] #uglifyの設定完了後にコメントを外して有効化する

    cssmin: #CSS連結/コンパイル
      combine:
        files:
          '<%= dir.dev %><%= dir.css %>min.css': '<%= dir.dev %><%= dir.css %>*.css'

    uglify: #js結合/コンパイル
      js:
        files:
          '<%= dir.dev %><%= dir.js %>min.js': ['<%= dir.dev %><%= dir.js %>script_a.js', '<%= dir.dev %><%= dir.js %>script_b.js'] #読み込まれる順番にjsを指定する

    imagemin:
      target:
        files: [
          expand: true
          src: "<%= dir.release %><%= dir.img %>*.{png,jpg,gif}"
          dest: "./"
        ]

  require('load-grunt-tasks') grunt #プラグイン読み込み
 
  #ディレクトリ構築
  grunt.registerTask "init", ()->
    grunt.task.run('bower:install')
    grunt.file.defaultEncoding = 'utf8'
    grunt.file.mkdir('htdocs')
    grunt.file.mkdir('htdocs/_dev')
    grunt.file.mkdir('htdocs/_dev/files')
    grunt.file.mkdir('htdocs/_dev/files/css')
    grunt.file.mkdir('htdocs/_dev/files/img')
    grunt.file.mkdir('htdocs/_dev/files/_scss')
    grunt.file.mkdir('htdocs/_dev/files/_coffee')
    grunt.file.mkdir('htdocs/_dev/files/js')
    grunt.file.mkdir('htdocs/release')
    grunt.file.mkdir('htdocs/release/files')
    grunt.file.mkdir('htdocs/release/files/css')
    grunt.file.mkdir('htdocs/release/files/img')
    grunt.file.mkdir('htdocs/release/files/js')

  grunt.registerTask "default", ['connect','watch'] #コーディング時
  grunt.registerTask "release", ['uglify', 'cssmin','clean','copy:build', 'imagemin'] #公開時に実行するタスク
