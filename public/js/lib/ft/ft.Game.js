/** 
 * @namespace Holds functionality for floating tree applications and libraries
 * @requires  Mustache
 * @requires  jQuery
 */
var ft = ft || {};

define(["jquery", "ft/ft.MapGen", "ft/ft.Entity", "ft/ft.Utilities"], function($) {
	var s, els;

	ft.Game = (function() {
		var _settings = {
			map: {},
			mapWidth: 120,
			mapHeight: 30,
			elems: {}
		};

		function _init($canvas) {
			s = _settings, els = s.elems;

			els.$canvas = $canvas;

			ft.Utilities.showLoader(els.$canvas);

			_initMap(function() {
				_initPlayer();
			});
		}

		function _initMap(callback) {
			setTimeout(function() {
				ft.MapGen.init('Cellular Automata', {
					generations: 4,
					width: s.mapWidth,
		    	height: s.mapHeight
		    }, function(map) {
					s.map = map;

					_drawMap();

					if (callback) callback.call();
				});
			}, 300);
		}

		function _drawMap() {
			//clear canvas
			els.$canvas.empty();

			//redraw map from map array
			$.each(s.map.getFlattenedMap(), function(i, column) {
				els.$canvas.append(column.join("") + '<br>');
			});
		}

		function _initPlayer() {
			var options = _getRandomBlankLocation();
			var player = ft.Entity.Player.init(options.x, options.y);

			ft.Entity.Player.draw(s.map, player);
			_drawMap();

			ft.Utilities.subscribe('move.N', function() {
				ft.Entity.Player.move(s.map, player, 'N');
				_drawMap();
			});
			ft.Utilities.subscribe('move.E', function() {
				ft.Entity.Player.move(s.map, player, 'E');
				_drawMap();
			});
			ft.Utilities.subscribe('move.S', function() {
				ft.Entity.Player.move(s.map, player, 'S');
				_drawMap();
			});
			ft.Utilities.subscribe('move.W', function() {
				ft.Entity.Player.move(s.map, player, 'W');
				_drawMap();
			});

			ft.Utilities.hideLoader(els.$canvas);
		}

		function _getRandomBlankLocation() {
			var mapArray = s.map.getMapArray();
			var rand1 = ft.Utilities.getRandomNum(mapArray.length);
			var rand2 = ft.Utilities.getRandomNum(mapArray[rand1].length);
			if (ft.MapGen.tiles.ground.indexOf(mapArray[rand1][rand2].tile) > -1) {
				return {
					x: rand1,
					y: rand2
				};
			} else {
				return _getRandomBlankLocation();
			}
		}

		return {
			init: _init
		};
	})();

	return ft.Game;
});