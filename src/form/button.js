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
     * Assign button to a toggleGroup
     * Example:
     * var buttonLeft = new ludo.form.Button({
     * value : 'left',
     * toggle:true,
     * toggleGroup:'alignment'
     * });
     *
     * var buttonCenter = new ludo.form.Button({
     * value : 'center',
     * toggle:true,
     * toggleGroup:'alignment'
     * });
     *
     * which creates a singleton ludo.form.ToggleGroup instance and
     * assign each button to it.
     *
     * When using a toggle group, only one button can be turned on. The toggle
     * group will automatically turn off the other button.
     *
     * You can create your own ludo.form.ToggleGroup by extending
     * ludo.form.ToggleGroup and set the toggleGroup property to an
     * object:
     *
     * var buttonLeft = new ludo.form.Button({
     *  value: 'left',
     *  toggle:true,
     *  toggleGroup:{
     *      type : 'ludo.myapp.form.MyToggleGroup'
     *  }
     *
     * });
     *
     * @attribute {Object} toggleGroup
     * @default undefined
     */
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

    ludoConfig:function (config) {
        var val = config.value || this.value;
        var len = val ? val.length : 5;
        config.width = config.width || this.width || Math.max(len * 10, 80);
        config.weight = undefined;
        this.parent(config);

        if (config.menu !== undefined)this.menu = config.menu;
        if (config.icon !== undefined)this.icon = config.icon;
        if (config.toggle !== undefined)this.toggle = config.toggle;
        if (config.disableOnInvalid !== undefined)this.disableOnInvalid = config.disableOnInvalid;
        this.defaultSubmit = config.defaultSubmit || false;
        this.disabled = config.disabled || this.disabled;
        if (config.selected !== undefined) this.selected = config.selected;

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

        this.getEl().style.display = this.isHidden() ? 'none' : 'block';

        this.addLeftEdge();
        this.addRightEdge();

        this.addLabel();

        if (this.icon) {
            this.addIcon();
        }

        var b = this.getBody();

        // b.style.height = this.buttonHeight + 'px';
        b.setStyle('padding-left', 0);
        this.getEl().addEvent('selectstart', ludo.util.cancelEvent);
    },

    ludoEvents:function () {
        this.parent();
        var el = this.getBody();

        el.addEvent('click', this.click.bind(this));
        el.addEvent('mouseenter', this.mouseOver.bind(this));
        el.addEvent('mouseleave', this.mouseOut.bind(this));
        el.addEvent('mousedown', this.mouseDown.bind(this));
        document.body.addEvent('mouseup', this.mouseUp.bind(this));
        if (this.defaultSubmit) {
            document.id(window).addEvent('keypress', this.keyPress.bind(this));
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
            this.component.getFormManager().addEvent('valid', this.enable.bind(this));
            this.component.getFormManager().addEvent('invalid', this.disable.bind(this));
        }
    },

    addLabel:function () {
        var txt = this.els.txt = new Element('div');
        ludo.dom.addClass(txt, 'ludo-form-button-value');
        txt.setStyles({
            'width':'100%',
            'position':'absolute',
            'left':this.icon ? '25px' : '0px',
            'text-align':this.icon ? 'left' : 'center',
            'z-index':7
        });
        txt.set('html', this.value);
        this.getBody().adopt(txt);
    },

    addIcon:function () {
        var el = this.els.icon = new Element('div');
        el.setStyles({
            position:'absolute',
            width:'25px',
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
        var bg = this.els.buttonLeftludo = new Element('div');
        ludo.dom.addClass(bg, 'ludo-form-button-bg-left');
        bg.setStyles({
            position:'absolute',
            'left':0,
            'z-index':5
        });
        this.getBody().adopt(bg);
    },

    addRightEdge:function () {
        var bg = new Element('div');
        ludo.dom.addClass(bg, 'ludo-form-button-bg-right');
        bg.setStyles({
            position:'absolute',
            'right':0,
            'z-index':6
        });
        this.getBody().adopt(bg);
    },

    disable:function () {
        this.disabled = true;
        if (this.els.body) {
            ludo.dom.addClass(this.els.body, 'ludo-form-button-disabled');
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
        this.els.txt.set('html', value);
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
    mouseDown:function () {
        if (!this.isDisabled()) {
            this.getBody().addClass('ludo-form-button-down');
            this.fireEvent('mousedown', this);
        }
    },
    mouseUp:function () {
        if (!this.isDisabled()) {
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
        // TODO refactor - buttons should be too tall
        this.getBody().style.height = '25px';
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