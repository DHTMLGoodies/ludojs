/**
 * Special SVG 'g' element which can be positioned and
 * sized using the layout.Canvas layout model.
 * @namespace canvas
 * @class Group
 */
ludo.canvas.Group = new Class({
    Extends:ludo.canvas.Element,
    tag:'g',
    layout:{},

    ludoConfig:function (config) {
        this.parent(config);
        this.setConfigParams(config, ['layout','css','renderTo','parentComponent']);
        this.renderTo.adopt(this);

        if(this.css){
            this.node.setStyles(this.css);
        }
    },

    resize:function (coordinates) {
        if (coordinates.width){
            this.width = coordinates.width;
            this.set('width', coordinates.width + 'px');
        }
        if(coordinates.height){
            this.height = coordinates.height;
            this.set('height', coordinates.height + 'px');
        }
    },

    isHidden:function () {
        return false;
    }
});