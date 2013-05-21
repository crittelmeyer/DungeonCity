define([
	"ash/node",
	"app/game/components/monster",
	"app/game/components/position"
	], function(Node, Monster, Position) {
		function MonsterCollision() {
			$.extend(MonsterCollision.prototype, Node.prototype);
		}
		MonsterCollision.prototype.monster = null;
		MonsterCollision.prototype.position = null;
		MonsterCollision.prototype.types = {
			monster: Monster,
			position: Position
		};
		return MonsterCollision;
	}
);