/**
 * ListView
 * Class rendering an array of JSON objects in a list.
 *
 * For demo, see <a href="../demo/list-view.php">list.php</a>
 *
 * The list view depends on a <a href="data-source_collection.js.html">collection data source</a>. To update items in the list view during runtime,
 * update the datasource. To remove items from the list view, remove the item from the data source.
 *
 * @class ludo.ListView
 * @param {Object} config
 * @param {Boolean} config.swipable True to support swiping of items to the left and/or right
 * @param {Function} config.itemRenderer Function returning HTML for a list item. You may skip the renderer by creating a string template(tpl) instead
 * @param {String} config.tpl Alternative to config.itemRenderer. This is a template string for all the records where you use curly braces to reference properties,
 * example: '<div>{firstname} {lastname}</div>'
 * @param {Function} config.backSideLeft Function returning html which is displayed behind the list item when swiping to the left(Optional)
 * @param {Function} config.backSideRight Function returning html which is displayed behind the list item when swiping to the right(Optional)
 * @param {Function} config.backSideUndo Optional function returning html for the undo which may be displayed after swiping. On click the swipe
 * will be undone and the list item displayed as normal. If backSideUndo is defined, the swipe events(swipeLeft, swipeRight and swipe) will not
 * be triggered until the config.undoTimeout has elapsed.
 * @parma {Number} config.undoTimeout Visibility of undo background in milliseconds. When the undo background is not clicked the swipe events
 * will be fired.
 * @fires ludo.ListView#swipe Fired after swiping left or right. Arguments: 1) JSON Object/record
 * @fires ludo.ListView#swipeRight Fired after swiping right. Arguments: 1) JSON Object/record
 * @fires ludo.ListView#swipeLeft Fired after swiping left. Arguments: 1) JSON Object/record
 */
