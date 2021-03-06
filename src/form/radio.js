/**
 * Radio button
 *
 * Extends: ludo.form.Checkbox
 * 
 * @namespace ludo.form
 * @class ludo.form.Radio

 */
ludo.form.Radio = new Class({
    Extends:ludo.form.Checkbox,
    type:'form.Radio',
    inputType:'radio',

    getFormElId:function(){
        return this.elementId + '_' + this.value.replace(/[^0-9a-z]/g, '');
    }
});