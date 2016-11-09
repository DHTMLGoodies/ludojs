/**
 Form management class. An instance of this class is automatically created for a view if the config.form property is set or after
 after a call to view.getForm() is made.<br>
 new ludo.View({
 	form:{ ... }
 </code>
 You'll get access to the methods of this class from view.getForm().
 @namespace ludo.form
 @class ludo.form.Manager
 @param {Object} config
 @param {Object} config.listeners The form fires events when something is changed with one of the child form views(recursive).
It is convenient to place event handlers here instead of adding them to the individual form views.
 Example: create a form.change event to listen to all changes to child form views.
 @fires ludo.form.Manager#change Event fired when the value of one of the child form view is changed(recursive).
 @fires ludo.form.Manager#valid Event fired when all child form views have a valid value.
 @fires ludo.form.Manager#invalid Event fired when one or more child form views have invalid value.
 @fires ludo.form.Manager#clean A form is considered clean when none of it's values has changed from it's original. Otherwise it's considered dirty. The clean event
 is fired when the form is clean.
 @fires ludo.form.Manager#dirty Fired when the form is dirty.
 @example
var view = new ludo.View({
	children:[
		{ type:'form.Text', label:'First name', name:'firstname' },
		{ type:'form.Text', label:'Last name', name:'lastname' }
	]
});

view.getForm().val("firstname", "John"); // update all form views with name "firstname" with the value "John"
view.getForm().val("lastname", "Doe"); // update all form veiws with name "lastname" with the value "Doe"

// Return form values as JSON { "firstname": "John", "lastname": "Doe" }
var json = view.getForm().values();

 */
