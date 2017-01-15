/**
 * @namespace ludo.progress
 */
/**
 * Donut Progress Bar
 *
 * Demo: <a href="../demo/progress/bar.php">Progress Bar Demo</a>
 *
 * @namespace progress
 * @class ludo.progress.Bar
 * @augments ludo.progress.Base
 * @param {Object} config
 * @param {Number} config.steps Number of progress bar steps, default = 10
 * @param {Number} config.progress Initial step, default = 0
 * @param {String} config.bgPattern Path to background image for the progress bar background. The background ima
 * @param {String} config.frontPattern Path to background image for the progress bar. The background images will be repeated if smaller than the progress bar. If bigger, it will be scaled down.
 * @param {float} config.textSizeRatio Size of text relative to height of progress bar, default = 0.6
 * @param {float} config.borderRadius Fixed border radius, default = height / 2
 * @param {float} config.bgStyles SVG background styles
 * @param {float} config.barStyles SVG moving bar styles
 * @param {float} config.textStyles Styling of text on progress bar
 * @param {Function} config.easing Easing function for animation. default: ludo.svg.easing.linear
 * @param {Number} config.animationDuration Animation duration in milliseconds (1/1000s) - default: 100
 * @fires ludo.progress.Bar#change Fired when value is changed. Arguments. 1) Percent completed 2) current step 3) number of steps, 4) ludo.progress.Bar 4) Current percentage.
 * If animated, the change event will be triggered once animation is complete.
 * @fires ludo.progress.Bar#animate Fired during progress animation and when value is changed. This is a good event
 * to listen to when you want to update texts for the progress bar. Arguments. 1) Animated percent completed
 */
