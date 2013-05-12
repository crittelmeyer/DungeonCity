/** 
 * @namespace Holds functionality for brickstream applications and libraries
 * @requires  Mustache
 * @requires  jQuery
 */
var dc = dc || {};

define(["jquery", "Mustache", "ft.MapGen", "ft.Utilities"], function($, Mustache) {
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
				$select_map_type: $('#select_map_type'),
				$refresh_map: $('#refresh_map')
			}
		};

		function _init() {
			s = _settings;

			_bindUIActions();

			_refreshMap(s.elems.$select_map_type.find('.btn:first').text().trim());
		}

		function _bindUIActions() {
			s.elems.$refresh_map.on('click', function() {
				_refreshMap(s.elems.$select_map_type.find('.btn:first').text().trim());
			});

			ft.Utilities.handleDropDown(s.elems.$select_map_type, '.dropdown-menu li a', '.btn:first', true, function(newText) {

			});
		}

		function _refreshMap(mapType) {
			ft.Utilities.showLoader(s.elems.$canvas);

			setTimeout(function() {
				ft.MapGen.init(mapType, {
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