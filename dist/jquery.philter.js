/* Philter v1.1.1 | (c) 2015 Liudas Dzisevicius | MIT License */
(function ($) {

  'use strict';

  var filterCount = [];
  filterCount['color'] = 0;

  function getFilterString (filterStrings, filter, units, width, height, url) {
    if (filter[0] == 'drop-shadow') {
      filterStrings[0] = filterStrings[0] + filter[0] + '(' + filter[1] + units + ' ' + filter[2] + units + ' ' + filter[3] + units + ' rgba(0,0,0,' + filter[4]*0.01 + ')) ';
      if (filter[5] && filter[6] && filter[7] && filter[8]) {
        filterStrings[1] = filterStrings[1] + filter[0] + '(' + filter[5] + units + ' ' + filter[6] + units + ' ' + filter[7] + units + ' rgba(0,0,0,' + filter[8]*0.01 + ')) ';
      } else {
        filterStrings[1] = filterStrings[1] + filter[0] + '(' + filter[1] + units + ' ' + filter[2] + units + ' ' + filter[3] + units + ' rgba(0,0,0,' + filter[4]*0.01 + ')) ';
      }
    } else if (filter[0] == 'svg') {
      filterStrings[0] = filterStrings[0] + 'url(' + units + filter[1] + ') ';
      if (filter[2]) {
        filterStrings[1] = filterStrings[1] + 'url(' + units + filter[2] + ') ';
      } else {
        filterStrings[1] = filterStrings[1] + 'url(' + units + filter[1] + ') ';
      }
    } else if (filter[0] == 'color') {
      filterCount['color'] = filterCount['color'] + 1;
      createColorFilter(filter[1], filter[2], width, height, url);
      filterStrings[0] = filterStrings[0] + 'url(' + units + 'color-' + filterCount['color'] + ') ';
      if (filter[3] && filter[4]) {
        filterCount['color'] = filterCount['color'] + 1;
        createColorFilter(filter[3], filter[4], width, height, url);
        filterStrings[1] = filterStrings[1] + 'url(' + units + 'color-' + filterCount['color'] + ') ';
      } else {
        filterStrings[1] = filterStrings[1] + 'url(' + units + 'color-' + filterCount['color'] + ') ';
      }
    } else {
      filterStrings[0] = filterStrings[0] + filter[0] + '(' + filter[1] + units + ') ';
      if (filter[2]) {
        filterStrings[1] = filterStrings[1] + filter[0] + '(' + filter[2] + units + ') ';
      } else {
        filterStrings[1] = filterStrings[1] + filter[0] + '(' + filter[1] + units + ') ';
      }
    }

    return filterStrings;
  }

  function createColorFilter(color, opacity, width, height, url) {
    if (!$('#svg').length) {
      $('body').append('<div id="svg"></div>');
      $('#svg').append('<svg xmlns="http://www.w3.org/2000/svg" version="1.1"><defs></defs></svg>');
    }
    opacity = opacity * 0.01;
    $.ajax({
      url: url + '/philter/svg/color.svg',
      success: function (data) {
        $(data).find('filter').attr('id', 'color-' + filterCount['color']);
        $(data).find('feFlood').attr({
          'flood-opacity': opacity,
          'flood-color': color,
          'width': width,
          'height': height
        });
        var svg = new XMLSerializer().serializeToString(data.documentElement);
        $('defs').append(svg);
        $('#svg').html($('#svg').html());
      },
      error: function (xhr, options, err) {
        console.error(err);
      },
      async: false
    });
  }

  $.philter = function (params) {

    params = $.extend({transitionTime: 0.5, url: '../js', tag: true}, params);

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
      'svg',
      'color'
    ];
    var elements = [];
    var filterStrings = ['', ''];
    var styleString = '<style>';
    var selector = '';

    if (params.tag) {
      var tag = 'data-philter-';
    } else {
      var tag = 'data-';
    }

    for (var i = 0; i < filters.length; i++) {
      $('[' + tag + filters[i] + ']').each(function () {
        if (elements.indexOf(this) < 0) {
          elements.push(this);
        }
      })
    }
    for (var i = 0; i < elements.length; i++) {
      for (var j = 0; j < filters.length; j++) {
        var filter = elements[i].getAttribute(tag + filters[j] + '');
        if (filter) {
          selector = selector + '[' + tag + filters[j] + '="' + filter + '"]';
          filter = filter.split(' ');
          filter.unshift(filters[j]);
          var width = $(elements[i]).width();
          var height = $(elements[i]).height();
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
            case 'color':
              filterStrings = getFilterString(filterStrings, filter, '#', width, height, params.url);
              break;
            default:
              filterStrings = getFilterString(filterStrings, filter, '%');
          }
        }
      }

      styleString = styleString + selector + '{filter:' + filterStrings[0] + ';-webkit-filter:' + filterStrings[0] + ';}';
      if (filterStrings[0] != filterStrings[1]) {
        styleString = styleString + selector + ':hover{filter:' + filterStrings[1] + ';-webkit-filter:' + filterStrings[1] + ';}';
      }

      filterStrings = ['', ''];
      selector = '';
    }
    styleString = styleString + '*{transition:filter ' + params.transitionTime + 's,-webkit-filter ' + params.transitionTime + 's;}</style>';
    $('head').append(styleString);
  }
})(jQuery)
