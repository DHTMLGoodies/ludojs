/**
 * Seekbar form view.
 * For live example, see <a href="../demo/form/seekbar.php">Seekbar demo</a>
 * @namespace ludo.form
 * @class ludo.form.Seekbar
 * @augments ludo.form.Element
 * @memberOf ludo.form
 * @param {object} config
 * @param {number} config.value Initial value, default 0
 * @param {number} config.orientation Orientation of seekbar, "horizontal" or "vertical", default: "vertical"
 * @param {number} config.minValue Minimum value, default 0
 * @param {number} config.maxValue Maximum value, default 10
 * @param {number} config.negativeColor color of seekbar line below(vertical) and left(horizontal mode), default: #888
 * @param {number} config.positiveColor color of seekbar line above(vertical) and right of(horizontal mode), default: #CCC
 * @param {number} config.thumbColor Color of thumb, default: #888
 * @param {number} config.thumbAlpha Alpha(opacity) of thumb in range 0-1 while dragging, default: 1
 * @param {number} config.barSize Size(height or width) of bar in pixels, default: 2
 * @param {number} config.needleSize Fraction size of of needle(circle inside thumb) relative to thumb size, default: 0.2
 * @param {number} config.increments Optional increment value. If you want to disable decimals, set this value to 1
 *
 * @fires change Event fired when value is changed.
 *
 * @example
 * new ludo.form.Seekbar({
        renderTo:document.body,
        orientation:"vertical",
        layout:{
            width:50, height:300
        },
        id: 'red', // id of view for easy access using ludo.get('red') later
        minValue:0,maxValue:255, // Min value set to 0, max set to 255
        thumbColor:'#D32F2F', // Red color of seekbar thumb
        negativeColor:'#D32F2F', // Same red color on the seekbar(below thumb)
        type: 'form.Seekbar', // Type of view is form.Seekbar
        stateful:true, // value will be saved, i.e. saved
        value:100, // Sets a default red value of 100
        css:{
            'padding-left': 5,'padding-right':5 // some space between the seekbars
        },
        listeners:{
            change:updateColor // call the updateColor function above when red value is changed
        }
    });
 */


