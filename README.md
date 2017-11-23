# Javascript String Template

A simple and customizable Javascript string template.

## Examples

### Basic

```javascript
var Template = require("@huiyu/string-template")

var template = new Template("Hello, ${target}")
template.render({target: "world"}) // -> "Hello, world"
```

### Nested objects

```javascript
var template = new Template("${person.name}'s age is ${person.age}")
template.render({
  person: {
    name: "Jack".
    age: 40
  }
}) // -> "Jack's age is 40"
```

### Arrays

```javascript
var template = new Template("${company.employees[1].name}'s age is ${company.employees[1].age}")
template.render({
  compnay: {
    employees: [
      { name: "Jack", age: 40 },
      { name: "Hugo", age: 25 }
    ]
  }
}) // -> "Hugo's age is 25"
```

### Escape character

```javascript
template = new Template("Hello: \\${target}")
template.render({target: "world"}) // -> "Hello, ${target}"
```

## Custom

### Replace missing key

```javascript
var template = new Template("Hello, ${target}", {
  missingKeyReplacement: "world"
})
template.render({target: "javascript"}) // -> "Hello, javascript"
template.render({})                     // -> "Hello, world"

template = new Template("Hello, ${target}")
template.render({}) // -> throw TypeError
```

### Custom escape character

```javascript
var template = new Template("Hello, $${target}", {
  escapeChar: "$"
})
template.render({target: "world"}) // -> "Hello, ${target}"
```

###  Custom macro markup

```javascript
var template = new Template("Hello, $[target]", {
  macroStart: "$[",
  macroEnd: "]"
})
template.render({target: "world"}) // -> "Hello, world
```

### Parsing values

```javascript
var template = new Template("Hello, ${target}")
template.render({
  target: "${person.name}",
  person: {
    name: "Jack"
  }
}) // -> "Hello, Jack"
```

## License

MIT