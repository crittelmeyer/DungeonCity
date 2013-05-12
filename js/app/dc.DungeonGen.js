/** 
 * @namespace Holds functionality for brickstream applications and libraries
 * @requires  Mustache
 * @requires  jQuery
 */
var dc = dc || {};


define(["jquery", "Mustache"], function($, Mustache) {
	var s;

	/**
	 * Holds all of our dungeon generation code & returns the exposed public API
	 * 
	 * @return {Object}
	 *
	 * @author  Chris & John Rittelmeyer
	 */
	dc.DungeonGen = (function() {
		//other settings or important information such as counts, URLs, Paths, etc..
		var _settings = {
			/**
			 * Array storing our world map
			 * @type {Array}
			 */
			worldMap: [],

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
			 * array of available movement directions
			 * @type {Array}
			 */
			directions: ['u', 'r', 'd', 'l'],

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
      _initMap();

      //init digger
      _initDigger();

      //draw map after final modifications to worldMap array
      _drawMap();
		}

		function _initMap() {
  		//declare and allocate space for world map
  		s.worldMap = new Array(s.mapHeight);
  		$.each(s.worldMap, function(i) {
  			s.worldMap[i] = new Array(s.mapWidth);
  		});

  		//populate map with blank tiles
  		$.each(s.worldMap, function(i, column) {
  			$.each(column, function(o) {
  				column[o] = (s.tiles.blank);
  			});
  		});
		}

		function _initDigger() {
			_spawnDigger(Math.floor(s.mapHeight / 2), Math.floor(s.mapWidth / 2));

			_drawDigger(s.diggers[0]);

			_moveDiggers();
		}

		function _spawnDigger(x, y) {
      s.diggers.push({
      	x: x,
      	y: y
      });
		}

		function _moveDiggers() {
			$.each(s.diggers, function(i, digger) {

				_moveDigger(s.diggers[i], s.directions[Math.floor(Math.random() * s.directions.length)]);
				_drawDigger(s.diggers[i]);
			});

			s.remainingDiggerTicks -= 1;

			if (s.remainingDiggerTicks > 0) {
				_moveDiggers();
			}
		}

		function _drawDigger(digger) {
			s.worldMap[digger.x][digger.y] = s.tiles.ground;
		}

		function _moveDigger(digger, dir) {
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

		function _drawMap() {
			//clear canvas
			s.elems.$canvas.empty();

			//redraw map from worldMap array
			$.each(s.worldMap, function(i, column) {
				s.elems.$canvas.append(column.join("") + '<br>');
			});
		}

		//expose our public api
		return {
			init: _init
		};
	})();

	return dc.DungeonGen;
});