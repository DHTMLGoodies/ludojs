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
        var el = this.els.progressBg = $('<div>');
        el.addClass('ludo-Progress-Bar-Bg');
        this.getBody().append(el);

        var left = this.els.progressBgRight = $('<div>');
        left.addClass('ludo-Progress-Bar-Bg-Left');
        el.append(left);

        var right = this.els.progressBgRight = $('<div>');
        right.addClass('ludo-Progress-Bar-Bg-Right');
        el.append(right);
    },

    createMovablePartOfProgressBar:function () {
        var el = this.els.progress = $('<div>');
        el.addClass('ludo-Progress-Bar');
        this.els.progressBg.append(el);
        this.els.progress.css('width', '0px');

        var left = this.els.progressLeft = $('<div>');
        left.addClass('ludo-Progress-Bar-Left');
        el.append(left);

        var right = this.els.progressRight = $('<div>');
        right.addClass('ludo-Progress-Bar-Right');
        el.append(right);
    },

    createTextElement:function () {
        var percent = this.els.percent = $('<div>');
        percent.addClass('ludo-Progress-Bar-Percent');
        this.els.progressBg.append(percent);
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
        this.els.progress.css('width',  '0');
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
        var width = parseInt(this.getBody().css('width').replace('px', ''));
        width -= ludo.dom.getMW(this.els.progressBg);
        this.setProgressBarWidth(width);
        this.setPercent(this.currentPercent);
    },

    setProgressBarWidth:function (width) {

        if (isNaN(width)) {
            return;
        }
        this.progressBarWidth = width;
        this.els.progressBg.css('width', width);

        this.progressBarWidth = width;
    },

    setPercent:function (percent) {
        if(percent == this.currentPercent)return;
		if(percent === 0 && this.currentPercent === 100){
			this.els.progress.css('width',  '0px');
		}else{
            this.els.progress.animate({
                width : percent + "%"
            }, 100);
		}

        this.currentPercent = percent;
        this.els.percent.html(percent + '%');
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
    }
});