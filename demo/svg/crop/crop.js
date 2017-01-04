ludo.factory.ns("svgCrop");

svgCrop.CropTool = new Class({
    Extends: ludo.View,
    formView:undefined,
    
    layout: {
        type: 'relative'
    },
    __children: function () {
        return [
            {
                id: 'bottom',
                css: {
                    'border-top': '1px solid ' + ludo.$C('border'),
                    padding: 3
                },
                layout: {
                    height: 32,
                    alignParentBottom: true,
                    width: 'matchParent',
                    type: 'relative'
                },
                children: [
                    {
                        type: 'form.Button', value: 'Crop', id: 'cropButton',
                        layout: {
                            alignParentRight: true
                        }
                    }
                ]
            },
            {
                id:'docking',
                layout:{
                    type:'docking',
                    width:140,
                    above: 'bottom',
                    fillUp: true,
                    tabs:'left'

                },
                children:[
                    {
                        title:'Crop Details',
                        id: 'form',
                        name: 'form',
                        type: 'svgCrop.Form',
                        layout: {
                            visible:true

                        }
                    }
                ]
            },
            {
                name: 'surface',
                type: 'svgCrop.Surface',
                layout: {
                    above: 'bottom',
                    fillUp: true,
                    rightOf: 'docking',
                    fillRight: true

                }
            }
        ]
    },

    __rendered: function () {
        this.parent();
        
        this.formView = ludo.$('form');
        this.child["surface"].on("size", this.setMinMax.bind(this));
        this.child["surface"].on("crop", this.updateForm.bind(this));

        ludo.$('form').getForm().on('change', this.formUpdate.bind(this));
        ludo.$('cropButton').on('click', this.crop.bind(this));
    },

    formUpdate: function (name, value) {
        this.child["surface"].formUpdate(name, value);


    },

    crop: function () {
        this.fireEvent('crop', this.child['surface'].actualCropArea);
    },

    setMinMax: function (size) {
        ludo.$('form').onPictureLoaded(size);
    },

    updateForm: function (size) {
        ludo.$('form').populate(size);
    },
    setPicture: function (picture) {
        this.child["surface"].setPicture(picture);
    }

});

svgCrop.Form = new Class({
    Extends: ludo.View,
    css: {
        padding: 5,
        'border-right': '1px solid ' + ludo.$C("border")
    },
    form: {},
    layout: {
        type: 'table',
        simple: true,
        columns: [{weight: 1}, {width: 40}]
    },

    pictureCoordinates: undefined,

    __rendered: function () {
        this.parent();
        this.getForm().on('invalid', this.onInvalid.bind(this));
    },

    onInvalid: function () {
        this.getForm().rollback();
    },

    onPictureLoaded: function (coordinates) {
        this.pictureCoordinates = coordinates;
        this.populate(coordinates);
    },

    numberValidator: function (val, key, formField) {
        if (val.length == 0 || !this.pictureCoordinates)return false;
        val = parseInt(val);

        switch (formField.name) {
            case 'x':
                return val >= 0 && val <= this.pictureCoordinates.width - 10;
            case 'y':
                return val >= 0 && val <= this.pictureCoordinates.height - 10;
            case 'width':
                return val > 10 && val <= this.pictureCoordinates.height - this.child['x'].val();
            case 'height':
                return val > 10 && val <= this.pictureCoordinates.height - this.child['y'].val();
        }
    },

    populate: function (coordinates) {
        this.getForm().populate(coordinates);
        this.getForm().commit();
    },

    __children: function () {
        return [
            {
                type: 'form.Label', labelFor: 'x', label: 'X:'
            },
            {
                type: 'form.Number', name: 'x', validator: this.numberValidator.bind(this)
            }, {
                type: 'form.Label', labelFor: 'y', label: 'Y:'
            },
            {
                type: 'form.Number', name: 'y', validator: this.numberValidator.bind(this)
            },
            {
                type: 'form.Label', labelFor: 'width', label: 'Width:'
            },
            {
                type: 'form.Number', name: 'width', validator: this.numberValidator.bind(this)
            }, {
                type: 'form.Label', labelFor: 'height', label: 'Height:'
            },
            {
                type: 'form.Number', name: 'height', validator: this.numberValidator.bind(this)
            }
        ]
    }

});


