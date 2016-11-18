// TODO indicate strength of password
/**
 Password field
 @namespace ludo.form
 @class ludo.form.Password
 @augments ludo.form.Text
 
 @description Form component for passwords.
 @param {Object} config
 @param {Boolean} config.md5 True to convert password value to md5. A call to val() will then return md5 of the password.
 @example
 	...
 	children:[
 		{type:'form.password',label:'Password',name:'password',md5:true },
 		{type:'form.password',label:'Repeat password',name:'password_repeated',md5:true }
 	]
 	...
 */
ludo.form.Password = new Class({
	Extends:ludo.form.Text,
	type:'form.Password',
	inputType:'password',
	md5:false,

	__construct:function (config) {
		this.parent(config);
		if (config.md5 !== undefined)this.md5 = config.md5;
	},

	getValue:function(){
		console.warn("Use of deprecated getValue");
		console.trace();
		return this._get();
	},

	_get:function () {
		var val = this.parent();
		if (val.length && this.md5) {
			return faultylabs.MD5(val);
		}
		return val;
	},

	reset:function () {
		this._set('');
	}
});
