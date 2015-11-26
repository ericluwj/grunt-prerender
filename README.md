# grunt-prerender

> Automate the prerendering of SPA applications for use with serverless architecture.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-prerender --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-prerender');
```

## The "prerender" task

### Overview
This tool allows you to prerender your SPA application and make it SEO-friendly for content marketing purposes, especially for AngularJS applications.
This is very useful, especially when you place your client-side applications on infrastructure that does not support full web server features (e.g. AWS S3/Cloudfront, Github Pages).
You can use this tool to prerender your SPA application before uploading the generated snapshots onto the relevant infrastructure (e.g. AWS S3, Github Pages).

You are encouraged to use version 0.3.0 as the tool now automatically does a snapshot of the hashed or hashbanged version of URLs, so that it can support all static file hosts (AWS S3, Google Cloud Storage, Rackspace Cloud Files, etc.).
You can read more about this tool at http://www.ericluwj.com/2015/11/17/seo-for-angularjs-on-s3.html.

There are a few assumptions for this tool to work:

1. Your SPA application is available as `index.html` on your site.
2. `<base href="/">` to ensure all assets with relative urls will continue to be accessible or don't use relative links at all.
3. Your SPA application should support hashed or hashbanged versions of URLs. (See `hashPrefix` property to set your hash prefix.)

How this tool works is by taking a HTML snapshot of a particular url path and then saving it as `index.html` under the directory path itself. 
For example, for the following url `http://www.mysite.com/a/`, the tool will crawl the hashed url `http://www.mysite.com/#/a/`, and the HTML snapshot for the url will be saved as `index.html` within the directory `a` under the root folder.

In your project's Gruntfile, add a section named `prerender` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  prerender: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      options: {
        // Target-specific file lists and/or options go here.
      }
    },
  },
});
```

### Options

#### options.dest
Type: `String`
Default value: `''`

The destination where the generated HTML snapshots will be saved to.

#### options.sitemap
Type: `String`
Default value: `''`

The url of the sitemap that contains the urls for the HTML snapshots.

#### options.sitePath
Type: `String`
Default value: `''`

The site path that the array of urls `urls` are based upon.

#### options.urls
Type: `Array`
Default value: `[]`

The array of url paths.

#### options.hashed
Type: `Boolean`
Default value: `true`

Decides whether to hash your URL by default.
Default is `true` as this tool is catered for Javascript SPA applications.

#### options.hashPrefix
Type: `String`
Default value: `''`

The hash prefix that you set for the Javascript application, e.g. '!', if `hashed` is set to `true`.

#### options.timeout
Type: `Integer`
Default value: `7000`

The timeout in milliseconds of the entire snapshot process of each page, in case the page is loading too slowly. 

#### options.limit
Type: `Integer`
Default value: `5`

The limit of snapshot processes to run concurrently.

#### options.haltOnError
Type: `Boolean`
Default value: `false`

Decides whether the task should halt immediately upon any snapshot error.

#### options.phantomScript
Type: `String`
Default value: `''`

File path of the custom phantom script to be used instead.
If value is `basic`, it runs the `basic.js` script found under `lib/phantom/`. This script basically takes a HTML snapshot after the timeout.
If value is `selector`, it runs the `selector.js` script found under `lib/phantom/`. This script will recursively check whether the `selector` option (See `selector` option below) element has been loaded before taking a HTML snapshot.
You can also customize from the default phantom script found at `lib/phantom/basic.js` and set this value to the path of the phantom script file relative to your working directory.

The arguments provided to the phantom script are as such:
url = system.args[1]; (The URL to take snapshot)
output = system.args[2]; (The output path of the HTML snapshot file)
timeout = parseInt(system.args[3]); (The timeout)
selector = system.args[4]; (The DOM selector if applicable)
interval = parseInt(system.args[5]); (The time interval to keep checking the DOM selector if applicable)

#### options.selector (optional)
Type: `String`
Default value: `''`

The `document.querySelector` selector used to detect whether the page has finished loading.
You would generally set this to the element selector that you think will load last.
This is only useful if you have set `phantomScript` to `selector` or if you use it in your custom phantomjs script.

#### options.interval
Type: `String`
Default value: `300`

The time interval to keep checking the `selector` DOM element.
This is only useful if you have set `phantomScript` to `selector` or if you use it in your custom phantomjs script.

### Usage Examples

#### Option using sitemap
The most basic option would be to generate snapshots directly from a dynamic sitemap available on the production site, but is not just limited to that as long as there is a sitemap url.
Snapshots will directly be retrieved based on the site path of the sitemap url, so the sitemap has to be on the same site that is to be crawled.

```js
grunt.initConfig({
  prerender: {
    options: {
      sitemap: 'http://www.mysite.com/sitemap.xml',
      dest: 'snapshots/',
      hashPrefix: '!'
    }
  },
});
```

#### Option using plain urls
Another way would simply be to list all the urls to be crawled for a certain site path.

```js
grunt.initConfig({
  prerender: {
    options: {
      sitePath: 'http://www.mysite.com',
      urls: ['/', '/a/', '/b/'],  // and other paths ...
      dest: 'snapshots/',
      hashPrefix: '!'
    }
  },
});
```

## Contributing
Anyone is welcome to contribute further to this project.
Thorough testing has not been done.

## Release History
_(0.3.0)_
* Created 2 simple Phantomjs scripts to choose from
* Added new options: `hashed`, `timeout`, `selector`, `interval`
* Fixed URL to take snapshot

_(0.2.8)_
* Converted dependencies to use exact versions, especially due to unstable phantomjs2 versions.

_(0.2.7)_
* Switched to using `spawn` instead of `execFile` to allow for more data to be returned from child processes.

_(0.2.6)_
* Fixed order of tasks within `prerender.js`.

_(0.2.5)_
* Fixed bug with `phantomScript` path

_(0.2.4)_
* Fixed bug with `phantomScript` path

_(0.2.3)_
* Added new option `phantomScript` to allow custom phantomjs scripts

_(0.2.2)_
* Added new option `hashPrefix`

_(0.2.1)_
* Added npm keywords

_(0.2.0)_
* Added async module to run processes concurrently, with new `limit` option to control the number of concurrent processes
* Improved performance of snapshot processes
* Added new `haltOnError` option to decide whether to stop the process upon error

_(0.1.1)_
* Fixed dependency bugs

_(0.1.0)_
* Initial Commit