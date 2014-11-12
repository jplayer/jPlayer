module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		uglify: {
			options: {
				// maxLineLen:  0 // Generates the output on a single line
			},
			jplayer: {
				options: {
					banner: '/*! jPlayer <%= pkg.version %> for jQuery ~ (c) 2009-<%= grunt.template.today("yyyy") %> <%= pkg.organization %> ~ <%= pkg.license %> License */\n'
				},
				files: {
					'js/jplayer/jquery.jplayer.min.js': ['src/javascript/jplayer/jquery.jplayer.js']
				}
			},
			playlist: {
				options: {
					banner: '/*! jPlayerPlaylist for jPlayer <%= pkg.version %> ~ (c) 2009-<%= grunt.template.today("yyyy") %> <%= pkg.organization %> ~ <%= pkg.license %> License */\n'
				},
				files: {
					'js/add-on/jplayer.playlist.min.js': ['src/javascript/add-on/jplayer.playlist.js']
				}
			},
			inspector: {
				options: {
					banner: '/*! jPlayerInspector for jPlayer <%= pkg.version %> ~ (c) 2009-<%= grunt.template.today("yyyy") %> <%= pkg.organization %> ~ <%= pkg.license %> License */\n'
				},
				files: {
					'js/add-on/jquery.jplayer.inspector.min.js': ['src/javascript/add-on/jquery.jplayer.inspector.js']
				}
			},
			popcorn: {
				options: {
					banner: '/*! Popcorn Player for jPlayer <%= pkg.version %> ~ (c) 2009-<%= grunt.template.today("yyyy") %> <%= pkg.organization %> ~ <%= pkg.license %> License */\n'
				},
				files: {
					'js/popcorn/popcorn.jplayer.min.js': ['src/javascript/popcorn/popcorn.jplayer.js']
				}
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
					'js/jplayer/jquery.jplayer.swf': ['src/actionscript/Jplayer.as']
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-mxmlc');

	grunt.registerTask('default', ['test', 'build']);

	grunt.registerTask('test', ['jshint']);
	grunt.registerTask('build', ['js', 'swf']);
	grunt.registerTask('js', ['uglify']);
	grunt.registerTask('swf', ['mxmlc']);
};
