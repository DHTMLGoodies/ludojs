ludo.layout.TextBox = new Class({
    Extends: ludo.svg.Canvas,
    rotation: 270,
    text: undefined,
    className: undefined,
    classNameOver: undefined,
    width: 200, height: 200,
    size: {
        x: 0, y: 0
    },
    x: 0, y: 0,
    colorUtil:undefined,

    __construct: function (config) {
        this.text = config.text;
        this.rotation = config.rotation;
        this.className = config.className;
        this.classNameOver = config.classNameOver || config.className;
        this.renderTo = config.renderTo;
        if (config.x !== undefined)this.x = config.x;
        if (config.y !== undefined)this.y = config.y;

        if (document.createElementNS === undefined) {
            this.createIE8Box(config);
            return;
        }
        this.parent(config);

        this.createStyles();
        this.renderText();
        this.storeSize();
        this.rotate();
        this.resizeCanvas();



       
    },

    createIE8Box: function () {
        var span = document.createElement('span');
        $(this.renderTo).append($(span));
        span.innerHTML = this.text;
        this.setIE8Transformation(span);
        return span;
    },

    setIE8Transformation: function (span) {
        var s = span.style;
        s.display = 'block';
        s.visibility = 'hidden';
        s.position = 'absolute';
        span.className = this.className;
        document.body.append(span);

        s.fontSize = '12px';
        s.fontWeight = 'normal';
        s.filter = "progid:DXImageTransform.Microsoft.Matrix(" + this.getIE8Transformation() + ", sizingMethod='auto expand')";
        s.height = span.height() + 'px';
        this.size.x = span.width();
        this.size.y = span.height();
        if (this.rotation === 90) {
            s.right = '0px';
        }
        s.visibility = 'visible';
        document.id(this.renderTo).appendChild(span);

    },
    
    leave:function(){
        this.textNode.removeClass(this.classNameOver);
        this.textNode.addClass(this.className);
    },

    enter:function(){
        this.textNode.addClass(this.classNameOver);
    },

    deg2radians: Math.PI * 2 / 360,

    getIE8Transformation: function () {
        var rad = this.rotation * this.deg2radians;
        var costheta = Math.cos(rad);
        var sintheta = Math.sin(rad);
        return ['M11=' + costheta, 'M12=' + (sintheta * -1), 'M21=' + sintheta, 'M22=' + costheta].join(',');
    },
    resizeCanvas: function () {
        var size = this.getSize();
        this.setViewBox(size.x, size.y);
        this.set('width', size.x);
        this.set('height', size.y);
    },

    createStyles: function () {
        this.styles = this.getStyles(this.className);
        this.stylesOver = this.getStyles(this.classNameOver);
        this.stylesOver['font-size'] = this.styles['font-size'];
        this.stylesOver['line-height'] = this.styles['line-height'];

        this.addStyleSheet(this.className, this.styles);
        this.addStyleSheet(this.classNameOver, this.stylesOver);

    },

    renderText: function () {
        var el = this.textNode = new ludo.svg.Node('text', {
            x: this.x,
            y: this.y + parseInt(this.styles['font-size']),
            "class": this.className
        });
        el.text(this.text);
        this.append(el);
    },

    getStyles: function (className) {
        var node = $('<div>');
        node.addClass(className);
        node.css('display', 'none');
        $(document.body).append(node);

        var lh = node.css('line-height').replace(/[^0-9]/g, '');
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
            'fill': this.toRGBColor(node.css('color')),
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
            val = this.colorUtil.rgbCode(colors[0]/1, colors[1]/1, colors[2]/1);
            return val;
        }

        return val;
    },

    storeSize: function () {
        var bbox = this.textNode.el.getBBox();
        this.size = {
            x: bbox.width + bbox.x,
            y: bbox.height + bbox.y
        };
    },
    rotate: function () {
        var x = this.size.x;
        var y = this.size.y;
        var yOffset = (this.size.y - parseInt(this.styles['line-height'])) / 2;
        var transformation = '';
        switch (this.rotation) {
            case 270:
                transformation = 'translate(' + (yOffset * -1) + ' ' + x + ') rotate(' + this.rotation + ')';
                break;
            case 180:
                transformation = 'rotate(' + this.rotation + ' ' + (x / 2) + ' ' + (y / 2) + ')';
                break;
            case 90:
                transformation = 'translate(' + (y - yOffset) + ' ' + 0 + ') rotate(' + this.rotation + ')';
                break;
            case 0:
                transformation = 'translate(0 ' + (yOffset * -1) + ')';

        }
        this.textNode.set('transform', transformation);
    },

    getSize: function () {
        switch (this.rotation) {
            case 270:
            case 90:
                return {x: this.size['y'], y: this.size['x']};
            default:
                return this.size;

        }
    }
});