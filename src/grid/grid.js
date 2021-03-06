/**
 * @namespace ludo.grid
 */

/**
 @namespace ludo.grid
 @class ludo.grid.Grid
 @augments View

 @param {Object} config
 @param {Boolean} config.headerMenu Show menu on each column heading.
 @param {Boolean} config.highlightRecord True to highlight rows on click, default: true
 @param {Boolean} config.mouseOverEffect True to highlight rows on mouse over, default: true.
 @param {Object} config.columns Description of columns. See example below for details.
 @param {Object} config.emptyText Text to show on grid when there are no data, default: "No data"
 @fires ludo.grid.Grid#click Row clicked. Arguments: 1) The record, i.e. JSON Object, example: { "firstname": "Jane", "lastname": "Johnson" } and 2) name of clicked column, example: "lastname"
 @fires ludo.grid.Grid#dblclick Row double clicked. Arguments: 1) The record, i.e. JSON Object, example: { "firstname": "Jane", "lastname": "Johnson" } and 2) name of clicked column, example: "lastname"
 @example
 children:[
 ..
 {
      id:'myGrid',
      type:'grid.Grid',
      stateful:true,
      resizable:false,

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
      },
      dataSource:{
          url:'data-source/grid.php',
          id:'myDataSource',
          paging:{
              size:12,
              remotePaging:false,
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
    Extends: ludo.View,
    type: 'Grid',

    hasMenu: true,
    colMovable: null,
    menu: true,

    menuConfig: [],

    sb: {},

    highlightRecord: true,

    uniqueId: '',
    activeRecord: {},

    headerMenu: true,


    mouseOverEffect: true,

    columnManager: undefined,

    /*
     Column config
     @config {Object} columns
     @example
     columns:{
     'country':{
     heading:'Country',
     sortable:true,
     movable:true,
     renderer:function (val) {
     return '<span style="color:blue">' + val + '</span>';
     }
     },
     'capital':{
     heading:'Capital',
     sortable:true,
     movable:true
     },
     population:{
     heading:'Population',
     movable:true
     }
     }
     or nested:

     columns:{
     info:{
     heading:'Country and Capital',
     headerAlign:'center',
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
     }
     }
     },
     population:{
     heading:'Population',
     movable:true,
     removable:true
     }
     }

     */
    columns: undefined,
    rowManager: undefined,

    emptyText: 'No data',

    defaultDS: 'dataSource.JSONArray',

    __construct: function (config) {
        this.parent(config);

        this.__params(config, ['columns', 'fill', 'headerMenu', 'rowManager', 'mouseOverEffect', 'emptyText', 'highlightRecord','keys']);

        if (this.columns == undefined) {
            this.columns = this.__columns();
        }

        if(this.keys != undefined){
            var cols = {};
            jQuery.each(this.keys, function(i, key){
                 if(this.columns[key] != undefined){
                     console.log(key);
                     cols[key] = this.columns[key];
                 }
            }.bind(this));
            this.columns = cols;
        }

        if (!this.cm) {
            this.cm = {
                columns: this.columns,
                fill: this.fill
            };
        }
        if (this.cm) {
            if (!this.cm.type)this.cm.type = 'grid.ColumnManager';
            this.cm.stateful = this.stateful;
            this.cm.id = this.cm.id || this.id + '_cm';
            this.cm = this.createDependency('colManager', this.cm);
            this.cm.addEvents({
                'hidecolumn': this.refreshData.bind(this),
                'showcolumn': this.refreshData.bind(this),
                'movecolumn': this.onColumnMove.bind(this),
                'resize': this.resizeColumns.bind(this)
            });
        }

        if (this.rowManager) {
            if (!this.rowManager.type)this.rowManager.type = 'grid.RowManager';
            this.rowManager = this.createDependency('rowManager', this.rowManager);
        }
        if (this.stateful && this.dataSource !== undefined && ludo.util.isObject(this.dataSource)) {
            this.dataSource.id = this.dataSource.id || this.id + '_ds';
            this.dataSource.stateful = this.stateful;
        }

        this.uniqueId = String.uniqueID();

    },

    __columns: function () {
        return undefined;
    },

    ludoDOM: function () {
        this.parent();
        this.getEl().addClass('ludo-grid-Grid');

        var b = this.$b();
        var t = this.els.dataContainerTop = jQuery('<div>');

        t.addClass('ludo-grid-data-container');
        t.css({
            'overflow': ludo.util.isTabletOrMobile() ? 'auto' : 'hidden',
            'position': 'relative'
        });

        b.append(t);
        b.css('overflow', 'visible');

        this.els.dataContainer = jQuery('<div>');
        t.append(this.els.dataContainer);

        this.els.dataContainer.css('position', 'relative');
        this.gridHeader = this.createDependency('gridHeader', {
            type: 'grid.GridHeader',
            headerMenu: this.headerMenu,
            columnManager: this.cm,
            grid: this
        });
        this.createDataColumnElements();
        this.createScrollbars();
        this.createColResizeHandles();
    },

    ludoEvents: function () {
        this.parent();

        if (this.dataSource) {
            if (this.dataSourceObj && this.dataSourceObj.hasData()) {
                this.populateData();
            }
            this.getDataSource().addEvents({
                'change': this.populateData.bind(this),
                'select': this.setSelectedRecord.bind(this),
                'deselect': this.deselectDOMForRecord.bind(this),
                'update': this.showUpdatedRecord.bind(this),
                'delete': this.removeDOMForRecord.bind(this)
            });
            this.getDataSource().addEvent('select', this.selectDOMForRecord.bind(this));
        }
        this.$b().on('selectstart', ludo.util.cancelEvent);
        if (this.highlightRecord) {
            this.$b().on('click', this.cellClick.bind(this));
            this.$b().on('dblclick', this.cellDoubleClick.bind(this));
        }else{
            this.$b().css('cursor', 'default');
        }


        if (this.mouseOverEffect) {
            this.els.dataContainer.on('mouseleave', this.mouseLeavesGrid.bind(this));
        }
    },

    __rendered: function () {
        this.parent();
        this.ifStretchHideLastResizeHandles();

        if (this.highlightRecord) {
            this.els.dataContainer.css('cursor', 'pointer');
        }

        this.positionVerticalScrollbar.delay(100, this);

        if (this.getParent()) {
            this.getParent().$b().css({
                'padding': 0
            });
            ludo.dom.clearCache();
            this.getParent().resize.delay(100, this.getParent());
        }

        this.toggleEmptyText();
    },

    currentOverRecord: undefined,
    mouseoverDisabled: false,

    enterCell: function (el) {
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

    mouseLeavesGrid: function () {
        if (this.currentOverRecord) {
            this.deselectDOMForRecord(this.currentOverRecord, 'ludo-grid-record-over');
            this.currentOverRecord = undefined;
        }
    },

    cellClick: function (e) {
        var record = this.getRecordByDOM(e.target);
        if (record) {
            this.getDataSource().selectRecord(record);
            this.fireEvent('click', [record, this.getColumnByDom(e.target)]);
        }
    },

    getColumnByDom: function (el) {
        el = jQuery(el);
        if (!el.hasClass('ludo-grid-data-cell')) {
            el = el.closest('.ludo-grid-data-cell');
        }
        if (el) {
            return el.attr('col');
        }
        return undefined;
    },

    setSelectedRecord: function (record) {
        // TODO should use dataSource.Record object instead of plain object
        this.fireEvent('selectrecord', record);
        this.highlightActiveRecord();
    },

    highlightActiveRecord: function () {
        if (this.highlightRecord) {
            var selectedRecord = this.getDataSource().getSelectedRecord();
            if (selectedRecord && selectedRecord.uid) {
                this.selectDOMForRecord(selectedRecord, 'ludo-active-record');
            }
        }
    },

    selectDOMForRecord: function (record, cls) {
        cls = cls || 'ludo-active-record';
        var cells = this.getDOMCellsForRecord(record);
        for (var key in cells) {
            if (cells.hasOwnProperty(key)) {
                cells[key].addClass(cls);
            }
        }
    },

    deselectDOMForRecord: function (record, cls) {
        cls = cls || 'ludo-active-record';
        var cells = this.getDOMCellsForRecord(record);
        for (var key in cells) {
            if (cells.hasOwnProperty(key)) {
                cells[key].removeClass(cls);
            }
        }
    },


    showUpdatedRecord: function (record) {
        var cells = this.getDOMCellsForRecord(record);
        var content;
        var renderer;

        for (var key in cells) {
            if (cells.hasOwnProperty(key)) {
                renderer = this.cm.getRendererFor(key);
                if (renderer) {
                    content = renderer(record[key], record);
                } else {
                    content = record[key];
                }
                cells[key].getElement('span').html(content);
            }
        }
    },

    removeDOMForRecord: function (record) {
        var cells = this.getDOMCellsForRecord(record);
        for (var key in cells) {
            if (cells.hasOwnProperty(key)) {
                cells[key].dispose();
            }
        }
    },

    getDOMCellsForRecord: function (record) {
        var ret = {};
        var div, divId;

        var keys = this.cm.getLeafKeys();
        for (var i = 0; i < keys.length; i++) {
            var col = this.$b().find('#ludo-grid-column-' + keys[i] + '-' + this.uniqueId);
            divId = 'cell-' + keys[i] + '-' + record.uid + '-' + this.uniqueId;
            div = col.find('#' + divId);
            if (div) {
                ret[keys[i]] = div;
            }
        }
        return ret;
    },
    /**
     Select a record.
     @function selectRecord
     @param {Object} record
     @memberof ludo.grid.Grid.prototype
     @example
     grid.selectRecord({ id: 100 } );
     */
    selectRecord: function (record) {
        if (ludo.util.isString(record)) {
            record = {id: record};
        }
        this.getDataSource().selectRecord(record);
    },

    cellDoubleClick: function (e) {
        var record = this.getRecordByDOM(e.target);
        if (record) {
            this.getDataSource().selectRecord(record);

            this.fireEvent('dblclick', [record, this.getColumnByDom(e.target)]);
        }
    },

    getRecordByDOM: function (el) {
        el = jQuery(el);
        if (!el.hasClass('ludo-grid-data-cell')) {
            el = el.parent('.ludo-grid-data-cell');
        }
        if (el && el.hasClass('ludo-grid-data-cell')) {
            var uid = el.attr('uid');
            return this.getDataSource().findRecord({uid: uid});
        }
        return undefined;
    },

    isColumnDragActive: function () {
        return this.colMovable && this.colMovable.isActive();
    },

    hideResizeHandles: function () {
        this.colResizeHandler.hideAllHandles();
    },

    showResizeHandles: function () {
        this.colResizeHandler.showAllHandles();
        this.ifStretchHideLastResizeHandles();
    },

    resizeChildren: function () {
        this.parent();
        if (this.colResizeHandler && this.cm.hasLastColumnDynamicWidth()) {
            this.resizeColumns();
        }
    },

    onColumnMove: function (source, target, pos) {

        if (pos == 'before') {
            this.els.dataColumns[source].insertBefore(this.els.dataColumns[target]);
        } else {
            this.els.dataColumns[source].insertAfter(this.els.dataColumns[target]);
        }
        this.cssColumns();
        this.resizeColumns();

    },

    cssColumns: function () {
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

    refreshData: function () {
        if (!this.isRendered)return;
        this.createDataColumnElements();
        this.resizeColumns();
        this.populateData();
        this.showResizeHandles();
    },

    JSON: function () {

    },

    addRecord: function (record) {
        this.getDataSource().addRecord(record);
    },

    resizeDOM: function () {
        this.resizeColumns();
        var height = this.getHeight() - ludo.dom.getMBPH(this.$e) - ludo.dom.getMBPH(this.els.body);
        height -= this.sb.h.getHeight();
        if (height < 0) {
            return;
        }
        this.$b().css('height', height - this.gridHeader.getHeight());
        var contentHeight = this.$b().height();

        if (contentHeight == 0) {
            this.resizeDOM.delay(100, this);
            return;
        }
        this.els.dataContainerTop.css('height', contentHeight);

        this.sb.v.resize();
        this.sb.h.resize();
    },

    createScrollbars: function () {
        this.sb.h = this.createDependency('scrollHorizontal', new ludo.Scroller({
            type: 'horizontal',
            applyTo: this.$b(),
            parent: this.$b()
        }));
        this.sb.h.getEl().insertAfter(this.$b());

        this.sb.v = this.createDependency('scrollVertical', new ludo.Scroller({
            type: 'vertical',
            applyTo: this.els.dataContainer,
            parent: this.els.dataContainerTop,
            mouseWheelSizeCls: 'ludo-grid-data-cell'
        }));
        this.getEl().append(this.sb.v.getEl());
        this.positionVerticalScrollbar();
    },

    positionVerticalScrollbar: function () {
        var top = this.gridHeader.getHeight();
        if (top == 0) {
            this.positionVerticalScrollbar.delay(100, this);
            return;
        }
        this.sb.v.getEl().css('top', top);
    },

    sortBy: function (key) {
        this.getDataSource().sortBy(key);
    },

    createColResizeHandles: function () {
        this.colResizeHandler = new ludo.ColResize({
            component: this,
            listeners: {
                startresize: this.setResizePos.bind(this),
                resize: this.resizeColumn.bind(this)
            }
        });
        var keys = this.cm.getLeafKeys();
        for (var i = 0; i < keys.length; i++) {
            var el = this.colResizeHandler.getHandle(keys[i], this.cm.isResizable(keys[i]));
            this.$b().append(el);
            el.addClass('ludo-grid-resize-handle');
        }
    },

    setResizePos: function (column) {
        this.colResizeHandler.setMinPos(this.cm.getMinPosOf(column));
        this.colResizeHandler.setMaxPos(this.cm.getMaxPosOf(column));
        this.mouseoverDisabled = true;
        this.mouseLeavesGrid();
    },

    mouseOverResizeHandle: function (e) {
        jQuery(e.target).addClass('ludo-grid-resize-handle-over');
    },
    mouseOutResizeHandle: function (e) {
        jQuery(e.target).removeClass('ludo-grid-resize-handle-over');
    },

    resizeColumns: function () {
        this.mouseoverDisabled = false;
        var leftPos = 0;

        this.stretchLastColumn();
        var columns = this.cm.getLeafKeys();

        for (var i = 0; i < columns.length; i++) {
            if (this.cm.isHidden(columns[i])) {
                this.colResizeHandler.hideHandle(columns[i]);
            } else {
                var width = this.cm.getWidthOf(columns[i]);
                var bw = ludo.dom.getBW(this.els.dataColumns[columns[i]]) - (i === columns.length - 1) ? 1 : 0;
                this.els.dataColumns[columns[i]].css('left', leftPos);
                this.els.dataColumns[columns[i]].css('width', (width - ludo.dom.getPW(this.els.dataColumns[columns[i]]) - bw));

                this.cm.setLeft(columns[i], leftPos);

                leftPos += width;

                this.colResizeHandler.setPos(columns[i], leftPos);
                if (this.cm.isResizable(columns[i])) {
                    this.colResizeHandler.showHandle(columns[i]);
                } else {
                    this.colResizeHandler.hideHandle(columns[i]);
                }
            }
        }

        var totalWidth = this.cm.getTotalWidth();
        this.els.dataContainerTop.css('width', totalWidth);
        // this.els.dataContainerTop.css('width', Math.min(Math.floor(this.$b().width()), totalWidth));

        this.sb.h.setContentSize(totalWidth);

    },

    stretchLastColumn: function () {
        if (this.cm.hasLastColumnDynamicWidth()) {

            this.cm.clearStretchedWidths();

            var totalWidth = this.cm.getTotalWidth();
            var viewSize = this.$b().width();
            var restSize = viewSize - totalWidth;
            if (restSize <= 0) {
                return;
            }
            var width = this.cm.getWidthOf(this.cm.getLastVisible()) + restSize;
            this.cm.setStretchedWidth(width)
        }
    },

    toggleEmptyText: function () {

        if (this.emptyText) {
            this.emptyTextEl().css('display', (!this.currentData || this.currentData.length) > 0 ? 'none' : '');
        }
    },

    populateData: function () {

        this.fireEvent('state');
        this.currentOverRecord = undefined;
        this.currentData = this.getDataSource().getData();


        this.toggleEmptyText();

        var contentHtml = [];
        var keys = this.cm.getLeafKeys();
        for (var i = 0; i < keys.length; i++) {
            var columnId = 'ludo-grid-column-' + keys[i] + '-' + this.uniqueId;
            if (this.cm.isHidden(keys[i])) {
                contentHtml.push('<div id="' + columnId + '" class="ludo-grid-data-column" style="display:none"></div>');
            } else {
                contentHtml.push('<div id="' + columnId + '" col="' + keys[i] + '" class="ludo-grid-data-column ludo-grid-data-column-' + i + ' ' + this.getColumnCssClass(keys[i]) + '">' + this.getHtmlTextForColumn(keys[i]) + '</div>');
            }
        }

        this.els.dataContainer.html(contentHtml.join(''));

        var columns = this.els.dataContainer.find('.ludo-grid-data-column');
        this.els.dataColumns = {};
        var count;
        for (i = 0, count = columns.length; i < count; i++) {

            this.els.dataColumns[jQuery(columns[i]).attr('col')] = jQuery(columns[i]);
        }

        this.fireEvent('renderdata', [this, this]);
        this.resizeColumns();
        this.resizeVerticalScrollbar();
        this.highlightActiveRecord();
    },


    emptyTextEl: function () {
        if (this.els.emptyText === undefined) {
            this.els.emptyText = jQuery('<div class="ludo-grid-empty-text">' + this.emptyText + '</div>');
            this.getEl().append(this.els.emptyText);

        }
        return this.els.emptyText;
    },

    getColumnCssClass: function (col) {
        var ret;
        if (this.cm.isLastVisibleColumn(col)) {
            ret = 'ludo-grid-data-last-column ludo-grid-data-last-column-';
        } else {
            ret = 'ludo-grid-data-column-';
        }
        ret += this.cm.getAlignmentOf(col);
        return ret;
    },

    resizeVerticalScrollbar: function () {
        var column = this.els.dataColumns[this.cm.getLastVisible()];
        if (!column) {
            return;
        }
        var height = column.outerHeight();

        if (height === 0) {
            this.resizeVerticalScrollbar.delay(300, this);
        } else {
            this.els.dataContainer.css('height', height);
            this.sb.v.setContentSize();
        }
    },

    createDataColumnElements: function () {
        this.els.dataColumns = {};
        var keys = this.cm.getLeafKeys();
        for (var i = 0; i < keys.length; i++) {
            var el = jQuery('<div>');
            this.els.dataContainer.append(el);
            el.addClass('ludo-grid-data-column');

            el.attr('col', keys[i]);
            el.addClass(this.getColumnCssClass(i));
            el.id = 'ludo-grid-column-' + keys[i] + '-' + this.uniqueId;
            this.els.dataColumns[keys[i]] = el;
        }
    },

    getHtmlTextForColumn: function (col) {
        var ret = [];
        var rowClasses = ['ludo-grid-data-odd-row', 'ludo-grid-data-even-row'];
        var content;
        var data = this.currentData;
        if (!data)return '';

        var renderer = this.cm.getRendererFor(col);

        var rowRenderer = this.rowManager ? this.rowManager.rowCls : undefined;
        var rowCls = '';
        for (var i = 0, count = data.length; i < count; i++) {
            content = data[i][col];
            if (renderer) {
                content = renderer(content, data[i]);
            }
            var id = ['cell-', col, '-', data[i].uid, '-', this.uniqueId].join('');
            var over = this.mouseOverEffect ? ' onmouseover="ludo.get(\'' + this.id + '\').enterCell(this)"' : '';
            if (rowRenderer) {
                rowCls = rowRenderer(data[i]);
                if (rowCls)rowCls = ' ' + rowCls;
            }
            ret.push('<div id="' + id + '" ' + over + ' col="' + col + '" class="ludo-grid-data-cell ' + (rowClasses[i % 2]) + rowCls + '" uid="' + data[i].uid + '"><span class="ludo-grid-data-cell-text">' + content + '</span></div>');
        }

        return ret.join('');
    },

    resizeColumn: function (col, resizedBy) {
        this.cm.increaseWithFor(col, resizedBy);
    },

    ifStretchHideLastResizeHandles: function () {
        if (this.cm.hasLastColumnDynamicWidth()) {
            this.colResizeHandler.hideHandle(this.cm.getLastVisible());
        }
    },

    scrollBy: function (x, y) {
        if (y) {
            this.sb.v.scrollBy(y);
        }
        if (x) {
            this.sb.h.scrollBy(x);
        }
    },

    getSelectedRecord: function () {
        return this.getDataSource().getSelectedRecord();
    },

    getColumnManager: function () {
        return this.cm;
    }
});