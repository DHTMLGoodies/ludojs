
ludo.form.Form = new Class({
    Extends:ludo.View,
    elements : [],
    labelWidth : 150,
    ludoConfig:function (config) {
        config.formName = config.formName || 'form-' + String.uniqueID();
        this.elements = config.elements || this.elements;
        this.parent(config);

    },

    ludoDOM:function () {
        this.parent();
        this.getBody().dispose();

        this.els.body = new Element('form');
        this.getEl().adopt(this.els.body);

        this.getEl().setStyles({
            padding:0,
            border:0,
            margin:0
        });
        this.getBody().setStyles({
            padding:0,
            border:0,
            margin:0
        });
    },

    ludoRendered:function () {
        this.parent();
        this.formComponents = [];

        var config;
        for (var i = 0; i < this.elements.length; i++) {
            var el = this.elements[i];
            config = el;
            if (!config.height) {
                config.height = 25;
            }
            config.labelWidth = config.labelWidth || this.labelWidth;
            switch (el.type) {
                case 'check':
                case 'checkbox':
                case 'Checkbox':
                    config.type = 'form.Checkbox';
                    config.value = el.value || '1';
                    config.checked = el.checked || false;
                    break;
                case 'select':
                case 'Select':
                    config.type = 'form.Select';
                    config.value = el.value;
                    break;
                case 'text':
                case 'Text':
                    config.type = 'form.Text';
                    config.value = el.value;
                    break;
                case 'password':
                case 'Password':
                    config.type = 'form.Password';
                    config.value = el.value;
                    break;
                case 'Radio':
                case 'radio':
                    config.type = 'form.Radio';
                    config.value = el.value || '1';
                    config.checked = el.checked || false;
                    break;
            }
            config.name = el.name || el.label.replace(/\s/, '_').toLowerCase();
            config.label = el.label;

            this.formComponents.push(this.addChild(config));
        }
    },

    getValues:function () {
        var ret = {};
        for(var i=0;i<this.formComponents.length;i++){
            var cmp = this.formComponents[i];
            ret[cmp.getName()] = cmp.getValue();
        }
        return ret;
    },

    submit:function () {

    },

    hasFileUpload:function (elements) {
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].type === 'form.File') {
                return true;
            }
        }
        return false;
    }
});