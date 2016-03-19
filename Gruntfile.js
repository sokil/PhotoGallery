module.exports = function (grunt) {
    'use strict';

    var env = grunt.option('env') || 'prod';
    grunt.config('env', env);
    console.log('Environment: ' + env);

    grunt.initConfig({
        jshint: {
            files: [],
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
                    mangle: grunt.config('env') === 'prod',
                },
                files: {
                    'public/assets/js/photolist.js': [
                        'bower_components/jquery/dist/jquery.min.js',
                        'resources/js/photolist.js'
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
                        'bower_components/jquery/dist/jquery.min.js',
                        'bower_components/bootstrap/dist/js/bootstrap.min.js'
                    ]
                }
            }
        },
        less: {
            photolist: {
                files: {
                    "build/css/photolist.css": [
                        "resources/css/photolist.less"
                    ]
                }
            },
            admin: {
                files: {
                    "build/css/admin.css": [
                        "resources/css/admin.less"
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
                        'bower_components/bootstrap/dist/css/bootstrap.min.css',
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
        'newer:uglify',
        'newer:sprite',
        'newer:less',
        'newer:postcss',
        'newer:cssmin'
    ]);

    grunt.registerTask('listen', [
        'watch'
    ]);

    grunt.registerTask('default', [
        'build'
    ]);
};