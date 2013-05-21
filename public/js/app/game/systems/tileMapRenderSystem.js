define([
	"ash/system",
	"app/game/nodes/tileMapRender"
	], function(System, TileMapRenderNode) {
		function TileMapRenderSystem($canvas) {
			Object.extend(TileMapRenderSystem.prototype, System.prototype);
			this.init($canvas);
		}
		var api = TileMapRenderSystem.prototype;
		api.context = null;
		api.nodes = null;
		api.init = function($canvas) {
			this.$canvas = $canvas;
			return this;
		};

		api.addToEngine = function(engine) {
			this.nodes = engine.getNodeList(TileMapRenderNode);
			for(var node = this.nodes.head; node; node = node.next) {
        this.addToDisplay(node);
      }
      this.nodes.nodeAdded.add(this.addToDisplay, this);
      this.nodes.nodeRemoved.add(this.removeFromDisplay, this);

      console.log(this.nodes);
		};

		api.removeFromEngine = function(engine) {
			this.nodes = null;
		};

		api.addToDisplay = function(node) {

		};

		api.removeFromDisplay = function(node) {

		};

		api.update = function(time) {
			var tileMap;

			for(var node = this.nodes.head; node; node = node.next) {
				tileMap = node.tileMap;					

				console.log('made it!');
				console.log(node.tileMap);
			}
		}

		return TileMapRenderSystem;
	}
);