/**
 * Base class for animations
 * @namespace effect
 * @class Effect
 */
ludo.effect.Effect = new Class({
	Extends: ludo.Core,
	fps:33,
	/**
	 Fly/Slide DOM node to a position
	 @method fly
	 @param {Object} config
	 @example
	 	<div id="myDiv" style="position:absolute;width:100px;height:100px;border:1px solid #000;background-color:#DEF;left:50px;top:50px"></div>
		<script type="text/javascript">
		 new ludo.effect.Effect().fly({
			el: 'myDiv',
			duration:.5,
			to:{ x:500, y: 300 },
			 onComplete:function(){
				 new ludo.effect.Effect().fly({
					el: 'myDiv',
					duration:1,
					to:{ x:600, y: 50 }
				 });
			 }
		 });
	 	</script>
	 Which will first move "myDiv" to position 500x300 on the screen, then to 600x50.
	 */
	fly:function(config){
		config.el = document.id(config.el);
		config.duration = config.duration || .2;
		if(config.from == undefined){
			config.from = config.el.getPosition();
		}
		var fx = this.getFx(config.el, config.duration, config.onComplete);
		fx.start({
			left : [config.from.x, config.to.x],
			top : [config.from.y, config.to.y]
		});
	},

	/**
	 Fly/Slide DOM node from current location to given x and y coordinats in given seconds.
	 @method flyTo
	 @param {HTMLElement} el
	 @param {Number} x
	 @param {Number} y
	 @param {Number} seconds
	 @example

	 You may also use this method like this:
	 @example
	 	<div id="myDiv" style="position:absolute;width:100px;height:100px;border:1px solid #000;background-color:#DEF;left:50px;top:50px"></div>
		<script type="text/javascript">
	 	new ludo.effect.Effect().flyTo('myDiv', 500, 300, .5);
	 	</script>
	 Which slides "myDiv" to position 500x300 in 0.5 seconds.
	 */
	flyTo:function(el, x, y, seconds){
		this.fly({
			el:el,
			to:{x : x, y: y},
			duration: seconds
		});
	},

	getFx:function (el, duration, onComplete) {
		duration*=1000;
		var fx = new Fx.Morph(el, {
			duration:duration
		});
		fx.addEvent('complete', this.animationComplete.bind(this, [onComplete, el]));
		return fx;
	},

	animationComplete:function(onComplete, el){
		/**
		 * Fired when animation is completed
		 * @event animationComplete
		 * @param {effect.Drag} this
		 */
		this.fireEvent('animationComplete', this);

		if(onComplete !== undefined){
			onComplete.call(this, el);
		}
	},

	fadeOut:function(el, duration, callback){
		var stops = this.getStops(duration);
		var stopIncrement = 100 / stops * -1;
		this.execute({
			el:el,
			index:0,
			stops:stops,
			styles:[
				{ key: 'opacity', currentValue: 100, change: stopIncrement }
			],
			callback : callback,
			unit:''
		})
	},

	slideIn:function(el, duration, callback, to){
		to = to || el.getPosition();
		var from = {
			x: to.x,
			y : el.parentNode.offsetWidth + el.offsetHeight
		};
		this.slide(el,from, to, duration, callback);
	},

	slideOut:function(el, duration, callback, from){
		from = from || el.getPosition();
		var to = {
			x: from.x,
			y : el.parentNode.offsetHeight + el.offsetHeight
		};
		this.slide(el, from, to, duration, callback);
	},

	slide:function(el, from, to, duration, callback){
		var stops = this.getStops(duration);
		var styles = [];
		if(from.x !== to.x){
			el.style.left = from.x + 'px';
			styles.push({
				key : 'left',
				currentValue:from.x,
				change: (to.x - from.x) / stops
			});
		}

		if(from.y !== to.y){
			el.style.top = from.y + 'px';
			styles.push({
				key : 'top',
				currentValue:from.y,
				change: (to.y - from.y) / stops
			});
		}
		this.execute({
			el:el,
			index:0,
			stops:stops,
			styles:styles,
			callback : callback,
			unit:'px'
		});
		this.show(el);
	},

	fadeIn:function(el, duration, callback){
		var stops = this.getStops(duration);
		var stopIncrement = 100 / stops;
		this.execute({
			el:el,
			index:0,
			stops:stops,
			styles:[
				{ key: 'opacity', currentValue: 0, change: stopIncrement }
			],
			callback : callback,
			unit:''
		});
		this.show(el);
	},

	show:function(el){
		if(el.style.visibility==='hidden')el.css('visibility', 'visible');
	},

	getStops:function(duration){
		return Math.round(duration * this.fps);
	},

	execute:function(config){
		var el = config.el;
		for(var i=0;i<config.styles.length;i++){
			var s = config.styles[i];
			s.currentValue += s.change;
			switch(s.key){
				case 'opacity':
					el.style.opacity = (s.currentValue / 100);
					el.style.filter = ['alpha(opacity=', s.currentValue,')'].join('');
					break;
				default:
					el.style[s.key] = Math.round(s.currentValue) + config.unit;
			}
			config.index ++;

			if(config.index < config.stops){
				this.execute.delay(this.fps, this, config);
			}else{
				if(config.callback)config.callback.apply(this);
			}
		}
	}
});

