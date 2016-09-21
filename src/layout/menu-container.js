ludo.layout.MenuContainer = new Class({
    Extends:Events,
    type:'layout.MenuContainer',
    lm:undefined,
    layout:{
        width:'wrap',
        height:'wrap'
    },
    children:[],
    alwaysInFront:true,
    initialize:function (layoutManager) {
        this.lm = layoutManager;
        this.setLayout();
        this.createDom();
    },

    setLayout:function () {
        var l = this.layout;
        if (this.lm.view.parentComponent) {
            var vAlign = this.getSubMenuVAlign();
            var hAlign = this.getSubMenuHAlign();
            if (this.getParentLayoutOrientation() === 'horizontal') {
                l[vAlign] = this.lm.view.getParent().getEl();
                l.alignLeft = this.lm.view;
            } else {
                l[hAlign] = this.lm.view.getEl();
                l[vAlign === 'above' ? 'alignBottom' : 'alignTop'] = this.lm.view;
                // TODO refactor this to dynamic value
                l.offsetY = -3;
            }

            this.lm.view.layout.alignSubMenuV = this.lm.view.layout.alignSubMenuV || vAlign;
            this.lm.view.layout.alignSubMenuH = this.lm.view.layout.alignSubMenuH || hAlign;

            l.height = 'wrap';
        }

        l.fitVerticalViewPort = true;
    },

    getSubMenuVAlign:function () {
        var validKeys = ['above','below'];
        var p = this.lm.view.parentComponent;
        return p && p.layout.alignSubMenuV  && validKeys.indexOf(p.layout.alignSubMenuV) !== -1 ? p.layout.alignSubMenuV : 'below';
    },

    getSubMenuHAlign:function () {
        var validKeys = ['leftOrRightOf','rightOrLeftOf','leftOf','rightOf'];
        var p = this.lm.view.parentComponent;
        return p && p.layout.alignSubMenuH  && validKeys.indexOf(p.layout.alignSubMenuH) !== -1 ? p.layout.alignSubMenuH : 'rightOrLeftOf';
    },

	getParentLayoutOrientation:function(){
		var p = this.lm.view.parentComponent;
		return p ? p.layout.orientation : '';
	},

    createDom:function () {
        this.el = ludo.dom.create({
            'css':{
                'position':'absolute',
                'display':'none'
            },
            renderTo:document.body
        });

        ludo.dom.addClass(this.el, 'ludo-menu-vertical-' + this.getSubMenuVAlign());
        if(this.getSubMenuHAlign().indexOf('left') === 0){
            ludo.dom.addClass(this.el, 'ludo-menu-vertical-to-left');
        }

		if(this.getParentLayoutOrientation() === 'horizontal' && this.getSubMenuVAlign().indexOf('above') === 0){
            ludo.dom.addClass(this.lm.view.parentComponent.getEl(), 'ludo-menu-horizontal-up');
        }

        this.body = ludo.dom.create({
            renderTo:this.el
        });
    },

    getEl:function () {
        return this.el;
    },

    getBody:function () {
        return this.body;
    },

    resize:function (config) {
        if (config.width) {
            this.getEl().style.width = config.width + 'px';
        }
    },

    isHidden:function () {
        return false;
    },

    show:function () {
        this.getEl().style.zIndex = (ludo.util.getNewZIndex(this) + 100);

        if (this.getEl().style.display === '')return;

        this.getEl().style.display = '';

        this.resizeChildren();
        this.getRenderer().resize();

        if (!this.layout.width || this.layout.width === 'wrap') {
            this.setFixedRenderingWidth();
        }

        this.fireEvent('show', this);
    },

    setFixedRenderingWidth:function () {
        this.layout.width = undefined;
        var r = this.getRenderer();
        r.clearFn();
        r.setValue('width', r.getSize().x);
        r.resize();
        for (var i = 0; i < this.lm.view.children.length; i++) {
            var cr = this.lm.view.children[i].getLayout().getRenderer();
            cr.clearFn();
            cr.setValue('width', r.getValue('width'));
        }

        this.resizeChildren();
    },

    childrenResized:false,
    resizeChildren:function () {
        if (this.childrenResized)return;
        for (var i = 0; i < this.lm.view.children.length; i++) {
            this.lm.view.children[i].getLayout().getRenderer().resize();
        }
        this.fireEvent('resize');
    },

    hide:function () {
        this.getEl().css('display', 'none');
        this.fireEvent('hide', this);
    },
    renderer:undefined,
    getRenderer:function () {
        if (this.renderer === undefined) {
            this.renderer = new ludo.layout.Renderer({
                view:this
            });
        }
        return this.renderer;
    }
});