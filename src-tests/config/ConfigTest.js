TestCase("ConfigTest", {
	setUp:function () {
		ludo.config.reset();
		if (window.TestQueryMock === undefined) {
			window.TestQueryMock = new Class({
				Extends:ludo.remote.JSON,
				getUrl:function (service, arguments) {
					var ret = this.parent(service, arguments);
					window.UrlForUnitTest = ret;
					return ret;
				}
			});
		}
	},


	"test should be able to set global url":function () {
		// given
		ludo.config.setUrl('/test-page.php');

		// then
		assertEquals('/test-page.php', ludo.config.getUrl());
	},

	"test should be able to enable mod rewrite": function(){
		// when
		ludo.config.enableModRewriteUrls();
		// then
		assertTrue(ludo.config.hasModRewriteUrls());

		// given
		ludo.config.disableModRewriteUrls();

		// then
		assertFalse(ludo.config.hasModRewriteUrls());

	},

	"test should be able to set document root": function(){
		// given
		ludo.config.setDocumentRoot('../../');

		// then
		assertEquals('../../', ludo.config.getDocumentRoot());

	},

	"test should be able to set file upload url": function(){
		// when
		ludo.config.setFileUploadUrl('/router2.php');

		// then
		assertEquals('/router2.php', ludo.config.getFileUploadUrl());

	},

	"test remote requests should use global url when not set":function () {
		// given
		ludo.config.setUrl('/test-page2.php');

		// when
		var req = new TestQueryMock();
		var url = req.getUrl(undefined, undefined);

		// then
		assertEquals('/test-page2.php', url);
	},

	"test should be able to set socket url":function () {
		// when
		ludo.config.setSocketUrl('http://localhost:1234');

		// then
		assertEquals('http://localhost:1234', ludo.config.getSocketUrl());

	},

	"test config should be a singleton":function () {


	}
});