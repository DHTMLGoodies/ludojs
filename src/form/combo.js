/**
 * A text field with combo button. Click on the combo button will child view beneath the text input
 *
 * @namespace form
 * @class Combo
 * @extends form.Element
 */
ludo.form.Combo = new Class({
    Extends:ludo.form.Text,
    type:'form.Combo',
    layout:{
        type:'popup'
    },

    /**
     Custom layout properties of child
     @config {Object} childLayout
     @default undefined
     @example
        childLayout:{
            width:300,height:300
        }
     Default layout properties will be applied when
     */
    childLayout:undefined,

    ludoConfig:function(config){
        this.parent(config);
        this.childLayout = config.childLayout || this.childLayout;
    },

    ludoRendered:function(){
        this.parent();

        var c = this.children[0];
        c.layout = c.layout || {};
        if(this.childLayout)c.layout = Object.merge(c.layout, this.childLayout);

        c.layout.below = c.layout.below || this.getInputCell();
        if(c.left === undefined)c.layout.alignLeft = c.layout.alignLeft || this.getInputCell();
        if(!c.layout.width)c.layout.sameWidthAs = this.getInputCell();
        c.layout.height = c.layout.height || 200;
        c.alwaysInFront = true;
        c.cls = 'form-combo-child';

        this.getInputCell().style.position='relative';
        new ludo.menu.Button({
            renderTo: this.getInputCell(),
            alwaysVisible:true,
            region:'ne',
            autoPosition:false,
            menu:this.children[0],
            toggleOnClick:true,
            listeners:{
                show:function(){
                    this.fireEvent('showCombo');
                }.bind(this)
            }
        });
    }
});
