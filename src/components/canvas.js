ludo.Canvas = new Class({
    Extends : ludo.View,

    ludoDOM : function() {
        var el = this.els.canvas = new Element('canvas');
        this.getBody().adopt(el);
        el.setStyles({
            height : '100%',
            width : '100%'
        })
    }


});

