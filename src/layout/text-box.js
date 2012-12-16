ludo.layout.TextBox = new Class({
	Extends:ludo.canvas.Canvas,
	rotation:270,
	text:undefined,
	className:undefined,
	width:200, height:200,
	size:{
		x:0, y:0
	},
	x:0, y:0,
	ludoConfig:function (config) {
		this.text = config.text;
		this.rotation = config.rotation;
		this.className = config.className;
		this.renderTo = config.renderTo;
		if (config.x !== undefined)this.x = config.x;
		if (config.y !== undefined)this.y = config.y;

		if (document.createElementNS === undefined) {
			this.createIE8Box(config);
			return;
		}
		this.parent(config);

		this.createStyles();
		this.renderText();
		this.storeSize();
		this.rotate();
		this.resizeCanvas();
	},

	createIE8Box:function () {
		var span = document.createElement('span');
		document.id(this.renderTo).appendChild(span);
		span.innerHTML = this.text;
		this.setIE8Transformation(span);
		return span;
	},

	setIE8Transformation:function (span) {
		var s = span.style;
		s.display = 'block';
		s.visibility = 'hidden';
		s.position = 'absolute';
		span.className = this.className;
		document.body.adopt(span);

		s.fontSize = '12px';
		s.fontWeight = 'normal';
		s.filter = "progid:DXImageTransform.Microsoft.Matrix(" + this.getIE8Transformation() + ", sizingMethod='auto expand')";
		s.height = span.offsetHeight + 'px';
		this.size.x = span.offsetWidth;
		this.size.y = span.offsetHeight;
		if (this.rotation === 90) {
			s.right = '0px';
		}
		s.visibility = 'visible';
		document.id(this.renderTo).appendChild(span);

	},

	deg2radians:Math.PI * 2 / 360,
	getIE8Transformation:function () {
		var rad = this.rotation * this.deg2radians;
		var costheta = Math.cos(rad);
		var sintheta = Math.sin(rad);
		return ['M11=' + costheta, 'M12=' + (sintheta * -1), 'M21=' + sintheta, 'M22=' + costheta].join(',');
	},
	resizeCanvas:function () {
		var size = this.getSize();
		this.setViewBox(size.x, size.y);
		this.set('width', size.x);
		this.set('height', size.y);
	},

	createStyles:function () {
		this.styles = this.getStyles();
		var p = this.paint = new ludo.canvas.Paint(this.styles);
		this.adoptDef(p);
	},

	renderText:function () {
		var el = this.textNode = new ludo.canvas.Node('text', { x:this.x, y:this.y + parseInt(this.styles['font-size']), "class":this.paint});
		el.text(this.text);
		this.adopt(el);
	},

	getStyles:function () {
		var node = new Element('div');
		node.className = this.className;
		node.style.display = 'none';
		document.body.adopt(node);

		var lh = node.getStyle('line-height').replace(/[^0-9]/g, '');
		if (!lh) {
			lh = node.getStyle('font-size');
		}

		var ret = {
			'font-size':node.getStyle('font-size'),
			'font-family':node.getStyle('font-family'),
			'font-weight':node.getStyle('font-weight'),
			'font-style':node.getStyle('font-style'),
			'line-height':lh,
			'fill':node.getStyle('color'),
			'stroke':'none',
			'stroke-opacity':0
		};
		ret['line-height'] = ret['line-height'] || ret['font-size'];
		document.body.removeChild(node);
		return ret;
	},
	storeSize:function () {
		var bbox = this.textNode.el.getBBox();
		this.size = {
			x:bbox.width + bbox.x,
			y:bbox.height + bbox.y
		};
	},
	rotate:function () {
		var x = this.size.x;
		var y = this.size.y;
		var yOffset = (this.size.y - parseInt(this.styles['line-height'])) / 2;
		var transformation = '';
		switch (this.rotation) {
			case 270:
				transformation = 'translate(' + (yOffset * -1) + ' ' + x + ') rotate(' + this.rotation + ')';
				break;
			case 180:
				transformation = 'rotate(' + this.rotation + ' ' + (x / 2) + ' ' + (y / 2) + ')';
				break;
			case 90:
				transformation = 'translate(' + (y - yOffset) + ' ' + 0 + ') rotate(' + this.rotation + ')';
				break;
			case 0:
				transformation = 'translate(0 ' + (yOffset * -1) + ')';

		}
		this.textNode.set('transform', transformation);
	},

	getSize:function () {
		switch (this.rotation) {
			case 270:
			case 90:
				return { x:this.size.y, y:this.size.x };
			default:
				return this.size;

		}
	}
});