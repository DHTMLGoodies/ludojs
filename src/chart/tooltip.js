/**
 * Chart tooltip module
 * You create a tooltip module by adding it as plugins to one
 * of your chart views.
 *
 * The text of the tooltip is populated from the textOf method of
 * <a href="ludo.chart.DataSource.html">ludo.chart.DataSource</a>.
 *
 * Example:
 * <code>
 * textOf:function(record, caller){
            // Text for the tooltip module
            if(caller.type == 'chart.Tooltip'){
                return '<p><b>{parent.name}</b><br>' + record.date + '<br>Share Price: {record.price}</p>';
            }
            // Text for all others.
            return record.date;
        },
    </code>
 *
 * textOf is a function returning text to chart views. Many views ask this method
 * for data, so a test on caller.type or caller.id is usually required.
 * 
 * Simple HTML tags like &lt;b>, &lt;strong> &lt;i>, &lt;em> and &lt;br>
 * in the returned text is allowed.
 *
 * @class ludo.chart.Tooltip
 * @param {Object} config
 * @param {Object} config.type Always set to chart.Tooltip
 * @param {Object} config.textStyles Text styling
 * @param {Object} config.boxStyles Styling of tooltip box
 * @param {Number} config.animationDuration Animation duration in ms, default: 200
 * @example:
 * plugins:[
 *  {
 *      type:'chart.Tooltip',
 *      textStyles:{
 *          'font-size': '12px',
 *          'fill': '#aeb0b0'
 *      },
 *      boxStyles:{
 *          fill:'#222',
 *          'fill-opacity': 0.9
 *      }
 * ]
 */
