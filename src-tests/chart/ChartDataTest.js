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

    "test should find parent id": function(){
        // given
        var d = this.getDataSource2();

        // when
        var rec = d.byId(11);

        // then
        assertEquals(1, rec.__parent);
    },

    "test should find min max of scatter chart": function(){
        // given
        var ds = this.getDataSourceScatter();

        // then
        assertEquals(30, ds.minX());
        assertEquals(150, ds.maxX());
        assertEquals(15, ds.minY());
        assertEquals(105, ds.maxY());
    },

    "test should find parent of nodes in scatter chart": function(){
        // given
        var ds = this.getDataSourceScatter();

        // when
        var rec = ds.data[0].getChildren()[0];

        // then
        assertNotUndefined(rec);
        assertEquals(ds.data[0], rec.getParent());
    },

    "test should find children in scatter chart": function(){
        // given
        var ds = this.getDataSourceScatter();

        // when
        var children = ds.getData()[0].getChildren();

        // then
        assertEquals(6, children.length);
    },

    "test should set x and y of scatter records": function(){
        // given
        var ds = this.getDataSourceScatter();

        // when
        var child = ds.getData()[0].getChild(0);

        assertEquals(100, child.x);
        assertEquals(105, child.y);

    },

    "test should handle rgba color codes": function(){
        var ds = this.getDataSourceColor();

        var rec = ds.getData()[0];

        assertEquals('rgba(102,153,0,' + (100/255) + ')', rec.__color);

    },

    getDataSourceScatter:function(){
        return new ludo.chart.ScatterDataSource({
            childKey:'children',
            data:[
                {
                    "name":"first series",
                    "children":[
                        [100,105],[150,90],[30,40],[55,70], [48,42],[77,99]
                    ]
                },
                {
                    "name":"Second series",
                    "children":[
                        [120,40],[115,15]
                    ]
                }

            ]
        });
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

    getDataSourceColor:function(){

        return new ludo.chart.DataSource({
            valueKey:'value',

            data:[
                {
                    __color:'#66990064',
                    id:1,
                    "name": "John",
                    value: 100
                },
                {
                    __color:'#EEEEEE55',
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

    },

    "test should get sum for index": function(){
        var ds = this.getPopulationDataSource();

        var record = ds.data[0].getChildren()[0];

        assertEquals(86+282+168+40+6+3, record.__indexSum);
        assertEquals(86+282+168+40+6+3, ds.data[2].getChildren()[0].__indexSum);

    },

    "tests should get index fraction": function(){

        var ds = this.getPopulationDataSource();

        var record = ds.data[0].getChildren()[0];

        assertEquals(86 / (86+282+168+40+6+3), record.__indexFraction);
    },

    "test should get index start value": function(){
        var ds = this.getPopulationDataSource();
        assertEquals(0, ds.data[0].getChildren()[0].__indexStartVal);
        assertEquals(86, ds.data[1].getChildren()[0].__indexStartVal);
        assertEquals(114, ds.data[1].getChildren()[1].__indexStartVal);
        assertEquals(86+282, ds.data[2].getChildren()[0].__indexStartVal);
    },

    "test should find start fraction": function(){

        var ds = this.getPopulationDataSource();

        var record = ds.data[1].getChildren()[2];

        assertEquals(record.__indexStartVal / record.__indexSum, record.__indexStartFraction);
    },

    "test should set max sum indexes": function(){
        var ds = this.getPopulationDataSource();

        assertEquals(2478+5267+734+784+433+57, ds.maxIndexSum());
    },


    getPopulationDataSource:function(){
        return new ludo.chart.DataSource({
            id:'dataSource',
            data:[
                {   /* One item for each area  */
                    "region": "Africa",
                    "period": [
                        {"year": "1500", "population": 86}, /* Point */
                        {"year": "1600", "population": 114},
                        {"year": "1700", "population": 106},
                        {"year": "1750", "population": 106},
                        {"year": "1800", "population": 107},
                        {"year": "1850", "population": 111},
                        {"year": "1900", "population": 133},
                        {"year": "1950", "population": 221},
                        {"year": "1999", "population": 973},
                        {"year": "2008", "population": 86},
                        {"year": "2010", "population": 1022 },
                        {"year": "2012", "population": 1052 },
                        {"year": "2050", "population": 2478 }
                    ]
                },
                {
                    "region": "Asia",
                    "period": [

                        {"year": "1500", "population": 282},
                        {"year": "1600", "population": 350},
                        {"year": "1700", "population": 411},
                        {"year": "1750", "population": 502},
                        {"year": "1800", "population": 635},
                        {"year": "1850", "population": 809},
                        {"year": "1900", "population": 947},
                        {"year": "1950", "population": 1402},
                        {"year": "1999", "population": 3700},
                        {"year": "2008", "population": 4054},
                        {"year": "2010", "population": 4164 },
                        {"year": "2012", "population": 4250 },
                        {"year": "2050", "population": 5267 }

                    ]
                },
                {
                    "region": "Europe",
                    "period": [

                        {"year": "1500", "population": 168},
                        {"year": "1600", "population": 170},
                        {"year": "1700", "population": 178},
                        {"year": "1750", "population": 190},
                        {"year": "1800", "population": 203},
                        {"year": "1850", "population": 276},
                        {"year": "1900", "population": 408},
                        {"year": "1950", "population": 547},
                        {"year": "1999", "population": 675},
                        {"year": "2008", "population": 732},
                        {"year": "2010", "population": 738 },
                        {"year": "2012", "population": 740 },
                        {"year": "2050", "population": 734 }

                    ]
                },
                {
                    "region": "Latin America",
                    "period": [

                        {"year": "1500", "population": 40},
                        {"year": "1600", "population": 20},
                        {"year": "1700", "population": 10},
                        {"year": "1750", "population": 16},
                        {"year": "1800", "population": 24},
                        {"year": "1850", "population": 38},
                        {"year": "1900", "population": 74},
                        {"year": "1950", "population": 167},
                        {"year": "1999", "population": 508},
                        {"year": "2008", "population": 577},
                        {"year": "2010", "population": 590 },
                        {"year": "2012", "population": 603 },
                        {"year": "2050", "population": 784 }

                    ]
                },
                {
                    "region": "North America",
                    "period": [

                        {"year": "1500", "population": 6},
                        {"year": "1600", "population": 3},
                        {"year": "1700", "population": 2},
                        {"year": "1750", "population": 2},
                        {"year": "1800", "population": 7},
                        {"year": "1850", "population": 26},
                        {"year": "1900", "population": 82},
                        {"year": "1950", "population": 172},
                        {"year": "1999", "population": 312},
                        {"year": "2008", "population": 337},
                        {"year": "2010", "population": 345 },
                        {"year": "2012", "population": 351 },
                        {"year": "2050", "population": 433 }

                    ]
                },
                {
                    "region": "Oceania",
                    "period": [

                        {"year": "1500", "population": 3},
                        {"year": "1600", "population": 3},
                        {"year": "1700", "population": 3},
                        {"year": "1750", "population": 2},
                        {"year": "1800", "population": 2},
                        {"year": "1850", "population": 2},
                        {"year": "1900", "population": 6},
                        {"year": "1950", "population": 13},
                        {"year": "1999", "population": 30},
                        {"year": "2008", "population": 34},
                        {"year": "2010", "population": 37 },
                        {"year": "2012", "population": 38 },
                        {"year": "2050", "population": 57 }

                    ]
                }
            ],
            childKey:'period',

            // Return chart value for chart data. The data source doesn't know our data, so
            // this tells the data source where to get the value.
            valueOf:function(record){
                return record.population;
            },

            shouldInheritColor:function(record, caller){
                return true;
            },


            max:function(){ // Function returning max value for the y axis of the line chart
                return 6000;
            },

            min:function(){ // Function returning min value for the y axis
                return 0;
            },

            valueForDisplay:function(value, caller){
                if(caller.type == 'chart.ChartValues'){
                    if(value >= 1000)return value/1000 + " Bill";
                    return value + ' Mill'
                }
                return value;
            },
            // Function returning increments for lines and labels
            increments:function(){
                return 500;
            },

            colorOf:function(record){
                switch(record.region){
                    case 'North America': return '#C2185B'
                    case 'Europe': return '#1976D2'
                    case 'Asia': return '#FBC02D'
                    case 'Africa': return '#616161'
                    case 'Oceania': return '#AFB42B'
                    default:return undefined;
                }
            },

            maxSaturation:70,
            minBrightness:90,

            strokeOf:function(record, caller){
                return '#424242';
            },

            dataFor:function(caller, data){
                if(caller.type == 'chart.ChartLabels'){
                    return data[0].getChildren();
                }
                return data;
            }
        });
    }


});