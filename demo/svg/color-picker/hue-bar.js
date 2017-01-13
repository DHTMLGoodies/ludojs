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
        var c = this.svg();
		this.currentBarHeight = c.get('height');
		c.addEvent('resize', this.positionSlider.bind(this));
		c.node.css('width', '50px');
        this.hueBar = new ludo.svg.Rect({
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
		this.slider = new ludo.svg.Node('g', { x: 0, width:'100%', height:10, y: 0 });
		this.slider.css('cursor', 'pointer');

		var symbol = new ludo.svg.Node('symbol');
		this.svg().appendDef(symbol);


		var hh = ludo.util.isTabletOrMobile();
		var size = hh ? 15 : 12;

		var path = ['M', size / 2 ,'0', 'L', size, 0 ,'L', size * 1.5, size/2, 'L' ,size, size,'L', (size/2), size, 'Z'].join(' ');
		var p = new ludo.svg.Path(path, { fill:'#FFF', stroke : '#555', 'stroke-width' :1});
		symbol.append(p);

		var u = new ludo.svg.Node('use');
		u.href(symbol);
		this.slider.append(u);
		var u2 = new ludo.svg.Node('use', { x : '-100%', 'transform' : 'scale(-1,1)'});
		u2.href(symbol);
		this.slider.append(u2);
		this.svg().append(this.slider);

		this.makeSliderDragable();
	},

	makeSliderDragable:function(){
		this.dd = new ludo.svg.Drag({
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
		var height = this.svg().get('height');

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
        var gradient = new ludo.svg.Gradient({x1:'0%', y1:'100%', x2:'0%', y2:'0%'});

        for(var i=0;i<=360;i+=60){
            var prs = Math.round(i / 360 * 100);
            var color = this.colorObj.rgbCode(this.colorObj.hsvToRGB(i, 100, 100));
            gradient.addStop(prs + '%', color, 1);
        }
        this.svg().appendDef(gradient);
        return gradient;
    },

	barClick:function(e){

		var t = e.touches;
		var pY = t != undefined && t.length >0 ? t[0].pageY: e.pageY;
		var hue = this.getHueByYPos(pY);
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
		y += this.svg().getHeight() * (this.topMargin / 100);
		this.slider.setTranslate(0, Math.round(y));
		this.currentHue = hue;
	},


	positionSlider:function(){
		this.currentBarHeight = this.svg().getHeight();
		if(this.currentHue !== undefined)this.positionSliderByHue(this.currentHue);
	}
});

