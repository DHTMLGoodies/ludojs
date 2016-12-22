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


	"test should nest children correctly": function(){
		// given
		var t = this.getTextBox({
			attr:{ x:100,y:100,width:100,height:100 },
			text : 'Line 1<b>Bold</b>Line 2'
		});

		// when
		var tagsToInsert = t.tagsToInsert();

		// then
		assertEquals(1, tagsToInsert.length);
        assertEquals(3, tagsToInsert[0].children.length);
	},

    "test should create correct children structure": function(){
        // given
        var t = this.getTextBox({
            attr:{ x:100,y:100,width:100,height:100 },
            text : 'Normal <b>Bold</b> Normal<br>Second line<br>Third line'
        });

        // when
        var tagsToInsert = t.tagsToInsert();

        // then
		assertEquals(3, tagsToInsert.length);
        assertEquals('text', tagsToInsert[0].tag);
        assertEquals('tspan', tagsToInsert[0].children[0].tag);
        assertEquals('tspan', tagsToInsert[0].children[1].tag);
        assertEquals('tspan', tagsToInsert[0].children[2].tag);
        assertEquals('text', tagsToInsert[1].tag);
        assertEquals('text', tagsToInsert[2].tag);

    },

	"test should apply styles": function(){
        // given
        var t = this.getTextBox({
            attr:{ x:100,y:100,width:100,height:100 },
            text : 'Normal <b>Bold text</b> Normal<br>Second line'
        });

        // when
        var tagsToInsert = t.tagsToInsert();
		var bold = tagsToInsert[0].children[1];

		// then
		assertEquals('Bold text', bold.text);
		assertEquals('bold', bold.properties['font-weight']);
	},

	getTextBox:function(config){
		return new ludo.svg.TextBox(config);
	}

});