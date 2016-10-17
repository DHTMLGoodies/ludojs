TestCase("SearchFieldTest", {


	"test should set config options":function () {
		// given
		var collection = this.getCollection();
		// when
		var searchField = new ludo.form.SearchField({
			delay:0,
			searchIn:collection
		});

		// then
		assertEquals(collection, searchField.searchIn);
		assertEquals(0, searchField.delay);

	},
	"test should be able to search":function () {
		var collection = this.getCollection();
		assertEquals(11, collection.getCount());

		var searchField = new ludo.form.SearchField({
			delay:0,
			searchIn:collection
		});

		// when
		searchField.val('John');
		searchField.search();
		// then
		assertEquals(1, collection.getCount());

	},

	"test should be able to build custom search functions": function(){
		// given
		var collection = this.getCollection();
		var searchField = new ludo.form.SearchField({
			delay:0,
			searchIn:collection,
			searchFn:function(record){
				return record.name === this.value || record.id === 102 || record.id == 103;
			}
		});

		// when
		searchField.val('John');
		searchField.search();

		// then
		assertEquals(3, collection.getCount());

	},

	getCollection:function () {
		var collection = new ludo.dataSource.Collection({
			searchConfig:{
				index:['name']
			}
		});
		collection.data = this.getData();
		return collection;
	},


	getData:function () {
		return [
			{ id:100, name:'John' },
			{ id:101, name:'Jane' },
			{ id:102, name:'David' },
			{ id:103, name:'Mike' },
			{ id:104, name:'Ann' },
			{ id:105, name:'Julie' },
			{ id:106, name:'Tom' },
			{ id:107, name:'Mia' },
			{ id:108, name:'Richard' },
			{ id:109, name:'Bob' },
			{ id:110, name:'Annie' }
		]
	}
});