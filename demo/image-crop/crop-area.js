ludo.crop.CropArea = new Class({
    Extends:ludo.canvas.Node,
    type:'crop.CropArea',
    useController:true,
    tag : 'path',
    properties:{
        d : 'M 0 0 100 100',
        stroke : 'none',
        fill : '#FFF',
        'fill-opacity' : .7,
        'fill-rule' : 'evenodd'
    },
    imageSize:{
        width:0,
        height:0
    },
    cropArea:{
        x:20,
        y:20,
        width: 300,
        height:300
    },

    __rendered:function(){
        this.parent();
    },

    addControllerEvents:function () {
        this.controller.addEvent('loadimage', this.setImage.bind(this));
        this.controller.addEvent('setcoordinate', this.receiveCoordinate.bind(this));
    },

    receiveCoordinate:function(coordinate){
        this.cropArea[coordinate.name] = parseInt(coordinate.value);
        this.set('d', this.getPath());
    },

    setImage:function(image){
        this.imageSize.width = image.width;
        this.imageSize.height = image.height;
        this.cropArea = {
            x : 0,y : 0,
            width : image.width, height:image.height
        };

        this.set('d', this.getPath());
    },

    getPath:function(){
        var w = this.imageSize.width;
        var h = this.imageSize.height;
        var ca = this.cropArea;
        var c = {
            x1:ca.x,y1:ca.y,
            x2:ca.x+ca.width, y2:ca.y,
            x3:ca.x+ca.width, y3:ca.y + ca.height,
            x4:ca.x, y4:ca.y + ca.height
        };
        var points = [
            [0,0],[w,0],[w,h],[0,h],[0,0],[c.x1,c.y1],[c.x2,c.y2],[c.x3,c.y3],[c.x4,c.y4],[c.x1,c.y1]
        ];
        var ret = 'M';
        for(var i=0;i<points.length;i++){
            ret += ' ' + points[i][0]+','+ points[i][1];
        }
        return ret;
    }
});