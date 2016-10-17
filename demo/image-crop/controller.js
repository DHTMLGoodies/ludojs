ludo.crop.Controller = new Class({
    Extends:ludo.controller.Controller,
    type:'crop.Controller',

    imageSize:{
        width:0, height:0
    },
    cropArea:{
        x:0, y:0, width:0, height:0
    },
    cropAreaBeforeDrag:{

    },

    addView:function (component) {
        switch (component.type) {
            case 'crop.Crop':
                component.addEvent('loadimage', this.loadImage.bind(this));
                break;
            case 'crop.Controls':
                component.addEvent('setcoordinate', this.setCoordinate.bind(this));
                break;
            case 'crop.Handle':
                component.addEvent('movehandle', this.receiveHandleCoordinate.bind(this));
                component.addEvent('startresize', this.setBeforeDragCoordinates.bind(this));
                break;
        }
    },

    loadImage:function (path) {
        this.preload(path);
    },

    preload:function (path) {
        var el = new Element('img');
        el.addEvent('load', function (e) {
            this.imageSize = { width:e.target.width, height:e.target.height };
            this.cropArea = {x:0, y:0, width:e.target.width, height:e.target.height };
            this.fireEvent('loadimage', { path:path, width:e.target.width, height:e.target.height });
        }.bind(this));
        el.src = path;
    },

    setBeforeDragCoordinates:function () {
        this.cropAreaBeforeDrag = Object.clone(this.cropArea);
    },

    setCoordinate:function (coordinate) {
        coordinate = this.getValidCoordinate(coordinate);
        this.cropArea[coordinate.name] = coordinate.value;
        this.fireEvent('setcoordinate', coordinate);
    },

    getValidCoordinate:function (coordinate) {
        coordinate.value = parseInt(coordinate.value);
        switch (coordinate.name) {
            case 'x':
                if (coordinate.value > this.imageSize.width) {
                    coordinate.value = this.imageSize.width;
                }
                if ((coordinate.value + this.cropArea.width) > this.imageSize.width) {
                    var offset = (coordinate.value + this.cropArea.width) - this.imageSize.width;
                    this.cropArea.width -= offset;
                    this.setCoordinate({ name:'width', value:this.cropArea.width });
                }
                break;
            case 'y':
                if (coordinate.value > this.imageSize.height) {
                    coordinate.value = this.imageSize.height;
                }
                if ((coordinate.value + this.cropArea.height) > this.imageSize.height) {
                    var offset = (coordinate.value + this.cropArea.height) - this.imageSize.height;
                    this.cropArea.height -= offset;
                    this.setCoordinate({ name:'height', value:this.cropArea.height });
                }
                break;

        }
        return coordinate;
    },

    receiveHandleCoordinate:function (handle) {
        var offsets = this.getOffsets(handle);
        switch (handle.region) {
            case 's':
                this.setCoordinate({ name:'height', value:handle.y - this.cropArea.y });
                break;
            case 'n':
                var offset = handle.y - this.cropAreaBeforeDrag.y;
                this.cropArea.height = this.cropAreaBeforeDrag.height - offset;
                this.setCoordinate({ name:'height', value:this.cropArea.height });
                this.setCoordinate({ name:'y', value:this.cropArea.y + offset });
                break;
            case 'e':
                this.setCoordinate({ name:'width', value:handle.x + this.cropArea.x });
                break;
        }
    },
    getOffsets:function (handle) {
        return {
            x:handle.x - this.cropAreaBeforeDrag.x,
            y:handle.y - this.cropAreaBeforeDrag.y,
            width:handle.x - this.cropAreaBeforeDrag.width,
            height:handle.y - this.cropAreaBeforeDrag.height
        }
    }
});