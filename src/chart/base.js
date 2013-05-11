ludo.chart.Base = new Class({
    Extends:ludo.canvas.Group,
    fragments:[],
    fragmentType:'chart.Fragment',
    /**
     * Reference to current highlighted record
     * @property {dataSource.Record} record
     * @private
     */
    highlighted:undefined,
    focused:undefined,
    animation:{
        duration:1,
        fps:33,
        enabled:true
    },
    addOns:undefined,

    fragmentMap:{},

    ludoConfig:function (config) {
        this.parent(config);
        this.setConfigParams(config, ['animation']);
        var dp = this.dataProvider();
        if (dp.hasRecords()) {
            this.createFragments();
        }

        this.render.delay(50, this);
    },

    ludoEvents:function () {
        this.parent();
        var dp = this.dataProvider();
        dp.addEvent('createRecord', this.createFragment.bind(this));
        dp.addEvent('update', this.update.bind(this));
    },

    createFragments:function () {
        var records = this.getRecords();
        for (var i = 0; i < records.length; i++) {
            this.createFragment(records[i]);
        }
    },

    createFragment:function (record) {

        record.addEvent('enter', this.enterRecord.bind(this));
        record.addEvent('leave', this.leaveRecord.bind(this));
        record.addEvent('focus', this.focusRecord.bind(this));
        record.addEvent('blur', this.blurRecord.bind(this));


        var f = this.createDependency('fragment' + this.fragments.length,
            {
                type:this.fragmentType,
                record:record,
                parentComponent:this
            });

        this.fragmentMap[record.getUID()] = f;
        this.fragments.push(f);
        return f;
    },

    getFragments:function () {
        return this.fragments;
    },

    getParent:function () {
        return this.parentComponent;
    },

    getRecords:function () {
        return this.getParent().getDataProvider().getRecords();
    },

    dataProvider:function () {
        return this.parentComponent.getDataProvider();
    },

    getCenter:function () {
        return {
            x:this.width / 2,
            y:this.height / 2
        }
    },

    getRadius:function () {
        var c = this.getCenter();
        return Math.min(c.x, c.y);
    },

    enterRecord:function (record) {
        if (this.highlighted) {
            this.highlighted.leave();
        }
        this.fireEvent('enterRecord', record);
        this.highlighted = record;
    },

    leaveRecord:function (record) {
        this.highlighted = undefined;

        this.fireEvent('leaveRecord', record);
    },

    focusRecord:function(record){
        this.fireEvent('focusRecord', record);
        this.focused = record;
    },

    blurRecord:function(record){
        this.fireEvent('blurRecord', record);
        this.focused = undefined;
    },

    render:function () {

    },

    update:function (record) {
        console.log('update');
        this.fireEvent('update', record);
    },

    getFragmentFor:function(record){
        return this.fragmentMap[record.getUID()];
    },

    onResize:function(){

    }
});