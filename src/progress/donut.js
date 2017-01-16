/**
 * @namespace ludo.progress
 */
/**
 * Donut Progress bar
 *  The progress bar is created using SVG. It is made out of 4 elements in this stacking order(bottom to top)
 *
 *  1) The background svg path rendered with the css class '.ludo-progress-bg' and styles defined in bgStyles object
 *  2) Eventual background image defined in bgPattern. If the background path(1) has a border, the background image will be
 *  shrinked to fit inside. The background image will be repeated when smaller than the progress bar. If bigger, it will be scaled
 *  down.
 *  3) Progress Bar SVG path
 *  4) Eventual background image defined in frontPattern.
 * 
 * @augments ludo.progress.Bar
 * @param {Object} config
 * @param {Function} config.innerRadius - Function returning inner radius. Arguments to this function : 1) outer radius.
 * default: function(outerRadius){ return outerRadius * 0.5 }
 * @param {Number} config.steps Number of progress bar steps, default = 10
 * @param {Number} config.progress Initial step, default = 0
 * @param {Number} config.startAngle Start angle in range 0-360. Default = 0(top)
 * @param {float} config.textSizeRatio Size of text relative to inner radius, default: 0.3
 * @param {float} config.bgStyles SVG background styles
 * @param {float} config.barStyles SVG moving bar styles
 * @param {float} config.textStyles Styling of text on progress bar
 * @param {String} config.bgPattern Path to background image for the progress bar background. 
 * @param {String} config.frontPattern Path to background image for the progress bar. The background images will be repeated if smaller than the progress bar. If bigger, it will be scaled down.
 * @param {Function} config.easing Easing function for animation. default: ludo.svg.easing.linear
 * @param {Number} config.animationDuration Animation duration in milliseconds (1/1000s) - default: 100
 * @fires ludo.progress.Bar#change Fired when value is changed. Arguments. 1) Percent completed 2) current step 3) number of steps, 4) ludo.progress.Bar 4) Current percentage.
 * If animated, the change event will be triggered once animation is complete.
 * @fires ludo.progress.Bar#animate Fired during progress animation and when value is changed. This is a good event
 * to listen to when you want to update texts for the progress bar. Arguments. 1) Animated percent completed

 */
