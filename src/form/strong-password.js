/**
 Strong password field, i.e
 contain at least 1 upper case letter
 contain at least 1 lower case letter
 contain at least 1 number or special character
 contain at least 8 characters in length
 not limited in length
 
 @namespace ludo.form
 @class Password
 @augments ludo.form.Text
 @constructor
 @description Form component for passwords.
 @param {Object} config
 @example
 ...
 children:[
 {type:'form.password',label:'Password',name:'password',md5:true },
 {type:'form.password',label:'Repeat password',name:'password_repeated',md5:true }
 ]
 ...
 */
ludo.form.StrongPassword = new Class({
    Extends: ludo.form.Password,
    regex : '(?=^.{_length_,}$)((?=.*[0-9])|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$',
    /**
     * Custom minimum length of password
     * @config {Number} passwordLength
     * @default 8
     * @optional
     */
    passwordLength : 8,

    __construct:function(config){
        config = config || {};
        this.passwordLength = config.passwordLength || this.passwordLength;
        this.regex = new RegExp(this.regex.replace('_length_', this.passwordLength));
        this.parent(config);
    }
});