svgCrop.Surface = new Class({
    Extends: ludo.View,

    imageNode: undefined,

    size: undefined,

    ratio: 1,

    imagePos: undefined,

    handles: undefined,

    rect: undefined,

    cropArea: undefined,

    padding: 25,

    group: undefined,


    clipPoints: undefined,

    clipPath: undefined,

    resizeAttr: undefined,

    actualCropArea: undefined,

    __construct: function (config) {
        this.parent(config);
        this.imagePos = {x: 0, y: 0};
        this.actualCropArea = {x: 0, y: 0, width: 0, height: 0}

    },

    __rendered: function () {
        this.parent();
        this.getBody().css('background-color', '#444');

        var s = this.svg();
        this.group = s.$('g');
        s.append(this.group);

        $(document.documentElement).on(ludo.util.getDragMoveEvent(), this.drag.bind(this));
        $(document.documentElement).on(ludo.util.getDragEndEvent(), this.endDrag.bind(this));
        this.clipPath = s.$('path');
        this.clipPath.set('fill', '#000');
        this.clipPath.set('fill-opacity', 0.6);
        this.clipPath.set('d', this.getClipPoints().join(" "));
        this.clipPath.set('fill-rule', 'evenodd');
        this.group.append(this.clipPath);

    },

    formUpdate: function (key, value) {
        var prev = this.cropArea[key];
        this.cropArea[key] = value * this.ratio;
        var diff = this.cropArea[key] - prev;
        if (key == 'x') {
            this.cropArea['width'] -= diff;
        } else if (key == 'y') {
            this.cropArea['height'] -= diff;
        }
        this.updateCoordinates();
    },

    getClipPoints: function () {
        if (this.clipPoints == undefined) {
            this.clipPoints = ['M', 0, 0, 'L', 3000, 0, 3000, 3000, 0, 3000,
                0, 0, 'M',
                0, 0, 'L',  // 13 14
                2000, 3000,  // 16 17
                0, 3000,  // 18 19
                2000, 3000, // 20 21
                2000, 3000, 'Z']; // 22 23
        }
        return this.clipPoints;
    },

    updateClipPath: function () {
        var x1 = this.cropArea.imageX + this.cropArea.x;
        var x2 = x1 + this.cropArea.width;
        var y1 = this.cropArea.imageY + this.cropArea.y;
        var y2 = y1 + this.cropArea.height;
        this.clipPoints[13] = this.clipPoints[22] = x1;
        this.clipPoints[14] = this.clipPoints[23] = y1;
        this.clipPoints[16] = x2;
        this.clipPoints[17] = y1;
        this.clipPoints[18] = x2;
        this.clipPoints[19] = y2;
        this.clipPoints[20] = x1;
        this.clipPoints[21] = y2;

        this.clipPath.set('d', this.clipPoints.join(' '));
    },

    setPicture: function (picture) {
        var s = this.getCanvas();
        if (this.imageNode == undefined) {
            this.imageNode = s.$('image');
            this.imageNode.on('load', this.imageLoaded.bind(this));
            this.group.append(this.imageNode);
            this.clipPath.toFront();
        }
        this.ratio = 1;
        this.imageNode.set('opacity', 0);
        this.imageNode.removeAttr('width');
        this.imageNode.removeAttr('height');
        this.imageNode.set('xlink:href', picture);
    },

    resize: function (size) {
        this.parent(size);
        if (this.size) {
            this.resizeAndPosition();
        }
    },

    resizeAndPosition: function () {
        this.resizePicture();
        this.positionPicture();


        if (this.cropArea == undefined) {
            this.cropArea = {
                imageX: this.imagePos.x,
                imageY: this.imagePos.y,
                imageWidth: this.imagePos.width,
                imageHeight: this.imagePos.height,
                x: 0, y: 0,
                width: this.imagePos.width,
                height: this.imagePos.height,
                ratio: this.ratio
            };
        } else {
            this.cropArea.imageX = this.imagePos.x;
            this.cropArea.imageY = this.imagePos.y;
            this.cropArea.imageHeight = this.imagePos.height;
            this.cropArea.imageWidth = this.imagePos.width;

            this.cropArea.x *= (this.ratio / this.cropArea.ratio);
            this.cropArea.y *= (this.ratio / this.cropArea.ratio);
            this.cropArea.width *= (this.ratio / this.cropArea.ratio);
            this.cropArea.height *= (this.ratio / this.cropArea.ratio);

            this.cropArea.ratio = this.ratio;
        }


        this.updateClipPath();

        this.fireEvent('cropArea', this.cropArea);
    },

    imageLoaded: function () {


        this.imageNode.set('opacity', 1);

        var bbox = this.imageNode.getBBox();
        this.size = {x: 0, y: 0, width: bbox.width, height: bbox.height};
        this.cropArea = undefined;

        this.createHandles();


        this.fireEvent('size', this.size);
        this.resizeAndPosition();

        this.updateCoordinates();


    },

    createHandles: function () {

        if (this.rect == undefined) {
            this.rect = new svgCrop.Rect({
                surface: this
            });
            this.rect.on('move', this.startDrag.bind(this));
        }


        if (this.handles == undefined) {
            this.handles = {};
            var orientations = ['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'];
            jQuery.each(orientations, function (i, orientation) {
                var h = this.handles[orientation] = new svgCrop.Handle({
                    orientation: orientation,
                    surface: this
                });
                h.on('start', this.startDrag.bind(this));
            }.bind(this));
        }
    },

    startDrag: function (action, event) {

        this.resizeAttr = {
            action: action,
            axis: (action == 'n' || action == 's') ? ['Y'] : action.length == 1 ? ['X'] : ['X', 'Y'],
            x: this.cropArea.x, y: this.cropArea.y,
            width: this.cropArea.width, height: this.cropArea.height,
            mouseX: event.pageX, mouseY: event.pageY,
            yAttr: (action.indexOf('n') >= 0) ? 'y' : 'height',
            xAttr: (action.indexOf('w') >= 0) ? 'x' : 'width'
        };

        this.resizeAttr = Object.merge(this.resizeAttr, this.getMinMaxDelta(action));

        if (this.resizeAttr.minX == 0 && this.resizeAttr.maxX == 0 && this.resizeAttr.minY == 0 && this.resizeAttr.maxY == 0) {
            this.resizeAttr = undefined;
        }
    },

    getMinMaxDelta: function (action) {
        var ret = {
            minX: 0, minY: 0, maxX: 0, maxY: 0
        };

        if (action == 'move') {
            ret.minX = -this.cropArea.x;
            ret.maxX = this.cropArea.imageWidth - this.cropArea.width - this.cropArea.x;
            ret.minY = -this.cropArea.y;
            ret.maxY = this.cropArea.imageHeight - this.cropArea.height - this.cropArea.y;
            return ret;
        }

        if (action.indexOf('w') >= 0) { /* Left side */
            ret.minX = -this.cropArea.x;
            ret.maxX = this.cropArea.width - 10; // 10 is min width of crop area
        } else if (action.indexOf('e') >= 0) { /* right side */
            ret.minX = -(this.cropArea.width) + 10;
            ret.maxX = this.cropArea.imageWidth - this.cropArea.width - this.cropArea.x;
        }

        if (action.indexOf('n') >= 0) {
            /** top */
            ret.minY = -this.cropArea.y;
            ret.maxY = this.cropArea.height - 10; // 10 is min width of crop area
        } else if (action.indexOf('s') >= 0) {
            ret.minY = -(this.cropArea.height) + 10;
            ret.maxY = this.cropArea.imageHeight - this.cropArea.height - this.cropArea.y;
        }

        return ret;
    },

    drag: function (event) {
        if (this.resizeAttr == undefined)return;

        var pX = event.pageX;
        var py = event.pageY;
        if (event.touches && event.touches.length > 0) {
            pX = event.touches[0].pageX;
            py = event.touches[0].pageY;
        }

        var deltaX = pX - this.resizeAttr.mouseX;
        var deltaY = py - this.resizeAttr.mouseY;

        deltaX = ludo.util.clamp(deltaX, this.resizeAttr.minX, this.resizeAttr.maxX);
        deltaY = ludo.util.clamp(deltaY, this.resizeAttr.minY, this.resizeAttr.maxY);

        if (this.resizeAttr.action == 'move') {
            this.cropArea.x = this.resizeAttr.x + deltaX;
            this.cropArea.y = this.resizeAttr.y + deltaY;

        } else {
            var xAttr = this.resizeAttr.xAttr;
            var yAttr = this.resizeAttr.yAttr;
            this.cropArea[xAttr] = this.resizeAttr[xAttr] + deltaX;
            this.cropArea[yAttr] = this.resizeAttr[yAttr] + deltaY;

            if (xAttr == 'x')this.cropArea['width'] = this.resizeAttr.width - deltaX;
            if (yAttr == 'y')this.cropArea['height'] = this.resizeAttr.height - deltaY;

        }

        this.updateCoordinates();


        return false; // To avoid selection of text etc on page.

    },

    updateCoordinates: function () {
        this.actualCropArea.x = Math.round(this.cropArea.x / this.ratio);
        this.actualCropArea.y = Math.round(this.cropArea.y / this.ratio);
        this.actualCropArea.width = Math.round(this.cropArea.width / this.ratio);
        this.actualCropArea.height = Math.round(this.cropArea.height / this.ratio);

        this.updateClipPath();

        this.fireEvent('cropArea', this.cropArea);

        this.fireEvent('crop', this.actualCropArea);

    },

    endDrag: function (event) {
        if (this.resizeAttr == undefined)return;

        this.resizeAttr = undefined;
    },

    resizePicture: function () {
        var s = this.getCanvas();
        this.ratio = Math.min((s.width - this.padding) / this.size.width, (s.height - this.padding) / this.size.height);
        if (this.ratio > 1)this.ratio = 1;

        this.imagePos.width = this.size.width * this.ratio;
        this.imagePos.height = this.size.height * this.ratio;

        this.imageNode.set('width', this.imagePos.width);
        this.imageNode.set('height', this.imagePos.height);
    },

    positionPicture: function () {
        var s = this.getCanvas();
        var x = s.width / 2 - (this.size.width * this.ratio) / 2;
        var y = s.height / 2 - (this.size.height * this.ratio) / 2;
        this.imagePos.x = x;
        this.imagePos.y = y;
        this.imageNode.setTranslate(x, y);
    }
});

