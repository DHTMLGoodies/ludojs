/**
 @namespace grid
 @class Grid
 @extends View
 @constructor
 @param {Object} config
 @example
	 children:[
	 ..
	 {
		  id:'myGrid',
		  type:'grid.Grid',
		  stateful:true,
		  resizable:false,
		  columnManager:{
			  columns:{
				  'country':{
					  heading:'Country',
					  removable:false,
					  sortable:true,
					  movable:true,
					  width:200,
					  renderer:function (val) {
						  return '<span style="color:blue">' + val + '</span>';
					  }
				  },
				  'capital':{
					  heading:'Capital',
					  sortable:true,
					  removable:true,
					  movable:true,
					  width:150
				  },
				  population:{
					  heading:'Population',
					  movable:true,
					  removable:true
				  }
			  }
		  },
		  dataSource:{
			  url:'data-source/grid.php',
			  id:'myDataSource',
			  paging:{
				  size:12,
				  pageQuery:false,
				  cache:false,
				  cacheTimeout:1000
			  },
			  searchConfig:{
				  index:['capital', 'country']
			  },
			  listeners:{
				  select:function (record) {
					  console.log(record)
				  },
				   count:function(countRecords){
					   ludo.get('gridWindowSearchable').setTitle('Grid - capital and population - Stateful (' + countRecords + ' records)');
				   }
			  }
		  }

	  }
 	...
 	]
 Is example of code used to add a grid as child view of another view. You may also create the grid directly using:

 @example
 	new ludo.grid.Grid({...})
 where {...} can be the same code as above. use the "renderTo" config property to specify where you want the grid to be rendered.
 */
