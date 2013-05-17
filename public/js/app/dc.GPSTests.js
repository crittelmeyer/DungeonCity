 /** 
 * @namespace Holds functionality for brickstream applications and libraries
 * @requires  Mustache
 * @requires  jQuery
 */
var dc = dc || {};

define(["jquery", "Mustache", "Modernizr", "jquery.mousewheel", "ft/ft.Utilities"], function($, Mustache, Modernizr) {
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

			_initGoogleMaps();
		}

		function _bindUIActions() {

		}

		function _initGoogleMaps() {
			// ft.Utilities.showLoader(els.$canvas);

		  if (navigator) {
        return navigator.geolocation.getCurrentPosition(function(pos) {
        	var currLatLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);

          var mapOptions = {
				    zoom: 18,
				    center: currLatLng,
				    mapTypeId: google.maps.MapTypeId.TERRAIN
				  };

				  s.map = new google.maps.Map(els.$canvas.get(0), mapOptions);

				  var dungeonIcon = {
						scaledSize: new google.maps.Size(60, 60),
						url: "http://icons.iconarchive.com/icons/3xhumed/mega-games-pack-31/256/Dungeon-Keeper-4-icon.png"
					}

				  var marker = new google.maps.Marker({
  					position: currLatLng,
  					// animation: google.maps.Animation.BOUNCE,
  					map: s.map,
  					icon: dungeonIcon
  				});

  				var infowindow = new google.maps.InfoWindow({
						content:"Hello World!"
					});

  				google.maps.event.addListener(marker, 'click', function() {
						infowindow.open(s.map,marker);
  				});

					// marker.setMap(s.map);

				  // ft.Utilities.hideLoader(els.$canvas);
        });
      } else {
        return 'nope';
      }
		}

		return {
			init: _init
		};
	})();

	return dc.GPSTests;
});