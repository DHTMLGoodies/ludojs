TestCase("DataProviderTest", {
	"test each chart data item should get a unique id":function () {
		// given
		var p = this.getProvider();

		// when
		var d = p.getData();

		// then
		assertNotUndefined(d[0].uid);

	},

	"test should be able to define id of chart data":function () {
		// given
		var p = this.getProvider([
			{
				label:'My label', value:100, id:'myId'
			}
		]);

		// when
		var item = p.getData()[0];

		// then
		assertEquals('myId', item.id);

	},

	"test should be able to get item by id":function () {
		// given
		var p = this.getProvider([
			{
				label:'My label', value:100, id:'myId'
			},
			{
				label:'My label 2', value:100, id:'mySecondId'
			}
		]);

		// when
		var item = p.get('myId');

		// then
		assertNotUndefined(item);
		assertEquals('My label', item.get('label'));
		assertEquals(100, item.get('value'));
	},

	"test should be able to update value": function(){
		// given
		var p = this.getProvider([
			{
				label:'My label', value:100, id:'myId'
			},
			{
				label:'My label 2', value:100, id:'mySecondId'
			}
		]);

		var item = p.get('myId');

		// when
		p.setValue('myId', 120);

		// then
		assertEquals(120, item.get('value'));
	},

	"test should be able to get sum": function(){
		// given
		var p = this.getProvider([
			{
				label:'My label', value:100, id:'myId'
			},
			{
				label:'My label 2', value:140, id:'mySecondId'
			},
			{
				label:'My label 3', value:30, id:'myThirdId'
			}
		]);

		// then
		assertEquals(270, p.getSum());
	},


	"test should be able to get sum after record has been updated": function(){
		// given
		var p = this.getProvider([
			{
				label:'My label', value:100, id:'myId'
			},
			{
				label:'My label 2', value:140, id:'mySecondId'
			},
			{
				label:'My label 3', value:30, id:'myThirdId'
			}
		]);

		// when
		p.setValue('myId', 200);

		// then
		assertEquals(370, p.getSum());
	},

	"test should be able to get percent from record": function(){
		// given
		var p = this.getProvider([
			{
				label:'My label', value:100, id:'myId'
			},
			{
				label:'My label 2', value:200, id:'mySecondId'
			},
			{
				label:'My label 3', value:100, id:'myThirdId'
			}
		]);

		// when
		var rec = p.get('myId');

		// then
		assertEquals(25, rec.getPercent());

		// when
		rec.set('value', 300);
		// then
		assertEquals(50, rec.getPercent());
	},

	"test should be able to get degrees from record": function(){
		// given
		var p = this.getProvider([
			{
				label:'My label', value:100, id:'myId'
			},
			{
				label:'My label 2', value:200, id:'mySecondId'
			},
			{
				label:'My label 3', value:100, id:'myThirdId'
			}
		]);

		// when
		var rec = p.get('myId');

		// then
		assertEquals(25 * 360 / 100, rec.getDegrees());

		// when
		rec.set('value', 300);
		// then
		assertEquals(50 * 360 / 100, rec.getDegrees());
	},

	"test should assign getValue methods": function(){
		// given
		var p = this.getProvider([
			{
				label:'My label', value:100, id:'myId'
			},
			{
				label:'My label 2', value:200, id:'mySecondId'
			},
			{
				label:'My label 3', value:100, id:'myThirdId'
			}
		]);

		// then
		assertEquals(100, p.get('myId').getValue());
	},

	"test should assign setValue methods": function(){
		// given
		var p = this.getProvider([
			{
				label:'My label', value:100, id:'myId'
			},
			{
				label:'My label 2', value:200, id:'mySecondId'
			},
			{
				label:'My label 3', value:100, id:'myThirdId'
			}
		]);
		var rec = p.get('myId');

		// when
		rec.setValue('200');

		// then
		assertEquals(200, rec.getValue());
	},

	"test should be able to get value": function(){
		// given
		var p = this.getProvider([
			{
				label:'My label', value:100, id:'myId'
			},
			{
				label:'My label 2', value:140, id:'mySecondId'
			}
		]);

		// then
		assertEquals(140, p.getValue('mySecondId'));
	},

	"test should be able to get records as array": function(){
		// given
		var p = this.getProvider([
			{
				label:'My label', value:100, id:'myId'
			},
			{
				label:'My label 2', value:140, id:'mySecondId'
			}
		]);

		// then
		assertNotUndefined(p.getRecords());
		assertEquals(2, p.getRecords().length);
	},

    "test should be able to get start percent value of item": function(){
        // given
        var p = this.getProvider([
            {
                label:'My label', value:100, id:'myId'
            },
            {
                label:'My label 2', value:200, id:'mySecondId'
            },
            {
                label:'My label 2', value:200, id:'myThird'
            }
        ]);

        // when
        var first = p.get('myId');
        var second = p.get('mySecondId');
        var third = p.get('myThird');

        // then
        assertEquals(0, first.getStartPercent());
        assertEquals(20, second.getStartPercent());
        assertEquals(60, third.getStartPercent());

    },

    "test should be able to get start degrees value of item": function(){
        // given
        var p = this.getProvider([
            {
                label:'My label', value:100, id:'myId'
            },
            {
                label:'My label 2', value:200, id:'mySecondId'
            },
            {
                label:'My label 2', value:200, id:'myThird'
            }
        ]);

        // when
        var first = p.get('myId');
        var second = p.get('mySecondId');
        var third = p.get('myThird');

        // then
        assertEquals(270, first.getAngle());
        assertEquals(270 + (20 * 360 / 100), second.getAngle());
        assertEquals(270 + (60 * 360 / 100), third.getAngle());

    },

	getProvider:function (data) {
		data = data || [
			{ label:'John', value:100 },
			{ label:'Jane', value:245 },
			{ label:'Martin', value:37 },
			{ label:'Mary', value:99 },
			{ label:'Johnny', value:127 },
			{ label:'Catherine', value:55 },
			{ label:'Tommy', value:18 }
		];
		return new ludo.chart.DataProvider({
			data:data
		})
	}

});