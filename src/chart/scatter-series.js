ludo.chart.ScatterSeries = new Class({
    Extends: ludo.chart.Fragment,
    type:'chart.ScatterSeries',
    dots:undefined,

    highlightNode:undefined,

    dotSize:8,

    createNodes:function(){
        this.parent();
        this.dots=[];
        var color = this.record.__color;

        this.highlightNode = new ludo.svg.Node('circle', {
            cx:0, cy:0, r: this.dotSize * 1.2
        });
        this.highlightNode.hide();
        this.highlightNode.set("fill", this.record.__colorOver);
        this.highlightNode.set('fill-opacity', 0.2);

        this.getParent().getChartNode().append(this.highlightNode);
        
        var children = this.record.getChildren();
        jQuery.each(children, function(index, child){

            var node = this.createNode('path', {
                d: ludo.chart.ChartUtil.getShape(this.record.__shape, this.dotSize)
            }, '', child);
            node.set('fill', color);
            node.set('stroke', this.record.__stroke);
            node.set('stroke-width', 0);
            node.set('data-index', index);
            this.dots.push(node);
        }.bind(this));
    },

    enterNode:function(event, node){
        var tr = node.getTranslate();
        this.highlightNode.setTranslate(tr[0], tr[1]);
        this.highlightNode.show();

        node.set('stroke-width', 1);
        this.animatePath(node, this.dotSize * 1.4);

        var rec = this.record.getChild(node.get('data-index'));

        this.parentComponent.onFragmentAction('enter', this, rec, this.highlightNode, {});
    },

    leaveNode:function(event, node){
        this.parent(event, node);
        this.highlightNode.hide();
        node.set('stroke-width', 0);
        this.animatePath(node, this.dotSize);
    },

    animatePath:function(node, size){
        var path = ludo.chart.ChartUtil.getShape(this.record.__shape, size);
        node.animate({
            d: path
        },{
            duration:100
        });

    },

    resize:function(width,height){
        this.parent(width,height);
        this.positionNodes();
    },

    animate:function(){
        this.positionNodes();
        /*
        jQuery.each(this.dots, function(index, dot){
            dot.set('r', 0.1);
            dot.animate({r : 5});
        }.bind(this));
        */
    },

    positionNodes:function(){

        var children = this.record.getChildren();

        var minX = this.ds.minX();
        var maxX = this.ds.maxX();
        var minY = this.ds.minY();
        var maxY = this.ds.maxY();



        jQuery.each(children, function(index, record){

            var x = (record.x - minX) / (maxX - minX);
            var y = (record.y - minY) / (maxY - minY);
            x*= this.area.width;
            y*= this.area.height;
            y = this.area.height - y;
            this.dots[index].setTranslate(x,y);

        }.bind(this));
    }
});