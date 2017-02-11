/**
 * A view rendered to document.body with a width and height of 100%
 * @class ludo.Application
 */
ludo.Application = new Class({
    Extends:ludo.View,
    type:'Application',
	layout:{
		width:'matchParent',
		height:'matchParent'
	},

    __construct:function (config) {
        config.renderTo = document.body;
        this.parent(config);
		this.setBorderStyles();
    },

    __rendered:function () {
        this.parent();
        this.getEl().addClass('ludo-application');
        this.$b().addClass('ludo-application-content');
    },

    setBorderStyles:function () {
        var styles = {
            width:'100%',
            height:'100%',
            overflow:'hidden',
            margin:0,
            padding:0,
            border:0
        };
        jQuery(document.body).css(styles);
        jQuery(document.documentElement).css(styles);
    }
});