/**
 * Class for injecting data to specific resource/service requests
 * @type {Class}
 */
ludo.remote.Inject = new Class({

	data:{},

	add:function(resourceService, data){
		var tokens = resourceService.split(/\//g);
		var resource = tokens[0];
		var service = tokens[1];
		if(this.data[resource] === undefined){
			this.data[resource] = {};
		}
		this.data[resource][service] = data;
	},

	get:function(resource, service){
		if(this.data[resource] && this.data[resource][service]){
			var ret = this.data[resource][service];
			delete this.data[resource][service];
			return ret;
		}
		return undefined;
	}

});

ludo.remoteInject = new ludo.remote.Inject();
