module.exports = function(grunt) {

	// 1. Вся настройка находится здесь
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		manifest: grunt.file.readJSON('ext/manifest.json'),
		fontello: {
			update: {
				options: {
					config: 'fontello/config.json',
					fonts : 'ext/popup/font/',
					styles: 'ext/popup/css/',
				}
			}
		},
		copy: {
			main: {
				files: [
					{expand: true, cwd: 'ext/', src: ['_locales/**', 'audio/**', 'img/**', 'lang/**', 'manifest.json',	'get_token.js', 'background.html' ], dest: 'build/'},
					{expand: true, cwd: 'ext/popup', src: ['font/**', 'img/**', 'popup.html'], dest: 'build/popup/'},
					{expand: true, cwd: 'ext/bower_components/jquery/dist', src: ['jquery.min.js'], dest: 'build/popup/'},
				],
			},
		},
		bower_concat: {
			options: { separator : ';' },
			popup: {
				dest: 'cache/bower-concat.js',
				cssDest: 'cache/bower-concat.css',
				exclude: ['jquery'],
			},
		},
		uglify: {
			popup: {
				files: {
					'build/popup/popup.min.js': ['cache/bower-concat.js', 'ext/popup/Emoji.js', 'ext/popup/*.js']
				}
			},
			background: {
				files: {
					'build/background.min.js': ['ext/Informer.js', 'ext/background.js']
				}
			}
		},
		csso: {
			popup: {
				options: {
					report: 'gzip'
				},
				files: {
					'build/popup/css/popup.min.css': ['cache/bower-concat.css', 'ext/popup/css/*.css']
				}
			},
		},
		'string-replace': {
			popup: {
				files: {
					'build/popup/popup.html': 'build/popup/popup.html'
				},
				options: {
					replacements: [{
						pattern: /<!-- @import min\.js -->(.|\n)*<!-- @import \/min\.js -->/gm,
						replacement: '<script src="jquery.min.js"></script><script src="popup.min.js"></script>'
					},{
						pattern: /<!-- @import min\.css -->(.|\n)*<!-- @import \/min\.css -->/gm,
						replacement: '<link rel="stylesheet" href="css/popup.min.css">'
					}]
				}
			},
			background: {
				files: {
					'build/background.html': 'build/background.html'
				},
				options: {
					replacements: [{
						pattern: /<!-- @import min\.js -->(.|\n)*<!-- @import \/min\.js -->/gm,
						replacement: '<script src="popup/jquery.min.js"></script><script src="background.min.js"></script>'
					}]
				}
			},
		},
		zip: {
			build: {
				cwd: 'build/',
				src: 'build/**',
				dest: 'Архив/' + '<%= manifest.version %>' + '.zip',
				compression: 'DEFLATE'
			}
		},
		wiredep: {
			target: {
				src: 'ext/popup/popup.html' // point to your HTML file.
			}
	    }
	});

	// 3. Тут мы указываем Grunt, что хотим использовать этот плагин
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-bower-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-csso');
	grunt.loadNpmTasks('grunt-string-replace');
	grunt.loadNpmTasks('grunt-zip');

	grunt.loadNpmTasks('grunt-fontello');
	grunt.loadNpmTasks('grunt-wiredep');

	// 4. Указываем, какие задачи выполняются, когда мы вводим «grunt» в терминале
	grunt.registerTask('default', ['copy', 'bower_concat', 'uglify', 'csso', 'string-replace', 'zip']);
	grunt.registerTask('update', ['fontello', 'wiredep']);
};