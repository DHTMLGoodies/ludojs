/**
 ludo Model. A Model should be passed to a ludo.View object using the config.model property
 A Model creates dynamic getters and setters. Updates made to the model will be done to form components
 which have the same name as a column in the model.

 @namespace model
 @class Model
 @example
 model:{
	 type:'model.Model',
	 name:'user',
	 columns:['firstname', 'lastname', 'email','timezone','locale'],
	 autoLoad:true
	}
 This is an example of a model config sent to a component.
 */
ludo.model.Model = new Class({
	Extends:Events,
	type:'model.Model',

	/**
	 * @attribute {String} model name
	 * @description Name of model
	 * @default undefined
	 */
	name:undefined,
	/**
	 * Column specifications
	 @attribute columns
	 @type Array
	 @default undefined
	 @example
	 ['firstname','lastname', { name:'age', defaultValue:20 }]
	 */
	columns:undefined,
	columnKeys:[],
	currentRecord:{},

	progressBar:undefined,
	formComponents:{},
	views:[],

	/**
	 * URL for save and load. If not set, it will use the URL of nearest component.
	 * @attribute url
	 * @param url
	 * @type String
	 * @default undefined
	 */
	url:undefined,

	/**
	 * Event listeners, example : listeners :{ submit : doSomething(); }, submitfail : doSomethingElse()}
	 * @attribute Object listeners
	 * @default undefined
	 */
	listeners:undefined,
	/**
	 * Initial record id
	 * @config {String} recordId
	 * @default undefined
	 */
	recordId:undefined,

    /**
     * Name of id field
     * @config {String} idField
     * @default id
     */
    idField : 'id',

	/**
	 * Send initial server request even if no id is set. The model will then be populated from server with default data
	 * @attribute {Boolean} autoLoad
	 */
	autoLoad:false,

	/**
	 * Automatically populate form fields where name is equal to the name of a column in the model
	 * @config {Boolean} autoPopulate
	 * @default true
	 */
	autoPopulate:true,

	initialize:function (config) {

        this.setConfigParams(config, ['name','columns','recordId','idField','id','url','autoPopulate']);

		ludo.CmpMgr.registerComponent(this);

		this._validateColumns();

		if (config.listeners) {
			this.listeners = config.listeners;
		}

		this.createSettersAndGetters();
		if (this.listeners) {
			this.addEvents(this.listeners);
		}
		if (config.recordId || config.autoLoad) {
			this.load(config.recordId);
		}
	},
    setConfigParams:function(config, keys){
        for(var i=0;i<keys.length;i++){
            if(config[keys[i]] !== undefined)this[keys[i]] = config[keys[i]];
        }
    },

	_setUrl:function (url) {
		this.url = url;
	},

	_validateColumns:function () {
		var ret = {};
		for (var i = 0; i < this.columns.length; i++) {
			var obj = {
                name : this.getColumnName(this.columns[i]),
                defaultValue:this.columns[i].defaultValue || ''
            };
			ret[obj.name] = obj;
			this.columnKeys.push(obj.name);
		}
		this.columns = ret;
	},
	_defaultValueFns: {},
	_getDefaultValueFn:function (column) {
		if (this.columns[column]) {
			var ret = this.columns[column].defaultValue;
			if(ret && ret.indexOf && ret.indexOf('column:') === 0){
				var tokens = ret.split(/:/g);
				return function(){
					return this.get(tokens[1]);
				}
			}else{
				return function(){
					return ret;
				}
			}
		}
		return function(){ return undefined };

	},

	createSettersAndGetters:function () {
		for (var i = 0; i < this.columnKeys.length; i++) {
			this.createSetterFor(this.columnKeys[i]);
			this.createGetterFor(this.columnKeys[i]);
		}
	},

	createSetterFor:function (columnName) {
		this[this.getFnName('set', columnName)] = function (value) {
			this.set(columnName, value);
            this.fireEvent('update', this.currentRecord);
			this.updateViews();
			return value;
		}.bind(this)
	},

	createGetterFor:function (columnName) {
		this[this.getFnName('get', columnName)] = function () {
			return this.get(columnName);

		}.bind(this);
		this._defaultValueFns[columnName] = this._getDefaultValueFn(columnName);
	},

    getFnName:function(prefix, col){
        return prefix + col.substr(0, 1).toUpperCase() + col.substr(1);
    },

	getColumnName:function (column) {
        return column.name ? column.name : column;
	},

	set:function (property, value) {
		if (this.currentRecord && this.autoPopulate) {
			if (this.formComponents[property]) {
				for (var i = 0; i < this.formComponents[property].length; i++) {
					this.formComponents[property][i].setValue(value);
				}
			}
            this.currentRecord[property] = value;
			this.fireEvent('change', [property, value, this]);
		}
	},

	get:function (property) {
		if (this.currentRecord) {
			if(this.formComponents[property]) return this.formComponents[property][0].getValue();
			if(this.currentRecord[property])return this.currentRecord[property];
			return this._defaultValueFns[property].call(this,property);
		}
		return '';
	},
	/**
	 Load remote record from server
	 @method load
	 @param {String} recordId

	 Example of query:
	 @example
	 request:{
	 		"request": "Person/100/read"
	 	}
	 Example of expected response
    @example
         {
            "success":true,
            "message":"",
            "code": 200,
            "data":{
                "id":100,
                "lastname":"Doe",
                "firstname":"John",
                "address":"My street 27",
                "zipcode":"4330",
                "city":"Springfield",
                "phone":"+00 12 23 23 43",
                "email":"john.doe@example-domain.com",
                "picture":"john.psd"
            }
         }

	 */
	load:function (recordId) {
		if (!this.url && !ludo.config.getUrl()) {
			return;
		}
        if(recordId)this.recordId = recordId;
		this.loadRequest().send("read", recordId);
	},

    _loadRequest:undefined,
    loadRequest:function(){
        if(this._loadRequest === undefined){
            this._loadRequest = new  ludo.remote.JSON({
                url:this.url,
                resource:this.name,
                listeners:{
                    "beforeload": function(request){
                        this.fireEvent("beforeload", request);
                    },
                    "success":function (request) {
                        this.populate(this.recordId, request.getResponseData());
                        /**
                         * success parameter in response from server returned false
                         * @event record loaded
                         * @param {Object} JSON from server
                         * @param {Object} ludo.model
                         */
                        this.fireEvent('loaded', [request.getResponse(), this]);
                    }.bind(this),
                    "failure":function (request) {
                        /**
                         * success parameter in response from server returned false
                         * @event loadfail
                         * @param {Object} JSON from server
                         * @param {Object} ludo.model
                         */
                        this.fireEvent('loadFailed', [request.getResponse(), this]);
                    }.bind(this)
                }
            });
        }
        return this._loadRequest;
    },

	registerProgressBar:function (cmp) {
		this.progressBar = cmp;
	},
    fc:[],
	/**
	 * Register ludo.View object. if name of component is the same
	 * as column name in model, it will add change event to the component and
	 * update it's value to current model value. This method is called
	 * by ludo.form.Manager
	 * @method registerFormComponent
	 * @param {Object} formComponent
	 * @private
	 */
	registerFormComponent:function (formComponent) {
		var name = formComponent.getName();
		if (this.columnKeys.indexOf(name) >= 0) {
			if (!this.formComponents[name]) {
				this.formComponents[name] = [];
			}
			this.formComponents[name].push(formComponent);
			formComponent.addEvent('valueChange', this.updateByForm.bind(this));
			if(this.autoPopulate){
				formComponent.setValue(this.get(name));
				formComponent.commit();
			}
		}
	},
	registerView:function (view) {
		this.views.push(view);
		view.insertJSON(this.currentRecord);
	},

	updateViews:function () {
		for (var i = 0, len = this.views.length; i < len; i++) {
			this.views[i].insertJSON(this.currentRecord);
		}
	},

	updateByForm:function (value, formComponent) {
        this.currentRecord[formComponent.getName()] = value;
        this.fireEvent('update', this.currentRecord);
		this.updateViews();
	},

	hasColumn:function (key) {
		return this.columnKeys.indexOf(key) >= 0;
	},
    // TODO save new model - update this.recordId
	/**
	 example: { freeText : 'Notes' }
	 @method save
	 @param {Object} formData
	 Save model data to server. The server request will look like this:
	 @example
		 {
		 	   "request": "Person/100/save",
			   "data": { "id:100","firstname":"Jane","lastname":"Doe" }
		 }

	 Response from server should be in this format
	 @example
	 	{
		   "success" : true,
		   "message" : "A message in case of error",
		   "response" : {
		   		"id": "100"
		   }
	   }


	 "message" is used for eventual error messages.
	 "code" is optional and may be used for internal error handling.
	 "response" is an array of updated model values.
	 */
	save:function (formData) {
        var data = this.getDataToSubmit(formData);
		this.fireEvent('beforesubmit', this);
        this.saveRequest().send("save", this.recordId, data, {
            progressBarId:this.getProgressBarId()
        });
	},

    getDataToSubmit:function(formData){
        formData = formData || {};
        var data = Object.merge(this.currentRecord);
        for(var key in data){
            if(data.hasOwnProperty(key)){
                data[key] = this.get(key);
            }
        }
        for (key in formData) {
            if (formData.hasOwnProperty(key) && !this.hasColumn(key)) {
                data[key] = formData[key];
            }
        }
        return data;
    },

    _saveRequest:undefined,
    saveRequest:function(){
        if(this._saveRequest === undefined){
            this._saveRequest = new ludo.remote.JSON({
                url:this.url,
                resource:this.name,
                listeners:{
                    "beforeload": function(request){
                        this.fireEvent("beforeload", request);
                    },
                    "success":function (request) {
                        var updates = request.getResponseData();
                        if (updates) {
                            this.handleModelUpdates(updates);
                        }
                        /**
                         * event fired when model is saved
                         * @event success
                         * @param {Object} JSON response from server
                         * @param {Object} ludo.model.Model
                         */
                        this.fireEvent('success', [request.getResponse(), this]);
                        /**
                         * Event fired after model has been saved
                         * @event saved
                         * @param {Object} JSON response from server
                         * @param {Object} ludo.model.Model
                         */
                        this.fireEvent('saved', [request.getResponse(), this]);
                        this.commitFormFields();
                    }.bind(this),
                    "failure":function (request) {
                        /**
                         * Event fired when success parameter in response from server after saving model was false.
                         * @event model saveFailed
                         * @param {Object} JSON response from server. Error message should be in the "message" property
                         * @param {Object} ludo.model.Model
                         *
                         */
                        this.fireEvent('saveFailed', [request.getResponse(), this]);
                        /**
                         * Event fired when success parameter in response from server is false
                         * @event failure
                         * @param {Object} JSON response from server. Error message should be in the "message" property
                         * @param {Object} ludo.model.Model
                         *
                         */
                        this.fireEvent('failure', [request.getResponse(), this]);
                    }.bind(this),
                    "error":function (request) {
                        /**
                         * Server error event. Fired when the server didn't handle the request
                         * @event servererror
                         * @param {String} error text
                         * @param {String} error message
                         */
                        this.fireEvent('servererror', [request.getResponseMessage(), request.getResponseCode()]);
                    }.bind(this)
                }
            });
        }
        return this._saveRequest;
    },

	getProgressBarId:function () {
		return this.progressBar ? this.progressBar.getProgressBarId() : undefined;
	},

	handleModelUpdates:function (updates) {
        if(updates && updates[this.idField] !== undefined)this.recordId = updates[this.idField];
		for (var column in updates) {
			if (updates.hasOwnProperty(column)) {
                // TODO this fires a lot of update events. refactor to fire only one
				this.set(column, updates[column]);
			}
		}
	},

	/**
	 * Commit all form fields, i.e. update initial value to current value
	 * @method commitFormFields
	 * @return void
	 */
	commitFormFields:function () {
		for (var name in this.formComponents) {
			if (this.formComponents.hasOwnProperty(name)) {
				var cmps = this.formComponents[name];
				for (var i = 0; i < cmps.length; i++) {
					cmps[i].commit();
				}
			}
		}
	},
	/**
	 * New record with default values. Form elements will be updated
	 * automatically.
	 * @method newRecord
	 * @return void
	 */
	newRecord:function () {
		for (var column in this.columns) {
			if (this.columns.hasOwnProperty(column)) {
				this.set(column, this.columns[column].defaultValue);
			}
		}
		this.commitFormFields();
		this.updateViews();
	},

    populate:function (recordId, record) {
        this.fireEvent('beforePopulate', [record, this]);
        this.recordId = recordId;
        for (var prop in record) {
            if (record.hasOwnProperty(prop)) {
                this.set(prop, record[prop]);
            }
        }
        /**
         * Event fired when a record is updated.
         * @event update
         * @param {Object} Update record
         */
        this.fireEvent('update', this.currentRecord);
        /**
         * Event fired when record has been successfully loaded from server
         * @event load
         * @param {Object} Returned record
         * @param {Object} ludo.model
         */
        this.fireEvent('load', [this.currentRecord, this]);
        this.commitFormFields();
        this.updateViews();
    },

	fill:function (recordId, data) {
		this.recordId = recordId;
		for (var key in data) {
			if (data.hasOwnProperty(key)) {
				this.currentRecord[key] = data[key];
			}
		}
		this.fireEvent('update', this.currentRecord);
        this.updateViews();
	}
});
