/**
 * Created by alfmagne1 on 14/12/2016.
 */
ludo.chart.LineDot = new Class({
    Extend: Events,
    type:'chart.LineDot',

    shape:undefined,
    record:undefined,
    size:8,
    ds:undefined,

    node:undefined,
    
    nodeHighlight:undefined,
    renderTo:undefined,

    x:undefined,
    y:undefined,

    parentComponent:undefined,

    initialize:function(props){
        this.record = props.record;
        this.shape = 'circle';
        this.renderTo = props.renderTo;
        this.parentComponent = props.parentComponent;

        this.node = new ludo.canvas.Path();

        switch(this.shape){
            case 'circle':
                this.node.attr("stroke-linejoin", "round");
                this.node.attr("stroke-linecap", "round");
                this.node.attr("stroke-width", this.size);
                this.node.css("stroke", this.record.getParent().__color);
                this.node.css("cursor", "pointer");
                break;

        }

        this.renderTo.append(this.node);
        


        this.ds = props.ds;

        this.ds.on("enter" + this.record.__uid, this.enter.bind(this));
        this.ds.on("leave" + this.record.__uid, this.leave.bind(this));

    },

    enter:function(){
        if(this.nodeHighlight == undefined){
            this.nodeHighlight = new ludo.canvas.Circle({
                r : this.size
            });
            this.nodeHighlight.css({
               'stroke-opacity': 0.5,
                fill:'none',
                'stroke-width' : 2,
                stroke: this.record.getParent().__color

            });


            this.renderTo.append(this.nodeHighlight);
        }
        this.nodeHighlight.set("cx", this.x);
        this.nodeHighlight.set("cy", this.y);
        this.nodeHighlight.show();
        
        this.parentComponent.parentComponent.onFragmentAction('enter', this.parentComponent, this.record, this.nodeHighlight, {});
        
    },

    leave:function(){
        this.nodeHighlight.hide();
    },


    position:function(x,y){
        this.x = x; this.y = y;
        var p;
        switch(this.shape){
            case 'circle':
                 p = "M " + x + " " + y + " L " + x + " " + y;
                break;
        }

        if(p){
            this.node.set("d", p);
        }
    },

    hide:function(){
        this.node.hide();
    },

    show:function(){
        this.node.show();
    }
});