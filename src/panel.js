/**
 * A Panel
 * A Panel is a component where the body element is a &lt;fieldset> with a &lt;legend>
 * @class Panel
 * @augments View
 */
ludo.Panel = new Class({
	Extends:ludo.View,
	tagBody:'fieldset',

	_createDOM:function () {
		this.parent();
		this.getEl().addClass('ludo-panel');
		this.els.legend = new Element('legend');
		this.els.body.append(this.els.legend);
		this.getEl().addClass('ludo-panel');
	},

	ludoDOM:function () {
		this.parent();
		this.setTitle(this.title);
	},

	ludoRendered:function () {
		this.parent();
		this.getBody().setStyle('display', 'block');
	},
	autoSetHeight:function () {
		this.parent();
		var sizeLegend = this.els.legend.measure(function () {
			return this.getSize();
		});
		this.layout.height += sizeLegend.y;

	},

	getInnerHeightOfBody:function () {
		return this.parent() - this.getHeightOfLegend() - 5;
	},

	heightOfLegend:undefined,
	getHeightOfLegend:function () {
		if (this.layout.heightOfLegend === undefined) {
			this.layout.heightOfLegend = this.els.legend.offsetHeight;
		}
		return this.layout.heightOfLegend;
	},

	resizeDOM:function () {
		var height = this.getHeight();
		if (height == 0) {
			return;
		}

		height -= (ludo.dom.getMBPH(this.getBody()) + ludo.dom.getMBPH(this.getEl()));
		if (height > 0 && !isNaN(height)) {
			this.getBody().style.height = height + 'px';
		}

		var width = this.getWidth();
		width -= (ludo.dom.getMBPW(this.getBody()) + ludo.dom.getMBPW(this.getEl()));

		if (width > 0 && !isNaN(width)) {
			this.getBody().style.width = width + 'px';
		}
	},

	setTitle:function (title) {
		this.parent(title);
		this.els.legend.html( title);
	}
});