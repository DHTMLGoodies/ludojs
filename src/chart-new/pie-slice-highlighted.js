ludo.chart.PieSliceHighlighted = new Class({
    Extends:ludo.chart.AddOn,
    tagName:'path',
    styles:{
        'fill':'#ccc'
    },

    ludoConfig:function (config) {
        this.parent(config);

        this.setConfigParams(config, ['styles']);
        this.styles = Object.clone(this.styles);
        this.node = new ludo.canvas.Path();
        this.node.setStyles(this.styles);

        this.getParent().adopt(this.node);
        this.node.toBack();
    },

    ludoEvents:function () {
        this.parent();
        this.getParent().addEvent('enterRecord', this.show.bind(this));
        this.getParent().addEvent('leaveRecord', this.hide.bind(this));
        this.getParent().addEvent('focusRecord', this.focus.bind(this));
        this.getParent().addEvent('blurRecord', this.blur.bind(this));
    },

    show:function (record) {
        var f = this.getParent().getFragmentFor(record);

        var path = f.getPath({
            radius:this.getParent().getRadius() + 10,
            angle:record.getAngle(),
            degrees:record.getDegrees()
        });
        this.node.set('d', path);

        if (record.isFocused()) {
            var t = f.nodes[0].getTranslate();
            this.node.translate(t);
        }else{
            this.node.translate(0,0);
        }
        this.node.show();
    },

    hide:function () {
        this.node.hide();
    },

    focus:function (record) {
        var f = this.getParent().getFragmentFor(record);
        var coords = f.centerOffset(10);
        this.node.translate(0,0);
        this.node.engine().effect().fly(this.node.getEl(), coords.x, coords.y,.1);

    },

    blur:function(){
        this.node.engine().effect().flyBack(this.node.getEl(),.1);
    }
});