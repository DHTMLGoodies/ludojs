/**
 * SVG Group DOM node which can be positioned as a child view
 * in the relative layout.
 * @namespace canvas
 * @class ludo.svg.Group
 */
ludo.svg.Group = new Class({
    Extends:ludo.svg.View,
    tag:'g',
    layout:{},

    __construct:function (config) {
        this.parent(config);
        this.setConfigParams(config, ['layout', 'renderTo', 'parentComponent']);
        if (this.renderTo) {
            this.renderTo.append(this);
        }

        if (config.css) {
            this.node.css(this.css);
        }
    },

    rendered:function(){
        
    },
    
    resize:function (coordinates) {
        if (coordinates.width) {
            this.width = coordinates.width;
            this.set('width', coordinates.width + 'px');
        }
        if (coordinates.height) {
            this.height = coordinates.height;
            this.set('height', coordinates.height + 'px');
        }
    },

    getSize:function () {
        return {
            x:this.width || this.renderTo.width(),
            y:this.height || this.renderTo.height()
        }
    },

    getCenter:function(){
        var s = this.getSize();
        return {
            x : s.x / 2, y: s.y / 2
        }
    },

    isHidden:function () {
        return false;
    }
});