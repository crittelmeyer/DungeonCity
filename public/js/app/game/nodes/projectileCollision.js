define([
	"ash/node",
	"app/game/components/projectile",
	"app/game/components/position"
	], function(Node, Projectile, Position) {
		function ProjectileCollision() {
			$.extend(ProjectileCollision.prototype, Node.prototype);
		}
		ProjectileCollision.prototype.projectile = null;
		ProjectileCollision.prototype.position = null;
		ProjectileCollision.prototype.types = {
			projectile: Projectile,
			position: Position
		};
		return ProjectileCollision;
	}
);