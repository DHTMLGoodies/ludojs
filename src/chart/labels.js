ludo.chart.Labels = new Class({
    Extends:ludo.chart.Base,
    fragmentType:'chart.Label',

    render:function(){
        this.onResize();

    },

    onResize:function(){

        if(!this.fragments.length){
            return;
        }
        var size = this.getSize();
        if(size.x > size.y){
            this.resizeHorizontal();
        }else{
            this.resizeVertical();
        }

    },

    resizeHorizontal:function(){
        var left = [];
        var size = this.getSize();
        var totalWidth = 0;
        for(var i=0;i<this.fragments.length;i++){
            var fSize = this.fragments[i].getSize();
            var width = fSize.x + 10;
            left.push(totalWidth);
            totalWidth += width;
        }

        var offset = (size.x - totalWidth) / 2;
        var offsetY = (size.y - this.fragments[0].getSize().y) / 2;
        for(i=0;i<this.fragments.length;i++){
            this.fragments[i].node().translate(left[i] + offset, offsetY);
        }
    },

    resizeVertical:function(){
        var top = [];
        var size = this.getSize();
        var totalHeight = 0;
        for(var i=0;i<this.fragments.length;i++){
            var fSize = this.fragments[i].getSize();
            var height = fSize.y + 3;
            top.push(totalHeight);
            totalHeight += height;
        }

        var offset = (size.y - totalHeight) / 2;

        for(i=0;i<this.fragments.length;i++){
            this.fragments[i].node().translate(2, top[i] + offset);
        }
    }
});