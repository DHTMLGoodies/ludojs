ludo.chart.PieSlice = new Class({
    Extends:ludo.chart.Fragment,

    ludoConfig:function (config) {
        this.parent(config);
        var style = this.createStyle(this.getSliceStyle());
        this.createNode('path', { "class":style });


    },

    getSliceStyle:function () {
        return {
            'stroke-location':'inside',
            'fill':this.record.get('color'),
            'stroke-linejoin':'round',
            'stroke':'#ffffff',
            'cursor':'pointer'
        };
    },

    set:function (radius, angle, degrees) {
        this.nodes[0].set('d', this.getPath({
            radius:radius, angle:angle, degrees:degrees
        }));
    },

    getPath:function (config) {

        var center = this.getParent().getCenter();

        var path = ['M ' + center.x + ' ' + center.y];

        var point1 = ludo.canvasEngine.getPointAtDegreeOffset(center, config.angle, config.radius);

        path.push('L ' + point1.x + ' ' + point1.y);
        path.push('M ' + point1.x + ' ' + point1.y);

        path.push('A ' + config.radius + ' ' + config.radius);
        path.push('0');
        path.push(config.degrees > 180 ? '1' : '0');
        path.push('1');

        var point2 = ludo.canvasEngine.getPointAtDegreeOffset(center, config.angle + config.degrees, config.radius);
        path.push(point2.x + ' ' + point2.y);
        path.push('L ' + center.x + ' ' + center.y);

        this.storeRendering(config);

        return path.join(' ');
    },

    focus:function(){
        var coords = this.centerOffset(10);
        this.node().engine().effect().fly(this.node().getEl(), coords.x, coords.y,.1);
    },

    blur:function(){
        this.node().engine().effect().flyBack(this.node().getEl(),.1);
    },

    node:function(){
        return this.nodes[0];
    },

    centerOffset:function(offset){
        var angle = this.record.getAngle() + (this.record.getDegrees() / 2 );
        return ludo.canvasEngine.getPointAtDegreeOffset({ x:0, y: 0}, angle, offset);
    }
});