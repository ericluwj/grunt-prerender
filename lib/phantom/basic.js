var page = require('webpage').create(),
  system = require('system'),
  url, output, timeout, selector, interval;
var fs = require('fs');

if (system.args.length < 3) {
  phantom.exit(1);
} else {
  url = system.args[1];
  output = system.args[2];
  timeout = parseInt(system.args[3]);
  selector = system.args[4];
  interval = parseInt(system.args[5]);

  page.settings.loadImages = false;
  page.settings.webSecurityEnabled = false;
  page.settings.resourceTimeout = timeout;
  page.viewportSize = { width: 600, height: 600 };
  
  page.open(url, function (status) {
    if (status !== 'success') {
      console.error('Unable to load the url!');
      phantom.exit(1);
    } else {
      window.setTimeout(function () {
        // Write HTML to file
        fs.write(output, page.content, 'w');
        phantom.exit();
      }, interval);
    }
  });
}
