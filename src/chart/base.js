ludo.chart.Base = new Class({
    Extends: ludo.canvas.Group,
    fragments: [],
    fragmentType: 'chart.Fragment',
    highlighted: undefined,
    focused: undefined,
    plugins: undefined,

    fragmentMap: {},

    rendered: false,
    bgColor: undefined,
    bgRect: undefined,

    /**
     * Reference to datasource
     * @property {ludo.chart.DataSource} ds
     * @memberof ludo.chart.Base.prototype
     */
    ds : undefined,

    easing:undefined,
    duration: 300,

    data:undefined,

    __construct: function (config) {
        this.parent(config);
        this.setConfigParams(config, ['animate', 'bgColor','duration','data']);
        this.ds = this.getDataSource();

        this.easing = config.easing || ludo.canvas.easing.outSine;
        this.ds.on('load', this.create.bind(this));


        this.ds.on('update', this.onResize.bind(this));

        this.ds.on('select', this.select.bind(this));
        this.ds.on('blur', this.blur.bind(this));
        this.ds.on('enter', this.enter.bind(this));
        this.ds.on('leave', this.leave.bind(this));
    },

    select:function(record){
    },

    blur:function(record){
    },

    enter:function(record){
    },

    leave:function(record){
    },

    ludoEvents: function () {
        this.parent();
        var dp = this.getDataSource();

        dp.addEvent('update', this.update.bind(this));


    },

    createFragments: function () {

        if (this.fragmentType == undefined)return;
        var records = this.getRecords();
        for (var i = 0; i < records.length; i++) {
            this.createFragment(records[i]);
        }
    },

    createFragment: function (record) {

        var f = this.createDependency('fragment' + this.fragments.length,
            {
                type: this.fragmentType,
                record: record,
                parentComponent: this
            });

        this.fragmentMap[record.__uid] = f;
        this.fragments.push(f);

        this.relayEvents(f, ['mouseenter', 'mouseleave']);

        return f;
    },

    getFragments: function () {
        return this.fragments;
    },

    getParent: function () {
        return this.parentComponent;
    },

    getRecords: function () {
        return this.getParent().getDataSource().getData();
    },

    dataProvider: function () {
        return this.parentComponent.getDataSource();
    },

    getDataSource: function () {
        return this.parentComponent.getDataSource();
    },

    getCenter: function () {
        var size = this.getSize();
        return {
            x: size.x / 2,
            y: size.y / 2
        }
    },

    getRadius: function () {
        var c = this.getCenter();
        return Math.min(c.x, c.y);
    },

    create: function () {
        this.renderBackgroundItems();

        if (this.getDataSource().hasData()) {
            this.dataRendered = true;
            this.createFragments();
        }
        this.render();
        this.rendered = true;

        if(this.animate){
            this.renderAnimation();
        }
    },

    renderAnimation:function(){

    },

    renderBackgroundItems:function(){
        if (this.bgColor != undefined) {
            var s = this.getSize();
            this.bgRect = new ludo.canvas.Rect({
                    x: 0, y: 0, width: s.x, height: s.y
                }
            );
            this.bgRect.css('fill', this.bgColor);
            this.append(this.bgRect);
        }
    },

    render: function () {

    },

    update: function (record) {
        this.fireEvent('update', record);
    },

    getFragmentFor: function (record) {
        return this.fragmentMap[record.__uid];
    },

    onResize: function () {
        if (this.bgRect != undefined) {
            var s = this.getSize();
            this.bgRect.attr('width', s.x);
            this.bgRect.attr('height', s.y);
        }
    },

    getCanvas: function () {
        return this.parentComponent.getCanvas();
    },

    getSquareSize: function () {
        var size = this.getSize();
        return Math.min(size.x, size.y);
    },


    dataRendered:false,

    resize:function(coordinates){
        this.parent(coordinates);

        if (!this.dataRendered && this.getDataSource().hasData()) {
            this.create();
        }
        
        var size = this.getSize();
        jQuery.each(this.fragments, function(key, fragment){
            fragment.resize(size.x, size.y); 
        });
    },
    
    onFragmentAction:function(action, fragment, record, node, event){
        this.fireEvent(action, [fragment, record, node, event]);
    },

    getTooltipPosition:function(){
        return 'left';
    },

    tooltipAtMouseCursor:function(){
        return false;
    }
});