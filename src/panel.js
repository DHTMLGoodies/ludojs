/**
 * A Panel
 * A Panel is a component where the body element is a &lt;fieldset> with a &lt;legend>
 * @class Panel
 * @extends View
 */
ludo.Panel = new Class({
    Extends : ludo.View,
    tagBody : 'fieldset',

    ludoDOM : function() {
        this.parent();
        this.getEl().addClass('ludo-panel');
        this.els.legend = new Element('legend');
        this.els.body.adopt(this.els.legend);
        this.setTitle(this.title);
        this.getEl().addClass('ludo-panel');
    },

    ludoRendered : function(){
        this.parent();
        this.getBody().setStyle('display','block');
    },
    autoSetHeight : function() {
        this.parent();
        var sizeLegend = this.els.legend.measure(function(){
            return this.getSize();
        });
        this.height += sizeLegend.y;

    },

    getInnerHeightOfBody : function(){
        return this.parent() - this.getHeightOfLegend() - 5;
    },

    heightOfLegend : undefined,
    getHeightOfLegend : function(){
        if(this.heightOfLegend === undefined){
            this.heightOfLegend = this.els.legend.getSize().y;
        }
        return this.heightOfLegend;
    },

    resizeDOM : function(){
        var height = this.getHeight();
        if(height == 0){
            return;
        }

		height -= (ludo.dom.getMBPH(this.getBody()) + ludo.dom.getMBPH(this.getEl()));
        if(height > 0 && !isNaN(height)){
            this.getBody().style.height = height + 'px';
        }
        
        var width = this.getWidth();
        width -= (ludo.dom.getMBPW(this.getBody()) + ludo.dom.getMBPW(this.getEl()));

        if(width > 0 && !isNaN(width)){
            this.getBody().style.width = width + 'px';
        }
    },

    setTitle : function(title){
        this.parent(title);
        this.els.legend.set('html', title);
    }
});