/**
 * A customized ludo.form.Text field with automatic validation of e-mail addresses
 * @namespace ludo.form
 * @class ludo.form.Email
 * @augments ludo.form.Text
 */
ludo.form.Email = new Class({
    Extends:ludo.form.Text,
    type:'form.Email',
    regex:/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.(?:[A-Z]{2}|com|org|net|edu|gov|mil|biz|info|mobi|name|aero|asia|jobs|museum)$/i,
    validateKeyStrokes:false
});