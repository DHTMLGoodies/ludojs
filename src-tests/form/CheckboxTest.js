TestCase("CheckboxTest", {

    "test should be able to reset": function(){
        // given
        var v = this.getViewWithCheckbox();

        // when
        v.child['cb'].check();
        v.child['cb'].reset();
        // then
        assertFalse(v.child['cb'].isChecked());
    },

    getViewWithCheckbox:function(config){
        config = config || {};
        config.type = 'form.Checkbox';
        config.name = 'cb';
        return new ludo.View({
            renderTo:document.body,
            children:[config]
        });
    }

});