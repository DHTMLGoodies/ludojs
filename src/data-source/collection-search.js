/**
 Class created dynamically by dataSource.Collection.
 It is used to search and filter data in a collection.
 @namespace dataSource
 @class CollectionSearch
 @extends Core
 */
ludo.dataSource.CollectionSearch = new Class({
	Extends:ludo.Core,
	dataSource:undefined,
	searchResult:undefined,
	searchIndexCreated:false,
	/**
	 Delay in seconds between call to search and execution of search.
	 A delay is useful when using text fields to search.
	 @config delay
	 @type {Number}
	 @default 0
	 @example
	 	delay:0
	 */
	delay:0,
	searches:undefined,
	searchBranches:undefined,
	searchFn:undefined,
	currentBranch:undefined,
	/**
	 Columns in datasource to index for search
	 @config index
	 @type Array
	 */
	index:undefined,

	searchParser:undefined,

	ludoConfig:function (config) {
		this.parent(config);
		this.dataSource = config.dataSource;
		if (config.index !== undefined)this.index = config.index;
		if (config.delay !== undefined)this.delay = config.delay;
		this.searchParser = new ludo.dataSource.SearchParser();
		this.clear();
	},

	ludoEvents:function () {
		this.parent();
		this.dataSource.addEvent('beforeload', this.clearSearchIndex.bind(this));
		this.dataSource.addEvent('beforeload', this.deleteSearch.bind(this));
		this.dataSource.addEvent('update', this.clearSearchIndex.bind(this));
	},
	/**
	 * execute a text search
	 * @method Search
	 * @param {String} search
	 */
	search:function (search) {
		if (!search && this.searches.length == 0)return;
		this.clear();
		this.where(search);
		this.endBranch();

		var delay = this.getSearchDelay();
		if (delay === 0) {
			this.executeSearch(this.searches[0].txt);
		} else {
			this.executeSearch.delay(delay * 1000, this, this.searches[0].txt);
		}
	},

	executeSearch:function (searchTerm) {
		if (searchTerm == this.searches[0].txt) {
			this.execute();
		}
	},

	/**
	 Clear all search terms and search functions
	 @method clear
	 @chainable
	 @return {dataSource.CollectionSearch} this
	 */
	clear:function () {
		this.searches = [];
		return this;
	},

	/**
	 * Delete search terms/functions and dispose search result. This method will fire a deleteSearch event which
	 * {{#crossLink "dataSource.Collection"}}{{/crossLink}} listens to. It will trigger an update of
	 * views using the {{#crossLink "dataSource.Collection"}}{{/crossLink}} object as dataSource.
	 * @method deleteSearch
	 */
	deleteSearch:function () {
		/**
		 * Search executed without any search terms
		 * @event deleteSearch
		 */
		this.fireEvent('deleteSearch');
		this.searchResult = undefined;
		this.clear();
	},
	/**
	 Start building a new search
	 @method where
	 @param {String|Function} search
	 @return {dataSource.CollectionSearch} this
	 @chainable
	 @example
		 var searcher = ludo.get('idOfDataSearch').getSearcher();
		 searcher.where('Portugal').or('Norway').execute();
	 will find all records where the search index matches 'Portugal' or 'Norway' (case insensitive).
	 By default, the entire record is indexed. Custom indexes can be created by defining
	 index using the "index" constructor attribute.
	 @example
	 	searcher.where(function(record){
	 		return parseInt(record.price) < 100
	 	});
	 is example of a function search. On {{#crossLink "dataSource.Collection/execute"}}{{/crossLink}} this
	 function will be called for each record. It should return true if match is found, false otherwise.
	 The function above will return true for all records where the value of record.price is less than 100.
	 */
	where:function (search) {
		this.clear();
		this.appendSearch(Array.from(arguments));
		return this;
	},

	/**
	 OR search
	 @method or
	 @param {String|Function} search
	 @return {dataSource.CollectionSearch} this
	 @chainable
	 @example
		 var searcher = myDataSource.getSearcher();
		 var populationFn = function(record){
					return record.population > 1000000 ? true: false;
				}
		 searcher.where('Europe').or(populationFn).execute();

	 Finds all records where 'Europe' is in the text or population is greater than 1
	 million.
	 */
	or:function (search) {
		this.appendOperator('|');
		this.appendSearch(Array.from(arguments));
		return this;
	},

	appendSearch:function (args) {
		this.preCondition(args);
		var search = this.getActualArgument(args);
        var searchObject;
		if (typeof search === 'function') {
			searchObject = { fn:search };
		} else {
			searchObject = { txt:search.toLowerCase() };
		}
		this.searches.push(searchObject);
		this.postCondition(args);
	},

	/**
	 AND search
	 @method and
	 @param {String|Function} search
	 @return {dataSource.CollectionSearch} this
	 @chainable
	 @example
		 var searcher = myDataSource.getSearcher();
		 var populationFn = function(record){
					return record.population > 1000000 ? true: false;
				}
		 searcher.where('Europe').and(populationFn).execute();
	 Finds all records where 'Europe' is in the text and population is greater than 1
	 million.
	 */
	and:function (search) {
		this.appendOperator('&');
		this.appendSearch(Array.from(arguments));
		return this;
	},

	preCondition:function (args) {
		if (args.length == 2 && args[0] === '(') {
			this.branch();
		}
	},

	postCondition:function (args) {
		if (args.length == 2 && args[1] === ')') {
			this.endBranch();
		}
	},

	getActualArgument:function (args) {
		if (args.length === 2) {
			if (args[0] == ')' || args[0] == '(') {
				return args[1];
			}
			return args[0];
		}
		return args[0];
	},


	/**
	 * Search for match in one of the items
	 * @method withIn
	 * @param {Array} searches
	 * @chainable
	 * @return {dataSource.CollectionSearch} this
	 */
	withIn:function (searches) {
		for (var i = 0; i < searches.length; i++) {
			this.or(searches[i]);
		}
		return this;
	},

	/**
	 * Start grouping search items together
	 * @method branch
	 * @chainable
	 * @return {dataSource.CollectionSearch} this
	 */
	branch:function () {
		this.appendOperator('(');
		return this;
	},
	/**
	 * Close group of search items.
	 * @method branch
	 * @chainable
	 * @return {endBranch.CollectionSearch} this
	 */
	endBranch:function () {
		this.appendOperator(')');
		return this;
	},

	appendOperator:function (operator) {
		if (operator != '(' && this.searches.length == 0)return;
		if (operator === '|' && this.searches.getLast() === '(')return;
		this.searches.push(operator);
	},
	/**
	 Execute a search based on current search terms
	 @method execute
	 @chainable
	 @return {dataSource.CollectionSearch} this
	 @example
		 // Assumes that ludo.get('collection') returns a {{#crossLink "dataSource.Collection"}}{{/crossLink}} object
		 var searcher = ludo.get('collection').getSearcher();
		 searcher.clear();
		 searcher.where('Oslo').or('Moscow');
		 searcher.execute();
	 */
	execute:function () {
		if (!this.searchIndexCreated) {
			this.createSearchIndex();
		}
		if (!this.hasSearchTokens()) {
			this.deleteSearch();
		} else {
            this.fireEvent('initSearch');
			this.searchResult = [];
			this.compileSearch();
            this.performSearch();
		}
		/**
		 * Search executed
		 * @event search
		 */
		this.fireEvent('search');
		return this;
	},

    performSearch:function(){
        var data = this.getDataFromSource();
        for (var i = 0; i < data.length; i++) {
            if (this.isMatchingSearch(data[i])) {
                this.searchResult.push(data[i]);
            }
        }
    },

	isMatchingSearch:function (record) {
		return this.searchFn.call(this, record);
	},

	compileSearch:function () {
		this.searchFn = this.searchParser.getSearchFn(this.searches);
	},

	/**
	 * Returns true if search terms or search functions exists.
	 * @method hasSearchTokens
	 * @return {Boolean}
	 */
	hasSearchTokens:function () {
		return this.hasContentInFirstSearch() || this.searches.length > 1;
	},

	hasContentInFirstSearch:function () {
		if (this.searches.length === 0)return false;
		var s = this.searches[0];
		return (this.isArray(s) || s.fn !== undefined || (s.txt !== undefined && s.txt.length > 0));
	},

	/**
	 * Returns true when<br>
	 *     - zero or more records are found in search result<br>
	 * Returns false when<br>
	 *  - search result is undefined because no search has been executed or search has been deleted.
	 * @method hasData
	 * @return {Boolean}
	 */
	hasData:function () {
		return this.searchResult !== undefined;
	},

	getData:function () {
		return this.searchResult;
	},

	getDataFromSource:function () {
		return this.dataSource.getLinearData();
	},

	getSearchDelay:function () {
		return this.delay || 0;
	},

	clearSearchIndex:function () {
		this.searchIndexCreated = false;
	},

	createSearchIndex:function () {

		this.indexBranch(this.getDataFromSource());
		this.searchIndexCreated = true;
	},

    indexBranch:function(data){
        var keys = this.getSearchIndexKeys();
        var index;
        for (var i = 0; i < data.length; i++) {
            index = [];
            for (var j = 0; j < keys.length; j++) {
                if (data[i][keys[j]]) {
                    index.push((data[i][keys[j]] + '').toLowerCase());
                }
            }
            data[i].searchIndex = index.join(' ');
            if(data[i].children){
                this.indexBranch(data[i].children);
            }
        }
    },

	getSearchIndexKeys:function () {
		if (this.index !== undefined) {
			return this.index;
		}
		var data = this.getDataFromSource();
		if (data.length > 0) {
			var record = Object.clone(data[0]);
			var ret = [];
			for (var key in record) {
				if (record.hasOwnProperty(key)) {
					ret.push(key);
				}
			}
			return ret;
		}
		return ['NA'];
	},

	/**
	 * Returns number of records in search result
	 * @method getCount
	 * @return {Number}
	 */
	getCount:function () {
		return this.searchResult ? this.searchResult.length : 0;
	},

	searchToString:function () {
		return this.hasData() ? this.searchTokens[0] : '';
	}
});