var fs = require('fs');
var request = require('request');
var mkdirp = require('mkdirp');

module.exports = function (grunt) {
	
	'use strict';
	
	var ini = require('ini');
	var Q = require('q');
	
	function getPublicUrl(version) {
		return 'http://browscap.org/stream?q='+ version;
	}
	
	function getVersionNumber() {
		var defer = Q.defer();
		var url = 'http://browscap.org/version-number';
		
		grunt.log.write('Fetching version number from '+ url + ' ... ');
		var options = {
			url: url,
			method: 'GET'
		};
		request(options, function(error, response, body) {
			if (error) {
				grunt.log.error('got error: '+ error.message);
				defer.reject(error);
			} else {
				grunt.log.ok();
				defer.resolve(body);
			}
		});
		
		return defer.promise;
	}
	
	function checkFileRequiresDownload(options) {
		grunt.log.write('Checking if '+ options.destination +' exists ... ');
		try {
			var stat = fs.statSync(options.destination);

			if (stat.size === 0) {
				grunt.log.ok('NO');
				grunt.log.writeln('empty file');
				return true;
			}
		} catch (e) {
			grunt.log.ok('NO');
			grunt.log.writeln('File not found');
			return true;
		}
		grunt.log.ok();

		grunt.log.write('Checking if '+ options.versionNumberDestination +' matches ... ');
		try {
			stat = fs.statSync(options.versionNumberDestination);
			if (stat.size === 0) {
				grunt.log.ok('NO');
				grunt.log.writeln('empty file');
				return true;
			}
		} catch (e) {
			grunt.log.ok('NO');
			grunt.log.writeln('File not found');
			return true;
		}

		var ourVersionNumber = fs.readFileSync(options.versionNumberDestination, 'utf8');
		if (ourVersionNumber !== options.versionNumber) {
			grunt.log.ok('NO');
			grunt.log.writeln('Stored version number: '+ ourVersionNumber);
			return true;
		}
		
		// version matches
		grunt.log.ok();
		grunt.log.writeln('Download not necessary');
		return false;
	}
	
	function storeVersionNumber(options) {
		var defer = Q.defer();
		grunt.log.write('Storing version number '+ options.versionNumber +' in '+ options.versionNumberDestination +' ... ');
		
		// create target
		var parts = options.versionNumberDestination.split('/');
		parts.pop();
		var destFolder = parts.join('/');
		mkdirp.sync(destFolder);

		fs.writeFile(options.versionNumberDestination, options.versionNumber, function(e) {
			if (e) {
				grunt.log.error('Got error: '+ e.message);
				defer.reject(e);
			} else {
				grunt.log.ok();
				defer.resolve();
			}
		});
		
		return defer.promise;
	}

	function downloadBrowscap(options) {
		var defer = Q.defer();
		grunt.log.write('Downloading '+ options.version +' to '+ options.destination +' ... ');

		// create target
		var parts = options.destination.split('/');
		parts.pop();
		var destFolder = parts.join('/');
		mkdirp.sync(destFolder);

		var file = fs.createWriteStream(options.destination);
		var remote = request(getPublicUrl(options.version));
		var bytes = 0;
		
		remote.on('data', function(chunk) {
			file.write(chunk);
			bytes += chunk.length;
		});
		
		remote.on('end', function() {
			grunt.log.ok();
			grunt.log.writeln('Wrote '+ bytes +' Bytes to file');
			file.end();
			defer.resolve();
		});
		
		remote.on('error', function(e) {
			grunt.log.error('Got error: '+ e.message);
			file.end();
			defer.reject(e);
		});
		
		return defer.promise;
	}
	
	var fetchBrowscapTask = function fetchBrowscapTask() {
		// merge task specific options with these defaults
		var options = this.options({
			destination: 'target/browscap.ini',
			version: 'Lite_PHP_BrowsCapINI',
			versionNumberDestination: 'target/browscap.version'
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
		
		getVersionNumber()
		.then(function(liveVersionNumber) {
			grunt.log.writeln('Version number: '+ liveVersionNumber);
			options.versionNumber = liveVersionNumber;
			
			if (checkFileRequiresDownload(options)) {
				return downloadBrowscap(options)
				.then(function() {
					return storeVersionNumber(options);
				}).then(function() {
					grunt.log.writeln('Version number stored');
				});
			}
			
		}).then(function() {
			done();
		}).catch(function(error) {
			// some problem
			done(false);
		}).done();
		
	};
	
	grunt.registerMultiTask('fetch-browscap', fetchBrowscapTask);
};

