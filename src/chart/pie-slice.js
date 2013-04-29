ludo.chart.PieSlice = new Class({
    Extends:ludo.chart.Item,
    origo:undefined,
    renderingData:undefined,
    tagName:'path',
    highlighted:false,

    initialize:function (chart, css) {

        this.parent(chart, { "class":css });
        this.addEvent('click', this.highlight.bind(this));
    },

    render:function (config) {
        this.set('d', this.getPath(config));
        this.renderingData = config;
    },

    getOffsetFromOrigo:function (offset) {
        var centerRadians = this.toRadians(this.renderingData.startAngle + (this.renderingData.degrees / 2));
        var x = Math.cos(centerRadians) * offset;
        var y = Math.sin(centerRadians) * offset;
        return { x:x, y:y}
    },

    getPath:function (config) {
        var path = ['M ' + config.origo.x + ' ' + config.origo.y];

        var point1 = this.getPointAtDegreeOffset(config.origo, config.startAngle, config.radius);
        var point2 = this.getPointAtDegreeOffset(config.origo, config.startAngle + config.degrees, config.radius);
        path.push('L ' + point1.x + ' ' + point1.y);
        path.push('M ' + point1.x + ' ' + point1.y);

        path.push('A ' + config.radius + ' ' + config.radius);
        path.push('0');
        path.push(config.degrees > 180 ? '1' : '0');
        path.push('1');

        path.push(point2.x + ' ' + point2.y);
        path.push('L ' + config.origo.x + ' ' + config.origo.y);

        return path.join(' ');
    },

    highlight:function () {
        var coords = this.getOffsetFromOrigo(10);

        if (this.highlighted) {
            this.engine().effect().flyBack(this.getEl(),.1);
        } else {
            if (this.highlighted) {
                coords.x *= -1;
                coords.y *= -1;
            }
            this.engine().effect().fly(this.getEl(), coords.x, coords.y,.1);

            this.fireEvent('highlight', this);
        }
        this.highlighted = !this.highlighted;
    },

    isHighlighted:function(){
        return this.highlighted;
    }
});