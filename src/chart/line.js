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

    showDots:true,
    revealAnim:true,
    
    halfInset:true,
    
    __construct:function(config){
        this.parent(config);
        this.__params(config, ["halfInset","lineStyles","showDots"]);

        
        // this.node.on("mousemove", this.mousemove.bind(this));

        this.chart().on('leavegroup', this.leaveGroup.bind(this));
    },

    __rendered:function(){
        this.parent();
        this.chart().svg().node.on("mousemove", this.mousemove.bind(this));
    },

    leaveGroup:function(){
        this.currentHighlighted = undefined;
    },

    mousemove:function(e){

        var closest;
        // var s = new Date().getTime();

        if(!ludo.geometry.isWithinBBox(e.clientX,e.clientY, this.bbox))return;

        var x = e.clientX - this.bbox.left;
        var y = e.clientY - this.bbox.top;


        var distance = 0;
        var selected = undefined;

        jQuery.each(this.points, function(record, pos){
            var xOff = pos[0] - x;

            xOff*=(xOff*xOff);
            distance = ludo.geometry.distanceBetweenPoints(x, y, xOff, pos[1]);
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