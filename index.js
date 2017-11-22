'use strict'

/**
 * String template support parsing macros defined with velocity like markers.
 * 
 * @param {string} template 
 * @param {*} options 
 */
function Template(template, options) {
  this.template = template
  this.macroStart = "${"
  this.macroEnd = "}"
  this.escapeChar = "\\"
  this.resolveEscapes = true
  this.missingKeyReplacement = null
  this.parseValues = true
  this.macroResolver = function (context, name) {
    var tokens = name.split(".")
    var obj = context
    for (var i = 0; i < tokens.length; i++) {
      var key = tokens[i]
      if (obj[key]) {
        obj = obj[key]
        continue
      }
      // process names with square brackets such as `arrays[1]`, `person[name]`
      if (/\w*\[\w*\]/g.test(key)) {
        var innerTokens = key.split(/\[|\]/g)
        var innerObj = obj[innerTokens[0]]
        if (innerObj && innerObj[innerTokens[1]]) {
          obj = innerObj[innerTokens[1]]
          continue
        }
      }
      return null
    }
    return obj
  }

  if (options) {
    for (var p in options) {
      if (options[p]) {
        this[p] = options[p]
      }
    }
  }
}

/**
 * Render string template
 * 
 * @param {*} context 
 */
Template.prototype.render = function (context) {
  var result = ""
  var i = 0
  var len = this.template.length

  var template = this.template

  while (i < len) {
    var idx = template.indexOf(this.macroStart, i)
    if (idx == -1) {
      result += (i == 0 ? template : template.substring(i))
      break
    }

    var j = idx - 1
    var escape = false
    var count = 0

    while (j >= 0 && template.charAt(j) == "\\") {
      escape = !escape
      if (escape) {
        count++
      }
      j--
    }

    if (this.resolveEscapes) {
      result += template.substring(i, idx - count)
    } else {
      result += template.substring(i, idx)
    }

    if (escape) {
      result += this.macroStart
      i = idx + this.macroStart.length
      continue
    }

    // find macros end
    idx += this.macroStart.length
    var idx2 = template.indexOf(this.macroEnd, idx)
    if (idx == -1) {
      throw new TypeError("Invalid template, unclosed macro at: " + (idx - this.macroStart.length))
    }

    var idx1 = idx

    var name = template.substring(idx1, idx2)

    var value = this.macroResolver(context, name)
    if (!value && this.missingKeyReplacement) {
      value = this.missingKeyReplacement
    }

    if (!value) {
      throw new TypeError("Can't find " + name + "'s value in context")
    } else if (typeof value != "string") {
      value = JSON.stringify(value)
    }

    if (idx == idx1) {
      if (this.parseValues) {
        if (value.indexOf(this.macroStart) > 0) {
          value = this.render(context)
        }
      }
      result += value
      i = idx2 + this.macroEnd.length
    } else {
      template = template.substring(0, idx1 - this.macroStart.length) + value + template.substring(idx2 + this.macroEnd.length)
      len = template.length
      i = idx - this.macroStart.length
    }
  }
  return result
}

module.exports = Template