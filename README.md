# grunt-fetch-browscap

> Grunt-Task, fetches the latest browscap.ini file from [browscap.org](http://browscap.org) 
and deploys it to a local directory.

## Install
This plugin requires Grunt `>=0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the 
[Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to 
create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and 
use Grunt plugins. Once you're familiar with that process, you may install this 
plugin with this command:

```shell
npm install --save-dev grunt-fetch-browscap
```

Once the plugin has been installed, it may be enabled inside your Gruntfile:

```js
grunt.loadNpmTasks('grunt-fetch-browscap');
```

## Fetch Browscap Task
_Run this task with the `grunt fetch-browscap` command._

Task targets, files and options may be specified according to the grunt 
[Configuring tasks](http://gruntjs.com/configuring-tasks) guide.

In your project's Grundfile, add a section named `fetch-browscap` to the data
object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
	"fetch-browscap": {
		your_target : {
			destination: "target/browscap.ini",
			version: "Lite_PHP_BrowsCapINI"
		}
	}
});
```

### Options

#### destination
Type: `String`
Default value: `target/browscap.ini`

The destination where the file will be downloaded to.

#### version
Type: `String`
Default value: `Lite_PHP_BrowsCapINI`

The type of browscap.ini-file you are interested in. Supported values are:

* `BrowsCapINI`: This is the standard version of browscap.ini file for IIS 5.x and greater.
* `Full_BrowsCapINI`: This is a larger version of browscap.ini with all the new properties.
* `Lite_BrowsCapINI`: This is a smaller version of browscap.ini file containing major browsers & search engines. This file is adequate for most websites.
* `PHP_BrowsCapINI`: This is a special version of browscap.ini for PHP users only!
* `Full_PHP_BrowsCapINI`: This is a larger version of php_browscap.ini with all the new properties.
* `Lite_PHP_BrowsCapINI`: This is a smaller version of php_browscap.ini file containing major browsers & search engines. This file is adequate for most websites.
* `BrowsCapXML`: This is the standard version of browscap.ini file in XML format.
* `BrowsCapCSV`: This is an industry-standard comma-separated-values version of browscap.ini. Easily imported into Access, Excel, MySQL & others.
* `BrowsCapJSON`: This is a JSON (JavaScript Object Notation) version of browscap.ini. This is usually used with JavaScript.
* `BrowsCapZIP`: This archive combines all the above files into one download that is smaller than all eight files put together.

## Rate Limiting
Be aware that downloading the INI files from [browscap.org](http://browscap.org) implies
agreeing to their fair usage policy. Repeat downloads may lead to temporary or
permanent bans.

## Todo

  * Store version number when downloading INI files, compare against current version number.

## Changelog

  * 2015-12-17   v0.1.0: initial version, not intended for public release
