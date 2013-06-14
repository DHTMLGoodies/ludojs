TestCase("ProgressBarTest", {

	"test resource should be LudoDBProgress":function () {

	},

	"test should be able to define start listener":function () {
		// given
	},

	getRemoteMock:function (config) {
		var resource = config.resource;
		var code = config.code;
		var message = config.message;

		if (window.RemoteMockBr === undefined) {
			window.RemoteMockBr = new Class({
				code:undefined,
				message:undefined,
				resource:undefined,
				initialize:function (resource, code, message) {
					this.resource = resource;
					this.code = code;
					this.message = message;
				},
				getResponseMessage:function () {
					return this.message;
				},
				getResponseCode:function () {
					return this.code;
				},
				getResource:function () {
					return this.resource;
				}
			})
		}

		return new RemoteMockBr(resource, code, message);
	}
});