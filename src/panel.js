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
		this.$b().css('display', 'block');
	},
	autoSetHeight:function () {
		this.parent();
		var sizeLegend = this.els.legend.measure(function () {
			return this.getSize();
		});
		this.layout.height += sizeLegend.y;

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

		height -= (ludo.dom.getMBPH(this.$b()) + ludo.dom.getMBPH(this.getEl()));
		if (height > 0 && !isNaN(height)) {
			this.$b().css('height', height);
		}

		var width = this.getWidth();
		width -= (ludo.dom.getMBPW(this.$b()) + ludo.dom.getMBPW(this.getEl()));

		if (width > 0 && !isNaN(width)) {
			this.$b().css('width', width);
		}
	},

	setTitle:function (title) {
		this.parent(title);
		this.els.legend.html( title);
	}
});