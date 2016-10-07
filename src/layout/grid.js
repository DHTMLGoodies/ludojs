/**
 * Arrange child views in a grid layout
 * @namespace layout
 * @class Grid
 */
ludo.layout.Grid = new Class({
	Extends:ludo.layout.Base,
    /**
     * Number of columns
     * @config {Number} columns
     * @default 5
     */
	columns:5,
    /**
     * Number of rows
     * @config {Number} rows
     * @default 5
     */
	rows:5,

	onCreate:function () {
		var l = this.view.layout;
		if (l.columns !== undefined)this.columns = l.columns;
		if (l.rows !== undefined)this.rows = l.rows;
	},

	resize:function () {
		this.storeCellSize();
		var pos = 0;
		var colspan;
		for (var i = 0; i < this.view.children.length; i++) {
			var c = this.view.children[i];
			colspan = c.layout && c.layout.colspan ? c.layout.colspan : 1;
			this.view.children[i].resize({
				width:this.cellSize.x * colspan,
				height:this.cellSize.y,
				left:this.cellSize.x * (pos % this.columns),
				top:this.cellSize.y * (Math.floor(pos / this.columns) % this.rows)
			});
			pos += colspan;
		}
	},

	storeCellSize:function () {
		this.cellSize = {
			x:this.getAvailWidth() / this.columns,
			y:this.getAvailHeight() / this.rows
		}
	},

	getCellSize:function () {
		return this.cellSize;
	},

	onNewChild:function (child) {
		child.getEl().css('position', 'absolute');
	}
});