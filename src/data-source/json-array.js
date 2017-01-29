/**
 Data source collection
 @namespace ludo.dataSource.
 @class ludo.dataSource.JSONArray
 @augments dataSource.JSON
 @param {Object} config
 @param {Object} config.sortFn custom sort functions, which should return -1 if record a is smaller than
 record b and 1 if record b is larger than record a. Example:
 <code>
 sortFn:{
			'population':{
				'asc' : function(a,b){
					return parseInt(a.population) < parseInt(b.population) ? -1 : 1
				},
				'desc' : function(a,b){
					return parseInt(a.population) > parseInt(b.population) ? -1 : 1
				}
			}
	 	}
 </code>
 @param {String} config.primaryKey Primary key, example: primaryKey: "id"
 @param {Object} config.paging
 Example:
 <code>
 paging:{
		 	size:10, // Number of rows per page
		  	remotePaging:true, // Load only records per page from server, i.e. new request per page
		  	cache : true, // Store pages in cache, i.e no request if data for page is in cache,
		  	cacheTimeout:30 // Optional time in second before cache is considered out of date, i.e. new server request
		}
 </code>
 @param {Object} config.searchConfig
 Example:
 <code>
 searchConfig:{
	 		index:['city','country'],
	 		delay:.5
	 	}
 </code>
 which makes the record keys/columns "city" and "country" searchable. It waits .5 seconds
 before the search is executed. This is useful when searching large collections and you
 want to delay the search until the user has finished entering into a search box.
 @fires ludo.dataSource.JSONArray#sort Fires on sort. Arguments: {String} sortedBy key
 @fires ludo.dataSource.JSONArray#add Fires when a new record has been added to the collection. Arguments: {Object} record
 @fires ludo.dataSource.JSONArray#deselect Fires when a record has been deselected, arguments. {Object} deselected record
 @fires ludo.dataSource.JSONArray#select Fires when a record has selected, arguments. {Object} selected record
 @fires ludo.dataSource.JSONArray#delete Fires when a record has been deleted, arguments. {Object} deleted record
 @fires ludo.dataSource.JSONArray#page Fires on navigation to new page when paging is enabled. Arguments: {Number} page index
 @fires ludo.dataSource.JSONArray#previousPage Fires when paging is enabled and navigating to current page -1. No arguments
 @fires ludo.dataSource.JSONArray#nextPage Fires when paging is enabled and navigating to current page +1. No arguments
 @fires ludo.dataSource.JSONArray#firstPage Fired when navigating to first page.  No arguments
 @fires ludo.dataSource.JSONArray#lastPage Fired when navigating to last page.  No arguments
 @fires ludo.dataSource.JSONArray#notLastPage Fired when navigating to a page which is not last page.  No arguments
 @fires ludo.dataSource.JSONArray#notFirstPage Fired when navigating to a page which is not first page.  No arguments
 @fires ludo.dataSource.JSONArray#change Fires when data has been updated or page navigation occurs.
 @example
 dataSource:{
		url:'data-source/grid.php',
		id:'myDataSource',
		paging:{
			size:12,
			remotePaging:false,
			cache:false,
			cacheTimeout:1000
		},
		searchConfig:{
			index:['capital', 'country']
		},
		listeners:{
			select:function (record) {
				console.log(record);
			}
		}
	}
 */
