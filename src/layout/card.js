ludo.layout.Card = new Class({
	Extends:ludo.layout.Base,
	visibleCard:undefined,
	animate:false,
	initialAnimate:false,
	animationDuration:.25,
	animateX:true,
	touch:{},
	dragging:true,

	onCreate:function () {
		this.parent();
		var l = this.view.layout;

		if (l.animate !== undefined)this.animate = l.animate;
		if (l.dragging !== undefined)this.dragging = l.dragging;
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
		child.getEl().css('position', 'absolute');
		child.addEvent('show', this.setVisibleCard.bind(this));
		child.applyTo = this.view;
		if (this.shouldSetCardVisible(child)) {
			this.visibleCard = child;
			child.show();
		}
		if(this.dragging)this.addDragEvents(child);
	},

	addDragEvents:function (child) {
        child.getBody().on(ludo.util.getDragStartEvent(), this.touchStart.bind(this));
        child.getEventEl().on(ludo.util.getDragMoveEvent(), this.touchMove.bind(this));
        child.getEventEl().on(ludo.util.getDragEndEvent(), this.touchEnd.bind(this));
	},

	resize:function () {
		if (this.visibleCard === undefined) {
			this.view.children[0].show();
		}
		var height = this.view.getInnerHeightOfBody();
		var width = ludo.dom.getInnerWidthOf(this.view.getBody());
		if (this.visibleCard) {
            this.visibleCard.resize({ height:height, width:width });
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
	 * @function getPreviousCardOf
	 * @param {View} view
	 * @return View
	 */
	getPreviousCardOf:function (view) {
		var index = this.view.children.indexOf(view);
        return index > 0 ? this.view.children[index - 1] : undefined;
	},

	getNextCardOf:function (card) {
		var index = this.view.children.indexOf(card);
        return index < this.view.children.length - 1 ? this.view.children[index + 1] : undefined;
	},

	/**
	 * Show previous card of current visible card
	 * @function showPreviousCard
	 * @param {Boolean} skipAnimation (optional)
	 * @return {Boolean} success
	 */
	showPreviousCard:function (skipAnimation) {
		if (skipAnimation) {
			this.temporaryDisableAnimation();
		}
		if (this.visibleCard) {
			var card = this.getPreviousCardOf(this.visibleCard);
			if (card) {
				card.show();
				return true;
			}
		}
		return false;
	},

	/**
	 * Show next card of current visible card
	 * @function showNextCard
	 * @param {Boolean} skipAnimation (optional)
	 * @return {Boolean} success
	 */
	showNextCard:function (skipAnimation) {
		if (skipAnimation) {
			this.temporaryDisableAnimation();
		}
		if (this.visibleCard) {
			var card = this.getNextCardOf(this.visibleCard);
			if (card) {
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
	 * @function showCard
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
	 * @function isLastCard
	 * @param {View} card
	 * @return Boolean
	 */
	isLastCard:function (card) {
		return this.view.children.indexOf(card) == this.view.children.length - 1;
	},
	/**
	 * Return true if passed card is first card in deck
	 * @function isFirstCard
	 * @param  {View} card
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
			 * @param {layout.Card} this deck
			 * @param {View} shown card
			 */
			this.fireEvent('highercard', [this, card]);
		} else if (indexDiff < 0) {
			/**
			 * Event fired when a lower card than current is shown
			 * @event lowercard
			 * @param {layout.Card} this deck
			 * @param {View} shown card
			 */
			this.fireEvent('lowercard', [this, card]);
		}

		/**
		 * Event fired when a card is shown
		 * @event showcard
		 * @param {layout.Card} this deck
		 * @param {View} shown card
		 */
		this.fireEvent('showcard', [this, this.visibleCard]);

		if (this.isLastCard(card)) {
			/**
			 * Event fired when last card of deck is shown
			 * @event lastcard
			 * @param {layout.Card} this card
			 * @param {View} shown card
			 */
			this.fireEvent('lastcard', [this, card]);
		} else {
			/**
			 * Event fired when na card which is not the last card in the deck is shown
			 * @event notlastcard
			 * @param {layout.Card} this card
			 * @param {View} shown card
			 */
			this.fireEvent('notlastcard', [this, card]);
		}
		if (this.isFirstCard(card)) {
			/**
			 * Event fired when first card of deck is shown
			 * @event firstcard
			 * @param {layout.Card} this card
			 * @param {View} shown card
			 */
			this.fireEvent('firstcard', [this, card]);
		}
		else {
			/**
			 * Event fired when a card which is not the first card in the deck is shown
			 * @event notfirstcard
			 * @param {layout.Card} this card
			 * @param {View} shown card
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
		var manager = this.visibleCard.getForm();
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
	 * @function showFirstCard
	 * @return void
	 */
	showFirstCard:function () {
		if (this.view.children.length > 0)this.view.children[0].show();
	},
	/**
	 * Show last card in deck
	 * @function showLastCard
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
	 * @function isValid
	 * @public
	 * @return {Boolean}
	 */
	isValid:function () {
		if (this.visibleCard) {
			return this.visibleCard.getForm().isValid();
		}
		return true;
	},
	/**
	 * Return number of cards in deck
	 * @function getCountCards
	 * @return {Number} count cards
	 */
	getCountCards:function () {
		return this.view.children.length;
	},
	/**
	 * Return index of visible card
	 * @function getIndexOfVisibleCard
	 * @return {Number} card index
	 */
	getIndexOfVisibleCard:function () {
        return this.visibleCard ? this.view.children.indexOf(this.visibleCard) : 0;
	},

	/**
	 * true if first card in deck is shown.
	 * @function isOnFirstCard
	 * @return {Boolean} is on first card
	 */
	isOnFirstCard:function () {
		return this.getIndexOfVisibleCard() == 0;
	},
	/**
	 * true if last card in deck is shown.
	 * @function isOnLastCard
	 * @return {Boolean} is on last card
	 */
	isOnLastCard:function () {
		return this.getIndexOfVisibleCard() == this.view.children.length - 1;
	},

	/**
	 * Returns percentage position of current visible card.
	 * @function getPercentCompleted
	 * @return {Number} percent
	 */
	getPercentCompleted:function () {
		return Math.round((this.getIndexOfVisibleCard() + 1 ) / this.view.children.length * 100);
	},

	animateHigherCard:function () {
        if(this.animate){
            if (this.animateX) {
                this.animateFromRight();
            } else {
                this.animateFromBottom();
            }
        }
	},

	animateLowerCard:function () {
		if(this.animate){
            if (this.animateX) {
                this.animateFromLeft();
            } else {
                this.animateFromTop();
            }
        }
	},

	getAnimationDuration:function () {
		return this.animationDuration * 1000;
	},

	animateFromRight:function () {
		this.animateAlongX(this.visibleCard.getParent().getBody().width(), 0);
	},

	animateFromLeft:function () {
		this.animateAlongX(this.visibleCard.getParent().getBody().width() * -1, 0);
	},

	animateFromTop:function () {
		this.animateAlongY(this.visibleCard.getParent().getBody().height() * -1, 0);
	},

	animateFromBottom:function () {
		this.animateAlongY(this.visibleCard.getParent().getBody().height(), 0);
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
			this.fx[this.visibleCard.id].addEvent('start', this.animationStart.bind(this));
		}
		return this.fx[this.visibleCard.id];
	},

    animationStart:function(){
        // TODO apply shadow or border during dragging and animation.
    },

	animationComplete:function (el) {
		el.style.left = '0';
		el.style.top = '0';
        el.style.borderWidth = '0';
	},

	touchStart:function (e) {
		if (this.isOnFormElement(e.target))return undefined;
		var isFirstCard = this.isFirstCard(this.visibleCard);
		var isValid = this.visibleCard.getForm().isValid();
		if (!isValid && isFirstCard) {
			return undefined;
		}

		var isLastCard = this.isLastCard(this.visibleCard);
		this.renderNextAndPreviousCard();
		var animateX = this.shouldAnimateOnXAxis();
		var parentSize = animateX ? this.view.getEl().width() : this.view.getEl().height();
		this.touch = {
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
		if (this.touch && this.touch.active) {
			var pos;
			var key;
			if (this.touch.animateX) {
				pos = e.page.x - this.touch.pos;
				key = 'left';
			} else {
				pos = e.page.x - this.touch.pos;
				key = 'top'
			}

			pos = Math.min(pos, this.touch.max);
			pos = Math.max(pos, (this.touch.min));

			this.setZIndexOfOtherCards(pos);
			this.touch.previousPos = pos;
			this.visibleCard.els.container.style[key] = pos + 'px';
			return false;
		}
		return undefined;
	},

	setZIndexOfOtherCards:function (pos) {
		if (pos > 0 && this.touch.previousPos <= 0) {
			if (this.touch.nextCard) {
				this.touch.nextCard.getEl().style.zIndex = (this.touch.zIndex - 3);
			}
			if (this.touch.previousCard) {
				this.touch.previousCard.getEl().style.zIndex = this.touch.zIndex - 1;
			}
		} else if (pos < 0 && this.touch.previousPos >= 0) {
			if (this.touch.nextCard) {
				this.touch.nextCard.getEl().style.zIndex = this.touch.zIndex - 1;
			}
			if (this.touch.previousCard) {
				this.touch.previousCard.getEl().style.zIndex = this.touch.zIndex - 3;
			}
		}
	},

	touchEnd:function () {
		if (this.touch.active) {
			this.touch.active = false;
			var pos = this.touch.previousPos;
			if (pos > 0 && this.touch.max && pos > (this.touch.max / 2)) {
				this.animateToPrevious();
			} else if (pos < 0 && pos < (this.touch.min / 2)) {
				this.animateToNext();
			} else {
				this.visibleCard.getEl().style[this.touch.animateX ? 'left' : 'top'] = '0px';
			}
		}
	},

	isOnFormElement:function (el) {
		var tag = el.tagName.toLowerCase();
		return tag == 'input' || tag == 'textarea'  || tag === 'select';
	},

	renderNextAndPreviousCard:function () {
		this.setTemporaryZIndexOfVisibleCard();

		var id = this.visibleCard.id;

		this.temporaryDisableAnimation();
		var card;
		var skipEvents = true;
		if (card = this.getPreviousCardOf(ludo.get(id))) {
			card.show(skipEvents);
		}
		if (card = this.getNextCardOf(ludo.get(id))) {
			card.show(skipEvents);
		}
		ludo.get(id).show();

	},

	animateToPrevious:function () {
		if (this.touch.animateX) {
			this.animateAlongX(ludo.dom.getNumericStyle(this.visibleCard.getEl(), 'left'), this.view.getEl().width());
		} else {
			this.animateAlongY(ludo.dom.getNumericStyle(this.visibleCard.getEl(), 'top'), this.view.getEl().height());
		}
		this.showPreviousCard.delay(this.getAnimationDuration(), this, true);
	},

	animateToNext:function () {
		if (this.touch.animateX) {
			this.animateAlongX(ludo.dom.getNumericStyle(this.visibleCard.getEl(), 'left'), this.view.getEl().width() * -1);
		} else {
			this.animateAlongX(ludo.dom.getNumericStyle(this.visibleCard.getEl(), 'top'), this.view.getEl().height() * -1);
		}
		this.showNextCard.delay(this.getAnimationDuration(), this, true);
	}
});
