/**
 * TODO specify which form the button belongs to. used for disableOnInvalid
 * Button component
 * The button class extends ludo.form.Element
 * @namespace ludo.form
 * @class ludo.form.Button
 * @param {Object} config
 * @param {Boolean} config.submittable Default: false. When false, the JSON from parentView.getForm().values() will not not include the button.
 * @param {Boolean} config.disabled Default: false. True to initially disable the button
 * @param {Boolean} config.selected True to set the button initial selected.
 * @param {Boolean} config.toggle When true, the button will remain in it's pressed until a new press on button occurs.
 * @param {String|Object} config.toggleGroup Used for toggling between buttons. Example: { type:'form.Button', toggle:true, toggleGroup:'myGroup',value:'1' }, 
 * { type:'form.Button', toggle:true, toggleGroup:'myGroup',value:'2' }. Here, two buttons are assigned to the same toggleGroup 'myGroup'. When one button is pressed,
 * the other button will be unpressed.
 * @param {Boolean} config.disableOnInvalid True to automatically disable button when parent form is invalid.
 * @param {String} config.size Size of button's','m','l' (small, medium or large)
 * @param {String} config.formRef Id of parent view. disableOnInvalid will be triggred when the form of this view is invalid.
 * @param {String} config.listeners Event listeners. Example:
 * <code>
 *     listeners: {
 *      'click': function() { }
 *      }
 * </code>
 * @param {String} config.icon Path to icon image placed left to button text.
 * @param {String} config.iconPressed Path to icon image displayed when button is pressed.
 * @fires ludo.form.Button#click Fired on click. Arguments: 1) valud, 2) ludo.form.Button
 */
