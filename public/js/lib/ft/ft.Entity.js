/** 
 * @namespace Holds functionality for floating tree applications and libraries
 * @requires  Mustache
 * @requires  jQuery
 */
var ft = ft || {};

define(["jquery", "Mustache"], function($, Mustache) {
	ft.Entity = (function() {
		var _lastId = 0, _id = 0;
		var _pos = {x: 0, y: 0};
		var _type = null;
		var _tile = null;
		var _settings = {};
		
		var _points = {
			hp: 100,
			xp: 0
		};
		var _roles = [];

		function _init(x, y, type, settings) {
			_pos.x = x;
			_pos.y = y;
			if (type) {
				_type = type;
				if (_type == 'Player') _tile = '@';
			}
			// $.merge(_settings, settings);

			return {
				id: _id,
				pos: {
					x: _pos.x,
					y: _pos.y
				},
				type: _type,
				tile: _tile
			};
		}

		function _draw(map, player) {
			map.getMapArray()[player.pos.x][player.pos.y].tile = player.tile;
		}

		function _move(map, player, dir) {
			var mapArray = map.getMapArray();

			var offsetX = ft.MapGen.dx[dir];
			var offsetY = ft.MapGen.dy[dir];
console.log(offsetX + ',' + offsetY);
console.log(player.pos.x + ',' + player.pos.y);
			player.pos.y += offsetX;
			player.pos.x += offsetY;
			console.log(player.pos.x + ',' + player.pos.y);

			_draw(map, player);
		}

		return {
			init: _init,
			move: _move,
			draw: _draw,
			getNewId: function() { return ++_lastId; }
		};
	})();

	ft.Entity.Player = (function() {
		function _init(x, y, settings) {
			var newPlayer = ft.Entity.init(x, y, 'Player', settings);
			newPlayer.id = ft.Entity.getNewId();
			return newPlayer;
		}

		function _draw(map, player, tile) {
			ft.Entity.draw(map, player, tile);
		}

		function _move(map, player, dir) {
			ft.Entity.move(map, player, dir);
		}

		return {
			init: _init,
			draw: _draw,
			move: _move
		};
	})();

	return ft.Entity;
});