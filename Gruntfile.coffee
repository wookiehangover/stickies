config =
  yeoman:
    src: "src"
    dist: "dist"

  watch:
    options:
      spawn: false

    coffee:
      files: ['test/spec/{,*/}*.coffee']
      tasks: ['coffee:test']

    less:
      files: ['src/styles/less/**/*.less']
      tasks: ['less']


  less:
    compile:
      options:
        paths: ['src/styles/less']
      files:
        'src/styles/main.css': 'src/styles/less/main.less'

  requirejs:
    compile:
      options:
        mainConfigFile: 'src/app/require-config.js'
        generateSourceMaps: true
        include: ["main"],
        insertRequire: ["main"],
        out: 'dist/scripts/app.js'
        optimize: 'uglify2'
        findNestedDependencies: true,
        wrap: true
        preserveLicenseComments: false
        almond: true

  connect:
    options:
      port: 9000

      # change this to '0.0.0.0' to access the server from outside
      hostname: "localhost"

    test:
      options:
        base: [".tmp", "test"]

  clean:
    dist:
      files: [
        dot: true
        src: [".tmp", "<%= yeoman.dist %>/*", "!<%= yeoman.dist %>/.git*"]
      ]

    server: ".tmp"

  jshint:
    options:
      jshintrc: ".jshintrc"

    all: ["src/app/**/*.js"]

  mocha:
    all:
      options:
        run: true
        urls: ["http://localhost:<%= connect.options.port %>/index.html"]

  coffee:
    test:
      files: [
        expand: true
        cwd: "test/spec"
        src: "{,*/}*.coffee"
        dest: ".tmp/spec"
        ext: ".js"
      ]

  useminPrepare:
    html: "src/sticky.html"
    options:
      dest: "dist"

  usemin:
    options:
      dirs: ["<%= yeoman.dist %>"]

    html: ["<%= yeoman.dist %>/{,*/}*.html"]

  cssmin:
    dist:
      files:
        "<%= yeoman.dist %>/styles/main.css": [
          "src/styles/topcoat/topcoat-desktop-dark.css"
          "src/styles/icomatic/icomatic.css"
          "src/styles/main.css"
        ]

  htmlmin:
    dist:
      options: {}

      files: [
        expand: true
        cwd: "<%= yeoman.src %>"
        src: "*.html"
        dest: "<%= yeoman.dist %>"
      ]

  copy:
    dist:
      files: [
        expand: true
        dot: true
        cwd: "<%= yeoman.src %>"
        dest: "<%= yeoman.dist %>"
        src: [
          "*.{ico,png,txt}"
          "images/**/*"
          "_locales/{,*/}*.json"
          "manifest.json"
          "scripts/background.js"
          "scripts/*.map"
        ]
      ,
        expand: true
        cwd: ".tmp/images"
        dest: "<%= yeoman.dist %>/images"
        src: ["generated/*"]
      ,
        expand: true
        flatten: true
        filter: "isFile"
        src: ["src/styles/font/*"]
        dest: "dist/font"
      ,
        expand: true
        flatten: true
        filter: "isFile"
        src: ["src/styles/icomatic/*"]
        dest: "dist/styles"
      ]

  concurrent:
    test: [
      'coffee'
      'compass'
    ],
    dist: [
      'htmlmin'
      'requirejs'
    ]

module.exports = (grunt) ->
  require("time-grunt") grunt
  require("load-grunt-tasks") grunt

  grunt.initConfig(config)

  grunt.registerTask "test", [
    "clean:server"
    "concurrent:test"
    "connect:test"
    "mocha"
  ]

  grunt.registerTask "build", [
    "clean:dist"
    "useminPrepare"
    "concurrent:dist"
    "concat"
    # "cssmin"
    "copy"
    "usemin"
  ]

  grunt.registerTask "default", [
    "jshint"
    "test"
    "build"
  ]
