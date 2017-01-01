/**
 * Base class for animations
 * @namespace ludo.effect
 * @class ludo.effect.Effect
 * @fires ludo.effect.Effect#animationComplete
 */
ludo.effect.Effect = new Class({
	Extends: ludo.Core,

	fadeOut:function(el, duration, callback){
		el.animate({
			opacity:0
		},{
			duration:duration * 1000,
			complete:callback
		});
	},

	slideIn:function(el, duration, callback, to){
		to = to || el.getPosition();
		var from = {
			x: to.left,
			y : - el.height()
		};
		this.slide(el,from, to, duration, callback);
	},

	slideOut:function(el, duration, callback, from){
		from = from || el.getPosition();
		var to = {
			x: from.left,
			y : - el.height()
		};
		this.slide(el, from, to, duration, callback);
	},

	slide:function(el, from, to, duration, callback){


		if(from.x != undefined && from.left == undefined){

			from.left = from.x;
		}
		if(to.x != undefined && to.left == undefined){
			to.left = to.x;
		}

		from.top = from.top ||from.y;
		to.top = to.top ||to.y;

		if(from.left == undefined)from.left = to.left;
		this.show(el);
		el.css(from);

		el.animate({
			left: to.left,
			top:to.top
		},{
			duration:duration * 1000,
			complete:callback
		});
	},

	fadeIn:function(el, duration, callback){

		el.css('opacity', 0);
		el.css('visibility', 'visible');

		el.animate({
			opacity:1
		},{
			duration:duration*1000,
			complete:callback
		});
	},

	show:function(el){
		if(el.css("visibility") ==='hidden')el.css('visibility', 'visible');
	}
});

