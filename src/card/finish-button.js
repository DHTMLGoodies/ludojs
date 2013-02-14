/**
 * Special Button for card.Deck component
 * This button will automatically be disabled when a form is invalid, and automatically enabled when it's valid.
 * A form consists of all form elements of parent component, including form elements of child components.
 * When clicked, it will submit the form of card.Deck.
 *
 * A ludo.card.FinishButton will only be visible when last card in the deck is shown.
 *
 * @namespace card
 * @class FinishButton
 * @extends card.Button
 */
ludo.card.FinishButton = new Class({
    Extends:ludo.card.Button,
    type:'card.FinishButton',
    value:'Finish',
    hidden:true,

    addButtonEvents:function(){
		var lm;
        if (this.component) {
			lm = this.component.getLayoutManager();
            lm.addEvent('valid', this.enable.bind(this));
            lm.addEvent('invalid', this.disable.bind(this));
			this.component.addEvent('beforesubmit', this.disable.bind(this));

            lm.addEvent('lastcard', this.show.bind(this));
            lm.addEvent('notlastcard', this.hide.bind(this));

            if(!lm.isValid()){
                this.disabled = true;
            }
        }
        this.addEvent('click', this.submit.bind(this));

        if(lm && lm.isOnLastCard()){
            this.show();
        }
    },

    enable:function(){
        if(this.component.getLayoutManager().isValid()){
            this.parent();
        }
    },

    submit:function () {
        if (this.component) {
            this.component.submit();
        }
    }
});