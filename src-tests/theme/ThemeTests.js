TestCase("ThemeTests", {

    setUp:function(){
        document.body.className = '';
        $(document.body).html('');
        ludo.Theme.clear();
    },


    "test should be able to set theme": function(){

        // when
        ludo.Theme.setTheme("twilight");

        // then
        assertEquals("ludo-twilight", document.body.className);
    },


    "test should be able to switch theme": function(){
        // when
        ludo.Theme.setTheme("twilight");
        ludo.Theme.setTheme("blue");

        // then
        assertEquals("ludo-blue", document.body.className);

    },
    
    "test should detect initial theme": function(){
        
        // given
        document.body.className = 'ludo-twilight';
        
        // then
        assertEquals("twilight", ludo.Theme.getCurrentTheme());
    },
    
    "test should be able to get color": function(){
        // given
        document.body.className = 'ludo-twilight';

        // when
        var c = ludo.$C("border");

        // then
        assertEquals('#424242', c);
        
    },

    "test should be able to detect theme if set on div": function(){

        // given
        var c = $('<div><div class="ludo-twilight"></div></div>');
        $(document.body).append(c);

        // then
        assertEquals('twilight', ludo.Theme.getCurrentTheme());

    }
    
});