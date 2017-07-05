const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const cheerio = require('cheerio')
const Promise = require('bluebird')
const isHtml = require('is-html')

Promise.promisifyAll(fs)

function philter(files, options, cb) {
  if (!_.isString(files) && !_.isArray(files)) {
    throw new Error('Philter: No HTML or files given')
  }
  if (_.isFunction(options)) {
    cb = options
    options = {}
  }
  if (!_.isFunction(cb)) {
    throw new Error('Philter: Callback must be a function')
  }
  options = _.defaults(options, {
    tag: true,
    customFilterDir: '',
    customFilters: []
  })

  if (isHtml(files)) {
    let $ = cheerio.load(files)
    parseElements($, options, cb)
  } else {
    let html = ''
    let promises = []
    _.forEach(files, (file) => {
      promises.push(
        fs.readFileAsync(file, 'utf-8').then((data) => {
          html += data
        }).catch((err) => {
          throw err
        })
      )
    })
    Promise.all(promises).then(() => {
      let $ = cheerio.load(html)
      parseElements($, options, cb)
    })
  }
}

/**
* Parse HTML and return elements with philter attributes
* @param {Object} $ Cheerio object
* @param {Object} filters All possible filters
* @param {Boolean} tag Is 'philter' tag active
*/
function getElements($, filters, tag) {
  let elements = [];
  _.forEach(filters, (unit, filter) => {
    let query;
    if (tag) {
      query = $(`[data-philter-${filter}]`)
    } else {
      query = $(`[data-${filter}]`)
    }
    if (query) {
      _.forEach(query, (element) => {
        if (!_.includes(elements, element)) {
          elements.push(element)
        }
      })
    }
  })

  return elements
}

