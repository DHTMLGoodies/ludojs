ludo.SelectionGridExternalDataSource = new Class({
    Extends: ludo.SelectionGrid,

    getCellsInColumn : function(col, fromRow, toRow){
        var ret = this.parent(col, fromRow, toRow);

        for(var i=0, count=ret.length; i<count; i++){
            for(var j=0;j<ret[i].length; j++){
                ret[i][j].externalSourceId = this.getRemoteParam('id')
            }
        }
        return ret;
    }

});