ludo.layout.Tab = new Class({
	Extends:ludo.layout.Relative,
	visibleChild:undefined,
	tabStrip:undefined,

	onCreate:function () {
		this.parent();
        this.view.getEl().addClass('ludo-layout-tab');
		this.addChild(this.getTabStrip());

		this.updateViewport(this.tabStrip.getChangedViewport());
	},

	addChild:function (child, insertAt, pos) {
		if (!this.isTabStrip(child) && (!child.layout || !child.layout.visible))child.hidden = true;
		return this.parent(child, insertAt, pos);
	},

	onNewChild:function (child) {

		if (!this.isTabStrip(child)) {
			if(!child.isHidden()){
				this.setVisibleChild(child);
			}
			var l = child.layout;
			l.alignParentLeft = true;
			l.alignParentTop = true;
			l.fillRight = true;
			l.fillDown = true;
		}
		this.parent(child);
	},

	setTemporarySize:function(){

	},

	addChildEvents:function(child){
		if(!this.isTabStrip(child)){
			child.addEvent('show', this.showTab.bind(this));
			child.addEvent('dispose', this.onChildDispose.bind(this));
		}
	},

	getTabPosition:function () {
		return this.view.layout.tabs || 'top';
	},
	getTabStrip:function () {
		if (this.tabStrip === undefined) {
			this.tabStrip = new ludo.layout.TabStrip({
				lm : this,
				parentComponent:this.view,
				tabPos:this.getTabPosition(),
				renderTo:this.view.getBody(),
				layout:this.getTabStripLayout()
			});
		}
		return this.tabStrip;
	},

	setVisibleChild:function(child){
		if(this.visibleChild)this.visibleChild.hide();
		this.visibleChild = child;
		this.fireEvent('showChild', child);
	},

	showTab:function(child){
		if(child !== this.visibleChild){
			this.setVisibleChild(child);
			this.resize();
		}

	},

	resize:function(){
		if(this.visibleChild === undefined){
			if(this.view.children.length>1)this.view.children[1].show();
		}else{
			if (this.children === undefined || !this.visibleChild.layoutResizeFn) {
				this.prepareResize();
			}
			this.tabStrip.layoutResizeFn.call(this.visibleChild, this);
            if(!this.visibleChild.layoutResizeFn){
                this.prepareResize();
            }
			this.visibleChild.layoutResizeFn.call(this.visibleChild, this);
		}
	},

	getTabStripLayout:function () {
		switch (this.getTabPosition()) {
			case 'top':
				return {
					absTop:true,
					absLeft:true,
					absWidth:true
				};
			case 'left':
				return {
					absTop:true,
					absLeft:true,
					absHeight:true
				};
			case 'right':
				return {
					absTop:true,
					absRight:true,
					absHeight:true
				};
			case 'bottom':
				return {
					absBottom:true,
					absLeft:true,
					absWidth:true
				};
		}
        return undefined;
	},

	isTabStrip:function (view) {
		return view.type === 'layout.TabStrip';
	},

	onChildDispose:function(child){
		if(this.visibleChild && this.visibleChild.id === child.id){
			var i = this.view.children.indexOf(this.visibleChild);
			if(i>1){
				this.view.children[i-1].show();
			}else{
				if(this.view.children.length>2){
					this.view.children[i+1].show();
				}
			}
		}

		this.fireEvent('removeChild', child);
	}
});