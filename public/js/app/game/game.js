define([
  "app/game/components/gamestate",
  "app/game/systems/gamemanager",
  // "app/game/systems/motioncontrolsystem",
  // "app/game/systems/movementsystem",
  // "app/game/systems/collisionsystem",
  "app/game/systems/tileMapRenderSystem",
  "app/game/systems/systemPriorities",
  "app/game/entityCreator",
  "ash/engine",
  "ash/system",
  "signals",
  // "dictionary",
  "tickprovider"//,
  // "brejep/keypoll"
  ],
  function(
    GameState,
    GameManager,
    // MotionControlSystem,
    // MovementSystem,
    // CollisionSystem,
    TileMapRenderSystem,
    SystemPriorities,
    EntityCreator,
    Engine,
    System,
    Signal,
    // Dictionary,
    TickProvider//,
    // KeyPoll
  ) {
    var Game = (function() {
      var _width = 0, _height = 0;
      var _engine = null, _gameState = null, _tickProvider = null;

      function _init($mapWrapper) {
        _width = $mapWrapper.width();
        _height = $mapWrapper.height();

        _engine = new Engine();
        _gameState = new GameState(_width, _height);

        var creator = new EntityCreator(_engine, $mapWrapper);

        _engine.addSystem(
          new GameManager(_gameState, creator),
          SystemPriorities.update
        );

        _engine.addSystem(
          new TileMapRenderSystem($mapWrapper),
          SystemPriorities.render
        );

        // _tickProvider = new TickProvider();
      }

      function _start() {
        _engine.update();
        // _tickProvider.add(_engine.update, _engine);
        // _tickProvider.start();
      }

      var _constr = function() {}
      _constr.prototype = {
        constructor: Game,
        init: _init,
        start: _start
      }

      return _constr;
    })();

    return Game;
  }
);