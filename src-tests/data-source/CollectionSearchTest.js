TestCase("CollectionSearch", {
	getCollection:function (config) {
		if (ludo.MyDataSource === undefined) {
			ludo.MyDataSource = new Class({
				Extends:ludo.dataSource.JSONArray,
				autoload:true,
				load:function () {
                    var json = Object.clone(data);
					this.parseNewData(json.data, json);
				}
			}); 
		}
		config = config || {};
		return new ludo.MyDataSource(config);
	},

	"test should be able to have chained OR search":function () {
		// given
		var c = this.getCollection();
		var searcher = c.getSearcher();

		// when
		searcher.clear();
		searcher.where('Portugal').or('Iceland').or('Canada').execute();
		var d = c.getData();
		// then
		assertEquals(3, d.length);
	},

	"test should be able to have combination of AND and OR":function () {
		// given
		var c = this.getCollection();
		var searcher = c.getSearcher();

		// when
		searcher.where('Portugal').or('Iceland').and('Canada').execute();


		var d = c.getData();
		// then
		assertEquals(1, d.length);
		assertEquals('Portugal', d[0].country);


		// when
		searcher.where('Norway').and('oslo').or('Sweden').and('Stockholm').execute();
		d = c.getData();

		assertEquals(2, d.length);
		assertEquals('Norway', d[1].country);
		assertEquals('Sweden', d[0].country);
	},


	logResult:function (searcher, d) {
		this.log(searcher.searchParser.parsedSearch);
		this.log(searcher.searchParser.compiled);
		this.log(d);
	},

	"test should be able to have chained AND search":function () {
		var c = this.getCollection();
		var searcher = c.getSearcher();

		// when
		searcher.clear();
		searcher.where('TestCountry').and('TestCapital 1').execute();
		var d = c.getData();

		// then
		assertEquals(1, d.length);
	},

	"test should be able to group using parentheses as first or second argument":function () {
		// given
		var c = this.getCollection();
		var searcher = c.getSearcher();

		// when
		searcher.where('(', 'Portugal').or('Canada', ')').and('North-America').execute();

		var d = c.getData();
		// then


		assertEquals(1, d.length);

		searcher.clear();
		searcher.branch().or('Portugal').or('Canada').endBranch().and('North-America').execute();

		d = c.getData();

		// then
		assertEquals(1, d.length);

	},

	"test should be able to have branches":function () {
		var c = this.getCollection();
		var searcher = c.getSearcher();

		// when
		searcher.clear();

		searcher.branch().where('TestCountry').and('TestCapital 1').and('100000').endBranch().or('Portugal');

		searcher.execute();


		var d = c.getData();

		// then
		assertEquals(2, d.length);

		// when
		searcher.clear();
		searcher.branch().branch().where('Nigeria').or('Sudan').and('Africa').endBranch().or('Amsterdam').endBranch().execute();

		d = c.getData();
		// then
		assertEquals(4, d.length);

		// when
		searcher.clear();
		searcher.branch().or('Norway').or('Sweden').endBranch().and('Portugal').execute();
		// then
		assertEquals('Branch AND and OR', 0, c.getData().length);


	},


	"test should be able to specify search":function () {
		// given
		var c = this.getCollection({
			searchConfig:{
				index:['capital', 'country']
			}
		});

		// when
		var searcher = c.getSearcher();
		searcher.search('Dummy');
		var d = c.getData();


		// then
		assertEquals(2, d.length);
	},

	"test should create index on search":function () {
		// given
		var c = this.getCollection({
			searchConfig:{
				index:['capital', 'country']
			}
		});

		// when
		c.getSearcher().search('Japan');
		var d = c.getData();
		// then

		assertNotUndefined(d[0].searchIndex);
		assertEquals('tokyo japan', d[0].searchIndex);
	},

	"test should be able to delete search":function () {
		// given
		var c = this.getCollection({
			searchConfig:{
				index:['capital', 'country']
			}
		});

		// when
		c.getSearcher().search('Japan');
		c.getSearcher().search('');

		// then
		assertEquals(data.data.length, c.getData().length);
	},

	"test should be able to create default index":function () {
		// given
		var c = this.getCollection();

		// when
		c.getSearcher().createSearchIndex();
		var keys = c.getSearcher().getSearchIndexKeys();
		// when

		assertTrue(keys.indexOf('population') >= 0);
		assertTrue(keys.indexOf('capital') >= 0);
		assertTrue(keys.indexOf('country') >= 0);
	},

	"test should return only page size of search results when paging is defined":function () {
		// given
		var c = this.getCollection({
			searchConfig:{
				index:['capital', 'country']
			},
			paging:{
				size:10
			}
		});
		// when
		c.getSearcher().search('e');
		var d = c.getData();
		// then
		assertEquals(10, d.length);
	},

	"test should be able to type in search":function () {
		// given
		var c = this.getCollection({
			searchConfig:{
				index:['capital', 'country']
			},
			paging:{
				size:10
			}
		});

		// when
		c.search('L');
		c.search('Lo');
		c.search('Lon');
		c.search('Lond');
		c.search('Londo');
		c.search('London');

		// then
		assertEquals(1, c.getData().length);
	},

	"test should be able to search for multiple terms":function () {

		// given
		var c = this.getCollection({
			searchConfig:{
				index:['capital', 'country']
			},
			paging:{
				size:10
			}
		});

		var searcher = c.getSearcher();

		searcher.where('Oslo');
		searcher.or('Moscow');
		searcher.execute();


		// then
		assertEquals(2, c.getData().length);
	},

	"test should be able to define IN search":function () {
		// given
		var c = this.getCollection();
		var searcher = c.getSearcher();

		// when
		searcher.withIn(['Portugal', 'Canada']).execute();
		var d = c.getData();

		// then
		assertEquals(2, d.length);


	},

	"test should be able to add function to search":function () {
		// given
		var c = this.getCollection({
			searchConfig:{
				index:['capital', 'country']
			},
			paging:{
				size:10
			}
		});
		var searcher = c.getSearcher();
		// when
		searcher.clear();
		searcher.where('Portugal').or(function (record) {
			return record.country === 'Israel' || record.country === 'Sweden' || record.country === 'Chad'
		}).execute();

		// then
		assertEquals(4, searcher.getData().length);
	},

	"test should be able to have variables in search functions":function () {
		// given
		var c = this.getCollection({
			searchConfig:{
				index:['capital', 'country']
			},
			paging:{
				size:10
			}
		});
		var searcher = c.getSearcher();
		// when
		searcher.clear();
		searcher.where('Portugal');

		var country1 = 'Israel';
		var country2 = 'Sweden';
		var country3 = 'Chad';

		searcher.or(function (record) {
			return record.country === country1 || record.country === country2 || record.country === country3
		});

		searcher.execute();

		// then
		assertEquals(4, searcher.getData().length);

	},

	log:function (what) {
		if (typeof what == 'object')what = JSON.encode(what);
		console.log(what);
	}


});

