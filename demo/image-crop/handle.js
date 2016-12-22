ludo.crop.Handle = new Class({
    Extends:ludo.svg.Node,
    type:'crop.Handle',
    tag:'rect',
    useController:true,
    properties:{
        x:0, y:0, width:50, height:50, stroke:'white', 'fill':'#FFF', 'fill-opacity':0
    },
    x:0, y:0,
    cropArea:{
        x:0, y:0, width:0, height:0
    },
    image:{
        width:0, height:0
    },

    region:undefined,
    dd:{
        active:false,
        start:{x:0, y:0},
        current:{x:0, y:0},
        el:{x:0, y:0}
    },
    __construct:function (config) {
        this.region = config.region;
        this.parent(config);
    },
    ludoEvents:function () {
        this.addEvent(this.getDragStartEvent(), this.dragStart.bind(this));
        this.getEventEl().addEvent(this.getDragMoveEvent(), this.drag.bind(this));
        this.getEventEl().addEvent(this.getDragEndEvent(), this.dragEnd.bind(this));
        this.setCursor(this.region + '-resize');
    },

    dragStart:function (e) {
        this.dd.active = true;
        this.dd.start = {
            x:e.page.x,
            y:e.page.y
        };
        this.dd.el = {
            x:this.x,
            y:this.y
        };
        this.dd.scale = this.getScale();
        this.fireEvent('startresize', this.region);
        return false;

    },
    drag:function (e) {
        if (this.dd.active) {
            this.dd.current = {
                x:e.page.x, y:e.page.y
            };
            var xOffset = (this.dd.current.x - this.dd.start.x) * this.dd.scale;
            var yOffset = (this.dd.current.y - this.dd.start.y) * this.dd.scale;
            if (this.region.length == 1) {
                if (this.region == 'w' || this.region == 'e') {
                    this.x = this.dd.el.x + xOffset;
                } else {
                    this.y = this.dd.el.y + yOffset;
                }
            } else {
                this.x = this.dd.el.x + xOffset;
                this.y = this.dd.el.y + yOffset;
            }

            this.fireEvent('movehandle', { region:this.region, x:this.x, y:this.y});
            return false;
        }
    },
    dragEnd:function () {
        this.dd.active = false;
    },

    addControllerEvents:function () {
        this.controller.addEvent('loadimage', this.setImageSize.bind(this));
        this.controller.addEvent('setcoordinate', this.receiveCoordinate.bind(this));
    },

    receiveCoordinate:function (coordinate) {
        this.cropArea[coordinate.name] = coordinate.value;
        this.position();
    },

    setImageSize:function (image) {
        this.image = { width:image.width, height:image.height };
        this.cropArea = { x:0, y:0, width:image.width, height:image.height };
        this.position();
    },

    position:function () {
        var p = {};
        var maxX = this.cropArea.x + this.cropArea.width - this.getWidth() / 2;
        var maxY = this.cropArea.y + this.cropArea.height - this.getHeight() / 2;
        var minX = this.cropArea.x - this.getWidth() / 2;
        var minY = this.cropArea.y - this.getHeight() / 2;

        switch (this.region) {
            case 'nw':
                p.x = minX;
                p.y = minY;
                break;
            case 'n':
                p.x = this.cropArea.width / 2;
                p.y = minY;
                break;
            case 'ne':
                p.x = this.cropArea.width - this.getWidth() / 2;
                p.y = minY;
                break;
            case 'e':
                p.x = maxX;
                p.y = this.cropArea.height / 2;
                break;
            case 'se':
                p.x = maxX;
                p.y = maxY;
                break;
            case 's':
                p.x = this.cropArea.width / 2;
                p.y = maxY;
                break;
            case 'sw':
                p.x = minX;
                p.y = maxY;
                break;
            case 'w':
                p.x = minX;
                p.y = this.cropArea.height / 2;
                break;
        }
        this.x = p.x;
        this.y = p.y;
        this.setProperties(p);
    }

});