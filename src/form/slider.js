/**
 * Slider form component
 * @namespace form
 * @class Slider
 * @extends form.LabelElement
 */
ludo.form.Slider = new Class({
    Extends:ludo.form.LabelElement,
    cssSignature:'ludo-form-slider',
    type:'form.Slider',
    fieldTpl:['<table ','cellpadding="0" cellspacing="0" border="0" width="100%">',
        '<tbody>',
        '<tr class="input-row">',
        '<td class="label-cell"><label class="input-label"></label></td>',
        '<td class="input-cell"></td>',
        '<td class="suffix-cell" style="display:none"></td>',
        '<td class="help-cell" style="display:none"></td>',
        '</tr>',
        '</tbody>',
        '</table>'
    ],

    /* No input element for slider */
    inputTag:undefined,
    inputType:undefined,

    /**
     * Size of slider background
     * @property sliderSize
	 * @optional
     * @private
     */
    sliderSize:100,

    /**
     * Direction of slider. If not explicit set, it will
     * be set to "horizontal" when width of slide is greater than height of slider,
     * otherwise it will be set to "vertical".
     * @property {String} direction
	 * @type String
     * @default horizontal
	 * @optional
     *
     */
    direction:'horizontal',

    /**
     * Minimum value of slider
     * @attribute {Number} minValue
     * @default 1
     */
    minValue:1,

    /**
     * Maximum value of slider
     * @attribute {Number} maxValue
     * @default 10
     */
    maxValue:10,

    height:undefined,

    /**
     * Revert x-, or y-axis, i.e. minimum value to the right instead of left or at the top instead of bottom
     * @attribute {Boolean} reverse
     * @default false
     */
    reverse:false,


    ludoConfig:function (config) {
        this.parent(config);
        this.setConfigParams(config, ['direction','minValue','maxValue','reverse']);
    },

    ludoRendered:function () {
        this.parent();
        this.moveSliderBackgrounds();
    },

    moveSliderBackgrounds:function () {
        var offset = Math.round(this.getHandleSize() / 2);
        var css = this.getDirection() == 'horizontal' ? ['left','right'] : ['top','bottom'];
        this.els['bgfirst'].style[css[0]] = offset + 'px';
        this.els['bglast'].style[css[1]] = offset + 'px';
    },

    addInput:function () {
        this.parent();

        var el = this.els.slider = new Element('div');
        this.els.slider.addEvent('click', this.sliderClick.bind(this));

        ludo.dom.addClass(el, 'ludo-form-slider-container');
        ludo.dom.addClass(el, 'ludo-form-slider-' + this.getDirection());
        this.getInputCell().adopt(el);

        this.addSliderBg('first');
        this.addSliderBg('last');

        this.createSliderHandle();
    },

    createSliderHandle:function () {
        var handle = this.els.sliderHandle = new Element('div');
        ludo.dom.addClass(handle, 'ludo-form-slider-handle');
        this.els.slider.adopt(handle);
        this.drag = new ludo.effect.Drag(this.getDragConfig());
    },

    addSliderBg:function (pos) {
        var el = this.els['bg' + pos] = new Element('div');
        ludo.dom.addClass(el, 'ludo-form-slider-bg-' + pos);
        this.els.slider.adopt(el);
    },

    getDragConfig:function () {
        return {
            el:this.els.sliderHandle,
            directions:this.getDirection() == 'horizontal' ? 'X' : 'Y',
            listeners:{
                'drag':this.receivePosition.bind(this)
            },
            minPos:0,
            maxPos:this.getSliderSize()
        };
    },

    sliderClick:function (e) {
        if (!e.target.hasClass('ludo-form-slider-handle')) {
            var pos = this.els.slider.getPosition();
            var offset = Math.round(this.getHandleSize() / 2);
            this.receivePosition({
                x:e.page.x - pos.x - offset,
                y:e.page.y - pos.y - offset
            });
        }

    },
    receivePosition:function (pos) {
        this.setValue(this.pixelToValue(this.getDirection() == 'horizontal' ? pos.x : pos.y));
        /**
         * Change event
         * @event change
         * @param value of form field
         * @param Component this
         */
        this.fireEvent('change', [ this.value, this ]);
    },

    pixelToValue:function (px) {
        var min = this.getMinValue();
        var max = this.getMaxValue();

        var sliderSize = this.getSliderSize();
        var ret = Math.round(px / sliderSize * (max - min)) + min;
        if (this.shouldReverseAxis()) {
            ret = max - ret;
        }

        return ret;
    },

    getDirection:function () {
        if (this.direction === undefined) {
            var size = this.getBody().getSize();
            if (size.x >= size.y) {
                this.direction = 'horizontal';
            } else {
                this.direction = 'vertical';
            }
        }
        return this.direction;
    },

    getMinValue:function () {
        return this.minValue;
    },

    getMaxValue:function () {
        return this.maxValue;
    },

    setValue:function (value) {
        if (value > this.getMaxValue()) {
            value = this.getMaxValue();
        } else if (value < this.getMinValue()) {
            value = this.getMinValue();
        }
        this.parent(value);
        this.positionSliderHandle();
    },

    resizeDOM:function () {
        this.parent();
        if (this.direction == 'horizontal') {
            this.sliderSize = this.els.slider.offsetWidth;
        } else {
            this.sliderSize = this.getBody().offsetHeight - ludo.dom.getMH(this.els.slider);
            this.els.slider.style.height = this.getHeight() + 'px';
        }
        this.sliderSize -= this.getHandleSize();

        this.positionSliderHandle();
        this.drag.setMaxPos(this.sliderSize);
    },

    positionSliderHandle:function () {
        this.els.sliderHandle.style[this.handleCssProperty] = this.getHandlePos() + 'px';
    },

    getHandlePos:function () {
        var ret = Math.round((this.value - this.minValue) / (this.maxValue - this.minValue) * this.sliderSize);
        if (this.shouldReverseAxis()) {
            ret = this.sliderSize - ret;
        }
        return ret;
    },
    _shouldReverse:undefined,
    shouldReverseAxis:function () {
        if (this._shouldReverse == undefined) {
            this._shouldReverse = (this.direction == 'horizontal' && this.reverse) || (this.direction == 'vertical' && !this.reverse);
        }
        return this._shouldReverse;
    },

    getSliderSize:function () {
        return this.sliderSize;
    },

    getHandleSize:function () {
        if (this.handleSize === undefined) {
            var cssProperty = 'height';
            this.handleCssProperty = 'top';
            if (this.getDirection() == 'horizontal') {
                cssProperty = 'width';
                this.handleCssProperty = 'left';
            }

            this.handleSize = parseInt(this.els.sliderHandle.getStyle(cssProperty).replace('px', ''));
        }
        return this.handleSize;
    }
});