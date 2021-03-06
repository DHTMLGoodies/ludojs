/***
 * Make View or DOM elements resizable
 * This class is mostly used internally in LudoJS when views are resizable.
 * @class ludo.effect.Resize
 * @namespace ludo.effect
 * @param {Object} config
 * @param {boolean} useShim True to use dotted rectangle when resizing. The view or DOM element will be resized on mouse/ up/touch end.
 * @param {Number} minX minimum x coordinate.
 * @param {Number} minY minimum y coordinate.
 * @param {Number} maxX maximum x coordinate.
 * @param {Number} maxY maximum y coordinate.
 * @param {Number} minWidth Minimum width.
 * @param {Number} maxWidth Maximum width.
 * @param {Number} minHeight Minimum height.
 * @param {Number} maxHeight Maximum height.
 * @param {Boolean} preserveAspectRatio Preserve aspect ratio while resizing.
 * @fires ludo.effect.Resize#start Fired when resizing starts. Param: {String} region
 * @fires ludo.effect.Resize#resize Fired during resize. CSS coordinates(Object with left,top.width,height) are passed as argument with the event.
 * @fires ludo.effect.Resize#stop Fired when resize ends. CSS coordinates(Object with left,top.width,height) are passed as argument with the event
 */
ludo.effect.Resize = new Class({
    Extends:ludo.Core,

    useShim:true,
    component:undefined,
    els:{
        shim:undefined,
        applyTo:undefined,
        handle:{}
    },

    minX:undefined,

    maxX:undefined,

    minWidth:undefined,

    maxWidth:undefined,

    minY:undefined,

    maxY:undefined,

    minHeight:undefined,

    maxHeight:undefined,


    preserveAspectRatio:false,

    aspectRatio:undefined,

    resizeKeys:{
        'e':['width'],
        's':['height'],
        'w':['left', 'width'],
        'n':['top', 'height'],
        'nw':['top', 'left', 'height', 'width'],
        'ne':['top', 'width', 'height'],
        'se':['width', 'height'],
        'sw':['left', 'height', 'width']
    },

    aspectRatioKeys:undefined,

    dragProperties:{
        active:false
    },

    xRegions:[
        ['w', 'nw', 'sw'],
        ['e', 'ne', 'se']
    ],
    yRegions:[
        ['n', 'nw', 'ne'],
        ['s', 'sw', 'se']
    ],

    aspectRatioMinMaxSet:false,

    __construct:function (config) {
        this.__params(config, ['useShim','minX','maxX','minY','maxY','maxWidth','minWidth','minHeight','maxHeight','preserveAspectRatio']);
        if (config.component) {
            this.component = config.component;
            this.els.applyTo = this.component.getEl();
        } else {
            this.els.applyTo = config.applyTo;
        }
        if (config.listeners)this.addEvents(config.listeners);
        this.addDragEvents();
        this.setDisplayPropertyOfEl.delay(100, this);
    },

    setDisplayPropertyOfEl:function () {
        var display = this.getEl().css('display');
        if (display !== 'absolute' && display !== 'relative') {
			if(Browser['ie'] && Browser.version < 9)return;
            this.getEl().css('display', 'relative');
        }
    },

    addDragEvents:function () {
        jQuery(document.body).on(ludo.util.getDragEndEvent(), this.stopResize.bind(this));
        jQuery(document.body).on(ludo.util.getDragMoveEvent(), this.resize.bind(this));
    },

    /**
     * Add resize handle to a region. A region can be
     * nw,n,ne,e,se,s,sw or w.
	 *
	 * A new DOM element will be created for the resize handle and injected into
	 * the resized DOM element.
     *
     * Second parameter cssClass is optional.
     * @function addHandle
     * @param {String} region
     * @param {String} cssClass
     * @return void
     * @memberof ludo.effect.Resize.prototype
     */

    addHandle:function (region, cssClass) {
        var el = this.els.handle[region] = jQuery('<div>');
        el.addClass('ludo-view-resize-el');
        el.addClass(this.getCssFor(region));
        if (cssClass)el.addClass(cssClass);
        el.html('<span></span>');
        el.css('cursor', this.cursor(region) + '-resize');
        el.attr('region', region);
        el.on(ludo.util.getDragStartEvent(), this.startResize.bind(this));
        this.els.applyTo.append(el);
    },

    startResize:function (e) {

        var region = jQuery(e.target).attr('region');

        this.fireEvent('start', region);

		ludo.EffectObject.start();

        var p = ludo.util.pageXY(e);

        this.dragProperties = {
            a:1,
            active:true,
            region:region,
            start:{ x:p.pageX, y:p.pageY },
            current:{x:p.pageX, y:p.pageY },
            el: this.getShimCoordinates(),
            minWidth:this.minWidth,
            maxWidth:this.maxWidth,
            minHeight:this.minHeight,
            maxHeight:this.maxHeight,
            area:this.getScalingFactors(),
            preserveAspectRatio: this.preserveAspectRatio ? this.preserveAspectRatio : e.shift ? true : false
        };
        if (this.preserveAspectRatio || e.shift) {
            this.setMinAndMax();
        }
        this.dragProperties.minX = this.getDragMinX();
        this.dragProperties.maxX = this.getDragMaxX();
        this.dragProperties.minY = this.getDragMinY();
        this.dragProperties.maxY = this.getDragMaxY();

        this.setBodyCursor();
        if (this.useShim) {
            this.showShim();
        }
        return ludo.util.isTabletOrMobile() ? false : undefined;

    },


    setMinAndMax:function () {
        var ratio = this.getAspectRatio();
        var d = this.dragProperties;
        if (ratio === 0)return;
        var minWidth, maxWidth, minHeight, maxHeight;

        if (this.maxWidth !== undefined)maxHeight = this.maxWidth / ratio;
        if (this.minWidth !== undefined)minHeight = this.minWidth / ratio;
        if (this.maxHeight !== undefined)maxWidth = this.maxHeight * ratio;
        if (this.minHeight !== undefined)minWidth = this.minHeight * ratio;

        var coords = this.getEl().offset();
        var absMaxWidth = this.$bWidth() - coords.left;
        var absMaxHeight = this.$bHeight() - coords.top;

        d.minWidth = Math.max(minWidth || 0, this.minWidth || 0);
        d.maxWidth = Math.min(maxWidth || absMaxWidth, this.maxWidth || absMaxWidth);
        d.minHeight = Math.max(minHeight || 0, this.minHeight || 0);
        d.maxHeight = Math.min(maxHeight || absMaxHeight, this.maxHeight || absMaxHeight);

        if (d.maxWidth / ratio > d.maxHeight)d.maxWidth = d.maxHeight * ratio;
        if (d.maxHeight * ratio > d.maxWidth)d.maxHeight = d.maxWidth / ratio;
    },

    getDragMinX:function () {
        var ret, d = this.dragProperties, r = d.region;
        if (d.maxWidth !== undefined && this.xRegions[0].indexOf(r) >= 0) {
            ret = d.el.left + d.el.width - d.maxWidth;
        } else if (d.minWidth !== undefined && this.xRegions[1].indexOf(r) >= 0) {
            ret = d.el.left + d.minWidth;
        }
        if (this.minX !== undefined) {
            if (ret == undefined)ret = this.minX; else ret = Math.max(ret, this.minX);
        }
        return ret;
    },

    getDragMaxX:function () {
        var ret, d = this.dragProperties, r = d.region;
        if (d.minWidth !== undefined && this.xRegions[0].indexOf(r) >= 0) {
            ret = d.el.left + d.el.width - d.minWidth;
        } else if (d.maxWidth !== undefined && this.xRegions[1].indexOf(r) >= 0) {
            ret = d.el.left + d.maxWidth;
        }
        if (this.maxX !== undefined) {
            if (ret == undefined)ret = this.maxX; else ret = Math.min(ret, this.maxX);
        }
        return ret;
    },

    getDragMinY:function () {
        var ret, d = this.dragProperties, r = d.region;
        if (d.maxHeight !== undefined && this.yRegions[0].indexOf(r) >= 0) {
            ret = d.el.top + d.el.height - d.maxHeight;
        } else if (d.minHeight !== undefined && this.yRegions[1].indexOf(r) >= 0) {
            ret = d.el.top + d.minHeight;
        }
        if (this.minY !== undefined) {
            if (ret == undefined)ret = this.minY; else ret = Math.max(ret, this.minY);
        }
        return ret;
    },

    getDragMaxY:function () {

        var ret, d = this.dragProperties, r = d.region;
        if (d.minHeight !== undefined && this.yRegions[0].indexOf(r) >= 0) {
            ret = d.el.top + d.el.height - d.minHeight;
        } else if (d.maxHeight !== undefined && this.yRegions[1].indexOf(r) >= 0) {
            ret = d.el.top + d.maxHeight;
        }
        if (this.maxY !== undefined) {
            if (ret == undefined)ret = this.maxY; else ret = Math.min(ret, this.maxY);
        }
        return ret;
    },

    cursor:function(region){
        var r = region;
        if(r == 'n' || r == 's')r = 'ns';
        if(r == 'w' || r == 'e')r = 'we';
        if(r == 'se' ||r == 'nw')r = 'nwse';
        if(r == 'ne' ||r == 'sw')r = 'nesw';
        return r;
    },

    setBodyCursor:function () {

        jQuery(document.body).css('cursor', this.cursor(this.dragProperties.region) + '-resize');
    },

    revertBodyCursor:function () {
        jQuery(document.body).css('cursor', 'default');
    },

    resize:function (e) {
        if (this.dragProperties.active) {
            this.dragProperties.current = this.getCurrentCoordinates(e);
            var coordinates = this.getCoordinates();

            this.fireEvent('resize', coordinates);

            if (this.useShim) {
                this.els.shim.css(coordinates);
            } else {
                this.getEl().css(coordinates);
            }
        }
    },

    getCurrentCoordinates:function (e) {
        var p = ludo.util.pageXY(e);
        var ret = {x:p.pageX, y:p.pageY };
        var d = this.dragProperties;
        if(d.preserveAspectRatio && d.region.length === 2)return ret;
        if (d.minX !== undefined && ret.x < d.minX)ret.x = d.minX;
        if (d.maxX !== undefined && ret.x > d.maxX)ret.x = d.maxX;
        if (d.minY !== undefined && ret.y < d.minY)ret.y = d.minY;
        if (d.maxY !== undefined && ret.y > d.maxY)ret.y = d.maxY;
        return ret;
    },


    getCoordinates:function () {
        var d = this.dragProperties;
        var keys = this.resizeKeys[d.region];
        var ret = {};

        if (!d.preserveAspectRatio || d.region.length === 1) {
            for (var i = 0; i < keys.length; i++) {
                ret[keys[i]] = this.getCoordinate(keys[i]);
            }
        }

        if (d.preserveAspectRatio) {
            switch (d.region) {
                case 'e':
                case 'w':
                    ret.height = ret.width / this.aspectRatio;
                    break;
                case 'n':
                case 's':
                    ret.width = ret.height * this.aspectRatio;
                    break;
                default:
                    var scaleFactor = this.getScaleFactor();
                    ret.width = d.el.width * scaleFactor;
                    ret.height = d.el.height * scaleFactor;
                    if(d.region == 'ne' || d.region =='nw'){
                        ret.top = d.el.top + d.el.height - ret.height;
                    }
                    if(d.region == 'nw' || d.region == 'sw'){
                        ret.left = d.el.left + d.el.width - ret.width;
                    }
                    ret.width += this.getBWOfShim();
                    ret.height += this.getBHOfShim();
                    break;
            }
        }
        return ret;
    },

    getScaleFactor:function () {
        var d = this.dragProperties;
        var r = d.region;
        var factor;

        var offsetX = (d.current.x - d.start.x) * d.area.xFactor / d.area.sum;
        var offsetY = (d.current.y - d.start.y) * d.area.yFactor / d.area.sum;
        switch (r) {
            case 'se':
                factor = 1 + offsetX + offsetY;
                break;
            case 'ne':
                factor = 1 + offsetX + offsetY * -1;
                break;
            case 'nw':
                factor = 1 + offsetX * -1 + offsetY * -1;
                break;
            case 'sw':
                factor = 1 + offsetX * -1 + offsetY;
                break;


        }
        if (d.minWidth) {
            factor = Math.max(factor, d.minWidth / d.el.width);
        }
        if (d.minHeight) {
            factor = Math.max(factor, d.minHeight / d.el.height);
        }
        if (d.maxWidth) {
            factor = Math.min(factor, d.maxWidth / d.el.width);
        }
        if (d.maxHeight) {
            factor = Math.min(factor, d.maxHeight / d.el.height);
        }
        return factor;

    },

    getCoordinate:function (key) {
        var r = this.dragProperties.region;
        var d = this.dragProperties;
        switch (key) {
            case 'width':
                if (r == 'e' || r == 'ne' || r == 'se') {
                    return d.el.width - d.start.x + d.current.x + this.getBWOfShim();
                } else {
                    return d.el.width + d.start.x - d.current.x + this.getBWOfShim();
                }
                break;
            case 'height':
                if (r == 's' || r == 'sw' || r == 'se') {
                    return d.el.height - d.start.y + d.current.y + this.getBHOfShim();
                } else {
                    return d.el.height + d.start.y - d.current.y + this.getBHOfShim();
                }
            case 'top':
                if (r == 'n' || r == 'nw' || r == 'ne') {
                    return d.el.top - d.start.y + d.current.y;
                } else {
                    return d.el.top + d.start.y - d.current.y;
                }
            case 'left':
                if (r == 'w' || r == 'nw' || r == 'sw') {
                    return d.el.left - d.start.x + d.current.x;
                } else {
                    return d.el.left + d.start.x - d.current.x;
                }
        }
        return undefined;
    },

    getBWOfShim:function () {
        if (this.useShim) {
            return ludo.dom.getBW(this.getShim());
        }
        return 0;
    },

    getBHOfShim:function () {
        if (this.useShim) {
            return ludo.dom.getBH(this.getShim());
        }
        return 0;
    },

    stopResize:function () {
        if (this.dragProperties.active) {
            this.dragProperties.active = false;

            this.fireEvent('stop', this.getCoordinates());
			ludo.EffectObject.end();
            this.revertBodyCursor();
            if (this.useShim) {
                this.hideShim();
            }
        }
    },

    getCssFor:function (region) {
        return 'ludo-view-resize-region-' + region;
    },

    showShim:function () {
        var shim = this.getShim();
        var coords = this.getShimCoordinates();
        shim.css({
            display:'',
            left:coords.left,
            top:coords.top,
            width:coords.width,
            height:coords.height
        });
    },

    hideShim:function () {
        this.getShim().css('display', 'none');
    },

    getShimCoordinates:function () {
        var el = this.getEl();
        var coords = el.offset();
        coords.width = el.outerWidth();
        coords.height = el.outerHeight();

        if (this.useShim) {
            var shim = this.getShim();
            coords.width -= ludo.dom.getBW(shim);
            coords.height -= ludo.dom.getBH(shim);
        }
        return coords;
    },

    getShim:function () {
        if (!this.els.shim) {
            var el = this.els.shim = jQuery('<div>');
            el.addClass('ludo-shim-resize');
            el.css({
                position:'absolute',
                'z-index':50000
            });
            jQuery(document.body).append(el);
        }

        return this.els.shim;
    },
    getEl:function () {
        return this.els.applyTo;
    },

    hideAllHandles:function () {
        this.setHandleDisplay('none');
    },
    showAllHandles:function () {
        this.setHandleDisplay('');
    },

    setHandleDisplay:function (display) {
        for (var key in this.els.handle) {
            if (this.els.handle.hasOwnProperty(key)) {
                this.els.handle[key].css('display', display);
            }
        }
    },

    getAspectRatio:function () {
        if (this.aspectRatio === undefined) {
            this.aspectRatio = this.getEl().width() / this.getEl().height();
        }
        return this.aspectRatio;
    },

    $bWidth:function () {
        return jQuery(document.documentElement).width();
    },
    $bHeight:function () {
        return jQuery(document.documentElement).height();
    },

    getScalingFactors:function () {
        var size = { x: this.getEl().width(), y: this.getEl().height() };
        return {
            xFactor:size.x / size.y,
            yFactor:size.y / size.x,
            sum:size.x + size.y
        };
    }
});