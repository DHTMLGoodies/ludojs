/**
 Context menu class. You can create one or more context menus for a component by using the
 ludo.View.contextMenu config array,
 @namespace ludo.menu
 @class ludo.menu.Context
 @augments menu.Menu
 @param {Object} config
 @param {string} config.selector Show context menu only for DOM nodes matching a CSS selector. The context menu will also
 be shown if a match is found in one of the parent DOM elements. example: selector:'.my-class'
 @param {string} config.recordType Similar to selector, but focused on JSON data.
 It asks it's parent view's getRecordByDOM(e.target) (must be implemented), which will return something like { "name": "Oslo", type:"city" }.
 If config.recordType is "city", the context menu will be shown, otherwise it will not.
 This is typically useful in tree views and grids.

 @example new ludo.Window({
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
	Extends:ludo.View,
	type:'menu.Context',

	layout:{
		type:'Menu',
		orientation:'vertical',
		width:'wrap',
		height:'wrap',
		active:true,
		isContext:true
	},

	renderTo:undefined,
	selector:undefined,
	component:undefined,

	// TODO change this code to record:{ keys that has to match }, example: record:{ type:'country' }

	record:undefined,
	recordType:undefined,
	contextEl:undefined,

	__construct:function (config) {
		this.renderTo = $(document.body);
		this.parent(config);
		this.setConfigParams(config, ['selector', 'recordType', 'record', 'applyTo','contextEl']);
		if (this.recordType)this.record = { type:this.recordType };

	},

	ludoDOM:function () {
		this.parent();
		this.getEl().css('position', 'absolute');
	},
	ludoEvents:function () {
		this.parent();
		jQuery(document.documentElement).on('click', this.hideAfterDelay.bind(this));
		if(this.contextEl){
			jQuery(this.contextEl).on('contextmenu', this.show.bind(this));
		}
	},

	hideAfterDelay:function () {
		if (!this.isHidden()) {
			this.hide.delay(50, this);
		}
	},

	__rendered:function () {
		this.parent();
		this.hide();
	},

	/**
	 * when recordType property is defined, this will return the selected record of parent applyTo,
	 * example: record in a tree
	 * @function getSelectedRecord
	 * @return object record
	 * @memberof ludo.menu.Context.prototype
	 */
	getSelectedRecord:function () {
		return this.selectedRecord;
	},

	show:function (e) {
		if (this.selector) {
			var domEl = this.getValidDomElement(e.target);

			if (!domEl.length) {
				return undefined;
			}
			this.fireEvent('selectorclick', domEl);
		}
		if (this.record) {
			var r = this.applyTo.getRecordByDOM(e.target);
			if (!r)return undefined;
			if (this.isContextMenuFor(r)) {
				this.selectedRecord = r;
			}
		}

        ludo.EffectObject.fireEvents();

		this.getLayout().hideAllMenus();
		this.parent();
		if (!this.getParent()) {
			var el = this.getEl();
			var pos = this.getXAndYPos(e);
			el.css({
				left : pos.x + 'px',
				top : pos.y + 'px'
			});

		}
		return false;
	},

	isContextMenuFor:function (record) {
		if(jQuery.type(record) == "string" && this.record.type == record)return true;
		for (var key in this.record) {
			if (this.record.hasOwnProperty(key))
				if (!record[key] || this.record[key] !== record[key])return false;
		}
		return true;
	},

	getXAndYPos:function (e) {
		var ret = {
			x:e.pageX,
			y:e.pageY
		};
		var b = jQuery(document.body);
		var clientWidth = b.width();
		var clientHeight = b.height();
		var size = {
			x: this.getEl().width(), y: this.getEl().height()
		};
		var x = ret.x + size.x;
		var y = ret.y + size.y;

		if (x > clientWidth) {
			ret.x -= (x - clientWidth);
		}
		if (y > clientHeight) {
			ret.y -= (y - clientHeight);
		}
		return ret;
	},

	addCoreEvents:function () {

	},

	getValidDomElement:function (el) {
		el = jQuery(el);
		if (!this.selector) {
			return true;
		}
		var selector = this.selector.replace(/[\.#]/g, '');
		if (el.hasClass(selector) || el.id == selector) {
			return el;
		}
		var parent = el.closest(this.selector);
		if (parent) {
			return parent;
		}
		return false;
	}
});