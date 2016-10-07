ludo.color.Boxes = new Class({
    Extends : ludo.color.Base,

    ludoConfig:function(config){
        this.parent(config);
        this.setConfigParams(config, ['colors']);
    },

    ludoDOM:function(){
        this.parent();
        this.getBody().css('overflowY', 'auto');
    },

    ludoEvents:function(){
        this.parent();
        this.getBody().on('click', this.clickOnColorBox.bind(this));
    },

    ludoRendered:function(){
        this.parent();
        this.addColorBoxes();
    },

    addColorBoxes:function(){
        var html = [];
        for(var i=0;i<this.colors.length;i++){
            var colors = this.getColorsIn(this.colors[i]);
            if(colors.length > 1){
                html.push('<div style="clear:both">');
            }
            for(var j=0;j<colors.length;j++){
                html.push(this.getColorBox(colors[j]));
            }
            if(colors.length > 1){
                html.push('</div>');
            }
        }
        this.getBody().html(html.join(''));

    },

    getColorBox:function(color){
		if(!ludo.util.isArray(color))color = [color,color];
        var ret = [];
        ret.push('<div title="' + color[0] + '" rgbColor="' + color[1] + '" class="ludo-color-box" style="background-color:' + color[1] + '"></div>');
        return ret.join('');
    },

    getColorsIn:function(category){
        var ret = [];
        switch(category){
            case 'grayScale':
                for(var i=0;i<256;i+=8){
                    var c = this.getColorPrefixed(i);
                    var color = '#' + c + c +c;
                    ret.push([color,color] );
                }
                break;
            case 'namedColors':
                return this.namedColors;
            default:
                return category;

        }
        return ret;
    },

    getColorPrefixed:function(colorNum){
        var ret = colorNum.toString(16);
        if(ret.length === 1)ret = '0' + ret;
        return ret;
    },

    clickOnColorBox:function(e){
        if($(e.target).hasClass('ludo-color-box')){
            this.fireEvent('setColor', $(e.target).attr('rgbColor'));
        }
    }
});