ludo.form.Manager = new Class({
	Extends:ludo.Core,
	/**
	 * @attribute {ludo.View} view Reference to the forms view
	 * @memberof ludo.form.Manager.prototype
	 */
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

        this.setConfigParams(config.form, ['method', 'url','autoLoad']);

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
	 * @function getFormElements
	 * @memberof ludo.form.Manager.prototype
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
			else if (c.isFormElement() && c.submittable) {
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
			c.val(this.record[c.name]);
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
	 * Populate form fields with data from JSON object
	 * @function populate
	 * @memberof ludo.form.Manager.prototype
	 * @param {Object} json JSON object
	 * @example
	 * var view = new ludo.View({
	 * 	renderTo:document.body,
	 * 	layout:{ type:'linear', orientation:'vertical', width:'matchParent', height:'matchParent' },
	 * 	children:[
	 * 		{ type:'form.Text', name:'firstname' },
	 * 		{ type:'form.Text', name:'lastname' }
	 * 	]
	 * });
	 * // Update form views firstname and lastname with values from JSON
	 * view.getForm.populate({
	 * 	"firstname" : "Jane", "lastname": "Anderson"
	 * });
	 *
     */
	populate:function(json) {
		$.each(json, this.set.bind(this));
	},


    /**
     * Set value of a form element
     * @function set
	 * @memberOf ludo.form.Manager.prototype
     * @param {String} name name of form element
     * @param {String|Number|Object} value
     */
	set:function(name, value){
		if(this.map[name]){
			this.map[name].val(value);
		}
	},

	/**
	 * Set OR get value of form component.
	 * Called with two arguments(key and value), a value will be set. Called with one argument(key), value will be returned.
	 * @function val
	 * @memberOf ludo.form.Manager.prototype
	 * @param key
	 * @param value
	 * @example
	 * view.getForm().val('firstname', 'Hannah');
	 * var firstneame = view.getForm().val('firstname');
     */
	val:function(key, value){
		if(arguments.length == 2){
			this.set(key, value);
		}

		return this.get(key);
	},

	/**
	 * Returns values of all form elements in JSON format.
	 * This method can be called on all views. It will return a JSON containing key-value pairs for all the views form elements(nested, i.e. children, grand children etc)
	 * @function values
	 * @memberOf ludo.form.Manager.prototype
	 * @returns {{}}
     */
	values:function(){
		var ret = {};
		for (var i = 0; i < this.formComponents.length; i++) {
			var el = this.formComponents[i];
			ret[el.getName()] = el.val();
		}

		return ret;
	},

    /**
     * Return value of form element.
     * @function get
	 * @memberOf ludo.form.Manager.prototype
     * @param {String} name Name of form element
     * @return {String|Number|Object}
     */
	get:function(name){
		return this.map[name] ? this.map[name].val() : undefined;
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
	 * @function onValid
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
	 * @function onInvalid
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
	 * @function validate
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
	 * Returns true when all child form views are valid
	 * @function isValid
	 * @memberOf ludo.form.Manager.prototype
	 */
	isValid:function () {
		return this.invalidIds.length === 0;
	},

	/**
	 * Submit form to server
	 * @function submit
	 * @private
	 */
	submit:function () {
		this.save();
	},

	getUnfinishedFileUploadComponent:function () {
		for (var i = 0; i < this.fileUploadComponents.length; i++) {
			if (this.fileUploadComponents[i].hasFileToUpload()) {
				this.fileUploadComponents[i].addEvent('submit', this.save.bind(this));
				return this.fileUploadComponents[i];
			}
		}
		return undefined;
	},

	save:function () {
		if (this.getUrl() || ludo.config.getUrl()) {
			var el;
			if (el = this.getUnfinishedFileUploadComponent()) {
				el.upload();
				return;
			}

			this.fireEvent('invalid');
			this.fireEvent('beforeSave');
			this.beforeRequest();
			this.requestHandler().send('save', this.currentId, this.values(),
				{
					"progressBarId":this.getProgressBarId()
				}
			);
		}
	},

	/**
	 * Read form values from the server
	 * @function read
	 * @param {String|undefined} id
	 */
	read:function(id){
		this.fireEvent('beforeRead');
		this.beforeRequest();
		this.currentIdToBeSet = id;
		this.readHandler().sendToServer('read', id);
	},

	_readHandler:undefined,

	readHandler:function(){
		if(this._readHandler === undefined){
			this._readHandler = this.getDependency('readHandler', new ludo.remote.JSON({
				url:this.url,
				method:this.method ? this.method : 'post',
				service : 'read',
				listeners:{
					"success":function (request) {
						this.currentId = this.currentIdToBeSet;
						this.populate(this.record);
						this.commit();

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

						this.afterRequest();

					}.bind(this),
					"failure":function (request) {
						this.fireEvent('failure', [request.getResponse(), this.view]);
						this.afterRequest();
					}.bind(this),
					"error":function (request) {
						this.fireEvent('servererror', [request.getResponseMessage(), request.getResponseCode()]);
						this.fireEvent('valid', this);
						this.afterRequest();
					}.bind(this)
				}
			}));
		}
		return this._readHandler;
	},

	_request:undefined,
	requestHandler:function () {
		if (this._request === undefined) {
			if (!this.resource)ludo.util.warn("Warning: form does not have a resource property. Falling back to default: 'Form'");
			this._request = this.createDependency('_request', new ludo.remote.JSON({
				url:this.url,
				method:this.method ? this.method : 'post',
				listeners:{
					"success":function (request) {
						this.commit();
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

						this.afterRequest();

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

						this.afterRequest();
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

						this.afterRequest();
					}.bind(this)
				}
			}));
		}
		return this._request;
	},

	afterRequest:function(){
		/**
		 * Event fired after read, save and delete requests has been completed with or without failures
		 * @event requestComplete
		 */
		this.fireEvent('afterRequest');
	},

	beforeRequest:function(){
		/**
		 * Event fired before read, save and delete request
		 * @event requestComplete
		 */
		this.fireEvent('beforeRequest');
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

	/**
	 * Commit all form Views. This will reset the dirty flag. The dirty flag is true when on form view has been updated.
	 * A later call to {@link ludo.form.Manager#reset|reset} will reset all form Views back to the value it had when commit was called.
	 * with a new value.
	 * @function commit
	 * @memberof ludo.form.Manager.prototype
	 */
	commit:function () {
		for (var i = 0; i < this.formComponents.length; i++) {
			this.formComponents[i].commit();
		}
	},

	/**
	 * Reset value of all form Views back to it's original value. 
	 * @method reset
	 * @memberof ludo.form.Manager.prototype
	 */

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

	/**
	 * Clear value of all child form views
	 * @function clear
	 * @memberof ludo.form.Manager.prototype
	 */
	clear:function () {
		for (var i = 0; i < this.formComponents.length; i++) {
			this.formComponents[i].clear();
		}

		this.dirtyIds = [];
		this.fireEvent('clean');
		this.fireEvent('clear');
	},

	/**
	 * Returns true if a form View has been updated with a new value. This is useful for handling disabling/enabling of buttons
	 * based on changes made to the form. The dirty flag can be reset by calling the {@link ludo.form.Manager#commit} method. This will
	 * call commit on all form views.
	 * @function isDirty
	 * @memberof ludo.form.Manager.prototype
	 */
	isDirty:function () {
		return this.dirtyIds.length > 0;
	}
});