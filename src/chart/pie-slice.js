ludo.chart.PieSlice = new Class({
    Extends:ludo.chart.Item,
    center:undefined,
    renderingData:undefined,
    tagName:'path',
    highlighted:false,
    animationKeys : ['angle', 'radius', 'degrees'],

    initialize:function (group, styles) {
        this.parent(group, styles);
        this.addEvent('click', this.highlight.bind(this));

        this.addEvent('animate', this.deactivateHighlight.bind(this));
        this.addEvent('animationComplete', this.restoreHighlight.bind(this));
    },

    render:function (config) {
        config.radius = this.group.getRadius();
        this.storeRenderingData(config);
        this.set('d', this.getPath(config));
    },

    animate:function(config){
        this.storeRenderingValue('angle', config.angle);
        this.parent(this.getAnimationConfig({
            angle : config.angle,
            radius : this.group.getRadius(),
            degrees : config.degrees
        }));
        this.storeRenderingData(config);
    },

    executeAnimation:function(data, step){
        this.parent(data);
        var p = this.group.getPrevious(this);
        if(p){
            var a = p.getAnimationValues(step);
            data.angle = a.angle + a.degrees;
        }
        this.set('d', this.getPath(data));
    },

    storeRenderingData:function(config){
        this.parent({
            angle : config.angle,
            radius : this.group.getRadius(),
            degrees : config.degrees
        });
    },

    storeRenderingValue:function(key, value){
        if(this.renderingData === undefined)this.renderingData = {};
        this.renderingData[key] = value;
    },

    getOffsetFromCenter:function (offset) {
        var centerRadians = this.toRadians(this.renderingData.angle + (this.renderingData.degrees / 2));
        var x = Math.cos(centerRadians) * offset;
        var y = Math.sin(centerRadians) * offset;
        return { x:x, y:y}
    },

    getPath:function (config) {
        
        var center = this.group.getCenter();

        var path = ['M ' + center.x + ' ' + center.y];

        var point1 = this.getPointAtDegreeOffset(center, config.angle, config.radius);

        path.push('L ' + point1.x + ' ' + point1.y);
        path.push('M ' + point1.x + ' ' + point1.y);

        path.push('A ' + config.radius + ' ' + config.radius);
        path.push('0');
        path.push(config.degrees > 180 ? '1' : '0');
        path.push('1');

        var point2 = this.getPointAtDegreeOffset(center, config.angle + config.degrees, config.radius);
        path.push(point2.x + ' ' + point2.y);
        path.push('L ' + center.x + ' ' + center.y);

        return path.join(' ');
    },

    highlight:function () {
        var coords = this.getOffsetFromCenter(10);

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
    },

    wasHighlighted : false,
    restoreHighlight:function(){
        if(this.wasHighlighted){
            this.highlight();
            this.wasHighlighted = false;
        }
    },

    deactivateHighlight:function(){
        if(this.highlighted){
            this.highlight();
            this.wasHighlighted = true;
        }
    }
});