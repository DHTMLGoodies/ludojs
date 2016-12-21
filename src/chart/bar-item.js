ludo.chart.BarItem = new Class({

    Extends: ludo.chart.Fragment,
    type:'chart.BarItem',

    area: undefined,

    __construct: function (config) {
        this.parent(config);

    },

    createNodes: function () {

        var recs = this.record[this.ds.childKey]!= undefined ? this.record[this.ds.childKey] : [this.record];


        jQuery.each(recs, function (i, record) {
            var n = this.createNode('rect', {
                x: 0, y: 0, width: 0, height: 0
            }, undefined, record);
            n.css('fill', record.__color);
        }.bind(this));
    },

    setArea: function (x, y, width, height) {
        this.area.x = x;
        this.area.y = y;
        this.area.width = width;
        this.area.height = height;


        var curX = this.area.x;
        var curY = 0;
        var orientation = this.parentComponent.orientation;

        var stacked = this.parentComponent.stacked;

        var curWidth = !stacked && orientation == 'horizontal' ? width / this.nodes.length : width;
        var curHeight = !stacked && orientation == 'vertical' ? height / this.nodes.length : height;


        for (var i = 0; i < this.nodes.length; i++) {
            var n = this.nodes[i];
            n.set('x', curX);
            n.set('y', y);
            n.set('width', curWidth);
            n.set('height', curHeight);


            var r = this.getRatio(i);

            if (orientation == 'horizontal') {
                var h = this.area.height * r;
                n.attr('height', h);
                n.attr('y', this.area.height - curY - h);
                if(!stacked)curX += curWidth;else curY+= h;

            } else {
                n.attr('width', this.area.width * r);
                if(!stacked)curY += curHeight;else curX += this.area.width * r;
            }
        }

    },

    getRatio: function (index) {

        var rec = this.record.children != undefined ? this.record.children[index] : this.record;

        var min = this.ds.min();
        var max = this.ds.max();

        var val = this.ds.valueOf(rec, this);

        return (val - min) / (max - min);
    },

    enter: function (record) {
        this.map[record.id].css('fill', record.__colorOver);
    },

    leave: function (record) {
        this.map[record.id].css('fill', record.__color);
    },

    click: function (record) {

    },

    animate: function () {

        var y = this.area.height;
        var x = 0;

        var stacked = this.parentComponent.stacked;

        for (var i = 0; i < this.nodes.length; i++) {
            var r = this.getRatio(i);
            var b = this.nodes[i];

            if (this.parentComponent.orientation == 'horizontal') {
                b.attr('height', 0);
                b.attr('y', this.area.height);

                var s = this.area.height;
                var h = s * r;

                b.animate({
                        'height': h,
                        'y' : y - h
                    },
                    this.parentComponent.duration,
                    this.parentComponent.easing);

                if(stacked){
                    y-=h;
                }
            } else {
                var w = this.area.width * r;
                b.attr('width', 0);
                b.attr('x', 0);
                b.animate({
                    'width': w,
                    'x' : x
                }, this.parentComponent.duration, this.parentComponent.easing);

                if(stacked){
                    x += w;
                }

            }

        }
    }


});