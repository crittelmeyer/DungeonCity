/** 
 * @namespace Holds functionality for brickstream applications and libraries
 * @requires  Mustache
 * @requires  jQuery
 */
var dc = dc || {};

define(["fillsnfixes", "app/game/game"], function(Fixes, Game) {
	var s, els;

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
			canvasWidth: 120,
			canvasHeight: 30,
			elems: {
				$game_wrapper: $('#game_wrapper')
			}
		};

		function _init() {
			s = _settings, els = s.elems;

			Fixes.init();

			_bindUIActions();

			var $gmap_wrapper = $('<div id="gmap_wrapper" style="width: ' + s.canvasWidth + '; height:' + s.canvasHeight + ';"></div>');
			els.$game_wrapper.append($gmap_wrapper);

			// var $canvas = $('<canvas id="canvas" width="' + s.canvasWidth + '" height="' + s.canvasHeight + '"></canvas>');

			
			var dungeonCity = new Game();
			dungeonCity.init($gmap_wrapper);
			dungeonCity.start();
		}

		function _bindUIActions() {
			
		}

		return {
			init: _init
		}
	})();

	return dc.DungeonCity;
});