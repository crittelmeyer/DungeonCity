define([
	"ash/entity",
	"app/game/components/tileMap",
	"app/game/components/player",
	"app/game/components/position"
	], function(
		Entity,
		TileMap,
		Player,
		Position
	) {
		
		var EntityCreator = function(game, $canvas) {
			this.init(game, $canvas);
		}
		var api = EntityCreator.prototype;
		api.game = null;
		api.$canvas = null;
		api.init = function(game, $canvas) {
			this.game = game;
			this.$canvas = $canvas;
			return this;
		};

		api.destroyEntity = function(entity) {
			this.game.removeEntity(entity);
		}

		api.createTileMap = function(array, mappingObj) {
			var tileMap = new Entity()
				.add(new TileMap(array));
			// console.log(tileMap);
			console.log('add tilemap entity to game');
			this.game.addEntity(tileMap);
				
			return tileMap;
		}

		api.createPlayer = function(position) {
      var player = new Entity()
          .add(new Player())
          .add(new Position(position.x, position.y));
          //.add(new Display(new PlayerView(this.graphics)));
      console.log('add player entity to game');
      console.log(player);
      this.game.addEntity(player);
      return player;
    };

		return EntityCreator;
	}
);