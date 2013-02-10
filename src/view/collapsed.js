ludo.view.Collapsed = new Class({
    Extends:ludo.Core,
    el:undefined,
    titleEl:undefined,
    component:undefined,

    ludoConfig:function (config) {
        this.parent(config);
        this.component = config.component;
        this.createDOM();
    },

    createDOM:function () {
		var cls = this.component.layout.collapsible == 'left' || this.component.layout.collapsible == 'right' ? 'cols' : 'rows';
        var el = this.el = new Element('div');
        el.style.display = 'none';
        el.style.margin = this.component.getEl().style.margin;
        el.addEvent('mouseenter', this.mouseEnterCollapsed.bind(this));
        el.addEvent('mouseleave', this.mouseLeavesCollapsed.bind(this));
        el.addEvent('click', this.expand.bind(this));
        ludo.dom.addClass(el, 'ludo-view-collapsed');
        ludo.dom.addClass(el, 'ludo-view-collapsed-' +cls);
        var title = this.titleEl = new Element('div');
        ludo.dom.addClass(title, 'ludo-view-collapsed-title');
        ludo.dom.addClass(title, 'ludo-view-collapsed-title-' + cls);
        title.set('html', '<span>' + this.component.title + '</span>');
        el.adopt(title);

		this.renderTitle.delay(100, this);
    },

	renderTitle:function(){
		this.el.style.display='';
		var c = new ludo.canvas.Canvas({
			renderTo:this.el,
			width:25,
			height:200
		});

		var paint = new ludo.canvas.Paint({
			'font-size' : this.titleEl.getStyle('font-size'),
			'font-family' : this.titleEl.getStyle('font-family'),
			'font-weight' : this.titleEl.getStyle('font-weight'),
			'fill' : this.titleEl.getStyle('color')
		});
		c.adopt(paint);
		var x = 4;
		var y = 4;

		var text = new ludo.canvas.Node('text', { x : x, y: y, height:12, "class": paint});
		c.adopt(text);
		text.text(this.component.title);
		text.set('transform', this.getTransform(270, text.el));
		this.titleEl.style.display='none';
		this.el.style.display='none';
	},

	getTransform:function(rotation, el){
		el.set('y', parseInt(el.get('y')) + el.getBBox().height);
		var b = el.getBBox();
		var center = {
			x:b.x + b.width,
			y:b.y + b.height
		};
		var x = b.x + parseInt(el.get('height'));
		return "translate(" + x + " " + b.x + ") rotate(" + rotation + ") translate(" + (center.x*-1) + " " + (center.y * -1) + ")";
	},

    expand:function () {
        this.fireEvent('expand');
    },

    show:function () {
        this.el.style.display = '';
        this.resize();
    },

    hide:function(){
        this.el.style.display = 'none';
    },

    mouseEnterCollapsed:function () {
        ludo.dom.addClass(this.el, 'ludo-view-collapsed-over');
    },

    mouseLeavesCollapsed:function () {
        this.el.removeClass('ludo-view-collapsed-over');
    },
    getEl:function () {
        return this.el;
    },

    resize:function () {
        var a = this.el;
        var c = this.component.getEl();
        if (this.isVertical()) {
            this.el.setStyles({
                left:c.style.left,
                top:c.style.top,
                height:ludo.dom.getNumericStyle(c, 'height') + ludo.dom.getMH(c) + ludo.dom.getBH(c) + ludo.dom.getPH(c) - ludo.dom.getMH(a) - ludo.dom.getBH(a) - ludo.dom.getPH(a)
            });
        } else {
            this.el.setStyles({
                left:c.style.left,
                top:c.style.top,
                width:ludo.dom.getNumericStyle(c, 'width') + ludo.dom.getMW(c) + ludo.dom.getBW(c) + ludo.dom.getPW(c) - ludo.dom.getMW(a) - ludo.dom.getBW(a) - ludo.dom.getPW(a)
            });
        }
    },

    getSize:function () {
        var c = this.el;
        if (this.isVertical()) {
            return this.getCachedWidthOfCollapsed() + ludo.dom.getMW(c) + ludo.dom.getBW(c) + ludo.dom.getPW(c);
        } else {
            return this.getCachedHeightOfCollapsed() + ludo.dom.getMH(c) + ludo.dom.getBH(c) + ludo.dom.getPH(c);
        }
    },

    cachedWidthOfCollapsed:undefined,
    getCachedWidthOfCollapsed:function () {
        if (this.cachedWidthOfCollapsed === undefined) {
            this.cachedWidthOfCollapsed = ludo.dom.getNumericStyle(this.el, 'width');
        }
        return this.cachedWidthOfCollapsed;
    },
    cachedHeightOfCollapsed:undefined,
    getCachedHeightOfCollapsed:function () {
        if (this.cachedHeightOfCollapsed === undefined) {
            this.cachedHeightOfCollapsed = ludo.dom.getNumericStyle(this.el, 'height');
        }
        return this.cachedHeightOfCollapsed;
    },

	getSizeConfig:function(){
		if(this.isVertical()){
			return { width: this.el.offsetWidth + ludo.dom.getMW(this.el)};
		}else{
			return { width: this.el.offsetHeight + ludo.dom.getMH(this.el)};
		}
	},

	isVertical:function(){
		return this.component.layout.collapsible === 'left' || this.component.layout.collapsible === 'right'
	}
});