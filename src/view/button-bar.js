/**
 * Class used to create button bars at bottom of components.
 * This class is instantiated automatically
 * @namespace view
 * @class ButtonBar
 * @augments View
 */
ludo.view.ButtonBar = new Class({
    Extends:ludo.View,
    type : 'ButtonBar',
    layout:{
        type:'linear',
		orientation:'horizontal',
		width:'matchParent',
        height:'matchParent'
    },
    elCss:{
        height:'100%'
    },
    align:'right',
    cls:'ludo-view-button-container',
    overflow:'hidden',
    component:undefined,
	buttonBarCss:undefined,

    __construct:function (config) {
        this.setConfigParams(config, ['align','component','buttonBarCss']);
        config.children = this.getValidChildren(config.children);
        if (this.align == 'right' || config.align == 'center') {
            config.children = this.getItemsWithSpacer(config.children);
            if(config.align == 'center'){
                config.children.push(this.emptyChild());
            }
        }else{
            config.children[0].elCss = config.children[0].elCss || {};
            if(!config.children[0].elCss['margin-left']){
                config.children[0].elCss['margin-left'] = 2
            }
        }

        this.parent(config);
    },
    ludoDOM:function () {
        this.parent();
        this.getBody().addClass('ludo-content-buttons');
    },

    __rendered:function () {
        this.parent();
		this.component.addEvent('resize', this.resizeRenderer.bind(this));

		if(this.buttonBarCss){
			this.getEl().parent().css(this.buttonBarCss);
		}

        console.log(this.layout);

    },

	resizeRenderer:function(){
		this.getLayout().getRenderer().resize();
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
        var c = this.children;
        for (var i = 0; i < c.length; i++) {
            if(c[i].id == key || c[i].name == key || (c[i].val && c[i].val().toLowerCase() == key.toLowerCase())){
                return c[i];
            }
        }
		return undefined;
    },

    getItemsWithSpacer:function (children) {
        children.splice(0, 0, this.emptyChild());

        return children;
    },

    emptyChild:function(){
        return {
            layout: { weight:1 },
            elCss:{ 'background-color':'transparent' },
            css:{ 'background-color':'transparent'}
        };
    },
    /**
     * Returns the component where the button bar is placed
	 * @function getView
     * @return {Object} ludo Component
     * @private
     */
    getView_250_40 : function(){
        return this.component;
    }
});