ludo.ListView = new Class({
    type: 'ListView',
    Extends: ludo.CollectionView,
    defaultDS: 'dataSource.Collection',
    overflow: 'auto',
    highlighted: undefined,
    recordMap: {},

    dragAttr: undefined,

    swipable: false,

    itemHeight: 0,

    availHeight: undefined,

    scrollTop: 0,
    lastScrollTop: 0,
    indexFirstVisible: 0,
    indexLastVisible: 0,

    outOfBounds: false,

    itemsRendered: false,
    itemRenderer: undefined,
    backSideLeft: undefined,
    backSideRight: undefined,
    backSideUndo: undefined,
    undoTimeout: 2000,
    didUndo: false,

    scrollId: undefined,

    renderedMap: undefined,

    __construct: function (config) {
        this.parent(config);
        this.setConfigParams(config, ['swipable', 'itemRenderer', 'backSideLeft', 'backSideRight', 'backSideUndo', 'undoTimeout']);
        this.renderedMap = {};
        this.on('rendered', this.render.bind(this));

    },

    ludoEvents: function () {
        this.parent();
        this.getBody().on('click', this.onClick.bind(this));
    },

    __rendered: function () {
        this.parent();


        if (this.swipable) {
            $(document.body).on(ludo.util.getDragMoveEvent(), this.drag.bind(this));
            $(document.body).on(ludo.util.getDragEndEvent(), this.dragEnd.bind(this));

        }

        this.getEl().addClass('ludo-list-view');
        this.getBody().addClass('ludo-list-view-body');
        this.getBody().css('overflow-x', 'hidden');
        this.getBody().on('scroll', this.onScroll.bind(this));
        if (this.dataSource) {

            this.getDataSource().addEvents({
                'change': this.render.bind(this),
                'select': this.select.bind(this),
                'deselect': this.deselect.bind(this),
                'update': this.update.bind(this),
                'delete': this.remove.bind(this)
            });
        }
    },

    onScroll: function () {
        this.lastScrollTop = this.scrollTop;
        this.scrollTop = this.getBody().scrollTop();
        this.lazyRender();
    },

    lazyRender: function () {
        var count = this.getDataSource().getCount();
        var index;
        this.outOfBounds = false;
        var d = this.getDataSource().getData();

        var rec, dom, html;
        var countRecords = (Math.round(this.availHeight / this.itemHeight) * 3);

        index = Math.max(0, this.indexFirstVisible + 1);
        while (this.outOfBounds != 1 && index < count) {
            rec = d[index];
            if (!this.renderedMap[rec.uid]) {
                dom = this.getRecordContainer(rec);
                this.checkOutOfBounds(dom);
                if (!this.outOfBounds) {
                    html = this.itemRenderer != undefined ? this.itemRenderer.call(this, rec) : this.getTplParser().getCompiled(rec, this.tpl)[0];
                    this.addInnerDOM(dom, rec, html);
                    this.indexLastVisible = index;
                    this.indexFirstVisible = index - countRecords;
                }
            }
            index++;
        }

        this.outOfBounds = false;
        index = this.indexLastVisible - 1;

        while (this.outOfBounds != -1 && index >= 0) {
            rec = d[index];

            if (!this.renderedMap[rec.uid]) {
                dom = this.getRecordContainer(rec);
                this.checkOutOfBounds(dom);

                if (!this.outOfBounds) {
                    html = this.itemRenderer != undefined ? this.itemRenderer.call(this, rec) : this.getTplParser().getCompiled(rec, this.tpl)[0];
                    this.addInnerDOM(dom, rec, html);
                    this.indexFirstVisible = index;
                    this.indexLastVisible = Math.min(count, index + countRecords);
                }
            }
            index--;
        }

    },

    startDrag: function (e) {
        var el = this.getDragDom(e.target);
        var p = ludo.util.pageXY(e);
        var pos = el.position();
        var width = el.outerWidth(true);

        this.dragAttr = {
            backLeft: el.parent().find('.ludo-list-item-back-left'),
            backRight: el.parent().find('.ludo-list-item-back-right'),
            backUndo: el.parent().find('.ludo-list-item-back-undo'),
            recordUid: this.getRecordId(el),
            elPos: pos,
            mouse: p,
            el: el,
            parent: this.getRecordDOM(e.target),
            minX: -width + pos.left,
            maxX: width - pos.left,
            lastX: pos.left,
            dragged:false
        };

        el.parent().find('.ludo-list-item-back-undo').css('z-index', 0);
    },
    drag: function (e) {
        if (this.dragAttr == undefined)return;

        var p = ludo.util.pageXY(e);

        var x = p.x - this.dragAttr.mouse.x + this.dragAttr.elPos.left;
        var y = p.y - this.dragAttr.mouse.y + this.dragAttr.elPos.top;

        if(!this.dragAttr.dragged && Math.abs(y) > Math.abs(x)){
            this.dragAttr = undefined;
            return undefined;
        }
        
        x = ludo.util.clamp(x, this.dragAttr.minX, this.dragAttr.maxX);
        var zl, zr;
        if (x > 0 && this.dragAttr.lastX <= 0) {
            zl = 2;
            zr = 1;
        } else if (x < 0 && this.dragAttr.lastX >= 0) {
            zl = 1;
            zr = 2;
        }
        this.dragAttr.backLeft.css('z-index', zl);
        this.dragAttr.backRight.css('z-index', zr);
        this.dragAttr.lastX = x;
        this.dragAttr.el.css('left', x);
        this.dragAttr.dragged = true;


        return false;
    },

    onUndoTimeout: function (e, rec) {
        if (!this.didUndo) {
            this.fireEvent('swipe', rec);
            this.fireEvent(e, rec);
        }
    },

    dragEnd: function () {
        if (this.dragAttr == undefined)return;

        var center = this.dragAttr.el.outerWidth(true) / 2;
        var pos = this.dragAttr.el.position();

        if (pos.left > center * 1.2 || pos.left < -center * 1.2) {
            var el = this.dragAttr.parent;
            var uid = this.dragAttr.recordUid;
            var mult = pos.left > 0 ? 1 : -1;
            var rec = this.getDataSource().find({uid: uid});
            var e = mult < 0 ? 'swipeLeft' : 'swipeRight';

            this.didUndo = false;

            var u = this.dragAttr.backUndo;
            var fn;
            if (u.length) {
                fn = function () {
                    u.css('z-index', 3);
                    this.onUndoTimeout.delay(this.undoTimeout, this, [e, rec]);
                }.bind(this);
            } else {
                fn = function () {
                    this.fireEvent('swipe', rec);
                    this.fireEvent(e, rec);
                }.bind(this);
            }

            this.dragAttr.el.animate({
                left: el.outerWidth(true) * mult
            }, {
                duration: 100,
                complete: fn
            });

        } else {
            this.dragAttr.el.animate({
                left: 0
            }, {
                duration: 100
            });

        }
        this.dragAttr = undefined;
    },

    remove: function (rec) {
        var uid = rec.uid != undefined ? rec.uid : rec;
        var el = this.getDOMForRecord(uid);
        if (el == undefined)return;
        el.css('visibility', 'hidden');
        el.animate({
            height: 0
        }, {
            complete: function () {
                el.remove();
                this.indexLastVisible--;
                this.lazyRender();
            }.bind(this)
        });

        this.recordMap[uid] = undefined;
    },

    resize: function (size) {
        this.parent(size);
        this.availHeight = this.getBody().height();

        if (this.itemsRendered) {
            this.lazyRender();
        }
    },


    render: function () {
        this.parent();

        if (this.availHeight == undefined) {
            this.availHeight = this.getBody().height();
        }
        var s = new Date().getTime();
        this.parent();
        var b = this.nodeContainer();
        b.html('');
        this.recordMap = {};

        if (!this.dataSourceObj || !this.dataSourceObj.hasData()) {
            return;
        }

        var d = this.getDataSource().getData();
        var htmlArray = this.getTplParser().getCompiled(d, this.tpl);

        this.indexFirstVisible = undefined;
        this.indexLastVisible = undefined;
        this.outOfBounds = false;


        jQuery.each(d, function (i, item) {
            var html = this.itemsRendered != undefined ? this.itemRenderer.call(this, item) : htmlArray[i];
            this.renderItem(i, item, html, b);

        }.bind(this));

        var selected = this.getDataSource().getSelectedRecord();
        if (selected) {
            this.select(selected);
        }

        this.itemsRendered = true;

        ludo.util.log('time to render list ' + (new Date().getTime() - s));
    },

    renderItem: function (i, item, html) {
        if (this.indexFirstVisible == undefined) {
            this.indexFirstVisible = i;
        }


        var dom = this.itemDOM(item, html);

        if (this.itemHeight == 0) {
            this.itemHeight = dom.outerHeight(true);
        }


        if (!this.outOfBounds) {
            this.checkOutOfBounds(dom);
        }

        if (!this.outOfBounds) {
            this.indexLastVisible = i;
        }

    },

    checkOutOfBounds: function (dom) {
        var top = dom[0].offsetTop != undefined ? dom[0].offsetTop : dom.position().top;
        if (top < this.scrollTop - this.itemHeight)this.outOfBounds = -1;
        else this.outOfBounds = top > this.scrollTop + this.availHeight ? 1 : false;
    },

    getRecordContainer: function (record) {
        var id = 'list-' + record.uid;
        if (this.recordMap[record.uid] == undefined) {
            var el = $('<div class="ludo-list-item" style="cursor:pointer" id="' + id + '"></div>');
            this.recordMap[record.uid] = id;
            this._nodeContainer.append(el);
            return el;
        }
        return $('#' + id);
    },


    itemDOM: function (item, html) {
        var el = this.getRecordContainer(item);
        if (!this.outOfBounds) {
            this.addInnerDOM(el, item, html);
        } else {
            el.css('height', this.itemHeight);
        }

        return el;
    },

    /**
     * Undo swipe. This method can be called when the list item is swiped to the left
     * or right. It cannot be called after a record has been removed from the data source
     * using dataSource.remove.
     *
     * @function undoSwipe
     * @param {Object|String} record record object or record.uid(unique id)
     * @memberof ludo.ListView.prototype
     */
    undoSwipe: function (record) {
        this.didUndo = true;
        var dom = this.getDOMForRecord(record);
        dom.find('.ludo-list-item-front').animate({'left': 0}, {duration:100});
    },

    addInnerDOM: function (parent, record, html) {

        this.renderedMap[record.uid] = true;

        if (this.backSideLeft != undefined) {
            var l = this.backSideLeft(record);
            if (l != undefined) {
                var ln = $('<div class="ludo-list-item-back-left"></div>');
                ln.append($(l));
                parent.append(ln);
            }
        }

        if (this.backSideRight != undefined) {
            var r = this.backSideRight(record);
            var rn = $('<div class="ludo-list-item-back-right"></div>');
            rn.append($(r));
            parent.append(rn);
        }

        if (this.backSideUndo != undefined) {
            var u = this.backSideUndo(record);
            var un = $('<div class="ludo-list-item-back-undo"></div>');
            un.append($(u));
            parent.append(un);
            var vId = this.id;
            var uid = record.uid;
            var fn = function () {
                var v = ludo.$(vId);
                v.undoSwipe(uid);
            };
            un.on('click', fn);

        }


        var div = $('<div></div>');
        div.addClass('ludo-list-item-front');
        div.append($(html));

        parent.append(div);

        parent.mouseenter(this.enter.bind(this));
        parent.mouseleave(this.leave.bind(this));

        if (this.swipable) {
            div.on(ludo.util.getDragStartEvent(), this.startDrag.bind(this));
        }

        parent.css('height', 'auto');
    },


    enter: function (e) {
        var el = this.getRecordDOM(e.target);
        if (el)el.addClass('ludo-list-item-highlighted');
    },

    leave: function (e) {
        var el = this.getRecordDOM(e.target);
        if (el)el.removeClass('ludo-list-item-highlighted');
    },

    getDragDom: function (el) {
        el = $(el);
        if (!el.hasClass('ludo-list-item-front')) {
            el = el.closest('.ludo-list-item-front');
        }
        return el;
    },

    getRecordDOM: function (el) {
        el = $(el);
        if (!el.hasClass('ludo-list-item')) {
            el = el.closest('.ludo-list-item');
        }
        return el.length > 0 ? el : undefined;
    },

    getRecordId: function (el) {
        el = this.getRecordDOM(el);
        if (el) {

            return el.attr("id").replace('list-', '');
        }
        return undefined;
    },

    getDOMForRecord: function (record) {
        var uid = record.uid || record;
        return this.recordMap[uid] ? $('#' + this.recordMap[uid]) : undefined;

    },

    select: function (record) {
        var el = this.getDOMForRecord(record);
        if (el)el.addClass('ludo-list-item-selected');
    },

    deselect: function (record) {
        var el = this.getDOMForRecord(record);
        if (el)el.removeClass('ludo-list-item-selected');
    },

    update: function (record) {
        var el = this.getDOMForRecord(record);
        if (el) {
            var html = this.itemRenderer != undefined ? this.itemRenderer.call(this, record) : this.getTplParser().asString(record, this.tpl);
            el.find('.ludo-list-item-front').html(html);
        }
    },

    onClick: function (e) {
        var recId = this.getRecordId($(e.target));
        if (recId)this.getDataSource().getRecord(recId).select();
    }
});