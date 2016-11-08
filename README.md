# Philter v1.4.0
[![npm](https://img.shields.io/npm/v/philter.svg)](https://www.npmjs.com/package/philter) [![dependencies](https://david-dm.org/specro/philter.svg)](https://david-dm.org/specro/philter)

Philter is a JS plugin giving you the power to control CSS filters with HTML data attributes.
Visit the [Demo page](http://specro.github.io/Philter/) for examples.

## Installation
Since version 1.3.0 Philter comes as vanilla js plugin or npm package.
Download the plugin and move the `philter` directory to your `js` directory, then include it in your page:
```html
<script src="js/philter/philter.min.js"></script>
```
or with NPM:
```shell
npm install philter
```
## Usage
### Browser
First initiate the plugin:
```html
<script>
  new Philter({
    transitionTime: 0.5, // hover transition time
    url: './js', // philter directory
    tag: true // 'philter' in data attributes
  });
</script>
```
You can pass 3 parameters to Philter:
* transitionTime - The hover transition time of default CSS filters
* url - Philter loads custom SVG filters from external files. Its default path is '../js' where it reaches the filters in default 'philter' folder. If your directory differs somehow e. g. you use 'scripts' instead of 'js' directory, you should pass the path to 'philter' directory in the url parameter. You don't need the trailing slash!
* tag - This enables the 'philter' part in data-philter-<filter>. If you don't use any plugins which use data attributes or they won't collide with Philter, you can set this to false to omit this part and shorten your markup.

### Node
```js
const philter = require('philter')

philter(['index.html', 'post.html'], { tag: true, customFilterDir: '', customFilters: [] } (css, svg) => {
  console.log('CSS: ', css)
  console.log('SVG: ', svg)
})
```
You can also pass 3 parameters to philter:
* tag - boolean - This enables the 'philter' part in data-philter-<filter>. If you don't use any plugins which use data attributes or they won't collide with Philter, you can set this to false to omit this part and shorten your markup.
* customFilterDir - string - Directory where custom filters are stored.
* customFilters - array - Array of custom filter names.

### CLI
```shell
philter index.html post.html -c index.html -s index.html
```

```
Usage: philter [options] <file ...>

Options:

  -h, --help                     output usage information
  -V, --version                  output the version number
  -n, --no-tag                   No "philter" in data attributes
  -s, --svg <dir>                SVG directory or svg/html file to append to
  -c, --css <dir>                CSS directory or css/html file to append to
  -H, --html                     Pass HTML instead of filenames
  -D, --custom-filter-dir <dir>  Custom SVG filter directory
  -F, --custom-filters <list>    Custom filters

```

##Format

Now you can start using the filters. The plugin uses this kind of syntax format:
```html
data-philter-<filter>="<value>"
```
or
```html
data-philter-<filter>="<value> <hover-value>"
```
You give an element the data attribute for a specific filter and then a value for it. You can also add another value that the filter will use when hovering on that element.
For example:
```html
<div data-philter-blur="5"></div>
```
This element would be blured in 5px radius. If we would add another value, like this:
```html
<div data-philter-blur="5 0"></div>
```
The element would unblur when hovered over with the mouse.
With filters that use more than one value you have to specify every value for hover too.
You can add more than one filter onto an element by using the same method:
```html
<div data-philter-blur="5 0" data-philter-grayscale="100"></div>
```
Philter even supports custom SVG filters:
```html
<div data-philter-blur="5 0" data-philter-svg="filter"></div>
```
Where 'filter' in 'data-philter-svg' attribute is the ID of the filter.
Also Philter has pre-built custom filters:
```html
<div data-philter-color="#00ff00 50"></div>
```
This one would overlay the element with #00ff00 color in 50% opacity.
More filters are to come in the near future. You have any suggestions or know a filter that certainly has to be present in Philter? Just contact me or Elephento team.
## More info on filters
Here's a list of filters that you can use and their limitations in Philter.
* blur
* grayscale
* hue-rotate
* saturate
* sepia
* contrast
* invert
* opacity
* brightness
* drop-shadow - Requires 4 values. In the browser the 4th value instead of color is opacity 0 to 100%, color is locked to black.
* svg - Custom SVG filter. Requires 1 value - filter ID.
* color - Requires 2 values. Color and opacity.
* vintage - Requires an integer from 1 to 6.
* custom - Requires a string - custom filter name.

Drop shadow filter in browser supports only black color because with it's already long class it would be even longer with rgba implementation.
### Vintage
There are 6 vintage filters:
* Rises contrast. Brings out details and colors.
* Washes out the image with light brown sepia.
* Raises the brightness and gives a green/cyan look.
* Close to 3 but a bit less brightness and more green.
* Close to 2 but mixed with violet. Gives a sweet/daydream look.
* Grayscale but better (IMO :))

### Custom
You can use filters that you wrote by yourself in NPM/CLI version by using the custom tag like this:
```html
data-philter-cutom="<custom-filter-name>"
```
If using custom filters you must supply the directory where they're stored and custom filter names in the options. The file of the filter must have that name and its id must be that same name.

## Compatibility
Philter was developed and tested on Chrome 46+, Firefox 41+, Opera 34+ and Edge 20+. The default CSS filters should be compatible with most versions of browsers that support filters. The custom filters are supported only by Firefox, Chrome and Opera. You may notice glitching on Edge when more than one hover element is on the page and loss of some filters when they are stacked on one element.
## Issues
This is mainly due to SVG filter limitations or complexities. It may be solved in the future... or it may not.
* On my recent tests with Chrome SVG filters stack with other filters but as always you may encounter bugs.
* SVG filters don't support transitions.
* SVG filters actually know what to do on hover but ^ and you may encounter other bugs (like flickering and so on).

## WIP
I'm working on all sorts of stuff that involves this plugin and doesn't. So please bear with the way I develop Philter. If you have any suggestions ideas or just wanna say something you can send me an email at liudas.dzisevicius@gmail.com or tweet @_citizen00.
* Node module is still in early stage. I need to change many things and write tests for it :)
* Gulp wrapper (I work with Gulp, so there will be no Grunt here. Sorry.)
* More custom SVG filters

## License
Philter is licensed under MIT License.
