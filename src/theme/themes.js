ludo.theme.Themes = new Class({
    currentTheme:undefined,

    themes: {
        twilight: {
            c100 : '#ffffff',
            c200 : '#eeeeee',
            c300 : '#aeb0b0',
            c400 : '#8b8c8c',
            c500 : '#535353',
            c600: '#424242',
            c700: '#383838',
            c800:'#282828',
            c900:'#282828',


            border: '#424242',
            background: '#535353',
            background2: '#535353',
            text : '#aeb0b0'
        },
        blue : {
            c100:'#ffffff',
            c200: '#d1e7ff',
            c300: '#c6e1ff',
            c400: '#a6cbf5',
            c500:'#354150',
            c600:'#000000',


            border: '#a6cbf5',
            background: '#535353',
            background2: '#535353',
            text : '#000000'

        },
        "light-gray": {
            c100 : '#FFFFFF',
            c200 : '#f5f5f5',
            c300 : '#e2e2e2',
            c400 : '#d7d7d7',
            c500 : '#c6c6c6',
            c600 : '#AAAAAA',
            c700 : '#777777',
            c800 : '#555555',
            c900 : '#000000',


            border: '#d7d7d7',
            background: '#FFFFFF',
            background2: '#e2e2e2',
            text : '#555555'
        }
    },

    addTheme:function(name, colors){
        this.themes[name] = colors;
    },

    setTheme:function(theme){

        if(this.themes[theme] == undefined){
            console.warn("Undefined theme " + theme);

        }

        var current = this.getCurrentTheme();

        if(current == theme)return;

        if(current){
            jQuery(document.body).removeClass("ludo-" + this.currentTheme);
        }

        this.currentTheme = theme;

        jQuery(document.body).addClass("ludo-" + theme);
    },

    getThemeEl:function(){
        var theme = this.getCurrentTheme();
        if(theme != undefined){
            return jQuery('.ludo-' + theme);
        }
        return jQuery(document.body);
    },

    getCurrentTheme:function(){
        if(this.currentTheme == undefined){
            var b = jQuery(document.documentElement);
            jQuery.each(this.themes, function(theme){
                if(!this.currentTheme){
                    var cls = '.ludo-' + theme;
                    var els = b.find(cls);
                    if(els.length > 0){
                        this.currentTheme = theme;
                    }
                }
            }.bind(this));
        }

        return this.currentTheme;
    },

    color:function(colorName){
        var theme = this.getCurrentTheme();
        if(!theme)return undefined;
        if(this.themes[theme] != undefined){
            return this.themes[theme][colorName];
        }

        return undefined;
    },
    
    clear:function(){
        this.currentTheme = undefined;
    }

});

/**
 * Instance of ludo.theme.Themes.
 * Used to update theme on demand
 * @type {Class|Type}
 */
ludo.Theme = new ludo.theme.Themes();


/**
 * Function which returns theme color
 * @function ludo.$C
 * @param {String} color Name of color
 */
ludo.$C = ludo.Theme.color.bind(ludo.Theme);
