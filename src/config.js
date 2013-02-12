ludo._Config = new Class({
	storage:undefined,

	initialize:function () {
		this.setDefaultValues();
	},

	reset:function(){
		this.setDefaultValues();
	},

	setDefaultValues:function () {
		this.storage = {
			url:'/router.php',
			documentRoot:'/',
			socketUrl:'http://your-node-js-server-url:8080/',
			modRewrite:false,
			fileUploadUrl:undefined
		};
	},

	setUrl:function (url) {
		this.storage.url = url;
	},

	getUrl:function () {
		return this.storage.url;
	},

	enableModRewriteUrls:function () {
		this.storage.modRewrite = true;
	},
	disableModRewriteUrls:function () {
		this.storage.modRewrite = false;
	},

	hasModRewriteUrls:function () {
		return this.storage.modRewrite === true;
	},

	setSocketUrl:function (url) {
		this.storage.socketUrl = url;
	},
	getSocketUrl:function () {
		return this.storage.socketUrl;
	},

	setDocumentRoot:function (root) {
		this.storage.documentRoot = root;
	},

	getDocumentRoot:function () {
		return this.storage.documentRoot;
	},
	setFileUploadUrl:function (url) {
		this.storage.fileUploadUrl = url;
	},
	getFileUploadUrl:function(){
		return this.storage.fileUploadUrl;
	}
});

ludo.config = new ludo._Config();