"use strict"

var Template = require("./index.js")
var expect = require("chai").expect

describe("template test", function () {
  it("simple test", function () {
    var t = new Template("Hello, ${greeting}")
    expect(t.render({ greeting: "world" })).to.be.equals("Hello, world")
    expect(t.render({ greeting: "Java" })).to.be.equals("Hello, Java")
    t = new Template("${name} is awesome!")
    expect(t.render({ name: "Javascript" })).to.be.equal("Javascript is awesome!")
  })

  it("nested object test", function () {
    var t = new Template("${person.name}'s age is ${person.age}")
    expect(t.render({ person: { name: "Jack", age: 40 } })).to.be.equals("Jack's age is 40")
  })

  it("complex object test", function () {
    var t = new Template("${person[name]}'s age is ${person.age}")
    expect(t.render({ person: { name: "Jack", age: 40 } })).to.be.equals("Jack's age is 40")

    t = new Template("${persons[1].name}'s age is ${persons[1].age}")
    expect(t.render(
      { persons: [
        { name: "Jack", age: 40 },
        { name: "Hugo", age: 25 }
      ]}
    )).to.be.equal("Hugo's age is 25")

    t = new Template("${company.employees[1].name}'s age is ${company.employees[1].age}")
    expect(t.render(
      {
        company: {
          employees: [
            { name: "Jack", age: 40 },
            { name: "Hugo", age: 25 }
          ]
        }
      }
    ))
  })

  it("missing key replacement test", function () {
    var t = new Template("${person.name}'s age is ${person.age}", {
      missingKeyReplacement: 30
    })
    expect(t.render({ person: { name: "Jack", age: 40 } })).to.be.equals("Jack's age is 40")
    expect(t.render({ person: { name: "Mark" } })).to.be.equals("Mark's age is 30")
  })

  it("missing key test", function () {
    var t = new Template("Hello, ${greeting}")
    expect(() => t.render()).to.throw(TypeError)
  })

  it("escape char test", function() {
    var t = new Template("Cost: \\${money}")
    expect(t.render({money: 4})).to.be.equal("Cost: ${money}")
  })

  it("custom escape char test", function() {
    var t = new Template("Cost: $${money}", { escapeChar: "$"})
    expect(t.render({money: 4})).to.be.equal("Cost: ${money}")
    t = new Template("Cost: |${money}", { escapeChar: "|"})
    expect(t.render({money: 4})).to.be.equal("Cost: ${money}")
  })

  it("custom macro markup test", function() {
    var t = new Template("Hello, $[person]", {macroStart: "$[", macroEnd: "]"})
    expect(t.render({person: "Jack"})).to.be.equal("Hello, Jack")
  })

  it("parse value test", function() {
    var t = new Template("Hello, ${person}")
    expect(t.render({person: "${user.name}", user : {name: "Jack"}})).to.be.equal("Hello, Jack")
  })
})