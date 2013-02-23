/**
  Context menu class. You can create one or more context menus for a component by using the
  ludo.View.contextMenu config array,
  @namespace menu
  @class Context
  @extends menu.Menu
  @constructor
  @param {Object} config
  @example
      new ludo.Window({
           contextMenu:[{
               selector : '.my-selector',
               children:[{label:'Menu Item 1'},{label:'Menu item 2'}],
               listeners:{
                   click : function(menuItem, menu){
                       // Do something
                   }
               }

           }]
      });
 */
ludo.menu.Context = new Class({
	Extends:ludo.menu.Menu,
	type:'menu.ContextMenu',
	direction:'vertical',
    renderTo:document.body,
	/**
	 Show context menu only for DOM nodes matching a CSS selector. The context menu will also
	 be shown if a match is found in one of the parent DOM elements.
	 @attribute selector
	 @type String
	 @default undefined
	 @example
	 	selector : '.selected-records'
	 */
	selector:undefined,
	component:undefined,
	layout:{
		width:'wrap'
	},

	/**
	 Show context menu only for records of a specific type. The component creating the context
	 menu has to have a getRecordByDOM method in order for this to work. These methods are already
	 implemented for tree.Tree and grid.Grid

	 @attribute recordType
	 @type String
	 @default undefined
	 @example
	 	recordType : 'city'
	 */
	recordType:undefined,

	ludoConfig:function (config) {
        this.renderTo = document.body;
		config.els = config.els || {};
		this.parent(config);
		this.selector = config.selector || this.selector;
		this.recordType = config.recordType || this.recordType;
		this.component = config.component;
	},

	ludoDOM:function () {
		this.parent();
		this.getEl().style.position = 'absolute';
	},
	ludoEvents:function () {
		this.parent();
		document.id(document.documentElement).addEvent('click', this.hideAfterDelay.bind(this));
	},

	hideAfterDelay:function () {
		if (!this.isHidden()) {
			this.hide.delay(50, this);
		}
	},

	ludoRendered:function () {
		this.parent();
		this.hide();
	},

	/**
	 * when recordType property is defined, this will return the selected record of parent component,
	 * example: record in a tree
	 * @method getSelectedRecord
	 * @return object record
	 */
	getSelectedRecord:function () {
		return this.selectedRecord;
	},

	show:function (e) {

		if (this.selector) {
			var domEl = this.getValidDomElement(e.target);

			if (!domEl) {
				return undefined;
			}
			this.fireEvent('selectorclick', domEl);
		}
		if (this.recordType) {
			var rec = this.component.getRecordByDOM(e.target);
			if (!rec || rec.type !== this.recordType) {
				return undefined;
			}
			this.selectedRecord = rec;
		}
		this.parent();
		if (!this.getParent()) {
			var el = this.getEl();
			var pos = this.getXAndYPos(e);
			el.style.left = pos.x + 'px';
			el.style.top = pos.y + 'px';
		}
		return false;
	},

	getXAndYPos:function (e) {
		var ret = {
			x:e.page.x,
			y:e.page.y
		};
		var clientWidth = document.body.clientWidth;
		var ludo = ret.x + this.getEl().getSize().x;

		if (ludo > clientWidth) {
			ret.x -= (ludo - clientWidth);
		}
		return ret;
	},

	getValidDomElement:function (el) {
		if (!this.selector) {
			return true;
		}
		var selector = this.selector.replace(/[\.#]/g, '');
		if (el.hasClass(selector) || el.id == selector) {
			return el;
		}
		var parent = el.getParent(this.selector);
		if (parent) {
			return parent;
		}
		return false;
	}
});