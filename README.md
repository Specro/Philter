# Philter v1.1.2
Philter is a JS plugin giving you the power to control CSS filters with HTML data attributes.
Visit the [Demo page](http://specro.github.io/Philter/) for examples.
## Dependencies
Philter comes in two flavors - jQuery and vanilla JS. Choose the one you want just don't forget in jQuery case to include it:
```HTML
<script src="http://code.jquery.com/jquery-2.1.4.min.js"></script>
```
You could also use Bower which is my preferred method.
## Installation
Download the plugin and move the 'philter' directory to your 'js' directory, then include it in your page:
```HTML
<script src="js/philter/philter.min.js"></script>
```
or in jQuery
```HTML
<script src="js/philter/jquery.philter.min.js"></script>
```
And that's it! You're ready to go!
## How To
First initiate the plugin:
```HTML
<script>
  new Philter();
</script>
```
or again in jQuery

```HTML
<script>
  $.philter();
</script>
```
You can pass 3 parameters to Philter:
* transitionTime - The hover transition time of default CSS filters
* url - Philter loads custom SVG filters from external files. Its default path is '../js' where it reaches the filters in default 'philter' folder. If your directory differs somehow e. g. you use 'scripts' instead of 'js' directory, you should pass the path to 'philter' directory in the url parameter. You don't need the trailing slash!
* tag - This enables the 'philter' part in data-philter-<filter>. If you don't use any plugins which use data attributes or they won't collide with Philter, you can set this to false to omit this part and shorten your markup.

Now you can start using the filters. The plugin uses this kind of syntax format:
```
data-philter-<filter>="<value>"
```
or
```
data-philter-<filter>="<value> <hover-value>"
```
You give an element the data attribute for a specific filter and then a value for it. You can also add another value that the filter will use when hovering on that element.
For example:
```HTML
<div data-philter-blur="5"></div>
```
This element would be blured in 5px radius. If we would add another value, like this:
```HTML
<div data-philter-blur="5 0"></div>
```
The element would unblur when hovered over with the mouse.
With filters that use more than one value you have to specify every value for hover too.
You can add more than one filter onto an element by using the same method:
```HTML
<div data-philter-blur="5 0" data-philter-grayscale="100"></div>
```
Philter even supports custom SVG filters:
```HTML
<div data-philter-blur="5 0" data-philter-svg="filter"></div>
```
Where 'filter' in 'data-philter-svg' attribute is the ID of the filter.
Also Philter has pre-built custom filters:
```HTML
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
* drop-shadow - Supports only black color. Requires 4 values. The 4th value instead of color is opacity 0 to 100%.
* svg - Custom SVG filter. Requires 1 value - filter ID.
* color - Requires 2 values. Color and opacity. Doesn't support transitions.
* vintage - Requires an integer from 1 to 6. Doesn't support transitions or opacity.

Drop shadow filter supports only black color because with it's already long class it would be even longer with rgba implementation.
## Class version (1.0.0)
First version of Philter was based on CSS classes but it was deprecated in favor of data attributes. You still can use and edit the 1.0.0 version that is located in the dist directory. For more info on that version read the README supplied with it.
## Compatibility
Philter was developed on Chrome 46+, Firefox 41+, Opera 34 and Edge 20. The default CSS filters should be compatible with most versions of browsers that support filters. The custom filters support only Firefox, Chrome and Opera.
You may notice glitching on Edge when more than one hover element is on the page and loss of some filters when they are stacked on one element.
## Issues
This is mainly due to SVG filter limitations or complexities. It may be solved in the future... or it may not.
* On my recent tests with Chrome SVG filters stack with other filters but as always you may encounter bugs.
* SVG filters don't support transitions.
* SVG filters actually know what to do on hover but ^ and you may encounter other bugs (like flickering and so on).

## WIP
I'm working on all sorts of stuff that involves this plugin and doesn't. So please bear with the way I develop Philter. If you have any suggestions ideas or just wanna say something you can send me an email at liudas.dzisevicius@gmail.com or tweet @Teraffo.
* Node module + Gulp wrapper
* More custom SVG filters

## License
Philter is licensed under MIT License.
