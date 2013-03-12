/**
 * @namespace form
 * @class Number
 * @description A customized text input only allowing numeric characters
 * @extends form.Text
 */
ludo.form.Number = new Class({
    Extends:ludo.form.Text,
    type:'form.Number',
    regex:/^[0-9]+$/,
    validateKeyStrokes:true,
    formCss:{
        'text-align':'right'
    },
    /**
     * Stretch is default set to false for numbers
     * @attribute {Boolean} stretchField
     */
    stretchField:false,

    /**
     * Disable changing values using mousewheel
     * @attribute {Boolean} disableWheel
     * @default false
     */
    disableWheel:false,

    /**
     * Reverse wheel, i.e. down for larger value, up  for smaller
     * @attribute {Boolean} reverseWheel
     * @default false
     */
    reverseWheel:false,

    /**
     * Minimum value
     * @attribute {Number} minValue
     * @default undefined
     */
    minValue:undefined,

    /**
     * Maximum value
     * @attribute {Number} maxValue
     * @default undefined
     */
    maxValue:undefined,

    /**
     * Amount to increment/decrement when using mousewheel while pressing shift-key
     * @attribute {Number} shiftIncrement
     * @default 10
     */
    shiftIncrement:10,

    ludoConfig:function (config) {
        this.parent(config);
        this.setConfigParams(config, ['disableWheel','shiftIncrement','reverseWheel']);

        if (config.minValue !== undefined)this.minValue = parseInt(config.minValue);
        if (config.maxValue !== undefined)this.maxValue = parseInt(config.maxValue);

        this.applyValidatorFns(['minValue','maxValue']);
    },

    ludoEvents:function () {
        this.parent();
        if (!this.disableWheel) {
            this.getFormEl().addEvent('mousewheel', this._mouseWheel.bind(this));
        }
        this.getFormEl().addEvent('keydown', this.keyIncrement.bind(this));

    },

    keyIncrement:function(e){
        if(e.key === 'up' || e.key === 'down'){
            if(e.key === 'up')this.incrementBy(1, e.shift);
            if(e.key === 'down')this.incrementBy(-1, e.shift);
            return false;
        }
    },

    blur:function(){
        var value = this.getFormEl().value;
        if(!this.isValid(value)){
            if (this.minValue!==undefined && parseInt(value) < this.minValue) {
                value = this.minValue;
            }
            if (this.maxValue!==undefined && parseInt(value) > this.maxValue) {
                value = this.maxValue;
            }
            this.setValue(value);
        }
        this.parent();
    },

    _mouseWheel:function (e) {
        this.incrementBy(e.wheel > 0 ? Math.ceil(e.wheel) : Math.floor(e.wheel), e.shift);	// Math.ceil because of a mystery error in either firefox or mootools
        return false;
    },
    /**
     * Increment value by
	 * @method incrementBy
     * @param {Number} value
     * @param {Boolean} shift
     */
    incrementBy:function (value, shift) {
        if(this.reverseWheel)value = value * -1;
        value = parseInt(this.value) + (shift ? value * this.shiftIncrement : value);
        if(this.maxValue && value > this.maxValue)value = this.maxValue;
        if(this.minValue !== undefined && value < this.minValue)value = this.minValue;
        if(this.isValid(value)){
            this.setValue(value);
			this.fireEvent('change', [ value, this ]);
        }
    }
});