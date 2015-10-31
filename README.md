# Philter
Philter is a jQuery plugin giving you the power to control CSS filters with HTML classes.
## Dependencies
You probably already guessed it. You need jQuery for this one:
```HTML
<script src="http://code.jquery.com/jquery-2.1.4.min.js"></script>
```
You could also use Bower which is my prefered method.
## Installation
Download the the chosen version include it in your page:
```HTML
<script src="js/philter.min.js"></script>
```
And that's it! You're ready to go!
## How To
First initiate the plugin:
```HTML
<script>
  $.philter();
</script>
```
Now you can start using the filters. The plugin uses this kind of syntax format:
```
philter <filter>_<value>
```
or
```
philter <filter>_<value>_hover_<hover-value>
```
You give an element the class 'philter', specify a filter and then a value for it. You can also add 'hover' and another value that the filter will use when hovering on that element.
For example:
```HTML
<div class="philter blur_5"></div>
```
This element would be blured in 5px radius. If we would add a 'hover' option, like this:
```HTML
<div class="philter blur_5_hover_0"></div>
```
The element would unblur when hovered over with the mouse.
You can add more than one filter onto an element by using the same method.
You need to specify the 'philter' class only once:
```HTML
<div class="philter blur_5_hover_0 grayscale_100"></div>
```
Philter even supports custom SVG filters:
```HTML
<div class="philter blur_5_hover_0 svg_filter"></div>
```
Where 'filter' after 'svg' is the ID of the filter.
## Compatibility
Philter was developed on Chrome 46, Firefox 41 and Edge 20 so far. It should be compatible with most versions of browsers that support filters.
You may notice glitching on Edge when more than one hover element is on the page.
## License
Philter is licensed under MIT License.
