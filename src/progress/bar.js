/**
 * Progress bar class
 * @namespace progress
 * @class Bar
 * @extends progress.Base
 */
ludo.progress.Bar = new Class({
    Extends:ludo.progress.Base,
    type:'ProgressBar',
    width:300,
    height:35,
    progressBarWidth:0,
    currentPercent:0,
    stopped:false,
    hidden:true,
    fx:undefined,

    ludoRendered:function () {
        this.parent();

        this.createBackgroundForProgressBar();
        this.createMovablePartOfProgressBar();
        this.createTextElement();

        this.autoSetProgressWidth();
    },
    createBackgroundForProgressBar:function () {
        var el = this.els.progressBg = new Element('div');
        ludo.dom.addClass(el, 'ludo-Progress-Bar-Bg');
        this.getBody().adopt(el);

        var left = this.els.progressBgRight = new Element('div');
        ludo.dom.addClass(left, 'ludo-Progress-Bar-Bg-Left');
        el.adopt(left);

        var right = this.els.progressBgRight = new Element('div');
        ludo.dom.addClass(right, 'ludo-Progress-Bar-Bg-Right');
        el.adopt(right);
    },

    createMovablePartOfProgressBar:function () {
        var el = this.els.progress = new Element('div');
        ludo.dom.addClass(el, 'ludo-Progress-Bar');
        this.els.progressBg.adopt(el);
        this.els.progress.setStyle('width', '0px');

        var left = this.els.progressLeft = new Element('div');
        ludo.dom.addClass(left, 'ludo-Progress-Bar-Left');
        el.adopt(left);

        var right = this.els.progressRight = new Element('div');
        ludo.dom.addClass(right, 'ludo-Progress-Bar-Right');
        el.adopt(right);
    },

    createTextElement:function () {
        var percent = this.els.percent = new Element('div');
        ludo.dom.addClass(percent, 'ludo-Progress-Bar-Percent');
        this.els.progressBg.adopt(percent);
	},

    resizeDOM:function () {
        this.parent();
        if (this.els.progressBg) {
            this.autoSetProgressWidth();
        }
    },

    insertJSON:function (json) {
        var data = json.data ? json.data : json;
        this.setPercent(data.percent);
    },

    startProgress:function () {
        this.parent();
        this.stopped = false;
        this.setPercent(0);
        this.els.progress.style.width = '0px';
        this.currentPercent = 0;
    },

    finish:function () {
        this.parent();
        this.setPercent(100);
    },

    autoSetProgressWidth:function () {
        if (!this.isVisible()) {
            return;
        }
        var width = parseInt(this.getBody().getStyle('width').replace('px', ''));
        width -= ludo.dom.getMW(this.els.progressBg);
        this.setProgressBarWidth(width);
        this.setPercent(this.currentPercent);
    },

    setProgressBarWidth:function (width) {
        if (isNaN(width)) {
            return;
        }
        this.progressBarWidth = width;
        this.els.progressBg.setStyle('width', width);

        this.progressBarWidth = width;
    },

    setPercent:function (percent) {
        if(percent == this.currentPercent)return;
        this.getFx().start({
            width: [this.currentPercent, percent]
        });
        this.currentPercent = percent;
        this.els.percent.innerHTML = percent + '%';
    },

    getCurrentPercent:function () {
        return this.currentPercent;
    },

    animate:function () {
        if (this.currentPercent < 100) {
            this.currentPercent++;
            this.setPercent(this.currentPercent);
            this.animate.delay(50, this);
        }
    },

    getFx:function () {
        if (this.fx === undefined) {
            this.fx = new Fx.Morph(this.els.progress, {
                duration:100,
                unit : '%'
            });
        }
        return this.fx;
    }
});