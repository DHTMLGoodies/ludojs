ludo.layout.CollapseBar = new Class({
	Extends: ludo.View,
	orientation : undefined,
	position : undefined,
	views:[],
	viewportCoordinates:{},
	buttons:{},
	currentPos:0,

	ludoConfig:function(config){
		this.parent(config);
		this.position = config.position || 'left';
		this.setLayout();
	},

	ludoDOM:function(){
		this.parent();
		ludo.dom.addClass(this.getEl(), 'ludo-collapse-bar');
		ludo.dom.addClass(this.getEl(), 'ludo-collapse-bar-' + this.orientation);
		ludo.dom.addClass(this.getEl(), 'ludo-collapse-bar-' + this.position);
	},

	setLayout:function(){
		// this.position = layout.collapseBar || 'left';
		this.orientation = (this.position === 'left' || this.position === 'right') ? 'vertical' : 'horizontal';
		this.layout = {};
		switch(this.position){
			case 'left':
				this.layout.absLeft = true;
				this.layout.alignParentTop = true;
				this.layout.fillDown = true;
				this.layout.width = 25;
				break;
			case 'right':
				this.layout.absRight = true;
				this.layout.alignParentTop = true;
				this.layout.fillDown = true;
				this.layout.width = 25;
				break;
			case 'top':
				this.layout.absTop = true;
				this.layout.absLeft = true;
				this.layout.absWidth = true;
				this.layout.height = 25;
				break;
			case 'bottom':
				this.layout.absBottom = true;
				this.layout.absLeft = true;
				this.layout.absWidth = true;
				this.layout.height = 25;
				break;
		}
	},

	getChangedViewport:function(){
		var value = 0;
		if(!this.isHidden()){
			switch(this.position){
				case 'left':
				case 'right':
					value = this.layout.width;
					break;
				case 'top':
				case 'bottom':
					value = this.layout.height;
					break;

			}
		}
		return {
			key:this.position,value:value
		}
	},

	addView:function(view){
		this.views.push(view);
		this.addButton(view);
	},

	addButton:function(view){
		var button = this.buttons[view.id] = new Element('div');
		button.id = 'button-' + view.id;
		button.addEvent('mouseenter', this.enterButton.bind(this));
		button.addEvent('mouseleave', this.leaveButton.bind(this));
		button.addEvent('click', this.toggleView.bind(this));
		this.getBody().adopt(button);
		button.innerHTML = '<div class="collapse-bar-button-bg-first"></div><div class="collapse-bar-button-bg-last"></div>';
		button.className = 'collapse-bar-button collapse-bar-button-' + this.position;

		var svgNode = new ludo.layout.TextBox({
			renderTo:button,
			text:view.title,
			rotation:this.getRotation(),
			className:'ludo-view-collapsed-title'
		});

		var size = svgNode.getSize();
		button.style.width = size.x + 'px';
		button.style.height = size.y + 'px';

		if(this.position === 'top' || this.position === 'bottom'){
			button.style.left = this.currentPos + 'px';
			this.currentPos += size.x + ludo.dom.getMBPW(button);
		}else{
			button.style.top = this.currentPos + 'px';
			this.currentPos += size.y  + ludo.dom.getMBPH(button);
		}

		if(!view.isHidden()){
			this.activateButton(view);
		}

		view.addEvent('show', this.activateButton.bind(this));
		view.addEvent('hide', this.deactivateButton.bind(this));
	},

	getRotation:function(){
		switch(this.position){
			case 'left' : return 270;
			case 'right' : return 90;
			default:return 0;
		}
	},

	toggleView:function(e){
		var button = this.getButtonByDom(e.target);
		var id = button.id.replace('button-', '');
		var view = ludo.get(id);
		if(view.isHidden())view.show();else view.hide();
	},

	enterButton:function(e){
		this.getButtonByDom(e.target).addClass('collapse-bar-button-over');
	},

	leaveButton:function(e){
		this.getButtonByDom(e.target).removeClass('collapse-bar-button-over');
	},

	activateButton:function(view){
		if(view.getParent().isHidden())view.getParent().show();
		this.buttons[view.id].addClass('collapse-bar-button-active');

	},

	toggleParent:function(view){
		if(this.allHidden(view)){
			view.getParent().hide();
		}
	},

	allHidden:function(view){
		var parent = view.getParent();
		for(var i=0;i<parent.children.length;i++){
			if(parent.children[i].isHidden() || !parent.children[i].title){

			}else{
				return false;
			}
		}
		return true;
	},

	deactivateButton:function(view){
		this.buttons[view.id].removeClass('collapse-bar-button-active');
		this.toggleParent.delay(50, this, view);

	},

	getButtonByDom:function(el){
		while(el.tagName.toLowerCase() === 'svg' || el.tagName.toLowerCase() === 'text' || !ludo.dom.hasClass(el, 'collapse-bar-button')){
			el = el.parentNode;
		}
		return el;
	},
	getViews:function(){
		return this.views;
	}
});