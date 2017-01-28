/**
 A basic ludoJS view. When rendered on a Web page, a View is made out of two &lt;div> elements, one parent and one child(called body).
 @example {@lang XML}
 <!--  A basic rendered ludoJS view -->
 <div class="ludo-view">
 <div class="ludo-body"></div>
 </div>
 @namespace ludo
 @class ludo.View
 @augments ludo.Core
 @param {Object} config
 @param {String} config.bodyCls Additional css classes to assign to the body &lt;div>, example: bodyCls: "classname1 classname2"
 @param {Array} config.children An array of config objects for the child views. Example: children:[{ html: "child 1", layout:{ height: 100 }}, { html: "Child 2", layout: { height:200 } }]. See <a href="../demo/view/children.php" onclick="var w = window.open(this.href);return false">Demo</a>
 @param {String} config.cls Additional css classes to assign to the views &lt;div>, example: cls: "classname1 classname2"
 @param {Object} config.elCss Specific css rules to apply to the View, @example: elCss:{ border: '1px solid #ddd' } for a gray border
 @param {Object} config.css Specific css rules to apply to the View's body &lt;div, @example: css:{ 'background-color': '#EEEEEE' } for a light gray background
 @param {Object} config.dataSource A config object for the data source.
 @param {Object} config.formConfig Default form properties for child form views. Example: formConfig:{labelWidth:100}. Then we don't have to specify labelWidth:100 for all the child form views.
 @param {Boolean} config.hidden When true, the View will be initially hidden. For performance reasons initially hidden Views will not be rendered until View.show() is called.
 @param {String} config.html Static HTML to show inside the View's body &lt;div>
 @param {String} config.id Id of view. When set, you can easily get access to the View by calling ludo.get("&lt;idOfView>").
 @param {Object} config.layout An object describing the layout for this view and basic layout rules for child views
 @param {String} config.name When set, you can access it by calling parentView.child["&lt;childName>"]
 @param {String} config.title Title of this view. If the view is a child in tab layout, the title will be displayed on the Tab
 @param {String} config.tpl A template for string when inserting JSON Content(the insertJSON method), example: "name:{firstname} {lastname}<br>"
 @param {Boolean} config.alwaysInFront True to make this view always appear in front of the other views.
 @param {Object} config.form Configuration for the form Manager. See <a href="ludo.form.Manager">ludo.form.Manager</a> for details.
 @param {String} config.loadMessage Message to show if a data source is used and data is being loaded from server.
 @fires ludo.View#rendered Fired when the view has been rendered and resized. Argument: ludo.View
 @fires ludo.View#toFront Fired when view has brought to front. Argument: ludo.View
 @fires ludo.View#hide Fired when view has been hidden using the hide method. Argument: ludo.View
 @fires ludo.View#show Fired when view is displayed using the show method. Argument. ludo.View
 @fires ludo.View#beforeshow Fired just before a view is displayed using the show method. Argument: ludo.View
 @fires ludo.View#resize Fired when a view has been resized.

 @example {@lang Javascript}
 // Example 1: View render to &lt;body> tag
 new ludo.View({
 		renderTo:document.body,
 		html : 'Hello'
	}

 // Example 2: Creating custom View
 myApp = {};
 myApp.View = new Class({
 		Extends: ludo.View,
 		type : 'myApp.View',
 		__rendered:function(){
 			this.html('My custom view');
		}
	}
 children:[{
		type : 'myApp.View'
	}]
 *
 */
