/**
 * Created with JetBrains PhpStorm.
 * User: xait0020
 * Date: 10.02.13
 * Time: 23:39
 * To change this template use File | Settings | File Templates.
 */
TestCase("QueryTest", {

	setUp:function () {

		ludo.config.setUrl('/');

		if (window.TestRemoteMock === undefined) {
			window.TestRemoteMock = new Class({
				Extends:ludo.remote.JSON,
				getUrl:function (service, arguments) {
					var ret = this.parent(service, arguments);
					window.UrlForUnitTest = ret;
					return ret;
				},

				getDataForRequest:function (service, arguments, data) {
					var ret = this.parent(service, arguments, data);
					window.dataForUnitTest = ret;
					return ret;
				}
			});
		}
	},

	"test should be able to get queries for mod rewrite":function () {
		// given
		ludo.config.enableModRewriteUrls();
		var obj = new window.TestRemoteMock({
			"resource":"Game"
		});

		obj.send("load", 1);

		// when
		var url = window.UrlForUnitTest;

		// then
		assertEquals('/Game/1/load', url);
	},

	"test should get correct url when mod rewrite is disabled":function () {
		// given
		ludo.config.disableModRewriteUrls();
		ludo.config.setUrl('/router.php');

		// given
		var obj = new window.TestRemoteMock({
			"resource":"Game"
		});

		obj.send("load", 1);

		// when
		var url = window.UrlForUnitTest;

		// then
		assertEquals('/router.php', url);
	},

	"test should get correct data when mod rewrite is enabled":function () {
		// given
		ludo.config.enableModRewriteUrls();
		var obj = new window.TestRemoteMock({
			"resource":"Game"
		});

		obj.send("load", 1, {"firstname":"alf" });

		// when
		var data = window.dataForUnitTest;
		var expected = { "data":{ "firstname":"alf" }};

		// then
		assertEquals(expected, data);
	},

	"test should get correct data when mod rewrite is disabled":function () {
		// given
		ludo.config.disableModRewriteUrls();
		var obj = new window.TestRemoteMock({
			"resource":"Game"
		});

		obj.send("load", 1, {"firstname":"alf" });

		// when
		var data = window.dataForUnitTest;
		var expected = { "data":{ "firstname":"alf" }, "request":"Game/1/load"};

		// then
		assertEquals(expected, data);
	},

	"test should be able to send request without any resource":function () {
		// given
		ludo.config.disableModRewriteUrls();
		LUDOJS_CONFIG.url = '/router.php';
		var obj = new window.TestRemoteMock({
		});

		obj.send(undefined, undefined, { "firstname":"alf" });
		var data = window.dataForUnitTest;
		var expected = { "data":{ "firstname":"alf" }};

		// then
		assertEquals(expected, data);


	}
});