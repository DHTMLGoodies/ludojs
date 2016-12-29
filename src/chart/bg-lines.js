ludo.chart.BgLines = new Class({
    Extends: ludo.chart.Base,
    type:'chart.BgLines',
    fragmentType:undefined,

    x:undefined,
    y:undefined,

    lines:undefined,
    animate:false,

    __construct:function(config){
        this.parent(config);
        this.lines = {
            x:[],y:[]
        };
        this.setConfigParams(config, ['x','y']);
    },


    onResize: function () {
        this.parent();
        this.resizeBgLines('x');
        this.resizeBgLines('y');
    },

    render:function(){
        this.resizeBgLines('x');
        this.resizeBgLines('y');
    },

    resizeBgLines: function (axis) {

        if(this[axis] == undefined)return;

        var s = this.getSize();
        var min = axis == 'x' ? this.ds.minX() : this.ds.minY();
        var max = axis == 'x' ? this.ds.maxX() : this.ds.maxY();

        var values = ludo.chart.LineUtil.values(min, max, axis == 'y' ? s.y : s.x, this);
        
        jQuery.each(this.lines[axis], function(i, line){
            line.hide();
        });

        for (var i = 0; i < values.length; i++) {
            var r = (values[i] - min) / (max - min);
            var l = this.getLine(axis, i);

            l.show();
            if (axis == 'y') {
                l.attr('x2', s.x);
                l.attr('y1', s.y - (s.y * r));
                l.attr('y2', s.y - (s.y * r));
            } else {
                l.attr('y2', s.y);
                l.attr('x1', s.x * r);
                l.attr('x2', s.x * r);
            }

        }
    },

    getLine:function(axis, index){
        if(this.lines[axis][index] == undefined){
                var el = new ludo.svg.Node('line', {x1: 0, y1: 0, x2: 0, y2: 0});
                this.append(el);
                el.css(this[axis]);
                this.lines[axis].push(el);
        }
            return this.lines[axis][index];
    }

    

});