ludo.util = {
	types:{},

	isIe:function(){
		return navigator.appName == 'Microsoft Internet Explorer';
	},

	isArray:function (obj) {
		return  ludo.util.type(obj) == 'array';
	},

	isObject:function (obj) {
		return ludo.util.type(obj) === 'object';
	},

	isString:function (obj) {
		return ludo.util.type(obj) === 'string';
	},

	isFunction:function (obj) {
		return ludo.util.type(obj) === 'function';
	},

	argsToArray:function(arguments){
		return Array.prototype.slice.call(arguments);
	},

	clamp:function(num, min,max){
		return Math.min(Math.max(num, min), max);

	},
	
	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		return typeof obj === "object" || typeof obj === "function" ?
			ludo.util.types[ ludo.util.types.toString.call(obj) ] || "object" :
			typeof obj;
	},

    isLudoJSConfig:function(obj){
        return obj.initialize===undefined && obj.type;
    },

	tabletOrMobile:undefined,

	isTabletOrMobile:function () {
		if (ludo.util.tabletOrMobile === undefined) {
			var check = false;
			(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
			ludo.util.tabletOrMobile = check;
		}
		return ludo.util.tabletOrMobile;
	},

	cancelEvent:function () {
		return false;
	},

	log:function (what) {
		if (window['console']) {
			console.log(what);
		}
	},

    warn:function(what){
        if(window['console']){
            console.warn(what);
        }
    },

	getNewZIndex:function (view) {
		var ret = ludo.CmpMgr.getNewZIndex();
		if (view.renderTo == document.body && view.els.container.css('position')==='absolute') {
			ret += 10000;
		}
		if (view.alwaysInFront) {
			ret += 400000;
		}
		return ret;
	},


	dispose:function(view){
		if (view.getParent()) {
			view.getParent().removeChild(view);
		}
        view.removeEvents();

		this.disposeDependencies(view.dependency);

        view.disposeAllChildren();

		$.each(view.els, function(key){

			if(key != 'parent' && view.els[key] && view.els[key].prop  && view.els[key].prop("tagName")){
				view.els[key].off();
				view.els[key].remove();
			}

		}.bind(view));

		ludo.CmpMgr.deleteComponent(view);

		view.els = {};
	},

	disposeDependencies:function(deps){
		for(var key in deps){
			if(deps.hasOwnProperty(key)){
				if(deps[key].removeEvents)deps[key].removeEvents();
				if(deps[key].dispose){
					deps[key].dispose();
				}else if(deps[key].dependency && deps[key].dependency.length){
					ludo.util.disposeDependencies(deps[key].dependency);
				}
				deps[key] = undefined;
			}
		}

	},
	
    parseDate:function(date, format){
        if(ludo.util.isString(date)){
            var tokens = format.split(/[^a-z%]/gi);
            var dateTokens = date.split(/[\.\-\/]/g);
            var dateParts = {};
            for(var i=0;i<tokens.length;i++){
                dateParts[tokens[i]] = dateTokens[i];
            }
            dateParts['%m'] = dateParts['%m'] ? dateParts['%m'] -1 : 0;
            dateParts['%h'] = dateParts['%h'] || 0;
            dateParts['%i'] = dateParts['%i'] || 0;
            dateParts['%s'] = dateParts['%s'] || 0;
            return new Date(dateParts['%Y'], dateParts['%m'], dateParts['%d'], dateParts['%h'], dateParts['%i'], dateParts['%s']);
        }
        return ludo.util.isString(date) ? '' : date;
    },

    getDragStartEvent:function () {

        return ludo.util.isTabletOrMobile() ? 'touchstart' : 'mousedown';
    },

    getDragMoveEvent:function () {
        return ludo.util.isTabletOrMobile() ? 'touchmove' : 'mousemove';
    },

    getDragEndEvent:function () {
        return ludo.util.isTabletOrMobile() ? 'touchend' : 'mouseup';
    },

    supportsSVG:function(){
        return !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg')['createSVGRect'];
    },

	lengthOfObject:function(obj){
		if(obj.keys != undefined)return obj.keys().length;
		var l = 0;
		for(var key in obj){
			if(obj.hasOwnProperty(key))l++;
		}
		return l;
	}
};

var ludoUtilTypes = "Boolean Number String Function Array Date RegExp Object Error".split(" ");
for(var i=0;i<ludoUtilTypes.length;i++){
	ludo.util.types[ "[object " + ludoUtilTypes[i] + "]" ] = ludoUtilTypes[i].toLowerCase();
}
