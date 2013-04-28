ludo.chart.Tooltip = new Class({
    Extends:ludo.canvas.Rect,
    pos:undefined,
    item:undefined,

    initialize:function (item, paint) {
        this.parent({
            x:0, y:0, width:130, height:50, rx:5, ry:5, "class":paint
        }, "Label");
        item.chart.getCanvas().adopt(this);
        this.item = item;
        item.addEvent('mouseenter', this.showTooltip.bind(this));
        item.addEvent('mouseleave', this.hideTooltip.bind(this));
        item.addEvent('mousemove', this.moveTooltip.bind(this));
    },

    showTooltip:function (e) {
        this.show();
        var translate = { x:0, y:0 };
        this.engine().translate(this.getEl(), 0, 0);

        var pos = this.item.chart.getEl().getPosition();

        this.set('x', e.page.x - pos.x - 10 - this.getWidth());
        this.set('y', e.page.y - pos.y + 10 - this.getHeight()/2);

        this.pos = {
            mouse:e.page,
            translate:translate
        };
    },

    hideTooltip:function () {
        this.hide();
    },

    moveTooltip:function (e) {
        if (!this.pos)return;

        var x = this.pos.translate.x + e.page.x - this.pos.mouse.x;
        var y = this.pos.translate.y + e.page.y - this.pos.mouse.y;
        this.engine().translate(this.getEl(), x, y);
    }
});