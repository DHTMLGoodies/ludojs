/**
 * Class displaying labels for a chart. See
 * {{#crossLink "chart/Pie"}}{{/crossLink}} for example on how to add labels
 * to your chart. How labels are displayed(side by side or beneath each other)
 * depends on the size of the area assigned to the labels. If width is greater
 * than height, the labels will be displayed vertically. If height is greater
 * than width, the labels will be rendered vertically.
 * @namespace chart
 * @class Labels
 */
ludo.chart.Labels = new Class({
    Extends:ludo.chart.Base,
    fragmentType:'chart.Label',

    /**
     Styling options for text
     @config {Object} textStyles
     @example
        textStyles:{
            'font-size' : '14px',
            'font-weight' : 'normal'
        }
     @default { fill:'#000000', 'font-size' : '13px', 'font-weight' : 'normal' }
     */
    textStyles:undefined,
    /**
     Styling options for text of labels for highlighted chart items.
     @config {Object} textStylesOver
     @example
        textStylesOver:{
            'fill' : '#000',
            'font-weight' : 'bold'
        }
     @default { 'font-weight': 'bold' }

     */
    textStylesOver:undefined,

    /**
     Styling of color box displayed left of text label. The box will always
     be displayed in the same color as the chart item it's representing.
     @config {Object} boxStyles
     @default undefined
     @example
        boxStyles:{ 'stroke' : '#000' }
     */
    boxStyles:undefined,

    /**
     Styling of color box when highlighted. By default fill will be set to a slightly brighter color
     than the chart item it's representing.
     @config {Object} boxStylesOver
     @default undefined
     @example
        boxStylesOver:{
            'stroke-width' : 1,
            'stroke' : '#000'
        }
     */
    boxStylesOver:undefined,

    ludoConfig:function(config){
        this.parent(config);
        this.setConfigParams(config, ['textStyles', 'boxStyles', 'textStylesOver','boxStylesOver']);
    },

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