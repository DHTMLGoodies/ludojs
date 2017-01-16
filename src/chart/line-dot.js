/**
 * Rendering Chart Shapes/Dots
 */
ludo.chart.LineDot = new Class({
    Extends: Events,
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

        this.node.set('d', this.getPath());

        this.renderTo.append(this.node);

        if (!this.showDots) {
            this.node.set("fill-opacity", 0);
            this.node.set("stroke-opacity", 0);
        }

        if (this.parentComponent.getParent().interactive) {
            this.ds.on("enter" + this.record.__uid, this.enter.bind(this));
            this.ds.on("leave" + this.record.__uid, this.leave.bind(this));

        }

        this.parentComponent.chart().on("leavegroup", this.leave.bind(this));
    },

    getPath: function (highlighted) {
        return ludo.chart.ChartUtil.getShape(this.shape, highlighted ? this.size * 1.4 : this.size);
    },

    getNewNode: function () {
        return new ludo.svg.Path();
    },


    enter: function () {
        if (this.nodeHighlight == undefined) {
            this.nodeHighlight = new ludo.svg.Node('circle', {
                r: this.size * 1.6, cx: 0, cy: 0
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
        this.nodeHighlight.setTranslate(this.x, this.y);
        this.nodeHighlight.show();

        this.node.css('stroke', this.record.getParent().__stroke);
        this.node.set('stroke-width', 1);

        var anim = {};
        anim.d = this.getPath(true);


        if (!this.showDots) {
            anim["fill-opacity"] = 1;
            anim["stroke-opacity"] = 1;
        }

        this.parentComponent.parentComponent.onFragmentAction('enter', this.parentComponent, this.record, this.nodeHighlight, {});

        this.node.animate(anim, {
            duration: 100,
            validate: function (a, b) {
                return a == b
            }
        });
        this.fireEvent('enter', this);
    },

    leave: function () {
        if(!this.nodeHighlight)return;
        this.nodeHighlight.hide();
        var anim = {d : this.getPath(false)};
        this.node.set('stroke-width', 0);


        if (!this.showDots) {
            anim["fill-opacity"] = 0;
            anim["stroke-opacity"] = 0;
        }
        this.node.animate(anim, {
            duration: 100,
            validate: function (a, b) {
                return a == b;
            }
        });
        this.fireEvent('leave', this);
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