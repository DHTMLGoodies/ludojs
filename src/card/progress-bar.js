
ludo.card.ProgressBar = new Class({
    Extends: ludo.progress.Bar,
    hidden: false,
    applyTo: undefined,

    ludoEvents: function () {
        this.parent();
        console.log(this.applyTo);
        if (this.applyTo) {
            this.applyTo.getLayout().registerButton(this);
            this.applyTo.getLayout().addEvent('showpage', this.setCardPercent.bind(this))
        }
    },

    __rendered: function () {
        this.parent();
        if (this.applyTo) {
            this.setCardPercent();
        }
    },

    setCardPercent: function () {
        this.setPercent(this.applyTo.getLayout().getPercentCompleted());
    },

    getProgressBarId: function () {
        return undefined;
    }
});