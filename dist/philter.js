/* Philter v1.5.0 | (c) 2015-2018 Liudas Dzisevicius | MIT License */
(function() {

  'use strict';

  window.Philter = function() {

    var defaults = {
      transitionTime: 0.5,
      tag: true
    };
    var sheet = document.createElement('style');
    this.filterCount = {
      'color': 0,
      'duotone': 0,
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
      'duotone',
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
      case 'duotone':
        ++this.filterCount['duotone'];
        createDuotoneFilter.call(this, filter[1], filter[2], this.filterCount['duotone']);
        filterStrings[0] = filterStrings[0] + 'url(' + units + 'duotone-' + this.filterCount['duotone'] + ') ';
        if (filter[3] && filter[4]) {
          ++this.filterCount['duotone'];
          createDuotoneFilter.call(this, filter[3], filter[4], this.filterCount['duotone']);
          filterStrings[1] = filterStrings[1] + 'url(' + units + 'duotone-' + this.filterCount['duotone'] + ') ';
        } else {
          filterStrings[1] = filterStrings[1] + 'url(' + units + 'duotone-' + this.filterCount['duotone'] + ') ';
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
    var data = '<filter id="color" primitiveUnits="objectBoundingBox"><feFlood x="0" y="0" width="100%" height="100%" flood-opacity="0.5" flood-color="black" in="SourceGraphic" result="overlay"></feFlood><feBlend in="overlay" in2="SourceGraphic"></feBlend></filter>';
    data = data.replace('color', 'color-' + id);
    svg.querySelector('defs').innerHTML += data;
    var flood = svg.querySelector('filter[id="color-' + id + '"]').children[0];
    setAttributes(flood, { 'flood-opacity': opacity, 'flood-color': color });
  }

  function createDuotoneFilter(color1, color2, id) {
    var svg = document.getElementById('svg');
    if (!svg) {
      svg = document.createElement('div');
      svg.setAttribute('id', 'svg');
      svg.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="0" height="0"><defs></defs></svg>';
      document.body.appendChild(svg);
      svg = document.getElementById('svg');
    }
    color1 = rgb(color1);
    color2 = rgb(color2);
    var data = '<filter id="duotone" primitiveUnits="objectBoundingBox"><feColorMatrix type="matrix" in="SourceGraphic" result="grayscale" values="1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 0 0 0 1 0" /><feComponentTransfer x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB" result="gradientMap"><feFuncR type="table" tableValues="1 0"/><feFuncG type="table" tableValues="1 0"/><feFuncB type="table" tableValues="1 0"/><feFuncA type="table" tableValues="1 1"/></feComponentTransfer></filter>';
    data = data.replace('duotone', 'duotone-' + id);
    svg.querySelector('defs').innerHTML += data;
    var red = svg.querySelector('filter[id="duotone-' + id + '"] fefuncr');
    setAttributes(red, { 'tableValues': color1.r/255+' '+color2.r/255 });
    var green = svg.querySelector('filter[id="duotone-' + id + '"] fefuncg');
    setAttributes(green, { 'tableValues': color1.g/255+' '+color2.g/255 });
    var blue = svg.querySelector('filter[id="duotone-' + id + '"] fefuncb');
    setAttributes(blue, { 'tableValues': color1.b/255+' '+color2.b/255 });
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
    var data = '';
    
    switch (type) {
      case '1':
        data = '<filter id="vintage-1" primitiveUnits="objectBoundingBox"><feColorMatrix type="matrix" values="0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0" result="grayscale" /><feComponentTransfer x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB" result="gradientMap"><feFuncR type="table" tableValues="0.0352941176470588 0.2745098039215686"/><feFuncG type="table" tableValues="0.396078431372549 0.0666666666666667"/><feFuncB type="table" tableValues="0.6431372549019608 0.0509803921568627"/><feFuncA type="table" tableValues="1 1"/></feComponentTransfer><feBlend in="gradientMap" in2="SourceGraphic" mode="soft-light" result="softLight" /><feComponentTransfer x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB" result="curves"><feFuncR type="table" tableValues="0 0.2862745098039216 0.7137254901960784 1"/><feFuncG type="table" tableValues="0 0.2862745098039216 0.7137254901960784 1"/><feFuncB type="table" tableValues="0 0.2862745098039216 0.7137254901960784 1"/><feFuncA type="table" tableValues="1 1"/></feComponentTransfer><feComponentTransfer x="0" y="0" width="100%" height="100%" color-interpolation-filters="linearRGB" result="exposure"><feFuncR type="gamma" amplitude="1" exponent="1" offset="0.02" /><feFuncG type="gamma" amplitude="1" exponent="1" offset="0.02" /><feFuncB type="gamma" amplitude="1" exponent="1" offset="0.02" /><feFuncA type="gamma" amplitude="1" exponent="1" offset="0" /></feComponentTransfer></filter>';
        break;
      case '2':
        data = '<filter id="vintage-2" primitiveUnits="objectBoundingBox"><feColorMatrix type="matrix" values="0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0" result="grayscale" /><feComponentTransfer x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB" result="gradientMap"><feFuncR type="table" tableValues="0.2901960784313725 0.7294117647058824"/><feFuncG type="table" tableValues="0.3490196078431373 0.5098039215686275"/><feFuncB type="table" tableValues="0.3725490196078431 0.3294117647058824"/><feFuncA type="table" tableValues="1 1"/></feComponentTransfer><feBlend in="gradientMap" in2="SourceGraphic" mode="overlay" result="overlay" /><feComponentTransfer x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB" result="curves"><feFuncR type="table" tableValues="0.203921568627451 0.2784313725490196 0.5568627450980392 0.8588235294117647 1"/><feFuncG type="table" tableValues="0.196078431372549 0.3529411764705882 0.7568627450980392 1"/><feFuncB type="table" tableValues="0.2235294117647059 0.2745098039215686 0.3254901960784314 0.4274509803921569 0.5647058823529412 0.7529411764705882 1 1 1"/><feFuncA type="table" tableValues="1 1"/></feComponentTransfer><feColorMatrix type="saturate" values="0.65" result="desaturate" /><feComponentTransfer x="0" y="0" width="100%" height="100%" color-interpolation-filters="linearRGB" result="exposure"><feFuncR type="gamma" amplitude="1" exponent="1" offset="0.02" /><feFuncG type="gamma" amplitude="1" exponent="1" offset="0.02" /><feFuncB type="gamma" amplitude="1" exponent="1" offset="0.02" /><feFuncA type="gamma" amplitude="1" exponent="1" offset="0" /></feComponentTransfer></filter>';
        break;
      case '3':
        data = '<filter id="vintage-3" primitiveUnits="objectBoundingBox"><feComponentTransfer x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB" result="curves"><feFuncR type="table" tableValues="0.196078431372549 0.2196078431372549 0.4352941176470588 0.7843137254901961 1"/><feFuncG type="table" tableValues="0 0.3588235294117647 0.6137254901960784 0.9 1"/><feFuncB type="table" tableValues="0.3196078431372549 0.4333333333333333 0.5156862745098039 0.5980392156862745 0.6882352941176471 0.7745098039215686 0.8529411764705882 0.9823529411764706 1"/><feFuncA type="table" tableValues="1 1"/></feComponentTransfer><feColorMatrix type="saturate" values="0.95" result="desaturate" /><feComponentTransfer x="0" y="0" width="100%" height="100%" color-interpolation-filters="linearRGB" result="exposure"><feFuncR type="gamma" amplitude="1" exponent="1" offset="0.03" /><feFuncG type="gamma" amplitude="1" exponent="1" offset="0.03" /><feFuncB type="gamma" amplitude="1" exponent="1" offset="0.03" /><feFuncA type="gamma" amplitude="1" exponent="1" offset="0" /></feComponentTransfer></filter>';
        break;
      case '4':
        data = '<filter id="vintage-4" primitiveUnits="objectBoundingBox"><feColorMatrix type="matrix" values="0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0" result="grayscale" /><feComponentTransfer x="0" y="0" width="100%" height="100%" result="opacity"><feFuncA type="linear" slope="0.5" /></feComponentTransfer><feBlend in="opacity" in2="SourceGraphic" mode="soft-light" result="softLight" /><feComponentTransfer x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB" result="curves"><feFuncR type="table" tableValues="0.1607843137254902 0.4509803921568627 1"/><feFuncG type="table" tableValues="0.2529411764705882 0.3352941176470588 0.6294117647058824 0.9627450980392157 1"/><feFuncB type="table" tableValues="0 0.3862745098039216 0.5784313725490196 0.9784313725490196 1"/><feFuncA type="table" tableValues="1 1"/></feComponentTransfer><feColorMatrix type="saturate" values="0.9" result="desaturate" /><feComponentTransfer x="0" y="0" width="100%" height="100%" color-interpolation-filters="linearRGB" result="exposure"><feFuncR type="gamma" amplitude="1" exponent="1" offset="0.02" /><feFuncG type="gamma" amplitude="1" exponent="1" offset="0.02" /><feFuncB type="gamma" amplitude="1" exponent="1" offset="0.02" /><feFuncA type="gamma" amplitude="1" exponent="1" offset="0" /></feComponentTransfer></filter>';
        break;
      case '5':
        data = '<filter id="vintage-5" primitiveUnits="objectBoundingBox"><feComponentTransfer x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB" result="levels"><feFuncR type="table" tableValues="0.1137254901960784 0.8745098039215686"/><feFuncG type="table" tableValues="0.1137254901960784 0.8745098039215686"/><feFuncB type="table" tableValues="0.1137254901960784 0.8745098039215686"/></feComponentTransfer><feBlend in="levels" in2="SourceGraphic" mode="screen" result="screen" /><feComponentTransfer x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB" result="curves"><feFuncR type="table" tableValues="0 0 0 0 0.3607843137254902 0.6313725490196078 0.7568627450980392 0.8980392156862745 1"/><feFuncG type="table" tableValues="0 0.2431372549019608 1"/><feFuncB type="table" tableValues="0.1803921568627451 0.392156862745098 0.5490196078431373 0.8431372549019608"/></feComponentTransfer><feComponentTransfer x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB" result="levels2"><feFuncR type="table" tableValues="0.0862745098039216 0.8588235294117647"/><feFuncG type="table" tableValues="0.0862745098039216 0.8588235294117647"/><feFuncB type="table" tableValues="0.0862745098039216 0.8588235294117647"/></feComponentTransfer></filter>';
        break;
      case '6':
        data = '<filter id="vintage-6" primitiveUnits="objectBoundingBox"><feColorMatrix type="matrix" values="0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0" result="grayscale" /><feComponentTransfer x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB" result="levels"><feFuncR type="table" tableValues="0.192156862745098 0.35 1"/><feFuncG type="table" tableValues="0.192156862745098 0.35 1"/><feFuncB type="table" tableValues="0.192156862745098 0.35 1"/></feComponentTransfer><feComponentTransfer x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB" result="curves"><feFuncR type="table" tableValues="0.1882352941176471 0.2274509803921569 0.2705882352941176 0.3254901960784314 0.392156862745098 0.4941176470588235 0.5843137254901961 0.7176470588235294 0.8509803921568627"/><feFuncG type="table" tableValues="0 0.192156862745098 0.396078431372549 0.6392156862745098 0.8980392156862745"/><feFuncB type="table" tableValues="0.1411764705882353 0.3803921568627451 0.9176470588235294"/></feComponentTransfer><feConvolveMatrix order="3 3" preserveAlpha="true" kernelMatrix="1 -1 1 -1 -1 -1 1 -1 1" result="sharpen" /><feComponentTransfer x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB" result="opacity"><feFuncA type="linear" slope="0.2"/></feComponentTransfer><feBlend in="opacity" in2="curves" /></filter>';
        break;
    }

    svg.querySelector('defs').innerHTML += data;
  }

  function getUnits(filter) {
    var units = {
      'blur': 'px',
      'hue-rotate': 'deg',
      'drop-shadow': 'px',
      'svg': '#',
      'color': '#',
      'vintage': '#',
      'duotone': '#',
      'default': '%'
    };
    if (units[filter]) {
      return units[filter];
    } else {
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

  function rgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
  }

}());
