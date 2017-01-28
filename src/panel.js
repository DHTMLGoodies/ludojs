/**
 * A Panel is a View where the body element is a &lt;fieldset> with a &lt;legend>
 *
 * @class ludo.Panel
 * @param {Object} config
 * @param {String} config.title Legend title
 */
ludo.Panel = new Class({
	Extends:ludo.View,
	tagBody:'fieldset',

	_createDOM:function () {
		this.parent();
		this.getEl().addClass('ludo-panel');
		this.els.legend = jQuery('<legend>');
		this.els.body.append(this.els.legend);
		this.getEl().addClass('ludo-panel');
	},

	ludoDOM:function () {
		this.parent();
		this.setTitle(this.title);
	},

	__rendered:function () {
		this.parent();
		this.getBody().css('display', 'block');
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
		this.parent();
		return;
		var height = this.getHeight();
		if (height == 0) {
			return;
		}

		height -= (ludo.dom.getMBPH(this.getBody()) + ludo.dom.getMBPH(this.getEl()));
		if (height > 0 && !isNaN(height)) {
			this.getBody().css('height', height);
		}

		var width = this.getWidth();
		width -= (ludo.dom.getMBPW(this.getBody()) + ludo.dom.getMBPW(this.getEl()));

		if (width > 0 && !isNaN(width)) {
			this.getBody().css('width', width);
		}
	},

	setTitle:function (title) {
		this.parent(title);
		this.els.legend.html( title);
	}
});