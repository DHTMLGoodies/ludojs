ludo.grid.SelectionGrid = new Class({
    Extends:ludo.grid.Grid,

    selectionProperties:{
        active:false,
        coordinates:{
            x:null,
            y:null,
            width:null,
            height:null
        },
        start:{
            cell:null
        },
        end:{
            cell:null
        },
        mouse:{
            x:null,
            y:null
        }
    },

    cache:{},

    ludoEvents:function () {
        this.parent();
        this.getGridDataEl().addEvent('mousedown', this.startSelection.bind(this));

        var eventEl = this.getEventEl();
        eventEl.addEvent('mouseup', this.endSelection.bind(this));
        eventEl.addEvent('mousemove', this.resizeSelection.bind(this));
        eventEl.addEvent('click', this.clearSelection.bind(this));
        this.addEvent('add', this.clearCache.bind(this));
    },


    getMenuConfig:function () {
        return this.menuConfig;
    },

    createSelectionEl:function () {
        if (this.els.selection) {
            this.els.selection.dispose();
        }
        var el = this.els.selection = new Element('div');
        el.setStyles({
            position:'absolute',
            border:'3px solid #000',
            display:'none',
            overflow:'hidden',
            'z-index':900
        });

        var elInner = new Element('div');
        elInner.setStyles({
            'position':'absolute',
            'background-color':'#0CF',
            'opacity':0.1,
            'filter':'alpha(opacity=10)',
            'left':0,
            'top':0,
            'width':3000,
            'height':3000
        });
        el.adopt(elInner);

        this.getGridDataEl().adopt(el);
    },

    resizeDOM:function () {
        this.parent();
        this.clearCache();
        this.startSelectAt(this.selectionProperties.start.cell);
        this.endSelectAt(this.selectionProperties.end.cell);
    },

    clearCache:function () {
        this.cache = {};
    },


    startSelection:function (e) {
        var cell = this.getCell(e);
        if (!cell) {
            return;
        }
        this.selectionProperties.active = 1;
        if (e.shift && this.hasStartingCell()) {
            this.endSelectAt(cell);
        } else {
            this.showSelectionEl();
            this.startSelectAt(cell);
            this.endSelectAt(cell);
        }
    },

    startSelectAt:function (cell) {
        if (!cell) {
            return;
        }

        var coords = this.getCellCoordinates(cell);

        this.selectionProperties.coordinates = {
            x:coords.left,
            y:coords.top
        };
        this.selectionProperties.start.cell = cell;

        this.getSelectionEl().setPosition({
            x:coords.left,
            y:coords.top
        });
    },

    endSelectAt:function (cell) {

        if (!cell) {
            return;
        }
        if (this.selectionProperties.active && this.selectionProperties.end.cell && this.selectionProperties.end.cell.id == cell.id) {
            return;
        }
        this.selectionProperties.end.cell = cell;


        var styles = this.getNewSelectionCellStyle();
        this.getSelectionEl().setStyles(styles);

        this.selectionProperties.coordinates.width = styles.width;
        this.selectionProperties.coordinates.height = styles.height;

        this.fireEvent('selection', this);
    },

    getNewSelectionCellStyle:function () {
        var ret = {};
        var coords = {
            start:this.getCellCoordinates(this.selectionProperties.start.cell),
            end:this.getCellCoordinates(this.selectionProperties.end.cell)
        };

        ret.left = Math.min(coords.start.left, coords.end.left);
        ret.top = Math.min(coords.start.top, coords.end.top);

        ret.width = Math.max(coords.start.left, coords.end.left) - Math.min(coords.start.left, coords.end.left);
        ret.height = Math.max(coords.start.top, coords.end.top) - Math.min(coords.start.top, coords.end.top);

        var columnCoords = {
            start:this.getColumn(this.selectionProperties.start.cell).getSize(),
            end:this.getColumn(this.selectionProperties.end.cell).getSize()
        };

        if (coords.start.left > coords.end.left) {
            ret.width += columnCoords.start.x;
        } else {
            ret.width += columnCoords.end.x;
        }
        if (coords.start.top > coords.end.top) {
            ret.height += coords.start.height;
        } else {
            ret.height += coords.end.height;
        }

        ret.width -= this.getSelectionBorder();
        ret.height -= this.getSelectionBorder();


        return ret;
    },

    getCellCoordinates:function (el) {
        this.cache.coords = this.cache.coords || {};
        if (!this.cache.coords[el.id]) {
            this.cache.coords[el.id] = el.getCoordinates(this.getGridDataEl());
        }
        return this.cache.coords[el.id];
    },

    resizeSelection:function (e) {
        if (this.selectionProperties.active) {
            var cell = this.getCell(e);

            if (!cell && this.hasSelectionDecreased(e)) {
                cell = this.getCellAtScreenPos(e.page.x, e.page.y);
            }

            this.endSelectAt(cell);
            this.selectionProperties.mouse = {
                x:e.page.x,
                y:e.page.y
            };


            if (this.isMouseAboveGridDataView(e)) {
                this.scrollBy(0, -10);
            }
            if (this.isMouseBelowGridDataView(e)) {
                this.scrollBy(0, 10);
            }

            if (this.isMouseBeyondLeftludoOfGridDataView(e)) {
                this.scrollBy(-10, 0);
            }
            if (this.isMouseBeyondRightludoOfGridDataView(e)) {
                this.scrollBy(10, 0);
            }
        }
    },

    isMouseAboveGridDataView:function (e) {
        if (!this.cache.topGridludo) {
            var coords = this.getGridDataContainer().getCoordinates();
            this.cache.topGridludo = coords.top;
        }
        return e.page.y < this.cache.topGridludo;
    },

    isMouseBelowGridDataView:function (e) {
        if (!this.cache.bottomGridludo) {
            var coords = this.getGridDataContainer().getCoordinates();
            this.cache.bottomGridludo = coords.top + coords.height;
        }
        return e.page.y > this.cache.bottomGridludo;
    },

    isMouseBeyondLeftludoOfGridDataView:function (e) {
        if (!this.cache.leftGridludo) {
            var coords = this.getEl().getCoordinates();
            this.cache.leftGridludo = coords.left;
        }
        return e.page.x < this.cache.leftGridludo;
    },
    isMouseBeyondRightludoOfGridDataView:function (e) {
        if (!this.cache.rightGridludo) {
            var coords = this.getEl().getCoordinates();
            this.cache.rightGridludo = coords.left + coords.width;
        }
        return e.page.x > this.cache.rightGridludo;
    },

    hasSelectionDecreased:function (e) {
        return e.page.x < this.selectionProperties.mouse.x || e.page.y < this.selectionProperties.mouse.y;
    },

    endSelection:function () {
        this.selectionProperties.active = false;
    },

    showSelectionEl:function () {
        this.getSelectionEl().setStyle('display', '');
    },

    hideSelectionEl:function () {
        this.getSelectionEl().setStyle('display', 'none');
    },

    getSelectionEl:function () {
        if (!this.els.selection || !this.els.selection.getParent()) {
            this.createSelectionEl();
        }
        return this.els.selection;
    },

    getCell:function (eventObj) {
        var cell = eventObj.target;
        if (!cell || !cell.hasClass) {
            return;
        }
        if (cell.hasClass('ludo-grid-data-cell')) {
            return cell;
        }
        cell = cell.getParent('.ludo-grid-data-cell');
        return cell;
    },


    getColumn:function (cell) {
        this.cache.columnCache = this.cache.columnCache || {};
        if (!cell) {
            return null;
        }
        if (!this.cache.columnCache[cell.id]) {
            this.cache.columnCache[cell.id] = cell.getParent('.ludo-grid-data-column');
        }
        return this.cache.columnCache[cell.id];
    },

    selectionBorderWidth:null,
    getSelectionBorder:function () {
        if (!this.selectionBorderWidth) {
            this.selectionBorderWidth = this.getSelectionEl().getStyle('border-left-width').replace('px', '') * 2;
        }
        return this.selectionBorderWidth;
    },

    clearSelection:function (e) {
        if (e.target && e.target.getParent && !e.target.getParent('.ludo-grid')) {
            this.hideSelectionEl();
            this.selectionProperties.start.cell = null;
            this.selectionProperties.end.cell = null;
            this.fireEvent('clearselection', this);
        }
    },

    hasStartingCell:function () {
        return this.selectionProperties.start.cell ? true : false;
    },

    getCellAtScreenPos:function (x, y) {
        var offsets = this.getGridDataEl().getPosition();
        x -= offsets.x;
        y -= offsets.y;

        var index = Math.floor(y / this.getRowHeight());
        var col = this.getColAt(x);
        if (col) {
            return col.getChildren()[index];
        }
    },

    getColAt:function (x) {
        var index = this.getIndexOfColumnAt(x);
        if (index !== undefined) {
            return this.els.dataColumns[index];
        }
    },

    getIndexOfColumnAt:function (x) {
        for (var i = 0; i < this.columnConfig.length; i++) {
            var col = this.columnConfig[i];
            if (col.left < x && col.left + col.width > x) {
                return i;
            }
        }
    },

    getSelection:function () {
        return {
            start:this.getSelectionFor(this.selectionProperties.start.cell),
            end:this.getSelectionFor(this.selectionProperties.end.cell)
        };
    },

    getSelectionFor:function (cell) {
        var colIndex = this.getColumnIndexFor(cell);
        return this.getAlphaNumericColumnName(colIndex) + (this.getDataIndexOfCell(cell) + 1);
    },

    getSelectedCells:function () {
        var dataIndexStart = this.getDataIndexOfCell(this.selectionProperties.start.cell);
        var dataIndexEnd = this.getDataIndexOfCell(this.selectionProperties.end.cell);

        var colIndexStart = this.getColumnIndexFor(this.selectionProperties.start.cell);
        var colIndexEnd = this.getColumnIndexFor(this.selectionProperties.end.cell);

        var columns = {
            start:Math.min(colIndexStart, colIndexEnd),
            end:Math.max(colIndexStart, colIndexEnd)
        };
        var rows = {
            start:Math.min(dataIndexStart, dataIndexEnd),
            end:Math.max(dataIndexStart, dataIndexEnd)
        };

        var ret = [];
        for (var i = columns.start; i <= columns.end; i++) {
            ret.push(this.getCellsInColumn(i, rows.start, rows.end));
        }
        return ret;
    },

    getDataIndexOfCell:function (cell) {
        return parseInt(cell.getProperty('dataIndex'));
    },

    getColumnIndexFor:function (cell) {
        if (!cell) {
            return;
        }
        return parseInt(cell.getParent('.ludo-grid-data-column').getProperty('colIndex'));
    },

    cacheRowHeight:null,
    getRowHeight:function () {
        if (!this.cacheRowHeight) {
            var cell = this.els.gridDataContainer.getElement('div.ludo-grid-data-cell');
            if (!cell) {
                return 25;
            }
            this.cacheRowHeight = cell.getSize().y;
        }
        return this.cacheRowHeight;
    },

    getColumnElByIndex:function (index) {
        return this.els.dataColumns[index];
    },

    getCellAt:function (col, row) {
        return this.getColumnElByIndex(col).getElements('.ludo-grid-data-cell')[row];
    },

    getCellSelectionInColumn:function (col, fromRow, toRow) {
        var ret = [];
        var cells = this.getColumnElByIndex(col).getElements('.ludo-grid-data-cell');
        for (var i = fromRow; i <= toRow; i++) {
            ret.push(cells[i]);
        }
        return ret;
    },

    getCellsInColumn:function (col, fromRow, toRow) {
        var ret = [];
        var cells = this.getCellSelectionInColumn(col, fromRow, toRow);
        for (var i = 0, count = cells.length; i < count; i++) {
            var obj = {
                text:cells[i].get('text'),
                coordinate:this.getAlphaNumericColumnName(col) + (fromRow + i + 1)
            };
            ret.push(obj);
        }
        return ret;
    },

    getAlphaNumericColumnName:function (colIndex) {
        return ('ABCDEFGHIJKLMNOPQRSTUVWXYZ').substr(colIndex, 1)
    }
});