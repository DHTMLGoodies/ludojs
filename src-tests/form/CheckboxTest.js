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

    "test should set dirty on change": function(){
        // given
        var v = this.getViewWithCheckbox();

        // when
        v.child['cb'].check();

        // then
        assertTrue(v.child['cb'].isDirty());
    },

    "test should set clean when initial state is set": function(){
        // given
        var v = this.getViewWithCheckbox();

        // when
        v.child['cb'].setChecked(true);
        v.child['cb'].setChecked(false);

        // then
        assertFalse(v.child['cb'].isDirty());
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