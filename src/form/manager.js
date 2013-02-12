/**
 * Utility class for form Management. Instance of this class is created on demand
 * by ludo.View.getFormManager().
 * @namespace form
 * @class Manager
 * @extends Core
 */
ludo.form.Manager = new Class({
	Extends:ludo.Core,
	component:null,
	formComponents:[],
	fileUploadComponents:[],
	progressBar:undefined,
	invalidIds:[],
	dirtyIds:[],
	form:{
		method:'post'
	},
	model:undefined,

	ludoConfig:function (config) {
		this.component = config.component;
		if (config.form !== undefined) {
			this.form = config.form;
		}

		if (this.form && this.form.url) {
			this.url = this.form.url;
		}
		this.id = String.uniqueID();
		if (config.model !== undefined) {
			if (config.model.type === undefined) {
				config.model.type = 'model.Model';
			}
			this.model = ludo._new(config.model);
			if (this.model.url == undefined) {
				this.model._setUrl(this.getUrl());
			}
			this.model.addEvent('success', function (json) {
				this.fireEvent('success', json);
				this.fireEvent('clean');
			}.bind(this));
			this.model.addEvent('failure', function (json) {
				this.fireEvent('failure', json);
			}.bind(this));
			this.model.addEvent('servererror', function (text, error) {
				this.fireEvent('servererror', [text, error]);
			}.bind(this))
		}
		if (config.listeners !== undefined) {
			this.addEvents(config.listeners);
		}
		this.getFormElements();
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
				if (this.model) {
					this.model.registerProgressBar(c);
				}
			}
			else if (c.isFormElement()) {
				this.registerFormElement(c);
			} else if (c.tpl && this.model) {
				this.model.registerView(c);
			}
		}

		this.fireEvent((this.invalidIds.length == 0) ? 'valid' : 'invalid');
		this.fireEvent((this.dirtyIds.length == 0) ? 'clean' : 'dirty');
	},

	registerFormElement:function (c) {
		if (this.formComponents.indexOf(c) >= 0) {
			return;
		}

		if (c.isFileUploadComponent) {
			this.fileUploadComponents.push(c);
		}
		this.formComponents.push(c);

		c.addEvent('valid', this.onValidFormElement.bind(this));
		c.addEvent('invalid', this.onInvalidFormElement.bind(this));
		c.addEvent('dirty', this.onDirtyFormElement.bind(this));
		c.addEvent('clean', this.onCleanFormElement.bind(this));

		if (!c.isValid()) {
			this.invalidIds.push(c.getId());
		}

		if (c.isDirty()) {
			this.dirtyIds.push(c.getId());
		}

		if (this.model) {
			this.model.registerFormComponent(c);
		}

	},

	registerProgressBar:function (component) {
		if (!this.progressBar) {
			this.progressBar = component;
		}
	},

	onDirtyFormElement:function (value, formComponent) {
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

	onCleanFormElement:function (value, formComponent) {
		this.dirtyIds.erase(formComponent.getId());

		if (this.dirtyIds.length == 0) {
			/**
			 * @event clean
			 * @description Fired when value of all components are equal to their original start value
			 */
			this.fireEvent('clean');
		}
	},

	/**
	 * One form element is valid. Fire valid event if all form elements are valid
	 * @method onValidFormElement
	 * @private
	 * @param {String} value
	 * @param {object } formComponent
	 */

	onValidFormElement:function (value, formComponent) {
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
	 * @method onInvalidFormElement
	 * @private
	 * @param {String} value
	 * @param {Object} formComponent
	 */
	onInvalidFormElement:function (value, formComponent) {

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
	/**
	 * @method getValues
	 * @private
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
		this.component.fireEvent('beforesubmit');
		if (this.model) {
			this.model.save(this.getValues());
		}
		else {
			this.save();
		}
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
		var url = this.getUrl();
		if (url) {
			this.fireEvent('invalid');
            this.requestHandler().send('save', undefined, {
                "progressBarId":this.getProgressBarId(),
                "data" : this.getValues()
            });
		}
	},
    _request:undefined,
    requestHandler:function(){
        if(this._request === undefined){
            if(!this.form.name)ludo.util.warn("Warning: form does not have any name. Falling back to default name 'Form'");
            this._request = new ludo.remote.JSON({
                url:this.url,
                resource : this.form.name ? this.form.name : 'Form',
                method:this.form.method ? this.form.method : 'post',
                listeners:{
                    "success":function (request) {
                        this.commitFormElements();
                        /**
                         * Event fired after a form has been saved successfully.
                         * To add listeners, use <br>
                         * ludo.View.getFormManager().addEvent('success', fn);
                         * @event success
                         * @param {Object} JSON response from server
                         */
                        this.fireEvent('success', [request.getResponse(), this.component]);

                        this.fireEvent('clean');
                    }.bind(this),
                    "failure":function (request) {
                        /**
                         * Event fired after form submission when success parameter in response is false.
                         * To add listeners, use <br>
                         * ludo.View.getFormManager().addEvent('failure', fn);<br>
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
                        this.fireEvent('servererror', [request.getErrorText(), request.getErrorCode()]);
                        this.fireEvent('valid', this);
                    }.bind(this)
                }
            });
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
	},

	/**
	 * Returns reference to ludo.model.Model object
	 * @method getModel
	 * @private
	 */
	getModel:function () {
		return this.model;
	}
});