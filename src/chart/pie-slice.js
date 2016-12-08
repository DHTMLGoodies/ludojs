ludo.chart.PieSlice = new Class({
    Extends:ludo.chart.Fragment,

    createNodes:function(){
        var style = this.createStyle(this.getSliceStyle());
        this.createNode('path', { "class":style });
    },
    getSliceStyle:function () {
        return {
            'stroke-location':'inside',
            'fill':this.record.__color,
            'stroke-linejoin':'round',
            'stroke':'#ffffff',
            'cursor':'pointer'
        };
    },

    set:function (radius, angle, radians) {
        this.nodes[0].set('d', this.getPath({
            radius:radius, angle:angle, radians:radians
        }));
    },

    getPath:function (config) {

        var center = config.center || this.getParent().getCenter();
        
        var path = ['M ' + center.x + ' ' + center.y];

        if(config.angle > Math.PI * 2) config.angle -=  Math.PI;

        var point1 = ludo.canvasEngine.getPointAtRadianOffset(center, config.angle, config.radius);

        path.push('L ' + point1.x + ' ' + point1.y);
        path.push('M ' + point1.x + ' ' + point1.y);

        path.push('A ' + config.radius + ' ' + config.radius);
        path.push('0');
        path.push(config.radians > Math.PI ? '1' : '0');
        path.push('1');

        var point2 = ludo.canvasEngine.getPointAtRadianOffset(center, config.angle + config.radians, config.radius);
        path.push(point2.x + ' ' + point2.y);
        path.push('L ' + center.x + ' ' + center.y);

        this.storeRendering(config);

        return path.join(' ');
    },

    focus:function(){
        var coords = this.centerOffset(this.getParent().getHighlightSize());

        this.node().animate({
            translate: [coords.x, coords.y]
        }, 100);

      //  this.node().engine().effect().fly(this.node().getEl(), coords.x, coords.y,.1);
    },

    blur:function(){


        this.node().animate({
            translate: [0,0]
        }, 100);

    },

    node:function(){
        return this.nodes[0];
    },

    centerOffset:function(offset){
        var angle = this.record.__angle + (this.record.__radians / 2 );
        return ludo.canvasEngine.getPointAtRadianOffset({ x:0, y: 0}, angle, offset);
    },

    enter:function(){
        this.nodes[0].css('fill', this.record.__colorOver);
    },

    leave:function(){
        this.nodes[0].css('fill', this.record.__color);
    },

    update:function(){
        var radius = this.getParent().getRadius();


        if(Math.round(radius) == Math.round(this.rendering.radius) && this.rendering.angle == this.record.__angle && this.rendering.radians == this.record.__radians){
            return;
        }

        var e = new ludo.canvas.Effect();

        var config = e.getEffectConfig(
            [this.rendering.radius,this.rendering.angle, this.rendering.radians ],
            [radius, this.record.__angle, this.record.__radians],
            1
        );

        config.center = this.getParent().getCenter();

        this.executeAnimation(config, 0);

    },

    executeAnimation:function(config, step){
        this.nodes[0].set('d', this.getPath(
            {
                radius : this.rendering.radius,
                angle: this.rendering.angle + config.steps[1],
                radians : this.rendering.radians + config.steps[2],
                center : config.center
            }

        ));
        if(step < config.count -1){
            this.executeAnimation.delay(33, this, [config, step+1]);
        }
    }
});