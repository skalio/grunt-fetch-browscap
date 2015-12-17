var fs = require('fs');
var request = require('request');
var mkdirp = require('mkdirp');

module.exports = function (grunt) {
	
	'use strict';
	
	function getPublicUrl(version) {
		return 'http://browscap.org/stream?q='+ version;
	}

	function downloadBrowscap(options, done) {
		grunt.log.write('Downloading '+ options.version +' to '+ options.destination +' ... ');

		// create target
		var parts = options.destination.split('/');
		parts.pop();
		var destFolder = parts.join('/');
		mkdirp.sync(destFolder);

		var file = fs.createWriteStream(options.destination);
		var remote = request(getPublicUrl(options.version));
		
		remote.on('data', function(chunk) {
			file.write(chunk);
		});
		
		remote.on('end', function() {
			grunt.log.ok();
			file.end();
			done();
		});
		
		remote.on('error', function(e) {
			grunt.log.error('Got error: '+ e.message);
			file.end();
			done(false);
		});
		
	}
	
	var fetchBrowscapTask = function fetchBrowscapTask() {
		// merge task specific options with these defaults
		var options = this.options({
			destination: 'target/browscap.ini',
			version: 'Lite_PHP_BrowsCapINI'
		});
		var done = this.async();

		// list of supported versions
		var versions = [
			'BrowsCapINI',
			'Full_BrowsCapINI',
			'Lite_BrowsCapINI',
			'PHP_BrowsCapINI',
			'Full_PHP_BrowsCapINI',
			'Lite_PHP_BrowsCapINI',
			'BrowsCapXML',
			'BrowsCapCSV',
			'BrowsCapJSON',
			'BrowsCapZIP'
		];
		if (versions.indexOf(options.version) === -1) {
			grunt.fail.fatal('Invalid version');
		}
		
		downloadBrowscap(options, done);
	};
	
	grunt.registerMultiTask('fetch-browscap', fetchBrowscapTask);
};

