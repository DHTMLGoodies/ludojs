/**
 * Special Button for form submission.
 * This button will automatically be disabled when a form is invalid, and automatically enabled when it's valid.
 * A form consists of all form elements of parent component, including form elements of child components.
 * @namespace form
 * @class SubmitButton
 * @extends form.Button
 */
ludo.form.SubmitButton = new Class({
    Extends:ludo.form.Button,
    type:'form.SubmitButton',
    value:'Submit',
    component:undefined,
    disableOnInvalid:true,

    ludoRendered:function () {
        this.parent();
        this.addEvent('click', this.submit.bind(this));

    },

    submit:function () {
        if (this.component) {
            this.component.submit();
        }
    }
});