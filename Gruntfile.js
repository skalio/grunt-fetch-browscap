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
				destination: "target/browscap.ini",
				version: "Lite_PHP_BrowsCapINI"
			}
		}
	});

	grunt.loadTasks('tasks');

	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('default', ['fetch-browscap']);
};