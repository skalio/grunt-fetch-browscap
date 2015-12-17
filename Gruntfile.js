'use strict';

module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		jshint: {
			all: [
				'Gruntfile.js',
				'tasks/*.js'
			],
			options: {
				jshintrc: '.jshintrc'
			}
		},
		"fetch-browscap": {
			"lite-php": {
				options: {
					destination: "target/lite-php-browscap.ini"
				}
			},
			/*
			"json": {
				options: {
					destination: "target/browscap.json",
					version: "BrowsCapJSON"
				}
			}
			*/
		}
	});

	grunt.loadTasks('tasks');

	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('default', ['fetch-browscap']);
};