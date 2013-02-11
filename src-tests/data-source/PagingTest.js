TestCase("PagingTest", {

	setUp:function () {
		if (ludo.CustomDataSource === undefined) {
			var data = {"data":[
				{"country":"Japan", "capital":"Tokyo (de facto)", "population":"13,185,502"},
				{"country":"South Korea", "capital":"Seoul", "population":"10,464,051"},
				{"country":"Russia", "capital":"Moscow", "population":"10,126,424"},
				{"country":"Iran", "capital":"Tehran", "population":"9,110,347"},
				{"country":"Mexico", "capital":"Mexico City", "population":"8,841,916"},
				{"country":"Indonesia", "capital":"Jakarta", "population":"8,489,910"},
				{"country":"Colombia", "capital":"Bogota", "population":"7,866,160"},
				{"country":"China", "capital":"Beijing", "population":"7,741,274"},
				{"country":"Egypt", "capital":"Cairo", "population":"7,438,376"},
				{"country":"United Kingdom", "capital":"London", "population":"7,287,555"},
				{"country":"Peru", "capital":"Lima", "population":"7,220,971"},
				{"country":"Iraq", "capital":"Baghdad", "population":"7,216,040"},
				{"country":"Hong Kong (China)", "capital":"Hong Kong", "population":"6,752,001"},
				{"country":"Thailand", "capital":"Bangkok", "population":"6,542,751"},
				{"country":"Bangladesh", "capital":"Dhaka", "population":"6,080,671"},
				{"country":"Saudi Arabia", "capital":"Riyadh", "population":"5,318,636"},
				{"country":"Chile", "capital":"Santiago", "population":"5,012,973"},
				{"country":"Turkey", "capital":"Ankara", "population":"4,431,719"},
				{"country":"Singapore", "capital":"Singapore", "population":"4,408,220"},
				{"country":"Democratic Republic of the Congo", "capital":"Kinshasa", "population":"4,385,264"},
				{"country":"Syria", "capital":"Damascus", "population":"3,500,000"},
				{"country":"Germany", "capital":"Berlin", "population":"3,405,250"},
				{"country":"Vietnam", "capital":"Hanoi", "population":"3,398,889"},
				{"country":"Spain", "capital":"Madrid", "population":"3,232,463"},
				{"country":"North Korea", "capital":"Pyongyang", "population":"3,144,005"},
				{"country":"Afghanistan", "capital":"Kabul", "population":"3,140,853"},
				{"country":"Argentina", "capital":"Buenos Aires", "population":"3,021,865"},
				{"country":"Ethiopia", "capital":"Addis Ababa", "population":"2,737,479"},
				{"country":"Kenya", "capital":"Nairobi", "population":"2,665,657"},
				{"country":"Republic of China (Taiwan)", "capital":"Taipei", "population":"2,619,920"},
				{"country":"Brazil", "capital":"Bras\u00edlia", "population":"2,606,885"},
				{"country":"Jordan", "capital":"Amman", "population":"2,600,603"},
				{"country":"Ukraine", "capital":"Kiev", "population":"2,591,277"},
				{"country":"Italy", "capital":"Rome", "population":"2,503,056"},
				{"country":"Angola", "capital":"Luanda", "population":"2,453,779"},
				{"country":"South Africa", "capital":"Pretoria", "population":"2,345,908"},
				{"country":"Cuba", "capital":"Havana", "population":"2,236,837"},
				{"country":"Uzbekistan", "capital":"Tashkent", "population":"2,207,850"},
				{"country":"France", "capital":"Paris", "population":"2,103,674"},
				{"country":"Romania", "capital":"Bucharest", "population":"1,942,254"},
				{"country":"Azerbaijan", "capital":"Baku", "population":"1,879,251"},
				{"country":"Dominican Republic", "capital":"Santo Domingo", "population":"1,875,453"},
				{"country":"Venezuela", "capital":"Caracas", "population":"1,838,939"},
				{"country":"Morocco", "capital":"Rabat", "population":"1,789,635"},
				{"country":"Sudan", "capital":"Khartoum", "population":"1,740,661"},
				{"country":"Hungary", "capital":"Budapest", "population":"1,728,718"},
				{"country":"Poland", "capital":"Warsaw", "population":"1,706,724"},
				{"country":"Belarus", "capital":"Minsk", "population":"1,702,061"},
				{"country":"Philippines", "capital":"Manila", "population":"1,660,714"},
				{"country":"Uganda", "capital":"Kampala", "population":"1,659,600"},
				{"country":"Ghana", "capital":"Accra", "population":"1,640,507"},
				{"country":"Cameroon", "capital":"Yaound\u00e9", "population":"1,616,000"},
				{"country":"Madagascar", "capital":"Antananarivo", "population":"1,613,375"},
				{"country":"Lebanon", "capital":"Beirut", "population":"1,574,387"},
				{"country":"Austria", "capital":"Vienna", "population":"1,552,789"},
				{"country":"Algeria", "capital":"Algiers", "population":"1,518,083"},
				{"country":"Ecuador", "capital":"Quito", "population":"1,504,991"},
				{"country":"Zimbabwe", "capital":"Harare", "population":"1,487,028"},
				{"country":"Yemen", "capital":"Sana'a", "population":"1,431,649"},
				{"country":"Guinea", "capital":"Conakry", "population":"1,399,981"},
				{"country":"Malaysia", "capital":"Kuala Lumpur", "population":"1,381,830"},
				{"country":"Uruguay", "capital":"Montevideo", "population":"1,369,797"},
				{"country":"Zambia", "capital":"Lusaka", "population":"1,331,254"},
				{"country":"Somaliland", "capital":"Hargeisa", "population":"1,300,000"},
				{"country":"Mali", "capital":"Bamako", "population":"1,289,626"},
				{"country":"Haiti", "capital":"Port-au-Prince", "population":"1,235,227"},
				{"country":"Czech Republic", "capital":"Prague", "population":"1,227,332"},
				{"country":"Libya", "capital":"Tripoli", "population":"1,184,045"},
				{"country":"Kuwait", "capital":"Kuwait City", "population":"1,171,880"},
				{"country":"Serbia", "capital":"Belgrade", "population":"1,154,589"},
				{"country":"Somalia", "capital":"Mogadishu", "population":"1,097,133"},
				{"country":"Bulgaria", "capital":"Sofia", "population":"1,090,295"},
				{"country":"Congo", "capital":"Brazzaville", "population":"1,088,044"},
				{"country":"Belgium", "capital":"Brussels", "population":"1,080,790"},
				{"country":"Armenia", "capital":"Yerevan", "population":"1,080,487"},
				{"country":"Mozambique", "capital":"Maputo", "population":"1,076,689"},
				{"country":"Sierra Leone", "capital":"Freetown", "population":"1,070,200"},
				{"country":"Georgia", "capital":"Tbilisi", "population":"1,044,993"},
				{"country":"Senegal", "capital":"Dakar", "population":"1,030,594"},
				{"country":"Burkina Faso", "capital":"Ouagadougou", "population":"1,005,231"},
				{"country":"Ireland", "capital":"Dublin", "population":"1,045,769"},
				{"country":"Liberia", "capital":"Monrovia", "population":"1,010,970"},
				{"country":"Guatemala", "capital":"Guatemala City", "population":"1,103,865"},
				{"country":"Pakistan", "capital":"Islamabad", "population":"955,629"}
			]};

			data.rows = data.data.length;
			ludo.CustomDataSource = new Class({
				Extends:ludo.dataSource.Collection,
				autoload:true,
				load:function () {
					this.fireEvent('beforeload');
                    var json = Object.clone(data);
					this.loadComplete(json.data, json);
				}
			});
		}
	},

	getCollection:function (config) {
		config = config || {};
		return new ludo.CustomDataSource(config);
	},
	"test_should_be_able_to_add_paging":function () {
		// given
		var c = this.getCollection({
			paging:{
				size:10,
				pageQuery:true
			}
		});

		// when
		var query = c.getQuery();

		// then
		assertEquals(10, query._paging.size);
		assertEquals(0, query._paging.offset);

	},
	"test_should_only_return_paged_size_of_data_from_get_data":function () {
		// given
		var c = this.getCollection({
			paging:{
				size:10
			}
		});

		// then
		assertEquals(10, c.getData().length);


	},
	"test_should_send_sorting_when_paging_on_server":function () {
		// given
		var c = this.getCollection({
			paging:{
				size:10,
				pageQuery:true
			}
		});
		c.sortBy('country', 'asc');


		// when
		var query = c.getQuery();

		// then
		assertEquals('country', query._sort.column);
		assertEquals('asc', query._sort.order);
	},
	"test_should_load_data_when_sorting_and_paging_on_server":function () {
		// given
		var c = this.getCollection({
			paging:{
				size:10,
				pageQuery:true
			}
		});
		var eventFired = false;
		c.addEvent('beforeload', function () {
			eventFired = true;
		});
		// when
		c.sortBy('country', 'asc');

		// then
		assertTrue('should sort on server', c.shouldSortOnServer());
		assertTrue(eventFired);
	},
	"test_should_be_able_to_show_next_records":function () {
		// given
		var c = this.getCollection({
			paging:{
				size:10
			}
		});
		var eventFired = false;
		c.addEvent('nextPage', function () {
			eventFired = true
		});
		// when
		c.nextPage();

		// then
		assertEquals(10, c.paging.offset);
		assertTrue(eventFired);
	},
	"test_should_set_offset_to_zero_when_sorting":function () {
		// given
		var c = this.getCollection({
			paging:{
				size:10
			}
		});
		// when
		c.nextPage();
		c.nextPage();
		c.sortBy('country', 'asc');

		// then
		assertEquals(0, c.paging.offset);
	},
	"test_should_return_total_count_of_records_on_server_on_get_count":function () {
		// given
		var c = this.getCollection({
			paging:{
				size:10
			}
		});

		// then
		assertEquals(84, c.getCount());
		assertEquals(84, c.paging.rows);

	},
	"test_should_be_able_to_go_to_last_page":function () {
		// given
		var c = this.getCollection({
			paging:{
				size:10
			}
		});

		// when
		c.lastPage();

		// then
		assertEquals(80, c.paging.offset);
	},
	"test_should_fire_last_page_event_when_going_to_last_page":function () {
		// given
		var c = this.getCollection({
			paging:{
				size:50
			}
		});
		var eventFired = false;
		c.addEvent('lastPage', function () {
			eventFired = true;
		});
		// when
		c.nextPage();

		// then
		assertTrue(eventFired);

	},
	"test_should_not_be_able_to_go_to_next_page_when_on_last_page":function () {

		// given
		var c = this.getCollection({
			paging:{
				size:50
			}
		});
		c.nextPage();
		var eventFired = false;
		c.addEvent('nextPage', function () {
			eventFired = true;
		});
		// when
		c.nextPage();

		// then
		assertEquals(50, c.paging.offset);
		assertFalse(eventFired);
	},
	"test_should_be_able_to_go_to_previous_page":function () {
		// given
		var c = this.getCollection({
			paging:{
				size:10
			}
		});
		c.nextPage();
		c.nextPage();

		// when
		c.previousPage();

		// then
		assertEquals(10, c.paging.offset);

	},
	"test_should_not_be_able_to_go_to_previous_page_when_on_first_page":function () {
		// given
		var c = this.getCollection({
			paging:{
				size:10
			}
		});
		c.nextPage();
		c.nextPage();

		// when
		c.previousPage();
		c.previousPage();
		c.previousPage();

		// then
		assertEquals(0, c.paging.offset);
	},
	"test_should_be_able_to_go_to_first_page":function () {
		// given
		var c = this.getCollection({
			paging:{
				size:10
			}
		});
		c.nextPage();
		c.nextPage();

		// when
		c.firstPage();

		// then
		assertEquals(0, c.paging.offset);

	},
	"test_should_be_able_to_get_number_of_pages":function () {
		// given
		var c = this.getCollection({
			paging:{
				size:10
			}
		});

		// then
		assertEquals(9, c.getPageCount());
	},
	"test_should_be_able_to_go_to_a_page":function () {
		// given
		var c = this.getCollection({
			paging:{
				size:10
			}
		});

		// when
		c.toPage(4);

		// then
		assertEquals(30, c.paging.offset);
		assertEquals(4, c.getPageNumber());
	},
	"test_should_fire_not_last_page_event_when_moving_away_from_last_page":function () {
		// given
		var c = this.getCollection({
			paging:{
				size:10
			}
		});
		var eventFired = false;
		c.addEvent('notLastPage', function () {
			eventFired = true;
		});

		// when
		c.lastPage();
		c.previousPage();

		// then
		assertTrue(eventFired);
	},
	"test_should_fire_not_first_page_event_when_moving_away_from_first_page":function () {
		// given
		var c = this.getCollection({
			paging:{
				size:10
			}
		});
		var eventFired = false;
		c.addEvent('notFirstPage', function () {
			eventFired = true;
		});

		// when
		c.nextPage();

		// then
		assertTrue(eventFired);
	},
	"test_should_be_able_to_have_cache":function () {
		// given
		var c = this.getCollection({
			paging:{
				size:10,
				cache:true,
				pageQuery:true
			}
		});

		// then
		assertTrue(c.isCacheEnabled());

		// when
		c.sortBy('country', 'asc');
		var expectedCacheKey = 'key|' + c.paging.offset + '|' + c.sortedBy.column + '|' + c.sortedBy.order;
		// then
		assertEquals(expectedCacheKey, c.getCacheKey());
	},
	"test_should_be_able_to_go_to_next_page_when_not_using_page_query":function () {
		// given
		var c = this.getCollection({
			paging:{
				size:10,
				pageQuery:false
			}
		});

		// when
		c.nextPage();
		var d = c.getData();
		// then
		assertEquals(84, c.data.length);
		assertEquals(10, d.length);
	},
	"test_should_be_able_to_go_to_page_when_page_query_is_false":function () {
		// given
		var c = this.getCollection({
			paging:{
				size:10,
				pageQuery:false
			},
			searchConfig:{

			}
		});

		// when
		c.toPage(4);

		// then
		assertEquals(4, c.getPageNumber());

	}

});