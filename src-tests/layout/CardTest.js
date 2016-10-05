TestCase("CardLayout", {
	getDeck:function (animate) {
		animate = animate || false;
		var id = String.uniqueID();

		return new ludo.FramedView({
			id:id,
			renderTo:document.body,
			layout:{
				animate:animate,
				type:'card'
			},
			children:[
				{ name:'card1'},
				{ name:'card2'},
				{ name:'card3'},
				{ name:'card4'},
				{ name:'lastcard'}
			],
			els:{
				parentEl:document.body
			},
			buttonBar:[
				{
					type:'card.PreviousButton', name:'previousButton', applyTo:id
				},
				{
					type:'card.NextButton', name:'nextButton', applyTo:id
				},
				{
					type:'card.FinishButton', name:'finishButton', applyTo:id
				}
			]
		});

	},

	getDeckWithOneCard:function () {
		return new ludo.Window({
			id:'myWindow',
			children:[
				{
					id:'myDeck',
					type:'View',
					layout:{
						type:'card'
					},
					children:[
						{ name:'card1'}
					]}
			],
			buttonBar:[
				{
					type:'card.PreviousButton', name:'previousButton',applyTo:'myDeck'
				},
				{
					type:'card.NextButton', name:'nextButton',applyTo:'myDeck'
				},
				{
					type:'card.FinishButton', name:'finishButton',applyTo:'myDeck'
				}
			]
		});

	},

	getDeckSecondCardVisible:function (animate) {
		animate = animate || false;
		var id = String.uniqueID();
		return new ludo.FramedView({
			animate:animate,
			id:id,
			layout:{
				type:'card'
			},
			children:[
				{ name:'card1'},
				{ name:'card2', layout:{ visible:true } },
				{ name:'card3'},
				{ name:'card4'},
				{ name:'lastcard'}
			],
			els:{
				parentEl:document.body
			},
			buttonBar:[
				{
					type:'card.PreviousButton', name:'previousButton',applyTo:id
				},
				{
					type:'card.NextButton', name:'nextButton',applyTo:id
				},
				{
					type:'card.FinishButton', name:'finishButton',applyTo:id
				}
			]
		});
	},

	getDeckLastCardVisible:function (animate) {
		animate = animate || false;
		return new ludo.FramedView({
			layout:{
				type:'card',
				animate:animate
			},
			children:[
				{ name:'card1'},
				{ name:'card2'},
				{ name:'card3'},
				{ name:'card4'},
				{ name:'lastcard', layout:{ visible:true }}
			],
			els:{
				parentEl:document.body
			},
			buttonBar:[
				{
					type:'card.PreviousButton', name:'previousButton'
				},
				{
					type:'card.NextButton', name:'nextButton'
				},
				{
					type:'card.FinishButton', name:'finishButton'
				}
			]
		});


	},

	getDeckWithProgressBar:function (animate) {
		return new ludo.FramedView({
			animate:animate,
			layout:{
				type:'card'
			},
			children:[
				{ name:'card1'},
				{ name:'card2'},
				{ name:'card3'},
				{ name:'card4'},
				{ name:'lastcard'}
			],
			els:{
				parentEl:document.body
			},
			buttonBar:[
				{
					type:'card.ProgressBar', name:'progress-bar'
				},
				{
					type:'card.PreviousButton', name:'previousButton'
				},
				{
					type:'card.NextButton', name:'nextButton'
				},
				{
					type:'card.FinishButton', name:'finishButton'
				}
			]
		});

	},

	getDeckWithHidingButtons:function () {
		return new ludo.FramedView({
			layout:{
				type:'card'
			},
			children:[
				{ name:'card1'},
				{ name:'card2'},
				{ name:'card3'},
				{ name:'lastcard'}
			],
			els:{
				parentEl:document.body
			},
			buttonBar:[
				{
					type:'card.PreviousButton', name:'previousButton', autoHide:true
				},
				{
					type:'card.NextButton', name:'nextButton', autoHide:true
				}
			]
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
						type:'card'
					},
					children:[
						{ name:'card1'},
						{ name:'card2'},
						{ name:'card3'},
						{ name:'card4'},
						{ name:'lastcard'}
					]}
			],
			buttonBar:[
				{
					type:'card.PreviousButton', name:'previousButton'
				},
				{
					type:'card.NextButton', name:'nextButton'
				}
			]
		});

	},

	getDeckWithForm:function () {
		return new ludo.FramedView({
			layout:{
				type:'card'
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
				{ name:'lastcard'}
			],
			els:{
				parentEl:document.body
			},
			buttonBar:[
				{
					type:'card.PreviousButton', name:'previousButton'
				},
				{
					type:'card.NextButton', name:'nextButton'
				}
			]
		});


	},

	getDeckInWindowWithInvalidFormInFirstCard:function () {
		var id = String.uniqueID();
		return new ludo.Window({
			children:[
				{
					type:'View',
					id:id,
					layout:{
						type:'card'
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
						{ name:'lastcard'}
					],
					els:{
						parentEl:document.body
					}
				}
			],
			buttonBar:[
				{
					type:'card.PreviousButton', name:'previousButton',applyTo:id
				},
				{
					type:'card.NextButton', name:'nextButton', autoHide:true,applyTo:id
				}
			]
		});

	},
	"getDeckWithCard3AsVisible":function () {
		return new ludo.View({
			layout:{
				type:'card'
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
		var card = deck.getLayout().getVisibleCard();

		// then
		assertEquals('card1', card.getName());
		assertFalse(card.isHidden())
	},
	"test should be able to define first visible card":function () {
		// given
		var deck = this.getDeckWithCard3AsVisible();


		// when
		var card = deck.getLayout().getVisibleCard();

		// then
		assertEquals('card3', card.getName());

	},

	"test should set visible card on card show":function () {
		var deck = this.getDeck();
		var card = deck.child['card1'];
		// when
		card.show();
		// then
		assertEquals('card1', deck.getLayout().getVisibleCard().getName());
	},
	"test should be able to find next card":function () {
		// given
		var deck = this.getDeck();
		var card1 = deck.child['card1'];
		var card2 = deck.child['card2'];
		// when
		var nextCard = deck.getLayout().getNextCardOf(card1);

		// then
		assertEquals('card2', nextCard.getName());
	},
	"test should be able to show next card by clicking on button":function () {
		var deck = this.getDeck();
		var card1 = deck.child['card1'];
		var card2 = deck.child['card2'];
		var card3 = deck.child['card3'];
		var card4 = deck.child['card4'];
		var button = deck.getButton('nextButton');
		card1.show();

		// when
		button.fireEvent('click', [button.getValue(), button]);

		// then
		assertEquals('card2', deck.getLayout().getVisibleCard().getName());
		assertFalse(card2.isHidden());

		// when
		button.fireEvent('click', [button.getValue(), button]);

		// then
		assertEquals('card3', deck.getLayout().getVisibleCard().getName());
		assertFalse(card3.isHidden());


		// when
		button.fireEvent('click', [button.getValue(), button]);

		// then
		assertEquals('card4', deck.getLayout().getVisibleCard().getName());
		assertFalse(card4.isHidden());
	},
	"test should be able to show next card":function () {
		var deck = this.getDeck();
		var card1 = deck.child['card1'];
		var card2 = deck.child['card2'];
		var card3 = deck.child['card3'];
		var card4 = deck.child['card4'];
		card1.show();

		// when
		deck.getLayout().showNextCard();

		// then
		assertEquals('card2', deck.getLayout().getVisibleCard().getName());
		assertFalse(card2.isHidden());

		// when
		deck.getLayout().showNextCard();

		// then
		assertEquals('card3', deck.getLayout().getVisibleCard().getName());
		assertFalse(card3.isHidden());


		// when
		deck.getLayout().showNextCard();

		// then
		assertEquals('card4', deck.getLayout().getVisibleCard().getName());
		assertFalse(card4.isHidden());
	},
	"test should be able to find previous card":function () {
		// given
		var deck = this.getDeck();
		var card1 = deck.child['card1'];
		var card2 = deck.child['card2'];
		// when
		var previousCard = deck.getLayout().getPreviousCardOf(card2);

		// then
		assertEquals('card1', previousCard.getName());
	},
	"test should be able to show previous card":function () {
		var deck = this.getDeck();
		var card1 = deck.child['card1'];
		var card2 = deck.child['card2'];
		assertEquals('Initial card is wrong', 'card1', deck.getLayout().getVisibleCard().getName());

		card2.show();
		// when
		assertEquals('card2', deck.getLayout().getVisibleCard().getName());

		deck.getLayout().showPreviousCard();

		// then
		assertFalse(card1.isHidden());
		assertEquals('card1', deck.getLayout().getVisibleCard().getName());
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
		deck.getLayout().showCard('card3');

		// then
		assertEquals('card3', deck.getLayout().getVisibleCard().getName())

	},
	"test should fire last card event when showing last card":function () {
		// given
		var deck = this.getDeck();
		var eventFired = false;
		deck.getLayout().addEvent('lastcard', function () {
			eventFired = true
		});
		// when
		deck.getLayout().showCard('lastcard');

		// then
		assertTrue(eventFired);
	},
	"test should fire not last card event when moving away from last card":function () {
		// given
		var deck = this.getDeck();
		var eventFired = false;
		deck.getLayout().showCard('lastcard');
		deck.getLayout().addEvent('notlastcard', function () {
			eventFired = true
		});
		// when
		deck.getLayout().showCard('card1');

		// then
		assertTrue(eventFired);
	},
	"test should find if a card is last card":function () {
		// given
		var deck = this.getDeck();

		// when
		var card = deck.child['lastcard'];

		// then
		assertTrue(deck.getLayout().isLastCard(card));

	},
	"test should find if a card is first card":function () {
		// given
		var deck = this.getDeck();

		// when
		var card = deck.child['card1'];

		// then
		assertTrue(deck.getLayout().isFirstCard(card));

	},
	"test should fire first card event when showing first card":function () {
		// given
		var deck = this.getDeck();
		var eventFired = false;
		deck.getLayout().addEvent('firstcard', function () {
			eventFired = true
		});
		// when
		deck.getLayout().showCard('card1');

		// then
		assertTrue(eventFired);
	},
	"test should fire not first card event when moving away from first card":function () {
		// given
		var deck = this.getDeck();
		var eventFired = false;
		deck.getLayout().showCard('card1');
		deck.getLayout().addEvent('notfirstcard', function () {
			eventFired = true
		});
		// when

		deck.getLayout().showCard('card2');
		// then
		assertTrue(eventFired);
	},
	"test should be able to show first card":function () {
		// given
		var deck = this.getDeck();
		deck.getLayout().showCard('card2');
		assertEquals('card2', deck.getLayout().getVisibleCard().getName());
		// when
		deck.getLayout().showFirstCard();
		// then
		assertEquals('card1', deck.getLayout().getVisibleCard().getName());
	},
	"test should be able to show last card":function () {
		// given
		var deck = this.getDeck();

		// when
		deck.getLayout().showLastCard();
		// then
		assertEquals('lastcard', deck.getLayout().getVisibleCard().getName());
	},

	"test should be able to find button":function () {
		// given

		var deck = new ludo.FramedView({
			id:'testView',
			layout:{
				animate:false,
				type:'card'
			},
			children:[
				{ name:'card1', children:[{ type:'form.Text', name:'abc'}]},
				{ name:'card2', children:[{ type:'form.Text', name:'abd'}]},
				{ name:'card3', children:[{ type:'form.Text', name:'abe'}]},
				{ name:'card4'},
				{ name:'lastcard'}
			],
			els:{
				parentEl:document.body
			},
			buttonBar:[
				{
					type:'card.PreviousButton', name:'previousButton', applyTo:'testView'
				},
				{
					type:'card.NextButton', name:'nextButton', applyTo:'testView'
				},
				{
					type:'card.FinishButton', name:'finishButton', applyTo:'testView'
				}
			]
		});

		// then
		assertNotEquals({}, deck.getLayout().button);

	},
	"test previous button should be initial disabled":function () {
		// given
		var deck = this.getDeck();

		// when
		var previousButton = deck.getLayout().getButton('previousButton');

		// then
		assertTrue(previousButton.isDisabled());
	},
	"test previous button should not be initial disabled when intially not showing first card":function () {
		// given
		var deck = this.getDeckSecondCardVisible();

		// when
		var previousButton = deck.getLayout().getButton('previousButton');

		// then
		assertFalse(deck.getLayout().isOnFirstCard());
		assertFalse(previousButton.isDisabled());

	},
	"test next button should be disabled when intially showing last card":function () {
		// given
		var deck = this.getDeckLastCardVisible();
		var card = deck.child['lastcard'];

		assertTrue('Last card is not visible', card.isVisible());
		// when
		var button = deck.getLayout().getButton('nextButton');

		// then
		assertTrue(button.isDisabled());

	},
	"test previous button should be disabled when showing first card":function () {
		// given
		var deck = this.getDeck();
		var previousButton = deck.getLayout().getButton('previousButton');

		// when
		deck.getLayout().showFirstCard();

		// then
		assertTrue(previousButton.isDisabled());
	},
	"test previous button should be enable when moving away from first card":function () {
		// given
		var deck = this.getDeck();
		var previousButton = deck.getLayout().getButton('previousButton');

		// when
		deck.getLayout().showFirstCard();

		// then
		assertTrue(previousButton.isDisabled());

		// when
		deck.getLayout().showCard('card2');
		// then
		assertFalse(previousButton.isDisabled());
	},
	"test next button should be disabled when showing last card":function () {
		// given
		var deck = this.getDeck();
		var nextButton = deck.getLayout().getButton('nextButton');

		// when
		deck.getLayout().showLastCard();

		// then
		assertTrue(nextButton.isDisabled());
	},
	"test next button should be enable when moving away from last card":function () {
		// given
		var deck = this.getDeck();
		var nextButton = deck.getLayout().getButton('nextButton');

		// when
		deck.getLayout().showLastCard();

		// then
		assertTrue(nextButton.isDisabled());

		// when
		deck.getLayout().showCard('card2');
		// then
		assertFalse(nextButton.isDisabled());
	},
	"test card buttons should find deck parent component even when in a window":function () {
		// given
		var window = this.getWindowDeck();
		var nextButton = window.getButton('nextButton');

		// when
		var parent = nextButton.component;

		// then
		assertEquals('myDeck', parent.getId());
	},
	"test deck should fire invalid event when current card is invalid":function () {
		// given
		var deck = this.getDeckWithForm();
		var eventFired = false;
		deck.getLayout().addEvent('invalid', function () {
			eventFired = true;
		});

		// when
		deck.getLayout().showCard('cardForm');

		// then
		assertTrue(eventFired);


	},
	"test next button should be disabled when form of current card is invalid":function () {
		// given
		var deck = this.getDeckWithForm();
		var nextButton = deck.getLayout().getButton('nextButton');
		assertFalse('nextButton is by default disabled', nextButton.isDisabled());
		// when
		deck.getLayout().showCard('cardForm');

		// then
		assertTrue(nextButton.isDisabled());
	},
	"test next button should be enabled again when moving away from invalid form card":function () {
		// given
		var deck = this.getDeckWithForm();
		var nextButton = deck.getLayout().getButton('nextButton');
		assertFalse('nextButton is by default disabled', nextButton.isDisabled());
		// when
		deck.getLayout().showCard('cardForm');

		// then
		assertTrue(nextButton.isDisabled());

		deck.getLayout().showCard('card1');
		assertFalse(nextButton.isDisabled());
	},
	"test next button should be enabled once form of current card is valid":function () {
		// given
		var deck = this.getDeckWithForm();
		var nextButton = deck.getLayout().getButton('nextButton');
		assertFalse('nextButton is by default disabled', nextButton.isDisabled());
		// when
		deck.getLayout().showCard('cardForm');

		// then
		assertTrue(nextButton.isDisabled());

		// when
		var card = deck.child['cardForm'];
		card.child['requiredText'].setValue('Hello');


		// then
		assertFalse(nextButton.isDisabled());
	},
	"test should fire higher card event when moving to higher card":function () {
		// given
		var deck = this.getDeck();
		var eventFired = false;
		deck.getLayout().addEvent('highercard', function () {
			eventFired = true;
		});

		// when
		deck.getLayout().showCard('card3');

		// then
		assertTrue(eventFired);


	},
	"test should fire lower card event when moving to higher card":function () {
		// given
		var deck = this.getDeck();
		deck.getLayout().showCard('card3');
		var eventFired = false;
		deck.getLayout().addEvent('lowercard', function () {
			eventFired = true;
		});

		// when
		deck.getLayout().showCard('card1');

		// then
		assertTrue(eventFired);
	},
	"test should find number of cards":function () {
		// given
		var deckWith5Cards = this.getDeck();

		// then
		assertEquals(5, deckWith5Cards.getLayout().getCountCards())

	},
	"test should find index of current card":function () {
		// given
		var deck = this.getDeck();

		// when
		deck.getLayout().showCard('card3');

		// then
		assertEquals(2, deck.getLayout().getIndexOfVisibleCard());
	},
	"test should be possible to hide next button on lastcard":function () {
		// given
		var deck = this.getDeckWithHidingButtons();
		var button = deck.getLayout().getButton('nextButton');
		// when
		deck.getLayout().showLastCard();

		// then
		assertTrue(button.isHidden());

		// when
		deck.getLayout().showFirstCard();

		// then
		assertFalse(button.isHidden());
	},
	"test should be possible to hide previous button on first card":function () {
		// given
		var deck = this.getDeckWithHidingButtons();
		var button = deck.getLayout().getButton('previousButton');
		// when
		deck.getLayout().showFirstCard();

		// then
		assertTrue(button.isHidden());

		// when
		deck.getLayout().showLastCard();

		// then
		assertFalse(button.isHidden());
	},
	"test should hide finish button when not last card":function () {
		// given
		var deck = this.getDeck();

		// then
		assertTrue(deck.getLayout().getButton('finishButton').isHidden());

		// when
		deck.getLayout().showCard('card3');

		// then
		assertTrue(deck.getLayout().getButton('finishButton').isHidden());
	},
	"test should initially show finish button when only one card":function () {
		// given
		var deck = this.getDeckWithOneCard();

		// when
		var finishButton = deck.children[0].getLayout().getButton('finishButton');

		// then
		assertFalse(finishButton.isHidden());

	},
	"test should show finish button on last card":function () {
		// given
		var deck = this.getDeck();

		// when
		deck.getLayout().showLastCard();

		// then
		assertFalse(deck.getLayout().getButton('finishButton').isHidden());
	},
	"test should disable finish button on before submit event":function () {
		// given
		var deck = this.getDeck();
		var button = deck.getLayout().getButton('finishButton');
		// when
		assertFalse(button.isDisabled());
		deck.submit();
		// then
		assertTrue(button.isDisabled());
	},
	"test should be able to have progress bar":function () {
		// given
		var deck = this.getDeckWithProgressBar();
		var bar = deck.getLayout().getButton('progress-bar');

		assertNotUndefined(bar);
		assertFalse(bar.isHidden())
	},
	"test parent of progress bar should be deck":function () {
		// given
		var deck = this.getDeckWithProgressBar();
		// when
		var bar = deck.getLayout().getButton('progress-bar');
		// then
		assertEquals('card', bar.component.layout.type);
	},
	"test should move progress bar when going to next card":function () {
		// given
		var deck = this.getDeckWithProgressBar();
		var bar = deck.getLayout().getButton('progress-bar');

		// when
		deck.getLayout().showCard('card2');

		// then
		assertEquals(40, bar.getCurrentPercent());
		// when
		deck.getLayout().showCard('lastcard');

		// then
		assertEquals(100, bar.getCurrentPercent());
	},
	"test progress bar should set initial percent":function () {
		// given
		var deck = this.getDeckWithProgressBar();
		// when
		var bar = deck.getLayout().getButton('progress-bar');
		// then
		assertEquals(20, bar.getCurrentPercent());
	},
	"test next button should initial be disabled when first card contains invalid form":function () {
		var deck = this.getDeckInWindowWithInvalidFormInFirstCard();
		// when
		var button = deck.children[0].getLayout().getButton('nextButton');

		assertEquals('card', button.component.layout.type);
		// then
		assertTrue(button.isDisabled());
	},
	"test should not hide dialogs on click on buttons":function () {

		// given
		var deck = this.getDialogWithDeckAndButtons();
		assertFalse(deck.isHidden());

		// when
		deck.children[1].getLayout().getButton('nextButton').click();

		// then
		assertFalse(deck.isHidden());
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
						type:'card'
					},
					children:[
						{
							html:'Welcome', name:'card1'
						},
						{ name:'card2', children:[
							{ type:'form.Text', name:'field1' }
						]},
						{ name:'lastcard'}
					]}
			],
			buttonBar:[
				{
					type:'card.PreviousButton', name:'previousButton',applyTo:id
				},
				{
					type:'card.NextButton', name:'nextButton',applyTo:id
				},
				{
					type:'card.FinishButton', name:'finishButton',applyTo:id
				}
			]
		});
	}

});