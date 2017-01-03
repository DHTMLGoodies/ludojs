/**
 * This class arranges child views in a row layout.
 * @namespace ludo.layout
 * @class ludo.layout.LinearHorizontal
 *
 */
ludo.layout.LinearHorizontal = new Class({
    Extends: ludo.layout.Linear,
    type: 'layout.Linear',
    resize: function () {
        var totalWidth = this.viewport.width;

        var height = this.hasDynamicHeight() ? 'auto' : this.viewport.height;
        if (height == 0) {
            return;
        }

        var totalWidthOfItems = 0;
        var totalWeight = 0;
        for (var i = 0; i < this.view.children.length; i++) {
            if (this.view.children[i].isVisible()) {
                if (!this.hasLayoutWeight(this.view.children[i])) {
                    var width = this.getWidthOf(this.view.children[i]);
                    if (width) {
                        totalWidthOfItems += width
                    }
                } else {
                    totalWeight += this.view.children[i].layout.weight;
                }
            }
        }
        totalWeight = Math.max(1, totalWeight);
        var remainingWidth;
        totalWidth = remainingWidth = totalWidth - totalWidthOfItems;

        var currentLeft = this.viewport.left;

        for (i = 0; i < this.view.children.length; i++) {
            var c = this.view.children[i];
            if (c.isVisible()) {
                var config = {'height': height, 'left': currentLeft};
                if (this.hasLayoutWeight(c)) {
                    if (c.id == this.idLastDynamic) {
                        config.width = remainingWidth;
                    } else {
                        config.width = Math.round(totalWidth * c.layout.weight / totalWeight);
                        remainingWidth -= config.width;
                    }
                } else {
                    config.width = this.getWidthOf(c);
                }

                this.resizeChild(c, config);
                currentLeft += config.width;
            }
        }

        for (i = 0; i < this.resizables.length; i++) {
            this.resizables[i].colResize();
        }
    },

    resizeChild: function (child, resize) {
        child.layout.width = resize.width;
        child.layout.left = resize.left;
        child.resize(resize);
        child.saveState();
    },

    onNewChild: function (child) {
        this.parent(child);
        child.getEl().css('position', 'absolute');

        if (this.isResizable(child)) {
            var isLastSibling = this.isLastSibling(child);
            var resizer = this.getResizableFor(child, isLastSibling ? 'left' : 'right');
            this.addChild(resizer, child, isLastSibling ? 'before' : 'after');
        }
    },

    hasDynamicHeight: function () {
        return this.view.layout.height && this.view.layout.height == 'dynamic';
    }
});