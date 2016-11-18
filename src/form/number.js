/**
 * A <a href="ludo.form.Text.html">ludo.form.Text</a> field accepting only numeric characters.
 * @namespace ludo.form
 * @class ludo.form.Number
 * @augments ludo.form.Text
 * @param {Object} config
 * @param {Number} config.minValue Optional minimum value
 * @param {Number} config.maxValue Optional maximum value
 * @param {Boolean} config.disableWheel Disable chaning values using mouse wheel.
 * @param {Boolean} config.reverseWheel Reverse wheel. Up = smaller value.
 * @param {Number} config.shiftIncrement Mouse wheel increment when shift key is pressed. Default = 10.
 */
ludo.form.Number = new Class({
    Extends:ludo.form.Text,
    type:'form.Number',
    regex:/^[0-9]+$/,
    validateKeyStrokes:true,
    formCss:{
        'text-align':'right'
    },

    stretchField:false,
    disableWheel:false,
    reverseWheel:false,
    shiftIncrement:10,

    __construct:function (config) {
        this.parent(config);
        this.setConfigParams(config, ['disableWheel','shiftIncrement','reverseWheel','minValue','maxValue']);

        if (this.minValue !== undefined)this.minValue = parseInt(this.minValue);
        if (this.maxValue !== undefined)this.maxValue = parseInt(this.maxValue);

        this.applyValidatorFns(['minValue','maxValue']);
    },

    ludoEvents:function () {
        this.parent();
        if (!this.disableWheel) {
            this.getFormEl().on('mousewheel', this._mouseWheel.bind(this));
        }
        this.getFormEl().on('keydown', this.keyIncrement.bind(this));
    },

    keyIncrement:function(e){
        if(e.key === 'up' || e.key === 'down'){
            if(e.key === 'up')this.incrementBy(1, e.shift);
            if(e.key === 'down')this.incrementBy(-1, e.shift);
            return false;
        }
        return undefined;
    },

    blur:function(){
        var value = this.getFormEl().val();
        if(!this.isValid(value)){
            if (this.minValue!==undefined && parseInt(value) < this.minValue) {
                value = this.minValue;
            }
            if (this.maxValue!==undefined && parseInt(value) > this.maxValue) {
                value = this.maxValue;
            }
            this._set(value);
        }
        this.parent();
    },

    _mouseWheel:function (e) {
        var delta = (e.originalEvent.wheelDelta || e.originalEvent.detail) / 120;
        if(delta == 0)return;
        this.incrementBy(delta >0 ? 1 : -1, e.shift);	// Math.ceil because of a mystery error in either firefox or mootools
        return false;
    },

    incrementBy:function (value, shift) {
        if(!this.value){
            if(this.minValue){
                this._set(this.minValue);
                return;
            }
            this._set(0);
        }

        if(this.reverseWheel)value = value * -1;
        value = parseInt(this.value) + (shift ? value * this.shiftIncrement : value);
        if(this.maxValue && value > this.maxValue)value = this.maxValue;
        if(this.minValue !== undefined && value < this.minValue)value = this.minValue;
        if(this.isValid(value)){
            this._set(value);
			this.fireEvent('change', [ value, this ]);
        }
    }
});