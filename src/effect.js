ludo.Effect = new Class({
	Extends: Events,
	inProgress:false,

	initialize:function(){
		if(ludo.util.isIe()){
			jQuery(document.documentElement).on('selectstart', this.cancelSelection.bind(this));
		}
	},

	fireEvents:function(obj){
		this.fireEvent('start', obj);
		this.fireEvent('end', obj);
	},

	start:function(){
		this.fireEvent('start');
		this.inProgress = true;
		this.disableSelection();
	},

	end:function(){
		this.fireEvent('end');
		this.inProgress = false;
		this.enableSelection();
	},

	disableSelection:function(){
		jQuery(document.body).addClass("ludo-unselectable");
	},

	enableSelection:function(){
		jQuery(document.body).removeClass('ludo-unselectable');
	},

	cancelSelection:function(){
		return !(this.inProgress);
	}

});

ludo.EffectObject = new ludo.Effect();