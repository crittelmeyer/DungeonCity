/** 
 * @namespace Holds functionality for floating tree applications and libraries
 * @requires  Mustache
 * @requires  jQuery
 */
var ft = ft || {};

define(["jquery", "ft/ft.Utilities", "ft/ft.UI", "ft/ft.Dungeon", "ft/ft.GPS"], function($) {
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

			ft.UI.showLoader(els.$canvas);

			_initMap();
		}

		function _initMap() {
			
		}

		return {
			init: _init
		};
	})();

	return ft.Game;
});