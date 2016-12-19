/**
 * Rendering Chart Shapes/Dots
 */
ludo.chart.LineDot = new Class({
    Extend: Events,
    type: 'chart.LineDot',

    shape: undefined,
    record: undefined,
    size: 8,
    ds: undefined,

    node: undefined,

    nodeHighlight: undefined,
    renderTo: undefined,

    x: undefined,
    y: undefined,

    parentComponent: undefined,

    showDots: true,


    initialize: function (props) {
        this.ds = props.ds;

        this.record = props.record;
        this.shape = this.ds.shapeOf(this.record) || this.record.__shape || 'circle';
        this.renderTo = props.renderTo;
        this.parentComponent = props.parentComponent;
        this.showDots = this.parentComponent.getParent().showDots;

        this.node = this.getNewNode();

        this.node.attr("stroke-width", 0);
        this.node.css("cursor", "pointer");
        this.node.css("fill", this.record.getParent().__color);
        this.node.css("stroke", this.record.getParent().__stroke);

        switch (this.shape) {
            case 'circle':
                this.node.attr('r', this.size / 2);
                break;
            default:
                this.node.set('d', this.getPath());
                break;

        }

        this.renderTo.append(this.node);

        if (!this.showDots) {
            this.node.set("fill-opacity", 0);
            this.node.set("stroke-opacity", 0);
        }




        this.ds.on("enter" + this.record.__uid, this.enter.bind(this));
        this.ds.on("leave" + this.record.__uid, this.leave.bind(this));

    },

    getPath: function (highlighted) {
        var min = -(this.size / 2);
        var max = (this.size / 2);
        if (highlighted) {
            min *= 1.4;
            max *= 1.4;
        }
        switch (this.shape) {
            case 'rect':
                return ['M', min, min, 'L', max, min, max, max, min, max, min, min].join(' ');
            case 'triangle':
                return ['M', 0, min, 'L', max, max, min, max, 0, min].join(' ');
            case 'rotatedrect':
                return ['M', min,0, 0,min, max,0, 0,max, min, 0].join(' ');

        }
    },

    getNewNode: function () {
        switch (this.shape) {
            case 'circle':
                return new ludo.canvas.Circle();
            default:
                return new ludo.canvas.Path();
        }
    },


    enter: function () {
        if (this.nodeHighlight == undefined) {
            this.nodeHighlight = new ludo.canvas.Circle({
                r: this.size * 1.6
            });
            this.nodeHighlight.css({
                'stroke-opacity': 0.5,
                fill: this.record.getParent().__color,
                'stroke-width': 0,
                stroke: 'none',
                'fill-opacity': 0.3

            });
            this.renderTo.append(this.nodeHighlight);
            this.node.toFront();
        }
        this.nodeHighlight.set("cx", this.x);
        this.nodeHighlight.set("cy", this.y);
        this.nodeHighlight.show();

        this.node.css('stroke', this.record.getParent().__stroke);
        this.node.set('stroke-width', 1);

        var anim = {};
        switch (this.shape) {
            case 'circle':
                anim.r = this.size * 0.7;
                break;
            default:
                anim.d = this.getPath(true);
                break;

        }


        if (!this.showDots) {
            anim["fill-opacity"] = 1;
            anim["stroke-opacity"] = 1;
        }

        this.parentComponent.parentComponent.onFragmentAction('enter', this.parentComponent, this.record, this.nodeHighlight, {});

        this.node.animate(anim, 100);
    },

    leave: function () {
        this.nodeHighlight.hide();
        var anim = {};
        this.node.set('stroke-width', 0);
        switch (this.shape) {
            case 'circle':
                anim.r = this.size / 2;
                break;
            default:
                anim.d = this.getPath(false);
                break;
        }

        if (!this.showDots) {
            anim["fill-opacity"] = 0;
            anim["stroke-opacity"] = 0;
        }
        this.node.animate(anim, 100);
    },


    position: function (x, y) {
        this.x = x;
        this.y = y;
        this.node.setTranslate(x, y);

        if (this.nodeHighlight) {
            this.nodeHighlight.setTranslate(x, y);
        }
    },

    hide: function () {
        this.node.hide();
    },

    show: function () {
        this.node.show();
    }
});