ludo.dataSource.JSONArray = new Class({
    Extends: ludo.dataSource.JSON,
    sortFn: {},

    selectedRecords: [],

    primaryKey: 'id',


    paging: undefined,

    dataCache: {},

    sortedBy: {
        column: undefined,
        order: undefined
    },

    searchConfig: undefined,

    statefulProperties: ['sortedBy', 'paging'],

    index: undefined,

    searcherType: 'dataSource.JSONArraySearch',

    uidMap: {},


    selected: undefined,

    __construct: function (config) {
        this.parent(config);
        this.setConfigParams(config, ['searchConfig', 'sortFn', 'primaryKey', 'sortedBy', 'paging', 'selected']);

        if (this.primaryKey && !ludo.util.isArray(this.primaryKey))this.primaryKey = [this.primaryKey];
        if (this.paging) {
            this.paging.offset = this.paging.offset || 0;
            this.paging.initialOffset = this.paging.offset;
            if (this.paging.initialOffset !== undefined) {
                this.fireEvent('page', (this.paging.initialOffset / this.paging.size) + 1);
            }
            if (this.isCacheEnabled()) {
                this.addEvent('load', this.populateCache.bind(this));
            }
        }

        this.addEvent('parsedata', this.createIndex.bind(this));


        if (this.selected) {
            this.addEvent('firstLoad', this.setInitialSelected.bind(this));
        }

        if (this.data && !this.index)this.createIndex();
    },

    hasRemoteSearch: function () {
        return this.paging && this.paging.remotePaging;
    },

    setInitialSelected: function () {
        this.selectRecord(this.selected);
    },

    /**
     * Returns 1) If search is specified: number of records in search result, or 2) number of records in entire collection.
     * @function getCount
     * @return {Number} count
     * @memberof ludo.dataSource.JSONArray.prototype
     */
    getCount: function () {
        if (this.paging && this.paging.rows)return this.paging.rows;
        if (this.searcher && this.searcher.hasData())return this.searcher.getCount();
        return this.data ? this.data.length : 0;
    },

    isCacheEnabled: function () {
        return this.paging && this.paging['remotePaging'] && this.paging.cache;
    },

    /**
     * Resort data-source
     * @function sort
     * @return void
     * @memberof ludo.dataSource.JSONArray.prototype
     */
    sort: function () {
        if (this.sortedBy.column && this.sortedBy.order) {
            this.sortBy(this.sortedBy.column, this.sortedBy.order);
        }
    },

    /**
     Set sorted by column
     @function by
     @param {String} column
     @return {dataSource.JSONArray} this
     @memberof ludo.dataSource.JSONArray.prototype
     @example
     collection.by('country').ascending().sort();
     or
     @example
     collection.by('country').sort();
     */
    by: function (column) {
        this.sortedBy.column = column;
        this.sortedBy.order = this.getSortOrderFor(column);
        return this;
    },
    /**
     Set sort order to ascending
     @function ascending
     @return {dataSource.JSONArray} this
     @memberof ludo.dataSource.JSONArray.prototype
     @example
     collection.by('country').ascending().sort();
     */
    ascending: function () {
        this.sortedBy.order = 'asc';
        return this;
    },
    /**
     Set sort order to descending
     @function descending
     @return {dataSource.JSONArray} this
     @memberof ludo.dataSource.JSONArray.prototype
     @example
     collection.by('country').descending().sort();
     */
    descending: function () {
        this.sortedBy.order = 'desc';
        return this;
    },

    /**
     Sort by column and order

     The second argument(order) is optional
     @function sortBy
     @param {String} column
     @param {String} order
     @optional
     @return {dataSource.JSONArray} this
     @memberof ludo.dataSource.JSONArray.prototype
     @example
     grid.getDataSource().sortBy('firstname', 'desc');
     which also can be written as
     @example
     grid.getDataSource().by('firstname').descending().sort();
     */
    sortBy: function (column, order) {
        order = order || this.getSortOrderFor(column);

        this.sortedBy = {
            column: column,
            order: order
        };

        if (this.paging) {
            this.paging.offset = this.paging.initialOffset || 0;
            this.fireEvent('page', Math.round(this.paging.offset / this.paging.size) + 1);
        }

        if (this.shouldSortOnServer()) {
            this.loadOrGetFromCache();
        } else {
            var data = this._getData();
            if(!data)return this;
            data.sort(this.getSortFnFor(column, order));
            this.fireEvent('change');
        }

        this.fireEvent('sort', this.sortedBy);
        if (this.paging)this.firePageEvents();
        this.fireEvent('state');

        return this;
    },

    /**
     * Return current sorted by column
     * @function getSortedBy
     * @return {String} column
     * @memberof ludo.dataSource.JSONArray.prototype
     */
    getSortedBy: function () {
        return this.sortedBy.column;
    },
    /**
     * Return current sort order (asc|desc)
     * @function getSortOrder
     * @return {String} order
     * @memberof ludo.dataSource.JSONArray.prototype
     */
    getSortOrder: function () {
        return this.sortedBy.order;
    },

    shouldSortOnServer: function () {
        return this.paging && this.paging.remotePaging;
    },

    /**
     * Set sort function for a column
     * @param {string} key
     * @param {object} sortFns
     * @example
     * setSortFn('score', {
     *  'asc' : function(recA, recB){
     *      return recA.score < recB.score ? -1 : 1;
     *  },
     *  'desc': function(recA, recB){
     *      return recA.score < recB.score ? 1 : -1;
     *  }
     *
     * });
     */
    setSortFn:function(column, sortFns){

        this.sortFn[column] = sortFns;
    },

    getSortFnFor: function (column, order) {
        if (this.sortFn[column] !== undefined) {
            return this.sortFn[column][order];
        }
        if (order === 'asc') {
            return function (a, b) {
                return a[column] + '_' + a[this.primaryKey] < b[column] + '_' + b[this.primaryKey] ? -1 : 1
            };
        } else {
            return function (a, b) {
                return a[column] + '_' + a[this.primaryKey] < b[column] + '_' + b[this.primaryKey] ? 1 : -1
            };
        }
    },

    getSortOrderFor: function (column) {
        if (this.sortedBy.column === column) {
            return this.sortedBy.order === 'asc' ? 'desc' : 'asc';
        }
        return 'asc';
    },

    /**
     * Add a record to data-source
     * @function addRecord
     * @param record
     * @return {Object} record
     * @memberof ludo.dataSource.JSONArray.prototype
     */
    addRecord: function (record) {
        this.data = this.data || [];
        this.data.push(record);

        if (!this.index)this.createIndex();

        this.fireEvent('add', record);

        return this.createRecord(record);
    },

    find: function (search) {
        return this.findRecord(search);
    },

    /**
     * Returns plain object for a record from search. To get a
     * {{#crossLink "dataSource.Record"}}{{/crossLink}} object
     * use {{#crossLink "dataSource.JSONArray/getRecord"}}{{/crossLink}}
     *
     * collection.find({ capital : 'Oslo' });
     *
     * @function findRecord
     * @param {Object} search
     * @return {Object|undefined} record
     * @memberof ludo.dataSource.JSONArray.prototype
     */
    findRecord: function (search) {

        if (!this.data)return undefined;
        if (search['getUID'] !== undefined)search = search.getUID();

        if (search.uid)search = search.uid;
        var rec = this.getById(search);
        if (rec)return rec;

        var searchMethod = ludo.util.isObject(search) ? 'isRecordMatchingSearch' : 'hasMatchInPrimaryKey';


        for (var i = 0; i < this.data.length; i++) {
            if (this[searchMethod](this.data[i], search)) {
                return this.data[i];
            }
        }
        return undefined;
    },

    isRecordMatchingSearch: function (record, search) {
        for (var key in search) {
            if (search.hasOwnProperty(key)) {
                if (record[key] !== search[key]) {
                    return false;
                }
            }
        }
        return true;
    },

    hasMatchInPrimaryKey: function (record, search) {
        if (this.primaryKey) {
            for (var j = 0; j < this.primaryKey.length; j++) {
                if (record[this.primaryKey[j]] === search)return true;
            }
        }
        return false;
    },

    /**
     * Find specific records, example:
     * var records = collection.findRecords({ country:'Norway'});
     * @function findRecords
     * @param {Object} search
     * @return {Array} records
     * @memberof ludo.dataSource.JSONArray.prototype
     */
    findRecords: function (search) {
        var ret = [];
        for (var i = 0; i < this.data.length; i++) {
            if (this.isRecordMatchingSearch(this.data[i], search)) {
                ret.push(this.data[i]);
            }
        }
        return ret;
    },

    getLinearData: function () {
        return this.data;
    },

    /**
     * Select the first record matching search
     * @function selectRecord
     * @param {Object} search
     * @return {Object|undefined} record
     * @memberof ludo.dataSource.JSONArray.prototype
     */
    selectRecord: function (search) {
        var rec = this.findRecord(search);
        if (rec) {
            this._setSelectedRecord(rec);
            return rec;
        }
        return undefined;
    },


    /**
     * Select all records matching search
     * @function selectRecords
     * @param {Object} search
     * @return {Array} records
     * @memberof ludo.dataSource.JSONArray.prototype
     */
    selectRecords: function (search) {
        this.selectedRecords = this.findRecords(search);
        for (var i = 0; i < this.selectedRecords.length; i++) {
            this.fireSelect(this.selectedRecords[i]);
        }
        return this.selectedRecords;
    },

    /**
     * Select a specific record by index
     * @function selectRecordIndex
     * @param {number} index
     * @memberof ludo.dataSource.JSONArray.prototype
     */
    selectRecordIndex: function (index) {
        var data = this._getData();
        if (data.length && index >= 0 && index < data.length) {
            var rec = data[index];
            this._setSelectedRecord(rec);
            return rec;
        }
        return undefined;
    },

    _getData: function () {
        if (this.hasSearchResult())return this.searcher.getData();
        return this.data;
    },

    getRecordByIndex: function (index) {
        if (this.data.length && index >= 0 && index < this.data.length) {
            return this.data[index];
        }
        return undefined;
    },

    /**
     * Select previous record. If no record is currently selected, first record will be selected
     * @function previous
     * @return {Object} record
     * @memberof ludo.dataSource.JSONArray.prototype
     */
    previous: function () {
        var rec = this.getPreviousOf(this.getSelectedRecord());
        if (rec) {
            this._setSelectedRecord(rec);
        }
        return rec;
    },

    /**
     * Returns previous record of given record
     * @function getPreviousOf
     * @param {Object} record
     * @return {Object} previous record
     * @memberof ludo.dataSource.JSONArray.prototype
     */
    getPreviousOf: function (record) {
        var data = this._getData();
        if (record) {
            var index = data.indexOf(record);
            return index > 0 ? data[index - 1] : undefined;
        } else {
            return data.length > 0 ? data[0] : undefined;
        }
    },

    /**
     * Select next record. If no record is currently selected, first record will be selected
     * @function next
     * @return {Object} record
     * @memberof ludo.dataSource.JSONArray.prototype
     */
    next: function () {
        var rec = this.getNextOf(this.getSelectedRecord());
        if (rec) {
            this._setSelectedRecord(rec);
        }
        return rec;
    },
    /**
     * Returns next record of given record.
     * @function getNextOf
     * @param {Object} record
     * @return {Object} next record
     * @memberof ludo.dataSource.JSONArray.prototype
     */
    getNextOf: function (record) {
        var data = this._getData();
        if (record) {
            var index = data.indexOf(record);
            return index < data.length - 1 ? data[index + 1] : undefined;
        } else {
            return data.length > 0 ? data[0] : undefined;
        }
    },

    _setSelectedRecord: function (rec) {
        if (this.selectedRecords.length) {

            this.fireEvent('deselect', this.selectedRecords[0]);
        }
        this.selectedRecords = [rec];
        this.fireSelect(Object.clone(rec));
    },

    /**
     * Return first selected record
     * @function getSelectedRecord
     * @return {Object|undefined} record
     * @memberof ludo.dataSource.JSONArray.prototype
     */
    getSelectedRecord: function () {
        return this.selectedRecords.length > 0 ? this.selectedRecords[0] : undefined;
    },

    /**
     * Return selected records
     * @function getSelectedRecords
     * @return {Array} records
     * @memberof ludo.dataSource.JSONArray.prototype
     */
    getSelectedRecords: function () {
        return this.selectedRecords;
    },

    /**
     Delete records matching search,
     @function deleteRecords
     @param {Object} search
     @memberof ludo.dataSource.JSONArray.prototype
     @example
     grid.getDataSource().deleteRecords({ country: 'Norway' });
     will delete all records from collection where country is equal to "Norway". A delete event
     will be fired for each deleted record.
     */
    deleteRecords: function (search) {
        var records = this.findRecords(search);
        for (var i = 0; i < records.length; i++) {
            this.data.erase(records[i]);
            this.fireEvent('delete', records[i]);
        }

        this.onChange();
    },

    /**
     Delete ONE item from the data source.
     @function deleteRecord
     @param {Object|String} search
     @memberof ludo.dataSource.JSONArray.prototype
     @example
     // delete first record where property country matches "Norway"
     grid.getDataSource().deleteRecord({ country: 'Norway' });

     // delete first record where record.uid = 'uid_ixrky8vq'
     grid.getDataSource().deleteRecord('uid_ixrky8vq');

     // delete the first record in the data source
     var rec = grid.getDataSource().getData()[0];
     grid.getDataSource().deleteRecord(rec);
     */
    remove: function (search) {
        var rec = this.findRecord(search);
        if (rec) {
            this.data.erase(rec);

            this.fireEvent('delete', rec);
            this.onChange();
        }
    },


    deleteRecord: function (search) {
        this.remove(search);
    },

    onChange: function () {
        this.fireEvent('count', this.searcher != undefined ? this.searcher.getCount() : this.getCount());
    },

    /**
     Select records from current selected record to record matching search,
     @function selectTo
     @param {Object} search
     @memberof ludo.dataSource.JSONArray.prototype
     @example
     collection.selectRecord({ country: 'Norway' });
     collection.selectTo({country: 'Denmark'});
     var selectedRecords = collection.getSelectedRecords();
     */
    selectTo: function (search) {
        var selected = this.getSelectedRecord();
        if (!selected) {
            this.selectRecord(search);
            return;
        }
        var rec = this.findRecord(search);
        if (rec) {
            this.selectedRecords = [];
            var index = this.data.indexOf(rec);
            var indexSelected = this.data.indexOf(selected);
            var i;
            if (index > indexSelected) {
                for (i = indexSelected; i <= index; i++) {
                    this.selectedRecords.push(this.data[i]);
                    this.fireSelect(this.data[i]);
                }
            } else {
                for (i = indexSelected; i >= index; i--) {
                    this.selectedRecords.push(this.data[i]);
                    this.fireSelect(this.data[i]);
                }
            }
        }
    },

    /**
     * Update a record
     * @function updateRecord
     * @param {Object} search
     * @param {Object} updates
     * @return {dataSource.Record} record
     * @memberof ludo.dataSource.JSONArray.prototype
     */
    updateRecord: function (search, updates) {
        var rec = this.getRecord(search);
        if (rec) {
            rec.setProperties(updates);
        }
        return rec;
    },

    getPostData: function () {
        if (!this.paging) {
            return this.parent();
        }
        var ret = this.postData || {};
        ret._paging = {
            size: this.paging.size,
            offset: this.paging.offset
        };
        ret._sort = this.sortedBy;
        return ret;
    },
    /**
     * When paging is enabled, go to previous page.
     * fire previousPage event
     * @function previousPage
     * @memberof ludo.dataSource.JSONArray.prototype
     */
    previousPage: function () {
        if (!this.paging || this.isOnFirstPage())return;
        this.paging.offset -= this.paging.size;

        this.onPageChange('previousPage');
    },

    /**
     * When paging is enabled, go to next page
     * fire nextPage event
     * @function nextPage
     * @memberof ludo.dataSource.JSONArray.prototype
     */
    nextPage: function () {
        if (!this.paging || this.isOnLastPage())return;
        this.paging.offset += this.paging.size;

        this.onPageChange('nextPage');
    },

    /**
     * Go to last page
     * @function lastPage
     * @memberof ludo.dataSource.JSONArray.prototype
     */
    lastPage: function () {
        if (!this.paging || this.isOnLastPage())return;
        var count = this.getCount();
        var decr = count % this.paging.size;
        if (decr === 0) decr = this.paging.size;
        this.paging.offset = count - decr;
        this.onPageChange('lastPage');
    },

    /**
     * Go to first page
     * @function firstPage
     * @memberof ludo.dataSource.JSONArray.prototype
     */
    firstPage: function () {
        if (!this.paging || this.isOnFirstPage())return;
        this.paging.offset = 0;

        this.onPageChange('firstPage');
    },

    isOnFirstPage: function () {
        if (!this.paging)return true;
        return this.paging.offset === undefined || this.paging.offset === 0;
    },

    isOnLastPage: function () {
        return this.paging.size + this.paging.offset >= this.getCount();
    },

    onPageChange: function (event) {
        if (this.paging['remotePaging']) {
            this.loadOrGetFromCache();
        }
        this.fireEvent('change');
        this.fireEvent(event);
        this.firePageEvents();
    },

    loadOrGetFromCache: function () {
        if (this.isDataInCache()) {
            this.data = this.dataCache[this.getCacheKey()].data;
            this.fireEvent('change');
        } else {
            this.load();
        }
    },

    populateCache: function () {
        if (this.isCacheEnabled()) {
            this.dataCache[this.getCacheKey()] = {
                data: this.data,
                time: new Date().getTime()
            }
        }
    },

    isDataInCache: function () {
        return this.dataCache[this.getCacheKey()] !== undefined && !this.isCacheOutOfDate();
    },

    clearCache: function () {
        this.dataCache = {};
    },

    isCacheOutOfDate: function () {
        if (!this.paging['cacheTimeout'])return false;

        var created = this.dataCache[this.getCacheKey()].time;
        return created + (this.paging['cacheTimeout'] * 1000) < (new Date().getTime());
    },

    getCacheKey: function () {
        var keys = [
            'key', this.paging.offset, this.sortedBy.column, this.sortedBy.order
        ];
        if (this.searcher !== undefined && this.searcher.hasData())keys.push(this.searcher.searchToString());
        return keys.join('|');
    },

    hasData: function () {
        return this.data != undefined && this.data.length > 0;
    },

    firePageEvents: function (skipState) {
        if (this.isOnLastPage()) {

            this.fireEvent('lastPage');
        } else {

            this.fireEvent('notLastPage');
        }

        if (this.isOnFirstPage()) {
            this.fireEvent('firstPage');

        } else {

            this.fireEvent('notFirstPage');
        }

        this.fireEvent('page', this.getPageNumber());
        if (skipState === undefined)this.fireEvent('state');
    },

    /**
     * Go to a specific page
     * @function toPage
     * @param {Number} pageNumber
     * @return {Boolean} success
     * @memberof ludo.dataSource.JSONArray.prototype
     */
    toPage: function (pageNumber) {
        if (pageNumber > 0 && pageNumber <= this.getPageCount() && !this.isOnPage(pageNumber)) {
            this.paging.offset = (pageNumber - 1) * this.paging.size;

            this.onPageChange('toPage');
            return true;
        }
        return false;
    },

    /**
     * @function setPageSize
     * @param {Number} size
     * @memberof ludo.dataSource.JSONArray.prototype
     */
    setPageSize: function (size) {
        if (this.paging) {
            this.dataCache = {};
            this.paging.size = parseInt(size);
            this.paging.offset = 0;

            this.onPageChange('toPage');
        }
    },

    /**
     * True if on given page
     * @function isOnPage
     * @param {Number} pageNumber
     * @return {Boolean}
     * @memberof ludo.dataSource.JSONArray.prototype
     */
    isOnPage: function (pageNumber) {
        return pageNumber == this.getPageNumber();
    },

    /**
     * Return current page number
     * @function getPageNumber
     * @return {Number} page
     * @memberof ludo.dataSource.JSONArray.prototype
     */
    getPageNumber: function () {
        return this.paging ? Math.floor(this.paging.offset / this.paging.size) + 1 : 1;
    },

    /**
     * Return number of pages
     * @function getPageCount
     * @return {Number}
     * @memberof ludo.dataSource.JSONArray.prototype
     */
    getPageCount: function () {
        return this.paging ? Math.ceil(this.getCount() / this.paging.size) : 1;
    },

    /**
     * Return data in collection
     * @function getData
     * @memberof ludo.dataSource.JSONArray.prototype
     * @returns {Array}
     */
    getData: function () {
        if (this.hasSearchResult()) {
            if (this.paging && this.paging.size) {
                return this.getDataForPage(this.searcher.getData());
            }
            return this.searcher.getData();
        }
        if (!this.paging || this.paging.remotePaging) {
            return this.parent();
        }
        return this.getDataForPage(this.data);
    },


    getDataForPage: function (data) {
        if (!data || data.length == 0)return [];
        var offset = this.paging.initialOffset || this.paging.offset;
        if (offset > data.length) {
            this.toPage(this.getPageCount());
            offset = (this.getPageCount() - 1) * this.paging.size;
        }
        this.resetInitialOffset.delay(200, this);
        return data.slice(offset, Math.min(data.length, offset + this.paging.size));
    },

    resetInitialOffset: function () {
        this.paging.initialOffset = undefined;
    },

    parseNewData: function (data, json) {
        // TODO refactor this
        if (json != undefined && this.paging && json.rows !== undefined)this.paging.rows = json.rows;
        if (json != undefined && this.paging && json.response && json.response.rows !== undefined)this.paging.rows = json.response.rows;
        this.parent(data, json);

        this.fireEvent('count', this.getCount());
        if (this.shouldSortAfterLoad()) {
            this.sort();
        } else {
            this.fireEvent('change');
        }
        if (this.paging !== undefined) {
            this.firePageEvents(true);
        }
    },

    createIndex: function () {
        this.index = {};
        this.indexBranch(this.data);
    },

    indexBranch: function (branch, parent) {
        for (var i = 0; i < branch.length; i++) {
            this.indexRecord(branch[i], parent);
            if (branch[i].children && branch[i].children.length)this.indexBranch(branch[i].children, branch[i]);
        }
    },

    indexRecord: function (record, parent) {
        if (!this.index)this.createIndex();
        if (parent)record.parentUid = parent.uid;
        var pk = this.getPrimaryKeyIndexFor(record);
        if (pk)this.index[pk] = record;
        if (!record.uid)record.uid = ['uid_', String.uniqueID()].join('');
        this.index[record.uid] = record;
    },

    shouldSortAfterLoad: function () {
        if (this.paging && this.paging.remotePaging)return false;
        return this.sortedBy !== undefined && this.sortedBy.column && this.sortedBy.order;
    },

    /**
     Filter collection based on given search term. To filter on multiple search terms, you should
     get a reference to the {{#crossLink "dataSource.JSONArraySearch"}}{{/crossLink}} object and
     use the available {{#crossLink "dataSource.JSONArraySearch"}}{{/crossLink}} methods to add
     multiple search terms.
     @function Search
     @param {String} search
     @memberof ludo.dataSource.JSONArray.prototype
     @example
     ludo.get('myCollection').search('New York');
     // or with the {{#crossLink "dataSource.JSONArraySearch/add"}}{{/crossLink}} method
     var searcher = ludo.get('myCollection').getSearcher();
     searcher.where('New York').execute();
     searcher.execute();
     */
    search: function (search) {
        this.getSearcher().search(search);
    },

    /**
     * Executes a remote search for records with the given data
     * @function remoteSearch
     * @param {String|Object} search
     * @memberof ludo.dataSource.JSONArray.prototype
     */
    remoteSearch: function (search) {
        this.postData = this.postData || {};
        this.postData.search = search;
        this.toPage(1);
        this.load();
    },

    afterSearch: function () {
        var searcher = this.getSearcher();
        this.fireEvent('count', searcher.hasData() ? searcher.getCount() : this.getCount());
        if (this.paging !== undefined) {
            this.paging.offset = 0;
            this.firePageEvents(true);
            this.fireEvent('pageCount', this.getPageCount());
        }
        this.fireEvent('change');
    },

    searcher: undefined,
    /**
     * Returns a {{#crossLink "dataSource.JSONArraySearch"}}{{/crossLink}} object which
     * you can use to filter a collection.
     * @function getSearcher
     * @return {dataSource.JSONArraySearch}
     * @memberof ludo.dataSource.JSONArray.prototype
     */
    getSearcher: function () {
        if (this.searcher === undefined) {
            this.searchConfig = this.searchConfig || {};
            var config = Object.merge({
                type: this.searcherType,
                dataSource: this
            }, this.searchConfig);
            this.searcher = ludo._new(config);
            this.addSearcherEvents();
        }
        return this.searcher;
    },

    addSearcherEvents: function () {
        this.searcher.addEvent('search', this.afterSearch.bind(this));
        this.searcher.addEvent('deleteSearch', this.afterSearch.bind(this));
    },

    hasSearchResult: function () {
        return this.searcher !== undefined && this.searcher.hasData();
    },
    /**
     Return record by id or undefined if not found. Records are indexed by id. This method
     gives you quick access to a record by it's id. The method returns a reference to the
     actual record. You can use Object.clone(record) to create a copy of it in case you
     want to update the record but not make those changes to the collection.
     @function getById
     @param {String|Number|Object} id
     @return {Object} record
     @memberof ludo.dataSource.JSONArray.prototype
     @example
     var collection = new ludo.dataSource.JSONArray({
	 		url : 'get-countries.php',
	 		primaryKey:'country'
	 	});
     var record = collection.getById('Japan'); // Returns record for Japan if it exists.
     You can also define multiple keys as id
     @example
     var collection = new ludo.dataSource.JSONArray({
			url : 'get-countries.php',
			primaryKey:['id', 'country']
		 });
     var record = collection.getById({ id:1, country:'Japan' });
     This is especially useful when you have a {{#crossLink "dataSource.JSONTree"}}{{/crossLink}}
     where child nodes may have same numeric id as it's parent.
     @example
     { id:1, type:'country', title : 'Japan',
          children:[ { id:1, type:'city', title:'Tokyo }]
 By setting primaryKey to ['id', 'type'] will make it possible to distinguish between countries and cities.
 */
    getById: function (id) {
        if (this.index[id] !== undefined) {
            return this.index[id];
        }

        if (this.primaryKey.length === 1) {
            return this.index[id];
        } else {
            var key = [];
            for (var i = 0; i < this.primaryKey.length; i++) {
                key.push(id[this.primaryKey[i]]);
            }
            return this.index[key.join('')];
        }
    },

    recordObjects: {},

    /**
     Returns {{#crossLink "dataSource.Record"}}{{/crossLink}} object for a record.
     If you want to update a record, you should
     first get a reference to {{#crossLink "dataSource.Record"}}{{/crossLink}} and then call one
     of it's methods.
     @function getRecord
     @param {String|Object} search
     @return {dataSource.Record|undefined}
     @memberof ludo.dataSource.JSONArray.prototype
     @example
     var collection = new ludo.dataSource.JSONArray({
			url : 'get-countries.php',
			primaryKey:'country'
		 });
     collection.getRecord('Japan').set('capital', 'tokyo');
     */
    getRecord: function (search) {
        var rec = this.findRecord(search);
        if (rec) {
            return this.createRecord(rec);
        }
        return undefined;
    },

    createRecord: function (data) {
        var id = data.uid;
        if (!this.recordObjects[id]) {
            this.recordObjects[id] = this.recordInstance(data, this);
            this.addRecordEvents(this.recordObjects[id]);
        }
        return this.recordObjects[id];
    },

    recordInstance: function (data) {
        return new ludo.dataSource.Record(data, this);
    },

    addRecordEvents: function (record) {
        record.addEvent('update', this.onRecordUpdate.bind(this));
        record.addEvent('remove', this.onRecordDispose.bind(this));
        record.addEvent('select', this.selectRecord.bind(this));
    },

    fireSelect: function (record) {
        this.fireEvent('select', record);
    },

    onRecordUpdate: function (record) {
        this.indexRecord(record);
        this.fireEvent('update', record);
    },

    onRecordDispose: function (record) {
        var branch = this.getBranchFor(record);
        if (branch) {
            var index = branch.indexOf(record);
            if (index !== -1) {
                branch.splice(index, 1);
            }
            this.removeFromIndex(record);
            this.fireEvent('remove', record);
        }
    },

    getBranchFor: function (record) {
        if (record.parentUid) {
            var parent = this.findRecord(record.parentUid);
            return parent ? parent.children : undefined;
        } else {
            return this.data;
        }
    },

    removeFromIndex: function (record) {
        this.recordObjects[record.uid] = undefined;
        this.index[record.uid] = undefined;
        var pk = this.getPrimaryKeyIndexFor(record);
        if (pk)this.index[pk] = undefined;
    },

    getPrimaryKeyIndexFor: function (record) {
        if (this.primaryKey) {
            var key = [];
            for (var j = 0; j < this.primaryKey.length; j++) {
                key.push(record[this.primaryKey[j]]);
            }
            return key.join('');
        }
        return undefined;
    }
});

ludo.factory.registerClass('dataSource.JSONArray', ludo.dataSource.JSONArray);