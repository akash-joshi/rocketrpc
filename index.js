function LogProxy(path) {
  return new Proxy(() => { }, {
    get: function (target, prop) {
      return LogProxy(`${path ? `${path}.` : ""}${prop}`);
    },
    apply: function (target, thisArg, argumentsList) {
      console.log(
        `Called function at path: ${path} with parameters: ${argumentsList}`
      );
    },
  });
}

const myObject = LogProxy("");

myObject.foo.bar.baz({ asd: "asd" }, "asdf");


