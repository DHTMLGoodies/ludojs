TestCase("Notification", {
	"test should be able to create notification": function(){
		var n = new ludo.Notification({
			html : 'This is my message'
		});

		// then
		assertEquals($(document.body).attr("id"), n.layout.centerIn.attr("id"));

	}


});