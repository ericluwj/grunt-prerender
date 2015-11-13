/*
 * grunt-prerender
 * https://github.com/ericluwj/grunt-prerender
 *
 * Copyright (c) 2015 Eric Lu
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var fs          = require('fs'),
      path        = require('path'),
      snapshot    = require('../lib/snapshot-wrapper');

  var asset = path.join.bind(null, __dirname, '..');

  grunt.registerMultiTask('prerender', 'Generate HTML snapshots', function() {
    var options = this.options({
      dest: '',
      sitemap: '',
      urls: [],
      sitePath: ''
    });

    var done = this.async();

    var sitePath = options.sitePath;

    grunt.log.writeln('Prerendering ...');

    if (options.sitemap) {
      var urlObj = require('url').parse(options.sitemap);
      sitePath = urlObj.protocol + '//' + urlObj.host;

      require('sitemapper').getSites(options.sitemap, function(err, urls) {
        if (err) {
          var urls = options.urls;
        }
        urls = urls.map(function(url) {
          return require('url').parse(url).pathname;
        });
        crawl(urls);
      });
    } else {
      // strip site path of trailing slash
      if (sitePath[sitePath.length-1] === '/') sitePath = sitePath.slice(0, -1);

      var urls = options.urls;
      crawl(urls);
    }

    function crawl(urls) {
      grunt.util.async.forEachSeries(urls, function(url, next) {
        var plainUrl = url.replace(sitePath, '');
        if (plainUrl.indexOf('/') === 0) plainUrl = plainUrl.substr(1);
        var fileName = 'index.html';
        var lastPath = plainUrl.split('/').pop();
        if (lastPath.indexOf('.') > -1) {
          fileName = options.dest + plainUrl;
        } else {
          if (plainUrl === '') {
            fileName = options.dest + 'index.html';
          } else if (plainUrl[plainUrl.length-1] === '/') {
            fileName = options.dest + plainUrl + 'index.html';
          } else {
            fileName = options.dest + plainUrl + '/index.html';
          }
        }
        grunt.log.writeln('Generating', sitePath + url, 'at', fileName);

        snapshot.takeShot(sitePath + url, fileName, function(err) {
          if (err) {
            done();
          } else {
            next();
          }
        });
      });
    };
  });

};
