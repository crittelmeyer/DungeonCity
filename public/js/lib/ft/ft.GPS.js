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
	ft.GPS = (function() {
		//other settings or important information such as counts, URLs, Paths, etc..
		var _settings = {
		}

		function _init() {

		}

		return {
			init: _init
		};
	})();

	return ft.GPS;
});