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

    ludoEvents:function(){
        this.parent();
        if(this.applyTo){
			this.applyTo.getLayout().registerButton(this);
			this.applyTo.getLayout().addEvent('showcard', this.setCardPercent.bind(this))
		}
    },

    ludoRendered:function(){
        this.parent();
		if(this.applyTo){
			this.setCardPercent();
		}
    },

    setCardPercent:function(){
        this.setPercent(this.applyTo.getLayout().getPercentCompleted());
    },

    getProgressBarId:function(){
        return undefined;
    }
});