 /** 
 * @namespace Holds functionality for brickstream applications and libraries
 * @requires  Mustache
 * @requires  jQuery
 */
var dc = dc || {};

define(["jquery", "Mustache", "Modernizr", "jquery.mousewheel", "ft/ft.Utilities", "ft/ft.UI", "ft/ft.GPS", "ft/ft.Game"], function($, Mustache, Modernizr) {
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
			keys: {
				119: 'N',
				100: 'E',
				115: 'S',
				97: 'W'
			},
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
			$(window).keypress(function(event) {
				ft.Utilities.publish('move.' + s.keys[event.which]);
			});
		}

		function _initGoogleMaps() {
			// ft.Utilities.showLoader(els.$canvas);

		  if (navigator) {
				google.maps.visualRefresh = true;

				var dungeonIcon = {
					scaleSize: new google.maps.Size(60, 60),
					url: 'http://icons.iconarchive.com/icons/3xhumed/mega-games-pack-31/256/Dungeon-Keeper-4-icon.png'
				}

        return navigator.geolocation.getCurrentPosition(function(pos) {
        	var currentLatLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude)
          var mapOptions = {
				    zoom: 25,
				    center: currentLatLng,
				    mapTypeId: google.maps.MapTypeId.TERRAIN
				  };

				  s.map = new google.maps.Map(els.$canvas.get(0), mapOptions);

				  var marker = new google.maps.Marker({
				  	position: currentLatLng,
				  	icon: dungeonIcon
				  });

				  marker.setMap(s.map);

				  ft.UI.getTemplate('dungeonEntrance', function(template) {
				  	var htmlString = Mustache.to_html(template, {
				  		id: '5196c3644806b30680cd2da7',
				  		name: "Boone's Lair"
				  	});

				  	ft.GPS.addInfoWindow(s.map, marker, htmlString, function() {
					  	$('.enter_dungeon').on('click', function() {
					  		var dungeonId = $(this).attr('data-dungeonId');

					  		ft.Utilities.ajaxGet('/dungeon?id=' + dungeonId, function(json) {
					  			ft.Game.init(els.$canvas);
					  		});
					  	});
				  	});
				  });
 
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