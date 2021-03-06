requirejs.config({
  "baseUrl": "js/lib",
  "paths": {
    "app": "../app",
    "jquery": ["http://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min", "jquery.min"],
    "bootstrap": ['http://netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/js/bootstrap.min', 'bootstrap.min']
  },
  "shim": {
    "bootstrap": { deps: ["jquery"] }
  }
});

require(["jquery", "Mustache", "app/dc.MapGenTests"], function($, Mustache, MapGenTests) {
  //This function will be called when all the dependencies
  //listed above are loaded. Note that this function could
  //be called before the page is loaded.
  //This callback is optional.
  $(function() {
    MapGenTests.init();
  });
});