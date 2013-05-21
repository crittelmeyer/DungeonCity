define([
	"ash/system",
	"app/game/nodes/tileMapRender"
	], function(System, TileMapRenderNode) {
		function TileMapRenderSystem($canvas) {
			Object.extend( RenderSystem.prototype, System.prototype );
			this.init($canvas);
		}
		var api = TileMapRenderSystem.prototype;
		api.context = null;
		api.nodes = null;
		api.init = function($canvas) {
			this.$canvas = $canvas;
			return this;
		}
		api.addToEngine = function(engine) {
			this.nodes = engine.getNodeList(TileMapRenderNode);
		}

		api.removeFromEngine = function(engine) {
			this.nodes = null;
		}

		api.update = function(time) {
			var tileMap;

			for(var node = _nodes.head; node; node = node.next) {
				tileMap = node.tileMap;					

				// console.log(node.tileMap);
			}
		}

		return TileMapRenderSystem;
	}
);