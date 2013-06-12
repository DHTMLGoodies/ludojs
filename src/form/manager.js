/**
 Class for form Management. Instance of this class is created on demand
 by ludo.View.getForm(). Configuration is done via view.form config property.
 @namespace form
 @class Manager
 @extends Core
 @constructor
 @param {Object} config
 @example
 	var view = new ludo.View({
        form:{
            'resource' : 'Person',
            autoLoad:true,
            arguments:1
        },
        children:[
            { type:'form.Text', label:'First name' },
            {
                layout:{ type:'linear',orientation:'horizontal',height:25},
                children:[
                    { type:'form.SubmitButton', value:'Save' },
                    { type:'form.ResetButton', value:'Reset form }
                ]
            }
        ]
    });
 An instance of this class is created automatically and configured from the "form"
 config object of the View. You will get access to the instance of this class by calling
 View.getForm(), example: v.getForm().submit(); for the example above.

 */
ludo.form.Manager = new Class({
	Extends:ludo.Core,
	view:null,
	formComponents:[],
	map:{},
	fileUploadComponents:[],
	progressBar:undefined,
	invalidIds:[],
	dirtyIds:[],
	form:{
		method:'post'
	},

	record:undefined,
    /**
     Name of server side resource(example a class) which handles form data.
     Example: "User" when you have a form representing the details of a
     user.
     @config {String} resource
     @default undefined
     @example
        new ludo.View({
            form:{
                "resource": "User",
                "autoLoad" : true,
                "arguments" : 100
            },
            children:[
                {
                    type:"form.Text", name:"firstname"
                },
                {
                    type:"form.Text", name:"lastname"
                }
            ]
        });
     */
    resource:undefined,
    method:undefined,
    url:undefined,
	currentId:undefined,
    /**
     * Autoload data from server on creation
     * @config {Boolean} autoLoad
     * @default false
     */
    autoLoad:false,
    /**
     Event listeners for the events fired by the form.
     user.
     @config {Object} listeners
     @default undefined
     @example
        new ludo.View({
            form:{
                "resource": "User",
                listeners:{
                    "saved": function(){
                        new ludo.Notification({ html : 'Your changes has been saved' });
                    },
                    "read": function(){
                        // Record has been successfully read from the server.
                    }
                }
            },
            children:[
                {
                    type:"form.Text", name:"firstname"
                },
                {
                    type:"form.Text", name:"lastname"
                }
            ]
        });
     */
    listeners:undefined,

    cacheStorage:{},
    /**
     Enable caching of read records
     @config {Boolean} cache
     @default false
     @example
        new ludo.View({
            form:{
                cache:true,
                cacheTimeout : 5
            }
        )
     */
    cache:false,
    /**
     Time in minutes before a cached record is considered expired
     @config {Number} cacheTimeout
     @default undefined
     */
    cacheTimeout : undefined,

    /**
     * Update cached record when form value is modified
     * @config {Boolean} updateCacheOnChange
     * @default true
     */
    updateCacheOnChange :true,

    /**
     Read arguments sent when autoLoad is set to true
     @config {String|Number} arguments
     @default undefined
     @example
        form:{
	 		url:'controller.php',
	 		resource:'Person',
	 		arguments:100,
	 		autoLoad:true
	 	}
     will send request 'Person/100/read' to controller.php.
     */
    arguments:undefined,

	ludoConfig:function (config) {
		this.view = config.view;
		config.form = config.form || {};

        this.setConfigParams(config.form, ['resource','method', 'url','autoLoad','cache']);

		this.id = String.uniqueID();

		if (config.form.listeners !== undefined) {
			this.addEvents(config.form.listeners);
		}
		this.getFormElements();

		if(this.autoLoad){
			this.read(config.form.arguments);
		}
	},

	/**
	 * Get all form elements, store them in an array and add valid and invalid events to them
	 * @method getFormElements
	 * @private
	 */
	getFormElements:function () {
		if (!this.view.isRendered) {
			this.getFormElements.delay(100, this);
			return;
		}

		var children = this.view.getAllChildren();
		children.push(this.view);

		var c;
		for (var i = 0, len = children.length; i < len; i++) {
			c = children[i];
			if (c['getProgressBarId'] !== undefined) {
				this.registerProgressBar(c);
			}
			else if (c.isFormElement()) {
				this.registerFormElement(c);
			}
		}

		this.fireEvent((this.invalidIds.length == 0) ? 'valid' : 'invalid');
		this.fireEvent((this.dirtyIds.length == 0) ? 'clean' : 'dirty');
	},

	registerFormElement:function (c) {
		if (this.formComponents.indexOf(c) >= 0) {
			return;
		}

		this.map[c.name] = c;

		if(this.record && this.record[c.name]){
			c.setValue(this.record[c.name]);
		}

        if(this.cache && this.updateCacheOnChange){
            c.addEvent('valueChange', this.updateCache.bind(this));
        }

		if (c.isFileUploadComponent) {
			this.fileUploadComponents.push(c);
		}
		this.formComponents.push(c);

		c.addEvents({
			'valid':this.onValid.bind(this),
			'invalid':this.onInvalid.bind(this),
			'dirty':this.onDirty.bind(this),
			'clean':this.onClean.bind(this),
			'change':this.onChange.bind(this)
		});

		if (!c.isValid()) {
			this.invalidIds.push(c.getId());
		}

		if (c.isDirty()) {
			this.dirtyIds.push(c.getId());
		}
	},

    /**
     * Set value of a form element
     * @method set
     * @param {String} key
     * @param {String|Number|Object} value
     */
	set:function(key, value){
		if(this.map[key]){
			this.map[key].setValue(value);
		}
	},

    /**
     * Return value of form element.
     * @method get
     * @param {String} key
     * @return {String|Number|Object}
     */
	get:function(key){
		return this.map[key] ? this.map[key].getValue() : undefined;
	},

	registerProgressBar:function (view) {
		if (!this.progressBar) {
			this.progressBar = view;
		}
	},

	onDirty:function (value, formComponent) {
		var elId = formComponent.getId();
		if (this.dirtyIds.indexOf(elId) == -1) {
			this.dirtyIds.push(elId);
		}
		/**
		 * @event dirty
		 * @description Fired when value of one or more form views are different from their original start value
		 * @param {Object} formComponent
		 */
		this.fireEvent('dirty', formComponent);
	},

	onClean:function (value, formComponent) {
		this.dirtyIds.erase(formComponent.getId());

		if (this.dirtyIds.length === 0) {
			/**
			 * @event clean
			 * @description Fired when value of all views are equal to their original start value
			 */
			this.fireEvent('clean');
		}
	},

	onChange:function (value, formComponent) {
		/**
		 * Event fired when a form element has been changed
		 * @event change
		 * @param {ludo.form.Manager} form
		 * @param {ludo.form.Element} form element
		 *
		 */
		this.fireEvent('change', [this, formComponent])
	},
	/**
	 * One form element is valid. Fire valid event if all form elements are valid
	 * @method onValid
	 * @private
	 * @param {String} value
	 * @param {object } formComponent
	 */
	onValid:function (value, formComponent) {
		this.invalidIds.erase(formComponent.getId());
		if (this.invalidIds.length == 0) {
			/**
			 * @event valid
			 * @param {Object} form.Manager
			 * @description form.SubmitButton listens to this event which is fired
			 * when all form elements inside a view are valid. The submit button will
			 * be enabled automatically when this event is fired.
			 */
			this.fireEvent('valid', this);
		}
	},
	/**
	 * Set view invalid when a form element inside it is invalid
	 *
	 * @method onInvalid
	 * @private
	 * @param {String} value
	 * @param {Object} formComponent
	 */
	onInvalid:function (value, formComponent) {
		var elId = formComponent.getId();
		if (this.invalidIds.indexOf(elId) == -1) {
			this.invalidIds.push(elId);
		}
		/**
		 * @event invalid
		 * @param {Object} form.Manager
		 * @description form.SubmitButton listens to this event which is fired
		 * when one or more form elements inside a view is invalid. The submit
		 * button will be disabled automatically when this event is fired.
		 */
		this.fireEvent('invalid', this);
	},
	/**
	 * Validate form and fire "invalid" or "valid" event
	 * @method validate
	 * @return void
	 */
	validate:function () {
		if (this.invalidIds.length > 0) {
			this.fireEvent('invalid', this);
		} else {
			this.fireEvent('valid', this);
		}
	},
	/**
	 * @method isValid
	 * @private
	 * @description Returns true when form is valid.
	 */
	isValid:function () {
		return this.invalidIds.length === 0;
	},
	// TODO implement a method returning values as plain array(values only)
	/**
	 * @method getValues
	 * @description Return array of values of all form elements inside this view. The format is [{name:value},{name:value}]
	 */
	getValues:function () {
		var ret = {};
		for (var i = 0; i < this.formComponents.length; i++) {
			var el = this.formComponents[i];
			ret[el.getName()] = el.getValue();
		}

		return ret;
	},

	/**
	 * Submit form to server. The ludo.View.submit() method calls this
	 * @method submit
	 * @private
	 */
	submit:function () {
		/**
		 * Event fired before form is submitted
		 * @event startSubmit
		 */

		var el;
		if (el = this.getUnfinishedFileUploadComponent()) {
			el.upload();
			return;
		}

		this.fireEvent('beforesubmit');
		this.save();
	},
    /**
     * Send delete request to the server
     * @method deleteRecord
     */
	deleteRecord:function () {
		/**
		 * Event fired before delete request is sent to server
		 * @event delete
		 */
		this.fireEvent('beforeDelete');
		var path = this.getDeletePath();
		var r = new ludo.remote.JSON({
			resource:path.resource,
			listeners:{
				success:function (req) {
					/**
					 * Event fired after successful delete request
					 * @event deleted
					 * @param {Object} response from server
					 * @param {Object} View
					 */
					this.fireEvent('deleted', [req.getResponse(), this.view]);
					this.completeRequest();
				}.bind(this),
				"failure":function (req) {
					/**
					 * Event fired after form submission when success parameter in response is false.
					 * To add listeners, use <br>
					 * ludo.View.getForm().addEvent('failure', fn);<br>
					 * @event deleteFailed
					 * @param {Object} JSON response from server
					 * @param {Object} Component
					 */

					this.fireEvent('deleteFailed', [req.getResponse(), this.view]);
					this.completeRequest();
				}.bind(this)
			}
		});
		r.send(path.service, path.argument);
	},

	getDeletePath:function () {
		if (this.currentId) {
			return {
				resource:this.resource,
				service:'delete',
				argument:this.currentId
			}
		}
		return undefined;
	},

	getUnfinishedFileUploadComponent:function () {
		for (var i = 0; i < this.fileUploadComponents.length; i++) {
			if (this.fileUploadComponents[i].hasFileToUpload()) {
				this.fileUploadComponents[i].addEvent('submit', this.submit.bind(this));
				return this.fileUploadComponents[i];
			}
		}
		return undefined;
	},

	save:function () {
		if (this.getUrl() || ludo.config.getUrl()) {
			this.fireEvent('invalid');
			this.fireEvent('beforeSave');
			this.requestHandler().send('save', this.currentId, this.getValues(),
				{
					"progressBarId":this.getProgressBarId()
				}
			);
		}
	},

	/**
	 * Read form values from the server
	 * @method read
	 * @param {String|undefined} id
	 */
	read:function(id){
        if(this.isInCache(id)){
            this.currentId = id;
            this.fill(this.getCached(id));
        }else{
			this.fireEvent('beforeRead');
            this.currentIdToBeSet = id;
		    this.readHandler().sendToServer('read', id);

        }
	},

    getCached:function(id){
        return this.cacheStorage[id] ? this.cacheStorage[id].data : undefined;
    },

    updateCache:function(value, view){
        if(this.cacheStorage[this.currentId]){
            this.cacheStorage[this.currentId].data[view.getName()] = value;
        }
    },

    storeCache:function(id, data){
        this.cacheStorage[id] = {
            data : Object.clone(data),
            time : new Date().getTime()
        }
    },

    isInCache:function(id){
        if(this.cache && this.cacheStorage[id]){
            if(!this.cacheTimeout || this.cacheStorage[id].time + (this.cacheTimeout * 1000 * 60) < new Date().getTime()){
                return true;
            }
        }
        return false;
    },

	_readHandler:undefined,

	readHandler:function(){
		if(this._readHandler === undefined){
			this._readHandler = this.getDependency('readHandler', new ludo.remote.JSON({
				url:this.url,
				resource:this.resource ? this.resource : 'Form',
				method:this.method ? this.method : 'post',
				service : 'read',
				listeners:{
					"success":function (request) {
						this.currentId = this.currentIdToBeSet;
						this.record = request.getResponseData();
                        if(this.cache){
                            this.storeCache(this.currentId, this.record);
                        }
						this.fill(this.record);
						/**
						 * Event fired after data for the form has been read successfully
						 * To add listeners, use <br>
						 * ludo.View.getForm().addEvent('success', fn);
						 * @event read
						 * @param {Object} JSON response from server
						 */
						this.fireEvent('read', [request.getResponse(), this.view]);
						if (this.isValid()) {
							this.fireEvent('valid');
						}
						this.fireEvent('clean');

						this.completeRequest();

					}.bind(this),
					"failure":function (request) {
						this.fireEvent('failure', [request.getResponse(), this.view]);
						this.completeRequest();
					}.bind(this),
					"error":function (request) {
						this.fireEvent('servererror', [request.getResponseMessage(), request.getResponseCode()]);
						this.fireEvent('valid', this);
						this.completeRequest();
					}.bind(this)
				}
			}));
		}
		return this._readHandler;
	},

	fill:function(data){
		for(var key in this.map){
			if(this.map.hasOwnProperty(key)){
				if(data[key] !== undefined){
					this.map[key].setValue(data[key]);
                    this.map[key].commit();
				}else{
					this.map[key].reset();
				}
			}
		}
	},

	_request:undefined,
	requestHandler:function () {
		if (this._request === undefined) {
			if (!this.resource)ludo.util.warn("Warning: form does not have a resource property. Falling back to default: 'Form'");
			this._request = this.createDependency('_request', new ludo.remote.JSON({
				url:this.url,
				resource:this.resource ? this.resource : 'Form',
				method:this.method ? this.method : 'post',
				listeners:{
					"success":function (request) {
						this.commitFormElements();
						/**
						 * Event fired after a form has been saved successfully.
						 * To add listeners, use <br>
						 * ludo.View.getForm().addEvent('success', fn);
						 * @event saved
						 * @param {Object} JSON response from server
						 */
						this.fireEvent('saved', [request.getResponse(), this.view]);

						this.setCurrentId(request.getResponseData());

						this.fireEvent('success', [request.getResponse(), this.view]);
						if (this.isValid()) {
							this.fireEvent('valid');
						}
						this.fireEvent('clean');

						this.completeRequest();

					}.bind(this),
					"failure":function (request) {
						if (this.isValid()) {
							this.fireEvent('valid');
						}

						/**
						 * Event fired after form submission when success parameter in response is false.
						 * To add listeners, use <br>
						 * ludo.View.getForm().addEvent('failure', fn);<br>
						 * @event failure
						 * @param {Object} JSON response from server
						 * @param {Object} Component
						 */

						this.fireEvent('failure', [request.getResponse(), this.view]);

						this.completeRequest();
					}.bind(this),
					"error":function (request) {
						/**
						 * Server error event. Fired when the server didn't handle the request
						 * @event servererror
						 * @param {String} error text
						 * @param {String} error message
						 */
						this.fireEvent('servererror', [request.getResponseMessage(), request.getResponseCode()]);
						this.fireEvent('valid', this);

						this.completeRequest();
					}.bind(this)
				}
			}));
		}
		return this._request;
	},

	completeRequest:function(){
		/**
		 * Event fired after a server request has been completed, with or without failures
		 * @event requestComplete
		 */
		this.fireEvent('requestComplete');
	},

	setCurrentId:function(data){

		if(!isNaN(data)){
			this.currentId = data;
		}
		if(ludo.util.isObject(data)){
			this.currentId = data.id;
		}
	},

	getProgressBarId:function () {
		return this.progressBar ? this.progressBar.getProgressBarId() : undefined;
	},

	commitFormElements:function () {
		for (var i = 0; i < this.formComponents.length; i++) {
			this.formComponents[i].commit();
		}
	},

	reset:function () {
		for (var i = 0; i < this.formComponents.length; i++) {
			this.formComponents[i].reset();
		}
		this.dirtyIds = [];
		this.fireEvent('clean');
		this.fireEvent('reset');
	},

	newRecord:function(){
		/**
		 * Event fired when newRecord is called, i.e. when the form is cleared and currentId unset.
		 * @event new
		 */
		this.fireEvent('new');
		this.currentId = undefined;
		this.clear();
	},

	clear:function () {
		for (var i = 0; i < this.formComponents.length; i++) {
			this.formComponents[i].clear();
		}

		this.dirtyIds = [];
		this.fireEvent('clean');
		this.fireEvent('clear');
	},

	/**
	 * @method isDirty
	 * @private
	 * @description Returns true if one or more form elements of view have value different from it' original
	 */
	isDirty:function () {
		return this.dirtyIds.length > 0;
	}
});