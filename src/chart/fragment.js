ludo.chart.Fragment = new Class({
    Extends:ludo.Core,
    record:undefined,
    nodes:[],

    rendering:{},

    __construct:function (config) {
        this.parent(config);
        this.setConfigParams(config, ['record','parentComponent']);
        this.createNodes();
    },

    createNodes:function(){

    },

    ludoEvents:function(){
        this.parent();
        this.getParent().dataProvider().addEvent('update', this.update.bind(this));

        this.record.addEvent('focus', this.focus.bind(this));
        this.record.addEvent('blur', this.blur.bind(this));
        this.record.addEvent('enter', this.enter.bind(this));
        this.record.addEvent('leave', this.leave.bind(this));
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
            node.mouseenter(this.record.enter.bind(this.record));
            node.mouseleave(this.record.leave.bind(this.record));
        }else{
            node.on('mouseenter', this.record.enter.bind(this.record));
            node.on('mouseleave', this.record.leave.bind(this.record));

        }
        node.on('click', this.record.click.bind(this.record));

        node.css('cursor','pointer');

        this.getParent().append(node);

		this.relayEvents(node, ['mouseenter','mouseleave']);

        return node;
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
    }
});