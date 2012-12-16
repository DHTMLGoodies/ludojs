
ludo.FilterList = new Class({
    Extends : ludo.View,
    type : 'FilterList',
    layout : {
        type : 'rows'
    },

    cmpSearch : undefined,
    cmpResult : undefined,

    resultConfig : {},
    filterFieldConfig : {},

    ludoConfig : function(config){
        this.parent(config);
        this.filterLabel = config.filterLabel || 'Search';

        this.resultConfig = config.resultConfig || this.resultConfig;
        this.filterFieldConfig = config.filterFieldConfig || this.filterFieldConfig;
    },

    ludoRendered : function(){
        var filterFieldConfig = Object.merge({
            type : 'form.Text',
            height : 25,
            label : this.filterLabel,
            listeners : {
                key_up : this.filter.bind(this)
            }
        }, this.filterFieldConfig);
        this.cmpSearch = this.addChild(filterFieldConfig);

        var resultConfig = Object.merge(this.resultConfig,{
            type : 'FilterListResult',
            weight:1
        });

        this.cmpResult = this.addChild(resultConfig);
    },

    filter : function(){
        this.cmpResult.filter(this.cmpSearch.getValue());
    },

    getResultComponent : function(){
        return this.children[1];
    },

    getRecordCount : function(){
        return this.getResultComponent().getRecordCount();
    }

});


ludo.FilterListResult = new Class({
    Extends : ludo.View,
    type : 'FilterListResult',
    recordConfig : {
        'default' : {
            tpl : '<div>{title}</div>',
            filterFields : ['title']
        }
    },

    ludoConfig : function(config){
        this.parent(config);
        this.recordConfig = config.recordConfig || this.recordConfig;
    },

    domNodes : {},

    insertJSON : function(json) {
        var records = json.data;
        for(var i=0;i<records.length;i++){
            var template = this.getTpl(records[i]);
            var el = new Element('div');
            this.getBody().adopt(el);
            if(template.cls){
                el.addClass(template.cls);
            }
            var id = 'json-record-' + String.uniqueID();
            el.id = id;
            this.domNodes[id] = el;
            records[i].domId = id;
            records[i].searchText = this.getSearchText(records[i]);

            var content = template.tpl;

            for(var prop in records[i]) {
                var value = records[i][prop];
                value = value ? value : '';
                var reg = new RegExp('{' + prop + '}','g');
                content = content.replace(reg, value);
            }
            el.set('html', content);

            this.fireEvent('createrecord', [el, records[i], i])
        }
    },

    getSearchText : function(record, template){
        template = template || this.getTpl(record);

        var filterFields = template.filterFields;
        var ret = '';
        for(var i=0;i<filterFields.length;i++){
            ret = ret + (record[filterFields[i]] ? record[filterFields[i]] : '');

        }
        return ret.toLowerCase();
    },

    getTpl : function(record){
        if(this.recordConfig[record.type]){
            return this.recordConfig[record.type];
        }
        return this.recordConfig['default']
    },

    filter : function(filterText){
        filterText = filterText.toLowerCase();
        for(var i=0;i<this.data.length;i++){
            if(this.data[i].searchText.indexOf(filterText) != -1){
                this.showRecord(this.data[i]);
            }else{
                this.hideRecord(this.data[i]);
            }
        }
    },

    hideRecord : function(record){
        this.domNodes[record.domId].style.display='none';
    },

    showRecord : function(record){
        this.domNodes[record.domId].style.display='';
    },

    deleteRecord : function(record){
        this.domNodes[record.domId].dispose();
        this.data.erase(record);
    },


    getRecordByProperty : function(key, value){
        for(var i=0;i<this.data.length;i++){
            if(this.data[i][key] == value){
                return this.data[i];
            }
        }
    }


})