ludo.layout.Card = new Class({
	Extends:ludo.layout.Base,
	visibleCard:undefined,

	animate:false,
	initialAnimate:false,
	animationDuration:.25,
	animateX:true,
	touchConfig:{},

	onCreate:function () {
		this.parent();
		var l = this.view.layout;
		if (l.animate !== undefined)this.animate = l.animate;
		if (l.animationDuration !== undefined)this.animationDuration = l.animationDuration;
		if (l.animateX !== undefined)this.animateX = l.animateX;
		this.initialAnimate = this.animate;

		if (this.animate) {
			this.addEvent('highercard', this.animateHigherCard.bind(this));
			this.addEvent('lowercard', this.animateLowerCard.bind(this));
		}

	},
	addChild:function (child, insertAt, pos) {
		if (!child.layout || !child.layout.visible)child.hidden = true;
		return this.parent(child, insertAt, pos);
	},
	onNewChild:function (child) {
		this.parent(child);
		child.getEl().style.position = 'absolute';
		child.addEvent('show', this.setVisibleCard.bind(this));
		if (this.shouldSetCardVisible(child)) {
			this.visibleCard = child;
			child.show();
		}
		this.addDragEvents(child);
	},

	addDragEvents:function (child) {
		if (ludo.util.isTabletOrMobile()) {
			child.getBody().addEvent('touchstart', this.touchStart.bind(this));
			child.getEventEl().addEvent('touchmove', this.touchMove.bind(this));
			child.getEventEl().addEvent('touchend', this.touchEnd.bind(this));
		} else {
			child.getBody().addEvent('mousedown', this.touchStart.bind(this));
			child.getEventEl().addEvent('mousemove', this.touchMove.bind(this));
			child.getEventEl().addEvent('mouseup', this.touchEnd.bind(this));
		}
	},

	resize:function () {
		if (this.visibleCard === undefined) {
			this.view.children[0].show();
		}
		var height = this.view.getInnerHeightOfBody();
		var width = ludo.dom.getInnerWidthOf(this.view.getBody());
		var card = this.getVisibleCard();
		if (card) {
			card.resize({ height:height, width:width });
		}
	},

	getVisibleCard:function () {
		return this.visibleCard;
	},

	shouldSetCardVisible:function (card) {
		return card.layout && card.layout.visible == true;
	},

	/**
	 * Return reference to previus card of passed card
	 * @method getPreviousCardOf
	 * @param {Object} card.Card
	 * @return card.Card
	 */
	getPreviousCardOf:function (card) {
		var index = this.view.children.indexOf(card);
		if (index > 0) {
			return this.view.children[index - 1];
		}
		return null;
	},

	getNextCardOf:function (card) {
		var index = this.view.children.indexOf(card);
		if (index < this.view.children.length - 1) {
			return this.view.children[index + 1];
		}
		return undefined;
	},

	/**
	 * Show previous card of current visible card
	 * @method showPreviousCard
	 * @param {Boolean} skipAnimation (optional)
	 * @return {Boolean} success
	 */
	showPreviousCard:function (skipAnimation) {
		if (skipAnimation) {
			this.temporaryDisableAnimation();
		}
		if (this.visibleCard) {
			var card = this.getPreviousCardOf(this.visibleCard);
			if (card !== undefined) {
				card.show();
				return true;
			}
		}
		return false;
	},

	/**
	 * Show next card of current visible card
	 * @method showNextCard
	 * @param {Boolean} skipAnimation (optional)
	 * @return {Boolean} success
	 */
	showNextCard:function (skipAnimation) {
		if (skipAnimation) {
			this.temporaryDisableAnimation();
		}
		if (this.visibleCard) {
			var card = this.getNextCardOf(this.visibleCard);
			if (card !== undefined) {
				card.show();
				return true;
			}
		}
		return false;
	},


	temporaryDisableAnimation:function () {
		this.animate = false;
		this.resetAnimation.delay(500, this);
	},

	resetAnimation:function () {
		this.animate = this.initialAnimate;
	},

	setTemporaryZIndexOfVisibleCard:function () {
		var zIndex = ludo.util.getNewZIndex(this.visibleCard);
		this.visibleCard.getEl().style.zIndex = zIndex + 100;
	},

	/**
	 * Show a card with this name
	 * @method showCard
	 * @param {String} name
	 * @return {Boolean} success
	 */
	showCard:function (name) {
		if (this.view.child[name]) {
			this.view.child[name].show();
			return true;
		}
		return false;
	},
	/**
	 * Return true if passed card is last card in deck
	 * @method isLastCard
	 * @param {Object} card.Card
	 * @return Boolean
	 */
	isLastCard:function (card) {
		return this.view.children.indexOf(card) == this.view.children.length - 1;
	},
	/**
	 * Return true if passed card is first card in deck
	 * @method isFirstCard
	 * @param {Object} card.Card
	 * @return {Boolean}
	 */
	isFirstCard:function (card) {
		return this.view.children.indexOf(card) == 0;
	},

	setVisibleCard:function (card) {

		this.removeValidationEvents();

		var indexDiff = 0;
		if (this.visibleCard) {
			var indexOld = this.view.children.indexOf(this.visibleCard);
			var indexNew = this.view.children.indexOf(card);
			indexDiff = indexNew - indexOld;
		}

		this.visibleCard = card;

		this.addValidationEvents();

		if (indexDiff > 0) {
			/**
			 * Event fired when a higher card than current is shown
			 * @event highercard
			 * @param {card.Deck} this deck
			 * @param {card.Card} shown card
			 */
			this.fireEvent('highercard', [this, card]);
		} else if (indexDiff < 0) {
			/**
			 * Event fired when a lower card than current is shown
			 * @event lowercard
			 * @param {card.Deck} this deck
			 * @param {card.Card} shown card
			 */
			this.fireEvent('lowercard', [this, card]);
		}

		/**
		 * Event fired when a card is shown
		 * @event showcard
		 * @param {card.Deck} this deck
		 * @param {card.Card} shown card
		 */
		this.fireEvent('showcard', [this, this.visibleCard]);

		if (this.isLastCard(card)) {
			/**
			 * Event fired when last card of deck is shown
			 * @event lastcard
			 * @param {card.Deck} this card
			 * @param {card.Card} shown card
			 */
			this.fireEvent('lastcard', [this, card]);
		} else {
			/**
			 * Event fired when na card which is not the last card in the deck is shown
			 * @event notlastcard
			 * @param {card.Deck} this card
			 * @param {card.Card} shown card
			 */
			this.fireEvent('notlastcard', [this, card]);
		}
		if (this.isFirstCard(card)) {
			/**
			 * Event fired when first card of deck is shown
			 * @event firstcard
			 * @param {card.Deck} this card
			 * @param {card.Card} shown card
			 */
			this.fireEvent('firstcard', [this, card]);
		}
		else {
			/**
			 * Event fired when a card which is not the first card in the deck is shown
			 * @event notfirstcard
			 * @param {card.Deck} this card
			 * @param {card.Card} shown card
			 */
			this.fireEvent('notfirstcard', [this, card]);
		}
	},

	removeValidationEvents:function () {
		if (this.visibleCard) {
			this.visibleCard.removeEvent('invalid', this.setInvalid);
			this.visibleCard.removeEvent('valid', this.setValid);
		}
	},

	addValidationEvents:function () {
		var manager = this.visibleCard.getFormManager();
		manager.addEvent('invalid', this.setInvalid.bind(this));
		manager.addEvent('valid', this.setValid.bind(this));
		manager.validate();
	},
	setInvalid:function () {
		this.fireEvent('invalid', this);
	},

	setValid:function () {
		this.fireEvent('valid', this);
	},
	/**
	 * Show first card in deck
	 * @method showFirstCard
	 * @return void
	 */
	showFirstCard:function () {
		if (this.view.children.length > 0)this.view.children[0].show();
	},
	/**
	 * Show last card in deck
	 * @method showLastCard
	 * @return void
	 */
	showLastCard:function () {
		if (this.view.children.length > 0)this.view.children[this.view.children.length - 1].show();
	},
	button:{},
	registerButton:function (button) {

		this.button[button.name || button.id] = button;

	},
	getButton:function (ref) {
		return this.button[ref];
	},
	/**
	 * Returns true if form of current card is valid
	 * @method isValid
	 * @public
	 * @return {Boolean}
	 */
	isValid:function () {
		if (this.visibleCard) {
			return this.visibleCard.isFormValid();
		}
		return true;
	},
	/**
	 * Return number of cards in deck
	 * @method getCountCards
	 * @return {Number} count cards
	 */
	getCountCards:function () {
		return this.view.children.length;
	},
	/**
	 * Return index of visible card
	 * @method getIndexOfVisibleCard
	 * @return {Number} card index
	 */
	getIndexOfVisibleCard:function () {
		if (this.visibleCard) {
			return this.view.children.indexOf(this.visibleCard);
		}
		return 0;
	},

	/**
	 * true if first card in deck is shown.
	 * @method isOnFirstCard
	 * @return {Boolean} is on first card
	 */
	isOnFirstCard:function () {
		return this.getIndexOfVisibleCard() == 0;
	},
	/**
	 * true if last card in deck is shown.
	 * @method isOnLastCard
	 * @return {Boolean} is on last card
	 */
	isOnLastCard:function () {
		return this.getIndexOfVisibleCard() == this.view.children.length - 1;
	},

	/**
	 * Returns percentage position of current visible card.
	 * @method getPercentCompleted
	 * @return {Number} percent
	 */
	getPercentCompleted:function () {
		return Math.round((this.getIndexOfVisibleCard() + 1 ) / this.view.children.length * 100);
	},

	animateHigherCard:function () {
		if (!this.animate)return;
		if (this.animateX) {
			this.animateFromRight();
		} else {
			this.animateFromBottom();
		}

	},
	animateLowerCard:function () {
		if (!this.animate)return;
		if (this.animateX) {
			this.animateFromLeft();
		} else {
			this.animateFromTop();
		}
	},

	getAnimationDuration:function () {
		return this.animationDuration * 1000;
	},

	animateFromRight:function () {
		this.animateAlongX(this.visibleCard.getParent().getBody().offsetWidth, 0);
	},

	animateFromLeft:function () {
		this.animateAlongX(this.visibleCard.getParent().getBody().offsetWidth * -1, 0);
	},

	animateFromTop:function () {
		this.animateAlongY(this.visibleCard.getParent().getBody().offsetHeight * -1, 0);
	},

	animateFromBottom:function () {
		this.animateAlongY(this.visibleCard.getParent().getBody().offsetHeight, 0);
	},

	animateAlongX:function (from, to) {
		this.visibleCard.getEl().style.left = from + 'px';
		this.getFx().start({
			'left':[from, to]
		});
	},

	animateAlongY:function (from, to) {
		this.visibleCard.getEl().style.top = from + 'px';
		this.getFx().start({
			'top':[from, to]
		});
	},
	fx:{},

	getFx:function () {
		if (this.fx[this.visibleCard.id] === undefined) {
			this.fx[this.visibleCard.id] = new Fx.Morph(this.visibleCard.getEl(), {
				duration:this.getAnimationDuration()
			});
			this.fx[this.visibleCard.id].addEvent('complete', this.animationComplete.bind(this));
		}
		return this.fx[this.visibleCard.id];
	},

	animationComplete:function (el) {
		el.style.left = '0px';
		el.style.top = '0px';
	},

	touchStart:function (e) {
		if (this.isOnFormElement(e.target))return undefined;
		var isFirstCard = this.isFirstCard(this.visibleCard);
		var isValid = this.visibleCard.isFormValid();
		if (!isValid && isFirstCard) {
			return undefined;
		}

		var isLastCard = this.isLastCard(this.visibleCard);
		this.renderNextAndPreviousCard();
		var animateX = this.shouldAnimateOnXAxis();
		var parentSize = animateX ? this.view.getEl().offsetWidth : this.view.getEl().offsetHeight;
		this.touchConfig = {
			active:true,
			pos:animateX ? e.page.x : e.page.y,
			previousCard:this.getPreviousCardOf(this.visibleCard),
			nextCard:this.getNextCardOf(this.visibleCard),
			animateX:animateX,
			zIndex:this.visibleCard.getEl().getStyle('z-index'),
			max:isFirstCard ? 0 : parentSize,
			min:(isLastCard || !isValid) ? 0 : parentSize * -1,
			previousPos:0
		};
		if (e.target.tagName.toLowerCase() == 'img') {
			return false;
		}
		return false;
	},

	shouldAnimateOnXAxis:function () {
		return this.animateX;
	},

	touchMove:function (e) {
		if (this.touchConfig && this.touchConfig.active) {
			var pos;
			var key;
			if (this.touchConfig.animateX) {
				pos = e.page.x - this.touchConfig.pos;
				key = 'left';
			} else {
				pos = e.page.x - this.touchConfig.pos;
				key = 'top'
			}

			pos = Math.min(pos, this.touchConfig.max);
			pos = Math.max(pos, (this.touchConfig.min));

			this.setZIndexOfOtherCards(pos);
			this.touchConfig.previousPos = pos;
			this.visibleCard.els.container.style[key] = pos + 'px';
			return false;
		}
		return undefined;
	},

	setZIndexOfOtherCards:function (pos) {

		if (pos > 0 && this.touchConfig.previousPos <= 0) {
			if (this.touchConfig.nextCard) {
				this.touchConfig.nextCard.getEl().style.zIndex = (this.touchConfig.zIndex - 3);
			}
			if (this.touchConfig.previousCard) {
				this.touchConfig.previousCard.getEl().style.zIndex = this.touchConfig.zIndex - 1;
			}
		} else if (pos < 0 && this.touchConfig.previousPos >= 0) {
			if (this.touchConfig.nextCard) {
				this.touchConfig.nextCard.getEl().style.zIndex = this.touchConfig.zIndex - 1;
			}
			if (this.touchConfig.previousCard) {
				this.touchConfig.previousCard.getEl().style.zIndex = this.touchConfig.zIndex - 3;
			}
		}
	},

	touchEnd:function () {
		if (this.touchConfig.active) {
			this.touchConfig.active = false;
			var pos = this.touchConfig.previousPos;
			if (pos > 0 && this.touchConfig.max && pos > (this.touchConfig.max / 2)) {
				this.animateToPrevious();
			} else if (pos < 0 && pos < (this.touchConfig.min / 2)) {
				this.animateToNext();
			} else {
				if (this.touchConfig.animateX) {
					this.visibleCard.getEl().style.left = '0px';
				} else {
					this.visibleCard.getEl().style.top = '0px';
				}
			}
		}
	},

	isOnFormElement:function (el) {
		var tag = el.tagName.toLowerCase();
		return tag == 'input' || tag == 'textarea';
	},

	renderNextAndPreviousCard:function () {
		this.setTemporaryZIndexOfVisibleCard();

		var id = this.visibleCard.id;

		this.temporaryDisableAnimation();
		var card;
		var skipEvents = true;
		if (card = this.getPreviousCardOf(ludo.get(id))) {
			card.show(skipEvents);
			//this.view.resizeChildren();
		}
		if (card = this.getNextCardOf(ludo.get(id))) {
			card.show(skipEvents);
		}
		ludo.get(id).show();

	},

	animateToPrevious:function () {
		if (this.touchConfig.animateX) {
			this.animateAlongX(ludo.dom.getNumericStyle(this.visibleCard.getEl(), 'left'), this.view.getEl().offsetWidth);
		} else {
			this.animateAlongY(ludo.dom.getNumericStyle(this.visibleCard.getEl(), 'top'), this.view.getEl().offsetHeight);
		}
		this.showPreviousCard.delay(this.getAnimationDuration(), this, true);
	},

	animateToNext:function () {
		if (this.touchConfig.animateX) {
			this.animateAlongX(ludo.dom.getNumericStyle(this.visibleCard.getEl(), 'left'), this.view.getEl().offsetWidth * -1);
		} else {
			this.animateAlongX(ludo.dom.getNumericStyle(this.visibleCard.getEl(), 'top'), this.view.getEl().offsetHeight * -1);
		}
		this.showNextCard.delay(this.getAnimationDuration(), this, true);
	}
});
