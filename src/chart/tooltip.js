ludo.chart.Tooltip = new Class({
    Extends:ludo.canvas.NamedNode,
    tagName:'g',
    pos:undefined,
    item:undefined,

    initialize:function (item, paint) {
        // TODO dynamic sizing
        // TODO singleton tooltip for entire chart.
        this.parent();



        item.group.getCanvas().adopt(this);
        this.item = item;
        item.addEvent('mouseenter', this.showTooltip.bind(this));
        item.addEvent('mouseleave', this.hideTooltip.bind(this));
        item.addEvent('mousemove', this.moveTooltip.bind(this));


        var rect = new ludo.canvas.Rect(
            {
                x:3, y:3, width:124, height:44, rx:5, ry:5, "class":paint
            }
        );
        rect.setStyle('stroke-location','inside');
        this.adopt(rect);
        var el = new ludo.canvas.Node('text', { x: 5, y : 20}, 'Tooltip text coming');
        el.setStyle('font-weight' , 'bold');
        el.setStyle('stroke' , 'none');
        el.setStyle('fill' , '#000');
        el.setStyle('fill-opacity' , '1');
        this.adopt(el);
    },

    getWidth:function(){
        return 130;
    },

    getHeight:function(){
        return 50;
    },

    showTooltip:function (e) {
        this.show();
        var translate = { x:0, y:0 };
        this.engine().translate(this.getEl(), 0, 0);

        var pos = this.item.group.getChartView().getEl().getPosition();

        this.pos = {
            mouse:e.page,
            translate:translate,
            initial:{
                x : e.page.x - pos.x - 10 - this.getWidth(),
                y : e.page.y - pos.y + 10 - this.getHeight()/2
            }
        };

        this.translate(
            this.pos.initial.x,
            this.pos.initial.y
        );


    },

    hideTooltip:function () {
        this.hide();
    },

    moveTooltip:function (e) {
        if (!this.pos)return;
        var x = this.pos.initial.x + e.page.x - this.pos.mouse.x;
        var y = this.pos.initial.y + e.page.y - this.pos.mouse.y;

        if(x < 0)x += this.getWidth() + 20;
        this.engine().translate(this.getEl(), x, y);
    }
});