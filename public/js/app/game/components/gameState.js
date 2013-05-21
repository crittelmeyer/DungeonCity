define(function() {
	function GameState(width, height) {
		this.lives = 5;
		this.mapWidth = width;
		this.mapHeight = height;

		var _mapArray = new Array(this.mapHeight);
		var that = this;
		$.each(_mapArray, function(i) {
			_mapArray[i] = new Array(that.mapWidth);
		});
		this.mapArray = _mapArray;
	}

	return GameState;
});