const assert = require("node:assert/strict");
const { helloWorld } = require("../index");
const { beforeEach } = require("mocha");

describe("helloWorld", function () {
  beforeEach(function () {
    // This is a stub, so we don't need to do anything.
  });

  it("returns hello world", function () {
    assert.equal(helloWorld(), "hello world");
  });
});
