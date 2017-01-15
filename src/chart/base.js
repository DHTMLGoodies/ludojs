/**
 * Base class for charts
 * @class ludo.chart.Base
 */
ludo.chart.Base = new Class({
    Extends: ludo.svg.Group,
    fragments: [],
    fragmentType: 'chart.Fragment',
    highlighted: undefined,
    focused: undefined,
    plugins: undefined,

    fragmentMap: {},

    rendered: false,
    bgColor: undefined,
    bgRect: undefined,

    /**
     * Reference to datasource
     * @property {ludo.chart.DataSource} ds
     * @memberof ludo.chart.Base.prototype
     */
    ds: undefined,

    easing: undefined,
    duration: 300,

    data: undefined,

    entered: undefined,

    chartNode: undefined,

    clipPath: undefined,
    clipRect: undefined,

    dataSource: undefined,

    interactive: true,

    revealAnim: false,
    revealAnimDirection: 'right',
    revealAnimDuration: 500,



    __construct: function (config) {
        this.parent(config);
        this.setConfigParams(config, ['revealAnim', 'revealAnimDirection', 'revealAnimDuration', 'interactive', 'dataSource', 'animate', 'bgColor', 'duration', 'data']);
        this.ds = this.getDataSource();

        this.easing = config.easing || ludo.svg.easing.outSine;
        this.ds.on('load', this.create.bind(this));

        this.ds.on('update', this.onResize.bind(this));

        this.ds.on('select', this.select.bind(this));
        this.ds.on('blur', this.blur.bind(this));
        this.ds.on('enter', this.enter.bind(this));
        this.ds.on('leave', this.leave.bind(this));


        this.node.on('mouseenter', this.enterGroup.bind(this));
    },

    chart: function () {
        return this.getParent();
    },

    enterGroup: function (e) {
        if (e.target.tagName == 'g') {
            this.getParent().enterGroup(this);
        }
    },

    getChartNode: function () {
        if (this.chartNode == undefined) {
            var c = this.svg();
            this.chartNode = c.$('g');
            this.append(this.chartNode);
            var x = this.layout.xOffset || 0;
            var y = this.layout.yOffset || 0;
            if (x != 0 || y != 0) {
                this.chartNode.setTranslate(x, y);
            }

        }
        return this.chartNode;
    },

    select: function (record) {
    },

    blur: function (record) {
    },

    enter: function (record) {
    },

    leave: function (record) {
    },

    ludoEvents: function () {
        this.parent();
        var dp = this.getDataSource();

        dp.addEvent('update', this.update.bind(this));
    },


    createFragments: function () {

        if (this.fragmentType == undefined)return;
        var records = this.getRecords();



        for (var i = 0; i < records.length; i++) {
            this.createFragment(records[i]);
        }
    },

    createFragment: function (record) {

        var f = this.createDependency('fragment' + this.fragments.length,
            Object.merge({
                type: this.fragmentType,
                record: record,
                parentComponent: this
            }, this.getFragmentProperties()));

        this.fragmentMap[record.__uid] = f;
        this.fragments.push(f);

        this.relayEvents(f, ['mouseenter', 'mouseleave']);

        return f;
    },

    getFragmentProperties: function () {
        return {};
    },

    getFragments: function () {
        return this.fragments;
    },

    getParent: function () {
        return this.parentComponent;
    },

    getRecords: function () {
        return this.ds.getData(this);
    },

    getDataSource: function () {
        return this.dataSource ? this.dataSource : this.parentComponent.getDataSource();
    },

    getCenter: function () {
        var size = this.getSize();
        return {
            x: size.x / 2,
            y: size.y / 2
        }
    },

    getRadius: function () {
        var c = this.getCenter();
        return Math.min(c.x, c.y);
    },

    create: function () {
        this.renderBackgroundItems();

        if (this.ds.hasData()) {
            this.dataRendered = true;
            this.createFragments();
        }
        this.render();
        this.rendered = true;

        if (this.animate) {
            this.renderAnimation();
        }
    },

    renderAnimation: function () {
        if (this.revealAnim) {
            this.reveal();
        } else {
            jQuery.each(this.fragments, function (index, fr) {
                fr.animate();
            });
        }
    },

    renderBackgroundItems: function () {

        var s = this.getSize();
        this.bgRect = new ludo.svg.Rect({
                x: 0, y: 0, width: s.x, height: s.y
            }
        );
        if (this.bgColor) {
            this.bgRect.css('fill', this.bgColor);

        } else {
            this.bgRect.set("fill-opacity", 0);
        }
        this.append(this.bgRect);

    },

    render: function () {

    },

    update: function (record) {
        this.fireEvent('update', record);
    },

    getFragmentFor: function (record) {
        return this.fragmentMap[record.__uid];
    },

    onResize: function () {
        if (this.bgRect != undefined) {
            var s = this.getSize();
            this.bgRect.attr('width', s.x);
            this.bgRect.attr('height', s.y);
        }
    },

    svg: function () {
        return this.parentComponent.svg();
    },

    getSquareSize: function () {
        var size = this.getSize();
        return Math.min(size.x, size.y);
    },


    dataRendered: false,

    resize: function (coordinates) {
        this.parent(coordinates);

        if (!this.dataRendered && this.ds.hasData()) {
            this.create();
        }

        var size = this.getSize();
        jQuery.each(this.fragments, function (key, fragment) {
            fragment.resize(size.x, size.y);
        });
    },

    onFragmentAction: function (action, fragment, record, node, event) {
        this.fireEvent(action, [fragment, record, node, event]);
    },

    getTooltipPosition: function () {
        return 'left';
    },

    tooltipAtMouseCursor: function () {
        return false;
    },


    /**
     * Chart reveal animation.
     * @function reveal
     * @param {String} direction direction for the animation, 'left', 'right', 'up' or 'down'. Default: 'right'
     * @param {Number} duration animation duration in milliseconds, default: 600
     * @memberof ludo.chart.Base.prototype
     */
    reveal: function (direction, duration) {
        direction = this.revealAnimDirection || 'right';
        duration = this.revealAnimDuration || 600;
        var s = this.getSize();
        var c = this.svg();
        if (this.clipPath == undefined) {
            this.clipPath = c.$('clipPath');
            c.appendDef(this.clipPath);
            this.clipRect = c.$('rect', {
                x: 0, y: 0, width: 0, height: 0
            });
            this.clipPath.append(this.clipRect);
        }

        this.getChartNode().clip(this.clipPath);
        var r = this.clipRect;
        r.set('x', 0);
        r.set('y', 0);
        r.set('width', 0);
        r.set('height', 0);

        var anim = {};

        switch (direction) {
            case 'right':
                r.set('height', s.y);
                anim.width = s.x;
                break;
            case 'up':
                r.set('y', s.y);
                r.set('width', s.x);
                anim.height = s.y;
                anim.y = 0;
                break;
            case 'left':
                r.set('x', s.x);
                r.set('height', s.y);
                anim.x = 0;
                anim.width = s.x;
                break;
            case 'down':
                r.set('width', s.x);
                r.set('height', 0);
                anim.height = s.y;
                break;
        }
        this.clipRect.animate(
            anim,
            {
                duration: duration,
                easing: ludo.svg.easing.inSine,
                complete: this.removeClipPath.bind(this)
            }
        );
    },

    removeClipPath: function () {
        this.getChartNode().removeAttr('clip-path');
    }
});