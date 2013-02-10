/**
 * @namespace form
 * @class Email
 * @description A customized text field with validation of e-mail addrses
 * @extends form.Text
 */
ludo.form.Email = new Class({
    Extends:ludo.form.Text,
    type:'form.Email',
    regex:'^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.(?:[A-Z]{2}|com|org|net|edu|gov|mil|biz|info|mobi|name|aero|asia|jobs|museum)$',
    validateKeyStrokes:false
});