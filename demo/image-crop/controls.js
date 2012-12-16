ludo.crop.Controls = new Class({
    Extends:ludo.View,
    type:'crop.Controls',
    useController:true,
    formConfig:{
        labelWidth:50,
        fieldWidth:50
    },
    children:[
        { type:'form.Number', value:'0', name:'x', label:'X' },
        { type:'form.Number', value:'0', name:'y', label:'Y' },
        { type:'form.Number', value:'0', name:'width', label:'Width' },
        { type:'form.Number', value:'0', name:'height', label:'Height' }
    ],

    ludoRendered:function(){
        this.parent();
        this.getFormManager().addEvent('dirty', this.receiveCoordinate.bind(this));
        console.log(this.getFormManager());
    },

    receiveCoordinate:function(formComponent){
        this.fireEvent('setcoordinate', { name : formComponent.getName(), value: formComponent.getValue()});
    },

    addControllerEvents:function () {
        this.controller.addEvent('loadimage', this.setCoordinates.bind(this));
        this.controller.addEvent('setcoordinate', this.receiveCoordinateFromController.bind(this));
    },

    setCoordinates:function (image) {
        this.child['x'].setValue(0);
        this.child['y'].setValue(0);
        this.child['width'].setValue(image.width);
        this.child['height'].setValue(image.height);
    },

    receiveCoordinateFromController:function(coordinate){
        if(this.child[coordinate.name].getValue() != coordinate.value){
            this.child[coordinate.name].setValue(coordinate.value);
        }
    }
});