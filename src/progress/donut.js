/**
 * @namespace ludo.progress
 */
/**
 * Donut Progress bar
 * @augments ludo.progress.Bar
 * @param {Object} config
 * @param {Number} config.innerRadius - Inner radius size in fraction of outer radius. Outer radius is measured as min(view width, view height).
 */
ludo.progress.Donut = new Class({
    Extends: ludo.progress.Bar,
    steps: 10,
    progress: 0,
    textSizeRatio: 0.3,

    outerBorderWidth: 0,
    innerBorderWidth: 0,

    innerRadius:0.5,

    __construct:function(config){
        this.parent(config);
        this.setConfigParams(config, ['innerRadius']);
    },

    renderBar: function () {
        var s = this.svg();

        this.createStyles();
        this.createClipPath();

        this.els.bg = s.$('path');
        this.els.bg.addClass('ludo-progress-donut-bg-svg');
        s.append(this.els.bg);
        this.els.bg.set('fill-rule', 'evenodd');

        if(this.backgroundStyles){
            this.els.bg.css(this.backgroundStyles);
            if(this.backgroundStyles['stroke-width'] != undefined){
                this.outerBorderWidth = parseInt(this.els.bg.css('stroke-width'));
            }
        }

        this.els.bar = s.$('path');
        this.els.bar.addClass('ludo-progress-donut-bar-svg');
        s.append(this.els.bar);
        this.els.bar.set('fill-rule', 'evenodd');
        this.els.bar.applyClipPath(this.els.clipPath);
        if(this.barStyles){
            this.els.bar.css(this.barStyles);
        }
        if (this._text != undefined) {
            this.text(this._text);
        }

        this.els.debug = s.$('path');
        s.append(this.els.debug);
        this.els.debug.css('fill', '#ff0000');

    },

    createClipPath: function () {
        var s = this.svg();
        this.els.clipPath = s.$('clipPath');
        s.appendDef(this.els.clipPath);
        this.els.clip = s.$('path');
        this.els.clipPath.append(this.els.clip);

    },

    createStyles: function () {
        var s = this.svg();
        var cls = 'ludo-progress-donut-bg';
        var styles = ludo.svg.Util.pathStyles(cls);
        this.outerBorderWidth = parseInt(styles['stroke-width']);

        s.addStyleSheet(cls + '-svg', styles);

        cls = 'ludo-progress-donut-bar';
        styles = ludo.svg.Util.pathStyles(cls);
        this.innerBorderWidth = parseInt(styles['stroke-width']);

        s.addStyleSheet(cls + '-svg', styles);
    },

    resize: function (size) {

        this.parent(size);

        this.resizeItems();

        this.ratio(this.progress / this.steps, false);


    },

    resizeItems: function () {
        var s = this.rect();
        var c = s / 2;
        var radius = c - 2;
        var innerRadius = radius * this.innerRadius;

        this.els.bg.set('d', this.bgPath(radius, innerRadius));

        this.els.bar.set('d', this.bgPath(radius - this.outerBorderWidth, innerRadius + this.outerBorderWidth));

        this.positionTextNode();
    },


    /**
     * Display text on progress bar
     * @param {String} txt
     * @memberof ludo.progress.Donut.prototype
     */
    text: function (txt) {
        if (this.els.textNode == undefined) {
            this.els.textNode = this.svg().$('text');
            var styles = ludo.svg.Util.textStyles('ludo-progress-text');
            this.svg().addStyleSheet('ludo-progress-text-svg', styles);
            this.els.textNode.addClass('ludo-progress-text-svg');
            this.els.textNode.set('text-anchor', 'middle');
            this.els.textNode.set('alignment-baseline', 'central');
            this.svg().append(this.els.textNode);
            if (this.textStyles != undefined) {
                this.els.textNode.css(this.textStyles);
            }
            this.positionTextNode();
        }

        this.els.textNode.text(txt);
    },

    positionTextNode: function () {
        if (this.els.textNode) {
            var c = this.rect() / 2;
            this.els.textNode.set('x', c);
            this.els.textNode.set('y', c);
            this.els.textNode.css('font-size', this.rect() * this.innerRadius * this.textSizeRatio);
        }
    },

    bgPath: function (radius, innerRadius) {
        return this.circlePath(radius) + this.circlePath(innerRadius);
    },

    circlePath: function (r) {
        var c = this.rect() / 2;

        var s = c - r;
        var e = c + r;

        return [
            'M', s, c,
            'A', r, r, 90, 0, 1, c, s,
            'A', r, r, 90, 0, 1, e, c,
            'A', r, r, 90, 0, 1, c, e,
            'A', r, r, 90, 0, 1, s, c
        ].join(' ');

    },

    rect: function () {
        return Math.min(this.svg().width, this.svg().height);
    },

    ratio: function (ratio, animate) {
        if(animate){
            var p= this.clipArray(ratio).join(' ');
            var s = this.rect();
            var c = s / 2;

            var diff = ratio - this.lastRatio;
            this.els.clip.set('d', this.clipArray(this.lastRatio).join(' '));
            this.els.clip.animate({
                d : p
            },{
                easing:this.easing,
                duration:this.animationDuration,
                step:function(value, delta, elapsed){
                    if(ratio == 1 && elapsed == 1)value[9] = 359.99999;
                    var d = value[9] - 90;

                    var r = ludo.geometry.toRadians(d);
                    var x = c + (Math.cos(r) * 30000);
                    var y = c + (Math.sin(r) * 30000);
                    value[12] = x;
                    value[13] = y;
                    return value;

                },
                progress: function (t) {
                    var prs = Math.min(100, (this.lastRatio + (diff * t)) * 100);
                    this.fireEvent('animate', prs);
                }.bind(this),
                complete:function(){
                    this.lastRatio = ratio;
                    this.fireEvent('animate', this.lastRatio * 100);
                    this.onChange();
                    this.fireEvent('animated', this.lastRatio * 100);
                }.bind(this)
            });
        }else{
            var path = this.clipArray(Math.min(ratio, 0.9999999));
            this.els.clip.set('d', path.join(' '));
            this.lastRatio = ratio;
            this.fireEvent('animate', this.lastRatio * 100);
        }
    },

    clipArray: function (ratio) {
        var degrees = 360 * ratio;
        var radians = ludo.geometry.toRadians(degrees - 90);
        var s = this.rect();
        var c = s / 2;

        var radius = 30000;

        var x = c + (Math.cos(radians) * radius);
        var y = c + (Math.sin(radians) * radius);

        return [
            'M', c, c,
            'L', c, c -radius,
            'A', radius, radius, degrees , 1, 1, x, y, 'Z'
        ]

    }
});