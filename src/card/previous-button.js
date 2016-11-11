/**
 *
 * @namespace page
 * @class PreviousButton
 * @augments page.Button
 * @description Special Button for page.Deck component for navigation to previous page.
 * On click, this button will show previous page.
 * The button will be automatically disabled when first page in deck is shown.
 * When clicked, next page will be shown
 */
ludo.card.PreviousButton = new Class({
	Extends:ludo.card.Button,
	type:'page.PreviousButton',
	value:'Previous',

	addButtonEvents:function () {
		this.addEvent('click', this.showPreviousPage.bind(this));
		if (this.applyTo) {
			var lm = this.applyTo.getLayout();
			if (this.autoHide) {
				if(!lm.isOnFirstPage())this.show(); else this.hide();
				lm.addEvent('firstpage', this.hide.bind(this));
				lm.addEvent('notfirstpage', this.show.bind(this));
			} else {
				if(!lm.isOnFirstPage())this.enable(); else this.disable();
				lm.addEvent('firstpage', this.disable.bind(this));
				lm.addEvent('notfirstpage', this.enable.bind(this));
			}
		}
	},

	showPreviousPage:function () {
		if (this.applyTo) {
			this.applyTo.getLayout().previousPage();
		}
	}
});