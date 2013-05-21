define(function() {
	function TileMap(array, mappingObj) {
		$.each(array, function(column) {
			$.each(column, function(cell) {
				cell = mappingObj ? mappinObj[cell] : cell;
			});
		});

		this.array = array;
	}

	return TileMap;
});