/** 
 * @namespace Holds functionality for brickstream applications and libraries
 * @requires  Mustache
 * @requires  jQuery
 */
var dc = dc || {};

define(["jquery", "Mustache", "jquery.mousewheel", "ft/ft.MapGen", "ft/ft.Utilities"], function($, Mustache) {
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
				$refresh_map: $('#refresh_map'),
				$simple_digger_options: $('#simple_digger_options'),
				$cellular_automata_options: $('#cellular_automata_options')
			}
		};

		function _init() {
			s = _settings;

			_bindUIActions();

			_refreshMap();
		}

		function _bindUIActions() {
			s.elems.$refresh_map.click(_refreshMap);

			ft.Utilities.handleDropDown(s.elems.$select_map_type, '.dropdown-menu li a', '.btn:first', true, function(newText) {
				$('.map_type_options').hide();
				$('#' + newText.toLowerCase().replace(" ", "_") + "_options").show();
			});

			ft.Utilities.handleDropDown(s.elems.$simple_digger_options.find('.select_tendency'), '.dropdown-menu li a', '.btn:first', true, function(newText) {});

			s.elems.$canvas.on('mousewheel', function(event, delta, deltaX, deltaY) {
				if (deltaY > 0) _zoomMap('out');
				else if (deltaY < 0) _zoomMap('in');
			});
		}

		function _refreshMap() {
			var mapType = s.elems.$select_map_type.find('.btn:first').text().trim();
			ft.Utilities.showLoader(s.elems.$canvas);

			var _options;

			switch(mapType) {
				case 'Simple Digger':
					_options = {
		      	diggerStartX: Math.floor(s.mapHeight / 2),
		      	diggerStartY: Math.floor(s.mapWidth / 2),
		      	maxDiggers: s.elems.$simple_digger_options.find('.max_diggers').val(),
		      	spawnChance: s.elems.$simple_digger_options.find('.spawn_chance').val(),
		      	diggerTicks: s.elems.$simple_digger_options.find('.digger_moves').val(),
		      	tendency: s.elems.$simple_digger_options.find('.select_tendency').find('.btn:first').text().trim()
		    	};
					break;
				case 'Cellular Automata':
					_options = {
						generations: s.elems.$cellular_automata_options.find('.generations').val()
					};
					break;
			}
			setTimeout(function() {
				ft.MapGen.init(mapType, $.extend(_options, {
						width: s.mapWidth,
		      	height: s.mapHeight
		      }), function(map) {
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