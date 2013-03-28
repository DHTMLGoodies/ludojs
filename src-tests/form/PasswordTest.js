TestCase("PasswordTest", {

    "test should not validate week passwords": function(){
        var invalidPasswords = [
            'alfmagnek',
            'alfmagnek1',
            'invalid456',
            'short',
            'longbutwithoutuppercase1234'
        ];

        for(var i=0;i<invalidPasswords.length;i++){
            // given
            var p = new ludo.form.StrongPassword({
                value : invalidPasswords[i]
            });
            // then
            assertFalse(invalidPasswords[i] + ' is considered valid', p.isValid());
        }

    },

    "test should validate strong password": function(){

        var passwords = [
            'A24!abZde',
            'A12magne',
            'Valid123',
            'valiD123',
            '123Valid'
        ];
        // given
        for(var i=0;i<passwords.length;i++){
            var p = new ludo.form.StrongPassword({  value : passwords[i] });
            // then
            assertTrue(p.isValid());
        }
    },

    "test should not validate weak passwords only containing letters": function(){
        // given
        var p = new ludo.form.StrongPassword({
            value : 'alfmagne'
        });
        // then
        assertFalse(p.isValid());
    },


	"test should validate strong password with upper lower and number": function(){
        // given
        var p = new ludo.form.StrongPassword({
            value : 'ABalfa33'
        });

        // then
        assertTrue(p.isValid());
	}
});