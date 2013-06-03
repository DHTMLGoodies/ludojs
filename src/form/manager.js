/**
 Utility class for form Management. Instance of this class is created on demand
 by ludo.View.getForm().
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
	component:null,
	formComponents:[],
	map:{},
	fileUploadComponents:[],
	progressBar:undefined,
	invalidIds:[],
	dirtyIds:[],
	form:{
		method:'post'
	},
	currentData:undefined,
	service:undefined,

	currentId:undefined,

	ludoConfig:function (config) {
		this.component = config.component;
		config.form = config.form || {};
		this.form = config.form;
		if (this.form && this.form.url)this.url = this.form.url;

		this.form.resource = this.form.resource || this.form.name || undefined;

		this.id = String.uniqueID();

		if (this.form.listeners !== undefined) {
			this.addEvents(this.form.listeners);
		}
		this.getFormElements();

		if(config.form.autoLoad){
			this.read(config.form.arguments);
		}
	},

	/**
	 * Get all form elements, store them in an array and add valid and invalid events to them
	 * @method getFormElements
	 * @private
	 */
	getFormElements:function () {
		if (!this.component.isRendered) {
			this.getFormElements.delay(100, this);
			return;
		}

		var children = this.component.getAllChildren();
		children.push(this.component);

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

		if(this.currentData && this.currentData[c.name]){
			c.setValue(this.currentData[c.name]);
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

	set:function(key, value){
		if(this.map[key]){
			this.map[key].setValue(value);
		}
	},

	get:function(key){
		return this.map[key] ? this.map[key].getValue() : undefined;
	},

	registerProgressBar:function (component) {
		if (!this.progressBar) {
			this.progressBar = component;
		}
	},

	onDirty:function (value, formComponent) {
		var elId = formComponent.getId();
		if (this.dirtyIds.indexOf(elId) == -1) {
			this.dirtyIds.push(elId);
		}
		/**
		 * @event dirty
		 * @description Fired when value of one or more form components are different from their original start value
		 * @param {Object} formComponent
		 */
		this.fireEvent('dirty', formComponent);
	},

	onClean:function (value, formComponent) {
		this.dirtyIds.erase(formComponent.getId());

		if (this.dirtyIds.length === 0) {
			/**
			 * @event clean
			 * @description Fired when value of all components are equal to their original start value
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
			 * when all form elements inside a component are valid. The submit button will
			 * be enabled automatically when this event is fired.
			 */
			this.fireEvent('valid', this);
		}
	},
	/**
	 * Set component invalid when a form element inside it is invalid
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
		 * when one or more form elements inside a component is invalid. The submit
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
	 * @description Return array of values of all form elements inside this component. The format is [{name:value},{name:value}]
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

	deleteRequest:function () {
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
					this.fireEvent('deleted', [req.getResponse(), this.component]);
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

					this.fireEvent('deleteFailed', [req.getResponse(), this.component]);
				}.bind(this)
			}
		});
		r.send(path.service, path.argument);
	},

	getDeletePath:function () {
		if (this.currentId) {
			return {
				resource:this.form.resource,
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
			this.requestHandler().send(this.form.service || 'save', this.currentId, this.getValues(),
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
		this.currentId = id;
		this.readHandler().sendToServer('read', id);
	},

	_readHandler:undefined,

	readHandler:function(){
		if(this._readHandler === undefined){
			this._readHandler = this.getDependency('readHandler', new ludo.remote.JSON({
				url:this.url,
				resource:this.form.resource ? this.form.resource : 'Form',
				method:this.form.method ? this.form.method : 'post',
				service : 'read',
				listeners:{
					"success":function (request) {
						this.currentData = request.getResponseData();
						this.fill(this.currentData);
						/**
						 * Event fired after data for the form has been read successfully
						 * To add listeners, use <br>
						 * ludo.View.getForm().addEvent('success', fn);
						 * @event read
						 * @param {Object} JSON response from server
						 */
						this.fireEvent('read', [request.getResponse(), this.component]);
						if (this.isValid()) {
							this.fireEvent('valid');
						}
						this.fireEvent('clean');
					}.bind(this),
					"failure":function (request) {
						this.fireEvent('failure', [request.getResponse(), this.component]);
					}.bind(this),
					"error":function (request) {
						this.fireEvent('servererror', [request.getResponseMessage(), request.getResponseCode()]);
						this.fireEvent('valid', this);
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
				}else{
					this.map[key].reset();
				}
			}
		}
	},

	_request:undefined,
	requestHandler:function () {
		if (this._request === undefined) {
			if (!this.form.resource)ludo.util.warn("Warning: form does not have a resource property. Falling back to default: 'Form'");
			this._request = this.createDependency('_request', new ludo.remote.JSON({
				url:this.url,
				resource:this.form.resource ? this.form.resource : 'Form',
				method:this.form.method ? this.form.method : 'post',
				listeners:{
					"success":function (request) {
						this.commitFormElements();
						/**
						 * Event fired after a form has been saved successfully.
						 * To add listeners, use <br>
						 * ludo.View.getForm().addEvent('success', fn);
						 * @event success
						 * @param {Object} JSON response from server
						 */
						this.fireEvent('success', [request.getResponse(), this.component]);
						if (this.isValid()) {
							this.fireEvent('valid');
						}
						this.fireEvent('clean');
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

						this.fireEvent('failure', [request.getResponse(), this.component]);
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
					}.bind(this)
				}
			}));
		}
		return this._request;
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
	 * @description Returns true if one or more form elements of component have value different from it' original
	 */
	isDirty:function () {
		return this.dirtyIds.length > 0;
	}
});