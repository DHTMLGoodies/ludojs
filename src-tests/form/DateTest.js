TestCase("DateTest", {

    "test should be able to set initial date": function(){
        var d = new ludo.form.Date({
            value:'1973-09-06',
            renderTo:document.body
        });

        // then
        assertEquals('1973-09-06', d.val());

    },

    "test should be able to parse date": function(){
        // given
        var d = this.getDatePicker();

        // then
        assertEquals('1973-09-06', ludo.util.parseDate('06.09.1973', '%d.%m.%Y').format('%Y-%m-%d'));
        assertEquals('1973-09-06', ludo.util.parseDate('1973-09-06', '%Y-%m-%d').format('%Y-%m-%d'));
    },

    "test should update date value when form element is changed": function(){
        // given
        var d = this.getDatePicker();

        // when
        this.changeByForm(d, '06.09.1973');

        // then
        assertEquals('1973-09-06', d.val());

    },

    "test should set initial value": function(){

    },

    "test should be able to change value by picker": function(){
        // given
        var d = this.getDatePicker();

        // when
        d.children[0].val(Date.parse('1973-09-06'));

        // then
        assertEquals('1973-09-06', d.val());
    },

    "test should set form to dirty when picking value from date picker": function(){
        // given
        var d = this.getDatePicker();

        // when
        d.children[0].val(Date.parse('1973-09-06'));

        // then
        assertTrue(d.isDirty());

    },

    "test should set correct date when resetting form": function(){
        // given
        var view = this.getDatePickerInForm();
        var d = view.children[0];
        // when
        view.getForm().reset();

        // then
        assertUndefined(d.value);
        assertUndefined(d.val());

        // when
        d.children[0].val(Date.parse('2011-02-02'));
        assertEquals('2011-02-02', d.val());
        view.getForm().reset();

        // then
        assertUndefined(d.value);
        assertUndefined(d.val());
        assertEquals('', d.getFormEl().val());

    },

    getDatePicker:function(date){
        return new ludo.form.Date({
            value:date,
            displayFormat:'d.m.Y',
            renderTo:document.body
        });
    },


    getDatePickerInForm:function(date){
        return new ludo.View({
            children:[{
                type:'form.Date',
                value:date,
                displayFormat:'d.m.Y'
            }],
            renderTo:document.body
        })
    },

    changeByForm:function(picker, date){
        picker.els.formEl.val(date);
        picker.change();
    }
});