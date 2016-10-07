TestCase("GreeterTest", {
    "test greet": function() {
	  var src = 'http://www.dhtmlgoodies.com/scripts/dhtml-chess/sound/castle1.wav';
	  var src2 = 'castle1.wav';
	  ludo.audio.addSound('start', src);

	  // then
	  assertEquals(src, ludo.audio.getSound('start'));

	  ludo.audio.playSound('start');
    }
});
