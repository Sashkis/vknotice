module.exports = function(grunt) {

	// 1. Вся настройка находится здесь
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		manifest: grunt.file.readJSON('src/manifest.json'),

		sass: {
			options: {
				sourceMap: true
			},
			opt: {
				files: {
					'src/options/css/style.css': 'src/options/css/style.scss'
				}
			},
			popup: {
				files: {
					'src/popup/css/popup.css': 'src/popup/css/popup.scss'
				}
			}
		},

		copy: {
			main: {
				files: [
					{expand: true, cwd: 'src/', src: ['_locales/**', 'audio/**', 'img/**', 'lang/**', 'manifest.json', 'background.html'], dest: 'dist/'},
					{expand: true, cwd: 'src/popup', src: ['font/**', 'img/**', 'popup.html'], dest: 'dist/popup/'},
					{expand: true, cwd: 'src/options', src: ['font/**', 'index.html'], dest: 'dist/options/'},
					{expand: true, cwd: 'src/bower_components/jquery/dist', src: ['jquery.min.js'], dest: 'dist/inc/plugins/'},
				],
			},
			dev: {
				files: [
					{expand: true, cwd: 'src/', src: ['lang/**', 'manifest.json', 'background.html'], dest: 'dist/'},
					{expand: true, cwd: 'src/popup', src: ['popup.html'], dest: 'dist/popup/'},
					{expand: true, cwd: 'src/options', src: ['index.html'], dest: 'dist/options/'},
				],
			},
		},

		uglify: {
			popup: {
				files: {
					'dist/popup/main.js': [
						'src/bower_components/linkifyjs/linkify.js',
						'src/bower_components/linkifyjs/linkify-jquery.js',
						'src/bower_components/jquery-mousewheel/jquery.mousewheel.js',
						'src/bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.js',
						'src/popup/*.js',
					]
				}
			},
			background: {
				files: {
					'dist/background.js': ['src/Informer.js', 'src/background.js'],
				}
			},
			options_page: {
				files: {
					'dist/options/main.js': ['src/options/main.js'],
				}
			},
			content: {
				files: {
					'dist/get_token.js': ['src/get_token.js'],
				}
			},
			vkClass: {
				files: {
					'dist/inc/Class.Vk.js': ['src/inc/Class.Vk.js'],
				}
			},
			appClass: {
				files: {
					'dist/inc/Class.App.js': ['src/inc/Class.App.js'],
				}
			}
		},

		csso: {
			popup: {
				options: {
					report: 'gzip'
				},
				files: {
					'dist/popup/css/popup.css': [
					'src/bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.css',
					'src/popup/css/*.css'
				]
				}
			},
			options_page: {
				options: {
					report: 'gzip'
				},
				files: {
					'dist/options/css/style.css': ['src/options/css/*.css']
				}
			},
		},

		'string-replace': {
			popup: {
				files: {
					'dist/popup/popup.html': 'dist/popup/popup.html'
				},
				options: {
					replacements: [{
						pattern: /<!-- @import min\.js -->(.|\n)*<!-- @import \/min\.js -->/gm,
						replacement: ''
					},{
						pattern: /<!-- @import min\.css -->(.|\n)*<!-- @import \/min\.css -->/gm,
						replacement: ''
					},{
						pattern: /bower_components\/jquery\/dist\/jquery.js/gm,
						replacement: 'inc/plugins/jquery.min.js'
					}]
				}
			},

			background: {
				files: {
					'dist/background.html': 'dist/background.html'
				},
				options: {
					replacements: [{
						pattern: /<!-- @import min\.js -->(.|\n)*<!-- @import \/min\.js -->/gm,
						replacement: ''
					},{
						pattern: /bower_components\/jquery\/dist\/jquery.js/gm,
						replacement: 'inc/plugins/jquery.min.js'
					}]
				}
			},
			options_page: {
				files: {
					'dist/options/index.html': 'dist/options/index.html'
				},
				options: {
					replacements: [{
						pattern: /<!-- @import min\.js -->(.|\n)*<!-- @import \/min\.js -->/gm,
						replacement: ''
					},{
						pattern: /bower_components\/jquery\/dist\/jquery.js/gm,
						replacement: 'inc/plugins/jquery.min.js'
					}]
				}
			},
		},
		htmlmin: {
			background: {
				options: {
					removeComments: true,
					collapseWhitespace: true
				},
				files: {
					'dist/background.html': 'dist/background.html',
				}
			},

			popup: {
				options: {
					removeComments: true,
					collapseWhitespace: true
				},
				files: {
					'dist/popup/popup.html': 'dist/popup/popup.html'
				}
			}
		},
		'json-minify': {
			dist: {
				files: 'dist/**/*.json'
			}
		},
		zip: {
			dist: {
				cwd: 'dist/',
				src: 'dist/**',
				dest: 'Архив/' + '<%= manifest.version %>' + '.zip',
				compression: 'DEFLATE'
			}
		},

	});

	// 3. Тут мы указываем Grunt, что хотим использовать этот плагин
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-csso');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-json-minify');
	grunt.loadNpmTasks('grunt-string-replace');
	grunt.loadNpmTasks('grunt-zip');


	// 4. Указываем, какие задачи выполняются, когда мы вводим «grunt» в терминале
	grunt.registerTask('default', ['sass', 'copy', 'uglify', 'csso', 'json-minify', 'string-replace', 'htmlmin', 'zip']);
	grunt.registerTask('dev', ['sass', 'copy:dev', 'uglify', 'csso', 'string-replace']);
};