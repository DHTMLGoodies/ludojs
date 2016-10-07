TestCase("UtilTests", {

	"test should find if an object is function": function(){

		assertTrue(ludo.util.isFunction(function(){ return 'hello' }));
		assertFalse(ludo.util.isFunction('string'));
		assertFalse(ludo.util.isFunction({ a : 'b' }));
		assertFalse(ludo.util.isFunction([1,2,3]));


	},

	"test should find if an object is object": function(){

		assertFalse(ludo.util.isObject(function(){ return 'hello' }));
		assertFalse(ludo.util.isObject('string'));
		assertFalse(ludo.util.isObject([]));
		assertTrue(ludo.util.isObject({ a : 'b' }));
	},

	"test should find if an object is string": function(){

		assertFalse(ludo.util.isString(function(){ return 'hello' }));
		assertTrue(ludo.util.isString('string'));
		assertFalse(ludo.util.isString({ a : 'b' }));
		assertFalse(ludo.util.isString([]));
	},

	"test should find if an object is array": function(){
		assertFalse(ludo.util.isArray(function(){ return 'hello' }));
		assertFalse(ludo.util.isArray('string'));
		assertFalse(ludo.util.isArray({ a : 'b' }));
		assertTrue(ludo.util.isArray([]));

	}
});