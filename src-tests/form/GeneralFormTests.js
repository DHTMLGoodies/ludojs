/**
 * Created by alfmagne1 on 17/10/2016.
 */
TestCase("GeneralFormTests", {


    setUp:function(){
        this.getView();
        ludo.get("firstname").val("");
        ludo.get("lastname").val("");
        ludo.get("address").val("");
        ludo.get("phone").val("");
    },

    getView: function () {

        if (ludo.get("formView") == undefined) {

            return new ludo.View({
                id: 'formView',
                layout: 'linear',
                children: [
                    {type: 'form.Text', name: 'firstname', 'value': '', id: "firstname"},
                    {type: 'form.Text', name: 'lastname', 'value': '', id: "lastname"},
                    {type: 'form.Textarea', name: 'address', 'value': '', id: "address"},
                    {
                        children: [
                            {type: 'form.Text', name: 'phone', id: 'phone'}
                        ]
                    }
                ]
            });
        }

        return ludo.get("formView");


    },

    "test should be able to populate form via view": function () {
        // given
        var view = this.getView();

        // when
        view.getForm().populate({
            'firstname': 'Alf',
            'lastname': 'Kalleland',
            'phone': '555-555'
        });

        // then
        assertEquals('Alf', ludo.get('firstname').val());
    },

    "test should get all values via form object": function(){
        // given
        var view = this.getView();
        ludo.get("firstname").val("Alf");
        ludo.get("lastname").val("Johnson");
        ludo.get("phone").val("444-555");

        // when
        var values = view.getForm().values();

        // then
        assertEquals("Alf", values.firstname);
        assertEquals("Johnson", values.lastname);
        assertEquals("444-555", values.phone);
    },

    "test should get values using val method": function(){
        // given
        var view = this.getView();
        ludo.get("firstname").val("Alf");
        ludo.get("lastname").val("Johnson");
        ludo.get("phone").val("444-555");

        // then
        assertEquals("Alf", view.getForm().val("firstname"));
        assertEquals("444-555", view.getForm().val("phone"));
    },

    "test should be able to load data from server": function(){

    },

    "test should be able to submit form": function(){

    }


});