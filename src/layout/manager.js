ludo.layout.Manager = new Class({
    view:null,
    tabStrip:null,
    resizables:[],

    initialize:function (view) {
        this.view = view;
        this.view.addEvent('resize', this.resize.bind(this));
    },

    addChild:function (child, insertAt, pos) {
        child = this.getNewComponent(child, this.view);

        if (insertAt) {
            var children = [];
            for (var i = 0; i < this.view.children.length; i++) {
                if (pos == 'after') {
                    children.push(this.view.children[i]);
                    this.getBody().adopt(this.view.children[i].getEl());
                }
                if (this.view.children[i].getId() == insertAt.getId()) {
                    children.push(child);
                    this.getBody().adopt(child.getEl());
                }
                if (pos == 'before') {
                    children.push(this.view.children[i]);
                    this.getBody().adopt(this.view.children[i].getEl());
                }
            }
            this.view.children = children;
        } else {
            this.view.children.push(child);
            this.view.els.body.adopt(child.els.container);
        }

        this.view.fireEvent('addChild', child);
        if (this.view.type !== 'ludo.ViewToFullScreen' && child.isMovable()) {
            this.view.getObjMovable().addSource({ component:child, handle:'.ludo-rich-view-titlebar-title' });
        }

        this.onNewChild(child);
        if (child.isCollapsible()) {
            child.getElForCollapsedState().inject(child.getEl(), 'after');
            if (child.collapsed) {
                child.collapse();
            }
        }
        return child;
    },

    resizeChildren:function () {
        if (this.view.isHidden()) {
            return;
        }
        var layout = this.getLayout();
		if(this.idLastDynamic === undefined){
			this.setIdOfLastChildWithDynamicWeight();
		}
        switch (layout) {
            case 'card':
                this.resizeChildren_cards();
                break;
            case 'rows':
                this.resizeChildren_rows();
                break;
            case 'tabs':
                this.resizeChildren_tabs();
                break;
            case 'fill':
                this.resizeChildren_fill();
                break;
            case 'cols':
                this.resizeChildren_cols();
                break;

            default :
                this.resizeChildren_default();

        }
    },

    resizeChildren_default:function () {
        var config = {};

        config.width = ludo.dom.getInnerWidthOf(this.view.getBody());

        if (config.width < 0) {
            config.width = null;
        }

        for (var i = 0; i < this.view.children.length; i++) {
            this.view.children[i].resize(config);
        }

    },
    previousContentWidth : undefined,

    resizeChildren_cols:function () {
        var totalWidth = this.view.getInnerWidthOfBody();
        var height;
        if (this.hasDynamicHeight()) {
            height = 'auto';
        } else {
            height = this.view.getInnerHeightOfBody();
        }

        if(height == 0){
            return;
        }

        var totalWidthOfItems = 0;
        var totalWeight = 0;
        for (var i = 0; i < this.view.children.length; i++) {
            if (this.view.children[i].isVisible()) {
                if (!this.view.children[i].hasLayoutWeight()) {
                    var width = this.view.children[i].getWidth();
                    if (width) {
                        totalWidthOfItems += width
                    }
                } else {
                    totalWeight+= this.view.children[i].weight;
                }
            }
        }
        totalWeight = Math.max(1, totalWeight);
        var totalWidth = remainingWidth = totalWidth - totalWidthOfItems;

        var currentLeft = 0;
        for (i = 0; i < this.view.children.length; i++) {
            if (this.view.children[i].isVisible()) {
                var config = { 'height':height, 'left':currentLeft };
                if (this.view.children[i].hasLayoutWeight()) {
					if(this.view.children[i].id==this.idLastDynamic){
						config.width = remainingWidth;
					}else{
						config.width = Math.round(totalWidth * this.view.children[i].weight / totalWeight);
						remainingWidth-=config.width;
					}
                } else {
                    config.width = this.view.children[i].getWidth();
                }
                this.view.children[i].resize(config);
                currentLeft += config.width;
            }
        }

        for (i = 0; i < this.resizables.length; i++) {
            this.resizables[i].colResize();
        }
    },

    resizeChildren_tabs:function(){
        var height = this.view.getInnerHeightOfBody();
        if(height<=0)return;
        for (var i = 0; i < this.view.children.length; i++) {
            this.view.children[i].resize({ height:height });
        }
    },

    resizeChildren_cards:function(){
        var height = this.view.getInnerHeightOfBody();
        var width = ludo.dom.getInnerWidthOf(this.view.getBody());

        var card = this.view.getVisibleCard();
        if(card){
            card.resize({ height: height, width: width });
        }
    },
    resizeChildren_fill:function () {
        var height = this.view.getInnerHeightOfBody();
        if(height<=0)return;
        for (var i = 0; i < this.view.children.length; i++) {
            this.view.children[i].resize({ height:height });
        }
    },

	idLastDynamic:undefined,

	setIdOfLastChildWithDynamicWeight:function(){
		for(var i=this.view.children.length-1;i>=0;i--){
			if (this.view.children[i].hasLayoutWeight()) {
				this.idLastDynamic = this.view.children[i].id;
				return;
			}
		}
		this.idLastDynamic = 'NA';
	},

    resizeChildren_rows:function () {
        var componentHeight = this.view.getInnerHeightOfBody();
        if(componentHeight == 0){
            return;
        }
        var totalHeightOfItems = 0;
        var totalWeight = 0;
        var height;
        for (var i = 0; i < this.view.children.length; i++) {
            if (!this.view.children[i].hasLayoutWeight()) {
                if (!this.view.children[i].isHidden()) {
                    height = this.view.children[i].getHeight();
                } else {
                    height = 0;
                }
                if (height) {
                    totalHeightOfItems += height
                }
            } else {
                if (!this.view.children[i].isHidden()) {
                    totalWeight+=this.view.children[i].weight;
                }
            }
        }

        totalWeight = Math.max(1, totalWeight);
        var stretchHeight = remainingHeight = (componentHeight - totalHeightOfItems);


        var width = ludo.dom.getInnerWidthOf(this.view.getBody());

        for (i = 0; i < this.view.children.length; i++) {
            var config = { width: width };
            if (this.view.children[i].hasLayoutWeight()) {
				if(this.view.children[i].id==this.idLastDynamic){
					config.height = remainingHeight;
				}else{
					config.height = Math.round(stretchHeight * this.view.children[i].weight / totalWeight);
					remainingHeight-=config.height;
				}
            } else {
                config.height = this.view.children[i].getHeight();
            }
            if (config.height < 0) {
                config.height = undefined;
            }

            this.view.children[i].resize(config);
        }
    },

    getNewComponent:function (config) {
        return ludo.CmpMgr.newComponent(config, this.view);
    },

    isConfigObject:function (obj) {
        return obj && obj.initialize ? false : true;
    },

    getBody:function () {
        return this.view.getBody();
    },

    getEl:function () {
        return this.view.getEl();
    },

    log:function (txt) {
        if (window.console && console.log) {
            console.log(txt);
        }
    },

    onNewChild:function (child) {
        if (this.isTabLayout()) {
            var tab = this.getTabStrip().addChild(child);
            if (this.getTabStrip().getCountItems() === 1) {
                tab.show();
            }
        }

        child.getEl().addClass('ludo-component-in-layout-' + this.getLayout());

        if (this.view.fullScreen) {
            child.getEl().addClass('ludo-container-child-of-fullscreen');
        }

        var isLastSibling, resizable, separator;

        if (this.getLayout() == 'cols') {
            child.getEl().setStyle('position', 'absolute');
            if (child.isResizable()) {
                isLastSibling = this.isLastSibling(child);

                resizable = new ludo.layout.Resizable({
                    component:child,
                    min:child.minWidth,
                    max:child.maxWidth,
                    cls:'ludo-layout-resize-col',
                    type:'col',
                    css:child.resizableCss ? child.resizableCss : null,
                    position:isLastSibling ? 'before' : 'after',
                    listeners:{
                        'resize':function (width) {
                            child.resize({ width:width });
							child.saveState();
                            this.resizeChildren_cols();
                        }.bind(this)
                    }
                });

                separator = {
                    width:Math.max(3, resizable.getEl().getSize().x - 1),
                    cls:'ludo-separator'
                };
                if (isLastSibling) {
                    separator = this.addChild(separator, child, 'before');
                } else {
                    separator = this.addChild(separator);
                }
                resizable.alignWith(separator);
                this.resizables.push(resizable);
                resizable.colResize();
            }
        }

        else if (this.getLayout() == 'rows') {
            if (child.isResizable()) {
                isLastSibling = this.isLastSibling(child);
                resizable = new ludo.layout.Resizable({
                    component:child,
                    min:child.minHeight,
                    max:child.maxHeight,
                    css:child.resizableCss ? child.resizableCss : null,
                    cls:'ludo-layout-resize-row',
                    type:'row',
                    position:isLastSibling ? 'before' : 'after',
                    listeners:{
                        'resize':function (height) {
                            child.resize({ height:height });
                            this.resizeChildren_rows();
                        }.bind(this)
                    }
                });

                separator = {
                    height:Math.max(3, resizable.getEl().getSize().y - 1),
                    cls:'ludo-separator'
                };
                if (isLastSibling) {
                    separator = this.addChild(separator, child, 'before');
                } else {
                    separator = this.addChild(separator);
                }
                resizable.alignWith(separator);
                this.resizables.push(resizable);

            }
        }
    },
    isLastSibling:function (child) {
        var children = this.view.initialItemsObject;
        if(children.length){
            return children[children.length - 1].id == child.id;
        }else{
            return this.view.children[this.view.children.length-1].id == child.id;
        }
    },

    prepareView:function () {
        var layout = this.getLayout();

        if (this.isTabLayout(layout)) {
            this.view.getEl().addClass('ludo-component-tab-layout');
            this.prepareTabLayout();
        }


    },

    prepareTabLayout:function () {
        if (this.isTabLayout()) {
            var tabStrip = this.getTabStrip();
            tabStrip.showFirstActiveTab();
        }
    },

    getTabStrip:function () {
        if (!this.tabStrip) {
            this.tabStrip = new ludo.TabStrip({
                parentComponent:this.view,
                listeners:{
                    add:this.resize.bind(this)
                }
            });
        }
        return this.tabStrip;
    },

    getLayout:function () {
        return this.view.getLayout().type ? this.view.getLayout().type : 'default';
    },

    hasDynamicHeight:function () {
        var layout = this.getLayoutObject();
        return layout.height && layout.height == 'dynamic';

    },
    getLayoutObject:function () {
        return this.view.getLayout();
    },

    isTabLayout:function () {
        return this.view.getLayout().type == 'tabs';
    },

    isInATabLayout:function () {
        if (!this.view.getParent()) {
            return false;
        }
        return this.view.getParent().getLayout().type === 'tabs';
    },

    getHeightOfNavElements:function () {
        if (this.tabStrip) {
            return this.tabStrip.getHeight();
        }
        return 0;
    },

    resize:function () {
        if (this.view.children.length === 0) {
            return;
        }
        if (this.isTabLayout()) {
            this.getTabStrip().onComponentResize();

        }
    }

});