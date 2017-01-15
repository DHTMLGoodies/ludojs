ludo.svg.Util = {

    pathStyles:function(className){

        var node = $('<div>');
        node.addClass(className);
        node.css('display', 'none');
        $(document.body).append(node);

        var ret = {
            'fill': ludo.svg.Util.toRGBColor(node.css('background-color')),
            'fill-opacity': node.css('opacity'),
            'stroke': ludo.svg.Util.toRGBColor(node.css('border-color')),
            'stroke-width': node.css('border-width').replace('px', '')
        };
        node.remove();
        return ret;
    },

    textStyles: function (className) {
        var node = $('<div>');
        node.addClass(className);
        node.css('display', 'none');
        $(document.body).append(node);

        var lh = node.css('line-height').replace(/[^0-9\.]/g, '');
        if (!lh) {
            lh = node.css('font-size');
        }


        var fontSize = parseInt(node.css('font-size'));
        fontSize++;


        var ret = {
            'font-size': fontSize + "px",
            'font-family': node.css('font-family'),
            'font-weight': node.css('font-weight'),
            'font-style': node.css('font-style'),
            'line-height': lh,
            'fill': ludo.svg.Util.toRGBColor(node.css('color')),
            'stroke': 'none',
            'stroke-opacity': 0
        };
        ret['line-height'] = ret['line-height'] || ret['font-size'];
        node.remove();
        return ret;
    },

    toRGBColor:function(val){
        if(val.indexOf('rgb') >= 0){
            if(this.colorUtil == undefined){
                this.colorUtil = new ludo.color.Color();
            }
            val = val.replace(/[^0-9,]/g,'');
            var colors = val.split(/,/g);
            if(colors.length == 4)return val;
            val = this.colorUtil.rgbCode(colors[0]/1, colors[1]/1, colors[2]/1);
            return val;
        }

        return val;
    }
};