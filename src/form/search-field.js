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

	remote:false,

	lastSearch:undefined,

	ludoConfig:function (config) {
		this.parent(config);
        this.setConfigParams(config, ['searchIn','delay','searchFn','remote']);

		if (this.searchFn !== undefined)this.searchFn = this.searchFn.bind(this);
		this.addEvent('key', this.queue.bind(this));

		this.setDataSource();
	},

	setDataSource:function(){
		if(ludo.util.isString(this.searchIn)){
			var s = ludo.get(this.searchIn);
			if(!s){
				this.setDataSource.delay(100, this);
			}else{
				this.searchIn = ludo.get(this.searchIn);
			}
		}
	},

	queue:function (value) {
		this.value = value;
		if (this.delay === 0) {
			this.search();
		} else {
			this.lastValue = value;
			this.execute.delay(this.delay * 1000, this, value);
		}
	},

	execute:function (value) {
		if (value != this.lastValue || value == this.lastSearch)return undefined;
		this.lastSearch =  this.getValue();
		return this.search();
	},

	/**
	 * Executes search in data source
	 * @method search
	 */
	search:function () {
		if(this.remote){
			this.searchIn.remoteSearch(this.getValue());
			return undefined;
		}
		else {
			return this.searchIn.getSearcher().search(this.searchFn ? this.searchFn : this.getValue());
		}
	}
});