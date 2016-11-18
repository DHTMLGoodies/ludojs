/**
 * @namespace ludo.tree
 * @class ludo.tree.Filter
 */

ludo.tree.Filter = new Class({
    data : [],
    component : null,
    timeStamp:0,
    currentSearchValue:'',

    initialize : function(config) {
        this.data = config.data;
        this.component = config.component;
    },

    setData : function(data){
        this.data = data;
        this.prepareDataForSearch();
    },

    filter : function(searchString){
        searchString = searchString.toLowerCase();
        this.filterRecords(searchString, this.data);
    },

    filterRecords : function(searchString, records){

        for(var i=0;i<records.length;i++){
            if(!searchString || this.hasRecordMatch(searchString, records[i])){
                if(!searchString){
                    this.component.showNode(records[i]);

                    this.component.showBranch(records[i]);
                }
            }else if(this.hasBranchMatch(searchString, records[i])){
                this.component.showNode(records[i]);
                this.component.expandButNotLoad(records[i]);
                if(records[i].children && records[i].children.length){
                    this.filterRecords(searchString, records[i].children);
                }
            }else{
                this.component.hideNode(records[i]);
            }
        }
    },

    hasRecordMatch : function(searchString, record){
        return record.text.indexOf(searchString)>=0;
    },

    hasBranchMatch : function(searchString, record){
        return record.branchText.indexOf(searchString)>=0;
    },

    prepareDataForSearch : function(){
        for(var i=0;i<this.data.length;i++){
            this.data[i].branchText = this.data[i].text = this.getSearchText(this.data[i]);
            if(this.data[i].children){
                this.setBranchText(this.data[i].children, [this.data[i]]);
            }
        }
    },

    setBranchText : function(children, parentNodes){
        for(var i=0;i<children.length;i++){
            children[i].branchText = '';
            var filterText = this.getSearchText(children[i]);
            children[i].branchText = filterText;
            children[i].text = filterText;

            for(var j=0;j<parentNodes.length;j++){
				parentNodes[j].branchText = [parentNodes[j].branchText, filterText].join('');
            }

            if(children[i].children){
                this.setBranchText(children[i].children, parentNodes.concat([children[i]]));
            }
        }
    },

    getSearchText  :function(record){
        if(record && record.title){
            return record.title.toLowerCase();
        }
        return '';
    }
});