ludo.svg.Matrix = new Class({

    a: 1, b: 0, c: 0, d: 1, e: 0, f: 0,

    _translateCommited: [0, 0],

    matrix: undefined,

    node: undefined,

    transformationObject: undefined,

    currentRotation:undefined,

    initialize: function (node) {
        this.node = node;
        this.currentRotation = [0,0,0];
    },

    getScale:function(){
        var m = this.getSVGMatrix();
        return [m.a, m.d];
    },

    setScale:function(x,y){
        this.matrix = this.getSVGMatrix();
        this.matrix.a = x;
        this.matrix.d = arguments.length == 1 ? x : y;
        this.update();

    },

    scale:function(x,y){
        this.matrix = this.getSVGMatrix.scale(x,this.arguments.length == 1 ? x : y);
        this.update();
    },

    getTranslate: function () {
        var m = this.getSVGMatrix();
        return [m.e, m.f];
    },

    setTranslate:function(x,y){
        this.matrix = this.getSVGMatrix();
        this.matrix.e = x;
        this.matrix.f = y;
        this.update();
    },

    translate: function (x, y) {
        this.matrix = this.getSVGMatrix().translate(x,y);
        this.update();
    },

    getRotation:function(){
        return this.currentRotation;
    },

    setRotation:function(degrees, x, y){
        if(this.currentRotation != undefined){
            var a = this.currentRotation;
            this.rotate(-a[0], a[1], a[2]);
        }
        this.rotate(degrees, x, y);
    },

    rotate: function (degrees, x, y) {

        if(degrees < 0)degrees+=360;
        degrees  = degrees % 360;

        this.getSVGMatrix();

        if (arguments.length > 1) {
            this.matrix = this.matrix.translate(x, y);
        }

        this.matrix = this.matrix.rotate(degrees, x, y);

        if (arguments.length > 1) {
            this.matrix = this.matrix.translate(-x, -y);
        }

        this.currentRotation[0] = degrees;
        this.currentRotation[1] = x;
        this.currentRotation[2] = y;
        this.update();
    },

    commitTranslate: function () {
        this._translateCommited[0] = this.e;
        this._translateCommited[1] = this.f;
    },

    getSVGMatrix: function () {
        if (this.matrix == undefined) {
            this.matrix = ludo.svg.SVGElement.createSVGMatrix();
        }
        return this.matrix;
    },

    update: function () {
        this.getTransformObject().setMatrix(this.matrix);
    },

    getTransformObject: function () {
        if (this.transformationObject == undefined) {
            if (this.node.el.transform.baseVal.numberOfItems == 0) {
                var owner;
                if (this.node.el.ownerSVGElement) {
                    owner = this.node.el.ownerSVGElement;
                } else {
                    owner = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
                }
                var t = owner.createSVGTransform();
                this.node.el.transform.baseVal.appendItem(t);
            }
            this.transformationObject = this.node.el.transform.baseVal.getItem(0);
        }

        return this.transformationObject;
    }
});

ludo.svg.setGlobalMatrix = function (canvas) {
    ludo.svg.SVGElement = canvas;
    ludo.svg.globalMatrix = canvas.createSVGMatrix();
};