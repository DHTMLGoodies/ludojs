/**
 * This class stores modified records in a tree
 * @namespace ludo.tree
 * @class ludo.tree.Modifications
 */
ludo.tree.Modifications = new Class({

    modifications:[],
    tree:undefined,

    initialize:function(config){
        this.tree = config.tree;
    },

    getModifications:function () {
        return this.modifications;
    },

    storeUpdatedRecord:function (record) {
        var obj = {
            record:this.getRecordClone(record),
            action:'update'
        };
        this.modifications.push(obj);
    },

    storeRemovedRecord:function (record, parentRecord) {
        var obj = {
            record:this.getRecordClone(record),
            parent:this.getRecordClone(parentRecord),
            action:'remove'
        };
        this.modifications.push(obj);
    },

    storeAddedRecord:function (record, referenceRecord, position) {
        var obj = {
            record:this.getRecordClone(record),
            action:'add'
        };
        if (position == 'sibling') {
            obj.sibling = this.getRecordClone(referenceRecord);
            obj.parent = this.getRecordClone(this.tree.getParentRecord(record))
        } else {
            obj.parent = this.getRecordClone(referenceRecord);
        }
        this.modifications.push(obj);
    },

    getRecordClone:function (record) {
        var ret = Object.clone(record);
        ret.children = undefined;
        return ret;
    },

    clearDirtyStorage:function(){
        this.modifications = [];
    }

});