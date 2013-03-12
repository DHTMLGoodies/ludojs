ludo.form.Date = new Class({
    Extends: ludo.form.Combo,
    children:[{
       type:'calendar.Calendar'
    }],
    displayFormat : 'd.m.Y',
    inputFormat : 'Y-m-d',

    ludoConfig:function(config){
        this.parent(config);
        this.setConfigParams(config, ['displayFormat','inputFormat']);

        this.displayFormat = this.displayFormat.replace(/([a-z])/gi, '%$1');
        this.inputFormat = this.inputFormat.replace(/([a-z])/gi, '%$1');
        this.value = this.value ? ludo.util.parseDate(this.value, this.inputFormat) :undefined;
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
        if (value && this.els.formEl && this.els.formEl.value !== value) {
            value = ludo.util.isString(value) ? value : value.format(this.displayFormat);
            this.els.formEl.set('value', value);
        }
        this.children[0].hide();
    },
    getValue:function(){
        return ludo.util.parseDate(this.value, this.displayFormat).format(this.inputFormat);
    }
});