ludo.form.Button = new Class({
    Extends:ludo.form.Element,
    type:'form.Button',
    defaultSubmit:false,
    inputType:'submit',
    cssSignature:'ludo-form-button',
    name:'',
    /*
     * Text of button
     * @attribute {String} value
     */
    value:'',
    els:{
        el:null,
        txt:null
    },
    component:null,

    menu:undefined,
    submittable:false,


    toggle:false,

    /*
     Assign button to a toggleGroup
     @memberof ludo.form.Button.prototype
     @attribute {Object} toggleGroup
     @default undefined
	 @example
		 var buttonLeft = new ludo.form.Button({
		 	value : 'left',
		 	toggle:true,
		 	toggleGroup:'alignment'
		 });

		 var buttonCenter = new ludo.form.Button({
		 	value : 'center',
		 	toggle:true,
		 	toggleGroup:'alignment'
		 });

	 which creates a singleton ludo.form.ToggleGroup instance and
	 assign each button to it.

	 When using a toggle group, only one button can be turned on. The toggle
	 group will automatically turn off the other button.

	 You can create your own ludo.form.ToggleGroup by extending
	 ludo.form.ToggleGroup and set the toggleGroup property to an
	 object:
	 @example
		 var buttonLeft = new ludo.form.Button({
		 	value: 'left',
		 	toggle:true,
		 	toggleGroup:{
		 		type : 'ludo.myapp.form.MyToggleGroup'
		 	}
		 });
     */

    toggleGroup:undefined,

    /*
     * Disable button when form of parent component is invalid
     * @memberof ludo.form.Button.prototype
     * @attribute {Boolean} disableOnInvalid
     * @default false
     */
    disableOnInvalid:false,

    /*
     * True to initially disable button
     * @attribute {Boolean} disabled
     * @default false
     */
    disabled:false,

    selected:false,

    overflow:'hidden',
    _btn:true,
    /*
     * Path to button icon
     * @attribute {String} icon
     * @memberof ludo.form.Button.prototype
     * @default undefined
     */
    icon:undefined,
    iconPressed:undefined,

    active:false,

	/*
	 * Size,i.e height of button. Possible values 's', 'm' and 'l' (small,medium, large)
     * @memberof ludo.form.Button.prototype
	 * @config {String} size
	 * @default 'm'
	 */
	size : 'm',

	iconWidths:{
		's' : 15,
		'm' : 25,
        'l' : 34,
		'xl' : 44
	},

	heights:{
		's' : 15,
		'm' : 25,
        'l' : 35,
		'xl' : 45
	},

    __construct:function (config) {
		this.parent(config);

        var val = config.value || this.value;
        var len = val ? val.length : 5;
        this.layout.width = this.layout.width || Math.max(len * 10, 80);


        this.__params(config, ['size','menu','icon','toggle','disableOnInvalid','defaultSubmit','disabled','selected','formView','iconPressed']);

        if (config.toggleGroup !== undefined) {
            if (ludo.util.type(config.toggleGroup) === 'string') {
                config.toggleGroup = {
                    type:'form.ToggleGroup',
                    id:'toggleGroup-' + config.toggleGroup
                };
            }
            config.toggleGroup.singleton = true;
            this.toggleGroup = ludo._new(config.toggleGroup);
            this.toggleGroup.addButton(this);
        }
    },


    ludoDOM:function () {
        this.parent();

        this.getEl().css('display', this.isHidden() ? 'none' : 'block');

		this.getEl().addClass('ludo-form-button-' + this.size);

        this.addLeftEdge();
        this.addRightEdge();

        this.addLabel();

        if (this.icon) {
            this.addIcon();
        }

        var b = this.$b();

        b.css('padding-left', 0);
        this.getEl().on('selectstart', ludo.util.cancelEvent);
    },

    ludoEvents:function () {
        this.parent();
        var el = this.$b();

        el.on('click', this.click.bind(this));
        el.mouseenter(this.mouseOver.bind(this));
        el.mouseleave(this.mouseOut.bind(this));
        el.on('mousedown', this.mouseDown.bind(this));

		// TODO need to bound in order to remove event later. Make this easier and more intuitive
		this.mouseUpBound = this.mouseUp.bind(this);
        jQuery(document.body).on('mouseup', this.mouseUpBound);
        if (this.defaultSubmit) {
			this.keyPressBound = this.keyPress.bind(this);
            jQuery(window).on('keypress', this.keyPressBound);
        }
    },

    __rendered:function () {
        this.parent();
        if (this.disabled) {
            this.disable();
        }
        if (this.toggle && this.active) {
            this.$b().addClass('ludo-form-button-pressed');
        }

        this.component = this.getParentComponent();
        if(this.component && this.disableOnInvalid){
            var m;
            if(this.formView != undefined){
                m = ludo.get(this.formView);
            }else{
                 m = this.component.getForm();
            }
            m.addEvent('valid', this.enable.bind(this));
            m.addEvent('invalid', this.disable.bind(this));
            if(!m.isValid())this.disable();
        }
    },

	remove:function(){
		this.parent();
		jQuery(document.body).off('mouseup', this.mouseUpBound);
		if (this.defaultSubmit) jQuery(window).off('keypress', this.keyPressBound);
	},

    addLabel:function () {
        var txt = this.els.txt = jQuery('<div>');
        txt.addClass('ludo-form-button-value');
        txt.css({
            'width':'100%',
			'height' : this.heights[this.size] - 2,
            'position':'absolute',
            'left':this.icon ? this.iconWidths[this.size] + 'px' : '0px',
            'text-align':this.icon ? 'left' : 'center',
            'z-index':7
        });
        txt.html(this.value);
        this.$b().append(txt);
    },

    addIcon:function () {
        var el = this.els.icon = jQuery('<div>');
        el.css({
            position:'absolute',
            width:this.iconWidths[this.size],
            'z-index':8,
            left:0,
            top:0,
            height:'100%',
            'background-image':'url(' + this.icon + ')',
            'background-repeat':'no-repeat',
            'background-position':'center center'
        });
        el.insertBefore(this.els.txt);

    },

    setIcon:function(src){
        if(!this.els.icon){
            this.addIcon();
        }
        this.icon = src;
        this.els.icon.css('background-image', 'url(' + src + ')');
    },

    addLeftEdge:function () {
        var bg = this.els.buttonLeftludo = jQuery('<div>');
        bg.addClass('ludo-form-button-bg-left');
        bg.addClass('ludo-form-button-' + this.size +'-bg-left');
        bg.css({
            position:'absolute',
            'left':0,
            'z-index':5
        });
        this.$b().append(bg);
    },

    addRightEdge:function () {
        var bg = jQuery('<div>');
        bg.addClass('ludo-form-button-bg-right');
        bg.addClass('ludo-form-button-' + this.size + '-bg-right');
        bg.css({
            position:'absolute',
            'right':0,
            'z-index':6
        });
        this.$b().append(bg);
    },

    disable:function () {
        this.disabled = true;
        if (this.els.body) {
            this.els.body.addClass('ludo-form-button-disabled');
            this.els.body.removeClass('ludo-form-button-over');
            this.els.body.removeClass('ludo-form-button-down');
        }
    },

    enable:function () {
        this.disabled = false;
        if (this.els.body) {
            this.els.body.removeClass('ludo-form-button-disabled');
        }
    },

    isDisabled:function () {
        return this.disabled;
    },

    setValue:function (value) {
        console.warn("Use of deprecated setValue");
        console.trace();
        this.value = value;
        this.els.txt.html( value);
    },

    val:function (value) {
        if(arguments.length != 0){
            this.value = value;
            this.els.txt.html( value);
        }else{
            return this.value;
        }
    },
    getValue:function () {
        console.warn("Use of deprecated button.getValue");
        console.trace();
        return this.value;
    },

    mouseOver:function () {

        if (!this.isDisabled()) {
            this.$b().addClass('ludo-form-button-over');
            this.fireEvent('mouseover', this);
        }
    },
    mouseOut:function () {
        if (!this.isDisabled()) {
            this.$b().removeClass('ludo-form-button-over');
            this.fireEvent('mouseout', this);
        }

    },
	isDown:false,
    mouseDown:function () {
        if (!this.isDisabled()) {
			this.isDown = true;
            this.$b().addClass('ludo-form-button-down');
            this.fireEvent('mousedown', this);

            if(this.els.icon && this.iconPressed){
                this.els.icon.css('background-image', 'url(' + this.iconPressed + ')');

            }
        }
    },
    mouseUp:function () {
        if (this.isDown && !this.isDisabled()) {

            this.$b().removeClass('ludo-form-button-down');
            this.fireEvent('mouseup', this);
        }

        if(this.els.icon && this.icon){
            this.els.icon.css('background-image', 'url(' + this.icon + ')');

        }

    },

    clickAfterDelay:function () {
        this.click.delay(10, this);
    },
    /**
     * Trigger click on button
     * @function click
     * @return {undefined|Boolean}
     * @memberof ludo.form.Button.prototype
     */
    click:function () {
        this.focus();
        if (!this.isDisabled()) {
            this.getEl().focus();

            this.fireEvent('click', [this._get(), this]);

            if (this.toggle) {
                if (!this.active) {
                    this.turnOn();
                } else {
                    this.turnOff();
                }
            }
			return false;
        }
    },
    getName:function () {
        return this.name;
    },
    defaultBeforeClickEvent:function () {
        return true;
    },

    isButton:function () {
        return true
    },
    borderSize:undefined,

    resizeDOM:function () {
        // TODO refactor - buttons too tall in relative layout
        if(this.borderSize == undefined)
            this.borderSize = ludo.dom.getBH(this.$b());

        this.$b().css('height', this.heights[this.size]  - this.borderSize);
    },

    validate:function () {
        /* Don't do anything for buttons */
    },

    getParentComponent:function () {
        var parent = this.getParent();
        if (parent && parent.type.indexOf('ButtonBar') >= 0) {
            return parent.getView_250_40();
        }
        return parent;
    },

    select:function () {
        this.$b().addClass('ludo-form-button-selected');
    },

    deSelect:function () {
        this.$b().removeClass('ludo-form-button-selected');
    },

    turnOn:function () {
        this.active = true;
        /*
         * Turn toggle button on
         * @event on
         * @param {String} value, i.e. label of button
         * @param Component this
         */
        this.fireEvent('on', [this._get(), this]);
        this.$b().addClass('ludo-form-button-pressed');
    },

    turnOff:function () {
        this.active = false;
        /*
         * Turn toggle button off
         * @event off
         * @param {String} value, i.e. label of button
         * @param Component this
         */
        this.fireEvent('off', [this._get(), this]);
        this.$b().removeClass('ludo-form-button-pressed');
    },

    /**
     * Return instance of ludo.form.ToggleGroup
     * @function getToggleGroup
     * @return {Object} ludo.form.ToggleGroup
     * @memberof ludo.form.Button.prototype
     */
    getToggleGroup:function () {
        return this.toggleGroup;
    },

    isActive:function () {
        return this.active;
    }
});