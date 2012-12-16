/*
DHTML Goodies Grid
Copyright (C) October 2011  DTHMLGoodies.com, Alf Magne Kalleland

This library is free software; you can redistribute it and/or
modify it under the terms of the GNU Lesser General Public
License as published by the Free Software Foundation; either
version 2.1 of the License, or (at your option) any later version.

This library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public
License along with this library; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA

Dhtmlgoodies.com., hereby disclaims all copyright interest in this script
written by Alf Magne Kalleland.

Alf Magne Kalleland, 2011
Owner of DHTMLgoodies.com

*/

ludo.grid.GridAutoload = new Class({

    tableEl : null,

    initialize : function(){

    },

    columnConfig : [],

    getConfigObject : function(el){
        this.tableEl = el;

        this.setColumnConfig();
        var size = this.getSize();

        return {

			closable : false,
			resizable : true,
			minimizable : false,
            height: size.y,
            width : size.x,
            weight:1,
            columnConfig : this.columnConfig,
            data : this.getData()
        }
    },

    setColumnConfig : function(){
        var ret = [];
        var row = this.tableEl.getElements('tr')[0];
        var cells = row.getElements('td');
        countCells = cells.length;

        for(var i=0;i<countCells;i++){
            ret.push({
                width : cells[i].getSize().x,
                sortable : true,
                removable: false,
                movable : true,
                key : cells[i].get('html'),
                heading : cells[i].get('html')
            })
        }

        this.columnConfig = ret;;

    },

    getSize : function() {
        var size = this.tableEl.getSize();
        var gridHeightProperty = this.tableEl.getProperty('gridHeight');
        return {
            x : size.x,
            y : gridHeightProperty ? gridHeightProperty / 1 : size.y + 50
        } ;
    },

    getData : function() {
        var ret = [];
        var rows = this.tableEl.getElements('tr');

        for(var i=1, count=rows.length; i<count; i++){
            var cells = rows[i].getElements('td');
            var obj = {};
            for(var j=0, countCols = this.columnConfig.length; j<countCols; j++){
                obj[this.columnConfig[j].key] = cells[j].get('html');
            }
            ret.push(obj);
        }
        return ret;
    },

    hasTheadElement : function(){
        return this.tableEl.getElements('thead').length > 0;
    }
});

window.addEvent('domready', function() {
    var gridAutoLoadObject = new ludo.grid.GridAutoload();
    var els = $$('.table-ludo-grid');
    for(var i=0;i<els.length;i++){
        var gridConfig = gridAutoLoadObject.getConfigObject(els[i]);
        console.log(gridConfig);
        var grid = new ludo.grid.Grid(gridConfig);
        grid.getEl().inject(els[i], 'before');
        els[i].setStyle('display', 'none');
    }
});