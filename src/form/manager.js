/**
 Form management class. An instance of this class is automatically created for a view if the config.form property is set.<br>
 new ludo.View({
 	form:{ ... }
 </code>
 You'll get access to the methods of this class using view.getForm().

 For demo, see <a href="../demo/form/form-components.php">form-components.php</a>

 @namespace ludo.form
 @class ludo.form.Manager
 @param {Object} config
 @param {Object} config.submit Submit configuration object
 @param {Object} config.submit.listeners Submit listeners
 @param {Object} config.read Read data from server configuration object
 @param {Boolean} config.read.autoload True to autoload form data when rendered.
 @param {Boolean} config.read.populate True to automatically populate form fields with JSON from server.
 @param {Object} config.read.listeners Read data from server listeners.
 @param {Object} config.listeners The form fires events when something is changed with one of the child form views(recursive).
It is convenient to place event handlers here instead of adding them to the individual form views.
 Example: create a form.change event to listen to all changes to child form views.
  @param {Array} config.hiddenFields Array with name of form fields. example: hiddenFields:["id"]. There are noe &lt;input type="hidden">
  in ludoJS. Instead, you define hiddenFields which later can be populated using view.getForm().val(key, value).
 @fires ludo.form.Manager#change Event fired when the value of one of the child form view is changed(recursive)., arguments: 1) name of changed element, 2) Value of changed element, 3) form.Manager and 4) form.Element(the element changed)
 @fires ludo.form.Manager#valid Event fired when all child form views have a valid value.
 @fires ludo.form.Manager#invalid Event fired when one or more child form views have invalid value.
 @fires ludo.form.Manager#clean A form is considered clean when none of it's values has changed from it's original. Otherwise it's considered dirty. The clean event
 is fired when the form is clean.
 @fires ludo.form.Manager#dirty Fired when the form is dirty.
 @fires ludo.form.Manager#submit.init Fired before form is submitted. The submit. listeners are added via the "submit" object. See example below.
 @fires ludo.form.Manager#submit.success Fired after successful form submission.
 @fires ludo.form.Manager#submit.fail Fired after failed form submission.
 @fires ludo.form.Manager#read.init Fired before loading form data from server. the read. listeners are added via the "read" object. See example below.
 @fires ludo.form.Manager#read.success Fired after successfully loading data from server
 @fires ludo.form.Manager#read.fail Fired when loading data from server failed.
 @example
var view = new ludo.View({
    form:{
            hiddenFields: ['id'], // Hidden fields which could be populated using ludo.get('myWindow).getForm().set('id', 100);
            submit:{
                url: '../controller.php',
                data: {
                    submit:1
                },
                listeners:{
                    'success': function(json, form){
                        new ludo.dialog.Alert({
                            title:'Thank you!',
                            resizable:true,
                            html:'Thank you. Your data has been saved..'
                        });

                        form.commit();
                    },
                    'fail': function(text, error, form){
                        // do something on failure
                    }
                }
            },

            read: {
                autoload:true,  // autoload data on create
                url: 'form-data.json', // read url
                keys:['id'], // array of form values to add to the view request
                listeners:{
                    'success': function(json, form){
                        form.clear();
                        form.populate(json);
                    },
                    'fail': function(text, error, form){
                        // do something on failure
                    }
                }
            }
    }
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
    Extends: ludo.Core,
    /**
     * @attribute {ludo.View} view Reference to the forms view
     * @memberof ludo.form.Manager.prototype
     */
    view: null,
    formComponents: [],
    map: {},
    fileUploadComponents: [],
    progressBar: undefined,
    invalidIds: [],
    dirtyIds: [],

    hiddenFields: undefined,
    hiddenValues: undefined,

    method: 'post',
    url: undefined,
    currentId: undefined,

    autoLoad: false,

    listeners: undefined,

    configs: undefined,

    __construct: function (config) {
        this.view = config.view;
        config.form = config.form || {};


        this.setConfigParams(config.form, ['method', 'url', 'hiddenFields']);
        this.hiddenValues = {};

        this.configs = {};
        this.configs.submit = config.form.submit || {};
        this.configs.read = config.form.read || {};

        this.addTypeEvents('submit');
        this.addTypeEvents('read');

        this.id = String.uniqueID();

        if (config.form.listeners !== undefined) {
            this.addEvents(config.form.listeners);
        }
        this.getFormElements();

        if (this.configs.read.autoload) {
            this.read();
        }
    },

    addTypeEvents:function(type){
        if(this.configs[type].listeners != undefined){
            $.each(this.configs[type].listeners, function(key, value){
                this.on(type + '.' + key, value);
            }.bind(this));
        }
    },

    /**
     * Get all form elements, store them in an array and add valid and invalid events to them
     * @function getFormElements
     * @memberof ludo.form.Manager.prototype
     */
    getFormElements: function () {
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

        this.fireEvent((this.invalidIds.length == 0) ? 'valid' : 'invalid', this);
        this.fireEvent((this.dirtyIds.length == 0) ? 'clean' : 'dirty', this);
    },

    registerFormElement: function (c) {
        if (this.formComponents.indexOf(c) >= 0) {
            return;
        }

        this.map[c.name] = c;

        if (this.record && this.record[c.name]) {
            c.val(this.record[c.name]);
        }

        if (c.isFileUploadComponent) {
            this.fileUploadComponents.push(c);
        }
        this.formComponents.push(c);

        c.addEvents({
            'valid': this.onValid.bind(this),
            'invalid': this.onInvalid.bind(this),
            'dirty': this.onDirty.bind(this),
            'clean': this.onClean.bind(this),
            'change': this.onChange.bind(this)
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
    populate: function (json) {
        $.each(json, this.set.bind(this));
    },


    /**
     * Set value of a form element
     * @function set
     * @memberOf ludo.form.Manager.prototype
     * @param {String} name name of form element
     * @param {String|Number|Object} value
     */
    set: function (name, value) {

        if (this.map[name]) {
            this.map[name].val(value);
        } else if (this.hiddenFields != undefined && this.hiddenFields.indexOf(name) != -1) {
            this.hiddenValues[name] = value;
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
     * var firstname = view.getForm().val('firstname');
     */
    val: function (key, value) {
        if (arguments.length == 2) {
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
    values: function () {
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
    get: function (name) {
        return this.map[name] ? this.map[name].val() : this.hiddenValues[name] != undefined ? this.hiddenValues[name] : undefined;
    },

    registerProgressBar: function (view) {
        if (!this.progressBar) {
            this.progressBar = view;
        }
    },

    onDirty: function (value, formComponent) {
        var elId = formComponent.getId();
        if (this.dirtyIds.indexOf(elId) == -1) {
            this.dirtyIds.push(elId);
        }

        this.fireEvent('dirty', this.eventArguments(formComponent));
    },

    onClean: function (value, formComponent) {
        this.dirtyIds.erase(formComponent.getId());

        if (this.dirtyIds.length === 0) {
            this.fireEvent('clean');
        }
    },

    onChange: function (value, formComponent) {
        // TODO refactor into one
        this.fireEvent('change', this.eventArguments(formComponent));
    },

    eventArguments:function(f){
        var n = f ? f.name : undefined;
        var val = f? f.val(): undefined;
        return [n, val, this, f];
    },
    /**
     * One form element is valid. Fire valid event if all form elements are valid
     * @function onValid
     * @private
     * @param {String} value
     * @param {object } formComponent
     */
    onValid: function (value, formComponent) {
        this.invalidIds.erase(formComponent.getId());
        if (this.invalidIds.length == 0) {
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
    onInvalid: function (value, formComponent) {
        var elId = formComponent.getId();
        if (this.invalidIds.indexOf(elId) == -1) {
            this.invalidIds.push(elId);
        }

        this.fireEvent('invalid', this.eventArguments(formComponent));
    },
    /**
     * Validate form and fire "invalid" or "valid" event
     * @function validate
     * @return void
     * @memberof ludo.form.Manager.prototype
     */
    validate: function () {
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
    isValid: function () {
        return this.invalidIds.length === 0;
    },

    /**
     * Submit form to server
     * @function submit
     * @memberof ludo.form.Manager.prototype
     */
    submit: function () {
        this.save();
    },

    getUnfinishedFileUploadComponent: function () {
        for (var i = 0; i < this.fileUploadComponents.length; i++) {
            if (this.fileUploadComponents[i].hasFileToUpload()) {
                this.fileUploadComponents[i].addEvent('submit', this.save.bind(this));
                return this.fileUploadComponents[i];
            }
        }
        return undefined;
    },

    getUrl: function (type) {
        if (this.configs[type] && this.configs[type].url)return this.configs[type].url;
        return this.url;
    },

    dataFor: function (type) {
        var keys = this.configs[type] && this.configs[type].keys ? this.configs[type].keys : undefined;
        var data;
        if(keys == undefined){
            data = this.values();

        }else{
            data = {};
            for(var i=0;i<keys.length;i++){
                data[keys[i]] = this.get(keys[i]);
            }
        }
        return Object.merge(data, this.configDataFor(type));
    },

    configDataFor: function (type) {
        return this.configs[type] && this.configs[type].data ? this.configs[type].data : {};
    },

    methodFor:function(type){
        return this.configs[type] && this.configs[type].method ? this.configs[type].method : this.method;
    },

    save: function () {
        var url = this.getUrl('submit');
        if (url) {
            var el;
            if (el = this.getUnfinishedFileUploadComponent()) {
                el.upload();
                return;
            }

            this.fireEvent('invalid');
            this.fireEvent('submit.init', this);
            this.beforeRequest();

            $.ajax({
                url: url,
                method: this.methodFor('submit'),
                cache: false,
                dataType: 'json',
                data: this.dataFor('submit'),
                success: function (json) {
                    this.fireEvent('submit.success', [json, this]);
                }.bind(this),
                fail: function (text, error) {
                    this.fireEvent('submit.fail', [text, error, this]);
                }.bind(this)
            });
        }
    },

    /**
     * Read form values from the server. This method triggers the events read.init and read.success|read.fail.
     * This method will be called during view creation if read.autoload is set to true.
     * @function read
     * @memberof ludo.form.Manager.prototype
     * @example
     var v = new ludo.View({
         form:{
            hiddenFields: ['id'],
            read: {
                url: 'form-data.json', // read url
                keys:['id'], // array of form values to add to the view request
                listeners:{
                    'success': function(json, form){
                        form.clear();
                        form.populate(json);
                    },
                    'fail': function(text, error, form){
                        // do something on failure
                    }
                }
            }
        }
     });
     // load data from server and trigger the listeners above.
     v.getForm().read();
     */
    read: function () {
        this.fireEvent('read.init', this);
        this.beforeRequest();
        var url = this.getUrl('read');
        if(url != undefined){
            $.ajax({
                url: url,
                method: this.methodFor('read'),
                cache: false,
                dataType: 'json',
                data: this.dataFor('read'),
                success: function (json) {
                    if(this.configs.read.populate){
                        this.clear();
                        this.populate(json);
                        this.commit();
                    }
                    this.fireEvent('read.success', [json, this]);
                }.bind(this),
                fail: function (text, error) {
                    this.fireEvent('read.fail', [text, error, this]);
                }.bind(this)
            });
        }


    },

    afterRequest: function () {
        this.fireEvent('afterRequest');
    },

    beforeRequest: function () {

        this.fireEvent('beforeRequest');
    },

    getProgressBarId: function () {
        return this.progressBar ? this.progressBar.getProgressBarId() : undefined;
    },

    /**
     * Commit all form Views. This will reset the dirty flag. The dirty flag is true when on form view has been updated.
     * A later call to {@link ludo.form.Manager#reset|reset} will reset all form Views back to the value it had when commit was called.
     * with a new value.
     * @function commit
     * @memberof ludo.form.Manager.prototype
     */
    commit: function () {
        for (var i = 0; i < this.formComponents.length; i++) {
            this.formComponents[i].commit();
        }
    },


    /**
     * Alias to reset
     * @method rollback
     * @memberof ludo.form.Manager.prototype
     */
    rollback:function(){
        this.reset();  
    },
    /**
     * Reset value of all form Views back to it's commited value.
     * @method reset
     * @memberof ludo.form.Manager.prototype
     */
    reset: function () {
        for (var i = 0; i < this.formComponents.length; i++) {
            this.formComponents[i].reset();
        }
        this.dirtyIds = [];
        this.fireEvent('clean', this);
        this.fireEvent('reset', this);
    },

    newRecord: function () {

        this.fireEvent('new');
        this.currentId = undefined;
        this.clear();
    },

    /**
     * Clear value of all child form views back to blank or default view value
     * @function clear
     * @memberof ludo.form.Manager.prototype
     */
    clear: function () {
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
    isDirty: function () {
        return this.dirtyIds.length > 0;
    }
});