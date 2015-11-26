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
      var itr;
      var condition = false;
      var start = new Date().getTime();

      itr = setInterval(function() {
        if ( (new Date().getTime() - start < timeout) && !condition ) {

          // check if the selector element has now been populated
          condition = page.evaluate(function (selector) {
            var result = false;
            var el = document.querySelector(selector);

            if (el) {
              result = el.offsetWidth && el.offsetHeight;
            }

            return result;
          }, selector);

        } else {
          clearInterval(itr);

          if (condition) {
            // Write HTML to file
            fs.write(output, page.content, 'w');
            phantom.exit();
          } else {
            console.error('Timeout loading the url!');
            phantom.exit(1);
          }
        }
      }, interval);
    }
  });
}
