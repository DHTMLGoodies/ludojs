/**
 * This layout will render children in an Accordion. For a demo, see
 * <a href="../demo/layout/accordion.php" onclick="var w=window.open(this.href);return false">accordion demo</a>
 * @class ludo.layout.Accordion
 * @param {object} layout Layout config properties
 * @param {String} layout.type Set "type" to "accordion" on a parent view to render children in an accordion layout.
 * @param {String} layout.easing Easing for the animation. Default: "swing". easing is used for jQuery.animate, so any easing properties you have
 * available in jQuery or jQuery plugins are available here.
 * @param {number} layout.duration Duration of accordion animation in milliseconds(1/1000s).
 * @param {String} layout.title Option for child views inside an accordion layout. This is the title for the clickable title bar for each child view.
 * @example
 var w = new ludo.Window({
        title:'Accordion layout',
        layout:{
            left:50, top:50,
            width:700, height:600,
            type:'accordion',
            easing: 'linear',
            duration: 300
        },
        children:[
            {
                title: 'Drawing', // Title for the accordion
                html: '<img src="../images/drawing.png" style="margin-right:5px;margin-bottom:5px;float:left">' +
                'This is a Charcoal drawing on Smooth Newsprint paper. <br>',
                css:{ // CSS styling for the view
                    padding:5,
                    'font-size' : '1.2em',
                    'overflow-y': 'auto'
                }
            },
            {
                title: 'Second Accordion View',// Title for the accordion
                html: 'Second Accordion',
                css:{
                    padding:5
                }
            },
            {
                title: 'Source Code',// Title for the accordion
                type:'SourceCodePreview',
                css:{
                    padding:5
                }
            }
        ]
    });
 */

ludo.layout.Accordion = new Class({
    Extends: ludo.layout.Base,
    easing: 'swing',
    titleEls: undefined,
    titleHeight: undefined,


    expandedView: undefined,
    expandedChild: undefined,
    expandedTitle: undefined,

    childIndex: 0,

    duration: 200,
    busy: false,

    onCreate: function () {
        this.parent();
        var l = this.view.layout;
        if (l.easing != undefined)this.easing = l.easing;
        if (l.duration != undefined)this.duration = l.duration;
        this.titleEls = [];

    },

    addChild: function (child, insertAt, pos) {
        if (child.layout == undefined)child.layout = {};
        child.layout.index = this.childIndex++;

        return this.parent(child, insertAt, pos);
    },

    addChildEvents:function(child){
        child.addEvent('show', this.onShowHide.bind(this));
        child.addEvent('hide', this.onShowHide.bind(this));
    },

    onShowHide:function(child){

        var id = child.id;

        var style = child.hidden ? "none": "";


        $('#accordion-title-' + id).css('display', style);
        $('#accordion-' + id).css('display', style);

        this.measureTitleHeight();
        this.resize();


        if(!child.hidden)this.expandChild(id);

        if(id == this.expandedChild){
            this.expandedChild = this.firstExpanded();
            this.expandChild(this.expandedChild );
        }

    },

    onNewChild:function(child){
        this.parent(child);
        if(this.hasBeenRendered()){
            this.measureTitleHeight();
            this.resize();
        }
    },

    getParentForNewChild: function (child) {
        var el = $('<div class="ludo-framed-view-titlebar ludo-accordion-titlebar"></div>');

        var title = $('<div class="ludo-framed-view-titlebar-title ludo-accordion-title"></div>');
        var expand = $('<div class="ludo-accordion-collapsed"></div>');
        expand.attr("id", "accordion-expand-" + child.id);
        el.attr("id", "accordion-title-" + child.id);
        el.attr("data-accordion-for", child.id);
        el.on('click', this.getExpandFn(child));
        el.attr("data-child-index", child.layout.index);
        el.append(expand);
        el.append(title);
        if (child.title) {
            title.html(child.title);
        }
        this.view.getBody().append(el);

        this.titleEls.push(el);

        var container = $('<div class="ludo-accordion-container" style="height:0"></div>');
        container.attr("id", "accordion-" + child.id);
        this.view.getBody().append(container);

        if (child.hidden) {
            el.css('display', 'none');
            container.css('display', 'none');
        }
        return container;
    },

    getExpandFn: function (child) {
        return function () {
            this.expandChild(child.id);
        }.bind(this);
    },

    expandChild: function (id) {
        if (this.busy)return;

        var view = $("#accordion-" + id);
        var expand = $("#accordion-expand" + id);

        if (id == this.expandedChild)return;
        var h = this.viewport.height - this.titleHeight;

        if (this.expandedView) {
            var el = this.expandedView;
            var fn = this.onAnimationComplete.bind(this);
            var d = this.duration;
            var e = this.easing;


            view.height(0);
            $(function () {
                el.animate({height: 0, easing: e}, d, fn);
                view.animate({height: h, easing: e}, d);
            });
            this.busy = true;
        } else {
            view.animate({height: h}, 200);
        }
        this.expandedView = view;
        this.expandedChild = id;
        this.toggleTitle(id);
    },

    titleNextOfOpened: undefined,
    expandIcon: undefined,

    toggleTitle: function (id) {
        if (this.expandIcon) {
            this.expandIcon.removeClass('ludo-accordion-expanded');

        }
        this.expandIcon = $('#accordion-expand-' + id);
        this.expandIcon.addClass('ludo-accordion-expanded');
        this.expandedTitle = $("#accordion-title-" + id);
        if (this.titleNextOfOpened) {
            this.titleNextOfOpened.removeClass('ludo-accordion-titlebar-below-expanded');
        }
        var index = parseInt(this.expandedTitle.attr("data-child-index"));
        var next = this.nextVisible(index);

        if (next >= 0) {
            this.titleNextOfOpened = this.titleEls[next];
            this.titleNextOfOpened.addClass('ludo-accordion-titlebar-below-expanded');
        }

    },

    nextVisible: function (index) {
        for (var i = index + 1; i < this.view.children.length; i++) {
            if (!this.view.children[i].hidden) {
                return i;
            }
        }
        return -1;
    },

    measureTitleHeight: function () {
        this.titleHeight = 0;
        for (var i = 0; i < this.titleEls.length; i++) {
            if (!this.view.children[i].hidden) {
                this.titleHeight += this.titleEls[i].outerHeight();

            }
        }
    },

    onAnimationComplete: function () {
        this.busy = false;
    },

    beforeFirstResize: function () {
        this.measureTitleHeight();
        this.expandedChild = this.firstExpanded().id;
        this.expandedView = $('#accordion-' + this.expandedChild);
        this.expandedView.css('height', this.viewport.height - this.titleHeight);
        this.toggleTitle(this.expandedChild);

    },

    firstExpanded: function () {
        var ret = undefined;
        var c = this.view.children;
        for (var i = 0; i < c.length; i++) {
            if (c[i].layout.expanded && !c[i].hidden) {
                ret = c[i];
                break;
            }
        }
        if (!ret) {
            for (i = 0; i < c.length; i++) {
                if (!c[i].hidden) {
                    ret = c[i];
                    break;
                }
            }
        }

        return ret;
    },

    resize: function () {
        var c = this.view.children;
        var h = this.viewport.height - this.titleHeight;
        if (this.expandedView) {
            this.expandedView.css('height', h);
        }
        var size = {
            width: this.viewport.width,
            height: h
        };
        for (var i = 0; i < c.length; i++) {
            c[i].resize(size);
        }
    }
});