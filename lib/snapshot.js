var page = require('webpage').create(),
  system = require('system'),
  address, output, size;
var fs = require('fs');

if (system.args.length < 3) {
  phantom.exit(1);
} else {
  address = system.args[1];
  output = system.args[2];

  page.settings.loadImages = false;
  page.settings.webSecurityEnabled = false;
  page.settings.resourceTimeout = 5000;
  page.viewportSize = { width: 600, height: 600 };
  
  page.open(address, function (status) {
    if (status !== 'success') {
      console.error('Unable to load the address!');
      phantom.exit(1);
    } else {
      window.setTimeout(function () {
        // Write HTML to file
        fs.write(output, page.content, 'w');
        phantom.exit();
      }, 3000);
    }
  });
}
