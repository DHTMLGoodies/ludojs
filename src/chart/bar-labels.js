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

    __construct:function(config){
        this.parent(config);
        this.setConfigParams(config, ['orientation', 'styling']);
        if(this.orientation==undefined)this.orientation = 'horizontal';
        this.styling = this.styling || {};
        this.textNodes = [];

    },

    render:function(){
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
        var len = this.getDataSource().length();
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
                el.attr('x', size.x);
                el.attr('y', size.y - (i*height) - (height/2));
            }
        }
    },


    getTextNode:function(index){
        var ds = this.getDataSource();
        var rec = ds.data[index];

        if(this.textNodes[index] == undefined){

            var el = new ludo.canvas.Text("", {});
            this.textNodes.push(el);
            if(this.orientation == 'horizontal'){
                el.textAnchor('middle');
            }else{
                el.textAnchor('end');
            }
            el.css(this.styling);
            this.append(el);
        }

        this.textNodes[index].text(this.getDataSource().textOf(rec, this));

        return this.textNodes[index];

    }
});