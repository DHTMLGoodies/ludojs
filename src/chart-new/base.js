ludo.chart.Base = new Class({
    Extends:ludo.canvas.Group,
    fragments:[],
    fragmentType : 'chart.Fragment',

    ludoConfig:function(config){
        this.parent(config);
        var dp = this.dataProvider();
        if(dp.hasRecords()){
            this.createFragments();
        }
    },

    ludoEvents:function(){
        this.parent();
        var dp = this.dataProvider();
        dp.addEvent('createRecord', this.createFragment.bind(this));
    },

    createFragments:function(){
        var records = this.getRecords();
        for(var i=0;i<records.length;i++){
            this.createFragment(records[i]);
        }
    },

    createFragment:function (record) {
        var f = this.createDependency('fragment' + this.fragments.length,
            {
                type:this.fragmentType,
                record:record,
                parentComponent:this
            });
        this.fragments.push(f);
        return f;
    },

    getFragments:function(){
        return this.fragments;
    },

    getParent:function(){
        return this.parentComponent;
    },

    getRecords:function(){
        return this.getParent().getDataProvider().getRecords();
    },

    dataProvider:function(){
        return this.parentComponent.getDataProvider();
    },

    getCenter:function () {
        return {
            x : this.width / 2,
            y : this.height /2
        }
    },

    getRadius:function(){
        return this.getCenter().x *.9;
    },

    update:function(){

    }

});