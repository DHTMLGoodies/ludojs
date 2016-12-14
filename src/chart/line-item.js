ludo.chart.LineItem = new Class({

    Extends: ludo.chart.Fragment,
    type:'chart.LineItem',

    dots:undefined,


    createNodes:function(){
        this.parent();
        var n = this.createNode('path', {
            'd' : this.getPath()
        });
        n.css("fill","none");
        n.attr("stroke", this.record.__color);
        n.attr("stroke-linejoin", "round");
        n.attr("stroke-linecap", "round");

        this.dots = [];

        var c = this.record.getChildren();
        for(var i=0;i<c.length;i++){
            var d = new ludo.chart.LineDot(
                {
                    record:c[i],
                    ds : this.ds,
                    renderTo: this.getParent(),
                    parentComponent:this
                });
            this.dots.push(d);
        }
    },

    dsEvent:function(){

    },

    getPath:function(zero){
        var len = this.record.getChildren().length;

        var p = ["M"];

        for(var i=0;i<len;i++){
            if(i>0)p.push("L");
            p.push(this.xPos(i));
            p.push(zero ? this.area.height : this.yPos(i));
        }

        return p.join(" ");
    },

    resize:function(width,height){
        this.parent(width,height);

        this.nodes[0].set("d", this.getPath());

        this.positionDots();
    },

    xPos:function(index){
        var len = this.record.getChildren().length;
        var colWidth = this.area.width / len;
        return colWidth * index + (colWidth / 2);
    },

    yPos:function(index){

        if(!this.ds)return this.area.height;

        var val = this.ds.valueOf(this.record.getChild(index), this);
        var min = this.ds.min();
        var max = this.ds.max();
        return this.area.height - ((val - min ) / (max- min) * this.area.height);
    },



    animate:function(){
        this.nodes[0].set('d', this.getPath(true));


        this.hideDots();

        var newPath = this.getPath();

        this.nodes[0].animate({
            'd' : newPath
        }, 500, ludo.canvas.easing.outSine, this.showDots.bind(this));
    },

    hideDots:function(){
        jQuery.each(this.dots, function(index, dot){
            dot.hide();
        });
    },

    showDots:function(){
        jQuery.each(this.dots, function(index, dot){

            dot.show();
        }.bind(this));

        this.positionDots();
    },

    positionDots:function(){
        var p = this.getParent();
        var recs = this.record.getChildren();
        jQuery.each(this.dots, function(index, dot){
            var x = this.xPos(index);
            var y = this.yPos(index);
            dot.position(x, y);
            p.setPoint(recs[index], x, y);
        }.bind(this));
    }


});