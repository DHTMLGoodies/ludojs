/**
 Private class used by grid.Grid to render headers
 @namespace grid
 @class GridHeader
 @private
 */
ludo.grid.GridHeader = new Class({
	Extends:ludo.Core,
	columnManager:undefined,
	grid:undefined,
	cells:{},
	cellHeight:undefined,
	spacing:{},
	headerMenu:false,

	ludoConfig:function (config) {
		this.parent(config);
        this.setConfigParams(config, ['columnManager','headerMenu','grid']);

		this.measureCellHeight();
		this.createDOM();
	},

	ludoEvents:function () {
		this.parent();
        var c = this.columnManager;
		c.addEvent('resize', this.renderColumns.bind(this));
		c.addEvent('stretch', this.renderColumns.bind(this));
		c.addEvent('movecolumn', this.renderColumns.bind(this));
		c.addEvent('hidecolumn', this.renderColumns.bind(this));
		c.addEvent('showcolumn', this.renderColumns.bind(this));
		this.grid.addEvent('render', this.renderColumns.bind(this));
		this.grid.getDataSource().addEvent('sort', this.updateSortArrow.bind(this));
	},

	createDOM:function () {
		this.el = new Element('div');
		ludo.dom.addClass(this.el, 'ludo-header');
		ludo.dom.addClass(this.el, 'testing');
		this.el.inject(this.grid.getBody().getFirst(), 'before');

		var countRows = this.columnManager.getCountRows();
		this.el.setStyle('height', this.cellHeight * countRows + ludo.dom.getMBPH(this.el));
		this.renderColumns();
	},

	renderColumns:function () {
		var countRows = this.columnManager.getCountRows();

		for (var i = 0; i < countRows; i++) {
			var columns = this.columnManager.getColumnsInRow(i);
			var left = 0;
			for (var j = 0; j < columns.length; j++) {
				var width = this.columnManager.getWidthOf(columns[j]);
				if (i == this.columnManager.getStartRowOf(columns[j])) {

					var cell = this.getCell(columns[j]);
					cell.setStyle('display', '');
					cell.setStyle('left', left);
					cell.setStyle('top', i * this.cellHeight);
					var height = (this.columnManager.getRowSpanOf(columns[j]) * this.cellHeight) - this.spacing.height;
					var spacing = (j==columns.length-1) ? this.spacing.width - 1 : this.spacing.width;
					cell.setStyle('width', width - spacing);
					cell.setStyle('height', height);
					cell.setStyle('line-height', height);

					this.resizeCellBackgrounds(columns[j]);

					cell.removeClass('last-header-cell');
					if (j == columns.length - 1) {
						ludo.dom.addClass(cell, 'last-header-cell');
					}
				}
				left += width;
			}
		}
		this.hideHiddenColumns();
	},

	hideHiddenColumns:function () {
		var hiddenColumns = this.columnManager.getHiddenColumns();
		for (var i = 0; i < hiddenColumns.length; i++) {
			if (this.cellExists(hiddenColumns[i])) {
				this.cells[hiddenColumns[i]].style.display = 'none';
			}
		}
	},

	cellExists:function (col) {
		return this.cells[col] !== undefined;
	},

	measureCellHeight:function () {
		if(this.grid.isHidden())return;
		var el = new Element('div');
		ludo.dom.addClass(el, 'ludo-grid-header-cell');
		this.grid.getBody().adopt(el);
		this.cellHeight = el.getSize().y + ludo.dom.getMH(el);

		this.spacing = {
			width:ludo.dom.getMBPW(el),
			height:ludo.dom.getMBPH(el)
		};
		el.dispose();
	},

	menuButtons:{},

	getCell:function (col) {
		if (this.cells[col]) {
			return this.cells[col];
		}
		var el = this.cells[col] = new Element('div');
		el.setProperty('col', col);
		ludo.dom.addClass(el, 'ludo-grid-header-cell');
		ludo.dom.addClass(el, 'ludo-header-' + this.columnManager.getHeaderAlignmentOf(col));

		var span = new Element('span');
		ludo.dom.addClass(span, 'ludo-cell-text');
		el.adopt(span);

		this.createTopAndBottomBackgrounds(col);
		this.addDOMForDropTargets(el, col);

		if (this.columnManager.isSortable(col)) {
			el.addEvent('click', this.sortByDOM.bind(this));
		}
		el.addEvent('mouseover', this.mouseoverHeader.bind(this));
		el.addEvent('mouseout', this.mouseoutHeader.bind(this));

		if (this.headerMenu) {
			this.menuButtons[col] = new ludo.menu.Button({
				renderTo:el,
				id:this.getMenuButtonId(col),
				menu:this.getMenu(col),
				listeners:{
					beforeShow:this.validateButtonDisplay.bind(this)
				}
			});
		}
		el.getElement('span').set('html', this.columnManager.getHeadingFor(col));
		this.el.adopt(el);

		this.getMovable().add({
			el:el,
			column:col
		});
		return el;
	},

	validateButtonDisplay:function (button) {
		if (this.columnMove && this.columnMove.isActive()) {
			button.cancelShow();
		}
	},
	cellBg:{},

	createTopAndBottomBackgrounds:function (col) {
		var top = new Element('div');
		ludo.dom.addClass(top, 'ludo-grid-header-cell-top');
		this.cells[col].adopt(top);
		var bottom = new Element('div');
		ludo.dom.addClass(bottom, 'ludo-grid-header-cell-bottom');
		this.cells[col].adopt(bottom);
		this.cellBg[col] = {
			top:top,
			bottom:bottom
		};
	},

	resizeCellBackgrounds:function (col) {
		var totalHeight = this.columnManager.getRowSpanOf(col) * this.cellHeight;
		totalHeight -= this.spacing.height;
		var height = Math.round(totalHeight) / 2;
		this.cellBg[col].top.setStyle('height', height);
		height = totalHeight - height;
		this.cellBg[col].bottom.setStyle('height', height);
	},

	getMenu:function (col) {
		return {
			singleton:true,
			id:this.getMenuId(),
			type:'menu.Menu',
			direction:'vertical',
			children:this.getColumnMenu(col)
		};
	},

	getColumnMenu:function (forColumn) {
		var ret = [];
		var columnKeys = this.columnManager.getLeafKeys();
		for (var i = 0; i < columnKeys.length; i++) {
			ret.push({
				type:'form.Checkbox',
				disabled:!(this.columnManager.isRemovable(columnKeys[i])),
				checked:this.columnManager.isVisible(columnKeys[i]),
				label:this.columnManager.getHeadingFor(columnKeys[i]),
				action:columnKeys[i],
				listeners:{
					change:this.getColumnToggleFn(columnKeys[i], forColumn)
				}
			});
		}
		return ret;
	},

	getColumnToggleFn:function (column, forColumn) {
		return function (checked) {
			if (checked) {
				this.columnManager.showColumn(column);
			} else {
				this.columnManager.hideColumn(column);
			}
			ludo.get(this.getMenuButtonId(forColumn)).hideMenu();
		}.bind(this);
	},

	getMenuId:function () {
		return 'header-menu-' + this.getId();
	},

	getMenuButtonId:function (column) {
		return this.getMenuId() + '-' + column;
	},


	mouseoverHeader:function (e) {
		var col = this.getColByDOM(e.target);
		if (!this.grid.colResizeHandler.isActive() && !this.grid.isColumnDragActive() && this.columnManager.isSortable(col)) {
			this.cells[col].addClass('ludo-grid-header-cell-over');
		}
	},

	mouseoutHeader:function (e) {
		if (!this.grid.colResizeHandler.isActive()) {
			var col = this.getColByDOM(e.target);
			if (!col)return;
			this.cells[col].removeClass('ludo-grid-header-cell-over');
		}
	},

	getColByDOM:function (el) {
		var ret = el.getProperty('col');
		if (!ret && ret != '0') {
			ret = el.getParent().getProperty('col');
		}
		return ret;
	},

	getHeight:function () {
		if (this.cachedHeight === undefined) {
			this.cachedHeight = this.columnManager.getCountRows() * this.cellHeight;
			this.cachedHeight += ludo.dom.getMBPH(this.el);
		}
		return this.cachedHeight;

	},

	getEl:function () {
		return this.el;
	},

	sortByDOM:function (e) {
		var col = this.getColByDOM(e.target);
		this.grid.getDataSource().sortBy(col);
	},

	addDOMForDropTargets:function (parent, column) {
		var left = new Element('div');
		left.setStyles({
			position:'absolute',
			'z-index':15,
			left:'0px', top:'0px',
			width:'50%', height:'100%'
		});

		parent.adopt(left);
		var right = new Element('div');
		right.setStyles({
			position:'absolute',
			'z-index':15,
			right:'0px', top:'0px',
			width:'50%', height:'100%'
		});
		parent.adopt(right);

		this.getMovable().addDropTarget({
			el:left,
			column:column,
			position:'before'
		});
		this.getMovable().addDropTarget({
			el:right,
			column:column,
			position:'after'
		});
	},

	columnMove:undefined,
	getMovable:function () {
		if (this.columnMove === undefined) {
			this.columnMove = new ludo.grid.ColumnMove({
				useShim:true,
				delay:.5,
				mouseYOffset:15,
				mouseXOffset:15,
				listeners:{
					before:this.validateMove.bind(this),
					start:this.grid.hideResizeHandles.bind(this.grid),
					end:this.grid.showResizeHandles.bind(this.grid),
					enterDropTarget:this.validateDrop.bind(this),
					leaveDropTarget:this.leaveDropTarget.bind(this),
					showShim:this.setColumnTextOnMove.bind(this),
					drop:this.moveColumn.bind(this)
				}
			});
		}
		return this.columnMove;
	},

	setColumnTextOnMove:function (shim, dd) {
		var column = dd.getDragged().column;
		shim.set('html', this.columnManager.getHeadingFor(column));
		shim.setStyle('line-height', shim.style.height);
	},

	validateMove:function (dragged, dd) {
		if (!this.columnManager.isMovable(dragged.column)) {
			dd.cancelDrag();
		}
	},
	validateDrop:function (dragged, dropPoint) {
		var cm = this.columnManager;
		if (cm.canBeMovedTo(dragged.column, dropPoint.column, dropPoint.position)) {
			var m = this.getMovable();
			m.showMarkerAt(this.getCell(dropPoint.column), dropPoint.position);
			var height = (cm.getChildDepthOf(dropPoint.column) + cm.getRowSpanOf(dropPoint.column)) * this.cellHeight;
			m.setMarkerHeight(height);
		}
	},

	leaveDropTarget:function () {
		this.getMovable().hideMarker();
	},

	moveColumn:function (dragged, droppedAt) {
		if (droppedAt.position == 'before') {
			this.columnManager.insertColumnBefore(dragged.column, droppedAt.column);
		} else {
			this.columnManager.insertColumnAfter(dragged.column, droppedAt.column);
		}
		this.getMovable().hideMarker();
	},

	clearSortClassNameFromHeaders:function () {
		var keys = this.columnManager.getLeafKeys();
		for (var i = 0; i < keys.length; i++) {
			if (this.cells[keys[i]] !== undefined) {
				var el = this.cells[keys[i]].getElements('span')[0];
				el.removeClass('ludo-cell-text-sort-asc');
				el.removeClass('ludo-cell-text-sort-desc');
			}
		}
	},

	updateSortArrow:function (sortedBy) {
		this.clearSortClassNameFromHeaders();
		var headerCell = this.cells[sortedBy.column];
		if (headerCell) {
			headerCell.getElements('span')[0].addClass('ludo-cell-text-sort-' + sortedBy.order);
		}
	}
});