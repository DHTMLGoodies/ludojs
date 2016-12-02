ludo.chart.Tooltip = new Class({
	Extends:ludo.chart.AddOn,
	type: 'chart.Tooltip',
	tpl:'{label}: {value}',
	shown:false,

	offset:{
		x:0, y:0
	},

	size:{
		x:0,y:0
	},

	/*
	 * Styling of box where the tooltip is rendered
	 * @config {Object} boxStyles
	 * @default { "fill":"#fff", "fill-opacity":.8, "stroke-width" : 1, "stroke-location": "inside" }
	 */
	boxStyles:{},

	/*
	 * Overall styling of text
	 * @config {Object} textStyles
	 * @default { "fill" : "#000" }
	 */
	textStyles:{},

	__construct:function (config) {
		this.parent(config);
		this.setConfigParams(config, ['tpl','boxStyles','textStyles']);
		this.createDOM();

		this.getParent().addEvents({
			'mouseenter':this.show.bind(this),
			'mouseleave':this.hide.bind(this)
		});



		this.getParent().getNode().on("mouseenter", this.show.bind(this));
		this.getParent().getNode().on("mouseleave", this.hide.bind(this));
		this.getParent().getNode().on('mousemove', this.move.bind(this));
	},

	createDOM:function () {
		this.node = new ludo.canvas.Node('g');
		this.getParent().append(this.node);
		this.node.hide();
		this.node.toFront.delay(50, this.node);

		this.rect = new ludo.canvas.Rect({ x:0, y:0, rx:2, ry:2 });
		this.rect.css(this.getBoxStyling());

		this.node.append(this.rect);

		this.textBox = new ludo.canvas.TextBox();
		this.textBox.getNode().translate(4, 0);
		this.textBox.getNode().css(this.getTextStyles());
		this.node.append(this.textBox);
	},

	getBoxStyling:function(){
		var ret = this.boxStyles || {};
		if(!ret['fill'])ret['fill'] = '#fff';
		if(!ret['stroke-location'])ret['stroke-location'] = 'inside';
		if(ret['fill-opacity'] === undefined)ret['fill-opacity'] = .8;
		if(ret['stroke-width'] === undefined)ret['stroke-width'] = 1;
		return ret;
	},

	getTextStyles:function(){
		var ret = this.textStyles || {};
		if(!ret['fill'])ret['fill'] = '#000';
		return ret;
	},
	
	show:function (e) {
		var rec = this.getRecord();

		if(rec == undefined){
			this.hide();
			return;
		}

		this.node.show();
		this.node.toFront();
		this.shown = true;

		this.offset = this.getParent().getParent().getBody().offset();

		this.textBox.setText(this.getParsedHtml());

		this.rect.css('stroke', this.getRecord().__color);

		this.size = this.textBox.getNode().getSize();
		this.size.x +=7;
		this.size.y +=10;
		this.rect.set('width', this.size.x);
		this.rect.set('height', this.size.y);

		this.rect.show();

		this.move(e);
	},

	hide:function () {
		this.node.hide();
		this.rect.hide();
		this.shown = false;
	},

	move:function (e) {
		if (this.shown) {
			var pos = {
				x:e.pageX - this.offset.left - this.size.x - 10,
				y:e.pageY - this.offset.top - this.size.y - 5
			};
			if(pos.x < 0)pos.x += (this.size.x + 20);
			if(pos.y < 0)pos.y += (this.size.y + 10);
			this.node.translate(pos.x, pos.y);
		}
	},

	getParsedHtml:function () {
		var rec = this.getRecord();
		return this.getDataSource().textOf(rec, this);
	},

	getRecord:function () {
		return this.getDataSource().getHighlighted();
	}

});
