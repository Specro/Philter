const expect = require('chai').expect;
const philter = require('../lib/index');

describe('Module', () => {
  it('should return css and svg as strings', function() {
    philter('<div data-philter-blur="10"></div>', (css, svg)=> {
      expect(css).to.be.a('string')
      expect(svg).to.be.a('string')
    })
  })
  it('should return css and svg as strings with tag: false', function() {
    philter('<div data-blur="10"></div>', {tag: false}, (css, svg)=> {
      expect(css).to.be.a('string')
      expect(svg).to.be.a('string')
    })
  })
  it('should throw an Error when no HTML or files are given', function() {
    expect(philter.bind(philter, (css, svg) => {})).to.throw('Philter: No HTML or files given')
  })
  it('should throw an Error when HTML doesn\'t contain philter data attributes', function() {
    expect(philter.bind(philter, '<div></div>', (css, svg) => {})).to.throw('Philter: No philter data attributes found')
  })
  it('should throw an Error when no callback is given', function() {
    expect(philter.bind(philter, '<div></div>')).to.throw('Philter: Callback must be a function')
  })
})

describe('Filters', () => {
  it('blur', function() {
    philter('<div data-philter-blur="10"></div>', (css, svg)=> {
      expect(css).to.equal('[data-philter-blur="10"]{filter:blur(10px);}')
      expect(svg).to.equal('')
    })
  })
  it('grayscale', function() {
    philter('<div data-philter-grayscale="10"></div>', (css, svg)=> {
      expect(css).to.equal('[data-philter-grayscale="10"]{filter:grayscale(10%);}')
      expect(svg).to.equal('')
    })
  })
  it('hue-rotate', function() {
    philter('<div data-philter-hue-rotate="10"></div>', (css, svg)=> {
      expect(css).to.equal('[data-philter-hue-rotate="10"]{filter:hue-rotate(10deg);}')
      expect(svg).to.equal('')
    })
  })
  it('saturate', function() {
    philter('<div data-philter-saturate="10"></div>', (css, svg)=> {
      expect(css).to.equal('[data-philter-saturate="10"]{filter:saturate(10%);}')
      expect(svg).to.equal('')
    })
  })
  it('sepia', function() {
    philter('<div data-philter-sepia="10"></div>', (css, svg)=> {
      expect(css).to.equal('[data-philter-sepia="10"]{filter:sepia(10%);}')
      expect(svg).to.equal('')
    })
  })
  it('contrast', function() {
    philter('<div data-philter-contrast="10"></div>', (css, svg)=> {
      expect(css).to.equal('[data-philter-contrast="10"]{filter:contrast(10%);}')
      expect(svg).to.equal('')
    })
  })
  it('invert', function() {
    philter('<div data-philter-invert="10"></div>', (css, svg)=> {
      expect(css).to.equal('[data-philter-invert="10"]{filter:invert(10%);}')
      expect(svg).to.equal('')
    })
  })
  it('opacity', function() {
    philter('<div data-philter-opacity="10"></div>', (css, svg)=> {
      expect(css).to.equal('[data-philter-opacity="10"]{filter:opacity(10%);}')
      expect(svg).to.equal('')
    })
  })
  it('brightness', function() {
    philter('<div data-philter-brightness="10"></div>', (css, svg)=> {
      expect(css).to.equal('[data-philter-brightness="10"]{filter:brightness(10%);}')
      expect(svg).to.equal('')
    })
  })
  it('drop-shadow', function() {
    philter('<div data-philter-drop-shadow="10 10 10 black"></div>', (css, svg)=> {
      expect(css).to.equal('[data-philter-drop-shadow="10 10 10 black"]{filter:drop-shadow(10px 10px 10px black);}')
      expect(svg).to.equal('')
    })
  })
  it('svg', function() {
    philter('<div data-philter-svg="filter"></div>', (css, svg)=> {
      expect(css).to.equal('[data-philter-svg="filter"]{filter:url(#filter);}')
      expect(svg).to.equal('')
    })
  })
  it('color', function() {
    philter('<div data-philter-color="black 10"></div>', (css, svg)=> {
      expect(css).to.equal('[data-philter-color="black 10"]{filter:url(#color-1);}')
      expect(svg.replace(/\r?\n|\r/g, '')).to.equal('<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="0" height="0" id="philter-svg"><defs><filter id="color-1" primitiveunits="objectBoundingBox"><feflood x="0" y="0" width="100%" height="100%" flood-opacity="0.1" flood-color="black" in="SourceGraphic" result="overlay"><feblend in="overlay" in2="SourceGraphic"></feblend></feflood></filter></defs></svg>')
    })
  })
  it('vintage', function() {
    philter('<div data-philter-vintage="3"></div>', (css, svg)=> {
      expect(css).to.equal('[data-philter-vintage="3"]{filter:url(#vintage-3);}')
      expect(svg.replace(/\r?\n|\r/g, '')).to.equal('<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="0" height="0" id="philter-svg"><defs><filter id="vintage-3" primitiveUnits="objectBoundingBox"><feComponentTransfer x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB" result="curves"><feFuncR type="table" tableValues="0.196078431372549 0.2196078431372549 0.4352941176470588 0.7843137254901961 1"/><feFuncG type="table" tableValues="0 0.3588235294117647 0.6137254901960784 0.9 1"/><feFuncB type="table" tableValues="0.3196078431372549 0.4333333333333333 0.5156862745098039 0.5980392156862745 0.6882352941176471 0.7745098039215686 0.8529411764705882 0.9823529411764706 1"/><feFuncA type="table" tableValues="1 1"/></feComponentTransfer><feColorMatrix type="saturate" values="0.95" result="desaturate" /><feComponentTransfer x="0" y="0" width="100%" height="100%" color-interpolation-filters="linearRGB" result="exposure"><feFuncR type="gamma" amplitude="1" exponent="1" offset="0.03" /><feFuncG type="gamma" amplitude="1" exponent="1" offset="0.03" /><feFuncB type="gamma" amplitude="1" exponent="1" offset="0.03" /><feFuncA type="gamma" amplitude="1" exponent="1" offset="0" /></feComponentTransfer></filter></defs></svg>')
    })
  })
})
