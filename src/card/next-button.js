/**
 * Special Button for card.Deck used to navigate to next card.
 * This button will automatically be disabled when a form is invalid, and automatically enabled when it's valid.
 * A form consists of all form elements of parent component, including form elements of child components.
 * When clicked, next card will be shown
 *
 * @namespace card
 * @class NextButton
 * @extends card.Button
 */
ludo.card.NextButton = new Class({
	Extends:ludo.card.Button,
	type:'card.NextButton',
	value:'Next',

	addButtonEvents:function () {
		if (this.applyTo) {
			var lm = this.applyTo.getLayout();
			lm.addEvent('valid', this.enable.bind(this));
			lm.addEvent('invalid', this.disable.bind(this));
			if (!lm.isValid()) {
				this.disable();
			}
			if (this.autoHide) {
				if (lm.isOnLastCard())this.hide(); else this.show();
				lm.addEvent('lastcard', this.hide.bind(this));
				lm.addEvent('notlastcard', this.show.bind(this));
			} else {
				if (lm.isOnLastCard())this.disable(); else this.enable();
				lm.addEvent('lastcard', this.disable.bind(this));
				lm.addEvent('notlastcard', this.enable.bind(this));
			}
		}

		this.addEvent('click', this.nextCard.bind(this));
	},

	enable:function () {
		if (this.applyTo.getLayout().isValid()) {
			this.parent();
		}
	},

	nextCard:function () {
		if (this.applyTo) {
			this.applyTo.getLayout().showNextCard();
		}
	}
});