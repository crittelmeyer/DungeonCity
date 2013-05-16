/** 
 * @namespace Holds functionality for brickstream applications and libraries
 * @requires  Mustache
 * @requires  jQuery
 */
var dc = dc || {};

define(["jquery", "Mustache", "jquery.mousewheel", "ft/ft.Utilities"], function($, Mustache) {
	var s, els;

	/**
	 * Holds all of our dungeon generation code & returns the exposed public API
	 * 
	 * @return {Object}
	 *
	 * @author  Chris & John Rittelmeyer
	 */
	dc.GPSTests = (function() {
		//other settings or important information such as counts, URLs, Paths, etc..
		var _settings = {
			map: null,
			elems: {
				$canvas: $('#canvas')
			}
		};

		function _init() {
			s = _settings, els = s.elems;

			_bindUIActions();

			google.maps.Load();

			// _initGoogleMaps();

			// google.maps.event.addDomListener(window, 'load', _initGoogleMaps);


		}

		function _bindUIActions() {

		}

		function _initGoogleMaps() {
		  var mapOptions = {
		    zoom: 8,
		    center: new google.maps.LatLng(-34.397, 150.644),
		    mapTypeId: google.maps.MapTypeId.ROADMAP
		  };
		  s.map = new google.maps.Map(els.$canvas, mapOptions);
		}

		return {
			init: _init
		};
	})();

	return dc.GPSTests;
});