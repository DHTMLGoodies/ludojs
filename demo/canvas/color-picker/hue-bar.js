ludo.colorPicker.HueBar = new Class({
    Extends:ludo.View,
    type:'colorPicker.HueBar',
    useController:true,
    colorObj:undefined,

	currentHue:undefined,

	barHeight : 96, // bar height in percent
	topMargin : 2,
	currentBarHeight:undefined,
	
    __rendered:function(){
        this.parent();
        this.colorObj = new ludo.color.Color();
        var c = this.getCanvas();
		this.currentBarHeight = c.get('height');
		c.addEvent('resize', this.positionSlider.bind(this));
		c.node.css('width', '50px');
        this.hueBar = new ludo.canvas.Rect({
            x:'30%',
            width:'40%',
            y: this.topMargin + '%',
            height:this.barHeight + '%',
            fill:this.getGradient()
        });
        this.hueBar.css('cursor', 'pointer');
		this.hueBar.on('click', this.barClick.bind(this));
        c.append(this.hueBar);

		this.createSlider();
    },
	dd:undefined,
	createSlider:function(){
		this.slider = new ludo.canvas.Node('g', { x: 0, width:'100%', height:10, y: 0 });
		this.slider.css('cursor', 'pointer');

		var symbol = new ludo.canvas.Node('symbol');
		this.getCanvas().appendDef(symbol);
		var p = new ludo.canvas.Path('M 5 0 L 10 0 L 15 5 L 10 10 L 5 10 Z', { fill:'#FFF', stroke : '#555', 'stroke-width' :1});
		symbol.append(p);

		var u = new ludo.canvas.Node('use');
		u.href(symbol);
		this.slider.append(u);
		var u2 = new ludo.canvas.Node('use', { x : '-100%', 'transform' : 'scale(-1,1)'});
		u2.href(symbol);
		this.slider.append(u2);
		this.getCanvas().append(this.slider);

		this.makeSliderDragable();
	},

	makeSliderDragable:function(){
		this.dd = new ludo.canvas.Drag({
			directions:['Y'],
			listeners:{
				'before': this.setMinMaxForSliderDrag.bind(this),
				'drag' : this.dragSlider.bind(this),
				'end' : this.endDrag.bind(this)
			}
		});
		this.dd.add(this.slider);
	},

	setMinMaxForSliderDrag:function(){
		var height = this.getCanvas().get('height');

		this.dd.setMinY((height *(this.topMargin / 100)) - this.getSliderHeight() / 2);
		this.dd.setMaxY((height *((100 - this.topMargin) / 100)) - this.getSliderHeight() / 2);
		this.dragIsActive = true;
	},

	endDrag:function(){
		this.dragIsActive = false;
	},
	getSliderHeight:function(){
		return 10;
	},

	dragSlider:function(pos){
		pos.y -= this.currentBarHeight * (this.topMargin / 100);
		pos.y += this.getSliderHeight() / 2;
		var hue = 360 - (pos.y * 360 / (this.currentBarHeight * this.barHeight / 100));
		hue = Math.max(0, hue);
		this.currentHue = hue;
		this.fireEvent('setHue', hue);
	},

    getGradient:function(){
        var gradient = new ludo.canvas.Gradient({x1:'0%', y1:'100%', x2:'0%', y2:'0%'});

        for(var i=0;i<=360;i+=60){
            var prs = Math.round(i / 360 * 100);
            var color = this.colorObj.rgbCode(this.colorObj.hsvToRGB(i, 100, 100));
            gradient.addStop(prs + '%', color, 1);
        }
        this.getCanvas().appendDef(gradient);
        return gradient;
    },

	barClick:function(e){
		var hue = this.getHueByYPos(e.pageY);
		if(hue !== this.currentHue){
			this.currentHue = hue;
			this.fireEvent('setHue', hue);
		}
		this.positionSliderByHue(hue);
	},

	getHueByYPos:function(pos){
		var top = this.getBody().offset().top;
		top += this.currentBarHeight * (this.topMargin / 100);
		var height = this.hueBar.getHeight();
		var cursor = pos - top;
		return Math.round(360 - (cursor / height * 360));
	},

    addControllerEvents:function(){
        this.controller.addEvent('setHSVValue', this.receiveHSV.bind(this));
    },

    receiveHSV:function(key, value){
		switch(key){
			case 'h':
				this.positionSliderByHue(value);
				break;
		}

    },

	positionSliderByHue:function(hue){
		if(this.dragIsActive)return;
		var h = this.hueBar.getHeight();
		var y = h - (hue/360*h) - (this.getSliderHeight() / 2);
		y += this.getCanvas().getHeight() * (this.topMargin / 100);
		this.slider.translate(0, Math.round(y));
		this.currentHue = hue;
	},


	positionSlider:function(){
		this.currentBarHeight = this.getCanvas().getHeight();
		if(this.currentHue !== undefined)this.positionSliderByHue(this.currentHue);
	}
});