ludo.form.Seekbar = new Class({
    Extends: ludo.form.Element,
    thumbAlpha: 1,
    negativeColor: '#888',
    positiveColor: '#ccc',
    thumbColor: '#888',
    minValue: 0,
    maxValue: 10,
    value: 0,

    barSize: 2,

    el: undefined,
    elNegative: undefined,
    elPositive: undefined,

    thumb: undefined,
    thumbInner: undefined,
    thumbOuter: undefined,
    needleSize: 0.2,

    area: {width: 0, height: 0, max: 0},
    valueArea: {min: 0, max: 0, width: 0},

    thumbSize: 0,
    isActive: false,

    startCoordinates: undefined,

    valueListener: undefined,

    reverse:false,
    increments:undefined,
    orientation : 'vertical',

    ludoConfig:function(config){
        this.parent(config);
        this.setConfigParams(config, ["increments", "orientation", "reverse", "minValue", "maxValue", "value", "valueListener", "negativeColor", "positiveColor", "needleSize", "barSize"]);

        if (config.thumbColor != undefined) {
            if (config.thumbColor.length == 9) {
                var alpha = config.thumbColor.substr(1, 2);
                this.thumbAlpha = parseInt(alpha, 16) / 255;
                config.thumbColor = "#" + config.thumbColor.substr(3);
            }
            this.thumbColor = config.thumbColor;
        }
    },

    renderSeekbar:function(){
        this.el = $('<div class="dhtmlgoodies-seekbar" style="position:relative;width:100%;height:100%"></div>');

        this.getBody().append(this.el);

       // this.orientation = this.getWidth() >= this.getHeight() ? 'horizontal' : 'vertical';

        this.elNegative = $('<div class="seekbar-negative" style="position:absolute;z-index:1"></div>');
        this.elPositive = $('<div class="seekbar-positive" style="position:absolute;z-index:1"></div>');

        if (this.negativeColor != undefined) {
            this.elNegative.css("background-color", this.negativeColor);
        }
        if (this.positiveColor != undefined) {
            this.elPositive.css("background-color", this.positiveColor);
        }

        this.thumb = $('<div style="position:absolute;z-index:4"></div>');
        this.thumbInner = $('<div class="seekbar-thumb-needle" style="position:absolute;z-index:5;background-color:' + this.thumbColor + '"></div>');
        this.thumbOuter = $('<div class="seekbar-thumb" style="position:absolute;z-index:5;width:100%;height:100%;background-color:' + this.thumbColor + '"></div>');

        if (this.thumbColor != undefined) {
            this.thumbInner.css("background-color", this.thumbColor);
            this.thumbOuter.css("background-color", this.thumbColor);

        }

        this.updateAlpha();

        this.thumb.append(this.thumbInner);
        this.thumb.append(this.thumbOuter);

        this.el.append(this.elNegative);
        this.el.append(this.elPositive);
        this.el.append(this.thumb);

        this.eventEl = $('<div style="position:absolute;z-index:3;width:100%;height:100%"></div>');
        this.el.append(this.eventEl);
        this.eventEl.on("click", this.clickOnBar.bind(this));


        this.thumb.on(ludo.util.getDragStartEvent(), this.startDragging.bind(this));
        $(document.documentElement).on(ludo.util.getDragMoveEvent(), this.drag.bind(this));
        $(document.documentElement).on(ludo.util.getDragEndEvent(), this.endDrag.bind(this));

    },

    clickOnBar: function (e) {
        var pos = this.orientation == "vertical" ? this.area.size - e.offsetY  - e.currentTarget.offsetTop : e.offsetX;

        pos -= (this.thumbSize / 2);

        if (e.target && e.target.className == "seekbar-thumb")return;

        var value = this.minValue + (pos / this.valueArea.size * (this.maxValue - this.minValue));
        if(this.reverse){
            value = this.maxValue - value;
        }
        value = Math.min(this.maxValue, Math.max(this.minValue, value));
        this.val(value);

        if (this.valueListener != undefined) {
            this.valueListener.call(this, this.value);
        }
    },

    /**
     * Function to set or get value
     * @member {function}
     * @inner
     * @param {Number} value Optional, when set, the seekbar will be updated with this value
     * @memberof ludo.form.Seekbar
     * @returns {number}
     * @example
     * // set value
     * ludo.get("seekbar").val(100);
     * // get value
     * var val = ludo.get("seekbar").val();
     */
    val: function (value) {
        if(arguments.length != 0){
            this._set(value);
            this.change();
        }

        return this.value;
    },


    _set:function(value){
        if(this.increments != undefined){
            value -= (value % this.increments);
        }

        value = Math.max(this.minValue, value);
        value = Math.min(this.maxValue, value);

        value = this.parent(value);

        this.positionBars();
        this.positionThumb();

        return value;
    },

    ludoRendered:function(){
        this.renderSeekbar();
        this.parent();
    },

    resizeDOM:function(){
        this.parent();



        this.positionItems();
    },

    positionItems: function () {
        
        this.area.width = this.el.width();
        this.area.height = this.el.height();
        this.area.size = Math.max(this.area.width, this.area.height);

        this.thumbSize = Math.min(this.area.height, this.area.width);
        this.thumbSize += this.thumbSize % 2;
        var size = Math.max(this.area.width, this.area.height);

        this.thumbOuter.css({
            'width': this.thumbSize, 'height': this.thumbSize, 'border-radius': this.thumbSize / 2
        });
        this.thumb.css({
            'width': this.thumbSize, 'height': this.thumbSize, 'border-radius': this.thumbSize / 2
        });

        var needleSize = Math.round(this.thumbSize * this.needleSize);
        needleSize += needleSize % 2;
        var pos = (this.thumbSize / 2) - (needleSize / 2);

        this.thumbInner.css({
            width: needleSize, height: needleSize, borderRadius: needleSize / 2, left: pos, top: pos
        });

        this.valueArea.min = this.thumbSize / 2;
        this.valueArea.max = size - this.thumbSize / 2;
        this.valueArea.size = this.valueArea.max - this.valueArea.min;

        var barPos = (this.thumbSize / 2) - (this.barSize / 2);
        if (this.orientation == 'horizontal') {

            this.elNegative.css({
                "left": this.valueArea.min, top: barPos, height: this.barSize
            });
            this.elPositive.css({
                "left": this.valueArea.min, top: barPos, height: this.barSize
            });
        } else {

            this.elNegative.css({
                "top": 0, width: this.barSize, left: barPos
            });

            this.elPositive.css({
                "top": this.valueArea.min, width: this.barSize, left: barPos
            });
        }
        var br = Math.floor(this.barSize / 2) + this.barSize % 2;

        this.elNegative.css("border-radius", br);
        this.elPositive.css("border-radius", br);

        this.positionBars();
        this.positionThumb();

    },


    positionThumb: function () {
        var pos = this.getValuePos();
        if (this.orientation == 'horizontal') {
            this.thumb.css("left", pos);
        } else {
            this.thumb.css("top", pos);
        }
    },

    positionBars: function () {
        var pos = this.getValuePos();

        if (this.orientation == 'horizontal') {
            if(this.reverse){
                this.elNegative.css({
                    left : pos + this.valueArea.min,
                    width: this.valueArea.size - pos
                });

                this.elPositive.css(
                    {"left": this.valueArea.min,
                        "width": pos}
                );

            }else{
                this.elNegative.css("width", pos);
                this.elPositive.css({"left": pos + this.valueArea.min, "width": this.valueArea.size - pos});

            }



        } else {

            if(this.reverse){
                this.elPositive.css({
                    "height" :this.valueArea.size - pos,
                    top:pos + this.valueArea.min
                });
                this.elNegative.css({
                    top:this.valueArea.min,
                    height: pos
                });
            }else{
                this.elPositive.css("height", pos);
                this.elNegative.css({
                    top: pos + this.valueArea.min,
                    height: this.valueArea.size - pos
                });
            }

        }

    },

    getValuePos: function () {
        if (this.orientation == 'horizontal') {
            var ratio = (this.value - this.minValue) / this.maxValue;
            var val = (this.valueArea.size * ratio);
            return this.reverse ? this.valueArea.size - val : val;
        } else {
            if(this.reverse){
                return (this.valueArea.min + (this.valueArea.size * (this.value - this.minValue) / this.maxValue)) - this.valueArea.min;
            }else{
                return this.valueArea.max - (this.valueArea.min + (this.valueArea.size * (this.value - this.minValue) / this.maxValue));

            }
        }
    },

    startDragging: function (e) {
        this.thumbOuter.css("opacity", "");
        this.thumbOuter.addClass("seekbar-thumb-over");
        this.active = true;

        var position = this.thumb.position();

        var x = e.pageX;
        var y = e.pageY;

        if (e.type && e.type == "touchstart") {
            x = e.originalEvent.touches[0].pageX;
            y = e.originalEvent.touches[0].pageY;
        }

        this.startCoordinates = {x: x, y: y, elX: position.left, elY: position.top};

        return false;
    },

    drag: function (e) {
        if (!this.active)return;

        var x = e.pageX;
        var y = e.pageY;

        if (e.type && e.type == "touchmove") {
            x = e.originalEvent.touches[0].pageX;
            y = e.originalEvent.touches[0].pageY;
        }

        var pos = 0;
        if (this.orientation == 'horizontal') {
            pos = this.startCoordinates.elX + x - this.startCoordinates.x;

        } else {
            pos = this.startCoordinates.elY + y - this.startCoordinates.y;
        }


        if (pos < 0)pos = 0;
        if (pos > this.area.size - this.thumbSize)pos = this.area.size - this.thumbSize;

        var value =  this.minValue + (pos / this.valueArea.size * (this.maxValue - this.minValue));

        if ((this.orientation == 'vertical' && !this.reverse) || (this.orientation == "horizontal" && this.reverse)) {
            value = this.maxValue - value;
        }


        this.val(value);



        this.positionBars();

        if (this.orientation == 'horizontal') {

            this.thumb.css("left", this.getValuePos());
        } else {
            this.thumb.css("top", this.getValuePos());
        }

        return false;
    },

    updateAlpha: function () {
        if (this.thumbAlpha < 1) {
            this.thumbOuter.css("opacity", this.thumbAlpha);
        }
    },

    endDrag: function () {
        if (!this.active)return;

        this.updateAlpha();

        this.thumbOuter.removeClass("seekbar-thumb-over");

        this.active = false;
    }

});
