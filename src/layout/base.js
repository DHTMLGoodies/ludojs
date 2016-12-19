/**
 * Base class for ludoJS layouts
 * @namespace ludo.layout
 * @class ludo.layout.Base
 * @property {object} viewport
 * @property {Number} viewport.width - Inner width of View's body
 * @property {Number} viewport.height - Inner height of View's body
 * @fires ludo.layout.Base#rendered Fired after all children has been rendered and resized. Arguments: 1) the layout, 2) Parent view
 * @fires ludo.layout.Base#addChild Fired after adding new child to parent view. Arguments: 1) Layout, 2) parent view, 3) child
 * @fires ludo.layout.Base#addChildRuntime Fired after adding new child to parent during runtime, i.e. after first rendering with
 * code <code>view.addChild()</code>. Arguments: 1) Layout, 2) parent view, 3) child
 */
ludo.layout.Base = new Class({
    Extends: Events,
    view: null,
    tabStrip: null,
    resizables: [],
    benchmarkTime: false,
    dependency: {},
    viewport: undefined,
    resized: false,

    hasWrapWidth: undefined,
    hasWrapHeight: undefined,

    initialize: function (view) {
        this.id = String.uniqueID();
        this.view = view;
        this.viewport = {
            top: parseInt(this.view.getBody().css('padding-top')),
            left: parseInt(this.view.getBody().css('padding-left')),
            width: 0, height: 0,
            bottom: 0, right: 0
        };



        if (view.getBody())this.onCreate();

        this.hasWrapWidth = !view.layout.weight && view.layout.width == 'wrap';
        this.hasWrapHeight = !view.layout.weight &&  view.layout.height == 'wrap';


    },

    onCreate: function () {


        if (this.view.layout.collapseBar) {
            this.addCollapseBars();
        }
        if (this.view.layout.listeners != undefined) {
            this.addEvents(this.view.layout.listeners);
        }

        this.fireEvent('create', [this, this.view]);
    },
    /**f
     * Method executed when adding new child view to a layout
     * @function addChild
     * @param {ludo.View} child
     * @param {ludo.View} insertAt
     * @optional
     * @param {String} pos
     * @optional
     * @memberof ludo.layout.Base.prototype
     */
    addChild: function (child, insertAt, pos) {



        child = this.getValidChild(child);
        child = this.getNewComponent(child);
        var parentEl = this.getParentForNewChild(child);
        parentEl = $(parentEl);
        if (insertAt) {
            var children = [];
            for (var i = 0; i < this.view.children.length; i++) {
                if (pos == 'after') {
                    children.push(this.view.children[i]);
                    parentEl.append(this.view.children[i].getEl());
                }
                if (this.view.children[i].getId() == insertAt.getId()) {
                    children.push(child);
                    parentEl.append(child.getEl());
                }
                if (pos == 'before') {
                    children.push(this.view.children[i]);
                    parentEl.append(this.view.children[i].getEl());
                }
            }
            this.view.children = children;
        } else {
            this.view.children.push(child);
            var el = child.getEl();
            parentEl.append(el);
        }

        this.onNewChild(child);


        this.addChildEvents(child);

        this.fireEvent('addChild', [this, this.view, child]);

        if (this.firstResized) {
            this.fireEvent('addChildRuntime', [this, this.view, child])
        }
        return child;
    },
    /**
     * Return parent DOM element for new child
     * @function getParentForNewChild
     * @protected
     * @memberof ludo.layout.Base.prototype
     */
    getParentForNewChild: function () {
        return $(this.view.els.body);
    },

    layoutProperties: ['collapsible', 'collapsed'],

    getValidChild: function (child) {
        return child;
    },

    /**
     * Implementation in sub classes
     * @function onNewChild
     * @private
     * @memberof ludo.layout.Base.prototype
     */
    onNewChild: function (child) {
        var keys = this.layoutProperties;
        for (var i = 0; i < keys.length; i++) {
            if (child.layout[keys[i]] === undefined && child[keys[i]] !== undefined) {
                child.layout[keys[i]] = child[keys[i]];
            }
        }
        if (child.layout.collapseTo !== undefined) {
            var view = ludo.get(child.layout.collapseTo);
            if (view) {
                var bar = view.getLayout().getCollapseBar(child.layout.collapsible);
                if (bar)bar.addView(child);
            }
        }
    },

    addChildEvents: function () {

    },
    firstResized: false,


    resizeChildren: function () {

        if (this.benchmarkTime) {
            var start = new Date().getTime();
        }
        if (this.view.isHidden()) {
            return;
        }
        if (this.idLastDynamic === undefined) {
            this.setIdOfLastChildWithDynamicWeight();
        }

        this.storeViewPortSize();

        if (!this.firstResized) {
            this.beforeFirstResize();

        }

        this.resize();


        if (!this.firstResized) {

            this.firstResized = true;

            if (this.hasWrapHeight) {
                this.view.layout.height = this.viewport.height = this.getWrappedHeight();
            }
            if (this.hasWrapWidth) {
                this.view.layout.width = this.viewport.width = this.getWrappedWidth();
            }

            if (this.hasWrapHeight || this.hasWrapWidth) {
                this.view.resize({
                    height: this.view.layout.height,
                    width: this.view.layout.width
                });
                this.storeViewPortSize();
                this.hasWrapWidth = false;
                this.hasWrapHeight = false;
            }

            this.fireEvent('rendered', [this, this.view]);
            this.afterRendered();
        }


        if (this.benchmarkTime) {
            ludo.util.log("Time for resize(" + this.view.layout.type + "): " + (new Date().getTime() - start));
        }


    },

    afterRendered: function () {

    },

    hasBeenRendered: function () {
        return this.firstResized;
    },

    beforeFirstResize: function () {

    },

    getWrappedHeight: function () {
        return this.view.getEl().outerHeight(true) - this.view.getBody().height();
    },

    getWrappedWidth: function () {
        return 0;
    },


    storeViewPortSize: function () {
        this.viewport.absWidth = this.getAvailWidth();
        this.viewport.absHeight = this.getAvailHeight();
        this.viewport.width = this.getAvailWidth();
        this.viewport.height = this.getAvailHeight();
        //this.viewport.width = this.getAvailWidth() - this.viewport.left - this.viewport.right;
        //this.viewport.height = this.getAvailHeight() - this.viewport.top - this.viewport.bottom;

    },

    previousContentWidth: undefined,

    idLastDynamic: undefined,

    setIdOfLastChildWithDynamicWeight: function () {
        for (var i = this.view.children.length - 1; i >= 0; i--) {
            if (this.hasLayoutWeight(this.view.children[i])) {
                this.idLastDynamic = this.view.children[i].id;
                return;
            }
        }
        this.idLastDynamic = 'NA';
    },

    hasLayoutWeight: function (child) {
        return child.layout !== undefined && child.layout.weight !== undefined;
    },

    getNewComponent: function (config) {
        config.renderTo = this.view.getBody();
        config.type = config.type || this.view.cType;
        config.parentComponent = this.view;
        return ludo.factory.create(config);
    },

    isLastSibling: function (child) {
        var children = this.view.initialItemsObject;
        if (children.length) {
            return children[children.length - 1].id == child.id;
        } else {
            return this.view.children[this.view.children.length - 1].id == child.id;
        }
    },

    prepareView: function () {

    },

    resize: function () {
        var config = {};
        config.width = this.view.getBody().width();
        if (config.width < 0) {
            config.width = undefined;
        }
        for (var i = 0; i < this.view.children.length; i++) {
            this.view.children[i].resize(config);
        }
    },

    getAvailWidth: function () {
        return this.view.getBody().width();
    },

    getAvailHeight: function () {
        return this.view.getBody().height();
    },

    addCollapseBars: function () {
        var pos = this.view.layout.collapseBar;
        if (!ludo.util.isArray(pos))pos = [pos];
        for (var i = 0; i < pos.length; i++) {
            this.addChild(this.getCollapseBar(pos[i]));
        }
    },

    collapseBars: {},
    getCollapseBar: function (position) {
        position = position || 'left';
        if (this.collapseBars[position] === undefined) {
            var bar = this.collapseBars[position] = new ludo.layout.CollapseBar({
                position: position,
                parentComponent: this.view,
                parentLayout: this.view.layout,
                listeners: {
                    'show': this.toggleCollapseBar.bind(this),
                    'hide': this.toggleCollapseBar.bind(this)
                }
            });
            this.updateViewport(bar.getChangedViewport());
        }
        return this.collapseBars[position];
    },

    toggleCollapseBar: function (bar) {
        this.updateViewport(bar.getChangedViewport());
        this.resize();
    },
    /**
     * Update viewport properties, coordinates of DHTML Container for child views, i.e. body of parent view
     * @function updateViewport
     * @param {Object} c
     * @memberof ludo.layout.Base.prototype
     */
    updateViewport: function (c) {

        this.viewport[c.key] = c.value;
    },

    createRenderer: function () {
        if (this.renderer === undefined) {
            this.renderer = this.dependency['renderer'] = new ludo.layout.Renderer({
                view: this.view
            });
        }
        return this.renderer;
    },

    getRenderer: function () {
        return this.renderer ? this.renderer : this.createRenderer();
    },

    /**
     * Executed when a child is hidden. It set's the internal layout properties width and height to 0(zero)
     * @function hideChild
     * @param {ludo.View} child
     * @private
     * @memberof ludo.layout.Base.prototype
     */
    hideChild: function (child) {
        this.setTemporarySize(child, {
            width: 0, height: 0
        });
    },


    /**
     * Executed when a child is minimized. It set's temporary width or properties
     * @function minimize
     * @param {ludo.View} child
     * @param {Object} newSize
     * @protected
     * @memberof ludo.layout.Base.prototype
     */
    minimize: function (child, newSize) {
        this.setTemporarySize(child, newSize);
        this.resize();
    },

    /**
     * Store temporary size when a child is minimized or hidden
     * @function setTemporarySize
     * @param {ludo.View} child
     * @param {Object} newSize
     * @protected
     * @memberof ludo.layout.Base.prototype
     */
    setTemporarySize: function (child, newSize) {
        if (newSize.width !== undefined) {
            child.layout.cached_width = child.layout.width;
            child.layout.width = newSize.width;
        } else {
            child.layout.cached_height = child.layout.height;
            child.layout.height = newSize.height;
        }
    },
    /**
     * Clear temporary width or height values. This method is executed when a child
     * is shown or maximized
     * @function clearTemporaryValues
     * @param {ludo.View} child
     * @protected
     * @memberof ludo.layout.Base.prototype
     */
    clearTemporaryValues: function (child) {
        if (child.layout.cached_width !== undefined)child.layout.width = child.layout.cached_width;
        if (child.layout.cached_height !== undefined)child.layout.height = child.layout.cached_height;
        child.layout.cached_width = undefined;
        child.layout.cached_height = undefined;
        this.resize();
    },

    getWidthOf: function (child) {
        return child.layout.width;
    },

    getHeightOf: function (child) {
        if(child.layout.height == 'wrap'){
            child.layout.height = child.getEl().outerHeight(true);
        }
        return isNaN(child.layout.height) ? child.getEl().outerHeight(true) : child.layout.height;
    }
});