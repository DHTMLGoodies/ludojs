/**
 * Displays bar labels for a bar chart
 * @class ludo.chart.BarLabels
 * @param {Object} config
 * @param {Object} config.styling Text styling for the labels.
 */
ludo.chart.BarLabels = new Class({
    Extends: ludo.chart.Base,
    fragmentType:undefined,

    orientation : undefined,
    styling:undefined,

    textNodes:undefined,

    padding:0,

    __construct:function(config){
        this.parent(config);
        this.setConfigParams(config, ['orientation', 'styling','padding']);
        if(this.orientation==undefined)this.orientation = 'horizontal';
        this.styling = this.styling || {};
        this.textNodes = [];

    },

    render:function(){
        this.parent();
        var len = this.getDataSource().length();
        for(var i=0;i<len;i++){
            this.getTextNode(i);
        }
        this.resizeBarLabels();

    },

    onResize:function(){
        this.parent();
        this.resizeBarLabels();
    },

    resizeBarLabels:function(){
        var size = this.getSize();
        var len = this.length();
        var i,el;
        if(this.orientation == 'horizontal'){
            var width = size.x / len;
            var y = this.getCenter().y;
            for(i=0;i<len;i++){
                el = this.getTextNode(i);
                el.attr('x', (width * i) + (width / 2));
                el.attr('y', y);
            }
        }else{

            var height = size.y / len;
            for(i=0;i<len;i++){
                el = this.getTextNode(i);
                el.attr('x', size.x - this.padding);
                el.attr('y', (i*height) + (height/2));
            }
        }
    },


    getTextNode:function(index){


        if(this.textNodes[index] == undefined){

            var el = new ludo.canvas.Text("", {});
            this.textNodes.push(el);
            if(this.orientation == 'horizontal'){
                el.textAnchor('middle');
            }else{
                el.textAnchor('end');
                el.attr('alignment-baseline', 'middle');
            }
            el.css(this.styling);
            this.append(el);
        }

        this.textNodes[index].text(this.getText(index));
        return this.textNodes[index];

    },

    getText:function(index){
        if(this.data != undefined)return this.data[index];
        var ds = this.getDataSource();
        var rec = ds.data[index];
        return ds.textOf(rec, this)
    },
    
    length:function(){
        if(this.data != undefined)return this.data.length;
        return this.getDataSource().length;
    }
});