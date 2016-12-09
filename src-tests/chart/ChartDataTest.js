TestCase("ChartDataTest", {



    "test should get value": function(){
        // given
        var d = this.getDataSource();

        // when
        var data = d.getData();

        // then
        assertEquals(2, data.length);
        assertEquals(100, d.valueOf(d.byId(1)));
    },


    "test should get text of": function(){
        // given
        var d = this.getDataSource();

        // then
        assertEquals("John", d.textOf(d.byId(1)));
    },

    "test should get record by id": function(){

        // given
        var d = this.getDataSource();

        // when
        var rec = d.byId(1);


        // then
        assertNotUndefined(rec);
        assertEquals('John', rec.name);
    },


    "test should set sum": function(){
        // given
        var d = this.getDataSource();

        // when
        var rec = d.byId(1);

        // then
        assertEquals(300, rec.__sum);
    },

    "test should set ratio": function(){
        // given
        var d = this.getDataSource();

        // when
        var rec = d.byId(1);

        // then
        assertEquals(100/300, rec.__fraction);

    },

    "test should find radians": function(){
        // given
        var d = this.getDataSource();

        // when
        var rec = d.byId(1);

        // then
        assertEquals(100/300 * 2 * Math.PI, rec.__radians);
    },


    "test should find angle": function(){
        // given
        var d = this.getDataSource();

        // when
        var rec = d.byId(1);

        // then
        assertEquals(0, rec.__angle);

        // when
        rec = d.byId(2);

        // then
        assertEquals(100/300 * 2 * Math.PI, rec.__angle);

    },

    "test should be able to get increments": function(){
        // given
        var d = this.getDataSource();

        // when
        var increments = d.getIncrements();

        // then
        assertNotUndefined(increments);

        assertEquals(0, increments[0]);
        assertEquals(10, increments[1]);
        assertEquals(21, increments.length);

    },

    "test should find max": function(){

        // given
        var d = this.getDataSource();

        // when
        var data = d.getData();


        // then
        assertEquals(200, data[0].__max);
        assertEquals(200, data[1].__max);
    },

    "test should fire enter event": function(){
        // given
        var d = this.getDataSource();
        var eventFired = true;
        d.on('enter', function(){
            eventFired = true;
        });
        var rec = d.byId(1);

        // when
        d.enter(rec);

        // then
        assertTrue(eventFired);

    },

    "test should fire leave event": function(){
        // given
        var d = this.getDataSource();
        var eventFired = true;
        d.on('leave', function(){
            eventFired = true;
        });
        var rec = d.byId(1);

        // when
        d.leave(rec);

        // then
        assertTrue(eventFired);

    },




    "test should find children by id": function(){

        // given
        var d = this.getDataSource2();

        // when
        var rec = d.byId(11);

        // then
        assertNotUndefined(rec);
        assertEquals('Martin', rec.name);
    },

    "test should update parent value with sum of children if not set": function(){
        // given
        var d = this.getDataSource2();

        // when
        var rec = d.byId(1);

        // then
        assertEquals(100, d.valueOf(rec));

    },

    "test should find max val when nested": function(){
        // given
        var d = this.getDataSourceNested();

        // then
        assertEquals(90000, d.maxVal);
        assertEquals(135000, d.maxValAggr);
    },



    getDataSourceNested:function(){

        return new ludo.chart.DataSource({

            textOf:function(record, caller){
                return record.country;
            },

            valueOf:function(record, caller){
                return record.people;
            },

            getText:function(caller){
                switch(caller.id){
                    case 'labelsLeft': return "People";
                    case "labelsTop": return "Male Population"
                }
                return "";
            },
            data: [
                {
                    "id": "uk",
                    "country": "United Kingdom",
                    "children": [
                        { "name":"0-14", "people" : 5000 }, { "name":"15-64", "people" : 20000 }, { "name":"65-", "people" : 4000 }
                    ]
                },
                {
                    "id" : "de",
                    "country": "Germany",
                    "children": [
                        { "name":"0-14", "people" : 6000 }, { "name":"15-64", "people" : 29000 }, { "name":"65-", "people" : 4000 }
                    ]
                },
                {
                    "id": "mx",
                    "country": "Mexico",
                    "children": [
                        { "name":"0-14", "people" : 17000 }, { "name":"15-64", "people" : 31000 }, { "name":"65-", "people" : 2000 }
                    ]
                },
                {
                    "id": "ru",
                    "country": "Russia",
                    "children": [
                        { "name":"0-14", "people" : 13000 }, { "name":"15-64", "people" : 50000 }, { "name":"65-", "people" : 5000 }
                    ]
                },
                {
                    "id" : "br",
                    "country": "Brazil",
                    "children": [
                        { "name":"0-14", "people" : 25000 }, { "name":"15-64", "people" : 55000 }, { "name":"65-", "people" : 4000 }
                    ]
                },
                {
                    "id": "us",
                    "country": "United States",
                    "children": [
                        { "name":"0-14", "people" : 30000 }, { "name":"15-64", "people" : 90000 }, { "name":"65-", "people" : 15000 }
                    ]
                }

            ]
        })

    },

    getDataSource:function(){

        return new ludo.chart.DataSource({

            textOf:function(record, caller){
                return record.name;
            },

            valueOf:function(record, caller){
                return record.value;
            },

            increments:function(minValue, maxValue, caller){
                return 10;
            },

            valueKey:'value',

            data:[
                {
                    id:1,
                    "name": "John",
                    value: 100
                },
                {
                    id:2,
                    name:"Jane",
                    value:200
                }
            ]
        });

    },


    "test should be able to update record": function(){
        // given
        var d = this.getDataSource2();
        var rec = d.byId(11);

        // when
        rec.value = 50;
        d.update(rec);

        // then
        assertEquals(110, d.byId(1).value);
        assertEquals(310, d.byId(2).__sum);

    },

    "test should fire update event": function(){
        var eventRecord = undefined;

        var d = this.getDataSource2();
        d.on('update', function(record){
            eventRecord = record;
        });
        var rec = d.byId(11);

        // when
        rec.value = 50;
        d.update(rec);

        // then
        assertNotUndefined(eventRecord);
        assertEquals(11, eventRecord.id);
    },


    getDataSource2:function(){

        return new ludo.chart.DataSource({

            textOf:function(record, caller){
                return record.name;
            },

            valueOf:function(record, caller){
                return record.value;
            },

            valueKey:'value',

            data:[
                {
                    id:1,
                    "name": "John",
                    children:[
                        {
                            id:11, name:"Martin", value: 40
                        },
                        {
                            id:12, name:"Mina", value: 50
                        },
                        {
                            id:12, name:"Michael", value: 10
                        }
                    ]
                },
                {
                    id:2,
                    name:"Jane",
                    value:200
                }
            ]
        });

    }


});