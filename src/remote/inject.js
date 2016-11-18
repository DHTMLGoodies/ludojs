/**
 * Class for injecting data to specific resource/service requests
 */
ludo.remote.Inject = new Class({

	data:{},

	/**
	 Add data to be posted with the next request.
	 @function add
	 @param resourceService
	 @param data
	 @example
	 	ludo.remoteInject.add('Person/save', {
	 		'customParam' : 'customValue'
	 	});
	 */
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
