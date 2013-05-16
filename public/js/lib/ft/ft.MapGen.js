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
				ground: ['.', ','],
				wall: '#',
				blank: '&nbsp;'
			},

			/**
			 * array of available movement directions
			 * @type {Array}
			 */
			directions: [],

			allDirections: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
		};

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
			init: _init,
			tiles: _settings.tiles,
			dx: _dx,
			dy: _dy
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
      if (callback) callback.call(this, ft.MapGen.Map);
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
				that.Digger.draw(ft.MapGen.Map, _diggers[i], s.tiles.ground.random());
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

		function _init(options, callback) {
			_remainingGenerations = options.generations;

			//randomly populate map
			ft.MapGen.Map.init(options.width, options.height, s.tiles.blank, s.tiles.wall, 40);
			
			//proceed to next generation
			_nextGen();

			//execute callback, if specified
			if (callback) callback.call(this, ft.MapGen.Map);
		}

		function _nextGen(options) {
			//set next state for each cell
			$.each(ft.MapGen.Map.getMapArray(), function(i, column) {
				$.each(column, function(j, cell) {
					//if cell passes the 5/1 rule or the 2/2 rule, it stays/becomes a wall. Otherwise, it stays/becomes blank.
					ft.MapGen.Map.setMapCellProperty(i, j, { nextTile: _getNumAdjacentWithTile(cell, s.tiles.wall, true) >= 5 || _getNumAdjacentWithTile(cell, s.tiles.wall, true, 2) >= 6 ? s.tiles.wall : s.tiles.ground.random() });
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
						ft.MapGen.Map.setMapCellProperty(i, j, { nextTile: _getNumAdjacentWithTile(cell, s.tiles.wall, true) >= 5 ? s.tiles.wall : s.tiles.ground.random() });
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

			$.each(s.allDirections, function(i, dir) {
				if (_locationExists(_mapArray, _getNeighborCell(_mapArray, cell, dir, steps))) {
					if (_getNeighborCell(_mapArray, cell, dir, steps).tile == tile) _count++;
				} else {
					_count++;
				}
			});

			return _count;
		}

		function _locationExists(mapArray, coords) {
			return mapArray[coords.x] && mapArray[coords.x][coords.y];
		}

		function _getNeighborCell(mapArray, cell, dir, steps) {
			var offsetX = 0, offsetY = 0;
			$.each(dir.split(''), function(i, character) {
				offsetX += (ft.MapGen.dx[character] * steps);
				offsetY += (ft.MapGen.dy[character] * steps);
			});

			if (mapArray[cell.x + offsetX] && mapArray[cell.x + offsetX][cell.y + offsetY]) return mapArray[cell.x + offsetX][cell.y + offsetY];
			else return { x: cell.x + offsetX, y: cell.y + offsetY };
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

	ft.MapGen.Uniform = (function() {
		function _init(options, callback) {
			var player1 = ft.Entity.Player.init(0, 1);
			var player2 = ft.Entity.Player.init(2, 3);
			console.log(player1);
			console.log(player2);
		}

		return {
			init: _init
		};
	})();


// RPG.Generators.Uniform.prototype.init = function() {
// 	this.parent();
	
// 	this._roomAttempts = 10; /* new room is created N-times until is considered as impossible to generate */
// 	this._corridorAttempts = 50; /* corridors are tried N-times until the level is considered as impossible to connect */
// 	this._roomPercentage = 0.1; /* we stop createing rooms after this percentage of level area has been dug out */
// 	this._minSize = 3; /* minimum room dimension */
// 	this._maxWidth = 9; /* maximum room width */
// 	this._maxHeight = 5; /* maximum room height */
	
// 	this._connected = []; /* list of already connected rooms */
// 	this._unconnected = []; /* list of remaining unconnected rooms */
// }

// RPG.Generators.Uniform.prototype.generate = function(id, size, danger, options) {
// 	this.parent(id, size, danger, options);

// 	while (1) {
// 		this._blankMap();
// 		this._unconnected = [];
// 		this._generateRooms();
// 		var result = this._generateCorridors();
// 		if (result) { return this._convertToMap(id, danger); }
// 	}
// }

// RPG.Generators.Uniform.prototype._digRoom = function(c1, c2) {
// 	var room = this.parent(c1, c2);
// 	this._unconnected.push(room);
// }

// /**
//  * Generates a suitable amount of rooms
//  */
// RPG.Generators.Uniform.prototype._generateRooms = function() {
// 	var w = this._size.x-2;
// 	var h = this._size.y-2;

// 	do {
// 		var result = this._generateRoom();
// 		if (this._dug/(w*h) > this._roomPercentage) { break; } /* achieved requested amount of free space */
// 	} while (result);
	
// 	/* either enough rooms, or not able to generate more of them :) */
// }

// /**
//  * Try to generate one room
//  */
// RPG.Generators.Uniform.prototype._generateRoom = function() {
// 	var count = 0;
// 	while (count < this._roomAttempts) {
// 		count++;
		
// 		/* generate corner */
// 		var corner1 = this._generateCoords(this._minSize);
		
// 		/* generate second corner */
// 		var corner2 = this._generateSecondCorner(corner1, this._minSize, this._maxWidth, this._maxHeight);
		
// 		/* enlarge for fitting */
// 		corner1.x--;
// 		corner1.y--;
// 		corner2.x++;
// 		corner2.y++;
		
// 		/* if not good, skip to next attempt */
// 		if (!this._freeSpace(corner1, corner2)) { continue; }
		
// 		/* shrink */
// 		corner1.x++;
// 		corner1.y++;
// 		corner2.x--;
// 		corner2.y--;
// 		this._digRoom(corner1, corner2);
// 		return true;
// 	} 

// 	/* no room was generated in a given number of attempts */
// 	return false;
// }

// /**
//  * Generates connectors beween rooms
//  * @returns {bool} success Was this attempt successfull?
//  */
// RPG.Generators.Uniform.prototype._generateCorridors = function() {
// 	var cnt = 0;
// 	this._connected = [];
// 	if (this._unconnected.length) { this._connected.push(this._unconnected.pop()); }
		
// 	while (this._unconnected.length) {
// 		cnt++;
// 		if (cnt > this._corridorAttempts) { return false; } /* no success */
		
// 		var room1 = this._unconnected[0]; /* start with the first unconnected */
// 		var center = room1.getCenter();
// 		this._connected.sort(function(a,b){ /* find closest connected */
// 			return a.getCenter().distance(center) - b.getCenter().distance(center);
// 		});
// 		var room2 = this._connected[0];

// 		this._connectRooms(room1, room2); /* connect these two */
// 	};
	
// 	return true;
// }

// RPG.Generators.Uniform.prototype._connectRooms = function(room1, room2) {
// 	var center1 = room1.getCenter();
// 	var center2 = room2.getCenter();

// 	var diffX = center2.x - center1.x;
// 	var diffY = center2.y - center1.y;
// 	var prop = "";

// 	if (Math.abs(diffX) < Math.abs(diffY)) { /* first try connecting north-south walls */
// 		var wall1 = (diffY > 0 ? RPG.S : RPG.N);
// 		var wall2 = (wall1 + 4) % 8;
// 		prop = "x";
// 	} else { /* first try connecting east-west walls */
// 		var wall1 = (diffX > 0 ? RPG.E : RPG.W);
// 		var wall2 = (wall1 + 4) % 8;
// 		prop = "y";
// 	}

// 	var minorProp = (prop == "x" ? "y" : "x");
// 	var min = room2.getCorner1()[prop];
// 	var max = room2.getCorner2()[prop];	
// 	var start = this._placeInWall(room1, wall1); /* corridor will start here */
// 	if (!start) { return; }

// 	if (start[prop] >= min && start[prop] <= max) { /* possible to connect with straight line */

// 		var corner = (wall2 == RPG.N || wall2 == RPG.W ? room2.getCorner1() : room2.getCorner2());
// 		var x = (prop == "x" ? start[prop] : corner.x);
// 		var y = (prop == "y" ? start[prop] : corner.y);
// 		var end = new RPG.Misc.Coords(x, y);
// 		return this._digLine([start, end]);
		
// 	} else if (start[prop] < min-1 || start[prop] > max+1) { /* need to switch target wall (L-like) */
		
// 		var diff = start[prop] - center2[prop];
// 		switch (wall2) {
// 			case RPG.N:
// 			case RPG.E:	var rotation = (diff < 0 ? 6 : 2); break;
// 			break;
// 			case RPG.S:
// 			case RPG.W:	var rotation = (diff < 0 ? 2 : 6); break;
// 			break;
// 		}
// 		wall2 = (wall2 + rotation) % 8;
		
// 		var end = this._placeInWall(room2, wall2);
// 		if (!end) { return; }
// 		var mid = new RPG.Misc.Coords(0, 0);
// 		mid[prop] = start[prop];
// 		mid[minorProp] = end[minorProp];
// 		return this._digLine([start, mid, end]);
		
// 	} else { /* use current wall pair, but adjust the line in the middle (snake-like) */
	
// 		var end = this._placeInWall(room2, wall2);
// 		if (!end) { return; }
// 		var mid = Math.round((end[minorProp] + start[minorProp])/2);

// 		var mid1 = new RPG.Misc.Coords(0, 0);
// 		var mid2 = new RPG.Misc.Coords(0, 0);
// 		mid1[prop] = start[prop];
// 		mid1[minorProp] = mid;
// 		mid2[prop] = end[prop];
// 		mid2[minorProp] = mid;
// 		return this._digLine([start, mid1, mid2, end]);

// 	}
// }

// RPG.Generators.Uniform.prototype._placeInWall = function(room, wall) {
// 	var prop = "";
// 	var c1 = room.getCorner1();
// 	var c2 = room.getCorner2();
// 	var x = 0;
// 	var y = 0;
// 	switch (wall) {
// 		case RPG.N:
// 			y = c1.y-1;
// 			x = c1.x + Math.floor(Math.random() * (c2.x-c1.x));
// 			prop = "x";
// 		break;
// 		case RPG.S:
// 			y = c2.y+1;
// 			x = c1.x + Math.floor(Math.random() * (c2.x-c1.x));
// 			prop = "x";
// 		break;
// 		case RPG.W:
// 			x = c1.x-1;
// 			y = c1.y + Math.floor(Math.random() * (c2.y-c1.y));
// 			prop = "y";
// 		break;
// 		case RPG.E:
// 			x = c2.x+1;
// 			y = c1.y + Math.floor(Math.random() * (c2.y-c1.y));
// 			prop = "y";
// 		break;
// 	}
	
// 	var result = new RPG.Misc.Coords(x, y);
// 	/* check if neighbors are not empty */
// 	result[prop] -= 1;
// 	if (this._isValid(result) && !this._boolArray[result.x][result.y]) { return null; }
// 	result[prop] += 2;
// 	if (this._isValid(result) && !this._boolArray[result.x][result.y]) { return null; }
// 	result[prop] -= 1;

// 	return result; 
	
// }

// /**
//  * Try to dig a polyline. Stop if it crosses any room more than two times.
//  */
// RPG.Generators.Uniform.prototype._digLine = function(points) {
// 	var todo = [];
// 	var rooms = []; /* rooms crossed with this line */
	
// 	var check = function(coords) {
// 		todo.push(coords.clone());
// 		rooms = rooms.concat(this._roomsWithWall(coords));
// 	}
	
// 	/* compute and check all coords on this polyline */
// 	var current = points.shift();
// 	while (points.length) {
// 		var target = points.shift();
// 		var diffX = target.x - current.x;
// 		var diffY = target.y - current.y;
// 		var length = Math.max(Math.abs(diffX), Math.abs(diffY));
// 		var stepX = Math.round(diffX / length);
// 		var stepY = Math.round(diffY / length);
// 		for (var i=0;i<length;i++) {
// 			check.call(this, current);
// 			current.x += stepX;
// 			current.y += stepY;
// 		}
// 	}
// 	check.call(this, current);
	
// 	/* any room violated? */
// 	var connected = [];
// 	while (rooms.length) {
// 		var room = rooms.pop();
// 		connected.push(room);
// 		var count = 1;
// 		for (var i=rooms.length-1; i>=0; i--) {
// 			if (rooms[i] == room) {
// 				rooms.splice(i, 1);
// 				count++;
// 			}
// 		}
// 		if (count > 2) { return; } /* room crossed too many times */
// 	}
	
// 	/* mark encountered rooms as connected */
// 	while (connected.length) {
// 		var room = connected.pop();
// 		var index = this._unconnected.indexOf(room);
// 		if (index != -1) { 
// 			this._unconnected.splice(index, 1);
// 			this._connected.push(room);
// 		}
// 	}
	
// 	while (todo.length) { /* do actual digging */
// 		var coords = todo.pop();
// 		this._boolArray[coords.x][coords.y] = false;
// 	}
// }

// /**
//  * Returns a list of rooms which have this wall
//  */
// RPG.Generators.Uniform.prototype._roomsWithWall = function(coords) {
// 	var result = [];
// 	for (var i=0;i<this._rooms.length;i++) {
// 		var room = this._rooms[i];
// 		var ok = false;
// 		var c1 = room.getCorner1();
// 		var c2 = room.getCorner2();
		
// 		if ( /* one of vertical walls */
// 			(coords.x+1 == c1.x || coords.x-1 == c2.x) 
// 			&& coords.y+1 >= c1.y 
// 			&& coords.y-1 <= c2.y
// 		) { ok = true; }
		
// 		if ( /* one of horizontal walls */
// 			(coords.y+1 == c1.y || coords.y-1 == c2.y) 
// 			&& coords.x+1 >= c1.x 
// 			&& coords.x-1 <= c2.x
// 		) { ok = true; }

// 		if (ok) { result.push(room); }		
// 	}
// 	return result;
// }





// RPG.Generators.BaseGenerator.prototype.init = function() {
// 	this._defOptions = {
// 		ctor: RPG.Map.Dungeon
// 	}
// 	this._size = null;

// 	/* there are initialized by _blankMap */
// 	this._dug = 0;
// 	this._boolArray = null;
// 	this._rooms = [];
// }

// RPG.Generators.BaseGenerator.prototype.generate = function(id, size, danger, options) {
// 	this._options = {};
// 	for (var p in this._defOptions) { this._options[p] = this._defOptions[p]; }
// 	for (var p in options) { this._options[p] = options[p]; }

// 	this._size = size;
// 	this._blankMap();
// }

// RPG.Generators.BaseGenerator.prototype._convertToMap = function(id, danger) {
// 	var map = new this._options.ctor(id, this._size, danger);
// 	map.fromBoolArray(this._boolArray);
	
// 	while (this._rooms.length) { map.addRoom(this._rooms.shift()); }
// 	this._boolArray = null;
// 	return map;
// }

// RPG.Generators.BaseGenerator.prototype._isValid = function(coords) {
// 	if (coords.x < 0 || coords.y < 0) { return false; }
// 	if (coords.x >= this._size.x || coords.y >= this._size.y) { return false; }
// 	return true;
// }

// /**
//  * Return number of free neighbors
//  */
// RPG.Generators.BaseGenerator.prototype._freeNeighbors = function(center) {
// 	var result = 0;
// 	for (var i=-1;i<=1;i++) {
// 		for (var j=-1;j<=1;j++) {
// 			if (!i && !j) { continue; }
// 			var coords = new RPG.Misc.Coords(i, j).plus(center);
// 			if (!this._isValid(coords)) { continue; }
// 			if (!this._boolArray[coords.x][coords.y]) { result++; }
// 		}
// 	}
// 	return result;
// }

// RPG.Generators.BaseGenerator.prototype._blankMap = function() {
// 	this._rooms = [];
// 	this._boolArray = [];
// 	this._dug = 0;
	
// 	for (var i=0;i<this._size.x;i++) {
// 		this._boolArray.push([]);
// 		for (var j=0;j<this._size.y;j++) { this._boolArray[i].push(true); }
// 	}
// }

// RPG.Generators.BaseGenerator.prototype._digRoom = function(corner1, corner2) {
// 	var room = new RPG.Areas.Room(corner1, corner2);
// 	this._rooms.push(room);
	
// 	for (var i=corner1.x;i<=corner2.x;i++) {
// 		for (var j=corner1.y;j<=corner2.y;j++) {
// 			this._boolArray[i][j] = false;
// 		}
// 	}
	
// 	this._dug += (corner2.x-corner1.x) * (corner2.y-corner1.y);
// 	return room;
// }

// /**
//  * Randomly picked coords. Can represent top-left corner of a room minSize*minSize
//  * @param {int} minSize
//  */
// RPG.Generators.BaseGenerator.prototype._generateCoords = function(minSize) {
// 	var padding = 2 + minSize - 1;
// 	var x = Math.floor(Math.random()*(this._size.x-padding)) + 1;
// 	var y = Math.floor(Math.random()*(this._size.y-padding)) + 1;
// 	return new RPG.Misc.Coords(x, y);
// }

// /**
//  * Randomly picked bottom-right corner
//  * @param {RPG.Misc.Coords} corner top-left corner
//  * @param {int} minSize
//  * @param {int} maxWidth
//  * @param {int} maxHeight
//  */
// RPG.Generators.BaseGenerator.prototype._generateSecondCorner = function(corner, minSize, maxWidth, maxHeight) {
// 	var availX = this._size.x - corner.x - minSize;
// 	var availY = this._size.y - corner.y - minSize;
	
// 	availX = Math.min(availX, maxWidth - minSize + 1);
// 	availY = Math.min(availY, maxHeight - minSize + 1);
	
// 	var width = Math.floor(Math.random()*availX) + minSize;
// 	var height = Math.floor(Math.random()*availY) + minSize;
// 	return new RPG.Misc.Coords(corner.x + width - 1, corner.y + height - 1);
// }

// /**
//  * Can a given rectangle fit in a map?
//  */
// RPG.Generators.BaseGenerator.prototype._freeSpace = function(corner1, corner2) {
// 	var c = new RPG.Misc.Coords(0, 0);
// 	for (var i=corner1.x; i<=corner2.x; i++) {
// 		for (var j=corner1.y; j<=corner2.y; j++) {
// 			c.x = i;
// 			c.y = j;
// 			if (!this._isValid(c)) { return false; }
// 			if (!this._boolArray[i][j]) { return false; }
// 		}
// 	}
// 	return true;
// }




	return ft.MapGen;
});