ludo.View = new Class({
    Extends: ludo.Core,
    type: 'View',
    cType: 'View',
    cls: '',
    bodyCls: '',
    cssSignature: undefined,
    closable: true,
    minimizable: false,
    movable: false,
    resizable: false,
    alwaysInFront: false,
    statefulProperties: ['layout'],
    els: {},
    state: {},

    defaultDS: 'dataSource.JSON',
    tagBody: 'div',
    id: null,
    children: [],
    child: {},
    dataSource: undefined,
    socket: undefined,
    parentComponent: null,
    objMovable: null,
    width: undefined,
    height: undefined,
    overflow: undefined,
    _html: '',

    hidden: false,

    css: undefined,
    elCss: undefined,
    formConfig: undefined,
    isRendered: false,
    unRenderedChildren: [],
    frame: false,
    form: undefined,
    layout: undefined,
    tpl: '',

    JSONParser: {type: 'tpl.Parser'},
    initialItemsObject: [],
    contextMenu: undefined,
    lifeCycleComplete: false,
    loadMessage:undefined,

    lifeCycle: function (config) {
        this._createDOM();
        if (!config.children) {
            config.children = this.children;
            this.children = [];
        }

        this.__construct(config);

        if (!config.children || !config.children.length) {
            config.children = this.__children();
        }

        if (this.hidden) {
            this.unRenderedChildren = config.children;
        } else {
            this.remainingLifeCycle(config);
        }
    },

    /**
     * Alternative to the "children" config array. By defining children in __children, you will have access to "this" referring to
     * the View instance. This is a method you override when creating your own Views.
     * @function __children
     * @memberof ludo.View.prototype
     * @return {Array|children}
     */
    __children: function () {
        return this.children;
    },

    remainingLifeCycle: function (config) {
        if (this.lifeCycleComplete)return;
        if (!config && this.unRenderedChildren) {
            config = {children: this.unRenderedChildren};
        }

        this.lifeCycleComplete = true;
        this._styleDOM();

        if (config.children && config.children.length > 0) {
            this.getLayout().prepareForChildrenOnCreate(config.children);
            for (var i = 0; i < config.children.length; i++) {
                config.children[i].id = config.children[i].id || config.children[i].name || 'ludo-' + String.uniqueID();
            }
            this.initialItemsObject = config.children;
            this.addChildren(config.children);
        }
        this.ludoDOM();
        this.ludoCSS();
        this.ludoEvents();

        this.increaseZIndex();

        if (this.layout && this.layout.type && (this.layout.type == 'tabs' || this.layout.type == 'docking')) {

            this.getLayout().prepareView();
        }

        this.addCoreEvents();
        this.__rendered();

        if (!this.parentComponent) {
            ludo.dom.clearCache();
            ludo.dom.clearCache.delay(50, this);
            var r = this.getLayout().getRenderer();
            r.resize();

        }

        // TODO remove 'render' and replace with 'rendered'

        this.fireEvent('render', this);

    },
    /**
     * Constructor for Views.
     * @function __construct
     * @param {Object} config
     * @memberof ludo.View.prototype
     */
    __construct: function (config) {
        this.parent(config);
        config.els = config.els || {};
        if (this.parentComponent)config.renderTo = undefined;
        var keys = ['contextMenu', 'renderTo', 'tpl', 'elCss', 'socket', 'form', 'title', 'hidden',
            'dataSource', 'movable', 'resizable', 'closable', 'minimizable', 'alwaysInFront',
            'parentComponent', 'cls', 'bodyCls', 'objMovable', 'width', 'height', 'frame', 'formConfig',
            'overflow','loadMessage'];

        if (config.css != undefined) {
            if (this.css != undefined) {
                this.css = Object.merge(this.css, config.css);
            } else {
                this.css = config.css;
            }
        }
        if (config.html != undefined)this._html = config.html;
        this.setConfigParams(config, keys);

        if (this.renderTo)this.renderTo = jQuery(this.renderTo);

        this.layout = ludo.layoutFactory.getValidLayoutObject(this, config);

        this.insertDOMContainer();
    },

    insertDOMContainer: function () {
        if (this.hidden)this.els.container.css('display', 'none');
        if (this.renderTo)this.renderTo.append(this.els.container);
    },

    /**
     The second life cycle method
     This method is typically used when you want to create your own DOM elements.
     @memberof ludo.View.prototype
     @function ludoDOM
     @private
     @example
     ludoDOM : function() {<br>
			 this.parent(); // Always call parent ludoDOM
			 var myEl = jQuery('<div>');
			 myEl.html('My Content');
			 this.getEl().append(myEl);
		 }
     */
    ludoDOM: function () {
        if (this.contextMenu) {
            if (!ludo.util.isArray(this.contextMenu)) {
                this.contextMenu = [this.contextMenu];
            }
            for (var i = 0; i < this.contextMenu.length; i++) {
                this.contextMenu[i].applyTo = this;
                this.contextMenu[i].contextEl = this.isFormElement() ? this.getFormEl() : this.getEl();
                new ludo.menu.Context(this.contextMenu[i]);
            }
            this.contextMenu = undefined;
        }


    },

    ludoCSS: function () {

    },
    /**
     The third life cycle method
     This is the place where you add custom events
     @function ludoEvents
     @return void
     @private
     @example
     ludoEvents:function(){∂'
			 this.parent();
			 this.addEvent('load', this.myMethodOnLoad.bind(this));
		 }
     */
    ludoEvents: function () {
        if (this.dataSource) {
            this.getDataSource();
        }
    },

    /**
     * The final life cycle method. When this method is executed, the view (including child views)
     * are fully rendered.
     * @memberof ludo.View.prototype
     * @function __rendered
     */
    __rendered: function () {
        if (!this.layout.height && !this.layout.above && !this.layout.sameHeightAs && !this.layout.alignWith) {
            this.autoSetHeight();
        }
        if (!this.parentComponent) {
            this.getEl().addClass('ludo-view-top');
        }
        if (!this.parentComponent) {
            this.getLayout().createRenderer();
        }

        this.isRendered = true;
        if (this.form) {
            this.getForm();
        }
    },


    /**
     * Parse and insert JSON into the view
     * The JSON will be sent to the JSON parser(defined in JSONParser) and
     * This method will be called automatically when you're using a JSON data-source
     * @function JSON
     * @param {Object} json
     * @param {String} tpl - Optional String template
     * @return void
     * @memberof ludo.View.prototype
     */
    JSON: function (json, tpl) {
        tpl = tpl || this.tpl;
        if (tpl) {

            if(jQuery.isFunction(tpl)){
                this.getBody().html(tpl.call(this, json));
            }else{
                this.getBody().html(this.getTplParser().asString(json, tpl));
            }
        }
    },
    
    getTplParser: function () {
        if (!this.tplParser) {
            this.tplParser = this.createDependency('tplParser', this.JSONParser);
        }
        return this.tplParser;
    },

    autoSetHeight: function () {
        var size = this.getBody().outerHeight(true);
        this.layout.height = size + ludo.dom.getMBPH(this.getEl());
    },

    /**
     * Set HTML
     * @function html
     * @param html
     * @type string
     * @memberof ludo.View.prototype
     * @example
     var view = new ludo.View({
	 	renderTo:document.body,
	 	layout:{ width:500,height:500 }
	 });
     view.html('<h1>Heading</h1><p>Paragraph</p>');
     */

    html: function (html) {
        this.getBody().html(html);
    },

    setContent: function () {
        if (this._html) {
            if (this.children.length) {
                var el = jQuery('<div>' + this._html + '</div>');
                this.getBody().append(el);
            } else {

                this.getBody().html(this._html);
            }
        }
    },

    /**
     * Load content from the server. This method will send an Ajax request to the server
     * using the data source
     * @function load
     * @memberof ludo.View.prototype
     * @return void
     */
    load: function () {
        /*
         * This event is fired from the "load" method before a remote request is sent to the server.
         * @event beforeload
         * @param {String} url
         * @param {Object} this
         */
        this.fireEvent('beforeload', [this.getUrl(), this]);
        if (this.dataSource) {
            this.getDataSource().load();
        }
    },
    /**
     * Get reference to parent view
     * @function getParent
     * @return {Object} view | null
     * @memberof ludo.View.prototype
     */
    getParent: function () {
        return this.parentComponent ? this.parentComponent : null;
    },

    setParentComponent: function (parentComponent) {
        this.parentComponent = parentComponent;
    },

    _createDOM: function () {
        this.els.container = jQuery('<div>');
        this.els.body = jQuery('<' + this.tagBody + '>');
        this.els.container.append(this.els.body);
    },

    _styleDOM: function () {
        var b = this.els.body;
        var e = this.els.container;
        e.addClass('ludo-view');
        b.addClass('ludo-body');

        e.attr("id", this.getId());

        b.css('height', '100%');

        if (this.overflow == 'hidden') {
            b.css('overflow', 'hidden');
        }

        if (ludo.util.isTabletOrMobile()) {
            e.addClass('ludo-view-mobile');
        }

        if (this.cls) {
            e.addClass(this.cls);
        }
        if (this.bodyCls)b.addClass(this.bodyCls);
        if (this.type)e.addClass('ludo-' + (this.type.replace(/\./g, '-').toLowerCase()));
        if (this.css)b.css(this.css);
        if (this.elCss)e.css(this.elCss);

        if (this.frame) {
            e.addClass('ludo-container-frame');
            b.addClass('ludo-body-frame');
        }
        if (this.cssSignature !== undefined)e.addClass(this.cssSignature);

        this.setContent();
    },

    addCoreEvents: function () {
        if (!this.getParent() && this.type !== 'Application') {
            this.getEl().on('mousedown', this.increaseZIndex.bind(this));
        }
    },

    increaseZIndex: function (e) {
        if (e && e.target && e.target.tagName.toLowerCase() == 'a') {
            return;
        }

        this.fireEvent('activate', this);
        this.fireEvent('toFront', this);
        this.setNewZIndex();
    },

    setNewZIndex: function () {
        this.getEl().css('zIndex', ludo.util.getNewZIndex(this));
    },

    /**
     * Return reference to the Views DOM div element.
     * DOM "body" element
     * @function getEl
     * @return {HTMLElement} DOMElement
     * @memberof ludo.View.prototype
     */
    getEl: function () {
        return this.els.container ? this.els.container : null;
    },
    /**
     * Return reference to the "body" div HTML Element.
     * @memberof ludo.view.prototype
     * @function getBody
     * @return {HTMLElement} DOMElement
     */
    getBody: function () {
        return this.els.body;
    },
    /**
     * Hides the view
     * @function hide
     * @memberof ludo.view.prototype
     */
    hide: function () {
        if (!this.hidden && this.getEl().css('display') !== 'none') {
            this.getEl().css('display', 'none');
            this.hidden = true;

            this.resizeParent();
            this.fireEvent('hide', this);
        }
    },
    
    /**
     * Is this component hidden?
     * @memberof ludo.View.prototype
     * @function isHidden
     * @return {Boolean}
     */
    isHidden: function () {
        return this.hidden;
    },

    /**
     * Return true if this component is visible
     * @function isVisible
     * @return {Boolean}
     * @memberof ludo.View.prototype
     *
     */
    isVisible: function () {
        return !this.hidden;
    },

    /**
     * Make the view visible
     * @memberof ludo.View.prototype
     * @function show
     * @param {Boolean} skipEvents
     * @return void
     */
    show: function (skipEvents) {
        if (this.els.container.css('display') === 'none') {
            this.els.container.css('display', '');
            this.hidden = false;
        }

        if (!this.lifeCycleComplete) {
            this.remainingLifeCycle();
        }

        if (!skipEvents)this.fireEvent('beforeshow', this);

        this.setNewZIndex();


        if (!this.parentComponent){
            this.getLayout().getRenderer().resize();
        }


        if (!skipEvents)this.fireEvent('show', this);
    },

    resizeParent: function () {
        var parent = this.getParent();
        if (parent) {
            if (parent.children.length > 0)parent.getLayout().resizeChildren();
        }
    },

    /**
     * Call show() method of a child component
     * key must be id or name of child
     * @function showChild
     * @param {String} key
     * @return {Boolean} success
     * @memberof ludo.View.prototype
     */
    showChild: function (key) {
        var child = this.getChild(key);
        if (child) {
            child.show();
            return true;
        }
        return false;
    },

    /**
     * Return Array of direct child views.
     * @memberof ludo.View.prototype
     * @function getChildren
     * @return Array of Child components
     */
    getChildren: function () {
        return this.children;
    },
    /**
     * Return Array of child views, recursive.
     * @memberof ludo.View.prototype
     * @function getAllChildren
     * @return Array of sub components
     */
    getAllChildren: function () {
        var ret = [];
        for (var i = 0; i < this.children.length; i++) {
            ret.push(this.children[i]);
            if (this.children[i].hasChildren()) {
                ret = ret.append(this.children[i].getChildren());
            }
        }
        return ret;
    },
    /**
     * Returns true if this component contain any children
     * @memberof ludo.View.prototype
     * @function hasChildren
     * @return {Boolean}
     */
    hasChildren: function () {
        return this.children.length > 0;
    },

    /**
     * Set new title
     * @memberof ludo.View.prototype
     * @function setTitle
     * @param {String} title
     */
    setTitle: function (title) {
        this.title = title;
        this.fireEvent('setTitle', [title, this]);
    },

    /**
     * Returns total width of component including padding, borders and margins
     * @memberof ludo.View.prototype
     * @function getWidth
     * @return {Number} width
     */
    getWidth: function () {
        return this.layout.pixelWidth ? this.layout.pixelWidth : this.layout.width ? this.layout.width : this.getBody().width();
    },

    /**
     * Get current height of component
     * @memberof ludo.View.prototype
     * @function getHeight
     * @return {Number}
     */
    getHeight: function () {
        return this.layout.pixelHeight ? this.layout.pixelHeight : this.layout.height;
    },

    _fr:false,

    /**
     Resize View and it's children.
     @function resize
     @memberof ludo.View.prototype
     @param {Object} size Object with optional width and height properties. Example: { width: 200, height: 100 }
     @example
     view.resize(
        { width: 200, height:200 }
     );
     */
    resize: function (size) {

        if (this.isHidden()) {
            return;
        }

        var l = this.layout;
        size = size || {};

        if (size.width) {
            if (l.aspectRatio && l.preserveAspectRatio && size.width && !this.isMinimized()) {
                size.height = size.width / l.aspectRatio;
            }
            // TODO layout properties should not be set here.
            l.pixelWidth = size.width;
            if (!isNaN(l.width))l.width = size.width;
            var width = size.width - ludo.dom.getMBPW(this.els.container);
            if (width > 0) {
                this.els.container.css('width', width);
            }
        }

        if (size.height && !this.state.isMinimized) {
            // TODO refactor this part.
            if (!this.state.isMinimized) {
                l.pixelHeight = size.height;
                if (!isNaN(l.height))l.height = size.height;
            }
            var height = size.height - ludo.dom.getMBPH(this.els.container);
            if (height > 0) {
                this.els.container.css('height', height);
            }
        }

        if (size.left !== undefined || size.top !== undefined) {
            this.setPosition(size);
        }

        this.resizeDOM();

        if (size.height || size.width) {
            this.fireEvent('resize', size);
        }

        if(this._fr == false){
            this.fireEvent('rendered', this);
            this._fr = true;
        }

        if (this.children.length > 0)this.getLayout().resizeChildren();
    },

    isChildOf: function (view) {
        var p = this.parentComponent;
        while (p) {
            if (p.id === view.id)return true;
            p = p.parentComponent;
        }
        return false;
    },

    setPosition: function (pos) {
        if (pos.left !== undefined && pos.left >= 0) {
            this.els.container.css('left', pos.left);
        }
        if (pos.top !== undefined && pos.top >= 0) {
            this.els.container.css('top', pos.top);
        }
    },

    getLayout: function () {
        if (!this.hasDependency('layoutManager')) {
            this.createDependency('layoutManager', ludo.layoutFactory.getManager(this));
        }
        return this.getDependency('layoutManager');
    },

    resizeChildren: function () {
        if (this.children.length > 0)this.getLayout().resizeChildren();
    },

    isMinimized: function () {
        return false;
    },

    cachedInnerHeight: undefined,
    resizeDOM: function () {
        if (this.layout.pixelHeight > 0) {
            var height = this.layout.pixelHeight ? this.layout.pixelHeight - ludo.dom.getMBPH(this.els.container) : this.els.container.css('height').replace('px', '');
            height -= ludo.dom.getMBPH(this.els.body);
            if (height <= 0 || isNaN(height)) {
                return;
            }
            this.els.body.css('height', height);
            this.cachedInnerHeight = height;
        }
    },

    getInnerHeightOfBody: function () {
        return this.cachedInnerHeight ? this.cachedInnerHeight : this.els.body.height();
    },


    /**
     * Add child components
     * Only param is an array of child objects. A Child object can be a component or a JSON object describing the component.
     * @function addChildren
     * @memberof ludo.View.prototype
     * @param {Array} children
     * @return {Array} of new children
     */
    addChildren: function (children) {
        var ret = [];
        for (var i = 0, count = children.length; i < count; i++) {
            ret.push(this.addChild(children[i]));
        }
        return ret;
    },
    /**
     * Add a child View. The method will returned the created view.
     * @memberof ludo.View.prototype
     * @function addChild
     * @param {Object|View} child. A Child object can be a View or a JSON config object for a new View.
     * @param {String} insertAt
     * @optional
     * @param {String} pos
     * @optional
     * @return {View} child
     */
    addChild: function (child, insertAt, pos) {
        child = this.getLayout().addChild(child, insertAt, pos);
        if (child.name) {
            this.child[child.name] = child;
        }
        child.addEvent('remove', this.removeChild.bind(this));
        return child;
    },

    /**
     * Get child view by name or id
     * @memberof ludo.View.prototype
     * @function getChild
     * @param {String} childName id or name of child view
     *
     */
    getChild: function (childName) {
        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i].id == childName || this.children[i].name == childName) {
                return this.children[i];
            }
        }
        return undefined;
    },

    removeChild: function (child) {
        this.children.erase(child);
        child.parentComponent = null;

    },

    disposeAllChildren: function () {
        for (var i = this.children.length - 1; i >= 0; i--) {
            this.children[i].remove();
        }
    },

    /**
     * Hide and removes the view view
     * @memberof ludo.View.prototype
     * @function remove
     * @return void
     */
    remove: function () {
        this.fireEvent('remove', this);
        ludo.util.dispose(this);
    },


    dispose: function () {
        console.warn("Use of deprecated dispose");
        console.trace();
        this.fireEvent('remove', this);
        ludo.util.dispose(this);
    },
    /**
     * Returns title
     * @function getTitle
     * @memberOf ludo.View.prototype
     * @return string
     */
    getTitle: function () {
        return this.title;
    },

    dataSourceObj: undefined,

    /**
     * @funtion getDataSource
     * @memberOf ludo.View.prototype
     * Returns object of type ludo.dataSource.*
     * @returns {undefined|*}
     */
    getDataSource: function () {

        if (!this.dataSourceObj && this.dataSource) {


            var obj;
            if (ludo.util.isString(this.dataSource)) {
                obj = this.dataSourceObj = ludo.get(this.dataSource);
            } else {
                if (!this.dataSource.type) {
                    this.dataSource.type = this.defaultDS;
                }
                obj = this.dataSourceObj = this.createDependency('viewDataSource', this.dataSource);
            }

            if(this.loadMessage){
                obj.on('init', function(){
                    this.shim().show(this.loadMessage);
                }.bind(this));
                obj.on('complete', function(){
                    this.shim().hide();
                }.bind(this));
                if(obj.isWaitingData() ){
                    this.shim().show(this.loadMessage);
                }
            }

            var method = obj.getSourceType() === 'HTML' ? 'html' : 'JSON';

            if (obj.hasData()) {
                this[method](obj.getData());
            }
            obj.addEvent('load', this[method].bind(this));
        }
        return this.dataSourceObj;
    },
    _shim: undefined,
    shim: function () {
        if (this._shim === undefined) {
            this._shim = new ludo.view.Shim({
                txt: '',
                renderTo: this.getEl()
            });
        }
        return this._shim;
    },

    /**
     Returns {@link ludo.form.Manager"} for this view.
     @function getForm     *
     @return {ludo.form.Manager}
     @memberof ludo.View.prototype
     @example
     view.getForm().reset();

     to reset all form fields

     @example
     view.getForm().save();

     to submit the form

     @example
     view.getForm().read(1);

     to send a read request to the server for record with id 1.
     */
    getForm: function () {
        if (!this.hasDependency('formManager')) {
            this.createDependency('formManager',
                {
                    type: 'ludo.form.Manager',
                    view: this,
                    form: this.form
                });
        }
        return this.getDependency('formManager');
    },

    getParentForm: function () {
        var parent = this.getParent();
        return parent ? parent.hasDependency('formManager') ? parent.getDependency('formManager') : parent.getParentForm() : undefined;
    },

    isFormElement: function () {
        return false;
    },

    getHeightOfButtonBar: function () {
        return 0;
    },

    /**
     Creates(if not exists) SVG surface and returns it. The SVG element is appended to the body of
     the view.
     @function svg
     @memberof ludo.View.prototype
     @return {ludo.svg.Canvas} canvas
     @example
     var win = new ludo.Window({
		   id:'myWindow',
		   left:50, top:50,
		   width:410, height:490,
		   title:'Canvas',
		   css:{
			   'background-color':'#FFF'
		   }
	   });
     // Get reference to canvas
     var canvas = win.svg();
     // Using the svg dollar function to create SVG DOM nodes.
     var circle = canvas.$('circle', { cx:100,cy:100, r: 50, fill: "#000" });
     canvas.append(circle);
     */
    svg: function () {
        if (this.canvas === undefined) {
            this.canvas = this.createDependency('canvas', new ludo.svg.Canvas({
                renderTo: this
            }));
        }
        return this.canvas;
    },

    canvas: undefined,

    wrappedWidth: function () {
        return undefined;
    },
    wrappedHeight: function () {
        return undefined;
    }
});

ludo.factory.registerClass('View', ludo.View);