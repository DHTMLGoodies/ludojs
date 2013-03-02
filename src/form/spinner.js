/**
 * Special form component used for Numbers. It will display control buttons
 * to the right of the input fields and you will be able to increment and decrement by
 * using the mouse wheel or by "nudging" the label.
 * @namespace form
 * @class Spinner
 * @extends form.Number
 */
ludo.form.Spinner = new Class({
    Extends:ludo.form.Number,
    type:'form.Spinner',
    inputTag:'input',
    inputType:'text',
    stretchField:false,
    regex:undefined,
    /**
     * Minimum value
     * @attribute maxValue
     * @type int
     * @default 0
     */
    maxValue:100,
    /**
     * Minimum value
     * @attribute {Number} minValue
     * @default 0
     */
    minValue:0,
    /**
     * amount of increment by click on arrow buttons or by rolling mouse wheel
     * @attribute increment
     * @type int
     * @default 1
     */
    increment:1,

    /**
     * Number of decimals
     * @config {Number|undefined} decimals
     * @default 0
     */
    decimals:0,

    /**
     * Disable arrow keyboard keys
     * @config {Boolean|undefined} disableArrowKeys
     * @default false
     * @optional
     */
    disableArrowKeys : false,

    ludoConfig:function (config) {
        this.parent(config);
        this.setConfigParams(config, ['increment','decimals','disableArrowKeys']);
    },

    mode:{},

    ludoRendered:function () {
        this.parent();
        this.createSpinnerElements();
        if (!this.fieldWidth) {
            this.getFormEl().setStyle('width', (this.maxValue + '').length * 15);
        }
        this._setStyles();
        this._createEvents();
        this._clearMode();
        this.setSpinnerValue(this.value);
        this._setContainerSize();
    },

    createSpinnerElements:function () {
        this.createSpinnerContainer();
        var input = this.getFormEl();
        input.setProperty('maxlength', (this.maxValue + '').length);
        ludo.dom.addClass(input, 'ludo-spinbox-input');

        var p = this.els.spinnerContainer;
        this.els.arrowsContainer = this._createContainer({
            cls:'ludo-spinbox-arrows-container',
            renderTo:p
        });
        this.els.upArrow = this._createContainer({
            cls:'ludo-spinbox-arrow-up',
            renderTo:this.els.arrowsContainer
        });
        this.els.downArrow = this._createContainer({
            cls:'ludo-spinbox-arrow-down',
            renderTo:this.els.arrowsContainer
        });
        this.els.arrowSeparator = this._createContainer({
            cls:'ludo-spinbox-arrow-separator',
            renderTo:this.els.arrowsContainer
        });
    },

    _clearMode:function () {
        this.mode = {
            name:false,
            modeElement:null,
            shiftKey:false,
            timeout:false
        }
    },

    createSpinnerContainer:function () {
        var el = this.els.spinnerContainer = new Element('div');
        this.getFormEl().getParent().adopt(el);
        el.adopt(this.getFormEl());
        ludo.dom.addClass(el, 'ludo-spinbox-container')
    },

    _createContainer:function (config) {
        config = Object.merge({
            tag:'div',
            cls:''
        }, config);

        var el = new Element(config.tag);
        el.addClass(config.cls);

        if (config.renderTo) {
            config.renderTo.adopt(el);
        }
        return el;
    },

    _setStyles:function () {
        this.els.spinnerContainer.setStyles({
            position:'relative'
        });
        this.getFormEl().setStyles({
            border:'0px'
        });
        this.els.arrowsContainer.setStyles({
            position:'absolute',
            top:'0px',
            height:'100%',
            right:'0px'
        });
        this.els.upArrow.setStyles({
            'position':'absolute',
            'background-repeat':'no-repeat',
            'background-position':'center center',
            'height':' 50%',
            'top':'0px'
        });
        this.els.downArrow.setStyles({
            'position':'absolute',
            'background-repeat':'no-repeat',
            'background-position':'center center',
            'height':'50%',
            'bottom':'0px'
        });
        this.els.arrowSeparator.setStyles({
            'position':'absolute',
            'top':'50%'
        });

        this.els.spinnerContainer.setStyles({ width:this.fieldWidth });
    },
    _initNudge:function (e) {
        this._startMode({
            name:'nudge',
            x:e.page.x,
            initValue:parseInt(this.getValue()),
            labelWidth:this.els.label.getSize().x
        });
        return false;
    },
    _nudge:function (e) {
        if (this.mode.name == 'nudge') {
            var movement = e.page.x - this.mode.x;
            var multiply = (this.maxValue - this.minValue) / this.mode.labelWidth;
            var value = this.mode.initValue + (movement * multiply);

            if (this.increment > 1) {
                value = Math.round(value);
                if (value > 0 && (value % this.increment)) {

                    value = value - (value % this.increment) + this.increment;
                    if (value > this.maxValue) {
                        value = this.maxValue;
                    }
                }
            }
            this.setSpinnerValue(value);

            var currentValue = this.getValue();
            if (currentValue == this.maxValue || currentValue == this.minValue) {
                this._initNudge(e);
            }
        }
    },
    _setContainerSize:function () {
        var width = this.getFormEl().getSize().x;
        if (!width)return;

        if (this.stretchField) {
            width -= 11;
        }
        width++;
        this.els.spinnerContainer.setStyle('width', width);
    },
    _createEvents:function () {
        if (!this.disableWheel) {
            this.getFormEl().addEvent('mousewheel', this._mouseWheel.bind(this));
        }
        this.getFormEl().addEvent('keydown', this._validateKeyStroke.bind(this));
        this.els.upArrow.addEvent('mouseover', this._arrowMouseOver.bind(this));
        this.els.downArrow.addEvent('mouseover', this._arrowMouseOver.bind(this));
        this.els.upArrow.addEvent('mouseout', this._arrowMouseOut.bind(this));
        this.els.downArrow.addEvent('mouseout', this._arrowMouseOut.bind(this));
        this.els.upArrow.addEvent('mousedown', this._arrowMouseDown.bind(this));
        this.els.downArrow.addEvent('mousedown', this._arrowMouseDown.bind(this));
        this.els.upArrow.addEvent('mouseup', this._arrowMouseUp.bind(this));
        this.els.downArrow.addEvent('mouseup', this._arrowMouseUp.bind(this));
        Window.getDocument().addEvent('mouseup', this._clearMode.bind(this));

        if (this.els.label) {
            this.els.label.setStyle('cursor', 'w-resize');
            document.id(this.els.label).addEvents({
                'mousedown':this._initNudge.bind(this),
                'selectstart':function () {
                    return false;
                }
            });
            Window.getDocument().addEvent('mousemove', this._nudge.bind(this));
        }
    },
    _arrowMode:function () {
        if (this.mode.name) {
            switch (this.mode.modeElement) {
                case this.els.upArrow:
                    this.incrementBy(1, this.mode.shiftKey);
                    break;
                case this.els.downArrow:
                    this.incrementBy(-1, this.mode.shiftKey);
                    break;
                default:
            }
            this.mode.timeout = Math.max(Math.round(this.mode.timeout * 0.8), 15);
            setTimeout(this._arrowMode.bind(this), this.mode.timeout);
        }
    },
    _startMode:function (modeConfig) {
        this.mode = modeConfig;
        switch (this.mode.name) {
            case 'mousedown':
                this._arrowMode();
                break;
            default:
        }
    },
    _arrowMouseDown:function (e) {
        ludo.dom.addClass(e.target, 'ludo-spinbox-arrow-downeffect');
        this._startMode({
            name:'mousedown',
            modeElement:e.target,
            shiftKey:e.shift,
            timeout:400
        });
    },
    _arrowMouseUp:function (e) {
        e.target.removeClass('ludo-spinbox-arrow-downeffect');
    },
    _arrowMouseOver:function (e) {
        ludo.dom.addClass(e.target, 'ludo-spinbox-arrow-overeffect');
    },
    _arrowMouseOut:function (e) {
        e.target.removeClass('ludo-spinbox-arrow-overeffect');
    },
    incrementBy:function (value, shiftKey) {
        value = value * (shiftKey ? this.shiftIncrement : this.increment);
        this.setSpinnerValue(parseInt(this.getValue()) + value);
    },
    validateSpinnerValue:function (value) {
        value = value || 0;
        if (value < this.minValue)value = this.minValue;
        if (value > this.maxValue)value = this.maxValue;
        return parseInt(value);
    },
    setSpinnerValue:function (value) {
        this.value = this.validateSpinnerValue(value).toFixed(this.decimals);
        this.getFormEl().value = this.value;
        /**
         * Change event fired when value is changed
         * @event change
         * @param value
         * @param Component this
         */
        this.fireEvent('change', value, this);
    },

    _validateKeyStroke:function (e) {
        if (!this.disableArrowKeys) {
            if (e.key == 'up') {
                this.incrementBy(1, e.shift);
                return false;
            }
            if (e.key == 'down') {
                this.incrementBy(-1, e.shift);
                return false;
            }
        }

        if (e.key == 'backspace' || e.key == 'delete' || e.key == 'tab') {
            return true;
        }

        if (this.minValue < 0 && this.html.el.value.indexOf('-') == -1 && e.key == '-') {
            return true;
        }
        if (this.decimals && (e.code == 190 || e.code == 46) && this.html.el.value.indexOf('.') == -1) {
            return true;
        }
        if (Event.Keys.hasOwnProperty(e.key)) {
            return true;
        }

        var regExp = new RegExp('[0-9]');
        return regExp.test(e.key);
    },

    resizeDOM:function () {
        this.parent();
        if (this.stretchField) {
            this._setContainerSize();
        }
    }
});