ludo.chart.Tooltip = new Class({
    Extends: ludo.chart.AddOn,
    type: 'chart.Tooltip',
    tpl: '{label}: {value}',
    shown: false,

    offset: undefined,

    size: {
        x: 0, y: 0
    },

    arrowSize: 5,
    /*
     * Styling of box where the tooltip is rendered
     * @config {Object} boxStyles
     * @default { "fill":"#fff", "fill-opacity":.8, "stroke-width" : 1, "stroke-location": "inside" }
     */
    boxStyles: {},

    /*
     * Overall styling of text
     * @config {Object} textStyles
     * @default { "fill" : "#000" }
     */
    textStyles: {},

    record: undefined,

    _autoLeave: undefined,

    animationDuration:100,


    __construct: function (config) {
        this.parent(config);
        this.offset = {x: 0,y:0};
        this.setConfigParams(config, ['tpl', 'boxStyles', 'textStyles','animationDuration']);
        this.createDOM();


        var p = this.getParent();

        p.on('enter', this.show.bind(this));
        p.on('leave', this.autoHide.bind(this));

        if (p.tooltipAtMouseCursor()) {
            this.getParent().getNode().on('mousemove', this.move.bind(this));
        } else {

        }
    },

    createDOM: function () {
        this.node = new ludo.canvas.Node('g');
        this.getParent().getCanvas().append(this.node);
        this.node.hide();
        this.node.toFront.delay(50, this.node);

        this.rect = new ludo.canvas.Path();
        this.rect.css(this.getBoxStyling());
        this.rect.set('stroke-linejoin', 'round');
        this.rect.set('stroke-linecap', 'round');

        this.node.append(this.rect);

        this.textBox = new ludo.canvas.TextBox();
        this.node.append(this.textBox);
        this.textBox.getNode().setTranslate(6, 2);
        this.textBox.getNode().css(this.getTextStyles());
    },

    getBoxStyling: function () {
        var ret = this.boxStyles || {};
        if (!ret['fill'])ret['fill'] = '#fff';
        if (!ret['stroke-location'])ret['stroke-location'] = 'inside';
        if (ret['fill-opacity'] === undefined)ret['fill-opacity'] = .8;
        if (ret['stroke-width'] === undefined)ret['stroke-width'] = 1;
        return ret;
    },

    getTextStyles: function () {
        var ret = this.textStyles || {};
        if (!ret['fill'])ret['fill'] = '#000';
        return ret;
    },

    show: function (fragment, rec, node, event) {

        this._autoLeave = false;
        if (rec == this.record)return;

        this.record = rec;

        if (rec == undefined) {
            this.hide();
            return;
        }

        var animate = !this.node.isHidden();
        this.node.set('fill-opacity', 1);
        this.rect.set('fill-opacity', 1);
        this.node.show();
        this.node.toFront();
        this.shown = true;

        this.textBox.setText(this.getParsedHtml());

        this.rect.css('stroke', this.record.__color);

        this.updateRect(fragment, xy);

        this.rect.show();

        var followMouse = this.getParent().tooltipAtMouseCursor();
        var xy;
        if (followMouse) {
            this.move(event);
        } else {
            xy = this.getXY(fragment, node);
            if(this.offset.x != 0 || this.offset.y != 0){
                this.updateRect(fragment);
            }
            if (animate) {
                this.node.animate({
                    'translate': [xy.x, xy.y]
                }, {
                    duration:this.animationDuration,
                    queue:false,
                    validate:function(a,b){
                        return a == b;
                    }
                })
            } else {
                this.node.setTranslate(xy.x, xy.y);
            }
        }


    },

    autoHide: function () {
        this._autoLeave = true;
        this.autoHideAfterDelay.delay(2000, this);
    },

    autoHideAfterDelay: function () {
        if (!this._autoLeave)return;
        this.node.hide();
        this.record = undefined;
    },

    updateRect: function (fragment, pos) {
        this.size = this.textBox.getNode().getSize();
        this.size.x += 12;
        this.size.y += 15;


        var middle = this.size.x / 2 + this.offset.x;
        var middleY = this.size.y / 2;

        if(middle + this.arrowSize > this.size.x){
            middle -= ((middle + this.arrowSize ) - this.size.x);
        }
        if(middle < 0){
            middle = 0;
        }

        var p;
        var tp = this.getParent().getTooltipPosition();

        switch (tp) {
            case 'above':
                p = [
                    this.size.x, 0,
                    this.size.x, this.size.y,
                    middle + this.arrowSize, this.size.y,
                    middle, this.size.y + this.arrowSize,
                    middle - this.arrowSize, this.size.y,
                    0, this.size.y,
                    0, 0];
                break;
            case 'left':
                p = [
                    this.size.x, 0,
                    this.size.x, middleY - this.arrowSize,
                    this.size.x + this.arrowSize, middleY,
                    this.size.x, middleY + this.arrowSize,
                    this.size.x, this.size.y,
                    0, this.size.y,
                    0, 0
                ];


                break;
            case 'right':
                p = [
                    this.size.x, 0,
                    this.size.x, this.size.y,
                    0, this.size.y,
                    0, middleY + this.arrowSize,
                    0 - this.arrowSize, middleY,
                    0, middleY - this.arrowSize,
                    0, 0
                ];
                break;

            default:
                p = [
                    this.size.x, 0,
                    this.size.x, this.size.y,
                    0, this.size.y,
                    0, 0
                ];
        }




        this.rect.setPath('M 0 0 L ' + p.join(' ') + " Z");

    },

    getXY: function (fragment, target) {

        this.offset.x = 0;
        this.offset.y = 0;

        var bounds = target.getBBox();

        var size = this.rect.getBBox();

        var pos = target.offset();
        
        var tp = this.getParent().getTooltipPosition();

        switch (tp) {
            case 'left':
                return {
                    x: pos.left - size.width,
                    y: pos.top + bounds.height / 2 - size.height / 2
                };

            case 'right':
                return {
                    x: pos.left + bounds.width + this.arrowSize,
                    y: pos.top + bounds.height / 2 - size.height / 2
                };


            default:

                var x = pos.left + bounds.width / 2 - size.width / 2;
                var aw = this.getParent().getCanvas().width;
                var overflow = (x + size.width) - aw;
                if(overflow > 0){
                    this.offset.x = overflow;
                    x-=overflow;
                }
                return {
                    x: x,
                    y: pos.top - size.height
                };


        }

    },

    move: function (event) {
        this.node.setTranslate(event.clientX - (this.size.x / 2), event.clientY - this.size.y - 15);
    },


    hide: function () {
        this.node.hide();
        this.rect.hide();
        this.shown = false;
    },

    getParsedHtml: function () {
        var text = this.getDataSource().textOf(this.record, this);


        jQuery.each(this.record, function (key, value) {
            var r = new RegExp("{record\." + key + "}", "g");
            text = text.replace(r, value);
        });

        if (this.record.__parent && text.indexOf('parent.') >= 0) {

            var p = this.getDataSource().byId(this.record.__parent);
            jQuery.each(p, function (key, value) {
                var r = new RegExp("{parent\." + key + "}", "g");
                text = text.replace(r, value);
            });

        }

        text = text.replace(/{.*?}/g, '');
        return text
    },

    getRecord: function () {
        return this.record;
    }

});
