ludo.chart.Fragment = new Class({
    Extends:ludo.Core,
    record:undefined,
    nodes:[],
    map:undefined,
    rendering:{},

    ds:undefined,

    area:undefined,

    points:undefined,

    __construct:function (config) {
        this.parent(config);
        this.__params(config, ['record','parentComponent']);
        var s = this.parentComponent.getSize();
        this.area = {
            x: 0, y: 0, width: s.x, height: s.y
        };
        this.map = {};
        this.ds = this.parentComponent.getDataSource();
        this.createNodes();

    },

    chart:function(){
        return this.parentComponent.chart();
    },

    getNode:function(){
        return this.nodes[this.nodes.length-1];
    },

    createNodes:function(){

    },
    
    getDataSource:function(){
        return this.getParent().getDataSource();
    },

    ludoEvents:function(){
        this.parent();
        this.ds.addEvent('update', this.update.bind(this));

        var ds = this.getDataSource();

        var recs = this.record.children != undefined ? this.record.children: [this.record];

        if(this.parentComponent.interactive){
            jQuery.each(recs, function(index, record){
                ds.on('select' + record.__uid, this.focus.bind(this));
                ds.on('blur' + record.__uid, this.blur.bind(this));
                ds.on('enter' + record.__uid, this.enter.bind(this));
                ds.on('leave' + record.__uid, this.leave.bind(this));
            }.bind(this));
        }

    },

    getParent:function(){
        return this.parentComponent;
    },

    createNode:function(tagName, properties, text, record){
        var node;

        node = new ludo.svg.Node(tagName, properties, text);

        this.dependency['node-' + this.nodes.length] = node;
        this.nodes.push(node);

        if(record != undefined){

            node.attr("ludojs-svg-id", record.id);
            
            this.map[record.id] = node;
        }

        if(node.mouseenter != undefined){
            node.mouseenter(this.enterNode.bind(this));
            node.mouseleave(this.leaveNode.bind(this));
        }else{
            node.on('mouseenter', this.enterNode.bind(this));
            node.on('mouseleave', this.leaveNode.bind(this));

        }
        node.on('click', this.clickNode.bind(this));

        node.css('cursor','pointer');

        this.getParent().getChartNode().append(node);

		this.relayEvents(node, ['mouseenter','mouseleave']);

        return node;
    },

    enterNode:function(e){
        this.dsEvent(e, 'enter');
    },

    leaveNode:function(e){
        this.dsEvent(e, 'leave');
    },

    clickNode:function(e){
        this.dsEvent(e, 'select');
    },

    dsEvent:function(e, method){
        var id = ludo.svgEngine.get(e.target, "ludojs-svg-id");
        var rec = this.record;
        if(id){
            this.ds[method + 'Id'](id);
            rec = this.ds.byId(id);
        }else{
            this.ds[method](this.record);
        }

        this.parentComponent.onFragmentAction(method, this, rec, this.map[rec.id], e);
    },

    resize:function(width,height){
        this.area.width = width;
        this.area.height = height;
    },

    getEventNode:function(e){
        return e.target;
    },

    createStyle:function(styles){
        var p = new ludo.svg.Paint(styles);
        this.svg().appendDef(p);
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

    svg:function(){
        return this.getParent().getParent().svg();
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