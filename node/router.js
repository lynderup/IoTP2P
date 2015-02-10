var route = function(pathname, post, get) {
  console.log("Routing for: " + pathname);

  // TODO: Here needs ze work be done
  // should probably recieve the url part, not path name?

  var pathParts = pathname.split('/');
  if (pathParts.length === 2) {
    // Yay
    var service = pathParts[0];
    var fun = pathParts[1];
    modules[service][fun].call(service, post, get);
  } else {
    // Error?
  }
};

exports.route = route;
