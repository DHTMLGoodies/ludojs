/**
 * The ViewPager layout displays one child view at a time. You can swipe between pages or
 * go to a specific page using code.
 *
 * For demo, see <a href="../demo/layout/view-pager.php" onclick="var w = window.open(this.href);return false">View Pager demo</a>
 * @namespace ludo.layout
 * @class ludo.layout.ViewPager
 * @param {Object} config
 * @param {Boolean} config.dragging - True to support support page navigation with mouse and touch drag events. Default: true
 * @param {Boolean} config.animate - Animate transition between pages. Default: true
 * @param {Number} config.animationDuration - Duration of animation in milliseconds(1/1000s), Default: 250
 * @param {String} config.orientation - Orientation of child views, horizontal or vertical. When orientation is horizontal
 * you swipe left and right to switch between child views. With linear orientation, you swipe up and down.
 * @property {Number} count Count child views
 * @property {Number} selectedIndex Index of currently selected child view
 * @fires ludo.layout.ViewPager#showpage - Event fired when a page is displayed. To add listeners, add a listeners object to your layout.
 * Example: <code>layout:{ type:'ViewPager', listeners: { "showpage": function(){ } }}</code>
 * @fires ludo.layout.ViewPager#lowerpage - Navigated back to a one of it's previous sibling views. Many of these events are useful for toggling buttons(enable/disable).
 * @fires ludo.layout.ViewPager#higherpage - Navigated to one of it's next sibling views
 * @fires ludo.layout.ViewPager#lastpage - Navigated to last child view
 * @fires ludo.layout.ViewPager#notlastpage - Navigated to a child view which is not last.
 * @fires ludo.layout.ViewPager#firstpage - Navigated to first child view
 * @fires ludo.layout.ViewPager#notfirstpage - Navigated to a page which is different than first child view.
 * @fires ludo.layout.ViewPager#valid - Fired when all form views on current shown child view is valid
 * @fires ludo.layout.ViewPager#invalid - Fired when visible child view has a form view with invalid value.
 *
 */
