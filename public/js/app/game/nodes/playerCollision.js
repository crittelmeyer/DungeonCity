define([
	"ash/node",
	"app/game/components/player",
	"app/game/components/position"
	], function(Node, Player, Position) {
		function PlayerCollision() {
			$.extend(PlayerCollision.prototype, Node.prototype);
		}
		PlayerCollision.prototype.player = null;
		PlayerCollision.prototype.position = null;
		PlayerCollision.prototype.types = {
			player: Player,
			position: Position
		};
		return PlayerCollision;
	}
);