/** 
 * @namespace Holds functionality for floating tree applications and libraries
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
			directions: []
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
		function _init(width, height, blankTile, tile, placementChance) {
  		//declare and allocate space for map
  		_mapArray = new Array(height);
  		$.each(_mapArray, function(i) {
  			_mapArray[i] = new Array(width);
  		});

  		//populate map with blank tiles
  		$.each(_mapArray, function(i, column) {
  			$.each(column, function(j) {
  				column[j] = {
  					tile: blankTile,
  					x: i,
  					y: j
  				};

  				//populate map randomly with tiles, if specified
  				if (tile && ft.Utilities.getRandomNum(100) < placementChance) {
  					column[j] = {
  						tile: tile,
	  					x: i,
	  					y: j
  					};
  				}
  			});
  		});
		}

		function _setMapCellProperty(x, y, obj) {
			_mapArray[x][y] = $.extend(_mapArray[x][y], obj);
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
    	_remainingDiggerTicks = options.diggerTicks;

  		//render dungeon
      ft.MapGen.Map.init(options.width, options.height, s.tiles.blank);

      //init digger
      this.Digger.init(ft.MapGen.Map, _diggers, {
      	x: options.diggerStartX,
      	y: options.diggerStartY,
      	tile: s.tiles.ground
      }, function() {
      	//initial _moveDiggers call starts digger movement
      	_moveDiggers.call(that, {
      		maxX: options.height,
      		maxY: options.width,
      		maxDiggers: options.maxDiggers,
      		spawnChance: options.spawnChance,
      		tendency: options.tendency
      	});
      });

      //execute callback, if specified
      if (callback) callback.call(this, ft.MapGen.Map.getFlattenedMap());
		}

		function _moveDiggers(options) {
			var that = this; 

			//move & draw each digger
			$.each(_diggers, function(i, digger) {
				//roll dice to spawn new digger
				if (_diggers.length < options.maxDiggers && ft.Utilities.getRandomNum(100) < options.spawnChance) {
					that.Digger.spawn(_diggers, {
						x: digger.x,
						y: digger.y
					});
				}

				
				switch (options.tendency) {
					case 'Random':
						s.directions = [{dir: 'N', weight: 25}, {dir: 'E', weight: 25}, {dir: 'S', weight: 25}, {dir: 'W', weight: 25}];
						break;
					case 'NE':
						s.directions = [{dir: 'N', weight: 45}, {dir: 'E', weight: 45}, {dir: 'S', weight: 5}, {dir: 'W', weight: 5}];
						break;
					case 'SE':
						s.directions = [{dir: 'N', weight: 5}, {dir: 'E', weight: 45}, {dir: 'S', weight: 45}, {dir: 'W', weight: 5}];
						break;
					case 'SW':
						s.directions = [{dir: 'N', weight: 5}, {dir: 'E', weight: 5}, {dir: 'S', weight: 45}, {dir: 'W', weight: 45}];
						break;
					case 'NW':
						s.directions = [{dir: 'N', weight: 45}, {dir: 'E', weight: 5}, {dir: 'S', weight: 5}, {dir: 'W', weight: 45}];
						break;
					case 'Same Direction':
						s.directions = [{dir: 'N', weight: 5}, {dir: 'E', weight: 5}, {dir: 'S', weight: 5}, {dir: 'W', weight: 5}];

						if (digger.lastMove) {
							//increase weight of last move to 85
							$.each(s.directions, function(i, obj) {
								if (obj.dir == digger.lastMove) obj.weight = 85;
							});
						}
						break;
				}
				var maxRand = ft.Utilities.sumObjectValues(s.directions);
				var rand = ft.Utilities.getRandomNum(maxRand);
				var direction = _getDirection(s.directions, rand);

				that.Digger.move(_diggers[i], direction, options.maxX, options.maxY);
				that.Digger.draw(ft.MapGen.Map, _diggers[i], s.tiles.ground);
			});

			_remainingDiggerTicks -= 1;

			if (_remainingDiggerTicks > 0) {
				_moveDiggers.call(this, options);
			}
		}

		function _getDirection(weightedObjects, target) {
			var direction, min = 0;
			$.each(weightedObjects, function(i, obj) {
				if (target >= min && target < (obj.weight + min)) {
					direction = obj.dir;
					return false;
				} else min += obj.weight;
			});

			return direction;
		}

		return {
			init: _init
		};
	})();

	ft.MapGen.SimpleDigger.Digger = (function() {
		function _init(map, diggers, options, callback) {
			_spawn(diggers, {
				x: options.x,
				y: options.y
			});

			_draw(map, diggers[0], options.tile);

			if (callback) callback.call();
		}

		function _spawn(diggers, options) {
      diggers.push({
      	x: options.x,
      	y: options.y
      });
		}

		function _draw(map, digger, tile) {
			map.getMapArray()[digger.x][digger.y].tile = tile;
		}

		function _move(digger, dir, maxX, maxY) {
			switch (dir) {
				case 'N':
					if (digger.x > 0) digger.x -= 1;
					break;
				case 'E':
					if (digger.y < maxY - 1) digger.y += 1;
					break;
				case 'S':
					if (digger.x < maxX - 1) digger.x += 1;
					break;
				case 'W':
					if (digger.y > 0) digger.y -= 1;
					break;
			}

			//store last move
			digger.lastMove = dir;
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
		
		var _dx = {
			'N': 0,
			'E': 1,
			'S': 0,
			'W': -1
		};

		var _dy = {
			'N': -1,
			'E': 0,
			'S': 1,
			'W': 0
		};

		function _init(options, callback) {
			_remainingGenerations = options.generations;

			//randomly populate map
			ft.MapGen.Map.init(options.width, options.height, s.tiles.blank, s.tiles.wall, 40);
			
			//proceed to next generation
			_nextGen();

			//execute callback, if specified
			if (callback) callback.call(this, ft.MapGen.Map.getFlattenedMap());
		}

		function _nextGen(options) {
			//set next state for each cell
			$.each(ft.MapGen.Map.getMapArray(), function(i, column) {
				$.each(column, function(j, cell) {
					//if cell passes the 5/1 rule or the 2/2 rule, it stays/becomes a wall. Otherwise, it stays/becomes blank.
					ft.MapGen.Map.setMapCellProperty(i, j, { nextTile: _getNumAdjacentWithTile(cell, s.tiles.wall, true) >= 5 || _getNumAdjacentWithTile(cell, s.tiles.wall, true, 2) >= 6 ? s.tiles.wall : s.tiles.ground });
				});
			});

			//trade out each cell's tile with its stored nextTile
			_swapOutTile();

			//repeat tile swap with slight rule change
			if (_remainingGenerations > 1) {
				//set next state for each cell
				$.each(ft.MapGen.Map.getMapArray(), function(i, column) {
					$.each(column, function(j, cell) {
						//if cell passes the 5/1 rule, it stays/becomes a wall. Otherwise, it stays/becomes blank.
						ft.MapGen.Map.setMapCellProperty(i, j, { nextTile: _getNumAdjacentWithTile(cell, s.tiles.wall, true) >= 5 ? s.tiles.wall : s.tiles.ground });
					});
				});

				//trade out each cell's tile with its stored nextTile
				_swapOutTile();
			}

			//decrement remaining number of generations to progress through
			_remainingGenerations -= 1;

			//if we still have generations remaining, call the next generation
			if (_remainingGenerations > 0) {
				_nextGen.call(this, options);
			}
		}

		function _getNumAdjacentWithTile(cell, tile, includeOrigin, steps) {
			if (!steps) steps = 1;
			var _count = 0;
			var _mapArray = ft.MapGen.Map.getMapArray();
			
			if (includeOrigin && cell.tile == tile) _count++;

			// console.log('checking location exists north of ' + cell.x + ',' + cell.y);
			// if (_locationExists(_mapArray, _getNeighborCell(_mapArray, cell, 'N', steps))) {
			// 	console.log('does exist');
			// 	console.log(_getNeighborCell(cell, 'N', steps));
			// 	if (_getNeighborCell(cell, 'N', steps).tile == tile) _count++;
			// } else {
			// 	console.log('doesnt exist');
			// 	_count++;
			// }
			
			if (_mapArray[cell.x][cell.y-steps]) {
				if (_mapArray[cell.x][cell.y-steps].tile == tile) _count++;
			} else _count++;
			if (_mapArray[cell.x][cell.y+steps]) {
				if (_mapArray[cell.x][cell.y+steps].tile == tile) _count++;
			} else _count++;
			if (_mapArray[cell.x+steps]) {
				if (_mapArray[cell.x+steps][cell.y-steps]) {
					if (_mapArray[cell.x+steps][cell.y-steps].tile == tile) _count++;
				} else _count++;
				if (_mapArray[cell.x+steps][cell.y]) {
					if (_mapArray[cell.x+steps][cell.y].tile == tile) _count++;
				} else _count++
				if (_mapArray[cell.x+steps][cell.y+steps]) {
					if (_mapArray[cell.x+steps][cell.y+steps].tile == tile) _count++;
				} else _count++;
			} else {
				_count += 3;
			}
			if (_mapArray[cell.x-steps]) {
				if (_mapArray[cell.x-steps][cell.y+steps]) {
					if (_mapArray[cell.x-steps][cell.y+steps].tile == tile) _count++;
				} else _count++;
				if (_mapArray[cell.x-steps][cell.y]) {
					if (_mapArray[cell.x-steps][cell.y].tile == tile) _count++;
				} else _count++;
				if (_mapArray[cell.x-steps][cell.y-steps]) {
					if (_mapArray[cell.x-steps][cell.y-steps].tile == tile) _count++;
				} else _count++;
			} else {
				_count +=3;
			}

			return _count;
		}

		function _locationExists(mapArray, coords) {
			return mapArray[coords.x] && mapArray[coords.x][coords.y];
		}

		function _getNeighborCell(mapArray, cell, dir, steps) {
			var offsetX = 0, offsetY = 0;
			$.each(dir.split(''), function(i, character) {
				offsetY += (_dx[dir] * steps);
				offsetX += (_dy[dir] * steps);
			});

			console.log(dir + ' offsetX is ' + offsetX + ' and offsetY is ' + offsetY);

			if (mapArray[cell.x += offsetX] && mapArray[cell.x += offsetX][cell.y += offsetY]) return mapArray[cell.x += offsetX][cell.y += offsetY];
			else return { x: cell.x += offsetX, y: cell.y += offsetY };
		}

		function _swapOutTile() {
			$.each(ft.MapGen.Map.getMapArray(), function(i, column) {
				$.each(column, function(j, cell) {
					ft.MapGen.Map.setMapCellProperty(i, j, { tile: cell.nextTile });
					delete cell.nextTile;
				});
			});
		}

		return {
			init: _init
		};
	})();

	return ft.MapGen;
});