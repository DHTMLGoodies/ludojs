/**
 * Special Button for page.Deck used to navigate to next page.
 * This button will automatically be disabled when a form is invalid, and automatically enabled when it's valid.
 * A form consists of all form elements of parent component, including form elements of child components.
 * When clicked, next page will be shown
 *
 * @namespace page
 * @class NextButton
 * @augments page.Button
 */
ludo.card.NextButton = new Class({
	Extends:ludo.card.Button,
	type:'page.NextButton',
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
				if (lm.isOnLastPage())this.hide(); else this.show();
				lm.addEvent('lastpage', this.hide.bind(this));
				lm.addEvent('notlastpage', this.show.bind(this));
			} else {
				if (lm.isOnLastPage())this.disable(); else this.enable();
				lm.addEvent('lastpage', this.disable.bind(this));
				lm.addEvent('notlastpage', this.enable.bind(this));
			}
		}

		this.addEvent('click', this.nextPage.bind(this));
	},

	enable:function () {
		if (this.applyTo.getLayout().isValid()) {
			this.parent();
		}
	},

	nextPage:function () {
		if (this.applyTo) {
			this.applyTo.getLayout().showNextPage();
		}
	}
});