define ([
	"ash/system",
	"app/game/nodes/playerCollision",
	"app/game/nodes/monsterCollision",
  "app/game/nodes/projectileCollision",
  "ft/ft.MapGen"
	], function(System, PlayerCollisionNode, MonsterCollisionNode, ProjectileCollisionNode) {
		function GameManager(gameState, creator) {
			Object.extend(GameManager.prototype, System.prototype);
			this.init(gameState, creator);
		}
		var api = GameManager.prototype;
		api.gameState = null;
		api.creator = null;
		api.players = null;
		api.monsters = null;
		api.projectiles = null;

		api.init = function(gameState, creator) {
			this.gameState = gameState;
			this.creator = creator;

			// var mapGenOptions = {
			// 	generations: 4,
			// 	width: this.gameState.mapWidth,
   //    	height: this.gameState.mapHeight
			// };

			// // ft.MapGen.init("Cellular Automata", mapGenOptions, function(map) {
			// // 	console.log(map.getMapArray());
			// // 	_creator.createTileMap(map.getMapArray());
			// // });
			// var blankTile = '&nbsp;';
			// var tile = '#';
			// var placementChance = 40;

			// var _mapArray = new Array(this.gameState.mapHeight);
			// var that = this;
  	// 	$.each(_mapArray, function(i) {
  	// 		_mapArray[i] = new Array(that.gameState.mapWidth);
  	// 	});

			// $.each(_mapArray, function(i, column) {
  	// 		$.each(column, function(j) {
  	// 			column[j] = {
  	// 				tile: blankTile,
  	// 				x: i,
  	// 				y: j
  	// 			};

  	// 			//populate map randomly with tiles, if specified
  	// 			if (tile && ft.Utilities.getRandomNum(100) < placementChance) {
  	// 				column[j] = {
  	// 					tile: tile,
	  // 					x: i,
	  // 					y: j
  	// 				};
  	// 			}
  	// 		});
  	// 	});
			
			// var m = this.creator.createTileMap(_mapArray);

			return this;
		};

		api.addToEngine = function(engine) {
			this.players = engine.getNodeList(PlayerCollisionNode);
			this.monsters = engine.getNodeList(MonsterCollisionNode);
			this.projectiles = engine.getNodeList(ProjectileCollisionNode);
		};
		api.removeFromEngine = function(engine) {
			this.players = null;
			this.monsters = null;
			this.projectile = null;
		};
		api.update = function(time) {
			if (this.players.empty()) {
				if (this.gameState.lives > 0) {

					this.creator.createPlayer({x: 10, y: 10});
				}
			} else {
				console.log('game over');
				// game over
			}
		};

		return GameManager;
	}
);