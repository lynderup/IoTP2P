var test = {test: "test"};

var test2 = [];
test2[0] = test;

test = {test: "test2"};

console.log(test2);