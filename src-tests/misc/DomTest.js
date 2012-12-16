TestCase("DomTest", {

	"test should be able to add class": function(){
		var d = new Date().getTime();
		var el = new Element('div');
		el.className = 'testing';
		for(var i=0;i<3000;i++){
			el.className = 'testing testing2 testing3';
			el.addClass('my class');
		}
		var timeMootools = new Date().getTime() - d;

		el = new Element('div');
		d = new Date().getTime();
		for(var i=0;i<3000;i++){
			el.className = 'testing testing2 testing3';
			ludo.dom.addClass(el, 'my class');
		}

		var domTime = new Date().getTime() - d;
		assertTrue(domTime + ',' + timeMootools, (domTime < timeMootools))
	},

	"test should determine class names": function(){
		// given
		var el = document.createElement('div');
		el.className = 'classOne classTwo';

		// then
		assertTrue(ludo.dom.hasClass(el, 'classOne'));
		assertTrue(ludo.dom.hasClass(el, 'classTwo'));
		assertFalse(ludo.dom.hasClass(el, 'classThree'));
		assertFalse(ludo.dom.hasClass(el, 'classO'));
	},

	"test should be able to remove class names": function(){
		// given
		var el = document.createElement('div');
		el.className = 'classOne classTwo';

		// when
		ludo.dom.removeClass(el, 'classTwo');

		// then
		assertFalse(ludo.dom.hasClass(el, 'classTwo'));
		assertTrue(el.className.indexOf('classTwo') === -1);
		assertTrue(el.className.indexOf('classOne') >= 0);
	},

	"test should be able to add class names": function(){
		// given
		var el = document.createElement('div');
		el.className = 'classOne classTwo';

		// when
		ludo.dom.addClass(el, 'classThree');

		// then
		assertTrue(ludo.dom.hasClass(el, 'classThree'));
		assertTrue(el.className, el.className.indexOf('classOne') >= 0);
		assertTrue(el.className, el.className.indexOf('classTwo') >= 0);
		assertTrue(el.className, el.className.indexOf('classThree') >= 0);
	}
});