/**
 * Created by alfmagne1 on 14/01/2017.
 */
ludo.progress.Donut = new Class({
    Extends: ludo.View,
    steps: 10,
    progress: 0,


    __construct: function (config) {
        this.parent(config);

        this.setConfigParams(config, ['progress', 'steps','text']);

    },


    __rendered: function () {
        this.parent();
        this.renderBar();
    },

    renderBar:function(){
        var s = this.svg();

        this.createStyles();

        this.els.bg = s.$('path');

    },

    createStyles:function(){
        var s = this.svg();
        var cls = 'ludo-progress-bg';
        var styles = ludo.svg.Util.pathStyles(cls);
        s.addStyleSheet(cls + '-svg', styles);
    },

    resize:function(){

    },

    bgPath:function(){

        var s = this.rect();
        var c = s/2;



    },

    resizeBar:function(){

    },

    rect:function(){
        return Math.min(this.svg().width, this.svg().height);
    }


});