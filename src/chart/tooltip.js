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

	ludoConfig:function (config) {
		this.parent(config);
		this.setConfigParams(config, ['tpl']);
		this.createDOM();

		this.getParent().addEvents({
			'mouseenter':this.show.bind(this),
			'mouseleave':this.hide.bind(this)
		});

		this.getParent().getNode().addEvent('mousemove', this.move.bind(this));
	},

	createDOM:function () {
		this.node = new ludo.canvas.Node('g');
		this.getParent().adopt(this.node);
		this.node.hide();
		this.node.toFront.delay(50, this.node);

		this.rect = new ludo.canvas.Rect({ x:0, y:0, rx:2, ry:2, 'fill':'#fff', 'stroke-width':1, 'stroke-location':'inside' });
		this.node.adopt(this.rect);

		this.textBox = new ludo.canvas.TextBox();
		this.textBox.getNode().translate(4, 0);
		this.node.adopt(this.textBox);

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

			var val;
			if(rec[method] !== undefined){
				val = rec[method]();
			}else{
				val = rec.get(key);
			}

			if(!isNaN(val))val = Math.round(val);

			ret = ret.replace(match[i], val);

		}
		return ret;
	},

	getRecord:function () {
		return this.getParent().dataProvider().getHighlighted();
	}

});