/**
* Parse elements and pass generated CSS and SVG to the callback
* @param {Object} $ Cheerio object
* @param {Object} options Philter options
* @param {Function} cb Callback
*/
function parseElements($, options, cb) {
  let filters = {
    'blur': 'px',
    'grayscale': '%',
    'hue-rotate': 'deg',
    'saturate': '%',
    'sepia': '%',
    'contrast': '%',
    'invert': '%',
    'opacity': '%',
    'brightness': '%',
    'drop-shadow': (h, v, blur, color) => `${h}px ${v}px ${blur}px ${color}`,
    'svg': (url) => `url(#${url})`,
    'color': (nr) => `url(#color-${nr})`,
    'vintage': (nr) => `url(#vintage-${nr})`,
    'anaglyph': (nr) => `url(#anaglyph-${nr})`,
    'custom': {}
  }
  let filterCount = {
    'color': 0,
    'anaglyph': 0,
    'vintage-1': 0,
    'vintage-2': 0,
    'vintage-3': 0,
    'vintage-4': 0,
    'vintage-5': 0,
    'vintage-6': 0
  }
  let css = ''
  let svg = ''
  let promises = []
  if (!_.isEmpty(options.customFilters)) {
    if (!options.customFilterDir) {
      throw new Error('Philter: No custom filter directory found')
    }
    _.forEach(options.customFilters, (value) => {
      filters.custom[value] = `url(#${value})`
      filterCount[value] = 0
    })
  }
  let elements = getElements($, filters, options.tag)

  if (_.isEmpty(elements)) {
    throw new Error('Philter: No philter data attributes found')
  }

  _.forEach(elements, (element) => {
    let selector = ''
    let rule = {
      default: '',
      hover: ''
    }
    _.forEach($(element).data(), (value, key) => {
      value = value.toString()
      let values = value.split(' ')
      key = _.replace(_.kebabCase(key), /(philter-)/g, '')
      selector += `[data-${options.tag?'philter-':''}${key}="${value}"]`
      switch (key) {
        case 'color':
          filterCount.color++
          rule.default += filters.color(filterCount.color)
          getColorFilter(values[0], values[1], filterCount.color, promises, (filter) => {
            svg += filter
          })
          if (values[2] && values[3]) {
            filterCount.color++
            rule.hover += filters.color(filterCount.color)
            getColorFilter(values[2], values[3], filterCount.color, promises, (filter) => {
              svg += filter
            })
          }
          break
        case 'anaglyph':
          filterCount.anaglyph++
          rule.default += filters.anaglyph(filterCount.anaglyph)
          getAnaglyphFilter(values[0], filterCount.anaglyph, promises, (filter) => {
            svg += filter
          })
          if (values[1]) {
            filterCount.anaglyph++
            rule.hover += filters.anaglyph(filterCount.anaglyph)
            getAnaglyphFilter(values[1], filterCount.anaglyph, promises, (filter) => {
              svg += filter
            })
          }
          break
        case 'vintage':
          if (!_.has(filterCount, `vintage-${values[0]}`)) {
            throw new Error(`Philter: No such filter: vintage-${values[0]}`);
          }
          filterCount[`vintage-${values[0]}`]++;
          rule.default += filters.vintage(values[0])
          if (filterCount[`vintage-${values[0]}`] === 1) {
            getVintageFilter(values[0], promises, (filter) => {
              svg += filter
            })
          }
          if (values[1]) {
            filterCount[`vintage-${values[1]}`]++;
            rule.hover += filters.vintage(values[1])
            if (filterCount[`vintage-${values[1]}`] === 1) {
              getVintageFilter(values[1], promises, (filter) => {
                svg += filter
              })
            }
          }
          break
        case 'drop-shadow':
          rule.default += `${key}(${filters[key](values[0], values[1], values[2], values[3])})`
          if (values[4] && values[5] && values[6] && values[7]) {
            rule.hover += `${key}(${filters[key](values[4], values[5], values[6], values[7])})`
          }
          break
        case 'svg':
          rule.default += filters.svg(values[0])
          if (values[1]) {
            rule.hover += filters.svg(values[1])
          }
          break
        case 'custom':
          filterCount[values[0]]++
          rule.default += filters.custom[values[0]]
          if (filterCount[values[0]] === 1) {
            getCustomFilter(path.join(options.customFilterDir, values[0]), promises, (filter) => {
              svg += filter
            })
          }
          if (values[1]) {
            filterCount[values[1]]
            rule.hover += custom.filters[values[1]]
            if (filterCount[values[1]] === 1) {
              getCustomFilter(path.join(options.customFilterDir, values[1]), promises, (filter) => {
                svg += filter
              })
            }
          }
          break
        default:
          // setup default rule
          rule.default += `${key}(${values[0]+filters[key]})`

          // setup hover rule
          if (values[1]) {
            rule.hover += `${key}(${values[1]+filters[key]})`
          }
      }
    })
    css += `${selector}{filter:${rule.default};}`
    if (rule.hover) {
      css += `${selector}:hover{filter:${rule.hover};}`
    }

    selector = ''
    rule.default = ''
    rule.hover = ''
  })
  Promise.all(promises).then(() =>   {
    let svgWrapper = ''
    if (svg) {
      svgWrapper = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="0" height="0" id="philter-svg"><defs>${svg}</defs></svg>`
    } else {
      svgWrapper = ''
    }

    cb(css, svgWrapper)
  })
}

/**
* Parse color filter and pass it to the callback
* @param {String} color Filter color
* @param {String} opacity Filter opacity
* @param {Integer} id Filter ID
* @param {Array} promises List of readFileAsync promises
* @param {Function} cb Callback
*/
function getColorFilter(color, opacity, id, promises, cb) {
  let filter = ''
  promises.push(
    fs.readFileAsync('./lib/svg/color.svg', 'utf-8').then((data) => {
      let $ = cheerio.load(data, {recognizeSelfClosing: true});
      $('filter').attr('id', 'color-' + id)
      $('feflood').attr('flood-color', color).attr('flood-opacity', opacity/100)
      filter = $.html()
      cb(filter)
    }).catch((err) => {
      throw err
    })
  )
}

/**
* Parse anaglyph filter and pass it to the callback
* @param {String} offset Filter offset
* @param {Integer} id Filter ID
* @param {Array} promises List of readFileAsync promises
* @param {Function} cb Callback
*/
function getAnaglyphFilter(offset, id, promises, cb) {
  let filter = ''
  promises.push(
    fs.readFileAsync('./lib/svg/anaglyph.svg', 'utf-8').then((data) => {
      let $ = cheerio.load(data, {recognizeSelfClosing: true});
      $('filter').attr('id', 'anaglyph-' + id)
      $('feoffset').attr('dx', offset/100)
      $('feblend').attr('x', offset/100)
      filter = $.html()
      cb(filter)
    }).catch((err) => {
      throw err
    })
  )
}

/**
* Read vintage filter and pass it to the callback
* @param {Integer} id Filter ID
* @param {Array} promises List of readFileAsync promises
* @param {Function} cb Callback
*/
function getVintageFilter(id, promises, cb) {
  let filter = ''
  promises.push(
    fs.readFileAsync(`./lib/svg/vintage-${id}.svg`, 'utf-8').then((data) => {
      cb(data)
    }).catch((err) => {
      throw err
    })
  )
}

/**
* Load custom SVG filter
* @param {String} file SVG file directory
* @param {Array} promises List of readFileAsync promises
* @param {Function} cb Callback
*/
function getCustomFilter(dir, promises, cb) {
  promises.push(
    fs.readFileAsync(dir + '.svg', 'utf-8').then((data) => {
      cb(data)
    }).catch((err) => {
      throw err
    })
  )
}

module.exports = philter
