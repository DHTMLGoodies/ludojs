/**
 * SVG Group DOM node which can be positioned as a child view
 * in the relative layout.
 * @namespace canvas
 * @class ludo.canvas.Group
 */
ludo.canvas.Group = new Class({
    Extends:ludo.canvas.View,
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

    isHidden:function () {
        return false;
    }
});