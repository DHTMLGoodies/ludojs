/**
 * Date picker
 * @namespace form
 * @class Date
 * @extends form.Combo
 */
ludo.form.Date = new Class({
    Extends: ludo.form.Combo,
    children:[{
       type:'calendar.Calendar'
    }],
    /**
     * Display format, example: Y/m/d
     * @config {String} displayFormat
     * @default Y-m-d
     */
    displayFormat : 'Y-m-d',
    /**
     * Format of date returned by getValue method.
     * @config {String} inputFormat
     * @default Y-m-d
     */
    inputFormat : 'Y-m-d',
    childLayout:{
        width:250,height:250
    },

    ludoConfig:function(config){
        this.parent(config);
        this.setConfigParams(config, ['displayFormat','inputFormat']);

        this.displayFormat = this.displayFormat.replace(/([a-z])/gi, '%$1');
        this.inputFormat = this.inputFormat.replace(/([a-z])/gi, '%$1');
        this.value = this.value ? ludo.util.parseDate(this.value, this.inputFormat) :undefined;
        this.initialValue = this.constructorValue = this.value;
    },

    autoHide:function(focused){
        if(focused.isButton && focused.isButton())return;
        if(focused !== this)this.children[0].hide();
    },

    ludoRendered:function(){
        this.parent();
        this.setFormElValue(this.value);
    },

    addChild:function(child){
        child.value = this.value || new Date();

        this.parent(child);
        this.children[0].addEvent('change', function(date){
            this.setValue(ludo.util.parseDate(date, this.inputFormat));
            this.blur();
        }.bind(this));
    },
    ludoEvents:function(){
        this.parent();
        this.addEvent('showCombo', function(){
            this.children[0].setDate(this.value ? ludo.util.parseDate(this.value, this.displayFormat) : new Date());
        }.bind(this));
        ludo.Form.addEvent('focus', this.autoHide.bind(this));
    },

    setValue:function(value){
        value = ludo.util.parseDate(value, this.displayFormat);
        this.parent(value);
    },

    setFormElValue:function(value){
        if (this.els.formEl && this.els.formEl.value !== value) {
            value = value ? ludo.util.isString(value) ? value : value.format(this.displayFormat) : '';
            this.els.formEl.set('value', value);
        }
        this.children[0].hide();
    },
    getValue:function(){
        return this.value ? ludo.util.parseDate(this.value, this.displayFormat).format(this.inputFormat) : undefined;
    }
});