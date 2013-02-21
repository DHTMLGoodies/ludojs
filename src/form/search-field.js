/**
 * Form field designed to search in dataSource.Collection
 * @namespace form
 * @class SearchField
 * @extends form.Text
 */
ludo.form.SearchField = new Class({
	Extends:ludo.form.Text,
	type:'form.SearchField',

	/**
	 * Collection to search in
	 * @config {dataSource.Collection} searchIn
	 * @default undefined
	 */
	searchIn:undefined,

	/**
	 * Delay in seconds from key press to search is executed.
	 * @config {Number} delay
	 * @default 0
	 */
	delay:0,

	lastValue:undefined,

	/**
	 Custom search fn to execute instead of plain text search
	 @config {Function} searchFn
	 @default undefined
	 @example
	 	searchFn:function(record){
	 		return record.value = this.value && record.active === true
	 	}
	 note that "this" inside the function is a reference to search field.
	 */
	searchFn:undefined,

	ludoConfig:function (config) {
		this.parent(config);
		if (config.searchIn)this.searchIn = config.searchIn;
        if(ludo.util.isString(this.searchIn))this.searchIn = ludo.get(this.searchIn);
		if (config.delay !== undefined)this.delay = config.delay;
		if (config.searchFn !== undefined)this.searchFn = config.searchFn.bind(this);
		this.addEvent('key', this.queue.bind(this));
	},

	queue:function (value) {
		if (this.delay === 0) {
			this.search();
		} else {
			this.lastValue = value;
			this.execute.delay(this.delay * 1000, this, value);
		}
	},

	execute:function (value) {
		if (value !== this.lastValue)return undefined;
		return this.search();
	},

	/**
	 * Executes search in data source
	 * @method search
	 */
	search:function () {
		return this.searchIn.getSearcher().search(this.searchFn ? this.searchFn : this.getValue());
	}
});