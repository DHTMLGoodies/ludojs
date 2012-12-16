TestCase("FileTest", {

	getFileUploadField:function (config) {
		config = config || {};
		config = Object.merge(config, { url:'upload.php '});
		return new ludo.form.File(config)

	},

	"test should assign name to input":function () {
		// given
		var field = this.getFileUploadField({
			name:'uploadField'
		});

		// then
		assertEquals('uploadField', field.getFormEl().getProperty('name'));
	}

});