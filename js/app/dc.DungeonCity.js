/** 
 * @namespace Holds functionality for brickstream applications and libraries
 * @requires  Mustache
 * @requires  jQuery
 */
var dc = dc || {};


define(["jquery", "Mustache", "ft.DungeonGen", "ft.Utilities"], function($, Mustache) {
	var s;

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
			map: [],
			mapWidth: 120,
			mapHeight: 30,

			elems: {
				$canvas: $('#canvas'),
				$refresh_map: $('#refresh_map')
			}
		};

		function _init() {
			s = _settings;

			_bindUIActions();

			_refreshMap();
		}

		function _bindUIActions() {
			s.elems.$refresh_map.on('click', function() {
				_refreshMap();
			});
		}

		function _refreshMap() {
			ft.Utilities.showLoader(s.elems.$canvas);

			setTimeout(function() {
				ft.DungeonGen.init({
	      	width: s.mapWidth, 
	      	height: s.mapHeight,
	      	diggerStartX: Math.floor(s.mapHeight / 2),
	      	diggerStartY: Math.floor(s.mapWidth / 2),
	      	maxDiggers: 3,
	      	diggerTicks: 3000
	    	}, function(map) {
	    		s.map = map;
	    		_drawMap();

	    		ft.Utilities.hideLoader(s.elems.$canvas);
	    	});
			}, 300);
		}

		function _drawMap() {
			//clear canvas
			s.elems.$canvas.empty();

			//redraw map from map array
			$.each(s.map, function(i, column) {
				s.elems.$canvas.append(column.join("") + '<br>');
			});
		}

		return {
			init: _init
		}
	})();

	return dc.DungeonCity;
});