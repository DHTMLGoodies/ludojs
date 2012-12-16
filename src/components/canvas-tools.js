if(!window.ludo){
    window.ludo = {};
}
ludo.CanvasTools = new Class({
    Extends : Events,

    el : null,

    defaultProperties : {
        'lineWidth' : 5,
        'lineCap' : 'round',
        'strokeStyle' : '#00F',
        'lineCap' : 'round',
        'fillStyle' : '#8ED6FF'
    },


    initialize : function(config){
        this.el = document.id(config.el);
        this.el.setStyle('position', 'relative');
        this.el.addEvent('mousemove', this.mouseMove.bind(this));
        this.setInitialCanvasProperties();
    },

    mouseMove : function(e){
        this.fireEvent('mousemove', [e, this]);
    },

    setInitialCanvasProperties : function() {

        for(var key in this.defaultProperties){
            this.getContext()[key] = this.defaultProperties[key];
        }
    },

    getContext : function() {
        return this.el.getContext('2d');

    },

    line : function(from, to, properties) {
        if(properties){
            this.setCanvasProperties(properties);
        }
        var context = this.getContext();
        context.moveTo(from.x, from.y);
        context.lineTo(to.x, to.y);
        context.stroke();
    },

    setCanvasProperties : function(properties){
        var context = this.getContext();
        for(var prop in properties){
            console.log(prop);
            context[prop] = properties[prop];
        }
    },

    setOrigin : function(x,y) {
        this.arc({
            x : x,
            y : y,
            radius : 5,
            start : 0,
            end :360
        });
        this.getContext().translate(x,y);

    },

    rect : function(x,y, width, height, properties) {
        if(properties){
            this.setCanvasProperties(properties);
        }
        var context = this.getContext();
        context.strokeStyle = '#FFF';
        context.lineWidth = 2;
        context.strokeRect(x,y, width, height);
    },

    roundRect : function(x,y, width, height, cornerRadius, fillColor) {
        var context = this.getContext();

        context.moveTo(x + cornerRadius, y);
        context.lineTo(x + width - cornerRadius, y);
        this.arc({ x : x + width - cornerRadius, y: y + cornerRadius, radius : cornerRadius, start : 270, end :0});
        context.lineTo(x + width, y + height - cornerRadius);
        this.arc({ x : x + width - cornerRadius, y: y + height - cornerRadius, radius : cornerRadius, start : 0, end :90});
        context.lineTo(x + cornerRadius, y + height);

        this.arc({ x : x + cornerRadius, y: y + height - cornerRadius, radius : cornerRadius, start : 90, end :180});
        context.lineTo(x, y + cornerRadius);
        this.arc({ x : x + cornerRadius, y: y + cornerRadius, radius : cornerRadius, start : 180, end :270});
        if(fillColor){
            context.fillStyle = fillColor;
            context.fill();
        }
        context.stroke();

    },

    fillWithPattern : function(imageSource) {
        var context = this.getContext();
        Asset.image(imageSource,{
            onLoad : function(obj){
                var pattern = context.createPattern(obj, 'repeat');
                context.fillStyle = pattern;
                context.rect(10, 10, 480, 480);
                context.fill();

            }.bind(this)
        })

    },

    getRadialGradient : function(coordinates) {
        return this.getContext().createRadialGradient(
            coordinates.circleOne.x,
            coordinates.circleOne.y,
            coordinates.circleOne.radius,

            coordinates.circleTwo.x,
            coordinates.circleTwo.y,
            coordinates.circleTwo.radius
        )     ;

    },

    filledRoundRect : function(x,y, width, height, cornerRadius, fillColor) {
        this.roundRect(x,y,width,height,cornerRadius);

    },

    illustrateQuadraticCurveTo : function(coordinates) {
        this.quadraticCurveTo(coordinates);
        console.log(coordinates);
        var color = this.getContext().strokeStyle;

        this.getContext().strokeStyle = '#F00';

        this.arc({ x : coordinates.from.x, y: coordinates.from.y, radius : 5, start : 0, end :360});
        this.arc({ x : coordinates.to.x, y: coordinates.to.y, radius : 5, start : 0, end :360});
        this.arc({ x : coordinates.controlPoint.x, y: coordinates.controlPoint.y, radius : 5, start : 0, end :360});
        this.getContext().strokeStyle = color;


    },

    quadraticCurveTo : function(coordinates){
        var context = this.getContext();

        context.moveTo(coordinates.from.x, coordinates.from.y);
        context.quadraticCurveTo(coordinates.controlPoint.x, coordinates.controlPoint.y, coordinates.to.x, coordinates.to.y);
      
    },

    bezierCurveTo : function(coordinates) {
        var context = this.getContext();
        context.moveTo(coordinates.from.x, coordinates.from.y);
        context.bezierCurveTo(
                coordinates.controlPointOne.x, coordinates.controlPointOne.y,
                coordinates.controlPointTwo.x, coordinates.controlPointTwo.y,
                coordinates.to.x, coordinates.to.y);
        context.stroke();

    },

    illustrateBezierCurveTo : function(coordinates){
        this.bezierCurveTo(coordinates);
        var color = this.getContext().strokeStyle;

        this.getContext().strokeStyle = '#F00';

        this.arc({ x : coordinates.from.x, y: coordinates.from.y, radius : 5, start : 0, end :360});
        this.arc({ x : coordinates.to.x, y: coordinates.to.y, radius : 5, start : 0, end :360});
        this.arc({ x : coordinates.controlPointOne.x, y: coordinates.controlPointOne.y, radius : 5, start : 0, end :360});
        this.arc({ x : coordinates.controlPointTwo.x, y: coordinates.controlPointTwo.y, radius : 5, start : 0, end :360});
        this.getContext().strokeStyle = color;
    },

    graph : function(points) {
        var context = this.getContext();
        context.moveTo(points[0].x, points[0].y);

        for(var i=1;i<points.length;i++){
            this.illustrateQuadraticCurveTo({
                from : { x : points[i-1].x, y : points[i-1].y },
                controlPoint : this.getControlPoint(points[i-1], points[i], points[i+1] ? points[i+1] : null),
                to : { x : points[i].x, y : points[i].y }
            });
        }

    },

    getControlPoint : function(from, to, nextPoint) {
        if(to.y < from.y){
            return {
                x : Math.min(from.x, from.y),
                y : Math.min(from.y, to.y)
            }
        }else{
            return {
                x : Math.min(from.x, from.y),
                y : Math.max(from.y, to.y)
            }
        }
    },

    arc : function(coordinates, properties) {
        if(properties){
            this.setCanvasProperties(properties);
        }

        this.getContext().arc(
            coordinates.x,
            coordinates.y,
            coordinates.radius,
            this.degreesToRadians(coordinates.start),
            this.degreesToRadians(coordinates.end),
            false
        );
        if(coordinates.fillStyle){
            this.getContext().fillStyle = coordinates.fillStyle;
            this.getContext().fill();
        }

        if(coordinates.strokeStyle){
            this.getContext().strokeStyle = coordinates.strokeStyle;
            this.getContext().stroke();
        }
    },

    showCroppedImage : function(image, showWhere, cropCoordinates) {
        var context = this.getContext();
        /*
        context.drawImage(imageObj, sourceX, sourceY, sourceWidth,
	        sourceHeight, destX, destY, destWidth, destHeight);
         */
        cropCoordinates.scale = cropCoordinates.scale || 1;
        context.drawImage(image, cropCoordinates.x, cropCoordinates.y, cropCoordinates.width, cropCoordinates.height, showWhere.x, showWhere.y, cropCoordinates.width * cropCoordinates.scale, cropCoordinates.height * cropCoordinates.scale)

    },

    setCanvasBackgroundColor : function(color) {
        return;
        var context = this.getContext();
        context.restore();
        context.fillStyle = color;
        context.fillRect(-500, -500, context.canvas.width + 500, context.canvas.height + 500);
        context.fill();
    
    },

    rotate : function(degrees){

        this.getContext().rotate(this.degreesToRadians(degrees));
        this.getContext().restore();
      
    },

    degreesToRadians : function(degrees) {
        return (Math.PI / 180) * degrees
    },

    animate : function() {
        
    },

    restore : function(){
        this.getContext().restore();
    },

    save : function() {
        this.getContext().save();
    }

    


});