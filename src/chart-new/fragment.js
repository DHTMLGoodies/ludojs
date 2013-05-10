ludo.chart.Fragment = new Class({
    Extends:ludo.Core,
    record:undefined,
    nodes:[],

    ludoConfig:function (config) {
        this.parent(config);
        this.setConfigParams(config, ['record','parentComponent']);
    },

    getParent:function(){
        return this.parentComponent;
    },

    createNode:function(tagName, properties, text){
        var node = new ludo.canvas.Node(tagName, properties, text);
        this.dependency['node-' + this.nodes.length] = node;
        this.nodes.push(node);
        return node;
    }
});