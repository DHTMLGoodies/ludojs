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
        fps:33
    },

    addOns:undefined,

    fragmentMap:{},

    rendered:false,

    ludoConfig:function (config) {
        this.parent(config);
        this.setConfigParams(config, ['animation']);

        this.create.delay(50, this);
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
        var f = this.createDependency('fragment' + this.fragments.length,
            {
                type:this.fragmentType,
                record:record,
                parentComponent:this
            });

        this.fragmentMap[record.getUID()] = f;
        this.fragments.push(f);

		//this.relayEvents(f, ['mouseenter','mouseleave']);

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
        var size = this.getSize();
        
        return {
            x:size.x / 2,
            y:size.y / 2
        }
    },

    getRadius:function () {
        var c = this.getCenter();
        return Math.min(c.x, c.y);
    },

    create:function(){

        if(this.dataProvider().hasRecords()){
            this.createFragments();
        }
        this.render();
        this.rendered = true;
    },

    render:function () {

    },

    update:function (record) {
        this.fireEvent('update', record);
    },

    getFragmentFor:function(record){
        return this.fragmentMap[record.getUID()];
    },

    onResize:function(){

    },

	getCanvas:function(){
		return this.parentComponent.getCanvas();
	},

    getSquareSize:function(){
        var size = this.getSize();
        return Math.min(size.x, size.y);
    }
});