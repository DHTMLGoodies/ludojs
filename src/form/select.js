/**
 Select box (&lt;select>)
 @namespace form
 @class Select
 @extends form.Element
 @constructor
 @param {Object} config
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
    Extends:ludo.form.LabelElement,
    type:'form.Select',
    labelWidth:100,
    /**
     First option in the select box, usually with an empty value. You should use the same
     keys for empty item as for the rest of the options. Value is defined by the valueKey property
     (default "value"), and text by textKey(default "text").
     @config {Object} emptyItem
     @default undefined
     @example
		 {
			 id : '',
			 title : 'Please select an option'

		 }
     */
    emptyItem:undefined,

    /**
     Name of column for the values of the select box. This option is useful when populating select box using a collection data source.
     @config {String} valueKey
	 @default 'id'
     @example
     	valueKey : 'id'
     */
    valueKey:'value',
    /**
     * Name of column for the displayed text of the options in the select box
	 * @config {String} textKey
	 * @default 'text'
     */
    textKey:'text',

    inputTag:'select',
    inputType:'',
    /**
     * Config of dataSource.Collection object used to populate the select box from external data
     * @config {Object|ludo.dataSource.Collection} dataSource
     * @default {}
     */
	dataSource:{},

    /**
     Array of options used to populate the select box
     @config {Array} options
     @default undefined
     @example
		 options:[
			 { value:'1','Option number 1' },
			 { value:'2','Option number 2' },
			 { value:'3','Option number 3' }
		 ]
     */
    options:undefined,

	defaultDS:'dataSource.Collection',

    ludoConfig:function (config) {
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
        this.setValue(record[this.valueKey]);
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
            this.setValue(this.value);
			this.setFormElValue(this.value);
        }
    },

    /**
     * Add new option element
     * @method addOption
     * @param {String} value
     * @param {String} text
     */
    addOption:function (value, text) {
        var option = $('<option value="' + value + '">' + text + '</option>');
        this.getFormEl().append(option);
    },

    resizeDOM:function () {
        this.parent();
    }
});