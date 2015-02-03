### add the gruntjs for coffeescript 
```
npm install grunt-contrib-coffee --save-dev
```

add the grunt task in the grunt file
```
grunt.loadNpmTasks('grunt-contrib-coffee');
```

You can install the dependencies with bower on your local, or using the cdn as in the demo:
```
bower install mapbox.js --save
bower install d3 --save
bower install queue-async --save
bower install jquery --save
```

###Development with coffeescript
The library is initially built with coffeescript, so the coffee code in `src/main.coffee` should be used for development, then could be compiled into javescript by running `grunt`.

###testing with Qunit
currently there is a testing unit available, but not actually used, so if the grunt tasks are generating error, you could use `grunt --force`.
 