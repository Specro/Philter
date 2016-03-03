/* Philter v1.1.1 | (c) 2015 Liudas Dzisevicius | MIT License */
(function() {

  'use strict';

  window.Philter = function() {

    var defaults = {
      transitionTime: 0.5,
      url: '../js',
      tag: true
    };
    var sheet = document.createElement('style');
    this.errors = {
      falsePath: 'Philter Error: you probably didn\'t declare the right path to philter folder!'
    };
    this.filterCount = {
      'color': 0,
      'vintage-1': 0,
      'vintage-2': 0,
      'vintage-3': 0,
      'vintage-4': 0,
      'vintage-5': 0,
      'vintage-6': 0
    };
    this.filters = [
      'blur',
      'grayscale',
      'hue-rotate',
      'saturate',
      'sepia',
      'contrast',
      'invert',
      'opacity',
      'brightness',
      'drop-shadow',
      'svg',
      'color',
      'vintage'
    ];
    this.elements = [];
    this.styleString = '';
    this.transitionString = '';

    if (arguments[0] && typeof arguments[0] === "object") {
      this.options = extendDefaults(defaults, arguments[0]);
    } else {
      this.options = defaults;
    }

    getElements.call(this);
    parseElements.call(this);

    this.styleString += this.transitionString + '{transition:filter ' + this.options.transitionTime + 's,-webkit-filter ' + this.options.transitionTime + 's;}#svg{height:0;}';
    sheet.innerHTML = this.styleString;
    document.head.appendChild(sheet);
  }

  function getElements() {
    for (var i = 0; i < this.filters.length; i++) {
      if (this.options.tag) {
        var query = document.querySelectorAll('[data-philter-' + this.filters[i] + ']');
      } else {
        var query = document.querySelectorAll('[data-' + this.filters[i] + ']');
      }
      if (query) {
        for (var j = 0; j < query.length; j++) {
          if (this.elements.indexOf(query[j]) < 0) {
            this.elements.push(query[j]);
          }
        }
      }
    }
  }

  function parseElements() {
    var filterStrings = ['', ''];
    var selector = '';

    for (var i = 0; i < this.elements.length; i++) {
      for (var j = 0; j < this.filters.length; j++) {
        if (this.options.tag) {
          var filter = this.elements[i].getAttribute('data-philter-' + this.filters[j] + '');
        } else {
          var filter = this.elements[i].getAttribute('data-' + this.filters[j] + '');
        }
        if (filter) {
          if (this.options.tag) {
            selector += '[data-philter-' + this.filters[j] + '="' + filter + '"]';
          } else {
            selector += '[data-' + this.filters[j] + '="' + filter + '"]';
          }

          filter = filter.split(' ');
          filter.unshift(this.filters[j]);
          filterStrings = getFilterString.call(this, filterStrings, filter, getUnits(filter[0]));
        }
      }

      this.transitionString == '' ? this.transitionString += selector : this.transitionString += ',' + selector;
      this.styleString += selector + '{filter:' + filterStrings[0] + ';-webkit-filter:' + filterStrings[0] + ';}';
      if (filterStrings[0] != filterStrings[1]) {
        this.styleString += selector + ':hover{filter:' + filterStrings[1] + ';-webkit-filter:' + filterStrings[1] + ';}';
      }

      filterStrings = ['', ''];
      selector = '';
    }
  }

  function getFilterString (filterStrings, filter, units) {
    switch (filter[0]) {
      case 'drop-shadow':
        filterStrings[0] = filterStrings[0] + filter[0] + '(' + filter[1] + units + ' ' + filter[2] + units + ' ' + filter[3] + units + ' rgba(0,0,0,' + filter[4]*0.01 + ')) ';
        if (filter[5] && filter[6] && filter[7] && filter[8]) {
          filterStrings[1] = filterStrings[1] + filter[0] + '(' + filter[5] + units + ' ' + filter[6] + units + ' ' + filter[7] + units + ' rgba(0,0,0,' + filter[8]*0.01 + ')) ';
        } else {
          filterStrings[1] = filterStrings[1] + filter[0] + '(' + filter[1] + units + ' ' + filter[2] + units + ' ' + filter[3] + units + ' rgba(0,0,0,' + filter[4]*0.01 + ')) ';
        }
        break;
      case 'svg':
        filterStrings[0] = filterStrings[0] + 'url(' + units + filter[1] + ') ';
        if (filter[2]) {
          filterStrings[1] = filterStrings[1] + 'url(' + units + filter[2] + ') ';
        } else {
          filterStrings[1] = filterStrings[1] + 'url(' + units + filter[1] + ') ';
        }
        break;
      case 'color':
        ++this.filterCount['color'];
        createColorFilter.call(this, filter[1], filter[2], this.filterCount['color']);
        filterStrings[0] = filterStrings[0] + 'url(' + units + 'color-' + this.filterCount['color'] + ') ';
        if (filter[3] && filter[4]) {
          ++this.filterCount['color'];
          createColorFilter.call(this, filter[3], filter[4], this.filterCount['color']);
          filterStrings[1] = filterStrings[1] + 'url(' + units + 'color-' + this.filterCount['color'] + ') ';
        } else {
          filterStrings[1] = filterStrings[1] + 'url(' + units + 'color-' + this.filterCount['color'] + ') ';
        }
        break;
      case 'vintage':
        if (this.filterCount['vintage-' + filter[1]] == 0) {
          createVintageFilter.call(this, filter[1]);
        }
        ++this.filterCount['vintage-' + filter[1]];
        filterStrings[0] = filterStrings[0] + 'url(' + units + 'vintage-' + filter[1] + ') ';
        if (filter[2]) {
          if (this.filterCount['vintage-' + filter[2]] == 0) {
            createVintageFilter.call(this, filter[2]);
          }
          ++this.filterCount['vintage-' + filter[1]];
          filterStrings[1] = filterStrings[1] + 'url(' + units + 'vintage-' + filter[2] + ') ';
        } else {
          filterStrings[1] = filterStrings[1] + 'url(' + units + 'vintage-' + filter[1] + ') ';
        }
        break;
      default:
        filterStrings[0] = filterStrings[0] + filter[0] + '(' + filter[1] + units + ') ';
        if (filter[2]) {
          filterStrings[1] = filterStrings[1] + filter[0] + '(' + filter[2] + units + ') ';
        } else {
          filterStrings[1] = filterStrings[1] + filter[0] + '(' + filter[1] + units + ') ';
        }
    }

    return filterStrings;
  }

  function createColorFilter(color, opacity, id) {
    var svg = document.getElementById('svg');
    if (!svg) {
      svg = document.createElement('div');
      svg.setAttribute('id', 'svg');
      svg.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="0" height="0"><defs></defs></svg>';
      document.body.appendChild(svg);
      svg = document.getElementById('svg');
    }
    opacity = opacity * 0.01;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', this.options.url + '/svg/color.svg');
    xhr.send(null);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          var data = xhr.response;
          if (data) {
            data = data.replace('color', 'color-' + id);
            svg.querySelector('defs').innerHTML += data;
            var flood = svg.querySelector('filter[id="color-' + id + '"]').children[0];
            setAttributes(flood, { 'flood-opacity': opacity, 'flood-color': color });
          } else {
            console.error(this.errors.falsePath);
          }
        } else if (xhr.status === 404) {
          console.error(this.errors.falsePath);
        }
      }
    }.bind(this);
  }

  function createVintageFilter(type) {
    var svg = document.getElementById('svg');
    if (!svg) {
      svg = document.createElement('div');
      svg.setAttribute('id', 'svg');
      svg.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="0" height="0"><defs></defs></svg>';
      document.body.appendChild(svg);
      svg = document.getElementById('svg');
    }
    var xhr = new XMLHttpRequest();
    xhr.open('GET', this.options.url + '/svg/vintage-' + type + '.svg');
    xhr.send(null);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          var data = xhr.response;
          if (data) {
            svg.querySelector('defs').innerHTML += data;
          } else {
            console.error(this.errors.falsePath);
          }
        } else if (xhr.status === 404) {
          console.error(this.errors.falsePath);
        }
      }
    }.bind(this);
  }

  function getUnits(filter) {
    var units = {
      'blur': 'px',
      'hue-rotate': 'deg',
      'drop-shadow': 'px',
      'svg': '#',
      'color': '#',
      'vintage': '#',
      'default': '%'
    };

    switch (filter) {
      case 'blur':
        return units[filter];
        break;
      case 'hue-rotate':
        return units[filter];
        break;
      case 'drop-shadow':
        return units[filter];
        break;
      case 'svg':
        return units[filter];
        break;
      case 'color':
        return units[filter];
        break;
      case 'vintage':
        return units[filter];
        break;
      default:
        return units['default'];
    }
  }

  function setAttributes(el, attrs) {
    for(var key in attrs) {
      el.setAttribute(key, attrs[key]);
    }
  }

  function extendDefaults(source, properties) {
    var property;
    for (property in properties) {
      if (properties.hasOwnProperty(property)) {
        source[property] = properties[property];
      }
    }
    return source;
  }

}());
