/**
 * @namespace form
 * @class FilterText
 * @extends form.Text
 * TODO this class is not working properly loading data from server. fix later
 */
ludo.form.FilterText = new Class({
    Extends:ludo.form.Text,
    type:'form.FilterText',

    /**
     * Suggest selected record.
     * @attribute autoComplete
     * @type {Boolean}
     * @default true
     */
    autoComplete:true,

    /**
     * value and title to display when no records are selected
     * @attribute emptyItem
	 * @type Object
     */
    emptyItem:{
        /**
         * value of empty item
         * @attribute emptyItem.value
         * @type string
         * @default empty string
         */
        value:'',
        /**
         * display value of empty item
         * @attribute emptyItem.title
         * @type string
         * @default empty string
         */
        title:''
    },

    /**
     * When set to true, filtering should be done on the server. When set to false, the script will search initial records sent to constructor using config.data
     * or the records it got from the server during when constructing the component
     * @attribute filterOnServer
     * @type {Boolean}
     * @default false
     */
    filterOnServer:false,
    /**
     * When search for records on the server is enabled or you have sent collection of records to the component on creation using config.data,
     * this property specifies maximum number of filtered records to be displayed below the component. For standard text fields, this property is of no interest.
     * @attribute maxDisplayed
     * @type int
     * @default 10
     */
    maxDisplayed:10,
    /**
     * "id" field of records used for filtering, this will also be the value of the text field. Example:
     * [{ id: 100, Title: 'Norway' }] will return 100 when calling component.getValue()
     * @attribute idField
     * @type string
     * @default "id"
     */
    idField:'id',
    /**
     * name of "display" field when filtering is enabled. This identified the column used in list box below input field,
     * example: displayField set to "firstname" will be display "John" and "Jane" for these records: [{ id:1, firstname: 'John', lastname: 'Doe' }, {id:2, firstname: 'Jane', lastname: 'Doe'} ]
     * @attribute displayField
     * @type string
     * @default "title"
     */
    displayField:'title',
    selectedRecord:undefined,
    timeStamp:0,
    remote:{},

    ludoConfig:function (config) {
        this.filterOnServer = config.filterOnServer || this.filterOnServer;
        if (config.remote) {
            config.remote.isJSON = true;
            this.remote.queryParam = config.remote.queryParam || this.remote.queryParam;
            this.remote.queryParamRecord = config.remote.queryParamRecord || config.remote.queryParamRecord;
        }
        this.emptyItem = config.emptyItem || this.emptyItem;
        this.parent(config);
        if (this.filterOnServer) {
            this.remote.autoLoad = false;
        }
        this.autoComplete = config.autoComplete || this.autoComplete;
    },


    ludoRendered:function () {
        this.parent();

        var cell = this.els.cellInput;

        var size = ludo.dom.getNumericStyle(this.els.formEl, 'width') + ludo.dom.getPW(this.els.formEl) + ludo.dom.getBW(this.els.formEl) + ludo.dom.getMW(this.els.formEl);

        var container = this.els.inputContainer = $('<div>');
        cell.append(container);
        container.append(this.els.formEl);
        container.addClass('ludo-form-text-autocomplete-container');
        if (!isNaN(size)) {
            container.css({
                'width':size
            });
        }

        this.createFilterComponent();
        this.createHiddenInput();

        this.getFormEl().addClass('ludo-form-text-autocomplete');
        this.getFormEl().attr('autocomplete', 'off');

        this.getFormEl().css({
            'background-color':'transparent',
            'z-index':100
        });

        var el = this.els.autoComplete = $('<input>');
        el.addClass('ludo-form-text-autocomplete');
        el.disabled = true;
        el.css('zIndex', 99);
        el.css('color', 'silver');
        el.css('cursor', 'none');
        this.els.inputContainer.append(el);

        this.els.formElDiv = $('<div>');
        this.els.hiddenEl = $('<div>');
        this.setRecord(this.getEmptyItem());
    },

    getEmptyItem:function () {
        var ret = {};
        ret[this.idField] = this.emptyItem[this.idField] === undefined ? this.emptyItem.value : this.emptyItem[this.idField];
        ret[this.displayField] = this.emptyItem.title || this.emptyItem.text;
        return ret;
    },

    createHiddenInput:function () {
        var hiddenInput = this.els.hiddenInput = $('<input type="hidden">');
        hiddenInput.val(this.value);
        this.getEl().append(hiddenInput);
    },

    getHiddenInput:function () {
        if (this.els.hiddenInput) {
            return this.els.hiddenInput;
        }
        return null;
    },
    /**
     * Return value of text field. On standard text fields the visible value will be returned. Otherwise the id of selected record will be returned
     * @method getValue
     * @return string value
     */
    getValue:function () {
        var hiddenInput = this.getHiddenInput();

        if (hiddenInput) {
            return hiddenInput.get('value');
        }
        return this.parent();
    },

    setAutoCompleteRecord:function (record) {
        this.els.autoComplete.set('value', record[this.displayField]);
    },

    createFilterComponent:function () {
        this.getFormEl().on('keyup', this.filter.bind(this));
        this.getFormEl().on('keydown', this.filterKeyEvents.bind(this));
        this.getFormEl().on('focus', this.hideFilter.bind(this));

        this.getEventEl().on('mousedown', this.autoHideFilter.bind(this));
        this.getFormEl().on('blur', this.chooseSelectedRecord.bind(this));
        if (this.getParent()) {
            this.getParent().addEvent('startmove', this.hideFilter.bind(this));
        }

        this.filterComponent = new ludo.form.TextFilterContainer({
            formComponent:this,
            width:this.getFormEl().width(),
            height:300,
            maxDisplayed:this.maxDisplayed
        });

        this.hideFilter();
    },

    filterKeyEvents:function (e) {
        this.timeStamp = new Date().getTime();
        if (e.key == 'esc') {
            this.clearSelectedRecord();
            this.setRecord(this.getEmptyItem());
            this.filterComponent.hide();
        }
        if (e.key == 'enter' || e.key == 'tab') {
            var rec = this.filterComponent.getSelectedRecord();
            if (rec)this.setRecord(rec);
            this.hideFilter();

            if (e.key === 'enter') {
                var cmp = ludo.Form.getNext(this);
                if (cmp) {
                    cmp.focus();
                }
                return false;
            }
        }

        if (e.key == 'up') {
            this.filterComponent.selectPrevious();
        }
        if (e.key == 'down') {
            this.filterComponent.selectNext();
        }
        return undefined;
    },

    autoHideFilter:function (e) {
        var t = $(e.target);
        var id = t.attr("id");
        if (id && id == this.getFormEl().attr("id")) {
            return;
        }
        if (t.hasClass('ludo-filter-text-options') || t.parent('.ludo-filter-text-options')) {
            return;
        }
        this.filterComponent.hide();
    },

    filter:function (e) {
        if (e && e.key) {
            if (e.key == 'up' || e.key == 'down' || e.key == 'enter' || e.key == 'esc' || e.key == 'tab')return;
        }
        this.getHiddenInput().val(this.getFormEl().value);
        this.filterData(this.getFormEl().value);
    },

    getFieldWidth:function () {
        return this.formFieldWidth + ludo.dom.getBW(this.els.inputContainer) + ludo.dom.getPW(this.els.inputContainer);
    },
    reset:function () {
        this.parent();
        this.filter();
    },

    /**
     * If record is part of data collection in memory(config.data or remotely loaded records), it will be shown,
     * if remote.url is set it will search for request to the server for the record. The query will look like this:
     * { getRecord : { id: 100 } } and it expects response from server in this format:
     *  { success: true, data : { id: 100, title: 'John Doe' } }
     * @method setValue
     * @param {String} value
     */
    setValue:function (value) {
        if (this.remote.url) {
            var obj = {};
            obj[this.idField] = value;
            this.setRecord(obj);
        } else {
            this.parent(value);
        }
    },

    setRecord:function (record) {
        this.selectedRecord = record;
        if (record[this.idField] !== undefined && record[this.displayField] === undefined) {
            this.loadSingleRecordRemote(record);
        } else {
            this.chooseSelectedRecord();
            this.filterComponent.hide();
        }
    },

    loadSingleRecordRemote:function (record) {
        if(!this.remote.url){
            return;
        }
        var remoteConfig = {
            url:this.getUrl(),
            method:'post',
            onSuccess:function (json) {
                var record = json.data;
                if (this.idField && record[this.idField]!==undefined && record[this.displayField]) {
                    this.setRecord(record);
                }
            }.bind(this)
        };
        remoteConfig.params = {};
        remoteConfig.params[this.idField] = record.id;
        remoteConfig.params[this.remote.queryParamRecord] = record;

        this.JSONRequest(remoteConfig);
    },

    chooseSelectedRecord:function () {
        var record = this.getSelectedRecord();
        if (record) {
            var realValue = record[this.displayField];
            if (this.isEmptyRecord(record)) {
                realValue = '';
            }
            this.getFormEl().val(realValue);

            this.els.autoComplete.val(record[this.displayField]);
            this.getHiddenInput().val(record[this.idField]);
        }
    },

    isEmptyRecord:function (record) {
        return record[this.idField].length === 0;
    },

    originalSearch:undefined,
    filterData:function (search) {
        this.originalSearch = search;
        search = search.toLowerCase();

        if (search.length == 0) {
            this.clearSelectedRecord();
            this.setRecord(this.getEmptyItem());
            this.filterComponent.hide();
            return;
        }

        this.clearSelectedRecord();

        if (!this.data && !this.filterOnServer) {
            return;
        }

        if (this.filterOnServer) {
            this.filterRemote(search);
        } else {
            var filteredRecords = this.getFilteredRecords(search);
            if (filteredRecords.length > 0) {
                this.showSuggestionAndPopulateDropDown(search, filteredRecords);
            } else {
                this.clearSelectedRecord();
                this.filterComponent.hide();
            }
        }
    },

    filterRemote:function (search) {
        if (this.filterCache[search]) {
            this.showSuggestionAndPopulateDropDown(search, this.filterCache[search]);
            return;
        }
        var d = new Date();
        if (d.getTime() - this.timeStamp < 500) {
            if (search == this.getFormEl().value.toLowerCase()) {
                this.filterRemote.delay(100, this, [search]);
            }
            return;
        }

        this.filterCache[search] = [];
        if(!this.remote.url){
            return;
        }
        var remoteConfig = {
            url:this.remote.url,
            method:'post',
            onSuccess:function (json) {
                this.filterCache[search] = json.data;
                this.showSuggestionAndPopulateDropDown(search, json.data);
            }.bind(this)
        };
        remoteConfig.params = this.remote.data;
        remoteConfig.params[this.remote.queryParam] = search;
        remoteConfig.params.maxDisplayed = this.maxDisplayed;

        this.JSONRequest(remoteConfig);
    },

    showSuggestionAndPopulateDropDown:function (search, records) {
        if (records.length == 0) {
            this.filterComponent.hide();
            this.clearSelectedRecord();
            return;
        }

        var suggestedRecord = this.getSuggestedRecord(records);
        if (suggestedRecord) {
            this.selectedRecord = suggestedRecord;
            this.els.autoComplete.set('value', suggestedRecord[this.displayField]);
        } else {
            this.clearSelectedRecord();
        }
        this.filterComponent.position();
        this.filterComponent.populate(records);
        this.filterComponent.show();
    },

    getSuggestedRecord:function (records) {
        var len = Math.min(this.maxDisplayed, records.length);
        for (var i = 0; i < len; i++) {
            if (records[i][this.displayField].indexOf(this.originalSearch) == 0) {
                return records[i];
            }
        }
        return null;
    },

    clearSelectedRecord:function () {
        this.els.autoComplete.set('value', '');
        this.selectedRecord = undefined;
    },

    getSelectedRecord:function () {
        return this.selectedRecord;
    },

    filterCache:{},
    getFilteredRecords:function (search) {
        if (!this.filterCache[search]) {
            this.filterCache[search] = [];

            for (var i = 0; i < this.data.length; i++) {
                if (this.data[i].searchString.indexOf(search) >= 0) {
                    this.filterCache[search].push(this.data[i]);
                }
            }
        }

        return this.filterCache[search];
    },

    hideFilter:function () {
        this.filterComponent.hide.delay(200, this.filterComponent);
    },

    resizeDOM:function () {
        this.parent();
        this.els.inputContainer.css('width', this.getFormEl().width());
    },

    populate:function (data) {
        this.data = data;
        for (var i = 0; i < data.length; i++) {
            this.data[i].searchString = this.data[i][this.displayField].toLowerCase();
        }
    }
});

