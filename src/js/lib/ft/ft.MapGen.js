/** 
 * @namespace Holds functionality for brickstream applications and libraries
 * @requires  Mustache
 * @requires  jQuery
 */
var ft = ft || {};


define(["jquery", "Mustache"], function($, Mustache) {
	var s;

	/**
	 * Stores all of our dungeon generation code
	 * 
	 * @return {Object} public api
	 *
	 * @author  Chris & John Rittelmeyer
	 */
	ft.MapGen = (function() {
		//other settings or important information such as counts, URLs, Paths, etc..
		var _settings = {
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
		};

		/**
		 * Initializes the dungeon
		 *
		 * @private
		 *
		 * @author  Chris & John Rittelmeyer
		 */
		function _init(mapType, options, callback) {
  		//alias the settings object a level up for easier access
    	s = _settings;
    	this[mapType.replace(" ", "")].init(options, callback);
		}

		//expose our public api
		return {
			init: _init
		};
	})();

	/**
	 * Stores a map module that includes the map array that is ultimately returned by MapGen
	 * 
	 * @return {Object} public api
	 */
	ft.MapGen.Map = (function() {
		var _mapArray = null, _getMapArray = function() { return _mapArray; };

		/**
		 * Initializes a blank map, given a width, height, & blank tile
		 * Optionally adds randomly distributed tiles, if specified
		 * 
		 * @param  {Number} width  Width of the map
		 * @param  {Number} height Height of the map
		 * @param  {String} blankTile   String representation of a "blank" tile
		 * @param  {String} tile   String representation of tile to be randomly distributed
		 * 
		 * @author Chris Rittelmeyer
		 */
		function _init(width, height, blankTile, tile) {
  		//declare and allocate space for map
  		_mapArray = new Array(height);
  		$.each(_mapArray, function(i) {
  			_mapArray[i] = new Array(width);
  		});

  		//populate map with blank tiles
  		$.each(_mapArray, function(i, column) {
  			$.each(column, function(j) {
  				column[j] = {
  					tile: blankTile
  				};

  				//populate map randomly with tiles, if specified
  				if (tile && ft.Utilities.getRandomNum(2) == 1) {
  					column[j] = {
  						tile: tile
  					};
  				}
  			});
  		});
		}

		function _setMapCellProperty(i, j, obj) {
			_mapArray[i][j] = $.extend(_mapArray[i][j], obj);
		}

		function _getFlattenedMap() {
			var _mapArrayClone = _mapArray.slice();
			$.each(_mapArrayClone, function(i, column) {
				column = $.map(column, function(cell, j) {
					return cell.tile;
				});
				_mapArrayClone[i] = column;
  		});

  		return _mapArrayClone;
		}

		//return exposed api
		return {
			getMapArray: _getMapArray,
			init: _init,
			setMapCellProperty: _setMapCellProperty,
			getFlattenedMap: _getFlattenedMap
		};
	})();

	ft.MapGen.SimpleDigger = (function() {
		/**
		 * Represents our "diggers" who procedurally "dig" out our map
		 * @type {Object}
		 */
		var _diggers = null;

		/**
		 * Maximum number of randomly-spawned diggers
		 * @type {Number}
		 */
		var _maxDiggers = null;

		/**
		 * Number of moves remaining for all of the diggers on the board
		 * @type {Number}
		 */
		var _remainingDiggerTicks = null;

		function _init(options, callback) {
			var that = this;

			_diggers = [];
    	_maxDiggers = options.maxDiggers;
    	_remainingDiggerTicks = options.diggerTicks;

  		//render dungeon
      ft.MapGen.Map.init(options.width, options.height, s.tiles.blank);

      //init digger
      this.Digger.init(ft.MapGen.Map, _diggers, {
      	x: options.diggerStartX,
      	y: options.diggerStartY,
      	spawnChance: 0.12,
      	tile: s.tiles.ground
      }, function() {
      	//initial _moveDiggers call starts digger movement
      	_moveDiggers.call(that, {
      		maxX: options.height,
      		maxY: options.width
      	});
      });

      //execute callback, if specified
      if (callback) callback.call(this, ft.MapGen.Map.getFlattenedMap());
		}

		function _moveDiggers(options) {
			var that = this; 

			$.each(_diggers, function(i, digger) {
				that.Digger.move(_diggers[i], s.directions[ft.Utilities.getRandomNum(s.directions.length)], options.maxX, options.maxY);
				that.Digger.draw(ft.MapGen.Map, _diggers[i], s.tiles.ground);
			});

			_remainingDiggerTicks -= 1;

			if (_remainingDiggerTicks > 0) {
				_moveDiggers.call(this, options);
			}
		}

		return {
			init: _init
		};
	})();

	ft.MapGen.SimpleDigger.Digger = (function() {
		function _init(map, diggers, options, callback) {
			_spawn(diggers, {
				x: options.x,
				y: options.y,
				spawnChance: options.spawnChance
			});

			_draw(map, diggers[0], options.tile);

			if (callback) callback.call();
		}

		function _spawn(diggers, options) {
      diggers.push({
      	x: options.x,
      	y: options.y,
      	spawnChance: options.spawnChance
      });
		}

		function _draw(map, digger, tile) {
			map.getMapArray()[digger.x][digger.y].tile = tile;
		}

		function _move(digger, dir, maxX, maxY) {
			switch (dir) {
				case 'u':
					if (digger.x > 0) digger.x -= 1;
					break;
				case 'r':
					if (digger.y < maxY - 1) digger.y += 1;
					break;
				case 'd':
					if (digger.x < maxX - 1) digger.x += 1;
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

	ft.MapGen.CellularAutomata = (function() {
		var _remainingGenerations = null;

		function _init(options, callback) {
			_remainingGenerations = options.generations;

			//randomly populate map
			ft.MapGen.Map.init(options.width, options.height, s.tiles.blank, s.tiles.wall);
			
			//proceed to next generation
			_nextGen();

			//execute callback, if specified
			if (callback) callback.call(this, ft.MapGen.Map.getFlattenedMap());
		}

		function _nextGen(options) {
			//set next state for each cell
			$.each(ft.MapGen.Map.getMapArray(), function(i, column) {
				$.each(column, function(j, cell) {
					//if cell passes the 4-5 rule, it stays/becomes a wall. Otherwise, it stays/becomes blank.
					if ((cell.tile == s.tiles.wall && _getNumAdjacentWithType(i, j, s.tiles.wall) >= 4) || (cell.tile != s.tiles.wall && _getNumAdjacentWithType(i, j, s.tiles.wall) >= 5)) {
						ft.MapGen.Map.setMapCellProperty(i, j, {
							nextTile: s.tiles.wall
						});
					} else {
						ft.MapGen.Map.setMapCellProperty(i, j, {
							nextTile: s.tiles.ground
						});
					}
				});
			});

			//trade out each cell's tile with its stored nextTile
			$.each(ft.MapGen.Map.getMapArray(), function(i, column) {
				$.each(column, function(j, cell) {
					ft.MapGen.Map.setMapCellProperty(i, j, {
						tile: cell.nextTile
					});
					delete cell.nextTile;
				});
			});

			//decrement remaining number of generations to progress through
			_remainingGenerations -= 1;

			//if we still have generations remaining, call the next generation
			if (_remainingGenerations > 0) {
				_nextGen.call(this, options);
			}
		}

		function _getNumAdjacentWithType(x, y, type) {
			var _count = 0;
			var _mapArray = ft.MapGen.Map.getMapArray();
			
			if (_mapArray[x][y-1]) {
				if (_mapArray[x][y-1].tile == type) _count++;
			} else _count++;
			if (_mapArray[x][y+1]) {
				if (_mapArray[x][y+1].tile == type) _count++;
			} else _count++;
			if (_mapArray[x+1]) {
				if (_mapArray[x+1][y-1]) {
					if (_mapArray[x+1][y-1].tile == type) _count++;
				} else _count++;
				if (_mapArray[x+1][y]) {
					if (_mapArray[x+1][y].tile == type) _count++;
				} else _count++
				if (_mapArray[x+1][y+1]) {
					if (_mapArray[x+1][y+1].tile == type) _count++;
				} else _count++;
			} else {
				_count += 3;
			}
			if (_mapArray[x-1]) {
				if (_mapArray[x-1][y+1]) {
					if (_mapArray[x-1][y+1].tile == type) _count++;
				} else _count++;
				if (_mapArray[x-1][y]) {
					if (_mapArray[x-1][y].tile == type) _count++;
				} else _count++
				if (_mapArray[x-1][y-1]) {
					if (_mapArray[x-1][y-1].tile == type) _count++;
				} else _count++
			} else {
				_count +=3;
			}

			return _count;
		}

		return {
			init: _init
		};
	})();

	return ft.MapGen;
});