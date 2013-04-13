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
     First option in the select box, usually with an empty value.
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
     * @default undefined
     */
    dataSource:undefined,
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

    ludoConfig:function (config) {
        this.parent(config);
        this.setConfigParams(config, ['emptyItem', 'options', 'valueKey', 'textKey']);
        if (!this.dataSource)this.dataSource = {};
        if (this.dataSource && !this.dataSource.type)this.dataSource.type = 'dataSource.Collection';
    },

    ludoEvents:function () {
        this.parent();
        if (this.dataSource) {
            if (this.options && this.dataSourceObj) {
                for (var i = 0; i < this.options.length; i++) {
                    this.dataSourceObj.addRecord(this.options[i]);
                }
            }
            if (this.dataSourceObj && this.dataSourceObj.hasData()) {
                this.populate();
            }
            var ds = this.getDataSource();
            ds.addEvent('change', this.populate.bind(this));
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
        this.getFormEl().options.length = 0;
        if (this.emptyItem) {
            data.splice(0, 0, this.emptyItem);
        }
        for (var i = 0, count = data.length; i < count; i++) {
            this.addOption(data[i][ this.valueKey ], data[i][ this.textKey ]);
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
        this.getFormEl().appendChild(option);
    },

    resizeDOM:function () {
        this.parent();
        if (this.els.formEl) {
            var p = this.els.formEl.parentNode;
            this.els.formEl.style.width = (p.offsetWidth - ludo.dom.getBW(p) - ludo.dom.getPW(p)) + 'px';
        }
    }
});