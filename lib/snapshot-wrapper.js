var path = require( 'path' );
var spawn = require( 'child_process' ).spawn;
var phantomPath = require( 'phantomjs' ).path;
var phantomScript = path.resolve( path.join( __dirname, 'phantom/basic.js' ) );

exports.takeShot = function( url, output, options, cb ){
  var proc;

  if (options && options.phantomScript) {
    if (options.phantomScript === 'basic') {}
    else if (options.phantomScript === 'selector') {
      phantomScript = path.resolve( path.join( __dirname, 'phantom/selector.js' ) );
    } else {
      phantomScript = path.resolve(options.phantomScript);
    }
  }

  proc = spawn( phantomPath, [
    phantomScript,
    url,
    output,
    options.timeout,
    options.selector,
    options.interval
  ], { cwd: process.cwd(), detached: true });

  proc.stdout.on('data', function(data) {
    console.log(data.toString());
  });

  proc.stderr.on('data', function(data) {
    console.error(data.toString());
  });

  proc.on('error', function(err) {
    console.error(err);
    return cb(err);
  });

  proc.on('exit', function(code) {
    return cb(null, code);
  });
};
