/** 
 * @namespace Holds functionality for brickstream applications and libraries
 * @requires  Mustache
 * @requires  jQuery
 */
var dc = dc || {};

define(["jquery", "jquery.mousewheel", "ft/ft.Game"], function($) {
	var s, els;

	/**
	 * Holds all of our dungeon generation code & returns the exposed public API
	 * 
	 * @return {Object}
	 *
	 * @author  Chris & John Rittelmeyer
	 */
	dc.DungeonCity = (function() {
		//other settings or important information such as counts, URLs, Paths, etc..
		var _settings = {
			keys: {
				119: 'N',
				100: 'E',
				115: 'S',
				97: 'W'
			},
			elems: {
				$canvas: $('#canvas')
			}
		};

		function _init() {
			s = _settings, els = s.elems;

			_bindUIActions();

			ft.Game.init(els.$canvas);
		}

		function _bindUIActions() {
			els.$canvas.on('mousewheel', function(event, delta, deltaX, deltaY) {
				if (deltaY > 0) _zoomMap('out');
				else if (deltaY < 0) _zoomMap('in');
			});

			$(window).keypress(function(event) {
				ft.Utilities.publish('move.' + s.keys[event.which]);
			});
		}

		function _zoomMap(dir) {
			var fontSize = parseInt(s.elems.$canvas.css("font-size"));
			if (dir == 'out') fontSize -= 1;
			else fontSize += 1;
			s.elems.$canvas.css({'font-size': fontSize + "px"});
		}

		return {
			init: _init
		}
	})();

	return dc.DungeonCity;
});