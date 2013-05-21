define(function() {
	function GameState(width, height) {
		this.lives = 5;
		this.mapWidth = width;
		this.mapHeight = height;
	}

	return GameState;
});