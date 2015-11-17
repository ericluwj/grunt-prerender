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
You can read more about this tool at http://www.ericluwj.com/2015/11/17/seo-for-angularjs-on-s3.html.

This tool allows you to prerender your SPA application and make it SEO-friendly for content marketing purposes, without the use of servers.
This is very useful, especially when you place your client-side applications on infrastructure that does not support full web server features (e.g. AWS S3/Cloudfront, Github Pages).
You can use this tool to prerender your SPA application before uploading the generated snapshots onto the relevant infrastructure (e.g. AWS S3).

There are a few assumptions for this tool to work:
1. Your SPA application is available as `index.html` on your site.
2. `<base href="/">` to ensure all assets with relative urls will continue to be accessible or don't use relative links at all.
3. The various url paths are accessible. (In the case of AWS S3, if you are using HTML5 pushstate with the hash prefix (`!`), you need to add the 404 error redirection rule to add the `!` hashtag in order for the url to be deciphered correctly.)

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

### Usage Examples

#### Option using sitemap
The most basic option would be to generate snapshots directly from a dynamic sitemap available on the production site, but is not just limited to that as long as there is a sitemap url.
Snapshots will directly be retrieved based on the site path of the sitemap url, so the sitemap has to be on the same site that is to be crawled.

```js
grunt.initConfig({
  prerender: {
    options: {
      sitemap: 'http://www.mysite.com/sitemap.xml',
      dest: 'snapshots/'
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
      dest: 'snapshots/'
    }
  },
});
```

## Contributing
Anyone is welcome to contribute further to this project.
Thorough testing has not been done.

## Release History
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