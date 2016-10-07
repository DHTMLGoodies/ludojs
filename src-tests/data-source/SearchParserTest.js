TestCase("SearchParserTest", {
	getParser:function () {
		return new ludo.dataSource.SearchParser();
	},

	getParsed:function (tokens) {
		var parser = new ludo.dataSource.SearchParser();
		if (!this.isArray(tokens)) {
			tokens = tokens.split(/\s/g);
		}
		parser.parse(tokens);
		return parser.parsedSearch;
	},

	"test should parse OR queries":function () {
		// when
		var parsed = this.getParsed(['a', '|', 'b', '|', 'c']);
		var expected = { operator:'|', items:['a', 'b', 'c']};
		// then
		assertEquals(expected, parsed);

		this.assertParsed('Objects OR',
			[
				{"txt":"portugal"},
				"|",
				{"txt":"iceland"},
				"|",
				{"txt":"canada"}
			],
			{ items:[
				{"txt":"portugal"},
				{"txt":"iceland"},
				{"txt":"canada"}
			], operator:'|'}
		);

	},

	"test should parse AND queries":function () {
		// when
		var parsed = this.getParsed(['a', '&', 'b', '&', 'c']);
		var expected = { operator:'&', items:['a', 'b', 'c']};
		// then
		assertEquals(expected, parsed);

	},

	"test math operator tests":function () {
		var a, b, c, d;
		a = true;
		b = true;
		assertTrue(a && b || c && d);

		a = true;
		b = false;
		c = true;
		d = false;
		assertFalse(a && b || c && d);

		a = false;
		b = true;
		c = true;
		d = false;
		assertTrue(a || b && c);

		a = false;
		b = true;
		c = false;
		d = false;
		assertFalse(a || b && c);

	},

	"test should parse combination of OR and AND":function () {
		// when
		this.assertParsed('OR AND', 'a | b & c', {
			operator:'|',
			items:['a',
				{
					operator:'&',
					items:['b', 'c']
				}]
		});

		this.assertParsed('AND OR AND', 'a & b | c & d', {
			operator:'|',
			items:[
				{
					operator:'&', items:['a', 'b']
				},
				{
					operator:'&', items:['c', 'd']
				}
			]
		});
		this.assertParsed('AND OR AND', 'a & b | c',
			{
				operator:'|',
				items:[
					{
						operator:'&',
						items:['a', 'b']
					},
					'c'
				]
			}
		);

	},

	"test should parse branches":function () {
		this.assertParsed('Simple OR branch', '( a | b ) & c',
			{ operator:'&',
				items:[
					{ operator:'|',
						items:['a', 'b'] }
					,
					'c'
				] });

		/*
		 this.assertParsed('Simple OR branch', '< a | b >', [[['a'],['b']]]);
		 this.assertParsed('Simple AND branch', '< a & b >', [[['a','b']]]);
		 this.assertParsed('OR and AND branch', '< a | b > & c', [[['a'],['b'],'c']]); */
		this.assertParsed('AND and AND branch', '( a & b ) & c',
			{
				operator:'&',
				items:[
					{
						operator:'&', items:['a', 'b']
					},
					'c'

				]
			});
		this.assertParsed('AND and OR branch', '( a & b ) | c',
			{
				operator:'|',
				items:[
					{
						operator:'&', items:['a', 'b']
					},
					'c'

				]
			});


		this.assertParsed('NESTED BRANCH', '( ( a & b ) | ( c & d ) )',
			{"items":[
				{"items":[
					{"items":["a", "b"], "operator":"&"},
					{"items":["c", "d"], "operator":"&"}
				], "operator":"|"}
			], "operator":"&"});
	},

	assertParsed:function (message, tokens, expected) {
		var parsed = this.getParsed(tokens);
		assertEquals(message, expected, parsed);
	},

	isArray:function (obj) {
		return typeof(obj) == 'object' && (obj instanceof Array);
	}

});