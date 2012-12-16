/**
 * Progress bar for cards in a deck. percentage will be position of current curd
 * relative to number of cards
 * @namespace card
 * @class ProgressBar
 * @extends progress.Bar
 */
ludo.card.ProgressBar = new Class({
    Extends: ludo.progress.Bar,
    hidden:false,
	applyTo:undefined,
    ludoConfig:function(config){
        this.parent(config);
		if(config.applyTo!==undefined)this.applyTo = config.applyTo;
        this.component = this.getParentComponent();
		if(this.component)this.component.getLayoutManager().registerButton(this);
    },
    ludoEvents:function(){
        this.parent();
        this.component.getLayoutManager().addEvent('showcard', this.setCardPercent.bind(this))
    },
    ludoRendered:function(){
        this.parent();
        this.setCardPercent();
    },
    setCardPercent:function(){
        this.setPercent(this.component.getLayoutManager().getPercentCompleted());
    },
    getParentComponent:function () {
		if(this.applyTo)return ludo.get(this.applyTo);
        var cmp = this.getParent();
        if (cmp.type.indexOf('ButtonBar') >= 0) {
            cmp = cmp.getView();
        }
        if (!cmp.layout || cmp.layout.type!=='card') {
            for (var i = 0; i < cmp.children.length; i++) {
                if (cmp.children[i].layout.type === 'card') {
                    return cmp.children[i];
                }
            }
        }
        return cmp;
    },

    getProgressBarId:function(){
        return undefined;
    }
});