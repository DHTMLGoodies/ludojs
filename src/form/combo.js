/**
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

    ludoRendered:function(){
        this.parent();

        var c = this.children[0];
        c.layout = c.layout || {};
        c.layout.below = this.getInputCell();
        c.layout.alignLeft = this.getInputCell();
        c.layout.sameWidthAs = this.getInputCell();
        c.layout.height = 200;
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
