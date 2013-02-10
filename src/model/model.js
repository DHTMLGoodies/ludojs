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
	 * @attribute {String} recordId
	 * @default undefined
	 */
	recordId:undefined,

	/**
	 * Send initial server request even if no id is set. The model will then be populated from server with default data
	 * @attribute {Boolean} autoLoad
	 */
	autoLoad:false,

	initialize:function (config) {
		if (config.name !== undefined)this.name = config.name;
		if (config.columns !== undefined)this.columns = config.columns;
		if (config.recordId !== undefined)this.recordId = config.recordId;
		ludo.CmpMgr.registerComponent(this);

		this._validateColumns();

		if (config.listeners) {
			this.listeners = config.listeners;
		}
		if (config.url)this.url = config.url;
		this.createSettersAndGetters();
		if (this.listeners) {
			this.addEvents(this.listeners);
		}
		if (config.id || config.autoLoad) {
			this.load(config.id);
		}
	},

	_setUrl:function (url) {
		this.url = url;
	},

	_validateColumns:function () {
		var ret = {};
		for (var i = 0; i < this.columns.length; i++) {
			var obj = {};
			var name;
			if (!this.columns[i].name) {
				obj.name = name = this.columns[i];
				obj.defaultValue = '';
			} else {
				obj.name = name = this.columns[i].name;
				obj.defaultValue = this.columns[i].defaultValue || '';
			}
			ret[name] = obj;
			this.columnKeys.push(name);
		}
		this.columns = ret;
	},

	_getDefaultValue:function (column) {
		if (this.columns[column]) {
			return this.columns[column].defaultValue;
		}
		return undefined;
	},

	createSettersAndGetters:function () {
		for (var i = 0; i < this.columnKeys.length; i++) {
			this.createSetterFor(this.columnKeys[i]);
			this.createGetterFor(this.columnKeys[i]);
		}
	},

	createSetterFor:function (columnName) {
		var fn = 'set' + columnName.substr(0, 1).toUpperCase() + columnName.substr(1);
		this[fn] = function (value) {
			this._setRecordValue(columnName, value);
			this.updateViews();
			return value;
		}.bind(this)
	},

	createGetterFor:function (columnName) {
		var fn = 'get' + columnName.substr(0, 1).toUpperCase() + columnName.substr(1);
		this[fn] = function () {
			return this.getRecordProperty(columnName)
		}.bind(this)
	},

	getColumnName:function (column) {
		if (column.name) {
			return column.name;
		}
		return column;
	},

	_setRecordValue:function (property, value) {
		if (this.currentRecord) {
			this.currentRecord[property] = value;
			if (this.formComponents[property]) {
				for (var i = 0; i < this.formComponents[property].length; i++) {
					this.formComponents[property][i].setValue(value);
				}
			}
			this.fireEvent('change', [value, this]);
			this.fireEvent('update', this.currentRecord);
		}
	},

	getRecordProperty:function (property) {
		if (this.currentRecord) {
			return this.currentRecord[property];
		}
		return '';
	},
	/**
	 Load remote record from server
	 Query sent looks like this: { getModelRecord:1, recordId:recordId, modelName:this.name }
	 Response should be in this format:
	 { success: true|false, message : "on error message", data : { id:100,firstname:'John',...} }
	 @method load
	 @param {String} recordId

	 Example of query:
	 @example
	 request:{
	 		"request": "model/100/read"
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
		if (!this.url) {
			return;
		}
		new ludo.remote.JSON({
			url:this.url,
			data:{
				"request":[this.name, recordId].join('/')
			},
			listeners:{
				"success":function (request) {
					this.populate(recordId, request.getResponseData());
				}.bind(this),
				"failure":function (request) {
					/**
					 * success parameter in response from server returned false
					 * @event loadfail
					 * @param {Object} JSON from server
					 * @param {Object} ludo.model
					 */
					this.fireEvent('loadfail', [request.getResponse(), this]);
				}.bind(this)
			}
		});
	},

	populate:function (recordId, record) {
		this.recordId = recordId;
		for (var prop in record) {
			if (record.hasOwnProperty(prop)) {
				this._setRecordValue(prop, record[prop]);
			}
		}
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

	registerProgressBar:function (cmp) {
		this.progressBar = cmp;
	},
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
			formComponent.setValue(this.getRecordProperty(name));
			formComponent.commit();
		}
	},
	registerView:function (view) {
		this.views.push(view);
		view.insertJSON({ data:this.currentRecord });
	},

	updateViews:function () {
		for (var i = 0, len = this.views.length; i < len; i++) {
			this.views[i].insertJSON({ data:this.currentRecord });
		}
	},

	updateByForm:function (value, formComponent) {
		this._setRecordValue(formComponent.getName(), value);
		this.updateViews();

	},

	hasColumn:function (key) {
		return this.columnKeys.indexOf(key) >= 0;
	},

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
	 "response" is an array of updated model values. In most cases, this would be empty or undefined. Here's a use case of when
	 it might be useful:

	 - You have a View with one file upload element named "image_file"
	 - In that component, you also have a component used for preview of existing image file
	 i.e. children :
	 @example
	 	[{ type: 'form.File', label : 'New image', name : 'image_file' }, { tpl : '&lt;img src="{preview}">' }]
	 - On click on Submit, you send the newly uploaded image file to the server and use some Image Conversion software(example: ImageMagick)
	 to generate a new "preview".
	 - Now, you want to update the view with this new preview, so you send it back in the "updates" array:
	 @example
	 	"response" : [{ preview : 'images/new-file.jpg' }]

	 */
	save:function (formData) {
		formData = formData || {};
		var data = {};
		for (var key in formData) {
			if (formData.hasOwnProperty(key) && !this.hasColumn(key)) {
				data[key] = formData[key];
			}
		}

		this.fireEvent('beforesubmit', this);

		this.remoteHandler().send("save", this.recordId, data);

	},
    _remoteHandler:undefined,
    remoteHandler:function(){
        if(this._remoteHandler === undefined){
            this._remoteHandler = new ludo.remote.JSON({
                url:this.url,
                resource:this.name,
                listeners:{
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
                        this.commitFormFields();
                    }.bind(this),
                    "failure":function (request) {
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
                        this.fireEvent('servererror', [request.getErrorText(), request.getErrorCode()]);
                    }.bind(this)
                }
            });
        }
        return this._remoteHandler;
    },

	getSubmitData:function (data) {
		return {
			id:'saveModelRecord',
			progressBarId:this.getProgressBarId(),
			data:{
				recordId:this.recordId,
				modelName:this.name,
				record:this.currentRecord,
				formData:data
			}
		};
	},

	getProgressBarId:function () {
		if (this.progressBar) {
			return this.progressBar.getProgressBarId();
		}
		return undefined;
	},

	handleModelUpdates:function (updates) {
		for (var column in updates) {
			if (updates.hasOwnProperty(column)) {
				this._setRecordValue(column, updates[column]);
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
				this._setRecordValue(column, this.columns[column].defaultValue);
			}
		}
		this.commitFormFields();
		this.updateViews();
	},

	fill:function (data) {
		for (var key in data) {
			if (data.hasOwnProperty(key)) {
				this.currentRecord[key] = data[key];
			}
		}
		this.fireEvent('update', this.currentRecord);
	}
});