ludo.progress.Bar = new Class({
    Extends: ludo.View,
    type: 'progress.Bar',
    orientation: 'horizontal',
    steps: 10,
    progress: 0,
    lastProgress: 0,
    lastSteps: 0,
    lastRatio: 0,
    outerBorderWidth: 0,
    innerBorderWidth: 0,

    borderRadius: undefined,
    textSizeRatio: 0.6,

    bgStyles: undefined,
    barStyles: undefined,
    textStyles: undefined,
    _text: undefined,

    animationDuration: 100,

    debugRect: undefined,
    bgPattern: undefined,
    frontPattern: undefined,
    patternSize: undefined,
    frontPatternSize: undefined,

    __construct: function (config) {
        this.parent(config);
        this.setConfigParams(config, ['animationDuration', 'steps', 'progress', 'borderRadius', 'textSizeRatio', 
            'bgStyles',
            'barStyles', 'textStyles', 'bgPattern', 'frontPattern','easing']);
        if (!this.layout.height) {
            this.layout.height = 25;
        }
        this.lastSteps = this.steps;
        if(this.easing == undefined){
            this.easing = ludo.svg.easing.linear;
        }
        if (config.text != undefined) {
            this._text = config.text;
        }
        
    },

    __rendered: function () {
        this.parent();
        this.renderBar();


        if(this.progress != 0){
            this.onChange();
        }

    },

    /**
     * Increment progress bar
     * @param {Number} by
     * @param {Boolean} animate
     * @memberof ludo.progress.Bar.prototype
     */
    increment: function (by, animate) {
        by = by != undefined ? by : 1;
        animate = animate != undefined ? animate : true;
        if(by != 0)this.lastProgress = this.progress;
        this.progress += by;
        this.progress = Math.max(0, this.progress);
        this.progress = Math.min(this.progress, this.steps);

        if (this.progress != this.lastProgress || this.steps != this.lastSteps) {
            var ratio = this.progress / this.steps;
            this.ratio(ratio, animate);
        }
    },

    onChange: function () {
        var ratio = this.progress / this.steps;
        this.fireEvent('change', [ratio * 100, this.progress, this.steps, this, ratio]);
    },

    resize: function (size) {
        this.parent(size);
        this.resizeItems();
    },

    setSteps: function (steps, animate) {
        this.lastSteps = this.steps;
        this.steps = steps;
        this.increment(0, animate);
    },

    /**
     * Set new progress value
     * @param {Number} progress
     * @param {Boolean} animate
     * @memberof ludo.progress.Bar.prototype
     */
    setProgress: function (progress, animate) {
        this.increment(progress - this.progress, animate);
    },

    createClipPath: function () {
        var s = this.svg();

        this.els.clipPath = s.$('clipPath');
        s.appendDef(this.els.clipPath);

        this.els.clipRect = s.$('rect', {
            x: 0, y: 0, width: 0, height: 0
        });
        this.els.clipPath.append(this.els.clipRect);

        this.els.clipPathBg = s.$('clipPath');
        this.els.clipPathBgPath = s.$('path');
        this.els.clipPathBg.append(this.els.clipPathBgPath);
        s.append(this.els.clipPathBg);

    },

    getPattern: function (image, sizeKey, imageKey) {
        var s = this.svg();
        var pattern = s.$('pattern');
        pattern.set('width', 0.2);
        pattern.set('height', 1);
        pattern.set('x', 0);
        pattern.set('y', 0);
        var img = this.els[imageKey] = s.$('image');
        var that = this;
        img.on('load', function () {
            var bbox = this.getBBox();
            that[sizeKey] = {
                x: bbox.width, y: bbox.height
            };

            that.updatePatternSize();

        }.bind(img));
        img.set('xlink:href', image);
        pattern.append(img);
        s.appendDef(pattern);
        return pattern;
    },

    createPattern: function () {


        if(this.bgPattern){
            this.els.bgPattern = this.getPattern(this.bgPattern, 'patternSize','bgImage');
        }

        if(this.frontPattern){
            this.els.frontPattern = this.getPattern(this.frontPattern, 'frontPatternSize','frontImage');
        }
    },

    applyPattern:function(){
        var s = this.svg();
        if(this.bgPattern){
            this.els.patternRect = s.$('rect');
            s.append(this.els.patternRect);
            this.els.patternRect.setPattern(this.els.bgPattern);
            this.els.patternRect.set('x', 0);
            this.els.patternRect.set('y', 0);
            this.els.patternRect.applyClipPath(this.els.clipPathBg);
        }

        if(this.frontPattern){
            this.els.frontPatternPath = s.$('path');
            s.append(this.els.frontPatternPath);
            this.els.frontPatternPath.setPattern(this.els.frontPattern);
            this.els.frontPatternPath.applyClipPath(this.els.clipPath);
        }
    },

    updatePatternSize: function () {
        if (this.patternSize != undefined) {
            this.els.bgPattern.set('width', Math.min(1, this.patternSize.x / this.svg().width));
            this.els.bgPattern.set('height', Math.min(1, this.patternSize.y / this.svg().height));
        }

        if(this.frontPatternSize){
            this.els.frontPattern.set('width', Math.min(1, this.frontPatternSize.x / this.svg().width));
            this.els.frontPattern.set('height', Math.min(1, this.frontPatternSize.y / this.svg().height));
        }
    },

    renderBar: function () {

        var s = this.svg();
        
        this.createClipPath();

        this.createPattern();

        this.applyPattern();

        var cls = 'ludo-progress-bg';
        var styles = ludo.svg.Util.pathStyles(cls);
        this.outerBorderWidth = parseInt(styles['stroke-width']);
        
        s.addStyleSheet(cls + '-svg', styles);
        var bg = this.els.bg = s.$('path');

        bg.addClass(cls + '-svg');

        s.append(bg);
        if (this.bgStyles != undefined) {
            bg.css(this.bgStyles);
            if(this.bgStyles['stroke-width'] != undefined)this.outerBorderWidth = parseInt(this.bgStyles['stroke-width']);

        }
        bg.set('stroke-linecap', 'round');
        bg.set('stroke-linejoin', 'round');
        if(this.els.patternRect){
            this.els.patternRect.toFront();
        }


        this.els.g = s.$('g');
        s.append(this.els.g);


        var el = this.els.bar = s.$('path');


        cls = 'ludo-progress-pr';
        styles = ludo.svg.Util.pathStyles(cls);
        this.innerBorderWidth = parseInt(styles['stroke-width']);
        s.addStyleSheet(cls + '-svg', styles);
        el.addClass(cls + '-svg');
        this.els.g.append(el);
        if (this.barStyles != undefined) {
            el.css(this.barStyles);
            if(this.barStyles['stroke-width'] != undefined)this.innerBorderWidth = parseInt(this.barStyles['stroke-width']);
        }
        el.set('stroke-linecap', 'round');
        el.set('stroke-linejoin', 'round');


        this.els.g.applyClipPath(this.els.clipPath);


        if (this._text != undefined) {
            this.text(this._text);
        }

        if(this.els.frontPatternPath){
            this.els.frontPatternPath.toFront();
        }

    },

    bar: function () {
        return this.els.bar;
    },

    resizeItems: function () {

        this.els.bg.set('d', this.bgPath());


        if (this.els.patternRect) {
            this.els.patternRect.set('width', this.svg().width);
            this.els.patternRect.set('height', this.svg().height);
        }

        var padding = (this.outerBorderWidth / 2) + (this.innerBorderWidth / 2);
        this.els.bar.set('d', this.bgPath(padding));

        if(this.els.frontPatternPath){
            this.els.frontPatternPath.set('d', this.bgPath(padding));
        }

        this.els.clipPathBgPath.set('d', this.bgPath(padding));

        this.positionTextNode();

        this.percent(this.progress / this.steps * 100);

        this.els.clipRect.set('height', this.svg().height);
        this.els.clipRect.set('x', this.outerBorderWidth);

        this.updatePatternSize();
        this.ratio(this.progress / this.steps, false);

    },

    positionTextNode: function () {
        if (this.els.textNode) {
            this.els.textNode.set('x', this.getBody().width() / 2);
            this.els.textNode.set('y', (this.svg().height / 2));
            this.els.textNode.css('font-size', this.svg().height * this.textSizeRatio);
        }
    },

    bgPath: function (extraPadding) {
        extraPadding = extraPadding || 0;
        var padding = (this.outerBorderWidth / 2) + extraPadding;

        var w = this.svg().width;
        var h = this.svg().height;

        var radius = this.borderRadius ? this.borderRadius : this.orientation == 'horizontal' ? (h - padding) / 2 : (w - padding) / 2;
        if (this.orientation == 'horizontal') {
            radius = Math.min(radius, (h - padding) / 2);
        } else {
            radius = Math.min(radius, (w - padding) / 2);
        }

        var offset = radius;

        var path;
        if (this.borderRadius || 1 == 1) {
            path = [
                'M', offset, padding,
                'L', w - offset, padding,
                'A', radius, radius, 90, 0, 1, w - padding, padding + radius,
                'L', w - padding, h - radius,
                'A', radius, radius, 90, 0, 1, w - offset, h - padding,
                'L', offset, h - padding,
                'A', radius, radius, 90, 0, 1, padding, h - padding - radius,
                'L', padding, radius,
                'A', radius, radius, 90, 0, 1, offset, padding
            ];

        } else {
            var e = 0;
            path = [
                'M', offset, padding,
                'L', w - offset + e, padding,
                'A', radius, radius, 180, 0, 1, w - offset + e, h - padding,
                'L', offset - e, h - padding,
                'A', radius, radius, 180, 0, 1, offset - e, padding
            ];

        }


        return path.join(' ');
    },

    /**
     * Display text on progress bar.
     * @param {String} text
     * @memberof ludo.progress.Bar.prototype
     * @example
     {
         id: 'progress',
         type: 'progress.Bar',
         borderRadius: 3,
         steps: 100,
         layout: {
             width: 300,
             height:30
         },
         listeners:{
            // Update text on animate
             animate:function (percent) {
                 this.text(percent.toFixed(0) + '%');
             }
          }
      }
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

    animate: function (percent) {
        this.percent(percent, true);
    },

    /**
     * Update or get percent completed.
     * @param {Number} percent New percentage value
     * @param {Boolean} animate True to animate, default = false
     * @memberof ludo.progress.Bar.prototype
     * @example
     * var progressBar = ludo.$('progressBar');
     * // get percent completed with no decimals
     * var percent = progressBar.percent();
     * // update percent and animate it
     * progressBar.percent(20, true);
     */
    percent: function (percent, animate) {
        if(arguments.length == 0){
            return (this.progress / this.steps * 100).toFixed(0);
        }
        this.ratio(percent / 100, animate);
    },


    /**
     * Get or set ratio. To get current ratio, send no arguments to this function.
     * 
     * The ratio is also updated automatically when you use the increment function.
     * 
     * @param {Number} ratio New ratio - 0 = starting, 1 = finished
     * @param {Boolean} animate True to animate, default = false
     * @memberof ludo.progress.Bar.prototype
     * @example
     * var progressBar = ludo.$('progressBar');
     * // get ratio
     * var ratio = progressBar.ratio();
     * // set ratio
     * progressBar.ratio(0.5, true);
     * 
     */
    ratio: function (ratio, animate) {
        if (arguments.length == 0) {
            return this.progress / this.steps;
        }
        ratio = ludo.util.clamp(ratio, 0, 1);
        var w = (this.svg().width - this.outerBorderWidth) * ratio;

        if (animate) {
            var diff = ratio - this.lastRatio;
            this.els.clipRect.animate({
                width: w
            }, {
                duration: this.animationDuration,
                easing: this.easing,
                complete: function () {
                    this.lastRatio = ratio;
                    this.fireEvent('animate', this.lastRatio * 100);
                    this.onChange();
                }.bind(this),
                progress: function (t) {
                    var prs = Math.min(100, (this.lastRatio + (diff * t)) * 100);
                    this.fireEvent('animate', prs);
                }.bind(this)
            });
        } else {
            this.els.clipRect.set('width', w);
            if(ratio != this.lastRatio){
                this.onChange();
            }
            this.lastRatio = ratio;
            this.fireEvent('animate', this.lastRatio * 100);
        }
    }

});