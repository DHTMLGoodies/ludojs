/**
 * @namespace layout
 * @class Renderer
 */

/**
 * @todo Support top and left resize of center aligned dialogs
 */
ludo.layout.Renderer = new Class({

	rendering:{},
	view:undefined,
	options:['width', 'height',
		'rightOf', 'leftOf', 'below', 'above',
		'alignLeft', 'alignRight', 'alignTop', 'alignBottom',
		'sameHeightAs', 'sameWidthAs',
		'offsetWidth','offsetHeight',
		'centerIn',
		'left','top',
		'offsetX', 'offsetY'],
	fn:undefined,
	viewport:{
		x:0, y:0, width:0, height:0
	},
	coordinates:{
		left:undefined,
		right:undefined,
		above:undefined,
		below:undefined,
		width:undefined,
		height:undefined
	},
	lastCoordinates:{},

	initialize:function (config) {
		this.view = config.view;
		this.rendering = this.view.layout || {};
		this.fixReferences();
		this.setDefaultProperties();
		this.view.addEvent('show', this.resize.bind(this));
		this.resize();
		this.addResizeEvent();
	},

	fixReferences:function () {
		var el;
		var hasReferences = false;
		if(this.rendering.x){
			this.rendering.left = this.rendering.x;
			this.rendering.x = undefined;
		}
		if(this.rendering.y){
			this.rendering.top = this.rendering.y;
			this.rendering.y = undefined;
		}
		for (var i = 0; i < this.options.length; i++) {
			var key = this.options[i];
			switch (key) {
				case 'offsetX':
				case 'offsetY':
				case 'width':
				case 'height':
				case 'left':
				case 'top':
					break;
				default:
					el = undefined;
					if (this.view.layout[key] !== undefined) {
						hasReferences = true;
						var val = this.view.layout[key];

						if (typeof val === 'string') {
							var view;
							if(val === 'parent'){
								view = this.view.getParent();
							}else{
								view = ludo.get(val);
							}
							if (view) {
								el = view.getEl();
								view.addEvent('resize', this.clearFn.bind(this));
							} else {
								el = document.id(val);
							}
						} else {
							if (val.getEl !== undefined) {
								el = val.getEl();
								val.addEvent('resize', this.clearFn.bind(this));
							} else {
								el = document.id(val);
							}
						}
						if (el)this.view.layout[key] = el; else this.view.layout[key] = undefined;
					}
			}
		}
		if (hasReferences)this.view.getEl().style.position = 'absolute';
	},

	setDefaultProperties:function () {
		this.rendering.width = this.rendering.width || 'matchParent';
		this.rendering.height = this.rendering.height || 'matchParent';
	},

	addResizeEvent:function () {
		var node = this.view.getEl().parentNode;
		if (!node || !node.tagName)return;
		if (node.tagName.toLowerCase() !== 'body') {
			node = document.id(node);
		} else {
			node = window;
		}
		node.addEvent('resize', this.resize.bind(this));
	},

	buildResizeFn:function () {
		var parent = this.view.getEl().parentNode;
		if (!parent)this.fn = function () {
		};
		var fns = [];
		for (var i = 0; i < this.options.length; i++) {
			if (this.rendering[this.options[i]] !== undefined) {
				fns.push(this.getFnFor(this.options[i], this.rendering[this.options[i]]));
			}
		}
		this.fn = function () {
			for (i = 0; i < fns.length; i++) {
				fns[i].call(this, this.view, this);
			}
		}
	},

	getFnFor:function (option, value) {
		var c = this.coordinates;

		switch (option) {
			case 'height':
				if (value === 'matchParent') {
					return function (view, renderer) {
						c.height = renderer.viewport.height;
					}
				}
				if (value === 'wrap') {
					var s = ludo.dom.getWrappedSizeOfView(this.view);
					return function () {
						c.height = s.y;
					}
				}
				if (value.indexOf !== undefined && value.indexOf('%') > 0) {
					value = parseInt(value);
					return function (view, renderer) {
						c.height = (renderer.viewport.height * value / 100)
					}
				}
				return function () {
					c.height = this.rendering[option];
				}.bind(this);
			case 'width':
				if (value === 'matchParent') {
					return function (view, renderer) {
						c.width = renderer.viewport.width;
					}
				}
				if (value === 'wrap') {
					var size = ludo.dom.getWrappedSizeOfView(this.view);
					return function () {
						c.width = size.x;
					}
				}
				if (value.indexOf !== undefined && value.indexOf('%') > 0) {
					value = parseInt(value);
					return function (view, renderer) {
						c.width = (renderer.viewport.width * value / 100)
					}
				}
				return function () {
					c.width = this.rendering[option];
				};
			case 'rightOf':
				return function () {
					c.left = value.getPosition().x + value.offsetWidth;
				};
			case 'leftOf':
				return function () {
					c.right = value.getPosition().x + value.offsetWidth;
				};
			case 'above':
				return function () {
					c.top = value.getPosition().y - c.height;
				};
			case 'below':
				return function () {
					c.top = value.getPosition().y + value.offsetHeight;
				};
			case 'alignLeft':
				return function () {
					c.left = value.getPosition().x;
				};
			case 'alignTop':
				return function () {
					c.top = value.getPosition().y;
				};
			case 'alignRight':
				return function () {
					c.left = value.getPosition().x + value.offsetWidth - c.width;
				};
			case 'alignBottom':
				return function () {
					c.top = value.getPosition().y + value.offsetHeight - c.height;
				};
			case 'offsetX' :
				return function () {
					c.left = c.left ? c.left + value : value;
				};
			case 'offsetY':
				return function () {
					c.top = c.top ? c.top + value : value;
				};
			case 'sameHeightAs':
				return function () {
					c.height = value.offsetHeight;
				};
			case 'offsetWidth' :
				return function () {
					c.width = c.width + value;
				};
			case 'offsetHeight':
				return function () {
					c.height = c.height + value;
				};
			case 'centerIn':
				return function () {
					var pos = value.getPosition();
					c.top = (pos.y + value.offsetHeight) / 2 - (c.height / 2);
					c.left = (pos.x + value.offsetWidth) / 2 - (c.width / 2);
				};
			case 'centerHorizontalIn':
				return function () {
					c.left = (value.getPosition().x + value.offsetWidth) / 2 - (c.width / 2);
				};
			case 'centerVerticalIn':
				return function () {
					c.top = (value.getPosition().y + value.offsetHeight) / 2 - (c.height / 2);
				};
			case 'sameWidthAs':
				return function () {
					c.width = value.offsetWidth;
				};
			case 'x':
			case 'left':
				return function () {
					c.left = this.rendering[option];
				};
			case 'y':
			case 'top':
				return function () {
					c.top = this.rendering[option];
				};
			default:
				return function () {
				};
		}
	},

	posKeys:['left', 'right', 'top', 'bottom'],

	clearFn:function () {
		this.fn = undefined;
	},

	resize:function () {
		if (this.view.isHidden())return;
		if (this.fn === undefined)this.buildResizeFn();
		this.setViewport();

		this.fn.call(this);

		var c = this.coordinates;
		this.view.resize(c);

		for (var i = 0; i < this.posKeys.length; i++) {
			var k = this.posKeys[i];
			if (this.coordinates[k] !== undefined && this.coordinates[k] !== this.lastCoordinates[k])this.view.getEl().style[k] = c[k] + 'px';
		}
		this.lastCoordinates = Object.clone(c);
	},

	setViewport:function () {
		var el = this.view.getEl().parentNode;
		if (!el)return;
		this.viewport.width = el.offsetWidth - ludo.dom.getPW(el) - ludo.dom.getBW(el);
		this.viewport.height = el.offsetHeight - ludo.dom.getPH(el) - ludo.dom.getBH(el);
	},

	getMinWidth:function () {
		return this.rendering.minWidth || 5;
	},

	getMinHeight:function () {
		return this.rendering.minHeight || 5;
	},

	getMaxHeight:function () {
		return this.rendering.maxHeight || 5000;
	},

	getMaxWidth:function () {
		return this.rendering.maxWidth || 5000;
	},

	setPosition:function (x, y) {
		if (x !== undefined && x >= 0) {
			this.coordinates.x = this.view.layout.left = x;
		}
		if (y !== undefined && y >= 0) {
			this.coordinates.y = this.view.layout.top = y;
		}
		this.resize();
	},

	setSize:function (config) {
		if (config.left)this.coordinates.x = this.rendering.left = config.left;
		if (config.top)this.coordinates.y = this.rendering.top = config.top;
		if (config.width)this.view.layout.width = this.coordinates.width = config.width;
		if (config.height)this.view.layout.height = this.coordinates.height = config.height;
		this.resize();
	},

	getPosition:function () {
		return {
			x:this.coordinates.left,
			y:this.coordinates.top
		};
	}
});