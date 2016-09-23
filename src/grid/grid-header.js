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
		this.el = $('<div>');
		this.el.addClass('ludo-header');
		this.el.addClass('testing');
		this.el.insertBefore(this.grid.getBody().first());
	//	this.el.inject(this.grid.getBody().getFirst(), 'before');

		var countRows = this.columnManager.getCountRows();
		this.el.css('height', this.cellHeight * countRows + ludo.dom.getMBPH(this.el));
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
					cell.css('display', '');
					cell.css('left', left);
					cell.css('top', i * this.cellHeight);
					var height = (this.columnManager.getRowSpanOf(columns[j]) * this.cellHeight) - this.spacing.height;
					var spacing = (j==columns.length-1) ? this.spacing.width - 1 : this.spacing.width;
					cell.css('width', width - spacing);
					cell.css('height', height);
					cell.css('line-height', height + 'px');

					this.resizeCellBackgrounds(columns[j]);

					cell.removeClass('last-header-cell');
					if (j == columns.length - 1) {
						cell.addClass('last-header-cell');
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
				this.cells[hiddenColumns[i]].css('display', 'none');
			}
		}
	},

	cellExists:function (col) {
		return this.cells[col] !== undefined;
	},

	measureCellHeight:function () {
		if(this.grid.isHidden())return;
		var el = $('<div>');
		el.addClass('ludo-grid-header-cell');
		this.grid.getBody().append(el);
		this.cellHeight = el.height() + ludo.dom.getMH(el);

		this.spacing = {
			width:ludo.dom.getMBPW(el),
			height:ludo.dom.getMBPH(el)
		};
		el.remove();
	},

	menuButtons:{},

	getCell:function (col) {
		if (this.cells[col]) {
			return this.cells[col];
		}
		var el = this.cells[col] = $('<div>');
		el.attr('col', col);
		el.addClass('ludo-grid-header-cell');
		el.addClass('ludo-header-' + this.columnManager.getHeaderAlignmentOf(col));


		var span = $('<span class="ludo-cell-text">' + this.columnManager.getHeadingFor(col) + '</span>');
		el.append(span);



		this.createTopAndBottomBackgrounds(col);
		this.addDOMForDropTargets(el, col);

		if (this.columnManager.isSortable(col)) {
			el.on('click', this.sortByDOM.bind(this));
		}
		el.on('mouseover', this.mouseoverHeader.bind(this));
		el.on('mouseout', this.mouseoutHeader.bind(this));

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
		this.el.append(el);

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
		var top = $('<div>');
		top.addClass('ludo-grid-header-cell-top');
		this.cells[col].append(top);
		var bottom = $('<div>');
		bottom.addClass('ludo-grid-header-cell-bottom');
		this.cells[col].append(bottom);
		this.cellBg[col] = {
			top:top,
			bottom:bottom
		};
	},

	resizeCellBackgrounds:function (col) {
		var totalHeight = (this.columnManager.getRowSpanOf(col) * this.cellHeight) -  this.spacing.height;
		var height = Math.round(totalHeight) / 2;
		this.cellBg[col].top.css('height', height);
		height = totalHeight - height;
		this.cellBg[col].bottom.css('height', height);
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
                height: 25, width: 150,
				listeners:{
					change:this.getColumnToggleFn(columnKeys[i], forColumn)
				}
			});
		}

        ret.push(
            {
                html: ludo.language.get('Sort ascending'),
                listeners:{
                    click:function(){
                        this.sort('ascending');
                    }.bind(this)
                }
            }
        );
        ret.push(
            {
                html: ludo.language.get('Sort descending'),
                listeners:{
                    click:function(){
                        this.sort('descending');
                    }.bind(this)
                }
            }
        );
		return ret;
	},

    sort:function(method){
        this.grid.getDataSource().by(this.currentColumn)[method]().sort();
        ludo.get(this.getMenuButtonId(this.currentColumn)).hideMenu();
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

    currentColumn:undefined,

	mouseoverHeader:function (e) {
		var col = this.getColByDOM(e.target);

		if (!this.grid.colResizeHandler.isActive() && !this.grid.isColumnDragActive() && this.columnManager.isSortable(col)) {

            this.currentColumn = col;
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
		el = $(el);
		var ret = el.attr('col');
		if (!ret && ret != '0') {
			ret = el.parent().attr('col');
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
		var left = $('<div>');
		left.css({
			position:'absolute',
			'z-index':15,
			left:'0px', top:'0px',
			width:'50%', height:'100%'
		});

		parent.append(left);
		var right = $('<div>');
		right.css({
			position:'absolute',
			'z-index':15,
			right:'0px', top:'0px',
			width:'50%', height:'100%'
		});
		parent.append(right);

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
		shim.html( this.columnManager.getHeadingFor(column));
		shim.css('line-height', shim.css('height'));
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
		if (this.cells[sortedBy.column]) {
            this.cells[sortedBy.column].getElements('span')[0].addClass('ludo-cell-text-sort-' + sortedBy.order);
		}
	}
});