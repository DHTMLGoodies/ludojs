ludo.layout.MenuContainer = new Class({
    Extends:Events,
    lm:undefined,
    layout:{},
    children:[],
    alwaysInFront:true,
    initialize:function(layoutManager){
        this.lm = layoutManager;
        this.setLayout();
        this.createDom();
    },

    setLayout:function(){
        if(this.lm.view.parentComponent){
            if(this.lm.view.parentComponent.layout.orientation === 'horizontal'){
                this.layout.below = this.lm.view;
                this.layout.alignLeft = this.lm.view;
            }else{
                this.layout.leftOrRightOf = this.lm.view;
                this.layout.rightOf = this.lm.view;
                this.layout.alignTop = this.lm.view;
                this.layout.fitVerticalViewPort = true;
            }

            this.layout.width = 'wrap';
            this.layout.height = 'wrap';
        }
    },

    createDom:function(){
        this.el = ludo.dom.create({
            cls:'ludo-menu',
            'css' : {
                'position' : 'absolute',
                'display' : 'none'
            },
            renderTo:document.body
        });

        this.el.setAttribute('forel', this.lm.view.name);

        ludo.dom.addClass(this.el, 'ludo-menu-' + this.lm.view.layout.orientation);

        this.body  = ludo.dom.create({
            renderTo:this.el
        });
    },

    getEl:function(){
        return this.el;
    },

    getBody:function(){
        return this.body;
    },

    resize:function(config){

    },

    isHidden:function(){
        return false;
    },

    show:function(){
        if(this.getEl().style.display === '')return;
        this.getEl().style.zIndex = (ludo.util.getNewZIndex(this) + 100);
        this.getEl().style.display = '';
        for(var i=0;i<this.lm.view.children.length;i++){
            this.lm.view.children[i].show();
        }

        this.getRenderer().resize();

        this.resizeChildren();
    },

    resizeChildren:function(){
        for(var i=0;i<this.lm.view.children.length;i++){
            this.lm.view.children[i].getLayoutManager().getRenderer().resize();
        }
    },

    hide:function(){
        this.getEl().style.display = 'none';
    },
    renderer:undefined,
    getRenderer:function(){
        if(this.renderer === undefined){
            this.renderer = new ludo.layout.Renderer({
                view:this
            });
        }
        return this.renderer;
    }
});