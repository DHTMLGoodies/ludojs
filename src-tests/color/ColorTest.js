TestCase("ColorTest", {
    "test should be able to get color values from RGB code":function () {
        // given
        var c = new ludo.color.Color();

        // when
        var colors = c.rgbColors('#FFAACC');

        // then
        assertEquals(255, colors.r);
        assertEquals(170, colors.g);
        assertEquals(204, colors.b);
    },


    "test should be able to convert to RGB code" : function(){
        // given
        var c = new ludo.color.Color();

        // when
        var color = c.rgbCode({ r:0,g:0,b:0});
        // then
        assertEquals('#000000', color);

        // when
        color = c.rgbCode( { h:348, s:61, v:100 });

        // then
        assertEquals('#ff6383', color.toLowerCase());

    },

    "test should be able to convert rgb array to RGB code": function(){
        // given
        var c = new ludo.color.Color();
        // when
        var color = c.toRGB(255,170,204);

        // then
        assertEquals('#ffaacc', color.toLowerCase());

    },

    "test should be able to convert rgb array to HSV array": function(){
        // given
        var c = new ludo.color.Color();
        var rgb = {
            r: 255, g: 100, b:130
        };
        // when
        var colors = c.toHSV(rgb);

        // then
        assertEquals(348, Math.round(colors.h));
        assertEquals(61, Math.round(colors.s));
        assertEquals(100, Math.round(colors.v));

    },

    "test should be able to convert from HSV to RGB": function(){
        // given
        var c = new ludo.color.Color();
        var rgb = {
            r: 255, g: 100, b:130
        };
        // when
        var color = c.toHSV(rgb);
        var newRgb = c.hsvToRGB(color.h, color.s, color.v);

        // then
        assertEquals(255, Math.round(newRgb.r));
        assertEquals(100, Math.round(newRgb.g));
        assertEquals(130, Math.round(newRgb.b));

    },

    "test should get hue from value larger than 360": function(){
        // given
        var c = new ludo.color.Color();
        var hsv = {
            h: 360, s: 100, v:100
        };
        // when
        var color = c.rgbCode(hsv);

        // then
        assertEquals('#ff0000', color.toLowerCase());
    }

});