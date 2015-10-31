/* Philter v1.0.0 | (c) 2015 Liudas Dzisevicius | MIT License */
(function ($) {

  'use strict';

  function getFilterString (filterStrings, filter, units) {
    if (filter[4]) {
      filterStrings[0] = filterStrings[0] + filter[0] + '(' + filter[1] + units + ' ' + filter[2] + units + ' ' + filter[3] + units + ' ' + filter[4] + ') ';
      if (filter[5] && filter[6] && filter[7] && filter[8] && filter[9]) {
        filterStrings[1] = filterStrings[1] + filter[0] + '(' + filter[6] + units + ' ' + filter[7] + units + ' ' + filter[8] + units + ' ' + filter[9] + ') ';
      } else {
        filterStrings[1] = filterStrings[1] + filter[0] + '(' + filter[1] + units + ' ' + filter[2] + units + ' ' + filter[3] + units + ' ' + filter[4] + ') ';
      }
    } else if (filter[0] == 'svg') {
      filterStrings[0] = filterStrings[0] + 'url(' + units + filter[1] + ') ';
      if (filter[2] && filter[3]) {
        filterStrings[1] = filterStrings[1] + 'url(' + units + filter[3] + ') ';
      } else {
        filterStrings[1] = filterStrings[1] + 'url(' + units + filter[1] + ') ';
      }
    } else {
      filterStrings[0] = filterStrings[0] + filter[0] + '(' + filter[1] + units + ') ';
      if (filter[2] && filter[3]) {
        filterStrings[1] = filterStrings[1] + filter[0] + '(' + filter[3] + units + ') ';
      } else {
        filterStrings[1] = filterStrings[1] + filter[0] + '(' + filter[1] + units + ') ';
      }
    }

    return filterStrings;
  }

  $.philter = function (transitionTime) {

    var filters = [
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
      'svg'
    ];
    var filtered = [];
    var filterStrings = ['', ''];
    var styleString = '<style>';

    if (!transitionTime) {
      transitionTime = 0.5;
    }

    $('.philter').each(function () {
      var className = $(this).attr('class');
      var classes = className.split(' ');
      className = '';
      for (var i = 0; i < classes.length; i++) {
        for (var j = 0; j < filters.length; j++) {
          if (~classes[i].indexOf(filters[j])) {
            filtered.push(classes[i]);
          }
        }
        classes[i] = '.' + classes[i];
        className = className + classes[i];
      }

      for (var i = 0; i < filtered.length; i++) {
        var filter = filtered[i].split('_');

        switch (filter[0]) {
          case 'blur':
            filterStrings = getFilterString(filterStrings, filter, 'px');
            break;
          case 'hue-rotate':
            filterStrings = getFilterString(filterStrings, filter, 'deg');
            break;
          case 'drop-shadow':
            filterStrings = getFilterString(filterStrings, filter, 'px');
            break;
          case 'svg':
            filterStrings = getFilterString(filterStrings, filter, '#');
            break;
          default:
            filterStrings = getFilterString(filterStrings, filter, '%');
        }
      }

      styleString = styleString + className + '{filter:' + filterStrings[0] + ';-webkit-filter:' + filterStrings[0] + ';}';
      if (filterStrings[0] != filterStrings[1]) {
        styleString = styleString + className + ':hover{filter:' + filterStrings[1] + ';-webkit-filter:' + filterStrings[1] + ';}';
      }

      filterStrings = ['', ''];
      filtered.length = 0;
    });
    styleString = styleString + '.philter{transition:filter ' + transitionTime + 's,-webkit-filter ' + transitionTime + 's;}</style>';
    $('head').append(styleString);
  }
})(jQuery)
