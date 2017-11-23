'use strict'

/**
 * String template support parsing macros defined with velocity like markers.
 * 
 * @param {string} template 
 * @param {object} options 
 */
function Template(template, options) {
  this.template = template
  this.options = {
    macroStart: "${",
    macroEnd: "}",
    escapeChar: "\\",
    resolveEscapes: true,
    missingKeyReplacement: null,
    parseValues: true,
    macroResolver: function (context, name) {
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
  }

  // extend options
  if (options) {
    for (var p in options) {
      if (options[p]) {
        this.options[p] = options[p]
      }
    }
  }
}



/**
 * Render string template
 * 
 * @param {object} context 
 */
Template.prototype.render = function (context) {
  var result = ""
  var i = 0
  var len = this.template.length

  var template = this.template
  var options = this.options

  while (i < len) {
    var idx = template.indexOf(options.macroStart, i)
    if (idx == -1) {
      result += (i == 0 ? template : template.substring(i))
      break
    }

    var j = idx - 1
    var escape = false
    var count = 0

    while (j >= 0 && template.charAt(j) == options.escapeChar) {
      escape = !escape
      if (escape) {
        count++
      }
      j--
    }

    if (options.resolveEscapes) {
      result += template.substring(i, idx - count)
    } else {
      result += template.substring(i, idx)
    }

    if (escape) {
      result += options.macroStart
      i = idx + options.macroStart.length
      continue
    }

    // find macros end
    idx += options.macroStart.length
    var idx2 = template.indexOf(options.macroEnd, idx)
    if (idx == -1) {
      throw new TypeError("Invalid template, unclosed macro at: " + (idx - options.macroStart.length))
    }

    var idx1 = idx

    var name = template.substring(idx1, idx2)

    var value = options.macroResolver(context, name)
    if (!value && options.missingKeyReplacement) {
      value = options.missingKeyReplacement
    }

    if (!value) {
      throw new TypeError("Can't find " + name + "'s value in context")
    } else if (typeof value != "string") {
      value = JSON.stringify(value)
    }

    if (idx == idx1) {
      if (options.parseValues) {
        if (value.indexOf(options.macroStart) != -1) {
          value = new Template(value, this.options).render(context)
        }
      }
      result += value
      i = idx2 + options.macroEnd.length
    } else {
      template = template.substring(0, idx1 - options.macroStart.length) + value + template.substring(idx2 + options.macroEnd.length)
      len = template.length
      i = idx - options.macroStart.length
    }
  }
  return result
}

module.exports = Template