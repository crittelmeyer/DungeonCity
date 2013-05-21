define([
	"ash/node",
	"app/game/components/tileMap"
	], function(Node, TileMap) {
		function TileMapRender() {
			$.extend(TileMapRender.prototype, Node.prototype);
		}
		TileMapRender.prototype.tileMap = null;
		TileMapRender.prototype.types = {
			tileMap: TileMap
		};
		return TileMapRender;
	}
);