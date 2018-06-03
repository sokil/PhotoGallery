module.exports = function (grunt) {
    'use strict';

    var env = grunt.option('env') || 'prod';
    grunt.config('env', env);
    console.log('Environment: ' + env);

    grunt.initConfig({
        jshint: {
            files: [
                'resources/*/*.js'
            ],
            options: {
                loopfunc: true,
                globals: {
                    jQuery: true,
                    console: true,
                    module: true
                }
            }
        },
        uglify: {
            photolist: {
                options: {
                    compress: grunt.config('env') === 'prod',
                    beautify: grunt.config('env') !== 'prod',
                    mangle: grunt.config('env') === 'prod'
                },
                files: {
                    'public/assets/js/photolist.js': [
                        'node_modules/jquery/dist/jquery.js',
                        'node_modules/underscore/underscore.js',
                        'node_modules/backbone/backbone.js',
                        'resources/photolist/Photo.js',
                        'resources/photolist/PhotoCollection.js',
                        'resources/photolist/PhotoListView.js',
                        'resources/photolist/App.js'
                    ]
                }
            },
            admin: {
                options: {
                    compress: grunt.config('env') === 'prod',
                    beautify: grunt.config('env') !== 'prod',
                    mangle: grunt.config('env') === 'prod',
                },
                files: {
                    'public/assets/js/admin.js': [
                        'node_modules/jquery/dist/jquery.js',
                        'node_modules/bootstrap/dist/js/bootstrap.js'
                    ]
                }
            }
        },
        less: {
            photolist: {
                files: {
                    "build/css/photolist.css": [
                        "resources/photolist/styles.less"
                    ]
                }
            },
            admin: {
                files: {
                    "build/css/admin.css": [
                        "resources/admin/styles.less"
                    ]
                }
            }
        },
        sprite:{
            all: {
                src: 'resources/sprite/*.png',
                destCss: 'build/css/sprite.css',
                dest: 'public/assets/img/sprite.png',
                imgPath: '/assets/img/sprite.png',
                padding: 2
            }
        },
        postcss: {
            build: {
                processors: [
                    require('autoprefixer')({browsers: 'last 6 versions'}),
                ],
                src: 'build/css/*.css'
            }
        },
        cssmin: {
            photolist: {
                files: {
                    'public/assets/css/photolist.css': [
                        'build/css/sprite.css',
                        'build/css/photolist.css'
                    ]
                }
            },
            admin: {
                files: {
                    'public/assets/css/admin.css': [
                        'node_modules/bootstrap/dist/css/bootstrap.css',
                        'build/css/admin.css'
                    ]
                }
            }
        },
        watch: {
            project: {
                files: [
                    'resources/**/*'
                ],
                tasks: ['build'],
                options: {}
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-spritesmith');
    grunt.loadNpmTasks('grunt-postcss');

    grunt.registerTask('build', [
        'jshint',
        'uglify',
        'sprite',
        'less',
        'postcss',
        'cssmin'
    ]);

    grunt.registerTask('listen', [
        'watch'
    ]);

    grunt.registerTask('default', [
        'build'
    ]);
};