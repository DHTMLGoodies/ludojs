ludo.TableFormatter = new Class({
    Extends: Events,
    els : {
        table : null
    },
    remote : {
        url : null
    },

    tableStyles : undefined,
    currentTableStyle : undefined,

    initialize : function(config) {

        this.els.table = document.id(config.els.table);
        this.loadTableStyles();
    },

    loadTableStyles : function() {
        var config = {
            onSuccess : function(json){
                this.tableStyles = json.data;
            },
            params : {
                getTableStyles : 1
            }
        };
        this.JSONRequest(config);
    },

    JSONRequest : function(config){
         var req = new Request.JSON({
            url : this.getUrl(),
            noCache : true,
            data : config.params,
            evalScripts : true,
            onSuccess : config.onSuccess.bind(this)
        });
        req.send();
    },

    getNameOfTableStyles : function() {
        var ret = [];
        for(var i=0;i<this.tableStyles.length;i++){
            ret.push(this.tableStyles[i].name);
        }
        return ret;
    },

    formatTable : function(table) {
        table = table || this.els.table;
        if(this.tableStyles === undefined){
            this.formatTable.delay(100, this, table);
            return;
        }
        if(!this.els.table.getElement('tr')){
            return;
        }
        var styleId = this.els.table.getProperty('tableStyleId');
        this.currentTableStyle = this.getTableStyleById(styleId);
        if(this.currentTableStyle){
            this.clearStyling(table);
            this.formatDefault(table);


            this.formatLastColumn(table);
            this.formatFirstColumn(table);
            this.formatLastRow(table);
            this.formatFirstRow(table);

        }
    },

    clearStyling : function(table) {
        table = table || this.els.table;
        var cells = table.getElements('td');
        for(var i=0, count = cells.length; i<count; i++){
            cells[i].className ='';
        }
    },

    formatDefault : function(table) {
        if(!this.currentTableStyle.style_default){
            return;
        }
        table = table || this.els.table;
        var cells = this.els.table.getElements('td');
        this.applyCellStyleToCells(cells, this.currentTableStyle.style_default);
    },

    formatFirstRow : function(table) {
        if(!this.currentTableStyle.style_header){
            return;
        }
        table = table || this.els.table;
        var row = this.els.table.getElement('tr');
        var cells = row.getElements('td');
        this.applyCellStyleToCells(cells, this.currentTableStyle.style_header);
    },
    formatLastRow : function(table) {
        if(!this.currentTableStyle.style_last_row){
            return;
        }
        table = table || this.els.table;
        var row = this.els.table.getElement('tbody').getLast('tr');
        var cells = row.getElements('td');
        this.applyCellStyleToCells(cells, this.currentTableStyle.style_last_row);
    },
    formatFirstColumn : function(table) {
        if(!this.currentTableStyle.style_first_col){
            return;
        }
        table = table || this.els.table;
        var cells = [];
        var rows = this.els.table.getElements('tr');
        for(var i=0,count = rows.length; i<count; i++){
            cells.push(rows[i].getFirst('td'));
        }
        this.applyCellStyleToCells(cells, this.currentTableStyle.style_first_col);

    },

    formatLastColumn : function(table) {
        if(!this.currentTableStyle.style_last_col){
            return;
        }
        table = table || this.els.table;
        var cells = [];
        var rows = this.els.table.getElements('tr');
        for(var i=0,count = rows.length; i<count; i++){
            cells.push(rows[i].getLast('td'));
        }
        this.applyCellStyleToCells(cells, this.currentTableStyle.style_last_col);
    },

    applyCellStyleToCells : function(cells, cellStyle){
        for(var i=0, count = cells.length; i<count; i++){
            cells[i].className = '';
            cells[i].addClass('custom' + cellStyle);
        }
    },

    getTableStyleById : function(id){
        id = id || '';
        id = id.replace(/[^0-9]/g,'');

        for(var i=0;i<this.tableStyles.length;i++){
            if(this.tableStyles[i].id == id){
                return this.tableStyles[i];
            }
        }
        return null;
    },

    setBorder : function(border) {
        if(border == 1) {
            var borderCss = '1px solid #000';
        }else{
            var borderCss = '1px dashed #DDD'
        }
        this.els.table.setStyle('border', borderCss);

        var cells = this.els.table.getElements('td');
        for(i=0, count = cells.length; i<count; i++){
            cells[i].setStyle('border', borderCss);
        }
    }

});