/**
 * Class displaying labels for a chart. See
 * {{#crossLink "chart/Pie"}}{{/crossLink}} for example on how to add labels
 * to your chart. How labels are displayed(side by side or beneath each other)
 * depends on the orientation attribute OR
 * the size of the area assigned to the labels. You can set orientation to
 * "vertical" or "horizontal". If orientation is not set and width is greater
 * than height, the labels will be displayed vertically. If height is greater
 * than width, the labels will be rendered vertically.
 * @namespace ludo.chart
 * @class ludo.chart.LabelList
 * @param {Object} config
 * @param {Object} config.textStyles CSS styling of text, default:  { fill:'#000000', 'font-size' : '13px', 'font-weight' : 'normal' }
 * @param {Object} config.textStylesOver CSS styling on mouse over, default: { 'font-weight': 'bold' }
 * @param {Object} config.boxStyles CSS for box around labels, default: { 'stroke' : '#000' }
 * @param {Object} config.boxStylesOver mouse over css for box around labels, default: undefined
 * @param {String} config.orientation Orientation of labels. If not set, orientation will be set automatically
 * base on space allocated to the labels. When width is greater than height, the
 * labels will be displayed horizontally, side by side. Otherwise, they will be
 * displayed vertically.
 */
ludo.chart.LabelList = new Class({
    Extends:ludo.chart.Base,

    fragmentType:'chart.LabelListItem',
    textStyles:undefined,
    textStylesOver:undefined,
    boxStyles:undefined,
    boxStylesOver:undefined,
    orientation:undefined,

    __construct:function(config){
        this.parent(config);
        this.setConfigParams(config, ['orientation', 'textStyles', 'boxStyles', 'textStylesOver','boxStylesOver']);
    },

    render:function(){
        this.onResize();
    },

    onResize:function(){
        if(!this.fragments.length){
            return;
        }
        var size = this.getSize();
		this[this.orientation === 'horizontal' || size.x > size.y ? 'resizeHorizontal' : 'resizeVertical']();
    },

    resizeHorizontal:function(){
        var left = [];
        var size = this.getSize();
        var totalWidth = 0;
        for(var i=0;i<this.fragments.length;i++){
            var fSize = this.fragments[i].getSize();
            var width = fSize.x + 12;
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