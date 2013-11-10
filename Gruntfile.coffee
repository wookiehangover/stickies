config =
  yeoman:
    src: "src"
    dist: "dist"

  watch:
    options:
      spawn: false

    coffee:
      files: ['test/src/**/*.coffee']
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
    options:
      generateSourceMaps: true
      findNestedDependencies: true
      preserveLicenseComments: false
      wrap: true
      almond: true
      optimize: 'uglify2'
      mainConfigFile: 'src/app/require_config.js'
    chrome:
      options:
        out: 'dist/scripts/stickies_chrome.js'
        include: ["main_chrome"],
        insertRequire: ["main_chrome"],
        # Stupidly, the build specific maps config needs to be included here too
        map:
          'components/github/main':
            'components/github/auth': 'components/github/chrome_identity'
          'components/user/main':
            'mixins/localstorage_sync': 'mixins/google_storage_sync'
          'backbone-pouch':
            'underscore': 'lodash'
    web:
      options:
        out: 'dist/scripts/stickies_web.js'
        include: ["main_web"],
        insertRequire: ["main_web"],
        map:
          'backbone-pouch':
            'underscore': 'lodash'

  connect:
    options:
      port: 9000
      hostname: "0.0.0.0"

    test:
      options:
        base: ["src", "test"]

    web:
      options:
        base: ["src"]

  clean:
    dist:
      files: [
        dot: true
        src: [".tmp", "<%= yeoman.dist %>/*", "!<%= yeoman.dist %>/.git*"]
      ]
    test:
      files: [
        dot: true
        src: ["test/spec"]
      ]

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
    options:
      sourceMap: true
    test:
      files: [
        expand: true
        cwd: "test/src"
        src: "**/*.coffee"
        dest: "test/spec"
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
    chrome: [
      'htmlmin'
      'requirejs:chrome'
    ]
    web: [
      'htmlmin'
      'requirejs:web'
    ]

module.exports = (grunt) ->
  require("time-grunt") grunt
  require("load-grunt-tasks") grunt

  grunt.initConfig(config)

  grunt.registerTask "test", [
    "clean:test"
    "coffee:test"
    "connect:test"
    "mocha"
  ]

  grunt.registerTask "build:chrome", [
    "clean:dist"
    "useminPrepare"
    "concurrent:chrome"
    "concat"
    "copy"
    "usemin"
  ]

  grunt.registerTask "build:web", [
    "clean:dist"
    "useminPrepare"
    "concurrent:web"
    "concat"
    "copy"
    "usemin"
  ]

  grunt.registerTask "default", [
    "jshint"
    "test"
  ]
