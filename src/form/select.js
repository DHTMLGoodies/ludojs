/**
 Select box (&lt;select>)
 @namespace ludo.form
 @class ludo.form.Select
 @param {Object} config
 @param {String} config.valueKey Name of key used for value, example: "value"
 @param {String} config.textKey Name of key used for displayed text, example: "text"
 @param {Object} config.emptyItem. Object shown when no value selected, example: { "text": "Please select", value: "" }
 @param {Array} config.options. Array of values, example: [{value:1, text: "First item"},{value:2, text:"Second item" }]
 @example
	 {
		 type:'form.Select',
		 name:'country',
		 valueKey:'id',
		 textKey:'title',
		 emptyItem:{
			 id:'',title:'Where do you live?'
		 },
		 dataSource:{
			 resource:'Country',
			 service:'read'
		 }
	 }
 to populate the select box from the Country service on the server. The "id" column will be used as value for the options
 and title for the displayed text.

 @example
	 {
		 type:'form.Select',
		 emptyItem:{
			 value:'',text:'Please select an option'
		 },
		 options:[
			 { value:'1',text : 'Option a' },
			 { value:'2',text : 'Option b' },
			 { value:'3',text : 'Option c' }
		 ]
	 }
 */
ludo.form.Select = new Class({
    Extends:ludo.form.Element,
    type:'form.Select',
    emptyItem:undefined,
    valueKey:'value',
    textKey:'text',
    inputTag:'select',
    inputType:'',
	dataSource:{},

    options:undefined,

	defaultDS:'dataSource.JSONArray',

    __construct:function (config) {
        this.parent(config);
        this.setConfigParams(config, ['emptyItem', 'options', 'valueKey', 'textKey']);
        if(!this.emptyItem && this.inlineLabel){
            this.emptyItem = {};
            this.emptyItem[this.textKey] = this.inlineLabel;
            this.inlineLabel = undefined;
        }
    },

    ludoEvents:function () {
        this.parent();
        if (this.dataSource) {
            if (this.options && this.dataSourceObj) {
                for (var i = 0; i < this.options.length; i++) {
                    this.dataSourceObj.addRecord(this.options[i]);
                }
            }
			this.populate();
            var ds = this.getDataSource();
            ds.addEvent('select', this.selectRecord.bind(this));
            ds.addEvent('update', this.populate.bind(this));
            ds.addEvent('delete', this.populate.bind(this));
            ds.addEvent('sort', this.populate.bind(this));
        }
    },

    selectRecord:function (record) {
        this._set(record[this.valueKey]);
        this.toggleDirtyFlag();
    },

    populate:function () {
        var data = this.dataSourceObj.getData() || [];

        this.getFormEl().find('option').remove();
        if (this.emptyItem) {
            this.addOption(this.emptyItem[ this.valueKey ], this.emptyItem[ this.textKey ]);
        }
        for (var i = 0, count = data.length; i < count; i++) {
            this.addOption(data[i][ this.valueKey ], data[i][ this.textKey ]);
        }

        if (this.value) {
            this._set(this.value);
			this.setFormElValue(this.value);
        }
    },

    /**
     * Add new option element
     * @function addOption
     * @param {String} value
     * @param {String} text
     * @memberof ludo.form.Select.prototype
     */
    addOption:function (value, text) {
        var option = $('<option value="' + value + '">' + text + '</option>');
        this.getFormEl().append(option);
    },

    resizeDOM:function () {
        this.parent();
    }
});