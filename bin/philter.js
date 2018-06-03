#!/usr/bin/env node

const philter = require('../lib/index')
const cheerio = require('cheerio')
const fs = require('fs-extra')
const path = require('path')
const program = require('commander')

function list(val) {
  return val.split(',')
}

program
.version('1.5.0')
.usage('[options] <file ...>')
.option('-n, --no-tag', 'No "philter" in data attributes')
.option('-s, --svg <dir>', 'SVG directory or svg/html file to append to')
.option('-c, --css <dir>', 'CSS directory or css/html file to append to')
.option('-H, --html', 'Pass HTML instead of filenames')
.option('-D, --custom-filter-dir <dir>', 'Custom SVG filter directory')
.option('-F, --custom-filters <list>', 'Comma-separated custom filter list', list)
.parse(process.argv)

if (program.customFilters && !program.customFilterDir) {
  throw new Error('Philter: Custom filter directory not found')
}
let html = program.html?program.args[0]:program.args
let customFilterDir = program.customFilterDir?program.customFilterDir:''
let customFilters = program.customFilters?program.customFilters:[]
philter(html, {tag:!program.noTag, customFilterDir:customFilterDir, customFilters:customFilters}, (css, svg) => {
  saveData(program.css, css, 'css', (dir) => {
    console.log(`CSS saved to ${dir}`)
    if (svg) {
      saveData(program.svg, svg, 'svg', (dir) => {
        console.log(`SVG saved to ${dir}`)
      })
    }
  })
})

function saveData(dir, data, type, cb) {
  if (dir) {
    if(path.parse(dir).ext && path.parse(dir).ext === '.html') {
      fs.readFile(dir, 'utf-8', (err, file) => {
        if (err) {
          throw err
        }
        let $ = cheerio.load(file, {recognizeSelfClosing: true})
        if (type === 'svg') {
          if ($('body').find('#philter-svg').length) {
            $('#philter-svg').replaceWith(data)
          } else {
            $('body').append(data)
          }
        } else {
          if ($('head').find('#philter-css').length) {
            $('#philter-css').replaceWith(`<style id="philter-css">${data}</style>`)
          } else {
            $('head').append(`<style id="philter-css">${data}</style>`)
          }
        }
        fs.writeFile(dir, $.html(), (err) => {
          if (err) {
            throw err
          }
          cb(dir)
        })
      })
    } else if(path.parse(dir).ext) {
      fs.appendFile(dir, data, (err) => {
        if (err) {
          throw err
        }
        cb(dir)
      })
    } else {
      fs.ensureDir(dir, (err) => {
        if (err) {
          throw err
        }
        fs.writeFile(dir + 'philter.' + type, data, (err) => {
          if (err) {
            throw err
          }
          cb(dir + 'philter.' + type)
        })
      })
    }
  } else {
    fs.writeFile('philter.' + type, data, (err) => {
      if (err) {
        throw err
      }
      cb('philter.' + type)
    })
  }

}
