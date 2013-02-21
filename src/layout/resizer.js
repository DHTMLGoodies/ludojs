ludo.layout.Resizer = new Class({
	Extends:ludo.Core,
	layout:{},
	orientation:undefined,
	view:undefined,
	dd:undefined,
	pos:undefined,
	isActive:false,
	hidden:false,

	ludoConfig:function (config) {
		this.parent(config);
		this.orientation = config.orientation;
		this.view = config.view;
		this.layout = config.layout;
		this.pos = config.pos;
        if(config.hidden !== undefined)this.hidden = config.hidden;
		this.createDOM(config.renderTo);
		this.addViewEvents();
		this.createDragable();
        if(this.hidden)this.hide();
	},

	createDOM:function(renderTo){
		this.el = new Element('div');
		this.el.addEvent('mouseenter', this.enterResizer.bind(this));
		this.el.addEvent('mouseleave', this.leaveResizer.bind(this));
		ludo.dom.addClass(this.el, 'ludo-resize-handle');
		ludo.dom.addClass(this.el, 'ludo-resize-handle-' + ((this.orientation === 'horizontal') ? 'col' : 'row'));
		ludo.dom.addClass(this.el, 'ludo-layout-resize-' + ((this.orientation === 'horizontal') ? 'col' : 'row'));
		this.el.style.cursor = this.orientation === 'horizontal' ? 'w-resize' : 's-resize';
		this.el.style.zIndex = 100000;

		renderTo.appendChild(this.el);

	},

	enterResizer:function(){
		if(!this.isActive){
			this.el.style.zIndex = parseInt(this.el.style.zIndex) + 1;
			ludo.dom.addClass(this.el, 'ludo-resize-handle-active');
		}
	},

	leaveResizer:function(){
		if(!this.isActive){
			this.el.style.zIndex = parseInt(this.el.style.zIndex) - 1;
			ludo.dom.removeClass(this.el, 'ludo-resize-handle-active');
		}
	},
	createDragable:function(){
		this.dd = new ludo.effect.Drag({
			directions : this.orientation == 'horizontal' ? 'X' : 'Y'
		});
		this.dd.addEvent('before', this.beforeDrag.bind(this));
		this.dd.addEvent('end', this.endDrag.bind(this));
		this.dd.add(this.el);
	},

	beforeDrag:function(){
		this.dd.setMinX(30);
		this.isActive = true;
		ludo.dom.removeClass(this.el, 'ludo-resize-handle-active');
		ludo.dom.addClass(this.el, 'ludo-resize-handle-active');
		this.fireEvent('before', [this, this.view]);
	},

	setMinWidth:function(x){
		if(this.pos === 'left'){
			var el = this.view.getEl();
			this.dd.setMaxX(el.offsetLeft + el.offsetWidth - x);
		}else{
			this.dd.setMinX(this.view.getEl().offsetLeft + x);
		}
	},

	setMaxWidth:function(x){
		var el = this.view.getEl();
		if(this.pos === 'right'){
			this.dd.setMaxX(el.offsetLeft + x);
		}else{
			var pos = 0;
			if(this.layout.affectedSibling){
				pos = this.layout.affectedSibling.getEl().offsetLeft + 10;
			}
			this.dd.setMinX(Math.max(pos, el.offsetLeft + el.offsetWidth - x));
		}
	},

	setMinHeight:function(y){
		if(this.pos === 'above'){
			var el = this.view.getEl();
			this.dd.setMaxY(el.offsetTop + el.offsetHeight - y);
		}else{
			this.dd.setMinY(this.view.getEl().offsetTop + y);
		}

	},

	setMaxHeight:function(y){
		var el = this.view.getEl();
		if(this.pos === 'below'){
			this.dd.setMaxY(el.offsetTop + y);
		}else{
			var pos = 10;
			if(this.layout.affectedSibling){
				pos = this.layout.affectedSibling.getEl().offsetTop + 10;
			}
			this.dd.setMinY(Math.max(pos, el.offsetTop + el.offsetHeight - y));
		}
	},

	endDrag:function(dragged, dd){
		ludo.dom.removeClass(this.el, 'ludo-resize-handle-over');
		ludo.dom.removeClass(this.el, 'ludo-resize-handle-active');
		var change = this.orientation === 'horizontal' ? dd.getDraggedX() : dd.getDraggedY();
		if(this.pos === 'left' || this.pos === 'above'){
			change *= -1;
		}
		this.fireEvent('resize', change);
		this.isActive = false;
	},

	getEl:function(){
		return this.el;
	},

	addViewEvents:function () {
		this.view.addEvent('maximize', this.show.bind(this));
		this.view.addEvent('expand', this.show.bind(this));
		this.view.addEvent('minimize', this.hide.bind(this));
		this.view.addEvent('collapse', this.hide.bind(this));
		this.view.addEvent('hide', this.hide.bind(this));
		this.view.addEvent('show', this.show.bind(this));
	},

	show:function(){
		this.el.style.display = '';
		this.hidden = false;
	},

	hide:function(){
		this.hidden = true;
		this.el.style.display = 'none';
	},

	getWidth:function(){
		return this.hidden ? 0 : 5;
	},

	getHeight:function(){
		return this.hidden ? 0 : 5;
	},

	resize:function(config){
		this.el.style.left = '';
		this.el.style.top = '';
		this.el.style.right = '';
		this.el.style.bottom = '';

		if(config.width !== undefined && config.width > 0)this.el.style.width = config.width + 'px';
		if(config.height !== undefined && config.height > 0)this.el.style.height = config.height + 'px';
		if(config.left !== undefined)this.el.style.left = config.left + 'px';
		if(config.top !== undefined)this.el.style.top = config.top + 'px';
		if(config.bottom !== undefined)this.el.style.bottom = config.bottom + 'px';
		if(config.right !== undefined)this.el.style.right = config.right + 'px';
	},

	getParent:function(){

	},
	setParentComponent:function(){

	},
	isVisible:function(){
		return !this.hidden;
	},
	isHidden:function(){
		return this.hidden;
	}
});