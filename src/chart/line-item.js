ludo.chart.LineItem = new Class({

    Extends: ludo.chart.Fragment,
    type: 'chart.LineItem',

    dots: undefined,
    filled: false,

    __construct: function (config) {
        if (config.filled != undefined)this.filled = config.filled;
        this.parent(config);
    },

    createNodes: function () {
        this.parent();

        if (this.filled) {
            var bg = this.createNode('path', {
                d: this.getPath(false, true)
            });
            bg.css("fill", this.record.__color);
            bg.css("fill-opacity", 0.3);

            var s = this.getParent().areaStyles;
            if(s != undefined)
                bg.css(s);

        }



        var n = this.createNode('path', {
            'd': this.getPath(false, false)
        });
        n.css("fill", "none");
        n.attr("stroke", this.record.__color);
        n.attr("stroke-linejoin", "round");


        this.dots = [];

        var c = this.record.getChildren();
        for (var i = 0; i < c.length; i++) {
            var d = new ludo.chart.LineDot(
                {
                    record: c[i],
                    ds: this.ds,
                    renderTo: this.getParent().getChartNode(),
                    parentComponent: this
                });
            this.dots.push(d);

            if (this.parentComponent.interactive) {
                d.on('enter', this.enterDot.bind(this));
                d.on('leave', this.leaveDot.bind(this));
            }
        }

        this.chart().on("entergroup", this.leaveDot.bind(this));
    },

    dsEvent: function () {

    },

    enterDot: function () {
        if (this.nodes.length == 1) {
            this.nodes[0].css('stroke-width', 3);

        }
    },

    leaveDot: function () {
        if (this.nodes.length == 1) {
            this.nodes[0].css('stroke-width', 2);
        }
    },

    getPath: function (zero, filled) {
        var len = this.length();

        var p = ["M"];

        var stacked = this.getParent().stacked;

        for (var i = 0; i < len; i++) {
            if (i > 0)p.push("L");
            var x = this.xPos(i);
            if (i == 0 && filled) {
                if(stacked){
                    for(var j=len-1;j>=0;j--){
                        p.push(this.xPos(j));
                        p.push(zero ? this.area.height : this.yPos(j, true))
                    }
                }else{
                    p.push(x);
                    p.push(this.area.height);
                }
            }
            p.push(x);
            p.push(zero ? this.area.height : this.yPos(i));

            if (i == len - 1 && filled) {
                if(!stacked){
                    p.push(this.xPos(i));
                    p.push(this.area.height);

                }
                p.push(" Z");
            }
        }


        return p.join(" ");
    },

    resize: function (width, height) {
        this.parent(width, height);

        if (this.filled) {
            this.nodes[0].set("d", this.getPath(false, true));
        }
        this.nodes[this.nodes.length - 1].set("d", this.getPath());

        this.positionDots();
    },

    xPos: function (index) {
        var c = this.parentComponent.halfInset;
        var len = this.length();
        if (!c)len--;
        var colWidth = this.area.width / len;
        var x = colWidth * index;
        if (!!c)x += (colWidth / 2);
        return x;
    },

    yPos: function (index, startVal) {
        if (!this.ds)return this.area.height;
        var rec = this.record.getChild(index);
        var val = this.ds.valueOf(rec, this);
        if(this.parentComponent.stacked){
            if(startVal){
                val = this.ds.indexStartValueOf(rec);
            }else{
                val += this.ds.indexStartValueOf(rec);
            }
        }
        var min = this.ds.min();
        var max = this.ds.max();
        return this.area.height - ((val - min ) / (max - min) * this.area.height);
    },

    animate: function () {
        this.nodes[this.nodes.length - 1].set('d', this.getPath(true));

        if (this.filled) {
            this.nodes[0].set('d', this.getPath(true, true));
        }
        this.hideDots();

        var newPath = this.getPath();

        this.nodes[this.nodes.length - 1].animate({
            'd': newPath
        }, 500, ludo.svg.easing.outSine, this.showDots.bind(this));

        if (this.filled) {
            this.nodes[0].animate({
                'd': this.getPath(false, true)
            }, 500, ludo.svg.easing.outSine);
        }
    },

    hideDots: function () {
        jQuery.each(this.dots, function (index, dot) {
            dot.hide();
        });
    },

    showDots: function () {
        jQuery.each(this.dots, function (index, dot) {

            dot.show();
        }.bind(this));

        this.positionDots();
    },

    positionDots: function () {
        var p = this.getParent();
        var recs = this.record.getChildren();
        jQuery.each(this.dots, function (index, dot) {
            var x = this.xPos(index);
            var y = this.yPos(index);
            dot.position(x, y);
            p.setPoint(recs[index], x, y);
        }.bind(this));
    },

    length: function () {
        return this.record.getChildren != undefined ? this.record.getChildren().length : this.record.length;
    }


});