ludo.progress.Donut = new Class({
    Extends: ludo.progress.Bar,
    steps: 10,
    progress: 0,
    textSizeRatio: 0.3,

    outerBorderWidth: 0,
    innerBorderWidth: 0,

    startAngle : 0,



    __construct:function(config){
        this.parent(config);
        this.setConfigParams(config, ['innerRadius', 'startAngle']);
    },


    applyPattern:function(){

        var s = this.svg();


        if(this.bgPattern){
            this.els.bgPatternPath = s.$('path');
            s.append(this.els.bgPatternPath);
            this.els.bgPatternPath.setPattern(this.els.bgPattern);
            this.els.bgPatternPath.set('fill-rule', 'evenodd');
        }


        if(this.frontPattern){
            this.els.frontPatternPath = s.$('path');
            this.els.frontGroup.append(this.els.frontPatternPath);
            this.els.frontPatternPath.setPattern(this.els.frontPattern);
            this.els.frontPatternPath.clip(this.els.clipPath);
            this.els.frontPatternPath.set('fill-rule', 'evenodd');
        }
    },


    renderBar: function () {
        var s = this.svg();

        this.createStyles();
        this.createClipPath();

        this.createPattern();


        this.els.bg = s.$('path');
        this.els.bg.addClass('ludo-progress-donut-bg-svg');
        s.append(this.els.bg);
        this.els.bg.set('fill-rule', 'evenodd');

        if(this.bgStyles){
            this.els.bg.css(this.bgStyles);
            if(this.bgStyles['stroke-width'] != undefined){
                this.outerBorderWidth = parseInt(this.bgStyles['stroke-width']);
            }
        }

        this.els.frontGroup = s.$('g');
        s.append(this.els.frontGroup);

        this.els.bar = s.$('path');
        this.els.bar.addClass('ludo-progress-donut-bar-svg');
        this.els.frontGroup.append(this.els.bar);
        this.els.bar.set('fill-rule', 'evenodd');
        this.els.frontGroup.clip(this.els.clipPath);
        if(this.barStyles){
            this.els.bar.css(this.barStyles);
            if(this.barStyles['stroke-width'] != undefined){
                this.outerBorderWidth = parseInt(this.barStyles['stroke-width']);
            }
        }
        if (this._text != undefined) {
            this.text(this._text);
        }

        this.applyPattern();

        this.els.frontGroup.toFront();

        this.els.debug = s.$('path');
        s.append(this.els.debug);
        this.els.debug.css('fill', '#ff0000');

        if(this.els.frontPatternPath){
            this.els.frontPatternPath.toFront();
        }

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


    updatePatternSize: function () {
        var s = this.rect();

        if (this.patternSize != undefined) {

            if(this.patternSize.x > s){
                this.els.bgImage.set('width', s);
                this.els.bgImage.set('height', s);
            }

            this.els.bgPattern.set('width', Math.min(1, this.patternSize.x /s));
            this.els.bgPattern.set('height', Math.min(1, this.patternSize.y / s));
        }

        if(this.frontPatternSize){

            if(this.frontPatternSize.x > s){
                this.els.frontImage.set('width', s);
                this.els.frontImage.set('height', s);
            }
            this.els.frontPattern.set('width', Math.min(1, this.frontPatternSize.x /s));
            this.els.frontPattern.set('height', Math.min(1, this.frontPatternSize.y / s));
        }
    },
    
    resizeItems: function () {
        var s = this.rect();
        var c = s / 2;
        var radius = c - 2;
        var innerRadius = this.innerRadius(radius);

        this.els.bg.set('d', this.bgPath(radius, innerRadius));

        this.els.bar.set('d', this.bgPath(radius - this.outerBorderWidth, innerRadius + this.outerBorderWidth));

        if(this.els.bgPatternPath){
            this.els.bgPatternPath.set('d', this.bgPath(radius - this.outerBorderWidth, innerRadius + this.outerBorderWidth));
        }

        if(this.els.frontPatternPath){
            var p = this.bgPath(radius - this.outerBorderWidth - this.innerBorderWidth, innerRadius + this.outerBorderWidth + this.innerBorderWidth);
            this.els.frontPatternPath.set('d', p);
        }



        this.updatePatternSize();

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
            var styles = ludo.svg.Util.textStyles('ludo-progress-donut-text');
            this.svg().addStyleSheet('ludo-progress-donut-text-svg', styles);
            this.els.textNode.addClass('ludo-progress-donut-text-svg');
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
            this.els.textNode.css('font-size',  this.innerRadius(this.rect()) * this.textSizeRatio);
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
        if (arguments.length == 0) {
            return this.progress / this.steps;
        }
        ratio = ludo.util.clamp(ratio, 0, 1);
        if(animate){
            var p= this.clipArray(ratio).join(' ');
            var s = this.rect();
            var c = s / 2;
            var a = this.startAngle;
            var diff = ratio - this.lastRatio;
            this.els.clip.set('d', this.clipArray(this.lastRatio).join(' '));
            this.els.clip.animate({
                d : p
            },{
                easing:this.easing,
                duration:this.animationDuration,
                step:function(value, delta, elapsed){
                    if(ratio == 1 && elapsed == 1)value[9] = 359.99999;
                    var d = value[9] - 90 + a;

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
                }.bind(this)
            });
        }else{
            var path = this.clipArray(Math.min(ratio, 0.9999999));
            this.els.clip.set('d', path.join(' '));

            if(ratio != this.lastRatio){
                this.onChange();
            }
            this.fireEvent('animate', this.lastRatio * 100);
            this.lastRatio = ratio;
        }
    },

    clipArray: function (ratio) {
        var degrees = 360 * ratio;
        var radians = ludo.geometry.toRadians(degrees - 90 + this.startAngle);
        var s = this.rect();
        var c = s / 2;

        var radius = 30000;

        var radStart = ludo.geometry.toRadians(- 90 + this.startAngle);
        var xStart = c + (Math.cos(radStart) * radius)
        var yStart = c + (Math.sin(radStart) * radius)

        var x = c + (Math.cos(radians) * radius);
        var y = c + (Math.sin(radians) * radius);

        return [
            'M', c, c,
            'L', xStart, yStart,
            'A', radius, radius, degrees , 1, 1, x, y, 'Z'
        ]

    },

    innerRadius:function(outerRadius){
        return outerRadius * 0.5;
    }
});