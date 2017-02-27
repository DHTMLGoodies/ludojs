/**
 * Class which render two child views, one label and one form field. This is a convenient class for rendering
 * a form field with a label to the left.
 *
 * This class renders the views in a linear horizontal layout.
 *
 * @class ludo.form.LabelElement
 * @param {Object} config
 * @param {Object} config.label Configuration for ludo.form.Label
 * @param {Object} config.field Configuration for a form field
 * @example:
*  var labelElement = new ludo.form.LabelElement({
    label:{
        label:'myLabel',
        type:'form.Label',
        layout:{
            width:70
        }
    },
    field:{
        type:'form.Number',
        name:'myField',
        minValue:0,
        maxValue:255
    },
    renderTo:document.body,
    layout:{
        width:200,
        height:50
    }
});
 */
ludo.form.LabelElement = new Class({
    Extends: ludo.View,

    label:undefined,
    field:undefined,

    __construct: function (config) {
        this.parent(config);
        this.__params(config, ['label', 'field']);

        if(!this.label.type)this.label.type='form.Label';
        this.label.labelFor = this.field.name;

        this.layout = this.layout || {};
        this.layout.type = 'linear';
        this.layout.orientation = 'horizontal';
    },

    __children:function(){
        return [
            this.label,
            this.field
        ]
    },

    __rendered: function () {
        this.parent();
    }

});