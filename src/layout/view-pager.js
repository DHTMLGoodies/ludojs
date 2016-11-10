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
    Extends:ludo.layout.Base,
    visiblePage:undefined,
    animate:true,
    initialAnimate:false,
    animationDuration:.25,
    touch:{},
    dragging:true,
    orientation:'horizontal',

    onCreate:function () {
        this.parent();
        var l = this.view.layout;

        if (l.animate !== undefined)this.animate = l.animate;
        if (l.dragging !== undefined)this.dragging = l.dragging;
        if (l.animationDuration !== undefined)this.animationDuration = l.animationDuration;
        if (l.orientation !== undefined)this.orientation = l.orientation;
        this.initialAnimate = this.animate;

        if (this.animate) {
            this.addEvent('higherpage', this.animateHigherPage.bind(this));
            this.addEvent('lowerpage', this.animateLowerPage.bind(this));
        }
    },
    addChild:function (child, insertAt, pos) {
        if (!child.layout || !child.layout.visible)child.hidden = true;
        return this.parent(child, insertAt, pos);
    },
    onNewChild:function (child) {
        this.parent(child);
        child.getEl().css('position', 'absolute');
        child.addEvent('show', this.setVisiblePage.bind(this));
        child.applyTo = this.view;
        if (this.shouldSetPageVisible(child)) {
            this.visiblePage = child;
            child.show();
        }
        if(this.dragging)this.addDragEvents(child);
    },

    addDragEvents:function (child) {
        child.getBody().on(ludo.util.getDragStartEvent(), this.touchStart.bind(this));
        child.getEventEl().on(ludo.util.getDragMoveEvent(), this.touchMove.bind(this));
        child.getEventEl().on(ludo.util.getDragEndEvent(), this.touchEnd.bind(this));
    },

    resize:function () {
        if (this.visiblePage === undefined) {
            this.view.children[0].show();
        }
        var height = this.view.getBody().height();
        var width = this.view.getBody().width();
        if (this.visiblePage) {
            this.visiblePage.resize({ height:height, width:width });
        }
    },

    getVisiblePage:function () {
        return this.visiblePage;
    },

    shouldSetPageVisible:function (page) {
        return page.layout && page.layout.visible == true;
    },

    /**
     * Return reference to previus card of passed card
     * @function getPreviousPageOf
     * @param {View} view
     * @return View
     */
    getPreviousPageOf:function (view) {
        var index = this.view.children.indexOf(view);
        return index > 0 ? this.view.children[index - 1] : undefined;
    },

    getNextPageOf:function (page) {
        var index = this.view.children.indexOf(page);
        return index < this.view.children.length - 1 ? this.view.children[index + 1] : undefined;
    },

    /**
     * Show previous card of current visible card
     * @function showPreviousPage
     * @param {Boolean} skipAnimation (optional)
     * @return {Boolean} success
     */
    showPreviousPage:function (skipAnimation) {
        if (skipAnimation) {
            this.temporaryDisableAnimation();
        }
        if (this.visiblePage) {
            var page = this.getPreviousPageOf(this.visiblePage);
            if (page) {
                page.show();
                return true;
            }
        }
        return false;
    },

    /**
     * Show next card of current visible card
     * @function showNextPage
     * @param {Boolean} skipAnimation (optional)
     * @return {Boolean} success
     */
    showNextPage:function (skipAnimation) {
        if (skipAnimation) {
            this.temporaryDisableAnimation();
        }
        if (this.visiblePage) {
            var page = this.getNextPageOf(this.visiblePage);
            if (page) {
                page.show();
                return true;
            }
        }
        return false;
    },


    temporaryDisableAnimation:function () {
        this.animate = false;
        this.resetAnimation.delay(500, this);
    },

    resetAnimation:function () {
        this.animate = this.initialAnimate;
    },

    setTemporaryZIndexOfVisiblePage:function () {
        var zIndex = ludo.util.getNewZIndex(this.visiblePage);
        this.visiblePage.getEl().css('zIndex',  zIndex + 100);
    },

    /**
     * Show a card with this name
     * @function showPage
     * @param {String} name
     * @return {Boolean} success
     */
    showPage:function (name) {
        if (this.view.child[name]) {
            this.view.child[name].show();
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
    isLastPage:function (page) {
        return this.view.children.indexOf(page) == this.view.children.length - 1;
    },
    /**
     * Return true if passed card is first card in deck
     * @function isFirstPage
     * @param  {View} page
     * @return {Boolean}
     */
    isFirstPage:function (page) {
        return this.view.children.indexOf(page) == 0;
    },

    setVisiblePage:function (page) {

        this.removeValidationEvents();

        var indexDiff = 0;
        if (this.visiblePage) {
            var indexOld = this.view.children.indexOf(this.visiblePage);
            var indexNew = this.view.children.indexOf(page);
            indexDiff = indexNew - indexOld;
        }

        this.visiblePage = page;

        this.addValidationEvents();

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

    removeValidationEvents:function () {
        if (this.visiblePage) {
            this.visiblePage.removeEvent('invalid', this.setInvalid);
            this.visiblePage.removeEvent('valid', this.setValid);
        }
    },

    addValidationEvents:function () {
        var manager = this.visiblePage.getForm();
        manager.addEvent('invalid', this.setInvalid.bind(this));
        manager.addEvent('valid', this.setValid.bind(this));
        manager.validate();
    },
    setInvalid:function () {
        this.fireEvent('invalid', this);
    },

    setValid:function () {
        this.fireEvent('valid', this);
    },
    /**
     * Show first card in deck
     * @function showFirstPage
     * @return void
     */
    showFirstPage:function () {
        if (this.view.children.length > 0)this.view.children[0].show();
    },
    /**
     * Show last card in deck
     * @function showLastPage
     * @return void
     */
    showLastPage:function () {
        if (this.view.children.length > 0)this.view.children[this.view.children.length - 1].show();
    },

    /**
     * Returns true if form of current card is valid
     * @function isValid
     * @public
     * @return {Boolean}
     */
    isValid:function () {
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
    getCountPages:function () {
        return this.view.children.length;
    },
    /**
     * Return index of visible card
     * @function getIndexOfVisiblePage
     * @return {Number} card index
     */
    getIndexOfVisiblePage:function () {
        return this.visiblePage ? this.view.children.indexOf(this.visiblePage) : 0;
    },

    /**
     * true if first card in deck is shown.
     * @function isOnFirstPage
     * @return {Boolean} is on first card
     */
    isOnFirstPage:function () {
        return this.getIndexOfVisiblePage() == 0;
    },
    /**
     * true if last card in deck is shown.
     * @function isOnLastPage
     * @return {Boolean} is on last card
     */
    isOnLastPage:function () {
        return this.getIndexOfVisiblePage() == this.view.children.length - 1;
    },

    /**
     * Returns percentage position of current visible card.
     * @function getPercentCompleted
     * @return {Number} percent
     */
    getPercentCompleted:function () {
        return Math.round((this.getIndexOfVisiblePage() + 1 ) / this.view.children.length * 100);
    },

    animateHigherPage:function () {
        if(this.animate){
            if (this.orientation=='horizontal') {
                this.animateFromRight();
            } else {
                this.animateFromBottom();
            }
        }
    },

    animateLowerPage:function () {
        if(this.animate){
            if (this.orientation=='horizontal') {
                this.animateFromLeft();
            } else {
                this.animateFromTop();
            }
        }
    },

    animateFromRight:function () {
        this.animateAlongX(this.visiblePage.getParent().getBody().width(), 0);
    },

    animateFromLeft:function () {
        this.animateAlongX(this.visiblePage.getParent().getBody().width() * -1, 0);
    },

    animateFromTop:function () {
        this.animateAlongY(this.visiblePage.getParent().getBody().height() * -1, 0);
    },

    animateFromBottom:function () {
        this.animateAlongY(this.visiblePage.getParent().getBody().height(), 0);
    },

    animateAlongX:function (from, to) {
        this.visiblePage.getEl().css('left', from + 'px');
        var el = this.visiblePage.getEl();
        this.visiblePage.getEl().animate({
            left: to
        }, this.animationDuration, function(){
            el.css({
                left:0,top:0,borderWidth:0
            });
        });
    },

    animateAlongY:function (from, to) {
        this.visiblePage.getEl().css('top', from + 'px');

        var el = this.visiblePage.getEl();
        this.visiblePage.getEl().animate({
            top: to
        }, this.animationDuration, function(){
            el.css({
                top:0,top:0,borderWidth:0
            });
        });
        /*
         this.getFx().start({
         'top':[from, to]
         });*/
    },

    animationStart:function(){
        // TODO apply shadow or border during dragging and animation.
    },

    animationComplete:function (el) {

        el.css({
            left:0,top:0,borderWidth:0
        });

    },

    touchStart:function (e) {
        if (this.isOnFormElement(e.target))return undefined;
        var isFirstPage = this.isFirstPage(this.visiblePage);
        var isValid = this.visiblePage.getForm().isValid();
        if (!isValid && isFirstPage) {
            return undefined;
        }

        var isLastPage = this.isLastPage(this.visiblePage);
        this.renderNextAndPreviousPage();
        var animateX = this.orientation=='horizontal';
        var parentSize = animateX ? this.view.getEl().width() : this.view.getEl().height();
        this.touch = {
            active:true,
            pos:animateX ? e.pageX : e.pageY,
            previousPage:this.getPreviousPageOf(this.visiblePage),
            nextPage:this.getNextPageOf(this.visiblePage),
            animateX:animateX,
            zIndex:this.visiblePage.getEl().css('z-index'),
            max:isFirstPage ? 0 : parentSize,
            min:(isLastPage || !isValid) ? 0 : parentSize * -1,
            previousPos:0
        };
        if (e.target.tagName.toLowerCase() == 'img') {
            return false;
        }
        return false;
    },


    touchMove:function (e) {
        if (this.touch && this.touch.active) {
            var pos;
            var key;
            if (this.touch.animateX) {
                pos = e.pageX - this.touch.pos;
                key = 'left';
            } else {
                pos = e.pageY- this.touch.pos;
                key = 'top'
            }

            pos = Math.min(pos, this.touch.max);
            pos = Math.max(pos, (this.touch.min));

            this.setZIndexOfOtherPages(pos);
            this.touch.previousPos = pos;

            this.visiblePage.getEl().css(key, pos + 'px');
            return false;
        }
        return undefined;
    },

    setZIndexOfOtherPages:function (pos) {
        if (pos > 0 && this.touch.previousPos <= 0) {
            if (this.touch.nextPage) {
                this.touch.nextPage.getEl().css('zIndex', (this.touch.zIndex - 3));
            }
            if (this.touch.previousPage) {
                this.touch.previousPage.getEl().css('zIndex', this.touch.zIndex - 1);
            }
        } else if (pos < 0 && this.touch.previousPos >= 0) {
            if (this.touch.nextPage) {
                this.touch.nextPage.getEl().css('zIndex', this.touch.zIndex - 1);
            }
            if (this.touch.previousPage) {
                this.touch.previousPage.getEl().css('zIndex', this.touch.zIndex - 3);
            }
        }
    },

    touchEnd:function () {
        if (this.touch.active) {
            this.touch.active = false;
            var pos = this.touch.previousPos;
            if (pos > 0 && this.touch.max && pos > (this.touch.max / 2)) {
                this.animateToPrevious();
            } else if (pos < 0 && pos < (this.touch.min / 2)) {
                this.animateToNext();
            } else {
                this.visiblePage.getEl().css((this.touch.animateX ? 'left' : 'top'), 0);
            }
        }
    },

    isOnFormElement:function (el) {
        var tag = el.tagName.toLowerCase();
        return tag == 'input' || tag == 'textarea'  || tag === 'select';
    },

    renderNextAndPreviousPage:function () {
        this.setTemporaryZIndexOfVisiblePage();

        var id = this.visiblePage.id;

        this.temporaryDisableAnimation();
        var card;
        var skipEvents = true;
        if (card = this.getPreviousPageOf(ludo.get(id))) {
            card.show(skipEvents);
        }
        if (card = this.getNextPageOf(ludo.get(id))) {
            card.show(skipEvents);
        }
        ludo.get(id).show();

    },

    animateToPrevious:function () {
        var pos= this.visiblePage.getEl().position();
        if (this.touch.animateX) {
            this.animateAlongX(pos.left, this.view.getEl().width());
        } else {
            this.animateAlongY(pos.top, this.view.getEl().height());
        }
        this.showPreviousPage.delay(this.animationDuration, this, true);
    },

    animateToNext:function () {
        var pos= this.visiblePage.getEl().position();
        if (this.touch.animateX) {
            this.animateAlongX(pos.left, this.view.getEl().width() * -1);
        } else {
            this.animateAlongY(pos.top, this.view.getEl().height() * -1);
        }
        this.showNextPage.delay(this.animationDuration, this, true);
    }
});
