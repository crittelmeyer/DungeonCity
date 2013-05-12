/** 
 * @namespace Holds functionality for brickstream applications and libraries
 * @requires  Mustache
 * @requires  jQuery
 */
var ft = ft || {};


define(["jquery", "Mustache"], function($, Mustache) {
	var s;

	/**
	 * Holds all of our dungeon generation code & returns the exposed public API
	 * 
	 * @return {Object}
	 *
	 * @author  Chris & John Rittelmeyer
	 */
	ft.DungeonGen = (function() {
		//other settings or important information such as counts, URLs, Paths, etc..
		var _settings = {
			/**
			 * Width of our map
			 * @type {Number}
			 */
			mapWidth: 120,

			/**
			 * Height of our map
			 * @type {Number}
			 */
			mapHeight: 30,

			/**
			 * Stores different types of map tiles
			 * 
			 * @type {Object}
			 */
			tiles: {
				ground: '.',
				wall: '#',
				blank: '&nbsp;'
			},

			/**
			 * array of available movement directions
			 * @type {Array}
			 */
			directions: ['u', 'r', 'd', 'l'],

			/**
			 * Represents our "digger" who procedurally "digs" out our map
			 * 
			 * @type {Object}
			 */
			diggers: [],

			/**
			 * Maximum number of randomly-spawned diggers
			 * @type {Number}
			 */
			maxDiggers: 3,

			/**
			 * Number of ticks remaining
			 * @type {Number}
			 */
			remainingDiggerTicks: 3000,

			/**
			 * Cache interesting elements here (buttons, inputs, dialogs, etc..)
			 * 
			 * @type {Object}
			 */
			elems: {
				/**
				 * canvas element to which we render our dungeon
				 * @type {jQuery Object}
				 */
				$canvas: $('#canvas')
			}
		};

		/**
		 * Initializes the dungeon
		 *
		 * @private
		 *
		 * @author  Chris & John Rittelmeyer
		 */
		function _init() {
  		//alias the settings object a level up for easier access
    	s = _settings;

  		//render dungeon
      this.Map.init(s.mapWidth, s.mapHeight, s.tiles.blank);

      //init digger
      this.Digger.init(this.Map, s.diggers, {
      	x: Math.floor(s.mapHeight / 2),
      	y: Math.floor(s.mapWidth / 2),
      	spawnChance: 0.12,
      	tile: s.tiles.ground
      }, function() {
      	_moveDiggers();
      });

      //draw map after final modifications to worldMap array
      this.Map.draw(s.elems.$canvas);
		}

		function _moveDiggers() {
			$.each(s.diggers, function(i, digger) {
				ft.DungeonGen.Digger.move(s.diggers[i], s.directions[Math.floor(Math.random() * s.directions.length)]);
				ft.DungeonGen.Digger.draw(ft.DungeonGen.Map, s.diggers[i], s.tiles.ground);
			});

			s.remainingDiggerTicks -= 1;

			if (s.remainingDiggerTicks > 0) {
				_moveDiggers();
			}
		}

		//expose our public api
		return {
			init: _init
		};
	})();

	ft.DungeonGen.Map = (function() {
		var _mapArray = null, _getMapArray = function() { return _mapArray; };

		function _init(width, height, tile) {
  		//declare and allocate space for world map
  		_mapArray = new Array(height);
  		$.each(_mapArray, function(i) {
  			_mapArray[i] = new Array(width);
  		});

  		//populate map with blank tiles
  		$.each(_mapArray, function(i, column) {
  			$.each(column, function(j) {
  				column[j] = tile;
  			});
  		});
		}

		function _draw($canvas) {
			//clear canvas
			$canvas.empty();

			//redraw map from worldMap array
			$.each(_mapArray, function(i, column) {
				$canvas.append(column.join("") + '<br>');
			});
		}

		return {
			init: _init,
			getMapArray: _getMapArray,
			draw: _draw
		};
	})();

	ft.DungeonGen.Digger = (function() {
		function _init(map, diggers, options, callback) {
			_spawn(diggers, {
				x: options.x,
				y: options.y,
				spawnChance: options.spawnChance
			});

			_draw(map, diggers[0], options.tile);

			if (callback) callback.call();
		}

		function _spawn(diggersArray, options) {
      diggersArray.push({
      	x: options.x,
      	y: options.y,
      	spawnChance: options.spawnChance
      });
		}

		function _draw(map, digger, tile) {
			map.getMapArray()[digger.x][digger.y] = tile;
		}

		function _move(digger, dir) {
			switch (dir) {
				case 'u':
					if (digger.x > 0) digger.x -= 1;
					break;
				case 'r':
					if (digger.y < s.mapWidth - 1) digger.y += 1;
					break;
				case 'd':
					if (digger.x < s.mapHeight - 1) digger.x += 1;
					break;
				case 'l':
					if (digger.y > 0) digger.y -= 1;
					break;
			}
		}

		return {
			init: _init,
			spawn: _spawn,
			move: _move,
			draw: _draw
		}
	})();

	return ft.DungeonGen;
});