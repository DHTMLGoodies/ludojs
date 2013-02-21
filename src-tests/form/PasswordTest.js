TestCase("PasswordTest", {

    "test should not validate week passwords": function(){
        // given
        var p = new ludo.form.StrongPassword({
            value : 'alfmagne'
        });

        // then
        assertFalse(p.isValid());
    },

    "test should validate strong password": function(){
        // given
        var p = new ludo.form.StrongPassword({
            value : 'A24!abZde'
        });

        // then
        assertTrue(p.isValid());
    },

    "test should have regex" : function(){
        assertTrue(/(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test('A24!abZde'))
    }

});