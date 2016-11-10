/**
 * The ViewPager layout displays one child view at a time. You can swipe between pages or
 * go to a specific page using code.
 * @namespace ludo.layout
 * @class ludo.layout.ViewPager
 * @param {Object} config
 * @param {Boolean} config.dragging - True to support support page navigation with mouse and touch drag events. Default: true
 * @param {Boolean} config.animate - Animate transition between pages. Default: true
 * @param {Number} config.animationDuration - Duration of animation in milliseconds(1/1000s), Default: 250
 * @param {String} config.orientation - Orientation of child views, horizontal or vertical. When orientation is horizontal
 * you swipe left and right to switch between child views. With linear orientation, you swipe up and down.
 *
 *
 */
ludo.layout.ViewPager = new Class({
    Extends: ludo.layout.Base,
    visiblePageIndex: undefined,
    animate: true,
    initialAnimate: false,
    animationDuration: 250,
    touch: {},
    dragging: true,
    orientation: 'horizontal',

    parentDiv: undefined,


    onCreate: function () {
        this.parent();
        var l = this.view.layout;

        if (l.animate !== undefined)this.animate = l.animate;
        if (l.dragging !== undefined)this.dragging = l.dragging;
        if (l.animationDuration !== undefined)this.animationDuration = l.animationDuration;
        if (l.orientation !== undefined)this.orientation = l.orientation;
        this.initialAnimate = this.animate;

        this.view.getEventEl().on(ludo.util.getDragMoveEvent(), this.touchMove.bind(this));
        this.view.getEventEl().on(ludo.util.getDragEndEvent(), this.touchEnd.bind(this));

    },

    getParentForNewChild: function () {
        if (this.parentDiv == undefined) {
            this.parentDiv = $('<div style="position:absolute"></div>');
            this.view.getBody().append(this.parentDiv);
            this.parentDiv.on(ludo.util.getDragStartEvent(), this.touchStart.bind(this));
        }
        return this.parentDiv;
    },


    beforeFirstResize: function () {
        this.resizeParentDiv();
        var selectedIndex = 0;
        for (var i = 0; i < this.view.children.length; i++) {
            if (this.view.children[i].layout.visible) {
                selectedIndex = i;
            }
        }
        this.makeViewsVisible(selectedIndex);
        this.setVisiblePageIndex(selectedIndex);
    },

    makeViewsVisible: function (index) {
        console.log(index);
        this.view.children[index].show();
        if (index > 0) {
            this.view.children[index - 1].show();
        }
        if (index < this.view.children.length - 1) {
            this.view.children[index + 1].show();
        }
    },


    resizeParentDiv: function () {
        if (this.parentDiv == undefined)return;

        var w = this.viewport.width * (this.orientation == 'horizontal' ? this.view.children.length : 1);
        var h = this.viewport.height * (this.orientation == 'vertical' ? this.view.children.length : 1);

        this.parentDiv.css({
            width: w, height: h
        });
    },

    addChild: function (child, insertAt, pos) {
        child.layout = child.layout || {};
        if (!child.layout.visible)child.hidden = true;
        child.layout.width = this.viewport.width;
        child.layout.height = this.viewport.height;
        child.layout.viewPagerIndex = this.view.children.length;

        var ret = this.parent(child, insertAt, pos);
        this.resizeParentDiv();

        return ret;
    },
    onNewChild: function (child) {

        child.getEl().css('position', 'absolute');
        child.addEvent('show', this.onChildShow.bind(this));
        child.addEvent('render', this.onPageRender.bind(this));

        child.applyTo = this.view;
        if (this.dragging)this.addDragEvents(child);
    },

    onChildShow: function (child) {
        this.positionPage(child);
    },

    addDragEvents: function (child) {

    },

    resize: function () {
        for (var i = 0; i < this.view.children.length; i++) {
            var v = this.view.children[i];
            if (!v.hidden) {
                v.resize({height: this.viewport.height, width: this.viewport.width});
            }
        }

        this.positionPage(this.getVisiblePage());

        this.parentDiv.css(this.getAnimation(this.visiblePageIndex));

    },

    getVisiblePage: function () {
        return this.view.children[this.visiblePageIndex];
    },

    shouldSetPageVisible: function (page) {
        return page.layout && page.layout.visible == true;
    },

    /**
     * Show previous card of current visible card
     * @function showPreviousPage
     * @param {Boolean} skipAnimation (optional)
     * @return {Boolean} success
     */
    showPreviousPage: function (skipAnimation) {
        return this.goToPage(this.visiblePageIndex-1);
    },

    goToPage:function(pageIndex){
        if(pageIndex < 0 || pageIndex >= this.view.children.length)return false;
        this.setVisiblePageIndex(pageIndex);
        this.animateToSelected();
        this.makeViewsVisible(pageIndex);
        return true;
    },

    animateToSelected: function () {
        this.animateTo(this.visiblePageIndex);
    },

    animateTo: function (childIndex) {
        this.parentDiv.animate(this.getAnimation(childIndex), this.animationDuration);
    },

    getAnimation: function (childIndex) {
        var ret = {};
        var key = this.orientation == 'horizontal' ? 'left' : 'top';
        ret[key] = this.getParentPos(childIndex);
        return ret;
    },

    getParentPos: function (childIndex) {
        return this.orientation == 'horizontal' ? this.viewport.width * childIndex * -1 : this.viewport.height * childIndex;
    },


    /**
     * Show next card of current visible card
     * @function showNextPage
     * @param {Boolean} skipAnimation (optional)
     * @return {Boolean} success
     */
    showNextPage: function (animate) {
        return this.goToPage(this.visiblePageIndex+1);
    },


    temporaryDisableAnimation: function () {
        this.animate = false;
        this.resetAnimation.delay(500, this);
    },

    resetAnimation: function () {
        this.animate = this.initialAnimate;
    },

    /**
     * Show Child View with this name
     * @function showPage
     * @param {String} name
     * @return {Boolean} success
     */
    showPage: function (name) {
        var c = this.view.child[name];
        if (c != undefined) {
            var i = this.view.children.indexOf(c);
            this.setVisiblePageIndex(i);
            this.animateToSelected();
            return true;
        }
        return false;
    },
    /**
     * Return true if passed card is last card in deck
     * @function isLastPage
     * @param {View} page
     * @return Boolean
     */
    isLastPage: function (page) {
        return this.view.children.indexOf(page) == this.view.children.length - 1;
    },
    /**
     * Return true if passed card is first card in deck
     * @function isFirstPage
     * @param  {View} page
     * @return {Boolean}
     */
    isFirstPage: function (page) {
        return this.view.children.indexOf(page) == 0;
    },

    onPageRender: function (page) {
        page.resize({
            width: this.viewport.width,
            height: this.viewport.height
        });
    },

    positionPage: function (page) {
        var prop = this.orientation == 'horizontal' ? 'left' : 'top';
        var size = this.orientation == 'horizontal' ? this.viewport.width : this.viewport.height;
        var val = size * page.layout.viewPagerIndex;
        page.getEl().css(prop, val);
    },

    setVisiblePageIndex: function (pageIndex) {


        this.removeValidationEvents();

        var indexDiff = 0;
        if (this.visiblePageIndex != undefined) {
            indexDiff = pageIndex - this.visiblePageIndex;
        }

        this.visiblePageIndex = pageIndex;

        this.addValidationEvents();

        var page = this.getVisiblePage();

        if (indexDiff > 0) {
            /**
             * Event fired when a higher card than current is shown
             * @event higherpage
             * @param {layout.Page} this deck
             * @param {View} shown card
             */
            this.fireEvent('higherpage', [this, page]);
        } else if (indexDiff < 0) {
            /**
             * Event fired when a lower card than current is shown
             * @event lowerpage
             * @param {layout.Page} this deck
             * @param {View} shown card
             */
            this.fireEvent('lowerpage', [this, page]);
        }

        /**
         * Event fired when a card is shown
         * @event showpage
         * @param {layout.Page} this deck
         * @param {View} shown card
         */
        this.fireEvent('showpage', [this, this.visiblePage]);

        if (this.isLastPage(page)) {
            /**
             * Event fired when last card of deck is shown
             * @event lastpage
             * @param {layout.Page} this card
             * @param {View} shown card
             */
            this.fireEvent('lastpage', [this, page]);
        } else {
            /**
             * Event fired when na card which is not the last card in the deck is shown
             * @event notlastpage
             * @param {layout.Page} this card
             * @param {View} shown card
             */
            this.fireEvent('notlastpage', [this, page]);
        }
        if (this.isFirstPage(page)) {
            /**
             * Event fired when first card of deck is shown
             * @event firstpage
             * @param {layout.Page} this card
             * @param {View} shown card
             */
            this.fireEvent('firstpage', [this, page]);
        }
        else {
            /**
             * Event fired when a card which is not the first card in the deck is shown
             * @event notfirstpage
             * @param {layout.Page} this card
             * @param {View} shown card
             */
            this.fireEvent('notfirstpage', [this, page]);
        }
    },

    removeValidationEvents: function () {
        if (this.visiblePageIndex != undefined) {
            this.getVisiblePage().removeEvent('invalid', this.setInvalid);
            this.getVisiblePage().removeEvent('valid', this.setValid);
        }
    },

    addValidationEvents: function () {
        var manager = this.getVisiblePage().getForm();
        manager.addEvent('invalid', this.setInvalid.bind(this));
        manager.addEvent('valid', this.setValid.bind(this));
        manager.validate();
    },
    setInvalid: function () {
        this.fireEvent('invalid', this);
    },

    setValid: function () {
        this.fireEvent('valid', this);
    },
    /**
     * Show first card in deck
     * @function showFirstPage
     * @return void
     */
    showFirstPage: function () {
        if (this.view.children.length > 0)this.goToPage(0);
    },
    /**
     * Show last card in deck
     * @function showLastPage
     * @return void
     */
    showLastPage: function () {
        this.goToPage(this.view.children.length-1);
    },

    /**
     * Returns true if form of current card is valid
     * @function isValid
     * @public
     * @return {Boolean}
     */
    isValid: function () {
        if (this.visiblePage) {
            return this.visiblePage.getForm().isValid();
        }
        return true;
    },
    /**
     * Return number of cards in deck
     * @function getCountPages
     * @return {Number} count cards
     */
    getCountPages: function () {
        return this.view.children.length;
    },
    /**
     * Return index of visible card
     * @function getIndexOfVisiblePage
     * @return {Number} card index
     */
    getIndexOfVisiblePage: function () {
        return this.visiblePage ? this.view.children.indexOf(this.visiblePage) : 0;
    },

    /**
     * true if first card in deck is shown.
     * @function isOnFirstPage
     * @return {Boolean} is on first card
     */
    isOnFirstPage: function () {
        return this.getIndexOfVisiblePage() == 0;
    },
    /**
     * true if last card in deck is shown.
     * @function isOnLastPage
     * @return {Boolean} is on last card
     */
    isOnLastPage: function () {
        return this.getIndexOfVisiblePage() == this.view.children.length - 1;
    },

    /**
     * Returns percentage position of current visible card.
     * @function getPercentCompleted
     * @return {Number} percent
     */
    getPercentCompleted: function () {
        return Math.round((this.getIndexOfVisiblePage() + 1 ) / this.view.children.length * 100);
    },

    animateHigherPage: function () {
        if (this.animate) {
            if (this.orientation == 'horizontal') {
                this.animateFromRight();
            } else {
                this.animateFromBottom();
            }
        }
    },

    animationStart: function () {
        // TODO apply shadow or border during dragging and animation.
    },

    animationComplete: function (el) {

        el.css({
            left: 0, top: 0, borderWidth: 0
        });

    },

    touchStart: function (e) {
        if (this.isOnFormElement(e.target))return undefined;
        var isFirstPage = this.visiblePageIndex == 0;
        var isValid = this.view.children[this.visiblePageIndex].getForm().isValid();
        if (!isValid && isFirstPage) {
            return undefined;
        }

        var animateX = this.orientation == 'horizontal';
        var parentSize = animateX ? this.viewport.width : this.viewport.height;

        var min = this.visiblePageIndex < this.view.children.length-1 ? (parentSize * -1) : 0;
        var max = this.visiblePageIndex > 0 ? parentSize : 0;


        this.touch = {
            active: true,
            pos: animateX ? e.pageX : e.pageY,
            animateX: animateX,
            min: min,
            max: max,
            currentPos: this.parentDiv.position(),
            previousPos: 0
        };
        if (e.target.tagName.toLowerCase() == 'img') {
            return false;
        }
        return false;
    },


    touchMove: function (e) {
        if (this.touch && this.touch.active) {
            var pos;
            var key;
            if (this.touch.animateX) {
                pos = e.pageX - this.touch.pos;
                key = 'left';
            } else {
                pos = e.pageY - this.touch.pos;
                key = 'top'
            }

            pos = Math.min(pos, this.touch.max);
            pos = Math.max(pos, (this.touch.min));

            this.setZIndexOfOtherPages(pos);
            this.touch.previousPos = pos;

            pos += this.touch.currentPos[key];

            this.parentDiv.css(key, pos + 'px');
            return false;
        }
        return undefined;
    },

    setZIndexOfOtherPages: function (pos) {
    },

    touchEnd: function () {
        if (this.touch.active) {
            this.touch.active = false;
            var pos = this.touch.previousPos;
            if (pos > 0 && this.touch.max && pos > (this.touch.max / 2)) {
                this.showPreviousPage();
            } else if (pos < 0 && pos < (this.touch.min / 2)) {
                this.showNextPage();
            } else {
                this.animateToSelected();
            }
        }
    },

    isOnFormElement: function (el) {
        var tag = el.tagName.toLowerCase();
        return tag == 'input' || tag == 'textarea' || tag === 'select';
    }
});