ludo.layout.ViewPager = new Class({
    Extends: ludo.layout.Base,
    lastIndex:undefined,
    /**
     * Index of selected page
     * @property {Number} selectedIndex
     * @memberof ludo.layout.ViewPager.prototype
     */
    selectedIndex: undefined,
    animate: true,
    initialAnimate: false,
    animationDuration: 250,
    touch: {},
    dragging: true,
    orientation: 'horizontal',
    parentDiv: undefined,
    /**
     * Number of child views/pages in view pager layout
     * @property {Number} count
     * @memberof ludo.layout.ViewPager.prototype
     */
    count : undefined,


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
            this.parentDiv = jQuery('<div style="position:absolute"></div>');
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

    afterRendered:function(){
        this.triggerEvents();
    },

    makeViewsVisible: function (index) {
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
        this.count = this.view.children.length;
    },

    addDragEvents: function (child) {

    },

    resize: function () {
        for (var i = 0; i < this.view.children.length; i++) {
            var v = this.view.children[i];
            if (!v.hidden) {
                this.positionPage(v);
                v.resize({height: this.viewport.height, width: this.viewport.width});
            }
        }

        this.parentDiv.css(this.getAnimation(this.selectedIndex));

    },

    getVisiblePage: function () {
        return this.view.children[this.selectedIndex];
    },

    /**
     * Show previous card of current visible card
     * @function previousPage
     * @param {Boolean} animate Animate transition. Optional parameter, default: true
     * @return {Boolean} success
     * @memberof ludo.layout.ViewPager.prototype
     */
    previousPage: function (animate) {
        return this.goToPage(this.selectedIndex-1, animate);
    },

    /**
     * Go to a specific page index(0 = first page)
     * @memberof ludo.layout.ViewPager.prototype
     * @param {Number} pageIndex page index
     * @param {Boolean} animate Animate transition, Optional parameter, default true
     * @returns {boolean} navigation successful. will return false on invalid index.
     */
    goToPage:function(pageIndex, animate){
        if(animate == undefined)animate = this.animate;
        if(!animate)this.temporaryDisableAnimation();
        if(pageIndex < 0 || pageIndex >= this.view.children.length)return false;
        this.setVisiblePageIndex(pageIndex);
        this.animateToSelected();
        this.makeViewsVisible(pageIndex);
        this.resetAnimation();
        return true;
    },

    animateToSelected: function () {
        this.animateTo(this.selectedIndex);
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
     * @function nextPage
     * @memberof ludo.layout.ViewPager.prototype
     * @param {Boolean} animate Animate transition, default: true
     * @return {Boolean} success
     */
    nextPage: function (animate) {
        return this.goToPage(this.selectedIndex+1);
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
     * @memberof ludo.layout.ViewPager.prototype
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

        this.lastIndex = this.selectedIndex || 0;

        this.selectedIndex = pageIndex;

        this.addValidationEvents();
        if(this.hasBeenRendered()){
            this.triggerEvents();
        }
    },

    triggerEvents:function(){
        var page = this.getVisiblePage();

        var payload = [this, this.view, page];
        var indexDiff = this.selectedIndex - this.lastIndex;
        if (indexDiff > 0) {
            this.fireEvent('higherpage', payload);
        } else if (indexDiff < 0) {
            this.fireEvent('lowerpage', payload);
        }
        this.fireEvent('showpage', payload);

        if (this.selectedIndex == this.count-1) {
            this.fireEvent('lastpage', payload);
        } else {
            this.fireEvent('notlastpage', payload);
        }
        if (this.selectedIndex == 0) {
            this.fireEvent('firstpage', payload);
        }
        else {
            this.fireEvent('notfirstpage', payload);
        }
    },

    removeValidationEvents: function () {
        if (this.selectedIndex != undefined && this.validFn) {
            var f = this.getVisiblePage().getForm();
            if(f != undefined){
                f.off('invalid', this.validFn);
                f.off('valid', this.invalidFn);
            }
        }
    },

    validFn:undefined,
    invalidFn:undefined,

    addValidationEvents: function () {
        if(this.validFn == undefined){
            this.validFn = this.setValid.bind(this);
            this.invalidFn = this.setInvalid.bind(this);
        }

        var f = this.getVisiblePage().getForm();
        f.on('invalid', this.invalidFn );
        f.on('valid', this.validFn);
        f.validate();
    },
    setInvalid: function () {
        console.log('set invalid', arguments);
        this.fireEvent('invalid', [this, this.view, this.view.children[this.selectedIndex]]);
    },

    setValid: function () {
        console.log('set valid', arguments);
        this.fireEvent('valid', [this, this.view, this.view.children[this.selectedIndex]]);
    },

    isFormValid:function(){
        var v = this.getVisiblePage();
        if(v == undefined)return true;
        var f = v.getForm();
        if(f != undefined)return f.isValid();
        return true;
    },

    /**
     * Go to first child view
     * @function showFirstPage
     * @memberof ludo.layout.ViewPager.prototype
     * @return void
     */
    showFirstPage: function () {
        if (this.count > 0)this.goToPage(0);
    },
    /**
     * Go to last page
     * @function showLastPage
     * @memberof ludo.layout.ViewPager.prototype
     * @return void
     */
    showLastPage: function () {
        this.goToPage(this.count-1);
    },

    animationComplete: function (el) {
        el.css({
            left: 0, top: 0, borderWidth: 0
        });

    },

    touchStart: function (e) {

        if (this.isOnFormElement(e.target))return undefined;


        var isValid = this.view.children[this.selectedIndex].getForm().isValid();
        if (!isValid && this.selectedIndex == 0) {
            return undefined;
        }

        var animateX = this.orientation == 'horizontal';
        var parentSize = animateX ? this.viewport.width : this.viewport.height;

        var min = 0;
        if(this.selectedIndex < this.view.children.length-1 && isValid){
            min = (parentSize * -1);
        }
        var max = this.selectedIndex > 0 ? parentSize : 0;


        this.touch = {
            active: true,
            pos: animateX ? this.touchPosParent(e).pageX : this.touchPosParent(e).pageY,
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
                pos = this.touchPosParent(e).pageX - this.touch.pos;
                key = 'left';
            } else {
                pos = this.touchPosParent(e).pageY - this.touch.pos;
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

    touchPosParent:function(e){
        return e.pageX != undefined ? e : e.originalEvent.touches[0];
    },

    setZIndexOfOtherPages: function (pos) {
    },

    touchEnd: function () {
        if (this.touch.active) {
            this.touch.active = false;
            var pos = this.touch.previousPos;
            if (pos > 0 && this.touch.max && pos > (this.touch.max / 2)) {
                this.previousPage();
            } else if (pos < 0 && pos < (this.touch.min / 2)) {
                this.nextPage();
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
