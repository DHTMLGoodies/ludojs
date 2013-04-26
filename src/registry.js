ludo.RegistryClass = new Class({
	storage : {},

	set:function(key, value){
		this.storage[key] = value;
	},

	get:function(key){
		return this.storage[key];
	}
});

ludo.registry = new ludo.RegistryClass();