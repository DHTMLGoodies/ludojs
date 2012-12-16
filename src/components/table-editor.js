ludo.TableEditor = new Class({
    Extends : ludo.View,

    tableConfig : {
        rows : 5,
        cols: 5
    },

    tableWidth : 580,

    tblContextMenu : null,
    activeCell : null,
    readOnly : false,

    columnWidths : [],

    ludoConfig : function(config){
        this.parent(config);
        this.tableWidth = config.tableWidth || this.tableWidth;
        this.tableConfig = config.tableConfig || this.tableConfig;

        this.data = config.data || null;
        this.readOnly = config.readOnly || this.readOnly;

    },

    ludoDOM : function() {
        this.parent();

        var el = this.els.table = new Element('table');

        el.setProperty('cellSpacing', 0);
        el.setProperty('cellPadding', 0);
        el.setProperty('border', 1);
        el.addEvent('contextmenu', this.showContextMenu.bind(this));

        el.adopt(this.getCaptionEl());

        var thead = this.els.tableHead = new Element('thead');
        el.adopt(thead);
        var colgroup = this.els.colGroup = new Element('colgroup');
        thead.adopt(colgroup);

        var tableBody = this.els.tableBody = new Element('tbody');
        el.adopt(tableBody);

        this.createDefaultCells();

        this.getBody().adopt(el);

        this.getBody().setStyle('overflow', 'auto');

        this.getEl().addClass('ludo-table-editor');
        this.parent();
        if(this.data){
           this.showData();
        }

        this.resizeColResizeHandles.periodical(1000, this);

    },

    ludoEvents : function(){
        this.parent();
        this.addEvent('colresize', this.resizeColumn.bind(this));

        var eventEl = this.getEventEl();

        eventEl.addEvent('mousemove', this.moveColResizeHandle.bind(this));
        eventEl.addEvent('mouseup', this.stopColResize.bind(this));

    },

    resizeColumn : function(index, change){
        this.changeColumnWidth(index, change);
        this.changeColumnWidth(index+1, change*-1);

        return;
        var countColumns = this.getCountColumns();
        var changeInOtherColumns = Math.round(change / (countColumns - index - 1)) *-1;
        for(var i=index;i<countColumns;i++){
            if(i == index){
                var width = change;
            }else{
                var width = changeInOtherColumns;
            }
            this.changeColumnWidth(i, i == index ? change : changeInOtherColumns);
        }
    },

    changeColumnWidth : function(colIndex, change){
        var cells = this.getCellsInColumn(colIndex);
        var tableSize = this.els.table.getSize().x;
        for(var i=0, count=cells.length; i<count; i++){
            if(this.getColspan(cells[i]) == 1){
                var size = cells[i].getStyle('width');
                if(!size || size.indexOf('%')>=0){
                    var width = cells[i].getSize().x;
                }else{
                    var width = size.replace('px','')/1;
                }
                width += change;
                cells[i].setStyle('width', width);

                this.columnWidths[colIndex] = Math.round( width / tableSize * 100);
                return;
            }
        }
    },

    getMinPosOfResizeHandle : function(index) {
        var cell = this.getCellAt(0, index);
        return cell.getPosition().x + 20;
    },

    getMaxPosOfResizeHandle : function(index){
        var cell = this.getCellAt(0, index);
        if(cell.getNext()){
            cell = cell.getNext();
        }
        return cell.getPosition().x + cell.getSize().x - 20;
    },

    addColToColGroup : function() {
        var col = new Element('col');
        this.els.colGroup.adopt(col);
    },

    resizeColResizeHandles : function() {
        if(!this.resizeProperties.active){
            if(!this.els.resizeHandles){
                return;
            }
            var left = 0;
            var coordinates = this.els.table.getCoordinates(this.getBody());
            var cols = this.getCellsInRowWithMostCells();
            var height = coordinates.height;
            var top = coordinates.top + this.els.table.getElement('caption').getSize().y;

            for(var i=0, count = this.els.resizeHandles.length; i<count; i++){
                left += cols[i].getSize().x;
                this.els.resizeHandles[i].setStyles({
                    left : left,
                    top : top,
                    height : height
                });
            }
        }
    },

    getCellsInRowWithMostCells : function() {
        var rows = this.getRows();
        if(!rows.length){
            return null;
        }
        var max = 0;
        var index = 0;
        for(var i=0, count = rows.length; i<count; i++){
            if(rows[i].cells.length > max){
                max = rows[i].cells.length;
                index = i;
            }
        }

        return rows[index].cells;
    },

    createColResizeHandles : function() {
        this.deleteResizeHandles();
        var countColumns = this.getCountColumns();

        for(var i=0;i<countColumns-1;i++){
            var el = this.createAColResizeHandle(i);
            this.getBody().adopt(el);
            ludo.dom.addClass(el, 'ludo-table-editor-resize-handle');
            el.setStyle('top', '0');
            if(this.isReadOnly()){
                el.setStyle('display','none');
            }
        }
    },

    isReadOnly : function() {
        return this.readOnly ? true : false;
    },
    mouseOverResizeHandle : function(e) {

    },
    mouseOutResizeHandle : function(e){

    },

    resetToDefault : function() {
        this.data = null;
        this.clearCells();
        this.tableConfig.rows = 5;
        this.tableConfig.cols = 5;
        this.createDefaultCells();
        this.createColResizeHandles();

    },

    createDefaultCells : function() {
         for(var i=0, count = this.tableConfig.rows;i<count; i++){
            var row = this.getNewRow();
            for(var j=0, count=this.tableConfig.cols; j<count; j++){
                var cell = this.getNewCell();
                cell.getElements('div')[0].set('html', this.getDefaultText(i,j));
                row.adopt(cell);
            }
        }
    },

    getDefaultText : function(rowIndex, colIndex){
        return '&nbsp;';
        if(rowIndex == 0){
            return 'First row';
        }
        if(colIndex == 0){
            return 'First col';
        }

        return 'Cell text';
    },

    getNewRow : function() {
        var row = new Element('tr');
        this.els.tableBody.adopt(row);
        return row;
    },

    setText : function(cell, text){
        cell.getChildren('div')[0].set('html', text);
    },

    getCaptionEl : function() {
        var el = this.els.caption = new Element('caption');
        var div = this.getEditableDiv();
        div.set('html', 'Your table caption');
        div.addEvent('blur', this.captionEvent.bind(this));
        el.adopt(div);
        return el;
    },

    captionEvent : function() {
        this.fireEvent('changecaption', [ this.getCaption(), this ]);
    },

    getNewCell : function(config) {
        config = config || {};
        var cell = new Element('td');
        cell.setStyle('position', 'relative');
        cell.adopt(this.getEditableDiv());

        if(config.cellStyle){
            cell.addClass(config.cellStyle);
        }
        if(config.colspan){
            this.setColspan(cell, config.colspan)
        }
        if(config.text){
            this.setText(cell, config.text);
        }
        if(config.width){
            cell.setStyle('width', config.width + '%');
        }
        return cell;
    },


    makeCellEditable : function(cell) {
        cell.getElements('div')[0].setProperty('contentEditable', true);
    },

    makeAllCellsUneditable : function() {
        var cells = this.els.tableBody.getElements('td');
        for(var i=0, count = cells.length; i<count; i++){
            this.makeCellUneditable(cells[i]);
        }
    },

    makeCellUneditable : function(cell) {
        cell.getElements('div')[0].setProperty('contentEditable', false);
    },

    getEditableDiv : function() {
        var el = new Element('div');
        el.setStyles({
            width : '100%',
            height : '100%',
            position: 'relative',
            top : '0',
            left : '0'
        });
        if(!this.isEditorReadOnly()){
            el.setProperty('contentEditable', 'true');
        }
        el.set('html', '&nbsp;');
        el.addEvent('blur', this.addEmptyText.bind(this));
        el.addEvent('resize', this.resizeColResizeHandles.bind(this));
        return el;
    },

    isEditorReadOnly : function() {
        return this.readOnly;
    },

    addEmptyText : function(e){
        var el = e.target;
        if(!el.get('html').length){
            el.set('html', '&nbsp');
        }
    },

    showContextMenu : function(e) {
        var el = e.target;
        if(el.tagName.toLowerCase() != 'td'){
            el =  el.getParent('td');
        }
        this.activeCell = el;

        var menu = this.getTableContextMenu();
        menu.setNewMenuConfig(this.getContextMenuConfig(el));
        menu.positionAt(e.page.x, e.page.y);
        menu.show();
        return false;
    },

    getTableContextMenu : function() {
        if(!this.tblContextMenu){
            this.tblContextMenu = new ludo.DashboardItemMenu({
                listeners : {
                    click : this.clickOnContextMenu.bind(this)
                }
            });
        }
        return this.tblContextMenu;
    },

    getContextMenuConfig : function(el) {
        var ret = [];

        if(el.getNext()){
            ret.push({ label : 'Merge right', action : 'mergeright' });
        }
        ret.push({ label : 'Split', action : 'splitcell' });

        ret.push({ spacer : true });
        ret.push({ label : 'Insert column before', action : 'insertcolumnbefore' });
        ret.push({ label : 'Insert column after', action : 'insertcolumnafter' });

        if(this.hasMoreThanOneColumn()){
            ret.push({ label : 'Delete column', action : 'deletecolumn' });
        }
        ret.push({ spacer : true });
        ret.push({ label : 'Insert row above', action : 'insertrowbefore' });
        ret.push({ label : 'Insert row below', action : 'insertrowafter' });
        if(this.getCountRows() > 1){
            ret.push({ label : 'Delete row', action : 'deleterow' });
        }
        return ret;
    },
    hasMoreThanOneColumn : function() {
        return this.activeCell.getNext() || this.activeCell.getPrevious();
    },

    clickOnContextMenu : function(menuItem, menu){

        switch(menuItem.action){
            case 'mergeright':
                this.mergeRight();
                break;
            case 'splitcell':
                this.splitCell();
                break;
            case 'insertrowbefore':
                this.addRow(this.getActiveRow(), 'before');
                break;
            case 'insertrowafter':
                this.addRow(this.getActiveRow(), 'after');
                break;
            case 'deleterow':
                this.deleteRow();
                break;
            case 'insertcolumnafter':
                this.addColumn();
                break;
            case 'insertcolumnbefore':
                this.addColumn('before');
                break;
            case 'deletecolumn':
                this.deleteColumn();
                break;
        }
        menu.hide();
    },

    splitCell : function() {
        var cellIndex = this.getIndexOfActiveCell();
        var rowIndex = this.getIndexOfActiveRow();
        var newCell = this.getNewCell();
        newCell.inject(this.activeCell, 'after');

        for(var i=0, count = this.getCountRows();i<count;i++){
            if(i != rowIndex){
                this.increaseColspan(this.getCellAt(i, cellIndex));
            }
        }
    },

    mergeRight : function() {
        var nextCell = this.activeCell.getNext();
        if(nextCell){
            this.increaseColspan(this.activeCell);
            this.activeCell.getNext().dispose();
        }
        this.cleanCells();
    },

    getCellAt : function(row, col) {
        var row = this.els.table.rows[row];
        if(!row){
            return null;
        }
        var cell = row.cells[0];
        var index = this.getColspan(cell);
        while(index <= col && cell.getNext()){
            index += this.getColspan(cell);
            cell = cell.getNext();
        }
        return cell;

    },

    getIndexOfActiveCell : function() {
        var el = this.activeCell;
        var ret = 0;
        el = el.getPrevious();
        while(el){
            ret+= this.getColspan(el);
            el = el.getPrevious();
        }
        return ret;
    },

    getIndexOfActiveRow : function() {
        var row = this.activeCell.getParent('tr');
        return this.getIndexOfRow(row);

    },

    getIndexOfRow : function(row){
        var ret = 0;
        while(row.getPrevious()){
            row = row.getPrevious();
            ret++;
        }
        return ret;
    },

    getColspan : function(cell){
        var colspan = cell.getProperty('colspan');
        return colspan ? colspan / 1 : 1;
    },

    increaseColspan : function(cell) {
        var colspan = this.getColspan(cell);
        colspan ++;
        this.setColspan(cell, colspan);
    },

    decreaseColspan : function(cell) {
        var colspan = this.getColspan(cell);
        if(colspan <= 1){
            return;
        }
        colspan --;
        this.setColspan(cell, colspan);
    },

    setColspan : function(cell, colspan) {
        cell.setProperty('colspan', colspan);
        cell.setProperty('colSpan', colspan);
        cell.colspan = colspan;
    },

    addRow : function(where, pos){
        pos = pos || 'after';
        var row = new Element('tr');

        var cells = where.getElements('td');
        for(var i=0, count = cells.length; i< count; i++) {
            var cell = this.getNewCell();
            this.setColspan(cell, this.getColspan(cells[i]));
            row.adopt(cell);
        }
        row.inject(where, pos);
    },

    appendRow : function() {
        this.addRow(this.getLastRow(), 'after');
    },

    getLastRow : function() {
        return this.els.tableBody.getLast('tr');
    },

    getFirstRow : function() {
        return this.els.tableBody.getFirst('tr');
    },

    deleteRow : function() {
        if(this.getCountRows() > 1){
            this.getActiveRow().dispose();
        }
    },

    getActiveRow : function() {
        return this.activeCell.getParent('tr');
    },

    deleteColumn : function() {
        var index = this.getIndexOfActiveCell();
        for(var i=0, count = this.getCountRows(); i<count; i++) {
            var cell = this.getCellAt(i,index);
            if(this.getColspan(cell) > 1){
                this.decreaseColspan(cell);
            }else{
                this.getCellAt(i,index).dispose();
            }
        }
        this.createColResizeHandles();
    },

    addColumn : function(where) {
        where = where || 'after';
        var index = this.getIndexOfActiveCell();

        var rows = this.els.table.getElements('tr');
        for(var i=0, count = this.getCountRows(); i<count; i++) {
            var newCell = this.getNewCell();

            var cell = this.getCellAt(i, index);
            newCell.inject(cell, where);
        }

        this.createColResizeHandles();
    },

    cleanCells : function() {
        var countColumns = this.getCountColumns();
        for(var i=0;i<countColumns;i++){
            this.cleanColumn(i);
        }
    },

    cleanColumn : function(colIndex){
        if(this.hasAllCellsInColumnEqualColspan(colIndex)){
            var cells = this.getCellsInColumn(colIndex);
            for(var i=0, count = cells.length; i<count; i++){
                this.decreaseColspan(cells[i]);
            }
        }
    },

    hasAllCellsInColumnEqualColspan : function(colIndex) {
        var currentColspan;
        var cells = this.getCellsInColumn(colIndex);

        for(var i=0, count = cells.length; i<count; i++){
            var colspan = this.getColspan(cells[i]);
            if(currentColspan && colspan != currentColspan){
                return false;
            }
            currentColspan = colspan;
        }
        return true;
    },

    getCountColumns : function() {
        var ret = 0;
        var col = this.getLastRow();
        if(col){
            var cells = col.getElements('td');
            for(var i=0,count=cells.length;i<count;i++){
                ret += this.getColspan(cells[i]);
            }
        }
        return ret;
    },

    getCountRows : function() {
        return this.getRows().length;
    },

    getCellsInColumn : function(colIndex) {
        var ret = [];
        for(var i=0, count = this.getCountRows(); i<count; i++){
            ret.push(this.getCellAt(i, colIndex));
        }
        return ret;
    },

    setCellText : function(cell, text) {
        cell.getChildren('div').set('html', text);
    },


    insertJSON : function(json){
        this.data = json.data;
        this.data.cells = this.data.cells || [];
        this.showData();

        this.fireEvent('loadtable', this);
    },

    showData : function() {
        if(this.data.caption){
            this.setCaption(this.data.caption.text);
            this.setCaptionStyle(this.data.caption.style);
        }
        this.els.table.setProperty('tableStyleId', this.data.tableStyleId);
        this.els.table.setProperty('id', this.data.id);

        this.createCells();

        this.setBorder(this.data.border);
        this.createColResizeHandles();

        this.clearDuplicateWidthAttributes();
    },

    clearDuplicateWidthAttributes : function() {
        var rows = this.getRows();
        widthArray = {};
        for(var i=0, count = rows.length; i<count; i++){
            var cells = this.getCellsInRow(rows[i]);
            for(var j=0, countCells = cells.length; j<countCells; j++){
                if(this.getColspan(cells[j]) == 1){
                    var index = this.getIndexOfCell(cells[j]);
                    if(widthArray[index]){
                        cells[j].setStyle('width','');
                    }
                    widthArray[index] = true;
                }
            }
        }
    },

    getIndexOfCell : function(cell){
        var ret = 0;
        while(cell = cell.getPrevious()){
            ret += this.getColspan(cell);
        }
        return ret;

    },
    setBorder : function(border){
        this.tableFormatter.setBorder(border);
        this.els.table.setProperty('border', border);
    },

    clearCells : function() {
        var cells = this.els.table.getElements('tr');
        var count = cells.length;
        for(var i=count-1; i>=0; i--){
            cells[i].dispose();
        }

        var cols = this.els.table.getElements('col');
        var count = cols.length;
        for(var i=count-1; i>=0; i--){
            cols[i].dispose();
        }

        this.tableConfig = {
            rows : 0,
            cols: 0
        }
    },
    setCaption : function(caption) {
        this.els.caption.getElements('div')[0].set('html', caption);
    },
    setCaptionStyle : function(style) {
        this.els.caption.addClass(style);
    },
    createCells : function() {
        this.clearCells();
        if(!this.data.cells){
            this.createDefaultCells();
        }
        for(var i=0;i< this.data.cells.length; i++){
            var row = this.getNewRow();
            var cellsInRow = this.data.cells[i];
            for(var j=0;j<cellsInRow.length;j++){
                var cell = this.getNewCell(cellsInRow[j]);
                row.adopt(cell);
            }
        }

        var countColumns = this.getCountColumns();
        for(var i=0;i<countColumns;i++){
            this.addColToColGroup(i);
        }

    },

    save : function() {
        this.JSONRequest({
            url : this.getUrl(),
            params : {
                save : 1,
                data : this.getData()
            },
            onSuccess : function(json) {

                if(json.success){
                    this.fireEvent('savesuccess', [json, this]);

                }else{
                    this.fireEvent('savefailed', [json, this])
                }

            }.bind(this)
        });
    },

    getData : function() {
        var ret = {};

        ret.caption = this.getCaption();
        ret.columnWidths = this.columnWidths;
        ret.tableStyleId = this.els.table.getProperty('tableStyleId');
        ret.cells = [];

        var rows = this.getRows();
        for(var i=0, count = rows.length ; i<count; i++){
            var domCells = this.getCellsInRow(rows[i]);
            var cellInRow = [];
            for(var j=0;j<domCells.length;j++){
                cellInRow.push(this.getDataForCell(domCells[j]));
            }
            ret.cells.push(cellInRow);

        }
        return ret;
    },

    getDataForCell : function(cell) {
        var size = cell.getSize().x;
        var tableSize = this.els.table.getSize().x;
        var colspan = this.getColspan(cell);
        var ret = {
            text : cell.getElements('div')[0].get('html'),
            colspan : colspan,
            width : size,
            widthPrs : colspan == 1 ? Math.round(size / tableSize * 100) : null,
            cellStyle : cell.className
        };
        return ret;
    },

    getCaption : function(){
        var ret = this.els.caption.getElements('div')[0].get('html');
        ret = ret.replace(/^(.*?)<br>$/gi, '$1');
        return ret;
    },

    getCellsInRow : function(row){
        if(!row){
            return null;
        }
        return row.getElements('td');
    },

    getRows : function() {
        return this.els.table.getElements('tr');
    }

});