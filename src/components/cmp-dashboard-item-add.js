ludo.DashboardItem_AddItem = new Class({
    Extends : ludo.RichView,
    type : 'DashboardItem_AddItem',
    statusBar : {
        visible : false
    },
    titleBar : false,

    controls : {
        minimize : false,
        closable : false
    },

	resizable : false,
	movable : false,
    height : 140,

    setContent : function() {
        var el = this.els.body = new Element('div');
        el.setStyles({
            'background-image' :'url(images/add.png)',
            'background-repeat' : 'no-repeat',
            'background-position' : 'center center',
            'cursor' : 'pointer'
        });
        el.addEvent('click', this.clickOnContent.bind(this));
        return el;
    },
    clickOnContent : function() {
        this.fireEvent('click');
    }
});