var data = {"data":[
	{"country":"Japan", "capital":"Tokyo", "population":"13,185,502", "continent":"Asia" },
	{"country":"South Korea", "capital":"Seoul", "population":"10,464,051", "continent":"Asia" },
	{"country":"Russia", "capital":"Moscow", "population":"10,126,424", "continent":"Europe" },
	{"country":"Iran", "capital":"Tehran", "population":"9,110,347", "continent":"Asia" },
	{"country":"Mexico", "capital":"Mexico City", "population":"8,841,916", "continent":"Asia" },
	{"country":"Indonesia", "capital":"Jakarta", "population":"8,489,910", "continent":"Asia" },
	{"country":"Colombia", "capital":"Bogot\u00e1", "population":"7,866,160", "continent":"Asia" },
	{"country":"China", "capital":"Beijing", "population":"7,741,274", "continent":"Asia" },
	{"country":"Egypt", "capital":"Cairo", "population":"7,438,376", "continent":"Asia" },
	{"country":"United Kingdom", "capital":"London", "population":"7,287,555", "continent":"Europe" },
	{"country":"Peru", "capital":"Lima", "population":"7,220,971", "continent":"Asia" },
	{"country":"Iraq", "capital":"Baghdad", "population":"7,216,040", "continent":"Asia" },
	{"country":"Hong Kong (China)", "capital":"Hong Kong", "population":"6,752,001", "continent":"Asia" },
	{"country":"Thailand", "capital":"Bangkok", "population":"6,542,751", "continent":"Asia" },
	{"country":"Bangladesh", "capital":"Dhaka", "population":"6,080,671", "continent":"Asia" },
	{"country":"Saudi Arabia", "capital":"Riyadh", "population":"5,318,636", "continent":"Asia" },
	{"country":"Chile", "capital":"Santiago", "population":"5,012,973", "continent":"Asia" },
	{"country":"Turkey", "capital":"Ankara", "population":"4,431,719", "continent":"Europe" },
	{"country":"Singapore", "capital":"Singapore", "population":"4,408,220", "continent":"Asia" },
	{"country":"Democratic Republic of the Congo", "capital":"Kinshasa", "population":"4,385,264", "continent":"Africa" },
	{"country":"Syria", "capital":"Damascus", "population":"3,500,000", "continent":"Asia" },
	{"country":"Germany", "capital":"Berlin", "population":"3,405,250", "continent":"Europe" },
	{"country":"Vietnam", "capital":"Hanoi", "population":"3,398,889", "continent":"Asia" },
	{"country":"Spain", "capital":"Madrid", "population":"3,232,463", "continent":"Europe" },
	{"country":"North Korea", "capital":"Pyongyang", "population":"3,144,005", "continent":"Asia" },
	{"country":"Afghanistan", "capital":"Kabul", "population":"3,140,853", "continent":"Asia" },
	{"country":"Argentina", "capital":"Buenos Aires", "population":"3,021,865", "continent":"Asia" },
	{"country":"Ethiopia", "capital":"Addis Ababa", "population":"2,737,479", "continent":"Africa" },
	{"country":"Kenya", "capital":"Nairobi", "population":"2,665,657", "continent":"Asia" },
	{"country":"Republic of China (Taiwan)", "capital":"Taipei", "population":"2,619,920", "continent":"Asia" },
	{"country":"Brazil", "capital":"Bras\u00edlia", "population":"2,606,885", "continent":"Asia" },
	{"country":"Jordan", "capital":"Amman", "population":"2,600,603", "continent":"Asia" },
	{"country":"Ukraine", "capital":"Kiev", "population":"2,591,277", "continent":"Europe" },
	{"country":"Italy", "capital":"Rome", "population":"2,503,056", "continent":"Europe" },
	{"country":"Angola", "capital":"Luanda", "population":"2,453,779", "continent":"Asia" },
	{"country":"South Africa", "capital":"Pretoria", "population":"2,345,908", "continent":"Asia" },
	{"country":"Cuba", "capital":"Havana", "population":"2,236,837", "continent":"Asia" },
	{"country":"Uzbekistan", "capital":"Tashkent", "population":"2,207,850", "continent":"Asia" },
	{"country":"France", "capital":"Paris", "population":"2,103,674", "continent":"Europe" },
	{"country":"Romania", "capital":"Bucharest", "population":"1,942,254", "continent":"Europe" },
	{"country":"Azerbaijan", "capital":"Baku", "population":"1,879,251", "continent":"Asia" },
	{"country":"Dominican Republic", "capital":"Santo Domingo", "population":"1,875,453", "continent":"Asia" },
	{"country":"Venezuela", "capital":"Caracas", "population":"1,838,939", "continent":"Asia" },
	{"country":"Morocco", "capital":"Rabat", "population":"1,789,635", "continent":"Asia" },
	{"country":"Sudan", "capital":"Khartoum", "population":"1,740,661", "continent":"Africa" },
	{"country":"Hungary", "capital":"Budapest", "population":"1,728,718", "continent":"Europe" },
	{"country":"Poland", "capital":"Warsaw", "population":"1,706,724", "continent":"Asia" },
	{"country":"Belarus", "capital":"Minsk", "population":"1,702,061", "continent":"Europe" },
	{"country":"Philippines", "capital":"Manila", "population":"1,660,714", "continent":"Asia" },
	{"country":"Uganda", "capital":"Kampala", "population":"1,659,600", "continent":"Asia" },
	{"country":"Ghana", "capital":"Accra", "population":"1,640,507", "continent":"Asia" },
	{"country":"Cameroon", "capital":"Yaound\u00e9", "population":"1,616,000", "continent":"Africa" },
	{"country":"Madagascar", "capital":"Antananarivo", "population":"1,613,375", "continent":"Africa" },
	{"country":"Lebanon", "capital":"Beirut", "population":"1,574,387", "continent":"Asia" },
	{"country":"Austria", "capital":"Vienna", "population":"1,552,789", "continent":"Europe" },
	{"country":"Algeria", "capital":"Algiers", "population":"1,518,083", "continent":"Asia" },
	{"country":"Ecuador", "capital":"Quito", "population":"1,504,991", "continent":"Asia" },
	{"country":"Zimbabwe", "capital":"Harare", "population":"1,487,028", "continent":"Africa" },
	{"country":"Yemen", "capital":"Sana'a", "population":"1,431,649", "continent":"Asia" },
	{"country":"Guinea", "capital":"Conakry", "population":"1,399,981", "continent":"Asia" },
	{"country":"Malaysia", "capital":"Kuala Lumpur", "population":"1,381,830", "continent":"Asia" },
	{"country":"Uruguay", "capital":"Montevideo", "population":"1,369,797", "continent":"Asia" },
	{"country":"Zambia", "capital":"Lusaka", "population":"1,331,254", "continent":"Asia" },
	{"country":"Somaliland", "capital":"Hargeisa", "population":"1,300,000", "continent":"Asia" },
	{"country":"Mali", "capital":"Bamako", "population":"1,289,626", "continent":"Africa" },
	{"country":"Haiti", "capital":"Port-au-Prince", "population":"1,235,227", "continent":"Asia" },
	{"country":"Czech Republic", "capital":"Prague", "population":"1,227,332", "continent":"Asia" },
	{"country":"Libya", "capital":"Tripoli", "population":"1,184,045", "continent":"Africa" },
	{"country":"Kuwait", "capital":"Kuwait City", "population":"1,171,880", "continent":"Asia" },
	{"country":"Serbia", "capital":"Belgrade", "population":"1,154,589", "continent":"Asia" },
	{"country":"Somalia", "capital":"Mogadishu", "population":"1,097,133", "continent":"Asia" },
	{"country":"Bulgaria", "capital":"Sofia", "population":"1,090,295", "continent":"Asia" },
	{"country":"Congo", "capital":"Brazzaville", "population":"1,088,044", "continent":"Africa" },
	{"country":"Belgium", "capital":"Brussels", "population":"1,080,790", "continent":"Asia" },
	{"country":"Armenia", "capital":"Yerevan", "population":"1,080,487", "continent":"Asia" },
	{"country":"Mozambique", "capital":"Maputo", "population":"1,076,689", "continent":"Africa" },
	{"country":"Sierra Leone", "capital":"Freetown", "population":"1,070,200", "continent":"Africa" },
	{"country":"Georgia", "capital":"Tbilisi", "population":"1,044,993", "continent":"Asia" },
	{"country":"Senegal", "capital":"Dakar", "population":"1,030,594", "continent":"Africa" },
	{"country":"Burkina Faso", "capital":"Ouagadougou", "population":"1,005,231", "continent":"Africa" },
	{"country":"Ireland", "capital":"Dublin", "population":"1,045,769", "continent":"Asia" },
	{"country":"Liberia", "capital":"Monrovia", "population":"1,010,970", "continent":"Africa" },
	{"country":"Guatemala", "capital":"Guatemala City", "population":"1,103,865", "continent":"Asia" },
	{"country":"Pakistan", "capital":"Islamabad", "population":"955,629", "continent":"Asia" },
	{"country":"Nicaragua", "capital":"Managua", "population":"926,883", "continent":"Asia" },
	{"country":"Myanmar", "capital":"Naypyidaw", "population":"925,000", "continent":"Asia" },
	{"country":"Mongolia", "capital":"Ulan Bator", "population":"907,802", "continent":"Asia" },
	{"country":"Malawi", "capital":"Lilongwe", "population":"902,388", "continent":"Asia" },
	{"country":"Canada", "capital":"Ottawa", "population":"898,150", "continent":"North-America" },
	{"country":"Bolivia", "capital":"La Paz", "population":"877,363", "continent":"Asia" },
	{"country":"Kyrgyzstan", "capital":"Bishkek", "population":"843,240", "continent":"Asia" },
	{"country":"Togo", "capital":"Lom\u00e9", "population":"824,738", "continent":"Africa" },
	{"country":"Panama", "capital":"Panama City", "population":"813,097", "continent":"Asia" },
	{"country":"Nepal", "capital":"Kathmandu", "population":"812,026", "continent":"Asia" },
	{"country":"Oman", "capital":"Muscat", "population":"797,000", "continent":"Asia" },
	{"country":"Niger", "capital":"Niamey", "population":"794,814", "continent":"Africa" },
	{"country":"Nigeria", "capital":"Abuja", "population":"778,567", "continent":"Africa" },
	{"country":"Sweden", "capital":"Stockholm", "population":"770,284", "continent":"Europe" },
	{"country":"Tunisia", "capital":"Tunis", "population":"767,629", "continent":"Asia" },
	{"country":"Turkmenistan", "capital":"Ashgabat", "population":"763,537", "continent":"Asia" },
	{"country":"Chad", "capital":"N'Djamena", "population":"751,288", "continent":"Asia" },
	{"country":"Israel", "capital":"Jerusalem", "population":"780,200", "continent":"Europe" },
	{"country":"Netherlands", "capital":"Amsterdam", "population":"740,094", "continent":"Asia" },
	{"country":"Honduras", "capital":"Tegucigalpa", "population":"735,982", "continent":"Asia" },
	{"country":"Central African Republic", "capital":"Bangui", "population":"731,548", "continent":"Asia" },
	{"country":"Greece", "capital":"Athens", "population":"721,477", "continent":"Asia" },
	{"country":"Mauritania", "capital":"Nouakchott", "population":"719,167", "continent":"Asia" },
	{"country":"Rwanda", "capital":"Kigali", "population":"718,414", "continent":"Asia" },
	{"country":"Latvia", "capital":"Riga", "population":"713,016", "continent":"Asia" },
	{"country":"Jamaica", "capital":"Kingston", "population":"701,063", "continent":"Asia" },
	{"country":"Kazakhstan", "capital":"Astana", "population":"700,000", "continent":"Asia" },
	{"country":"Croatia", "capital":"Zagreb", "population":"804,200", "continent":"Europe" },
	{"country":"Cambodia", "capital":"Phnom Penh", "population":"650,651", "continent":"Asia" },
	{"country":"United States", "capital":"Washington, D.C.", "population":"601,723", "continent":"Asia" },
	{"country":"Finland", "capital":"Helsinki", "population":"596,661", "continent":"Asia" },
	{"country":"Moldova", "capital":"Chi\u015fin\u0103u", "population":"794,800", "continent":"Asia" },
	{"country":"United Arab Emirates", "capital":"Abu Dhabi", "population":"585,097", "continent":"Asia" },
	{"country":"Tajikistan", "capital":"Dushanbe", "population":"582,496", "continent":"Asia" },
	{"country":"Lithuania", "capital":"Vilnius", "population":"556,723", "continent":"Europe" },
	{"country":"Gabon", "capital":"Libreville", "population":"556,425", "continent":"Asia" },
	{"country":"Eritrea", "capital":"Asmara", "population":"543,707", "continent":"Asia" },
	{"country":"Norway", "capital":"Oslo", "population":"575,475", "continent":"Europe" },
	{"country":"Portugal", "capital":"Lisbon", "population":"564,657", "continent":"Europe" },
	{"country":"El Salvador", "capital":"San Salvador", "population":"521,366", "continent":"Asia" },
	{"country":"Paraguay", "capital":"Asunci\u00f3n", "population":"520,722", "continent":"Asia" },
	{"country":"Macau (China)", "capital":"Macau", "population":"520,400", "continent":"Asia" },
	{"country":"Macedonia", "capital":"Skopje", "population":"506,926", "continent":"Asia" },
	{"country":"Denmark", "capital":"Copenhagen", "population":"506,166", "continent":"Europe" },
	{"country":"Djibouti", "capital":"Djibouti (city)", "population":"475,332", "continent":"Asia" },
	{"country":"C\u00f4te d'Ivoire", "capital":"Yamoussoukro", "population":"454,929", "continent":"Asia" },
	{"country":"Guinea-Bissau", "capital":"Bissau", "population":"452,640", "continent":"Asia" },
	{"country":"Slovakia", "capital":"Bratislava", "population":"424,207", "continent":"Europe" },
	{"country":"Puerto Rico (USA)", "capital":"San Juan", "population":"421,356", "continent":"Asia" },
	{"country":"Estonia", "capital":"Tallinn", "population":"403,547", "continent":"Europe" },
	{"country":"Burundi", "capital":"Bujumbura", "population":"384,461", "continent":"Asia" },
	{"country":"Bosnia and Herzegovina", "capital":"Sarajevo", "population":"383,604", "continent":"Europe" },
	{"country":"New Zealand", "capital":"Wellington", "population":"381,900", "continent":"Asia" },
	{"country":"Albania", "capital":"Tirana", "population":"763,634", "continent":"Asia" },
	{"country":"South Sudan", "capital":"Juba", "population":"372,410", "continent":"Africa" },
	{"country":"Australia", "capital":"Canberra", "population":"354,644", "continent":"Asia" },
	{"country":"Costa Rica", "capital":"San Jos\u00e9", "population":"328,195", "continent":"Asia" },
	{"country":"Qatar", "capital":"Al-Doha", "population":"303,429", "continent":"Asia" },
	{"country":"India", "capital":"New Delhi", "population":"292,300", "continent":"Asia" },
	{"country":"Papua New Guinea", "capital":"Port Moresby", "population":"299,396", "continent":"Asia" },
	{"country":"Tanzania", "capital":"Dodoma", "population":"287,200", "continent":"Africa" },
	{"country":"Laos", "capital":"Vientiane", "population":"287,579", "continent":"Africa" },
	{"country":"Cyprus", "capital":"Nicosia (south)", "population":"270,000", "continent":"Asia" },
	{"country":"Lesotho", "capital":"Maseru", "population":"267,652", "continent":"Asia" },
	{"country":"Slovenia", "capital":"Ljubljana", "population":"264,265", "continent":"Asia" },
	{"country":"Suriname", "capital":"Paramaribo", "population":"254,147", "continent":"Africa" },
	{"country":"Namibia", "capital":"Windhoek", "population":"252,721", "continent":"Asia" },
	{"country":"Bahamas", "capital":"Nassau", "population":"248,948", "continent":"Asia" },
	{"country":"Botswana", "capital":"Gaborone", "population":"225,656", "continent":"Africa" },
	{"country":"Benin", "capital":"Porto-Novo", "population":"223,552", "continent":"Asia" },
	{"country":"Western Sahara", "capital":"El Aai\u00fan", "population":"194,668", "continent":"Asia" },
	{"country":"Transnistria", "capital":"Tiraspol", "population":"159,163", "continent":"Asia" },
	{"country":"Mauritius", "capital":"Port Louis", "population":"147,251", "continent":"Asia" },
	{"country":"Montenegro", "capital":"Podgorica", "population":"141,854", "continent":"Asia" },
	{"country":"Bahrain", "capital":"Manama", "population":"140,616", "continent":"Asia" },
	{"country":"Guyana", "capital":"Georgetown", "population":"134,599", "continent":"Asia" },
	{"country":"Cape Verde", "capital":"Praia", "population":"125,464", "continent":"Asia" },
	{"country":"Switzerland", "capital":"Berne (de facto)", "population":"121,631", "continent":"Asia" },
	{"country":"Sri Lanka", "capital":"Sri Jayawardenapura Kotte", "population":"118,556", "continent":"Asia" },
	{"country":"Iceland", "capital":"Reykjav\u00edk", "population":"115,000", "continent":"Europe" },
	{"country":"Maldives", "capital":"Mal\u00e9", "population":"103,693", "continent":"Asia" },
	{"country":"Bhutan", "capital":"Thimphu", "population":"101,259", "continent":"Asia" },
	{"country":"Equatorial Guinea", "capital":"Malabo", "population":"100,677", "continent":"Asia" },
	{"country":"Barbados", "capital":"Bridgetown", "population":"96,578", "continent":"Asia" },
	{"country":"New Caledonia (France)", "capital":"Noum\u00e9a", "population":"89,207", "continent":"Asia" },
	{"country":"Northern Cyprus", "capital":"Nicosia (north)", "population":"84,893", "continent":"Asia" },
	{"country":"Fiji", "capital":"Suva", "population":"84,410", "continent":"Asia" },
	{"country":"Swaziland", "capital":"Mbabane", "population":"81,594", "continent":"Asia" },
	{"country":"Luxembourg", "capital":"Luxembourg", "population":"76,420", "continent":"Europe" },
	{"country":"Northern Mariana Islands (USA)", "capital":"Saipan", "population":"62,392", "continent":"Asia" },
	{"country":"Comoros", "capital":"Moroni", "population":"60,200", "continent":"Asia" },
	{"country":"Solomon Islands", "capital":"Honiara", "population":"59,288", "continent":"Asia" },
	{"country":"East Timor", "capital":"Dili", "population":"59,069", "continent":"Asia" },
	{"country":"Saint Lucia", "capital":"Castries", "population":"57,000", "continent":"Asia" },
	{"country":"S\u00e3o Tom\u00e9 and Pr\u00edncipe", "capital":"Sao Tome", "population":"56,166", "continent":"Asia" },
	{"country":"American Samoa (USA)", "capital":"Pago Pago", "population":"52,000", "continent":"Asia" },
	{"country":"Trinidad and Tobago", "capital":"Port of Spain", "population":"50,479", "continent":"Asia" },
	{"country":"Nagorno-Karabakh Republic", "capital":"Stepanakert", "population":"49,986", "continent":"Asia" },
	{"country":"Cura\u00e7ao (Netherlands)", "capital":"Willemstad", "population":"49,885", "continent":"Asia" },
	{"country":"Abkhazia", "capital":"Sukhumi", "population":"43,700", "continent":"Asia" },
	{"country":"Samoa", "capital":"Apia", "population":"39,813", "continent":"Asia" },
	{"country":"Vanuatu", "capital":"Port Vila", "population":"38,000", "continent":"Asia" },
	{"country":"Monaco", "capital":"Monaco", "population":"35,986", "continent":"Asia" },
	{"country":"Gambia", "capital":"Banjul", "population":"34,828", "continent":"Asia" },
	{"country":"Kiribati", "capital":"Tarawa", "population":"30,000", "continent":"Asia" },
	{"country":"Aruba (Netherlands)", "capital":"Oranjestad", "population":"29,998", "continent":"Asia" },
	{"country":"Seychelles", "capital":"Victoria", "population":"29,298", "continent":"Asia" },
	{"country":"Gibraltar (UK)", "capital":"Gibraltar", "population":"29,286", "continent":"Europe" },
	{"country":"Jersey (UK)", "capital":"Saint Helier", "population":"28,380", "continent":"Europe" },
	{"country":"Brunei", "capital":"Bandar Seri Begawan", "population":"28,135", "continent":"Asia" },
	{"country":"Cayman Islands (UK)", "capital":"George Town", "population":"26,798", "continent":"Asia" },
	{"country":"Isle of Man (UK)", "capital":"Douglas", "population":"26,600", "continent":"Asia" },
	{"country":"French Polynesia (France)", "capital":"Papeete", "population":"26,200", "continent":"Asia" },
	{"country":"West Bank (Israel\/PNA)", "capital":"Ramallah (de facto)", "population":"25,500", "continent":"Asia" },
	{"country":"Marshall Islands", "capital":"Majuro", "population":"25,400", "continent":"Asia" },
	{"country":"Andorra", "capital":"Andorra la Vella", "population":"22,884", "continent":"Asia" },
	{"country":"Antigua and Barbuda", "capital":"St. John's", "population":"22,679", "continent":"Asia" },
	{"country":"Tonga", "capital":"Nuku\\\u02bbalofa", "population":"22,400", "continent":"Asia" },
	{"country":"Faroe Islands (Denmark)", "capital":"T\u00f3rshavn", "population":"18,573", "continent":"Europe" },
	{"country":"Guernsey (UK)", "capital":"St. Peter Port", "population":"16,701", "continent":"Asia" },
	{"country":"Saint Vincent and the Grenadines", "capital":"Kingstown", "population":"16,031", "continent":"Asia" },
	{"country":"Greenland (Denmark)", "capital":"Nuuk (Godth\u00e5b)", "population":"15,469", "continent":"Asia" },
	{"country":"South Ossetia", "capital":"Tskhinvali", "population":"15,000", "continent":"Asia" },
	{"country":"Dominica", "capital":"Roseau", "population":"14,847", "continent":"Asia" },
	{"country":"Saint Kitts and Nevis", "capital":"Basseterre", "population":"13,043", "continent":"Asia" },
	{"country":"Belize", "capital":"Mariehamn", "population":"11,296", "continent":"Asia" },
	{"country":"United States Virgin Islands (US)", "capital":"Charlotte Amalie", "population":"10,817", "continent":"Asia" },
	{"country":"Federated States of Micronesia", "capital":"Palikir", "population":"9,900", "continent":"Asia" },
	{"country":"British Virgin Islands (UK)", "capital":"Road Town", "population":"9,400", "continent":"Asia" },
	{"country":"Grenada", "capital":"St. George's", "population":"7,500", "continent":"Asia" },
	{"country":"Malta", "capital":"Valletta", "population":"6,315", "continent":"Asia" },
	{"country":"Collectivity of Saint Martin (France)", "capital":"Marigot", "population":"5,700", "continent":"Asia" },
	{"country":"Saint Pierre and Miquelon (France)", "capital":"Saint-Pierre", "population":"5,509", "continent":"Asia" },
	{"country":"Cook Islands (NZ)", "capital":"Avarua", "population":"5,445", "continent":"Asia" },
	{"country":"Liechtenstein", "capital":"Vaduz", "population":"5,248", "continent":"Asia" },
	{"country":"San Marino", "capital":"City of San Marino", "population":"4,493", "continent":"Asia" },
	{"country":"Tuvalu", "capital":"Funafuti", "population":"4,492", "continent":"Asia" },
	{"country":"Turks and Caicos Islands (UK)", "capital":"Cockburn Town", "population":"3,700", "continent":"Asia" },
	{"country":"Saint Barth\u00e9lemy (France)", "capital":"Gustavia", "population":"3,000", "continent":"Asia" },
	{"country":"Falkland Islands (UK)", "capital":"Stanley", "population":"2,115", "continent":"Asia" },
	{"country":"Svalbard (Norway)", "capital":"Longyearbyen", "population":"2,075", "continent":"Asia" },
	{"country":"Christmas Island (Australia)", "capital":"Flying Fish Cove", "population":"1,493", "continent":"Asia" },
	{"country":"Sint Maarten (Netherlands)", "capital":"Philipsburg", "population":"1,338", "continent":"Asia" },
	{"country":"Wallis and Futuna (France)", "capital":"Mata-Utu", "population":"1,191", "continent":"Asia" },
	{"country":"Anguilla (UK)", "capital":"The Valley", "population":"1,169", "continent":"Asia" },
	{"country":"Nauru", "capital":"Yaren (de facto)", "population":"1,100", "continent":"Asia" },
	{"country":"Guam (USA)", "capital":"Hag\u00e5t\u00f1a", "population":"1,100", "continent":"Asia" },
	{"country":"Montserrat (UK)", "capital":"Brades (de facto)", "population":"1,000", "continent":"Asia" },
	{"country":"Bermuda (UK)", "capital":"Hamilton", "population":"969", "continent":"Asia" },
	{"country":"Norfolk Island (Australia)", "capital":"Kingston", "population":"880", "continent":"Asia" },
	{"country":"Holy See", "capital":"The Vatican", "population":"826", "continent":"Asia" },
	{"country":"Saint Helena, Ascension and Tristan da Cunha (UK)", "capital":"Jamestown", "population":"714", "continent":"Asia" },
	{"country":"Niue (NZ)", "capital":"Alofi", "population":"616", "continent":"Asia" },
	{"country":"Country1", "capital":"B", "population":"955,629", "continent":"Asia" },
	{"country":"Tokelau (NZ)", "capital":"Nukunonu (de facto)", "population":"426", "continent":"Asia" },
	{"country":"Palau", "capital":"Ngerulmud", "population":"391", "continent":"Asia" },
	{"country":"Cocos (Keeling) Islands (Australia)", "capital":"West Island", "population":"120", "continent":"Asia" },
	{"country":"Pitcairn Islands (UK)", "capital":"Adamstown", "population":"45", "continent":"Asia" },
	{"country":"South Georgia and the South Sandwich Islands (UK)", "capital":"King Edward Point", "population":"18", "continent":"Asia" },
	{"country":"Norway", "capital":"Stavanger", "population":"90000", "continent":"Europe" },
	{"country":"C Dummy", "capital":"Islamabad", "population":"955,629", "continent":"Asia" },
	{"country":"Pakistan", "capital":"Capital dummy", "population":"955,629", "continent":"Asia" },
	{"country":"Country2", "capital":"A", "population":"955,629", "continent":"Asia" },
	{"country":"TestCountry 1", "capital":"TestCapital 1", "population":"100000", "continent":"Asia" },
	{"country":"TestCountry 2", "capital":"TestCapital 2", "population":"100000"}
]};
for (var i = 0; i < data.data.length; i++) {
	data.data[i].id = (i + 1);
}