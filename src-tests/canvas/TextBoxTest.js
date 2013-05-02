TestCase("TestBoxTest", {

	"test should be able to define text": function(){
		// given
		var t = this.getTextBox({
			attr:{ x:100,y:100,width:100,height:100 },
			text : 'Line 1<b>Bold</b>Line 2'
		});

		// then
		assertEquals('Line 1<b>Bold</b>Line 2', t.text);

	},


	"test should convert html to svg tags": function(){
		// given
		var t = this.getTextBox({
			attr:{ x:100,y:100,width:100,height:100 },
			text : 'Line 1<b>Bold</b>Line 2'
		});

		// when
		var tagsToInsert = t.tagsToInsert();

		// then
		assertEquals(3, tagsToInsert.length);

	},

	getTextBox:function(config){

		return new ludo.canvas.TextBox(config);

	}

});