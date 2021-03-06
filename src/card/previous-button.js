
ludo.card.PreviousButton = new Class({
	Extends:ludo.card.Button,
	type:'page.PreviousButton',
	value:'Previous',

	onRendered:function () {
		this.addEvent('click', this.showPreviousPage.bind(this));
		if (this.applyTo) {
			var lm = this.applyTo.getLayout();
			if (this.autoHide) {
				if(lm.selectedIndex != 0)this.show(); else this.hide();
				lm.addEvent('firstpage', this.hide.bind(this));
				lm.addEvent('notfirstpage', this.show.bind(this));
			} else {
				if(lm.selectedIndex != 0)this.enable(); else this.disable();
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