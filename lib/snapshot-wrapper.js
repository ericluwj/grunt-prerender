var path = require( 'path' );
var spawn = require( 'child_process' ).spawn;
var phantomPath = require( 'phantomjs2' ).path;
var phantomscript = path.resolve( path.join( __dirname, 'snapshot.js' ) );

exports.takeShot = function( url, output, options, cb ){
  var proc;

  if (options && options.phantomScript) {
    phantomscript = path.resolve(options.phantomScript);
  }

  proc = spawn( phantomPath, [
    phantomscript,
    url,
    output
  ], { cwd: process.cwd(), stdio: 'inherit', detached: true });

  proc.on('error', function(err) {
    console.error(err);
    return cb(err);
  });

  proc.on('exit', function(code) {
    return cb(null, code);
  });
};
