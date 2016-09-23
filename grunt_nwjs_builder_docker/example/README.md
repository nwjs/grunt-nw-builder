# Docker Grunt NWJS example

## How does it work?
This folder is here to try the container grunt-nw-build.


## Preparing the example
At first, you have to clone a small project on my repository

```
	git clone --depth=1 https://github.com/leknoppix/rotateur.git
```

If you not have node and npm in your OS, you can use the container. So, laught the container.
In this example, I put the folder example in my folder /var/nodejs/example.

I run my docker container (name: leknoppix/nwjs)
```
	docker run -ti --rm -v /var/nodejs/example:/var/nodejs leknoppix/nwjs bash
	cd rotateur
	npm install
	cd ..

```

To use grunt, we have to get different module included in package.json. So:

```
	npm install
```

Now, we can laught grunt

```
	grunt nwjs
```

The Gruntfile is a example to compile this application for linux32, linux64, win32 and win64.
```
'use strict';
module.exports = function(grunt) {

  grunt.initConfig({
    nwjs: {
		options: {
			buildDir: './dist', // Where the build version of my NW.js app is saved
			platforms: ['win32', 'win64', 'linux32', 'linux64'],
			flavor: 'normal'
		},
		src: [  // Your NW.js app
			'../rotateur/css/*',
			'../rotateur/js/*',
			'../rotateur/icons/*',
			'../rotateur/fonts/*',
			'../rotateur/node_modules/**/*',
			'../rotateur/index.html',
			'../rotateur/package.json'
		]
    },
  });
  
  grunt.loadNpmTasks('grunt-nw-builder');
  grunt.registerTask('default', ['nwjs']);
};
```