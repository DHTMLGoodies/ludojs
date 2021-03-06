TestCase("CollectionTest", {

	setUp:function () {

	},
	getCollection:function (config) {

		if (ludo.MyDataSource2 === undefined) {
			var d = this.getData();
			ludo.MyDataSource2 = new Class({
				Extends:ludo.dataSource.JSONArray,
				autoload:true,
				load:function () {
                    var json = Object.clone(d);
					this.parseNewData(json.data, json);
				}
			});
		}
		config = config || {};
		return new ludo.MyDataSource2(config);
	},

    getCollectionWithData:function(config){
        if (ludo.MyDataSourceWithData === undefined) {
            var d = this.getData();
            ludo.MyDataSourceWithData = new Class({
                Extends:ludo.dataSource.JSONArray,
                autoload:false,
                load:function () {
                    var json = Object.clone(d);
                    this.parseNewData(json.data, json);
                }
            });
        }
        config = config || {};
        config.data = this.getData().data.slice(0);
        return new ludo.MyDataSourceWithData(config);
    },

    getCollectionWithDataInClassSpec:function(){
        if (ludo.MyDataSourceWithDataInSpec === undefined) {
            var d = this.getData();
            ludo.MyDataSourceWithDataInSpec = new Class({
                Extends:ludo.dataSource.JSONArray,
                autoload:false,
                data:this.getData().data.slice(0),
                load:function () {
                    var json = Object.clone(d);
                    this.parseNewData(json.data, json);
                }
            });
        }
        return new ludo.MyDataSourceWithDataInSpec({});

    },

	"test should be able to get record count":function () {
		// given
		var c = this.getCollection();

		// when
		var expectedCount = this.getData().data.length;
		// then

		assertEquals(expectedCount, c.getCount());
	},

	"test should be able to sort by a column":function () {
		// given
		var c = this.getCollection();

		// when
		c.sortBy('country');

		// then
		assertEquals('Abkhazia', c.getData()[0].country);

	},

	"test should sort descending when sorting same column twice":function () {
		// given
		var c = this.getCollection();

		// when
		c.sortBy('country');

		// then
		assertEquals('Abkhazia', c.getData()[0].country);

		// when
		c.sortBy('country');

		// then
		assertEquals('Zimbabwe', c.getData()[0].country);

	},

    "test should be able to define initial data for collection": function(){
        // given
        var c = this.getCollectionWithData();

        // then
        assertTrue(c.hasData());
        assertEquals(249, c.getData().length);
    },

    "test should be able to define initial data in class spec": function(){
        // given
        var c = this.getCollectionWithDataInClassSpec();

        // then
        assertTrue(c.hasData());
        assertEquals(249, c.getData().length);

    },



	"test should fire sort event when sorting":function () {
		// given
		var c = this.getCollection();
		var eventFired = false;
		var eventArg = {};

		// when
		c.addEvent('sort', function (arg) {
			eventFired = true;
			eventArg = arg;
		});
		c.sortBy('country');

		// then
		assertTrue(eventFired);
		assertEquals('country', eventArg.column);
		assertEquals('asc', eventArg.order);
	},

	"test should be able to define custom sort functions":function () {
		// given
		var c = this.getCollection({
			sortFn:{
				population:{
					'asc':function (a, b) {
						return parseInt(a.population.replace(/[^0-9]/g, '')) < parseInt(b.population.replace(/[^0-9]/g, '')) ? -1 : 1
					},
					'desc':function (a, b) {
						return parseInt(a.population) > parseInt(b.population) ? -1 : 1
					}
				}
			}
		});

		// when
		c.sortBy('population');

		// then
		assertEquals('King Edward Point', c.getData()[0].capital);
	},

	"test should be able to add record":function () {
		// given
		var c = this.getCollection();
		var currentCount = c.getCount();
		var eventFired = false;

		// when
		c.addEvent('add', function () {
			eventFired = true;
		});
		c.addRecord({
			country:'Norge', capital:'Stavanger', population:'90000'
		});

		// then
		assertEquals(currentCount + 1, c.getCount());
		assertTrue(eventFired);
	},

	"test should be able to find a record":function () {
		// given
		var c = this.getCollection();

		// when
		var record = c.findRecord({
			capital:'Oslo'
		});

		// then
		assertEquals('Norway', record.country);
	},

	"test should be able to find record by multiple keys": function(){
		// given
		var c = this.getCollection({
			primaryKey : ['capital','id']
		});

		// when
		var record = c.findRecord({
			capital:'Canberra',
			id : 1000
		});

		// then
		assertNotUndefined(record);
		assertEquals('Australia', record.country);
	},

	"test should be able to select a record":function () {
		// given
		var c = this.getCollection({
			listeners:{
				select:function (rec) {
					eventFired = true;
					selectedRecord = rec;
				}
			}
		});
		var eventFired = false;
		var selectedRecord = {};

		// when
		c.selectRecord({
			capital:'Oslo'
		});

		// then
		assertNotUndefined(c.getSelectedRecord());
		assertTrue(eventFired);
		assertEquals('Oslo', selectedRecord.capital);
		assertEquals('Norway', selectedRecord.country);
	},

	"test should fire deselect event when selecting record":function () {
		// given
		var deselectedRecord = {};
		var c = this.getCollection({
			listeners:{
				deselect:function (rec) {
					eventFired = true;
					deselectedRecord = rec;
				}
			}
		});
		var eventFired = false;

		// when
		c.selectRecord({
			capital:'Oslo'
		});
		c.selectRecord({
			country:'Japan'
		});

		// then
		assertTrue(eventFired);
		assertEquals('Oslo', deselectedRecord.capital);
		assertEquals('Norway', deselectedRecord.country);
	},

	"test should be able to select next record":function () {
		// given
		var c = this.getCollection();
		c.selectRecord({
			capital:'Oslo'
		});

		// when
		var next = c.next();

		// then
		assertEquals('Portugal', next.country);
	},

	"test should be able to select previous record":function () {
		// given
		var c = this.getCollection();
		c.selectRecord({
			capital:'Oslo'
		});

		// when
		var previous = c.previous();

		// then
		assertEquals('Eritrea', previous.country);
	},

	"test should not return records when a match is not found": function(){
		var c = new ludo.dataSource.JSONArray();

		c.addRecord({
			id : 100,
			title : 'My title'
		});

		// when
		var found = c.findRecord(101);


		// then
		assertUndefined(found, found);
	},

	"test should get record by id if it does not exists": function(){
		var c = new ludo.dataSource.JSONArray();

		c.addRecord({
			id : 100,
			title : 'My title'
		});

		// then
		assertUndefined(c.getById(101));
	},

	"test should be able to find multiple records":function () {
		// given
		var c = this.getCollection();

		// when
		var records = c.findRecords({
			country:'Norway'
		});

		// then
		assertEquals(2, records.length);
	},

	"test should be able to select multiple records":function () {
		// given
		var c = this.getCollection();

		// when
		c.selectRecords({
			country:'Norway'
		});

		// then
		assertEquals(2, c.getSelectedRecords().length);

	},

	"test should be able to delete a record":function () {
		// given
		var c = this.getCollection();
		var count = c.getCount();

		// when
		c.remove({
			country:'Sweden'
		});

		// then
		assertEquals(count - 1, c.getCount());

	},

	"test should be able to delete multiple records":function () {
		// given
		var c = this.getCollection();
		var count = c.getCount();

		// when
		c.deleteRecords({
			country:'Norway'
		});

		// then
		assertEquals(count - 2, c.getCount());
	},

	"test should be able to create range of selected records":function () {
		// given
		var c = this.getCollection();

		// when
		c.selectRecords({
			country:'Norway'
		});
		c.selectTo({
			country:'Denmark'
		});

		var selectedRecords = c.getSelectedRecords();

		// then
		assertEquals(7, selectedRecords.length);
		assertEquals('Norway', selectedRecords[0].country);
		assertEquals('Denmark', selectedRecords[6].country);
	},

	"test should be able to select two records":function () {
		// given
		var c = this.getCollection();

		// when
		c.selectRecord({
			country:'Norway'
		});


	},

	"test should be able to select record by index":function () {
		// given
		var c = this.getCollection();

		// when
		var rec = c.selectRecordIndex(9);

		// then
		assertNotUndefined(rec);
		assertEquals('United Kingdom', rec.country);
	},

	"test should be able to update record":function () {
		// given
		var c = this.getCollection();

		// when
		c.updateRecord({
				country:'Norway'
			},
			{
				capital:'Stavanger'
			}
		);
		var rec = c.findRecord({
			country:'Norway'
		});
		// then

		assertEquals('Stavanger', rec.capital);
	},

	"test should set unique id for records":function () {
		// given
		var c = this.getCollection();

		// when
		c.load();
		var record = c.findRecord({country:'Norway'});

		// then
		assertNotUndefined(record.uid);
	},

	"test should fire change event on search":function () {
		// given
		var c = this.getCollection({
			searchConfig:{
				index:['capital', 'country']
			},
			paging:{
				size:10
			}
		});

		var eventFired = false;
		c.addEvent('change', function () {
			eventFired = true;
		});
		// when
		c.search('e');

		// then
		assertTrue(eventFired);

	},

	"test should fire change event on sort":function () {
		// given
		var c = this.getCollection();

		var eventFired = false;
		c.addEvent('change', function () {
			eventFired = true;
		});
		// when
		c.sortBy('capital', 'asc');

		// then
		assertTrue(eventFired);
	},

	"test should be able to use by and ascending functions":function () {
		// given
		var c = this.getCollection();

		// when
		c.by('capital').ascending().sort();
		// then
		this.assertAscending(c);

		// when
		c.by('capital').sort();
		// then
		this.assertDescending(c);

	},

	"test should be able to use by and descending functions":function () {
		// given
		var c = this.getCollection();

		// when
		c.by('capital').descending().sort();
		// then
		this.assertDescending(c);

		// when
		c.by('capital').sort();
		// then
		this.assertAscending(c);
	},

	assertAscending:function(c){
		assertEquals('First', c.getData()[0].country);
	},

	assertDescending:function(c){
		assertEquals('Last', c.getData()[0].country);
	},

	log:function (what) {
		if (typeof what == 'object')what = JSON.encode(what);
		console.log(what);
	},

	"test should be able to find next record when search is active":function () {
		// given
		var c = this.getCollection();

		// when
		c.search('Country');
		c.selectRecordIndex(0);

		var rec = c.getSelectedRecord();

		// then
		assertEquals('Country1', rec.country);

		// when
		c.next();
		rec = c.getSelectedRecord();

		// then
		assertEquals('Country2', rec.country);
		// when
		c.previous();
		rec = c.getSelectedRecord();

		// then
		assertEquals('Country1', rec.country);
	},

	"test should not fire update event when selecting record(BUG)":function(){
		// given
		var c = this.getCollection();
		var eventFired = false;
		c.addEvent('update', function(){
			eventFired = true;
		});

		// when
		c.selectRecord({
			country : 'Japan'
		});
		// then
		assertFalse(eventFired);

	},

	"test should be able to get record by id": function(){
		// given
		var c = this.getCollection({
			primaryKey:'country'
		});
		assertEquals('country', c.primaryKey);
		// when
		var record = c.getById('Japan');

		// then
		assertEquals('Tokyo', record.capital);

	},

	"test should be able to update records using record objects": function(){
		// given
		var c = this.getCollection({
			primaryKey:'country'
		});

		// when
		var rec = c.getById('Japan');
		c.getRecord('Japan').set('capital','Beijing');
		// then
		assertEquals('Beijing', rec.capital);
	},


	"test should be able have multiple id fields": function(){
		// given
		var c = this.getCollection({
			primaryKey:['country','capital']
		});

		// when
		var rec = c.getById({ country : 'Japan', capital : 'Tokyo'});

		// then
		assertEquals('Japan', rec.country);
		assertEquals('Tokyo', rec.capital);
	},

	"test should fire update event when a record is updated": function(){
		// given
		var c = this.getCollection({
			primaryKey:'country'
		});
		var eventFired = false;
		var updateRecord = null;
		c.addEvent('update', function(record){
			eventFired = true;
			updateRecord = record;
		});
		// when
		c.getRecord('Japan').set('capital','Beijing');
		// then
		assertTrue(eventFired);
		assertEquals('Japan', updateRecord.country);
		assertEquals('Beijing', updateRecord.capital);
	},

	"test should be able to get reference to an updated record after primary key has been changed": function(){
		// given
		var c = this.getCollection({
			primaryKey:'country'
		});

		// when
		c.getRecord('Japan').set('country', 'Nippon');
		var newRecord = c.getById('Nippon');

		// then
		assertNotUndefined(c.index['Nippon']);
		assertEquals('Tokyo', newRecord.capital);
	},

	getData:function () {
		var data = {"data":[
			{"country":"Japan", "capital":"Tokyo", "population":"13,185,502"},
			{"country":"South Korea", "capital":"Seoul", "population":"10,464,051"},
			{"country":"Russia", "capital":"Moscow", "population":"10,126,424"},
			{"country":"Iran", "capital":"Tehran", "population":"9,110,347"},
			{"country":"Mexico", "capital":"Mexico City", "population":"8,841,916"},
			{"country":"Indonesia", "capital":"Jakarta", "population":"8,489,910"},
			{"country":"Colombia", "capital":"Bogot\u00e1", "population":"7,866,160"},
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
			{"country":"Pakistan", "capital":"Islamabad", "population":"955,629"},
			{"country":"Nicaragua", "capital":"Managua", "population":"926,883"},
			{"country":"Myanmar", "capital":"Naypyidaw", "population":"925,000"},
			{"country":"Mongolia", "capital":"Ulan Bator", "population":"907,802"},
			{"country":"Malawi", "capital":"Lilongwe", "population":"902,388"},
			{"country":"Canada", "capital":"Ottawa", "population":"898,150"},
			{"country":"Bolivia", "capital":"La Paz", "population":"877,363"},
			{"country":"Kyrgyzstan", "capital":"Bishkek", "population":"843,240"},
			{"country":"Togo", "capital":"Lom\u00e9", "population":"824,738"},
			{"country":"Panama", "capital":"Panama City", "population":"813,097"},
			{"country":"Nepal", "capital":"Kathmandu", "population":"812,026"},
			{"country":"Oman", "capital":"Muscat", "population":"797,000"},
			{"country":"Niger", "capital":"Niamey", "population":"794,814"},
			{"country":"Nigeria", "capital":"Abuja", "population":"778,567"},
			{"country":"Sweden", "capital":"Stockholm", "population":"770,284"},
			{"country":"Tunisia", "capital":"Tunis", "population":"767,629"},
			{"country":"Turkmenistan", "capital":"Ashgabat", "population":"763,537"},
			{"country":"Chad", "capital":"N'Djamena", "population":"751,288"},
			{"country":"Israel", "capital":"Jerusalem", "population":"780,200"},
			{"country":"Netherlands", "capital":"Amsterdam", "population":"740,094"},
			{"country":"Honduras", "capital":"Tegucigalpa", "population":"735,982"},
			{"country":"Central African Republic", "capital":"Bangui", "population":"731,548"},
			{"country":"Greece", "capital":"Athens", "population":"721,477"},
			{"country":"Mauritania", "capital":"Nouakchott", "population":"719,167"},
			{"country":"Rwanda", "capital":"Kigali", "population":"718,414"},
			{"country":"Latvia", "capital":"Riga", "population":"713,016"},
			{"country":"Jamaica", "capital":"Kingston", "population":"701,063"},
			{"country":"Kazakhstan", "capital":"Astana", "population":"700,000"},
			{"country":"Croatia", "capital":"Zagreb", "population":"804,200"},
			{"country":"Cambodia", "capital":"Phnom Penh", "population":"650,651"},
			{"country":"United States", "capital":"Washington, D.C.", "population":"601,723"},
			{"country":"Finland", "capital":"Helsinki", "population":"596,661"},
			{"country":"Moldova", "capital":"Chi\u015fin\u0103u", "population":"794,800"},
			{"country":"United Arab Emirates", "capital":"Abu Dhabi", "population":"585,097"},
			{"country":"Tajikistan", "capital":"Dushanbe", "population":"582,496"},
			{"country":"Lithuania", "capital":"Vilnius", "population":"556,723"},
			{"country":"Gabon", "capital":"Libreville", "population":"556,425"},
			{"country":"Eritrea", "capital":"Asmara", "population":"543,707"},
			{"country":"Norway", "capital":"Oslo", "population":"575,475"},
			{"country":"Portugal", "capital":"Lisbon", "population":"564,657"},
			{"country":"El Salvador", "capital":"San Salvador", "population":"521,366"},
			{"country":"Paraguay", "capital":"Asunci\u00f3n", "population":"520,722"},
			{"country":"Macau (China)", "capital":"Macau", "population":"520,400"},
			{"country":"Macedonia", "capital":"Skopje", "population":"506,926"},
			{"country":"Denmark", "capital":"Copenhagen", "population":"506,166"},
			{"country":"Djibouti", "capital":"Djibouti (city)", "population":"475,332"},
			{"country":"C\u00f4te d'Ivoire", "capital":"Yamoussoukro", "population":"454,929"},
			{"country":"Guinea-Bissau", "capital":"Bissau", "population":"452,640"},
			{"country":"Slovakia", "capital":"Bratislava", "population":"424,207"},
			{"country":"Puerto Rico (USA)", "capital":"San Juan", "population":"421,356"},
			{"country":"Estonia", "capital":"Tallinn", "population":"403,547"},
			{"country":"Burundi", "capital":"Bujumbura", "population":"384,461"},
			{"country":"Bosnia and Herzegovina", "capital":"Sarajevo", "population":"383,604"},
			{"country":"New Zealand", "capital":"Wellington", "population":"381,900"},
			{"country":"Albania", "capital":"Tirana", "population":"763,634"},
			{"country":"South Sudan", "capital":"Juba", "population":"372,410"},
			{"country":"Australia", "capital":"Canberra", "population":"354,644","id" : 1000},
			{"country":"Costa Rica", "capital":"San Jos\u00e9", "population":"328,195"},
			{"country":"Qatar", "capital":"Al-Doha", "population":"303,429"},
			{"country":"India", "capital":"New Delhi", "population":"292,300"},
			{"country":"Papua New Guinea", "capital":"Port Moresby", "population":"299,396"},
			{"country":"Tanzania", "capital":"Dodoma", "population":"287,200"},
			{"country":"Laos", "capital":"Vientiane", "population":"287,579"},
			{"country":"Cyprus", "capital":"Nicosia (south)", "population":"270,000"},
			{"country":"Lesotho", "capital":"Maseru", "population":"267,652"},
			{"country":"Slovenia", "capital":"Ljubljana", "population":"264,265"},
			{"country":"Suriname", "capital":"Paramaribo", "population":"254,147"},
			{"country":"Namibia", "capital":"Windhoek", "population":"252,721"},
			{"country":"Bahamas", "capital":"Nassau", "population":"248,948"},
			{"country":"Botswana", "capital":"Gaborone", "population":"225,656"},
			{"country":"Benin", "capital":"Porto-Novo", "population":"223,552"},
			{"country":"Western Sahara", "capital":"El Aai\u00fan", "population":"194,668"},
			{"country":"Transnistria", "capital":"Tiraspol", "population":"159,163"},
			{"country":"Mauritius", "capital":"Port Louis", "population":"147,251"},
			{"country":"Montenegro", "capital":"Podgorica", "population":"141,854"},
			{"country":"Bahrain", "capital":"Manama", "population":"140,616"},
			{"country":"Guyana", "capital":"Georgetown", "population":"134,599"},
			{"country":"Cape Verde", "capital":"Praia", "population":"125,464"},
			{"country":"Switzerland", "capital":"Berne (de facto)", "population":"121,631"},
			{"country":"Sri Lanka", "capital":"Sri Jayawardenapura Kotte", "population":"118,556"},
			{"country":"Iceland", "capital":"Reykjav\u00edk", "population":"115,000"},
			{"country":"Maldives", "capital":"Mal\u00e9", "population":"103,693"},
			{"country":"Bhutan", "capital":"Thimphu", "population":"101,259"},
			{"country":"Equatorial Guinea", "capital":"Malabo", "population":"100,677"},
			{"country":"Barbados", "capital":"Bridgetown", "population":"96,578"},
			{"country":"New Caledonia (France)", "capital":"Noum\u00e9a", "population":"89,207"},
			{"country":"Northern Cyprus", "capital":"Nicosia (north)", "population":"84,893"},
			{"country":"Fiji", "capital":"Suva", "population":"84,410"},
			{"country":"Swaziland", "capital":"Mbabane", "population":"81,594"},
			{"country":"Luxembourg", "capital":"Luxembourg", "population":"76,420"},
			{"country":"Northern Mariana Islands (USA)", "capital":"Saipan", "population":"62,392"},
			{"country":"Comoros", "capital":"Moroni", "population":"60,200"},
			{"country":"Solomon Islands", "capital":"Honiara", "population":"59,288"},
			{"country":"East Timor", "capital":"Dili", "population":"59,069"},
			{"country":"Saint Lucia", "capital":"Castries", "population":"57,000"},
			{"country":"S\u00e3o Tom\u00e9 and Pr\u00edncipe", "capital":"Sao Tome", "population":"56,166"},
			{"country":"American Samoa (USA)", "capital":"Pago Pago", "population":"52,000"},
			{"country":"Trinidad and Tobago", "capital":"Port of Spain", "population":"50,479"},
			{"country":"Nagorno-Karabakh Republic", "capital":"Stepanakert", "population":"49,986"},
			{"country":"Cura\u00e7ao (Netherlands)", "capital":"Willemstad", "population":"49,885"},
			{"country":"Abkhazia", "capital":"Sukhumi", "population":"43,700"},
			{"country":"Samoa", "capital":"Apia", "population":"39,813"},
			{"country":"Vanuatu", "capital":"Port Vila", "population":"38,000"},
			{"country":"Monaco", "capital":"Monaco", "population":"35,986"},
			{"country":"Gambia", "capital":"Banjul", "population":"34,828"},
			{"country":"Kiribati", "capital":"Tarawa", "population":"30,000"},
			{"country":"Aruba (Netherlands)", "capital":"Oranjestad", "population":"29,998"},
			{"country":"Seychelles", "capital":"Victoria", "population":"29,298"},
			{"country":"Gibraltar (UK)", "capital":"Gibraltar", "population":"29,286"},
			{"country":"Jersey (UK)", "capital":"Saint Helier", "population":"28,380"},
			{"country":"Brunei", "capital":"Bandar Seri Begawan", "population":"28,135"},
			{"country":"Cayman Islands (UK)", "capital":"George Town", "population":"26,798"},
			{"country":"Isle of Man (UK)", "capital":"Douglas", "population":"26,600"},
			{"country":"French Polynesia (France)", "capital":"Papeete", "population":"26,200"},
			{"country":"West Bank (Israel\/PNA)", "capital":"Ramallah (de facto)", "population":"25,500"},
			{"country":"Marshall Islands", "capital":"Majuro", "population":"25,400"},
			{"country":"Andorra", "capital":"Andorra la Vella", "population":"22,884"},
			{"country":"Antigua and Barbuda", "capital":"St. John's", "population":"22,679"},
			{"country":"Tonga", "capital":"Nuku\\\u02bbalofa", "population":"22,400"},
			{"country":"Faroe Islands (Denmark)", "capital":"T\u00f3rshavn", "population":"18,573"},
			{"country":"Guernsey (UK)", "capital":"St. Peter Port", "population":"16,701"},
			{"country":"Saint Vincent and the Grenadines", "capital":"Kingstown", "population":"16,031"},
			{"country":"Greenland (Denmark)", "capital":"Nuuk (Godth\u00e5b)", "population":"15,469"},
			{"country":"South Ossetia", "capital":"Tskhinvali", "population":"15,000"},
			{"country":"Dominica", "capital":"Roseau", "population":"14,847"},
			{"country":"Saint Kitts and Nevis", "capital":"Basseterre", "population":"13,043"},
			{"country":"Belize", "capital":"Mariehamn", "population":"11,296"},
			{"country":"United States Virgin Islands (US)", "capital":"Charlotte Amalie", "population":"10,817"},
			{"country":"Federated States of Micronesia", "capital":"Palikir", "population":"9,900"},
			{"country":"British Virgin Islands (UK)", "capital":"Road Town", "population":"9,400"},
			{"country":"Grenada", "capital":"St. George's", "population":"7,500"},
			{"country":"Malta", "capital":"Valletta", "population":"6,315"},
			{"country":"Collectivity of Saint Martin (France)", "capital":"Marigot", "population":"5,700"},
			{"country":"Saint Pierre and Miquelon (France)", "capital":"Saint-Pierre", "population":"5,509"},
			{"country":"Cook Islands (NZ)", "capital":"Avarua", "population":"5,445"},
			{"country":"Liechtenstein", "capital":"Vaduz", "population":"5,248"},
			{"country":"San Marino", "capital":"City of San Marino", "population":"4,493"},
			{"country":"Tuvalu", "capital":"Funafuti", "population":"4,492"},
			{"country":"Turks and Caicos Islands (UK)", "capital":"Cockburn Town", "population":"3,700"},
			{"country":"Saint Barth\u00e9lemy (France)", "capital":"Gustavia", "population":"3,000"},
			{"country":"Falkland Islands (UK)", "capital":"Stanley", "population":"2,115"},
			{"country":"Svalbard (Norway)", "capital":"Longyearbyen", "population":"2,075"},
			{"country":"Christmas Island (Australia)", "capital":"Flying Fish Cove", "population":"1,493"},
			{"country":"Sint Maarten (Netherlands)", "capital":"Philipsburg", "population":"1,338"},
			{"country":"Wallis and Futuna (France)", "capital":"Mata-Utu", "population":"1,191"},
			{"country":"Anguilla (UK)", "capital":"The Valley", "population":"1,169"},
			{"country":"Nauru", "capital":"Yaren (de facto)", "population":"1,100"},
			{"country":"Guam (USA)", "capital":"Hag\u00e5t\u00f1a", "population":"1,100"},
			{"country":"Montserrat (UK)", "capital":"Brades (de facto)", "population":"1,000"},
			{"country":"Bermuda (UK)", "capital":"Hamilton", "population":"969"},
			{"country":"Norfolk Island (Australia)", "capital":"Kingston", "population":"880"},
			{"country":"Holy See", "capital":"The Vatican", "population":"826"},
			{"country":"Saint Helena, Ascension and Tristan da Cunha (UK)", "capital":"Jamestown", "population":"714"},
			{"country":"Niue (NZ)", "capital":"Alofi", "population":"616"},
			{"country":"Country1", "capital":"B", "population":"955,629"},
			{"country":"Country2", "capital":"C", "population":"955,629"},
			{"country":"Tokelau (NZ)", "capital":"Nukunonu (de facto)", "population":"426"},
			{"country":"Palau", "capital":"Ngerulmud", "population":"391"},
			{"country":"Cocos (Keeling) Islands (Australia)", "capital":"West Island", "population":"120"},
			{"country":"Pitcairn Islands (UK)", "capital":"Adamstown", "population":"45"},
			{"country":"South Georgia and the South Sandwich Islands (UK)", "capital":"King Edward Point", "population":"18"},
			{"country":"Norway", "capital":"Stavanger", "population":"90000"},
			{"country":"C Dummy", "capital":"Islamabad", "population":"955,629"},
			{"country":"Pakistan", "capital":"Capital dummy", "population":"955,629"},
			{"country":"First", "capital":"Aaaa", "population":"955,629"},
			{"country":"Last", "capital":"Zzzz", "population":"955,629"}
		]};
		for (var i = 0; i < data.data.length; i++) {
			if(data.data[i].id== undefined) data.data[i].id = (i + 1);
		}
		return data;
	}


});

