/**
 * Layout manager for items in a chart
 * @namespace chart
 * @class ludo.layout.Canvas
 * @augments layout.Relative
 */
ludo.layout.Canvas = new Class({
    Extends: ludo.layout.Relative,
    type:'layout.Canvas',

    addChild: function (child) {


        child = this.getValidChild(child);
        child = this.getNewComponent(child);


        this.view.children.push(child);

        var p = child.parentNode ? this.view : this.view.getCanvas();

        p.append(child);

        this.onNewChild(child);
        this.addChildEvents(child);

        this.fireEvent('addChild', [child, this]);


        return child;
    },

    /**
     * Add events to child view
     * @function addChildEvents
     * @param {ludo.View} child
     * @private
     */
    addChildEvents: function (child) {
        child.addEvent('hide', this.hideChild.bind(this));
        child.addEvent('show', this.clearTemporaryValues.bind(this));

    },

    /**
     * Position child at this coordinates
     * @function positionChild
     * @param {canvas.View} child
     * @param {String} property
     * @param {Number} value
     * @private
     */
    positionChild: function (child, property, value) {

        child[property] = value;
        this.currentTranslate[property] = value;
        child.position(this.currentTranslate.left, this.currentTranslate.top);
    },

    currentTranslate: {
        left: 0, top: 0
    },

    zIndexAdjusted: false,
    _rendered: false,

    resize: function () {
        this.parent();


        if (!this.zIndexAdjusted) {
            this.zIndexAdjusted = true;

            for (var i = 0; i < this.children.length; i++) {
                if (this.children[i].layout.zIndex != undefined) {
                    // TODO this needs to be refactored
                    var p = this.view.parentNode ? this.view.parentNode: this.view.getCanvas();
                    p.append(this.children[i]);
                }
            }
        }

        if (!this._rendered) {
            this._rendered = true;
            jQuery.each(this.view.children, function (i, child) {
                if (child.__rendered != undefined) {
                    child.__rendered();
                }
            });
        }

    },

    getAvailWidth: function () {
        if (!this.view.parentNode)return this.parent();
        return this.view.width;
    },

    getAvailHeight: function () {
        if (!this.view.parentNode)return this.parent();
        return this.view.height;
    },

    getParentForNewChild: function () {
        return this.view.node;
    }
});