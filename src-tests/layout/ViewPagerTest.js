TestCase("ViewPagerLayout", {
	getDeck:function (animate) {
		animate = animate || false;
		var id = String.uniqueID();

		return new ludo.FramedView({
			id:id,
			renderTo:document.body,
			layout:{
				animate:animate,
				type:'ViewPager'
			},
			children:[
				{ name:'card1'},
				{ name:'card2'},
				{ name:'card3'},
				{ name:'card4'},
				{ name:'lastpage'}
			],
			els:{
				parentEl:document.body
			}
		});

	},

	getDeckWithOnePage:function () {
		return new ludo.Window({
			id:'myWindow',
			children:[
				{
					id:'myDeck',
					type:'View',
					layout:{
						type:'ViewPager'
					},
					children:[
						{ name:'card1'}
					]}
			]
		});

	},

	getDeckSecondPageVisible:function (animate) {
		animate = animate || false;
		var id = String.uniqueID();
		return new ludo.FramedView({
			animate:animate,
			id:id,
			layout:{
				type:'ViewPager'
			},
			children:[
				{ name:'card1'},
				{ name:'card2', layout:{ visible:true } },
				{ name:'card3'},
				{ name:'card4'},
				{ name:'lastpage'}
			],
			els:{
				parentEl:document.body
			}
		});
	},

	getDeckLastPageVisible:function (animate) {
		animate = animate || false;
		return new ludo.FramedView({
			layout:{
				type:'ViewPager',
				animate:animate
			},
			children:[
				{ name:'card1'},
				{ name:'card2'},
				{ name:'card3'},
				{ name:'card4'},
				{ name:'lastpage', layout:{ visible:true }}
			],
			els:{
				parentEl:document.body
			}
		});


	},

	getDeckWithProgressBar:function (animate) {

		var id = String.uniqueID();;

		return new ludo.FramedView({
			animate:animate,
			id:id,
			layout:{
				type:'ViewPager'
			},
			children:[
				{ name:'card1'},
				{ name:'card2'},
				{ name:'card3'},
				{ name:'card4'},
				{ name:'lastpage'}
			],
			els:{
				parentEl:document.body
			}
		});

	},

	getDeckWithHidingButtons:function () {
		return new ludo.FramedView({
			layout:{
				type:'ViewPager'
			},
			children:[
				{ name:'card1'},
				{ name:'card2'},
				{ name:'card3'},
				{ name:'lastpage'}
			],
			els:{
				parentEl:document.body
			}
		});

	},

	getWindowDeck:function () {
		return new ludo.Window({
			id:'myWindow',
			children:[
				{
					form:{

					},
					id:'myDeck',
					layout:{
						type:'ViewPager'
					},
					children:[
						{ name:'card1'},
						{ name:'card2'},
						{ name:'card3'},
						{ name:'card4'},
						{ name:'lastpage'}
					]}
			]
		});

	},

	getDeckWithForm:function () {
		return new ludo.FramedView({
			layout:{
				type:'ViewPager'
			},
			children:[
				{
					name:'card1'
				},
				{
					name:'cardForm',
					children:[
						{
							type:'form.Text', name:'requiredText', required:1
						}
					]
				},
				{ name:'card2'},
				{ name:'card3'},
				{ name:'card4'},
				{ name:'lastpage'}
			],
			els:{
				parentEl:document.body
			}
		});


	},

	getDeckInWindowWithInvalidFormInFirstPage:function () {
		var id = String.uniqueID();
		return new ludo.Window({
			children:[
				{
					type:'View',
					id:id,
					layout:{
						type:'ViewPager'
					},
					children:[
						{
							name:'cardForm',
							children:[
								{ type:'form.Text', name:'firstname', label:'Firstname', required:true},
								{ type:'form.Text', name:'lastname', label:'Lastname', required:true},
								{ type:'form.Textarea', name:'address', label:'Address', weight:1 },
								{ type:'form.Text', name:'zipcode', label:'Zip code'},
								{ type:'form.Text', name:'city', label:'City'},
								{ height:5 }
							]
						},
						{ name:'card2'},
						{ name:'card3'},
						{ name:'card4'},
						{ name:'lastpage'}
					],
					els:{
						parentEl:document.body
					}
				}
			]
		});

	},
	"getDeckWithPage3AsVisible":function () {
		return new ludo.View({
			layout:{
				type:'ViewPager'
			},
			children:[
				{ name:'card1'},
				{ name:'card2'},
				{ name:'card3', layout:{
					visible:true
				} },
				{ name:'card4'},
				{ name:'card5'}
			],
			els:{
				parentEl:document.body
			}
		});
	},
	"test should by default render first card":function () {
		// given
		var deck = this.getDeck();

		// when
		var card = deck.getLayout().getVisiblePage();

		// then
		assertEquals('card1', card.getName());
		assertFalse(card.isHidden())
	},
	"test should be able to define first visible card":function () {
		// given
		var deck = this.getDeckWithPage3AsVisible();


		// when
		var card = deck.getLayout().getVisiblePage();

		// then
		assertEquals('card3', card.getName());

	},

	"test should set visible card on card show":function () {
		var deck = this.getDeck();
		var card = deck.child['card1'];
		// when
		card.show();
		// then
		assertEquals('card1', deck.getLayout().getVisiblePage().getName());
	},

	"test should be able to show next card":function () {
		var deck = this.getDeck();
		var card1 = deck.child['card1'];
		var card2 = deck.child['card2'];
		var card3 = deck.child['card3'];
		var card4 = deck.child['card4'];
		card1.show();

		// when
		deck.getLayout().nextPage();

		// then
		assertEquals('card2', deck.getLayout().getVisiblePage().getName());
		assertFalse(card2.isHidden());

		// when
		deck.getLayout().nextPage();

		// then
		assertEquals('card3', deck.getLayout().getVisiblePage().getName());
		assertFalse(card3.isHidden());


		// when
		deck.getLayout().nextPage();

		// then
		assertEquals('card4', deck.getLayout().getVisiblePage().getName());
		assertFalse(card4.isHidden());
	},

	"test should be able to show previous card":function () {
		var deck = this.getDeck();
		var card1 = deck.child['card1'];
		var card2 = deck.child['card2'];
		assertEquals('Initial card is wrong', 'card1', deck.getLayout().getVisiblePage().getName());

		deck.getLayout().showPage('card2');

		// when
		assertEquals('card2', deck.getLayout().getVisiblePage().getName());

		deck.getLayout().previousPage();

		// then
		assertFalse(card1.isHidden());
		assertEquals('card1', deck.getLayout().getVisiblePage().getName());
	},
	"test cards should have position absolute":function () {
		// given
		var deck = this.getDeck();
		// when
		var card1 = deck.child['card1'];
		card1.show();

		// then
		assertEquals('absolute', card1.getEl().css('position'));

	},
	"test should be able to show specific card":function () {
		// given
		var deck = this.getDeck();
		// when
		deck.getLayout().showPage('card3');

		// then
		assertEquals('card3', deck.getLayout().getVisiblePage().getName())

	},
	"test should fire last card event when showing last card":function () {
		// given
		var deck = this.getDeck();
		var eventFired = false;
		deck.getLayout().addEvent('lastpage', function () {
			eventFired = true
		});
		// when
		deck.getLayout().showPage('lastpage');

		// then
		assertTrue(eventFired);
	},
	"test should fire not last card event when moving away from last card":function () {
		// given
		var deck = this.getDeck();
		var eventFired = false;
		deck.getLayout().showPage('lastpage');
		deck.getLayout().addEvent('notlastpage', function () {
			eventFired = true
		});
		// when
		deck.getLayout().showPage('card1');

		// then
		assertTrue(eventFired);
	},
	"test should find if a card is last card":function () {
		// given
		var deck = this.getDeck();

		// when
		var card = deck.child['lastpage'];

		// then
		assertTrue(deck.getLayout().isLastPage(card));

	},
	"test should find if a card is first card":function () {
		// given
		var deck = this.getDeck();

		// when
		var card = deck.child['card1'];

		// then
		assertTrue(deck.getLayout().isFirstPage(card));

	},
	"test should fire first card event when showing first card":function () {
		// given
		var deck = this.getDeck();
		var eventFired = false;
		deck.getLayout().addEvent('firstpage', function () {
			eventFired = true
		});
		// when
		deck.getLayout().showPage('card1');

		// then
		assertTrue(eventFired);
	},
	"test should fire not first card event when moving away from first card":function () {
		// given
		var deck = this.getDeck();
		var eventFired = false;
		deck.getLayout().showPage('card1');
		deck.getLayout().addEvent('notfirstpage', function () {
			eventFired = true
		});
		// when

		deck.getLayout().showPage('card2');
		// then
		assertTrue(eventFired);
	},
	"test should be able to show first card":function () {
		// given
		var deck = this.getDeck();
		deck.getLayout().showPage('card2');
		assertEquals('card2', deck.getLayout().getVisiblePage().getName());
		// when
		deck.getLayout().showFirstPage();
		// then
		assertEquals('card1', deck.getLayout().getVisiblePage().getName());
	},
	"test should be able to show last card":function () {
		// given
		var deck = this.getDeck();

		// when
		deck.getLayout().showLastPage();
		// then
		assertEquals('lastpage', deck.getLayout().getVisiblePage().getName());
	},

	"test should be able to find button":function () {
		// given

		var deck = new ludo.FramedView({
			id:'testView',
			layout:{
				animate:false,
				type:'ViewPager'
			},
			children:[
				{ name:'card1', children:[{ type:'form.Text', name:'abc'}]},
				{ name:'card2', children:[{ type:'form.Text', name:'abd'}]},
				{ name:'card3', children:[{ type:'form.Text', name:'abe'}]},
				{ name:'card4'},
				{ name:'lastpage'}
			],
			els:{
				parentEl:document.body
			}
		});

		// then
		assertNotEquals({}, deck.getLayout().button);

	},


	"test deck should fire invalid event when current card is invalid":function () {
		// given
		var deck = this.getDeckWithForm();
		var eventFired = false;
		deck.getLayout().addEvent('invalid', function () {
			eventFired = true;
		});

		// when
		deck.getLayout().showPage('cardForm');

		// then
		assertTrue(eventFired);


	},

	"test should fire higher card event when moving to higher card":function () {
		// given
		var deck = this.getDeck();
		var eventFired = false;
		deck.getLayout().addEvent('higherpage', function () {
			eventFired = true;
		});

		// when
		deck.getLayout().showPage('card3');

		// then
		assertTrue(eventFired);


	},
	"test should fire lower card event when moving to higher card":function () {
		// given
		var deck = this.getDeck();
		deck.getLayout().showPage('card3');
		var eventFired = false;
		deck.getLayout().addEvent('lowerpage', function () {
			eventFired = true;
		});

		// when
		deck.getLayout().showPage('card1');

		// then
		assertTrue(eventFired);
	},
	"test should find number of cards":function () {
		// given
		var deckWith5Pages = this.getDeck();

		// then
		assertEquals(5, deckWith5Pages.getLayout().getCountPages())

	},

	"getDialogWithDeckAndButtons":function () {
		var id = String.uniqueID();
		return new ludo.dialog.Dialog({
			id:'myWindow',
			autoHideOnBtnClick:false,
			layout:'rows',
			children:[
				{
					html:'Hello'
				},
				{
					form:{
						url:'test.php'
					},
					id:id,
					layout:{
						type:'ViewPager'
					},
					children:[
						{
							html:'Welcome', name:'card1'
						},
						{ name:'card2', children:[
							{ type:'form.Text', name:'field1' }
						]},
						{ name:'lastpage'}
					]}
			]
		});
	}

});