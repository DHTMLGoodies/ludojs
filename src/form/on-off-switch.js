/**
 * On off switch
 * @namespace ludo.form
 * @class ludo.form.OnOffSwitch
 * @memberOf ludo.form
 *
 */
ludo.form.OnOffSwitch = new Class({
    Extends: ludo.form.LabelElement,

    listener: undefined,
    trackBorderColor: undefined,

    checked: false,

    /**
     * @memberof ludo.form.OnOffSwitch.prototype
     * Border width in pixels. Default is 1
     * @param {Number} textSizeRatio
     * @default 1
     */
    trackBorderWidth: 1,

    /**
     * @memberof ludo.form.OnOffSwitch.prototype
     * Text size ratio relative to height. Default is 0.45
     * @param {Number} textSizeRatio
     * @default 0.45
     */
    textSizeRatio: 0.45,

    /**
     * @memberof ludo.form.OnOffSwitch.prototype
     * Track color - ON state. Default is orange
     * @param {string} trackColorOn
     * @default #F57C00
     */
    trackColorOn: '#F57C00',

    /**
     * Track color - OFF state. Default is dark gray
     * @param {string} trackColorOff
     * @memberof ludo.form.OnOffSwitch.prototype
     * @default #666
     */
    trackColorOff: '#666',

    /**
     * Text color in on state
     * @param {string} v
     * @default #fff
     * @memberof ludo.form.OnOffSwitch.prototype
     */
    textColorOn: undefined,

    /**
     * Text color in off state
     * @param {string} textColorOff
     * @default #fff
     * @memberof ludo.form.OnOffSwitch.prototype
     */
    textColorOff: '#fff',

    el: undefined,
    track: undefined,
    thumb: undefined,
    thumbColor: undefined,
    onTextEl: undefined,
    offTextEl: undefined,
    onOffTrackContainer: undefined,

    /**
     * Text when switch is turned on
     * @memberof ludo.form.OnOffSwitch.prototype
     * @param {string} textOn
     * @default ""
     */
    textOn: "",

    /**
     * @memberof ludo.form.OnOffSwitch.prototype
     * Text when switch is turned off
     * @param {string} textOff
     * @default ""
     */
    textOff: "",

    minX: 0,
    maxX: 0,

    trackOn: undefined,
    trackOff: undefined,

    innerTrackWidth: 0,

    dragCurrentX: 0,
    borderSize: 0,

    /**
     * Value when checked
     * @memberof ludo.form.OnOffSwitch.prototype
     * @param {string} checkedVal
     * @type {string}
     * @default '1'
     */
    checkedVal:'1',

    /**
     * Value when unchecked
     * @memberof ludo.form.OnOffSwitch.prototype
     * @param {string} uncheckedVal
     * @type {string}
     * @default ''
     */
    uncheckedVal: '',

    ludoConfig:function(config){
        this.parent(config);
        this.setConfigParams(config, ["textOn", "textOff", "trackColorOn", "trackColorOff",
            "textColorOn", "textColorOff", "listeners", "trackBorderColor", "textSizeRatio","checked",
        "checkedVal","uncheckedVal"]);
    },

    ludoDOM:function(){

        this.parent();

        this.width = 100;
        this.height= 30;

        this.el = $('<div class="on-off-switch"></div>');
        this.getInputCell().append(this.el);

        this.renderTrack();
        this.renderThumb();

        this.el.on('selectStart', this.cancelEvent);

        this.track.on("click", this.toggle.bind(this));
        this.track.on("touchend", this.toggle.bind(this));

    },

    ludoEvents:function(){
        this.parent();

        this.thumb.on("mousedown", this.startDragging.bind(this));
        this.thumb.on("touchstart", this.startDragging.bind(this));

        this.thumb.on("mouseenter", this.enterThumb.bind(this));
        this.thumb.on("mouseleave", this.leaveThumb.bind(this));

        $(document.documentElement).on("touchmove", this.drag.bind(this));
        $(document.documentElement).on("mousemove", this.drag.bind(this));
        $(document.documentElement).on("mouseup", this.endDrag.bind(this));
        $(document.documentElement).on("touchend", this.endDrag.bind(this));
    },

    ludoRendered:function(){
        this.parent();
        this.setChecked(this.checked);
    },

    resizeDOM:function(){
        this.parent();
        var width = this.width = this.getBody().width() - this.labelWidth - (this.trackBorderWidth * 2);
        var height = this.height = this.getBody().height() - (this.trackBorderWidth * 2);

        var trackWidth = width - (this.trackBorderWidth * 2);
        var innerTrackWidth = trackWidth - (this.height / 2);
        this.innerTrackWidth = trackWidth;
        var trackHeight = height - (this.trackBorderWidth * 2);
        var borderRadius = height / 2;

        this.el.css({
            width: width,
            height: height
        });

        this.track.css({
            width: trackWidth, height:trackHeight,
            borderRadius: borderRadius
        });

        this.onOffTrackContainer.css({
            height:trackHeight, width: (innerTrackWidth * 2)
        });

        this.trackOn.css({
            width: innerTrackWidth,
            height: trackHeight
        });

        this.trackOff.css({
            width:this.width,
            height:trackHeight,
            left: (innerTrackWidth - (this.height / 2))
        });

        this.styleText(this.onTextEl);
        this.styleText(this.offTextEl);

        var whiteHeight = this.height / 2;
        var whiteBorderRadius = whiteHeight / 2;
        var horizontalOffset = whiteBorderRadius / 2;
        var whiteWidth = this.width - (horizontalOffset * 2);

        this.whiteEl.css({
            top:this.height / 2,
            left:horizontalOffset,
            width:whiteWidth,
            height:whiteHeight,
            borderRadius: whiteBorderRadius
        });

        this.whiteEl2.css({
            top:this.height / 2,
            left:horizontalOffset,
            width:whiteWidth,
            height:whiteHeight,
            borderRadius: whiteBorderRadius
        });
        this.maxX = this.width - this.height;
        borderRadius = (this.height - this.height % 2) / 2;
        var borderSize = this.getBorderSize();

        this.thumb.css({
            width: this.height + 'px',
            height:this.height + 'px',
            borderRadius: borderRadius
        });

        var size = this.height - (borderSize * 2);

        this.thumbShadow.css({
            width: this.height + 'px',
            height:this.height + 'px',
            borderRadius: borderRadius
        });

        this.thumbColor.css({
            width: size + 'px',
            height:size + 'px',
            borderRadius: borderRadius
        });

        this.applyStyles();
    },

    enterThumb: function () {
        this.thumbColor.addClass("on-off-switch-thumb-over");
    },

    leaveThumb: function () {
        this.thumbColor.removeClass("on-off-switch-thumb-over");
    },

    renderTrack: function () {

        this.track = $('<div class="on-off-switch-track" style="border-width:' + this.trackBorderWidth + 'px"></div>');

        if (this.trackBorderColor) {
            this.track.css("border-color", this.trackBorderColor);
        }
        this.el.append(this.track);

        this.onOffTrackContainer = $('<div style="position:absolute"></div>');
        this.track.append(this.onOffTrackContainer);


        this.trackOn = $('<div class="on-off-switch-track-on" style="border-radius:' + 0 + 'px;border-width:' + this.trackBorderWidth + 'px"><div class="track-on-gradient"></div></div>');
        this.onOffTrackContainer.append(this.trackOn);
        this.onTextEl = $('<div class="on-off-switch-text on-off-switch-text-on">' + this.textOn + '</div>');
        this.trackOn.append(this.onTextEl);

        if (this.textColorOn) {
            this.onTextEl.css("color", this.textColorOn);
        }

        this.trackOff = $('<div class="on-off-switch-track-off" style="overflow:hidden;border-radius:' + 0 + 'px;border-width:' + this.trackBorderWidth + 'px"><div class="track-off-gradient"></div></div>');
        this.offTextEl = $('<div class="on-off-switch-text on-off-switch-text-off">' + this.textOff + '</div>');
        this.onOffTrackContainer.append(this.trackOff);
        this.trackOff.append(this.offTextEl);

        if (this.textColorOff) {
            this.offTextEl.css("color", this.textColorOff);
        }

        this.styleText(this.onTextEl);
        this.styleText(this.offTextEl);

        this.whiteEl = $('<div class="on-off-switch-track-white"></div>');
        this.whiteEl2 = $('<div class="on-off-switch-track-white"></div>');
        this.trackOn.append(this.whiteEl);
        this.trackOff.append(this.whiteEl2);

        this.maxX = this.width - this.height;
    },

    styleText: function (el) {
        var textHeight = Math.round(this.height * this.textSizeRatio);
        var textWidth = Math.round(this.width - this.height);
        el.css({
            'line-height' : (this.height - (this.trackBorderWidth * 2)) + "px",
            'font-size' : textHeight + 'px',
            'left' : (this.height/2),
            'width':  textWidth
        });
    },

    renderThumb: function () {
        var borderSize = this.getBorderSize();
        this.thumb = $('<div class="on-off-switch-thumb" ></div>');
        var shadow = this.thumbShadow = $('<div class="on-off-switch-thumb-shadow" style="border-width:' + borderSize + 'px;"></div>');
        this.thumb.append(shadow);
        this.thumbColor = $('<div class="on-off-switch-thumb-color" style="left:' + borderSize + 'px;top:' + borderSize + 'px"></div>');
        this.thumb.append(this.thumbColor);
        if (this.trackColorOff) {
            this.trackOff.css("background-color", this.trackColorOff);
        }
        if (this.trackColorOn) {
            this.trackOn.css("background-color", this.trackColorOn);
        }
        this.el.append(this.thumb);
    },


    getBorderSize: function () {
        if (this.borderSize == 0) {
            this.borderSize = Math.round(this.height / 40);
        }
        return this.borderSize;
    },

    applyStyles: function () {
        var t = this.thumbColor;
        t.removeClass("on-off-switch-thumb-on");
        t.removeClass("on-off-switch-thumb-off");
        t.removeClass("on-off-switch-thumb-over");

        if (this.checked) {
            t.addClass("on-off-switch-thumb-on");
            this.thumb.css("left", this.width - this.height);
            this.onOffTrackContainer.css("left", 0);
        }
        else {
            this.onOffTrackContainer.css("left", this.getTrackPosUnchecked());
            t.addClass("on-off-switch-thumb-off");
            this.thumb.css("left", 0);
        }

    },

    isDragging: false,
    hasBeenDragged: false,
    startDragging: function (e) {

        this.isDragging = true;
        this.hasBeenDragged = false;

        this.startCoordinates = {
            x: this.getX(e),
            elX: this.thumb.position().left
        };
        return false;
    },

    drag: function (e) {
        if (!this.isDragging) {
            return;
        }

        this.hasBeenDragged = true;
        var x = this.startCoordinates.elX + this.getX(e) - this.startCoordinates.x;

        if (x < this.minX)x = this.minX;
        if (x > this.maxX)x = this.maxX;

        this.onOffTrackContainer.css("left", x - this.width + (this.height));
        this.thumb.css("left", x);
        return false;
    },

    getX: function (e) {
        var x = e.pageX;

        if (e.type && (e.type == "touchstart" || e.type == "touchmove")) {
            x = e.originalEvent.touches[0].pageX;
        }

        this.dragCurrentX = x;

        return x;

    },

    endDrag: function () {
        if (!this.isDragging)return;

        if (!this.hasBeenDragged) {
            this.toggle();
        } else {
            var x = this.startCoordinates.elX + this.dragCurrentX - this.startCoordinates.x;
            if (x < (this.width / 2 - (this.height / 2))) {
                this.animateLeft();
            } else {
                this.animateRight();
            }
        }
        this.isDragging = false;
    },

    getTrackPosUnchecked: function () {
        return 0 - this.width + this.height;
    },

    animateLeft: function () {
        this.onOffTrackContainer.animate({left: this.getTrackPosUnchecked()}, 100);
        this.thumb.animate({left: 0}, 100,"swing", this.uncheck.bind(this));
    },

    animateRight: function () {
        this.onOffTrackContainer.animate({left: 0}, 100);
        this.thumb.animate({left: this.maxX}, 100, "swing", this.check.bind(this));
    },

    check: function () {
        this.setChecked(true);
        this.applyStyles();
    },

    uncheck: function () {
        this.setChecked(false);
        this.applyStyles();
    },
    
    setChecked:function(checked){
        if(checked != this.checked){
            this.checked = checked;
            this.fireEvent('change', [this._get(), this]);
            this._set(this.checked ? this.checkedVal : this.uncheckedVal);
            this.change();
        }
    },

    _get:function(){
        return this.checked ? this.checkedVal: this.uncheckedVal;
    },
    
    toggle: function () {
        if (!this.checked) {
            this.checked = true;
            this.animateRight();
        } else {
            this.checked = false;
            this.animateLeft();
        }
        this._set(this.checked ? this.checkedVal : this.uncheckedVal);
        this.change();
    },

    val: function (val) {
        if(arguments.length == 1){
            if(val == this.checkedVal)this.setChecked(true); else this.setChecked(false);
        }
        return this._get();
    }
});