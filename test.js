"use strict"

var Template = require("./index.js")
var expect = require("chai").expect

describe("template test", function () {
  it("simple test", function () {
    var t = new Template("Hello, ${greeting}")
    expect(t.render({ greeting: "world" })).to.be.equals("Hello, world")
    expect(t.render({ greeting: "Java" })).to.be.equals("Hello, Java")
  })

  it("complext object test", function () {
    var t = new Template("${person.name}'s age is ${person.age}")
    expect(t.render({ person: { name: "Jack", age: 40 } })).to.be.equals("Jack's age is 40")
  })

  it("missing key replacement test", function () {
    var t = new Template("${person.name}'s age is ${person.age}", {
      missingKeyReplacement: 30
    })
    expect(t.render({ person: { name: "Jack", age: 40 } })).to.be.equals("Jack's age is 40")
    expect(t.render({ person: { name: "Mark" } })).to.be.equals("Mark's age is 30")
  })

  it ("missing key", function() {
    var t = new Template("Hello, ${greeting}")
    expect(() => t.render()).to.throw(TypeError)
  })
})