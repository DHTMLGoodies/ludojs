ludo.chart.Outline = new Class({
    Extends: ludo.chart.Base,
    fragmentType:undefined,
    outline:undefined,

    __construct:function(config){
        this.parent(config);
        this.setConfigParams(config, ['outline']);
        this.createOutline();
    },

    onResize:function(){
        this.parent();



        var s = this.getSize();
        jQuery.each(this.outline, function (key, el) {
            el.toFront();
            switch (key) {
                case 'around':
                    el.css({
                        width: s.x, height: s.y
                    });
                    break;
                case 'left':
                    el.attr('y2', s.y);
                    break;
                case 'right':
                    el.attr('x2', s.x);
                    el.attr('x1', s.x);
                    el.attr('y2', s.y);
                    break;
                case 'top':
                    el.attr('x2', s.x);
                    break;
                case 'bottom':
                    el.attr('x2', s.x);
                    el.attr('y1', s.y);
                    el.attr('y2', s.y);
                    break;
            }
        }.bind(this));
    },

    createOutline: function () {
        var s = this.getSize();
        if (this.outline.left || this.outline.bottom || this.outline.top || this.outline.right) {

            jQuery.each(this.outline, function (key, styles) {
                var pos = {
                    x1: 0, y1: 0, x2: 0, y2: 0
                };

                var el = this.outline[key] = new ludo.canvas.Node('line', pos);
                el.css(styles);
                this.append(el);
            }.bind(this));
        } else {

            var el = this.outline['around'] = new ludo.canvas.Rect({
                x: 0, y: 0, width: s.x, height: s.y
            });
            el.css(this.outline);
            this.append(el);
        }
    }
});