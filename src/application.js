/**
 * A component rendered to document.body and filling up entire screen
 * @class Application
 * @extends RichView
 */
ludo.Application = new Class({
    Extends:ludo.View,
    type:'Application',
	layout:{
		width:'matchParent',
		height:'matchParent'
	},

    ludoConfig:function (config) {
        config.renderTo = document.body;
        this.parent(config);
		this.setBorderStyles();
    },

    ludoRendered:function () {
        this.parent();
        this.getEl().addClass('ludo-application');
        this.getBody().addClass('ludo-application-content');
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
        document.body.setStyles(styles);
        document.id(document.documentElement).setStyles(styles);
    }
});