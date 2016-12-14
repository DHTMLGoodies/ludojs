/**
 * Created by alfmagne1 on 14/12/2016.
 */
ludo.chart.LineDot = new Class({
    Extends:ludo.canvas.Path,
    type:'chart.LineDot',

    shape:undefined,
    record:undefined,
    size:8,

    initialize:function(record, properties){
        this.parent(undefined, properties);
        this.record = record;
        this.shape = 'circle';

        switch(this.shape){
            case 'circle':
                this.attr("stroke-linejoin", "round");
                this.attr("stroke-linecap", "round");
                this.attr("stroke-width", this.size);
                this.css("stroke", this.record.__color);
                this.css("cursor", "pointer");
                break;

        }


    },

    position:function(x,y){
        var p;
        switch(this.shape){
            case 'circle':
                 p = "M " + x + " " + y + " L " + x + " " + y;
                break;
        }

        if(p){
            this.set("d", p);
        }
    }
});