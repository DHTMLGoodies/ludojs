ludo.form.Color = new Class({
    Extends: ludo.form.Combo,
    children:[{
        type: 'color.Picker'
    }],
    layout:{
        'type' : 'tabs'
    },
    childLayout:{
        width:250,height:250
    }
});