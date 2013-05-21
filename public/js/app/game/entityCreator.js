define([
	"ash/entity",
	"app/game/components/tileMap"
	], function(
		Entity,
		TileMap
	) {
		var EntityCreator = (function() {
			var _game = null, _graphics = null;

			function _init(game, graphics) {
				_game = game;
				_graphics = graphics;
			}

			function _destroyEntity(entity) {
				_game.removeEntity(entity);
			}

			function _createTileMap(array, mappingObj) {
				var tileMap = new Entity()
					.add(new TileMap(array));
				_game.addEntity(tileMap);
					
				return tileMap;
			}

			function _createPlayer(position) {
        var player = new Entity()
            .add(new Player())
            .add(new Position(position.position.x + 25, position.position.y-20))
            .add(new Bounds(400, 300, 5, 15))
            .add(new Motion(0, 15, 0.99))
            .add(new JumpMotion(0, 3500, 140))
            .add(new MotionControls(Keyboard.LEFT, Keyboard.RIGHT, Keyboard.SPACEBAR, -5000, 100))
            .add(new Display(new PlayerView(this.graphics)));
        this.game.addEntity(player);
        return player;
	    };

			_constr = function(game, graphics) {
				_init(game, graphics);
			}
      _constr.prototype = {
        constructor: EntityCreator,
        destroyEntity: _destroyEntity,
        createTileMap: _createTileMap
      }
      return _constr;
		})();

		return EntityCreator;
	}
);