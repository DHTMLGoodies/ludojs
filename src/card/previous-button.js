/**
 *
 * @namespace card
 * @class PreviousButton
 * @extends card.Button
 * @description Special Button for card.Deck component for navigation to previous card.
 * On click, this button will show previous card.
 * The button will be automatically disabled when first card in deck is shown.
 * When clicked, next card will be shown
 */
ludo.card.PreviousButton = new Class({
	Extends:ludo.card.Button,
	type:'card.PreviousButton',
	value:'Previous',
	disabled:true,

	addButtonEvents:function () {
		this.addEvent('click', this.showPreviousCard.bind(this));
		if (this.component) {
			var lm = this.component.getLayoutManager();
			if (this.autoHide) {
				if(!lm.isOnFirstCard())this.show(); else this.hide();
				lm.addEvent('firstcard', this.hide.bind(this));
				lm.addEvent('notfirstcard', this.show.bind(this));
			} else {
				if(!lm.isOnFirstCard())this.enable(); else this.disable();
				lm.addEvent('firstcard', this.disable.bind(this));
				lm.addEvent('notfirstcard', this.enable.bind(this));
			}
		}
	},

	showPreviousCard:function () {
		if (this.component) {
			this.component.getLayoutManager().showPreviousCard();
		}
	}
});