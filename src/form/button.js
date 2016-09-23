/**
 * Button component
 * @namespace form
 * @class Button
 * @extends form.Element
 *
 */
ludo.form.Button = new Class({
    Extends:ludo.form.Element,
    type:'form.Button',
    defaultSubmit:false,
    inputType:'submit',
    cssSignature:'ludo-form-button',
    name:'',
    /**
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

    /**
     * Toggle button
     * @attribute {Boolean} toggle
     * @default false
     */
    toggle:false,

    /**
     Assign button to a toggleGroup
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
     /
    toggleGroup:undefined,

    /**
     * Disable button when form of parent component is invalid
     * @attribute {Boolean} disableOnInvalid
     * @default false
     */
    disableOnInvalid:false,

    /**
     * True to initially disable button
     * @attribute {Boolean} disabled
     * @default false
     */
    disabled:false,
    /**
     * Is this button by default selected
     * When parent component is displayed, it will call select() method for first selected button. If no buttons
     * have config param selected set to true, it will select first SubmitButton.
     * @attribute {Boolean} selected
     * @default false
     */
    selected:false,

    overflow:'hidden',

    /**
     * Path to button icon
     * @attribute {String} icon
     * @default undefined
     */
    icon:undefined,

    active:false,

	/**
	 * Size,i.e height of button. Possible values 's', 'm' and 'l' (small,medium, large)
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


    ludoConfig:function (config) {
		this.parent(config);

        var val = config.value || this.value;
        var len = val ? val.length : 5;
        this.layout.width = this.layout.width || Math.max(len * 10, 80);


        this.setConfigParams(config, ['size','menu','icon','toggle','disableOnInvalid','defaultSubmit','disabled','selected']);

        if (config.toggleGroup !== undefined) {
            if (ludo.util.type(config.toggleGroup) === 'String') {
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

        var b = this.getBody();

        b.css('padding-left', 0);
        this.getEl().on('selectstart', ludo.util.cancelEvent);
    },

    ludoEvents:function () {
        this.parent();
        var el = this.getBody();

        el.on('click', this.click.bind(this));
        el.mouseenter(this.mouseOver.bind(this));
        el.mouseleave(this.mouseOut.bind(this));
        el.on('mousedown', this.mouseDown.bind(this));

		// TODO need to bound in order to remove event later. Make this easier and more intuitive
		this.mouseUpBound = this.mouseUp.bind(this);
        $(document.body).on('mouseup', this.mouseUpBound);
        if (this.defaultSubmit) {
			this.keyPressBound = this.keyPress.bind(this);
            $(window).addEvent('keypress', this.keyPressBound);
        }
    },

    ludoRendered:function () {
        this.parent();
        if (this.disabled) {
            this.disable();
        }
        if (this.toggle && this.active) {
            this.getBody().addClass('ludo-form-button-pressed');
        }

        this.component = this.getParentComponent();
        if(this.component && this.disableOnInvalid){
            var m = this.component.getForm();
            m.addEvent('valid', this.enable.bind(this));
            m.addEvent('invalid', this.disable.bind(this));
            if(!m.isValid())this.disable();
        }
    },

	dispose:function(){
		this.parent();
		document.body.removeEvent('mouseup', this.mouseUpBound);
		if (this.defaultSubmit) document.id(window).removeEvent('keypress', this.keyPressBound);
	},

    addLabel:function () {
        var txt = this.els.txt = $('<div>');
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
        this.getBody().append(txt);
    },

    addIcon:function () {
        var el = this.els.icon = $('<div>');
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
        el.inject(this.els.txt, 'before');
    },

    setIcon:function(src){
        if(!this.els.icon){
            this.addIcon();
        }
        this.icon = src;
        this.els.icon.setStyle('background-image', 'url(' + src + ')');
    },

    addLeftEdge:function () {
        var bg = this.els.buttonLeftludo = $('<div>');
        bg.addClass('ludo-form-button-bg-left');
        bg.addClass('ludo-form-button-' + this.size +'-bg-left');
        bg.css({
            position:'absolute',
            'left':0,
            'z-index':5
        });
        this.getBody().append(bg);
    },

    addRightEdge:function () {
        var bg = $('<div>');
        bg.addClass('ludo-form-button-bg-right');
        bg.addClass('ludo-form-button-' + this.size + '-bg-right');
        bg.css({
            position:'absolute',
            'right':0,
            'z-index':6
        });
        this.getBody().append(bg);
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
        this.value = value;
        this.els.txt.html( value);
    },
    getValue:function () {
        return this.value;
    },

    mouseOver:function () {
        if (!this.isDisabled()) {
            this.getBody().addClass('ludo-form-button-over');
            this.fireEvent('mouseover', this);
        }
    },
    mouseOut:function () {
        if (!this.isDisabled()) {
            this.getBody().removeClass('ludo-form-button-over');
            this.fireEvent('mouseout', this);
        }

    },
	isDown:false,
    mouseDown:function () {
        if (!this.isDisabled()) {
			this.isDown = true;
            this.getBody().addClass('ludo-form-button-down');
            this.fireEvent('mousedown', this);
        }
    },
    mouseUp:function () {
        if (this.isDown && !this.isDisabled()) {
            this.getBody().removeClass('ludo-form-button-down');
            this.fireEvent('mouseup', this);
        }
    },

    clickAfterDelay:function () {
        this.click.delay(10, this);
    },
    /**
     * Trigger click on button
     * @method click
     * @return {undefined|Boolean}
     */
    click:function () {
        this.focus();
        if (!this.isDisabled()) {
            this.getEl().focus();
            /**
             * Click on button event
             * @event click
             * @param {String} value, i.e. label of button
             * @param Component this
             */
            this.fireEvent('click', [this.getValue(), this]);

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
    resizeDOM:function () {
        // TODO refactor - buttons too tall in relative layout
        this.getBody().css('height', this.heights[this.size]);
        /* No DOM resize for buttons */
    },

    validate:function () {
        /* Don't do anything for buttons */
    },

    getParentComponent:function () {
        var parent = this.getParent();
        if (parent && parent.type.indexOf('ButtonBar') >= 0) {
            return parent.getView();
        }
        return parent;
    },

    select:function () {
        this.getBody().addClass('ludo-form-button-selected');
    },

    deSelect:function () {
        this.getBody().removeClass('ludo-form-button-selected');
    },

    turnOn:function () {
        this.active = true;
        /**
         * Turn toggle button on
         * @event on
         * @param {String} value, i.e. label of button
         * @param Component this
         */
        this.fireEvent('on', [this.getValue(), this]);
        this.getBody().addClass('ludo-form-button-pressed');
    },

    turnOff:function () {
        this.active = false;
        /**
         * Turn toggle button off
         * @event off
         * @param {String} value, i.e. label of button
         * @param Component this
         */
        this.fireEvent('off', [this.getValue(), this]);
        this.getBody().removeClass('ludo-form-button-pressed');
    },

    /**
     * Return instance of ludo.form.ToggleGroup
     * @method getToggleGroup
     * @return {Object} ludo.form.ToggleGroup
     */
    getToggleGroup:function () {
        return this.toggleGroup;
    },

    isActive:function () {
        return this.active;
    }
});