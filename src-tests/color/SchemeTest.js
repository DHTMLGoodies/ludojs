/**
 * Created by alfmagne1 on 26/10/2016.
 */
TestCase("SchemeTest", {

    "test should set colors": function(){
        // given
        ludo.setColorTheme("cyan");

        // then
        assertNotUndefined(ludo.COLOR);
        assertEquals("#B2EBF2", ludo.COLOR["100"]);

    }

});