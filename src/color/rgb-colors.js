ludo.color.RgbColors = new Class({
	Extends: ludo.color.Boxes,
	colors:['rgb','grayScale'],

	getColorsIn:function(category){

		switch(category){
			case 'rgb':
				var ret = [];
				for(var r = 15;r>=0;r-=3){
					for(var g = 0;g<16;g+=3){
						for(var b = 0;b<16;b+=3){
							ret.push(this.getColorFrom(r,g,b));
						}
					}
				}

				return ret;
			default:
				return this.parent(category);
		}

	},

	getColorFrom:function(r,g,b){
		return '#' + this.getHexColor(r) + this.getHexColor(g) + this.getHexColor(b);
	},

	getHexColor:function(color){
		color = color.toString(16).toUpperCase();
		return color + color;
	}

});