/**
 * Form field designed to search in dataSource.Collection
 * @namespace ludo.form
 * @class ludo.form.SearchField
 * @augments ludo.form.Text
 * @param {Object} config
 * @param {ludo.dataSource.Collection} searchIn Collection to search in
 * @param {Number} delay Delay in seconds after key press before search is executed. Default 0.
 * @param {Function} searchFn Custom search fn to execute instead of plain text search. Example:
 * <code>	 	searchFn:function(record){
	 		return record.value = this.value && record.active === true
	 	}
 </code>
 note that "this" inside the function is a reference to search field.
 */
ludo.form.SearchField = new Class({
	Extends:ludo.form.Text,
	type:'form.SearchField',
	searchIn:undefined,
	delay:0,
	lastValue:undefined,
	searchFn:undefined,

	remote:false,

	lastSearch:undefined,

	__construct:function (config) {
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
		this.lastSearch =  this._get();
		return this.search();
	},

	/**
	 * Executes search in data source
	 * @function search
	 */
	search:function () {
		if(this.remote){
			this.searchIn.remoteSearch(this._get());
			return undefined;
		}
		else {
			return this.searchIn.getSearcher().search(this.searchFn ? this.searchFn : this._get());
		}
	}
});