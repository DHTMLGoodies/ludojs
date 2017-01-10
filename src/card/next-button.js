
ludo.card.NextButton = new Class({
	Extends:ludo.card.Button,
	type:'page.NextButton',
	value:'Next',

	onRendered:function () {
		window.alf = this.applyTo;
		if (this.applyTo) {
			var lm = this.applyTo.getLayout();
			console.log(lm.count, lm.selectedIndex);
			lm.addEvent('valid', this.enable.bind(this));
			lm.addEvent('invalid', this.disable.bind(this));
			if (!lm.isFormValid()) {
				this.disable();
			}else{
				this.enable();
			}
			if (this.autoHide) {
				if (lm.selectedIndex == lm.count-1)this.hide(); else this.show();
				lm.addEvent('lastpage', this.hide.bind(this));
				lm.addEvent('notlastpage', this.show.bind(this));
			} else {
				if (lm.selectedIndex == lm.count-1)this.disable(); else this.enable();
				lm.addEvent('lastpage', this.disable.bind(this));
				lm.addEvent('notlastpage', this.enable.bind(this));
			}
		}

		this.addEvent('click', this.nextPage.bind(this));
	},

	enable:function () {
		console.log('enable',this.applyTo.getLayout().isFormValid() )
		if (this.applyTo.getLayout().isFormValid()) {
			this.parent();
		}
	},

	disable:function(){
		console.log('disable');
		this.parent();
	},

	nextPage:function () {
		if (this.applyTo) {
			this.applyTo.getLayout().nextPage();
		}
	}
});