// TODO this class should be rewritten
/* Create spinner with buttons on each side */
/**
 * Special form component used for Numbers. It will display control buttons
 * to the right of the input fields and you will be able to increment and decrement by
 * using the mouse wheel or by "nudging" the label.
 * @namespace ludo.form
 * @class ludo.form.Spinner
 * @param {object} config
 * @param {number} config.minValue min value, default 0
 * @param {number} config.maxValue max value, default 100
 * @param {number} config.increment amount of increment by click on arrow buttons or by rolling mouse wheel
 * @param {number} config.decimals Number of decimals
 */
ludo.form.Spinner = new Class({
    Extends:ludo.form.Number,
    type:'form.Spinner',
    inputTag:'input',
    inputType:'text',
    stretchField:false,
    regex:undefined,

    maxValue:100,

    minValue:0,

    increment:1,
    
    decimals:0,


    __construct:function (config) {
        this.parent(config);
        this.setConfigParams(config, ['increment', 'decimals']);
    },

    mode:{},

    __rendered:function () {
        this.parent();
        this.createSpinnerElements();

        if (!this.fieldWidth) {
            this.getFormEl().css('width', (this.maxValue + '').length * 15);
        }
        this._css();
        this._createEvents();
        this._clearMode();
        this.setSpinnerValue(this.value);
        this._setContainerSize();
    },

    createSpinnerElements:function () {
        this.createSpinnerContainer();
        var input = this.getFormEl();
        input.attr('maxlength', (this.maxValue + '').length);
        input.addClass('ludo-spinbox-input');

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
        var el = this.els.spinnerContainer = jQuery('<div class="ludo.spinbox-container"></div>');
        this.getFormEl().parent().append(el);
        el.append(this.getFormEl());
    },

    _createContainer:function (config) {
        config = Object.merge({
            tag:'div',
            cls:''
        }, config);

        var el = jQuery('<' + config.tag + '>');
        el.addClass(config.cls);

        if (config.renderTo) {
            config.renderTo.append(el);
        }
        return el;
    },

    _css:function () {
        this.els.spinnerContainer.css('position', 'relative');
        this.getFormEl().css({
            border:'0px'
        });
        this.els.arrowsContainer.css({
            position:'absolute',
            top:'0px',
            height:'100%',
            right:'0px'
        });
        this.els.upArrow.css({
            'position':'absolute',
            'background-repeat':'no-repeat',
            'background-position':'center center',
            'height':' 50%',
            'top':'0px'
        });
        this.els.downArrow.css({
            'position':'absolute',
            'background-repeat':'no-repeat',
            'background-position':'center center',
            'height':'50%',
            'bottom':'0px'
        });
        this.els.arrowSeparator.css({
            'position':'absolute',
            'top':'50%'
        });

        this.els.spinnerContainer.css('width', this.fieldWidth);
    },
    _initNudge:function (e) {
        this._startMode({
            name:'nudge',
            x:e.page.x,
            initValue:parseInt(this.getValue()),
            labelWidth:this.els.label.width()
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
        var width = this.getFormEl().width();
        if (!width)return;

        if (this.stretchField) {
            width -= 11;
        }
        width++;
        this.els.spinnerContainer.width(width);
    },
    _createEvents:function () {
        if (!this.disableWheel) {
            this.getFormEl().on('mousewheel', this._mouseWheel.bind(this));
        }
        this.getFormEl().on('keydown', this._validateKeyStroke.bind(this));
        this.els.upArrow.on('mouseover', this._arrowMouseOver.bind(this));
        this.els.upArrow.on('mouseout', this._arrowMouseOut.bind(this));
        this.els.upArrow.on('mousedown', this._arrowMouseDown.bind(this));
        this.els.upArrow.on('mouseup', this._arrowMouseUp.bind(this));

        this.els.downArrow.on('mouseover', this._arrowMouseOver.bind(this));
        this.els.downArrow.on('mouseout', this._arrowMouseOut.bind(this));
        this.els.downArrow.on('mousedown', this._arrowMouseDown.bind(this));
        this.els.downArrow.on('mouseup', this._arrowMouseUp.bind(this));

        jQuery(document.documentElement).on('mouseup', this._clearMode.bind(this));

        if (this.els.label) {
            this.els.label.css('cursor', 'w-resize');
            jQuery(this.els.label).on({
                'mousedown':this._initNudge.bind(this),
                'selectstart':function () {
                    return false;
                }
            });
            jQuery(document.documentElement).on('mousemove', this._nudge.bind(this));
        }
    },
    _arrowMode:function () {

        if (this.mode.name) {
            switch (this.mode.mode) {
                case "up":
                    this.incrementBy(1, this.mode.shiftKey);
                    break;
                case "down":
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
        jQuery(e.target).addClass('ludo-spinbox-arrow-downeffect');
        var m = jQuery(e.target).hasClass("ludo-spinbox-arrow-up") ? "up":"down";
        this._startMode({
            name:'mousedown',
            mode: m,
            modeElement:e.target,
            shiftKey:e.shift,
            timeout:400
        });
    },
    _arrowMouseUp:function (e) {
        jQuery(e.target).removeClass('ludo-spinbox-arrow-downeffect');
    },
    _arrowMouseOver:function (e) {
        jQuery(e.target).addClass('ludo-spinbox-arrow-overeffect');
    },
    _arrowMouseOut:function (e) {
        jQuery(e.target).removeClass('ludo-spinbox-arrow-overeffect');
    },
    incrementBy:function (value, shiftKey) {
        value = value * (shiftKey ? this.shiftIncrement : this.increment);
        this.setSpinnerValue(parseInt(this._get()) + value);
    },
    validateSpinnerValue:function (value) {
        value = value || 0;
        if (value < this.minValue)value = this.minValue;
        if (value > this.maxValue)value = this.maxValue;
        return parseInt(value);
    },
    setSpinnerValue:function (value) {
        this.value = this.validateSpinnerValue(value).toFixed(this.decimals);
        this.getFormEl().val(this.value);

        this.fireEvent('change', value, this);
    },

    _validateKeyStroke:function (e) {
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

        return Event.Keys.hasOwnProperty(e.key) ? true : /[0-9]/.test(e.key);
    },

    resizeDOM:function () {
        this.parent();
        if (this.stretchField) {
            this._setContainerSize();
        }
    }
});