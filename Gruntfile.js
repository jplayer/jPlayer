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
					'js/jplayer/jquery.jplayer.min.js': ['src/javascript/jquery.jplayer.js']
				}
			},
			playlist: {
				options: {
					banner: '/*! jPlayerPlaylist for jPlayer <%= pkg.version %> ~ (c) 2009-<%= grunt.template.today("yyyy") %> <%= pkg.organization %> ~ <%= pkg.license %> License */\n'
				},
				files: {
					'js/add-on/jplayer.playlist.min.js': ['src/javascript/jplayer.playlist.js']
				}
			},
			inspector: {
				options: {
					banner: '/*! jPlayerInspector for jPlayer <%= pkg.version %> ~ (c) 2009-<%= grunt.template.today("yyyy") %> <%= pkg.organization %> ~ <%= pkg.license %> License */\n'
				},
				files: {
					'js/add-on/jquery.jplayer.inspector.min.js': ['src/javascript/jquery.jplayer.inspector.js']
				}
			},
			popcorn: {
				options: {
					banner: '/*! Popcorn Player for jPlayer <%= pkg.version %> ~ (c) 2009-<%= grunt.template.today("yyyy") %> <%= pkg.organization %> ~ <%= pkg.license %> License */\n'
				},
				files: {
					'js/popcorn/popcorn.jplayer.min.js': ['src/javascript/popcorn.jplayer.js']
				}
			},
		},

		jshint: {

			test: {
				src: [
					'Gruntfile.js',
					'src/javascript/*.js',
					'!**/jquery.jplayer.inspector.js' // The inspector does not pass jshint, and this will be addressed in due course.
				]
			},

			// configure JSHint (Documented at http://www/jshint.com/docs/)
			options: {
				// Using the jshint defaults

				// For the jQuery code for extend.
				eqnull: true,

				// Prevent leaky vars
				// undef: true,  // Turn that on later since lots of errors!
				browser: true,

				globals: {
					hyperaudio: true
				}

/*
				// lots of other options...
				curly: true,
				eqeqeq: true,
				browser: true,
				globals: {
					jQuery: true
				}
*/
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['jshint', 'uglify']);

	grunt.registerTask('test', ['jshint']);
	grunt.registerTask('build', ['uglify']);
};