svgCrop.Rect = new Class({
    Extends: Events,

    surface: undefined,

    node: undefined,

    initialize: function (config) {
        this.surface = config.surface;
        this.node = this.surface.svg().$('rect');
        this.node.set('stroke-dasharray', '1,5');
        this.node.set('stroke', '#000');
        this.node.set('fill-opacity', 0);
        this.node.css('cursor', 'move');
        this.surface.group.append(this.node);

        this.surface.on('cropArea', this.resize.bind(this));

        this.node.on(ludo.util.getDragStartEvent(), this.startMove.bind(this));
    },

    startMove: function (e) {
        this.fireEvent('move', ['move', e]);
    },

    resize: function (cropArea) {
        this.node.setProperties({
            x: cropArea.imageX + cropArea.x,
            y: cropArea.imageY + cropArea.y,
            width: cropArea.width,
            height: cropArea.height
        });
    }
});


svgCrop.Handle = new Class({
    Extends: Events,
    orientation: undefined,
    surface: undefined,

    node: undefined,
    initialize: function (config) {

        var hh = ludo.util.isTabletOrMobile();
        this.orientation = config.orientation;
        this.surface = config.surface;


        this.node = this.surface.getCanvas().$('circle', {
            r: hh ? 11: 5,
            cx:0,cy:0
        });

        /*
        this.node = this.surface.getCanvas().$('path', {
            d: this.getPath()
        });
        */
        this.node.css({
            'stroke-width': 1,
            'stroke': '#FFF'
        });
        this.node.set('fill-opacity', 0);
        this.node.css('cursor', this.getCursor());
        this.surface.group.append(this.node);

        var fn = this.getResizeFn();
        this.surface.on('cropArea', fn);

        this.node.on(ludo.util.getDragStartEvent(), this.start.bind(this));
    },

    getPath: function () {
        var hh = ludo.util.isTabletOrMobile();
        var r = hh ? 12 : 6;
        switch (this.orientation) {
            case 'n':
                return ['M', -r, 0, 'A', r, r, 180, 0, 1, r, 0].join(' ');
            case 's':
                return ['M', -r, 0, 'A', r, r, 180, 1, 0, r, 0].join(' ');
            case 'e':
                return ['M', 0, -r, 'A', r, r, 180, 0, 1, 0, r].join(' ');
            case 'w':
                return ['M', 0, -r, 'A', r, r, 180, 1, 0, 0, r].join(' ');
            case 'nw':
                return ['M', 0, r,
                    'A', r, r, 180, 0, 1, 0, -r,
                    'A', r, r, 90, 0, 1, r, 0].join(' ');
            case 'se':
                return ['M', 0, -r,
                    'A', r, r, 180, 0, 1, 0, r,
                    'A', r, r, 90, 0, 1, -r, 0].join(' ');
            case 'ne':
                return ['M', -r,0,
                    'A', r, r, 180, 0, 1, r, 0,
                    'A', r, r, 90, 0, 1, 0, r].join(' ');

            case 'sw':
                return ['M', r, 0,
                    'A', r, r, 180, 0, 1, -r, 0,
                    'A', r, r, 90, 0, 1, 0, -r].join(' ');

            default:
                return ['M', 0, 0, 'L', 1, 1].join(' ');
        }

    },

    start: function (e) {
        this.fireEvent('start', [this.orientation, e]);
    },

    getCursor: function () {
        var cursor = '';

        switch (this.orientation) {
            case 'n':
            case 's':
                cursor = 'ns';
                break;
            case 'w':
            case 'e':
                cursor = 'ew';
                break;
            case 'nw':
            case 'se':
                cursor = 'nwse';
                break;
            case 'ne':
            case 'sw':
                cursor = 'nesw';
                break;
        }
        return cursor + '-resize';
    },


    getResizeFn: function () {

        switch (this.orientation) {
            case 'nw':
                return function (area) {
                    this.node.setTranslate(area.x + area.imageX, area.y + area.imageY);
                }.bind(this);
            case 'n':
                return function (area) {
                    this.node.setTranslate(area.x + area.imageX + (area.width / 2), area.y + area.imageY);
                }.bind(this);
            case 'ne':
                return function (area) {
                    this.node.setTranslate(area.x + area.imageX + area.width, area.y + area.imageY);
                }.bind(this);
            case 'e':
                return function (area) {
                    this.node.setTranslate(area.x + area.imageX + area.width, area.y + area.imageY + (area.height / 2));
                }.bind(this);
            case 'w':
                return function (area) {
                    this.node.setTranslate(area.x + area.imageX, area.y + area.imageY + (area.height / 2));
                }.bind(this);
            case 'sw':
                return function (area) {
                    this.node.setTranslate(area.x + area.imageX, area.y + area.imageY + area.height);
                }.bind(this);
            case 's':
                return function (area) {
                    this.node.setTranslate(area.x + area.imageX + (area.width / 2), area.y + area.height + area.imageY);
                }.bind(this);
            case 'se':
                return function (area) {
                    this.node.setTranslate(area.x + area.imageX + area.width, area.y + area.height + area.imageY);
                }.bind(this);
        }
    },

    position: function (area) {
        var x = 0, y = 0;
        switch (this.orientation) {
            case 'nw':
                x = area.x;
                y = area.y;
                break;
            case 'n':
                x = area.x + (area.width / 2);
                y = area.y;
                break;
            case 'ne':
                x = area.x + area.width;
                y = area.y;
                break;
            case 'e':
                x = area.x + area.width;
                y = area.y + (area.height / 2);
                break;
        }

        this.node.setTranslate(x, y);
    }
});
