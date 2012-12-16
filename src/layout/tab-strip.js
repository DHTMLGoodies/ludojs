ludo.layout.TabStrip = new Class({
	Extends:ludo.View,
	type:'layout.TabStrip',
	tabPos:'left',
	lm:undefined,
	tabs:{},
	currentPos:-1,
	activeTab:undefined,
	currentZIndex:3,

	ludoConfig:function (config) {
		this.parent(config);
		if (config.tabPos !== undefined)this.tabPos = config.tabPos;
		this.lm = config.lm;
	},
	ludoEvents:function () {
		this.parent();
		this.lm.addEvent('addChild', this.registerChild.bind(this));
		this.lm.addEvent('showChild', this.activateTabFor.bind(this));
		this.lm.addEvent('removeChild', this.removeTabFor.bind(this));
	},

	registerChild:function (child) {
		if (!this.lm.isTabStrip(child)) {
			this.createTabFor(child);
		}
	},

	resizeTabs:function(){
		this.currentPos = -1;
		for(var key in this.tabs){
			var node = this.tabs[key];
			node.style[this.getPosAttribute()] = this.currentPos + 'px';
			this.increaseCurrentPos(node);
		}
	},

	createTabFor:function (child) {
		var node;
		if (this.tabPos === 'top' || this.tabPos == 'bottom') {
			node = this.getPlainTabFor(child);
		} else {
			node = this.getSVGTabFor(child);
		}

		node.addEvent('click', child.show.bind(child, false));
		this.getBody().adopt(node);
		if(child.layout.closable){
			this.addCloseButton(node, child);
		}
		node.style[this.getPosAttribute()] = this.currentPos + 'px';
		node.className = 'ludo-tab-strip-tab ludo-tab-strip-tab-' + this.tabPos;
		this.tabs[child.getId()] = node;
		this.increaseCurrentPos(node);
		if (!child.isHidden())this.activateTabFor(child);
	},

	addCloseButton:function(node, child){
		var el = new Element('div');
		el.className = 'ludo-tab-close ludo-tab-close-' + this.tabPos;
		el.addEvent('mouseenter', this.enterCloseButton.bind(this));
		el.addEvent('mouseleave', this.leaveCloseButton.bind(this));
		el.id = 'tab-close-' + child.id;
		el.addEvent('click', this.removeChild.bind(this));
		node.appendChild(el);
		var p;
		switch(this.tabPos){
			case 'top':
			case 'bottom':
				p = node.getStyle('padding-right');
				node.style.paddingRight = (parseInt(p) + el.offsetWidth) + 'px';
				break;
			case 'right':
				p = node.getStyle('padding-right');
				node.style.paddingBottom = (parseInt(p) + el.offsetHeight) + 'px';
				break;
			case 'left':
				p = node.getStyle('padding-right');
				node.style.paddingTop = (parseInt(p) + el.offsetHeight) + 'px';
				break;
		}
	},

	removeChild:function(e){
		var id = e.target.id.replace('tab-close-', '');
		ludo.get(id).dispose();
		return false;
	},

	removeTabFor:function(child){
		this.tabs[child.getId()].dispose();
		delete this.tabs[child.getId()];
		this.resizeTabs();
	},

	enterCloseButton:function(e){
		e.target.addClass('ludo-tab-close-' + this.tabPos + '-over');
	},

	leaveCloseButton:function(e){
		e.target.removeClass('ludo-tab-close-' + this.tabPos + '-over');
	},

	getPosAttribute:function () {
		if (this.posAttribute === undefined) {
			switch (this.tabPos) {
				case 'top':
				case 'bottom':
					this.posAttribute = 'left';
					break;
				case 'left':
				case 'right':
					this.posAttribute = 'top';
					break;
			}
		}
		return this.posAttribute;
	},

	increaseCurrentPos:function (node) {
		if (this.tabPos === 'top' || this.tabPos === 'bottom') {
			this.currentPos += node.offsetWidth + ludo.dom.getMW(node);
		} else {
			this.currentPos += node.offsetHeight + ludo.dom.getMH(node);
		}
		this.currentPos--;
	},

	getPlainTabFor:function (child) {

		var el = new Element('div');
		el.className = 'ludo-tab-strip-tab ludo-tab-strip-tab-' + this.tabPos;
		this.getBody().adopt(el);
		el.innerHTML = '<div class="ludo-tab-strip-tab-bg-first"></div><div class="ludo-tab-strip-tab-bg-last"></div>';
		var span = document.createElement('span');
		span.innerHTML = this.getTitleFor(child);
		el.appendChild(span);
		return el;
	},

	getSVGTabFor:function (child) {
		var el = new Element('div');
		this.getBody().adopt(el);
		el.innerHTML = '<div class="ludo-tab-strip-tab-bg-first"></div><div class="ludo-tab-strip-tab-bg-last">';
		var svgEl = document.createElement('div');
		el.adopt(svgEl);
		var box = new ludo.layout.TextBox({
			renderTo:svgEl,
			width:100,height:100,
			className:'ludo-tab-strip-tab-txt-svg',
			text:this.getTitleFor(child),
			rotation:this.getRotation()
		});
		var size = box.getSize();
		svgEl.style.width = size.x + 'px';
		svgEl.style.height = size.y + 'px';

		return el;
	},

	getRotation:function(){
		if(this.rotation=== undefined){
			switch(this.tabPos){
				case 'left' : this.rotation = 270; break;
				case 'right' : this.rotation = 90; break;
				case 'bottom' : this.rotation = 180; break;
				default : this.rotation = 0; break;
			}
		}
		return this.rotation;
	},

	getTitleFor:function(child){
		return (child.layout.title || child.getTitle());
	},

	activateTabFor:function (child) {
		if (this.activeTab !== undefined) {
			ludo.dom.removeClass(this.activeTab, 'ludo-tab-strip-tab-active');
		}
		if (this.tabs[child.id] !== undefined) {
			ludo.dom.addClass(this.tabs[child.id], 'ludo-tab-strip-tab-active');
			this.activeTab = this.tabs[child.id];
			this.activeTab.style.zIndex = this.currentZIndex;
			this.currentZIndex++;
		}
	},

	ludoDOM:function () {
		this.parent();
		ludo.dom.addClass(this.getEl(), 'ludo-tab-strip');
		ludo.dom.addClass(this.getEl(), 'ludo-tab-strip-' + this.tabPos);

		var el = document.createElement('div');
		ludo.dom.addClass(el, 'ludo-tab-strip-line');
		this.getBody().adopt(el);
	},

	getTabFor:function (child) {
		return this.tabs[child.id]
	},

	getChangedViewport:function () {
		var value;
		if (this.tabPos === 'top' || this.tabPos === 'bottom') {
			value = this.getEl().offsetHeight + ludo.dom.getMH(this.getEl());
		} else {
			value = this.getEl().offsetWidth + ludo.dom.getMW(this.getEl());
		}
		return {
			key:this.tabPos, value:value
		};
	},
	getCount:function () {
		return Object.keys(this.tabs).length;
	}
});