/**
 * Select box (&lt;select>)
 * A select box can be populated from the server. The server should respond with data in the following format:
 * { success : true, data: [{ value:'1','text': 'Display text' }, { value:'2', 'text': 'Display text'} ]}
 * You can use different keys than "value" and "text" by defining a fieldConfig object.
 * @namespace form
 * @class Select
 * @extends form.Element
 */
ludo.form.Select = new Class({
    Extends:ludo.form.LabelElement,
    type:'form.Select',
    labelWidth:100,
    /**
     * value and text to display when no records has been selected, example: { value:'', text: 'Select country' }
     * @attribute emptyItem
     * @default null
     */
    emptyItem:null,
    /**
     * record keys to use for value and text
     * @attribute fieldConfig
     * @default { value : 'value', text : 'text' }
     */
    fieldConfig:{
        value:'value',
        text:'text'
    },

    inputTag : 'select',
    inputType : '',

    ludoConfig:function (config) {
        this.parent(config);
        if (config.emptyItem)this.emptyItem = config.emptyItem;
    },

    populate:function (data) {
        if (this.emptyItem) {
            this.addOption(this.emptyItem.value, this.emptyItem.text);
        }

        if (data.length > 0) {
            if (data[0][this.fieldConfig.value] === undefined) {
                this.fieldConfig.value = 'id';
            }
            if (data[0][this.fieldConfig.text] === undefined) {
                this.fieldConfig.text = 'title';
            }
        }

        for (var i = 0, count = data.length; i < count; i++) {
            this.addOption(data[i][ this.fieldConfig.value ], data[i][ this.fieldConfig.text ]);
        }

        if (this.value) {
            this.setValue(this.value);
        }
    },

    /**
     * Add new option element
     * @method addOption
     * @param {String} value
     * @param {String} text
     */
    addOption:function (value, text) {
        var option = new Element('option');
        option.set('value', value);
        option.set('text', text);

        this.getFormEl().adopt(option);
    }
});