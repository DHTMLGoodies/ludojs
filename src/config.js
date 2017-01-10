/**
 Class for config properties of a ludoJS application. You have access to an instance of this class
 via ludo.config.
 @class ludo._Config
 @private
 @example
    ludo.config.setUrl('../router.php'); // to set global url
 */
ludo._Config = new Class({
	storage:{},

	initialize:function () {
		this.setDefaultValues();
	},

    /**
     * Reset all config properties back to default values
     * @function reset
	 * @memberof ludo._Config.prototype
     */
	reset:function(){
		this.setDefaultValues();
	},

	setDefaultValues:function () {
		this.storage = {
			url:undefined,
			documentRoot:'/',
			socketUrl:'http://your-node-js-server-url:8080/',
			modRewrite:false,
			fileUploadUrl:undefined
		};
	},

    /**
     Set global url. This url will be used for requests to server if no url is explicit set by
     a component.
     @function config
     @param {String} url
	 @memberof ludo._Config.prototype
     @example
        ludo.config.setUrl('../controller.php');
     */
	setUrl:function (url) {
		this.storage.url = url;
	},
    /**
     * Return global url
     * @function getUrl
     * @return {String}
	 * @memberof ludo._Config.prototype
     * */
	getUrl:function () {
		return this.storage.url;
	},
    /**
     * Enable url in format <url>/resource/arg1/arg2/service
     * @function enableModRewriteUrls
	 * @memberof ludo._Config.prototype
     */
	enableModRewriteUrls:function () {
		this.storage.modRewrite = true;
	},
    /**
     * Disable url's for mod rewrite enabled web servers.
     * @function disableModRewriteUrls
	 * @memberof ludo._Config.prototype
     */
	disableModRewriteUrls:function () {
		this.storage.modRewrite = false;
	},
    /**
     * Returns true when url's for mod rewrite has been enabled
	 * @function hasModRewriteUrls
	 * @memberof ludo._Config.prototype
     * @return {Boolean}
     */
	hasModRewriteUrls:function () {
		return this.storage.modRewrite === true;
	},
    /**
     * Set default socket url(node.js).
     * @function setSocketUrl
	 * @memberof ludo._Config.prototype
     * @param url
     */
	setSocketUrl:function (url) {
		this.storage.socketUrl = url;
	},
    /**
     * Return default socket url
     * @function getSocketUrl
     * @return {String}
	 * @memberof ludo._Config.prototype
     */
	getSocketUrl:function () {
		return this.storage.socketUrl;
	},
    /**
     * Set document root path
     * @function setDocumentRoot
     * @param {String} root
	 * @memberof ludo._Config.prototype
     */
	setDocumentRoot:function (root) {
		this.storage.documentRoot = root === '.' ? '' : root;
	},
    /**
     * @function getDocumentRoot
     * @return {String}
	 * @memberof ludo._Config.prototype
     */
	getDocumentRoot:function () {
		return this.storage.documentRoot;
	},
    /**
     * Set default upload url for form.File components.
     * @function setFileUploadUrl
     * @param {String} url
	 * @memberof ludo._Config.prototype
     */
	setFileUploadUrl:function (url) {
		this.storage.fileUploadUrl = url;
	},
    /**
     * @function getFileUploadUrl
     * @return {String}
	 * @memberof ludo._Config.prototype
     */
	getFileUploadUrl:function(){
		return this.storage.fileUploadUrl;
	}
});

ludo.config = new ludo._Config();