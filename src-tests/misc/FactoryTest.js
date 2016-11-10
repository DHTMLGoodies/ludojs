TestCase("FactoryTest", {

	"test should be able to create namespace": function(){
		// when
		ludo.factory.ns("alf.magne.kalleland");

		assertNotUndefined(window.alf);
		assertNotUndefined(window.alf.magne);
		assertNotUndefined(window.alf.magne.kalleland);
		assertNotUndefined(ludo);
		assertNotUndefined(Class);
	},

	"should be able to build class using config object": function(){
		// given
		ludo.MyClass = new Class({
			Extends: ludo.View,
			type:'MyClass'
		});

		// when
		var v = new ludo.View({
			children:[{ type:'MyClass', id:'myId'}]
		});

		// then
		assertEquals('MyClass', ludo.get('myId').type);
		assertEquals(v, ludo.get('myId').parentComponent);
	},

	"test should be able to register application namespace": function(){
		// given
		ludo.factory.createNamespace('MyApp');
		MyApp.MyClass = new Class({
			Extends: ludo.View,
			type : 'MyApp.MyClass'
		});

		// when
		var view = ludo.factory.create({
			type : 'MyApp.MyClass'
		});

		// then
		assertEquals('MyApp.MyClass', view.type);
	},

	"test should be able to pass constructor arguments to factory": function(){
		// given
		ludo.factory.createNamespace('MyApp2');
		MyApp2.MyClass = new Class({
			Extends: ludo.View,
			type : 'MyApp2.MyClass',
			arg1:undefined,
			arg2:undefined,
			ludoConfig:function(config){
				this.parent(config);
				this.arg1 = config.arg1;
				this.arg2 = config.arg2;
			}
		});

		// when
		var view = ludo.factory.create({
			type : 'MyApp2.MyClass',
			arg1:'John',
			arg2:'Doe'
		});

		// then
		assertEquals('John', view.arg1);
		assertEquals('Doe', view.arg2);
	},

	"test should be able to create classes in namespace with same name as class in ludo NS": function(){
		// given
		ludo.factory.createNamespace('MyApp3');
		MyApp3.View = new Class({
			Extends: ludo.View,
			type : 'MyApp3.View',
			arg1:undefined,
			arg2:undefined,
			ludoConfig:function(config){
				this.parent(config);
				this.arg1 = config.arg1;
				this.arg2 = config.arg2;
			}
		});

		// when
		var view = ludo.factory.create({
			type : 'MyApp3.View'
		});

		// then
		assertEquals('MyApp3.View', view.type);

	},

	"test should be able to register classes directly": function(){
		// given
		ludo.MyApp = new Class({
			Extends: ludo.View,
			type : 'MyApp'
		});

		ludo.factory.registerClass('MySpecialClass', ludo.MyApp);

		// when
		var view = ludo.factory.create({
			type : 'MySpecialClass'
		});
		// then
		assertEquals('MyApp', view.type);
	},

	"test should be able to use object factory to create instances": function(){
		// given
		var view = ludo.factory.create({
			type : 'tree.Tree'
		});

		// then
		assertEquals('tree.Tree', view.type);
	}
});