ludo.grid.Grid = new Class({
	Extends:ludo.View,
	type:'Grid',

	hasMenu:true,
	colMovable:null,
	menu:true,

	menuConfig:[

	],

	scrollbar:{

	},
	/**
	 * true to highlight record on click
	 * @config highlightRecord
	 * @type {Boolean}
	 */
	highlightRecord:true,

	uniqueId:'',
	activeRecord:{},

	/**
	 * Show menu when mouse over headers
	 * @config headerMenu
	 * @type {Boolean}
	 * @default true
	 */
	headerMenu:true,

	/**
	 * True to highlight rows while moving mouse over them
	 * @config mouseOverEffect
	 * @type {Boolean}
	 * @default true
	 */
	mouseOverEffect:true,

	/**
	 * Column manager config object
	 * @config {grid.ColumnManager} columnManager
	 * @default undefined
	 */
	columnManager:undefined,
	/**
	 * Row manager config object
	 * @config {grid.RowManager} rowManager
	 * @default undefined
	 */
	rowManager:undefined,

	ludoConfig:function (config) {
		this.parent(config);

        this.setConfigParams(config, ['headerMenu','columnManager','rowManager','mouseOverEffect']);

		if (this.columnManager) {
			if (!this.columnManager.type)this.columnManager.type = 'grid.ColumnManager';
			this.columnManager.stateful = this.stateful;
			this.columnManager.id = this.columnManager.id || this.id + '_cm';
			this.columnManager = ludo._new(this.columnManager);
            this.columnManager.addEvents({
                'hidecolumn' : this.refreshData.bind(this),
                'showcolumn' : this.refreshData.bind(this),
                'movecolumn' : this.onColumnMove.bind(this),
                'resize' : this.resizeColumns.bind(this)
            });
		}

		if (this.rowManager) {
			if (!this.rowManager.type)this.rowManager.type = 'grid.RowManager';
			this.rowManager = ludo._new(this.rowManager);
		}
		if (this.stateful && this.dataSource !== undefined && ludo.util.isObject(this.dataSource)) {
			this.dataSource.id = this.dataSource.id || this.id + '_ds';
			this.dataSource.stateful = this.stateful;
		}

		this.uniqueId = String.uniqueID();
		if (this.dataSource && !this.dataSource.type)this.dataSource.type = 'dataSource.Collection';
	},

	ludoDOM:function () {
		this.parent();
		ludo.dom.addClass(this.getEl(), 'ludo-grid-Grid');

		var b = this.getBody();
		var t = this.els.dataContainerTop = new Element('div');

		ludo.dom.addClass(t, 'ludo-grid-data-container');
		t.setStyles({
			'overflow':ludo.util.isTabletOrMobile() ? 'auto' : 'hidden',
			'position':'relative'
		});

		b.adopt(t);
		b.setStyle('overflow', 'visible');

		this.els.dataContainer = new Element('div');
		t.adopt(this.els.dataContainer);

		this.els.dataContainer.setStyle('position', 'relative');
		this.gridHeader = ludo._new({
			type:'grid.GridHeader',
			headerMenu: this.headerMenu,
			columnManager:this.columnManager,
			grid:this
		});
		this.createDataColumnElements();
		this.createScrollbars();
		this.createColResizeHandles();
	},

	ludoEvents:function () {
		this.parent();

		if (this.dataSource) {
			if(this.dataSourceObj && this.dataSourceObj.hasData()){
				this.populateData();
			}
            this.getDataSource().addEvents({
                'change' : this.populateData.bind(this),
                'select' : this.setSelectedRecord.bind(this),
                'deselect' : this.deselectDOMForRecord.bind(this),
                'update' : this.showUpdatedRecord.bind(this),
                'delete' : this.removeDOMForRecord.bind(this)
            });
            this.getDataSource().addEvent('select', this.selectDOMForRecord.bind(this));
		}
        this.getBody().addEvents({
            'selectstart' : ludo.util.cancelEvent,
            'click' : this.cellClick.bind(this),
            'dblclick' : this.cellDoubleClick.bind(this)
        });
		if (this.mouseOverEffect) {
			this.els.dataContainer.addEvent('mouseleave', this.mouseLeavesGrid.bind(this));
		}
	},

	ludoRendered:function () {
		this.parent();
		this.ifStretchHideLastResizeHandles();

		if (this.highlightRecord) {
			this.els.dataContainer.setStyle('cursor', 'pointer');
		}

		this.positionVerticalScrollbar.delay(100, this);

		if (this.getParent()) {
			this.getParent().getBody().setStyles({
				'padding':0
			});
			ludo.dom.clearCache();
			this.getParent().resize.delay(100, this.getParent());
		}
	},

	currentOverRecord:undefined,
	mouseoverDisabled:false,

	enterCell:function (el) {
		if (this.mouseoverDisabled)return;
		var record = this.getRecordByDOM(el);
		if (record) {
			if (this.currentOverRecord) {
				this.deselectDOMForRecord(this.currentOverRecord, 'ludo-grid-record-over');
			}
			this.currentOverRecord = record;
			this.selectDOMForRecord(record, 'ludo-grid-record-over');
		}
	},

	mouseLeavesGrid:function () {
		if (this.currentOverRecord) {
			this.deselectDOMForRecord(this.currentOverRecord, 'ludo-grid-record-over');
			this.currentOverRecord = undefined;
		}
	},

	cellClick:function (e) {
		var record = this.getRecordByDOM(e.target);
		if (record) {
			this.getDataSource().selectRecord(record);
			/**
			 * Click on record
			 * @event click
			 * @param Record clicked record
			 * @param Component this
			 * @param {Number} index of record
			 */
			this.fireEvent('click', record);
		}
	},

	setSelectedRecord:function (record) {
        // TODO should use dataSource.Record object instead of plain object
		this.fireEvent('selectrecord', record);
		this.highlightActiveRecord();
	},

	highlightActiveRecord:function () {
		if (this.highlightRecord) {
			var selectedRecord = this.getDataSource().getSelectedRecord();
			// TODO what about records without "id" field - refactor!!
			if (selectedRecord && selectedRecord.id) {
				this.selectDOMForRecord(selectedRecord, 'ludo-active-record');
			}
		}
	},

	selectDOMForRecord:function (record, cls) {
		cls = cls || 'ludo-active-record';
		var cells = this.getDOMCellsForRecord(record);
		for (var key in cells) {
			if (cells.hasOwnProperty(key)) {
				ludo.dom.addClass(cells[key], cls);
			}
		}
	},

	deselectDOMForRecord:function (record, cls) {
		cls = cls || 'ludo-active-record';
		var cells = this.getDOMCellsForRecord(record);
		for (var key in cells) {
			if (cells.hasOwnProperty(key)) {
				cells[key].removeClass(cls);
			}
		}
	},


	showUpdatedRecord:function (record) {
		var cells = this.getDOMCellsForRecord(record);
		var content;
		var renderer;

		for (var key in cells) {
			if (cells.hasOwnProperty(key)) {
				renderer = this.columnManager.getRendererFor(key);
				if (renderer) {
					content = renderer(record[key], record);
				} else {
					content = record[key];
				}
				cells[key].getElement('span').set('html', content);
			}
		}
	},

	removeDOMForRecord:function (record) {
		var cells = this.getDOMCellsForRecord(record);
		for (var key in cells) {
			if (cells.hasOwnProperty(key)) {
				cells[key].dispose();
			}
		}
	},

	getDOMCellsForRecord:function (record) {
		var ret = {};
		var div, divId;
		var keys = this.columnManager.getLeafKeys();
		for (var i = 0; i < keys.length; i++) {
			var col = this.getBody().getElement('#ludo-grid-column-' + keys[i] + '-' + this.uniqueId);
			divId = 'cell-' + keys[i] + '-' + record.id + '-' + this.uniqueId;
			div = col.getElement('#' + divId);
			if (div) {
				ret[keys[i]] = div;
			}
		}
		return ret;
	},
	/**
	 Select a record.
	 @method selectRecord
	 @param {Object} record
	 @example
	 	grid.selectRecord({ id: 100 } );
	 */
	selectRecord:function (record) {
		if (ludo.util.isString(record)) {
			record = { id:record };
		}
		this.getDataSource().selectRecord(record);
	},

	cellDoubleClick:function (e) {
		var record = this.getRecordByDOM(e.target);
		if (record) {
			this.getDataSource().selectRecord(record);
			/**
			 * Double click on record
			 * @event dblclick
			 * @param Record clicked record
			 * @param Component this
			 * @param {Number} index of record
			 */
			this.fireEvent('dblclick', record);
		}
	},

	getRecordByDOM:function (el) {
		el = document.id(el);
		if (!el.hasClass('ludo-grid-data-cell')) {
			el = el.getParent('.ludo-grid-data-cell');
		}
		if (el && el.hasClass('ludo-grid-data-cell')) {
			var uid = el.getProperty('uid');
			return this.getDataSource().findRecord({uid:uid});
		}
		return undefined;
	},

	isColumnDragActive:function () {
		return this.colMovable && this.colMovable.isActive();
	},

	hideResizeHandles:function () {
		this.colResizeHandler.hideAllHandles();
	},

	showResizeHandles:function () {
		this.colResizeHandler.showAllHandles();
		this.ifStretchHideLastResizeHandles();
	},

	resizeChildren:function () {
		this.parent();
		if (this.colResizeHandler && this.columnManager.hasLastColumnDynamicWidth()) {
			this.resizeColumns();
		}
	},

	onColumnMove:function (source, target, pos) {

		if (pos == 'before') {
			this.els.dataColumns[source].inject(this.els.dataColumns[target], 'before');
		} else {
			this.els.dataColumns[source].inject(this.els.dataColumns[target], 'after');
		}
		this.cssColumns();
		this.resizeColumns();

	},

	cssColumns:function () {
		var keys = Object.keys(this.els.dataColumns);
		for (var i = 0; i < keys.length; i++) {
			var c = this.els.dataColumns[keys[i]];
			c.removeClass('ludo-grid-data-last-column');
			c.removeClass('ludo-grid-data-last-column-left');
			c.removeClass('ludo-grid-data-column-left');
			c.removeClass('ludo-grid-data-last-column-center');
			c.removeClass('ludo-grid-data-column-center');
			c.removeClass('ludo-grid-data-last-column-right');
			c.removeClass('ludo-grid-data-column-right');
			ludo.dom.addClass(c, this.getColumnCssClass(keys[i]));
		}
	},

	refreshData:function () {
		if (!this.isRendered)return;
		this.createDataColumnElements();
		this.resizeColumns();
		this.populateData();
		this.showResizeHandles();
	},

	insertJSON:function () {

	},

	addRecord:function (record) {
		this.getDataSource().addRecord(record);
	},

	resizeDOM:function () {
		this.resizeColumns();
		var height = this.getHeight() - ludo.dom.getMBPH(this.els.container) - ludo.dom.getMBPH(this.els.body);
		height -= this.scrollbar.horizontal.getHeight();
		if (height < 0) {
			return;
		}
		this.els.body.style.height = height + 'px';
		this.cachedInnerHeight = height;

		var contentHeight = this.getBody().offsetHeight;
		if (contentHeight == 0) {
			this.resizeDOM.delay(100, this);
			return;
		}
		this.els.dataContainerTop.setStyle('height', contentHeight - this.gridHeader.getHeight());

		this.scrollbar.vertical.resize();
		this.scrollbar.horizontal.resize();
	},

	createScrollbars:function () {
		this.scrollbar.horizontal = new ludo.Scroller({
			type:'horizontal',
			applyTo:this.getBody(),
			parent:this.getBody()
		});
		this.scrollbar.horizontal.getEl().inject(this.getBody(), 'after');

		this.scrollbar.vertical = new ludo.Scroller({
			type:'vertical',
			applyTo:this.els.dataContainer,
			parent:this.els.dataContainerTop,
			mouseWheelSizeCls:'ludo-grid-data-cell'
		});
		this.getEl().adopt(this.scrollbar.vertical.getEl());
		this.positionVerticalScrollbar();
	},

	positionVerticalScrollbar:function () {
		var top = this.gridHeader.getHeight();
		if (top == 0) {
			this.positionVerticalScrollbar.delay(100, this);
			return;
		}
		this.scrollbar.vertical.getEl().setStyle('top', top);
	},

	getColIndex:function (el) {
		var ret = el.getProperty('col-index');
		if (!ret && ret != '0') {
			ret = el.getParent().getProperty('col-index');
		}
		return ret;
	},

	sortBy:function (key) {
		this.getDataSource().sortBy(key);
	},

	createColResizeHandles:function () {
		this.colResizeHandler = new ludo.ColResize({
			component:this,
			listeners:{
				startresize:this.setResizePos.bind(this),
				resize:this.resizeColumn.bind(this)
			}
		});
		var keys = this.columnManager.getLeafKeys();
		for (var i = 0; i < keys.length; i++) {
			var el = this.colResizeHandler.getHandle(keys[i], this.columnManager.isResizable(keys[i]));
			this.getBody().adopt(el);
			ludo.dom.addClass(el, 'ludo-grid-resize-handle');
		}
	},

	setResizePos:function (column) {
		this.colResizeHandler.setMinPos(this.columnManager.getMinPosOf(column));
		this.colResizeHandler.setMaxPos(this.columnManager.getMaxPosOf(column));
		this.mouseoverDisabled = true;
		this.mouseLeavesGrid();
	},

	mouseOverResizeHandle:function (e) {
		ludo.dom.addClass(e.target, 'ludo-grid-resize-handle-over');
	},
	mouseOutResizeHandle:function (e) {
		e.target.removeClass('ludo-grid-resize-handle-over');
	},

	resizeColumns:function () {
		this.mouseoverDisabled = false;
		var leftPos = 0;

		this.stretchLastColumn();
		var columns = this.columnManager.getLeafKeys();

		for (var i = 0; i < columns.length; i++) {
			if (this.columnManager.isHidden(columns[i])) {
				this.colResizeHandler.hideHandle(columns[i]);
			} else {
				var width = this.columnManager.getWidthOf(columns[i]);
                var bw = ludo.dom.getBW(this.els.dataColumns[columns[i]]) - (i===columns.length-1) ? 1 : 0;
                this.els.dataColumns[columns[i]].style.left = leftPos + 'px';
                this.els.dataColumns[columns[i]].style.width = (width - ludo.dom.getPW(this.els.dataColumns[columns[i]]) - bw) + 'px';

				this.columnManager.setLeft(columns[i], leftPos);

				leftPos += width;

				this.colResizeHandler.setPos(columns[i], leftPos);
				if (this.columnManager.isResizable(columns[i])) {
					this.colResizeHandler.showHandle(columns[i]);
				} else {
					this.colResizeHandler.hideHandle(columns[i]);
				}
			}
		}

		var totalWidth = this.columnManager.getTotalWidth();
		this.els.dataContainerTop.setStyle('width', totalWidth);
		this.scrollbar.horizontal.setContentSize(totalWidth);

	},

	stretchLastColumn:function () {
		if (this.columnManager.hasLastColumnDynamicWidth()) {

			this.columnManager.clearStretchedWidths();

			var totalWidth = this.columnManager.getTotalWidth();
			var viewSize = this.getBody().getCoordinates().width - ludo.dom.getPW(this.getBody()) - ludo.dom.getBW(this.getBody());
			var restSize = viewSize - totalWidth;
			if (restSize <= 0) {
				return;
			}
			var width = this.columnManager.getWidthOf(this.columnManager.getLastVisible()) + restSize;
			this.columnManager.setStretchedWidth(width)
		}
	},

	populateData:function () {

		this.fireEvent('state');
		this.currentOverRecord = undefined;
		this.currentData = this.getDataSource().getData();

		if (Browser.ie) {
			this.populateDataIE();
			return;
		}
		var contentHtml = [];
		var keys = this.columnManager.getLeafKeys();
		for (var i = 0; i < keys.length; i++) {
			var columnId = 'ludo-grid-column-' + keys[i] + '-' + this.uniqueId;
			if (this.columnManager.isHidden(keys[i])) {
				contentHtml.push('<div id="' + columnId + '" class="ludo-grid-data-column" style="display:none"></div>');
			} else {
				contentHtml.push('<div id="' + columnId + '" col="' + keys[i] + '" class="ludo-grid-data-column ludo-grid-data-column-' + i + ' ' + this.getColumnCssClass(keys[i]) + '">' + this.getHtmlTextForColumn(keys[i]) + '</div>');
			}
		}

		this.els.dataContainer.set('html', contentHtml.join(''));

		var columns = this.els.dataContainer.getChildren('.ludo-grid-data-column');
		this.els.dataColumns = {};
		var count;
		for (i = 0, count = columns.length; i < count; i++) {
			this.els.dataColumns[columns[i].getProperty('col')] = columns[i];
		}

		this.fireEvent('renderdata', [this, this]);
		this.resizeColumns();
		this.resizeVerticalScrollbar();
		this.highlightActiveRecord();
	},

	getColumnCssClass:function (col) {
		var ret;
		if (this.columnManager.isLastVisibleColumn(col)) {
			ret = 'ludo-grid-data-last-column ludo-grid-data-last-column-';
		} else {
			ret = 'ludo-grid-data-column-';
		}
		ret += this.columnManager.getAlignmentOf(col);
		return ret;
	},

	populateDataIE:function () {
		this.els.dataContainer.set('html', '');
		this.createDataColumnElements();
		this.resizeColumns();
		var keys = this.columnManager.getLeafKeys();

		for (var i = 0; i < keys.length; i++) {
			if (this.columnManager.isHidden(keys[i])) {
				this.els.dataColumns[keys[i]].style.display='none';
			} else {
				this.els.dataColumns[keys[i]].style.display='';
				this.els.dataColumns[keys[i]].innerHTML = this.getHtmlTextForColumn(keys[i]);
			}
		}
		this.resizeVerticalScrollbar();
		this.highlightActiveRecord();
	},

	resizeVerticalScrollbar:function () {
		var column = this.els.dataColumns[this.columnManager.getLastVisible()];
		if (!column) {
			return;
		}
		var height = column.offsetHeight;
		if (height === 0) {
			this.resizeVerticalScrollbar.delay(300, this);
		} else {
			this.els.dataContainer.setStyle('height', height);
			this.scrollbar.vertical.setContentSize();
		}
	},

	createDataColumnElements:function () {
		this.els.dataColumns = {};
		var keys = this.columnManager.getLeafKeys();
		for (var i = 0; i < keys.length; i++) {
            var el = ludo.dom.create({ cls : 'ludo-grid-data-column', renderTo : this.els.dataContainer});
			el.setAttribute('col', keys[i]);
			ludo.dom.addClass(el, this.getColumnCssClass(i));
			el.id = 'ludo-grid-column-' + keys[i] + '-' + this.uniqueId;
			this.els.dataColumns[keys[i]] = el;
		}
	},

	getHtmlTextForColumn:function (col) {
		var ret = [];
		var rowClasses = ['ludo-grid-data-odd-row', 'ludo-grid-data-even-row'];
		var content;
		var data = this.currentData;
		if (!data)return '';

		var renderer = this.columnManager.getRendererFor(col);

		var rowRenderer = this.rowManager ? this.rowManager.renderer : undefined;
		var rowCls = '';
		for (var i = 0, count = data.length; i < count; i++) {
			content = data[i][col];
			if (renderer) {
				content = renderer(content, data[i]);
			}
			var id = ['cell-' , col , '-' , data[i].id , '-' , this.uniqueId].join('');
			var over = '';
			if (this.mouseOverEffect) {
				over = ' onmouseover="ludo.get(\'' + this.id + '\').enterCell(this)"';
			}

			if (rowRenderer) {
				rowCls = rowRenderer(data[i]);
				if (rowCls)rowCls = ' ' + rowCls;
			}
			ret.push('<div id="' + id + '" ' + over + ' class="ludo-grid-data-cell ' + (rowClasses[i % 2]) + rowCls + '" uid="' + data[i].uid + '"><span class="ludo-grid-data-cell-text">' + content + '</span></div>');
		}

		return ret.join('');
	},

	resizeColumn:function (col, resizedBy) {
		this.columnManager.increaseWithFor(col, resizedBy);
	},

	ifStretchHideLastResizeHandles:function () {
		if (this.columnManager.hasLastColumnDynamicWidth()) {
			this.colResizeHandler.hideHandle(this.columnManager.getLastVisible());
		}
	},

	scrollBy:function (x, y) {
		if (y) {
			this.scrollbar.vertical.scrollBy(y);
		}
		if (x) {
			this.scrollbar.horizontal.scrollBy(x);
		}
	},

	getSelectedRecord:function () {
		return this.getDataSource().getSelectedRecord();
	},
	getColumnManager:function () {
		return this.columnManager;
	}
});