ludo.colorPicker.Codes = new Class({
    Extends:ludo.View,
    title:'Codes',
    minimizable:false,
    css:{

        border:0
    },
    children:[
        {
            type:'colorPicker.RGB',
            css:{border:0}
        },
        {
            type:'colorPicker.HSV',
            id:'HSV',
            css:{border:0}
        },
        {
            type:'colorPicker.Preview',
            layout:{
                weight:1
            }
        }
    ]
});