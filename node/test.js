var foo = function(post, get) {
  console.log("Foo reached");

  if (post) {
    console.log("Post data present");
    console.log(JSON.stringify(post));
  }

  if (get) {
    console.log("Get data present");
    console.log(JSON.stringify(get));
  }

  return { get: get, post: post };
};

exports.foo = foo;
