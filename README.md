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
This tool allows you to prerender your SPA application and make it SEO-friendly for content marketing purposes, without the use of servers.
This is very useful, especially when you place your client-side applications on infrastructure that does not support full web server features (e.g. AWS S3/Cloudfront, Github Pages).
You can use this tool to prerender your SPA application before uploading the generated snapshots onto the relevant infrastructure (e.g. AWS S3, Github Pages).

You can read more about this tool at http://www.ericluwj.com/2015/11/17/seo-for-angularjs-on-s3.html.
You are encouraged to use version 0.2.4 as the tool now automatically does a snapshot of the hashed or hashbanged version of URLs, so that it can support all static file hosts (AWS S3, Google Cloud Storage, Rackspace Cloud Files, etc.).

There are a few assumptions for this tool to work:
1. Your SPA application is available as `index.html` on your site.
2. `<base href="/">` to ensure all assets with relative urls will continue to be accessible or don't use relative links at all.
~~3. The various url paths are accessible. (In the case of AWS S3, if you are using HTML5 pushstate with the hash prefix (`!`), you need to add the 404 error redirection rule to add the `!` hashtag in order for the url to be deciphered correctly.)~~
*Note: As of version 0.2.4, you no longer need to ensure deep-linked URLs can work, as this tool will now automatically use the hashed or hashbanged versions of the URLs and crawl the `index.html` in the root directory.*

How this tool works is by taking a HTML snapshot of a particular url path and then saving it as `index.html` under the directory path itself. 
For example, for the following url `http://www.mysite.com/a/`, the HTML snapshot for the url will be saved as `index.html` within the directory `a` under the root folder.

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

#### options.hashPrefix
Type: `String`
Default value: `''`

The hash prefix that you set for the Javascript application, e.g. '!'.

#### options.urls
Type: `Array`
Default value: `[]`

The array of url paths.

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

File path of the custom phantom script to be used instead. You can customize from the default phantom script found at `lib/snapshot.js`. This option is provided because it is understood that sometimes too much preprocessing work of the HTML might be required.

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