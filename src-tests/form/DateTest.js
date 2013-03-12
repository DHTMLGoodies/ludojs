TestCase("DateTest", {

    "test should be able to set initial date": function(){
        var d = new ludo.form.Date({
            value:'1973-09-06',
            renderTo:document.body
        });

        // then
        assertEquals('1973-09-06', d.getValue());

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
        assertEquals('1973-09-06', d.getValue());

    },

    "test should set initial value": function(){

    },

    "test should be able to change value by picker": function(){
        // given
        var d = this.getDatePicker();

        // when
        d.children[0].setValue(Date.parse('1973-09-06'));

        // then
        assertEquals('1973-09-06', d.getValue());
    },

    getDatePicker:function(date){
        return new ludo.form.Date({
            value:date,
            renderTo:document.body
        });
    },

    changeByForm:function(picker, date){
        picker.els.formEl.value = date;
        picker.change();
    }
});