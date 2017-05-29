module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// Using concat to copy the source. In future, we plan to split the source up, making the concat more appropriate.

		concat: {
			jplayer: {
				files: {
					'dist/jplayer/jquery.jplayer.js': ['src/javascript/jplayer/jquery.jplayer.js']
				}
			},
			playlist: {
				files: {
					'dist/add-on/jplayer.playlist.js': ['src/javascript/add-on/jplayer.playlist.js']
				}
			},
			inspector: {
				files: {
					'dist/add-on/jquery.jplayer.inspector.js': ['src/javascript/add-on/jquery.jplayer.inspector.js']
				}
			},
			popcorn: {
				files: {
					'dist/popcorn/popcorn.jplayer.js': ['src/javascript/popcorn/popcorn.jplayer.js']
				}
			}
		},

		uglify: {
			options: {
				// maxLineLen:  0 // Generates the output on a single line
			},
			jplayer: {
				options: {
					banner: '/*! jPlayer <%= pkg.version %> for jQuery ~ (c) 2009-<%= grunt.template.today("yyyy") %> <%= pkg.organization %> ~ <%= pkg.license %> License */\n'
				},
				files: {
					'dist/jplayer/jquery.jplayer.min.js': ['dist/jplayer/jquery.jplayer.js']
				}
			},
			playlist: {
				options: {
					banner: '/*! jPlayerPlaylist for jPlayer <%= pkg.version %> ~ (c) 2009-<%= grunt.template.today("yyyy") %> <%= pkg.organization %> ~ <%= pkg.license %> License */\n'
				},
				files: {
					'dist/add-on/jplayer.playlist.min.js': ['dist/add-on/jplayer.playlist.js']
				}
			},
			inspector: {
				options: {
					banner: '/*! jPlayerInspector for jPlayer <%= pkg.version %> ~ (c) 2009-<%= grunt.template.today("yyyy") %> <%= pkg.organization %> ~ <%= pkg.license %> License */\n'
				},
				files: {
					'dist/add-on/jquery.jplayer.inspector.min.js': ['dist/add-on/jquery.jplayer.inspector.js']
				}
			},
			popcorn: {
				options: {
					banner: '/*! Popcorn Player for jPlayer <%= pkg.version %> ~ (c) 2009-<%= grunt.template.today("yyyy") %> <%= pkg.organization %> ~ <%= pkg.license %> License */\n'
				},
				files: {
					'dist/popcorn/popcorn.jplayer.min.js': ['dist/popcorn/popcorn.jplayer.js']
				}
			}
		},

		sass: {
			options: {
				sourcemap: 'none',
				style: 'nested'
			},
			"blue.monday": {
				options: {
					banner: '/*! Blue Monday Skin for jPlayer <%= pkg.version %> ~ (c) 2009-<%= grunt.template.today("yyyy") %> <%= pkg.organization %> ~ <%= pkg.license %> License */\n'
				},
				files: {
					'dist/skin/blue.monday/css/jplayer.blue.monday.css': 'src/skin/blue.monday/scss/jplayer.blue.monday.scss'
				}
			},
			"pink.flag": {
				options: {
					banner: '/*! Pink Flag Skin for jPlayer <%= pkg.version %> ~ (c) 2009-<%= grunt.template.today("yyyy") %> <%= pkg.organization %> ~ <%= pkg.license %> License */\n'
				},
				files: {
					'dist/skin/pink.flag/css/jplayer.pink.flag.css': 'src/skin/pink.flag/scss/jplayer.pink.flag.scss'
				}
			}
		},

		cssmin: {
			skins: {
				files: {
					'dist/skin/blue.monday/css/jplayer.blue.monday.min.css': ['dist/skin/blue.monday/css/jplayer.blue.monday.css'],
					'dist/skin/pink.flag/css/jplayer.pink.flag.min.css': ['dist/skin/pink.flag/css/jplayer.pink.flag.css']
				}
			},
		},

		copy: {
			skins: {
				files: [
					{expand: true, cwd: 'src/skin/blue.monday/', src: ['image/**', 'mustache/**'], dest: 'dist/skin/blue.monday/'},
					{expand: true, cwd: 'src/skin/pink.flag/', src: ['image/**', 'mustache/**'], dest: 'dist/skin/pink.flag/'}
				]
			},
		},

		jshint: {

			test: {
				src: [
					'Gruntfile.js',
					'*.json',
					'src/javascript/**/*.js',
					'!**/jquery.jplayer.inspector.js' // The inspector does not pass jshint, and this will be addressed in due course.
				]
			},

			// jQuery linting guide http://contribute.jquery.org/style-guide/js/#linting
			// docs http://www/jshint.com/docs/
			options: {
				// Using .jshintrc files for the options.
				jshintrc: true
			}
		},

		mxmlc: {
			options: {
				rawConfig: '-static-link-runtime-shared-libraries=true'
			},
			jplayer: {
				files: {
					// Compile and give the SWF a filename like the JavaScript filenames. Important as it is the jPlayer code.
					'dist/jplayer/jquery.jplayer.swf': ['src/actionscript/Jplayer.as']
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-mxmlc');

	grunt.registerTask('default', ['test', 'build']);

	grunt.registerTask('test', ['jshint']);
	grunt.registerTask('build', ['js', 'swf', 'css']);
	grunt.registerTask('js', ['concat', 'uglify']);
	grunt.registerTask('swf', ['mxmlc']);
	grunt.registerTask('css', ['sass', 'cssmin', 'copy:skins']);
};