ludo.form.TextFilterContainer = new Class({
    Extends:ludo.View,
    type:'form.TextFilterContainer',
    formComponent:undefined,
    width:500,
    height:300,
    titleBar:false,
    hidden:true,
    maxDisplayed:10,
    tpl:'<div>{title}</div>',
    records:[],
    selectedIndex:undefined,

    containerCss:{
        position:'absolute',
        border:'1px solid #AAA',
        'background-color':'#FFF'
    },
    ludoConfig:function (config) {
        this.formComponent = config.formComponent;
        config.els = config.els || {};
        config.renderTo = document.body;
        this.parent(config);
        this.alwaysInFront = true;
        this.maxDisplayed = config.maxDisplayed;

    },

    ludoRendered:function () {
        this.parent();
        this.resize({
            width:this.layout.width,
            height:this.layout.height
        });

        this.getBody().css('overflow', 'hidden');
        this.getBody().addClass('ludo-filter-text-options');
    },

    keyUp:function(){

    },

    position:function () {
        var pos = this.getFormEl().els.inputContainer.getCoordinates(this.renderTo);
        this.setPosition({
            left:pos.left,
            top:pos.top + pos.height
        });
    },

    getFormEl:function () {
        return this.formComponent;
    },

    populate:function (records) {
        this.records = records;
        this.getBody().set('html', '');


        this.els.recordNodes = [];
        this.selectedIndex = undefined;
        var len = Math.min(records.length, this.maxDisplayed);

        for (var i = 0; i < len; i++) {
            var div = this.els.recordNodes[i] = $('<div>');
            div.attr('recordIndex', i);
            div.className = 'ludo-form-autocomplete-suggestion';
            div.set('html', records[i][this.formComponent.displayField]);
            this.getBody().append(div);
            div.addEvent('click', this.setRecord.bind(this));
            div.addEvent('mouseenter', this.mouseEnterRecord.bind(this));
            div.addEvent('mouseleave', this.mouseLeaveRecord.bind(this));
        }

        this.autoResize.delay(30, this, len);
    },

    autoResize:function (countRecords) {
        var div = this.getBody().getElement('.ludo-form-autocomplete-suggestion');
        var height = countRecords * this.getHeightOfSuggestionElement(div);
        height += ludo.dom.getMH(this.getEl());
        height += ludo.dom.getMH(this.getBody());
        height += ludo.dom.getBH(this.getBody());
        height += ludo.dom.getPH(this.getBody());


        this.resize({
            width:this.formComponent.getFieldWidth(),
            height:height
        });
    },

    selectNext:function () {
        if (this.records.length === 0) {
            return;
        }
        if (this.selectedIndex === undefined || this.selectedIndex == this.records.length - 1) {
            this.selectedIndex = 0;
        } else {
            this.selectedIndex++;
        }
        this.highlightRecord(this.selectedIndex);
    },
    selectPrevious:function () {
        if (this.records.length === 0) {
            return;
        }
        if (this.selectedIndex === undefined || this.selectedIndex == 0) {
            this.selectedIndex = this.records.length - 1;
        } else {
            this.selectedIndex--;
        }
        this.highlightRecord(this.selectedIndex);

    },
    mouseEnterRecord:function (e) {
        this.selectedIndex = e.target.getProperty('recordIndex');
        this.highlightRecord(this.selectedIndex);
    },

    mouseLeaveRecord:function (e) {
        e.target.removeClass('ludo-form-autocomplete-suggestion-over');
    },

    highlightRecord:function (recordIndex) {
        if (this.highlightedRecord) {
            this.highlightedRecord.removeClass('ludo-form-autocomplete-suggestion-over')
        }
        this.highlightedRecord = this.els.recordNodes[recordIndex];
        this.highlightedRecord.addClass('ludo-form-autocomplete-suggestion-over')
    },

    getSelectedRecord:function () {
        if (this.selectedIndex !== undefined && this.records[this.selectedIndex]) {
            return this.records[this.selectedIndex];
        }
        return undefined;
    },

    setRecord:function (e) {
        var index = e.target.getProperty('recordIndex');
        this.formComponent.setRecord(this.records[index]);
        this.formComponent.hideFilter();
    },

    heightOfSuggestionElement:undefined,

    getHeightOfSuggestionElement:function (el) {
        if (this.layout.heightOfSuggestionElement === undefined) {
            this.layout.heightOfSuggestionElement = el.measure(function () {

                return this.getSize().y;
            });
        }
        return this.layout.heightOfSuggestionElement;
    }
});