/**
 * Class used to create button bars at bottom of components.
 * This class is instantiated automatically
 * @namespace view
 * @class ButtonBar
 * @extends View
 */
ludo.view.ButtonBar = new Class({
    Extends:ludo.View,
    type : 'ButtonBar',
    layout:{
        type:'linear',
		orientation:'horizontal',
		width:'matchParent'
    },
    align:'right',
    cls:'ludo-component-button-container',
    overflow:'hidden',
    component:undefined,

    ludoConfig:function (config) {
        if (config.align !== undefined)this.align = config.align;

        this.component = config.component;
        config.children = this.getValidChildren(config.children);
        if (this.align == 'right') {
            config.children = this.getItemsWithSpacer(config.children);
        }else{
            config.children[0].containerCss = config.children[0].containerCss || {};
            if(!config.children[0].containerCss['margin-left']){
                config.children[0].containerCss['margin-left'] = 2
            }
        }
		//
        this.parent(config);
    },
    ludoDOM:function () {
        this.parent();
        this.getBody().addClass('ludo-content-buttons');
    },

    ludoRendered:function () {
        this.parent();
		this.component.addEvent('resize', this.resizeRenderer.bind(this));
    },

	resizeRenderer:function(){
		this.getLayoutManager().getRenderer().resize();
	},

    getValidChildren:function (children) {
        for (var i = 0; i < children.length; i++) {
            if (children[i].value && !children[i].type) {
                children[i].type = 'form.Button'
            }
        }
        return children;
    },

    getButtons:function () {
        var ret = [];
        for (var i = 0; i < this.children.length; i++) {

            if (this.children[i].isButton && this.children[i].isButton()) {
                ret.push(this.children[i]);
            }
        }
        return ret;
    },

    getButton:function (key) {
        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i].id == key) {
                return this.children[i];
            }
            if (this.children[i].name == key) {
                return this.children[i];
            }
            if (this.children[i].getValue && this.children[i].getValue().toLowerCase() == key.toLowerCase()) {
                return this.children[i];
            }
        }
		return undefined;
    },



	resize:function(config){
		this.parent(config);
	},

    getItemsWithSpacer:function (children) {
        for (var i = children.length; i > 0; i--) {
            children[i] = children[i - 1];
        }
        children[0] = {
            layout: { weight:1 },
            containerCss:{ 'background-color':'transparent' },
            css:{ 'background-color':'transparent'}
        };
        return children;
    },
    /**
     * Returns the component where the button bar is placed
	 * @method getView
     * @return {Object} ludo Component
     * @private
     */
    getView : function(){
        return this.component;
    }
});