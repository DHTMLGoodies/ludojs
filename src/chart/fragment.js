ludo.chart.Fragment = new Class({
    Extends:ludo.Core,
    record:undefined,
    nodes:[],

    rendering:{},

    ds:undefined,

    __construct:function (config) {
        this.parent(config);
        this.setConfigParams(config, ['record','parentComponent']);
        this.createNodes();

        this.ds = this.parentComponent.ds;
    },

    createNodes:function(){

    },

    getDataSource:function(){
        return this.getParent().getDataSource();
    },

    ludoEvents:function(){
        this.parent();
        this.getParent().dataProvider().addEvent('update', this.update.bind(this));

        var ds = this.getDataSource();

        var recs = this.record.children != undefined ? this.record.children: [this.record];

        jQuery.each(recs, function(index, record){
            ds.on('select' + record.__uid, this.focus.bind(this));
            ds.on('blur' + record.__uid, this.blur.bind(this));
            ds.on('enter' + record.__uid, this.enter.bind(this));
            ds.on('leave' + record.__uid, this.leave.bind(this));
        }.bind(this));


    },

    getParent:function(){
        return this.parentComponent;
    },

    createNode:function(tagName, properties, text){
        var node;

        node = new ludo.canvas.Node(tagName, properties, text);

        this.dependency['node-' + this.nodes.length] = node;
        this.nodes.push(node);

        if(node.mouseenter != undefined){
            node.mouseenter(this.enterNode.bind(this));
            node.mouseleave(this.leaveNode.bind(this));
        }else{
            node.on('mouseenter', this.enterNode.bind(this));
            node.on('mouseleave', this.leaveNode.bind(this));

        }
        node.on('click', this.clickNode.bind(this));

        node.css('cursor','pointer');

        this.getParent().append(node);

		this.relayEvents(node, ['mouseenter','mouseleave']);

        return node;
    },

    enterNode:function(){
        this.ds.enter(this.record);
    },

    leaveNode:function(){
        this.ds.leave(this.record);
    },

    clickNode:function(){
        this.ds.select(this.record);
    },

    createStyle:function(styles){
        var p = new ludo.canvas.Paint(styles);
        this.getCanvas().appendDef(p);
        return p;
    },

    highlight:function(){

    },

    update:function(){
        // animate new size
    },

    click:function(){
        this.clicked = true;
    },

    getCanvas:function(){
        return this.getParent().getParent().getCanvas();
    },

    storeRendering:function(rendering){
        this.rendering = rendering;
    },

    focus:function(){

    },

    blur:function(){

    },

    enter:function(){

    },

    leave:function(){

    },

    getRecord:function(){
        return this.record;
    },

    animate:function(){
        
    }
});