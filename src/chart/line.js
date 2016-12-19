/**
 * Line Chart View
 * This SVG View renders a line chart. This view should be a child of ludo.chart.Chart.
 *
 * This class extends ludo.chart.Bar
 *
 * @class ludo.chart.Line
 * @augments ludo.chart.Bar
 * @param {Object} config
 * @param {Object} config.lineStyles
 * @param {Boolean} config.showDots
 */
ludo.chart.Line = new Class({
    Extends: ludo.chart.Bar,
    fragmentType: 'chart.LineItem',
    type:'chart.Line',

    lineStyles:undefined,

    currentHighlighted:undefined,

    parentPos:undefined,
    showDots:true,
    revealAnim:true,
    
    halfInset:true,
    
    __construct:function(config){
        this.parent(config);
        this.setConfigParams(config, ["lineStyles","showDots"]);

        this.node.on("mousemove", this.mousemove.bind(this));
    },

    mousemove:function(e){

        if(this.parentPos == undefined){
            this.parentPos = this.node.position();
        }
        var closest;
        var s = new Date().getTime();

        var x = e.clientX - this.parentPos.left;
        var y = e.clientY - this.parentPos.top;

        var distance = 0;
        var selected = undefined;

        jQuery.each(this.points, function(record, pos){
            var xOff = pos[0] - x;
            xOff*=xOff;
            distance = ludo.geometry.distanceBetweenPoints(0, y, xOff, pos[1]);
            if(closest == undefined || distance < closest){
                closest = distance;
                selected = record;
            }
        });

        if(selected != this.currentHighlighted){
            if(this.currentHighlighted){
                this.ds.leaveId(this.currentHighlighted);
            }
            this.ds.enterId(selected);
            this.currentHighlighted = selected;
        }

        // console.log(new Date().getTime() - s);
    },

    resizeElements:function(){
        this.resizeOutline();
        this.resizeBgLines();
        this.resizeLines();
        jQuery.each(this.nodes.outline, function (key, el) {
            el.toFront();
        });

    },

    createFragments:function(){
        this.parent();

        if(this.lineStyles != undefined){
            var s = this.lineStyles;
            jQuery.each(this.fragments, function(key, fragment){
                fragment.getNode().css(s);
            });
        }

    },


    renderAnimation:function(){
        if(this.revealAnim){
            this.reveal();
        }else{
            this.parent();
        }
    },


    resizeLines:function(){
        var size = this.getSize();

        jQuery.each(this.fragments, function(key, fragment){
            fragment.resize(size.x, size.y);
        });
        
        
    },

    setPoint:function(record, x, y){
        if(this.points == undefined){
            this.points = {};
        }

        this.points[record.id] = [x,y];
    }

});