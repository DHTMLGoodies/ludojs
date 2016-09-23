ludo.chart.Tooltip = new Class({
	Extends:ludo.chart.AddOn,
	tpl:'{label}: {value}',
	shown:false,

	offset:{
		x:0, y:0
	},

	size:{
		x:0,y:0
	},

	/**
	 * Styling of box where the tooltip is rendered
	 * @config {Object} boxStyles
	 * @default { "fill":"#fff", "fill-opacity":.8, "stroke-width" : 1, "stroke-location": "inside" }
	 */
	boxStyles:{},

	/**
	 * Overall styling of text
	 * @config {Object} textStyles
	 * @default { "fill" : "#000" }
	 */
	textStyles:{},

	ludoConfig:function (config) {
		this.parent(config);
		this.setConfigParams(config, ['tpl','boxStyles','textStyles']);
		this.createDOM();

		this.getParent().addEvents({
			'mouseenter':this.show.bind(this),
			'mouseleave':this.hide.bind(this)
		});

		this.getParent().getNode().addEvent('mousemove', this.move.bind(this));
	},

	createDOM:function () {
		this.node = new ludo.canvas.Node('g');
		this.getParent().append(this.node);
		this.node.hide();
		this.node.toFront.delay(50, this.node);

		this.rect = new ludo.canvas.Rect({ x:0, y:0, rx:2, ry:2 });
		this.rect.setStyles(this.getBoxStyling());
		this.node.append(this.rect);

		this.textBox = new ludo.canvas.TextBox();
		this.textBox.getNode().translate(4, 0);
		this.textBox.getNode().setStyles(this.getTextStyles());
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

		this.node.show();
		this.shown = true;

		this.offset = this.getParent().getParent().getBody().getPosition();

		this.textBox.setText(this.getParsedHtml());

		this.rect.setStyle('stroke', this.getRecord().get('color'));

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
				x:e.page.x - this.offset.x - this.size.x - 10,
				y:e.page.y - this.offset.y - this.size.y - 5
			};
			if(pos.x < 0)pos.x += (this.size.x + 20);
			if(pos.y < 0)pos.y += (this.size.y + 10);
			this.node.translate(pos.x, pos.y);
		}
	},

	getParsedHtml:function () {
		var match = this.tpl.match(/\{(.*?)\}/gm);
		var ret = this.tpl;

		var rec = this.getRecord();

		for(var i=0;i<match.length;i++){
			var key = match[i].substr(1, match[i].length-2);
			var method = 'get' + key.substr(0,1).toUpperCase() + key.substr(1);

			var val = rec[method] !== undefined ? rec[method]() : rec.get(key);
			if(val === undefined && this.getParent().dataProvider()['method']){
				val = this.getParent().dataProvider()['method']();
			}

			if(!isNaN(val) && val % 1 !== 0){
				val = val.toFixed(1);
			}

			ret = ret.replace(match[i], val);
		}
		return ret;
	},

	getRecord:function () {
		return this.getParent().dataProvider().getHighlighted();
	}

});
