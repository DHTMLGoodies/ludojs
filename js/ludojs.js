/* Generated Wed Nov 9 19:06:12 CET 2016 */
/************************************************************************************************************
@fileoverview
ludoJS - Javascript framework, 1.1.29
Copyright (C) 2012-2016  ludoJS.com, Alf Magne Kalleland
This library is free software; you can redistribute it and/or
modify it under the terms of the GNU Lesser General Public
License as published by the Free Software Foundation; either
version 2.1 of the License, or (at your option) any later version.
This library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
Lesser General Public License for more details.
You should have received a copy of the GNU Lesser General Public
License along with this library; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
ludoJS.com., hereby disclaims all copyright interest in this script
written by Alf Magne Kalleland.
Alf Magne Kalleland, 2016
Owner of ludoJS.com
************************************************************************************************************/
/* ../ludojs/src/../mootools/MooTools-Core-1.6.0.js */
/* MooTools: the javascript framework. license: MIT-style license. copyright: Copyright (c) 2006-2016 [Valerio Proietti](http://mad4milk.net/).*/ 
/*!
Web Build: http://mootools.net/core/builder/e7289bd0058c6790cb2b769822285f97
*/
/*
---

name: Core

description: The heart of MooTools.

license: MIT-style license.

copyright: Copyright (c) 2006-2015 [Valerio Proietti](http://mad4milk.net/).

authors: The MooTools production team (http://mootools.net/developers/)

inspiration:
  - Class implementation inspired by [Base.js](http://dean.edwards.name/weblog/2006/03/base/) Copyright (c) 2006 Dean Edwards, [GNU Lesser General Public License](http://opensource.org/licenses/lgpl-license.php)
  - Some functionality inspired by [Prototype.js](http://prototypejs.org) Copyright (c) 2005-2007 Sam Stephenson, [MIT License](http://opensource.org/licenses/mit-license.php)

provides: [Core, MooTools, Type, typeOf, instanceOf, Native]

...
*/
/*! MooTools: the javascript framework. license: MIT-style license. copyright: Copyright (c) 2006-2015 [Valerio Proietti](http://mad4milk.net/).*/
(function(){

this.MooTools = {
	version: '1.6.0',
	build: '529422872adfff401b901b8b6c7ca5114ee95e2b'
};

// typeOf, instanceOf

var typeOf = this.typeOf = function(item){
	if (item == null) return 'null';
	if (item.$family != null) return item.$family();

	if (item.nodeName){
		if (item.nodeType == 1) return 'element';
		if (item.nodeType == 3) return (/\S/).test(item.nodeValue) ? 'textnode' : 'whitespace';
	} else if (typeof item.length == 'number'){
		if ('callee' in item) return 'arguments';
		if ('item' in item) return 'collection';
	}

	return typeof item;
};

var instanceOf = this.instanceOf = function(item, object){
	if (item == null) return false;
	var constructor = item.$constructor || item.constructor;
	while (constructor){
		if (constructor === object) return true;
		constructor = constructor.parent;
	}
	/*<ltIE8>*/
	if (!item.hasOwnProperty) return false;
	/*</ltIE8>*/
	return item instanceof object;
};

var hasOwnProperty = Object.prototype.hasOwnProperty;

/*<ltIE8>*/
var enumerables = true;
for (var i in {toString: 1}) enumerables = null;
if (enumerables) enumerables = ['hasOwnProperty', 'valueOf', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'constructor'];
function forEachObjectEnumberableKey(object, fn, bind){
	if (enumerables) for (var i = enumerables.length; i--;){
		var k = enumerables[i];
		// signature has key-value, so overloadSetter can directly pass the
		// method function, without swapping arguments.
		if (hasOwnProperty.call(object, k)) fn.call(bind, k, object[k]);
	}
}
/*</ltIE8>*/

// Function overloading

var Function = this.Function;

Function.prototype.overloadSetter = function(usePlural){
	var self = this;
	return function(a, b){
		if (a == null) return this;
		if (usePlural || typeof a != 'string'){
			for (var k in a) self.call(this, k, a[k]);
			/*<ltIE8>*/
			forEachObjectEnumberableKey(a, self, this);
			/*</ltIE8>*/
		} else {
			self.call(this, a, b);
		}
		return this;
	};
};

Function.prototype.overloadGetter = function(usePlural){
	var self = this;
	return function(a){
		var args, result;
		if (typeof a != 'string') args = a;
		else if (arguments.length > 1) args = arguments;
		else if (usePlural) args = [a];
		if (args){
			result = {};
			for (var i = 0; i < args.length; i++) result[args[i]] = self.call(this, args[i]);
		} else {
			result = self.call(this, a);
		}
		return result;
	};
};

Function.prototype.extend = function(key, value){
	this[key] = value;
}.overloadSetter();

Function.prototype.implement = function(key, value){
	this.prototype[key] = value;
}.overloadSetter();

// From

var slice = Array.prototype.slice;

Array.convert = function(item){
	if (item == null) return [];
	return (Type.isEnumerable(item) && typeof item != 'string') ? (typeOf(item) == 'array') ? item : slice.call(item) : [item];
};

Function.convert = function(item){
	return (typeOf(item) == 'function') ? item : function(){
		return item;
	};
};


Number.convert = function(item){
	var number = parseFloat(item);
	return isFinite(number) ? number : null;
};

String.convert = function(item){
	return item + '';
};



Function.from = Function.convert;
Number.from = Number.convert;
String.from = String.convert;

// hide, protect

Function.implement({

	hide: function(){
		this.$hidden = true;
		return this;
	},

	protect: function(){
		this.$protected = true;
		return this;
	}

});

// Type

var Type = this.Type = function(name, object){
	if (name){
		var lower = name.toLowerCase();
		var typeCheck = function(item){
			return (typeOf(item) == lower);
		};

		Type['is' + name] = typeCheck;
		if (object != null){
			object.prototype.$family = (function(){
				return lower;
			}).hide();
			
		}
	}

	if (object == null) return null;

	object.extend(this);
	object.$constructor = Type;
	object.prototype.$constructor = object;

	return object;
};

var toString = Object.prototype.toString;

Type.isEnumerable = function(item){
	return (item != null && typeof item.length == 'number' && toString.call(item) != '[object Function]' );
};

var hooks = {};

var hooksOf = function(object){
	var type = typeOf(object.prototype);
	return hooks[type] || (hooks[type] = []);
};

var implement = function(name, method){
	if (method && method.$hidden) return;

	var hooks = hooksOf(this);

	for (var i = 0; i < hooks.length; i++){
		var hook = hooks[i];
		if (typeOf(hook) == 'type') implement.call(hook, name, method);
		else hook.call(this, name, method);
	}

	var previous = this.prototype[name];
	if (previous == null || !previous.$protected) this.prototype[name] = method;

	if (this[name] == null && typeOf(method) == 'function') extend.call(this, name, function(item){
		return method.apply(item, slice.call(arguments, 1));
	});
};

var extend = function(name, method){
	if (method && method.$hidden) return;
	var previous = this[name];
	if (previous == null || !previous.$protected) this[name] = method;
};

Type.implement({

	implement: implement.overloadSetter(),

	extend: extend.overloadSetter(),

	alias: function(name, existing){
		implement.call(this, name, this.prototype[existing]);
	}.overloadSetter(),

	mirror: function(hook){
		hooksOf(this).push(hook);
		return this;
	}

});

new Type('Type', Type);

// Default Types

var force = function(name, object, methods){
	var isType = (object != Object),
		prototype = object.prototype;

	if (isType) object = new Type(name, object);

	for (var i = 0, l = methods.length; i < l; i++){
		var key = methods[i],
			generic = object[key],
			proto = prototype[key];

		if (generic) generic.protect();
		if (isType && proto) object.implement(key, proto.protect());
	}

	if (isType){
		var methodsEnumerable = prototype.propertyIsEnumerable(methods[0]);
		object.forEachMethod = function(fn){
			if (!methodsEnumerable) for (var i = 0, l = methods.length; i < l; i++){
				fn.call(prototype, prototype[methods[i]], methods[i]);
			}
			for (var key in prototype) fn.call(prototype, prototype[key], key);
		};
	}

	return force;
};

force('String', String, [
	'charAt', 'charCodeAt', 'concat', 'contains', 'indexOf', 'lastIndexOf', 'match', 'quote', 'replace', 'search',
	'slice', 'split', 'substr', 'substring', 'trim', 'toLowerCase', 'toUpperCase'
])('Array', Array, [
	'pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift', 'concat', 'join', 'slice',
	'indexOf', 'lastIndexOf', 'filter', 'forEach', 'every', 'map', 'some', 'reduce', 'reduceRight', 'contains'
])('Number', Number, [
	'toExponential', 'toFixed', 'toLocaleString', 'toPrecision'
])('Function', Function, [
	'apply', 'call', 'bind'
])('RegExp', RegExp, [
	'exec', 'test'
])('Object', Object, [
	'create', 'defineProperty', 'defineProperties', 'keys',
	'getPrototypeOf', 'getOwnPropertyDescriptor', 'getOwnPropertyNames',
	'preventExtensions', 'isExtensible', 'seal', 'isSealed', 'freeze', 'isFrozen'
])('Date', Date, ['now']);

Object.extend = extend.overloadSetter();

Date.extend('now', function(){
	return +(new Date);
});

new Type('Boolean', Boolean);

// fixes NaN returning as Number

Number.prototype.$family = function(){
	return isFinite(this) ? 'number' : 'null';
}.hide();

// Number.random

Number.extend('random', function(min, max){
	return Math.floor(Math.random() * (max - min + 1) + min);
});

// forEach, each, keys

Array.implement({

	/*<!ES5>*/
	forEach: function(fn, bind){
		for (var i = 0, l = this.length; i < l; i++){
			if (i in this) fn.call(bind, this[i], i, this);
		}
	},
	/*</!ES5>*/

	each: function(fn, bind){
		Array.forEach(this, fn, bind);
		return this;
	}

});

Object.extend({

	keys: function(object){
		var keys = [];
		for (var k in object){
			if (hasOwnProperty.call(object, k)) keys.push(k);
		}
		/*<ltIE8>*/
		forEachObjectEnumberableKey(object, function(k){
			keys.push(k);
		});
		/*</ltIE8>*/
		return keys;
	},

	forEach: function(object, fn, bind){
		Object.keys(object).forEach(function(key){
			fn.call(bind, object[key], key, object);
		});
	}

});

Object.each = Object.forEach;


// Array & Object cloning, Object merging and appending

var cloneOf = function(item){
	switch (typeOf(item)){
		case 'array': return item.clone();
		case 'object': return Object.clone(item);
		default: return item;
	}
};

Array.implement('clone', function(){
	var i = this.length, clone = new Array(i);
	while (i--) clone[i] = cloneOf(this[i]);
	return clone;
});

var mergeOne = function(source, key, current){
	switch (typeOf(current)){
		case 'object':
			if (typeOf(source[key]) == 'object') Object.merge(source[key], current);
			else source[key] = Object.clone(current);
			break;
		case 'array': source[key] = current.clone(); break;
		default: source[key] = current;
	}
	return source;
};

Object.extend({

	merge: function(source, k, v){
		if (typeOf(k) == 'string') return mergeOne(source, k, v);
		for (var i = 1, l = arguments.length; i < l; i++){
			var object = arguments[i];
			for (var key in object) mergeOne(source, key, object[key]);
		}
		return source;
	},

	clone: function(object){
		var clone = {};
		for (var key in object) clone[key] = cloneOf(object[key]);
		return clone;
	},

	append: function(original){
		for (var i = 1, l = arguments.length; i < l; i++){
			var extended = arguments[i] || {};
			for (var key in extended) original[key] = extended[key];
		}
		return original;
	}

});

// Object-less types

['Object', 'WhiteSpace', 'TextNode', 'Collection', 'Arguments'].each(function(name){
	new Type(name);
});

// Unique ID

var UID = Date.now();

String.extend('uniqueID', function(){
	return (UID++).toString(36);
});



})();

/*
---

name: Array

description: Contains Array Prototypes like each, contains, and erase.

license: MIT-style license.

requires: [Type]

provides: Array

...
*/

Array.implement({

	/*<!ES5>*/
	every: function(fn, bind){
		for (var i = 0, l = this.length >>> 0; i < l; i++){
			if ((i in this) && !fn.call(bind, this[i], i, this)) return false;
		}
		return true;
	},

	filter: function(fn, bind){
		var results = [];
		for (var value, i = 0, l = this.length >>> 0; i < l; i++) if (i in this){
			value = this[i];
			if (fn.call(bind, value, i, this)) results.push(value);
		}
		return results;
	},

	indexOf: function(item, from){
		var length = this.length >>> 0;
		for (var i = (from < 0) ? Math.max(0, length + from) : from || 0; i < length; i++){
			if (this[i] === item) return i;
		}
		return -1;
	},

	map: function(fn, bind){
		var length = this.length >>> 0, results = Array(length);
		for (var i = 0; i < length; i++){
			if (i in this) results[i] = fn.call(bind, this[i], i, this);
		}
		return results;
	},

	some: function(fn, bind){
		for (var i = 0, l = this.length >>> 0; i < l; i++){
			if ((i in this) && fn.call(bind, this[i], i, this)) return true;
		}
		return false;
	},
	/*</!ES5>*/

	clean: function(){
		return this.filter(function(item){
			return item != null;
		});
	},

	invoke: function(methodName){
		var args = Array.slice(arguments, 1);
		return this.map(function(item){
			return item[methodName].apply(item, args);
		});
	},

	associate: function(keys){
		var obj = {}, length = Math.min(this.length, keys.length);
		for (var i = 0; i < length; i++) obj[keys[i]] = this[i];
		return obj;
	},

	link: function(object){
		var result = {};
		for (var i = 0, l = this.length; i < l; i++){
			for (var key in object){
				if (object[key](this[i])){
					result[key] = this[i];
					delete object[key];
					break;
				}
			}
		}
		return result;
	},

	contains: function(item, from){
		return this.indexOf(item, from) != -1;
	},

	append: function(array){
		this.push.apply(this, array);
		return this;
	},

	getLast: function(){
		return (this.length) ? this[this.length - 1] : null;
	},

	getRandom: function(){
		return (this.length) ? this[Number.random(0, this.length - 1)] : null;
	},

	include: function(item){
		if (!this.contains(item)) this.push(item);
		return this;
	},

	combine: function(array){
		for (var i = 0, l = array.length; i < l; i++) this.include(array[i]);
		return this;
	},

	erase: function(item){
		for (var i = this.length; i--;){
			if (this[i] === item) this.splice(i, 1);
		}
		return this;
	},

	empty: function(){
		this.length = 0;
		return this;
	},

	flatten: function(){
		var array = [];
		for (var i = 0, l = this.length; i < l; i++){
			var type = typeOf(this[i]);
			if (type == 'null') continue;
			array = array.concat((type == 'array' || type == 'collection' || type == 'arguments' || instanceOf(this[i], Array)) ? Array.flatten(this[i]) : this[i]);
		}
		return array;
	},

	pick: function(){
		for (var i = 0, l = this.length; i < l; i++){
			if (this[i] != null) return this[i];
		}
		return null;
	},

	hexToRgb: function(array){
		if (this.length != 3) return null;
		var rgb = this.map(function(value){
			if (value.length == 1) value += value;
			return parseInt(value, 16);
		});
		return (array) ? rgb : 'rgb(' + rgb + ')';
	},

	rgbToHex: function(array){
		if (this.length < 3) return null;
		if (this.length == 4 && this[3] == 0 && !array) return 'transparent';
		var hex = [];
		for (var i = 0; i < 3; i++){
			var bit = (this[i] - 0).toString(16);
			hex.push((bit.length == 1) ? '0' + bit : bit);
		}
		return (array) ? hex : '#' + hex.join('');
	}

});



/*
---

name: Function

description: Contains Function Prototypes like create, bind, pass, and delay.

license: MIT-style license.

requires: Type

provides: Function

...
*/

Function.extend({

	attempt: function(){
		for (var i = 0, l = arguments.length; i < l; i++){
			try {
				return arguments[i]();
			} catch (e){}
		}
		return null;
	}

});

Function.implement({

	attempt: function(args, bind){
		try {
			return this.apply(bind, Array.convert(args));
		} catch (e){}

		return null;
	},

	/*<!ES5-bind>*/
	bind: function(that){
		var self = this,
			args = arguments.length > 1 ? Array.slice(arguments, 1) : null,
			F = function(){};

		var bound = function(){
			var context = that, length = arguments.length;
			if (this instanceof bound){
				F.prototype = self.prototype;
				context = new F;
			}
			var result = (!args && !length)
				? self.call(context)
				: self.apply(context, args && length ? args.concat(Array.slice(arguments)) : args || arguments);
			return context == that ? result : context;
		};
		return bound;
	},
	/*</!ES5-bind>*/

	pass: function(args, bind){
		var self = this;
		if (args != null) args = Array.convert(args);
		return function(){
			return self.apply(bind, args || arguments);
		};
	},

	delay: function(delay, bind, args){
		return setTimeout(this.pass((args == null ? [] : args), bind), delay);
	},

	periodical: function(periodical, bind, args){
		return setInterval(this.pass((args == null ? [] : args), bind), periodical);
	}

});



/*
---

name: Number

description: Contains Number Prototypes like limit, round, times, and ceil.

license: MIT-style license.

requires: Type

provides: Number

...
*/

Number.implement({

	limit: function(min, max){
		return Math.min(max, Math.max(min, this));
	},

	round: function(precision){
		precision = Math.pow(10, precision || 0).toFixed(precision < 0 ? -precision : 0);
		return Math.round(this * precision) / precision;
	},

	times: function(fn, bind){
		for (var i = 0; i < this; i++) fn.call(bind, i, this);
	},

	toFloat: function(){
		return parseFloat(this);
	},

	toInt: function(base){
		return parseInt(this, base || 10);
	}

});

Number.alias('each', 'times');

(function(math){

var methods = {};

math.each(function(name){
	if (!Number[name]) methods[name] = function(){
		return Math[name].apply(null, [this].concat(Array.convert(arguments)));
	};
});

Number.implement(methods);

})(['abs', 'acos', 'asin', 'atan', 'atan2', 'ceil', 'cos', 'exp', 'floor', 'log', 'max', 'min', 'pow', 'sin', 'sqrt', 'tan']);

/*
---

name: String

description: Contains String Prototypes like camelCase, capitalize, test, and toInt.

license: MIT-style license.

requires: [Type, Array]

provides: String

...
*/

String.implement({

	//<!ES6>
	contains: function(string, index){
		return (index ? String(this).slice(index) : String(this)).indexOf(string) > -1;
	},
	//</!ES6>

	test: function(regex, params){
		return ((typeOf(regex) == 'regexp') ? regex : new RegExp('' + regex, params)).test(this);
	},

	trim: function(){
		return String(this).replace(/^\s+|\s+$/g, '');
	},

	clean: function(){
		return String(this).replace(/\s+/g, ' ').trim();
	},

	camelCase: function(){
		return String(this).replace(/-\D/g, function(match){
			return match.charAt(1).toUpperCase();
		});
	},

	hyphenate: function(){
		return String(this).replace(/[A-Z]/g, function(match){
			return ('-' + match.charAt(0).toLowerCase());
		});
	},

	capitalize: function(){
		return String(this).replace(/\b[a-z]/g, function(match){
			return match.toUpperCase();
		});
	},

	escapeRegExp: function(){
		return String(this).replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1');
	},

	toInt: function(base){
		return parseInt(this, base || 10);
	},

	toFloat: function(){
		return parseFloat(this);
	},

	hexToRgb: function(array){
		var hex = String(this).match(/^#?(\w{1,2})(\w{1,2})(\w{1,2})$/);
		return (hex) ? hex.slice(1).hexToRgb(array) : null;
	},

	rgbToHex: function(array){
		var rgb = String(this).match(/\d{1,3}/g);
		return (rgb) ? rgb.rgbToHex(array) : null;
	},

	substitute: function(object, regexp){
		return String(this).replace(regexp || (/\\?\{([^{}]+)\}/g), function(match, name){
			if (match.charAt(0) == '\\') return match.slice(1);
			return (object[name] != null) ? object[name] : '';
		});
	}

});



/*
---

name: Browser

description: The Browser Object. Contains Browser initialization, Window and Document, and the Browser Hash.

license: MIT-style license.

requires: [Array, Function, Number, String]

provides: [Browser, Window, Document]

...
*/

(function(){

var document = this.document;
var window = document.window = this;

var parse = function(ua, platform){
	ua = ua.toLowerCase();
	platform = (platform ? platform.toLowerCase() : '');

	// chrome is included in the edge UA, so need to check for edge first,
	// before checking if it's chrome.
	var UA = ua.match(/(edge)[\s\/:]([\w\d\.]+)/);
	if (!UA){
		UA = ua.match(/(opera|ie|firefox|chrome|trident|crios|version)[\s\/:]([\w\d\.]+)?.*?(safari|(?:rv[\s\/:]|version[\s\/:])([\w\d\.]+)|$)/) || [null, 'unknown', 0];
	}

	if (UA[1] == 'trident'){
		UA[1] = 'ie';
		if (UA[4]) UA[2] = UA[4];
	} else if (UA[1] == 'crios'){
		UA[1] = 'chrome';
	}

	platform = ua.match(/ip(?:ad|od|hone)/) ? 'ios' : (ua.match(/(?:webos|android)/) || ua.match(/mac|win|linux/) || ['other'])[0];
	if (platform == 'win') platform = 'windows';

	return {
		extend: Function.prototype.extend,
		name: (UA[1] == 'version') ? UA[3] : UA[1],
		version: parseFloat((UA[1] == 'opera' && UA[4]) ? UA[4] : UA[2]),
		platform: platform
	};
};

var Browser = this.Browser = parse(navigator.userAgent, navigator.platform);

if (Browser.name == 'ie' && document.documentMode){
	Browser.version = document.documentMode;
}

Browser.extend({
	Features: {
		xpath: !!(document.evaluate),
		air: !!(window.runtime),
		query: !!(document.querySelector),
		json: !!(window.JSON)
	},
	parseUA: parse
});



// Request

Browser.Request = (function(){

	var XMLHTTP = function(){
		return new XMLHttpRequest();
	};

	var MSXML2 = function(){
		return new ActiveXObject('MSXML2.XMLHTTP');
	};

	var MSXML = function(){
		return new ActiveXObject('Microsoft.XMLHTTP');
	};

	return Function.attempt(function(){
		XMLHTTP();
		return XMLHTTP;
	}, function(){
		MSXML2();
		return MSXML2;
	}, function(){
		MSXML();
		return MSXML;
	});

})();

Browser.Features.xhr = !!(Browser.Request);



// String scripts

Browser.exec = function(text){
	if (!text) return text;
	if (window.execScript){
		window.execScript(text);
	} else {
		var script = document.createElement('script');
		script.setAttribute('type', 'text/javascript');
		script.text = text;
		document.head.appendChild(script);
		document.head.removeChild(script);
	}
	return text;
};

String.implement('stripScripts', function(exec){
	var scripts = '';
	var text = this.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, function(all, code){
		scripts += code + '\n';
		return '';
	});
	if (exec === true) Browser.exec(scripts);
	else if (typeOf(exec) == 'function') exec(scripts, text);
	return text;
});

// Window, Document

Browser.extend({
	Document: this.Document,
	Window: this.Window,
	Element: this.Element,
	Event: this.Event
});

this.Window = this.$constructor = new Type('Window', function(){});

this.$family = Function.convert('window').hide();

Window.mirror(function(name, method){
	window[name] = method;
});

this.Document = document.$constructor = new Type('Document', function(){});

document.$family = Function.convert('document').hide();

Document.mirror(function(name, method){
	document[name] = method;
});

document.html = document.documentElement;
if (!document.head) document.head = document.getElementsByTagName('head')[0];

if (document.execCommand) try {
	document.execCommand('BackgroundImageCache', false, true);
} catch (e){}

/*<ltIE9>*/
if (this.attachEvent && !this.addEventListener){
	var unloadEvent = function(){
		this.detachEvent('onunload', unloadEvent);
		document.head = document.html = document.window = null;
		window = this.Window = document = null;
	};
	this.attachEvent('onunload', unloadEvent);
}

// IE fails on collections and <select>.options (refers to <select>)
var arrayFrom = Array.convert;
try {
	arrayFrom(document.html.childNodes);
} catch (e){
	Array.convert = function(item){
		if (typeof item != 'string' && Type.isEnumerable(item) && typeOf(item) != 'array'){
			var i = item.length, array = new Array(i);
			while (i--) array[i] = item[i];
			return array;
		}
		return arrayFrom(item);
	};

	var prototype = Array.prototype,
		slice = prototype.slice;
	['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift', 'concat', 'join', 'slice'].each(function(name){
		var method = prototype[name];
		Array[name] = function(item){
			return method.apply(Array.convert(item), slice.call(arguments, 1));
		};
	});
}
/*</ltIE9>*/



})();

/*
---

name: Class

description: Contains the Class Function for easily creating, extending, and implementing reusable Classes.

license: MIT-style license.

requires: [Array, String, Function, Number]

provides: Class

...
*/

(function(){

var Class = this.Class = new Type('Class', function(params){
	if (instanceOf(params, Function)) params = {initialize: params};

	var newClass = function(){
		reset(this);
		if (newClass.$prototyping) return this;
		this.$caller = null;
		this.$family = null;
		var value = (this.initialize) ? this.initialize.apply(this, arguments) : this;
		this.$caller = this.caller = null;
		return value;
	}.extend(this).implement(params);

	newClass.$constructor = Class;
	newClass.prototype.$constructor = newClass;
	newClass.prototype.parent = parent;

	return newClass;
});

var parent = function(){
	if (!this.$caller) throw new Error('The method "parent" cannot be called.');
	var name = this.$caller.$name,
		parent = this.$caller.$owner.parent,
		previous = (parent) ? parent.prototype[name] : null;
	if (!previous) throw new Error('The method "' + name + '" has no parent.');
	return previous.apply(this, arguments);
};

var reset = function(object){
	for (var key in object){
		var value = object[key];
		switch (typeOf(value)){
			case 'object':
				var F = function(){};
				F.prototype = value;
				object[key] = reset(new F);
				break;
			case 'array': object[key] = value.clone(); break;
		}
	}
	return object;
};

var wrap = function(self, key, method){
	if (method.$origin) method = method.$origin;
	var wrapper = function(){
		if (method.$protected && this.$caller == null) throw new Error('The method "' + key + '" cannot be called.');
		var caller = this.caller, current = this.$caller;
		this.caller = current; this.$caller = wrapper;
		var result = method.apply(this, arguments);
		this.$caller = current; this.caller = caller;
		return result;
	}.extend({$owner: self, $origin: method, $name: key});
	return wrapper;
};

var implement = function(key, value, retain){
	if (Class.Mutators.hasOwnProperty(key)){
		value = Class.Mutators[key].call(this, value);
		if (value == null) return this;
	}

	if (typeOf(value) == 'function'){
		if (value.$hidden) return this;
		this.prototype[key] = (retain) ? value : wrap(this, key, value);
	} else {
		Object.merge(this.prototype, key, value);
	}

	return this;
};

var getInstance = function(klass){
	klass.$prototyping = true;
	var proto = new klass;
	delete klass.$prototyping;
	return proto;
};

Class.implement('implement', implement.overloadSetter());

Class.Mutators = {

	Extends: function(parent){
		this.parent = parent;
		this.prototype = getInstance(parent);
	},

	Implements: function(items){
		Array.convert(items).each(function(item){
			var instance = new item;
			for (var key in instance) implement.call(this, key, instance[key], true);
		}, this);
	}
};

})();

/*
---

name: Class.Extras

description: Contains Utility Classes that can be implemented into your own Classes to ease the execution of many common tasks.

license: MIT-style license.

requires: Class

provides: [Class.Extras, Chain, Events, Options]

...
*/

(function(){

this.Chain = new Class({

	$chain: [],

	chain: function(){
		this.$chain.append(Array.flatten(arguments));
		return this;
	},

	callChain: function(){
		return (this.$chain.length) ? this.$chain.shift().apply(this, arguments) : false;
	},

	clearChain: function(){
		this.$chain.empty();
		return this;
	}

});

var removeOn = function(string){
	return string.replace(/^on([A-Z])/, function(full, first){
		return first.toLowerCase();
	});
};

this.Events = new Class({

	$events: {},

	addEvent: function(type, fn, internal){
		type = removeOn(type);

		

		this.$events[type] = (this.$events[type] || []).include(fn);
		if (internal) fn.internal = true;
		return this;
	},

	addEvents: function(events){
		for (var type in events) this.addEvent(type, events[type]);
		return this;
	},

	fireEvent: function(type, args, delay){
		type = removeOn(type);
		var events = this.$events[type];
		if (!events) return this;
		args = Array.convert(args);
		events.each(function(fn){
			if (delay) fn.delay(delay, this, args);
			else fn.apply(this, args);
		}, this);
		return this;
	},

	removeEvent: function(type, fn){
		type = removeOn(type);
		var events = this.$events[type];
		if (events && !fn.internal){
			var index = events.indexOf(fn);
			if (index != -1) delete events[index];
		}
		return this;
	},

	removeEvents: function(events){
		var type;
		if (typeOf(events) == 'object'){
			for (type in events) this.removeEvent(type, events[type]);
			return this;
		}
		if (events) events = removeOn(events);
		for (type in this.$events){
			if (events && events != type) continue;
			var fns = this.$events[type];
			for (var i = fns.length; i--;) if (i in fns){
				this.removeEvent(type, fns[i]);
			}
		}
		return this;
	}

});

this.Options = new Class({

	setOptions: function(){
		var options = this.options = Object.merge.apply(null, [{}, this.options].append(arguments));
		if (this.addEvent) for (var option in options){
			if (typeOf(options[option]) != 'function' || !(/^on[A-Z]/).test(option)) continue;
			this.addEvent(option, options[option]);
			delete options[option];
		}
		return this;
	}

});

})();
/* ../ludojs/src/../mootools/Mootools-More-1.6.0.js */
/* MooTools: the javascript framework. license: MIT-style license. copyright: Copyright (c) 2006-2016 [Valerio Proietti](http://mad4milk.net/).*/ 
/*!
Web Build: http://mootools.net/more/builder/447324cc9ea6344646513d80fe56da74
*/
/*
---

script: More.js

name: More

description: MooTools More

license: MIT-style license

authors:
  - Guillermo Rauch
  - Thomas Aylott
  - Scott Kyle
  - Arian Stolwijk
  - Tim Wienk
  - Christoph Pojer
  - Aaron Newton
  - Jacob Thornton

requires:
  - Core/MooTools

provides: [MooTools.More]

...
*/

MooTools.More = {
	version: '1.6.0',
	build: '45b71db70f879781a7e0b0d3fb3bb1307c2521eb'
};

/*
---

script: Object.Extras.js

name: Object.Extras

description: Extra Object generics, like getFromPath which allows a path notation to child elements.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Core/Object
  - MooTools.More

provides: [Object.Extras]

...
*/

(function(){

var defined = function(value){
	return value != null;
};

var hasOwnProperty = Object.prototype.hasOwnProperty;

Object.extend({

	getFromPath: function(source, parts){
		if (typeof parts == 'string') parts = parts.split('.');
		for (var i = 0, l = parts.length; i < l; i++){
			if (hasOwnProperty.call(source, parts[i])) source = source[parts[i]];
			else return null;
		}
		return source;
	},

	cleanValues: function(object, method){
		method = method || defined;
		for (var key in object) if (!method(object[key])){
			delete object[key];
		}
		return object;
	},

	erase: function(object, key){
		if (hasOwnProperty.call(object, key)) delete object[key];
		return object;
	},

	run: function(object){
		var args = Array.slice(arguments, 1);
		for (var key in object) if (object[key].apply){
			object[key].apply(object, args);
		}
		return object;
	}

});

})();

/*
---

script: Locale.js

name: Locale

description: Provides methods for localization.

license: MIT-style license

authors:
  - Aaron Newton
  - Arian Stolwijk

requires:
  - Core/Events
  - Object.Extras
  - MooTools.More

provides: [Locale, Lang]

...
*/

(function(){

var current = null,
	locales = {},
	inherits = {};

var getSet = function(set){
	if (instanceOf(set, Locale.Set)) return set;
	else return locales[set];
};

var Locale = this.Locale = {

	define: function(locale, set, key, value){
		var name;
		if (instanceOf(locale, Locale.Set)){
			name = locale.name;
			if (name) locales[name] = locale;
		} else {
			name = locale;
			if (!locales[name]) locales[name] = new Locale.Set(name);
			locale = locales[name];
		}

		if (set) locale.define(set, key, value);

		

		if (!current) current = locale;

		return locale;
	},

	use: function(locale){
		locale = getSet(locale);

		if (locale){
			current = locale;

			this.fireEvent('change', locale);

			
		}

		return this;
	},

	getCurrent: function(){
		return current;
	},

	get: function(key, args){
		return (current) ? current.get(key, args) : '';
	},

	inherit: function(locale, inherits, set){
		locale = getSet(locale);

		if (locale) locale.inherit(inherits, set);
		return this;
	},

	list: function(){
		return Object.keys(locales);
	}

};

Object.append(Locale, new Events);

Locale.Set = new Class({

	sets: {},

	inherits: {
		locales: [],
		sets: {}
	},

	initialize: function(name){
		this.name = name || '';
	},

	define: function(set, key, value){
		var defineData = this.sets[set];
		if (!defineData) defineData = {};

		if (key){
			if (typeOf(key) == 'object') defineData = Object.merge(defineData, key);
			else defineData[key] = value;
		}
		this.sets[set] = defineData;

		return this;
	},

	get: function(key, args, _base){
		var value = Object.getFromPath(this.sets, key);
		if (value != null){
			var type = typeOf(value);
			if (type == 'function') value = value.apply(null, Array.convert(args));
			else if (type == 'object') value = Object.clone(value);
			return value;
		}

		// get value of inherited locales
		var index = key.indexOf('.'),
			set = index < 0 ? key : key.substr(0, index),
			names = (this.inherits.sets[set] || []).combine(this.inherits.locales).include('en-US');
		if (!_base) _base = [];

		for (var i = 0, l = names.length; i < l; i++){
			if (_base.contains(names[i])) continue;
			_base.include(names[i]);

			var locale = locales[names[i]];
			if (!locale) continue;

			value = locale.get(key, args, _base);
			if (value != null) return value;
		}

		return '';
	},

	inherit: function(names, set){
		names = Array.convert(names);

		if (set && !this.inherits.sets[set]) this.inherits.sets[set] = [];

		var l = names.length;
		while (l--) (set ? this.inherits.sets[set] : this.inherits.locales).unshift(names[l]);

		return this;
	}

});



})();

/*
---

name: Locale.en-US.Date

description: Date messages for US English.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Locale

provides: [Locale.en-US.Date]

...
*/

Locale.define('en-US', 'Date', {

	months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	months_abbr: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
	days_abbr: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

	// Culture's date order: MM/DD/YYYY
	dateOrder: ['month', 'date', 'year'],
	shortDate: '%m/%d/%Y',
	shortTime: '%I:%M%p',
	AM: 'AM',
	PM: 'PM',
	firstDayOfWeek: 0,

	// Date.Extras
	ordinal: function(dayOfMonth){
		// 1st, 2nd, 3rd, etc.
		return (dayOfMonth > 3 && dayOfMonth < 21) ? 'th' : ['th', 'st', 'nd', 'rd', 'th'][Math.min(dayOfMonth % 10, 4)];
	},

	lessThanMinuteAgo: 'less than a minute ago',
	minuteAgo: 'about a minute ago',
	minutesAgo: '{delta} minutes ago',
	hourAgo: 'about an hour ago',
	hoursAgo: 'about {delta} hours ago',
	dayAgo: '1 day ago',
	daysAgo: '{delta} days ago',
	weekAgo: '1 week ago',
	weeksAgo: '{delta} weeks ago',
	monthAgo: '1 month ago',
	monthsAgo: '{delta} months ago',
	yearAgo: '1 year ago',
	yearsAgo: '{delta} years ago',

	lessThanMinuteUntil: 'less than a minute from now',
	minuteUntil: 'about a minute from now',
	minutesUntil: '{delta} minutes from now',
	hourUntil: 'about an hour from now',
	hoursUntil: 'about {delta} hours from now',
	dayUntil: '1 day from now',
	daysUntil: '{delta} days from now',
	weekUntil: '1 week from now',
	weeksUntil: '{delta} weeks from now',
	monthUntil: '1 month from now',
	monthsUntil: '{delta} months from now',
	yearUntil: '1 year from now',
	yearsUntil: '{delta} years from now'

});

/*
---

script: Date.js

name: Date

description: Extends the Date native object to include methods useful in managing dates.

license: MIT-style license

authors:
  - Aaron Newton
  - Nicholas Barthelemy - https://svn.nbarthelemy.com/date-js/
  - Harald Kirshner - mail [at] digitarald.de; http://digitarald.de
  - Scott Kyle - scott [at] appden.com; http://appden.com

requires:
  - Core/Array
  - Core/String
  - Core/Number
  - MooTools.More
  - Locale
  - Locale.en-US.Date

provides: [Date]

...
*/

(function(){

var Date = this.Date;

var DateMethods = Date.Methods = {
	ms: 'Milliseconds',
	year: 'FullYear',
	min: 'Minutes',
	mo: 'Month',
	sec: 'Seconds',
	hr: 'Hours'
};

[
	'Date', 'Day', 'FullYear', 'Hours', 'Milliseconds', 'Minutes', 'Month', 'Seconds', 'Time', 'TimezoneOffset',
	'Week', 'Timezone', 'GMTOffset', 'DayOfYear', 'LastMonth', 'LastDayOfMonth', 'UTCDate', 'UTCDay', 'UTCFullYear',
	'AMPM', 'Ordinal', 'UTCHours', 'UTCMilliseconds', 'UTCMinutes', 'UTCMonth', 'UTCSeconds', 'UTCMilliseconds'
].each(function(method){
	Date.Methods[method.toLowerCase()] = method;
});

var pad = function(n, digits, string){
	if (digits == 1) return n;
	return n < Math.pow(10, digits - 1) ? (string || '0') + pad(n, digits - 1, string) : n;
};

Date.implement({

	set: function(prop, value){
		prop = prop.toLowerCase();
		var method = DateMethods[prop] && 'set' + DateMethods[prop];
		if (method && this[method]) this[method](value);
		return this;
	}.overloadSetter(),

	get: function(prop){
		prop = prop.toLowerCase();
		var method = DateMethods[prop] && 'get' + DateMethods[prop];
		if (method && this[method]) return this[method]();
		return null;
	}.overloadGetter(),

	clone: function(){
		return new Date(this.get('time'));
	},

	increment: function(interval, times){
		interval = interval || 'day';
		times = times != null ? times : 1;

		switch (interval){
			case 'year':
				return this.increment('month', times * 12);
			case 'month':
				var d = this.get('date');
				this.set('date', 1).set('mo', this.get('mo') + times);
				return this.set('date', d.min(this.get('lastdayofmonth')));
			case 'week':
				return this.increment('day', times * 7);
			case 'day':
				return this.set('date', this.get('date') + times);
		}

		if (!Date.units[interval]) throw new Error(interval + ' is not a supported interval');

		return this.set('time', this.get('time') + times * Date.units[interval]());
	},

	decrement: function(interval, times){
		return this.increment(interval, -1 * (times != null ? times : 1));
	},

	isLeapYear: function(){
		return Date.isLeapYear(this.get('year'));
	},

	clearTime: function(){
		return this.set({hr: 0, min: 0, sec: 0, ms: 0});
	},

	diff: function(date, resolution){
		if (typeOf(date) == 'string') date = Date.parse(date);

		return ((date - this) / Date.units[resolution || 'day'](3, 3)).round(); // non-leap year, 30-day month
	},

	getLastDayOfMonth: function(){
		return Date.daysInMonth(this.get('mo'), this.get('year'));
	},

	getDayOfYear: function(){
		return (Date.UTC(this.get('year'), this.get('mo'), this.get('date') + 1)
			- Date.UTC(this.get('year'), 0, 1)) / Date.units.day();
	},

	setDay: function(day, firstDayOfWeek){
		if (firstDayOfWeek == null){
			firstDayOfWeek = Date.getMsg('firstDayOfWeek');
			if (firstDayOfWeek === '') firstDayOfWeek = 1;
		}

		day = (7 + Date.parseDay(day, true) - firstDayOfWeek) % 7;
		var currentDay = (7 + this.get('day') - firstDayOfWeek) % 7;

		return this.increment('day', day - currentDay);
	},

	getWeek: function(firstDayOfWeek){
		if (firstDayOfWeek == null){
			firstDayOfWeek = Date.getMsg('firstDayOfWeek');
			if (firstDayOfWeek === '') firstDayOfWeek = 1;
		}

		var date = this,
			dayOfWeek = (7 + date.get('day') - firstDayOfWeek) % 7,
			dividend = 0,
			firstDayOfYear;

		if (firstDayOfWeek == 1){
			// ISO-8601, week belongs to year that has the most days of the week (i.e. has the thursday of the week)
			var month = date.get('month'),
				startOfWeek = date.get('date') - dayOfWeek;

			if (month == 11 && startOfWeek > 28) return 1; // Week 1 of next year

			if (month == 0 && startOfWeek < -2){
				// Use a date from last year to determine the week
				date = new Date(date).decrement('day', dayOfWeek);
				dayOfWeek = 0;
			}

			firstDayOfYear = new Date(date.get('year'), 0, 1).get('day') || 7;
			if (firstDayOfYear > 4) dividend = -7; // First week of the year is not week 1
		} else {
			// In other cultures the first week of the year is always week 1 and the last week always 53 or 54.
			// Days in the same week can have a different weeknumber if the week spreads across two years.
			firstDayOfYear = new Date(date.get('year'), 0, 1).get('day');
		}

		dividend += date.get('dayofyear');
		dividend += 6 - dayOfWeek; // Add days so we calculate the current date's week as a full week
		dividend += (7 + firstDayOfYear - firstDayOfWeek) % 7; // Make up for first week of the year not being a full week

		return (dividend / 7);
	},

	getOrdinal: function(day){
		return Date.getMsg('ordinal', day || this.get('date'));
	},

	getTimezone: function(){
		return this.toString()
			.replace(/^.*? ([A-Z]{3}).[0-9]{4}.*$/, '$1')
			.replace(/^.*?\(([A-Z])[a-z]+ ([A-Z])[a-z]+ ([A-Z])[a-z]+\)$/, '$1$2$3');
	},

	getGMTOffset: function(){
		var off = this.get('timezoneOffset');
		return ((off > 0) ? '-' : '+') + pad((off.abs() / 60).floor(), 2) + pad(off % 60, 2);
	},

	setAMPM: function(ampm){
		ampm = ampm.toUpperCase();
		var hr = this.get('hr');
		if (hr > 11 && ampm == 'AM') return this.decrement('hour', 12);
		else if (hr < 12 && ampm == 'PM') return this.increment('hour', 12);
		return this;
	},

	getAMPM: function(){
		return (this.get('hr') < 12) ? 'AM' : 'PM';
	},

	parse: function(str){
		this.set('time', Date.parse(str));
		return this;
	},

	isValid: function(date){
		if (!date) date = this;
		return typeOf(date) == 'date' && !isNaN(date.valueOf());
	},

	format: function(format){
		if (!this.isValid()) return 'invalid date';

		if (!format) format = '%x %X';
		if (typeof format == 'string') format = formats[format.toLowerCase()] || format;
		if (typeof format == 'function') return format(this);

		var d = this;
		return format.replace(/%([a-z%])/gi,
			function($0, $1){
				switch ($1){
					case 'a': return Date.getMsg('days_abbr')[d.get('day')];
					case 'A': return Date.getMsg('days')[d.get('day')];
					case 'b': return Date.getMsg('months_abbr')[d.get('month')];
					case 'B': return Date.getMsg('months')[d.get('month')];
					case 'c': return d.format('%a %b %d %H:%M:%S %Y');
					case 'd': return pad(d.get('date'), 2);
					case 'e': return pad(d.get('date'), 2, ' ');
					case 'H': return pad(d.get('hr'), 2);
					case 'I': return pad((d.get('hr') % 12) || 12, 2);
					case 'j': return pad(d.get('dayofyear'), 3);
					case 'k': return pad(d.get('hr'), 2, ' ');
					case 'l': return pad((d.get('hr') % 12) || 12, 2, ' ');
					case 'L': return pad(d.get('ms'), 3);
					case 'm': return pad((d.get('mo') + 1), 2);
					case 'M': return pad(d.get('min'), 2);
					case 'o': return d.get('ordinal');
					case 'p': return Date.getMsg(d.get('ampm'));
					case 's': return Math.round(d / 1000);
					case 'S': return pad(d.get('seconds'), 2);
					case 'T': return d.format('%H:%M:%S');
					case 'U': return pad(d.get('week'), 2);
					case 'w': return d.get('day');
					case 'x': return d.format(Date.getMsg('shortDate'));
					case 'X': return d.format(Date.getMsg('shortTime'));
					case 'y': return d.get('year').toString().substr(2);
					case 'Y': return d.get('year');
					case 'z': return d.get('GMTOffset');
					case 'Z': return d.get('Timezone');
				}
				return $1;
			}
		);
	},

	toISOString: function(){
		return this.format('iso8601');
	}

}).alias({
	toJSON: 'toISOString',
	compare: 'diff',
	strftime: 'format'
});

// The day and month abbreviations are standardized, so we cannot use simply %a and %b because they will get localized
var rfcDayAbbr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
	rfcMonthAbbr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

var formats = {
	db: '%Y-%m-%d %H:%M:%S',
	compact: '%Y%m%dT%H%M%S',
	'short': '%d %b %H:%M',
	'long': '%B %d, %Y %H:%M',
	rfc822: function(date){
		return rfcDayAbbr[date.get('day')] + date.format(', %d ') + rfcMonthAbbr[date.get('month')] + date.format(' %Y %H:%M:%S %Z');
	},
	rfc2822: function(date){
		return rfcDayAbbr[date.get('day')] + date.format(', %d ') + rfcMonthAbbr[date.get('month')] + date.format(' %Y %H:%M:%S %z');
	},
	iso8601: function(date){
		return (
			date.getUTCFullYear() + '-' +
			pad(date.getUTCMonth() + 1, 2) + '-' +
			pad(date.getUTCDate(), 2) + 'T' +
			pad(date.getUTCHours(), 2) + ':' +
			pad(date.getUTCMinutes(), 2) + ':' +
			pad(date.getUTCSeconds(), 2) + '.' +
			pad(date.getUTCMilliseconds(), 3) + 'Z'
		);
	}
};

var parsePatterns = [],
	nativeParse = Date.parse;

var parseWord = function(type, word, num){
	var ret = -1,
		translated = Date.getMsg(type + 's');
	switch (typeOf(word)){
		case 'object':
			ret = translated[word.get(type)];
			break;
		case 'number':
			ret = translated[word];
			if (!ret) throw new Error('Invalid ' + type + ' index: ' + word);
			break;
		case 'string':
			var match = translated.filter(function(name){
				return this.test(name);
			}, new RegExp('^' + word, 'i'));
			if (!match.length) throw new Error('Invalid ' + type + ' string');
			if (match.length > 1) throw new Error('Ambiguous ' + type);
			ret = match[0];
	}

	return (num) ? translated.indexOf(ret) : ret;
};

var startCentury = 1900,
	startYear = 70;

Date.extend({

	getMsg: function(key, args){
		return Locale.get('Date.' + key, args);
	},

	units: {
		ms: Function.convert(1),
		second: Function.convert(1000),
		minute: Function.convert(60000),
		hour: Function.convert(3600000),
		day: Function.convert(86400000),
		week: Function.convert(608400000),
		month: function(month, year){
			var d = new Date;
			return Date.daysInMonth(month != null ? month : d.get('mo'), year != null ? year : d.get('year')) * 86400000;
		},
		year: function(year){
			year = year || new Date().get('year');
			return Date.isLeapYear(year) ? 31622400000 : 31536000000;
		}
	},

	daysInMonth: function(month, year){
		return [31, Date.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
	},

	isLeapYear: function(year){
		return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
	},

	parse: function(from){
		var t = typeOf(from);
		if (t == 'number') return new Date(from);
		if (t != 'string') return from;
		from = from.clean();
		if (!from.length) return null;

		var parsed;
		parsePatterns.some(function(pattern){
			var bits = pattern.re.exec(from);
			return (bits) ? (parsed = pattern.handler(bits)) : false;
		});

		if (!(parsed && parsed.isValid())){
			parsed = new Date(nativeParse(from));
			if (!(parsed && parsed.isValid())) parsed = new Date(from.toInt());
		}
		return parsed;
	},

	parseDay: function(day, num){
		return parseWord('day', day, num);
	},

	parseMonth: function(month, num){
		return parseWord('month', month, num);
	},

	parseUTC: function(value){
		var localDate = new Date(value);
		var utcSeconds = Date.UTC(
			localDate.get('year'),
			localDate.get('mo'),
			localDate.get('date'),
			localDate.get('hr'),
			localDate.get('min'),
			localDate.get('sec'),
			localDate.get('ms')
		);
		return new Date(utcSeconds);
	},

	orderIndex: function(unit){
		return Date.getMsg('dateOrder').indexOf(unit) + 1;
	},

	defineFormat: function(name, format){
		formats[name] = format;
		return this;
	},

	

	defineParser: function(pattern){
		parsePatterns.push((pattern.re && pattern.handler) ? pattern : build(pattern));
		return this;
	},

	defineParsers: function(){
		Array.flatten(arguments).each(Date.defineParser);
		return this;
	},

	define2DigitYearStart: function(year){
		startYear = year % 100;
		startCentury = year - startYear;
		return this;
	}

}).extend({
	defineFormats: Date.defineFormat.overloadSetter()
});

var regexOf = function(type){
	return new RegExp('(?:' + Date.getMsg(type).map(function(name){
		return name.substr(0, 3);
	}).join('|') + ')[a-z]*');
};

var replacers = function(key){
	switch (key){
		case 'T':
			return '%H:%M:%S';
		case 'x': // iso8601 covers yyyy-mm-dd, so just check if month is first
			return ((Date.orderIndex('month') == 1) ? '%m[-./]%d' : '%d[-./]%m') + '([-./]%y)?';
		case 'X':
			return '%H([.:]%M)?([.:]%S([.:]%s)?)? ?%p? ?%z?';
	}
	return null;
};

var keys = {
	d: /[0-2]?[0-9]|3[01]/,
	H: /[01]?[0-9]|2[0-3]/,
	I: /0?[1-9]|1[0-2]/,
	M: /[0-5]?\d/,
	s: /\d+/,
	o: /[a-z]*/,
	p: /[ap]\.?m\.?/,
	y: /\d{2}|\d{4}/,
	Y: /\d{4}/,
	z: /Z|[+-]\d{2}(?::?\d{2})?/
};

keys.m = keys.I;
keys.S = keys.M;

var currentLanguage;

var recompile = function(language){
	currentLanguage = language;

	keys.a = keys.A = regexOf('days');
	keys.b = keys.B = regexOf('months');

	parsePatterns.each(function(pattern, i){
		if (pattern.format) parsePatterns[i] = build(pattern.format);
	});
};

var build = function(format){
	if (!currentLanguage) return {format: format};

	var parsed = [];
	var re = (format.source || format) // allow format to be regex
	.replace(/%([a-z])/gi,
		function($0, $1){
			return replacers($1) || $0;
		}
	).replace(/\((?!\?)/g, '(?:') // make all groups non-capturing
	.replace(/ (?!\?|\*)/g, ',? ') // be forgiving with spaces and commas
	.replace(/%([a-z%])/gi,
		function($0, $1){
			var p = keys[$1];
			if (!p) return $1;
			parsed.push($1);
			return '(' + p.source + ')';
		}
	).replace(/\[a-z\]/gi, '[a-z\\u00c0-\\uffff;\&]'); // handle unicode words

	return {
		format: format,
		re: new RegExp('^' + re + '$', 'i'),
		handler: function(bits){
			bits = bits.slice(1).associate(parsed);
			var date = new Date().clearTime(),
				year = bits.y || bits.Y;

			if (year != null) handle.call(date, 'y', year); // need to start in the right year
			if ('d' in bits) handle.call(date, 'd', 1);
			if ('m' in bits || bits.b || bits.B) handle.call(date, 'm', 1);

			for (var key in bits) handle.call(date, key, bits[key]);
			return date;
		}
	};
};

var handle = function(key, value){
	if (!value) return this;

	switch (key){
		case 'a': case 'A': return this.set('day', Date.parseDay(value, true));
		case 'b': case 'B': return this.set('mo', Date.parseMonth(value, true));
		case 'd': return this.set('date', value);
		case 'H': case 'I': return this.set('hr', value);
		case 'm': return this.set('mo', value - 1);
		case 'M': return this.set('min', value);
		case 'p': return this.set('ampm', value.replace(/\./g, ''));
		case 'S': return this.set('sec', value);
		case 's': return this.set('ms', ('0.' + value) * 1000);
		case 'w': return this.set('day', value);
		case 'Y': return this.set('year', value);
		case 'y':
			value = +value;
			if (value < 100) value += startCentury + (value < startYear ? 100 : 0);
			return this.set('year', value);
		case 'z':
			if (value == 'Z') value = '+00';
			var offset = value.match(/([+-])(\d{2}):?(\d{2})?/);
			offset = (offset[1] + '1') * (offset[2] * 60 + (+offset[3] || 0)) + this.getTimezoneOffset();
			return this.set('time', this - offset * 60000);
	}

	return this;
};

Date.defineParsers(
	'%Y([-./]%m([-./]%d((T| )%X)?)?)?', // "1999-12-31", "1999-12-31 11:59pm", "1999-12-31 23:59:59", ISO8601
	'%Y%m%d(T%H(%M%S?)?)?', // "19991231", "19991231T1159", compact
	'%x( %X)?', // "12/31", "12.31.99", "12-31-1999", "12/31/2008 11:59 PM"
	'%d%o( %b( %Y)?)?( %X)?', // "31st", "31st December", "31 Dec 1999", "31 Dec 1999 11:59pm"
	'%b( %d%o)?( %Y)?( %X)?', // Same as above with month and day switched
	'%Y %b( %d%o( %X)?)?', // Same as above with year coming first
	'%o %b %d %X %z %Y', // "Thu Oct 22 08:11:23 +0000 2009"
	'%T', // %H:%M:%S
	'%H:%M( ?%p)?' // "11:05pm", "11:05 am" and "11:05"
);

Locale.addEvent('change', function(language){
	if (Locale.get('Date')) recompile(language);
}).fireEvent('change', Locale.getCurrent());

})();

/*
---

script: Date.Extras.js

name: Date.Extras

description: Extends the Date native object to include extra methods (on top of those in Date.js).

license: MIT-style license

authors:
  - Aaron Newton
  - Scott Kyle

requires:
  - Date

provides: [Date.Extras]

...
*/

Date.implement({

	timeDiffInWords: function(to){
		return Date.distanceOfTimeInWords(this, to || new Date);
	},

	timeDiff: function(to, separator){
		if (to == null) to = new Date;
		var delta = ((to - this) / 1000).floor().abs();

		var vals = [],
			durations = [60, 60, 24, 365, 0],
			names = ['s', 'm', 'h', 'd', 'y'],
			value, duration;

		for (var item = 0; item < durations.length; item++){
			if (item && !delta) break;
			value = delta;
			if ((duration = durations[item])){
				value = (delta % duration);
				delta = (delta / duration).floor();
			}
			vals.unshift(value + (names[item] || ''));
		}

		return vals.join(separator || ':');
	}

}).extend({

	distanceOfTimeInWords: function(from, to){
		return Date.getTimePhrase(((to - from) / 1000).toInt());
	},

	getTimePhrase: function(delta){
		var suffix = (delta < 0) ? 'Until' : 'Ago';
		if (delta < 0) delta *= -1;

		var units = {
			minute: 60,
			hour: 60,
			day: 24,
			week: 7,
			month: 52 / 12,
			year: 12,
			eon: Infinity
		};

		var msg = 'lessThanMinute';

		for (var unit in units){
			var interval = units[unit];
			if (delta < 1.5 * interval){
				if (delta > 0.75 * interval) msg = unit;
				break;
			}
			delta /= interval;
			msg = unit + 's';
		}

		delta = delta.round();
		return Date.getMsg(msg + suffix, delta).substitute({delta: delta});
	}

}).defineParsers(

	{
		// "today", "tomorrow", "yesterday"
		re: /^(?:tod|tom|yes)/i,
		handler: function(bits){
			var d = new Date().clearTime();
			switch (bits[0]){
				case 'tom': return d.increment();
				case 'yes': return d.decrement();
				default: return d;
			}
		}
	},

	{
		// "next Wednesday", "last Thursday"
		re: /^(next|last) ([a-z]+)$/i,
		handler: function(bits){
			var d = new Date().clearTime();
			var day = d.getDay();
			var newDay = Date.parseDay(bits[2], true);
			var addDays = newDay - day;
			if (newDay <= day) addDays += 7;
			if (bits[1] == 'last') addDays -= 7;
			return d.set('date', d.getDate() + addDays);
		}
	}

).alias('timeAgoInWords', 'timeDiffInWords');
/* ../ludojs/src/ludo.js */
/**
 * @module ludo
 * @main ludo
 */
window.ludo = {
    form:{ validator:{} },color:{}, dialog:{},remote:{},tree:{},model:{},tpl:{},video:{},storage:{},
    grid:{}, effect:{},paging:{},calendar:{},layout:{},progress:{},keyboard:{},chart:{},
    dataSource:{},controller:{},card:{},canvas:{},socket:{},menu:{},view:{},audio:{}, ludoDB:{}
};

if (navigator.appName == 'Microsoft Internet Explorer'){
    try {
        document.execCommand("BackgroundImageCache", false, true);
    } catch (e) { }
}

ludo.SINGLETONS = {};

ludo.CmpMgrClass = new Class({
    Extends:Events,
    components:{},
    formElements:{},
    /**
     * Reference to current active component
     * @property object activeComponent
     * @private
     */
    activeComponent:undefined,
    /**
     * Reference to currently selected button
     * @property object activeButton
     * @private
     */
    activeButton:undefined,
    /** Array of available buttons for a component. Used for tab navigation
     * @property array availableButtons
     * @private
     */
    availableButtons:undefined,

    initialize:function () {
        $(document.documentElement).on('keypress', this.autoSubmit.bind(this));
    },

    autoSubmit:function (e) {
        if (e.key == 'enter') {
            if (e.target.tagName.toLowerCase() !== 'textarea') {
                if (this.activeButton) {
                    this.activeButton.click();
                }
            }
        }
        if (e.key == 'tab') {
            var tag = e.target.tagName.toLowerCase();
            if (tag !== 'input' && tag !== 'textarea') {
                this.selectNextButton();
            }
        }
    },
    registerComponent:function (component) {
        this.components[component.id] = component;
        if (component.buttonBar || component.buttons) {
            component.addEvent('activate', this.selectFirstButton.bind(this));
            component.addEvent('hide', this.clearButtons.bind(this));
        }
        if (component.singleton && component.type) {
            ludo.SINGLETONS[component.type] = component;
        }
    },

    selectFirstButton:function (cmp) {
        if (cmp.isHidden() || !cmp.getButtons) {
            return;
        }

        this.activeComponent = cmp;
        if (this.activeButton) {
            this.activeButton.deSelect();
        }
        this.activeButton = undefined;

        var buttons = this.availableButtons = cmp.getButtons();
        var i;
        for (i = 0; i < buttons.length; i++) {
            if (!buttons[i].isHidden() && buttons[i].selected) {
                this.activeButton = buttons[i];
                buttons[i].select();
                return;
            }
        }

        for (i = 0; i < buttons.length; i++) {
            if (!buttons[i].isHidden() && buttons[i].type == 'form.SubmitButton') {
                this.activeButton = buttons[i];
                buttons[i].select();
                return;
            }
        }
        for (i = 0; i < buttons.length; i++) {
            if (!buttons[i].isHidden() && buttons[i].type == 'form.CancelButton') {
                this.activeButton = buttons[i];
                buttons[i].select();
                return;
            }
        }
    },

    selectNextButton:function () {
        if (this.activeButton) {
            this.activeButton.deSelect();
        }

        var index = this.availableButtons.indexOf(this.activeButton);
        index++;
        if (index >= this.availableButtons.length) {
            index = 0;
        }
        this.activeButton = this.availableButtons[index];
        this.activeButton.select();
    },

    clearButtons:function (cmp) {
        if (this.activeComponent && this.activeComponent.getId() == cmp.getId()) {
            this.activeComponent = undefined;
            this.activeButton = undefined;
            this.activeButton = undefined;
        }
    },

    deleteComponent:function (component) {
        this.clearButtons(component);
        delete this.components[component.getId()];
    },

    get:function (id) {
        return id['initialize'] !== undefined ? id : this.components[id];
    },

    zIndex:1,
    getNewZIndex:function () {
        this.zIndex++;
        return this.zIndex;
    },

    newComponent:function (cmpConfig, parentComponent) {
		console.log('old code');
        cmpConfig = cmpConfig || {};
        if (!this.isConfigObject(cmpConfig)) {
            if (parentComponent) {
                if (cmpConfig.getParent() && cmpConfig.getParent().removeChild) {
                    cmpConfig.getParent().removeChild(cmpConfig);
                }
                cmpConfig.setParentComponent(parentComponent);
            }
            return cmpConfig;
        } else {
            if (parentComponent) {
                cmpConfig.els = cmpConfig.els || {};
                if (!cmpConfig.renderTo && parentComponent.getEl())cmpConfig.renderTo = parentComponent.getEl();
                cmpConfig.parentComponent = parentComponent;
            }
            var ret;
            var cmpType = this.getViewType(cmpConfig, parentComponent);
            if (cmpType.countNameSpaces > 1) {
                var tokens = cmpConfig.type.split(/\./g);
                var ns = tokens.join('.');
                ret = eval('new window.ludo.' + ns + '(cmpConfig)');
                if (!ret.type)ret.type = ns;
                return ret;
            }
            else if (cmpType.nameSpace) {
                if (!window.ludo[cmpType.nameSpace][cmpType.componentType] && parentComponent) {
                    parentComponent.log('Class ludo.' + cmpType.nameSpace + '.' + cmpType.componentType + ' does not exists');
                }
                ret = new window.ludo[cmpType.nameSpace][cmpType.componentType](cmpConfig);
                if (!ret.type)ret.type = cmpType.nameSpace;
                return ret;
            } else {
                if (!window.ludo[cmpType.componentType] && parentComponent) {
                    parentComponent.log('Cannot create object of type ' + cmpType.componentType);
                }
                return new window.ludo[cmpType.componentType](cmpConfig);
            }
        }
    },

    getViewType:function (config, parentComponent) {
        var cmpType = '';
        var nameSpace = '';
        if (config.type) {
            cmpType = config.type;
        }
        else if (config.cType) {
            cmpType = config.cType;
        } else {
            cmpType = parentComponent.cType;
        }
        var countNS = 0;
        if (cmpType.indexOf('.') >= 0) {
            var tokens = cmpType.split(/\./g);
            nameSpace = tokens[0];
            cmpType = tokens[1];
            countNS = tokens.length - 1;
        }
        return {
            nameSpace:nameSpace,
            componentType:cmpType,
            countNameSpaces:countNS
        }
    },

    isConfigObject:function (obj) {
        return obj && obj.initialize ? false : true;
    }
});

ludo.CmpMgr = new ludo.CmpMgrClass();

ludo.getView = function (id) {
    return ludo.CmpMgr.get(id);
};

ludo.get = function (id) {
    return ludo.CmpMgr.get(id);
};

ludo._new = function (config) {
    if (config.type && ludo.SINGLETONS[config.type]) {
        return ludo.SINGLETONS[config.type];
    }
    return ludo.factory.create(config);
};


ludo.FormMgrClass = new Class({
    Extends:Events,
    formElements:{},
    elementArray:[],
    posArray:{},
    forms:{},

    add:function (item) {
        var name = item.getName();
        if (!this.formElements[name]) {
            this.formElements[name] = item;
            this.elementArray.push(item);
            this.posArray[item.getId()] = this.elementArray.length - 1;
        }

        item.addEvent('focus', this.setFocus.bind(this));
        item.addEvent('click', this.setFocus.bind(this));

    },

    getNext:function (formComponent) {
        if (this.posArray[formComponent.getId()]) {
            var index = this.posArray[formComponent.getId()];
            if (index < this.elementArray.length - 1) {
                return this.elementArray[index + 1];
            }
        }
        return null;
    },

    get:function (name) {
        return this.formElements[name] ? this.formElements[name] : null;
    },

    currentFocusedElement:undefined,

    setFocus:function (value, component) {
        if (component.isFormElement() && component !== this.currentFocusedElement) {
			if(this.currentFocusedElement && this.currentFocusedElement.hasFocus()){
				this.currentFocusedElement.blur();
			}
            this.currentFocusedElement = component;

            this.fireEvent('focus', component);
        }
    }

});
ludo.Form = new ludo.FormMgrClass();

/* ../ludojs/src/util.js */
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
			ludo.util.tabletOrMobile = this.isIpad() || this.isIphone() || this.isAndroid();
		}
		return ludo.util.tabletOrMobile;
	},

	isIpad:function () {
		return navigator.platform.indexOf('iPad') >= 0;
	},

	isIphone:function () {
		return navigator.platform.indexOf('iPhone') >= 0;
	},

	isAndroid:function () {
		return navigator.platform.indexOf('android') >= 0;
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

		for (var name in view.els) {
			if (view.els.hasOwnProperty(name)) {
				if (view.els[name] && view.els[name].tagName && name != 'parent') {
					view.els[name].remove();
					if(view.els[name].removeEvents)view.els[name].removeEvents();
				}
			}
		}

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
/* ../ludojs/src/effect.js */
ludo.Effect = new Class({
	Extends: Events,
	inProgress:false,

	initialize:function(){
		if(ludo.util.isIe()){
			$(document.documentElement).on('selectstart', this.cancelSelection.bind(this));
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
		$(document.body).addClass("ludo-unselectable");
	},

	enableSelection:function(){
		$(document.body).removeClass('ludo-unselectable');
	},

	cancelSelection:function(){
		return !(this.inProgress);
	}

});

ludo.EffectObject = new ludo.Effect();/* ../ludojs/src/language/default.js */
/**
 Words used by ludo JS. You can add your own translations by calling ludo.language.fill()
 @module language
 @type {Object}
 @example
 	ludo.language.fill({
 	    "Ludo JS phrase or word" : "My word",
 	    "other phrase" : "my phrase" 	
 	});
 */
ludo.language = {
	words:{},

    set:function(key, value){
        this.words[key] = value;
    },

    get:function(key){
        return this.words[key] ? this.words[key] : key;
    },

    fill:function(words){
        this.words = Object.merge(this.words, words);
    }
};/* ../ludojs/src/registry.js */
ludo.RegistryClass = new Class({
	storage : {},

	set:function(key, value){
		this.storage[key] = value;
	},

	get:function(key){
		return this.storage[key];
	}
});

ludo.registry = new ludo.RegistryClass();/* ../ludojs/src/storage/storage.js */
ludo.storage.LocalStorage = new Class({
	supported:false,
	initialize:function(){
		this.supported = typeof(Storage)!=="undefined";
	},
	// TODO rename to save
	save:function(key,value){
		if(!this.supported)return;
		var type = 'simple';
		if(ludo.util.isObject(value) || ludo.util.isArray(value)){
			value = JSON.stringify(value);
			type = 'object';
		}
		localStorage[key] = value;
		localStorage[this.getTypeKey(key)] = type;
	},

	/** TODO (2016) Implement support for default value */
	get:function(key){
		if(!this.supported)return undefined;
		var type = this.getType(key);
		if(type==='object'){
			return JSON.parse(localStorage[key]);
		}
		return localStorage[key];
	},

	getTypeKey:function(key){
		return key + '___type';
	},

	getType:function(key){
		key = this.getTypeKey(key);
		if(localStorage[key]!==undefined){
			return localStorage[key];
		}
		return 'simple';
	},

	clearLocalStore:function(){
		localStorage.clear();
	}
});

ludo.localStorage = undefined;
ludo.getLocalStorage = function(){
	if(!ludo.localStorage)ludo.localStorage = new ludo.storage.LocalStorage();
	return ludo.localStorage;
};

/* ../ludojs/src/object-factory.js */
/**
 * Internal class designed to create ludoJS class instances.
 * The global ludo.factory is an instance of this class
 * @class ObjectFactory
 */
ludo.ObjectFactory = new Class({
	namespaces:[],
	classReferences : {},

	/**
	 Creates an instance of a class by "type" attribute
	 @function create
	 @param {Object|ludo.Core} config
	 @return {ludo.Core} object
	 */
	create:function(config){
		if(this.isClass(config))return config;
		config.type = config.type || 'View';

		if(this.classReferences[config.type] !== undefined){
			return new this.classReferences[config.type](config);
		}
		var ludoJsObj = this.getInNamespace('ludo', config);
		if(ludoJsObj)return ludoJsObj;
		for(var i=0;i<this.namespaces.length;i++){
			var obj = this.getInNamespace(this.namespaces[i], config);
			if(obj)return obj;
		}
		ludo.util.log('Could not find class ' + config.type);
		return undefined;
	},

	/**
	 Register a class for quick lookup. First argument is the value of the type attribute you want
	 to support. It is not required to call this for each class you create. The alternative is to
	 register a namespace by calling ludo.factory.registerNamespace('MyApp'). However, if you have a lot of
	 classes, it will increase performance by registering your classes. ludoJS will then know it instantly
	 and doesn't have to traverse the name space tree to find it.
	 @function registerClass
	 @param {String} typeName
	 @param {ludo.Core} classReference
	 @example
        ludo.factory.createNamespace('MyApp');
	 	MyApp.MyView = new Class({
	 		Extends: ludo.View,
	 		type: 'MyApp.MyView'
	 	});
	 	ludo.factory.register('MyApp.MyView', MyApp.MyView);
		...
	 	...
	 	new ludo.View({
	 		...
	 		children:[{
	 			type:'MyApp.MyView' // ludoJS now knows how to find this class
			}]
		});


	 */
	registerClass:function(typeName, classReference){
		this.classReferences[typeName] = classReference;
	},

	/**
	 Method used to create global name space for your web applications.
	 This methods makes ludoJS aware of the namespace and register a global variable
	 window[ns] for it if it does not exists. It makes it possible for ludoJS to find
	 classes by type attribute.
	 @function ludo.factory.createNamespace
	 @param {String} ns
	 @example
	 	ludo.factory.createNamespace('MyApp');
	 	...
	 	...
	 	MyApp.MyClass = new Class({
	 		Extends: ludo.View,
			type : 'MyApp.MyClass'
	 	});

	 	var view = new ludo.View({
	 		children:[{
	 			type : 'MyApp.MyClass'
			}]
	 	});

	 Notice that "Namespace" is used as prefix in type attribute in the last snippet. For
	 standard ludoJS components, you could write type:"View". For views in your namespaces,
	 you should always use the syntax "Namespace.ClassName"
	 */
	createNamespace:function(ns){
		if(window[ns] === undefined)window[ns] = {};
		if(this.namespaces.indexOf(ns) === -1)this.namespaces.push(ns);
	},

	getInNamespace:function(ns, config){
		if(jQuery.type(config) == "string"){
			console.trace();
		}
		var type = config.type.split(/\./g);
		if(type[0] === ns)type.shift();
		var obj = window[ns];
		for(var i=0;i<type.length;i++){
			if(obj[type[i]] !== undefined){
				obj = obj[type[i]];
			}else{
				return undefined;
			}
		}
		return new obj(config);
	},

	isClass:function(obj){
		return obj && obj.initialize !== undefined;
	}
});
ludo.factory = new ludo.ObjectFactory();/* ../ludojs/src/config.js */
/**
 Class for config properties of a ludoJS application. You have access to an instance of this class
 via ludo.config.
 @class _Config
 @private
 @example
    ludo.config.setUrl('../router.php'); // to set global url
 */
ludo._Config = new Class({
	storage:{},

	initialize:function () {
		this.setDefaultValues();
	},

    /**
     * Reset all config properties back to default values
     * @function reset
     */
	reset:function(){
		this.setDefaultValues();
	},

	setDefaultValues:function () {
		this.storage = {
			url:'/controller.php',
			documentRoot:'/',
			socketUrl:'http://your-node-js-server-url:8080/',
			modRewrite:false,
			fileUploadUrl:undefined
		};
	},

    /**
     Set global url. This url will be used for requests to server if no url is explicit set by
     a component.
     @function config
     @param {String} url
     @example
        ludo.config.setUrl('../controller.php');
     */
	setUrl:function (url) {
		this.storage.url = url;
	},
    /**
     * Return global url
     * @function getUrl
     * @return {String}
     * */
	getUrl:function () {
		return this.storage.url;
	},
    /**
     * Enable url in format <url>/resource/arg1/arg2/service
     * @function enableModRewriteUrls
     */
	enableModRewriteUrls:function () {
		this.storage.modRewrite = true;
	},
    /**
     * Disable url's for mod rewrite enabled web servers.
     * @function disableModRewriteUrls
     */
	disableModRewriteUrls:function () {
		this.storage.modRewrite = false;
	},
    /**
     * Returns true when url's for mod rewrite has been enabled
	 * @function hasModRewriteUrls
     * @return {Boolean}
     */
	hasModRewriteUrls:function () {
		return this.storage.modRewrite === true;
	},
    /**
     * Set default socket url(node.js).
     * @function setSocketUrl
     * @param url
     */
	setSocketUrl:function (url) {
		this.storage.socketUrl = url;
	},
    /**
     * Return default socket url
     * @function getSocketUrl
     * @return {String}
     */
	getSocketUrl:function () {
		return this.storage.socketUrl;
	},
    /**
     * Set document root path
     * @function setDocumentRoot
     * @param {String} root
     */
	setDocumentRoot:function (root) {
		this.storage.documentRoot = root === '.' ? '' : root;
	},
    /**
     * @function getDocumentRoot
     * @return {String}
     */
	getDocumentRoot:function () {
		return this.storage.documentRoot;
	},
    /**
     * Set default upload url for form.File components.
     * @function setFileUploadUrl
     * @param {String} url
     */
	setFileUploadUrl:function (url) {
		this.storage.fileUploadUrl = url;
	},
    /**
     * @function getFileUploadUrl
     * @return {String}
     */
	getFileUploadUrl:function(){
		return this.storage.fileUploadUrl;
	}
});

ludo.config = new ludo._Config();/* ../ludojs/src/assets.js */
// TODO refactor this into the ludoJS framework
var Asset = {
    javascript: function(source, properties){

        if (!properties) properties = {};

        var script = $('<script src="' + source + '" type="javascript"></script>'),
            doc = properties.document || document,
            load = properties.onload || properties.onLoad;

        delete properties.onload;
        delete properties.onLoad;
        delete properties.document;

        if (load){
            if (typeof script.onreadystatechange != 'undefined'){
                script.on('readystatechange', function(){
                    if (['loaded', 'complete'].contains(this.readyState)) load.call(this);
                });
            } else {
                script.on('load', load);
            }
        }

        this.addProperties(script, properties);

        $(doc.head).append(script);


        return script;
    },

    addProperties:function(to, properties){

        for(var key in properties){
            if(properties.hasOwnProperty(key)){
                to.attr(key, properties[key]);
            }
        }
    },

    css: function(source, properties){
        if (!properties) properties = {};

        var link = $('<link rel="stylesheet" type="text/css" media="screen" href="' + source + '" />');

        var load = properties.onload || properties.onLoad,
            doc = properties.document || document;

        delete properties.onload;
        delete properties.onLoad;
        delete properties.document;

        if (load) link.on('load', load);

        this.addProperties(link, properties);

        $(doc.head).append(link);


        return link;
    }
};
/* ../ludojs/src/core.js */
/**
 * Base class for components and views in ludoJS. This class extends
 * Mootools Events class.
 * @class Core
 */
ludo.Core = new Class({
	Extends:Events,
	id:undefined,
	/**
	 * NB. The config properties listed below are sent to the constructor when creating the component
	 * @attribute {string} name
	 * When creating children dynamically using config objects(see children) below, you can access a child
	 * by component.child[name] if a name is passed in the config object.
	 */
	name:undefined,

	module:undefined,
	submodule:undefined,
	/**
	 Reference to a specific controller for the component.
	 The default way is to set useController to true and create a controller in
	 the same namespace as your component. Then that controller will be registered as controller
	 for the component.
	 The 'controller' property can be used to override this and assign a specific controller

	 If you create your own controller by extending ludo.controller.Controller,
	 you can control several views by adding events in the addView(component) method.

	 @attribute {Object} controller
	 @example
	 	controller : 'idOfController'
	 @example
	 	controller : { type : 'controller.MyController' }
	 A Controller can also be a singleton.

	 */
	controller:undefined,

	/**
	 * Find controller and register this component to controller
	 * @attribute {Boolean} userController
	 * @default false
	 */
	useController:false,

	/**
	 * Save states from session to session. This can be set to true
	 * for components and views where statefulProperties is defined. The component
	 * also needs an "id".
	 * @attribute stateful
	 * @type {Boolean}
	 * @default false
	 */
	stateful:false,

	/**
	 * Array of stateful properties. These properties will be saved to
	 * local storage when "change" event is fired by the component
	 * @property statefulProperties
	 * @type Array
	 * @default undefined
	 */
	statefulProperties:undefined,

	/**
	 * Storage of ludoJS classes this object is depending on
	 * @property {Object} dependency
	 * @private
	 */
	dependency:{},

    /**
     Array of add-ons config objects
     Add-ons are special components which operates on a view. "parentComponent" is sent
     to the constructor of all add-ons and can be saved for later reference.

     @config addOns
     @type {Array}
     @example
        new ludo.View({<br>
		   addOns : [ { type : 'plugins.Sound' }]
	  	 });

     Add event
     @example
        this.getParent().addEvent('someEvent', this.playSound.bind(this));
     Which will cause the plugin to play a sound when "someEvent" is fired by parent component.
     */
    addOns:undefined,

    
	initialize:function (config) {
		config = config || {};
		this.lifeCycle(config);
        this.applyAddOns();
	},

	lifeCycle:function(config){
		this.ludoConfig(config);
		this.ludoEvents();
	},

    applyAddOns:function(){
        if (this.addOns) {
            for (var i = 0; i < this.addOns.length; i++) {
                this.addOns[i].parentComponent = this;
                this.addOns[i] = this.createDependency('addOns' + i, this.addOns[i]);
            }
        }
    },

	ludoConfig:function(config){
        this.setConfigParams(config, ['url','name','controller','module','submodule','stateful','id','useController','addOns']);

		// TODO new code 2016 - custom functions
		if(config != undefined){
			for(var key in config){
				if(config.hasOwnProperty(key) && $.type(config[key]) == "function"){
					this[key] = config[key].bind(this);
				}
			}
		}

        if (this.stateful && this.statefulProperties && this.id) {
            config = this.appendPropertiesFromStore(config);
            this.addEvent('state', this.saveStatefulProperties.bind(this));
        }
		// TODO support this.listeners
		if (config.listeners !== undefined)this.addEvents(config.listeners);
		if (this.controller !== undefined)ludo.controllerManager.assignSpecificControllerFor(this.controller, this);
        if (this.module || this.useController)ludo.controllerManager.registerComponent(this);
		if(!this.id)this.id = 'ludo-' + String.uniqueID();
		ludo.CmpMgr.registerComponent(this);
	},

    setConfigParams:function(config, keys){
        for(var i=0;i<keys.length;i++){
            if(config[keys[i]] !== undefined)this[keys[i]] = config[keys[i]];
        }
    },


	ludoEvents:function(){

	},

	appendPropertiesFromStore:function (config) {
		var c = ludo.getLocalStorage().get(this.getKeyForLocalStore());
		if (c) {
			var keys = this.statefulProperties;
			for (var i = 0; i < keys.length; i++) {
				config[keys[i]] = c[keys[i]];
			}
		}
		return config;
	},

	saveStatefulProperties:function () {
		var obj = {};
		var keys = this.statefulProperties;
		for (var i = 0; i < keys.length; i++) {
			obj[keys[i]] = this[keys[i]];
		}
		ludo.getLocalStorage().save(this.getKeyForLocalStore(), obj);
	},

	getKeyForLocalStore:function () {
		return 'state_' + this.id;
	},

	/**
	 Return id of component
	 @function getId
	 @return String id
	 */
	getId:function () {
		return this.id;
	},
	/**
	 Get name of component and form element
	 @function getName
	 @return String name
	 */
	getName:function () {
		return this.name;
	},

    // TODO refactor this to use only this.url or global url.
	/**
	 * Get url for component
	 * @function getUrl
	 * @return {String|undefined} url
	 */
	getUrl:function () {
		if (this.url) {
			return this.url;
		}
		if (this.component) {
			return this.component.getUrl();
		}
		if (this.applyTo) {
			return this.applyTo.getUrl();
		}
		if (this.parentComponent) {
			return this.parentComponent.getUrl();
		}
		return undefined;
	},

	getEventEl:function () {
        return Browser['ie'] ? $(document.documentElement) : $(window);
	},

	isConfigObject:function (obj) {
		return obj.initialize === undefined;
	},

	NS:undefined,

	/**
	 * Returns component type minus class name, example:
	 * type: calendar.View will return "calendar"
	 * @function getNamespace
	 * @return {String} namespace
	 */
	getNamespace:function () {
		if (this.NS == undefined) {
			if (this.type) {
				var tokens = this.type.split(/\./g);
				tokens.pop();
				this.NS = tokens.join('.');
			} else {
				this.NS = '';
			}
		}
		return this.NS;
	},

	hasController:function () {
		return this.controller ? true : false;
	},

	getController:function () {
		return this.controller;
	},

	setController:function (controller) {
		this.controller = controller;
		this.addControllerEvents();
	},

	/**
	 Add events to controller
	 @function addControllerEvents
	 @return void
	 @example
	 this.controller.addEvent('eventname', this.methodName.bind(this));
	 */
	addControllerEvents:function () {

	},

	getModule:function () {
		return this.getInheritedProperty('module');
	},
	getSubModule:function () {
		return this.getInheritedProperty('submodule');
	},

	getInheritedProperty:function (key) {
        return this[key] !== undefined ? this[key] : this.parentComponent ? this.parentComponent.getInheritedProperty(key) : undefined;
	},

	/**
	 Save state for stateful components and views. States are stored in localStorage which
	 is supported by all major browsers(IE from version 8).
	 @function saveState
	 @return void
	 @example
	 	myComponent.saveState();
	 OR
	 @example
	 	this.fireEvent('state');
	 which does the same.
	 */
	saveState:function () {
		this.fireEvent('state');
	},

	createDependency:function(key, config){
		this.dependency[key] = ludo.util.isLudoJSConfig(config) ? ludo._new(config) : config;
		return this.dependency[key];
	},

	hasDependency:function(key){
		return this.dependency[key] ? true : false;
	},

	getDependency:function(key, config){
		if(this.dependency[key])return this.dependency[key];
        return this.createDependency(key, config);
	},

	relayEvents:function(obj, events){
		for(var i=0;i<events.length;i++){
			obj.on(events[i], this.getRelayFn(events[i]).bind(this));
		}
	},

	getRelayFn:function(event){
		return function(){
			this.fireEvent.call(this, event, Array.prototype.slice.call(arguments));
		}.bind(this);
	}
});/* ../ludojs/src/movable.js */
ludo.Movable = new Class({
    Extends : Events,
    sources : {},
    targets : {},
    records : {},
    components : {},
    els : {
        shim : null,
        insertionMarker : null
    },
    dragProperties : {
        el : null,
        waiting : null,
        countSources : 0,
        mouseOverCol : null,
        originalMousePos : {
            x : null,
            y : null
        },
        originalElPos : {
            x : null,
            y : null
        },
        jsObjects : {
            source : {
                item : null,
                column : null
            },
            target : {
                item : null,
                column : null,
                pos : null
            }
        }
    },
    id : null,
    delay : 1,
    
    initialize : function() {
        this.createElements();
        this.id = String.uniqueID();

        $(document.body).on('mouseup', this.stopMove.bind(this));
        $(document.body).on('mousemove', this.mouseMove.bind(this));
    },



    addSource : function(obj) {
        var handle = obj.handle || null;
        var record = obj.record || null;
        var component = obj.component || null;
        var el = obj.el || component.getEl();

        if(el.hasClass('ludo-movable')){
            return;
        }
        if(!el.id){
            el.id = 'ludo-movable-' + String.uniqueID();
        }
        if(this.sources[el.id]){
            ludo.util.log(el.id);
            ludo.util.log('Error: ' + el.id + ' has duplicates');
        }
        
        if(record){
            this.records[el.id] = record;
        }
        if(component){
            this.components[el.id] = component;
        }
        this.sources[el.id] = obj.el || obj.component;
        el.addClass('ludo-movable');
        if(handle){
            var handleObj = el.getElements(handle)[0];
            try{
                handleObj.addEvent('mousedown', this.startMove.bind(this));
            }catch(e){
                ludo.util.log(obj);
            }
            handleObj.addClass('ludo-movable-handle');
            handleObj.setStyle('cursor','move');
        }else{
            el.addEvent('mousedown', this.startMove.bind(this));
        }

    },

    addTarget : function(obj){

        var record = obj.record || null;
        var component = obj.component || null;
        var el = obj.el || component.getEl();

        if(!el.id){
            el.id = 'ludo-movable-target-' + String.uniqueID();
        }
        this.targets[el.id] = obj.el || obj.component;
        if(record){
            this.records[el.id] = record;
        }
        if(component){
            this.components[el.id] = component;
        }
        el.addEvent('mousemove', this.mouseMoveOnTarget.bind(this));
        el.addEvent('mouseover', this.mouseOverTarget.bind(this));
        el.addClass('ludo-movable-target');
    },

    mouseOverTarget : function() {

    },

    mouseMoveOnTarget : function() {

    },
    setWidthOfShimAndInsertionPoint : function(width) {
        this.els.shim.setStyle('width', width);
        this.els.insertionMarker.setStyles({
            width : width,
            display : ''
        });
    },
    getTargetElementFromEvent : function(e){
        var el = e.target;
        if(!el.hasClass('ludo-movable-target')){
            el = el.getParent('.ludo-movable-target');
        }
        return el;
    },

    placeInsertionMarker : function() {

    },

    createElements : function() {
        this.createShim();
        this.createInsertionMarker();
    },

    createShim : function() {
        var el = this.els.shim = $('<div>');
        el.addClass('ludo-framed-view-shim');
        el.setStyle('display','none');
        document.body.append(el);
    },

    createInsertionMarker : function() {
        var el = this.els.insertionMarker = $('<div>');
        el.setStyle('display','none');
        document.body.append(el);
    },

    stopMove : function() {
        if(this.dragProperties.waiting || this.dragProperties.mode){
            this.fireEvent('stop');
        }
        if(this.dragProperties.waiting){
            clearTimeout(this.dragProperties.waiting);
        }
        if(this.dragProperties.mode){
            this.dragProperties.mode = null;
            this.dragProperties.el.setStyle('display', '');
            this.els.shim.setStyle('display','none');
            this.els.insertionMarker.setStyle('display','none');
            this.fireEvent('drop', [this, this.getSourceItem(), this.getTargetItem()]);
        }
    },

    startMove : function(e) {

        this.fireEvent('start');
        this.dragProperties.el = e.target;
        if(!this.dragProperties.el.hasClass('ludo-movable')){
            this.dragProperties.el = this.dragProperties.el.getParent('.ludo-movable');
        }
        var coordinates = this.dragProperties.el.getCoordinates();
        this.els.shim.setStyle('display','none');
        this.resizeShim(coordinates);

        this.dragProperties.mouseOverCol = null;
        this.dragProperties.jsObjects.target = {
            column : null,
            item : null
        };

        this.setHeightOfInsertionMarker();


        this.dragProperties.jsObjects.source = {
            item : this.sources[this.dragProperties.el.id],
            column : this.sources[this.dragProperties.el.id].getParent ? this.sources[this.dragProperties.el.id].getParent() : null
        };

        this.dragProperties.originalElPos = {
            x : coordinates.left,
            y : coordinates.top
        };
        this.dragProperties.originalMousePos = {
            x : e.page.x,
            y : e.page.y
        };
        if(this.hasDelay()){
            this.dragProperties.waiting = this.startMoveAfterDelay.delay(this.delay * 1000, this);
        }else{
            this.hideSourceAndShowShim();
        }
        return false;
    },

    setHeightOfInsertionMarker : function(){
        var size = this.dragProperties.el.getSize();
        this.els.insertionMarker.setStyle('height', size.y);
    },

    resizeShim : function(coordinates){
        this.els.shim.setStyles({
            left : coordinates.left,
            top : coordinates.top + 30,
            width : coordinates.width,
            height : coordinates.height
        });
    },

    hasDelay : function() {
        return this.delay > 0;
    },

    showShim : function() {
        this.els.shim.setStyle('display', '');
    },

    startMoveAfterDelay : function() {
        if(this.dragProperties.waiting){
            this.hideSourceAndShowShim();
        }
    },

    hideSourceAndShowShim : function() {
        this.dragProperties.el.setStyle('display', 'none');
        this.dragProperties.mode = 'move';
        this.showShim();
        this.setInitialInsertionPoint();
        this.placeInsertionMarker();
    },

    mouseMove : function(e) {
        if(this.dragProperties.mode == 'move'){
            this.els.shim.setStyles({
                left : this.dragProperties.originalElPos.x + e.page.x - this.dragProperties.originalMousePos.x,
                top : this.dragProperties.originalElPos.y + e.page.y - this.dragProperties.originalMousePos.y + 30
            });
            return false;
        }
        return undefined;
    },

    setInitialInsertionPoint : function() {
        
    },
    isActive : function() {
        return this.dragProperties.mode ? true : false;
    },

    getSourceColumn : function() {
        return this.dragProperties.jsObjects.source.column;
    },
    getSourceItem : function() {
        return this.dragProperties.jsObjects.source.item;
    },
    getTargetColumn : function() {
        return this.dragProperties.jsObjects.target.column;
    },
    getTargetItem : function() {
        return this.dragProperties.jsObjects.target.item;
    },
    getTargetPosition : function() {
        return this.dragProperties.jsObjects.target.pos;
    },

    getSourceRecord : function(){
        return this.records[this.dragProperties.jsObjects.source.item.id];
    },
    getTargetRecord : function(){
        if(!this.dragProperties.jsObjects.target.item){
            return null;
        }
        return this.records[this.dragProperties.jsObjects.target.item.id];
    },

    getSourceComponent : function(){
        return this.components[this.dragProperties.jsObjects.source.item.id];
    },

    getTargetView : function(){
        if(!this.dragProperties.jsObjects.target.item){
            return null;
        }
        return this.components[this.dragProperties.jsObjects.target.item.id];
    }
});/* ../ludojs/src/remote/inject.js */
/**
 * Class for injecting data to specific resource/service requests
 * @namespace {remote}
 * @class Inject
 */
ludo.remote.Inject = new Class({

	data:{},

	/**
	 Add data to be posted with the next request.
	 @function add
	 @param resourceService
	 @param data
	 @example
	 	ludo.remoteInject.add('Person/save', {
	 		'customParam' : 'customValue'
	 	});
	 */
	add:function(resourceService, data){
		var tokens = resourceService.split(/\//g);
		var resource = tokens[0];
		var service = tokens[1];
		if(this.data[resource] === undefined){
			this.data[resource] = {};
		}
		this.data[resource][service] = data;
	},

	get:function(resource, service){
		if(this.data[resource] && this.data[resource][service]){
			var ret = this.data[resource][service];
			delete this.data[resource][service];
			return ret;
		}
		return undefined;
	}

});

ludo.remoteInject = new ludo.remote.Inject();
/* ../ludojs/src/remote/base.js */
/**
 * Base class for ludo.remote.HTML and ludo.remote.JSON
 * @namespace remote
 * @class Base
 */
ludo.remote.Base = new Class({
	Extends:Events,
	remoteData:undefined,
	method:'post',
	
	initialize:function (config) {
		config = config || {};
		if (config.listeners !== undefined) {
			this.addEvents(config.listeners);
		}
		this.method = config.method || this.method;
		if (config.resource !== undefined) this.resource = config.resource;
		if (config.url !== undefined) this.url = config.url;

		if (config.shim) {
			new ludo.remote.Shim({
				renderTo:config.shim.renderTo,
				remoteObj:this,
				txt:config.shim.txt
			});
		}
	},

	send:function (service, resourceArguments, serviceArguments, additionalData) {

		this.remoteData = undefined;

		if (resourceArguments && !ludo.util.isArray(resourceArguments))resourceArguments = [resourceArguments];
		ludo.remoteBroadcaster.clear(this, service);

		this.fireEvent('start');

		this.sendToServer(service, resourceArguments, serviceArguments, additionalData);
	},

	onComplete:function () {
		this.fireEvent('complete', this);
	},
	/**
	 * Return url for the request
	 * @function getUrl
	 * @param {String} service
	 * @param {Array} arguments
	 * @return {String}
	 * @protected
	 */
	getUrl:function (service, arguments) {
		var ret = this.url !== undefined ? this.url : ludo.config.getUrl();
		if (ludo.config.hasModRewriteUrls()) {
			ret = ludo.config.getDocumentRoot() + this.getServicePath(service, arguments);
		} else {
			ret = this.url !== undefined ? ludo.util.isFunction(this.url) ? this.url.call() : this.url : ludo.config.getUrl();
		}
		return ret;
	},
	/**
	 * @function getServicePath
	 * @param {String} service
	 * @param {Array} arguments
	 * @return {String}
	 * @protected
	 */
	getServicePath:function (service, arguments) {
		var parts = [this.resource];
		if (arguments && arguments.length)parts.push(arguments.join('/'));
		if (service)parts.push(service);
		return parts.join('/');
	},
	/**
	 * @function getDataForRequest
	 * @param {String} service
	 * @param {Array} arguments
	 * @param {Object} data
	 * @optional
	 * @param {Object} additionalData
	 * @optional
	 * @return {Object}
	 * @protected
	 */
	getDataForRequest:function (service, arguments, data, additionalData) {
		var ret = {
			data:data
		};
		if (additionalData) {
			if (ludo.util.isObject(additionalData)) {
				ret = Object.merge(additionalData, ret);
			}
		}
		if (!ludo.config.hasModRewriteUrls() && this.resource) {
			ret.request = this.getServicePath(service, arguments);
		}

		var injected = ludo.remoteInject.get(this.resource, service);
		if(injected){
			ret.data = ret.data ? Object.merge(ret.data, injected) : injected;
		}

		return ret;
	},
	/**
	 * Return "code" property of last received server response.
	 * @function getResponseCode
	 * @return {String|undefined}
	 */
	getResponseCode:function () {
		return this.remoteData && this.remoteData.code ? this.remoteData.code : 0;
	},
	/**
	 * Return response message
	 * @function getResponseMessage
	 * @return {String|undefined}
	 */
	getResponseMessage:function () {
		return this.remoteData && this.remoteData.message ? this.remoteData.message : undefined;
	},

	/**
	 * Return name of resource
	 * @function getResource
	 * @return {String}
	 */
	getResource:function(){
		return this.resource;
	},

	sendBroadCast:function(service){
		ludo.remoteBroadcaster.broadcast(this, service);
	}
});/* ../ludojs/src/remote/json.js */
/**
 * LudoJS class for remote JSON queries. Remote queries in ludoJS uses a REST-like API where you have
 * resources, arguments, service and data. An example of resource is Person and City. Example of
 * services are "load", "save". Arguments are arguments used when instantiating the resource on the
 * server, example: Person with id 1. The "data" property is used for data which should be sent to
 * the service on the server. Example: For Person with id equals 1, save these data.
 * @namespace remote
 * @class JSON
 * @augments Events
 */

/**
 * TODO 2016
 * Refactor data source. Create a method which has to be implemented. 
 */
ludo.remote.JSON = new Class({
    Extends:ludo.remote.Base,

    /**
     * Name of resource to request, example: "Person"
     * @config {String} resource
     */
    resource:undefined,
    /**
     * Optional url to use for the query instead of global set url.
     * @config {String} url
     * optional
     */
    url:undefined,

    initialize:function (config) {
		this.parent(config);
    },

    /**
     Send request to the server
     @function send
     @param {String} service
     @param {Array} resourceArguments
     @optional
     @param {Object} serviceArguments
     @optional
     @example
        ludo.config.setUrl('/controller.php');
        var req = new ludo.remote.JSON({
            resource : 'Person'
        });
        req.send('load', 1);

     Will trigger the following data to be sent to controller.php:

     @example
		 {
			 request:"Person/1/load"
		 }
     If you have the mod_rewrite module enabled and activated on your web server, you may use code like this:
     @example
	 	ludo.config.enableModRewriteUrls();
        ludo.config.setDocumentRoot('/');
        var req = new ludo.remote.JSON({
            resource : 'Person'
        });
        req.send('load', 1);

     which will send a request to the following url:
     @example:
        http://<your web server url>/Person/1/load
     The query will not contain any POST data.

     Here's another example for saving data(mod rewrite deactivated)
     @example
	     ludo.config.setUrl('/controller.php');
         var req = new ludo.remote.JSON({
            resource : 'Person'
        });
         req.send('save', 1, {
            "firstname": "John",
            "lastname": "Johnson"
         });

     which will send the following POST data to "controller.php":

     @example
        {
            "request": "Person/1/save",
            "data": {
                "firstname": "John",
                "lastname": McCarthy"
            }
        }
     When mod_rewrite is enabled, the request will be sent to the url /Person/1/save and POST data will contain

        {
            "data": {
                "firstname": "John",
                "lastname": "McCarthy"
            }
        }
     i.e. without any "request" data in the post variable since it's already defined in the url.
     @param {Object} additionalData
     @optional
     */
    sendToServer:function (service, resourceArguments, serviceArguments, additionalData) {

		if(resourceArguments && !ludo.util.isArray(resourceArguments))resourceArguments = [resourceArguments];
        // TODO escape slashes in resourceArguments and implement replacement in LudoDBRequestHandler
        // TODO the events here should be fired for the components sending the request.

		this.fireEvent('start', this);
        this.sendBroadCast(service);


        var payload = this.getDataForRequest(service, resourceArguments, serviceArguments, additionalData);
        if(!service && !resourceArguments){
            payload = payload.data;
        }

        $.ajax({
            url:this.getUrl(service, resourceArguments),
            method:this.method,
            cache:false,
            dataType:'json',
            data:payload,
            success:function (json) {
                this.remoteData = json;
                if ($.type(json) != "array" || json.success || json.success === undefined) {
                    this.fireEvent('success', this);
                } else {
                    this.fireEvent('failure', this);
                }
                this.sendBroadCast(service);
				this.onComplete();
            }.bind(this),
            fail:function (text, error) {
                this.remoteData = { "code": 500, "message": error };
                this.fireEvent('servererror', this);
                this.sendBroadCast(service);
                this.onComplete();
            }.bind(this)
        });
    },
    /**
     * Return JSON response data from last request.
     * @function getResponseData
     * @return {Object|undefined}
     */
    getResponseData:function () {
        if(this.remoteData && $.type(this.remoteData) == "array") return this.remoteData;
		if(!this.remoteData.response && !this.remoteData.data){
            return undefined;
        }
        return this.remoteData.data ? this.remoteData.data : this.remoteData.response.data ? this.remoteData.response.data : this.remoteData.response;
    },

    /**
     * Return entire server response of last request.
     * @function getResponse
     * @return {Object|undefined}
     */
    getResponse:function () {
        return this.remoteData;
    },
    /**
     * Set name of resource
     * @function setResource
     * @param {String} resource
     */
    setResource:function(resource){
        this.resource = resource;
    }
});
/* ../ludojs/src/remote/html.js */
/**
 Class for remote HTML requests.
 @namespace remote
 @class HTML
 */
ludo.remote.HTML = new Class({
	Extends:ludo.remote.Base,
	HTML:undefined,

	sendToServer:function (service, resourceArguments, serviceArguments, additionalData) {
		$.ajax({
			dataType: "html",
			method: this.method,
			url:this.getUrl(service, resourceArguments),
			async:true,
			cache:false,
			data:this.getDataForRequest(service, resourceArguments, serviceArguments, additionalData),
			success:function(html){
				this.remoteData = html;
				this.fireEvent('success', this);
				this.sendBroadCast(service);
				this.onComplete();
			}.bind(this),

			error:function(xhr, text, error){
				this.remoteData = { "code":500, "message":error };
				this.fireEvent('servererror', this);
				this.sendBroadCast(service);
				this.onComplete();
			}.bind(this)

		});
	},
	/**
	 * Return JSON response data from last request.
	 * @function getResponseData
	 * @return {Object|undefined}
	 */
	getResponseData:function () {
		return this.remoteData;
	},

	/**
	 * Return entire server response of last request.
	 * @function getResponse
	 * @return {Object|undefined}
	 */
	getResponse:function () {
		return this.remoteData;
	}
});/* ../ludojs/src/remote/broadcaster.js */
/**
 Singleton class responsible for broadcasting messages from remote requests.
 Instance of this class is available in ludo.remoteBroadcaster.

 The broadcaster can fire four events:
 start, success, failure and serverError. The example below show you how
 to add listeners to these events.
 @namespace remote
 @class Broadcaster
 @example
    ludo.remoteBroadcaster.withResource('Person').withService('read').on('success', function(){
		// Do something
	});
 */
ludo.remote.Broadcaster = new Class({
    Extends:Events,

    defaultMessages:{},
    /**
     * @function broadcast
     * @param {ludo.remote.JSON} request
     * @param {String} service
     * @private
     */
    broadcast:function (request, service) {
        var code = request.getResponseCode();

		var type, eventNameWithService;
        switch (code) {
			case 0:
				type = 'start';
				break;
            case 200:
				type = 'success';
                break;
            default:
				type = 'failure';
                break;
        }

		var eventName = this.getEventName(type, request.getResource());

		if(eventName){
			eventNameWithService = this.getEventName(type, request.getResource(), service);
		}else{
            eventName = this.getEventName('serverError', request.getResource());
            eventNameWithService = this.getEventName('serverError', request.getResource(), service);
        }

        var eventObj = {
            "message":request.getResponseMessage(),
            "code":request.getResponseCode(),
            "resource":request.getResource(),
            "service":service,
            "type": type
        };
        if (!eventObj.message)eventObj.message = this.getDefaultMessage(eventNameWithService || eventName);
        this.fireEvent(eventName, eventObj);
        if (service) {
            this.fireEvent(eventNameWithService, eventObj);
        }
    },

    getDefaultMessage:function (key) {
        return this.defaultMessages[key] ? this.defaultMessages[key] : '';
    },

    clear:function (request, service) {
        var eventObj = {
            "message":request.getResponseMessage(),
            "code":request.getResponseCode(),
            "resource":request.getResource(),
            "service":service
        };
        var eventName = this.getEventName('clear', eventObj.resource);
        var eventNameWithService = this.getEventName('clear', eventObj.resource, service);

        this.fireEvent(eventName, eventObj);
        if (service) {
            this.fireEvent(eventNameWithService, eventObj);
        }
    },

    getEventName:function (eventType, resource, service) {
        resource = resource || '';
        service = service || '';
        return [resource, service, eventType.capitalize(), 'Message'].join('');
    },

    /**
     Listen to events from remote requests. EventType is either
     success, failure or serverError. resource is a name of resource
     specified in the request.
     @function addResourceEvent
     @param {String} eventType
     @param {String} resource
     @param {Function} fn
     @example
        ludo.remoteBroadcaster.addEvent('failure', 'Person', function(response){
            this.getBody().html( response.message');
        }.bind(this));
     The event payload is an object in this format:
     @example
         {
             "code": 200,
             "message": "A message",
             "resource": "Which resource",
             "service": "Which service"
         }
     */
    addResourceEvent:function (eventType, resource, fn) {
        this.addEvent(this.getEventName(eventType, resource), fn);
    },
    /**
     Listen to remote events from a specific service only.
     @function addResourceEvent
     @param {String} eventType
     @param {String} resource
     @param {Array} services
     @param {Function} fn
     @example
        ludo.remoteBroadcaster.addEvent('failure', 'Person', ['save'], function(response){
            this.getBody().html( response.message');
        }.bind(this));
     The event payload is an object in this format:
     @example
         {
             "code": 200,
             "message": "A message",
             "resource": "Which resource",
             "service": "Which service"
         }
     */
    addServiceEvent:function (eventType, resource, services, fn) {
        if (!services.length) {
            this.addEvent(this.getEventName(eventType, resource, undefined), fn);
        } else {
            for (var i = 0; i < services.length; i++) {
                this.addEvent(this.getEventName(eventType, resource, services[i]), fn);
            }
        }
    },

    /**
     Specify default response messages for resource service
     @function setDefaultMessage
     @param {String} message
     @param {String} eventType
     @param {String} resource
     @param {String} service
     @example
        ludo.remoteBroadcaster.setDefaultMessage('You have registered successfully', 'success', 'User', 'register');
     */
    setDefaultMessage:function (message, eventType, resource, service) {
        this.defaultMessages[this.getEventName(eventType, resource, service)] = message;
    },

	eventObjToBuild :{},
    /**
     Chained method for adding broadcaster events.
     @function withResourceService
     @param {String} resourceAndService
     @return {remote.Broadcaster}
     @example
     ludo.remoteBroadcaster.withResourceService('Person/save').on('success', function(){
	 		alert('Save success');
	 	});
     */
    withResourceService:function(resourceAndService){
        var tokens = resourceAndService.split(/\//g);
        this.withResource(tokens[0]);
        if(tokens.length == 2)this.withService(tokens[1]);
        return this;
    },

	/**
	 Chained method for adding broadcaster events.
	 @function withResource
	 @param {String} resource
	 @return {remote.Broadcaster}
	 @example
	 	ludo.remoteBroadcaster.withResource('Person').withService('save').on('success', function(){
	 		alert('Save success');
	 	});
	 */
	withResource:function(resource){
		this.eventObjToBuild = {
			resource : resource
		};
		return this;
	},
	/**
	 Chained method for adding broadcaster events.
	 @function withService
	 @param {String} service
	 @return {remote.Broadcaster}
	 @example
	 	ludo.remoteBroadcaster.withResource('Person').withService('read').
            withService('save').on('success', function(){
	 		alert('Save success');
	 	});
	 */
	withService:function(service){
		if(this.eventObjToBuild.service === undefined){
			this.eventObjToBuild.service = [];
		}
		this.eventObjToBuild.service.push(service);
		return this;
	},
	/**
	 Chained method for adding broadcaster events.
	 @function on
	 @param {String|Array} events
	 @param {Function} fn
	 @return {remote.Broadcaster}
	 @example
	 	ludo.remoteBroadcaster.withResource('Person').withService('read').on('success', function(){
	 		alert('Save success');
	 	}).on('start', function(){ alert('About to save') });
     Example with array:

        ludo.remoteBroadcaster.withResource('Person').withService('read').on('success', function(){
	 		alert('Save success');
	 	}).on(['start','success'], function(){ alert('Remote event') });
	 */
	on:function(events, fn){
        if(!ludo.util.isArray(events))events = [events];
        for(var i=0;i<events.length;i++){
		    this.addServiceEvent(events[i], this.eventObjToBuild.resource, this.eventObjToBuild.service, fn);
        }
		return this;
	}
});

ludo.remoteBroadcaster = new ludo.remote.Broadcaster();
/* ../ludojs/src/canvas/engine.js */
ludo.canvas.Engine = new Class({
	/**
	 * Transformation cache
	 * @property tCache
	 * @type {Object}
	 * @private
	 */
	tCache:{},
    /**
     * Internal cache
     * @property {Object} tCacheStrings
     * @private
     */
	tCacheStrings:{},
    /**
     * Cache of class names
     * @property {Object} classNameCache
     * @private
     */
    classNameCache:{},
    /**
     * Internal cache
     * @property {Object} tCacheStrings
     * @private
     */
    cache:{},

	/**
	 * Updates a property of a SVG DOM node
	 * @function set
	 * @param {HTMLElement} el
	 * @param {String} key
	 * @param {String} value
	 */
	set:function (el, key, value) {
		if (key.substring(0, 6) == "xlink:") {
            if(value['id']!==undefined)value = '#' + value.getId();
			el.setAttributeNS("http://www.w3.org/1999/xlink", key.substring(6), value);
		} else {
            if(value['id']!==undefined)value = 'url(#' + value.getId() + ')';
			el.setAttribute(key, value);
		}
	},
	/**
	 * Remove property from node.
	 * @function remove
	 * @param {HTMLElement} el
	 * @param {String} key
	 */
	remove:function(el, key){
		if (key.substring(0, 6) == "xlink:") {
			el.removeAttributeNS("http://www.w3.org/1999/xlink", key.substring(6));
		}else{
			el.removeAttribute(key);
		}
	},

	/**
	 * Returns property value of a SVG DOM node
	 * @function get
	 * @param {HTMLElement} el
	 * @param {String} key
	 */
	get:function (el, key) {

		if (key.substring(0, 6) == "xlink:") {
			return el.getAttributeNS("http://www.w3.org/1999/xlink", key.substring(6));
		} else {
			return el.getAttribute(key);
		}
	},

	text:function (el, text) {
		el.textContent = text;
	},

	show:function (el) {
        this.css(el, 'display','');
	},

	hide:function (el) {
        this.css(el, 'display','none');
	},

	moveTo:function (el, x, y) {
		el.setAttribute('x', x);
		el.setAttribute('y', y);
	},

	toBack:function (el) {
		if (Browser['ie']) this._toBack.delay(20, this, el); else this._toBack(el);
	},
	_toBack:function (el) {
		el.parentNode.insertBefore(el, el.parentNode.firstChild);
	},

	toFront:function (el) {
		if (Browser['ie'])this._toFront.delay(20, this, el); else this._toFront(el);
	},
	_toFront:function (el) {
		el.parentNode.appendChild(el);
	},

    /**
     * Apply rotation to element
     * @function rotate
     * @param {Node} el
     * @param {Number} rotation
     */
	rotate:function (el, rotation) {
		this.setTransformation(el, 'rotate', rotation);
	},

    /**
     * Rotate around a speific point
     * @function rotateAround
     * @param {Node} el
     * @param {Number} rotation
     * @param {Number} x
     * @param {Number} y
     */
    rotateAround:function(el, rotation, x, y){
        this.setTransformation(el, 'rotate', rotation + ' ' + x + ' ' + y);
    },

	skewX:function (el, degrees) {
		this.getTransformObject(el);
		el.transform.baseVal.getItem(0).setSkewX(degrees);
	},

	skewY:function (el, degrees) {
		this.getTransformObject(el);
		el.transform.baseVal.getItem(0).setSkewY(degrees);
	},

	getCenter:function (el) {
		return {
			x:this.getWidth(el) / 2,
			y:this.getHeight(el) / 2
		}
	},

	translate:function(el, x, y){
		this.setTransformation(el, 'translate', x + ' ' + y);
	},

	getCurrentCache:function(el, key){
		return this.cache[el.id]!==undefined && this.cache[el.id][key]!==undefined ? this.cache[el.id][key] : [0,0];
	},

	scale:function(el, width, height){
		height = height || width;
		this.setTransformation(el, 'scale', width + ' ' + height);
	},

	applyTransformationToMatrix:function(el, transformation, x, y){
		var t = this.getTransformObject(el);
		var c = this.getCurrentCache(el, transformation);
		if(y!==undefined){
			t.setMatrix(t.matrix[transformation](x - c[0], y - c[1]));
		}else{
			t.setMatrix(t.matrix[transformation](x - c[0]));
		}
		if(this.cache[el.id]=== undefined)this.cache[el.id] = {};
		if(transformation === 'scale'){
			x--;y--;
		}
		this.cache[el.id][transformation] = [x,y];
	},

	setTransformMatrix:function(el, a,b,c,d,e,f){
		this.getTransformObject(el).setMatrix(a,b,c,d,e,f);
	},

	getTransformObject:function(el){
		if(el.transform.baseVal.numberOfItems ==0){
			var owner;
			if(el.ownerSVGElement){
				owner = el.ownerSVGElement;
			}else{
				owner = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
			}
			var t = owner.createSVGTransform();
			el.transform.baseVal.appendItem(t);
		}
		return el.transform.baseVal.getItem(0);
	},

	setTransformation:function (el, transformation, value) {
		var id = this.get(el, 'id');
		this.buildTransformationCacheIfNotExists(el, id);
		this.updateTransformationCache(id, transformation, value);
		this.set(el, 'transform', this.getTransformationAsText(id));
	},

	updateTransformationCache:function (id, transformation, value) {
		value = value.toString();
		if (isNaN(value)) {
			value = value.replace(/,/g, ' ');
			value = value.replace(/\s+/g, ' ');
		}
		var values = value.split(/\s/g);
		this.tCache[id][transformation] = {
			values:values,
			readable:this.getValidReturn(transformation, values)
		};
		this.tCacheStrings[id] = undefined;
	},

	clearTransformation:function (el) {
		if (Browser.ie) {
			el.setAttribute('transform', null);
		} else {
			el.removeAttribute('transform');
		}
		this.clearTransformationCache(el);
	},

	clearTransformationCache:function(el){
		this.tCache[this.get(el, 'id')] = undefined;
	},

	getTransformation:function (el, key) {
		var id = this.get(el, 'id');
		this.buildTransformationCacheIfNotExists(el, id);
		return this.tCache[id][key] ? this.tCache[id][key].readable : undefined;
	},

	buildTransformationCacheIfNotExists:function (el, id) {
		if (!this.hasTransformationCache(id)) {
			this.buildTransformationCache(el, id);
		}
	},

	getTransformationValues:function (el, key) {
		var ret = [];
		key = key.toLowerCase();
		var t = (this.get(el, 'transform') || '').toLowerCase();
		var pos = t.indexOf(key);
		if (pos >= 0) {
			t = t.substr(pos);
			var start = t.indexOf('(') + 1;
			var end = t.indexOf(')');
			var tr = t.substring(start, end);
			tr = tr.replace(/,/g, ' ');
			tr = tr.replace(/\s+/g, ' ');
			return tr.split(/[,\s]/g);
		}
		return ret;
	},

	/**
	 * @function hasTransformationCache
	 * @private
	 * @param {Number} id
	 * @return {Boolean}
	 */
	hasTransformationCache:function (id) {
		return this.tCache[id] !== undefined;
	},

	getValidReturn:function (transformation, values) {
		var ret = {};
		switch (transformation) {
			case 'skewX':
			case 'skewY':
				ret = values[0];
				break;
			case 'rotate':
				ret.degrees = values[0];
				ret.cx = values[1] ? values[1] : 0;
				ret.cy = values[2] ? values[2] : 0;
				break;
			default:
				ret.x = parseFloat(values[0]);
				ret.y = values[1] ? parseFloat(values[1]) : ret.x;

		}
		return ret;
	},

	/**
	 * @function buildTransformationCache
	 * @private
	 * @param {HTMLElement} el
	 * @param {String} id
	 */
	buildTransformationCache:function (el, id) {
		id = id || this.get(el, 'id');

		this.tCache[id] = {};
		var keys = this.getTransformationKeys(el);

		for (var i = 0; i < keys.length; i++) {
			var values = this.getTransformationValues(el, keys[i]);
			this.tCache[id][keys[i]] = {
				values:values,
				readable:this.getValidReturn(keys[i], values)
			};
		}
	},

	getTransformationKeys:function (el) {
		var ret = [];
		var t = this.get(el, 'transform') || '';

		var tokens = t.split(/\(/g);
		for (var i = 0; i < tokens.length-1; i++) {
			ret.push(tokens[i].replace(/[^a-z]/gi, ''));
		}
		return ret;
	},

	getTCache:function (el) {
		return this.tCache[this.get(el, 'id')];
	},

	getTransformationAsText:function(id){
		if(this.tCacheStrings[id] === undefined && this.tCache[id]!==undefined){
			this.buildCacheString(id);
		}
		return this.tCacheStrings[id];
	},

	buildCacheString:function(id){
		this.tCacheStrings[id] = '';
		var keys = Object.keys(this.tCache[id]);
		for(var i=0;i<keys.length;i++){
			this.tCacheStrings[id] += keys[i] + '(' + this.tCache[id][keys[i]].values.join(' ') + ') ';
		}
		this.tCacheStrings[id] = this.tCacheStrings[id].trim();
	},

	css:function(el, key, value){
		if(arguments.length < 3){
			$.each(key, function(attr, val){
				el.style[String.camelCase(attr)] = val;
			});
		}else{
			el.style[String.camelCase(key)] = value;

		}
	},

	addClass:function(el, className){
		if(!this.hasClass(el, className)){
			var id = this.getId(el);
			this.classNameCache[id].push(className);
			this.updateNodeClassNameById(el, id);
		}
		var cls = el.getAttribute('class');
		if(cls){
			cls = cls.split(/\s/g);
			if(cls.indexOf(className)>=0)return;
            cls.push(className);
            this.set(el, 'class', cls.join(' '));
		}else{
			this.set(el, 'class', className);
		}
	},

	hasClass:function(el, className){
		var id = this.getId(el);
		if(!this.classNameCache[id]){
			var cls = el.getAttribute('class');
			if(cls){
				this.classNameCache[id] = cls.split(/\s/g);
			}else{
				this.classNameCache[id] = [];
			}
		}
		return this.classNameCache[id].indexOf(className)>=0;
	},

	removeClass:function(el, className){
		if(this.hasClass(el, className)){
			var id = this.getId(el);
			this.classNameCache[id].erase(className);
			this.updateNodeClassNameById(el, id);
		}
	},

	updateNodeClassNameById:function(el, id){
		this.set(el, 'class', this.classNameCache[id].join(' '));
	},

	getId:function(el){
		if(!el.getAttribute('id')){
			el.setAttribute('id', String.uniqueID());
		}
		return el.getAttribute('id');
	},

    effect:function(){
        if(ludo.canvas.effectObject === undefined){
            ludo.canvas.effectObject = new ludo.canvas.Effect();
        }
        return ludo.canvas.effectObject;
    },

	empty:function(el){
		el.textContent = '';
	},

    /**
     * Degrees to radians method
     * @function toRad
     * @param degrees
     * @return {Number}
     */
    toRadians:function(degrees){
        return degrees * Math.PI / 180;
    },

    getPointAtDegreeOffset:function(from, degrees, size){
        var radians = ludo.canvasEngine.toRadians(degrees);
        var x = Math.cos(radians);
        var y = Math.sin(radians);

        return {
            x : from.x + (size * x),
            y : from.y + (size * y)
        }
    }

});
ludo.canvasEngine = new ludo.canvas.Engine();

/* ../ludojs/src/canvas/node.js */
/**
 * @module Canvas
 */

/**
 Factory for new svg DOM nodes
 @namespace canvas
 @class Node
 @constructor
 @param {String} tag
 @param {Object} properties
 @optional
 @param {String} text
 @optional
 @example
 var paint = new ludo.canvas.Paint({
		'stroke-color' : '#000'
 	});
 var node = new ludo.canvas.Node('rect', { id:'myRect', x:20,y:20,width:100,height:100 , "class": paint, filter:filter });

 or
 @example
 var node = new ludo.canvas.Node('title', {}, 'My title' );

 */
ludo.canvas.Node = new Class({
	Extends:Events,
	el:undefined,
	tagName:undefined,

	/**
	 * Id of node
	 * @config {String} id
	 */
	id:undefined,

	initialize:function (tagName, properties, text) {
		properties = properties || {};
		properties.id = this.id = properties.id || 'ludo-svg-node-' + String.uniqueID();
		if (tagName !== undefined)this.tagName = tagName;
		this.createNode(this.tagName, properties);
		if (text !== undefined) {
			ludo.canvasEngine.text(this.el, text);
		}
	},

	createNode:function (el, properties) {
		if (properties !== undefined) {
			if (typeof el == "string") {
				el = this.createNode(el);
			}
			Object.each(properties, function (value, key) {
				if (value['getUrl'] !== undefined) {
					value = value.getUrl();
				}
				if(key == 'css'){
					ludo.canvasEngine.css(el, value);
				}
				else if (key.substring(0, 6) == "xlink:") {
					el.setAttributeNS("http://www.w3.org/1999/xlink", key.substring(6), value);
				} else {
					el.setAttribute(key, value);
				}
			});
		} else {
			el = document.createElementNS("http://www.w3.org/2000/svg", el);
		}
		this.el = el;
		el.style && (el.style.webkitTapHighlightColor = "rgba(0,0,0,0)");
		return el;
	},

	getEl:function () {
		return this.el;
	},

    engine:function(){
        return ludo.canvasEngine;
    },

	addEvents:function(events){
		for(var key in events){
			if(events.hasOwnProperty(key)){
				this.on(key, events[key]);
			}
		}
	},

	on:function (event, fn) {

		switch (event.toLowerCase()) {
			case 'mouseenter':
				ludo.canvasEventManager.addMouseEnter(this, fn);
				break;
			case 'mouseleave':
				ludo.canvasEventManager.addMouseLeave(this, fn);
				break;
            default:
				this._addEvent(event, this.getDOMEventFn(event, fn), this.el);
                this.addEvent(event, fn);
		}
	},
	/**
	 * Add event to DOM element
	 * el is optional, default this.el
	 * @function _addEvent
	 * @param {String} ev
	 * @param {Function} fn
	 * @param {Object} el
	 * @private
	 */
	_addEvent:(function () {
		if (document.addEventListener) {
			return function (ev, fn, el) {
				if (el == undefined)el = this.el;
				el.addEventListener(ev, fn, false);
			}
		} else {
			return function (ev, fn, el) {
				if (el == undefined)el = this.el;
				el.attachEvent("on" + ev, fn);
			}
		}
	})(),
	getDOMEventFn:function (eventName, fn) {
		return  function (e) {
			e = e || window.event;

			var target = e.target || e.srcElement;
			while (target && target.nodeType == 3) target = target.parentNode;
			target = target['correspondingUseElement'] || target;
			e = {
				target:target,
				pageX: (e.pageX != null) ? e.pageX : e.clientX + document.scrollLeft,
				pageY: (e.pageY != null) ? e.pageY : e.clientY + document.scrollTop,
				clientX:(e.pageX != null) ? e.pageX - window.pageXOffset : e.clientX,
				clientY:(e.pageY != null) ? e.pageY - window.pageYOffset : e.clientY,
				event:e
			};
			if (fn) {
				fn.call(this, e, this, fn);
			}
			return false;
		}.bind(this);
	},

	/**
	 * append a new node
	 * @function append
	 * @param {canvas.View|canvas.Node} node node
	 * @return {canvas.Node} parent
	 */
	append:function (node) {
		this.el.appendChild(node.getEl());
		node.parentNode = this;
		return this;
	},

	parent:function () {
		return this.parentNode;
	},

    show:function(){
        ludo.canvasEngine.show(this.el);
    },

    hide:function(){
        ludo.canvasEngine.hide(this.el);
    },

	setProperties:function(p){
		for(var key in p){
			if(p.hasOwnProperty(key)){
				this.set(key, p[key]);
			}
		}
	},

	set:function (key, value) {
		ludo.canvasEngine.set(this.el, key, value);
	},

	remove:function(key){
		ludo.canvasEngine.remove(this.el, key);
	},

	get:function (key) {
		return ludo.canvasEngine.get(this.el, key);
	},

	getTransformation:function (key) {
		return ludo.canvasEngine.getTransformation(this.el, key);
	},

	setTransformation:function (key, value) {
		ludo.canvasEngine.setTransformation(this.el, key, value);
	},

	translate:function (x, y) {
        if(y === undefined){
            y = x.y;
            x = x.x;
        }
		ludo.canvasEngine.setTransformation(this.el, 'translate', x + ' ' + y);
	},

	getTranslate:function () {
		return ludo.canvasEngine.getTransformation(this.el, 'translate');
	},

    rotate:function(rotation, x, y){
        ludo.canvasEngine[x !== undefined ? 'rotateAround' : 'rotate'](this.el, rotation, x, y);
    },

	/**
	 * Apply filter to node
	 * @function applyFilter
	 * @param {canvas.Filter} filter
	 */
	applyFilter:function (filter) {
		this.set('filter', filter.getUrl());
	},
	/**
	 * Apply mask to node
	 * @function addMask
	 * @param {canvas.Node} mask
	 */
	applyMask:function (mask) {
		this.set('mask', mask.getUrl());
	},

	/**
	 * Apply clip path to node
	 * @function applyClipPath
	 * @param {canvas.Node} clip
	 */
	applyClipPath:function(clip){
		this.set('clip-path', clip.getUrl());
	},

	/**
	 Create url reference
	 @function url
	 @param {String} key
	 @param {canvas.Node|String} to
	 @example
	 node.url('filter', filterObj); // sets node property filter="url(#&lt;filterObj->id>)"
	 node.url('mask', 'MyMask'); // sets node property mask="url(#MyMask)"
	 */
	url:function (key, to) {
		this.set(key, to['getUrl'] !== undefined ? to.getUrl() : 'url(#' + to + ')');
	},

	href:function (url) {
		ludo.canvasEngine.set(this.el, 'xlink:href', url);
	},
	/**
	 * Update text content of node
	 * @function text
	 * @param {String} text
	 */
	text:function (text) {
		ludo.canvasEngine.text(this.el, text);
	},
	/**
	 Adds a new child DOM node
	 @function add
	 @param {String} tagName
	 @param {Object} properties
	 @param {String} text content
	 @optional
	 @return {ludo.canvas.Node} added node
	 @example
	 var filter = new ludo.canvas.Filter();
	 filter.add('feGaussianBlur', { 'stdDeviation' : 2, result:'blur'  });
	 */
	add:function (tagName, properties, text) {
		var node = new ludo.canvas.Node(tagName, properties, text);
		this.append(node);
		return node;
	},

	css:function (key, value) {
		if($.type(key) == "string"){
			ludo.canvasEngine.css(this.el, key, value);
		}else{
			this.setStyles(key);
		}
	},

	setStyles:function(styles){
		for(var key in styles){
			if(styles.hasOwnProperty(key)){
				ludo.canvasEngine.css(this.el, key, styles[key]);
			}
		}
	},

	/**
	 * Add css class to SVG node
	 * @function addClass
	 * @param {String} className
	 */
	addClass:function (className) {
		ludo.canvasEngine.addClass(this.el, className);
	},
	/**
	 Returns true if svg node has given css class name
	 @function hasClass
	 @param {String} className
	 @return {Boolean}
	 @example
	 var node = new ludo.canvas.Node('rect', { id:'myId2'});
	 node.addClass('myClass');
	 alert(node.hasClass('myClass'));
	 */
	hasClass:function (className) {
		return ludo.canvasEngine.hasClass(this.el, className);
	},
	/**
	 Remove css class name from css Node
	 @function removeClass
	 @param {String} className
	 @example
	 var node = new ludo.canvas.Node('rect', { id:'myId2'});
	 node.addClass('myClass');
	 node.addClass('secondClass');
	 node.removeClass('myClass');
	 */
	removeClass:function (className) {
		ludo.canvasEngine.removeClass(this.el, className);
	},

	getId:function () {
		return this.id;
	},

	getUrl:function () {
		return 'url(#' + this.id + ')';
	},
	/**
	 * Returns bounding box of el as an object with x,y, width and height.
	 * @function getBBox
	 * @return {Object}
	 */
	getBBox:function () {
		return this.el.getBBox();
	},

	/**
	 * Returns rectangular size of element, i.e. bounding box width - bounding box x and
	 * bounding box width - bounding box y. Values are returned as { x : 100, y : 150 }
	 * where x is width and y is height.
	 * @function getSize
	 * @return {Object} size x and y
	 */
	getSize:function(){
		var b = this.getBBox();
		return {
			x :b.width - b.x,
			y :b.height - b.y
		};
	},

	/**
	 * The nearest ancestor 'svg' element. Null if the given element is the outermost svg element.
	 * @function getCanvas
	 * @return {ludo.canvas.Node.el} svg
	 */
	getCanvas:function () {
		return this.el.ownerSVGElement;
	},
	/**
	 * The element which established the current viewport. Often, the nearest ancestor ‘svg’ element. Null if the given element is the outermost svg element
	 * @function getViewPort
	 * @return {ludo.canvas.Node.el} svg
	 */
	getViewPort:function () {
		return this.el.viewPortElement;
	},

	scale:function (width, height) {
		ludo.canvasEngine.scale(this.el, width, height);
	},
	setTransformMatrix:function (el, a, b, c, d, e, f) {
		this.setTransformMatrix(this.el, a, b, c, d, e, f);
	},

	empty:function(){
		ludo.canvasEngine.empty(this.getEl());
	},

	_curtain:undefined,
	curtain:function(config){
		if(this._curtain === undefined){
			this._curtain = new ludo.canvas.Curtain(this, config);
		}
		return this._curtain;
	},

	_animation:undefined,
	animate:function(properties, duration, fps){
		this.animation().animate(properties,duration,fps);
	},

	animation:function(){
		if(this._animation === undefined){
			this._animation = new ludo.canvas.Animation(this.getEl());
		}
		return this._animation;
	},

    toFront:function(){
        ludo.canvasEngine.toFront(this.getEl());
    },

    toBack:function(){
        ludo.canvasEngine.toBack(this.getEl());
    }
});


/* ../ludojs/src/canvas/view.js */
/**
 * Base class for Canvas elements. canvas.View can be handled as
 * {{#crossLink "canvas.Node"}}{{/crossLink}}, but it extends ludo.Core which
 * make it accessible using ludo.get('id'). The {{#crossLink "canvas.Node"}}{{/crossLink}} object
 * can be accessed using {{#crossLink "canvas.View/getNode"}}{{/crossLink}}. A canvas.View
 * object can be adopted to other elements or nodes using the  {{#crossLink "canvas.View/adopt"}}{{/crossLink}}
 * or  {{#crossLink "canvas.Node/adopt"}}{{/crossLink}} methods.
 * A canvas element contains methods for transformations and other
 * @namespace canvas
 * @class Element
 * @augments ludo.Core
 */
ludo.canvas.View = new Class({
    Extends: ludo.Core,

    /**
     * Reference to canvas.Node
     * @property {canvas.Node} node
     */
    node: undefined,

    /**
     * Which tag, example: "rect"
     * @config {String} tag
     */
    tag: undefined,

    engine: ludo.canvasEngine,
    /**
     * Properties
     * @config {Object} p
     */
    p: undefined,

    /**
     Attributes applied to DOM node
     @config attr
     @type {Object}
     @default undefined
     @example
     {
        x1:50,y1:50,x2:100,y2:150
    }
     */
    attr: undefined,

    ludoConfig: function (config) {
        this.parent(config);
        this.setConfigParams(config, ['tag', 'attr']);
        this.node = new ludo.canvas.Node(this.tag, this.attr);
    },

    /**
     * Return canvas node for this element
     * @function getNode
     * @return {canvas.Node} node
     */
    getNode: function () {
        return this.node;
    },

    getEl: function () {
        return this.node.el;
    },

    set: function (key, value) {
        this.engine.set(this.getEl(), key, value);
    },

    /**
     Returns value of an attribute
     @function get
     @param key
     @return {String} value
     @example
     var element = new ludo.canvas.View('rect', {
	 		attr:{x1:100,y1:150,x2:200,y2:250}
	 	});
     alert(element.get('x1')); // outputs 100
     */
    get: function (key) {
        return this.engine.get(this.getEl(), key);
    },

    html: function (html) {
        this.engine.html(this.getEl(), html);
    },

    rotate: function (degrees) {
        this.engine.rotate(this.getEl(), degrees);
    },
    toFront: function () {
        this.engine.toFront(this.getEl());
    },
    toBack: function () {
        this.engine.toBack(this.getEl());
    },
    skewX: function (degrees) {
        this.engine.skewX(this.getEl(), degrees);
    },
    skewY: function (degrees) {
        this.engine.skewY(this.getEl(), degrees);
    },

    hide:function(){
        this.engine.hide(this.getEl());
    },

    show:function(){
        this.engine.show(this.getEl());
    },

    scale: function (x, y) {
        this.engine.scale(this.getEl(), x, y);
    },

    css: function (key, value) {
        if (arguments.length == 1) {
            $.each(key, function (a, b) {
                this.engine.css(this.getEl(), a, b);
            }.bind(this))
        } else {
            this.engine.css(this.getEl(), key, value);

        }
    },

    /**
     * Adopt element or node
     * @function adopt
     * @param {canvas.View|canvas.Node} node
     * @return {canvas.View} parent
     */
    append: function (node) {
        this.node.append(node);
        return this;
    },

    /**
     * Remove text and child nodes from element
     * @function empty
     * @return {canvas.View} this
     */
    empty: function () {
        this.node.empty();
        return this;
    },

    add: function (tagName, properties, config) {
        return this.node.add(tagName, properties, config);
    }
});/* ../ludojs/src/canvas/canvas.js */
/**
 Class used to create canvas(&lt;SVG>) object
 @namespace canvas
 @class Canvas
 @constructor
 @param {Object} config
 @example
 	var canvas = new ludo.canvas.Canvas({
 		renderTo:'idOfDiv'
 	});
 */
ludo.canvas.Canvas = new Class({
	Extends:ludo.canvas.View,
	tag:'svg',
	defaultProperties:{
		xmlns:'http://www.w3.org/2000/svg',
		version:'1.1'
	},
	renderTo:undefined,
	view:undefined,
	title:undefined,
	description:undefined,

	ludoConfig:function (config) {
		config = config || {};
		config.attr = config.attr || {};
		config.attr = Object.merge(config.attr, this.defaultProperties);
		this.parent(config);

        this.setConfigParams(config, ['renderTo','title','description']);

		if(this.title)this.createTitle();
		if(this.description)this.createDescription();

		if (this.renderTo !== undefined) {
			if(this.renderTo.getBody !== undefined){
				this.view = this.renderTo;
				this.view.addEvent('resize', this.fitParent.bind(this));
				this.renderTo = this.view.getBody();
			}else{
				this.renderTo = $(this.renderTo);
			}
			this.renderTo.append(this.getEl());
			this.setInitialSize(config);
		}
	},

	setInitialSize:function (config) {
		config.width = config.width || this.width;
		config.height = config.height || this.height;
		if (config.width && config.height) {
			this.set('width', config.width);
			this.set('height', config.height);
			this.setViewBox(config.width, config.height);
			this.width = config.width;
			this.height = config.height;
		} else {
			this.fitParent();
			this.renderTo.on('resize', this.fitParent.bind(this));
		}
	},

	fitParent:function(){
		var size = { x: this.renderTo.width(), y: this.renderTo.height() };
		if(size.x === 0 || size.y === 0)return;
		size.x -= (ludo.dom.getPW(this.renderTo) + ludo.dom.getBW(this.renderTo));
		size.y -= (ludo.dom.getPH(this.renderTo) + ludo.dom.getBH(this.renderTo));
		this.set('width', size.x);
		this.set('height', size.y);
		this.setViewBox(size.x, size.y);

		this.node.css('width', size.x + 'px');
		this.node.css('height', size.y + 'px');
		this.width = size.x;
		this.height = size.y;
		this.fireEvent('resize', size);
	},

    /**
     * Returns height of canvas
     * @function getHeight
     * @return {Number} height
     */
	getHeight:function(){
		return this.height;
	},

    /**
     * Returns width of canvas
     * @function getWidth
     * @return {Number} width
     */
	getWidth:function(){
		return this.width;
	},

    /**
     * Returns center point of canvas as an object with x and y coordinates
     * @function getCenter
     * @return {Object}
     */
    getCenter:function(){
        return {
            x : this.width / 2,
            y : this.height / 2
        };
    },

	/**
	 * Update view box size
	 * @function setViewBox
	 * @param width
	 * @type {Number}
	 * @param height
	 * @type {Number}
	 * @param x
	 * @type {Number}
	 * @optional
	 * @param y
	 * @type {Number}
	 * @optional
	 */
	setViewBox:function (width, height, x, y) {
		this.set('viewBox', (x || 0) + ' ' + (y || 0) + ' ' + width + ' ' + height);
	},

	createTitle:function(){
		this.append(new ludo.canvas.Node('title',{}, this.title ));
	},
	createDescription:function(){
		this.append(new ludo.canvas.Node('desc', {}, this.description ));
	},
	defsNode:undefined,

	/**
	 * Returns reference to &lt;defs> node
	 * @function getDefs
	 * @return {canvas.Node} defs node
	 */
	getDefs:function(){
		if(this.defsNode === undefined){
			this.defsNode = new ludo.canvas.Node('defs');
			this.append(this.defsNode);
		}
		return this.defsNode;
	},

	/**
	 * Adopt node into &lt;defs> tag of canvas
	 * @function appendDef
	 * @param {canvas.Node|canvas.View} node
	 * @return {canvas.Node} defs Node
	 */
	appendDef:function(node){
		return this.getDefs().append(node);
	}
});/* ../ludojs/src/layout/text-box.js */
ludo.layout.TextBox = new Class({
    Extends: ludo.canvas.Canvas,
    rotation: 270,
    text: undefined,
    className: undefined,
    width: 200, height: 200,
    size: {
        x: 0, y: 0
    },
    x: 0, y: 0,
    ludoConfig: function (config) {
        this.text = config.text;
        this.rotation = config.rotation;
        this.className = config.className;
        this.renderTo = config.renderTo;
        if (config.x !== undefined)this.x = config.x;
        if (config.y !== undefined)this.y = config.y;

        if (document.createElementNS === undefined) {
            this.createIE8Box(config);
            return;
        }
        this.parent(config);

        this.createStyles();
        this.renderText();
        this.storeSize();
        this.rotate();
        this.resizeCanvas();
    },

    createIE8Box: function () {
        var span = document.createElement('span');
        $(this.renderTo).append($(span));
        span.innerHTML = this.text;
        this.setIE8Transformation(span);
        return span;
    },

    setIE8Transformation: function (span) {
        var s = span.style;
        s.display = 'block';
        s.visibility = 'hidden';
        s.position = 'absolute';
        span.className = this.className;
        document.body.append(span);

        s.fontSize = '12px';
        s.fontWeight = 'normal';
        s.filter = "progid:DXImageTransform.Microsoft.Matrix(" + this.getIE8Transformation() + ", sizingMethod='auto expand')";
        s.height = span.height() + 'px';
        this.size.x = span.width();
        this.size.y = span.height();
        if (this.rotation === 90) {
            s.right = '0px';
        }
        s.visibility = 'visible';
        document.id(this.renderTo).appendChild(span);

    },

    deg2radians: Math.PI * 2 / 360,
    getIE8Transformation: function () {
        var rad = this.rotation * this.deg2radians;
        var costheta = Math.cos(rad);
        var sintheta = Math.sin(rad);
        return ['M11=' + costheta, 'M12=' + (sintheta * -1), 'M21=' + sintheta, 'M22=' + costheta].join(',');
    },
    resizeCanvas: function () {
        var size = this.getSize();
        this.setViewBox(size.x, size.y);
        this.set('width', size.x);
        this.set('height', size.y);
    },

    createStyles: function () {
        this.styles = this.getStyles();
        var p = this.paint = new ludo.canvas.Paint(this.styles);
        this.appendDef(p);
    },

    renderText: function () {
        var el = this.textNode = new ludo.canvas.Node('text', {
            x: this.x,
            y: this.y + parseInt(this.styles['font-size']),
            "class": this.paint
        });
        el.text(this.text);
        this.append(el);
    },

    getStyles: function () {
        var node = $('<div>');
        node.addClass(this.className);
        node.css('display', 'none');
        $(document.body).append(node);

        var lh = node.css('line-height').replace(/[^0-9]/g, '');
        if (!lh) {
            lh = node.css('font-size');
        }

        var fontSize = parseInt(node.css('font-size'));
        fontSize++;


        var ret = {
            'font-size': fontSize + "px",
            'font-family': node.css('font-family'),
            'font-weight': node.css('font-weight'),
            'font-style': node.css('font-style'),
            'line-height': lh,
            'fill': node.css('color'),
            'stroke': 'none',
            'stroke-opacity': 0
        };
        ret['line-height'] = ret['line-height'] || ret['font-size'];
        node.remove();
        return ret;
    },
    storeSize: function () {
        var bbox = this.textNode.el.getBBox();
        this.size = {
            x: bbox.width + bbox.x,
            y: bbox.height + bbox.y
        };
    },
    rotate: function () {
        var x = this.size.x;
        var y = this.size.y;
        var yOffset = (this.size.y - parseInt(this.styles['line-height'])) / 2;
        var transformation = '';
        switch (this.rotation) {
            case 270:
                transformation = 'translate(' + (yOffset * -1) + ' ' + x + ') rotate(' + this.rotation + ')';
                break;
            case 180:
                transformation = 'rotate(' + this.rotation + ' ' + (x / 2) + ' ' + (y / 2) + ')';
                break;
            case 90:
                transformation = 'translate(' + (y - yOffset) + ' ' + 0 + ') rotate(' + this.rotation + ')';
                break;
            case 0:
                transformation = 'translate(0 ' + (yOffset * -1) + ')';

        }
        this.textNode.set('transform', transformation);
    },

    getSize: function () {
        switch (this.rotation) {
            case 270:
            case 90:
                return {x: this.size['y'], y: this.size['x']};
            default:
                return this.size;

        }
    }
});/* ../ludojs/src/layout/resizer.js */
ludo.layout.Resizer = new Class({
	Extends:ludo.Core,
	layout:{},
	orientation:undefined,
	view:undefined,
	dd:undefined,
	pos:undefined,
	isActive:false,
	hidden:false,

	ludoConfig:function (config) {
		this.parent(config);
        this.setConfigParams(config, ['orientation','view','layout','pos','hidden']);
		this.createDOM(config.renderTo);
		this.addViewEvents();
		this.createDragable();
        if(this.hidden)this.hide();
	},

	createDOM:function(renderTo){
		this.el = $('<div>');
		this.el.on('mouseenter', this.enterResizer.bind(this));
		this.el.on('mouseleave', this.leaveResizer.bind(this));
		this.el.addClass("ludo-resize-handle");
		this.el.addClass('ludo-resize-handle-' + ((this.orientation === 'horizontal') ? 'col' : 'row'));
		this.el.addClass('ludo-layout-resize-' + ((this.orientation === 'horizontal') ? 'col' : 'row'));

		this.el.css({
			cursor: (this.orientation == 'horizontal' ? 'w-resize' : 's-resize'),
			zIndex : 100000
		});

		renderTo.append(this.el);

	},

	enterResizer:function(){
		if(!this.isActive){
			this.el.css('z-index', parseInt(this.el.css('z-index')) + 1);
			this.el.addClass('ludo-resize-handle-active');
		}
	},

	leaveResizer:function(){
		if(!this.isActive){
			this.el.css('z-index', parseInt(this.el.css('z-index')) - 1);
			this.el.removeClass('ludo-resize-handle-active');
		}
	},
	createDragable:function(){
		this.dd = new ludo.effect.Drag({
			directions : this.orientation == 'horizontal' ? 'X' : 'Y'
		});
		this.dd.addEvent('before', this.beforeDrag.bind(this));
		this.dd.addEvent('end', this.endDrag.bind(this));
		this.dd.add(this.el);
	},

	beforeDrag:function(){
		this.dd.setMinX(30);
		this.isActive = true;
		this.el.removeClass( 'ludo-resize-handle-active');
		this.el.addClass('ludo-resize-handle-active');
		this.fireEvent('before', [this, this.view]);
		this.fireEvent('startResize');
	},

	setMinWidth:function(x){
		if(this.pos === 'left'){
			var el = this.view.getEl();
			this.dd.setMaxX(el.offsetLeft + el.width() - x);
		}else{
			this.dd.setMinX(this.view.getEl().position().left + x);
		}
	},

	setMaxWidth:function(x){
		var el = this.view.getEl();
		if(this.pos === 'right'){
			this.dd.setMaxX(el.position().left + x);
			console.log(x);
			
		}else{
			var pos = 0;
			if(this.layout.affectedSibling){
				pos = this.layout.affectedSibling.getEl().position().left + 10;
			}
			this.dd.setMinX(Math.max(pos, el.offsetLeft + el.width() - x));
		}
	},

	setMinHeight:function(y){
		if(this.pos === 'above'){
			var el = this.view.getEl();
			this.dd.setMaxY(el.position().top + el.height() - y);
		}else{
			this.dd.setMinY(this.view.getEl().position().top + y);
		}

	},

	setMaxHeight:function(y){
		var el = this.view.getEl();
		if(this.pos === 'below'){
			this.dd.setMaxY(el.position().top + y);
		}else{
			var pos = 10;
			if(this.layout.affectedSibling){
				pos = this.layout.affectedSibling.getEl().position().top + 10;
			}
			this.dd.setMinY(Math.max(pos, el.position().top + el.height() - y));
		}
	},

	endDrag:function(dragged, dd){
		this.el.removeClass( 'ludo-resize-handle-over');
		this.el.removeClass( 'ludo-resize-handle-active');
		var change = this.orientation === 'horizontal' ? dd.getDraggedX() : dd.getDraggedY();
		if(this.pos === 'left' || this.pos === 'above'){
			change *= -1;
		}
		this.fireEvent('resize', change);
		this.fireEvent('stopResize');
		this.isActive = false;
	},

	getEl:function(){
		return this.el;
	},

	addViewEvents:function () {
		this.view.addEvent('maximize', this.show.bind(this));
		this.view.addEvent('expand', this.show.bind(this));
		this.view.addEvent('minimize', this.hide.bind(this));
		this.view.addEvent('collapse', this.hide.bind(this));
		this.view.addEvent('hide', this.hide.bind(this));
		this.view.addEvent('show', this.show.bind(this));
	},

	show:function(){
		this.el.css('display', '');
		this.hidden = false;
	},

	hide:function(){
		this.hidden = true;
		this.el.css('display', 'none');
	},

	getWidth:function(){
		return this.hidden ? 0 : 5;
	},

	getHeight:function(){
		return this.hidden ? 0 : 5;
	},

	resize:function(config){
		this.el.css({
			left:'', top:'',right:'',bottom:''
		});


		if(config.width !== undefined && config.width > 0)this.el.css('width', config.width);
		if(config.height !== undefined && config.height > 0)this.el.css('height', (config.height - ludo.dom.getMBPH(this.el)));
		if(config.left !== undefined)this.el.css('left', config.left);
		if(config.top !== undefined)this.el.css('top', config.top);
		if(config.bottom !== undefined)this.el.css('bottom', config.bottom);
		if(config.right !== undefined)this.el.css('right', config.right);
	},

	getParent:function(){

	},
	setParentComponent:function(){

	},
	isVisible:function(){
		return !this.hidden;
	},
	isHidden:function(){
		return this.hidden;
	},

	hasChildren:function(){
		return false;
	},

	isFormElement:function(){
		return false;
	}
});/* ../ludojs/src/layout/base.js */
/**
* Base class for ludoJS layouts
 * @namespace ludo.layout
 * @class ludo.layout.Base
 */
ludo.layout.Base = new Class({
	Extends:Events,
	view:null,
	tabStrip:null,
	resizables:[],
	benchmarkTime:false,
	dependency:{},
	viewport:{
		top:0, left:0,
		width:0, height:0,
		bottom:0, right:0
	},
    resized:false,

	initialize:function (view) {
        this.id = String.uniqueID();
		this.view = view;
		if(view.getBody())this.onCreate();
	},

	onCreate:function () {
		if (this.view.layout.collapseBar) {
			this.addCollapseBars();
		}
	},
    /**f
    * Method executed when adding new child view to a layout
     * @function addChild
     * @param {ludo.View} child
     * @param {ludo.View} insertAt
     * @optional
     * @param {String} pos
     * @optional
     */
	addChild:function (child, insertAt, pos) {
        child = this.getValidChild(child);
		child = this.getNewComponent(child);
		var parentEl = this.getParentForNewChild(child);
		parentEl = $(parentEl);
		if (insertAt) {
			var children = [];
			for (var i = 0; i < this.view.children.length; i++) {
				if (pos == 'after') {
					children.push(this.view.children[i]);
					parentEl.append(this.view.children[i].getEl());
				}
				if (this.view.children[i].getId() == insertAt.getId()) {
					children.push(child);
					parentEl.append(child.getEl());
				}
				if (pos == 'before') {
					children.push(this.view.children[i]);
					parentEl.append(this.view.children[i].getEl());
				}
			}
			this.view.children = children;
		} else {
			this.view.children.push(child);
            var el = child.getEl();
            parentEl.append(el);
		}

		this.onNewChild(child);



		this.addChildEvents(child);
		/**
		 * Event fired by layout manager when a new child is added
		 * @event addChild
		 * @param {ludo.View} child
		 * @param {ludo.layout.Base} layout manager
		 */
		this.fireEvent('addChild', [child, this]);
		return child;
	},
    /**
    * Return parent DOM element for new child
     * @function getParentForNewChild
     * @protected
     */
	getParentForNewChild:function(){
		return $(this.view.els.body);
	},

	layoutProperties:['collapsible', 'collapsed'],

    getValidChild:function(child){
        return child;
    },

    /**
	 * Implementation in sub classes
	 * @function onNewChild
	 * @private
	 */
	onNewChild:function (child) {
		var keys = this.layoutProperties;
		for (var i = 0; i < keys.length; i++) {
			if (child.layout[keys[i]] === undefined && child[keys[i]] !== undefined) {
				child.layout[keys[i]] = child[keys[i]];
			}
		}
		if(child.layout.collapseTo !== undefined){
			var view = ludo.get(child.layout.collapseTo);
			if(view){
				var bar = view.getLayout().getCollapseBar(child.layout.collapsible);
				if(bar)bar.addView(child);
			}
		}
	},

	addChildEvents:function(){

	},
    firstResized : false,

	resizeChildren:function () {
        if(!this.firstResized){
            this.beforeFirstResize();
            this.firstResized = true;
        }
		if (this.benchmarkTime) {
			var start = new Date().getTime();
		}
		if (this.view.isHidden()) {
			return;
		}
		if (this.idLastDynamic === undefined) {
			this.setIdOfLastChildWithDynamicWeight();
		}

		this.storeViewPortSize();

		this.resize();
		if (this.benchmarkTime) {
			ludo.util.log("Time for resize(" + this.view.layout.type + "): " + (new Date().getTime() - start));
		}
	},

	hasBeenRendered:function(){
		return this.firstResized;
	},

	beforeFirstResize:function(){

    },

	storeViewPortSize:function () {
		this.viewport.absWidth = this.getAvailWidth();
		this.viewport.absHeight = this.getAvailHeight();
		this.viewport.width = this.getAvailWidth() - this.viewport.left - this.viewport.right;
		this.viewport.height = this.getAvailHeight() - this.viewport.top - this.viewport.bottom;
	},

	previousContentWidth:undefined,

	idLastDynamic:undefined,

	setIdOfLastChildWithDynamicWeight:function () {
		for (var i = this.view.children.length - 1; i >= 0; i--) {
			if (this.hasLayoutWeight(this.view.children[i])) {
				this.idLastDynamic = this.view.children[i].id;
				return;
			}
		}
		this.idLastDynamic = 'NA';
	},

	hasLayoutWeight:function (child) {
		return child.layout !== undefined && child.layout.weight !== undefined;
	},

	getNewComponent:function (config) {
		config.renderTo = this.view.getBody();
		config.type = config.type || this.view.cType;
		config.parentComponent = this.view;
		return ludo.factory.create(config);
	},

	isLastSibling:function (child) {
		var children = this.view.initialItemsObject;
		if (children.length) {
			return children[children.length - 1].id == child.id;
		} else {
			return this.view.children[this.view.children.length - 1].id == child.id;
		}
	},

	prepareView:function () {

	},

	resize:function () {
		var config = {};
		config.width = this.view.getBody().width();
		if (config.width < 0) {
			config.width = undefined;
		}
		for (var i = 0; i < this.view.children.length; i++) {
			this.view.children[i].resize(config);
		}
	},

	getAvailWidth:function () {
		return this.view.getBody().width();
	},

	getAvailHeight:function () {
		return this.view.getInnerHeightOfBody();
	},

	addCollapseBars:function () {
		var pos = this.view.layout.collapseBar;
		if (!ludo.util.isArray(pos))pos = [pos];
		for (var i = 0; i < pos.length; i++) {
			this.addChild(this.getCollapseBar(pos[i]));
		}
	},

	collapseBars:{},
	getCollapseBar:function (position) {
		position = position || 'left';
		if (this.collapseBars[position] === undefined) {
			var bar = this.collapseBars[position] = new ludo.layout.CollapseBar({
				position:position,
				parentComponent:this.view,
				parentLayout:this.view.layout,
				listeners:{
					'show':this.toggleCollapseBar.bind(this),
					'hide':this.toggleCollapseBar.bind(this)
				}
			});
			this.updateViewport(bar.getChangedViewport());
		}
		return this.collapseBars[position];
	},

	toggleCollapseBar:function (bar) {
		this.updateViewport(bar.getChangedViewport());
		this.resize();
	},
    /**
     * Update viewport properties, coordinates of DHTML Container for child views, i.e. body of parent view
     * @function updateViewport
     * @param {Object} c
     */
	updateViewport:function (c) {

		this.viewport[c.key] = c.value;
	},

	createRenderer:function(){
		if(this.renderer === undefined){
			this.renderer = this.dependency['renderer'] = new ludo.layout.Renderer({
				view:this.view
			});
		}
		return this.renderer;
	},

	getRenderer:function(){
		return this.renderer ? this.renderer : this.createRenderer();
	},

    /**
     * Executed when a child is hidden. It set's the internal layout properties width and height to 0(zero)
     * @function hideChild
     * @param {ludo.View} child
     * @private
     */
    hideChild:function(child){
        this.setTemporarySize(child, {
            width:0,height:0
        });
    },

    /**
     * Executed when a child is minimized. It set's temporary width or properties
     * @function minimize
     * @param {ludo.View} child
     * @param {Object} newSize
     * @protected
     */
    minimize:function(child, newSize){
        this.setTemporarySize(child, newSize);
        this.resize();
    },

    /**
     * Store temporary size when a child is minimized or hidden
     * @function setTemporarySize
     * @param {ludo.View} child
     * @param {Object} newSize
     * @protected
     */
    setTemporarySize:function(child, newSize){
        if(newSize.width !== undefined){
            child.layout.cached_width = child.layout.width;
            child.layout.width = newSize.width;
        }else{
            child.layout.cached_height = child.layout.height;
            child.layout.height = newSize.height;
        }
    },
    /**
     * Clear temporary width or height values. This method is executed when a child
     * is shown or maximized
     * @function clearTemporaryValues
     * @param {ludo.View} child
     * @protected
     */
    clearTemporaryValues:function(child){
        if(child.layout.cached_width !== undefined)child.layout.width = child.layout.cached_width;
        if(child.layout.cached_height !== undefined)child.layout.height = child.layout.cached_height;
        child.layout.cached_width = undefined;
        child.layout.cached_height = undefined;
        this.resize();
    },

	getWidthOf:function (child) {
		return child.layout.width;
	},

	getHeightOf:function (child) {
		return child.layout.height;
	}
});/* ../ludojs/src/layout/factory.js */
/**
 * Factory class for layout managers
 * @namespace layout
 * @class Factory
 */
ludo.layout.Factory = new Class({

    /**
     * Returns layout manager, a layout.Base or subclass
	 * @function getManager
     * @param {ludo.View} view
     * @return {ludo.layout.Base} manager
     */
	getManager:function(view){
		return new ludo.layout[this.getLayoutClass(view)](view);
	},

    /**
     * Returns correct name of layout class
     * @function getLayoutClass
     * @param {ludo.View} view
     * @return {String} className
     * @private
     */
	getLayoutClass:function(view){
		if(!view.layout || !view.layout.type)return 'Base';

		switch(view.layout.type.toLowerCase()){
			case "accordion":
				return "Accordion";
			case "table":
				return "Table";
            case 'slidein':
                return 'SlideIn';
			case 'relative':
				return 'Relative';
			case 'fill':
				return 'Fill';
			case 'card':
				return 'Card';
			case 'grid':
				return 'Grid';
            case 'menu':
                return ['Menu', (view.layout.orientation && view.layout.orientation.toLowerCase()=='horizontal') ? 'Horizontal' : 'Vertical'].join('');
			case 'tabs':
			case 'tab':
				return 'Tab';
			case 'column':
			case 'cols':
				return 'LinearHorizontal';
			case 'popup':
				return 'Popup';
			case 'canvas':
				return 'Canvas';
			case 'rows':
			case 'row':
				return 'LinearVertical';
			case 'linear':
				return ['Linear', (view.layout.orientation && view.layout.orientation.toLowerCase()=='horizontal') ? 'Horizontal' : 'Vertical'].join('');
			default:
				return 'Base';
		}
	},

    /**
     * Returns valid layout configuration for a view
     * @function getValidLayoutObject
     * @param {ludo.View} view
     * @param {Object} config
     * @return {Object}
     * @private
     */
	getValidLayoutObject:function(view, config){

		view.layout = this.toLayoutObject(view.layout);
		config.layout = this.toLayoutObject(config.layout);

		if(!this.hasLayoutProperties(view, config)){
			return {};
		}

		var ret = this.getMergedLayout(view.layout, config.layout);


		if (typeof ret === 'string') {
			ret = { type:ret }
		}

		ret = this.transferFromView(view, config, ret);

		if(ret.left === undefined && ret.x !== undefined)ret.left = ret.x;
		if(ret.top === undefined && ret.y !== undefined)ret.top = ret.y;

		if (ret.aspectRatio) {
			if (ret.width) {
				ret.height = Math.round(ret.width / ret.aspectRatio);
			} else if (ret.height) {
				ret.width = Math.round(ret.height * ret.aspectRatio);
			}
		}
		
        ret.type = ret.type || 'Base';
		return ret;
	},

	toLayoutObject:function(obj){
		if(!obj)return {};
		if(ludo.util.isString(obj))return { type : obj };
		return obj;
	},

	hasLayoutProperties:function(view, config){
		if(view.layout || config.layout)return true;
		var keys = ['left','top','height','width','weight','x','y'];
		for(var i=0;i<keys.length;i++){
			if(config[keys[i]] !== undefined || view[keys[i]] !== undefined)return true;
		}
		return false;
	},

	transferFromView:function(view, config, ret){
		var keys = ['left','top','width','height','weight','x','y'];
		for(var i=0;i<keys.length;i++){
			if(ret[keys[i]] === undefined && (config[keys[i]] !== undefined || view[keys[i]] !== undefined))ret[keys[i]] = config[keys[i]] || view[keys[i]];
            view[keys[i]] = undefined;
		}
		return ret;
	},

    /**
     * Returned merged layout object, i.e. layout defind on HTML page merged
     * with internal layout defined in class
     * @function getMergedLayout
     * @param {Object} layout
     * @param {Object} mergeWith
     * @return {Object}
     * @private
     */
	getMergedLayout:function(layout, mergeWith){
		for(var key in mergeWith){
			if(mergeWith.hasOwnProperty(key)){
				layout[key] = mergeWith[key];
			}
		}
		return layout;
	}
});

ludo.layoutFactory = new ludo.layout.Factory();/* ../ludojs/src/data-source/base.js */
/**
 * Base class for data sources
 * @namespace dataSource
 * @class ludo.dataSource.Base
 * @augments ludo.Core
 */
ludo.dataSource.Base = new Class({
	Extends:ludo.Core,
	/**
	 * Accept only one data-source of this type. You also need to specify the
	 * "type" property which will be used as key in the global SINGELTON cache
	 * By using singletons, you don't have to do multiple requests to the server
	 * @attribute singleton
	 * @type {Boolean}
	 */
	singleton:false,
	/**
	 * Remote url. If not set, global url will be used
	 * @attribute url
	 * @type {String}
	 * @optional
	 */
	url:undefined,
	/**
	 * Remote postData sent with request, example:
	 * postData: { getUsers: 1 }
	 * @attribute postData
	 * @type {Object}
	 */
	postData:{},

	data:undefined,

	/**
	 * Load data from external source on creation
	 * @attribute autoload
	 * @type {Boolean}
	 * @default true
	 */
	autoload:true,
	/**
	 * Name of resource to request on the server
	 * @config resource
	 * @type String
	 * @default ''
	 */
	resource:'',
	/**
	 * Name of service to request on the server
	 * @config service
	 * @type String
	 * @default ''
	 */
	service:'',
	/**
	 Array of arguments to send to resource on server
	 @config arguments
	 @type Array
	 @default ''
	 Here are some examples:

	 Create a data source for server resource "Person", service name "load" and id : "1". You will then set these config properties:

	 @example
		 "resource": "Person",
		 "service": "load",
		 "arguments": [1]
	 */
	arguments:undefined,

	inLoadMode:false,

	/**
	 Config of shim to show when content is being loaded form server. This config
	 object supports two properties, "renderTo" and "txt". renderTo is optional
	 and specifies where to render the shim. Default is inside body of parent
	 view.
	 "txt" specifies which text to display inside the shim. "txt" can be
	 either a string or a function returning a string.
	 @config {Object} shim
	 @example
	 	shim:{
			renderTo:ludo.get('myView').getBody(),
			txt : 'Loading content. Please wait'
	 	}
	 renderTo is optional. Example where "txt" is defined as function:
	 @example
	 	shim:{
	 		"txt": function(){
	 			var val = ludo.get('searchField).getValue();
	 			return val.length ? 'Searching for ' + val : 'Searching';
	 		}
	 	}
	 */
	shim:undefined,

	ludoConfig:function (config) {
		this.parent(config);
		this.setConfigParams(config, ['url', 'postData', 'autoload', 'resource', 'service', 'arguments', 'data', 'shim']);

		if (this.arguments && !ludo.util.isArray(this.arguments)) {
			this.arguments = [this.arguments];
		}

	},

	ludoEvents:function () {
		if (this.autoload)this.load();
	},

	/**
	 * Send a new request
	 * @function sendRequest
	 * @param {String} service
	 * @param {Array} arguments
	 * @optional
	 * @param {Object} data
	 * @optional
	 */
	sendRequest:function (service, arguments, data) {
		this.arguments = arguments;
		this.beforeLoad();
		this.requestHandler().send(service, arguments, data);
	},
	/**
	 * Has data loaded from server
	 * @function hasData
	 * @return {Boolean}
	 */
	hasData:function () {
		return (this.data !== undefined);
	},
	/**
	 * Return data loaded from server
	 * @function getData
	 * @return object data from server, example: { success:true, data:[]}
	 */
	getData:function () {
		return this.data;
	},


	setPostParam:function (param, value) {
		this.postData[param] = value;
	},

	/**
	 * Return data-source type(HTML or JSON)
	 * @function getSourceType
	 * @return string source type
	 */
	getSourceType:function () {
		return 'JSON';
	},

	beforeLoad:function () {
		this.inLoadMode = true;
		this.fireEvent('beforeload');
	},

	load:function () {

	},

	/**
	 * Load content from a specific url
	 * @function loadUrl
	 * @param url
	 */
	loadUrl:function (url) {
		this.url = url;
		this._request = undefined;
		this.load();
	},

	loadComplete:function () {
		this.inLoadMode = false;
	},

	isLoading:function () {
		return this.inLoadMode;
	},

	getPostData:function () {
		return this.postData;
	}
});/* ../ludojs/src/data-source/json.js */
/**
 * Class for remote data source.
 * @namespace dataSource
 * @class JSON
 * @augments dataSource.Base
 */
ludo.dataSource.JSON = new Class({
    Extends:ludo.dataSource.Base,
    type:'dataSource.JSON',

    /**
     * Reload data from server
     * Components using this data-source will be automatically updated
     * @function load
     * @return void
     */
    load:function () {
        if(!this.url && !this.resource)return;
        this.parent();
        this.sendRequest(this.service, this.arguments, this.getPostData());
    },

    _request:undefined,
	requestHandler:function(){
        if(this._request === undefined){
            this._request = new ludo.remote.JSON({
                url:this.url,
                resource: this.resource,
				shim:this.shim,
                listeners:{
                    "beforeload": function(request){
                        this.fireEvent("beforeload", request);
                    },
                    "success":function (request) {
                        this.loadComplete(request.getResponseData(), request.getResponse());
                    }.bind(this),
                    "failure":function (request) {
                        /**
                         * Event fired when success parameter in response from server is false
                         * @event failure
                         * @param {Object} JSON response from server. Error message should be in the "message" property
                         * @param {ludo.dataSource.JSON} this
                         *
                         */
                        this.fireEvent('failure', [request.getResponse(), this]);
                    }.bind(this),
                    "error":function (request) {
                        /**
                         * Server error event. Fired when the server didn't handle the request
                         * @event servererror
                         * @param {String} error text
                         * @param {String} error message
                         */
                        this.fireEvent('servererror', [request.getResponseMessage(), request.getResponseCode()]);
                    }.bind(this)
                }
            });

        }
        return this._request;
    },

    /**
     * Update data source with new date and trigger events "parseData",
     * @param {Array} data
     */
    setData:function(data){
        this.loadComplete(data);
    },


    loadComplete:function (data) {
        
		this.parent();
		var firstLoad = !this.data;
		this.data = data;
        this.fireEvent('parsedata');
        this.fireEvent('load', [this.data, this]);

		if(firstLoad){
			this.fireEvent('firstLoad', [this.data, this]);
		}
    }
});

ludo.factory.registerClass('dataSource.JSON', ludo.dataSource.JSON);/* ../ludojs/src/layout/renderer.js */
/**
 * @namespace layout
 * @class Renderer
 */
ludo.layout.Renderer = new Class({
	// TODO Support top and left resize of center aligned dialogs
	// TODO store inner height and width of views(body) for fast lookup
	view:undefined,
	options:['width', 'height',
		'rightOf', 'leftOf', 'below', 'above',
		'sameHeightAs', 'sameWidthAs',
		'offsetWidth', 'offsetHeight',
        'rightOrLeftOf', 'leftOrRightOf',
        'alignLeft', 'alignRight', 'alignTop', 'alignBottom',
		'centerIn',
		'left', 'top',
		'offsetX', 'offsetY', 'fitVerticalViewPort'],
	fn:undefined,
	viewport:{
		x:0, y:0, width:0, height:0
	},
	coordinates:{
		left:undefined,
		right:undefined,
		above:undefined,
		below:undefined,
		width:undefined,
		height:undefined
	},
	lastCoordinates:{},

	initialize:function (config) {

		this.view = config.view;
		this.fixReferences();
		this.setDefaultProperties();
		this.view.addEvent('show', this.resize.bind(this));
		ludo.dom.clearCache();
		this.addResizeEvent();
	},

	fixReferences:function () {
		var el;
		var hasReferences = false;

		for (var i = 0; i < this.options.length; i++) {
			var key = this.options[i];
			switch (key) {
				case 'offsetX':
				case 'offsetY':
				case 'width':
				case 'height':
				case 'left':
				case 'top':
				case 'fitVerticalViewPort':
					break;
				default:
					el = undefined;
					if (this.view.layout[key] !== undefined) {
						hasReferences = true;
						var val = this.view.layout[key];

						if (typeof val === 'string') {
							var view;
							if (val === 'parent') {
								view = this.view.getParent();
							} else {
								view = ludo.get(val);
							}
							if (view) {
								el = view.getEl();
								view.addEvent('resize', this.clearFn.bind(this));
							} else {
								el = document.id(val);
							}
						} else {
							if (val.getEl !== undefined) {
								el = val.getEl();
								val.addEvent('resize', this.clearFn.bind(this));
							} else {
								el = $(val);
							}
						}
						if (el)this.view.layout[key] = el; else this.view.layout[key] = undefined;
					}
			}
		}
		if (hasReferences)this.view.getEl().css('position', 'absolute');
	},

	setDefaultProperties:function () {
        // TODO is this necessary ?
		this.view.layout.width = this.view.layout.width || 'matchParent';
		this.view.layout.height = this.view.layout.height || 'matchParent';
	},

	addResizeEvent:function () {
		// todo no resize should be done for absolute positioned views with a width. refactor the next line
		if (this.view.isWindow)return;
		var node = this.view.getEl().parent();
		if (!node || !node.prop("tagName"))return;
		if (node.prop("tagName").toLowerCase() !== 'body') {
			node = $(node);
		} else {
			node = $(window);
		}
		node.on('resize', this.resize.bind(this));
	},

	buildResizeFn:function () {
		var parent = this.view.getEl().parent();
		if (!parent)this.fn = function () {};
		var fns = [];
		var fnNames = [];
		for (var i = 0; i < this.options.length; i++) {
			if (this.view.layout[this.options[i]] !== undefined) {
				fns.push(this.getFnFor(this.options[i], this.view.layout[this.options[i]]));
				fnNames.push(this.options[i]);
			}
		}
		this.fn = function () {
			for (i = 0; i < fns.length; i++) {
				fns[i].call(this, this.view, this);
			}
		}
	},

	getFnFor:function (option, value) {
		var c = this.coordinates;



		switch (option) {

			case 'height':
				if (value === 'matchParent') {
					return function (view, renderer) {
						c.height = renderer.viewport.height;
					}
				}
				if (value === 'wrap') {
					var s = ludo.dom.getWrappedSizeOfView(this.view);
                    // TODO test out layout in order to check that the line below is working.
                    this.view.layout.height = s.y;
					return function () {
						c.height = s.y;
					}

				}
				if (value.indexOf !== undefined && value.indexOf('%') > 0) {
					value = parseInt(value);
					return function (view, renderer) {
						c.height = (renderer.viewport.height * value / 100)
					}
				}
				return function () {
					c.height = this.view.layout[option];
				}.bind(this);
			case 'width':
				if (value === 'matchParent') {
					return function (view, renderer) {
						c.width = renderer.viewport.width;
					}
				}
				if (value === 'wrap') {
					var size = ludo.dom.getWrappedSizeOfView(this.view);
                    this.view.layout.width = size.x;
					return function () {
						c.width = size.x;
					}
				}
				if (value.indexOf !== undefined && value.indexOf('%') > 0) {
					value = parseInt(value);
					return function (view, renderer) {
						c.width = (renderer.viewport.width * value / 100)
					}
				}
				return function () {
					c.width = this.view.layout[option];
                }.bind(this);
			case 'rightOf':
				return function () {
					c.left = value.offset().left + value.outerWidth();
				};
			case 'leftOf':
				return function () {
                    c.left = value.offset().left - c.width;
				};
			case 'leftOrRightOf':
				return function () {
					var x = value.offset().left - c.width;
					if (x - c.width < 0) {
						x += (value.outerWidth() + c.width);
					}
					c.left = x;
				};
			case 'rightOrLeftOf' :
				return function (view, renderer) {
					var val = value.offset().left + value.outerWidth();
					if (val + c.width > renderer.viewport.width) {
						val -= (value.outerWidth() + c.width);
					}
					c.left = val;
				};
			case 'above':
				return function (view, renderer) {
                    c.bottom = renderer.viewport.height - value.offset().top;
				};
			case 'below':
				return function () {
					c.top = value.offset().top + value.height();
				};
			case 'alignLeft':
				return function () {
					c.left = value.offset().left;
				};
			case 'alignTop':
				return function () {
					c.top = value.offset().top;
				};
			case 'alignRight':
				return function () {

					c.left = value.offset().left + value.outerWidth() - c.width;
				};
			case 'alignBottom':
				return function () {
					c.top = value.offset().top + value.height() - c.height;
				};
			case 'offsetX' :
				return function () {
					c.left = c.left ? c.left + value : value;
				};
			case 'offsetY':
				return function () {
					c.top = c.top ? c.top + value : value;
				};
			case 'sameHeightAs':
				return function () {
					c.height = value.height();
				};
			case 'offsetWidth' :
				return function () {
					c.width = c.width + value;
				};
			case 'offsetHeight':
				return function () {
					c.height = c.height + value;
				};
			case 'centerIn':
				return function () {
					var pos = value.offset();
					c.top = (pos.top + value.height()) / 2 - (c.height / 2);
					c.left = (pos.left + value.outerWidth()) / 2 - (c.width / 2);
				};
			case 'centerHorizontalIn':
				return function () {
					c.left = (value.offset().left + value.outerWidth()) / 2 - (c.width / 2);
				};
			case 'centerVerticalIn':
				return function () {
					c.top = (value.offset().top + value.height()) / 2 - (c.height / 2);
				};
			case 'sameWidthAs':
				return function () {
					c.width = value.outerWidth();
				};
			case 'x':
			case 'left':
				return function () {
					c.left = this.view.layout[option];
                }.bind(this);
			case 'y':
			case 'top':
				return function () {
					c.top = this.view.layout[option];
                }.bind(this);
			case 'fitVerticalViewPort':
				return function (view, renderer) {
					if (c.height) {
						var pos = c.top !== undefined ? c.top : view.getEl().offset().top;
						if (pos + c.height > renderer.viewport.height - 2) {
							c.top = renderer.viewport.height - c.height - 2;
						}
					}
				};
			default:
				return function () {
			};
		}
	},

	posKeys:['left', 'right', 'top', 'bottom'],

	clearFn:function () {
		this.fn = undefined;
	},

	resize:function () {
		if (this.view.isHidden())return;
		if (this.fn === undefined)this.buildResizeFn();
		this.setViewport();

		this.fn.call(this);

		var c = this.coordinates;

		this.view.resize(c);
		
        if(c['bottom'])c['top'] = undefined;
        if(c['right'])c['left'] = undefined;

		for (var i = 0; i < this.posKeys.length; i++) {
			var k = this.posKeys[i];
			if (this.coordinates[k] !== undefined && this.coordinates[k] !== this.lastCoordinates[k])this.view.getEl().css(k, c[k]);
		}
		this.lastCoordinates = Object.clone(c);
	},

	resizeChildren:function(){
		if (this.view.children.length > 0)this.view.getLayout().resizeChildren();
	},

	setViewport:function () {
		var el = this.view.getEl().parent();
		if (!el)return;
		this.viewport.width = el.outerWidth() - ludo.dom.getPW(el) - ludo.dom.getBW(el);
		this.viewport.height = el.height() - ludo.dom.getPH(el) - ludo.dom.getBH(el);
	},

	getMinWidth:function () {
		return this.view.layout.minWidth || 5;
	},

	getMinHeight:function () {
		return this.view.layout.minHeight || 5;
	},

	getMaxHeight:function () {
		return this.view.layout.maxHeight || 5000;
	},

	getMaxWidth:function () {
		return this.view.layout.maxWidth || 5000;
	},

	setPosition:function (x, y) {
		if (x !== undefined && x >= 0) {
			this.coordinates.left = this.view.layout.left = x;
			this.view.getEl().css('left', x);
			this.lastCoordinates.left = x;
		}
		if (y !== undefined && y >= 0) {
			this.coordinates.top = this.view.layout.top = y;
			this.view.getEl().css('top', y);
			this.lastCoordinates.top = y;
		}
	},

	setSize:function (config) {

		if (config.left)this.coordinates.left = this.view.layout.left = config.left;
		if (config.top)this.coordinates.top = this.view.layout.top = config.top;
		if (config.width)this.view.layout.width = this.coordinates.width = config.width;
		if (config.height)this.view.layout.height = this.coordinates.height = config.height;
		this.resize();
	},

	position:function () {
		return {
			x:this.coordinates.left,
			y:this.coordinates.top
		};
	},

	getSize:function () {
		return {
			x:this.coordinates.width,
			y:this.coordinates.height
		}
	},

	setValue:function(key, value){
		this.view.layout[key] = value;
	},

	getValue:function(key){
		return this.view.layout[key];
	}
});/* ../ludojs/src/tpl/parser.js */
/**
 * JSON Content compiler. This component will return compiled JSON for a view. It will
 * be created on demand by a ludo.View. If you want to create your own parser, extend this
 * class and
 * @namespace tpl
 * @class Parser
 * @augments Core
 */
ludo.tpl.Parser = new Class({
    Extends:ludo.Core,
    type:'tpl.Parser',
    compiledTpl:undefined,

    /**
     * Get compiled string
	 * @function getCompiled
     * @param {Object} records
     * @param {String} tpl
     * @return {Array} string items
     */
    getCompiled:function (records, tpl) {
        if (!ludo.util.isArray(records)) {
            records = [records];
        }
        var ret = [];

        tpl = this.getCompiledTpl(tpl);

        for (var i = 0; i < records.length; i++) {
            var content = [];
            for(var j = 0; j< tpl.length;j++){
                var k = tpl[j]["key"];
                if(k) {
                    content.push(records[i][k] ? records[i][k] : "");
                }else{
                    content.push(tpl[j]);
                }
            }
            ret.push(content.join(""));
        }
        return ret;
    },

    getCompiledTpl:function(tpl){
        if(!this.compiledTpl){
            this.compiledTpl = [];
            var pos = tpl.indexOf('{');
            var end = 0;

            while(pos >=0 && end != -1){
                if(pos > end){
                    var start = end === 0 ? end : end+1;
                    var len = end === 0 ? pos-end : pos-end-1;
                    this.compiledTpl.push(tpl.substr(start,len));
                }

                end = tpl.indexOf('}', pos);

                if(end != -1){
                    this.compiledTpl.push({
                        key : tpl.substr(pos, end-pos).replace(/[{}"]/g,"")
                    });
                }
                pos = tpl.indexOf('{', end);
            }

            if(end != -1 && end < tpl.length){
                this.compiledTpl.push(tpl.substr(end+1));
            }

        }
        return this.compiledTpl;
    },

    asString:function(data, tpl){
        return this.getCompiled(data, tpl).join('');
    },

    getTplValue:function (key, value) {
        return value;
    }
});/* ../ludojs/src/dom.js */
/**
 * Class/Object with DOM utility methods.
 * @class ludo.dom
 *
 */
ludo.dom = {
	cache:{
		PW:{}, PH:{},
		BW:{}, BH:{},
		MW:{}, MH:{}
	},
	/**
	 * Return Margin width (left and right) of DOM element
	 * Once retrieved, it will be cached for later lookup. Cache
	 * can be cleared by calling clearCacheStyles
	 * @function getMW
	 * @param {Object} el
	 */
	getMW:function (el) {
		if (!el.id)el.id = 'el-' + String.uniqueID();
		if (ludo.dom.cache.MW[el.id] === undefined) {
			ludo.dom.cache.MW[el.id] = ludo.dom.getNumericStyle(el, 'margin-left') + ludo.dom.getNumericStyle(el, 'margin-right')
		}
		return ludo.dom.cache.MW[el.id];
	},

	/**
	 * Return Border width (left and right) of DOM element
	 * Once retrieved, it will be cached for later lookup. Cache
	 * can be cleared by calling clearCacheStyles
	 * @function getBW
	 * @param {Object} el DOMElement or id of DOMElement
	 */
	getBW:function (el) {
		if (!el.id)el.id = 'el-' + String.uniqueID();
		if (ludo.dom.cache.BW[el.id] === undefined) {
			ludo.dom.cache.BW[el.id] = ludo.dom.getNumericStyle(el, 'border-left-width') + ludo.dom.getNumericStyle(el, 'border-right-width');
		}
		return ludo.dom.cache.BW[el.id];
	},
	/**
	 * Return Padding Width (left and right) of DOM element
	 * Once retrieved, it will be cached for later lookup. Cache
	 * can be cleared by calling clearCacheStyles
	 * @function getPW
	 * @param {Object} el
	 */
	getPW:function (el) {
		if (!el.id)el.id = 'el-' + String.uniqueID();
		if (ludo.dom.cache.PW[el.id] === undefined) {
			ludo.dom.cache.PW[el.id] = ludo.dom.getNumericStyle(el, 'padding-left') + ludo.dom.getNumericStyle(el, 'padding-right');
		}
		return ludo.dom.cache.PW[el.id];

	},
	/**
	 * Return Margin height (top and bottom) of DOM element
	 * Once retrieved, it will be cached for later lookup. Cache
	 * can be cleared by calling clearCacheStyles
	 * @function getMH
	 * @param {Object} el
	 */
	getMH:function (el) {
		this.addId(el);
		var id = el.attr("id");
		if (ludo.dom.cache.MH[id] === undefined) {
			ludo.dom.cache.MH[id] = ludo.dom.getNumericStyle(el, 'margin-top') + ludo.dom.getNumericStyle(el, 'margin-bottom')
		}
		return ludo.dom.cache.MH[id];

	},
	/**
	 * Return Border height (top and bottom) of DOM element
	 * Once retrieved, it will be cached for later lookup. Cache
	 * can be cleared by calling clearCacheStyles
	 * @function getBH
	 * @param {Object} el
	 */
	getBH:function (el) {
		this.addId(el);
		var id = el.attr("id");
		if (ludo.dom.cache.BH[id] === undefined) {
			ludo.dom.cache.BH[id] = ludo.dom.getNumericStyle(el, 'border-top-width') + ludo.dom.getNumericStyle(el, 'border-bottom-width');
		}
		return ludo.dom.cache.BH[id];
	},
	/**
	 * Return Padding height (top and bottom) of DOM element
	 * Once retrieved, it will be cached for later lookup. Cache
	 * can be cleared by calling clearCacheStyles
	 * @function getPH
	 * @param {Object} el DOMElement or id of DOMElement
	 */
	getPH:function (el) {
		this.addId(el);
		var id = el.attr("id");
		if (ludo.dom.cache.PH[id] === undefined) {
			ludo.dom.cache.PH[id] = ludo.dom.getNumericStyle(el, 'padding-top') + ludo.dom.getNumericStyle(el, 'padding-bottom');
		}
		return ludo.dom.cache.PH[id];
	},
	getMBPW:function (el) {
		return ludo.dom.getPW(el) + ludo.dom.getMW(el) + ludo.dom.getBW(el);
	},
	getMBPH:function (el) {
		return ludo.dom.getPH(el) + ludo.dom.getMH(el) + ludo.dom.getBH(el);
	},

	addId:function(el){
		if(!el.attr("id"))el.attr("id", String.uniqueID());
	},

	/**
	 * @function clearCacheStyles
	 * Clear cached padding,border and margins.
	 */
	clearCache:function () {
		ludo.dom.cache = {
			PW:{}, PH:{},
			BW:{}, BH:{},
			MW:{}, MH:{}
		};
	},

	/**
	 * Return numeric style value,
	 * @function getNumericStyle
	 * @private
	 * @param {Object} el
	 * @param {String} style
	 */
	getNumericStyle:function (el, style) {

		if (!el || !style || !el.css)return 0;
		var val = el.css(style);
		return val && val!='thin' && val!='auto' && val!='medium' ? parseInt(val) : 0;
	},

	isInFamilies:function (el, ids) {
		for (var i = 0; i < ids.length; i++) {
			if (ludo.dom.isInFamily(el, ids[i]))return true;
		}
		return false;
	},

	isInFamily:function (el, id) {
		el = $(el);
		if (el.attr("id") === id)return true;
		return el.parent('#' + id);
	},

	addClass:function (el, className) {
		console.info("Use of deprecated ludo.dom.addClass");
		console.trace();
		if (el && !this.hasClass(el, className)) {
			if(el.attr != undefined){
				el.addClass(className);
			}else{
				el.className = el.className ? el.className + ' ' + className : className;
			}
		}
	},

	hasClass:function (el, className) {
		console.info("use of deprecated ludo.dom.hasClass");
		console.trace();
		if(el.attr != undefined)return el.hasClass(className);
		var search = el.attr != undefined ? el.attr("class") : el.className;
		return el && search ? search.split(/\s/g).indexOf(className) > -1 : false;
	},

	removeClass:function (el, className) {
		console.info("use of deprecated ludo.dom.removeClass");
		console.trace();
		el.removeClass(className);
	},

	getParent:function (el, selector) {
		el = el.parentNode;
		while (el && !ludo.dom.hasClass(el, selector))el = el.parentNode;
		return el;
	},

	scrollIntoView:function (domNode, view) {
		var c = view.getEl();
		var el = view.getBody();
		var viewHeight = c.offsetHeight - ludo.dom.getPH(c) - ludo.dom.getBH(c) - ludo.dom.getMBPH(el);

		var pos = domNode.getPosition(el).y;

		var pxBeneathBottomEdge = (pos + 20) - (c.scrollTop + viewHeight);
		if (pxBeneathBottomEdge > 0) {
			el.scrollTop += pxBeneathBottomEdge;
		}

        var pxAboveTopEdge = c.scrollTop - pos;
		if (pxAboveTopEdge > 0) {
			el.scrollTop -= pxAboveTopEdge;
		}
	},

	size:function(el){
		return {
			x: el.width(), y: el.height()
		}
	},

	getInnerWidthOf:function (el) {
		console.warn("Use of deprecated getInnerWidthOf");
		console.trace();
		return el.width();

	},

	getInnerHeightOf:function (el) {
		if (el.style.height && el.style.height.indexOf('%') == -1) {
			return ludo.dom.getNumericStyle(el, 'height');
		}
		return el.offsetHeight - ludo.dom.getPH(el) - ludo.dom.getBH(el);
	},

	getTotalWidthOf:function (el) {
		return el.offsetWidth + ludo.dom.getMW(el);
	},

	getWrappedSizeOfView:function (view) {

		var el = view.getEl();
		var b = view.getBody();
		b.css('position', 'absolute');

		var width = b.width();
		b.css('position', 'relative');
		var height = b.height();
		

		return {
			x:width + ludo.dom.getMBPW(b) + ludo.dom.getMBPW(el),
			y:height + ludo.dom.getMBPH(b) + ludo.dom.getMBPH(el) + (view.getHeightOfTitleBar ? view.getHeightOfTitleBar() : 0)
		}
	},

	/**
	 * Return measured width of a View
	 * @function getMeasuredWidth
	 * @param {ludo.View} view
	 * @return {Number}
	 */
	getMeasuredWidth:function (view) {
		var el = view.getBody();
		var size = el.measure(function () {
			return this.getSize();
		});
		return size.x + ludo.dom.getMW(el);
	},

    create:function(node){
		console.info("use of deprecated ludo.dom.create");
		console.trace();
        var el = $('<' + (node.tag || 'div') + '>');
        if(node.cls)el.addClass(node.cls);
        if(node.renderTo)$(node.renderTo).append(el);
        if(node.css){
			el.css(node.css);
          }
        if(node.id)el.attr("id", node.id);
        if(node.html)el.html(node.html);
        return el;

    }
};/* ../ludojs/src/view/shim.js */
/**
 * Render a shim
 * @namespace view
 * @class Shim
 */
ludo.view.Shim = new Class({
    txt:'Loading content...',
    el:undefined,
    shim:undefined,
    renderTo:undefined,

    initialize:function (config) {
        if (config.txt)this.txt = config.txt;
        this.renderTo = config.renderTo;
    },

    getEl:function () {
        if (this.el === undefined) {
            this.el = $('<div class="ludo-shim-loading" style="display:none">' + this.getText(this.txt) + "</div>");
            this.getRenderTo().append(this.el);
        }
        return this.el;
    },

    getShim:function () {
        if (this.shim === undefined) {
			if(ludo.util.isString(this.renderTo))this.renderTo = ludo.get(this.renderTo).getEl();
            this.shim = $('<div class="ludo-loader-shim" style="display:none"></div>');
            this.getRenderTo().append(this.shim);

        }
        return this.shim;
    },

	getRenderTo:function(){
		if(ludo.util.isString(this.renderTo)){
			var view = ludo.get(this.renderTo);
			if(!view)return undefined;
			this.renderTo = ludo.get(this.renderTo).getEl();
		}
		return this.renderTo;
	},

    show:function (txt) {
		this.getEl().html(this.getText(( txt && !ludo.util.isObject(txt) ) ? txt : this.txt));
        this.css('');
		this.resizeShim();
    },

	resizeShim:function(){
		var span = $(this.el).find('span');
		var width = (span.width() + 5);
		this.el.css('width',  width + 'px');
		this.el.css('marginLeft',  (Math.round(width/2) * -1) + 'px');
	},

	getText:function(txt){
		txt = ludo.util.isFunction(txt) ? txt.call() : txt ? txt : '';
		return '<span>' + txt + '</span>';
	},

    hide:function () {
        this.css('none');
    },
    css:function (d) {
        this.getShim().css('display',  d);
        this.getEl().css('display',  d === '' && this.txt ? '' : 'none');
    }
});/* ../ludojs/src/remote/shim.js */
ludo.remote.Shim = new Class({
    Extends:ludo.view.Shim,

    initialize:function (config) {
        this.parent(config);
        this.addShowHideEvents(config.remoteObj);
    },

    addShowHideEvents:function (obj) {
        if (obj) {
			obj.addEvents({
                'start':this.show.bind(this),
                'complete':this.hide.bind(this)
            });
        }
    }
});/* ../ludojs/src/view.js */
/**
 A basic ludoJS view. When rendered on a Web page, a View is made out of two &lt;div> elements, one parent and one child(called body).
 @example {@lang XML}
 <!--  A basic rendered ludoJS view -->
 <div class="ludo-view-container">
 	<div class="ludo-body"></div>
 </div>
 @namespace ludo
 @class ludo.View
 @augments ludo.Core
 @param {Object} config
 @param {String} config.bodyCls Additional css classes to assign to the body &lt;div>, example: bodyCls: "classname1 classname2"
 @param {Array} config.children An array of config objects for the child views. Example: children:[{ html: "child 1", layout:{ height: 100 }}, { html: "Child 2", layout: { height:200 } }]. See <a href="../demo/view/children.php" onclick="var w = window.open(this.href);return false">Demo</a>
 @param {String} config.cls Additional css classes to assign to the views &lt;div>, example: cls: "classname1 classname2"
 @param {Object} config.elCss Specific css rules to apply to the View, @example: elCss:{ border: '1px solid #ddd' } for a gray border
 @param {Object} config.css Specific css rules to apply to the View's body &lt;div, @example: css:{ 'background-color': '#EEEEEE' } for a light gray background
 @param {Object} config.dataSource A config object for the data source.
 @param {Object} config.formConfig Default form properties for child form views. Example: formConfig:{labelWidth:100}. Then we don't have to specify labelWidth:100 for all the child form views.
 @param {Boolean} config.hidden When true, the View will be initially hidden. For performance reasons initially hidden Views will not be rendered until View.show() is called.
 @param {String} config.html Static HTML to show inside the View's body &lt;div>
 @param {String} config.id Id of view. When set, you can easily get access to the View by calling ludo.get("&lt;idOfView>").
 @param {Object} config.layout An object describing the layout for this view and basic layout rules for child views
 @param {String} config.name When set, you can access it by calling parentView.child["&lt;childName>"]
 @param {String} config.title Title of this view. If the view is a child in tab layout, the title will be displayed on the Tab
 @param {String} config.tpl A template for string when inserting JSON Content(the insertJSON method), example: "name:{firstname} {lastname}<br>"
 @param {Boolean} config.alwaysInFront True to make this view always appear in front of the other views.
 @param {Object} config.form Configuration for the form Manager. See <a href="ludo.form.Manager">ludo.form.Manager</a> for details.
 // TODO describe data sources
 @example {@lang Javascript}
	// Example 1: View render to &lt;body> tag
    new ludo.View({
 		renderTo:document.body,
 		html : 'Hello'
	}

	// Example 2: Creating custom View
 	myApp = {};
    myApp.View = new Class({
 		Extends: ludo.View,
 		type : 'myApp.View',
 		ludoRendered:function(){
 			this.html('My custom component');
		}
	}
    children:[{
		type : 'myApp.View'
	}]
 *
 */
ludo.View = new Class({
	Extends:ludo.Core,
	type:'View',
	cType:'View',
	cls:'',
	bodyCls:'',
	cssSignature:undefined,
	closable:true,
	minimizable:false,
	movable:false,
	resizable:false,
	alwaysInFront:false,
	statefulProperties:['layout'],
	els:{ },
	state:{},

	defaultDS : 'dataSource.JSON',
	tagBody:'div',
	id:null,
	children:[],
	child:{},
	dataSource:undefined,
	socket:undefined,
	parentComponent:null,
	objMovable:null,
	width:undefined,
	height:undefined,
	overflow:undefined,
	_html:'',

	hidden:false,

	css:undefined,
	elCss:undefined,
	formConfig:undefined,
	isRendered:false,
	unRenderedChildren:[],
	frame:false,
	form:undefined,
	layout:undefined,
	tpl:'',
	/**
	 * Default config for ludo.tpl.Parser. ludo.tpl.Parser is a JSON parser which
	 * converts uses the template defined in tpl and converts JSON into a String.
	 * If you want to create your own parser, extend ludo.tpl.Parser and change value of JSONParser to the name
	 * of your class
	 */
	JSONParser:{ type:'tpl.Parser' },
	initialItemsObject:[],
	contextMenu:undefined,
	lifeCycleComplete:false,

	lifeCycle:function (config) {
		this._createDOM();
		if (!config.children) {
			config.children = this.children;
			this.children = [];
		}

		this.ludoConfig(config);

		if (!config.children || !config.children.length) {
			config.children = this.getClassChildren();
		}

		if (this.hidden) {
			this.unRenderedChildren = config.children;
		} else {
			this.remainingLifeCycle(config);
		}
	},

	/**
	 * Alternative to the "children" config array. By defining children in getClassChildren, you will have access to "this" referring to
	 * the View instance. This is a method you override when creating your own Views.
	 * @function getClassChildren
	 * @memberof ludo.View.prototype
	 * @return {Array|children}
	 */
	getClassChildren:function () {
		return this.children;
	},

	remainingLifeCycle:function (config) {
		if (this.lifeCycleComplete)return;
		if (!config && this.unRenderedChildren) {
			config = { children:this.unRenderedChildren };
		}

		this.lifeCycleComplete = true;
		this._styleDOM();

		if (config.children) {
			for (var i = 0; i < config.children.length; i++) {
				config.children[i].id = config.children[i].id || 'ludo-' + String.uniqueID();
			}
			this.initialItemsObject = config.children;
			this.addChildren(config.children);
		}
		this.ludoDOM();
		this.ludoCSS();
		this.ludoEvents();

		this.increaseZIndex();

		if (this.layout && this.layout.type && this.layout.type == 'tabs') {
			this.getLayout().prepareView();
		}

		this.addCoreEvents();
		this.ludoRendered();

		if (!this.parentComponent) {
			ludo.dom.clearCache();
			ludo.dom.clearCache.delay(50, this);
			var r = this.getLayout().getRenderer();
			r.resize();

		}

		/**
		 * Event fired when component has been rendered
		 * @event render
		 * @param Component this
		 */
		this.fireEvent('render', this);
	},
	/**
	 * First life cycle step when creating and object
	 * @function ludoConfig
	 * @param {Object} config
	 */
	ludoConfig:function (config) {
		this.parent(config);
		config.els = config.els || {};
		if (this.parentComponent)config.renderTo = undefined;
		var keys = ['contextMenu', 'renderTo', 'tpl', 'elCss', 'socket', 'form', 'title', 'hidden',
			'dataSource', 'movable', 'resizable', 'closable', 'minimizable', 'alwaysInFront',
			'parentComponent', 'cls', 'bodyCls', 'objMovable', 'width', 'height', 'frame', 'formConfig',
			'overflow'];

		if(config.css != undefined){
			if(this.css != undefined){
				this.css = Object.merge(this.css, config.css);
			}else{
				this.css = config.css;
			}
		}
		if(config.html != undefined)this._html = config.html;
		this.setConfigParams(config, keys);

		if (this.renderTo)this.renderTo = $(this.renderTo);

		this.layout = ludo.layoutFactory.getValidLayoutObject(this, config);

		this.insertDOMContainer();
	},

	insertDOMContainer:function () {
		if (this.hidden)this.els.container.css('display', 'none');
		if (this.renderTo)this.renderTo.append(this.els.container);
	},

	/**
	 The second life cycle method
	 This method is typically used when you want to create your own DOM elements.
	 @memberof ludo.View.prototype
	 @function ludoDOM
	 @example
	 ludoDOM : function() {<br>
			 this.parent(); // Always call parent ludoDOM
			 var myEl = $('<div>');
			 myEl.html('My Content');
			 this.getEl().append(myEl);
		 }
	 */
	ludoDOM:function () {
		if (this.contextMenu) {
			if (!ludo.util.isArray(this.contextMenu)) {
				this.contextMenu = [this.contextMenu];
			}
			for (var i = 0; i < this.contextMenu.length; i++) {
				this.contextMenu[i].applyTo = this;
				this.contextMenu[i].contextEl = this.isFormElement() ? this.getFormEl() : this.getEl();
				new ludo.menu.Context(this.contextMenu[i]);
			}
			this.contextMenu = undefined;
		}

		if (this.cls) {
			this.getEl().addClass(this.cls);
		}
		if (this.bodyCls)this.getBody().addClass(this.bodyCls);
		if (this.type)this.getEl().addClass('ludo-' + (this.type.replace(/\./g, '-').toLowerCase()));
		if (this.css)this.getBody().css(this.css);
		if (this.elCss)this.getEl().css(this.elCss);

		if (this.frame) {
			this.getEl().addClass('ludo-container-frame');
			this.getBody().addClass('ludo-body-frame');
		}
		if (this.cssSignature !== undefined)this.getEl().addClass(this.cssSignature);
	},

	ludoCSS:function () {

	},
	/**
	 The third life cycle method
	 This is the place where you add custom events
	 @function ludoEvents
	 @return void
	 @example
	 ludoEvents:function(){
			 this.parent();
			 this.addEvent('load', this.myMethodOnLoad.bind(this));
		 }
	 */
	ludoEvents:function () {
		if (this.dataSource) {
			this.getDataSource();
		}
	},

	/**
	 * The final life cycle method. When this method is executed, the view (including child views)
	 * are fully rendered.
	 * @memberof ludo.View.prototype
	 * @function ludoRendered
	 * @fires 'render'
	 */
	ludoRendered:function () {
		if (!this.layout.height && !this.layout.above && !this.layout.sameHeightAs && !this.layout.alignWith) {
			this.autoSetHeight();
		}
		if (!this.parentComponent) {
			this.getLayout().createRenderer();
		}

		this.isRendered = true;
		if (this.form) {
			this.getForm();
		}
	},


	/**
	 * Parse and insert JSON into the view
	 * The JSON will be sent to the JSON parser(defined in JSONParser) and
	 * This method will be called automatically when you're using a JSON data-source
	 * @function insertJSON
	 * @param {Object} json
	 * @return void
	 */
	JSON:function(json){
		if (this.tpl) {
			this.getBody().html(this.getTplParser().asString(json, this.tpl));
		}
	},

	insertJSON:function (data) {
		console.warn("Use of deprecated insertJSON");
		if (this.tpl) {
			this.getBody().html(this.getTplParser().asString(data, this.tpl));
		}
	},

	getTplParser:function () {
		if (!this.tplParser) {
			this.tplParser = this.createDependency('tplParser', this.JSONParser);
		}
		return this.tplParser;
	},

	autoSetHeight:function () {
		var size = this.getBody().outerHeight(true);
		this.layout.height = size + ludo.dom.getMBPH(this.getEl());
	},

	/**
	 * Set HTML
	 * @function html
	 * @param html
	 * @type string
	 * @example
	 var view = new ludo.View({
	 	renderTo:document.body,
	 	layout:{ width:500,height:500 }
	 });
	 view.html('<h1>Heading</h1><p>Paragraph</p>');
     */

	html:function(html){
		this.getBody().html(html);
	},

	setHtml:function (html) {
		console.warn("Use of deprecated setHTML");
		console.trace();
		this.getBody().html(html);
	},

	setContent:function () {
		if (this._html) {
			if (this.children.length) {
				var el = $('<div>' + this._html + '</div>');
				this.getBody().append(el);
			} else {
				this.getBody().html(this._html);
			}
		}
	},

	/**
	 * Load content from the server. This method will send an Ajax request to the server
	 * using the properties specified in the remote object or data-source
	 * @function load
	 * @return void
	 */
	load:function () {
		/**
		 * This event is fired from the "load" method before a remote request is sent to the server.
		 * @event beforeload
		 * @param {String} url
		 * @param {Object} this
		 */
		this.fireEvent('beforeload', [this.getUrl(), this]);
		if (this.dataSource) {
			this.getDataSource().load();
		}
	},
	/**
	 * Get reference to parent component
	 * @function getParent
	 * @return {Object} component | null
	 */
	getParent:function () {
		return this.parentComponent ? this.parentComponent : null;
	},

	setParentComponent:function (parentComponent) {
		this.parentComponent = parentComponent;
	},

	_createDOM:function () {
		this.els.container = $('<div>');
		this.els.body = $('<' + this.tagBody + '>');
		this.els.container.append(this.els.body);
	},

	_styleDOM:function () {
		this.els.container.addClass('ludo-view-container');
		this.els.body.addClass('ludo-body');

		this.els.container.attr("id", this.getId());

		this.els.body.css('height','100%');
		if (this.overflow == 'hidden') {
			this.els.body.css('overflow', 'hidden');
		}

		if (ludo.util.isTabletOrMobile()) {
			this.els.container.addClass('ludo-view-container-mobile');
		}

		this.setContent();
	},

	addCoreEvents:function () {
		if (!this.getParent() && this.type !== 'Application') {
			this.getEl().on('mousedown', this.increaseZIndex.bind(this));
		}
	},

	increaseZIndex:function (e) {
		if (e && e.target && e.target.tagName.toLowerCase() == 'a') {
			return;
		}
		/** Event fired when a component is activated, i.e. brought to front
		 * @event activate
		 * @param {Object} ludo.View
		 */
		this.fireEvent('activate', this);
		this.setNewZIndex();
	},

	setNewZIndex:function () {
		this.getEl().css('zIndex', ludo.util.getNewZIndex(this));
	},

	/**
	 * Return reference to components DOM container. A view has two &lt;div> elements, one parent and a child. getEl()
	 * returns the parent, getBody() returns the child.
	 * DOM "body" element
	 * @function getEl()
	 * @return {Object} DOMElement
	 */
	getEl:function () {
		return this.els.container ? this.els.container : null;
	},
	/**
	 * Return reference to the "body" div HTML Element.
	 * @memberof ludo.view.prototype
	 * @function getBody
	 * @return {Object} DOMElement
	 */
	getBody:function () {
		return this.els.body;
	},
	/**
	 * Hides the view
	 * @function hide
	 * @memberof ludo.view.prototype
	 * @return void
	 */
	hide:function () {
		if (!this.hidden && this.getEl().css('display') !== 'none') {
			this.getEl().css('display', 'none');
			this.hidden = true;
			/**
			 * Fired when a component is hidden using the hide method
			 * @event hide
			 * @param {Object} htis
			 */
			this.resizeParent();
			this.fireEvent('hide', this);
		}
	},
	/**
	 * Hide component after n seconds
	 * @function hideAfterDelay
	 * @param {number} seconds
	 * @default 1
	 */
	hideAfterDelay:function (seconds) {
		this.hide.delay((seconds || 1) * 1000, this);
	},
	/**
	 * Is this component hidden?
	 * @memberof ludo.View.prototype
	 * @function isHidden
	 * @return {Boolean}
	 */
	isHidden:function () {
		return this.hidden;
	},

	/**
	 * Return true if this component is visible
	 * @function isVisible
	 * @return {Boolean}
	 *
	 */
	isVisible:function () {
		return !this.hidden;
	},

	/**
	 * Make the view visible
	 * @memberof ludo.View.prototype
	 * @function show
	 * @param {Boolean} skipEvents
	 * @return void
	 */
	show:function (skipEvents) {
		if (this.els.container.css('display') === 'none') {
			this.els.container.css('display', '');
			this.hidden = false;
		}

		if (!this.lifeCycleComplete) {
			this.remainingLifeCycle();
		}
		/**
		 * Event fired just before a component is shown using the show method
		 * @event beforeshow
		 * @param {Object} this
		 */
		if (!skipEvents)this.fireEvent('beforeshow', this);

		this.setNewZIndex();


		if (this.parentComponent) {
			// this.resizeParent();
		} else {
			this.getLayout().getRenderer().resize();
		}

		/**
		 * Fired when a component is shown using the show method
		 * @event show
		 * @param {Object} this
		 */
		if (!skipEvents)this.fireEvent('show', this);


	},

	resizeParent:function () {
		var parent = this.getParent();
		if (parent) {
			if (parent.children.length > 0)parent.getLayout().resizeChildren();
		}
	},

	/**
	 * Call show() method of a child component
	 * key must be id or name of child
	 * @function showChild
	 * @param {String} key
	 * @return {Boolean} success
	 */
	showChild:function (key) {
		var child = this.getChild(key);
		if (child) {
			child.show();
			return true;
		}
		return false;
	},

	/**
	 * Return Array of direct child views.
	 * @memberof ludo.View.prototype
	 * @function getChildren
	 * @return Array of Child components
	 */
	getChildren:function () {
		return this.children;
	},
	/**
	 * Return Array of child views, recursive.
	 * @memberof ludo.View.prototype
	 * @function getAllChildren
	 * @return Array of sub components
	 */
	getAllChildren:function () {
		var ret = [];
		for (var i = 0; i < this.children.length; i++) {
			ret.push(this.children[i]);
			if (this.children[i].hasChildren()) {
				ret = ret.append(this.children[i].getChildren());
			}
		}
		return ret;
	},
	/**
	 * Returns true if this component contain any children
	 * @memberof ludo.View.prototype
	 * @function hasChildren
	 * @return {Boolean}
	 */
	hasChildren:function () {
		return this.children.length > 0;
	},

	/**
	 * Set new title
	 * @memberof ludo.View.prototype
	 * @function setTitle
	 * @param {String} title
	 */
	setTitle:function (title) {
		this.title = title;
	},

	/**
	 * Returns total width of component including padding, borders and margins
	 * @memberof ludo.View.prototype
	 * @function getWidth
	 * @return {Number} width
	 */
	getWidth:function () {
		return this.layout.pixelWidth ? this.layout.pixelWidth : this.layout.width ? this.layout.width : this.getBody().width();
	},

	/**
	 * Get current height of component
	 * @memberof ludo.View.prototype
	 * @function getHeight
	 * @return {Number}
	 */
	getHeight:function () {
		return this.layout.pixelHeight ? this.layout.pixelHeight : this.layout.height;
	},

	/**
	 Resize View and it's children.
	 @function resize
	 @memberof ludo.View.prototype
	 @param {Object} config Object with optional width and height properties. Example: { width: 200, height: 100 }
	 @example
	 view.resize(
	 { width: 200, height:200 }
	 );
	 */
	resize:function (config) {


		if(this.html == "Edit")console.trace();
		
		if (this.isHidden()) {
			return;
		}
		config = config || {};

		if (config.width) {
			if (this.layout.aspectRatio && this.layout.preserveAspectRatio && config.width && !this.isMinimized()) {
				config.height = config.width / this.layout.aspectRatio;
			}
			// TODO layout properties should not be set here.
			this.layout.pixelWidth = config.width;
			if (!isNaN(this.layout.width))this.layout.width = config.width;
			var width = config.width - ludo.dom.getMBPW(this.els.container);
			if (width > 0) {
				this.els.container.css('width', width);
			}
		}

		if (config.height && !this.state.isMinimized) {
			// TODO refactor this part.
			if (!this.state.isMinimized) {
				this.layout.pixelHeight = config.height;
				if (!isNaN(this.layout.height))this.layout.height = config.height;
			}
			var height = config.height - ludo.dom.getMBPH(this.els.container);
			if (height > 0) {
				this.els.container.css('height', height);
			}
		}

		if (config.left !== undefined || config.top !== undefined) {
			this.setPosition(config);
		}

		this.resizeDOM();

		if (config.height || config.width) {
			/**
			 * Event fired when component is resized
			 * @event resize
			 */
			this.fireEvent('resize');
		}
		if (this.children.length > 0)this.getLayout().resizeChildren();
	},
	/**
	 * Returns true component is collapsible
	 * @function isCollapsible
	 * @return {Boolean}
	 */
	isCollapsible:function () {
		return this.layout && this.layout.collapsible ? true : false;
	},

	isChildOf:function (view) {
		var p = this.parentComponent;
		while (p) {
			if (p.id === view.id)return true;
			p = p.parentComponent;
		}
		return false;
	},

	setPosition:function (pos) {
		if (pos.left !== undefined && pos.left >= 0) {
			this.els.container.css('left', pos.left);
		}
		if (pos.top !== undefined && pos.top >= 0) {
			this.els.container.css('top', pos.top);
		}
	},

	getLayout:function () {
		if (!this.hasDependency('layoutManager')) {
			this.createDependency('layoutManager', ludo.layoutFactory.getManager(this));
		}
		return this.getDependency('layoutManager');
	},

	resizeChildren:function () {
		if (this.children.length > 0)this.getLayout().resizeChildren();
	},

	isMinimized:function () {
		return false;
	},

	cachedInnerHeight:undefined,
	resizeDOM:function () {
		if (this.layout.pixelHeight > 0) {
			var height = this.layout.pixelHeight ? this.layout.pixelHeight - ludo.dom.getMBPH(this.els.container) : this.els.container.css('height').replace('px', '');
			height -= ludo.dom.getMBPH(this.els.body);
			if (height <= 0 || isNaN(height)) {
				return;
			}
			this.els.body.css('height', height);
			this.cachedInnerHeight = height;
		}
	},

	getInnerHeightOfBody:function () {
		return this.cachedInnerHeight ? this.cachedInnerHeight : this.els.body.height();
	},

	getInnerWidthOfBody:function () {
		return this.layout.pixelWidth ? this.layout.pixelWidth - ludo.dom.getMBPW(this.els.container) - ludo.dom.getMBPW(this.els.body) : ludo.dom.getInnerWidthOf(this.els.body);
	},

	/**
	 * Add child components
	 * Only param is an array of child objects. A Child object can be a component or a JSON object describing the component.
	 * @function addChildren
	 * @memberof ludo.View.prototype
	 * @param {Array} children
	 * @return {Array} of new children
	 */
	addChildren:function (children) {
		var ret = [];
		for (var i = 0, count = children.length; i < count; i++) {
			ret.push(this.addChild(children[i]));
		}
		return ret;
	},
	/**
	 * Add a child component. The method will returned the created component.
	 * @memberof ludo.View.prototype
	 * @function addChild
	 * @param {Object|View} child. A Child object can be a View or a JSON config object for a new View.
	 * @param {String} insertAt
	 * @optional
	 * @param {String} pos
	 * @optional
	 * @return {View} child
	 */
	addChild:function (child, insertAt, pos) {
		child = this.getLayout().addChild(child, insertAt, pos);
		if (child.name) {
			this.child[child.name] = child;
		}
		child.addEvent('dispose', this.removeChild.bind(this));
		return child;
	},

	isMovable:function () {
		return this.movable;
	},

	isClosable:function () {
		return this.closable;
	},

	isMinimizable:function () {
		return this.minimizable;
	},
	/**
	 * Get child view by name or id
	 * @memberof ludo.View.prototype
	 * @function getChild
	 * @param {String} childName id or name of child view
	 *
	 */
	getChild:function (childName) {
		for (var i = 0; i < this.children.length; i++) {
			if (this.children[i].id == childName || this.children[i].name == childName) {
				return this.children[i];
			}
		}
		return undefined;
	},

	removeChild:function (child) {
		this.children.erase(child);
		child.parentComponent = null;
	},
	/**
	 * Remove all children
	 * @function disposeAllChildren
	 * @return void
	 */
	disposeAllChildren:function () {
		for (var i = this.children.length - 1; i >= 0; i--) {
			this.children[i].dispose();
		}
	},
	/**
	 * Hide and removes the view view
	 * @memberof ludo.View.prototype
	 * @function remove
	 * @return void
	 */
	remove:function(){
		this.fireEvent('dispose', this);
		ludo.util.dispose(this);
	},


	dispose:function () {
		console.warn("Use of deprecated dispose");
		console.trace();
        this.fireEvent('dispose', this);
        ludo.util.dispose(this);
	},
	/**
	 * Returns title
	 * @function getTitle
	 * @memberOf ludo.View.prototype
	 * @return string
	 */
	getTitle:function () {
		return this.title;
	},

	dataSourceObj:undefined,

	/**
	 * @funtion getDataSource
	 * @memberOf ludo.View.prototype
	 * Returns object of type ludo.dataSource.*
	 * @returns {undefined|*}
     */
	getDataSource:function () {
		if (!this.dataSourceObj && this.dataSource) {
			var obj;
			if (ludo.util.isString(this.dataSource)) {
				obj = this.dataSourceObj = ludo.get(this.dataSource);
			} else {
				if (!this.dataSource.type) {
					this.dataSource.type = this.defaultDS;
				}
                if(this.dataSource.shim && !this.dataSource.shim.renderTo){
                    this.dataSource.shim.renderTo = this.getEl()
                }
				obj = this.dataSourceObj = this.createDependency('viewDataSource', this.dataSource);
			}

			var method = obj.getSourceType() === 'HTML' ? 'html' : 'insertJSON';

			if (obj.hasData()) {
				this[method](obj.getData());
			}
			obj.addEvent('load', this[method].bind(this));
		}
		return this.dataSourceObj;
	},
	_shim:undefined,
	shim:function(){
		if(this._shim === undefined){
			this._shim = new ludo.view.Shim({
				txt : '',
				renderTo:this.getEl()
			});
		}
		return this._shim;
	},

    /**
     Returns {@link ludo.form.Manager"} for this view.
     @function getForm     *
     @return {ludo.form.Manager}
	 @memberof ludo.View.prototype
     @example
        view.getForm().reset();

     to reset all form fields

     @example
        view.getForm().save();

     to submit the form

     @example
        view.getForm().read(1);

     to send a read request to the server for record with id 1.
     */
	getForm:function () {
		if (!this.hasDependency('formManager')) {
			this.createDependency('formManager',
				{
					type:'ludo.form.Manager',
					view:this,
					form:this.form
				});
		}
		return this.getDependency('formManager');
	},

	getParentForm:function () {
		var parent = this.getParent();
		return parent ? parent.hasDependency('formManager') ? parent.getDependency('formManager') : parent.getParentForm() : undefined;
	},

	isFormElement:function () {
		return false;
	},

	getHeightOfButtonBar:function () {
		return 0;
	},

	canvas:undefined,
	/**
	 Returns drawable Canvas/SVG
	 @function getCanvas
	 @memberof ludo.View.prototype
	 @return {canvas.Canvas} canvas
	 @example
	    var win = new ludo.Window({
		   id:'myWindow',
		   left:50, top:50,
		   width:410, height:490,
		   title:'Canvas',
		   css:{
			   'background-color':'#FFF'
		   }
	   });
	    // Creating line style
	    var paint = new ludo.canvas.Paint({
		   css:{
			   'fill':'#FFFFFF',
			   'stroke':'#DEF',
			   'stroke-width':'5'
		   }
	   });
	 	// Get reference to canvas
	    var canvas = win.getCanvas();
	    canvas.append(new ludo.canvas.Node('line', { x1:100, y1:100, x2:200, y2:200, "class":paint }));
	 */
	getCanvas:function () {
		if (this.canvas === undefined) {
			this.canvas = this.createDependency('canvas', new ludo.canvas.Canvas({
				renderTo:this
			}));
		}
		return this.canvas;
	}
});

ludo.factory.registerClass('View', ludo.View);/* ../ludojs/src/remote/message.js */
/**
 Class displaying all messages from remote requests
 @namespace remote
 @class Message
 @augments ludo.View
 @constructor
 @param {Object} config
 @example
 	children:[{
        type:'remote.Message',
        listenTo:["Person", "City.save"]
    }...

 will listen to all services of the "Person" resource and the "save" service of "City".

 */
ludo.remote.Message = new Class({
    // TODO support auto hide
    Extends:ludo.View,
    cls:'ludo-remote-message',

    /**
     Listen to these resources and events
     @config {Array|String} listenTo
     @example
        listenTo:"Person" // listen to all Person events
        listenTo:["Person.save","Person.read", "City"] // listen to "save" and "read" service of "Person" and all services of the "City" resource
     */
    listenTo:[],

    messageTypes:['success', 'failure', 'error'],

    ludoConfig:function (config) {
        this.parent(config);
        this.setConfigParams(config, ['listenTo']);
        if (!ludo.util.isArray(this.listenTo))this.listenTo = [this.listenTo];
		this.validateListenTo();

    },

	validateListenTo:function(){
		for(var i=0;i<this.listenTo.length;i++){
			this.listenTo[i] = this.listenTo[i].replace(/\//g,'.');
		}
	},

    ludoEvents:function () {
        this.parent();
        var resources = this.getResources();
        for (var resourceName in resources) {
            if (resources.hasOwnProperty(resourceName)) {
                this.addResourceEvent(resourceName, resources[resourceName]);
            }
        }
    },

    getResources:function () {
        var ret = {};
        var resource, service;
        for (var i = 0; i < this.listenTo.length; i++) {
            if (this.listenTo[i].indexOf('.') >= 0) {
                var tokens = this.listenTo[i].split(/\./g);
                if (tokens.length === 2) {
                    service = tokens.pop();
                    resource = tokens[0];
                    service = service != '*' ? service : undefined;
                }
            } else {
                resource = this.listenTo[i];
                service = undefined;
            }

            if (ret[resource] == undefined) {
                ret[resource] = [];
            }
            if (service && ret[resource].indexOf(service) === -1) {
                ret[resource].push(service);
            }
        }
        return ret;
    },

    addResourceEvent:function (resource, service) {
        ludo.remoteBroadcaster.addServiceEvent("clear", resource, service, this.hideMessage.bind(this));
        for (var i = 0; i < this.messageTypes.length; i++) {
            ludo.remoteBroadcaster.addServiceEvent(this.messageTypes[i], resource, service, this.showMessage.bind(this));
        }
    },

    showMessage:function (response) {
        this.show();
        if (response.code && response.code !== 200) {
            this.getEl().addClass('ludo-remote-error-message');
        } else {
            this.getEl().removeClass('ludo-remote-error-message');
        }
        this.html(response.message);

        /**
         * Event fired when message is shown.
         * @event showMessage
         * @param {remote.Message} this
         */
        this.fireEvent('showMessage', this);
    },

    hideMessage:function () {
        this.html('');
    }
});/* ../ludojs/src/remote/error-message.js */
/**
 * Show error messages from remote requests
 * @namespace remote
 * @class ErrorMessage
 * @augments ludo.remote.Message
 */
ludo.remote.ErrorMessage = new Class({
    Extends:ludo.remote.Message,
    messageTypes:['failure','serverError']
});/* ../ludojs/src/canvas/effect.js */
ludo.canvas.Effect = new Class({

    fps:33,

    fly:function(el, x, y, duration){
        var start = this.getTranslate(el);
        this.execute('translate', el, [start.x, start.y],[start.y + x, start.y + y], duration);
    },

    /**
     * Animates back to translate(0,0)
     * @function flyBack
     * @param el
     * @param duration
     */
    flyBack:function(el, duration){
        var start = this.getTranslate(el);
        this.execute('translate', el, [start.x, start.y],[0,0], duration);
    },

    getTranslate:function(el){
        var ret = ludo.canvasEngine.getTransformation(el, 'translate');
        if(!ret)ret = {
            x:0,y:0
        };
        return ret;
    },

    execute:function(property, el, start, end, duration){
        duration = duration || .25;
        var ef = this.getEffectConfig(start, end, duration);
        this.executeStep(property, el, start, ef.steps, ef.count, 0 );
    },

    executeStep:function(property, el, current, increments, countSteps, stepIndex){
        for(var i = 0;i<increments.length;i++){
            current[i] += increments[i];
        }

        ludo.canvasEngine.setTransformation(el, property, current.join(' '));
        stepIndex ++;
        if(stepIndex < countSteps){
            this.executeStep.delay(this.fps, this, [
                property, el, current, increments, countSteps, stepIndex
            ]);
        }
    },

    getEffectConfig:function(start, end, duration){
        if(!ludo.util.isArray(start))start = [start];
        if(!ludo.util.isArray(end))end = [end];
        var countSteps = Math.round(duration * this.fps);
        var steps = [];
        for(var i=0;i<start.length;i++){
            steps.push((end[i] - start[i]) / countSteps);
        }

        return {
            steps: steps,
            count : countSteps
        }
    }
});/* ../ludojs/src/data-source/record.js */
/**
 * Class representing a record in {{#crossLink "dataSource.Collection"}}{{/crossLink}}
 * Instances of this class are created from {{#crossLink "dataSource.Collection/getRecord"}}{{/crossLink}}
 * When you update a record
 * @namespace dataSource
 * @class Record
 */
ludo.dataSource.Record = new Class({
	Extends:Events,
	record:undefined,
	collection:undefined,

    /**
     * Array of events which should fire update event
     * @property {Array} eventKeys
     * @default undefined
     */
    eventKeys:undefined,

	initialize:function (record, collection) {
		this.record = record;
		this.collection = collection;
	},

	/**
	 * Update property of record
	 * @function set
	 * @param {String} key
	 * @param {String|Number|Object} value
	 * @return {dataSource.Record}
	 */
	set:function (key, value) {
		this.fireEvent('beforeUpdate', this.record);
		this.record[key] = value;
		if(!this.eventKeys || this.eventKeys.indexOf(key) >= 0){
            this.fireEvent('update', this.record);
        }
		return this;
	},

	/**
	 Return value of key
	 @function get
	 @param {String} key
	 @return {String|Number|Object} value
	 */
	get:function (key) {
		return this.record[key];
	},
	/**
	 Update multiple properties
	 @function setProperties
	 @param {Object} properties
	 @return {dataSource.Record|undefined}
	 @example
	    var collection = new ludo.dataSource.Collection({
	 		idField:'id'
		});
	 collection.getRecord(100).setProperties({ country:'Norway', capital:'Oslo' });
	 will set country to "Norway" and capital to "Oslo" for record where "id" is equal to 100. If you're not sure
	 that the record exists, you should use code like this:
	 @example
	    var rec = collection.getRecord(100);
	    if(rec)rec.setProperties({ country:'Norway', capital:'Oslo' });
	 */
	setProperties:function (properties) {
		this.fireEvent('beforeUpdate', this.record);
		for (var key in properties) {
			if (properties.hasOwnProperty(key)) {
				this.record[key] = properties[key];
			}
		}
		this.fireEvent('update', [this.record,undefined, 'update']);
		return this;
	},

	addChild:function (record) {
		record = this.getPlainRecord(record);
		this.record.children = this.record.children || [];
		this.record.children.push(record);
		if (record.parentUid) {
			var parent = this.collection.getRecord(record.parentUid);
			if (parent)parent.removeChild(record);
		}
		this.fireEvent('addChild', [record, this.record, 'addChild']);
		return this;
	},

	getParent:function () {
		return this.collection.getRecord(this.record.parentUid);
	},

	getCollection:function(){
		return this.collection;
	},

	isRecordObject:function (rec) {
		return rec['initialize'] !== undefined && rec.record !== undefined;
	},

	getChildren:function () {
		return this.record.children;
	},

	removeChild:function (record) {
		record = this.getPlainRecord(record);
		var index = this.record.children.indexOf(record);
		if (index >= 0) {
			this.record.children.splice(index, 1);
			this.fireEvent('removeChild', [record, this.record, 'removeChild']);
		}
	},

	getPlainRecord:function (record) {
		return this.isRecordObject(record) ? record.record : record;
	},

    select:function(){
        this.fireEvent('select', this);
    },

	insertBefore:function (record, before) {
		if (this.inject(record, before)) {
			this.fireEvent('insertBefore', [record, before, 'insertBefore']);
		}
	},

	insertAfter:function (record, after) {
		if (this.inject(record, after, 1)) {
			this.fireEvent('insertAfter', [record, after, 'insertAfter']);
		}
	},

	inject:function (record, sibling, offset) {
		offset = offset || 0;
		record = this.getPlainRecord(record);
		sibling = this.getPlainRecord(sibling);
		if (record === sibling)return false;
		if (record.parentUid) {
			var parent = this.collection.getRecord(record.parentUid);
			if (parent){
				if(this.isMyChild(record)){
					this.record.children.splice(this.getChildIndex(record), 1);
				}else{
					parent.removeChild(record);
				}
			}
		}
		var index = this.record.children.indexOf(sibling);
		if (index !== -1) {
			this.record.children.splice(index + offset, 0, record);
			return true;
		}
		return false;
	},

	getChildIndex:function (record) {
		return this.record.children ? this.record.children.indexOf(this.getPlainRecord(record)) : -1;
	},

	isMyChild:function (record) {
		return this.record.children && this.record.children.indexOf(this.getPlainRecord(record)) !== -1;
	},

	getUID:function(){
		return this.record.uid;
	},

	getData:function(){
		return this.record;
	},

	dispose:function(){
		this.fireEvent('dispose', this.record);
		delete this.record;
	}
});/* ../ludojs/src/chart/record.js */
/**
 * Record for charts
 * @namespace chart
 * @class Record
 */
ludo.chart.Record = new Class({
    Extends:ludo.dataSource.Record,
    eventKeys:['value','label'],

    getStartPercent:function () {
        var c = this.getCollection();
        return c.getSumOf(0, c.indexOf(this) - 1) / c.getSum() * 100;
    },

    getPercent:function(){
        return (this.getValue() / this.getCollection().getSum()) * 100;
    },

	getSum:function(){
		return this.getCollection().getSum();
	},

    getDegrees:function () {
        return this.getPercent() * 360 / 100;
    },

    getAngle:function () {
        var s = this.getCollection().startAngle;
        var ret = s + (this.getStartPercent() * 360 / 100);
        if (ret > 360)ret -= 360;
        return ret;
    },

    getValue:function(){
        return this.get('value');
    },

    getLabel:function(){
        return this.get('label');
    },

    setValue:function(value){
        value = parseFloat(value);
        if(value !== this.get('value')){
            this.set('value', value);
        }
    },

    focus:function(){
        this.fireEvent('focus', this);
        this.set('focused', true);
    },

    blur:function(){
        this.fireEvent('blur', this);
        this.set('focused', false);
    },

    click:function(){
        var focused = this.get('focused') ? true : false;
        this[focused ? 'blur' : 'focus']();
    },

    isFocused:function(){
        return this.get('focused') ? true : false;
    },

    enter:function(){
        this.fireEvent('enter', this);
    },

    leave:function(){
        this.fireEvent('leave', this);
    }
});/* ../ludojs/src/data-source/collection.js */
/**
 Data source collection
 @namespace dataSource
 @class Collection
 @augments dataSource.JSON
 @constructor
 @param {Object} config
 @example
 	dataSource:{
		url:'data-source/grid.php',
		id:'myDataSource',
		paging:{
			size:12,
			remotePaging:false,
			cache:false,
			cacheTimeout:1000
		},
		searchConfig:{
			index:['capital', 'country']
		},
		listeners:{
			select:function (record) {
				console.log(record);
			}
		}
	}
 */
ludo.dataSource.Collection = new Class({
	Extends:ludo.dataSource.JSON,
	/**
	 custom sort functions, which should return -1 if record a is smaller than
	 record b and 1 if record b is larger than record a.
	 @config {Function} sortFn
	 @default {}
	 @example
	 	sortFn:{
			'population':{
				'asc' : function(a,b){
					return parseInt(a.population) < parseInt(b.population) ? -1 : 1
				},
				'desc' : function(a,b){
					return parseInt(a.population) > parseInt(b.population) ? -1 : 1
				}
			}
	 	}
	 */
	sortFn:{},

	selectedRecords:[],

	/**
	 * Primary key for records
	 * @config {String} primaryKey
	 * @default "id"
     * @optional
	 */
	primaryKey:'id',

	/**
	 Use paging, i.e. only load a number of records from the server
	 @attribute {Object} paging
	 @example
	 	paging:{
		 	size:10, // Number of rows per page
		  	remotePaging:true, // Load only records per page from server, i.e. new request per page
		  	cache : true, // Store pages in cache, i.e no request if data for page is in cache,
		  	cacheTimeout:30 // Optional time in second before cache is considered out of date, i.e. new server request
		}

	 */
	paging:undefined,

	dataCache:{},

	sortedBy:{
		column:undefined,
		order:undefined
	},
	/**
	 Configuration object for {{#crossLink "dataSource.CollectionSearch"}}{{/crossLink}}. This is
	 the class which searchs and filters data in the collection.
	 @config searchConfig
	 @type Object
	 @example
	 	searchConfig:{
	 		index:['city','country'],
	 		delay:.5
	 	}
	 which makes the record keys/columns "city" and "country" searchable. It waits .5 seconds
	 before the search is executed. This is useful when searching large collections and you
	 want to delay the search until the user has finished entering into a search box.
	 */
	searchConfig:undefined,

	statefulProperties:['sortedBy', 'paging'],

	index:undefined,

	searcherType:'dataSource.CollectionSearch',

	uidMap:{},

	/**
	 * Reference to record to select by default once data has been loaded
	 * @config {Object|String} selected
	 * @default undefined
	 */
	selected:undefined,

	ludoConfig:function (config) {
		this.parent(config);
        this.setConfigParams(config, ['searchConfig','sortFn','primaryKey','sortedBy','paging','selected']);

		if (this.primaryKey && !ludo.util.isArray(this.primaryKey))this.primaryKey = [this.primaryKey];
		if (this.paging) {
			this.paging.offset = this.paging.offset || 0;
			this.paging.initialOffset = this.paging.offset;
			if (this.paging.initialOffset !== undefined) {
				this.fireEvent('page', (this.paging.initialOffset / this.paging.size) + 1);
			}
			if (this.isCacheEnabled()) {
				this.addEvent('load', this.populateCache.bind(this));
			}
		}

		this.addEvent('parsedata', this.createIndex.bind(this));


		if(this.selected){
			this.addEvent('firstLoad', this.setInitialSelected.bind(this));
		}

		if(this.data && !this.index)this.createIndex();
	},

	hasRemoteSearch:function(){
		return this.paging && this.paging.remotePaging;
	},

	setInitialSelected:function(){
		this.selectRecord(this.selected);
	},

	/**
	 * Returns 1) If search is specified: number of records in search result, or 2) number of records in entire collection.
	 * @function getCount
	 * @return {Number} count
	 */
	getCount:function () {
		if (this.paging && this.paging.rows)return this.paging.rows;
		if (this.searcher && this.searcher.hasData())return this.searcher.getCount();
		return this.data ? this.data.length : 0;
	},

	isCacheEnabled:function () {
		return this.paging && this.paging['remotePaging'] && this.paging.cache;
	},

	/**
	 * Resort data-source
	 * @function sort
	 * @return void
	 */
	sort:function () {
		if (this.sortedBy.column && this.sortedBy.order) {
			this.sortBy(this.sortedBy.column, this.sortedBy.order);
		}
	},

	/**
	 Set sorted by column
	 @function by
	 @param {String} column
	 @return {dataSource.Collection} this
	 @example
	 	collection.by('country').ascending().sort();
	 or
	 @example
	 	collection.by('country').sort();
	 */
	by:function(column){
		this.sortedBy.column = column;
		this.sortedBy.order = this.getSortOrderFor(column);
		return this;
	},
	/**
	 Set sort order to ascending
	 @function ascending
	 @return {dataSource.Collection} this
	 @example
	 	collection.by('country').ascending().sort();
	 */
	ascending:function(){
		this.sortedBy.order = 'asc';
		return this;
	},
	/**
	 Set sort order to descending
	 @function descending
	 @return {dataSource.Collection} this
	 @example
	 	collection.by('country').descending().sort();
	 */
	descending:function(){
		this.sortedBy.order = 'desc';
		return this;
	},

	/**
	 Sort by column and order

	 The second argument(order) is optional
	 @function sortBy
	 @param {String} column
	 @param {String} order
     @optional
	 @return {dataSource.Collection} this
	 @example
	 	grid.getDataSource().sortBy('firstname', 'desc');
	 which also can be written as
	 @example
	 	grid.getDataSource().by('firstname').descending().sort();
	 */
	sortBy:function (column, order) {
        order = order || this.getSortOrderFor(column);

		this.sortedBy = {
			column:column,
			order:order
		};

		if (this.paging) {
			this.paging.offset = this.paging.initialOffset || 0;
			this.fireEvent('page', Math.round(this.paging.offset / this.paging.size) + 1);
		}

		if (this.shouldSortOnServer()) {
			this.loadOrGetFromCache();
		} else {
			var data = this._getData();
			data.sort(this.getSortFnFor(column, order));
			this.fireEvent('change');
		}
		/**
		 * Event fired when a data has been sorted,
		 * param example: { column:'country',order:'asc' }
		 * @event sort
		 * @param {Object} sortedBy
		 */
		this.fireEvent('sort', this.sortedBy);
        if(this.paging)this.firePageEvents();
		this.fireEvent('state');

		return this;
	},

	/**
	 * Return current sorted by column
	 * @function getSortedBy
	 * @return {String} column
	 */
	getSortedBy:function () {
		return this.sortedBy.column;
	},
	/**
	 * Return current sort order (asc|desc)
	 * @function getSortOrder
	 * @return {String} order
	 */
	getSortOrder:function () {
		return this.sortedBy.order;
	},

	shouldSortOnServer:function () {
		return this.paging && this.paging.remotePaging;
	},

	getSortFnFor:function (column, order) {
		if (this.sortFn[column] !== undefined) {
			return this.sortFn[column][order];
		}
		if (order === 'asc') {
			return function (a, b) {
				return a[column] + '_' + a[this.primaryKey] < b[column] + '_' + b[this.primaryKey] ? -1 : 1
			};
		} else {
			return function (a, b) {
				return a[column] + '_' + a[this.primaryKey] < b[column] + '_' +  b[this.primaryKey] ? 1 : -1
			};
		}
	},

	getSortOrderFor:function (column) {
		if (this.sortedBy.column === column) {
			return this.sortedBy.order === 'asc' ? 'desc' : 'asc';
		}
		return 'asc';
	},

	/**
	 * Add a record to data-source
	 * @function addRecord
	 * @param record
	 * @return {Object} record
	 */
	addRecord:function (record) {
        this.data = this.data || [];
		this.data.push(record);

		if(!this.index)this.createIndex();
		/**
		 * Event fired when a record is added to the collection
		 * @event add
		 * @param {Object} record
		 */
		this.fireEvent('add', record);

		return this.createRecord(record);
	},

	/**
	 * Returns plain object for a record from search. To get a
	 * {{#crossLink "dataSource.Record"}}{{/crossLink}} object
	 * use {{#crossLink "dataSource.Collection/getRecord"}}{{/crossLink}}
	 *
	 * collection.find({ capital : 'Oslo' });
	 *
	 * @function findRecord
	 * @param {Object} search
	 * @return {Object|undefined} record
	 */
	findRecord:function (search) {

		if (!this.data)return undefined;
		if(search['getUID'] !== undefined)search = search.getUID();

		if(search.uid)search = search.uid;
		var rec = this.getById(search);
		if(rec)return rec;

		var searchMethod = ludo.util.isObject(search) ? 'isRecordMatchingSearch' : 'hasMatchInPrimaryKey';


		for (var i = 0; i < this.data.length; i++) {
			if (this[searchMethod](this.data[i], search)) {
				return this.data[i];
			}
		}
		return undefined;
	},

	isRecordMatchingSearch:function (record, search) {
		for (var key in search) {
			if (search.hasOwnProperty(key)) {
				if (record[key] !== search[key]) {
					return false;
				}
			}
		}
		return true;
	},

	hasMatchInPrimaryKey:function(record, search){
		if(this.primaryKey){
			for(var j=0;j<this.primaryKey.length;j++){
				if(record[this.primaryKey[j]]  === search)return true;
			}
		}
		return false;
	},

	/**
	 * Find specific records, example:
	 * var records = collection.findRecords({ country:'Norway'});
	 * @function findRecords
	 * @param {Object} search
	 * @return {Array} records
	 */
	findRecords:function (search) {
		var ret = [];
		for (var i = 0; i < this.data.length; i++) {
			if (this.isRecordMatchingSearch(this.data[i], search)) {
				ret.push(this.data[i]);
			}
		}
		return ret;
	},

    getLinearData:function(){
        return this.data;
    },

	/**
	 * Select a specific record
	 * @function selectRecord
	 * @param {Object} search
	 * @return {Object|undefined} record
	 */
	selectRecord:function (search) {
		var rec = this.findRecord(search);
		if (rec) {
			this._setSelectedRecord(rec);
			return rec;
		}
		return undefined;
	},


	/**
	 * Select a collection of records
	 * @function selectRecords
	 * @param {Object} search
	 * @return {Array} records
	 */
	selectRecords:function (search) {
		this.selectedRecords = this.findRecords(search);
		for (var i = 0; i < this.selectedRecords.length; i++) {
			this.fireSelect(this.selectedRecords[i]);
		}
		return this.selectedRecords;
	},

	/**
	 * Select a specific record by index
	 * @function selectRecordIndex
	 * @param {number} index
	 */
	selectRecordIndex:function (index) {
		var data = this._getData();
		if (data.length && index >= 0 && index < data.length) {
			var rec = data[index];
			this._setSelectedRecord(rec);
			return rec;
		}
		return undefined;
	},

	_getData:function () {
		if (this.hasSearchResult())return this.searcher.getData();
		return this.data;
	},

	getRecordByIndex:function (index) {
		if (this.data.length && index >= 0 && index < this.data.length) {
			return this.data[index];
		}
		return undefined;
	},

	/**
	 * Select previous record. If no record is currently selected, first record will be selected
	 * @function previous
	 * @return {Object} record
	 */
	previous:function () {
		var rec = this.getPreviousOf(this.getSelectedRecord());
		if (rec) {
			this._setSelectedRecord(rec);
		}
		return rec;
	},

	/**
	 * Returns previous record of given record
	 * @function getPreviousOf
	 * @param {Object} record
	 * @return {Object} previous record
	 */
	getPreviousOf:function (record) {
		var data = this._getData();
		if (record) {
			var index = data.indexOf(record);
            return index > 0 ? data[index-1] : undefined;
		} else {
            return data.length > 0 ? data[0] : undefined;
		}
	},

	/**
	 * Select next record. If no record is currently selected, first record will be selected
	 * @function next
	 * @return {Object} record
	 */
	next:function () {
		var rec = this.getNextOf(this.getSelectedRecord());
		if (rec) {
			this._setSelectedRecord(rec);
		}
		return rec;
	},
	/**
	 * Returns next record of given record.
	 * @function getNextOf
	 * @param {Object} record
	 * @return {Object} next record
	 */
	getNextOf:function (record) {
		var data = this._getData();
		if (record) {
			var index = data.indexOf(record);
            return index < data.length - 1 ? data[index+1] : undefined;
		} else {
            return data.length > 0 ? data[0] : undefined;
		}
	},

	_setSelectedRecord:function (rec) {
		if (this.selectedRecords.length) {
			/**
			 * Event fired when a record is selected
			 * @event deselect
			 * @param {Object} record
			 */
			this.fireEvent('deselect', this.selectedRecords[0]);
		}
		this.selectedRecords = [rec];
		/**
		 Event fired when a record is selected
		 @event select
		 @param {Object} record
		 @example
		 	...
		 	listeners:{
		 		'select' : function(record){
		 			console.log(record);
		 		}
		 	}
		 */
		this.fireSelect(Object.clone(rec));
	},

	/**
	 * Return selected record
	 * @function getSelectedRecord
	 * @return {Object|undefined} record
	 */
	getSelectedRecord:function () {
        return this.selectedRecords.length > 0 ? this.selectedRecords[0] : undefined;
	},

	/**
	 * Return selected records
	 * @function getSelectedRecords
	 * @return {Array} records
	 */
	getSelectedRecords:function () {
		return this.selectedRecords;
	},

	/**
	 Delete records matching search,
	 @function deleteRecords
	 @param {Object} search
	 @example
	 	grid.getDataSource().deleteRecords({ country: 'Norway' });
	 will delete all records from collection where country is equal to "Norway". A delete event
	 will be fired for each deleted record.
	 */
	deleteRecords:function (search) {
		var records = this.findRecords(search);
		for (var i = 0; i < records.length; i++) {
			this.data.erase(records[i]);
			this.fireEvent('delete', records[i]);
		}
	},
	/**
	 Delete a single record. Deletes first match when
	 multiple matches found.
	 @function deleteRecord
	 @param {Object} search
	 @example
	 	grid.getDataSource().deleteRecord({ country: 'Norway' });
	 Will delete first found record where country is equal to Norway. It will fire a
	 delete event if a record is found and deleted.
	 */
	deleteRecord:function (search) {
		var rec = this.findRecord(search);
		if (rec) {
			this.data.erase(rec);
			/**
			 * Event fired when a record is deleted
			 * @event delete
			 * @param {Object} record
			 */
			this.fireEvent('delete', rec);
		}
	},

	/**
	 Select records from current selected record to record matching search,
	 @function selectTo
	 @param {Object} search
	 @example
	 	collection.selectRecord({ country: 'Norway' });
	 	collection.selectTo({country: 'Denmark'});
	 	var selectedRecords = collection.getSelectedRecords();
	 */
	selectTo:function (search) {
		var selected = this.getSelectedRecord();
		if (!selected) {
			this.selectRecord(search);
			return;
		}
		var rec = this.findRecord(search);
		if (rec) {
			this.selectedRecords = [];
			var index = this.data.indexOf(rec);
			var indexSelected = this.data.indexOf(selected);
			var i;
			if (index > indexSelected) {
				for (i = indexSelected; i <= index; i++) {
					this.selectedRecords.push(this.data[i]);
					this.fireSelect(this.data[i]);
				}
			} else {
				for (i = indexSelected; i >= index; i--) {
					this.selectedRecords.push(this.data[i]);
					this.fireSelect(this.data[i]);
				}
			}
		}
	},

	/**
	 * Update a record
	 * @function updateRecord
	 * @param {Object} search
	 * @param {Object} updates
	 * @return {dataSource.Record} record
	 */
	updateRecord:function (search, updates) {
		var rec = this.getRecord(search);
		if (rec) {
			rec.setProperties(updates);
		}
		return rec;
	},

	getPostData:function () {
		if (!this.paging) {
			return this.parent();
		}
		var ret = this.postData || {};
		ret._paging = {
			size:this.paging.size,
			offset:this.paging.offset
		};
		ret._sort = this.sortedBy;
		return ret;
	},
	/**
	 * When paging is enabled, go to previous page.
	 * fire previousPage event
	 * @function previousPage
	 */
	previousPage:function () {
		if (!this.paging || this.isOnFirstPage())return;
		this.paging.offset -= this.paging.size;
		/**
		 * Event fired when moving to previous page
		 * @event previousPage
		 */
		this.onPageChange('previousPage');
	},

	/**
	 * When paging is enabled, go to next page
	 * fire nextPage event
	 * @function nextPage
	 */
	nextPage:function () {
		if (!this.paging || this.isOnLastPage())return;
		this.paging.offset += this.paging.size;
		/**
		 * Event fired when moving to next page
		 * @event nextPage
		 */
		this.onPageChange('nextPage');
	},

	/**
	 * Go to last page
	 * @function lastPage
	 */
	lastPage:function () {
		if (!this.paging || this.isOnLastPage())return;
		var count = this.getCount();
		var decr = count % this.paging.size;
		if(decr === 0) decr = this.paging.size;
		this.paging.offset = count - decr;
		this.onPageChange('lastPage');
	},

	firstPage:function () {
		if (!this.paging || this.isOnFirstPage())return;
		this.paging.offset = 0;
		/**
		 * Event fired when moving to first page
		 * @event firstPage
		 */
		this.onPageChange('firstPage');
	},

	isOnFirstPage:function () {
		if (!this.paging)return true;
		return this.paging.offset === undefined || this.paging.offset === 0;
	},

	isOnLastPage:function () {
		return this.paging.size + this.paging.offset >= this.getCount();
	},

	onPageChange:function (event) {
		if (this.paging['remotePaging']) {
			this.loadOrGetFromCache();
		}
		this.fireEvent('change');
		this.fireEvent(event);
		this.firePageEvents();
	},

	loadOrGetFromCache:function () {
		if (this.isDataInCache()) {
			this.data = this.dataCache[this.getCacheKey()].data;
			this.fireEvent('change');
		} else {
			this.load();
		}
	},

	populateCache:function () {
		if (this.isCacheEnabled()) {
			this.dataCache[this.getCacheKey()] = {
				data:this.data,
				time:new Date().getTime()
			}
		}
	},

	isDataInCache:function () {
		return this.dataCache[this.getCacheKey()] !== undefined && !this.isCacheOutOfDate();
	},

    clearCache:function(){
        this.dataCache = {};
    },

	isCacheOutOfDate:function () {
		if (!this.paging['cacheTimeout'])return false;

		var created = this.dataCache[this.getCacheKey()].time;
		return created + (this.paging['cacheTimeout'] * 1000) < (new Date().getTime());
	},

	getCacheKey:function () {
		var keys = [
			'key', this.paging.offset, this.sortedBy.column, this.sortedBy.order
		];
		if (this.searcher !== undefined && this.searcher.hasData())keys.push(this.searcher.searchToString());
		return keys.join('|');
	},

    hasData:function(){
        return this.data != undefined && this.data.length > 0;
    },

	firePageEvents:function (skipState) {
		if (this.isOnLastPage()) {
			/**
			 * Event fired when moving to last page
			 * @event lastPage
			 */
			this.fireEvent('lastPage');
		} else {
			/**
			 * Event fired when moving to a different page than last page
			 * @event notLastPage
			 */
			this.fireEvent('notLastPage');
		}

		if (this.isOnFirstPage()) {
			this.fireEvent('firstPage');

		} else {
			/**
			 * Event fired when moving to a different page than last page
			 * @event notFirstPage
			 */
			this.fireEvent('notFirstPage');
		}

		/**
		 * Event fired when moving to a page
		 * @event page
		 * @param {Number} page number
		 */
		this.fireEvent('page', this.getPageNumber());
		if (skipState === undefined)this.fireEvent('state');
	},

	/**
	 * Go to a specific page
	 * @function toPage
	 * @param {Number} pageNumber
	 * @return {Boolean} success
	 */
	toPage:function (pageNumber) {
		if (pageNumber > 0 && pageNumber <= this.getPageCount() && !this.isOnPage(pageNumber)) {
			this.paging.offset = (pageNumber - 1) * this.paging.size;
			/**
			 * Event fired when moving to a specific page
			 * @event toPage
			 */
			this.onPageChange('toPage');
			return true;
		}
		return false;
	},

	setPageSize:function(size){
		if(this.paging){
			this.dataCache = {};
			this.paging.size = parseInt(size);
			this.paging.offset = 0;

			this.onPageChange('toPage');
		}
	},

	/**
	 * True if on given page
	 * @function isOnPage
	 * @param {Number} pageNumber
	 * @return {Boolean}
	 */
	isOnPage:function (pageNumber) {
		return pageNumber == this.getPageNumber();
	},

	/**
	 * Return current page number
	 * @function getPageNumber
	 * @return {Number} page
	 */
	getPageNumber:function () {
        return this.paging ? Math.floor(this.paging.offset / this.paging.size) + 1 : 1;
	},

	/**
	 * Return number of pages
	 * @function getPageCount
	 * @return {Number}
	 */
	getPageCount:function () {
        return this.paging ? Math.ceil(this.getCount() / this.paging.size) : 1;
	},

	getData:function () {
		if (this.hasSearchResult()){
			if (this.paging && this.paging.size) {
				return this.getDataForPage(this.searcher.getData());
			}
			return this.searcher.getData();
		}
		if (!this.paging || this.paging.remotePaging) {
			return this.parent();
		}
		return this.getDataForPage(this.data);
	},

	getDataForPage:function (data) {
		if (!data || data.length == 0)return [];
		var offset = this.paging.initialOffset || this.paging.offset;
		if (offset > data.length) {
			this.toPage(this.getPageCount());
			offset = (this.getPageCount() - 1) * this.paging.size;
		}
		this.resetInitialOffset.delay(200, this);
		return data.slice(offset, Math.min(data.length, offset + this.paging.size));
	},

	resetInitialOffset:function () {
		this.paging.initialOffset = undefined;
	},

	loadComplete:function (data, json) {
		// TODO refactor this
		if (this.paging && json.rows !==undefined)this.paging.rows = json.rows;
		if (this.paging && json.response && json.response.rows !==undefined)this.paging.rows = json.response.rows;
		this.parent(data, json);

		this.fireEvent('count', this.getCount());
		if (this.shouldSortAfterLoad()) {
			this.sort();
		} else {
			this.fireEvent('change');
		}
		if (this.paging !== undefined) {
			this.firePageEvents(true);
		}
	},

	createIndex:function () {
		this.index = {};
		this.indexBranch(this.data);
	},

	indexBranch:function(branch, parent){
		for (var i = 0; i < branch.length; i++) {
			this.indexRecord(branch[i], parent);
			if(branch[i].children && branch[i].children.length)this.indexBranch(branch[i].children, branch[i]);
		}
	},

	indexRecord:function(record, parent){
		if(!this.index)this.createIndex();
		if(parent)record.parentUid = parent.uid;
		var pk = this.getPrimaryKeyIndexFor(record);
		if(pk)this.index[pk] = record;
		if(!record.uid)record.uid = ['uid_', String.uniqueID()].join('');
		this.index[record.uid] = record;
	},

	shouldSortAfterLoad:function(){
		if(this.paging && this.paging.remotePaging)return false;
		return this.sortedBy !== undefined && this.sortedBy.column && this.sortedBy.order;
	},

	/**
	 Filter collection based on given search term. To filter on multiple search terms, you should
	 get a reference to the {{#crossLink "dataSource.CollectionSearch"}}{{/crossLink}} object and
	 use the available {{#crossLink "dataSource.CollectionSearch"}}{{/crossLink}} methods to add
	 multiple search terms.
	 @function Search
	 @param {String} search
	 @example
	 	ludo.get('myCollection').search('New York');
	 	// or with the {{#crossLink "dataSource.CollectionSearch/add"}}{{/crossLink}} method
	 	var searcher = ludo.get('myCollection').getSearcher();
	 	searcher.where('New York').execute();
	 	searcher.execute();
	 */
	search:function (search) {
		this.getSearcher().search(search);
	},

	/**
	 * Executes a remote search for records with the given data
	 * @function remoteSearch
	 * @param {String|Object} search
	 */
	remoteSearch:function(search){
		this.postData = this.postData || {};
		this.postData.search = search;
		this.toPage(1);
		this.load();
	},

	afterSearch:function(){
		var searcher = this.getSearcher();
		this.fireEvent('count', searcher.hasData() ? searcher.getCount() : this.getCount());
		if (this.paging !== undefined) {
			this.paging.offset = 0;
			this.firePageEvents(true);
			this.fireEvent('pageCount', this.getPageCount());
		}
		this.fireEvent('change');
	},

	searcher:undefined,
	/**
	 * Returns a {{#crossLink "dataSource.CollectionSearch"}}{{/crossLink}} object which
	 * you can use to filter a collection.
	 * @function getSearcher
	 * @return {dataSource.CollectionSearch}
	 */
	getSearcher:function () {
		if (this.searcher === undefined) {
			this.searchConfig = this.searchConfig || {};
			var config = Object.merge({
				type:this.searcherType,
				dataSource:this
			}, this.searchConfig);
			this.searcher = ludo._new(config);
			this.addSearcherEvents();
		}
		return this.searcher;
	},

	addSearcherEvents:function(){
		this.searcher.addEvent('search', this.afterSearch.bind(this));
		this.searcher.addEvent('deleteSearch', this.afterSearch.bind(this));
	},

	hasSearchResult:function(){
		return this.searcher !== undefined && this.searcher.hasData();
	},
	/**
	 Return record by id or undefined if not found. Records are indexed by id. This method
	 gives you quick access to a record by it's id. The method returns a reference to the
	 actual record. You can use Object.clone(record) to create a copy of it in case you
	 want to update the record but not make those changes to the collection.
	 @function getById
	 @param {String|Number|Object} id
	 @return {Object} record
	 @example
	 	var collection = new ludo.dataSource.Collection({
	 		url : 'get-countries.php',
	 		primaryKey:'country'
	 	});
	 	var record = collection.getById('Japan'); // Returns record for Japan if it exists.
	 You can also define multiple keys as id
	 @example
		 var collection = new ludo.dataSource.Collection({
			url : 'get-countries.php',
			primaryKey:['id', 'country']
		 });
	   	 var record = collection.getById({ id:1, country:'Japan' });
	 This is especially useful when you have a {{#crossLink "dataSource.TreeCollection"}}{{/crossLink}}
	 where child nodes may have same numeric id as it's parent.
	 @example
	 	{ id:1, type:'country', title : 'Japan',
	 	 	children:[ { id:1, type:'city', title:'Tokyo }]
	 By setting primaryKey to ['id', 'type'] will make it possible to distinguish between countries and cities.
	 */
	getById:function(id){
		if(this.index[id] !== undefined){
			return this.index[id];
		}

		if(this.primaryKey.length===1){
			return this.index[id];
		}else{
			var key = [];
			for(var i=0;i<this.primaryKey.length;i++){
				key.push(id[this.primaryKey[i]]);
			}
			return this.index[key.join('')];
		}
	},

	recordObjects:{},

	/**
	 Returns {{#crossLink "dataSource.Record"}}{{/crossLink}} object for a record.
	 If you want to update a record, you should
	 first get a reference to {{#crossLink "dataSource.Record"}}{{/crossLink}} and then call one
	 of it's methods.
	 @function getRecord
	 @param {String|Object} search
	 @return {dataSource.Record|undefined}
	 @example
		 var collection = new ludo.dataSource.Collection({
			url : 'get-countries.php',
			primaryKey:'country'
		 });
	 	 collection.getRecord('Japan').set('capital', 'tokyo');
	 */
	getRecord:function(search){
		var rec = this.findRecord(search);
		if(rec){
			return this.createRecord(rec);
		}
		return undefined;
	},

	createRecord:function(data){
		var id = data.uid;
		if(!this.recordObjects[id]){
			this.recordObjects[id] = this.recordInstance(data, this);
			this.addRecordEvents(this.recordObjects[id]);
		}
		return this.recordObjects[id];
	},

    recordInstance:function(data){
        return new ludo.dataSource.Record(data, this);
    },

	addRecordEvents:function(record){
		record.addEvent('update', this.onRecordUpdate.bind(this));
		record.addEvent('dispose', this.onRecordDispose.bind(this));
		record.addEvent('select', this.selectRecord.bind(this));
	},

    fireSelect:function(record){
        this.fireEvent('select', record);
    },

	onRecordUpdate:function(record){
		this.indexRecord(record);
		this.fireEvent('update', record);
	},

	onRecordDispose:function(record){
		var branch = this.getBranchFor(record);
		if(branch){
			var index = branch.indexOf(record);
			if(index !== -1){
				branch.splice(index,1);
			}
			this.removeFromIndex(record);
			this.fireEvent('dispose', record);
		}
	},

	getBranchFor:function(record){
		if(record.parentUid){
			var parent = this.findRecord(record.parentUid);
			return parent ? parent.children : undefined;
		}else{
			return this.data;
		}
	},

	removeFromIndex:function(record){
		this.recordObjects[record.uid] = undefined;
		this.index[record.uid] = undefined;
		var pk = this.getPrimaryKeyIndexFor(record);
		if(pk)this.index[pk] = undefined;
	},

	getPrimaryKeyIndexFor:function(record){
		if(this.primaryKey){
			var key = [];
			for(var j=0;j<this.primaryKey.length;j++){
				key.push(record[this.primaryKey[j]]);
			}
			return key.join('');
		}
		return undefined;
	}
});

ludo.factory.registerClass('dataSource.Collection', ludo.dataSource.Collection);/* ../ludojs/src/chart/data-provider.js */
/**
 * Special data source for charts
 * @namespace chart
 * @class DataProvider
 * @augments dataSource.Collection
 */
ludo.chart.DataProvider = new Class({
    Extends:ludo.dataSource.Collection,
    type:'chart.DataProvider',
    sum:undefined,
    recordValues:{},
    records:[],
    startColor:'#561AD9',
    startAngle: 270,
    highlighted:undefined,

    ludoConfig:function (config) {
        this.parent(config);
        this.setConfigParams(config, ['startColor']);
    },

    ludoEvents:function () {
        this.parent();
        this.addEvent('parsedata', this.setRecordValues.bind(this));
        if (this.data) {
            this.setRecordValues();
        }
    },

    get:function (id) {
        return this.getRecord(id);
    },

    setValue:function (id, value) {
        var rec = this.getRecord(id);
        if (rec)rec.setValue(value);
    },

    getValue:function (id) {
        var rec = this.getRecord(id);
        return rec ? rec.get('value') : undefined;
    },

    createIndex:function () {
        this.sum = 0;
        this.parent();
    },

    indexRecord:function (record, parent) {
        this.sum += record.value - (this.recordValues[record.uid] ? this.recordValues[record.uid] : 0);
        this.parent(record, parent);
        this.recordValues[record.uid] = record.value;
        this.createRecord(record);
    },


    getSum:function () {
        return this.sum;
    },

    addRecordEvents:function (record) {
        this.parent(record);
    },

    indexOf:function (record) {
        return this.records.indexOf(record);
    },

    getSumOf:function (start, end) {
        var ret = 0;
        for (var i = 0; i <= end; i++) {
            ret += this.records[i].getValue();
        }
        return ret;
    },

    createRecord:function (data) {
        var rec = this.parent(data);
        if (this.records.indexOf(rec) === -1) {
            this.records.push(rec);
            this.fireEvent('createRecord', rec);
            rec.addEvent('focus', this.focus.bind(this));
            rec.addEvent('blur', this.blur.bind(this));
            rec.addEvent('enter', this.enter.bind(this));
            rec.addEvent('leave', this.leave.bind(this));
        }
        return rec;
    },

    hasRecords:function () {
        return this.records.length > 0;
    },

    getRecords:function () {
        return this.records;
    },

    color:function () {
        return this.getDependency('color', { type:'color.Color' });
    },

    setRecordValues:function () {
        var color = this.startColor;
        var r = this.getRecords();
        for (var i = 0; i < r.length; i++) {
            if (!r[i].get('color')) {
                r[i].set('color', color);
                r[i].set('color-over', this.color().brighten(color, 7));
                color = this.color().offsetHue(this.startColor, (i + 1) * (360 / (r.length + 1)));
            }
        }
    },
    focused:undefined,
    focus:function(record){
        if(this.focused)this.focused.blur();
        this.focused = record;
        this.fireEvent('focus', record);
    },

    blur:function(record){
        this.fireEvent('blur', record);
        this.focused = undefined;
    },

    enter:function(record){
        if(this.highlighted){
            this.highlighted.blur();
        }
        this.fireEvent('enter', record);
        this.highlighted = record;
    },

    leave:function(record){
        this.fireEvent('leave', record);
        this.highlighted = undefined;
    },

    recordInstance:function(data){
        return new ludo.chart.Record(data, this);
    },

	getHighlighted:function(){
		return this.highlighted;
	}
});/* ../ludojs/src/chart/chart.js */
ludo.chart.Chart = new Class({
	Extends: ludo.View,
	css:{

	},

    /**
     * Class providing data to the chart
     * @config {chart.DataProvider} dataProvider
     * @optional
     * @default undefined
     */
    dataProvider:undefined,

	ludoConfig:function(config){
		this.parent(config);
		this.layout.type = 'Canvas';
		this.setConfigParams(config, ['dataProvider']);
        this.css.backgroundColor = '#fff';

        if(!this.dataProvider){
            this.dataProvider = this.createDependency('dataProvider',
                {
                    type : 'chart.DataProvider',
                    data : config.data
                }
            );
        }
	},

	updateChildren:function(){
		for(var i=0;i<this.children.length;i++){
			if(this.children[i].rendered && this.children[i].update)this.children[i].onResize();
		}
	},

	getRecords:function(){
		return this.dataProvider.getRecords();
	},

    getDataProvider:function(){
        return this.dataProvider;
    },

    resize:function(config){
        this.parent(config);
        this.updateChildren();
    }
});/* ../ludojs/src/chart/fragment.js */
ludo.chart.Fragment = new Class({
    Extends:ludo.Core,
    record:undefined,
    nodes:[],

    rendering:{},

    ludoConfig:function (config) {
        this.parent(config);
        this.setConfigParams(config, ['record','parentComponent']);
        this.createNodes();
    },

    createNodes:function(){

    },

    ludoEvents:function(){
        this.parent();
        this.getParent().dataProvider().addEvent('update', this.update.bind(this));

        this.record.addEvent('focus', this.focus.bind(this));
        this.record.addEvent('blur', this.blur.bind(this));
        this.record.addEvent('enter', this.enter.bind(this));
        this.record.addEvent('leave', this.leave.bind(this));
    },

    getParent:function(){
        return this.parentComponent;
    },

    createNode:function(tagName, properties, text){
        var node;

        node = new ludo.canvas.Node(tagName, properties, text);

        this.dependency['node-' + this.nodes.length] = node;
        this.nodes.push(node);

        if(node.mouseenter != undefined){
            node.mouseenter(this.record.enter.bind(this.record));
            node.mouseleave(this.record.leave.bind(this.record));
        }else{
            node.on('mouseenter', this.record.enter.bind(this.record));
            node.on('mouseleave', this.record.leave.bind(this.record));

        }
        node.on('click', this.record.click.bind(this.record));

        node.css('cursor','pointer');

        this.getParent().append(node);

		this.relayEvents(node, ['mouseenter','mouseleave']);

        return node;
    },

    createStyle:function(styles){
        var p = new ludo.canvas.Paint(styles);
        this.getCanvas().appendDef(p);
        return p;
    },

    highlight:function(){

    },

    update:function(){
        // animate new size
    },

    click:function(){
        this.clicked = true;
    },

    getCanvas:function(){
        return this.getParent().getParent().getCanvas();
    },

    storeRendering:function(rendering){
        this.rendering = rendering;
    },

    focus:function(){

    },

    blur:function(){

    },

    enter:function(){

    },

    leave:function(){

    },

    getRecord:function(){
        return this.record;
    }
});/* ../ludojs/src/canvas/group.js */
/**
 * Special SVG 'g' element which can be positioned and
 * sized using the layout.Canvas layout model.
 * @namespace canvas
 * @class Group
 */
ludo.canvas.Group = new Class({
    Extends:ludo.canvas.View,
    tag:'g',
    layout:{},

    ludoConfig:function (config) {
        this.parent(config);
        this.setConfigParams(config, ['layout', 'renderTo', 'parentComponent']);
        if (this.renderTo) {
            this.renderTo.append(this);
        }

        if (config.css) {
            this.node.css(this.css);
        }
    },

    resize:function (coordinates) {
        if (coordinates.width) {
            this.width = coordinates.width;
            this.set('width', coordinates.width + 'px');
        }
        if (coordinates.height) {
            this.height = coordinates.height;
            this.set('height', coordinates.height + 'px');
        }
    },

    getSize:function () {
        return {
            x:this.width || this.renderTo.width(),
            y:this.height || this.renderTo.height()
        }
    },

    isHidden:function () {
        return false;
    }
});/* ../ludojs/src/chart/base.js */
ludo.chart.Base = new Class({
    Extends:ludo.canvas.Group,
    fragments:[],
    fragmentType:'chart.Fragment',
    /**
     * Reference to current highlighted record
     * @property {dataSource.Record} record
     * @private
     */
    highlighted:undefined,
    focused:undefined,
    animation:{
        duration:1,
        fps:33
    },

    addOns:undefined,

    fragmentMap:{},

    rendered:false,

    ludoConfig:function (config) {
        this.parent(config);
        this.setConfigParams(config, ['animation']);

        this.create.delay(50, this);
    },

    ludoEvents:function () {
        this.parent();
        var dp = this.dataProvider();
        dp.addEvent('createRecord', this.createFragment.bind(this));
        dp.addEvent('update', this.update.bind(this));
    },

    createFragments:function () {
        var records = this.getRecords();
        for (var i = 0; i < records.length; i++) {
            this.createFragment(records[i]);
        }
    },

    createFragment:function (record) {
        var f = this.createDependency('fragment' + this.fragments.length,
            {
                type:this.fragmentType,
                record:record,
                parentComponent:this
            });

        this.fragmentMap[record.getUID()] = f;
        this.fragments.push(f);

		//this.relayEvents(f, ['mouseenter','mouseleave']);

        return f;
    },

    getFragments:function () {
        return this.fragments;
    },

    getParent:function () {
        return this.parentComponent;
    },

    getRecords:function () {
        return this.getParent().getDataProvider().getRecords();
    },

    dataProvider:function () {
        return this.parentComponent.getDataProvider();
    },

    getCenter:function () {
        var size = this.getSize();
        
        return {
            x:size.x / 2,
            y:size.y / 2
        }
    },

    getRadius:function () {
        var c = this.getCenter();
        return Math.min(c.x, c.y);
    },

    create:function(){

        if(this.dataProvider().hasRecords()){
            this.createFragments();
        }
        this.render();
        this.rendered = true;
    },

    render:function () {

    },

    update:function (record) {
        this.fireEvent('update', record);
    },

    getFragmentFor:function(record){
        return this.fragmentMap[record.getUID()];
    },

    onResize:function(){

    },

	getCanvas:function(){
		return this.parentComponent.getCanvas();
	},

    getSquareSize:function(){
        var size = this.getSize();
        return Math.min(size.x, size.y);
    }
});/* ../ludojs/src/chart/pie-slice.js */
ludo.chart.PieSlice = new Class({
    Extends:ludo.chart.Fragment,

    createNodes:function(){
        var style = this.createStyle(this.getSliceStyle());
        this.createNode('path', { "class":style });
    },
    getSliceStyle:function () {
        return {
            'stroke-location':'inside',
            'fill':this.record.get('color'),
            'stroke-linejoin':'round',
            'stroke':'#ffffff',
            'cursor':'pointer'
        };
    },

    set:function (radius, angle, degrees) {
        this.nodes[0].set('d', this.getPath({
            radius:radius, angle:angle, degrees:degrees
        }));
    },

    getPath:function (config) {

        var center = config.center || this.getParent().getCenter();
        
        var path = ['M ' + center.x + ' ' + center.y];

        if(config.angle > 360) config.angle -= 360;

        var point1 = ludo.canvasEngine.getPointAtDegreeOffset(center, config.angle, config.radius);

        path.push('L ' + point1.x + ' ' + point1.y);
        path.push('M ' + point1.x + ' ' + point1.y);

        path.push('A ' + config.radius + ' ' + config.radius);
        path.push('0');
        path.push(config.degrees > 180 ? '1' : '0');
        path.push('1');

        var point2 = ludo.canvasEngine.getPointAtDegreeOffset(center, config.angle + config.degrees, config.radius);
        path.push(point2.x + ' ' + point2.y);
        path.push('L ' + center.x + ' ' + center.y);

        this.storeRendering(config);

        return path.join(' ');
    },

    focus:function(){
        var coords = this.centerOffset(this.getParent().getHighlightSize());
        this.node().engine().effect().fly(this.node().getEl(), coords.x, coords.y,.1);
    },

    blur:function(){
        this.node().engine().effect().flyBack(this.node().getEl(),.1);
    },

    node:function(){
        return this.nodes[0];
    },

    centerOffset:function(offset){
        var angle = this.record.getAngle() + (this.record.getDegrees() / 2 );
        return ludo.canvasEngine.getPointAtDegreeOffset({ x:0, y: 0}, angle, offset);
    },

    enter:function(){
        this.nodes[0].css('fill', this.record.get('color-over'));
    },

    leave:function(){
        this.nodes[0].css('fill', this.record.get('color'));
    },

    update:function(){
        var radius = this.getParent().getRadius();


        if(Math.round(radius) == Math.round(this.rendering.radius) && this.rendering.angle == this.record.getAngle() && this.rendering.degrees == this.record.getDegrees()){
            return;
        }

        var e = new ludo.canvas.Effect();

        var config = e.getEffectConfig(
            [this.rendering.radius,this.rendering.angle, this.rendering.degrees ],
            [radius, this.record.getAngle(), this.record.getDegrees()],
            1
        );

        config.center = this.getParent().getCenter();

        this.executeAnimation(config, 0);

    },

    executeAnimation:function(config, step){
        this.nodes[0].set('d', this.getPath(
            {
                radius : this.rendering.radius,
                angle: this.rendering.angle + config.steps[1],
                degrees : this.rendering.degrees + config.steps[2],
                center : config.center
            }

        ));
        if(step < config.count -1){
            this.executeAnimation.delay(33, this, [config, step+1]);
        }
    }
});/* ../ludojs/src/chart/pie.js */
/**
 Class for pie charts.
 @namespace chart
 @class Pie
 @example
     // Create data source for the pie chart.
     var provider = new ludo.chart.DataProvider({
            data:[
                { label:'John', value:100 },
                { label:'Jane', value:245 },
                { label:'Martin', value:37 },
                { label:'Mary', value:99 },
                { label:'Johnny', value:127 },
                { label:'Catherine', value:55 },
                { label:'Tommy', value:18 }
            ]
        }
     );

     var w = new ludo.Window({
            title:'Pie chart',
            layout:{
                width:700,
                height:500,
                left:20,
                top:20,
                type:'tab'
            },
            css:{
                'background-color':'#fff',
                'border-top':0
            },
            children:[
                {
                    title:'Chart',
                    layout:{
                        type:'relative'
                    },
                    children:[
                        {
                            name : 'form',
                            layout:{
                                alignParentRight:true,
                                width:200,
                                fillDown:true,
                                type:'linear',
                                orientation:'vertical'
                            },
                            form:{
                                listeners:{
                                    'change': function(manager){
                                        var data = provider.getData();
                                        var values = manager.getValues();
                                        var i = 0;
                                        var records = provider.getRecords();

                                        for(var key in values){
                                            if(values.hasOwnProperty(key)){
                                                records[i].setValue(parseInt(values[key]));
                                            }
                                            i++;
                                        }
                                    }
                                }
                            },
                            children:[
                                { type:'form.Text', minValue:5, required:true, name:'item0', label:'John', value:100, color:'#000088' },
                                { type:'form.Text', minValue:5, required:true, label:'Jane', value:245 },
                                { type:'form.Text', minValue:5, required:true, label:'Martin', value:37 },
                                { type:'form.Text', minValue:5, required:true, label:'Mary', value:99 },
                                { type:'form.Text', minValue:5, required:true, label:'Johnny', value:127 },
                                { type:'form.Text', minValue:5, required:true, label:'Catherine', value:55 },
                                { type:'form.Text', minValue:5, required:true,  label:'Tommy', value:18 }
                            ]
                        },
                        {

                            layout:{
                                top:0,
                                fillLeft:true,
                                fillDown:true,
                                leftOf:'form'
                            },
                            css:{
                                'border-right' : '1px solid #d7d7d7'
                            },
                            type:'chart.Chart',
                            id:'chart',
                            dataProvider:provider,
                            children:[
                                {
                                    name : 'pie',
                                    type:'chart.Pie',
                                    id:'pie',
                                    animate:true,
                                    layout:{
                                        above:'labels',
                                        left:0,
                                        fillRight:true,
                                        fillUp:true
                                    },
                                    addOns:[
                                        {
                                            type:'chart.PieSliceHighlighted'
                                        }
                                    ]
                                },
                                {
                                    name:'labels',
                                    id:'labels',
                                    type:'chart.Labels',
                                    layout:{
                                        alignParentBottom:true,
                                        height:40,
                                        left:0,
                                        fillRight:true
                                    }
                                }
                            ]
                        }
                    ]
                }
                ,
                {
                    type:'SourceCodePreview'
                }
            ]
        });
 */
ludo.chart.Pie = new Class({
    Extends:ludo.chart.Base,
    fragmentType:'chart.PieSlice',
    rendered:false,

    /**
     Array of add-ons for the pie chart
     @config {Array} addOns
     @example
         addOns:[
             {
                 type:'chart.PieSliceHighlighted'
             }
         ]
     */
    addOns:[],

    highlightSize:10,

    ludoConfig:function(config){
        this.parent(config);
        this.setConfigParams(config, ['highlightSize']);
    },

    getHighlightSize:function(){
        return this.highlightSize;
    },

    render:function(){
        this.animate();
    },

    getRadius:function(){
        return this.parent() - 20;
    },

    animate:function(){
        var e = new ludo.canvas.Effect();
        var r = this.getRecords();

        var radius = e.getEffectConfig([0], [this.getRadius()], 1);
        var degrees = [];
        var currentDegrees = [];

        for(var i=0;i< r.length;i++){
            degrees.push(e.getEffectConfig([0], [r[i].getDegrees()], 1).steps[0]);
            currentDegrees.push(0);
        }
        this.rendered = false;
        this.executeAnimation({
            startAngle:this.dataProvider().startAngle,
            radius: radius.steps[0],
            currentRadius:0,
            degrees: degrees,
            currentDegrees:currentDegrees,
            count: radius.count
        }, 0);
    },

    executeAnimation:function(config, currentStep){
        config.currentRadius += config.radius;

        var angle = config.startAngle;
        for(var i=0;i<config.degrees.length;i++){
            config.currentDegrees[i] += config.degrees[i];
            this.fragments[i].set(config.currentRadius, angle, config.currentDegrees[i]);
            angle += config.currentDegrees[i];

        }
        if(currentStep < config.count - 1){
            this.executeAnimation.delay(33, this, [config, currentStep +1]);
        }else{
            this.rendered = true;
        }
    },

    update:function(){
        if(!this.rendered){
            this.render();
        }
    },

    onResize:function(){
        if(!this.rendered){
            return;
        }
        var r = this.getRecords();
        var radius = this.getRadius();

        for(var i=0;i< r.length;i++){
            this.fragments[i].set(radius, r[i].getAngle(), r[i].getDegrees());
        }
    }
});/* ../ludojs/src/chart/labels.js */
/**
 * Class displaying labels for a chart. See
 * {{#crossLink "chart/Pie"}}{{/crossLink}} for example on how to add labels
 * to your chart. How labels are displayed(side by side or beneath each other)
 * depends on the orientation attribute OR
 * the size of the area assigned to the labels. You can set orientation to
 * "vertical" or "horizontal". If orientation is not set and width is greater
 * than height, the labels will be displayed vertically. If height is greater
 * than width, the labels will be rendered vertically.
 * @namespace chart
 * @class Labels
 */
ludo.chart.Labels = new Class({
    Extends:ludo.chart.Base,

    fragmentType:'chart.Label',

    /**
     Styling options for text
     @config {Object} textStyles
     @example
        textStyles:{
            'font-size' : '14px',
            'font-weight' : 'normal'
        }
     @default { fill:'#000000', 'font-size' : '13px', 'font-weight' : 'normal' }
     */
    textStyles:undefined,
    /**
     Styling options for text of labels for highlighted chart items.
     @config {Object} textStylesOver
     @example
        textStylesOver:{
            'fill' : '#000',
            'font-weight' : 'bold'
        }
     @default { 'font-weight': 'bold' }

     */
    textStylesOver:undefined,

    /**
     Styling of color box displayed left of text label. The box will always
     be displayed in the same color as the chart item it's representing.
     @config {Object} boxStyles
     @default undefined
     @example
        boxStyles:{ 'stroke' : '#000' }
     */
    boxStyles:undefined,

    /**
     Styling of color box when highlighted. By default fill will be set to a slightly brighter color
     than the chart item it's representing.
     @config {Object} boxStylesOver
     @default undefined
     @example
        boxStylesOver:{
            'stroke-width' : 1,
            'stroke' : '#000'
        }
     */
    boxStylesOver:undefined,

    /**
     * Orientation of labels. If not set, orientation will be set automatically
     * base on space allocated to the labels. When width is greater than height, the
     * labels will be displayed horizontally, side by side. Otherwise, they will be
     * displayed vertically.
     * @config {String} orientation
     * @default undefined
     */
    orientation:undefined,

    ludoConfig:function(config){
        this.parent(config);
        this.setConfigParams(config, ['orientation', 'textStyles', 'boxStyles', 'textStylesOver','boxStylesOver']);
    },

    render:function(){
        this.onResize();
    },

    onResize:function(){
        if(!this.fragments.length){
            return;
        }
        var size = this.getSize();
		this[this.orientation === 'horizontal' || size.x > size.y ? 'resizeHorizontal' : 'resizeVertical']();
    },

    resizeHorizontal:function(){
        var left = [];
        var size = this.getSize();
        var totalWidth = 0;
        for(var i=0;i<this.fragments.length;i++){
            var fSize = this.fragments[i].getSize();
            var width = fSize.x + 12;
            left.push(totalWidth);
            totalWidth += width;
        }

        var offset = (size.x - totalWidth) / 2;
        var offsetY = (size.y - this.fragments[0].getSize().y) / 2;
        for(i=0;i<this.fragments.length;i++){
            this.fragments[i].node().translate(left[i] + offset, offsetY);
        }
    },

    resizeVertical:function(){
        var top = [];
        var size = this.getSize();
        var totalHeight = 0;
        for(var i=0;i<this.fragments.length;i++){
            var fSize = this.fragments[i].getSize();
            var height = fSize.y + 3;
            top.push(totalHeight);
            totalHeight += height;
        }

        var offset = (size.y - totalHeight) / 2;

        for(i=0;i<this.fragments.length;i++){
            this.fragments[i].node().translate(2, top[i] + offset);
        }
    }
});/* ../ludojs/src/chart/label.js */
ludo.chart.Label = new Class({
    Extends:ludo.chart.Fragment,



    createNodes:function () {
        var g = this.createNode('g');

        this.bg = new ludo.canvas.Rect({
            x:0, y:0, width:10, height:10
        });
        this.bg.css('fill', '#fff');
        this.bg.css('fill-opacity', '0');
        g.append(this.bg);

        var colorBoxCoords = this.getCoordinatesForColorBox();
        this.colorBox = new ludo.canvas.Rect(colorBoxCoords);
        g.append(this.colorBox);


        this.colorBox.setStyles(this.getBoxStyles());


        this.textNode = new ludo.canvas.Text(this.record.getLabel(), {
            x:colorBoxCoords.x + colorBoxCoords.width + 3, y : this.getYForText()
        });
        this.textNode.setStyles(this.getTextStyles());
        g.append(this.textNode);
        this.setSize();

        this.bg.set('width', this.size.x);
        this.bg.set('height', this.size.x);
    },

    getFontSize:function(){
        var t = this.getTextStyles();
        return t['font-size'] ? parseInt(t['font-size']) : 13;
    },

    getYForText:function(){
        return Math.floor(this.getFontSize() * .9);
    },

    getCoordinatesForColorBox:function(){
        var fontSize = this.getFontSize();
        var size = Math.round(fontSize);
        return {
            x : 0,
            y : fontSize - size,
            width : size,
            height: size
        };
    },

    setSize:function () {
        this.size = this.nodes[0].getSize();
    },

    getSize:function () {
        return this.size;
    },

    node:function () {
        return this.nodes[0];
    },

    getBoxStyles:function () {
        var ret = this.getParent().boxStyles || {};
        ret.fill = this.record.get('color');
        return ret;
    },

    getTextStyles:function () {
        return this.getParent().textStyles || {
            'font-size':'13px',
            'font-weight' : 'normal'
        };
    },

    getTextStylesOver:function () {
        return this.getParent().textStylesOver || { 'font-weight':'bold' };
    },

    getBoxStylesOver:function(){
        var ret = this.getParent().boxStylesOver || {  };
        if(!ret['fill'])ret['fill'] = this.record.get('color-over');
        return ret;
    },

    enter:function () {
        this.textNode.setStyles(this.getTextStylesOver());
        this.colorBox.setStyles(this.getBoxStylesOver());
    },

    leave:function () {
        this.textNode.setStyles(this.getTextStyles());
        this.colorBox.setStyles(this.getBoxStyles());
    }
});/* ../ludojs/src/chart/add-on.js */
ludo.chart.AddOn = new Class({
    Extends: ludo.Core,

    ludoConfig:function(config){
        this.parent(config);
        this.parentComponent = config.parentComponent;
    },

    getParent:function(){
        return this.parentComponent;
    }
});/* ../ludojs/src/chart/pie-slice-highlighted.js */
/**
 Add-on for Pie chart. This add-on highlights slices in a pie chart by showing a larger slice behind
 current highlighted chart slice.
 See {{#crossLink "chart/Pie"}}{{/crossLink}} for example of use.
 @namespace chart
 @class PieSliceHighlighted
 @type {Class}
 @example
    {
        type:'pie.Chart',
        addOns:[
            {
                type:'chart.PieSliceHighlighted',
                size : 5,
                styles:{
                    'fill' : '#aabbcc'
                }
            }
        ]
        ...
        ...
    }
 */
ludo.chart.PieSliceHighlighted = new Class({
    Extends:ludo.chart.AddOn,
    tagName:'path',
    /**
     Styling of slice
     @config {Object} styles
     @default { 'fill' : '#ccc' }
     @example
        styles:{
            'fill' : '#f00'
        }
     */
    styles:undefined,

    /**
     * Size of slice
     * @config {Number} size
     * @default 5
     */
    size : 5,

    ludoConfig:function (config) {
        this.parent(config);

        this.setConfigParams(config, ['styles','size']);

        this.node = new ludo.canvas.Path();
        if(this.styles){
            this.node.css(this.styles);
        }else{
            this.node.css('fill-opacity' , .3);
        }

        this.getParent().append(this.node);
        this.node.toBack();
    },

    ludoEvents:function () {
        this.parent();
        var p = this.getParent().dataProvider();
        p.addEvents({
            'enter' : this.show.bind(this),
            'leave' : this.hide.bind(this),
            'focus' : this.focus.bind(this),
            'blur' : this.blur.bind(this)
        });
    },

    show:function (record) {
        if(!this.getParent().rendered)return;

        var f = this.getParent().getFragmentFor(record);

        var path = f.getPath({
            radius:this.getParent().getRadius() + this.size,
            angle:record.getAngle(),
            degrees:record.getDegrees()
        });
        this.node.set('d', path);
        if(!this.styles){
            this.node.setStyles({ fill : record.get('color')});
        }
        if (record.isFocused()) {
            var t = f.nodes[0].getTranslate();
            this.node.translate(t);
        }else{
            this.node.translate(0,0);
        }
        this.node.show();
    },

    hide:function () {
        this.node.hide();
    },

    focus:function (record) {
        var f = this.getParent().getFragmentFor(record);
        var coords = f.centerOffset(this.getParent().getHighlightSize());
        this.node.translate(0,0);
        this.node.engine().effect().fly(this.node.getEl(), coords.x, coords.y,.1);
    },

    blur:function(){
        this.node.engine().effect().flyBack(this.node.getEl(),.1);
    }
});/* ../ludojs/src/canvas/paint.js */
/**
 Class for styling of SVG DOM nodes
 @namespace canvas
 @class Paint
 @constructor
 @param {Object} config
 @example
 	var canvas = new ludo.canvas.Canvas({
		renderTo:'myDiv'
 	});

 	var paint = new ludo.canvas.Paint({
		'stroke-width' : 5,
		'stroke-opacity' : .5,
		'stroke-color' : '#DEF'
	}, { className : 'MyClass' );
 	canvas.appendDef(paint); // Appended to &lt;defs> node

 	// create node and set "class" to paint
 	// alternative methods:
 	// paint.applyTo(node); and
 	// node.addClass(paint.getClassName());
	var node = new ludo.canvas.Node('rect', { id:'myId2', 'class' : paint});

 	canvas.append(node);

 	// Paint object for all &lt;rect> and &lt;circle> tags:

	var gradient = new ludo.canvas.Gradient({
        id:'myGradient'
    });
    canvas.append(gradient);
    gradient.addStop('0%', '#0FF');
    gradient.addStop('100%', '#FFF', 0);
    // New paint object applied to all &lt;rect> and &lt;circle> tags.
 	var paint = new ludo.canvas.Paint({
		'stroke-width' : 5,
		'fill' : gradient,
		'stroke-opacity' : .5,
		'stroke-color' : '#DEF'
	}, { selectors : 'rect, circle' );
 */

ludo.canvas.Paint = new Class({
	Extends:ludo.canvas.Node,
	tagName:'style',
	css:{},
	nodes:[],
	className:undefined,
	tag:undefined,
	cssPrefix : undefined,

	mappings:{
		'color':['stroke-color'],
		'background-color':['fill-color'],
		'opacity':['fill-opacity', 'stroke-opacity']
	},

	initialize:function (css, config) {
		config = config || {};
		this.className = config.className || 'css-' + String.uniqueID();
		this.cssPrefix = config.selectors ? config.selectors : '.' + this.className;
		if(config.selectors)delete config.selectors;
		if(config.className)delete config.className;
		this.parent(this.tagName, config);
		if (css !== undefined)this.setStyles(css);
	},

	setStyles:function (styles) {
		Object.each(styles, function (value, key) {
			this.setStyleProperty(key, value);
		}, this);
		this.updateCssContent();
	},

	/**
	 Update a css style
	 @function setStyle
	 @param {String} style
	 @param {String|Number}value
	 @example
	 	var paint = new ludo.canvas.Paint({
	 		css:{
	 			'stroke-opacity' : 0.5
	 		}
	 	});
	 	canvas.append(paint);
	 	paint.setStyle('stroke-opacity', .2);
	 */
	setStyle:function (style, value) {
		this.setStyleProperty(style, value);
		this.updateCssContent();
	},

	updateCssContent:function () {
		var css = JSON.stringify(this.css);
		css  = css.replace(/"/g,"");
		css  = css.replace(/,/g,";");
		this.text(this.cssPrefix + css);
	},

	setStyleProperty:function (style, value) {
		value = this.getRealValue(value);
		if (this.mappings[style]) {
			this.setMapped(style, value);
		} else {
			this.css[style] = value;
		}
	},

	setMapped:function (style, value) {
		for (var i = 0; i < this.mappings[style].length; i++) {
			var m = this.mappings[style][i];
			this.css[m] = value;
		}
	},

	/**
	 * Return value of a css style
	 * @function getStyle
	 * @param {String} style
	 * @return {String|Number} value
	 */
	getStyle:function (style) {
		if (this.mappings[style])style = this.mappings[style][0];
		return this.css[style];
	},

	getRealValue:function (value) {
		return value && value.id !== undefined ? 'url(#' + value.id + ')' : value;
	},

	/**
	 * Apply css to a SVG node. This is done by adding CSS class to the node
	 * @function applyTo
	 * @param {canvas.Node} node
	 */
	applyTo:function (node) {
		ludo.canvasEngine.addClass(node.el ? node.el : node, this.className);
	},

	/**
	 * Returns class name of Paint object
	 * @function getClassName
	 * @return {String} className
	 */
	getClassName:function () {
		return this.className;
	},

	getUrl:function(){
		return this.className;
	}
});
/* ../ludojs/src/canvas/named-node.js */
/**
 * Super class for canvas.Circle, canvas.Rect +++
 * @namespace canvas
 * @class NamedNode
 */
ludo.canvas.NamedNode = new Class({
	Extends: ludo.canvas.Node,

	initialize:function (attributes, text) {
        attributes = attributes || {};
		if(attributes.listeners){
			this.addEvents(attributes.listeners);
			delete attributes.listeners;
		}
		this.parent(this.tagName, attributes, text);
	}
});/* ../ludojs/src/canvas/rect.js */
/**
 Class for rect tags. It extends canvas.Node by adding setter and getter methods
 for x,y, width, height and rounded corners(rx and ry).
 @namespace canvas
 @class Rect
 @augments canvas.Node
 @constructor
 @param {Object} coordinates
 @param {canvas.NodeConfig} config
 @example
	 var rect = new ludo.canvas.Rect(
 		{ x:100,y:100, width:200,height:100, "class":paintObject }
 	 );
 */
ludo.canvas.Rect = new Class({
	Extends: ludo.canvas.NamedNode,
	tagName : 'rect',

	/**
	 * Returns value of 'x' attribute. Actual position on canvas may be different due to
	 * translate transformation. Use {{#crossLink "canvas.Rect/getPosition"}}{{/crossLink}} to
	 * get actual position on canvas.
	 * @function getX
	 * @return {Number} x
	 */
	getX:function(){
		return this.el.x.animVal.value;
	},

	/**
	 * Returns value of 'y' attribute.
	 * @function getY
	 * @return {Number} y
	 */
	getY:function(){
		return this.el.y.animVal.value;
	},

	/**
	 * Returns width of rectangle
	 * @function getWidth
	 * @return {Number} width
	 */
	getWidth:function(){
		return this.el.width.animVal.value;
	},

	/**
	 * Returns height of rectangle
	 * @function getWidth
	 * @return {Number} width
	 */
	getHeight:function(){
		return this.el.height.animVal.value;
	},
	/**
	 * Return x-size of rounded corners
	 * @function getRx
	 * @return {Number} rx
	 */
	getRx:function(){
		return this.el.rx.animVal.value;
	},

	/**
	 * Return y-size of rounded corners
	 * @function getRy
	 * @return {Number} ry
	 */
	getRy:function(){
		return this.el.ry.animVal.value;
	},

	/**
	 * Set new x coordinate
	 * @function setX
	 * @param {Number} x
	 */
	setX:function(x){
		this.set('x', x);
	},

	/**
	 * Set new y coordinate
	 * @function setY
	 * @param {Number} y
	 */
	setY:function(y){
		this.set('y', y);
	},

	/**
	 * Set new width
	 * @function setWidth
	 * @param {Number} width
	 */
	setWidth:function(width){
		this.set('width', width);
	},
	/**
	 * Set new height
	 * @function setHeight
	 * @param {Number} height
	 */
	setHeight:function(height){
		this.set('height', height);
	},

	/**
	 * Set new width of rounded corners
	 * @function setRx
	 * @param {Number} rx
	 */
	setRx:function(rx){
		this.set('rx', rx);
	},

	/**
	 * Set new height of rounded corners
	 * @function setRy
	 * @param {Number} ry
	 */
	setRy:function(ry){
		this.set('ry', ry);
	}


});/* ../ludojs/src/canvas/text-box.js */
/**
 * Text box class which handles simple HTML tags
 * and renders them in SVG format.
 * @namespace canvsa
 * @class TextBox
 */
ludo.canvas.TextBox = new Class({
    Extends:ludo.canvas.Group,
    tag:'g',
    text:undefined,
    css:{
        'line-height':13
    },
    presentationAttributes:['x', 'y', 'width', 'height'],
    currentY:0,

    tags:{
        '<br>':'text'
    },

    ludoConfig:function (config) {
        config = config || {};
        config.attr = this.getAttributes(config);
        this.parent(config);
        this.text = config.text;
        if (config.css)this.css = config.css;

        if(this.text){
			this.renderText();
		}
    },

    getAttributes:function (config) {
        var ret = config.attr || {};
        var p = this.presentationAttributes;
        for (var i = 0; i < p.length; i++) {
            if (config[p[i]] !== undefined) {
                ret[p[i]] = config[p[i]];
            }
        }
        return ret;
    },

    tagsToInsert:function () {
        var texts = this.getTextParts();
        return this.toTags(texts);
    },

    getTextParts:function () {
        var tokens = this.text.match(/(<\/?[a-z]+?>)/gmi);
		if(!tokens)return [this.text];
        var index = 0;

        var ret = [];
        for (var i = 0; i < tokens.length; i++) {
            var pos = this.text.indexOf(tokens[i], index === 0 ? index : index + 1);
            if (pos > index) {
                ret.push(this.text.substr(index, pos - index));
            }
            index = pos;
        }
        if (index < this.text.length) {
            ret.push(this.text.substr(index));
        }

        return ret;
    },

    toTags:function (items) {
        var ret = [
            {
                tag:'text',
                properties:{ y:this.getYOfLine() }
            }
        ];
        var currentParent = ret[0];

        for (var i = 0; i < items.length; i++) {
            var tag = items[i].match(/<([a-z]+?)>/gi);
            if (tag)tag = tag[0];

            var obj = {
                properties:{}
            };

            obj.tag = this.tags[tag] ? this.tags[tag] : 'tspan';


            obj = this.assignDefaultProperties(obj, tag);


            obj.text = this.stripTags(items[i]);
            if (obj.tag === 'tspan') {
                currentParent.children = currentParent.children || [];
                currentParent.children.push(obj);
            } else {
                ret.push(obj);
            }
            if (obj.tag === 'text') {
                obj.properties.y = this.getYOfLine();
                currentParent = obj;
            }
        }

        return ret;
    },

    assignDefaultProperties:function (obj, tag) {
        if (tag) {
            var props = this.getDefaultTagProperties();
            var p = props[tag];
            if (p) {
                for (var key in p) {
                    if (p.hasOwnProperty(key))obj.properties[key] = p[key];
                }
            }
        }
        return obj;

    },


    getYOfLine:function () {
        this.currentY += 15;
        return this.currentY;
    },

    setText:function (text) {
		this.currentY = 0;
        this.empty();
        this.text = text;
        this.renderText();
    },

    renderText:function () {
        this.renderItems(this.tagsToInsert(), this);
    },

    renderItems:function (items, parent) {
        for (var i = 0; i < items.length; i++) {
            var n = new ludo.canvas.Node(items[i].tag, items[i].properties, items[i].text);
            parent.append(n);

            if (items[i].children) {
                this.renderItems(items[i].children, n);
            }
        }
    },


    stripTags:function (text) {
        return text.replace(/<\/?[^>]+?>/g, '');
    },

    getDefaultTagProperties:function () {
        return {
            '<b>':{ 'font-weight':'bold' },
            '<em>':{ 'font-style':'italic' }
        };
    }

});/* ../ludojs/src/chart/tooltip.js */
ludo.chart.Tooltip = new Class({
	Extends:ludo.chart.AddOn,
	tpl:'{label}: {value}',
	shown:false,

	offset:{
		x:0, y:0
	},

	size:{
		x:0,y:0
	},

	/**
	 * Styling of box where the tooltip is rendered
	 * @config {Object} boxStyles
	 * @default { "fill":"#fff", "fill-opacity":.8, "stroke-width" : 1, "stroke-location": "inside" }
	 */
	boxStyles:{},

	/**
	 * Overall styling of text
	 * @config {Object} textStyles
	 * @default { "fill" : "#000" }
	 */
	textStyles:{},

	ludoConfig:function (config) {
		this.parent(config);
		this.setConfigParams(config, ['tpl','boxStyles','textStyles']);
		this.createDOM();

		this.getParent().addEvents({
			'mouseenter':this.show.bind(this),
			'mouseleave':this.hide.bind(this)
		});

		this.getParent().getNode().on("mouseenter", this.show.bind(this));
		this.getParent().getNode().on("mouseleave", this.hide.bind(this));
		this.getParent().getNode().on('mousemove', this.move.bind(this));
	},

	createDOM:function () {
		this.node = new ludo.canvas.Node('g');
		this.getParent().append(this.node);
		this.node.hide();
		this.node.toFront.delay(50, this.node);

		this.rect = new ludo.canvas.Rect({ x:0, y:0, rx:2, ry:2 });
		this.rect.css(this.getBoxStyling());

		this.node.append(this.rect);

		this.textBox = new ludo.canvas.TextBox();
		this.textBox.getNode().translate(4, 0);
		this.textBox.getNode().css(this.getTextStyles());
		this.node.append(this.textBox);
	},

	getBoxStyling:function(){
		var ret = this.boxStyles || {};
		if(!ret['fill'])ret['fill'] = '#fff';
		if(!ret['stroke-location'])ret['stroke-location'] = 'inside';
		if(ret['fill-opacity'] === undefined)ret['fill-opacity'] = .8;
		if(ret['stroke-width'] === undefined)ret['stroke-width'] = 1;
		return ret;
	},

	getTextStyles:function(){
		var ret = this.textStyles || {};
		if(!ret['fill'])ret['fill'] = '#000';
		return ret;
	},
	
	show:function (e) {

		var rec = this.getRecord();
		if(rec == undefined){
			this.hide();
			return;
		}

		this.node.show();
		this.shown = true;

		this.offset = this.getParent().getParent().getBody().position();

		this.textBox.setText(this.getParsedHtml());

		this.rect.css('stroke', this.getRecord().get('color'));

		this.size = this.textBox.getNode().getSize();
		this.size.x +=7;
		this.size.y +=10;
		this.rect.set('width', this.size.x);
		this.rect.set('height', this.size.y);

		this.rect.show();

		this.move(e);
	},

	hide:function () {
		this.node.hide();
		this.rect.hide();
		this.shown = false;
	},

	move:function (e) {
		if (this.shown) {
			var pos = {
				x:e.pageX - this.offset.left - this.size.x - 10,
				y:e.pageY - this.offset.top - this.size.y - 5
			};
			if(pos.x < 0)pos.x += (this.size.x + 20);
			if(pos.y < 0)pos.y += (this.size.y + 10);
			this.node.translate(pos.x, pos.y);
		}
	},

	getParsedHtml:function () {
		var match = this.tpl.match(/\{(.*?)\}/gm);
		var ret = this.tpl;

		var rec = this.getRecord();

		for(var i=0;i<match.length;i++){
			var key = match[i].substr(1, match[i].length-2);
			var method = 'get' + key.substr(0,1).toUpperCase() + key.substr(1);

			var val = rec[method] !== undefined ? rec[method]() : rec.get(key);

			var provider = this.getParent().dataProvider();
			if(val === undefined && provider && provider['method']){
				val = this.getParent().dataProvider()['method']();
			}

			if(!isNaN(val) && val % 1 !== 0){
				val = val.toFixed(1);
			}

			ret = ret.replace(match[i], val);
		}
		return ret;
	},

	getRecord:function () {
		return this.getParent().dataProvider().getHighlighted();
	}

});
/* ../ludojs/src/ludo-db/factory.js */
/**
 Factory for automatic creation of children from server ludoDB config. This class is used
 internally by ludoJS when you specify a ludoDB config object in your view configuration.
 @namespace ludoDB
 @class Factory
 @constructor
 @param config
 @type {Object}
 @augments ludo.Core
 @example {@lang Javascript}
    new ludo.Window({
        title:'LudoDB Integration',
        stateful:true,
        layout:{
            'width':500, height:400
        },
        children:[
            {
                'layout':{
                    type:'linear',
                    orientation:'vertical'
                },
                'ludoDB':{ // Creates children of this window automatically based on LudoDB model config
                    'resource':'LudoJSPerson',
                    'arguments':1,
                    'url':'../ludoDB/router.php'
                }
            }
        ],
        buttons:[
            { type:'form.SubmitButton', value:'Save' },
            { type:'form.CancelButton', value:'Cancel' }
        ]
    });
 */
ludo.ludoDB.Factory = new Class({
    Extends:ludo.Core,
    ludoDBConfig:undefined,

    arguments:undefined,
    resource:undefined,
    url:undefined,

    ludoConfig:function (config) {
        this.parent(config);
        this.setConfigParams(config, ['url', 'resource', 'arguments']);
        if (this.arguments && !ludo.util.isArray(this.arguments)) {
            this.arguments = [this.arguments];
        }
        this.ludoDBConfig = config;
    },

    load:function () {
        var arguments = [this.resource];
        if (this.arguments)arguments.splice(1, 0, this.arguments);
        var req = new ludo.remote.JSON({
            resource:'LudoJS',
            url:this.getUrl()
        });
        req.addEvent('success', this.loadComplete.bind(this));
        req.send('form', arguments);
    },

    loadComplete:function (req) {
        this.fireEvent('load', req.getResponseData());
    }

});/* ../ludojs/src/color/color.js */
/**
 * Color Utility functions
 * @class ludo.color.Color
 * @example {@lang JavaScript}
 * var util = new ludo.color.Color();
 * var rgbCode = '#669900';
 * var rgbObject = util.rgbObject(rgbCode);
 *
 */
ludo.color.Color = new Class({

    /**
     * Converting color into RGB Object. This method accepts color in HSV format({h:120,s:40,v:100})
     * and in string format(RGB), example: '#669900'
     * @memberof ludo.color.prototype
     * @function rgbColors
     * @param {object|String} a
     * @returns {object}
     * @memberof ludo.color.Color.prototype
     * @example
     var util = new ludo.color.Color();
     console.log(util.rgbColors('#669900');
     console.log(util.rgbColors({ h: 300, s: 100, v: 50 });
     *
     *
     */
    rgbColors:function (a) {
        if (a.substr !== undefined) {
            return this.rgbObject(a);
        }
        if (a.h !== undefined) {
            return this.hsvToRGB(a.h, a.s, a.v);
        }
        return undefined;
    },
    /**
     Converts rgb color string to rgb color object
     @public
     @param {string} rgbColor
     @memberof ludo.color
     @return {Object}
     @memberof ludo.color.Color.prototype
     @example {@lang JavaScript}
        var c = new ludo.color.Color();
        console.log(c.rgbObject('#FFEEDD');
        // returns { 'r': 'FF','g' : 'EE', 'b' : 'DD' }
     */
    rgbObject:function (rgbColor) {
        rgbColor = rgbColor.replace('#', '');
        return {
            r:rgbColor.substr(0, 2).toInt(16),
            g:rgbColor.substr(2, 2).toInt(16),
            b:rgbColor.substr(4, 2).toInt(16)
        };
    },
    /**
     * Converts RGB or HSV color object to rgb code
     * @memberof ludo.color.Color.prototype
     * @param {number} a
     * @param {number} b
     * @param {number} c
     * @return {string}
     */
    rgbCode:function (a, b, c) {
        if (b === undefined) {
            if (a.r !== undefined) {
                b = a.g;
                c = a.b;
                a = a.r;
            }
            else if (a.h !== undefined) {
                var color = this.hsvToRGB(a.h, a.s, a.v);
                a = color.r;
                b = color.g;
                c = color.b;
            }
        }
        return this.toRGB(a, b, c);
    },
    /**
     * Converts rgb object to rgb string
     * @memberof ludo.color.Color.prototype
     * @function toRGB
     * @param {Number} red
     * @param {Number} green
     * @param {Number} blue
     * @return {String}
     */
    toRGB:function (red, green, blue) {
        var r = Math.round(red).toString(16);
        var g = Math.round(green).toString(16);
        var b = Math.round(blue).toString(16);
        if (r.length === 1)r = ['0', r].join('');
        if (g.length === 1)g = ['0', g].join('');
        if (b.length === 1)b = ['0', b].join('');
        return ['#', r, g, b].join('').toUpperCase();
    },
    toRGBFromObject:function (color) {
        return this.toRGB(color.r, color.g, color.b);
    },
    toHSV:function (color) {
        if (color.r === undefined)color = this.rgbObject(color);
        return this.toHSVFromRGB(color.r, color.g, color.b);
    },
    toHSVFromRGBCode:function (rgbColor) {
        var color = this.rgbObject(rgbColor);
        return this.toHSVFromRGB(color.r, color.g, color.b);
    },
    /**
     * Converts red,green and blue to hsv h,s v
     * @memberof ludo.color.Color.prototype
     * @function toHSVFromRGB
     * @param r
     * @param g
     * @param b
     * @return {Object}
     */
    toHSVFromRGB:function (r, g, b) {
        r = r / 255;
        g = g / 255;
        b = b / 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s;

        var d = max - min;
        s = max == 0 ? 0 : d / max;

        if (max == min) {
            h = 0;
        } else {
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }
        return {
            h:h * 360,
            s:s * 100,
            v:max * 100
        };
    },

    /**
     * Converts Hue,Saturation,Brightness to RGB Code
     * @memberof ludo.color.Color.prototype
     * @param h
     * @param s
     * @param v
     * @returns {String}
     */
    hsvToRGBCode:function (h, s, v) {
        if (s === undefined) {
            s = h.s;
            v = h.v;
            h = h.h;
        }
        var rgb = this.hsvToRGB(h, s, v);
        return this.toRGB(rgb.r, rgb.g, rgb.b);
    },


    /**
     * Converts HSV(Hue, Saturation, Brightness) to RGB(red, green, blue).
     * @memberof ludo.color.Color.prototype
     * @param h
     * @param s
     * @param v
     * @returns {{r: number, g: number, b: number}}
     * @example {@lang JavaScript}
     var colorUtil = new ludo.color.Color();
     var hue = 300;
     var saturation = 40;
     var brightness = 90;
     var rgb = colorUtil.hsvToRGB(hue, saturation, brightness);
     // returns { r: 229, g: 138, b: 229 }
     */
    hsvToRGB:function (h, s, v) {
        if (s === undefined) {
            s = h.s;
            v = h.v;
            h = h.h;
        }
        h /= 360;
        s /= 100;
        v /= 100;

        var r, g, b;

        var i = Math.floor(h * 6);
        var f = h * 6 - i;
        var p = v * (1 - s);
        var q = v * (1 - f * s);
        var t = v * (1 - (1 - f) * s);

        switch (i % 6) {
            case 0:
                r = v;
                g = t;
                b = p;
                break;
            case 1:
                r = q;
                g = v;
                b = p;
                break;
            case 2:
                r = p;
                g = v;
                b = t;
                break;
            case 3:
                r = p;
                g = q;
                b = v;
                break;
            case 4:
                r = t;
                g = p;
                b = v;
                break;
            case 5:
                r = v;
                g = p;
                b = q;
                break;
        }
        return{
            r:r * 255,
            g:g * 255,
            b:b * 255
        };
    },

    hslToRgb:function (h, s, l) {
        var r, g, b;

        if (s == 0) {
            r = g = b = l; // achromatic
        } else {
            function hue2rgb(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            }

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return { r:r * 255, g:g * 255, b:b * 255 }
    },

    /**
     * Return rgb code after hue has been adjusted by a number of degrees
     * @function offsetHue
     * @param color
     * @param offset
     * @return {String}
     */
    offsetHue:function(color, offset){
        var hsv = this.toHSV(color);
        hsv.h += offset;
        if(hsv.h >= 360) hsv.h -= 360;
        return this.rgbCode(hsv);
    },

    /**
     * Return rgb code after hue has been adjusted by a number of degrees
     * @function offsetBrightness
     * @param color
     * @param offset
     * @return {String}
     */
    offsetBrightness:function(color, offset){
        var hsv = this.toHSV(color);
        hsv.v += offset;
        if(hsv.v > 100) hsv.v = 100;
        if(hsv.v < 0)hsv.v = 0;
        return this.rgbCode(hsv);
    },

    /**
     * Return rgb code after hue has been adjusted by a number of degrees
     * @function offsetSaturation
     * @param color
     * @param offset
     * @return {String}
     */
    offsetSaturation:function(color, offset){
        var hsv = this.toHSV(color);
        hsv.s += offset;
        if(hsv.s > 100) hsv.s = 100;
        if(hsv.s < 0)hsv.s = 0;
        return this.rgbCode(hsv);
    },

    /**
     * Returns a brighter color.
     * @memberof ludo.color.Color.prototype
     * @param {String|Object} color
     * @param {number} percent
     * @returns {String}
     * @example
     * var util = new ludo.color.Color();
     * var color = '#669900';
     * var brighterColor = util.brighten(color, 10);
     * console.log(brighterColor); // outputs #76A811;
     * color = '#AAAAAA';
     * brighterColor = util.brighten(color, 10);
     * console.log(brighterColor); // outputs #BBBBBB;
     */
    brighten:function(color, percent){
        var hsv = this.toHSV(color);
        color = this.offsetBrightness(color, hsv.v * percent/100);
        color = this.offsetSaturation(color, hsv.s * percent/100 * -1);
        return color;
    },

    /**
     * Brightens a color
     * @memberof ludo.color.Color.prototype
     * @param color
     * @param percent
     * @returns {String}
     * @example
     var c = new ludo.color.Color();
     var color = '#BBBBBB';
     var darker = c.darken(color, 10);
     console.log(darker); // outputs #A8A8A8
     */
    darken:function(color, percent){
        var hsv = this.toHSV(color);
        color = this.offsetBrightness(color, hsv.v * percent/100 * -1);
        color = this.offsetSaturation(color, hsv.s * percent/100);
        return color;
    }
});

/* ../ludojs/src/color/base.js */
ludo.color.Base = new Class({
	Extends: ludo.View,

	setColor:function(color){
		this.value = color;
	}
});/* ../ludojs/src/effect/draggable-node.js */
/**
 Specification of a draggable node objects sent to {{#crossLink "effect.Drag/add"}}{{/crossLink}}. You will
 never create objects of this class.
 @namespace effect
 @class DraggableNode
 @type {Object|String}
 */
ludo.effect.DraggableNode = new Class({
	/**
	 id of node. This attribute is optional
	 @property id
	 @type {String}
	 @default undefined
	 @optional
	 @example
	 	var dragDrop = new ludo.effect.Drag();
	 	var el = $('<div>');
	 	dragDrop.add({
	 		id: 'myId',
			el : el
	 	});
	 	var ref = dragDrop.getById('myId');
	 Or you can use this code which does the same:
	 @example
	 	var dragDrop = new ludo.effect.Drag();
	 	var el = $('<div>');
	 	el.id = 'myId';
	 	dragDrop.add(el);
	 	var ref = dragDrop.getById('myId');
	 Id's are only important if you need to access nodes later using {{#crossLink "effect.Drag/getById"}}{{/crossLink}}
	 */
	id: undefined,

	/**
	 * Reference to dragable DOM node
	 * @property el
	 * @default undefined
	 * @type {String|HTMLDivElement}
	 */
	el:undefined,
	/**
	 * Reference to handle for dragging. el will only be draggable by dragging the handle.
	 * @property handle
	 * @type {String|HTMLDivElement}
	 * @default undefined
	 * @optional
	 */
	handle:undefined,

	/**
	 * Minimum x position. This is an optional argument. If not set, you will use the params
	 * set when creating the ludo.effect.Drag component if any.
	 * @property minX
	 * @type {Number}
	 * @default undefined
	 * @optional
	 */
	minX:undefined,
	/**
	 * Maximum x position. This is an optional argument. If not set, you will use the params
	 * set when creating the ludo.effect.Drag component if any.
	 * @property maxX
	 * @type {Number}
	 * @default undefined
	 * @optional
	 */
	maxX:undefined,
	/**
	 * Minimum x position. This is an optional argument. If not set, you will use the params
	 * set when creating the ludo.effect.Drag component if any.
	 * @property minY
	 * @type {Number}
	 * @default undefined
	 * @optional
	 */
	minY:undefined,
	/**
	 * Maximum y position. This is an optional argument. If not set, you will use the params
	 * set when creating the ludo.effect.Drag component if any.
	 * @property maxY
	 * @type {Number}
	 * @default undefined
	 * @optional
	 */
	maxY:undefined,
	/**
	 Allow dragging in these directions. This is an optional argument. If not set, you will use the params
	 set when creating the ludo.effect.Drag component if any.
	 @property directions
	 @type {String}
	 @default 'XY'
	 @optional
	 @example
	 	directions:'XY'	//
	 	..
	 	directions:'X' // Only allow dragging along x-axis
	 	..
	 	directions:'Y' // Only allow dragging along y-axis
	 */
	directions:undefined
});/* ../ludojs/src/effect/effect.js */
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
	 @function fly
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
		config.el = $(config.el);
		config.duration = config.duration || .2;
		if(config.from == undefined){
			config.from = config.el.position();
		}
		var fns = [this.animationComplete.bind(this)];
		if(config.onComplete)fns.push(config.onComplete);

		var callback = function(){
			for(var i=0;i<fns.length;i++){
				fns[i].call();
			}
		};
		$(config.el).animate({
			left: config.to.x,
			top: config.to.y
		}, config.duration * 1000, callback);

	},

	/**
	 Fly/Slide DOM node from current location to given x and y coordinats in given seconds.
	 @function flyTo
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
			x: to.left,
			y : el.parent().width() + el.height()
		};
		this.slide(el,from, to, duration, callback);
	},

	slideOut:function(el, duration, callback, from){
		from = from || el.getPosition();
		var to = {
			x: from.left,
			y : el.parent().height() + el.height()
		};
		this.slide(el, from, to, duration, callback);
	},

	slide:function(el, from, to, duration, callback){
		if(from.x != undefined && from.left == undefined){
			console.warn("Use of property x in slide");
			console.trace();
			from.left = from.x;
		}
		if(to.x != undefined && to.left == undefined){
			console.warn("Use of property x in slide");
			console.trace();
			to.left = to.x;
		}
		var stops = this.getStops(duration);
		var styles = [];
		if(from.left !== to.left){
			el.css('left', from.left);
			styles.push({
				key : 'left',
				currentValue:from.left,
				change: (to.left - from.left) / stops
			});
		}

		if(from.top !== to.top){
			el.style.top = from.top + 'px';
			styles.push({
				key : 'top',
				currentValue:from.top,
				change: (to.top - from.top) / stops
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
		if(el.css("visibility") ==='hidden')el.css('visibility', 'visible');
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
					el.css("opacity", s.currentValue / 100);
					break;
				default:
					el.css(s.key, Math.round(s.currentValue) + config.unit);
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

/* ../ludojs/src/effect/drag.js */
/**
 * Class for dragging DOM elements.
@namespace ludo.effect
@class ludo.effect.Drag
@augments ludo.effect.Effect
@constructor
@param {Object} config
@example
	<style type="text/css">
	.ludo-shim {
		 border: 15px solid #AAA;
		 background-color: #DEF;
		 margin: 5;
		 opacity: .5;
		 border-radius: 5px;
	}
	.draggable{
		width:150px;
		z-index:1000;
		height:150px;
		border-radius:5px;
		border:1px solid #555;
		background-color:#DEF
	}
	</style>
	<div id="draggable" class="draggable">
		I am draggable
	</div>
	<script type="text/javascript">
	 var d = new ludo.effect.Drag({
		useShim:true,
		 listeners:{
			 endDrag:function(dragged, dragEffect){
				 dragEffect.getEl().setStyles({
					 left : dragEffect.getX(),
					 top: dragEffect.getY()
				 });
			 },
			 drag:function(pos, dragEffect){
				 dragEffect.setShimText(dragEffect.getX() + 'x' + dragEffect.getY());
			 }
		 }
	 });
	d.add('draggable'); // "draggable" is the id of the div
 	</script>

*/
ludo.effect.Drag = new Class({
	Extends:ludo.effect.Effect,

	/**
	 * Reference to drag handle (Optional). If not set, "el" will be used
	 * @config handle
	 * @type Object|String
	 * @default undefined
	 */
	handle:undefined,
	/**
	 * Reference to DOM element to be dragged
	 * @config el
	 * @type Object|String
	 * @default undefined
	 */
	el:undefined,

	/**
	 * Minimum x position
	 * @config minX
	 * @type {Number}
	 * @default undefined
	 */
	minX:undefined,
	/**
	 * Minimum y position
	 * @config minY
	 * @type {Number}
	 * @default undefined
	 */
	minY:undefined,

	/**
	 * Maximum x position
	 * @config maxX
	 * @type {Number}
	 * @default undefined
	 */
	maxX:undefined,
	/**
	 * config y position
	 * @attribute maxY
	 * @type {Number}
	 * @default undefined
	 */
	maxY:undefined,

	/**
	 * minPos and maxPos can be used instead of minX,maxX,minY and maxY if
	 * you only accept dragging along x-axis or y-axis
	 * @config {Number} minPos
	 * @default undefined
	 */
	minPos:undefined,
	/**
	 * @config maxPos
	 * @type {Number}
	 * @default undefined
	 */
	maxPos:undefined,
	/**
	 * Accept dragging in these directions
	 * @config dragX
	 * @type String
	 * @default XY
	 */
	directions:'XY',

	/**
	 * Unit used while dragging
	 * @config unit, example : "px", "%"
	 * @default px
	 */
	unit:'px',

	dragProcess:{
		active:false
	},

	coordinatesToDrag:undefined,
	/**
	 * Delay in seconds from mouse down to start drag. If mouse is released within this interval,
	 * the drag will be cancelled.
	 * @config delay
	 * @type {Number}
	 * @default 0
	 */
	delay:0,

	inDelayMode:false,

	els:{},

	/**
	 * True to use dynamically created shim while dragging. When true,
	 * the original DOM element will not be dragged.
	 * @config useShim
	 * @type {Boolean}
	 * @default false
	 */
	useShim:false,

	/**
	 * True to automatically hide shim after drag is finished
	 * @config autohideShim
	 * @type {Boolean}
	 * @default true
	 */
	autoHideShim:true,

	/**
	 CSS classes to add to shim
	 @config shimCls
	 @type Array
	 @default undefined
	 @example
		 shimCls:['myShim','myShim-2']
	 which will results in this shim :
	 @example
	 	<div class="ludo-shim myShim myShim-2">
	 */
	shimCls:undefined,

	/**
	 * While dragging, always show dragged element this amount of pixels below mouse cursor.
	 * @param mouseYOffset
	 * @type {Number}
	 * @default undefined
	 */
	mouseYOffset:undefined,

	/**
	 * While dragging, always show dragged element this amount of pixels right of mouse cursor.
	 * @config mouseXOffset
	 * @type {Number}
	 * @default undefined
	 */
	mouseXOffset:undefined,

    fireEffectEvents:true,

	ludoConfig:function (config) {
		this.parent(config);
		if (config.el !== undefined) {
			this.add({
				el:config.el,
				handle:config.handle
			});
		}

        this.setConfigParams(config, ['useShim','autoHideShim','directions','delay','minX','maxX','minY','maxY',
            'minPos','maxPos','unit','shimCls','mouseYOffset','mouseXOffset','fireEffectEvents']);
	},

	ludoEvents:function () {
		this.parent();
		this.getEventEl().on(ludo.util.getDragMoveEvent(), this.drag.bind(this));
		this.getEventEl().on(ludo.util.getDragEndEvent(), this.endDrag.bind(this));
		if (this.useShim) {
			this.addEvent('start', this.showShim.bind(this));
			if(this.autoHideShim){
				this.addEvent('end', this.hideShim.bind(this));
			}
		}
	},

	/**
	 Add draggable object
	 @function add
	 @param {effect.DraggableNode|String|HTMLDivElement} node
	 @return {effect.DraggableNode}
	 @example
	 	dragObject.add({
			el: 'myDiv',
			handle : 'myHandle'
		});
	 handle is optional.

	 @example
	 	dragObject.add('idOfMyDiv');

	 You can also add custom properties:

	 @example
	 	dragobject.add({
	 		id: "myReference',
			el: 'myDiv',
			column: 'city'
		});
	 	...
	 	...
	 	dragobject.addEvent('before', beforeDrag);
		 ...
		 ...
	 	function beforeDrag(dragged){
	 		console.log(dragged.el);
	 		console.log(dragged.column);
	 	}
	 */
	add:function (node) {
		node = this.getValidNode(node);
		var el = $(node.el);
		this.setPositioning(el);

        var handle = node.handle ? $(node.handle) : el;

		handle.id = handle.id || 'ludo-' + String.uniqueID();
		handle.addClass("ludo-drag");

		handle.on(ludo.util.getDragStartEvent(), this.startDrag.bind(this));
		handle.attr('forId', node.id);
		this.els[node.id] = Object.merge(node, {
			el:$(el),
			handle:handle
		});
		return this.els[node.id];
	},

	/**
	 * Remove node
	 * @function remove
	 * @param {String} id
	 * @return {Boolean} success
	 */
	remove:function(id){
		if(this.els[id]!==undefined){
			var el = $("#" + this.els[id].handle);
			el.off(ludo.util.getDragStartEvent(), this.startDrag.bind(this));
			this.els[id] = undefined;
			return true;
		}
		return false;
	},

	removeAll:function(){
		var keys = Object.keys(this.els);
		for(var i=0;i<keys.length;i++){
			this.remove(keys[i]);
		}
		this.els = {};
	},

	getValidNode:function(node){
		if (!this.isElConfigObject(node)) {
			node = {
				el:$(node)
			};
		}
		if(typeof node.el === 'string'){
			if(node.el.substr(0,1) != "#")node.el = "#" + node.el;
			node.el = $(node.el);
		}
		node.id = node.id || node.el.attr("id") || 'ludo-' + String.uniqueID();
		if (!node.el.attr("id"))node.el.attr("id", node.id);
		node.el.attr('forId', node.id);
		return node;
	},

	isElConfigObject:function (config) {
		return config.el !== undefined || config.handle !== undefined;
	},

	setPositioning:function(el){
		if (!this.useShim){
			el.css('position', 'absolute');
		}else{
            var pos = el.css('position');
			if(!pos || (pos!='relative' && pos!='absolute')){
				el.css('position', 'relative');
			}
		}
	},

	getById:function(id){
		return this.els[id];
	},

	getIdByEvent:function (e) {
		var el = $(e.target);
		if (!el.hasClass('ludo-drag')) {
			el = el.closest('.ludo-drag');
		}
		return el.attr('forId');
	},

	/**
	 * Returns reference to dragged object, i.e. object added in constructor or
	 * by use of add method
	 * @function getDragged
	 * @return {Object}
	 */
	getDragged:function(){
		return this.els[this.dragProcess.dragged];
	},

	/**
	 * Returns reference to draggable DOM node
	 * @function getEl
	 * @return {Object} DOMNode
	 */
	getEl:function () {
		return this.els[this.dragProcess.dragged].el;
	},

	getShimOrEl:function () {
		return this.useShim ? this.getShim() : this.getEl();
	},

	getSizeOf:function(el){
		return el.outerWidth !== undefined ? { x: el.outerWidth(), y: el.outerHeight() } : { x: 0, y: 0 };
	},

	getPositionOf:function(el){

		return $(el).position();
	},

	setDragCoordinates:function(){
		this.coordinatesToDrag = {
			x : 'x', y:'y'
		};
	},
	startDrag:function (e) {
		var id = this.getIdByEvent(e);

		var el = this.getById(id).el;

		var size = this.getSizeOf(el);
		var pos;
		if(this.useShim){
			pos = el.position();
		}else{
			var parent = this.getPositionedParent(el);
            pos = parent? el.getPosition(parent) : this.getPositionOf(el)
		}

		var x = pos.left;
		var y = pos.top;
		this.dragProcess = {
			active:true,
			dragged:id,
			currentX:x,
			currentY:y,
			elX:x,
			elY:y,
			width:size.x,
			height:size.y,
			mouseX:e.pageX,
			mouseY:e.pageY
		};


		this.dragProcess.el = this.getShimOrEl();
		/**
		 * Event fired before drag
		 * @event {effect.DraggableNode}
		 * @param {Object} object to be dragged
		 * @param {ludo.effect.Drag} component
		 * @param {Object} pos(x and y)
		 */
		this.fireEvent('before', [this.els[id], this, {x:x,y:y}]);

		if(!this.isActive()){
			return undefined;
		}

		this.dragProcess.minX = this.getMinX();
		this.dragProcess.maxX = this.getMaxX();
		this.dragProcess.minY = this.getMinY();
		this.dragProcess.maxY = this.getMaxY();
		this.dragProcess.dragX = this.canDragAlongX();
		this.dragProcess.dragY = this.canDragAlongY();

		if (this.delay) {
			this.setActiveAfterDelay();
		} else {
			/**
			 * Event fired before dragging
			 * @event start
			 * @param {effect.DraggableNode} object to be dragged.
			 * @param {ludo.effect.Drag} component
			 * @param {Object} pos(x and y)
			 */
			this.fireEvent('start', [this.els[id], this, {x:x,y:y}]);

			if(this.fireEffectEvents)ludo.EffectObject.start();
		}

		return false;
	},

	getPositionedParent:function(el){

		var parent = el.parentNode;
		while(parent){
			var pos = parent.getStyle('position');
			if (pos === 'relative' || pos === 'absolute')return parent;
			parent = parent.getParent();
		}
		return undefined;
	},

	/**
	 Cancel drag. This method is designed to be called from an event handler
	 attached to the "beforeDrag" event.
	 @function cancelDrag
	 @example
	 	// Here, dd is a {{#crossLink "effect.Drag"}}{{/crossLink}} object
	 	dd.on('before', function(draggable, dd, pos){
	 		if(pos.x > 1000 || pos.y > 500){
	 			dd.cancelDrag();
			}
	 	});
	 In this example, dragging will be cancelled when the x position of the mouse
	 is greater than 1000 or if the y position is greater than 500. Another more
	 useful example is this:
	 @example
		 dd.on('before', function(draggable, dd){
		 	if(!this.isDraggable(draggable)){
		 		dd.cancelDrag()
		 	}
		});
	 Here, we assume that we have an isDraggable method which returns true or false
	 for whether the given node is draggable or not. "draggable" in this example
	 is one of the {{#crossLink "effect.DraggableNode"}}{{/crossLink}} objects added
	 using the {{#crossLink "effect.Drag/add"}}{{/crossLink}} method.
	 */

	cancelDrag:function () {
		this.dragProcess.active = false;
		this.dragProcess.el = undefined;
        if(this.fireEffectEvents)ludo.EffectObject.end();
	},

	getShimFor:function (el) {
		return el;
	},

	setActiveAfterDelay:function () {
		this.inDelayMode = true;
		this.dragProcess.active = false;
		this.startIfMouseNotReleased.delay(this.delay * 1000, this);
	},

	startIfMouseNotReleased:function () {
		if (this.inDelayMode) {
			this.dragProcess.active = true;
			this.inDelayMode = false;
			this.fireEvent('start', [this.getDragged(), this, {x:this.getX(),y:this.getY()}]);
			ludo.EffectObject.start();
		}
	},

	drag:function (e) {
		if (this.dragProcess.active && this.dragProcess.el) {
			var pos = {
				x:undefined,
				y:undefined
			};
			if (this.dragProcess.dragX) {
				pos.x = this.getXDrag(e);

			}

			if (this.dragProcess.dragY) {
				pos.y = this.getYDrag(e);
			}


			this.move(pos);

			/**
			 * Event fired while dragging. Sends position, example {x:100,y:50}
			 * and reference to effect.Drag as arguments
			 * @event drag
			 * @param {Object} x and y
			 * @param {effect.Drag} this
			 */
			this.fireEvent('drag', [pos, this.els[this.dragProcess.dragged], this]);
			if (ludo.util.isTabletOrMobile())return false;

		}
		return undefined;
	},

	move:function (pos) {
		if (pos.x !== undefined) {
			this.dragProcess.currentX = pos.x;
			this.dragProcess.el.css('left',  pos.x + this.unit);
		}
		if (pos.y !== undefined) {
			this.dragProcess.currentY = pos.y;
			this.dragProcess.el.css('top',  pos.y + this.unit);
		}
	},

	/**
	 * Return current x pos
	 * @function getX
	 * @return {Number} x
	 */
	getX:function(){
		return this.dragProcess.currentX;
	},
	/**
	 * Return current y pos
	 * @function getY
	 * @return {Number} y
	 */
	getY:function(){
		return this.dragProcess.currentY;
	},

	getXDrag:function (e) {
		var posX;

		if(this.mouseXOffset){
			posX = e.pageX + this.mouseXOffset;
		}else{
			posX = e.pageX - this.dragProcess.mouseX + this.dragProcess.elX;
		}

		if (posX < this.dragProcess.minX) {
			posX = this.dragProcess.minX;
		}
		if (posX > this.dragProcess.maxX) {
			posX = this.dragProcess.maxX;
		}
		return posX;
	},

	getYDrag:function (e) {
		var posY;
		if(this.mouseYOffset){
			posY = e.pageY + this.mouseYOffset;
		}else{
			posY = e.pageY - this.dragProcess.mouseY + this.dragProcess.elY;
		}

		if (posY < this.dragProcess.minY) {
			posY = this.dragProcess.minY;
		}
		if (posY > this.dragProcess.maxY) {
			posY = this.dragProcess.maxY;
		}
		return posY;
	},

	endDrag:function () {
		if (this.dragProcess.active) {
			this.cancelDrag();
			/**
			 * Event fired on drag end
			 * @event end
			 * @param {effect.DraggableNode} dragged
			 * @param {ludo.effect.Drag} this
			 * @param {Object} x and y
			 */
			this.fireEvent('end', [
				this.getDragged(),
				this,
				{
					x:this.getX(),
					y:this.getY()
				}
			]);

		}
		if (this.inDelayMode)this.inDelayMode = false;

	},

	/**
	 * Set new max X pos
	 * @function setMaxX
	 * @param {Number} x
	 */
	setMaxX:function (x) {
		this.maxX = x;
	},
	/**
	 * Set new min X pos
	 * @function setMinX
	 * @param {Number} x
	 */
	setMinX:function (x) {
		this.minX = x;
	},
	/**
	 * Set new min Y pos
	 * @function setMinY
	 * @param {Number} y
	 */
	setMinY:function (y) {
		this.minY = y;
	},
	/**
	 * Set new max Y pos
	 * @function setMaxY
	 * @param {Number} y
	 */
	setMaxY:function (y) {
		this.maxY = y;
	},
	/**
	 * Set new min pos
	 * @function setMinPos
	 * @param {Number} pos
	 */
	setMinPos:function (pos) {
		this.minPos = pos;
	},
	/**
	 * Set new max pos
	 * @function setMaxPos
	 * @param {Number} pos
	 */
	setMaxPos:function (pos) {
		this.maxPos = pos;
	},

	getMaxX:function () {
        return this.getMaxPos('maxX');
	},

	getMaxY:function () {
        return this.getMaxPos('maxY');
	},

    getMaxPos:function(key){
        var max = this.getConfigProperty(key);
        return max !== undefined ? max : this.maxPos !== undefined ? this.maxPos : 100000;
    },

	getMinX:function () {
		var minX = this.getConfigProperty('minX');
        return minX !== undefined ? minX : this.minPos;
	},

	getMinY:function () {
		var dragged = this.getDragged();
        return dragged && dragged.minY!==undefined ? dragged.minY : this.minY!==undefined ? this.minY : this.minPos;
	},
	/**
	 * Return amount dragged in x direction
	 * @function getDraggedX
	 * @return {Number} x
	 */
	getDraggedX:function(){
		return this.getX() - this.dragProcess.elX;
	},
	/**
	 * Return amount dragged in y direction
	 * @function getDraggedY
	 * @return {Number} y
	 */
	getDraggedY:function(){
		return this.getY() - this.dragProcess.elY;
	},

	canDragAlongX:function () {
		return this.getConfigProperty('directions').indexOf('X') >= 0;
	},
	canDragAlongY:function () {
		return this.getConfigProperty('directions').indexOf('Y') >= 0;
	},

	getConfigProperty:function(property){
		var dragged = this.getDragged();
		return dragged && dragged[property] !== undefined ? dragged[property] : this[property];
	},

	/**
	 * Returns width of dragged element
	 * @function getHeight
	 * @return {Number}
	 */
	getWidth:function () {
		return this.dragProcess.width;
	},

	/**
	 * Returns height of dragged element
	 * @function getHeight
	 * @return {Number}
	 */
	getHeight:function () {
		return this.dragProcess.height;
	},
	/**
	 * Returns current left position of dragged
	 * @function getLeft
	 * @return {Number}
	 */
	getLeft:function () {
		return this.dragProcess.currentX;
	},

	/**
	 * Returns current top/y position of dragged.
	 * @function getTop
	 * @return {Number}
	 */
	getTop:function () {
		return this.dragProcess.currentY;
	},

	/**
	 * Returns reference to DOM element of shim
	 * @function getShim
	 * @return {HTMLDivElement} shim
	 */
	getShim:function () {
		if (this.shim === undefined) {
			this.shim = $('<div>');
			this.shim.addClass('ludo-shim');
			this.shim.css({
				position:'absolute',
				'z-index':50000,
				display:'none'
			});
			$(document.body).append(this.shim);

			if (this.shimCls) {
				for (var i = 0; i < this.shimCls.length; i++) {
					this.shim.addClass(this.shimCls[i]);
				}
			}
			/**
			 * Event fired when shim is created
			 * @event createShim
			 * @param {HTMLDivElement} shim
			 */
			this.fireEvent('createShim', this.shim);
		}
		return this.shim;
	},

	/**
	 * Show shim
	 * @function showShim
	 */
	showShim:function () {
		this.getShim().css({
			display:'',
			left:this.getShimX(),
			top:this.getShimY(),
			width:this.getWidth() + this.getShimWidthDiff(),
			height:this.getHeight() + this.getShimHeightDiff()
		});

		this.fireEvent('showShim', [this.getShim(), this]);
	},

	getShimY:function(){
		if(this.mouseYOffset){
			return this.dragProcess.mouseY + this.mouseYOffset;
		}else{
			return this.getTop() + ludo.dom.getMH(this.getEl()) - ludo.dom.getMW(this.shim);
		}
	},

	getShimX:function(){
		if(this.mouseXOffset){
			return this.dragProcess.mouseX + this.mouseXOffset;
		}else{
			return this.getLeft() + ludo.dom.getMW(this.getEl()) - ludo.dom.getMW(this.shim);
		}
	},

	getShimWidthDiff:function(){
		return ludo.dom.getMW(this.getEl()) - ludo.dom.getMBPW(this.shim);
	},
	getShimHeightDiff:function(){
		return ludo.dom.getMH(this.getEl()) - ludo.dom.getMBPH(this.shim);
	},

	/**
	 * Hide shim
	 * @function hideShim
	 */
	hideShim:function () {
		this.getShim().css('display', 'none');
	},

	/**
	 * Set text content of shim
	 * @function setShimText
	 * @param {String} text
	 */
	setShimText:function (text) {
		this.getShim().html( text);
	},

	/**
	 * Fly/Slide dragged element back to it's original position
	 * @function flyBack
	 */
	flyBack:function (duration) {
		this.fly({
			el: this.getShimOrEl(),
			duration: duration,
			from:{ x: this.getLeft(), y : this.getTop() },
			to:{ x: this.getStartX(), y : this.getStartY() },
			onComplete : this.flyBackComplete.bind(this)
		});
	},

	/**
	 * Fly/Slide dragged element to position of shim. This will only
	 * work when useShim is set to true.
	 * @function flyToShim
	 * @param {Number} duration in seconds(default = .2)
	 */
	flyToShim:function(duration){
		this.fly({
			el: this.getEl(),
			duration: duration,
			from:{ x: this.getStartX(), y : this.getStartY() },
			to:{ x: this.getLeft(), y : this.getTop() },
			onComplete : this.flyToShimComplete.bind(this)
		});
	},

	getStartX:function () {
		return this.dragProcess.elX;
	},

	getStartY:function () {
		return this.dragProcess.elY;
	},

	flyBackComplete:function(){

		/**
		 * Event fired after flyBack animation is complete
		 * @event flyBack
		 * @param {effect.Drag} this
		 * @param {HTMLElement} dom node
		 */
		this.fireEvent('flyBack', [this, this.getShimOrEl()]);
	},

	flyToShimComplete:function(){

		/**
		 * Event fired after flyToShim animation is complete
		 * @event flyBack
		 * @param {effect.Drag} this
		 * @param {HTMLElement} dom node
		 */
		this.fireEvent('flyToShim', [this, this.getEl()]);
	},

	isActive:function(){
		return this.dragProcess.active;
	}
});/* ../ludojs/src/form/validator/fns.js */
ludo.form.validator.required = function(value, required){
    return !required || value.length > 0;
};

ludo.form.validator.minLength = function(value, minLength){
    return value.length === 0 || value.length >= minLength;
};

ludo.form.validator.maxLength = function(value, maxLength){
    return value.length === 0 || value.length <= maxLength;
};

ludo.form.validator.regex = function(value, regex){
    return value.length === 0 || regex.test(value);
};

ludo.form.validator.minValue = function(value, minValue){
    return value.length === 0 || parseInt(value) >= minValue;
};
ludo.form.validator.maxValue = function(value, maxValue){
    return value.length === 0 || parseInt(value) <= maxValue;
};
ludo.form.validator.twin = function(value, twin){
    var cmp = ludo.get(twin);
    return !cmp || (cmp && value === cmp.value);
};/* ../ludojs/src/form/element.js */
/**
 * Super class for form Views.
 * This class inherits from <a href="ludo.View.html">ludo.View</a>.
 * @namespace ludo.form
 * @class ludo.form.Element
 * @param {Object} config Configuration when creating the View. These properties and properties from superclass is available
 * @param {String} config.name Name of element. A call to parentView.getForm().values() will return &lt;name> : &lt;value>.
 * @param {Boolean} config.required True to apply validation for required. Default:false
 * @param {Object} config.formCss Optional css styling of the form element. Example: { type:'form.Text', formCss:{ "text-align": right }} to right align text of a text input.
 * @param {Function} config.validator A Validator function to be executed when value is changed. This function should return true when valid, false when invalid. Current value will be passed to this function.
 * @param {Function} config.linkWith Creates a link with form element with this id. When two form views are linked, they will always have the same value. When one value is changed, the linked form view is automatically updated.
 * Example: A link between a form.Seekbar and a form.Number.
 * Example: { type:'form.Text', placeHolder='Enter Valid Value', validator:function(value){ return value == 'Valid Value' } }
 *
 */
ludo.form.Element = new Class({
    Extends:ludo.View,
    /**
     * Initial value
     * @config {String|Number} value
     * @default undefined
     */
    value:undefined,
    onLoadMessage:'',
    /**
     * "name" is inherited from ludo.View. It will also be set as name of input element
     * @attribute name
     * @type string
     * @default undefined
     */
    name:undefined,

    /**
     * Custom CSS rules to apply to input element
     * @attribute formCss
     * @type Object
     * @example:  {@lang Javascript}
     * { border : '1px solid #000' }
     * @default undefined
     */
    formCss:undefined,
    stretchField:true,
    required:false,
    dirtyFlag:false,
    initialValue:undefined,
    constructorValue:undefined,
    /**
     * Is form element ready for setValue. For combo boxes and select boxes it may
     * not be ready until available values has been loaded remotely
     * @property isReady
     * @type {Boolean}
     * @private
     */
    isReady:true,
    overflow:'hidden',

    /**
     * Will not validate unless value is the same as value of the form element with this id
     * Example of use: Password and Repeat password. It's sufficient to specify "twin" for one of
     * the views.
     * @property twin
     * @type String
     * @default undefined
     */
    twin:undefined,

    /**
     * Link with a form component with this id. Value of these components will always be the same
     * Update one and the other component will be updated automatically. It's sufficient
     * to specify linkWith for one of the two views.
     * @property linkWith
     * @type String
     * @default undefined
     */
    linkWith:undefined,

    /**
     * When using stateful:true, value will be preserved to next visit.
     * @property statefulProperties
     * @type Array
     * @default ['value']
     */
    statefulProperties:['value'],

    /**
     Object of class form.validator.* or a plain validator function
     When set the isValid method of the validator will be called after standard validation is complete
     and form element is valid.
     @property validator
     @type Object
     @example
        validator : { type : 'form.validator.Md5', value : 'MD5 hash of something' }
     In order to validate this field, the MD5 of form field value must match form.validator.Md5.value
     @example
        validator:function(value){
	 		return value === 'Valid value';
	 	}
     is example of simple function used as validator.
     */
    validator:undefined,
    validatorFn:undefined,

    validators:[],
    submittable:true,

    ludoConfig:function (config) {
        this.parent(config);
        var defaultConfig = this.getInheritedFormConfig();

        // TODO change disabled to enabled
        var keys = ['label', 'suffix', 'formCss', 'validator', 'stretchField', 'required', 'twin', 'disabled','submittable',
            'value', 'data'];
        this.setConfigParams(config, keys);

        this.elementId = ('el-' + this.id).trim();
        this.formCss = defaultConfig.formCss || this.formCss;
        if (defaultConfig.height && config.height === undefined)this.layout.height = defaultConfig.height;

        if (this.validator) {
            this.createValidator();
        }
        if (config.linkWith !== undefined) {
            this.setLinkWith(config.linkWith);
        }

        if (this.dataSource) {
            this.isReady = false;
        }
        this.initialValue = this.constructorValue = this.value;
        if (!this.name)this.name = 'ludo-form-el-' + String.uniqueID();


        ludo.Form.add(this);
        if(this.required)this.applyValidatorFns(['required']);
        this.applyValidatorFns(['twin']);
    },

    ludoDOM:function(){
        this.parent();
        this.addInput();
    },

    applyValidatorFns:function (keys) {
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (this[key] !== undefined) {
                this.validators.push({
                    fn:ludo.form.validator[key],
                    key:key
                });
            }
        }
    },

    createValidator:function () {
        var fn;
        if (ludo.util.isFunction(this.validator)) {
            fn = this.validator;
        } else {
            this.validator.applyTo = this;
            this.validator = ludo._new(this.validator);
            fn = this.validator.isValid.bind(this.validator);
        }
        this.validators.push({
            fn : fn,key:''
        });
    },

    ludoEvents:function () {
        this.parent();

        if (this.dataSource) {
            this.getDataSource().addEvent('load', this.setReady.bind(this));
        }

        var formEl = this.getFormEl();

        if (formEl) {
            formEl.on('keydown', this.keyDown.bind(this));
            formEl.on('keypress', this.keyPress.bind(this));
            formEl.on('keyup', this.keyUp.bind(this));
            formEl.on('focus', this.focus.bind(this));
            formEl.on('change', this.change.bind(this));
            formEl.on('blur', this.blur.bind(this));
        }
    },

    ludoRendered:function () {
        this.parent();

        if (this.disabled)this.disable();

		if(this.els.formEl){
			this.els.formEl.attr('name', this.getName());
			if(this.value !== undefined)this.els.formEl.val(this.value)
		}
        if (this.linkWith) {
            this.createBackLink();
        }
		var parentFormManager = this.getParentForm();
	    if (parentFormManager) {
			parentFormManager.registerFormElement(this);
		}
		this.validate();
    },

    /**
     * Enable or disable form element
     * @param {Boolean} enabled
     */
    setEnabled:function(enabled){
        if(enabled)this.enable(); else this.disable();
    },

    /**
     * Disable form element
     * @function disable
     * @return void
     */
    disable:function () {
        this.getFormEl().attr('disabled', '1');
        this.els.label.addClass('ludo-form-label-disabled');
    },
    /**
     * Enable form element
     * @function enable
     * @return void
     */
    enable:function () {
        this.getFormEl().removeProperty('disabled');
        this.els.label.removeClass('ludo-form-label-disabled');
    },

    getInheritedFormConfig:function () {
        var cmp = this.getParent();
        if (cmp) {
            return cmp.formConfig || {};
        }
        return {};
    },

    ludoCSS:function () {
        this.parent();
        this.getEl().addClass('ludo-form-element');
        if (this.els.formEl) {
            this.els.formEl.id = this.elementId;

            if (this.formCss) {
                this.els.formEl.css(this.formCss);
            }
        }
    },

    getFormElId:function () {
        return this.elementId;
    },

    getWidth:function () {
        var ret = this.parent();
        return ret ? ret : 20;
    },

    keyUp:function (e) {
        /**
         * key up event
         * @event key_up
         * @param {String} key
         * @param {String|Boolean|Object|Number} value
         * @param {View} this
         */
        this.fireEvent('key_up', [ e.key, this.value, this ]);
    },

    keyDown:function (e) {
        /**
         * key down event
         * @event key_down
         * @param {String} key
         * @param {String|Boolean|Object|Number} value
         * $param {View} this
         */
        this.fireEvent('key_down', [ e.key, this.value, this ]);
    },

    keyPress:function (e) {
        /**
         * key press event
         * @event key_press
         * @param {String} key
         * @param {String|Boolean|Object|Number} value
         * $param {View} this
         */
        this.fireEvent('key_press', [ e.key, this.value, this ]);
    },

    focus:function () {
        this._focus = true;
        this.clearInvalid();
        /**
         * On focus event
         * @event focus
         * @param {String|Boolean|Object|Number} value
         * $param {View} this
         */
        this.fireEvent('focus', [ this.value, this ]);
    },
    change:function () {
        if (this.els.formEl) {
            this._set(this.els.formEl.val());

        }
        /**
         * On change event. This event is fired when value is changed manually
         * by the user via GUI. The "change" event is followed by a
         * "valueChange" event.
         * When value is changed using the setValue method
         * only the "valueChange" event is fired.
         *
         * @event change
         * @param {String|Boolean|Object|Number} value
         * $param {View} this
         */
        if (this.wasValid)this.fireEvent('change', [ this._get(), this ]);
    },

    blur:function () {
        this._focus = false;
        this.validate();
        if (this.getFormEl())this.value = this.getValueOfFormEl();
        this.toggleDirtyFlag();
        /**
         * On blur event
         * @event blur
         * @param {String|Boolean|Object|Number} value
         * $param {View} this
         */
        this.fireEvent('blur', [ this.value, this ]);
    },

    getValueOfFormEl:function(){
        return this.getFormEl().val();
    },

    toggleDirtyFlag:function(){
        if (this.value !== this.initialValue) {
            /**
             * @event dirty
             * @description event fired on blur when value is different from it's original value
             * @param {String} value
             * @param {Object} ludo.form.* component
             */
            this.setDirty();
            this.fireEvent('dirty', [this.value, this]);
        } else {
            /**
             * @event clean
             * @description event fired on blur when value is equal to original/start value
             * @param {String} value
             * @param {Object} ludo.form.* component
             */
            this.setClean();
            this.fireEvent('clean', [this.value, this]);
        }
    },

    hasFocus:function () {
        return this._focus;
    },
    insertJSON:function (data) {
        this.populate(data);
    },
    populate:function () {

    },
    getLabel:function () {
        return this.label;
    },
    /**
     * Return current value
     * @function getValue
     * @return string
     */
    getValue:function () {
        console.warn("Use of deprecated getValue");
        console.trace();
        return this.els.formEl ? this.els.formEl.val() : this.value;
    },


    val:function(val){
        if(arguments.length == 0){
            return this._get();
        }
        this._set(val);
    },

    _get:function(){
        return this.els.formEl ? this.els.formEl.val() : this.value;
    },

    _set:function(value){

        if (!this.isReady) {
            if(value)this._set.delay(50, this, value);
            return;
        }

        if (value == this.value) {
            return value;
        }

        this.setFormElValue(value);
        this.value = value;



        this.validate();

        if (this.wasValid) {
            /**
             * This event is fired whenever current value is changed, either
             * manually by user or by calling setValue. When the value is changed
             * manually by user via GUI, the "change" event is fired first, then
             * "valueChange" afterwards.
             * @event valueChange
             * @param {Object|String|Number} value
             * @param {form.Element} form component
             */
            this.fireEvent('valueChange', [this._get(), this]);
            if (this.stateful)this.fireEvent('state');
            if (this.linkWith)this.updateLinked();
        }

        this.fireEvent('value', value);

        return value;
    },

    /**
     * Set new value
     * @function setValue
     * @param value
     * @return void
     */
    setValue:function (value) {
        console.warn("Use of deprecated setValue");
        console.trace();
        if (!this.isReady) {
            if(value)this.val.delay(50, this, value);
            return;
        }

        if (value == this.value) {
            return;
        }

        this.setFormElValue(value);
        this.value = value;



        this.validate();

        if (this.wasValid) {
            /**
             * This event is fired whenever current value is changed, either
             * manually by user or by calling setValue. When the value is changed
             * manually by user via GUI, the "change" event is fired first, then
             * "valueChange" afterwards.
             * @event valueChange
             * @param {Object|String|Number} value
             * @param {form.Element} form component
             */
            this.fireEvent('valueChange', [this._get(), this]);
            if (this.stateful)this.fireEvent('state');
            if (this.linkWith)this.updateLinked();
        }

        this.fireEvent('value', value);
    },

    setFormElValue:function(value){
        if (this.els.formEl && this.els.formEl.val() !== value) {
            this.els.formEl.val(value);
            if(this.inlineLabel)this.els.formEl.removeClass('ludo-form-el-inline-label');
        }
    },

    /**
     * Get reference to input element
     * @function getFormEl
     * @return DOMElement
     */
    getFormEl:function () {
        return this.els.formEl;
    },
    /**
     * Returns true when value of form element is valid, i.e. larger than minValue, matching regex etc.
     * @function isValid
     * @return {Boolean} valid
     */
    isValid:function () {
        if(this.validators.length === 0)return true;

        var val = this.getFormEl() ? this.getValueOfFormEl().trim() : this.value;
        for (var i = 0; i < this.validators.length; i++) {
            if (!this.validators[i].fn.apply(this, [val, this[this.validators[i].key]])){
                return false;
            }
        }
        return true;
    },

    clearInvalid:function () {
        this.getEl().removeClass('ludo-form-el-invalid');
    },

    wasValid:true,

    validate:function () {
        this.clearInvalid();
        if (this.isValid()) {
            this.wasValid = true;
            /**
             * Event fired when value of form component is valid. This is fired on blur
             * @event valid
             * @param {String} value
             * @param {Object} component
             */
            this.fireEvent('valid', [this.value, this]);
            return true;
        } else {
            this.wasValid = false;
            /**
             * Event fired when value of form component is valid. This is fired on blur
             * @event invalid
             * @param {String} value
             * @param {Object} component
             */
            this.fireEvent('invalid', [this.value, this]);
            return false;
        }
    },

    isFormElement:function () {
        return true;
    },

    /**
     * Reset / Roll back to last committed value. It could be the value stored by last commit method call
     * or if the original value/default value of this field.
     * @function reset
     * @memberof ludo.form.Element.prototype
     * @return void
     */
    reset:function () {
        this._set(this.initialValue);
    },

    /**
     * Reset value back to the original value sent(constructor value)
     * @function clear
     * @memberof ludo.form.Element.prototype
     */
    clear:function () {
        this._set(this.constructorValue);
    },

    /**
     * Update initial value to current value. These actions will always trigger a commit<br>
     * - Form or Model submission
     * - Fetching new record for a ludo.model.Model
     * @function commit
     * @memberOf ludo.form.Element.prototype
     */
    commit:function () {
        if(!this.isReady){
            this.commit.delay(100, this);
            return;
        }
        this.initialValue = this.value;
    },
    /**
     * Returns true if current value is different from original value
     * @function isDirty
     * @return {Boolean} isDirty
     */
    isDirty:function () {
        return this.dirtyFlag;
    },

    setDirty:function () {
        this.dirtyFlag = true;
        this.getEl().addClass('ludo-form-el-dirty');
    },

    setClean:function () {
        this.dirtyFlag = false;
        var el = this.getEl();
        if(el)el.removeClass('ludo-form-el-dirty');
    },

    setReady:function () {
        this.isReady = true;
    },

    updateLinked:function () {
        var cmp = this.getLinkWith();
        if (cmp && cmp.value !== this.value) {
            cmp._set(this.value);
        }
    },

    setLinkWith:function (linkWith) {
        this.linkWith = linkWith;
        this.addEvent('valueChange', this.updateLinked.bind(this));
    },

    createBackLink:function (attempts) {
        attempts = attempts || 0;
        var cmp = this.getLinkWith();
        if (cmp && !cmp.linkWith) {
            if (this.value === undefined){
				this.initialValue = this.constructorValue = cmp.value;
				this._set(cmp.value);
			}
            cmp.setLinkWith(this);
        } else {
            if (attempts < 100) {
                this.createBackLink.delay(50, this, attempts + 1);
            }
        }
    },

    addInput: function () {
        if (!this.inputTag) {
            return;
        }

        this.els.inputCell = $('<div class="input-cell"></div>');
        this.getBody().append(this.els.inputCell);
        this.els.formEl = $('<' + this.inputTag + '>');

        if (this.inputType) {
            this.els.formEl.attr('type', this.inputType);
        }
        if (this.maxLength) {
            this.els.formEl.attr('maxlength', this.maxLength);
        }
        if (this.readonly) {
            this.els.formEl.attr('readonly', true);
        }
        this.getInputCell().append(this.els.formEl);
        this.els.formEl.css('width', '100%');
        this.els.formEl.attr("id", this.getFormElId());
    },

    getLinkWith:function(){
        var cmp = ludo.get(this.linkWith);
        return cmp ? cmp : this.parentComponent ? this.parentComponent.child[this.linkWith] : undefined;
    },

    getInputCell:function(){
        return this.els.inputCell;
    }
});/* ../ludojs/src/form/label-element.js */
/**
 * // TODO this class should be removed. Instead, think of layout for forms and a separate label class
 * Base class for all form elements with label
 * @namespace ludo.form
 * @class LabelElement
 * @augments ludo.form.Element
 */
ludo.form.LabelElement = new Class({
    Extends: ludo.form.Element,

    fieldTpl: ['<table ', 'cellpadding="0" cellspacing="0" border="0" width="100%">',
        '<tbody>',
        '<tr class="input-row">',
        '<td class="label-cell"><label class="input-label"></label></td>',
        '<td><div class="input-cell"></div></td>',
        '<td class="invalid-cell" style="position:relative"><div class="invalid-cell-div"></div></td>',
        '<td class="suffix-cell" style="display:none"><label></label></td>',
        '<td class="help-cell" style="display:none"></td>',
        '</tr>',
        '</tbody>',
        '</table>'
    ],

    /**
     * Suffix after the label. Default is ":" (colon)
     * @memberof ludo.form.LabelElement.prototype
     * @default ":"
     * @property {string} labelSuffix
     */
    labelSuffix: ':',

    ludoConfig: function (config) {
        this.parent(config);
        this.setConfigParams(config, ['inlineLabel', 'labelSuffix']);
        if (!this.supportsInlineLabel())this.inlineLabel = undefined;

        console.warn("Use of deprecated ancestor ludo.form.LabelElement");
        console.trace();
    },

    ludoEvents: function () {
        this.parent();
        if (this.inlineLabel) {
            var el = this.getFormEl();
            if (el) {
                el.on('blur', this.setInlineLabel.bind(this));
                el.on('focus', this.clearInlineLabel.bind(this));
                this.addEvent('value', this.clearInlineLabelCls.bind(this));
            }
        }
    },

    ludoDOM: function () {
        this.parent();
        this.getBody().html(this.fieldTpl.join(''));
        this.addInput();
        this.addLabel();
        this.setWidthOfLabel();

    },

    ludoRendered: function () {
        this.parent();
        if (this.inlineLabel)this.setInlineLabel();
    },

    supportsInlineLabel: function () {
        return true;
    },

    setInlineLabel: function () {
        if (!this.inlineLabel)return;
        var el = this.getFormEl();
        if (el.val().length === 0) {
            el.addClass('ludo-form-el-inline-label');
            el.val(this.inlineLabel);
        }
    },

    clear: function () {
        this.parent();
        this.setInlineLabel();
    },

    reset: function () {
        this.parent();
        this.setInlineLabel();
    },

    clearInlineLabel: function () {
        var el = this.getFormEl();
        if (el.val() === this.inlineLabel) {
            el.val('');
            this.getFormEl().removeClass('ludo-form-el-inline-label');
        }
    },

    clearInlineLabelCls: function () {
        this.getFormEl().removeClass('ludo-form-el-inline-label');
    },

    getValueOfFormEl: function () {
        var val = this.getFormEl().val();
        return this.inlineLabel && this.inlineLabel === val ? '' : val;
    },

    addLabel: function () {
        if (this.label !== undefined) {
            this.getLabelDOM().html(this.label ? this.label + this.labelSuffix : '');
            this.els.label.attr('for', this.getFormElId());
        }
        if (this.suffix) {
            var s = this.getSuffixCell();
            s.css('display', '');
            var label = s.find('label').first();
            if (label) {
                label.html(this.suffix);
                label.attr('for', this.getFormElId());
            }
        }
    },

    setWidthOfLabel: function () {
        if (this.label === undefined) {
            this.getLabelDOM().css('display', 'none');
        } else {
            this.getLabelDOM().parent().css('width', this.labelWidth);
        }
    },

    getLabelDOM: function () {
        return this.getCell('.input-label', 'label');
    },

    addInput: function () {
        if (!this.inputTag) {
            return;
        }
        this.els.formEl = $('<' + this.inputTag + '>');

        if (this.inputType) {
            this.els.formEl.attr('type', this.inputType);
        }
        if (this.maxLength) {
            this.els.formEl.attr('maxlength', this.maxLength);
        }
        if (this.readonly) {
            this.els.formEl.attr('readonly', true);
        }
        this.getInputCell().append(this.els.formEl);
        if (this.fieldWidth) {
            this.els.formEl.css('width', this.fieldWidth);
            this.getInputCell().parent().css('width', (this.fieldWidth + ludo.dom.getMBPW(this.els.formEl)));
        }
        this.els.formEl.id = this.getFormElId();
    },

    getSuffixCell: function () {
        return this.getCell('.suffix-cell', 'labelSuffix');
    },

    getInputCell: function () {
        return this.getCell('.input-cell', 'cellInput');
    },

    getInputRow: function () {
        return this.getCell('.input-row', 'inputRow');
    },

    getCell: function (selector, cacheKey) {
        if (!this.els[cacheKey]) {
            this.els[cacheKey] = this.getBody().find(selector + ":first");
        }
        return this.els[cacheKey];
    },

    resizeDOM: function () {
        this.parent();
        if (this.els.formEl) {
            if (this.stretchField) {
                var width = this.getWidth();
                if (!isNaN(width) && width > 0) {
                    width -= (ludo.dom.getMBPW(this.getEl()) + ludo.dom.getMBPW(this.getBody()));
                } else {
                    var parent = this.getParent();
                    if (parent && parent.layout.type !== 'linear' && parent.layout.orientation !== 'horizontal') {
                        width = parent.getWidth();
                        width -= (ludo.dom.getMBPW(parent.getEl()) + ludo.dom.getMBPW(parent.getBody()));
                        width -= (ludo.dom.getMBPW(this.getEl()) + ludo.dom.getMBPW(this.getBody()));
                    } else {
                        var c = this.els.container;
                        width = c.offsetWidth - ludo.dom.getMBPW(this.els.body) - ludo.dom.getPW(c) - ludo.dom.getBW(c);
                    }
                }
                if (this.label !== undefined)width -= this.labelWidth;
                if (this.suffix)width -= this.getSuffixCell().offsetWidth;
                if (this.inputTag !== 'select') width -= 5;
                if (width > 0 && !isNaN(width)) {
                    this.formFieldWidth = width;
                    this.getFormEl().css('width', width);
                }
            }else{

            }
        }
    }
});/* ../ludojs/src/form/slider.js */
/**
 * Slider form component
 * @namespace ludo.form
 * @class Slider
 * @augments ludo.form.LabelElement
 */
ludo.form.Slider = new Class({
    // TODO implement support for min and max, example slider from 0 to 100, min and max from 10 to 90
    Extends:ludo.form.LabelElement,
    cssSignature:'ludo-form-slider',
    type:'form.Slider',
    fieldTpl:['<table ','cellpadding="0" cellspacing="0" border="0" width="100%">',
        '<tbody>',
        '<tr class="input-row">',
        '<td class="label-cell"><label class="input-label"></label></td>',
        '<td class="input-cell"></td>',
        '<td class="suffix-cell" style="display:none"></td>',
        '<td class="help-cell" style="display:none"></td>',
        '</tr>',
        '</tbody>',
        '</table>'
    ],

    /* No input element for slider */
    inputTag:undefined,
    inputType:undefined,

    /**
     * Size of slider background
     * @property sliderSize
	 * @optional
     * @private
     */
    sliderSize:100,

    /**
     * Direction of slider. If not explicit set, it will
     * be set to "horizontal" when width of slide is greater than height of slider,
     * otherwise it will be set to "vertical".
     * @property {String} direction
	 * @type String
     * @default horizontal
	 * @optional
     *
     */
    direction:'horizontal',

    /**
     * Minimum value of slider
     * @attribute {Number} minValue
     * @default 1
     */
    minValue:1,

    /**
     * Maximum value of slider
     * @attribute {Number} maxValue
     * @default 10
     */
    maxValue:10,

    height:undefined,

    /**
     * Revert x-, or y-axis, i.e. minimum value to the right instead of left or at the top instead of bottom
     * @attribute {Boolean} reverse
     * @default false
     */
    reverse:false,


    ludoConfig:function (config) {
        this.parent(config);
        this.setConfigParams(config, ['direction','minValue','maxValue','reverse']);
    },

    ludoRendered:function () {
        this.parent();
        this.moveSliderBackgrounds();
    },

    moveSliderBackgrounds:function () {
        var offset = Math.round(this.getHandleSize() / 2);
        var css = this.getDirection() == 'horizontal' ? ['left','right'] : ['top','bottom'];
        this.els['bgfirst'].css(css[0], offset + 'px');
        this.els['bglast'].css(css[1], offset + 'px');
    },

    addInput:function () {
        this.parent();

        var el = this.els.slider = $('<div>');
        this.els.slider.on('click', this.sliderClick.bind(this));

        el.addClass('ludo-form-slider-container');
        el.addClass('ludo-form-slider-' + this.getDirection());
        this.getInputCell().append(el);

        this.addSliderBg('first');
        this.addSliderBg('last');

        this.createSliderHandle();
    },

    createSliderHandle:function () {
        this.els.sliderHandle = $('<div class="ludo-form-slider-handle"></div>');
        this.els.slider.append(this.els.sliderHandle);
        this.drag = new ludo.effect.Drag(this.getDragConfig());
    },

    addSliderBg:function (pos) {
        this.els['bg' + pos] = $('<div class="ludo-form-slider-bg-' + pos + '"></div>');
        this.els.slider.append(this.els['bg' + pos])
    },

    getDragConfig:function () {
        return {
            el:this.els.sliderHandle,
            fireEffectEvents:false,
            directions:this.getDirection() == 'horizontal' ? 'X' : 'Y',
            listeners:{
                'drag':this.receivePosition.bind(this)
            },
            minPos:0,
            maxPos:this.getSliderSize()
        };
    },

    sliderClick:function (e) {
        if (!$(e.target).hasClass('ludo-form-slider-handle')) {
            var pos = this.els.slider.position();
            var offset = Math.round(this.getHandleSize() / 2);
            this.receivePosition({
                x:e.pageX - pos.left - offset,
                y:e.pageY - pos.top - offset
            });
        }

    },
    receivePosition:function (pos) {
        this._set(this.pixelToValue(this.getDirection() == 'horizontal' ? pos.x : pos.y));
        /**
         * Change event
         * @event change
         * @param value of form field
         * @param Component this
         */
        this.fireEvent('change', [ this.value, this ]);
    },

    pixelToValue:function (px) {
        var min = this.getMinValue();
        var max = this.getMaxValue();

        var sliderSize = this.getSliderSize();
        var ret = Math.round(px / sliderSize * (max - min)) + min;
        if (this.shouldReverseAxis()) {
            ret = max - ret;
        }

        return ret;
    },

    getDirection:function () {
        if (this.direction === undefined) {
            var size = this.getBody().getSize();
            if (size.x >= size.y) {
                this.direction = 'horizontal';
            } else {
                this.direction = 'vertical';
            }
        }
        return this.direction;
    },

    getMinValue:function () {
        return this.minValue;
    },

    getMaxValue:function () {
        return this.maxValue;
    },
    setValue:function(value){
        console.warn("Use of deprecated setValue");
        console.trace();
    },

    _set:function (value) {
        if (value > this.getMaxValue()) {
            value = this.getMaxValue();
        } else if (value < this.getMinValue()) {
            value = this.getMinValue();
        }
        this.parent(value);
        this.positionSliderHandle();
        this.toggleDirtyFlag();
    },

    resizeDOM:function () {
        this.parent();
        if (this.direction == 'horizontal') {
            this.sliderSize = this.els.slider.width();
        } else {
            this.sliderSize = this.getBody().height() - ludo.dom.getMH(this.els.slider);
            this.els.slider.css('height',  this.getHeight() + 'px');
        }
        this.sliderSize -= this.getHandleSize();

        this.positionSliderHandle();
        this.drag.setMaxPos(this.sliderSize);
    },

    positionSliderHandle:function () {
        this.els.sliderHandle.css(this.handleCssProperty, this.getHandlePos() + 'px');
    },

    getHandlePos:function () {
        var ret = Math.round((this.value - this.minValue) / (this.maxValue - this.minValue) * this.sliderSize);
        if (this.shouldReverseAxis()) {
            ret = this.sliderSize - ret;
        }
        return ret;
    },
    _shouldReverse:undefined,
    shouldReverseAxis:function () {
        if (this._shouldReverse == undefined) {
            this._shouldReverse = (this.direction == 'horizontal' && this.reverse) || (this.direction == 'vertical' && !this.reverse);
        }
        return this._shouldReverse;
    },

    getSliderSize:function () {
        return this.sliderSize;
    },

    getHandleSize:function () {
        if (this.handleSize === undefined) {
            var cssProperty = 'height';
            this.handleCssProperty = 'top';
            if (this.getDirection() == 'horizontal') {
                cssProperty = 'width';
                this.handleCssProperty = 'left';
            }

            this.handleSize = parseInt(this.els.sliderHandle.css(cssProperty).replace('px', ''));
        }
        return this.handleSize;
    },

    supportsInlineLabel:function(){
        return false;
    }
});/* ../ludojs/src/color/rgb-slider.js */
ludo.color.RGBSlider = new Class({
    Extends:ludo.color.Base,
	type:'color.RGBSlider',
    layout:{
        type:'relative'
    },
    value:'#000000',
    regex:/^\#[0-9A-Fa-f]{6}$/i,

    ludoConfig:function (config) {
        this.parent(config);
        this.setConfigParams(config, ['value']);
    },

    ludoRendered:function () {
        this.parent();
        this.updatePreview();
        this.child['preview'].child['colorValue'].addEvent('setColor', this.receiveColor.bind(this));
    },

    show:function(){
        this.parent();
        this.updateSliders();
    },

    setColor:function (color) {
        if (this.regex.test(color)) {
            this.value = color;
            this.updateSliders();
        }
    },

    getClassChildren:function () {
        return [
            this.getSlider('red', undefined),
            this.getSlider('green', 'red'),
            this.getSlider('blue', 'green'),
            this.getNumberField('red', undefined),
            this.getNumberField('green', 'redValue'),
            this.getNumberField('blue', 'greenValue'),
            {
                id:'colorPreview',
                name:'preview',
                layout:{
                    alignParentLeft:true,
                    fillRight:true,
                    below:'blueValue',
                    fillDown:true,
                    width:'matchParent',
                    type:'relative'
                },
                css:{
                    border:'1px solid #000'
                },
                elCss:{
                    margin:3
                },
                children:[
                    {
                        name:'colorValue',
                        type:'color.RGBSliderValue'
                    }
                ]
            }
        ];
    },

    receiveColor:function (color) {
        this.fireEvent('setColor', color.toUpperCase());
    },

    getSlider:function (name, below) {
        return {
            name:name,
            id:name,
            value:this.getColorValue(name),
            type:'form.Slider',
            label:name.substr(0, 1).toUpperCase() + name.substr(1), minValue:0, maxValue:255,
            labelWidth:45,
            layout:{
                alignParentTop:below ? false : true,
                below:below,
                height:23,
                leftOf:name + 'Value',
                fillLeft:true
            },
            listeners:{
                'change':this.updatePreview.bind(this)
            }
        };
    },

    getNumberField:function (name, below) {
        return {
            type:'form.Number',
            minValue:0,
            maxValue:255,
            fieldWidth:30,
            value:this.getColorValue(name),
            label:'',
            name:name + 'Value',
            linkWith:name,
            layout:{
                alignParentRight:true,
                width:40,
                below:below
            },
            listeners:{
                'change':this.updatePreview.bind(this)
            }
        };
    },

    updatePreview:function () {
        var items = ['red', 'green', 'blue'];
        var color = '#';

        for (var i = 0; i < items.length; i++) {
            color = color + this.prefixed(parseInt(this.child[items[i]].val()).toString(16));
        }
        this.child['preview'].getBody().css('backgroundColor',  color);
        this.child['preview'].child['colorValue'].setColor(color);

    },

    prefixed:function (color) {
        return color.length === 1 ? '0' + color : color;
    },
    cInstance:undefined,
    colorInstance:function () {
        if (this.cInstance === undefined) {
            this.cInstance = new ludo.color.Color();
        }
        return this.cInstance;
    },

    getColorValue:function (color) {
        return this.colorInstance().rgbObject(this.value)[color.substr(0, 1)] || 0;
    },

    updateSliders:function(){

        if(!this.child['red'] || !this.value)return;

        var color = this.colorInstance().rgbObject(this.value);

        this.child['red'].val(color.r);
        this.child['green'].val(color.g);
        this.child['blue'].val(color.b);
        this.updatePreview();
    }
});

ludo.color.RGBSliderValue = new Class({
    Extends:ludo.View,
    color:undefined,
    cls:'ludo-color-rgb-slider-value',
    layout:{
        width:70,
        height:20,
        centerInParent:true
    },

    overflow:'hidden',

    ludoEvents:function () {
        this.parent();
        this.getBody().on('click', this.sendColor.bind(this));
    },

    setColor:function (color) {
        this.color = color;
        this.getBody().html(color.toUpperCase());
    },

    sendColor:function () {
        this.fireEvent('setColor', this.color);
    }
});/* ../ludojs/src/color/boxes.js */
ludo.color.Boxes = new Class({
    Extends : ludo.color.Base,

    ludoConfig:function(config){
        this.parent(config);
        this.setConfigParams(config, ['colors']);
    },

    ludoDOM:function(){
        this.parent();
        this.getBody().css('overflowY', 'auto');
    },

    ludoEvents:function(){
        this.parent();
        this.getBody().on('click', this.clickOnColorBox.bind(this));
    },

    ludoRendered:function(){
        this.parent();
        this.addColorBoxes();
    },

    addColorBoxes:function(){
        var html = [];
        for(var i=0;i<this.colors.length;i++){
            var colors = this.getColorsIn(this.colors[i]);
            if(colors.length > 1){
                html.push('<div style="clear:both">');
            }
            for(var j=0;j<colors.length;j++){
                html.push(this.getColorBox(colors[j]));
            }
            if(colors.length > 1){
                html.push('</div>');
            }
        }
        this.getBody().html(html.join(''));

    },

    getColorBox:function(color){
		if(!ludo.util.isArray(color))color = [color,color];
        var ret = [];
        ret.push('<div title="' + color[0] + '" rgbColor="' + color[1] + '" class="ludo-color-box" style="background-color:' + color[1] + '"></div>');
        return ret.join('');
    },

    getColorsIn:function(category){
        var ret = [];
        switch(category){
            case 'grayScale':
                for(var i=0;i<256;i+=8){
                    var c = this.getColorPrefixed(i);
                    var color = '#' + c + c +c;
                    ret.push([color,color] );
                }
                break;
            case 'namedColors':
                return this.namedColors;
            default:
                return category;

        }
        return ret;
    },

    getColorPrefixed:function(colorNum){
        var ret = colorNum.toString(16);
        if(ret.length === 1)ret = '0' + ret;
        return ret;
    },

    clickOnColorBox:function(e){
        if($(e.target).hasClass('ludo-color-box')){
            this.fireEvent('setColor', $(e.target).attr('rgbColor'));
        }
    }
});/* ../ludojs/src/color/named-colors.js */
ludo.color.NamedColors = new Class({
	Extends: ludo.color.Boxes,
	colors:['grayScale','namedColors'],
	namedColors:[
		['AliceBlue','#F0F8FF'],['AntiqueWhite','#FAEBD7'],['Aqua','#00FFFF'],['Aquamarine','#7FFFD4'],
		['Azure','#F0FFFF'],['Beige','#F5F5DC'],['Bisque','#FFE4C4'],['Black','#000000'],['BlanchedAlmond','#FFEBCD'],
		['Blue','#0000FF'],['BlueViolet','#8A2BE2'],['Brown','#A52A2A'],['BurlyWood','#DEB887'],['CadetBlue','#5F9EA0'],
		['Chartreuse','#7FFF00'],['Chocolate','#D2691E'],['Coral','#FF7F50'],['CornflowerBlue','#6495ED'],
		['Cornsilk','#FFF8DC'],['Crimson','#DC143C'],['Cyan','#00FFFF'],['DarkBlue','#00008B'],['DarkCyan','#008B8B'],
		['DarkGoldenRod','#B8860B'],['DarkGray','#A9A9A9'],['DarkGreen','#006400'],['DarkKhaki','#BDB76B'],
		['DarkMagenta','#8B008B'],['DarkOliveGreen','#556B2F'],['Darkorange','#FF8C00'],['DarkOrchid','#9932CC'],
		['DarkRed','#8B0000'],['DarkSalmon','#E9967A'],['DarkSeaGreen','#8FBC8F'],['DarkSlateBlue','#483D8B'],
		['DarkSlateGray','#2F4F4F'],['DarkTurquoise','#00CED1'],['DarkViolet','#9400D3'],['DeepPink','#FF1493'],
		['DeepSkyBlue','#00BFFF'],['DimGray','#696969'],['DimGrey','#696969'],['DodgerBlue','#1E90FF'],
		['FireBrick','#B22222'],['FloralWhite','#FFFAF0'],['ForestGreen','#228B22'],['Fuchsia','#FF00FF'],
		['Gainsboro','#DCDCDC'],['GhostWhite','#F8F8FF'],['Gold','#FFD700'],['GoldenRod','#DAA520'],['Gray','#808080'],
		['Green','#008000'],['GreenYellow','#ADFF2F'],['HoneyDew','#F0FFF0'],['HotPink','#FF69B4'],['IndianRed','#CD5C5C'],
		['Indigo','#4B0082'],['Ivory','#FFFFF0'],['Khaki','#F0E68C'],['Lavender','#E6E6FA'],['LavenderBlush','#FFF0F5'],
		['LawnGreen','#7CFC00'],['LemonChiffon','#FFFACD'],['LightBlue','#ADD8E6'],['LightCoral','#F08080'],
		['LightCyan','#E0FFFF'],['LightGoldenRodYellow','#FAFAD2'],['LightGray','#D3D3D3'],['LightGreen','#90EE90'],
		['LightPink','#FFB6C1'],['LightSalmon','#FFA07A'],['LightSeaGreen','#20B2AA'],['LightSkyBlue','#87CEFA'],
		['LightSlateGray','#778899'],['LightSteelBlue','#B0C4DE'],['LightYellow','#FFFFE0'],['Lime','#00FF00'],
		['LimeGreen','#32CD32'],['Linen','#FAF0E6'],['Magenta','#FF00FF'],['Maroon','#800000'],['MediumAquaMarine','#66CDAA'],
		['MediumBlue','#0000CD'],['MediumOrchid','#BA55D3'],['MediumPurple','#9370DB'],['MediumSeaGreen','#3CB371'],
		['MediumSlateBlue','#7B68EE'],['MediumSpringGreen','#00FA9A'],['MediumTurquoise','#48D1CC'],['MediumVioletRed','#C71585'],
		['MidnightBlue','#191970'],['MintCream','#F5FFFA'],['MistyRose','#FFE4E1'],['Moccasin','#FFE4B5'],['NavajoWhite','#FFDEAD'],
		['Navy','#000080'],['OldLace','#FDF5E6'],['Olive','#808000'],['OliveDrab','#6B8E23'],['Orange','#FFA500'],
		['OrangeRed','#FF4500'],['Orchid','#DA70D6'],['PaleGoldenRod','#EEE8AA'],['PaleGreen','#98FB98'],['PaleTurquoise','#AFEEEE'],
		['PaleVioletRed','#DB7093'],['PapayaWhip','#FFEFD5'],['PeachPuff','#FFDAB9'],['Peru','#CD853F'],['Pink','#FFC0CB'],
		['Plum','#DDA0DD'],['PowderBlue','#B0E0E6'],['Purple','#800080'],['Red','#FF0000'],['RosyBrown','#BC8F8F'],
		['RoyalBlue','#4169E1'],['SaddleBrown','#8B4513'],['Salmon','#FA8072'],['SandyBrown','#F4A460'],['SeaGreen','#2E8B57'],
		['SeaShell','#FFF5EE'],['Sienna','#A0522D'],['Silver','#C0C0C0'],['SkyBlue','#87CEEB'],['SlateBlue','#6A5ACD'],
		['SlateGray','#708090'],['Snow','#FFFAFA'],['SpringGreen','#00FF7F'],['SteelBlue','#4682B4'],['Tan','#D2B48C'],
		['Teal','#008080'],['Thistle','#D8BFD8'],['Tomato','#FF6347'],['Turquoise','#40E0D0'],['Violet','#EE82EE'],
		['Wheat','#F5DEB3'],['White','#FFFFFF'],['WhiteSmoke','#F5F5F5'],['Yellow','#FFFF00'],['YellowGreen','#9ACD32']
	]

});/* ../ludojs/src/color/rgb-colors.js */
ludo.color.RgbColors = new Class({
	Extends: ludo.color.Boxes,
	colors:['rgb','grayScale'],

	getColorsIn:function(category){

		switch(category){
			case 'rgb':
				var ret = [];
				for(var r = 15;r>=0;r-=3){
					for(var g = 0;g<16;g+=3){
						for(var b = 0;b<16;b+=3){
							ret.push(this.getColorFrom(r,g,b));
						}
					}
				}

				return ret;
			default:
				return this.parent(category);
		}

	},

	getColorFrom:function(r,g,b){
		return '#' + this.getHexColor(r) + this.getHexColor(g) + this.getHexColor(b);
	},

	getHexColor:function(color){
		color = color.toString(16).toUpperCase();
		return color + color;
	}

});/* ../ludojs/src/layout/table.js */
/**
 * When layout.type is set to "table", children will be arranged in a table layout.
 * For demo, see <a href="../demo/layout/table.php">Table layout demo</a>.
 * @namespace ludo.layout
 * @class ludo.layout.Table
 * @param {Object} config
 * @param {Object} config.columns Column configuration for the table layout. These layout options are added to the parent View.
 * @param {Number} config.columns.width Optional width of column
 * @param {Number} config.columns.weight Optional width weight of columns. "weight" means use remaining space.
 * In a view where width is 400, and you have three columns, one with fixed with of 100,
 * one with weight of 1 and one width weight of 2, the first column will use get its fixed with of 100.
 * The second one will get a width of 100(300(remaining width) * 1(weight) / 3(total weight)) and last column a width of 200
 * (300(remaining width) * 2(weight) / 3(total weight))
 * @param {Number} config.row true to create a new row. (Option for child layout)
 * @param {Number} config.vAlign Optional Vertical alignment of View(top|middle|bottom|baseline). Default: "top"(Option for child layout)
 * @example
 var w = new ludo.Window({
        title: 'Table layout',
        layout: {
            // position and size of this window
            left: 20, top: 20,width: 600, height: 600,
            // render children in a table layout
            type: 'table',
            // Define columns, weight means use remaining space
            columns: [
                {width: 100}, {width: 200}, {weight: 1}
            ]
        },
        css: {
            border: 0
        },
        children: [
            {html: 'First row 1 '},
            {html: 'First row 2 '},
            // Table picker below spans 3 rows
            {
                type: 'calendar.TimePicker',
                layout: {
                    height: 200,
                    weight:1,
                    rowspan: 3
                }
            },
            // Place the cell below in a new row
            {html: 'Second row 1 ', layout: {row: true, vAlign : 'top' }},
            {html: 'Second row 2 '},
            {html: 'Third row 1 ', layout: {row: true, colspan : 2}}
        ]
    });
 */
ludo.layout.Table = new Class({
    Extends: ludo.layout.Base,

    table: undefined,
    tbody: undefined,
    countChildren: undefined,
    cols: undefined,
    currentRow: undefined,

    fixedWidth: undefined,
    totalWeight: undefined,


    countCellsInNextRow: undefined,


    onCreate: function () {
        this.parent();

        this.countChildren = 0;
        this.cols = this.view.layout.columns;
        this.fixedWidth = 0;
        this.totalWeight = 0;
        var cols = [];
        for (var i = 0; i < this.cols.length; i++) {
            var col = this.cols[i];
            var numWidth = col.width != undefined ? col.width : 0;
            this.fixedWidth += numWidth;
            this.totalWeight += (col.weight != undefined ? col.weight : 0);
            var width = numWidth != undefined ? ' width="' + numWidth + '"' : "";
            cols.push('<col' + width + '>');
        }

        this.table = $('<table style="padding:0;margin:0;border-collapse: collapse"><colgroup>' + (cols.join('')) + '</table>');
        this.tbody = $('<tbody></tbody>');
        this.table.append(this.tbody);

        this.view.getBody().append(this.table);

    },

    addChild: function (child, insertAt, pos) {
        return this.parent(child, insertAt, pos);
    },

    getParentForNewChild: function (child) {
        if (this.countChildren == 0 || child.layout.row) {
            this.currentRow = $('<tr></tr>');
            this.tbody.append(this.currentRow);
            this.countChildren = 0;

            this.countCellsInNextRow = this.cols.length;

        }
        var colspan = child.layout.colspan ? child.layout.colspan : 1;
        var rowspan = child.layout.rowspan ? child.layout.rowspan : 1;

        var vAlign = child.layout.vAlign ? child.layout.vAlign : "top";

        var cell = $('<td style="vertical-align:' + vAlign + ';margin:0;padding:0" colspan="' + colspan + '" rowspan="' + rowspan + '"></td>');
        this.currentRow.append(cell);
        this.countChildren++;
        return cell;
    },

    resize: function () {
        console.log('resize table');
        var c = this.view.children;
        var curCellIndex = 0;
        for (var i = 0; i < c.length; i++) {
            var child = c[i];

            if (child.layout.row)curCellIndex = 0;

            var config = {};

            if (child.layout.height != undefined)config.height = child.layout.height;

            config.width = this.getWidthOfChild(child, curCellIndex);

            child.resize(config);
            child.saveState();
            curCellIndex += child.layout.colspan ? child.layout.colspan : 1;
        }

    },

    getWidthOfChild: function (child, colIndex) {
        var colspan = child.layout.colspan ? child.layout.colspan : 1;
        if(child.layout.width)return child.layout.width;
        var width = 0;
        var totalWidth = this.view.getBody().width();
        var weightWidth = totalWidth - this.fixedWidth;
        for (var i = colIndex; i < colIndex + colspan; i++) {
            console.log(i +',' + colspan);
            if (this.cols[i].width) {
                width += this.cols[i].width;
            } else if (this.cols[i].weight) {
                width += (weightWidth * this.cols[i].weight / this.totalWeight);
            }

        }
        return width;
    }

});/* ../ludojs/src/layout/accordion.js */
/**
 * This layout will render children in an Accordion. For a demo, see
 * <a href="../demo/layout/accordion.php" onclick="var w=window.open(this.href);return false">accordion demo</a>
 * @class ludo.layout.Accordion
 * @param {object} layout Layout config properties
 * @param {String} layout.type Set "type" to "accordion" on a parent view to render children in an accordion layout.
 * @param {String} layout.easing Easing for the animation. Default: "swing". easing is used for jQuery.animate, so any easing properties you have
 * available in jQuery or jQuery plugins are available here.
 * @param {number} layout.duration Duration of accordion animation in milliseconds(1/1000s).
 * @param {String} layout.title Option for child views inside an accordion layout. This is the title for the clickable title bar for each child view.
 * @example
 var w = new ludo.Window({
        title:'Accordion layout',
        layout:{
            left:50, top:50,
            width:700, height:600,
            type:'accordion',
            easing: 'linear',
            duration: 300
        },
        children:[
            {
                title: 'Drawing', // Title for the accordion
                html: '<img src="../images/drawing.png" style="margin-right:5px;margin-bottom:5px;float:left">' +
                'This is a Charcoal drawing on Smooth Newsprint paper. <br>',
                css:{ // CSS styling for the view
                    padding:5,
                    'font-size' : '1.2em',
                    'overflow-y': 'auto'
                }
            },
            {
                title: 'Second Accordion View',// Title for the accordion
                html: 'Second Accordion',
                css:{
                    padding:5
                }
            },
            {
                title: 'Source Code',// Title for the accordion
                type:'SourceCodePreview',
                css:{
                    padding:5
                }
            }
        ]
    });
 */

ludo.layout.Accordion = new Class({
    Extends: ludo.layout.Base,
    easing: 'swing',
    titleEls: undefined,
    titleHeight: undefined,


    expandedView: undefined,
    expandedChild: undefined,
    expandedTitle: undefined,

    childIndex: 0,

    duration: 200,
    busy: false,

    onCreate: function () {
        this.parent();
        var l = this.view.layout;
        if (l.easing != undefined)this.easing = l.easing;
        if (l.duration != undefined)this.duration = l.duration;
        this.titleEls = [];

    },

    addChild: function (child, insertAt, pos) {
        if (child.layout == undefined)child.layout = {};
        child.layout.index = this.childIndex++;

        return this.parent(child, insertAt, pos);
    },

    addChildEvents:function(child){
        child.addEvent('show', this.onShowHide.bind(this));
        child.addEvent('hide', this.onShowHide.bind(this));
    },

    onShowHide:function(child){

        var id = child.id;

        var style = child.hidden ? "none": "";


        $('#accordion-title-' + id).css('display', style);
        $('#accordion-' + id).css('display', style);

        this.measureTitleHeight();
        this.resize();


        if(!child.hidden)this.expandChild(id);

        if(id == this.expandedChild){
            this.expandedChild = this.firstExpanded();
            this.expandChild(this.expandedChild );
        }

    },

    onNewChild:function(child){
        this.parent(child);
        if(this.hasBeenRendered()){
            this.measureTitleHeight();
            this.resize();
        }
    },

    getParentForNewChild: function (child) {
        var el = $('<div class="ludo-framed-view-titlebar ludo-accordion-titlebar"></div>');

        var title = $('<div class="ludo-framed-view-titlebar-title ludo-accordion-title"></div>');
        var expand = $('<div class="ludo-accordion-collapsed"></div>');
        expand.attr("id", "accordion-expand-" + child.id);
        el.attr("id", "accordion-title-" + child.id);
        el.attr("data-accordion-for", child.id);
        el.on('click', this.getExpandFn(child));
        el.attr("data-child-index", child.layout.index);
        el.append(expand);
        el.append(title);
        if (child.title) {
            title.html(child.title);
        }
        this.view.getBody().append(el);

        this.titleEls.push(el);

        var container = $('<div class="ludo-accordion-container" style="height:0"></div>');
        container.attr("id", "accordion-" + child.id);
        this.view.getBody().append(container);

        if (child.hidden) {
            el.css('display', 'none');
            container.css('display', 'none');
        }
        return container;
    },

    getExpandFn: function (child) {
        return function () {
            this.expandChild(child.id);
        }.bind(this);
    },

    expandChild: function (id) {
        if (this.busy)return;

        var view = $("#accordion-" + id);
        var expand = $("#accordion-expand" + id);

        if (id == this.expandedChild)return;
        var h = this.viewport.height - this.titleHeight;

        if (this.expandedView) {
            var el = this.expandedView;
            var fn = this.onAnimationComplete.bind(this);
            var d = this.duration;
            var e = this.easing;


            view.height(0);
            $(function () {
                el.animate({height: 0, easing: e}, d, fn);
                view.animate({height: h, easing: e}, d);
            });
            this.busy = true;
        } else {
            view.animate({height: h}, 200);
        }
        this.expandedView = view;
        this.expandedChild = id;
        this.toggleTitle(id);
    },

    titleNextOfOpened: undefined,
    expandIcon: undefined,

    toggleTitle: function (id) {
        if (this.expandIcon) {
            this.expandIcon.removeClass('ludo-accordion-expanded');

        }
        this.expandIcon = $('#accordion-expand-' + id);
        this.expandIcon.addClass('ludo-accordion-expanded');
        this.expandedTitle = $("#accordion-title-" + id);
        if (this.titleNextOfOpened) {
            this.titleNextOfOpened.removeClass('ludo-accordion-titlebar-below-expanded');
        }
        var index = parseInt(this.expandedTitle.attr("data-child-index"));
        var next = this.nextVisible(index);

        if (next >= 0) {
            this.titleNextOfOpened = this.titleEls[next];
            this.titleNextOfOpened.addClass('ludo-accordion-titlebar-below-expanded');
        }

    },

    nextVisible: function (index) {
        for (var i = index + 1; i < this.view.children.length; i++) {
            if (!this.view.children[i].hidden) {
                return i;
            }
        }
        return -1;
    },

    measureTitleHeight: function () {
        this.titleHeight = 0;
        for (var i = 0; i < this.titleEls.length; i++) {
            if (!this.view.children[i].hidden) {
                this.titleHeight += this.titleEls[i].outerHeight();

            }
        }
    },

    onAnimationComplete: function () {
        this.busy = false;
    },

    beforeFirstResize: function () {
        this.measureTitleHeight();
        this.expandedChild = this.firstExpanded().id;
        this.expandedView = $('#accordion-' + this.expandedChild);
        this.expandedView.css('height', this.viewport.height - this.titleHeight);
        this.toggleTitle(this.expandedChild);

    },

    firstExpanded: function () {
        var ret = undefined;
        var c = this.view.children;
        for (var i = 0; i < c.length; i++) {
            if (c[i].layout.expanded && !c[i].hidden) {
                ret = c[i];
                break;
            }
        }
        if (!ret) {
            for (i = 0; i < c.length; i++) {
                if (!c[i].hidden) {
                    ret = c[i];
                    break;
                }
            }
        }

        return ret;
    },

    resize: function () {
        var c = this.view.children;
        var h = this.viewport.height - this.titleHeight;
        if (this.expandedView) {
            this.expandedView.css('height', h);
        }
        var size = {
            width: this.viewport.width,
            height: h
        };
        for (var i = 0; i < c.length; i++) {
            c[i].resize(size);
        }
    }
});/* ../ludojs/src/layout/linear.js */
/**
 * Abstract base class for linear layouts
 * @namespace layout
 * @class Linear
 */
ludo.layout.Linear = new Class({
	Extends:ludo.layout.Base,

    onCreate:function(){
        // TODO refactor this.
        this.view.getBody().css('overflow', 'hidden');
        this.parent();
    },

	onNewChild:function (child) {
		this.parent(child);
		this.updateLayoutObject(child);
		child.addEvent('collapse', this.minimize.bind(this));
		child.addEvent('expand', this.clearTemporaryValues.bind(this));
		child.addEvent('minimize', this.minimize.bind(this));
		child.addEvent('maximize', this.clearTemporaryValues.bind(this));
		child.addEvent('show', this.clearTemporaryValues.bind(this));
	},

	updateLayoutObject:function (child) {
		child.layout = child.layout || {};
		child.layout.width = child.layout.width || child.width;
		child.layout.height = child.layout.height || child.height;
		child.layout.weight = child.layout.weight || child.weight;
		child.layout.resizable = child.layout.resizable || child.resizable;
		child.layout.minWidth = child.layout.minWidth || child.minWidth;
		child.layout.maxWidth = child.layout.maxWidth || child.maxWidth;
		child.layout.minHeight = child.layout.minHeight || child.minHeight;
		child.layout.maxHeight = child.layout.maxHeight || child.maxHeight;
	},

	isResizable:function (child) {
		return child.layout.resizable ? true : false;
	},

	beforeResize:function (resize, child) {
		if (resize.orientation === 'horizontal') {
			resize.setMinWidth(child.layout.minWidth || 10);
			resize.setMaxWidth(child.layout.maxWidth || this.view.getBody().width());
		} else {
			resize.setMinHeight(child.layout.minHeight || 10);
			resize.setMaxHeight(child.layout.maxHeight || this.view.getBody().height());
		}
	},

	getResizableFor:function (child, r) {
		var resizeProp = (r === 'left' || r === 'right') ? 'width' : 'height';
		return new ludo.layout.Resizer({
			name:'resizer-' + child.name,
			orientation:(r === 'left' || r === 'right') ? 'horizontal' : 'vertical',
			pos:r,
            hidden:child.isHidden(),
			renderTo:this.view.getBody(),
			layout:{ width:5,height:5 },
			view:child,
			listeners:{
				'resize':function (change) {
					child.layout[resizeProp] += change;
					this.resize();
				}.bind(this),
				'before':this.beforeResize.bind(this)
			}
		});
	}
});/* ../ludojs/src/layout/linear-horizontal.js */
/**
 * This class arranges child views in a row layout.
 * @namespace layout
 * @class LinearVertical
 *
 */
ludo.layout.LinearHorizontal = new Class({
	Extends:ludo.layout.Linear,

	resize:function () {
		var totalWidth = this.view.getInnerWidthOfBody();
		var height = this.hasDynamicHeight() ? 'auto' : this.view.getInnerHeightOfBody();
		if (height == 0) {
			return;
		}

		var totalWidthOfItems = 0;
		var totalWeight = 0;
		for (var i = 0; i < this.view.children.length; i++) {
			if (this.view.children[i].isVisible()) {
				if (!this.hasLayoutWeight(this.view.children[i])) {
					var width = this.getWidthOf(this.view.children[i]);
					if (width) {
						totalWidthOfItems += width
					}
				} else {
					totalWeight += this.view.children[i].layout.weight;
				}
			}
		}
		totalWeight = Math.max(1, totalWeight);
		var remainingWidth;
		totalWidth = remainingWidth = totalWidth - totalWidthOfItems;

		var currentLeft = 0;
		for (i = 0; i < this.view.children.length; i++) {
			if (this.view.children[i].isVisible()) {
				var config = { 'height':height, 'left':currentLeft };
				if (this.hasLayoutWeight(this.view.children[i])) {
					if (this.view.children[i].id == this.idLastDynamic) {
						config.width = remainingWidth;
					} else {
						config.width = Math.round(totalWidth * this.view.children[i].layout.weight / totalWeight);
						remainingWidth -= config.width;
					}
				} else {
					config.width = this.getWidthOf(this.view.children[i]);
				}
				this.resizeChild(this.view.children[i], config);
				currentLeft += config.width;
			}
		}

		for (i = 0; i < this.resizables.length; i++) {
			this.resizables[i].colResize();
		}
	},

	resizeChild:function (child, resize) {
		child.layout.width = resize.width;
		child.layout.left = resize.left;
		child.resize(resize);
		child.saveState();
	},

	onNewChild:function (child) {
		this.parent(child);
		child.getEl().css('position', 'absolute');

		if (this.isResizable(child)) {
			var isLastSibling = this.isLastSibling(child);
			var resizer = this.getResizableFor(child, isLastSibling ? 'left' : 'right');
			this.addChild(resizer, child, isLastSibling ? 'before' : 'after');
		}
	},

	hasDynamicHeight:function () {
		return this.view.layout.height && this.view.layout.height == 'dynamic';
	}
});/* ../ludojs/src/layout/linear-vertical.js */
/**
 * This class arranges child views in a column layout (side by side).
 * @namespace layout
 * @class LinearVertical
 *
 */
ludo.layout.LinearVertical = new Class({
	Extends:ludo.layout.Linear,
	onCreate:function(){
		this.parent();
	},
	resize:function () {
		var componentHeight = this.view.getBody().height();
		if (componentHeight == 0) {
			return;
		}
		var totalHeightOfItems = 0;
		var totalWeight = 0;
		var height;
		var tm = 0;
		for (var i = 0; i < this.view.children.length; i++) {
			if (!this.hasLayoutWeight(this.view.children[i])) {
                height = this.view.children[i].isHidden() ? 0 :  this.getHeightOf(this.view.children[i]);
                totalHeightOfItems += height
			} else {
				if (!this.view.children[i].isHidden()) {
					totalWeight += this.view.children[i].layout.weight;
				}
			}
		}

		totalWeight = Math.max(1, totalWeight);

        var remainingHeight;
		var stretchHeight = remainingHeight = (componentHeight - totalHeightOfItems);


		var width = this.view.getBody().width();
		for (i = 0; i < this.view.children.length; i++) {
			if(!this.view.children[i].isHidden()){
				var config = {
					width:width
				};
				if (this.hasLayoutWeight(this.view.children[i])) {
					if (this.view.children[i].id == this.idLastDynamic) {
						config.height = remainingHeight;
					} else {
						config.height = Math.round(stretchHeight * this.view.children[i].layout.weight / totalWeight);
						remainingHeight -= config.height;
					}
				} else {
					config.height = this.getHeightOf(this.view.children[i]);
				}

				if (config.height < 0) {
					config.height = undefined;
				}
				if(tm > 0){
					config.top = tm;
				}
				if(this.view.children[i].getEl().css('position') === 'absolute'){
					tm += this.view.children[i].getHeight();
				}
				this.resizeChild(this.view.children[i], config);
			}
		}
	},
	resizeChild:function (child, resize) {
		child.layout.height = resize.height;

		child.resize(resize);
		child.saveState();
	},

	onNewChild:function (child) {
		this.parent(child);
		if (this.isResizable(child)) {
			var isLastSibling = this.isLastSibling(child);
			var resizer = this.getResizableFor(child, isLastSibling ? 'above' : 'below');
			this.addChild(resizer, child, isLastSibling ? 'before' : 'after');
		}
	}
});/* ../ludojs/src/layout/card.js */
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
/* ../ludojs/src/layout/tab-strip.js */
/* TODO should be able to update tab title when view title is changed */
ludo.layout.TabStrip = new Class({
    Extends:ludo.View,
    type:'layout.TabStrip',
    tabPos:'left',
    lm:undefined,
    tabs:{},
    currentPos:-1,
    activeTab:undefined,
    currentZIndex:3,

    ludoConfig:function (config) {
        this.parent(config);
        if (config.tabPos !== undefined)this.tabPos = config.tabPos;
        this.lm = config.lm;
    },
    ludoEvents:function () {
        this.parent();
        this.lm.addEvent('addChild', this.registerChild.bind(this));
        this.lm.addEvent('showChild', this.activateTabFor.bind(this));
        this.lm.addEvent('removeChild', this.removeTabFor.bind(this));
        this.addEvent('resize', this.resizeTabs.bind(this));
    },

    ludoRendered:function(){
        this.parent();
        this.resizeTabs();
    },

    registerChild:function (child) {
        if (!this.lm.isTabStrip(child)) {
            this.createTabFor(child);
        }
    },

    resizeTabs:function () {
        this.currentPos = -1;
        for (var key in this.tabs) {
            if (this.tabs.hasOwnProperty(key)) {
                var node = this.tabs[key];
                node.css(this.getPosAttribute(), this.currentPos + 'px');
                this.increaseCurrentPos(node);
            }
        }
    },

    createTabFor:function (child) {
        var node;
        if (this.tabPos === 'top' || this.tabPos == 'bottom') {
            node = this.getPlainTabFor(child);
        } else {
            node = this.getSVGTabFor(child);
        }

        node.on('click', child.show.bind(child, false));
        this.getBody().append(node);
        if (child.layout.closable) {
            this.addCloseButton(node, child);
        }
        node.css(this.getPosAttribute(), this.currentPos);
        node.addClass("ludo-tab-strip-tab");
        node.addClass('ludo-tab-strip-tab-' + this.tabPos);
        this.tabs[child.getId()] = node;
        this.increaseCurrentPos(node);
        if (!child.isHidden())this.activateTabFor(child);
    },

    addCloseButton:function (node, child) {
        var el = $('<div>');
        el.addClass('ludo-tab-close ludo-tab-close-' + this.tabPos);
        el.mouseenter(this.enterCloseButton.bind(this));
        el.mouseleave(this.leaveCloseButton.bind(this));
        el.id = 'tab-close-' + child.id;
        el.on('click', this.removeChild.bind(this));
        node.append(el);
        var p;
        switch (this.tabPos) {
            case 'top':
            case 'bottom':
                p = node.css('padding-right');
                node.css('paddingRight', (parseInt(p) + el.width()));
                break;
            case 'right':
                p = node.css('padding-right');
                node.css('paddingBottom', (parseInt(p) + el.height()));
                break;
            case 'left':
                p = node.css('padding-right');
                node.css('paddingTop',(parseInt(p) + el.height()));
                break;
        }
    },

    removeChild:function (e) {
        var id = e.target.id.replace('tab-close-', '');
        ludo.get(id).dispose();
        return false;
    },

    removeTabFor:function (child) {
        this.tabs[child.getId()].remove();
        delete this.tabs[child.getId()];
        this.resizeTabs();
    },

    enterCloseButton:function (e) {
        $(e.target).addClass('ludo-tab-close-' + this.tabPos + '-over');
    },

    leaveCloseButton:function (e) {
        $(e.target).removeClass('ludo-tab-close-' + this.tabPos + '-over');
    },

    getPosAttribute:function () {
        if (!this.posAttribute) {
            switch (this.tabPos) {
                case 'top':
                case 'bottom':
                    this.posAttribute = 'left';
                    break;
                case 'left':
                case 'right':
                    this.posAttribute = 'top';
                    break;
            }
        }
        return this.posAttribute;
    },

    increaseCurrentPos:function (node) {
        if (this.tabPos === 'top' || this.tabPos === 'bottom') {
            this.currentPos += node.outerWidth() + ludo.dom.getMW(node);
        } else {
            this.currentPos += node.outerHeight() + ludo.dom.getMH(node);
        }
        this.currentPos--;
    },

    getPlainTabFor:function (child) {
        var el = $('<div>');
        this.getBody().append(el);
        el.className = 'ludo-tab-strip-tab ludo-tab-strip-tab-' + this.tabPos;
        el.html('<div class="ludo-tab-strip-tab-bg-first"></div><div class="ludo-tab-strip-tab-bg-last"></div><span>' + this.getTitleFor(child) + '</span>');
        return el;
    },

    getSVGTabFor:function (child) {
        var el = $('<div>');
        this.getBody().append(el);
        el.html('<div class="ludo-tab-strip-tab-bg-first"></div><div class="ludo-tab-strip-tab-bg-last">');
        var svgEl = $('<div>');
        el.append(svgEl);
        var box = new ludo.layout.TextBox({
            renderTo:svgEl,
            width:100, height:100,
            className:'ludo-tab-strip-tab-txt-svg',
            text:this.getTitleFor(child),
            rotation:this.getRotation()
        });
        var size = box.getSize();
        svgEl.css({
            'width':size.x, height: size.y
        });

        return el;
    },

    getRotation:function () {
        if (this.rotation === undefined) {
            switch (this.tabPos) {
                case 'left' :
                    this.rotation = 270;
                    break;
                case 'right' :
                    this.rotation = 90;
                    break;
                case 'bottom' :
                    this.rotation = 180;
                    break;
                default :
                    this.rotation = 0;
                    break;
            }
        }
        return this.rotation;
    },

    getTitleFor:function (child) {
        return (child.layout.title || child.getTitle());
    },

    activateTabFor:function (child) {
        if (this.activeTab !== undefined) {
            this.activeTab.removeClass('ludo-tab-strip-tab-active');
        }
        if (this.tabs[child.id] !== undefined) {
            this.tabs[child.id].addClass('ludo-tab-strip-tab-active');
            this.activeTab = this.tabs[child.id];
            this.activeTab.css('zIndex', this.currentZIndex);
            this.currentZIndex++;
        }
    },

    ludoDOM:function () {
        this.parent();
        this.getEl().addClass('ludo-tab-strip');
        this.getEl().addClass('ludo-tab-strip-' + this.tabPos);

        var el = $('<div>');
        el.addClass('ludo-tab-strip-line');
        this.getBody().append(el);
    },

    getTabFor:function (child) {
        return this.tabs[child.id]
    },

    getChangedViewport:function () {
        var value;
        if (this.tabPos === 'top' || this.tabPos === 'bottom') {
            value = this.getEl().height() + ludo.dom.getMH(this.getEl());
        } else {
            value = this.getEl().width() + ludo.dom.getMW(this.getEl());
        }
        return {
            key:this.tabPos, value:value
        };
    },
    getCount:function () {
        return Object.keys(this.tabs).length;
    }
});/* ../ludojs/src/layout/relative.js */
/**
 Relative Layout. This layout will render children relative to each other based on the rules defined below.
 For a demo, see <a href="../demo/layout/relative.php" onclick="var w=window.open(this.href);return false">Relative layout demo</a>.
 @namespace ludo.layout
 @class ludo.layout.Relative
 @param {object} config
 @summary layout: {type: "relative" }
 @param {number|string} config.width Width in Pixels or "matchParent". 
 @param {number|string} config.height Height in pixels or "matchParent"
 @param {Boolean} config.alignParentTop Align at top edge of parent view
 @param {Boolean} config.alignParentBottom Align bottom of this view with the bottom of parent view
 @param {Boolean} config.alignParentLeft Align left in parent
 @param {Boolean} config.alignParentRight Right align inside parent
 @param {String} config.leftOf Align left of sibling with this id
 @param {String} config.rightOf Align right of sibling with this id
 @param {String} config.below Align below sibling with this id
 @param {String} config.above Align above sibling with this id
 @param {String} config.alignLeft Same left position as sibling with this id.
 @param {String} config.alignRight Same right position as sibling with this id
 @param {String} config.alignTop Same top position as sibling with this id
 @param {String} config.alignBottom Same bottom edge as sibling with this id
 @param {String} config.sameWidthAs Same width as sibling with this id
 @param {String} config.sameHeightAs Same height as sibling with this id
 @param {Boolean} config.centerInParent True to Center view inside parent
 @param {Boolean} config.centerHorizontal True to Center view horizontally inside parent
 @param {Boolean} config.centerVertical True to Center View vertically inside parent
 @param {Boolean} config.fillLeft True to use all remaining space left of view. (left pos will be 0)
 @param {Boolean} config.fillRight True to use all remaining space right of view.
 @param {Boolean} config.fillUp True to use all remaining space above view. (top pos will be 0)
 @param {Number} config.absLeft Absolute pixel value for left position
 @param {Number} config.absRight Absolute pixel value for right position
 @param {Number} config.absTop Absolute pixel value for top position
 @param {Number} config.absBottom Absolute pixel value for bottom position
 @param {Number} config.offsetX After positioning the view, offset left position with these number of pixels.
 @param {Number} config.offsetY After positioning the view, offset top position with these number of pixels.
 @param {Array} config.resize Make the view resizable in these directions(left|right|above|below).
 @example
 var view = new ludo.View({
 	layout:{
 		width:'matchParent',height:'matchParent',
 		type:'relative' // Render children in relative layout
 	},
 	children:[ // array of relative positioned children
 	{
 		// Center this view inside parent
		{ id:'child1', html: 'First View', layout:{ centerInParent:true,width:200,height:200}},
		// Render below "child1" and align it with "child1"
		{ id:'child2', html: 'Second View', layout:{ below:'child1', alignLeft:'child1', width:300,height:50 }
 	}]
 });
 */
ludo.layout.Relative = new Class({
	Extends:ludo.layout.Base,
	children:undefined,
    /**
     * Array of valid layout properties
     * @property {Array} layoutFnProperties
     * @private
     */
	layoutFnProperties:[
		'width', 'height',
		'alignParentTop', 'alignParentBottom', 'alignParentLeft', 'alignParentRight',
		'leftOf', 'rightOf', 'below', 'above',
		'alignLeft', 'alignRight', 'alignTop', 'alignBottom',
		'sameWidthAs', 'sameHeightAs',
		'centerInParent', 'centerHorizontal', 'centerVertical',
		'fillLeft', 'fillRight', 'fillUp', 'fillDown',
		'absBottom','absWidth','absHeight','absLeft','absTop','absRight','offsetX','offsetY'
	],
    /**
     * Internal child coordinates set during resize
     * @property {Object} newChildCoordinates
     * @private
     */
	newChildCoordinates:{},
    /**
     * Internal storage of child coordinates for last resize
     * @property {Object} lastChildCoordinates
     * @privatea
     */
	lastChildCoordinates:{},

	onCreate:function () {
		this.parent();
		this.view.getBody().css('position', 'relative');
	},

	resize:function () {

		if (this.children === undefined) {
			this.prepareResize();
		}
		for (var i = 0; i < this.children.length; i++) {
            if(!this.children[i].layoutResizeFn){
                this.children[i].layoutResizeFn = this.getResizeFnFor(this.children[i]);
            }
			this.children[i].layoutResizeFn.call(this.children[i], this);
		}
	},

    /**
     * No resize done yet, create resize functions
     * @function prepareResize
     * @private
     */
	prepareResize:function( ){
		this.fixLayoutReferences();
		this.arrangeChildren();
     	this.createResizeFunctions();
	},

    /**
     * Create/Compile resize functions for each child
     * @function createResizeFunctions
     * @private
     */
	createResizeFunctions:function () {
		for (var i = 0; i < this.children.length; i++) {
			this.children[i].layoutResizeFn = this.getResizeFnFor(this.children[i]);
		}
	},
    /**
     * Convert layout id references to direct view reference for optimal performance
     * @function fixLayoutReferences
     * @private
     */
	fixLayoutReferences:function () {
		for (var i = 0; i < this.view.children.length; i++) {
			var c = this.view.children[i];
			var k = this.depKeys;
			for (var j = 0; j < k.length; j++) {
				if (c.layout[k[j]] !== undefined)c.layout[k[j]] = this.getReference(c.layout[k[j]]);
			}
		}
	},
    /**
     * Return resize function for a child
     * @function getResizeFnFor
     * @param {ludo.View} child
     * @return {Function}
     * @private
     */
	getResizeFnFor:function (child) {
		var fns = this.getLayoutFnsFor(child);
		return function (layoutManager) {
			for (var i = 0; i < fns.length; i++) {
				fns[i].call(child, layoutManager);
			}
		};
	},
    /**
     * Return array of resize function to call when view is resized.
     * @function getLayoutFnsFor
     * @param {ludo.View} child
     * @return {Array}
     * @private
     */
	getLayoutFnsFor:function (child) {
		var ret = [];
		var p = this.layoutFnProperties;
		for (var i = 0; i < p.length; i++) {
			if (child.layout[p[i]] !== undefined && child.layout[p[i]] !== false) {
				var fn = this.getLayoutFn(p[i], child);
				if (fn)ret.push(fn);
			}
		}
		ret.push(this.getLastLayoutFn(child));
		return ret;
	},
    /**
     Return one resize function for a child
     @function getLayoutFn
     @param {String} property
     @param {ludo.View} child
     @return {Function|undefined}
     @private
     @example
        getLayoutFn(left, view)
     may return
        function(){
            this.newChildCoordinates[view.id]['left'] = 20;
        }
     The resize functions are created before first resize is made. For second resize,
     the layout functions for each view will simply be called. This is done for optimal performance
     so that we don't need to calculate more than we have to(Only first time).
     */
	getLayoutFn:function (property, child) {
		var c = this.newChildCoordinates[child.id];
		var refC;
		switch (property) {
			case 'top':
			case 'left':
				return function () {
					c[property] = child.layout[property];
				}.bind(child);
            case 'offsetX':
                return function(){
                    c.left += child.layout[property];
                }.bind(child);
            case 'offsetY':
                return function(){
                    c.top += child.layout[property];
                }.bind(child);
			case 'width':
			case 'height':
				return this.getPropertyFn(child, property);
			case 'absLeft':
				return function () {
					c.left = 0;
				};
			case 'absRight':
				return function () {
					c.right = 0;
				};
			case 'absBottom':
				return function () {
					c.bottom = 0;
				};
			case 'absWidth':
				return function(lm){
					c.width = lm.viewport.absWidth;
				};
			case 'absHeight':
				return function(lm){
					c.height = lm.viewport.absHeight;
				};
			case 'alignParentLeft':
				return function (lm) {
					c.left = lm.viewport.left;
				};
			case 'alignParentRight':
				return function (lm) {
					c.right = lm.viewport.right;
				};
			case 'alignParentTop':
				return function (lm) {
					c.top = lm.viewport.top;
				};
			case 'alignParentBottom':
				return function (lm) {
					c.bottom = lm.viewport.bottom;
				};
			case 'leftOf':
				refC = this.lastChildCoordinates[child.layout.leftOf.id];
				return function () {
					c.right = refC.right + refC.width;
				};
			case 'rightOf':
				refC = this.lastChildCoordinates[child.layout.rightOf.id];
				return function () {
                    // TODO refactor this so that Math.max is no longer needed
					// c.left = Math.max(0, refC.left) + refC.width;
					c.left = refC.left + refC.width;
				};
			case 'below':
				refC = this.lastChildCoordinates[child.layout.below.id];
				return function () {
					c.top = refC.top + refC.height;
				};
			case 'above':
				refC = this.lastChildCoordinates[child.layout.above.id];
				return function () {
					c.bottom = refC.bottom + refC.height;
				};
			case 'sameHeightAs':
				refC = this.lastChildCoordinates[child.layout.sameHeightAs.id];
				return function () {
					c.height = refC.height;
				};
			case 'sameWidthAs':
				refC = this.lastChildCoordinates[child.layout.sameWidthAs.id];
				return function () {
					c.width = refC.width;
				};
			case 'centerInParent':
				return function (lm) {
					c.top = parseInt(lm.viewport.height / 2 - c.height / 2);
					c.left = parseInt(lm.viewport.width / 2 - c.width / 2);
				};
			case 'centerHorizontal':
				return function (lm) {
					c.left = parseInt(lm.viewport.width / 2 - c.width / 2);
				};
			case 'centerVertical':
				return function (lm) {
					c.top = parseInt(lm.viewport.height / 2 - c.height / 2);
				};
			case 'fillLeft':
				return function (lm) {
					if (c.right !== undefined) {
						c.width = lm.viewport.absWidth - c.right;
					}
				};
			case 'fillRight':
				return function (lm) {
					if (c.left === undefined)c.left = 0;
					c.width = lm.viewport.absWidth - c.left - lm.viewport.right;
				};
			case 'fillDown':
				return function (lm) {
					if (c.top === undefined)c.top = 0;
					c.height = lm.viewport.absHeight - c.top - lm.viewport.bottom;
				};
			case 'fillUp':
				return function (lm) {
					if (c.bottom !== undefined) {
						c.height = lm.viewport.absHeight - c.bottom - lm.viewport.top;
					}
				};
			case 'alignLeft':
				return this.getAlignmentFn(child, property, 'left');
			case 'alignRight':
				return this.getAlignmentFn(child, property, 'right');
			case 'alignTop':
				return this.getAlignmentFn(child, property, 'top');
			case 'alignBottom':
				return this.getAlignmentFn(child, property, 'bottom');
		}
		return undefined;
	},
    /**
     * Return special resize function for the properties alignLeft, alignRight, alignTop and alignBottom
     * @function getAlignmentFn
     * @param {ludo.View} child
     * @param {String} alignment
     * @param {String} property
     * @return {Function}
     * @private
     */
	getAlignmentFn:function (child, alignment, property) {
		var c = this.newChildCoordinates[child.id];
		var refC = this.lastChildCoordinates[child.layout[alignment].id];
		return function () {
			c[property] = refC[property];
		};
	},

    /**
     * Returns layout function for the width and height layout properties
     * @function getPropertyFn
     * @param {ludo.View} child
     * @param {String} property
     * @return {Function|undefined}
     * @private
     */
	getPropertyFn:function (child, property) {
		var c = this.newChildCoordinates[child.id];

		if (isNaN(child.layout[property])) {
			switch (child.layout[property]) {
				case 'matchParent':
					return function (lm) {
						c[property] = lm.viewport[property];
					};
				case 'wrap':
					var ws = ludo.dom.getWrappedSizeOfView(child);
					var key = property === 'width' ? 'x' : 'y';
					return function(){
						c[property] = ws[key];
					};
				default:
					if (child.layout[property].indexOf !== undefined && child.layout[property].indexOf('%') >= 0) {
						var size = parseInt(child.layout[property].replace(/[^0-9]/g));
						return function (lm) {
							c[property] = parseInt(lm.viewport[property] * size / 100);
						}
					}
					return undefined;
			}
		} else {
			return function () {
				c[property] = child.layout[property];
			}.bind(child);
		}
	},

	posProperties:['left', 'right', 'bottom', 'top'],

    /**
     * Final resize function for each child. All the other dynamically created
     * layout function stores values for the left,width,top,bottom, width and height properties.
     * This function call the resize function for each view with the values of these previously
     * set properties
     * @function getLayoutLayoutFn
     * @param {ludo.View} child
     * @return {Function}
     * @private
     */
	getLastLayoutFn:function (child) {
		return function (lm) {
			var c = lm.newChildCoordinates[child.id];
			var lc = lm.lastChildCoordinates[child.id];
			var p = lm.posProperties;
            if(child.layout.above && child.layout.below){
                c.height = lm.viewport.height - c.bottom - c.top;
            }
			if(child.isHidden()){
				c.width = 0;
				c.height = 0;
			}
			child.resize({
				width:c.width !== lc.width ? c.width : undefined,
				height:c.height !== lc.height ? c.height : undefined
			});

			if(c['right'] !== undefined && c.width){
				c.left = lm.viewport.absWidth - c.right - c.width;
				c['right'] = undefined;
			}
			if(c.bottom !== undefined && c.height){
				c.top = lm.viewport.absHeight - c.bottom - c.height;
				c.bottom = undefined;
			}
			if(c.bottom !== undefined){
				var h = lm.viewport.absHeight - c.bottom - (c.top || 0);
				if(h!= lc.height){
					child.resize({ height: lm.viewport.absHeight - c.bottom - (c.top || 0) });
				}
				c.bottom = undefined;
			}

			for (var i = 0; i < p.length; i++) {
				var key = p[i];
				if (c[key] !== undefined){
					lm.positionChild(child, key, c[key]);
				}
				lc[key] = c[key];
			}
			lc.width = c.width;
			lc.height = c.height;
			lm.updateLastCoordinatesFor(child);
		}
	},
    /**
     * Update lastChildCoordinates properties for a child after resize is completed
     * @function updateLastCoordinatesFor
     * @param {ludo.View} child
     * @private
     */
	updateLastCoordinatesFor:function (child) {
		var lc = this.lastChildCoordinates[child.id];
		var el = child.getEl();
		var pos = el.position();
		if (lc.left === undefined) lc.left = pos.left > 0 ? pos.left : 0;
		if (lc.top === undefined) lc.top = pos.top > 0 ? pos.top : 0;
		if (lc.width === undefined) lc.width = el.width != undefined ? el.width() : el.offsetWidth;
		if (lc.height === undefined) lc.height = el.height != undefined ? el.height() : el.offsetHeight;
		if (lc.right === undefined) lc.right = this.viewport.width - lc.left - lc.width;
		if (lc.bottom === undefined) lc.bottom = this.viewport.height - lc.top - lc.height;
	},

    /**
     * Position child at this coordinates
     * @function positionChild
     * @param {ludo.View} child
     * @param {String} property
     * @param {Number} value
     * @private
     */
	positionChild:function (child, property, value) {
		child.getEl().css(property, value); // style[property] = value + 'px';
		child[property] = value;
	},
    /**
     * Creates empty newChildCoordinates and lastChildCoordinates for a child view
     * @function assignDefaultCoordinates
     * @param {ludo.View|ludo.layout.Resizer} child
     * @private
     */
	assignDefaultCoordinates:function (child) {
		this.newChildCoordinates[child.id] = {};
		this.lastChildCoordinates[child.id] = {};
	},

    /**
     * Before first resize, the internal children array is arranged so that views dependent of
     * other views are resized after the view it's depending on. example: if view "a" has leftOf property
     * set to view "b", then view "b" should be resized and positioned first. This method rearranges
     * the internal children array according to this
     * @function arrangeChildren
     * @private
     */
	arrangeChildren:function () {
		this.children = [];
		for (var i = 0; i < this.view.children.length; i++) {
			var c = this.view.children[i];
			this.children.push(c);
			this.assignDefaultCoordinates(c);
			if(c.isHidden()){
				this.setTemporarySize(c, { width:0, height:0 });
			}
		}

		this.createResizables();

		var child = this.getWronglyArrangedChild();
		var counter = 0;
		while (child && counter < 30) {
			var dep = this.getDependencies(child);
			if (dep.length > 0) {
				for (var j = 0; j < dep.length; j++) {
					if (this.isArrangedBefore(child, dep[j])) {
						var index = this.children.indexOf(child);
						this.children.splice(index, 1);
						this.children.push(child);
					}
				}
			}
			child = this.getWronglyArrangedChild();
			counter++;
		}

		if (counter === 30) {
			ludo.util.log('Possible circular layout references defined for children in Relative layout');
		}
	},


	resizeKeys:{
		'left':'leftOf',
		'right':'rightOf',
		'above':'above',
		'below':'below'
	},
	resizables : {},

    /**
     * Create resize handles for resizable children
     * @function createResizables
     * @private
     */
	createResizables:function () {
		for (var i = this.children.length - 1; i >= 0; i--) {
			var c = this.children[i];
			if (this.isChildResizable(c)) {
				this.resizables[c.id] = {};
				for (var j = 0; j < c.layout.resize.length; j++) {
					var r = c.layout.resize[j];
					var resizer = this.resizables[c.id][r] = this.getResizableFor(c, r);
					this.assignDefaultCoordinates(resizer);
					this.updateReference(this.resizeKeys[r], c, resizer);
                    var pos = r == 'left' || r === 'above' ? i: i+1;
                    this.children.splice(pos, 0, resizer);
				}
			}
		}
	},

	getResizable:function(child, direction){
		return this.resizables[child.id][direction];
	},

    /**
     * Return resizable handle for a child view
     * @function getResizableFor
     * @param {ludo.View} child
     * @param {String} direction
     * @return {ludo.layout.Resizer}
     * @private
     */
	getResizableFor:function (child, direction) {
        // TODO should be possible to render size of resizer to sum of views (see relative.php demo)
		var resizeProp = (direction === 'left' || direction === 'right') ? 'width' : 'height';
		return new ludo.layout.Resizer({
			name:'resizer-' + child.name,
			orientation:(direction === 'left' || direction === 'right') ? 'horizontal' : 'vertical',
			pos:direction,
			renderTo:this.view.getBody(),
			sibling:this.getSiblingForResize(child,direction),
			layout:this.getResizerLayout(child, direction),
			view:child,
			listeners:{
				'resize':function (change) {
					child.layout[resizeProp] += change;
					this.resize();
				}.bind(this),
				'before':this.beforeResize.bind(this)
			}
		});
	},

    /**
     * Return sibling which may be affected when a child is resized
     * @function getSiblingForResize
     * @param {ludo.View} child
     * @param {String} direction
     * @return {ludo.View|undefined}
     * @private
     */
	getSiblingForResize:function(child, direction){
		switch(direction){
			case 'left':
				return child.layout.rightOf;
			case 'right':
				return child.layout.leftOf;
			case 'above':
				return child.layout.below;
			case 'below':
				return child.layout.above;
		}
		return undefined;
	},
    /**
     * Before resize function executed for a resize handle
     * @function beforeResize
     * @param {ludo.layout.Resizer} resize
     * @param {ludo.View} child
     * @private
     */
	beforeResize:function(resize, child){

		if(resize.orientation === 'horizontal'){
			console.log(child.layout.maxWidth);
			resize.setMinWidth(child.layout.minWidth || 10);
			resize.setMaxWidth(child.layout.maxWidth || this.view.getBody().width());
		}else{
			resize.setMinHeight(child.layout.minHeight || 10);
			resize.setMaxHeight(child.layout.maxHeight || this.view.getBody().height());
		}
	},
    /**
     * Return layout config for a resize handle
     * @function getResizerLayout
     * @param {ludo.View} child
     * @param {String} resize
     * @return {ludo.layout.RelativeSpec}
     * @private
     */
	getResizerLayout:function (child, resize) {
		var ret = {};
		switch (resize) {
			case 'left':
			case 'right':
				ret.sameHeightAs = child;
				ret.alignTop = child;
				ret.width = 5;
				break;
			default:
				ret.sameWidthAs = child;
				ret.alignLeft = child;
				ret.height = 5;
		}
		return ret;
	},

    /**
     * Update layout references when a resize handle has been created. example: When a resize handle
     * is added to the left of a child view. The leftOf view of this child is now the resize handle
     * and not another view
     * @function updateReferences
     * @param {String} property
     * @param {ludo.View} child
     * @param {ludo.layout.Resizer} resizer
     * @private
     */
	updateReference:function (property, child, resizer) {
		for (var i = 0; i < this.children.length; i++) {
			if (this.children[i].layout[property] === child) {
				this.children[i].layout[property] = resizer;
				resizer.layout.affectedSibling = this.children[i];
			}
		}
		resizer.layout[property] = child;
	},
    /**
     * Returns true if a child is resizable
     * @function isChildResizable
     * @param {ludo.View} child
     * @return {Boolean}
     * @private
     */
	isChildResizable:function (child) {
		return child.layout && child.layout.resize && child.layout.resize.length > 0;
	},

    /**
     * Return a child which should be rearrange because it's layout depends on a next sibling
     * @function getWronglyArrangedChild
     * @return {ludo.View|undefined}
     * @private
     */
	getWronglyArrangedChild:function () {
		for (var i = 0; i < this.children.length; i++) {
			var c = this.children[i];
			var dep = this.getDependencies(c);
			if (dep.length > 0) {
				for (var j = 0; j < dep.length; j++) {
					if (this.isArrangedBefore(c, dep[j])) {
						return c;
					}
				}
			}
		}
		return undefined;
	},
    /**
     * Returns true if a child is previous sibling of another child
     * @function isArrangedBefore
     * @param {ludo.View} child
     * @param {ludo.View} of
     * @return {Boolean}
     * @private
     */
	isArrangedBefore:function (child, of) {
		return this.children.indexOf(child) < this.children.indexOf(of);
	},

    /**
     * All the layout options where value is a reference to another child
     * @property depKeys
     * @private
     */
	depKeys:['above', 'below', 'leftOf', 'rightOf', 'alignLeft', 'alignBottom', 'alignRight', 'alignTop', 'sameWidthAs', 'sameHeightAs'],

    /**
     * Return all the siblings a child is depending on for layout
     * @function getDependencies
     * @param {ludo.View} child
     * @return {Array}
     * @private
     */
	getDependencies:function (child) {
		var ret = [];
		for (var i = 0; i < this.depKeys.length; i++) {
			if (child.layout[this.depKeys[i]] !== undefined) {
				var ref = child.layout[this.depKeys[i]];
				if (ref !== undefined) {
					ret.push(ref);
				}
			}
		}
		return ret;
	},
    /**
     * Return direct reference to child
     * @function getReference
     * @param {String|ludo.View} child
     * @return {ludo.View}
     * @private
     */
	getReference:function (child) {
		if (child['getId'] !== undefined)return child;
		if (this.view.child[child] !== undefined)return this.view.child[child];
		return ludo.get(child);
	},

    /**
     * Clear internal children array. When this is done, resize function will be recreated. This happens
     * when a child is removed or when a new child is added
     * @function clearChildren
     * @private
     */
	clearChildren:function () {
		this.children = undefined;
	},
    /**
     * Return internal children array
     * @function getChildren
     * @return {Array}
     * @private
     */
	getChildren:function () {
		return this.children;
	},

    /**
     * Validate and set required layout properties of new children
     * @function onNewChild
     * @param {ludo.View} child
     * @private
     */
	onNewChild:function (child) {
		this.parent(child);
		if(child.getEl().css != undefined){
			child.getEl().css('position', 'absolute');
		}
        var l = child.layout;
		if (l.centerInParent !== undefined) {
			l.centerHorizontal = undefined;
			l.centerVertical = undefined;
		}
		if(l.fillRight === undefined){
			if (l.width === undefined)l.width = child.width ? child.width : undefined;
		}

		if (l.height === undefined)l.height = child.height ? child.height : undefined;

		if (l.leftOf)l.right = undefined;
		if (l.rightOf)l.left = undefined;
		if (l.below)l.top = undefined;
		if (l.above)l.bottom = undefined;
	},

    /**
     * Add events to child view
     * @function addChildEvents
     * @param {ludo.View} child
     * @private
     */
	addChildEvents:function(child){
		child.addEvent('hide', this.hideChild.bind(this));
		child.addEvent('show', this.clearTemporaryValues.bind(this));
		child.addEvent('collapse', this.minimize.bind(this));
		child.addEvent('minimize', this.minimize.bind(this));
		child.addEvent('expand', this.clearTemporaryValues.bind(this));
		child.addEvent('maximize', this.clearTemporaryValues.bind(this));
	}
});/* ../ludojs/src/layout/tab.js */
ludo.layout.Tab = new Class({
	Extends:ludo.layout.Relative,
	visibleChild:undefined,
	tabStrip:undefined,

	onCreate:function () {
		this.parent();
        this.view.getEl().addClass('ludo-layout-tab');
		this.addChild(this.getTabStrip());

		this.updateViewport(this.tabStrip.getChangedViewport());
	},

	addChild:function (child, insertAt, pos) {
		if (!this.isTabStrip(child) && (!child.layout || !child.layout.visible))child.hidden = true;
		return this.parent(child, insertAt, pos);
	},

	onNewChild:function (child) {

		if (!this.isTabStrip(child)) {
			if(!child.isHidden()){
				this.setVisibleChild(child);
			}
			var l = child.layout;
			l.alignParentLeft = true;
			l.alignParentTop = true;
			l.fillRight = true;
			l.fillDown = true;
		}
		this.parent(child);
	},

	setTemporarySize:function(){

	},

	addChildEvents:function(child){
		if(!this.isTabStrip(child)){
			child.addEvent('show', this.showTab.bind(this));
			child.addEvent('dispose', this.onChildDispose.bind(this));
		}
	},

	getTabPosition:function () {
		return this.view.layout.tabs || 'top';
	},
	getTabStrip:function () {
		if (this.tabStrip === undefined) {
			this.tabStrip = new ludo.layout.TabStrip({
				lm : this,
				parentComponent:this.view,
				tabPos:this.getTabPosition(),
				renderTo:this.view.getBody(),
				layout:this.getTabStripLayout()
			});
		}
		return this.tabStrip;
	},

	setVisibleChild:function(child){
		if(this.visibleChild)this.visibleChild.hide();
		this.visibleChild = child;
		this.fireEvent('showChild', child);
	},

	showTab:function(child){
		if(child !== this.visibleChild){
			this.setVisibleChild(child);
			this.resize();
		}

	},

	resize:function(){
		if(this.visibleChild === undefined){
			if(this.view.children.length>1)this.view.children[1].show();
		}else{
			if (this.children === undefined || !this.visibleChild.layoutResizeFn) {
				this.prepareResize();
			}
			this.tabStrip.layoutResizeFn.call(this.visibleChild, this);
            if(!this.visibleChild.layoutResizeFn){
                this.prepareResize();
            }
			this.visibleChild.layoutResizeFn.call(this.visibleChild, this);
		}
	},

	getTabStripLayout:function () {
		switch (this.getTabPosition()) {
			case 'top':
				return {
					absTop:true,
					absLeft:true,
					absWidth:true
				};
			case 'left':
				return {
					absTop:true,
					absLeft:true,
					absHeight:true
				};
			case 'right':
				return {
					absTop:true,
					absRight:true,
					absHeight:true
				};
			case 'bottom':
				return {
					absBottom:true,
					absLeft:true,
					absWidth:true
				};
		}
        return undefined;
	},

	isTabStrip:function (view) {
		return view.type === 'layout.TabStrip';
	},

	onChildDispose:function(child){
		if(this.visibleChild && this.visibleChild.id === child.id){
			var i = this.view.children.indexOf(this.visibleChild);
			if(i>1){
				this.view.children[i-1].show();
			}else{
				if(this.view.children.length>2){
					this.view.children[i+1].show();
				}
			}
		}

		this.fireEvent('removeChild', child);
	}
});/* ../ludojs/src/layout/fill.js */
ludo.layout.Fill = new Class({
	Extends:ludo.layout.Base,

	resize:function () {
		var height = this.view.getInnerHeightOfBody();
		if (height <= 0)return;
		for (var i = 0; i < this.view.children.length; i++) {
			this.view.children[i].resize({ height:height });
		}
	}
});/* ../ludojs/src/layout/grid.js */
/**
 * Arrange child views in a grid layout
 * @namespace layout
 * @class Grid
 */
ludo.layout.Grid = new Class({
	Extends:ludo.layout.Base,
    /**
     * Number of columns
     * @config {Number} columns
     * @default 5
     */
	columns:5,
    /**
     * Number of rows
     * @config {Number} rows
     * @default 5
     */
	rows:5,

	onCreate:function () {
		var l = this.view.layout;
		if (l.columns !== undefined)this.columns = l.columns;
		if (l.rows !== undefined)this.rows = l.rows;
	},

	resize:function () {
		this.storeCellSize();
		var pos = 0;
		var colspan;
		for (var i = 0; i < this.view.children.length; i++) {
			var c = this.view.children[i];
			colspan = c.layout && c.layout.colspan ? c.layout.colspan : 1;
			this.view.children[i].resize({
				width:this.cellSize.x * colspan,
				height:this.cellSize.y,
				left:this.cellSize.x * (pos % this.columns),
				top:this.cellSize.y * (Math.floor(pos / this.columns) % this.rows)
			});
			pos += colspan;
		}
	},

	storeCellSize:function () {
		this.cellSize = {
			x:this.getAvailWidth() / this.columns,
			y:this.getAvailHeight() / this.rows
		}
	},

	getCellSize:function () {
		return this.cellSize;
	},

	onNewChild:function (child) {
		child.getEl().css('position', 'absolute');
	}
});/* ../ludojs/src/layout/popup.js */
/**
 * Class handling popup layout defined by setting layout.type to "popup". The popup layout model
 * does not render it's children inside the "body" of it's parent. Instead, it's rendered as direct
 * children of document.body(&lt;body>). Layout properties are used to measure size and
 * position. One example of use is a combo box which displays a child view below a button or input box.
 * See {{#crossLink "layout.LayoutSpec"}}{{/crossLink}} for the available position and
 * sizing properties available to children inside a popup layout.
 * @namespace layout
 * @class Popup
 *
 */
ludo.layout.Popup = new Class({
	Extends:ludo.layout.Base,
	visibleChild:undefined,
	addChild:function (child, insertAt, pos) {
		if (!child.layout || !child.layout.visible)child.hidden = true;
		return this.parent(child, insertAt, pos);
	},

	onNewChild:function (child) {
		if (!child.isHidden()) {
			this.setVisibleChild(child);
		}
		child.getEl().css('position', 'absolute');
		child.addEvent('show', this.setVisibleChild.bind(this));
		this.parent(child);
	},

	setVisibleChild:function (child) {
		if (this.visibleChild && this.shouldToggle())this.visibleChild.hide();
		this.visibleChild = child;
		this.fireEvent('showChild', child);
	},

	getParentForNewChild:function () {
		return document.body;
	},

	shouldToggle:function(){
		return this.view.layout.toggle;
	},

	resize:function(){
		var c = this.view.children;
		for(var i=0;i< c.length;i++){
			if(!c[i].isHidden())c[i].getLayout().getRenderer().resize();
		}
	}
});/* ../ludojs/src/layout/canvas.js */
/**
 * Layout manager for items in a chart
 * @namespace chart
 * @class Layout
 * @augments layout.Relative
 */
ludo.layout.Canvas = new Class({
	Extends:ludo.layout.Relative,

	addChild:function (child) {
		child = this.getValidChild(child);
		child = this.getNewComponent(child);

		this.view.children.push(child);
		var el = child;
		this.view.getCanvas().append(el);

		this.onNewChild(child);
		this.addChildEvents(child);
		/**
		 * Event fired by layout manager when a new child is added
		 * @event addChild
		 * @param {ludo.View} child
		 * @param {ludo.layout.Base} layout manager
		 */
		this.fireEvent('addChild', [child, this]);



		return child;
	},

	/**
	 * Add events to child view
	 * @function addChildEvents
	 * @param {ludo.View} child
	 * @private
	 */
	addChildEvents:function (child) {
		child.addEvent('hide', this.hideChild.bind(this));
		child.addEvent('show', this.clearTemporaryValues.bind(this));

	},

	/**
	 * Position child at this coordinates
	 * @function positionChild
	 * @param {canvas.View} child
	 * @param {String} property
	 * @param {Number} value
	 * @private
	 */
	positionChild:function (child, property, value) {
		child[property] = value;
		this.currentTranslate[property] = value;
		child['node'].translate(this.currentTranslate.left, this.currentTranslate.top);
	},

	currentTranslate:{
		left:0,top:0
	}



});/* ../ludojs/src/layout/slide-in.js */
/**
 * Layout where first child slides in from the left on demand
 * @namespace layout
 * @class SlideIn
 */
ludo.layout.SlideIn = new Class({
    Extends:ludo.layout.Base,
    slideEl:undefined,

    onCreate:function(){
        this.view.getBody().css('overflowX', 'hidden');

    },

    onNewChild:function (child) {
        this.parent(child);
        child.getEl().css('position', 'absolute');
    },

    resize:function () {
        var widthOfFirst = this.getWidthOfMenu();

        this.view.children[0].resize({
            width:widthOfFirst,
            height:this.viewport.height
        });

        this.slideEl.css({
            width: (this.viewport.absWidth + widthOfFirst),
            left: this.view.layout.active ? 0 : (widthOfFirst * -1)
        });

        this.view.children[1].getEl().css('left', widthOfFirst + 'px');
        this.view.children[1].resize({
            width:this.viewport.absWidth,
            height:this.viewport.height
        })

    },
    /**
     Show menu
     @function show
     @example
        view.getLayout().show();
     */
    show:function () {
        if (!this.isMenuOpen()) {
            if(this.view.children[0].hidden){
                this.view.children[0].show();
            }
            this.view.layout.active = true;
            this.slideEl.animate({
                left:0
            }, this.getDuration(), this.getEasing());
        }
    },
    /**
     hide menu
     @function hide
     @example
        view.getLayout().hide();
     */
    hide:function () {
        if (this.isMenuOpen()) {
            this.view.layout.active = false;
            var widthOfFirst = this.getWidthOfMenu();

            this.slideEl.animate({
                left: widthOfFirst * -1
            }, this.getDuration(), this.getEasing());
        }
    },

	isMenuOpen:function(){
		return this.view.layout.active;
	},

    /**
     * Toggle between show and hide
     * @function toggle
     */
    toggle:function () {
        this[this.view.layout.active ? 'hide' : 'show']();
    },

    effect:function () {
        if (this.effectObject === undefined) {
            this.effectObject = new ludo.effect.Effect
        }
        return this.effectObject;
    },

    getDuration:function () {
        return this.view.layout.duration || 150;
    },

    getEasing:function(){
        return this.view.layout.easing || 'swing';
    },

    getWidthOfMenu:function(){
        var ret = this.view.children[0].layout.width;

        if(isNaN(ret)){
            switch(ret){
                case 'matchParent':
                    return this.viewport.width;
                default:
                    return parseInt(ret) * this.viewport.width / 100;
            }

        }else{
            return ret;
        }
    },

    getParentForNewChild:function () {
        if (!this.slideEl) {
            this.slideEl = $('<div style="height:100%;position:absolute"></div>');
            this.view.getBody().append(this.slideEl);

        }
        return this.slideEl;
    }

});/* ../ludojs/src/layout/menu-container.js */
ludo.layout.MenuContainer = new Class({
    Extends: Events,
    type: 'layout.MenuContainer',
    lm: undefined,
    layout: {
        width: 'wrap',
        height: 'wrap'
    },
    children: [],
    alwaysInFront: true,
    initialize: function (layoutManager) {
        this.lm = layoutManager;
        this.setLayout();
        this.createDom();

    },

    setLayout: function () {
        var l = this.layout;
        if (this.lm.view.parentComponent) {
            var vAlign = this.getSubMenuVAlign();
            var hAlign = this.getSubMenuHAlign();
            if (this.getParentLayoutOrientation() === 'horizontal') {
                l[vAlign] = this.lm.view.getParent().getEl();
                l.alignLeft = this.lm.view;
            } else {
                l[hAlign] = this.lm.view.getEl();
                l[vAlign === 'above' ? 'alignBottom' : 'alignTop'] = this.lm.view;
                // TODO refactor this to dynamic value
                l.offsetY = -3;
            }

            this.lm.view.layout.alignSubMenuV = this.lm.view.layout.alignSubMenuV || vAlign;
            this.lm.view.layout.alignSubMenuH = this.lm.view.layout.alignSubMenuH || hAlign;

            l.height = 'wrap';
        }

        l.fitVerticalViewPort = true;
    },

    getSubMenuVAlign: function () {
        var validKeys = ['above', 'below'];
        var p = this.lm.view.parentComponent;
        return p && p.layout.alignSubMenuV && validKeys.indexOf(p.layout.alignSubMenuV) !== -1 ? p.layout.alignSubMenuV : 'below';
    },

    getSubMenuHAlign: function () {
        var validKeys = ['leftOrRightOf', 'rightOrLeftOf', 'leftOf', 'rightOf'];
        var p = this.lm.view.parentComponent;
        return p && p.layout.alignSubMenuH && validKeys.indexOf(p.layout.alignSubMenuH) !== -1 ? p.layout.alignSubMenuH : 'rightOrLeftOf';
    },

    getParentLayoutOrientation: function () {
        var p = this.lm.view.parentComponent;
        return p ? p.layout.orientation : '';
    },

    createDom: function () {
        this.el = $('<div style="position:absolute;display:none"></div>');
        $(document.body).append(this.el);

        this.el.addClass('ludo-menu-vertical-' + this.getSubMenuVAlign());
        if (this.getSubMenuHAlign().indexOf('left') === 0) {
            this.el.addClass('ludo-menu-vertical-to-left');
        }

        if (this.getParentLayoutOrientation() === 'horizontal' && this.getSubMenuVAlign().indexOf('above') === 0) {
            this.lm.view.parentComponent.getEl().addClass('ludo-menu-horizontal-up');
        }
        this.body = $('<div>');
        this.el.append(this.body);

    },

    getEl: function () {
        return this.el;
    },

    getBody: function () {
        return this.body;
    },

    resize: function (config) {

        if (config.width) {
            this.getEl().css('width', config.width + 'px');
        }
    },

    isHidden: function () {
        return false;
    },

    show: function () {

        this.getEl().css('zIndex',  (ludo.util.getNewZIndex(this) + 100));

        if (this.getEl().css('display') === '')return;

        this.getEl().css('display', '');

        this.resizeChildren();
        this.getRenderer().resize();

        if (!this.layout.width || this.layout.width === 'wrap') {
            this.setFixedRenderingWidth();
        }

        this.fireEvent('show', this);
    },

    setFixedRenderingWidth: function () {
        this.layout.width = undefined;
        var r = this.getRenderer();
        r.clearFn();
        r.setValue('width', r.getSize().x);
        r.resize();
        for (var i = 0; i < this.lm.view.children.length; i++) {
            var cr = this.lm.view.children[i].getLayout().getRenderer();
            cr.clearFn();
            cr.setValue('width', r.getValue('width'));
        }

        this.resizeChildren();
    },

    childrenResized: false,
    resizeChildren: function () {
        if (this.childrenResized)return;
        for (var i = 0; i < this.lm.view.children.length; i++) {
            this.lm.view.children[i].getLayout().getRenderer().resize();
        }
        this.fireEvent('resize');
    },

    hide: function () {
        this.getEl().css('display', 'none');
        this.fireEvent('hide', this);
    },
    renderer: undefined,
    getRenderer: function () {
        if (this.renderer === undefined) {
            this.renderer = new ludo.layout.Renderer({
                view: this
            });
        }
        return this.renderer;
    }
});/* ../ludojs/src/layout/menu.js */
/**
 Class for menu layouts in LudoJS
 An instance of this class is created dynamically when
 layout.type for a View is set to "menu".
 @namespace layout
 @class Menu
 @constructor
 @example
 layout:{
		 type:'Menu',
		 rightOf:'leftMenu'
	 },
 children:[
 {
     html:'Games',
     children:[
         { html:'Console games',
             children:['XBox 360',
                 {
                     html:'Wii U',
                     children:['NintendoLand', 'Batman Arkham City', 'SuperMario Wii U']
                 }, 'PlayStation']},
         'PC Games',
         'Mac Games',
         'Mobile games'
     ]
 },
 'Apps',
 'Utilities'
 ],
 listeners:{
 	 	'click' : function(item){
 	 		console.log('You clicked ' + item.html);
 	 	}
 	 }

 */
ludo.layout.Menu = new Class({
	Extends:ludo.layout.Base,
	active:false,
	alwaysActive:false,

	onCreate:function () {
		this.menuContainer = new ludo.layout.MenuContainer(this);
		if (this.view.layout.active) {
			this.alwaysActive = true;
		}

		if (this.view.id === this.getTopMenuComponent().id) {
			$(document.documentElement).on('click', this.autoHideMenus.bind(this));
			ludo.EffectObject.addEvent('start', this.hideAllMenus.bind(this));
		}
	},

	getMenuContainer:function () {
		return this.menuContainer;
	},

	getValidChild:function (child) {
		if (ludo.util.isString(child))child = { html:child };
		child.layout = child.layout || {};
		if (child.children && !child.layout.type) {
			child.layout.type = 'menu';
			child.layout.orientation = 'vertical';
		}
		child.type = child.type || 'menu.Item';
		if (child.type === 'menu.Item') {
			child.orientation = this.view.layout.orientation;
		} else {
			child.layout.height = child.layout.height || child.height;
		}

		return child;
	},

	parentForNewChild:undefined,

	getParentForNewChild:function () {
		if (this.parentForNewChild === undefined) {
			var isTop = !this.hasMenuLayout(this.view.parentComponent);
			var p = isTop ? this.parent() : this.getMenuContainer().getBody();


			p.parent().addClass('ludo-menu');
			p.parent().addClass('ludo-menu-' + this.view.layout.orientation);

			if (isTop && !this.view.layout.isContext)p.parent().addClass('ludo-menu-top');
			this.parentForNewChild = p;

			if (isTop) {
				this.view.addEvent('show', this.resize.bind(this));
			}
		}
		return this.parentForNewChild;
	},

	onNewChild:function (child) {
		this.assignMenuItemFns(child);
		if (this.hasMenuLayout(child)) {
			child.addEvent('addChild', this.assignMenuItemFns.bind(this));
		}
	},

	hasMenuLayout:function (item) {
		return item && item.layout && item.layout.type && item.layout.type.toLowerCase() === 'menu';
	},

	parentContainers:undefined,

	getTopMenuComponent:function () {
		var v = this.view;
		while (v.parentComponent && this.hasMenuLayout(v.parentComponent)) {
			v = v.getParent();
		}
		return v;
	},

	assignMenuItemFns:function (child) {
		var lm = this;
		var p = lm.view.getParent();
		var topMenu = this.getTopMenuComponent();
		var topLm = topMenu.getLayout();

		if (child.mouseOver === undefined) {
			child.getEl().mouseenter(function () {
				this.mouseOver();
			}.bind(child));
			child.mouseOver = function () {
				this.fireEvent('enterMenuItem', this);
			}.bind(child);
		}

		child.getMenuLayoutManager = function () {
			return this.parentComponent && this.parentComponent.getMenuLayoutManager ? this.parentComponent.getMenuLayoutManager() : lm;
		}.bind(child);
		child.getParentMenuItem = function () {
			return lm.hasMenuLayout(p) ? lm.view : undefined;
		}.bind(child);
		child.isTopMenuItem = function () {
			return !lm.hasMenuLayout(p);
		}.bind(child);
		child.getMenuContainer = function () {
			return lm.getMenuContainer();
		}.bind(child);

		child.getMenuContainerToShow = function () {
			if (this.containerToShow === undefined) {
				if (lm.hasMenuLayout(this) && this.children.length > 0) {
					if (!this.children[0].lifeCycleComplete)this.children[0].remainingLifeCycle();
					this.containerToShow = this.children[0].getMenuContainer();
				} else {
					this.containerToShow = undefined;
				}
			}
			return this.containerToShow;
		}.bind(child);

		child.getMenuContainersToShow = function () {
			if (!this.menuContainersToShow) {
				var cnt = [];
				var v = this.getParent();
				while (v && v.layout.orientation === 'vertical') {
					if (v.getMenuContainerToShow)cnt.unshift(v.getMenuContainerToShow());
					v = v.getParent();
				}
				var cmp = this.getMenuContainerToShow();
				if (cmp)cnt.push(cmp);

				this.menuContainersToShow = cnt;
			}
			return this.menuContainersToShow;
		}.bind(child);


		child.getMenuComponent = function () {
			return topMenu;
		}.bind(child);

		child.getParentMenuItems = function () {
			if (!this.parentMenuItems) {
				this.parentMenuItems = [];
				var v = this.getParent();
				while (v && v.getMenuContainer) {
					this.parentMenuItems.push(v);
					v = v.getParent();
				}
			}
			return this.parentMenuItems;
		}.bind(child);

		
		child.addEvent('click', function () {
			topMenu.fireEvent('click', this);
		}.bind(child));

		if (this.view.layout.orientation === 'horizontal' && child.children.length > 0) {
			child.addEvent('click', function () {
				topLm.activate(child);
			}.bind(this));
		} else {
			child.addEvent('click', topLm.hideAllMenus.bind(topLm));
		}

		child.addEvent('enterMenuItem', function () {
			topLm.showMenusFor(child);
			topLm.highlightItemPath(child);
		}.bind(this));
	},
	shownMenus:[],

	activate:function (child) {
		this.active = !this.active;
		if (this.shownMenus.length === 0) {
			ludo.EffectObject.fireEvents();
		}
		this.showMenusFor(child);
	},

	showMenusFor:function (child) {
		if (!this.active && !this.alwaysActive) {
			this.hideMenus();
		} else {
			var menusToShow = child.getMenuContainersToShow();
			this.hideMenus(menusToShow);

			this.shownMenus = menusToShow;
			for (var i = 0; i < this.shownMenus.length; i++) {
				this.shownMenus[i].show();
			}
		}
	},

	hideAllMenus:function () {
		this.hideMenus();
		this.clearHighlightedPath();
		if (this.view.layout.isContext) {
			this.view.getEl().css('display', 'none');
		}
		this.shownMenus = [];
	},

	hideMenus:function (except) {
		except = except || [];
		for (var i = 0; i < this.shownMenus.length; i++) {
			if (except.indexOf(this.shownMenus[i]) === -1) this.shownMenus[i].hide();
		}
	},

	highlightedItems:[],
	highlightItemPath:function (child) {
		var items = child.getParentMenuItems();
		this.clearHighlightedPath(items);
		for (var i = 0; i < items.length; i++) {
			items[i].getEl().addClass('ludo-menu-item-active');
		}
		this.highlightedItems = items;
	},

	clearHighlightedPath:function (except) {
		except = except || [];
		var items = this.highlightedItems;
		for (var i = 0; i < items.length; i++) {
			if (except.indexOf(items[i]) === -1) {
				items[i].getEl().removeClass('ludo-menu-item-active');
			}
		}
	},

	autoHideMenus:function (e) {
		if (this.active || this.alwaysActive) {
			var parent = $(e.target).parents('.ludo-menu');

			if (e.target.className && e.target.className.indexOf && e.target.className.indexOf('ludo-menu-item') === -1 && parent.length == 0) {
				this.hideAllMenus();
				if (this.view.layout.orientation === 'horizontal') {
					this.active = false;
				}
			}
		}
	}
});/* ../ludojs/src/layout/menu-horizontal.js */
ludo.layout.MenuHorizontal = new Class({
    Extends:ludo.layout.Menu,

    getValidChild:function (child) {
        child = this.parent(child);
        child.layout.width = child.layout.width || 'wrap';
        return child;
    },

    onNewChild:function (child) {
        child.getEl().css('position', 'absolute');
        this.parent(child);
    },

    resized:false,
    resize:function () {
        this.resized=false;
        if (!this.resized) {
            this.resized = true;
            var left = 0;
            for (var i = 0; i < this.view.children.length; i++) {
                this.view.children[i].resize({ left:left,height:this.viewport.height });
                left += this.view.children[i].getEl().outerWidth() + ludo.dom.getMW(this.view.children[i].getEl());
            }
        }
    }
});/* ../ludojs/src/layout/menu-vertical.js */
ludo.layout.MenuVertical = new Class({
    Extends: ludo.layout.Menu,
	active:true,

	getValidChild:function(child){
		child = this.parent(child);
		if (!child.layout.width) {
			child.layout.width = 'fitParent';
		}
		return child;
	},

    resize:function () {
        for (var i = 0; i < this.view.children.length; i++) {
            this.view.children[i].getLayout().getRenderer().resize();
        }
    }
});/* ../ludojs/src/layout/collapse-bar.js */
ludo.layout.CollapseBar = new Class({
	Extends: ludo.View,
	orientation : undefined,
	position : undefined,
	views:[],
	viewportCoordinates:{},
	buttons:{},
	currentPos:0,

	ludoConfig:function(config){
		this.parent(config);
		this.position = config.position || 'left';
		this.setLayout();
	},

	ludoDOM:function(){
		this.parent();
		this.getEl().addClass('ludo-collapse-bar');
		this.getEl().addClass('ludo-collapse-bar-' + this.orientation);
		this.getEl().addClass('ludo-collapse-bar-' + this.position);
	},

	setLayout:function(){
		// this.position = layout.collapseBar || 'left';
		this.orientation = (this.position === 'left' || this.position === 'right') ? 'vertical' : 'horizontal';
		this.layout = {};
		switch(this.position){
			case 'left':
				this.layout.absLeft = true;
				this.layout.alignParentTop = true;
				this.layout.fillDown = true;
				this.layout.width = 25;
				break;
			case 'right':
				this.layout.absRight = true;
				this.layout.alignParentTop = true;
				this.layout.fillDown = true;
				this.layout.width = 25;
				break;
			case 'top':
				this.layout.absTop = true;
				this.layout.absLeft = true;
				this.layout.absWidth = true;
				this.layout.height = 25;
				break;
			case 'bottom':
				this.layout.absBottom = true;
				this.layout.absLeft = true;
				this.layout.absWidth = true;
				this.layout.height = 25;
				break;
		}
	},

	getChangedViewport:function(){
		var value = 0;
		if(!this.isHidden()){
			switch(this.position){
				case 'left':
				case 'right':
					value = this.layout.width;
					break;
				case 'top':
				case 'bottom':
					value = this.layout.height;
					break;

			}
		}
		return {
			key:this.position,value:value
		}
	},

	addView:function(view){
		this.views.push(view);
		this.addButton(view);
	},

	addButton:function(view){
		var button = this.buttons[view.id] = $('<div>');
		button.attr("id", 'button-' + view.id);
		button.mouseenter(this.enterButton.bind(this));
		button.mouseleave(this.leaveButton.bind(this));
		button.on('click', this.toggleView.bind(this));
		this.getBody().append(button);
		button.html('<div class="collapse-bar-button-bg-first"></div><div class="collapse-bar-button-bg-last"></div>');
		button.addClass('collapse-bar-button collapse-bar-button-' + this.position);

		var svgNode = new ludo.layout.TextBox({
			renderTo:button,
			text:view.title,
			rotation:this.getRotation(),
			className:'ludo-view-collapsed-title'
		});

		var size = svgNode.getSize();
		button.css({
			width: size.x + 'px',
			height : size.y + 'px'
		});

		if(this.position === 'top' || this.position === 'bottom'){
			button.css('left', this.currentPos + 'px');
			this.currentPos += size.x + ludo.dom.getMBPW(button);
		}else{
			button.css('top',  this.currentPos + 'px');
			this.currentPos += size.y  + ludo.dom.getMBPH(button);
		}

		if(!view.isHidden()){
			this.activateButton(view);
		}

		view.addEvent('show', this.activateButton.bind(this));
		view.addEvent('hide', this.deactivateButton.bind(this));
	},

	getRotation:function(){
		switch(this.position){
			case 'left' : return 270;
			case 'right' : return 90;
			default:return 0;
		}
	},

	toggleView:function(e){
		var button = this.getButtonByDom(e.target);
		var id = button.attr("id").replace('button-', '');

		var view = ludo.get(id);

		if(view.isHidden())view.show();else view.hide();
	},

	enterButton:function(e){
		this.getButtonByDom(e.target).addClass('collapse-bar-button-over');
	},

	leaveButton:function(e){
		this.getButtonByDom(e.target).removeClass('collapse-bar-button-over');
	},

	activateButton:function(view){

		if(view.getParent().isHidden())view.getParent().show();
		this.buttons[view.id].addClass('collapse-bar-button-active');

	},

	toggleParent:function(view){
		if(this.allHidden(view)){
			view.getParent().hide();
		}
	},

	allHidden:function(view){
		var parent = view.getParent();
		for(var i=0;i<parent.children.length;i++){
			if(parent.children[i].isHidden() || !parent.children[i].title){

			}else{
				return false;
			}
		}
		return true;
	},

	deactivateButton:function(view){
		this.buttons[view.id].removeClass('collapse-bar-button-active');
		this.toggleParent.delay(50, this, view);
	},

	getButtonByDom:function(el){
		el = $(el);
		var tag = el.prop("tagName").toLowerCase();
		while(tag === 'svg' || tag === 'text' || !el.hasClass('collapse-bar-button')){
			el = el.parent();
			tag = el.prop("tagName").toLowerCase();
		}
		return el;
	},
	getViews:function(){
		return this.views;
	}
});/* ../ludojs/src/collection-view.js */
/**
 * Base class for List and tree.Tree
 * @class CollectionView
 */
ludo.CollectionView = new Class({
	Extends: ludo.View,
	/**
	 * Text to display when the tree or list has no data, i.e. when there's no data in data source or when filter returned no data.
	 * @config {String} emptyText
	 * @default undefined
	 */
	emptyText:undefined,

	ludoConfig:function (config) {
		this.parent(config);
		this.setConfigParams(config, ['emptyText']);
	},

	ludoEvents:function(){
		this.parent();
		if(this.emptyText && !this.getDataSource().hasRemoteSearch()){
			this.getDataSource().getSearcher().addEvents({
				'matches' : this.hideEmptyText.bind(this),
				'noMatches' : this.showEmptyText.bind(this)
			});
		}
	},

	hideEmptyText:function(){
		this.emptyEl().css('display', 'none');
	},

	showEmptyText:function(){
		this.emptyEl().css('display',  '');
		this._emptyEl.html(this.getEmptyText());
	},

	emptyEl:function(){
		if(this._emptyEl === undefined){
			this._emptyEl = ludo.dom.create({
				tag : 'div',
				renderTo:this.getBody(),
				cls : 'ludo-empty-text',
				css:{
					position : 'absolute'
				},
				html : this.getEmptyText()
			})
		}
		return this._emptyEl;
	},

	getEmptyText:function(){
		return ludo.util.isFunction(this.emptyText) ? this.emptyText.call() : this.emptyText;
	},

	_nodeContainer:undefined,

	nodeContainer:function(){
		if(this._nodeContainer === undefined){
			this._nodeContainer = $('<div>');
			this.getBody().append(this._nodeContainer);
	
		}
		return this._nodeContainer;
	},

	render:function(){
		if(this.emptyText){
			this[this.getDataSource().hasData() ? 'hideEmptyText' : 'showEmptyText']();
		}
	},

	insertJSON:function(){

	}
});/* ../ludojs/src/list.js */
ludo.List = new Class({
    Extends:ludo.CollectionView,
    defaultDS:'dataSource.Collection',
    overflow:'scroll',
    highlighted:undefined,
    recordMap:{},

    ludoConfig:function (config) {
        this.parent(config);
    },

    ludoEvents:function () {
        this.parent();
        this.getBody().on('click', this.onClick.bind(this));
    },

    ludoRendered:function () {
        this.parent();

        if (this.dataSource) {
            if (this.dataSourceObj && this.dataSourceObj.hasData()) {
                this.render();
            }
            this.getDataSource().addEvents({
                'change':this.render.bind(this),
                'select':this.select.bind(this),
                'deselect':this.deselect.bind(this),
                'update':this.update.bind(this),
                'delete':this.remove.bind(this)
            });
        }
    },

    render:function () {
		this.parent();
        var d = this.getDataSource().getData();

        var data = this.getTplParser().getCompiled(d, this.tpl);
        var b = this.nodeContainer();
        b.html('');

        for (var i = 0; i < data.length; i++) {
            var id = 'list-' + d[i].uid;
            var el = $('<div class="ludo-list-item" style="cursor:pointer" id="' + id + '">' + data[i] + '</div>');
            b.append(el);
            this.recordMap[d[i].uid] = id;

            el.mouseenter(this.enter.bind(this));
            el.mouseleave(this.leave.bind(this));
        }

        var selected = this.getDataSource().getSelectedRecord();
        if(selected){
            this.select(selected);
        }
    },

    enter:function(e){
        var el = this.getRecordDOM(e.target);
        if(el)el.addClass('ludo-list-item-highlighted');
    },

    leave:function(e){
        var el = this.getRecordDOM(e.target);
        if(el)el.removeClass('ludo-list-item-highlighted');
    },

    getRecordDOM:function(el){
        el = $(el);
        if(!el.hasClass('ludo-list-item')){
            el = el.closest('.ludo-list-item');
        }
        return el;
    },

    getRecordId:function(el){
        el = this.getRecordDOM(el);
        if(el){
            return el.attr("id").replace('list-', '');
        }
        return undefined;
    },

    getDOMForRecord:function(record){
        return this.recordMap[record.uid] ? document.id(this.recordMap[record.uid]) : undefined;

    },

    select:function (record) {
        var el = this.getDOMForRecord(record);
        if(el)el.addClass('ludo-list-item-selected');
    },

    deselect:function (record) {
        var el = this.getDOMForRecord(record);
        if(el)ludo.dom.removeClass(el, 'ludo-list-item-selected');
    },

    update:function (record) {
        var el = this.getDOMForRecord(record);
        if(el){
            var content = this.getTplParser().asString(record, this.tpl);
            el.html( content);
        }
    },

    remove:function (record) {
        var el = this.getDOMForRecord(record);
        if(el){
            el.dispose();
            this.recordMap[record.uid] = undefined;
        }
    },

    onClick:function (e) {
        var recId = this.getRecordId($(e.target));
        if(recId)this.getDataSource().getRecord(recId).select();
    }
});/* ../ludojs/src/notification.js */
/**
 Class for providing short messages and feedback in a popup.
 Notifications automatically disappear after a timeout. Positioning
 of notification can be configured using the layout object.
 @class ludo.Notification
 @augments ludo.View
 @param {Object} config
 @param {String} config.html Message to display
 @param {Number} config.duration Seconds before notification is automatically hidden. Default is 3
 @param {String} config.effect Default effect used for displaying and hiding the notification. Default: fade
 @param {String} config.showEffect Effect used when Notification is displayed(fade or slide)
 @param {String} config.hideEffect Effect used when Notification is hidden(fade or slide)
 @param {Number} config.effectDuration Duration of show/hide effect in seconds. Default: 1
 @param {Boolean} config.autoRemove True to automatically remove the view from DOM when hiding it.
 @example

 new ludo.Notification({
	html : 'Your e-mail has been sent', // message
	duration:4 // Hidden after 4 seconds
});

 new ludo.Notification({
 	html: 'Hello there!',
 	layout:{ // Position right of other view
 		rightOf:'idOfOtherView',
 		alignTop:'idOfOtherView'
 	},
 	autoRemove:true // Automatically remove from DOM when hidden
 });
 */
ludo.Notification = new Class({
	Extends:ludo.View,
	alwaysInFront:true,

	duration:3,
	showEffect:undefined,
	hideEffect:undefined,
	effect:'fade',
	effectDuration:1,
	autoRemove:false,

	ludoConfig:function (config) {
		config.renderTo = config.renderTo || document.body;
		
        this.setConfigParams(config, ['autoRemove','showEffect','hideEffect','effect','effectDuration','duration']);
		this.showEffect = this.showEffect || this.effect;
		this.hideEffect = this.hideEffect || this.effect;
		if (!config.layout && !this.layout) {
			config.layout = {
				centerIn:config.renderTo
			};
		}
		this.parent(config);
	},

	ludoEvents:function(){
		this.parent();
		if(this.autoRemove){
			this.addEvent('hide', this.remove.bind(this));
		}
	},

	ludoDOM:function () {
		this.parent();
		this.getEl().addClass('ludo-notification');
	},

	ludoRendered:function () {
		if (!this.layout.width || !this.layout.height) {
			var size = ludo.dom.getWrappedSizeOfView(this);
			if (!this.layout.width)this.layout.width = size.x;
			if (!this.layout.height)this.layout.height = size.y;
		}
		this.parent();
		this.show();
	},

	hide:function () {
		if (this.hideEffect) {
			var effect = new ludo.effect.Effect();
			effect[this.getEndEffectFn()](
				this.getEl(),
				this.effectDuration,
				this.onHideComplete.bind(this),
				this.getLayout().getRenderer().position()
			);
		} else {
			this.parent();
		}
	},

	show:function () {
		this.parent();

		if (this.showEffect) {
			var effect = new ludo.effect.Effect();
			effect[this.getStartEffectFn()](
				this.getEl(),
				this.effectDuration,
				this.autoHide.bind(this),
				this.getLayout().getRenderer().position()
			);
		}

	},

	getStartEffectFn:function () {
		switch (this.showEffect) {
			case 'fade':
				return 'fadeIn';
			case 'slide':
				return 'slideIn';
			default:
				return this.showEffect;
		}
	},

	getEndEffectFn:function () {
		switch (this.hideEffect) {
			case 'fade':
				return 'fadeOut';
			case 'slide':
				return 'slideOut';
			default:
				return this.hideEffect;
		}
	},

	autoHide:function () {
		this.hide.delay(this.duration * 1000, this);
	},

	onHideComplete:function () {
		this.getEl().css('display', 'none');
		this.fireEvent('hide', this);
	}
});/* ../ludojs/src/effect/resize.js */
/***
 * Make component or DOM elements resizable
 * @module effect
 * @class Resize
 * @namespace effect
 * @augments Core
 */
ludo.effect.Resize = new Class({
    Extends:ludo.Core,
    /**
     * Use shim
     * @attribute {Boolean} useShim
     * @optional
     */
    useShim:true,
    component:undefined,
    els:{
        shim:undefined,
        applyTo:undefined,
        handle:{}
    },
    /**
     * min x position
     * @attribute {Number} minX
     * @default undefined
     */
    minX:undefined,
    /**
     * max x position
     * @attribute {Number} maxX
     * @default undefined
     */
    maxX:undefined,
    /**
     * minimum width
     * @attribute {Number} minWidth
     * @default undefined
     */
    minWidth:undefined,
    /**
     * Maximum width
     * @attribute {Number} maxWidth
     * @default undefined
     */
    maxWidth:undefined,
    /**
     * min y position
     * @attribute {Number} minY
     * @default undefined
     */
    minY:undefined,
    /**
     * max x position
     * @attribute {Number} maxY
     * @default undefined
     */
    maxY:undefined,
    /**
     * minimum height
     * @attribute {Number} minHeight
     * @default undefined
     */
    minHeight:undefined,
    /**
     * max height
     * @attribute {Number} maxHeight
     * @default undefined
     */
    maxHeight:undefined,

    /**
     * Preserve aspect ratio while resizing
     * @attribute {Boolean} preserveAspectRatio
     * @default false
     */
    preserveAspectRatio:false,

    aspectRatio:undefined,

    resizeKeys:{
        'e':['width'],
        's':['height'],
        'w':['left', 'width'],
        'n':['top', 'height'],
        'nw':['top', 'left', 'height', 'width'],
        'ne':['top', 'width', 'height'],
        'se':['width', 'height'],
        'sw':['left', 'height', 'width']
    },

    aspectRatioKeys:undefined,

    dragProperties:{
        active:false
    },

    xRegions:[
        ['w', 'nw', 'sw'],
        ['e', 'ne', 'se']
    ],
    yRegions:[
        ['n', 'nw', 'ne'],
        ['s', 'sw', 'se']
    ],

    aspectRatioMinMaxSet:false,

    ludoConfig:function (config) {
        this.setConfigParams(config, ['useShim','minX','maxX','minY','maxY','maxWidth','minWidth','minHeight','maxHeight','preserveAspectRatio']);
        if (config.component) {
            this.component = config.component;
            this.els.applyTo = this.component.getEl();
        } else {
            this.els.applyTo = config.applyTo;
        }
        if (config.listeners)this.addEvents(config.listeners);
        this.addDragEvents();
        this.setDisplayPropertyOfEl.delay(100, this);
    },

    setDisplayPropertyOfEl:function () {
        var display = this.getEl().css('display');
        if (display !== 'absolute' && display !== 'relative') {
			if(Browser['ie'] && Browser.version < 9)return;
            this.getEl().css('display', 'relative');
        }
    },

    addDragEvents:function () {
        $(document.body).on(ludo.util.getDragEndEvent(), this.stopResize.bind(this));
        $(document.body).on(ludo.util.getDragMoveEvent(), this.resize.bind(this));
    },

    /**
     * Add resize handle to a region. A region can be
     * nw,n,ne,e,se,s,sw or w.
	 *
	 * A new DOM element will be created for the resize handle and injected into
	 * the resized DOM element.
     *
     * Second parameter cssClass is optional.
     * @function addHandle
     * @param {String} region
     * @param {String} cssClass
     * @return void
     */

    addHandle:function (region, cssClass) {
        var el = this.els.handle[region] = $('<div>');
        el.addClass('ludo-component-resize-el');
        el.addClass(this.getCssFor(region));
        if (cssClass)el.addClass(cssClass);
        el.html('<span></span>');
        el.css('cursor', region + '-resize');
        el.attr('region', region);
        el.on(ludo.util.getDragStartEvent(), this.startResize.bind(this));
        this.els.applyTo.append(el)
    },

    startResize:function (e) {

        var region = $(e.target).attr('region');
        /**
         * Fired when starting resize
         * @event start
         * @param string region
         */
        this.fireEvent('start', region);

		ludo.EffectObject.start();

        this.dragProperties = {
            a:1,
            active:true,
            region:region,
            start:{ x:e.pageX, y:e.pageY },
            current:{x:e.pageX, y:e.pageY },
            el: this.getShimCoordinates(),
            minWidth:this.minWidth,
            maxWidth:this.maxWidth,
            minHeight:this.minHeight,
            maxHeight:this.maxHeight,
            area:this.getScalingFactors(),
            preserveAspectRatio: this.preserveAspectRatio ? this.preserveAspectRatio : e.shift ? true : false
        };
        if (this.preserveAspectRatio || e.shift) {
            this.setMinAndMax();
        }
        this.dragProperties.minX = this.getDragMinX();
        this.dragProperties.maxX = this.getDragMaxX();
        this.dragProperties.minY = this.getDragMinY();
        this.dragProperties.maxY = this.getDragMaxY();

        this.setBodyCursor();
        if (this.useShim) {
            this.showShim();
        }
        return ludo.util.isTabletOrMobile() ? false : undefined;

    },

    /**
     * Set min and max width/height based on aspect ratio
     * @function setMinAndMax
     * @private
     */
    setMinAndMax:function () {
        var ratio = this.getAspectRatio();
        var d = this.dragProperties;
        if (ratio === 0)return;
        var minWidth, maxWidth, minHeight, maxHeight;

        if (this.maxWidth !== undefined)maxHeight = this.maxWidth / ratio;
        if (this.minWidth !== undefined)minHeight = this.minWidth / ratio;
        if (this.maxHeight !== undefined)maxWidth = this.maxHeight * ratio;
        if (this.minHeight !== undefined)minWidth = this.minHeight * ratio;

        var coords = this.getEl().offset();
        var absMaxWidth = this.getBodyWidth() - coords.left;
        var absMaxHeight = this.getBodyHeight() - coords.top;

        d.minWidth = Math.max(minWidth || 0, this.minWidth || 0);
        d.maxWidth = Math.min(maxWidth || absMaxWidth, this.maxWidth || absMaxWidth);
        d.minHeight = Math.max(minHeight || 0, this.minHeight || 0);
        d.maxHeight = Math.min(maxHeight || absMaxHeight, this.maxHeight || absMaxHeight);

        if (d.maxWidth / ratio > d.maxHeight)d.maxWidth = d.maxHeight * ratio;
        if (d.maxHeight * ratio > d.maxWidth)d.maxHeight = d.maxWidth / ratio;
    },

    getDragMinX:function () {
        var ret, d = this.dragProperties, r = d.region;
        if (d.maxWidth !== undefined && this.xRegions[0].indexOf(r) >= 0) {
            ret = d.el.left + d.el.width - d.maxWidth;
        } else if (d.minWidth !== undefined && this.xRegions[1].indexOf(r) >= 0) {
            ret = d.el.left + d.minWidth;
        }
        if (this.minX !== undefined) {
            if (ret == undefined)ret = this.minX; else ret = Math.max(ret, this.minX);
        }
        return ret;
    },

    getDragMaxX:function () {
        var ret, d = this.dragProperties, r = d.region;
        if (d.minWidth !== undefined && this.xRegions[0].indexOf(r) >= 0) {
            ret = d.el.left + d.el.width - d.minWidth;
        } else if (d.maxWidth !== undefined && this.xRegions[1].indexOf(r) >= 0) {
            ret = d.el.left + d.maxWidth;
        }
        if (this.maxX !== undefined) {
            if (ret == undefined)ret = this.maxX; else ret = Math.min(ret, this.maxX);
        }
        return ret;
    },

    getDragMinY:function () {
        var ret, d = this.dragProperties, r = d.region;
        if (d.maxHeight !== undefined && this.yRegions[0].indexOf(r) >= 0) {
            ret = d.el.top + d.el.height - d.maxHeight;
        } else if (d.minHeight !== undefined && this.yRegions[1].indexOf(r) >= 0) {
            ret = d.el.top + d.minHeight;
        }
        if (this.minY !== undefined) {
            if (ret == undefined)ret = this.minY; else ret = Math.max(ret, this.minY);
        }
        return ret;
    },

    getDragMaxY:function () {

        var ret, d = this.dragProperties, r = d.region;
        if (d.minHeight !== undefined && this.yRegions[0].indexOf(r) >= 0) {
            ret = d.el.top + d.el.height - d.minHeight;
        } else if (d.maxHeight !== undefined && this.yRegions[1].indexOf(r) >= 0) {
            ret = d.el.top + d.maxHeight;
        }
        if (this.maxY !== undefined) {
            if (ret == undefined)ret = this.maxY; else ret = Math.min(ret, this.maxY);
        }
        return ret;
    },

    setBodyCursor:function () {
        $(document.body).css('cursor', this.dragProperties.region + '-resize');
    },

    revertBodyCursor:function () {
        $(document.body).css('cursor', 'default');
    },

    resize:function (e) {
        if (this.dragProperties.active) {
            this.dragProperties.current = this.getCurrentCoordinates(e);
            var coordinates = this.getCoordinates();
            /**
             * Fired during resize. CSS coordinates are passed as parameter to this event.
             * @event resize
             * @param {Object} coordinates
             */
            this.fireEvent('resize', coordinates);

            if (this.useShim) {
                this.els.shim.css(coordinates);
            } else {
                this.getEl().css(coordinates);
            }
        }
    },

    getCurrentCoordinates:function (e) {
        var ret = {x:e.pageX, y:e.pageY };
        var d = this.dragProperties;
        if(d.preserveAspectRatio && d.region.length === 2)return ret;
        if (d.minX !== undefined && ret.x < d.minX)ret.x = d.minX;
        if (d.maxX !== undefined && ret.x > d.maxX)ret.x = d.maxX;
        if (d.minY !== undefined && ret.y < d.minY)ret.y = d.minY;
        if (d.maxY !== undefined && ret.y > d.maxY)ret.y = d.maxY;
        return ret;
    },

    /**
     * Returns coordinates for current drag operation,
     * example: {left:100,top:100,width:500,height:400}
     * @function getCoordinates
     * @return {Object}
     */
    getCoordinates:function () {
        var d = this.dragProperties;
        var keys = this.resizeKeys[d.region];
        var ret = {};

        if (!d.preserveAspectRatio || d.region.length === 1) {
            for (var i = 0; i < keys.length; i++) {
                ret[keys[i]] = this.getCoordinate(keys[i]);
            }
        }

        if (d.preserveAspectRatio) {
            switch (d.region) {
                case 'e':
                case 'w':
                    ret.height = ret.width / this.aspectRatio;
                    break;
                case 'n':
                case 's':
                    ret.width = ret.height * this.aspectRatio;
                    break;
                default:
                    var scaleFactor = this.getScaleFactor();
                    ret.width = d.el.width * scaleFactor;
                    ret.height = d.el.height * scaleFactor;
                    if(d.region == 'ne' || d.region =='nw'){
                        ret.top = d.el.top + d.el.height - ret.height;
                    }
                    if(d.region == 'nw' || d.region == 'sw'){
                        ret.left = d.el.left + d.el.width - ret.width;
                    }
                    ret.width += this.getBWOfShim();
                    ret.height += this.getBHOfShim();
                    break;
            }
        }
        return ret;
    },

    getScaleFactor:function () {
        var d = this.dragProperties;
        var r = d.region;
        var factor;

        var offsetX = (d.current.x - d.start.x) * d.area.xFactor / d.area.sum;
        var offsetY = (d.current.y - d.start.y) * d.area.yFactor / d.area.sum;
        switch (r) {
            case 'se':
                factor = 1 + offsetX + offsetY;
                break;
            case 'ne':
                factor = 1 + offsetX + offsetY * -1;
                break;
            case 'nw':
                factor = 1 + offsetX * -1 + offsetY * -1;
                break;
            case 'sw':
                factor = 1 + offsetX * -1 + offsetY;
                break;


        }
        if (d.minWidth) {
            factor = Math.max(factor, d.minWidth / d.el.width);
        }
        if (d.minHeight) {
            factor = Math.max(factor, d.minHeight / d.el.height);
        }
        if (d.maxWidth) {
            factor = Math.min(factor, d.maxWidth / d.el.width);
        }
        if (d.maxHeight) {
            factor = Math.min(factor, d.maxHeight / d.el.height);
        }
        return factor;

    },

    getCoordinate:function (key) {
        var r = this.dragProperties.region;
        var d = this.dragProperties;
        switch (key) {
            case 'width':
                if (r == 'e' || r == 'ne' || r == 'se') {
                    return d.el.width - d.start.x + d.current.x + this.getBWOfShim();
                } else {
                    return d.el.width + d.start.x - d.current.x + this.getBWOfShim();
                }
                break;
            case 'height':
                if (r == 's' || r == 'sw' || r == 'se') {
                    return d.el.height - d.start.y + d.current.y + this.getBHOfShim();
                } else {
                    return d.el.height + d.start.y - d.current.y + this.getBHOfShim();
                }
            case 'top':
                if (r == 'n' || r == 'nw' || r == 'ne') {
                    return d.el.top - d.start.y + d.current.y;
                } else {
                    return d.el.top + d.start.y - d.current.y;
                }
            case 'left':
                if (r == 'w' || r == 'nw' || r == 'sw') {
                    return d.el.left - d.start.x + d.current.x;
                } else {
                    return d.el.left + d.start.x - d.current.x;
                }
        }
        return undefined;
    },

    getBWOfShim:function () {
        if (this.useShim) {
            return ludo.dom.getBW(this.getShim());
        }
        return 0;
    },

    getBHOfShim:function () {
        if (this.useShim) {
            return ludo.dom.getBH(this.getShim());
        }
        return 0;
    },

    stopResize:function () {
        if (this.dragProperties.active) {
            this.dragProperties.active = false;
            /**
             * Fired when resize is complete.
             * CSS coordinates are passed as parameter to this event.
             * @event stop
             * @param {Object} coordinates
             */
            this.fireEvent('stop', this.getCoordinates());
			ludo.EffectObject.end();
            this.revertBodyCursor();
            if (this.useShim) {
                this.hideShim();
            }
        }
    },

    getCssFor:function (region) {
        return 'ludo-component-resize-region-' + region;
    },

    showShim:function () {
        var shim = this.getShim();
        var coords = this.getShimCoordinates();
        shim.css({
            display:'',
            left:coords.left,
            top:coords.top,
            width:coords.width,
            height:coords.height
        });
    },

    hideShim:function () {
        this.getShim().css('display', 'none');
    },

    getShimCoordinates:function () {
        var el = this.getEl();
        var coords = el.offset();
        coords.width = el.outerWidth();
        coords.height = el.outerHeight();

        if (this.useShim) {
            var shim = this.getShim();
            coords.width -= ludo.dom.getBW(shim);
            coords.height -= ludo.dom.getBH(shim);
        }
        return coords;
    },

    getShim:function () {
        if (!this.els.shim) {
            var el = this.els.shim = $('<div>');
            el.addClass('ludo-shim-resize');
            el.css({
                position:'absolute',
                'z-index':50000
            });
            $(document.body).append(el);
        }

        return this.els.shim;
    },
    getEl:function () {
        return this.els.applyTo;
    },

    hideAllHandles:function () {
        this.setHandleDisplay('none');
    },
    showAllHandles:function () {
        this.setHandleDisplay('');
    },

    setHandleDisplay:function (display) {
        for (var key in this.els.handle) {
            if (this.els.handle.hasOwnProperty(key)) {
                this.els.handle[key].css('display', display);
            }
        }
    },

    getAspectRatio:function () {
        if (this.aspectRatio === undefined) {
            this.aspectRatio = this.getEl().width() / this.getEl().height();
        }
        return this.aspectRatio;
    },

    getBodyWidth:function () {
        return $(document.documentElement).width();
    },
    getBodyHeight:function () {
        return $(document.documentElement).height();
    },

    getScalingFactors:function () {
        var size = { x: this.getEl().width(), y: this.getEl().height() };
        return {
            xFactor:size.x / size.y,
            yFactor:size.y / size.x,
            sum:size.x + size.y
        };
    }
});/* ../ludojs/src/view/button-bar.js */
/**
 * Class used to create button bars at bottom of components.
 * This class is instantiated automatically
 * @namespace view
 * @class ButtonBar
 * @augments View
 */
ludo.view.ButtonBar = new Class({
    Extends:ludo.View,
    type : 'ButtonBar',
    layout:{
        type:'linear',
		orientation:'horizontal',
		width:'matchParent',
        height:'matchParent'
    },
    elCss:{
        height:'100%'
    },
    align:'right',
    cls:'ludo-component-button-container',
    overflow:'hidden',
    component:undefined,
	buttonBarCss:undefined,

    ludoConfig:function (config) {
        this.setConfigParams(config, ['align','component','buttonBarCss']);
        config.children = this.getValidChildren(config.children);
        if (this.align == 'right' || config.align == 'center') {
            config.children = this.getItemsWithSpacer(config.children);
            if(config.align == 'center'){
                config.children.push(this.emptyChild());
            }
        }else{
            config.children[0].elCss = config.children[0].elCss || {};
            if(!config.children[0].elCss['margin-left']){
                config.children[0].elCss['margin-left'] = 2
            }
        }

        this.parent(config);
    },
    ludoDOM:function () {
        this.parent();
        this.getBody().addClass('ludo-content-buttons');
    },

    ludoRendered:function () {
        this.parent();
		this.component.addEvent('resize', this.resizeRenderer.bind(this));

		if(this.buttonBarCss){
			this.getEl().parent().css(this.buttonBarCss);
		}

    },

	resizeRenderer:function(){
		this.getLayout().getRenderer().resize();
	},

    getValidChildren:function (children) {
        for (var i = 0; i < children.length; i++) {
            if (children[i].value && !children[i].type) {
                children[i].type = 'form.Button'
            }
        }
        return children;
    },

    getButtons:function () {
        var ret = [];
        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i].isButton && this.children[i].isButton()) {
                ret.push(this.children[i]);
            }
        }
        return ret;
    },

    getButton:function (key) {
        var c = this.children;
        for (var i = 0; i < c.length; i++) {
            if(c[i].id == key || c[i].name == key || (c[i].val && c[i].val().toLowerCase() == key.toLowerCase())){
                return c[i];
            }
        }
		return undefined;
    },

    getItemsWithSpacer:function (children) {
        children.splice(0, 0, this.emptyChild());

        return children;
    },

    emptyChild:function(){
        return {
            layout: { weight:1 },
            elCss:{ 'background-color':'transparent' },
            css:{ 'background-color':'transparent'}
        };
    },
    /**
     * Returns the component where the button bar is placed
	 * @function getView
     * @return {Object} ludo Component
     * @private
     */
    getView : function(){
        return this.component;
    }
});/* ../ludojs/src/view/title-bar.js */
// TODO support all kinds of buttons - customizable
ludo.view.TitleBar = new Class({
    Extends:ludo.Core,
    view:undefined,
    els:{
        el:undefined,
        icon:undefined,
        title:undefined,
        buttons:{},
        buttonArray:[]
    },

    toggleStatus:{},

    ludoConfig:function (config) {
        this.parent(config);

        this.setConfigParams(config, ['view', 'buttons']);

        if (!this.buttons)this.buttons = this.getDefaultButtons();

        this.view.addEvent('setTitle', this.setTitle.bind(this));
        this.view.addEvent('resize', this.resizeDOM.bind(this));
        this.createDOM();
        this.setSizeOfButtonContainer();
    },

    getDefaultButtons:function () {
        var ret = [];
        var v = this.view;
        if (v.isMinimizable())ret.push('minimize');
        if (v.isCollapsible())ret.push('collapse');
        if (v.isClosable())ret.push('close');
        return ret;
    },

    createDOM:function () {
        var el = this.els.el = $('<div>');
        el.addClass(this.view.boldTitle ? 'ludo-framed-view-titlebar' : 'ludo-component-titlebar');
        var left = 0;
        if (this.view.icon) {
            this.createIconDOM();
            left += ludo.dom.getNumericStyle(el, 'width');
        }
        this.createTitleDOM();
        el.append(this.getButtonContainer());
        this.resizeButtonContainer.delay(20, this);
        this.els.title.css('left', left);
        el.on('selectstart', ludo.util.cancelEvent);
    },

    createIconDOM:function () {
        this.els.icon = ludo.dom.create({
            renderTo:this.els.el,
            cls:'ludo-framed-view-titlebar-icon',
            css:{ 'backgroundImage':'url(' + this.view.icon + ')'}
        });
    },

    setTitle:function (title) {
        this.els.title.html(title);
    },

    createTitleDOM:function () {

        this.els.title = $('<div class="ludo-framed-view-titlebar-title"></div>');
        this.els.el.append(this.els.title);

        this.setTitle(this.view.title);
    },

    cancelTextSelection:function () {
        return false;
    },

    getButtonContainer:function () {


        var el = this.els.controls = $('<div class="ludo-title-bar-button-container"></div>');
        el.css('cursor.default');

        this.createEdge('left', el);
        this.createEdge('right', el);

        for (var i = 0; i < this.buttons.length; i++) {
            el.append(this.getButton(this.buttons[i]));
        }

        this.addBorderToButtons();
        return el;
    },

    createEdge:function (pos, parent) {
        var el = $('<div class="ludo-title-bar-button-container-' + pos + '-edge"></div>');
        parent.append(el);

        el.attr("style", 'position:absolute;z-index:1;' + pos + ':0;top:0;width:55%;height:100%;background-repeat:no-repeat;background-position:top ' + pos);
        return el;

    },

    shouldShowCollapseButton:function () {
        var parent = this.view.getParent();
        return parent.layout && parent.layout.type ? parent.layout.type === 'linear' || parent.layout.type == 'relative' : false;
    },

    resizeButtonContainer:function () {
        this.els.controls.css('width', this.getWidthOfButtons());
    },

    getButton:function (buttonConfig) {
        buttonConfig = ludo.util.isString(buttonConfig) ? { type:buttonConfig } : buttonConfig;

        var b = this.els.buttons[buttonConfig.type] = $('<div>');
        b.id = 'b-' + String.uniqueID();
        b.attr("class", 'ludo-title-bar-button ludo-title-bar-button-' + buttonConfig.type);

        b.on("click", this.getButtonClickFn(buttonConfig.type));
        b.mouseenter(this.enterButton.bind(this));
        b.mouseleave(this.leaveButton.bind(this));

        b.attr('title', buttonConfig.title ? buttonConfig.title : buttonConfig.type.capitalize());
        b.attr('buttonType', buttonConfig.type);

        if (buttonConfig.type === 'collapse') {
            b.addClass('ludo-title-bar-button-collapse-' + this.getCollapseButtonDirection());
        }
        this.els.buttonArray.push(b);
        return b;
    },


    getButtonClickFn:function (type) {
        var buttonConfig = ludo.view.getTitleBarButton(type);
        var toggle = buttonConfig && buttonConfig.toggle ? buttonConfig.toggle : undefined;

        return function (e) {
            this.leaveButton(e);
            var event = type;
            if (toggle) {
                if (this.toggleStatus[type]) {
                    event = this.toggleStatus[type];
                    ludo.dom.removeClass(e.target, 'ludo-title-bar-button-' + event);
                    event = this.getNextToggle(toggle, event);

                }
                ludo.dom.removeClass(e.target, 'ludo-title-bar-button-' + event);
                this.toggleStatus[type] = event;
                ludo.dom.addClass(e.target, 'ludo-title-bar-button-' + this.getNextToggle(toggle, event));
            }
            this.fireEvent(event);
        }.bind(this);
    },

    getNextToggle:function (toggle, current) {
        var ind = toggle.indexOf(current) + 1;
        return toggle[ind >= toggle.length ? 0 : ind];
    },

    addBorderToButtons:function () {
        var firstFound = false;
        for (var i = 0; i < this.els.buttonArray.length; i++) {
            this.els.buttonArray[i].removeClass('ludo-title-bar-button-with-border');
            if (firstFound)this.els.buttonArray[i].addClass('ludo-title-bar-button-with-border');
            firstFound = true;
        }
    },

    enterButton:function (e) {
        var el = $(e.target);
        var type = el.attr('buttonType');
        el.addClass('ludo-title-bar-button-' + type + '-over');
    },

    leaveButton:function (e) {
        var el = $(e.target);
        el.removeClass('ludo-title-bar-button-' + el.attr('buttonType') + '-over');
    },

    getWidthOfButtons:function () {
        var ret = 0;
        var els = this.els.buttonArray;
        for (var i = 0, count = els.length; i < count; i++) {
            var width = els[i].outerWidth();
            if (width) {
                ret += width;
            } else {
                ret += els[i].width();
            }
        }
        return ret ? ret : els.length * 10;
    },

    getEl:function () {
        return this.els.el;
    },

    setSizeOfButtonContainer:function () {
        if (this.els.controls) {
            var width = this.getWidthOfButtons();
            this.els.controls.css('width',  width + 'px');
            this.els.controls.css('display',  width > 0 ? '' : 'none');
        }
        if (this.icon) {
            this.els.title.css('left', $(this.els.icon).css('width'));
        }
    },

    getWidthOfIconAndButtons:function () {
        var ret = this.view.icon ? this.els.icon.width() : 0;
        return ret + this.els.controls.width();
    },

    resizeDOM:function () {
        var width = (this.view.width - this.getWidthOfIconAndButtons());
        if (width > 0)this.els.title.css('width', width);
    },

    height:undefined,
    getHeight:function () {
        if (this.height === undefined) {
            this.height = this.els.el.outerHeight();
        }
        return this.height;
    },

    getCollapseButtonDirection:function () {
        var c = this.view;
        if (ludo.util.isString(c.layout.collapsible)) {
            return c.layout.collapsible;
        }
        var parent = c.getParent();
        if (parent && parent.layout && parent.layout.type === 'linear' && parent.layout.orientation === 'horizontal') {
            return parent.children.indexOf(c) === 0 ? 'left' : 'right';
        } else {
            return parent.children.indexOf(c) === 0 ? 'top' : 'bottom';
        }
    }
});

ludo.view.registerTitleBarButton = function (name, config) {
    ludo.registry.set('titleBar-' + name, config);
};

ludo.view.getTitleBarButton = function (name) {
    return ludo.registry.get('titleBar-' + name);
};

ludo.view.registerTitleBarButton('minimize', {
    toggle:['minimize', 'maximize']
});/* ../ludojs/src/framed-view.js */
/**
 * Displays a View with a title bar and support for a bottom button bar .
 * @parent ludo.View
 * @class ludo.FramedView
 * @extends ludo.View
 * @param {Object} config
 * @param {String} config.title Title for the title bar
 * @param {String} config.icon Path to icon to be placed in top left corner of title bar, default:undefined
 * @param {Boolean} config.minimizable True to add minimize button to the title bar.
 * @param {Boolean} config.minimized True to render the view minimized.
 * @param {Object} config.buttonBar Optional button bar configuration. The button bar is div at the bottom of the view where child views(example buttons) are rendered in a linear horizontal layout.
 * Alignment of button can be set using config.buttonBar.align(left, center or right).<br> Example: <br><code>buttonBar: { align:'left', children:[ {type:'ludo.form.Button', value: 'OK' }]}. </code>.<br>Default alignment is "right"
 */
ludo.FramedView = new Class({
	Extends:ludo.View,
	type:'FramedView',
	layout:{
		type:'fill',
		minWidth:100,
		minHeight:100
	},

	minimized:false,
	title:'',
	movable:false,
	minimizable:false,
	resizable:false,
	closable:false,

	width:null,
	height:200,

	preserveAspectRatio:false,
	icon:undefined,

	/**
	 Config object for the title bar
	 @config titleBar
	 @type {Object}
	 @default undefined
	 @example
	 	new ludo.Window({
	 		titleBar:{
				buttons: [{
					type : 'reload',
					title : 'Reload grid data'
				},'minimize','close'],
				listeners:{
					'reload' : function(){
						ludo.get('myDataSource').load();
					}
				}
			}
	 	});

	 You can create your own buttons by creating the following css classes:
	 @example
		 .ludo-title-bar-button-minimize {
			 background-image: url('../images/title-bar-btn-minimize.png');
		 }

		 .ludo-title-bar-button-minimize-over {
			 background-image: url('../images/title-bar-btn-minimize-over.png');
		 }

	 Replace "minimize" with the unique name of your button.

	 If you want to create a toggle button like minimize/maximize, you can do that with this code:

	 @example
		 ludo.view.registerTitleBarButton('minimize',{
			toggle:['minimize','maximize']
		 });
	 */
	titleBar:undefined,
	titleBarHidden:false,
	boldTitle:true,
	hasMenu:false,
	buttons:[],
	buttonBar:undefined,

	menuConfig:null,
	menuObj:null,

	state:{
		isMinimized:false
	},

	ludoConfig:function (config) {
		this.parent(config);
        if (config.buttons) {
            config.buttonBar = {
                children:config.buttons
            }
        }

        this.setConfigParams(config,['buttonBar', 'hasMenu','menuConfig','icon','titleBarHidden','titleBar','buttons','boldTitle','minimized']);

	},

	/**
	 * Return config of title bar using a method instead of config object. Useful when you need to refer to "this"
	 * @function getTitleBarConfig
	 * @return {Object|undefined}
	 */
	getTitleBarConfig:function(){
		return undefined;
	},

	/**
	 * Return button bar config using a method instead of using buttonBar config object. Useful when you need to refer to
	 * "this"
	 * @function getButtonBarConfig
	 * @return {Object|undefined}
	 */
	getButtonBarConfig:function(){
		return undefined;
	},

	ludoDOM:function () {
		this.parent();

		this.els.container.addClass('ludo-framed-view');

		if(this.hasTitleBar()){
			this.getTitleBar().getEl().insertBefore(this.getBody());
		}
		this.getBody().addClass('ludo-framed-view-body');

		if (!this.getParent() && this.isResizable()) {
			this.getResizer().addHandle('s');
		}
	},


	ludoRendered:function () {
        // TODO create button bar after view is rendered.


		if(!this.buttonBar)this.buttonBar = this.getButtonBarConfig();
		if (this.buttonBar && !this.buttonBar.children) {
			this.buttonBar = { children:this.buttonBar };
		}

        if (this.buttonBar) {
            this.getButtonBar()
        } else {
			this.els.container.addClass('ludo-component-no-buttonbar')
        }
		this.parent();
		if (this.minimized) {
			this.minimize();
		}
	},

	resizer:undefined,
	getResizer:function () {
		if (this.resizer === undefined) {
			var r = this.getLayout().getRenderer();
			this.resizer = this.createDependency('resizer', new ludo.effect.Resize({
				component:this,
				preserveAspectRatio:this.layout.preserveAspectRatio,
				minWidth:r.getMinWidth(),
				minHeight:r.getMinHeight(),
				maxHeight:r.getMaxHeight(),
				maxWidth:r.getMaxWidth(),
				listeners:{
					stop:r.setSize.bind(r)
				}
			}));
			this.resizer.addEvent('stop', this.saveState.bind(this));
		}
		return this.resizer;
	},
	/**
	 * Set new title
	 * @function setTitle
	 * @param {String} title
	 */
	setTitle:function (title) {
		this.parent(title);
        this.fireEvent('setTitle', title);
	},

	resizeDOM:function () {
		var height = this.getHeight();
		height -= (ludo.dom.getMBPH(this.els.container) + ludo.dom.getMBPH(this.els.body) +  this.getHeightOfTitleAndButtonBar());
		
        if(height >= 0){
            this.els.body.css('height', height);
            this.cachedInnerHeight = height;

            if (this.buttonBarComponent) {
                this.buttonBarComponent.resize();
            }
        }
	},

	heightOfTitleAndButtonBar:undefined,
	getHeightOfTitleAndButtonBar:function () {
		if (this.isHidden())return 0;
		if (!this.heightOfTitleAndButtonBar) {
			this.heightOfTitleAndButtonBar = this.getHeightOfTitleBar() + this.getHeightOfButtonBar();
		}
		return this.heightOfTitleAndButtonBar;
	},

	getHeightOfButtonBar:function () {
		if (!this.buttonBar)return 0;
        return this.els.buttonBar.el.outerHeight();
	},

	getHeightOfTitleBar:function () {
		if (!this.hasTitleBar())return 0;
		return this.titleBarObj.getHeight();
	},

	hasTitleBar:function(){
		return !this.titleBarHidden;
	},

	getTitleBar:function(){
		if (this.titleBarObj === undefined) {

			if(!this.titleBar)this.titleBar = this.getTitleBarConfig() || {};
			this.titleBar.view = this;
			this.titleBar.type = 'view.TitleBar';
			this.titleBarObj = this.createDependency('titleBar', this.titleBar);

			this.titleBarObj.addEvents({
				close:this.close.bind(this),
				minimize:this.minimize.bind(this),
				maximize:this.maximize.bind(this),
				collapse:this.hide.bind(this)
			});

			if (this.isMovable() && !this.getParent()) {
				this.drag = this.createDependency('drag', new ludo.effect.Drag({
					handle:this.titleBarObj.getEl(),
					el:this.getEl(),
					listeners:{
						start:this.increaseZIndex.bind(this),
						end:this.stopMove.bind(this)
					}
				}));
				this.titleBarObj.getEl().css('cursor', 'move');
			}
		}
		return this.titleBarObj;
	},

	getHeight:function () {
        return this.isMinimized() ? this.getHeightOfTitleBar() : this.parent();
	},

	close:function () {
		this.hide();
		this.fireEvent('close', this);
	},

	isMinimized:function () {
		return this.state.isMinimized;
	},

	/**
	 * Maximize component
	 * @function maximize
	 * @return void
	 */
	maximize:function () {
        this.state.isMinimized = false;
        if (!this.hidden) {
            this.resize({
                height:this.layout.height
            });
            this.els.body.css('visibility', 'visible');
            this.showResizeHandles();
            /**
             * Fired when a component is maximized
             * @event maximize
             * @param component this
             */
            this.fireEvent('maximize', this);
        }
	},

	showResizeHandles:function () {
		if (this.isResizable()) {
			this.getResizer().showAllHandles();
		}
	},

	hideResizeHandles:function () {
		if (this.isResizable()) {
			this.getResizer().hideAllHandles();
		}
	},

	/**
	 * Minimize component
	 * @function minimize
	 * @return void
	 */
	minimize:function () {
        this.state.isMinimized = true;
		if (!this.hidden) {
            var height = this.layout.height;
            var newHeight = this.getHeightOfTitleBar();
            this.els.container.css('height', this.getHeightOfTitleBar());
            this.els.body.css('visibility', 'hidden');
            this.hideResizeHandles();

            this.layout.height = height;
            /**
             * @event minimize
             * @param Component this
             */
            this.fireEvent('minimize', [this, { height: newHeight }]);
        }
	},

	getHtml:function () {
		return this.els.body.html();
	},

	getButtonBar:function () {
		if (!this.els.buttonBar) {
			this.els.buttonBar = this.els.buttonBar || {};

			var el = this.els.buttonBar.el = $('<div class="ludo-component-buttonbar"></div>');
			this.els.container.append(el);

			this.getEl().addClass('ludo-component-with-buttonbar');
			this.buttonBar.renderTo = el;
			this.buttonBar.component = this;
			this.buttonBarComponent = this.createDependency('buttonBar', new ludo.view.ButtonBar(this.buttonBar));
		}
		return this.els.buttonBar.el;
	},

	getButton:function (key) {
		return this.getButtonByKey(key);
	},
	/**
	 * Hide a button on the button bar
	 * @function hideButton
	 * @param id of button
	 * @return {Boolean} success
	 */
	hideButton:function (id) {
        return this.buttonEffect(id, 'hide');
	},
	/**
	 * Show a button on the button bar
	 * @function showButton
	 * @param id of button
	 * @return {Boolean} success
	 */
	showButton:function (id) {
        return this.buttonEffect(id, 'show');
	},

	getButtons:function () {
        return this.buttonBarComponent ? this.buttonBarComponent.getButtons() : [];
	},
	/**
	 * Disable a button on the button bar
	 * @function disableButton
	 * @param id
	 * @return {Boolean} success
	 */
	disableButton:function (id) {
        return this.buttonEffect(id, 'disable');
	},
	/**
	 * Enable a button on the button bar
	 * @function enableButton
	 * @param id
	 * @return {Boolean} success
	 */
	enableButton:function (id) {
        return this.buttonEffect(id, 'enable');
	},

    buttonEffect:function(id,effect){
        var button = this.getButtonByKey(id);
        if (button) {
            button[effect]();
            return true;
        }
        return false;
    },

	getButtonByKey:function (key) {
		if (this.buttonBarComponent) {
			return this.buttonBarComponent.getButton(key);
		}
		for (var i = 0; i < this.buttons.length; i++) {
			if (this.buttons[i].getId() === key || this.buttons[i].val() == key || this.buttons[i].getName() == key) {
				return this.buttons[i];
			}
		}
		return null;
	},
	/**
	 * Is component resizable
	 * @function isResizable
	 * @return {Boolean}
	 */
	isResizable:function () {
		return this.resizable;
	},
	stopMove:function (el, drag) {
		this.getLayout().getRenderer().setPosition(drag.getX(), drag.getY());
		/**
		 * Event fired after moving Component
		 * @event stopmove
		 * @param {Object} Component
		 */
		this.fireEvent('stopmove', this);
	}
});/* ../ludojs/src/application.js */
/**
 * A view rendered to document.body with a width and height of 100%
 * @class Application
 * @augments FramedView
 */
ludo.Application = new Class({
    Extends:ludo.View,
    type:'Application',
	layout:{
		width:'matchParent',
		height:'matchParent'
	},

    ludoConfig:function (config) {
        config.renderTo = document.body;
        this.parent(config);
		this.setBorderStyles();
    },

    ludoRendered:function () {
        this.parent();
        this.getEl().addClass('ludo-application');
        this.getBody().addClass('ludo-application-content');
    },

    setBorderStyles:function () {
        var styles = {
            width:'100%',
            height:'100%',
            overflow:'hidden',
            margin:0,
            padding:0,
            border:0
        };
        $(document.body).css(styles);
        $(document.documentElement).css(styles);
    }
});/* ../ludojs/src/window.js */
/**
 * Displays a movable View with Title Bar.
 * @parent ludo.FramedView
 * @class ludo.Window
 * @param {Object} config
 * @param {Boolean} config.resizable true to make the window resizable, default = true
 * @param {Boolean} config.movable true to make the window movable, default = true
 * @param {Boolean} config.hideBodyOnMove true to display a dotted rectangle when moving the window. The window will be positioned on mouse up.
 * @param {Boolean} config.resizeLeft true make the window resizable from left edge, default = true
 * @param {Boolean} config.resizeTop true make the window resizable from top edge, default = true.
 * @param {Boolean} config.resizeRight true make the window resizable from right edge, default = true.
 * @param {Boolean} config.resizeBottom true make the window resizable from bottom edge, default = true.
 * @param {Boolean} config.preserveAspectRatio Preserve aspect ratio(width/height) when resizing.
 * @param {Boolean} config.closable True to make the window closable. This will add a close button to the title bar.
 * @param {Boolean} config.minimizable True to make the window minimizable. This will add a minimize button to the title bar.
 * @param {Number} config.layout.minWidth Optional minimum width of window in pixels.
 * @param {Number} config.layout.minHeight Optional minimum height of window in pixels.
 * @param {Number} config.layout.maxWidth Optional maximum width of window in pixels.
 * @param {Number} config.layout.maxHeight Optional maximum height of window in pixels.
 * @summary new ludo.Window({ ... });
 *
 * @example
 * new ludo.Window({
 *	   layout:{
 *	        type:'linear', orientation:'horizontal',
 *          width:500,height:500,
 *	        left:100,top:100
 *
 *	   },
 *	   children:[
 *	   {
 *		   	layout:{
 *		   		weight:1
 *			},
 *		   html : 'Panel 1'
 *	   },{
 *		   	layout:{
 *		   		weight:1
 *			},
 *		   	html: 'Panel 2'
 *	   }]
 *	});
 */
ludo.Window = new Class({
    Extends: ludo.FramedView,
    type: 'Window',
    cssSignature: 'ludo-window',
    movable: true,
    resizable: true,
    closable: true,
    top: undefined,
    left: undefined,
    width: 300,
    height: 200,
    resizeTop: true,
    resizeLeft: true,
    hideBodyOnMove: false,
    preserveAspectRatio: false,
    statefulProperties: ['layout'],

    ludoConfig: function (config) {
        config = config || {};
        config.renderTo = document.body;
        var keys = ['resizeTop', 'resizeLeft', 'hideBodyOnMove', 'preserveAspectRatio'];
        this.setConfigParams(config, keys);

        this.parent(config);
    },

    ludoEvents: function () {
        this.parent();
        if (this.hideBodyOnMove) {
            this.addEvent('startmove', this.hideBody.bind(this));
            this.addEvent('stopmove', this.showBody.bind(this));
        }
        this.addEvent('stopmove', this.saveState.bind(this));
    },

    hideBody: function () {
        this.getBody().css('display', 'none');
        if (this.els.buttonBar)this.els.buttonBar.el.css('display', 'none');
    },

    showBody: function () {
        this.getBody().css('display', '');
        if (this.els.buttonBar)this.els.buttonBar.el.css('display', '');
    },

    ludoRendered: function () {
        this.parent();
        this.getEl().addClass('ludo-window');
        this.focusFirstFormField();
        this.fireEvent('activate', this);
    },

    ludoDOM: function () {
        this.parent();
        if (this.isResizable()) {
            var r = this.getResizer();
            if (this.resizeTop) {
                if (this.resizeLeft) {
                    r.addHandle('nw');
                }
                r.addHandle('n');
                r.addHandle('ne');
            }

            if (this.resizeLeft) {
                r.addHandle('w');
                r.addHandle('sw');
            }
            r.addHandle('e');
            r.addHandle('se');
        }
    },

    show: function () {
        this.parent();
        this.focusFirstFormField();
    },

    focusFirstFormField: function () {
        var els = this.getBody().children('input');
        for (var i = 0, count = els.length; i < count; i++) {
            if (els[i].type && els[i].type.toLowerCase() === 'text') {
                els[i].focus();
                return;
            }
        }
        var el = this.getBody().find('textarea');
        if (el) {
            el.focus();
        }
    },

    isUsingShimForResize: function () {
        return true;
    },
    /**
     * Show window at x and y position
     * @function showAt
     * @param {Number} x
     * @param {Number} y
     * @return void
     */
    showAt: function (x, y) {
        this.setXY(x, y);
        this.show();
    },

    setXY: function (x, y) {
        this.layout.left = x;
        this.layout.top = y;
        var r = this.getLayout().getRenderer();
        r.clearFn();
        r.resize();
    },

    center: function () {
        var b = $(document.body);
        var bodySize = {x: b.width(), y: b.height()};
        var x = Math.round((bodySize.x / 2) - (this.getWidth() / 2));
        var y = Math.round((bodySize.y / 2) - (this.getHeight() / 2));
        this.setXY(x, Math.max(0, y));
    },

    /**
     * Show window centered on screen
     * @function showCentered
     * @return void
     */
    showCentered: function () {
        this.center();
        this.show();
    },

    isWindow: function () {
        return true;
    }
});/* ../ludojs/src/data-source/search-parser.js */
/**
 * Internal class used to parse search into a function
 * @namespace dataSource
 * @class SearchParser
 */
ludo.dataSource.SearchParser = new Class({

	searches:undefined,

	parsedSearch:{
		items:[]
	},
	branches:[],

	compiled:undefined,

	getSearchFn:function(searches){
		this.parse(searches);
		this.compiled = this.parsedSearch;
		this.compiled = this.compile(Object.clone(this.parsedSearch));
		return this.compiled;
	},

	clear:function(){
		this.parsedSearch = {
			items:[]
		};
		this.branches = [];
	},

	parse:function (searches) {
		this.clear();
		this.branches.push(this.parsedSearch);
		for (var i = 0; i < searches.length; i++) {
			if (this.isBranchStart(searches[i])) {
				var branch = {
					items:[]
				};
				this.appendToCurrentBranch(branch);
				this.branches.push(branch);
			}
			else if (this.isBranchEnd(searches[i])) {
				this.setOperatorIfEmpty();
				if (this.branches.length > 1)this.branches.pop();
			}
			else if (this.isOperator(searches[i])) {
				if (!this.hasOperator()) {
					this.setOperator(searches[i]);
				} else if (this.shouldCreateBranchOfPrevious(searches[i])) {
					this.createBranchOfPrevious();
					this.setOperator(searches[i]);
				} else if (this.shouldCreateNewBranch(searches[i])) {
					var newBranch = {
						operator:searches[i],
						items:[]
					};
					newBranch.items.push(this.branches[this.branches.length - 1].items.pop());
					this.appendToCurrentBranch(newBranch);
					this.branches.push(newBranch);
				}

			} else {
				this.appendToCurrentBranch(searches[i]);
			}
		}
		this.setOperatorIfEmpty();

	},

	compile:function(branch){
		var ib = this.getIndexOfInnerBranch(branch);
		var counter = 0;
		while(ib >=0 && counter < 100){
			branch.items[ib] = { fn : this.compile(branch.items[ib]) };
			counter++;
			ib = this.getIndexOfInnerBranch(branch);
		}
        return branch.operator === '&' ? this.getAndFn(branch) : this.getOrFn(branch);
	},

	getAndFn:function(branch){
		var items = branch.items;
		return function(record){
			for(var i=0;i<items.length;i++){
				if (items[i].txt !== undefined) {
					if (record.searchIndex.indexOf(items[i].txt) === -1) {
						return false;
					}
				} else if (items[i].fn !== undefined) {
					if (!items[i].fn.call(this, record))return false;
				}
			}
			return true;
		}
	},

	getOrFn:function(branch){
		var items = branch.items;
		return function(record){
			for(var i=0;i<items.length;i++){
				if (items[i].txt !== undefined) {
					if (record.searchIndex.indexOf(items[i].txt) > -1) {
						return true;
					}
				} else if (items[i].fn !== undefined) {
					if (items[i].fn.call(this, record))return true;
				}
			}
			return false;
		}
	},

	getIndexOfInnerBranch:function(branch){
		for(var i=0;i<branch.items.length;i++){
			if(branch.items[i].operator !== undefined)return i;
		}
		return -1;
	},

	setOperatorIfEmpty:function () {
		var br = this.branches[this.branches.length - 1];
		br.operator = br.operator || '&';
	},

	isBranchStart:function (operator) {
		return operator === '(';
	},

	isBranchEnd:function (operator) {
		return operator === ')';
	},

	shouldCreateBranchOfPrevious:function (operator) {
		return operator === '|' && this.getCurrentOperator() === '&';
	},

	createBranchOfPrevious:function () {
		var br = this.branches[this.branches.length - 1];
		var newBranch = {
			operator:br.operator,
			items:br.items
		};
		br.operator = undefined;
		br.items = [newBranch];
	},

	shouldCreateNewBranch:function (operator) {
		return operator === '&' && this.isDifferentOperator(operator);
	},

	appendToCurrentBranch:function (search) {
		this.branches[this.branches.length - 1].items.push(search);
	},

	isOperator:function (token) {
		return token === '|' || token === '&';
	},

	hasOperator:function () {
		return this.branches[this.branches.length - 1].operator !== undefined;
	},

	isDifferentOperator:function (operator) {
		return operator !== this.getCurrentOperator();
	},

	getCurrentOperator:function () {
		return this.branches[this.branches.length - 1].operator;
	},

	setOperator:function (operator) {
		this.branches[this.branches.length - 1].operator = operator;
	}
});/* ../ludojs/src/data-source/collection-search.js */
/**
 Class created dynamically by dataSource.Collection.
 It is used to search and filter data in a collection.
 @namespace dataSource
 @class CollectionSearch
 @augments Core
 */
ludo.dataSource.CollectionSearch = new Class({
	Extends:ludo.Core,
	dataSource:undefined,
	searchResult:undefined,
	searchIndexCreated:false,
	/**
	 Delay in seconds between call to search and execution of search.
	 A delay is useful when using text fields to search.
	 @config delay
	 @type {Number}
	 @default 0
	 @example
	 	delay:0
	 */
	delay:0,
	searches:undefined,
	searchBranches:undefined,
	searchFn:undefined,
	currentBranch:undefined,
	/**
	 Columns in datasource to index for search
	 @config index
	 @type Array
	 */
	index:undefined,

	searchParser:undefined,

	ludoConfig:function (config) {
		this.parent(config);
        this.setConfigParams(config, ['dataSource','index','delay']);
		this.searchParser = new ludo.dataSource.SearchParser();
		this.clear();
	},

	ludoEvents:function () {
		this.parent();
		if(!this.dataSource.hasRemoteSearch()){
			this.dataSource.addEvent('beforeload', this.clearSearchIndex.bind(this));
			this.dataSource.addEvent('beforeload', this.deleteSearch.bind(this));
			this.dataSource.addEvent('update', this.clearSearchIndex.bind(this));
		}
	},
	/**
	 * execute a text search
	 * @function Search
	 * @param {String} search
	 */
	search:function (search) {
		if (!search && this.searches.length == 0)return;
		this.clear();
		this.where(search);
		this.endBranch();

		var delay = this.getSearchDelay();
		if (delay === 0) {
			this.executeSearch(this.searches[0].txt);
		} else {
			this.executeSearch.delay(delay * 1000, this, this.searches[0].txt);
		}
	},

	executeSearch:function (searchTerm) {
		if (searchTerm == this.searches[0].txt) {
			this.execute();
		}
	},

	/**
	 Clear all search terms and search functions
	 @function clear
	 @chainable
	 @return {dataSource.CollectionSearch} this
	 */
	clear:function () {
		this.searches = [];
		return this;
	},

	/**
	 * Delete search terms/functions and dispose search result. This method will fire a deleteSearch event which
	 * {{#crossLink "dataSource.Collection"}}{{/crossLink}} listens to. It will trigger an update of
	 * views using the {{#crossLink "dataSource.Collection"}}{{/crossLink}} object as dataSource.
	 * @function deleteSearch
	 */
	deleteSearch:function () {
		/**
		 * Search executed without any search terms
		 * @event deleteSearch
		 */
		this.fireEvent('deleteSearch');
		this.searchResult = undefined;
		this.clear();
	},
	/**
	 Start building a new search
	 @function where
	 @param {String|Function} search
	 @return {dataSource.CollectionSearch} this
	 @chainable
	 @example
		 var searcher = ludo.get('idOfDataSearch').getSearcher();
		 searcher.where('Portugal').or('Norway').execute();
	 will find all records where the search index matches 'Portugal' or 'Norway' (case insensitive).
	 By default, the entire record is indexed. Custom indexes can be created by defining
	 index using the "index" constructor attribute.
	 @example
	 	searcher.where(function(record){
	 		return parseInt(record.price) < 100
	 	});
	 is example of a function search. On {{#crossLink "dataSource.Collection/execute"}}{{/crossLink}} this
	 function will be called for each record. It should return true if match is found, false otherwise.
	 The function above will return true for all records where the value of record.price is less than 100.
	 */
	where:function (search) {
		this.clear();
		this.appendSearch(Array.from(arguments));
		return this;
	},

	/**
	 OR search
	 @function or
	 @param {String|Function} search
	 @return {dataSource.CollectionSearch} this
	 @chainable
	 @example
		 var searcher = myDataSource.getSearcher();
		 var populationFn = function(record){
					return record.population > 1000000 ? true: false;
				}
		 searcher.where('Europe').or(populationFn).execute();

	 Finds all records where 'Europe' is in the text or population is greater than 1
	 million.
	 */
	or:function (search) {
		this.appendOperator('|');
		this.appendSearch(Array.from(arguments));
		return this;
	},

	appendSearch:function (args) {
		this.preCondition(args);
		var search = this.getActualArgument(args);
        var searchObject;
		if (typeof search === 'function') {
			searchObject = { fn:search };
		} else {
			searchObject = { txt:search.toLowerCase() };
		}
		this.searches.push(searchObject);
		this.postCondition(args);
	},

	/**
	 AND search
	 @function and
	 @param {String|Function} search
	 @return {dataSource.CollectionSearch} this
	 @chainable
	 @example
		 var searcher = myDataSource.getSearcher();
		 var populationFn = function(record){
					return record.population > 1000000 ? true: false;
				}
		 searcher.where('Europe').and(populationFn).execute();
	 Finds all records where 'Europe' is in the text and population is greater than 1
	 million.
	 */
	and:function (search) {
		this.appendOperator('&');
		this.appendSearch(Array.from(arguments));
		return this;
	},

	preCondition:function (args) {
		if (args.length == 2 && args[0] === '(') {
			this.branch();
		}
	},

	postCondition:function (args) {
		if (args.length == 2 && args[1] === ')') {
			this.endBranch();
		}
	},

	getActualArgument:function (args) {
		if (args.length === 2) {
			if (args[0] == ')' || args[0] == '(') {
				return args[1];
			}
			return args[0];
		}
		return args[0];
	},


	/**
	 * Search for match in one of the items
	 * @function withIn
	 * @param {Array} searches
	 * @chainable
	 * @return {dataSource.CollectionSearch} this
	 */
	withIn:function (searches) {
		for (var i = 0; i < searches.length; i++) {
			this.or(searches[i]);
		}
		return this;
	},

	/**
	 * Start grouping search items together
	 * @function branch
	 * @chainable
	 * @return {dataSource.CollectionSearch} this
	 */
	branch:function () {
		this.appendOperator('(');
		return this;
	},
	/**
	 * Close group of search items.
	 * @function branch
	 * @chainable
	 * @return {endBranch.CollectionSearch} this
	 */
	endBranch:function () {
		this.appendOperator(')');
		return this;
	},

	appendOperator:function (operator) {
		if (operator != '(' && this.searches.length == 0)return;
		if (operator === '|' && this.searches.getLast() === '(')return;
		this.searches.push(operator);
	},
	/**
	 Execute a search based on current search terms
	 @function execute
	 @chainable
	 @return {dataSource.CollectionSearch} this
	 @example
		 // Assumes that ludo.get('collection') returns a {{#crossLink "dataSource.Collection"}}{{/crossLink}} object
		 var searcher = ludo.get('collection').getSearcher();
		 searcher.clear();
		 searcher.where('Oslo').or('Moscow');
		 searcher.execute();
	 */
	execute:function () {
		if (!this.searchIndexCreated) {
			this.createSearchIndex();
		}
		if (!this.hasSearchTokens()) {
			this.deleteSearch();
		} else {
            this.fireEvent('initSearch');
			this.searchResult = [];
			this.compileSearch();
            this.performSearch();
		}
		/**
		 * Search executed
		 * @event search
		 */
		this.fireEvent('search');
		return this;
	},

    performSearch:function(){
        var data = this.getDataFromSource();
        for (var i = 0; i < data.length; i++) {
            if (this.isMatchingSearch(data[i])) {
                this.searchResult.push(data[i]);
            }
        }
    },

	isMatchingSearch:function (record) {
		return this.searchFn.call(this, record);
	},

	compileSearch:function () {
		this.searchFn = this.searchParser.getSearchFn(this.searches);
	},

	/**
	 * Returns true if search terms or search functions exists.
	 * @function hasSearchTokens
	 * @return {Boolean}
	 */
	hasSearchTokens:function () {
		return this.hasContentInFirstSearch() || this.searches.length > 1;
	},

	hasContentInFirstSearch:function () {
		if (this.searches.length === 0)return false;
		var s = this.searches[0];
		return (ludo.util.isArray(s) || s.fn !== undefined || (s.txt !== undefined && s.txt.length > 0));
	},

	/**
	 * Returns true when<br>
	 *     - zero or more records are found in search result<br>
	 * Returns false when<br>
	 *  - search result is undefined because no search has been executed or search has been deleted.
	 * @function hasData
	 * @return {Boolean}
	 */
	hasData:function () {
		return this.searchResult !== undefined;
	},

	getData:function () {
		return this.searchResult;
	},

	getDataFromSource:function () {
		return this.dataSource.getLinearData();
	},

	getSearchDelay:function () {
		return this.delay || 0;
	},

	clearSearchIndex:function () {
		this.searchIndexCreated = false;
	},

	createSearchIndex:function () {
		this.indexBranch(this.getDataFromSource());
		this.searchIndexCreated = true;
	},

    indexBranch:function(data, parents){
		parents = parents || [];
        var keys = this.getSearchIndexKeys();

        var index;
        for (var i = 0; i < data.length; i++) {
            index = [];
            for (var j = 0; j < keys.length; j++) {
                if (data[i][keys[j]] !== undefined) {
                    index.push((data[i][keys[j]] + '').toLowerCase());
                }
            }
            data[i].searchIndex = index.join(' ');

			for(j=0;j<parents.length;j++){
				parents[j].searchIndex = [parents[j].searchIndex, data[i].searchIndex].join(' ');

			}
            if(data[i].children){
                this.indexBranch(data[i].children, parents.concat(data[i]));
            }
        }
    },

	getSearchIndexKeys:function () {
		if (this.index !== undefined) {
			return this.index;
		}
		var reservedKeys = ['children','searchIndex', 'uid'];

		var data = this.getDataFromSource();
		if (data.length > 0) {
			var record = Object.clone(data[0]);
			var ret = [];
			for (var key in record) {
				if (record.hasOwnProperty(key)) {
					if(reservedKeys.indexOf(key) === -1)ret.push(key);
				}
			}
			return ret;
		}
		return ['NA'];
	},

	/**
	 * Returns number of records in search result
	 * @function getCount
	 * @return {Number}
	 */
	getCount:function () {
		return this.searchResult ? this.searchResult.length : 0;
	},

    // TODO fix this method
	searchToString:function () {
		return this.hasData() ? '' : '';
	}
});/* ../ludojs/src/effect/drop-point.js */
/**
 Specification of a drop point node sent to {{#crossLink "effect.DragDrop/addDropTarget"}}{{/crossLink}}.
 You may add your own properties in addition to the ones below.
 @namespace effect
 @class DropPoint
 @constructor
 @param {Object} config
 @example
 	var dd = new ludo.effect.DragDrop();
 	var el = $('<div>');
 	dd.addDropTarget({
 		id:'myDropPoint',
 		el:el,
 		name:'John Doe'
	});
 	var el = $('<div>');
	dd.addDropTarget({
		id:'myDropPoint',
		el:el,
		name:'Jane Doe'
	});
 	dd.addEvent('enterDropTarget', function(node, dd){
 		if(node.name === 'John Doe'){
 			dd.setInvalid(); // Triggers an invalidDropTarget event
 		}
 	});
 */
ludo.effect.DropPoint = new Class({
	/**
	 id of node. This attribute is optional
	 @property id
	 @type {String}
	 @default undefined
	 @optional
	 */
	id:undefined,

	/**
	 * Reference to dragable DOM node
	 * @property el
	 * @default undefined
	 * @type {String|HTMLDivElement}
	 */
	el:undefined,

	 /**
	 Capture regions(north,south, west east) when moving over drop points
	 @config {Boolean|undefined} captureRegions
	 @optional
	 @default false
	 @example
	 	captureRegions:true
	 */
	captureRegions:undefined
});/* ../ludojs/src/effect/drag-drop.js */
/**
 * effect.Drag with support for drop events.
 * @namespace effect
 * @class DragDrop
 * @augments effect.Drag
 */
ludo.effect.DragDrop = new Class({
	Extends:ludo.effect.Drag,
	useShim:false,
	currentDropPoint:undefined,
	onValidDropPoint:undefined,

	/**
	 Capture regions when moving over drop points
	 @config {Boolean|undefined}
	 @optional
	 @default false
	 @example
	 	captureRegions:true
	 */
	captureRegions:false,

	/**
	 * While dragging, always show dragged element this amount of pixels below mouse cursor.
	 * @config mouseYOffset
	 * @type {Number|undefined}
	 * @optional
	 * @default undefined
	 */
	mouseYOffset:undefined,

	ludoConfig:function (config) {
		this.parent(config);
		if (config.captureRegions !== undefined)this.captureRegions = config.captureRegions;

	},

	ludoEvents:function () {
		this.parent();
		this.addEvent('start', this.setStartProperties.bind(this));
		this.addEvent('end', this.drop.bind(this));
	},

	getDropIdByEvent:function (e) {
		var el = $(e.target);
		if (!el.hasClass('ludo-drop')) {
			el = el.getParent('.ludo-drop');
		}
		return el.attr('forId');
	},

	/**
	 * Remove node
	 * @function remove
	 * @param {String} id
	 * @return {Boolean} success
	 */
	remove:function (id) {
		if (this.els[id] !== undefined) {
			var el = document.id(this.els[id].el);
			el.unbind('mouseenter', this.enterDropTarget.bind(this));
			el.unbind('mouseleave', this.leaveDropTarget.bind(this));
			return this.parent(id);
		}
		return false;
	},

	/**
	 * Create new drop point.
	 * @function addDropTarget
	 * @param {ludo.effect.DropPoint} node
	 * @return {ludo.effect.DropPoint} node
	 */
	addDropTarget:function (node) {
		node = this.getValidNode(node);
		node.el.addClass('ludo-drop');
		if(node.el.mouseenter != undefined){
			node.el.mouseenter(this.enterDropTarget.bind(this));
			node.el.mouseleave(this.leaveDropTarget.bind(this));

		}else{
			node.el.on('mouseenter', this.enterDropTarget.bind(this));
			node.el.on('mouseleave', this.leaveDropTarget.bind(this));
		}

		var captureRegions = node.captureRegions !== undefined ? node.captureRegions : this.captureRegions;
		if (captureRegions) {
			node.el.on('mousemove', this.captureRegion.bind(this));
		}

		node = this.els[node.id] = Object.merge(node, {
			el:node.el,
			captureRegions:captureRegions
		});

		return node;
	},

	enterDropTarget:function (e) {
		if (this.isActive()) {
			this.setCurrentDropPoint(e);
			this.onValidDropPoint = true;
			/**
			 Enter drop point event. This event is fired when dragging is active
			 and mouse enters a drop point
			 @event enterDropTarget
			 @param {effect.DraggableNode} node
			 @param {effect.DropPoint} node
			 @param {effect.DragDrop} this
			 @param {HTMLElement} target
			 */
			this.fireEvent('enterDropTarget', this.getDropEventArguments(e));

			if (this.onValidDropPoint) {
				if (this.shouldCaptureRegionsFor(this.currentDropPoint)) {
					this.setMidPoint();
				}
				/**
				 Enters valid drop point.
				 @event validDropTarget
				 @param {effect.DraggableNode} dragged node
				 @param {effect.DropPoint} drop target
				 @param {effect.DragDrop} this
				 @param {HTMLElement} target
				 */
				this.fireEvent('validDropTarget', this.getDropEventArguments(e));
			} else {
				/**
				 Enters invalid drop point.
				 @event invalidDropTarget
				 @param {effect.DraggableNode} dragged node
				 @param {effect.DropPoint} drop target
				 @param {effect.DragDrop} this
				 @param {HTMLElement} target
				 */
				this.fireEvent('invalidDropTarget', this.getDropEventArguments(e));
			}
			return false;
		}
		return undefined;
	},

	setCurrentDropPoint:function (e) {
		this.currentDropPoint = this.getById(this.getDropIdByEvent(e));
	},

	leaveDropTarget:function (e) {
		if (this.isActive() && this.currentDropPoint) {
			this.fireEvent('leaveDropTarget', this.getDropEventArguments(e));
			this.onValidDropPoint = false;
			this.currentDropPoint = undefined;
		}
	},

	getDropEventArguments:function (e) {
		return [this.getDragged(), this.currentDropPoint, this, e.target];
	},

	/**
	 Set drop point invalid. This method is usually used in connection with a listener
	 for the enterDropTarget event
	 @function setInvalid
	 @example
	 	dd.addEvent('enterDropTarget', function(node, dd){
			 if(node.name === 'John Doe'){
				 dd.setInvalid(); // Triggers an invalidDropTarget event
			 }
		 });
	 */
	setInvalid:function () {
		this.onValidDropPoint = false;
	},

	getCurrentDropPoint:function () {
		return this.currentDropPoint;
	},

	drop:function (e) {
		/**
		 drop event caused by mouseup on valid drop point.
		 @event drop
		 @param {effect.DraggableNode} dragged node
		 @param {effect.DropPoint} drop target
		 @param {effect.DragDrop} this
		 @param {HTMLElement} target
		 */
		if (this.onValidDropPoint)this.fireEvent('drop', this.getDropEventArguments(e));
	},

	setStartProperties:function () {
		this.onValidDropPoint = false;
	},

	shouldCaptureRegionsFor:function (node) {
		return this.els[node.id].captureRegions === true;
	},

	getDropPointCoordinates:function () {
		if (this.currentDropPoint) {
			var el = this.currentDropPoint.el;
			var ret = el.position();
			ret.width = el.width();
			ret.height = el.height();
			return ret;
			return this.currentDropPoint.el.getCoordinates();
		}
		return undefined;
	},

	previousRegions:{
		h:undefined,
		v:undefined
	},

	captureRegion:function (e) {
		if (this.isActive() && this.onValidDropPoint && this.shouldCaptureRegionsFor(this.currentDropPoint)) {
			var midPoint = this.midPoint;
			if (e.pageY < midPoint.y && this.previousRegions.v !== 'n') {
				/**
				 Enter north region of a drop point
				 @event north
				 @param {effect.DraggableNode} dragged node
				 @param {effect.DropPoint} drop target
				 @param {effect.DragDrop} this
				 @param {HTMLElement} target
				 */
				this.fireEvent('north', this.getDropEventArguments(e));
				this.previousRegions.v = 'n';
			} else if (e.pageY >= midPoint.y && this.previousRegions.v !== 's') {
				/**
				 Enter south region of a drop point
				 @event south
				 @param {effect.DraggableNode} dragged node
				 @param {effect.DropPoint} drop target
				 @param {effect.DragDrop} this
				 @param {HTMLElement} target
				 */
				this.fireEvent('south', this.getDropEventArguments(e));
				this.previousRegions.v = 's';
			}
			if (e.pageX < midPoint.x && this.previousRegions.h !== 'w') {
				/**
				 Enter west region of a drop point
				 @event west
				 @param {effect.DraggableNode} dragged node
				 @param {effect.DropPoint} drop target
				 @param {effect.DragDrop} this
				 @param {HTMLElement} target
				 */
				this.fireEvent('west', this.getDropEventArguments(e));
				this.previousRegions.h = 'w';
			} else if (e.pageX >= midPoint.x && this.previousRegions.h !== 'e') {
				/**
				 Enter east region of a drop point
				 @event east
				 @param {effect.DraggableNode} dragged node
				 @param {effect.DropPoint} drop target
				 @param {effect.DragDrop} this
				 @param {HTMLElement} target
				 */
				this.fireEvent('east', this.getDropEventArguments(e));
				this.previousRegions.h = 'e';
			}

		}
	},

	midPoint:undefined,
	setMidPoint:function () {
		var coords = this.getDropPointCoordinates();
		this.midPoint = {
			x:coords.left + (coords.width / 2),
			y:coords.top + (coords.height / 2)
		};
		this.previousRegions = {
			h:undefined,
			v:undefined
		};
	}
});/* ../ludojs/src/grid/column-move.js */
/**
 * Class responsible for moving columns using drag and drop.
 * An instance of this class is automatically created by the grid. It is
 * rarely nescessary to create your own instances of this class
 */
ludo.grid.ColumnMove = new Class({
	Extends:ludo.effect.DragDrop,
	gridHeader:undefined,
	columnManager:undefined,

	shimCls:['ludo-grid-movable-shim'],
	insertionMarker:undefined,

	arrowHeight:undefined,

	ludoConfig:function (config) {
		this.parent(config);
        this.setConfigParams(config, ['gridHeader','columnManager']);
	},

	ludoEvents:function(){
		this.parent();
		this.addEvent('createShim', this.setZIndex.bind(this));
	},

	setZIndex:function(shim){
		shim.css('zIndex', 50000);
	},

	getMarker:function () {
		if (this.insertionMarker === undefined) {
            this.insertionMarker = ludo.dom.create({
                cls : 'ludo-grid-movable-insertion-marker',
                css : { display: 'none' },
                renderTo : document.body
            });
            ludo.dom.create({ cls : 'ludo-grid-movable-insertion-marker-bottom', renderTo : this.insertionMarker});
		}
		return this.insertionMarker;
	},

	hideMarker:function(){
		this.getMarker().css('display', 'none');
	},

	showMarkerAt:function(cell, pos){
		var coordinates = cell.offset();
		coordinates.width= cell.outerWidth();
		coordinates.height = cell.outerHeight();

		this.getMarker().css({
			display:'',
			left: (coordinates.left + (pos=='after' ? coordinates.width : 0)),
			top: (coordinates.top - this.getArrowHeight()),
			height: coordinates.height

		});
	},

	setMarkerHeight:function(height){
		this.getMarker().css('height', (height + (this.getArrowHeight() * 2)));
	},

	getArrowHeight:function(){
		if(!this.arrowHeight){
			this.arrowHeight = this.getMarker().find('.ludo-grid-movable-insertion-marker-bottom').first().outerHeight();
		}
		return this.arrowHeight;
	}
});/* ../ludojs/src/scroller.js */
ludo.Scroller = new Class({
    Extends:Events,
    els:{
        applyTo:null,
        el:null,
        elInner:null,
        parent:null
    },

    active:0,
    wheelSize:5,
    type:'horizontal',
    currentSize:0,
    renderTo:undefined,

    initialize:function (config) {
        this.type = config.type || this.type;
        if (config.applyTo) {
            this.setApplyTo(config.applyTo);

        }
        this.renderTo = config.parent ? $(config.parent) : null;
        if (config.mouseWheelSizeCls) {
            this.determineMouseWheelSize(config.mouseWheelSizeCls);
        }
        this.createElements();
        this.createEvents();
    },

    setApplyTo:function (applyTo) {
        if (!ludo.util.isArray(applyTo))applyTo = [applyTo];
        this.els.applyTo = applyTo;
    },

    determineMouseWheelSize:function (cls) {
        var el = $('<div>');
        el.addClass(cls);
        el.css('visibility', 'hidden');
        $(document.body).append(el);
        this.wheelSize = el.height();
        if (!this.wheelSize) {
            this.wheelSize = 25;
        }
        el.remove();
    },

    createElements:function () {
        this.els.el = $('<div>');
        this.els.el.addClass('ludo-scroller');
        this.els.el.addClass('ludo-scroller-' + this.type);
        this.els.el.css({
            'position':'relative',
            'z-index':1000,
            'overflow':'hidden'
        });

		var overflow = 'auto';
        if (this.type == 'horizontal') {
            this.els.el.css({
                'overflow-x':overflow,
                'width':'100%',
                'height':Browser.ie ? '21px' : '17px'
            });
        } else {
            this.els.el.css({
                'overflow-y':overflow,
                'height':'100%',
                'width':Browser.ie ? '21px' : '17px',
                'right':'0px',
                'top':'0px',
                'position':'absolute'
            });
        }



        this.els.el.scroll(this.performScroll.bind(this));

        this.els.elInner = $('<div>');
        this.els.elInner.css('position', 'relative');
        this.els.elInner.html('&nbsp;');

        this.els.el.append(this.els.elInner);
    },

    createEvents:function () {
        this.els.elInner.on('resize', this.toggle.bind(this));
        if (this.type == 'vertical') {
            for (var i = 0; i < this.els.applyTo.length; i++) {
                this.els.applyTo[i].on('mousewheel', this.eventScroll.bind(this));
            }
        }
        $(window).on('resize', this.resize.bind(this));
    },

    resize:function () {
        if (this.type == 'horizontal') {
            this.els.el.css('width', this.renderTo.outerWidth());
        } else {
            var size = this.renderTo.outerHeight();
            if (size == 0) {
                return;
            }
            this.els.el.css('height', size);
        }
        this.toggle();
    },

    getEl:function () {
        return this.els.el;
    },

    setContentSize:function (size) {
        if (this.type == 'horizontal') {
            this.currentSize = size || this.getWidthOfScrollableElements();
            this.els.elInner.css('width', this.currentSize);
        } else {

            this.currentSize = size || this.getHeightOfScrollableElements();

            if (this.currentSize <= 0) {
                var el = this.els.applyTo.getChildren('.ludo-grid-data-column');
                if (el.length) {
                    this.currentSize = el[0].outerHeight();
                }
            }
            this.els.elInner.css('height', this.currentSize);
        }

        if (this.currentSize <= 0) {
            this.setContentSize.delay(1000, this);
        }

        this.resize();
        this.toggle();
    },

    getWidthOfScrollableElements:function () {
        return this.getTotalSize('outerWidth');
    },

    getHeightOfScrollableElements:function () {
        return this.getTotalSize('outerHeight');
    },

    getTotalSize:function (key) {
        var ret = 0;
        for (var i = 0; i < this.els.applyTo.length; i++) {
            ret += this.els.applyTo[i][key]();
        }
        return ret;
    },

    eventScroll:function (e) {
        var s = this.els.el.scrollTop();
        this.els.el.scrollTop(s - e.originalEvent.wheelDelta);
        return false;
    },

    performScroll:function () {

        if (this.type == 'horizontal') {
            this.scrollTo(this.els.el.scrollLeft());
        } else {
            this.scrollTo(this.els.el.scrollTop());
        }
    },

    scrollBy:function (val) {


        var key = this.type === 'horizontal' ? 'scrollLeft' : 'scrollTop';
        this.els.el[key] += val;
        this.scrollTo(this.els.el[key]);
    },

    scrollTo:function (val) {

        var css = this.type === 'horizontal' ? 'left' : 'top';
        for (var i = 0; i < this.els.applyTo.length; i++) {
            this.els.applyTo[i].css(css, (val * -1));
        }
        this.fireEvent('scroll', this);
    },

    getHeight:function () {
        return this.active ? this.els.el.getSize().y : 0;
    },

    getWidth:function () {
        return this.active ? this.els.el.getSize().x : 0;
    },

    toggle:function () {
        this.shouldShowScrollbar() ? this.show() : this.hide();
    },

    shouldShowScrollbar:function () {
        var css = this.type === 'horizontal' ? 'width' : 'height';
        var size = this.getParentEl()[css]();
        return this.currentSize > size && size > 0;
    },

    getParentEl:function () {
        return this.renderTo ? this.renderTo : this.els.el;
    },

    show:function () {
        this.active = true;
        this.els.el.css('display', '');
    },

    hide:function () {
        this.active = false;
        this.scrollTo(0);
        this.els.el.css('display', 'none');
    }
});/* ../ludojs/src/grid/grid-header.js */
/**
 Private class used by grid.Grid to render headers
 @private
 */
ludo.grid.GridHeader = new Class({
	Extends:ludo.Core,
	columnManager:undefined,
	grid:undefined,
	cells:{},
	cellHeight:undefined,
	spacing:{},
	headerMenu:false,

	ludoConfig:function (config) {
		this.parent(config);
        this.setConfigParams(config, ['columnManager','headerMenu','grid']);

		this.measureCellHeight();
		this.createDOM();
	},

	ludoEvents:function () {
		this.parent();
        var c = this.columnManager;
		c.addEvent('resize', this.renderColumns.bind(this));
		c.addEvent('stretch', this.renderColumns.bind(this));
		c.addEvent('movecolumn', this.renderColumns.bind(this));
		c.addEvent('hidecolumn', this.renderColumns.bind(this));
		c.addEvent('showcolumn', this.renderColumns.bind(this));
		this.grid.addEvent('render', this.renderColumns.bind(this));
		this.grid.getDataSource().addEvent('sort', this.updateSortArrow.bind(this));
	},

	createDOM:function () {
		this.el = $('<div>');
		this.el.addClass('ludo-header');
		this.el.addClass('testing');
		this.el.insertBefore(this.grid.getBody().first());
	//	this.el.inject(this.grid.getBody().getFirst(), 'before');

		var countRows = this.columnManager.getCountRows();
		this.el.css('height', this.cellHeight * countRows + ludo.dom.getMBPH(this.el));
		this.renderColumns();
	},

	renderColumns:function () {
		var countRows = this.columnManager.getCountRows();

		for (var i = 0; i < countRows; i++) {
			var columns = this.columnManager.getColumnsInRow(i);
			var left = 0;
			for (var j = 0; j < columns.length; j++) {
				var width = this.columnManager.getWidthOf(columns[j]);
				if (i == this.columnManager.getStartRowOf(columns[j])) {

					var cell = this.getCell(columns[j]);
					cell.css('display', '');
					cell.css('left', left);
					cell.css('top', i * this.cellHeight);
					var height = (this.columnManager.getRowSpanOf(columns[j]) * this.cellHeight) - this.spacing.height;
					var spacing = (j==columns.length-1) ? this.spacing.width - 1 : this.spacing.width;
					cell.css('width', width - spacing);
					cell.css('height', height);
					cell.css('line-height', height + 'px');

					this.resizeCellBackgrounds(columns[j]);

					cell.removeClass('last-header-cell');
					if (j == columns.length - 1) {
						cell.addClass('last-header-cell');
					}
				}
				left += width;
			}
		}
		this.hideHiddenColumns();
	},

	hideHiddenColumns:function () {
		var hiddenColumns = this.columnManager.getHiddenColumns();
		for (var i = 0; i < hiddenColumns.length; i++) {
			if (this.cellExists(hiddenColumns[i])) {
				this.cells[hiddenColumns[i]].css('display', 'none');
			}
		}
	},

	cellExists:function (col) {
		return this.cells[col] !== undefined;
	},

	measureCellHeight:function () {
		if(this.grid.isHidden())return;
		var el = $('<div>');
		el.addClass('ludo-grid-header-cell');
		this.grid.getBody().append(el);
		this.cellHeight = el.height() + ludo.dom.getMH(el);

		this.spacing = {
			width:ludo.dom.getMBPW(el),
			height:ludo.dom.getMBPH(el)
		};
		el.remove();
	},

	menuButtons:{},

	getCell:function (col) {
		if (this.cells[col]) {
			return this.cells[col];
		}
		var el = this.cells[col] = $('<div>');
		el.attr('col', col);
		el.addClass('ludo-grid-header-cell');
		el.addClass('ludo-header-' + this.columnManager.getHeaderAlignmentOf(col));


		var span = $('<span class="ludo-cell-text">' + this.columnManager.getHeadingFor(col) + '</span>');
		el.append(span);



		this.createTopAndBottomBackgrounds(col);
		this.addDOMForDropTargets(el, col);

		if (this.columnManager.isSortable(col)) {
			el.on('click', this.sortByDOM.bind(this));
		}
		el.on('mouseover', this.mouseoverHeader.bind(this));
		el.on('mouseout', this.mouseoutHeader.bind(this));

		if (this.headerMenu) {
			this.menuButtons[col] = new ludo.menu.Button({
				renderTo:el,
				id:this.getMenuButtonId(col),
				menu:this.getMenu(col),
				listeners:{
					beforeShow:this.validateButtonDisplay.bind(this)
				}
			});
		}
		this.el.append(el);

		this.getMovable().add({
			el:el,
			column:col
		});
		return el;
	},

	validateButtonDisplay:function (button) {
		if (this.columnMove && this.columnMove.isActive()) {
			button.cancelShow();
		}
	},
	cellBg:{},

	createTopAndBottomBackgrounds:function (col) {
		var top = $('<div>');
		top.addClass('ludo-grid-header-cell-top');
		this.cells[col].append(top);
		var bottom = $('<div>');
		bottom.addClass('ludo-grid-header-cell-bottom');
		this.cells[col].append(bottom);
		this.cellBg[col] = {
			top:top,
			bottom:bottom
		};
	},

	resizeCellBackgrounds:function (col) {
		var totalHeight = (this.columnManager.getRowSpanOf(col) * this.cellHeight) -  this.spacing.height;
		var height = Math.round(totalHeight) / 2;
		this.cellBg[col].top.css('height', height);
		height = totalHeight - height;
		this.cellBg[col].bottom.css('height', height);
	},

	getMenu:function (col) {
		return {
			singleton:true,
			id:this.getMenuId(),
			type:'menu.Menu',
			direction:'vertical',
			children:this.getColumnMenu(col)
		};
	},

	getColumnMenu:function (forColumn) {
		var ret = [];
		var columnKeys = this.columnManager.getLeafKeys();
		for (var i = 0; i < columnKeys.length; i++) {
			ret.push({
				type:'form.Checkbox',
				disabled:!(this.columnManager.isRemovable(columnKeys[i])),
				checked:this.columnManager.isVisible(columnKeys[i]),
				label:this.columnManager.getHeadingFor(columnKeys[i]),
				action:columnKeys[i],
                height: 25, width: 150,
				listeners:{
					change:this.getColumnToggleFn(columnKeys[i], forColumn)
				}
			});
		}

        ret.push(
            {
                html: ludo.language.get('Sort ascending'),
                listeners:{
                    click:function(){
                        this.sort('ascending');
                    }.bind(this)
                }
            }
        );
        ret.push(
            {
                html: ludo.language.get('Sort descending'),
                listeners:{
                    click:function(){
                        this.sort('descending');
                    }.bind(this)
                }
            }
        );
		return ret;
	},

    sort:function(method){
        this.grid.getDataSource().by(this.currentColumn)[method]().sort();
        ludo.get(this.getMenuButtonId(this.currentColumn)).hideMenu();
    },

	getColumnToggleFn:function (column, forColumn) {
		return function (checked) {
			if (checked) {
				this.columnManager.showColumn(column);
			} else {
				this.columnManager.hideColumn(column);
			}
			ludo.get(this.getMenuButtonId(forColumn)).hideMenu();
		}.bind(this);
	},

	getMenuId:function () {
		return 'header-menu-' + this.getId();
	},

	getMenuButtonId:function (column) {
		return this.getMenuId() + '-' + column;
	},

    currentColumn:undefined,

	mouseoverHeader:function (e) {
		var col = this.getColByDOM(e.target);

		if (!this.grid.colResizeHandler.isActive() && !this.grid.isColumnDragActive() && this.columnManager.isSortable(col)) {

            this.currentColumn = col;
			this.cells[col].addClass('ludo-grid-header-cell-over');
		}
	},

	mouseoutHeader:function (e) {
		if (!this.grid.colResizeHandler.isActive()) {
			var col = this.getColByDOM(e.target);
			if (!col)return;
			this.cells[col].removeClass('ludo-grid-header-cell-over');
		}
	},

	getColByDOM:function (el) {
		el = $(el);
		var ret = el.attr('col');
		if (!ret && ret != '0') {
			ret = el.parent().attr('col');
		}
		return ret;
	},

	getHeight:function () {
		if (this.cachedHeight === undefined) {
			this.cachedHeight = this.columnManager.getCountRows() * this.cellHeight;
			this.cachedHeight += ludo.dom.getMBPH(this.el);
		}
		return this.cachedHeight;
	},

	getEl:function () {
		return this.el;
	},

	sortByDOM:function (e) {
		var col = this.getColByDOM(e.target);
		this.grid.getDataSource().sortBy(col);
	},

	addDOMForDropTargets:function (parent, column) {
		var left = $('<div>');
		left.css({
			position:'absolute',
			'z-index':15,
			left:'0px', top:'0px',
			width:'50%', height:'100%'
		});

		parent.append(left);
		var right = $('<div>');
		right.css({
			position:'absolute',
			'z-index':15,
			right:'0px', top:'0px',
			width:'50%', height:'100%'
		});
		parent.append(right);

		this.getMovable().addDropTarget({
			el:left,
			column:column,
			position:'before'
		});
		this.getMovable().addDropTarget({
			el:right,
			column:column,
			position:'after'
		});
	},

	columnMove:undefined,
	getMovable:function () {
		if (this.columnMove === undefined) {
			this.columnMove = new ludo.grid.ColumnMove({
				useShim:true,
				delay:.5,
				mouseYOffset:15,
				mouseXOffset:15,
				listeners:{
					before:this.validateMove.bind(this),
					start:this.grid.hideResizeHandles.bind(this.grid),
					end:this.grid.showResizeHandles.bind(this.grid),
					enterDropTarget:this.validateDrop.bind(this),
					leaveDropTarget:this.leaveDropTarget.bind(this),
					showShim:this.setColumnTextOnMove.bind(this),
					drop:this.moveColumn.bind(this)
				}
			});
		}
		return this.columnMove;
	},

	setColumnTextOnMove:function (shim, dd) {
		var column = dd.getDragged().column;
		shim.html( this.columnManager.getHeadingFor(column));
		shim.css('line-height', shim.css('height'));
	},

	validateMove:function (dragged, dd) {
		if (!this.columnManager.isMovable(dragged.column)) {
			dd.cancelDrag();
		}
	},
	validateDrop:function (dragged, dropPoint) {
		var cm = this.columnManager;
		if (cm.canBeMovedTo(dragged.column, dropPoint.column, dropPoint.position)) {
			var m = this.getMovable();
			m.showMarkerAt(this.getCell(dropPoint.column), dropPoint.position);
			var height = (cm.getChildDepthOf(dropPoint.column) + cm.getRowSpanOf(dropPoint.column)) * this.cellHeight;
			m.setMarkerHeight(height);
		}
	},

	leaveDropTarget:function () {
		this.getMovable().hideMarker();
	},

	moveColumn:function (dragged, droppedAt) {
		if (droppedAt.position == 'before') {
			this.columnManager.insertColumnBefore(dragged.column, droppedAt.column);
		} else {
			this.columnManager.insertColumnAfter(dragged.column, droppedAt.column);
		}
		this.getMovable().hideMarker();
	},

	clearSortClassNameFromHeaders:function () {
		var keys = this.columnManager.getLeafKeys();
		for (var i = 0; i < keys.length; i++) {
			if (this.cells[keys[i]] !== undefined) {
				var el = this.cells[keys[i]].find('span');
				el.removeClass('ludo-cell-text-sort-asc');
				el.removeClass('ludo-cell-text-sort-desc');
			}
		}
	},

	updateSortArrow:function (sortedBy) {
		this.clearSortClassNameFromHeaders();
		if (this.cells[sortedBy.column]) {
            this.cells[sortedBy.column].find('span').addClass('ludo-cell-text-sort-' + sortedBy.order);
		}
	}
});/* ../ludojs/src/col-resize.js */
ludo.ColResize = new Class({
    Extends:ludo.Core,
    component:undefined,
    resizeHandles:{},
    resizeProperties:{},
    minPos:0,
    maxPos:10000,

    ludoConfig:function (config) {
        this.parent(config);
        this.component = config.component;
        this.createEvents();
    },

    createEvents:function () {
        this.getEventEl().on(ludo.util.getDragMoveEvent(), this.moveColResizeHandle.bind(this));
        this.getEventEl().on(ludo.util.getDragEndEvent(), this.stopColResize.bind(this));
    },

    setPos:function (index, pos) {
        this.resizeHandles[index].css('left', pos);
    },

    hideHandle:function (index) {
        this.resizeHandles[index].css('display', 'none');
    },
    showHandle:function (index) {
        this.resizeHandles[index].css('display', '');
    },

    hideAllHandles:function () {
        for (var key in this.resizeHandles){
            if(this.resizeHandles.hasOwnProperty(key)){
                this.hideHandle(key);
            }
        }
    },
    showAllHandles:function () {
        for (var key in this.resizeHandles){
            if(this.resizeHandles.hasOwnProperty(key)){
                this.showHandle(key);
            }
        }
    },

    getHandle:function (key, isVisible) {

        var el = $('<div>');
        el.addClass('ludo-column-resize-handle');
        el.css({
            'top':0,
            'position':'absolute',
            'height':'100%',
            'cursor':'col-resize',
            'z-index':15000,
            display:isVisible ? '' : 'none'
        });
        el.attr('col-reference', key);
        el.on(ludo.util.getDragStartEvent(), this.startColResize.bind(this));
        if (!ludo.util.isTabletOrMobile()) {
            el.on('mouseenter', this.mouseOverResizeHandle.bind(this));
            el.on('mouseleave', this.mouseOutResizeHandle.bind(this));
        }
        this.resizeHandles[key] = el;
        return el;
    },

    startColResize:function (e) {
        var columnName = $(e.target).attr('col-reference');
        this.fireEvent('startresize', columnName);
        $(e.target).addClass('ludo-resize-handle-active');
        var offset = this.getLeftOffsetOfColResizeHandle();

        var r = this.resizeProperties;
        r.min = this.getMinPos() - offset;
        r.max = this.getMaxPos() - offset;

        r.mouseX = this.resizeProperties.currentX = e.pageX;
        r.elX = parseInt($(e.target).css('left').replace('px', ''));
        r.currentX = this.resizeProperties.elX;

        r.active = true;
        r.el = $(e.target);
        r.index = columnName;

        return false;
    },

    getLeftOffsetOfColResizeHandle:function () {
        if (!this.resizeHandles[0]) {
            return 3;
        }
        if (!this.handleOffset) {
            var offset = Math.ceil(this.resizeHandles[0].getSize().x / 2);
            if (offset > 0) {
                this.handleOffset = offset;
            } else {
                return 3;
            }
        }
        return this.handleOffset;
    },

    moveColResizeHandle:function (e) {

        if (this.resizeProperties.active) {
            var pos = this.resizeProperties.elX - this.resizeProperties.mouseX + e.pageX;
            pos = Math.max(pos, this.resizeProperties.min);
            pos = Math.min(pos, this.resizeProperties.max);

            this.resizeProperties.el.css('left', pos);

            this.resizeProperties.currentX = pos;
            return false;
        }
		return undefined;
    },

    stopColResize:function () {
        if (this.resizeProperties.active) {
            this.resizeProperties.active = false;
            this.resizeProperties.el.removeClass('ludo-resize-handle-active');
            var change = this.resizeProperties.currentX - this.resizeProperties.elX;
            this.fireEvent('resize', [this.resizeProperties.index, change]);
            return false;
        }
		return undefined;
    },

    getMinPos:function () {
        return this.minPos;
    },
    getMaxPos:function () {
        return this.maxPos;
    },

    setMinPos:function (pos) {
        this.minPos = pos;
    },

    setMaxPos:function (pos) {
        this.maxPos = pos;
    },

    mouseOverResizeHandle:function (e) {
        $(e.target).addClass('ludo-grid-resize-handle-over');
    },
    mouseOutResizeHandle:function (e) {
        $(e.target).removeClass('ludo-grid-resize-handle-over');
    },

    isActive:function(){
        return this.resizeProperties.active;
    }
});/* ../ludojs/src/grid/column-manager.js */
/**
 Column manager for grids. Grids will listen to events fired by this component. A column manager is usually created by
 sending a "columnManager" config object to the constructor of a grid.Grid view.
 @namespace grid
 @class ColumnManager
 @augments Core
 @constructor
 @param {Object} config
 @example
    columnManager:{
		columns:{
			'country':{
				heading:'Country',
				removable:false,
				sortable:true,
				movable:true,
				width:200,
				renderer:function (val) {
					return '<span style="color:blue">' + val + '</span>';
				}
			},
			'capital':{
				heading:'Capital',
				sortable:true,
				removable:true,
				movable:true,
				width:150
			},
			population:{
				heading:'Population',
				movable:true,
				removable:true
			}
		}
	}
 Is example of a ColumnManager config object sent to a grid. It defines three columns, "country", "capital" and "population". These names
 corresponds to keys in the data sets. How to configure columns is specified in {{#crossLink "grid.Column"}}{{/crossLink}}
 */
ludo.grid.ColumnManager = new Class({
	Extends:ludo.Core,
	type:'grid.ColumnManager',
	/**
	 * Always fill view, i.e. dynamically increase with of last visible column when
	 * total width of visible columns is less than width of the Grid.
	 * @config fill
	 * @type {Boolean}
	 * @default true
	 */
	fill:true,

	/**
	 * Configuration of columns
	 * @config {Object} columns
	 * @default {}
	 */
	columns:{},

	columnKeys:[],

	statefulProperties:['columns', 'columnKeys'],

	/**
	 * Internal column lookup. Flat version of this.columns
	 * @property {Object} columnLookup
	 * @private
	 */
	columnLookup:{},

	ludoConfig:function (config) {
		this.parent(config);
        this.setConfigParams(config, ['fill','columns']);

		this.createColumnLookup();

		if (config.columnKeys !== undefined && this.hasValidColumnKeys(config.columnKeys)) {
			this.columnKeys = config.columnKeys;
		} else {
			this.columnKeys = this.getLeafKeysFromColumns();
		}
	},

	getLeafKeysFromColumns:function (parent) {
		var ret = [];
		parent = parent || this.columns;
		for (var key in parent) {
			if (parent.hasOwnProperty(key)) {
				ret.push(key);
				if (parent[key].columns !== undefined) {
					var keys = this.getLeafKeysFromColumns(parent[key].columns);
					for (var i = 0; i < keys.length; i++) {
						ret.push(keys[i]);
					}
				}
			}
		}
		return ret;
	},

	createColumnLookup:function (parent, groupName) {
		parent = parent || this.columns;
		for (var key in parent) {
			if (parent.hasOwnProperty(key)) {
				this.columnLookup[key] = parent[key];
				this.columnLookup[key].group = groupName;
				if (parent[key].columns !== undefined) {
					this.createColumnLookup(parent[key].columns, key);
				}
			}
		}
	},

	hasValidColumnKeys:function (keys) {
		for (var i = 0; i < keys.length; i++) {
			if (this.columnLookup[keys[i]] === undefined)return false;
		}
		return true;
	},

	hasLastColumnDynamicWidth:function () {
		return this.fill;
	},

	getColumns:function () {
		return this.columns;
	},

	getColumn:function (key) {
		return this.columnLookup[key];
	},

	getLeafKeys:function () {
		var ret = [];
		for (var i = 0; i < this.columnKeys.length; i++) {
			if (this.columnLookup[this.columnKeys[i]].columns === undefined) {
				ret.push(this.columnKeys[i]);
			}
		}
		return ret;
	},

	/**
	 Returns object of visible columns, example:
	 @function getVisibleColumns
	 @return {Object} visible columns
     @example
        {
            country : {
                heading : 'Country'
            },
            population: {
                heading : 'Population'
            }
        }
	 */
	getVisibleColumns:function () {
		var ret = {};
		var keys = this.getLeafKeys();
		for (var i = 0; i < keys.length; i++) {
			var key = keys[i];
			if (!this.isHidden(key)) {
				ret[key] = this.columnLookup[key];
			}
		}
		return ret;
	},

	getHeadingFor:function (column) {
		return this.getColumnKey(column, 'heading') || '';
	},

	getMinWidthOf:function (column) {
		if (this.isGroup(column)) {
			var children = this.getIdOfChildren(column);
			var ret = 0;
			for (var i = 0; i < children.length; i++) {
				ret += this.getMinWidthOf(children[i]);
			}
			return ret;
		}
		return this.getColumnKey(column, 'minWidth') || 50;
	},

	getMaxWidthOf:function (column) {
		return this.getColumnKey(column, 'maxWidth') || 1000;
	},


	getWidthOf:function (column) {
		var stretchedWidth = this.getStrechedWithOf(column);
		if (stretchedWidth) return stretchedWidth;
		if (this.isGroup(column)) {
			var columns = this.getColumnsInGroup(column);
			var width = 0;
			Object.each(columns, function (value, column) {
				if(!this.isHidden(column))width += this.getWidthOf(column);
			}.bind(this));
			return width;
		} else {
			return this.getColumnKey(column, 'width') || 100;
		}
	},

	isGroup:function (column) {
		return this.columnLookup[column] !== undefined && this.columnLookup[column].columns !== undefined;
	},

	getColumnsInGroup:function (group) {
		return this.columnLookup[group].columns;
	},

	getStrechedWithOf:function (column) {
		return this.getColumnKey(column, 'stretchWidth');
	},

	isRemovable:function (column) {
		return this.getColumnKey(column, 'removable') ? true : false;
	},

	/**
	 * Returns true if column with given id is in a group.
	 * @function isInAGroup
	 * @param {String} column
	 * @return {Boolean} is in a group
	 */
	isInAGroup:function (column) {
		return this.getColumnKey(column, 'group') !== undefined;
	},

	/**
	 * Returns id of parent group
	 * @function getGroupIdOf
	 * @param {String} column
	 * @return {String} group id
	 */
	getGroupIdOf:function (column) {
		return this.getColumnKey(column, 'group');
	},

	/**
	 * Returns parent group object for a column
	 * @function getGroupFor
	 * @param {String} column
	 * @return {grid.Column|undefined} parent
	 */
	getGroupFor:function (column) {
		var id = this.getGroupIdOf(column);
        return id ? this.columnLookup[id] : undefined;
	},

	getChildCount:function (groupId) {
		var group = this.getColumn(groupId);
		if (group.columns !== undefined) {
			return ludo.util.lengthOfObject(group.columns);
		}
		return 0;
	},

	getIdOfChildren:function (groupId) {
		var group = this.getColumn(groupId);
		if (group) {
			return Object.keys(group.columns);
		}
		return 0;
	},

	isInSameGroup:function (columnA, columnB) {
		return this.isInAGroup(columnA) && this.getGroupIdOf(columnA) == this.getGroupIdOf(columnB);
	},

	isSortable:function (column) {
		return this.getColumnKey(column, 'sortable') ? true : false;
	},

	isHidden:function (column) {
		var hidden = this.getColumnKey(column, 'hidden');
		if (hidden)return true;
		var parentGroup;
		if (parentGroup = this.getGroupIdOf(column)) {
			return this.isHidden(parentGroup);
		}
		return hidden;
	},
	isVisible:function (column) {
		return !this.isHidden(column);
	},
	/**
	 * Returns true if column with given id is resizable
	 * @function isResizable
	 * @param {String} column
	 * @return {Boolean}
	 */
	isResizable:function (column) {
		var resizable = this.getColumnKey(column, 'resizable') !== false;
		if (resizable && this.hasLastColumnDynamicWidth() && this.isLastVisibleColumn(column)) {
			resizable = false;
		}
		return resizable;
	},
	isMovable:function (column) {
		var parent = this.getGroupIdOf(column);
		if (parent && this.getChildCount(parent) == 1) {
			return false;
		}
		return this.getColumnKey(column, 'movable') || false;
	},

	hasMovableColumns:function () {
		for (var i = 0; i < this.columnKeys.length; i++) {
			if (this.isMovable(this.columnKeys[i]))return true;
		}
		return false;
	},

	getAlignmentOf:function (column) {
		return this.getColumnKey(column, 'align') || 'left';
	},

	getHeaderAlignmentOf:function(column){
		return this.getColumnKey(column, 'headerAlign') || 'left';
	},

	setLeft:function (column, left) {
		this.columnLookup[column].left = left;
	},
	getLeftPosOf:function (column) {
		return this.getColumnKey(column, 'left') || 0;
	},

	getRendererFor:function (column) {
		return this.getColumnKey(column, 'renderer');
	},

	setWidth:function (column, width) {
		this.columnLookup[column].width = width;
	},

	setStretchedWidth:function (width) {
		this.columnLookup[this.getLastVisible()].stretchWidth = width;
		this.fireEvent('stretch');
	},

	clearStretchedWidths:function () {
		for (var i = 0; i < this.columnKeys.length; i++) {
			this.columnLookup[this.columnKeys[i]].stretchWidth = undefined;
		}

	},

	increaseWithFor:function (column, increaseBy) {
		var width = this.getWidthOf(column);
		this.columnLookup[column].width = width + increaseBy;
		this.fireEvent('resize');
		this.fireEvent('state');
	},

	getColumnKey:function (column, key) {
		if (this.columnLookup[column] !== undefined) {
			return this.columnLookup[column][key];
		}
		return null;
	},

	getTotalWidth:function () {
		var cols = this.getVisibleColumns();
		var ret = 0;
		for (var col in cols) {
			if (cols.hasOwnProperty(col)) {
				ret += this.getWidthOf(col);
			}
		}
		return ret;
	},

	getMinPosOf:function (column) {
		return this.getTotalWidthOfPreviousOf(column) + this.getMinWidthOf(column);
	},

	getMaxPosOf:function (column) {
		return this.getTotalWidthOfPreviousOf(column) + this.getMaxWidthOf(column);
	},

	getTotalWidthOfPreviousOf:function (column) {
		var keys = this.getLeafKeys();
		var ret = 0;
		for (var i = 0; i < keys.length; i++) {
			if (keys[i] == column) {
				return ret;
			}
            if (!this.isHidden(keys[i])) {
                ret += this.getWidthOf(keys[i]);
            }
		}
		return 0;
	},

	/**
	 * Insert a column before given column
	 * @function insertColumnBefore
	 * @param {String} column id
	 * @param {String} before column id
	 */
	insertColumnBefore:function (column, before) {
		this.moveColumn(column, before, 'before');
	},
	/**
	 * Insert a column after given column
	 * @function insertColumnAfter
	 * @param {String} column id
	 * @param {String} after column id
	 */
	insertColumnAfter:function (column, after) {
		this.moveColumn(column, after, 'after');
	},

	moveColumn:function (column, insertAt, beforeOrAfter) {
		var indexAt = this.getInsertionPoint(insertAt, beforeOrAfter);
		var indexThis = this.columnKeys.indexOf(column);

		if (this.isInAGroup(column) && !this.isInSameGroup(column, insertAt)) {
			this.removeFromGroup(column);
		}
		var i,j;
		var indexes = [indexThis];
		if (this.isGroup(column)) {
			var children = this.getIdOfChildren(column);
			for (i = 0; i < children.length; i++) {
				indexes.push(this.columnKeys.indexOf(children[i]));
			}
		}

		if(this.isInAGroup(insertAt)){
			this.insertIntoSameGroupAs(column,insertAt);
		}

		var ret = [];
		for (i = 0; i < this.columnKeys.length; i++) {
			if (i == indexAt && beforeOrAfter == 'before') {
				for (j = 0; j < indexes.length; j++) {
					ret.push(this.columnKeys[indexes[j]]);
				}
			}
			if (indexes.indexOf(i) == -1) {
				ret.push(this.columnKeys[i]);
			}
			if (i == indexAt && beforeOrAfter == 'after') {
				for (j = 0; j < indexes.length; j++) {
					ret.push(this.columnKeys[indexes[j]]);
				}
			}
		}
		this.columnKeys = ret;

		/**
		 * Fired when a column has been moved
		 * @event movecolumn
		 */
		this.fireEvent('movecolumn', [column, this.columnKeys[indexAt], beforeOrAfter]);
		this.fireEvent('state');
	},

	getInsertionPoint:function(insertAtColumn, pos){
		var ret = this.columnKeys.indexOf(insertAtColumn);
		if (pos === 'after' && this.isGroup(insertAtColumn)){
			var columns = Object.keys(this.getColumnsInGroup(insertAtColumn));
			for(var i=0;i<columns.length;i++){
				ret = Math.max(ret, this.columnKeys.indexOf(columns[i]));
			}
		}
		return ret;
	},

	/**
	 * @function insertIntoSameGroupAs
	 * @param {String} column
	 * @param {String} as
	 * @private
	 */
	insertIntoSameGroupAs:function(column, as){
		var group = this.columnLookup[as].group;
		this.columnLookup[column].group = group;
		this.columnLookup[group].columns[column] = this.columnLookup[column];
		this.clearCache();
	},

	isLastVisibleColumn:function (column) {
		var keys = this.getLeafKeys();
		for (var i = keys.length - 1; i >= 0; i--) {
			var key = keys[i];
			if (!this.isHidden([key])) {
				return key === column;
			}
		}
		return false;
	},

	/**
	 * Remove column from a group
	 * @function removeFromGroup
	 * @param {String} column
	 * @return {Boolean} success
	 */
	removeFromGroup:function (column) {
		var group = this.getGroupFor(column);
		if (group) {
			delete group.columns[column];
			this.getColumn(column).group = undefined;
			this.clearCache();
			return true;
		}
		return false;
	},

	hideColumn:function (column) {
		if (this.columnExists(column) && !this.isHidden(column)) {
			this.columnLookup[column].hidden = true;
			/**
			 * Fired when a column is hidden
			 * @event hidecolumn
			 */
			this.fireEvent('hidecolumn', column);

			this.fireEvent('state');
		}
	},

	columnExists:function (column) {
		return this.columnLookup[column] !== undefined;
	},

	hideAllColumns:function () {
		var keys = this.getLeafKeys();
		for (var i = 0; i < keys.length; i++) {
			this.columnLookup[keys[i]].hidden = true;
		}
	},

	showColumn:function (column) {
		if (this.columnExists(column) && this.isHidden([column])) {
			this.columnLookup[column].hidden = false;
			/**
			 * Fired when a column is shown
			 * @event showcolumn
			 */
			this.fireEvent('showcolumn', column);

			this.fireEvent('state');
		}
	},

	getIndexOfLastVisible:function () {
		var keys = this.getLeafKeys();
		for (var i = keys.length - 1; i >= 0; i--) {
			if (!this.isHidden(keys[i])) {
				return i;
			}
		}
		return null;
	},

	getLastVisible:function () {
		return this.getLeafKeys()[this.getIndexOfLastVisible()];
	},

	countHeaderRows:undefined,
	getCountRows:function () {
		if (this.countHeaderRows === undefined) {
			var ret = 0;
			var keys = this.getLeafKeys();
			for (var i = 0; i < keys.length; i++) {
				ret = Math.max(ret, this.getStartRowOf(keys[i]));
			}
			this.countHeaderRows = ret + 1;
		}
		return this.countHeaderRows;
	},

	countParentCache:{},
	getStartRowOf:function (column) {
		if (this.countParentCache[column] === undefined) {
			var ret = 0;
			if (this.columnLookup[column].group !== undefined) {
				var col = this.columnLookup[column].group;
				while (col) {
					ret++;
					col = this.columnLookup[col].group;
				}
			}
			this.countParentCache[column] = ret;
		}
		return this.countParentCache[column];
	},
	clearCache:function(){
		this.countParentCache = {};
		this.columnDepthCache = {};
	},

	/**
	 * Return array of column keys for a header row, 0 is first row
	 * @function getColumnsInRow
	 * @param {Number} rowNumber
	 * @return {Array} columns
	 */
	getColumnsInRow:function (rowNumber) {
		var ret = [];
		for(var i=0;i<this.columnKeys.length;i++){
			if(!this.isHidden(this.columnKeys[i])){
                var col = this.columnKeys[i];
				var startRow = this.getStartRowOf(col);
				if(startRow <= rowNumber && !this.isGroup(col)){
					ret.push(col);
				}else{
					if(startRow == rowNumber){
						ret.push(col);
					}
				}
			}
		}
		return ret;

	},

	getRowSpanOf:function(column){
		var countRows = this.getCountRows();
        return countRows - this.getStartRowOf(column) - (this.isGroup(column) ? this.getChildDepthOf(column) : 0);
	},

	columnDepthCache:{},
	getChildDepthOf:function(column){
		if(this.columnDepthCache[column] === undefined){
			if(this.isGroup(column)){
				var ret = 0;
				var children = this.getIdOfChildren(column);
				for(var i=0;i<children.length;i++){
					ret = Math.max(ret, this.getChildDepthOf(children[i]));
				}
				ret++;
				this.columnDepthCache[column] = ret;
			}else{
				this.columnDepthCache[column] = 0;
			}
		}
		return this.columnDepthCache[column];
	},

	getHiddenColumns:function(){
		var ret = [];
		for(var i=0;i<this.columnKeys.length;i++){
			if(this.isHidden(this.columnKeys[i])){
				ret.push(this.columnKeys[i]);
			}
		}
		return ret;
	},

	canBeMovedTo:function(column, to){
		return column !== to;
	}
});/* ../ludojs/src/grid/row-manager.js */
ludo.grid.RowManager = new Class({
	Extends: ludo.Core,
	type : 'grid.RowManager',

	/**
	 * A function returning css class for current row as string. Current record
	 * will be passed to function
	 * @config renderer
	 * @type {Function}
	 * @default undefined
	 */
	renderer:undefined,

	ludoConfig:function(config){
		this.parent(config);
		if(config.renderer)this.renderer = config.renderer;
	}

});/* ../ludojs/src/grid/grid.js */
/**
 @namespace grid
 @class Grid
 @augments View
 @constructor
 @param {Object} config
 @example
	 children:[
	 ..
	 {
		  id:'myGrid',
		  type:'grid.Grid',
		  stateful:true,
		  resizable:false,

		  columns:{
			  'country':{
				  heading:'Country',
				  removable:false,
				  sortable:true,
				  movable:true,
				  width:200,
				  renderer:function (val) {
					  return '<span style="color:blue">' + val + '</span>';
				  }
			  },
			  'capital':{
				  heading:'Capital',
				  sortable:true,
				  removable:true,
				  movable:true,
				  width:150
			  },
			  population:{
				  heading:'Population',
				  movable:true,
				  removable:true
			  }
		  },
		  dataSource:{
			  url:'data-source/grid.php',
			  id:'myDataSource',
			  paging:{
				  size:12,
				  remotePaging:false,
				  cache:false,
				  cacheTimeout:1000
			  },
			  searchConfig:{
				  index:['capital', 'country']
			  },
			  listeners:{
				  select:function (record) {
					  console.log(record)
				  },
				   count:function(countRecords){
					   ludo.get('gridWindowSearchable').setTitle('Grid - capital and population - Stateful (' + countRecords + ' records)');
				   }
			  }
		  }

	  }
 	...
 	]
 Is example of code used to add a grid as child view of another view. You may also create the grid directly using:

 @example
 	new ludo.grid.Grid({...})
 where {...} can be the same code as above. use the "renderTo" config property to specify where you want the grid to be rendered.
 */
ludo.grid.Grid = new Class({
	Extends:ludo.View,
	type:'Grid',

	hasMenu:true,
	colMovable:null,
	menu:true,

	menuConfig:[

	],

	scrollbar:{

	},
	/**
	 * true to highlight record on click
	 * @config highlightRecord
	 * @type {Boolean}
	 */
	highlightRecord:true,

	uniqueId:'',
	activeRecord:{},

	/**
	 * Show menu when mouse over headers
	 * @config headerMenu
	 * @type {Boolean}
	 * @default true
	 */
	headerMenu:true,

	/**
	 * True to highlight rows while moving mouse over them
	 * @config mouseOverEffect
	 * @type {Boolean}
	 * @default true
	 */
	mouseOverEffect:true,

	columnManager:undefined,

	/**
	 Column config
	 @config {Object} columns
	 @example
	 	columns:{
			 'country':{
				 heading:'Country',
				 sortable:true,
				 movable:true,
				 renderer:function (val) {
					 return '<span style="color:blue">' + val + '</span>';
				 }
			 },
			 'capital':{
				 heading:'Capital',
				 sortable:true,
				 movable:true
			 },
			 population:{
				 heading:'Population',
				 movable:true
			 }
		 }
	 or nested:

	 	columns:{
			 info:{
				 heading:'Country and Capital',
				 headerAlign:'center',
				 columns:{
					 'country':{
						 heading:'Country',
						 removable:false,
						 sortable:true,
						 movable:true,
						 width:200,
						 renderer:function (val) {
							 return '<span style="color:blue">' + val + '</span>';
						 }
					 },
					 'capital':{
						 heading:'Capital',
						 sortable:true,
						 removable:true,
						 movable:true,
						 width:150
					 }
				 }
			 },
			 population:{
				 heading:'Population',
				 movable:true,
				 removable:true
			 }
		 }

	 */
	columns:undefined,

	/**
	 * Row manager config object
	 * @config {grid.RowManager} rowManager
	 * @default undefined
	 */
	rowManager:undefined,

	/**
	 * Text to show in the center of the grid when there's no data in the data to show
	 * @config {String} emptyText
	 * @default "No data"
	 */
	emptyText:'No data',

	defaultDS : 'dataSource.Collection',

	ludoConfig:function (config) {
		this.parent(config);

        this.setConfigParams(config, ['columns','fill','headerMenu','columnManager','rowManager','mouseOverEffect','emptyText','highlightRecord']);

		if(this.columnManager){
			ludo.util.warn('Deprecated columnManager used, use columns instead');
		}

		if(!this.columnManager){
			this.columnManager = {
				columns : this.columns,
				fill: this.fill
			};
		}
		if (this.columnManager) {
			if (!this.columnManager.type)this.columnManager.type = 'grid.ColumnManager';
			this.columnManager.stateful = this.stateful;
			this.columnManager.id = this.columnManager.id || this.id + '_cm';
			this.columnManager = this.createDependency('colManager', this.columnManager);
            this.columnManager.addEvents({
                'hidecolumn' : this.refreshData.bind(this),
                'showcolumn' : this.refreshData.bind(this),
                'movecolumn' : this.onColumnMove.bind(this),
                'resize' : this.resizeColumns.bind(this)
            });
		}

		if (this.rowManager) {
			if (!this.rowManager.type)this.rowManager.type = 'grid.RowManager';
			this.rowManager = this.createDependency('rowManager', this.rowManager);
		}
		if (this.stateful && this.dataSource !== undefined && ludo.util.isObject(this.dataSource)) {
			this.dataSource.id = this.dataSource.id || this.id + '_ds';
			this.dataSource.stateful = this.stateful;
		}

		this.uniqueId = String.uniqueID();

	},

	ludoDOM:function () {
		this.parent();
		this.getEl().addClass('ludo-grid-Grid');

		var b = this.getBody();
		var t = this.els.dataContainerTop = $('<div>');

		t.addClass('ludo-grid-data-container');
		t.css({
			'overflow':ludo.util.isTabletOrMobile() ? 'auto' : 'hidden',
			'position':'relative'
		});

		b.append(t);
		b.css('overflow', 'visible');

		this.els.dataContainer = $('<div>');
		t.append(this.els.dataContainer);

		this.els.dataContainer.css('position', 'relative');
		this.gridHeader = this.createDependency('gridHeader', {
			type:'grid.GridHeader',
			headerMenu: this.headerMenu,
			columnManager:this.columnManager,
			grid:this
		});
		this.createDataColumnElements();
		this.createScrollbars();
		this.createColResizeHandles();
	},

	ludoEvents:function () {
		this.parent();

		if (this.dataSource) {
			if(this.dataSourceObj && this.dataSourceObj.hasData()){
				this.populateData();
			}
            this.getDataSource().addEvents({
                'change' : this.populateData.bind(this),
                'select' : this.setSelectedRecord.bind(this),
                'deselect' : this.deselectDOMForRecord.bind(this),
                'update' : this.showUpdatedRecord.bind(this),
                'delete' : this.removeDOMForRecord.bind(this)
            });
            this.getDataSource().addEvent('select', this.selectDOMForRecord.bind(this));
		}
		this.getBody().on('selectstart', ludo.util.cancelEvent);
		this.getBody().on('click', this.cellClick.bind(this));
		this.getBody().on('dblclick', this.cellDoubleClick.bind(this));


		if (this.mouseOverEffect) {
			this.els.dataContainer.on('mouseleave', this.mouseLeavesGrid.bind(this));
		}
	},

	ludoRendered:function () {
		this.parent();
		this.ifStretchHideLastResizeHandles();

		if (this.highlightRecord) {
			this.els.dataContainer.css('cursor', 'pointer');
		}




		this.positionVerticalScrollbar.delay(100, this);

		if (this.getParent()) {
			this.getParent().getBody().css({
				'padding':0
			});
			ludo.dom.clearCache();
			this.getParent().resize.delay(100, this.getParent());
		}
	},

	currentOverRecord:undefined,
	mouseoverDisabled:false,

	enterCell:function (el) {
		if (this.mouseoverDisabled)return;
		var record = this.getRecordByDOM(el);
		if (record) {
			if (this.currentOverRecord) {
				this.deselectDOMForRecord(this.currentOverRecord, 'ludo-grid-record-over');
			}
			this.currentOverRecord = record;
			this.selectDOMForRecord(record, 'ludo-grid-record-over');
		}
	},

	mouseLeavesGrid:function () {
		if (this.currentOverRecord) {
			this.deselectDOMForRecord(this.currentOverRecord, 'ludo-grid-record-over');
			this.currentOverRecord = undefined;
		}
	},

	cellClick:function (e) {
		var record = this.getRecordByDOM(e.target);
		if (record) {
			this.getDataSource().selectRecord(record);
			/**
			 * Click on record
			 * @event click
			 * @param {Object} Record clicked record
			 * @param {String} column
			 */
			this.fireEvent('click', [record, this.getColumnByDom(e.target)]);
		}
	},

	getColumnByDom:function(el){
		el = $(el);
		if (!el.hasClass('ludo-grid-data-cell')) {
			el = el.closest('.ludo-grid-data-cell');
		}
		if(el){
			return el.attr('col');
		}
		return undefined;
	},

	setSelectedRecord:function (record) {
        // TODO should use dataSource.Record object instead of plain object
		this.fireEvent('selectrecord', record);
		this.highlightActiveRecord();
	},

	highlightActiveRecord:function () {
		if (this.highlightRecord) {
			var selectedRecord = this.getDataSource().getSelectedRecord();
			if (selectedRecord && selectedRecord.uid) {
				this.selectDOMForRecord(selectedRecord, 'ludo-active-record');
			}
		}
	},

	selectDOMForRecord:function (record, cls) {
		cls = cls || 'ludo-active-record';
		var cells = this.getDOMCellsForRecord(record);
		for (var key in cells) {
			if (cells.hasOwnProperty(key)) {
				cells[key].addClass(cls);
			}
		}
	},

	deselectDOMForRecord:function (record, cls) {
		cls = cls || 'ludo-active-record';
		var cells = this.getDOMCellsForRecord(record);
		for (var key in cells) {
			if (cells.hasOwnProperty(key)) {
				cells[key].removeClass(cls);
			}
		}
	},


	showUpdatedRecord:function (record) {
		var cells = this.getDOMCellsForRecord(record);
		var content;
		var renderer;

		for (var key in cells) {
			if (cells.hasOwnProperty(key)) {
				renderer = this.columnManager.getRendererFor(key);
				if (renderer) {
					content = renderer(record[key], record);
				} else {
					content = record[key];
				}
				cells[key].getElement('span').html( content);
			}
		}
	},

	removeDOMForRecord:function (record) {
		var cells = this.getDOMCellsForRecord(record);
		for (var key in cells) {
			if (cells.hasOwnProperty(key)) {
				cells[key].dispose();
			}
		}
	},

	getDOMCellsForRecord:function (record) {
		var ret = {};
		var div, divId;

		var keys = this.columnManager.getLeafKeys();
		for (var i = 0; i < keys.length; i++) {
			var col = this.getBody().find('#ludo-grid-column-' + keys[i] + '-' + this.uniqueId);
			divId = 'cell-' + keys[i] + '-' + record.uid + '-' + this.uniqueId;
			div = col.find('#' + divId);
			if (div) {
				ret[keys[i]] = div;
			}
		}
		return ret;
	},
	/**
	 Select a record.
	 @function selectRecord
	 @param {Object} record
	 @example
	 	grid.selectRecord({ id: 100 } );
	 */
	selectRecord:function (record) {
		if (ludo.util.isString(record)) {
			record = { id:record };
		}
		this.getDataSource().selectRecord(record);
	},

	cellDoubleClick:function (e) {
		var record = this.getRecordByDOM(e.target);
		if (record) {
			this.getDataSource().selectRecord(record);
			/**
			 * Double click on record
			 * @event dblclick
			 * @param {Object} Record clicked record
			 * @param {String} column
			 */
			this.fireEvent('dblclick', [record, this.getColumnByDom(e.target)]);
		}
	},

	getRecordByDOM:function (el) {
		el = $(el);
		if (!el.hasClass('ludo-grid-data-cell')) {
			el = el.parent('.ludo-grid-data-cell');
		}
		if (el && el.hasClass('ludo-grid-data-cell')) {
			var uid = el.attr('uid');
			return this.getDataSource().findRecord({uid:uid});
		}
		return undefined;
	},

	isColumnDragActive:function () {
		return this.colMovable && this.colMovable.isActive();
	},

	hideResizeHandles:function () {
		this.colResizeHandler.hideAllHandles();
	},

	showResizeHandles:function () {
		this.colResizeHandler.showAllHandles();
		this.ifStretchHideLastResizeHandles();
	},

	resizeChildren:function () {
		this.parent();
		if (this.colResizeHandler && this.columnManager.hasLastColumnDynamicWidth()) {
			this.resizeColumns();
		}
	},

	onColumnMove:function (source, target, pos) {

		if (pos == 'before') {
			this.els.dataColumns[source].insertBefore(this.els.dataColumns[target]);
		} else {
			this.els.dataColumns[source].insertAfter(this.els.dataColumns[target]);
		}
		this.cssColumns();
		this.resizeColumns();

	},

	cssColumns:function () {
		var keys = Object.keys(this.els.dataColumns);
		for (var i = 0; i < keys.length; i++) {
			var c = this.els.dataColumns[keys[i]];
			c.removeClass('ludo-grid-data-last-column');
			c.removeClass('ludo-grid-data-last-column-left');
			c.removeClass('ludo-grid-data-column-left');
			c.removeClass('ludo-grid-data-last-column-center');
			c.removeClass('ludo-grid-data-column-center');
			c.removeClass('ludo-grid-data-last-column-right');
			c.removeClass('ludo-grid-data-column-right');
			ludo.dom.addClass(c, this.getColumnCssClass(keys[i]));
		}
	},

	refreshData:function () {
		if (!this.isRendered)return;
		this.createDataColumnElements();
		this.resizeColumns();
		this.populateData();
		this.showResizeHandles();
	},

	insertJSON:function () {

	},

	addRecord:function (record) {
		this.getDataSource().addRecord(record);
	},

	resizeDOM:function () {
		this.resizeColumns();
		var height = this.getHeight() - ludo.dom.getMBPH(this.els.container) - ludo.dom.getMBPH(this.els.body);
		height -= this.scrollbar.horizontal.getHeight();
		if (height < 0) {
			return;
		}
		this.els.body.css('height', height);
		this.cachedInnerHeight = height;


		var contentHeight = this.getBody().height();

		if (contentHeight == 0) {
			this.resizeDOM.delay(100, this);
			return;
		}
		this.els.dataContainerTop.css('height', contentHeight - this.gridHeader.getHeight());

		this.scrollbar.vertical.resize();
		this.scrollbar.horizontal.resize();
	},

	createScrollbars:function () {
		this.scrollbar.horizontal = this.createDependency('scrollHorizontal', new ludo.Scroller({
			type:'horizontal',
			applyTo:this.getBody(),
			parent:this.getBody()
		}));
		this.scrollbar.horizontal.getEl().insertBefore(this.getBody());

		this.scrollbar.vertical = this.createDependency('scrollVertical', new ludo.Scroller({
			type:'vertical',
			applyTo:this.els.dataContainer,
			parent:this.els.dataContainerTop,
			mouseWheelSizeCls:'ludo-grid-data-cell'
		}));
		this.getEl().append(this.scrollbar.vertical.getEl());
		this.positionVerticalScrollbar();
	},

	positionVerticalScrollbar:function () {
		var top = this.gridHeader.getHeight();
		if (top == 0) {
			this.positionVerticalScrollbar.delay(100, this);
			return;
		}
		this.scrollbar.vertical.getEl().css('top', top);
	},

	sortBy:function (key) {
		this.getDataSource().sortBy(key);
	},

	createColResizeHandles:function () {
		this.colResizeHandler = new ludo.ColResize({
			component:this,
			listeners:{
				startresize:this.setResizePos.bind(this),
				resize:this.resizeColumn.bind(this)
			}
		});
		var keys = this.columnManager.getLeafKeys();
		for (var i = 0; i < keys.length; i++) {
			var el = this.colResizeHandler.getHandle(keys[i], this.columnManager.isResizable(keys[i]));
			this.getBody().append(el);
			el.addClass('ludo-grid-resize-handle');
		}
	},

	setResizePos:function (column) {
		this.colResizeHandler.setMinPos(this.columnManager.getMinPosOf(column));
		this.colResizeHandler.setMaxPos(this.columnManager.getMaxPosOf(column));
		this.mouseoverDisabled = true;
		this.mouseLeavesGrid();
	},

	mouseOverResizeHandle:function (e) {
		$(e.target).addClass('ludo-grid-resize-handle-over');
	},
	mouseOutResizeHandle:function (e) {
		$(e.target).removeClass('ludo-grid-resize-handle-over');
	},

	resizeColumns:function () {
		this.mouseoverDisabled = false;
		var leftPos = 0;

		this.stretchLastColumn();
		var columns = this.columnManager.getLeafKeys();

		for (var i = 0; i < columns.length; i++) {
			if (this.columnManager.isHidden(columns[i])) {
				this.colResizeHandler.hideHandle(columns[i]);
			} else {
				var width = this.columnManager.getWidthOf(columns[i]);
                var bw = ludo.dom.getBW(this.els.dataColumns[columns[i]]) - (i===columns.length-1) ? 1 : 0;
                this.els.dataColumns[columns[i]].css('left', leftPos);
                this.els.dataColumns[columns[i]].css('width', (width - ludo.dom.getPW(this.els.dataColumns[columns[i]]) - bw));

				this.columnManager.setLeft(columns[i], leftPos);

				leftPos += width;

				this.colResizeHandler.setPos(columns[i], leftPos);
				if (this.columnManager.isResizable(columns[i])) {
					this.colResizeHandler.showHandle(columns[i]);
				} else {
					this.colResizeHandler.hideHandle(columns[i]);
				}
			}
		}

		var totalWidth = this.columnManager.getTotalWidth();
		this.els.dataContainerTop.css('width', totalWidth);
		this.scrollbar.horizontal.setContentSize(totalWidth);

	},

	stretchLastColumn:function () {
		if (this.columnManager.hasLastColumnDynamicWidth()) {

			this.columnManager.clearStretchedWidths();

			var totalWidth = this.columnManager.getTotalWidth();
			var viewSize = this.getBody().width() - ludo.dom.getPW(this.getBody()) - ludo.dom.getBW(this.getBody());
			var restSize = viewSize - totalWidth;
			if (restSize <= 0) {
				return;
			}
			var width = this.columnManager.getWidthOf(this.columnManager.getLastVisible()) + restSize;
			this.columnManager.setStretchedWidth(width)
		}
	},

	populateData:function () {

		this.fireEvent('state');
		this.currentOverRecord = undefined;
		this.currentData = this.getDataSource().getData();

		if(this.emptyText){
			this.emptyTextEl().css('display', this.currentData.length > 0 ? 'none' : '');
		}

		if (Browser['ie']) {
			this.populateDataIE();
			return;
		}
		var contentHtml = [];
		var keys = this.columnManager.getLeafKeys();
		for (var i = 0; i < keys.length; i++) {
			var columnId = 'ludo-grid-column-' + keys[i] + '-' + this.uniqueId;
			if (this.columnManager.isHidden(keys[i])) {
				contentHtml.push('<div id="' + columnId + '" class="ludo-grid-data-column" style="display:none"></div>');
			} else {
				contentHtml.push('<div id="' + columnId + '" col="' + keys[i] + '" class="ludo-grid-data-column ludo-grid-data-column-' + i + ' ' + this.getColumnCssClass(keys[i]) + '">' + this.getHtmlTextForColumn(keys[i]) + '</div>');
			}
		}

		this.els.dataContainer.html(contentHtml.join(''));

		var columns = this.els.dataContainer.find('.ludo-grid-data-column');
		this.els.dataColumns = {};
		var count;
		for (i = 0, count = columns.length; i < count; i++) {

			this.els.dataColumns[$(columns[i]).attr('col')] = $(columns[i]);
		}

		this.fireEvent('renderdata', [this, this]);
		this.resizeColumns();
		this.resizeVerticalScrollbar();
		this.highlightActiveRecord();
	},


	emptyTextEl:function(){
		if(this.els.emptyText === undefined){
			this.els.emptyText = $('<div class="ludo-grid-empty-text">' + this.emptyText + '</div>');
			this.getEl().append(this.els.emptyText);

		}
		return this.els.emptyText;
	},

	getColumnCssClass:function (col) {
		var ret;
		if (this.columnManager.isLastVisibleColumn(col)) {
			ret = 'ludo-grid-data-last-column ludo-grid-data-last-column-';
		} else {
			ret = 'ludo-grid-data-column-';
		}
		ret += this.columnManager.getAlignmentOf(col);
		return ret;
	},

	populateDataIE:function () {
		this.els.dataContainer.html( '');
		this.createDataColumnElements();
		this.resizeColumns();
		var keys = this.columnManager.getLeafKeys();

		for (var i = 0; i < keys.length; i++) {
			if (this.columnManager.isHidden(keys[i])) {
				this.els.dataColumns[keys[i]].css('display', 'none');
			} else {
				this.els.dataColumns[keys[i]].css('display', '');
				this.els.dataColumns[keys[i]].html(this.getHtmlTextForColumn(keys[i]));
			}
		}
		this.resizeVerticalScrollbar();
		this.highlightActiveRecord();
	},

	resizeVerticalScrollbar:function () {
		var column = this.els.dataColumns[this.columnManager.getLastVisible()];
		if (!column) {
			return;
		}
		var height = column.outerHeight();

		if (height === 0) {
			this.resizeVerticalScrollbar.delay(300, this);
		} else {
			this.els.dataContainer.css('height', height);
			this.scrollbar.vertical.setContentSize();
		}
	},

	createDataColumnElements:function () {
		this.els.dataColumns = {};
		var keys = this.columnManager.getLeafKeys();
		for (var i = 0; i < keys.length; i++) {
			var el = $('<div>');
			this.els.dataContainer.append(el);
			el.addClass('ludo-grid-data-column');
			
			el.attr('col', keys[i]);
			el.addClass(this.getColumnCssClass(i));
			el.id = 'ludo-grid-column-' + keys[i] + '-' + this.uniqueId;
			this.els.dataColumns[keys[i]] = el;
		}
	},

	getHtmlTextForColumn:function (col) {
		var ret = [];
		var rowClasses = ['ludo-grid-data-odd-row', 'ludo-grid-data-even-row'];
		var content;
		var data = this.currentData;
		if (!data)return '';

		var renderer = this.columnManager.getRendererFor(col);

		var rowRenderer = this.rowManager ? this.rowManager.renderer : undefined;
		var rowCls = '';
		for (var i = 0, count = data.length; i < count; i++) {
			content = data[i][col];
			if (renderer) {
				content = renderer(content, data[i]);
			}
			var id = ['cell-' , col , '-' , data[i].uid , '-' , this.uniqueId].join('');
			var over = this.mouseOverEffect ? ' onmouseover="ludo.get(\'' + this.id + '\').enterCell(this)"' : '';
			if (rowRenderer) {
				rowCls = rowRenderer(data[i]);
				if (rowCls)rowCls = ' ' + rowCls;
			}
			ret.push('<div id="' + id + '" ' + over + ' col="' + col + '" class="ludo-grid-data-cell ' + (rowClasses[i % 2]) + rowCls + '" uid="' + data[i].uid + '"><span class="ludo-grid-data-cell-text">' + content + '</span></div>');
		}

		return ret.join('');
	},

	resizeColumn:function (col, resizedBy) {
		this.columnManager.increaseWithFor(col, resizedBy);
	},

	ifStretchHideLastResizeHandles:function () {
		if (this.columnManager.hasLastColumnDynamicWidth()) {
			this.colResizeHandler.hideHandle(this.columnManager.getLastVisible());
		}
	},

	scrollBy:function (x, y) {
		if (y) {
			this.scrollbar.vertical.scrollBy(y);
		}
		if (x) {
			this.scrollbar.horizontal.scrollBy(x);
		}
	},

	getSelectedRecord:function () {
		return this.getDataSource().getSelectedRecord();
	},

	getColumnManager:function(){
		return this.columnManager;
	}
});/* ../ludojs/src/form/button.js */
/**
 * Button component
 * The button class extends ludo.form.Element
 * @namespace ludo.form
 * @class ludo.form.Button
 * @param {Object} config
 * @param {Boolean} config.submittable Default: false. When false, the JSON from parentView.getForm().values() will not not include the button.
 * @param {Boolean} config.disabled Default: false. True to initially disable the button
 * @param {Boolean} config.toggle When true, the button will remain in it's pressed until a new press on button occurs.
 * @param {String|Object} config.toggleGroup Used for toggling between buttons. Example: { type:'form.Button', toggle:true, toggleGroup:'myGroup',value:'1' }, 
 * { type:'form.Button', toggle:true, toggleGroup:'myGroup',value:'2' }. Here, two buttons are assigned to the same toggleGroup 'myGroup'. When one button is pressed,
 * the other button will be unpressed.
 */
ludo.form.Button = new Class({
    Extends:ludo.form.Element,
    type:'form.Button',
    defaultSubmit:false,
    inputType:'submit',
    cssSignature:'ludo-form-button',
    name:'',
    /**
     * Text of button
     * @attribute {String} value
     */
    value:'',
    els:{
        el:null,
        txt:null
    },
    component:null,

    menu:undefined,
    submittable:false,

    /**
     * Toggle button
     * @attribute {Boolean} toggle
     * @memberof ludo.form.Button.prototype
     * @default false
     */
    toggle:false,

    /**
     Assign button to a toggleGroup
     @memberof ludo.form.Button.prototype
     @attribute {Object} toggleGroup
     @default undefined
	 @example
		 var buttonLeft = new ludo.form.Button({
		 	value : 'left',
		 	toggle:true,
		 	toggleGroup:'alignment'
		 });

		 var buttonCenter = new ludo.form.Button({
		 	value : 'center',
		 	toggle:true,
		 	toggleGroup:'alignment'
		 });

	 which creates a singleton ludo.form.ToggleGroup instance and
	 assign each button to it.

	 When using a toggle group, only one button can be turned on. The toggle
	 group will automatically turn off the other button.

	 You can create your own ludo.form.ToggleGroup by extending
	 ludo.form.ToggleGroup and set the toggleGroup property to an
	 object:
	 @example
		 var buttonLeft = new ludo.form.Button({
		 	value: 'left',
		 	toggle:true,
		 	toggleGroup:{
		 		type : 'ludo.myapp.form.MyToggleGroup'
		 	}
		 });
     */

    toggleGroup:undefined,

    /**
     * Disable button when form of parent component is invalid
     * @memberof ludo.form.Button.prototype
     * @attribute {Boolean} disableOnInvalid
     * @default false
     */
    disableOnInvalid:false,

    /**
     * True to initially disable button
     * @attribute {Boolean} disabled
     * @default false
     */
    disabled:false,
    /**
     * Is this button by default selected
     * When parent component is displayed, it will call select() method for first selected button. If no buttons
     * have config param selected set to true, it will select first
     * @memberof ludo.form.Button.prototype
     * @attribute {Boolean} selected
     * @default false
     */
    selected:false,

    overflow:'hidden',

    /**
     * Path to button icon
     * @attribute {String} icon
     * @memberof ludo.form.Button.prototype
     * @default undefined
     */
    icon:undefined,

    active:false,

	/**
	 * Size,i.e height of button. Possible values 's', 'm' and 'l' (small,medium, large)
     * @memberof ludo.form.Button.prototype
	 * @config {String} size
	 * @default 'm'
	 */
	size : 'm',

	iconWidths:{
		's' : 15,
		'm' : 25,
        'l' : 34,
		'xl' : 44
	},

	heights:{
		's' : 15,
		'm' : 25,
        'l' : 35,
		'xl' : 45
	},

    ludoConfig:function (config) {
		this.parent(config);

        var val = config.value || this.value;
        var len = val ? val.length : 5;
        this.layout.width = this.layout.width || Math.max(len * 10, 80);


        this.setConfigParams(config, ['size','menu','icon','toggle','disableOnInvalid','defaultSubmit','disabled','selected']);

        if (config.toggleGroup !== undefined) {
            if (ludo.util.type(config.toggleGroup) === 'string') {
                config.toggleGroup = {
                    type:'form.ToggleGroup',
                    id:'toggleGroup-' + config.toggleGroup
                };
            }
            config.toggleGroup.singleton = true;
            this.toggleGroup = ludo._new(config.toggleGroup);
            this.toggleGroup.addButton(this);
        }
    },


    ludoDOM:function () {
        this.parent();

        this.getEl().css('display', this.isHidden() ? 'none' : 'block');

		this.getEl().addClass('ludo-form-button-' + this.size);

        this.addLeftEdge();
        this.addRightEdge();

        this.addLabel();

        if (this.icon) {
            this.addIcon();
        }

        var b = this.getBody();

        b.css('padding-left', 0);
        this.getEl().on('selectstart', ludo.util.cancelEvent);
    },

    ludoEvents:function () {
        this.parent();
        var el = this.getBody();

        el.on('click', this.click.bind(this));
        el.mouseenter(this.mouseOver.bind(this));
        el.mouseleave(this.mouseOut.bind(this));
        el.on('mousedown', this.mouseDown.bind(this));

		// TODO need to bound in order to remove event later. Make this easier and more intuitive
		this.mouseUpBound = this.mouseUp.bind(this);
        $(document.body).on('mouseup', this.mouseUpBound);
        if (this.defaultSubmit) {
			this.keyPressBound = this.keyPress.bind(this);
            $(window).addEvent('keypress', this.keyPressBound);
        }
    },

    ludoRendered:function () {
        this.parent();
        if (this.disabled) {
            this.disable();
        }
        if (this.toggle && this.active) {
            this.getBody().addClass('ludo-form-button-pressed');
        }

        this.component = this.getParentComponent();
        if(this.component && this.disableOnInvalid){
            var m = this.component.getForm();
            m.addEvent('valid', this.enable.bind(this));
            m.addEvent('invalid', this.disable.bind(this));
            if(!m.isValid())this.disable();
        }
    },

	dispose:function(){
		this.parent();
		$(document.body).off('mouseup', this.mouseUpBound);
		if (this.defaultSubmit) document.id(window).removeEvent('keypress', this.keyPressBound);
	},

    addLabel:function () {
        var txt = this.els.txt = $('<div>');
        txt.addClass('ludo-form-button-value');
        txt.css({
            'width':'100%',
			'height' : this.heights[this.size] - 2,
            'position':'absolute',
            'left':this.icon ? this.iconWidths[this.size] + 'px' : '0px',
            'text-align':this.icon ? 'left' : 'center',
            'z-index':7
        });
        txt.html(this.value);
        this.getBody().append(txt);
    },

    addIcon:function () {
        var el = this.els.icon = $('<div>');
        el.css({
            position:'absolute',
            width:this.iconWidths[this.size],
            'z-index':8,
            left:0,
            top:0,
            height:'100%',
            'background-image':'url(' + this.icon + ')',
            'background-repeat':'no-repeat',
            'background-position':'center center'
        });
        el.insertBefore(this.els.txt);

    },

    setIcon:function(src){
        if(!this.els.icon){
            this.addIcon();
        }
        this.icon = src;
        this.els.icon.css('background-image', 'url(' + src + ')');
    },

    addLeftEdge:function () {
        var bg = this.els.buttonLeftludo = $('<div>');
        bg.addClass('ludo-form-button-bg-left');
        bg.addClass('ludo-form-button-' + this.size +'-bg-left');
        bg.css({
            position:'absolute',
            'left':0,
            'z-index':5
        });
        this.getBody().append(bg);
    },

    addRightEdge:function () {
        var bg = $('<div>');
        bg.addClass('ludo-form-button-bg-right');
        bg.addClass('ludo-form-button-' + this.size + '-bg-right');
        bg.css({
            position:'absolute',
            'right':0,
            'z-index':6
        });
        this.getBody().append(bg);
    },

    disable:function () {
        this.disabled = true;
        if (this.els.body) {
            this.els.body.addClass('ludo-form-button-disabled');
            this.els.body.removeClass('ludo-form-button-over');
            this.els.body.removeClass('ludo-form-button-down');
        }
    },

    enable:function () {
        this.disabled = false;
        if (this.els.body) {
            this.els.body.removeClass('ludo-form-button-disabled');
        }
    },

    isDisabled:function () {
        return this.disabled;
    },

    setValue:function (value) {
        console.warn("Use of deprecated setValue");
        console.trace();
        this.value = value;
        this.els.txt.html( value);
    },

    val:function (value) {
        if(arguments.length != 0){
            this.value = value;
            this.els.txt.html( value);
        }else{
            return this.value;
        }
    },
    getValue:function () {
        console.warn("Use of deprecated button.getValue");
        console.trace();
        return this.value;
    },

    mouseOver:function () {

        if (!this.isDisabled()) {
            this.getBody().addClass('ludo-form-button-over');
            this.fireEvent('mouseover', this);
        }
    },
    mouseOut:function () {
        if (!this.isDisabled()) {
            this.getBody().removeClass('ludo-form-button-over');
            this.fireEvent('mouseout', this);
        }

    },
	isDown:false,
    mouseDown:function () {
        if (!this.isDisabled()) {
			this.isDown = true;
            this.getBody().addClass('ludo-form-button-down');
            this.fireEvent('mousedown', this);
        }
    },
    mouseUp:function () {
        if (this.isDown && !this.isDisabled()) {
            this.getBody().removeClass('ludo-form-button-down');
            this.fireEvent('mouseup', this);
        }
    },

    clickAfterDelay:function () {
        this.click.delay(10, this);
    },
    /**
     * Trigger click on button
     * @function click
     * @return {undefined|Boolean}
     */
    click:function () {
        this.focus();
        if (!this.isDisabled()) {
            this.getEl().focus();
            /**
             * Click on button event
             * @event click
             * @param {String} value, i.e. label of button
             * @param Component this
             */
            this.fireEvent('click', [this._get(), this]);

            if (this.toggle) {
                if (!this.active) {
                    this.turnOn();
                } else {
                    this.turnOff();
                }
            }
			return false;
        }
    },
    getName:function () {
        return this.name;
    },
    defaultBeforeClickEvent:function () {
        return true;
    },

    isButton:function () {
        return true
    },
    resizeDOM:function () {
        // TODO refactor - buttons too tall in relative layout
        this.getBody().css('height', this.heights[this.size]);
        /* No DOM resize for buttons */
    },

    validate:function () {
        /* Don't do anything for buttons */
    },

    getParentComponent:function () {
        var parent = this.getParent();
        if (parent && parent.type.indexOf('ButtonBar') >= 0) {
            return parent.getView();
        }
        return parent;
    },

    select:function () {
        this.getBody().addClass('ludo-form-button-selected');
    },

    deSelect:function () {
        this.getBody().removeClass('ludo-form-button-selected');
    },

    turnOn:function () {
        this.active = true;
        /**
         * Turn toggle button on
         * @event on
         * @param {String} value, i.e. label of button
         * @param Component this
         */
        this.fireEvent('on', [this._get(), this]);
        this.getBody().addClass('ludo-form-button-pressed');
    },

    turnOff:function () {
        this.active = false;
        /**
         * Turn toggle button off
         * @event off
         * @param {String} value, i.e. label of button
         * @param Component this
         */
        this.fireEvent('off', [this._get(), this]);
        this.getBody().removeClass('ludo-form-button-pressed');
    },

    /**
     * Return instance of ludo.form.ToggleGroup
     * @function getToggleGroup
     * @return {Object} ludo.form.ToggleGroup
     */
    getToggleGroup:function () {
        return this.toggleGroup;
    },

    isActive:function () {
        return this.active;
    }
});/* ../ludojs/src/card/button.js */
/**
 * Special Button for card.Deck component
 * @namespace card
 * @class Button
 * @augments form.Button
 */
ludo.card.Button = new Class({
    Extends:ludo.form.Button,
    type:'card.Button',

    /**
     * Automatically hide button instead of disabling it. This will happen on
     * first cards for previous buttons and on last card for next and finish buttons.
     * @attribute autoHide
     * @type {Boolean}
     * @default false
     */
    autoHide:false,

    /**
     * Apply button to a specific view with this id. This view has to have layout type set to "card".
     * @attribute applyTo
     * @type String
     * @default undefined
     */
    applyTo : undefined,

    ludoConfig:function (config) {
        this.parent(config);
        this.setConfigParams(config, ['autoHide', 'applyTo']);
        if(config.applyTo && !ludo.get(config.applyTo)){
            this.onCreate.delay(50, this);
        }else{
            this.onCreate();
        }
    },

    onCreate:function(){
        this.applyTo = this.applyTo ? ludo.get(this.applyTo) : this.getParentComponent();
        if(this.applyTo){
            this.applyTo.getLayout().registerButton(this);
        }
        this.addButtonEvents();
    },

    getParentComponent:function () {
        var cmp = this.parent();
        if (cmp.layout === undefined || (cmp.layout.type!=='card')) {
            for (var i = 0; i < cmp.children.length; i++) {
                if (cmp.children[i].layout && cmp.children[i].layout.type==='card') {
                    return cmp.children[i];
                }
            }
        }
        return cmp.layout && cmp.layout.type === 'card' ? cmp : undefined;
    }
});/* ../ludojs/src/card/finish-button.js */
/**
 * Special Button for card.Deck component
 * This button will automatically be disabled when a form is invalid, and automatically enabled when it's valid.
 * A form consists of all form elements of parent component, including form elements of child components.
 * When clicked, it will submit the form of card.Deck.
 *
 * A ludo.card.FinishButton will only be visible when last card in the deck is shown.
 *
 * @namespace card
 * @class FinishButton
 * @augments card.Button
 */
ludo.card.FinishButton = new Class({
    Extends:ludo.card.Button,
    type:'card.FinishButton',
    value:'Finish',
    hidden:true,

    addButtonEvents:function(){
		var lm;
        if (this.applyTo) {
			lm = this.applyTo.getLayout();
            var fm = this.applyTo.getForm();

            lm.addEvent('valid', this.enable.bind(this));
            lm.addEvent('invalid', this.disable.bind(this));
            lm.addEvent('lastcard', this.show.bind(this));
            lm.addEvent('notlastcard', this.hide.bind(this));

            fm.addEvent('beforeSave', this.disable.bind(this));
            fm.addEvent('success', this.setSubmitted.bind(this));

            if(!lm.isValid()){
                this.disabled = true;
            }
        }
        this.addEvent('click', this.submit.bind(this));

        if(lm && lm.isOnLastCard()){
            this.show();
        }
    },

    enable:function(){
        if(this.applyTo.getLayout().isValid()){
            this.parent();
        }
    },

    show:function(){
        if(!this.submitted){
            return this.parent();
        }
        return undefined;
    },
    submitted : false,
    submit:function () {
        if (this.applyTo) {
            this.applyTo.getForm().submit();
        }
    },

    setSubmitted:function(){
        this.submitted = true;
    }
});/* ../ludojs/src/card/next-button.js */
/**
 * Special Button for card.Deck used to navigate to next card.
 * This button will automatically be disabled when a form is invalid, and automatically enabled when it's valid.
 * A form consists of all form elements of parent component, including form elements of child components.
 * When clicked, next card will be shown
 *
 * @namespace card
 * @class NextButton
 * @augments card.Button
 */
ludo.card.NextButton = new Class({
	Extends:ludo.card.Button,
	type:'card.NextButton',
	value:'Next',

	addButtonEvents:function () {
		if (this.applyTo) {
			var lm = this.applyTo.getLayout();
			lm.addEvent('valid', this.enable.bind(this));
			lm.addEvent('invalid', this.disable.bind(this));
			if (!lm.isValid()) {
				this.disable();
			}
			if (this.autoHide) {
				if (lm.isOnLastCard())this.hide(); else this.show();
				lm.addEvent('lastcard', this.hide.bind(this));
				lm.addEvent('notlastcard', this.show.bind(this));
			} else {
				if (lm.isOnLastCard())this.disable(); else this.enable();
				lm.addEvent('lastcard', this.disable.bind(this));
				lm.addEvent('notlastcard', this.enable.bind(this));
			}
		}

		this.addEvent('click', this.nextCard.bind(this));
	},

	enable:function () {
		if (this.applyTo.getLayout().isValid()) {
			this.parent();
		}
	},

	nextCard:function () {
		if (this.applyTo) {
			this.applyTo.getLayout().showNextCard();
		}
	}
});/* ../ludojs/src/card/previous-button.js */
/**
 *
 * @namespace card
 * @class PreviousButton
 * @augments card.Button
 * @description Special Button for card.Deck component for navigation to previous card.
 * On click, this button will show previous card.
 * The button will be automatically disabled when first card in deck is shown.
 * When clicked, next card will be shown
 */
ludo.card.PreviousButton = new Class({
	Extends:ludo.card.Button,
	type:'card.PreviousButton',
	value:'Previous',

	addButtonEvents:function () {
		this.addEvent('click', this.showPreviousCard.bind(this));
		if (this.applyTo) {
			var lm = this.applyTo.getLayout();
			if (this.autoHide) {
				if(!lm.isOnFirstCard())this.show(); else this.hide();
				lm.addEvent('firstcard', this.hide.bind(this));
				lm.addEvent('notfirstcard', this.show.bind(this));
			} else {
				if(!lm.isOnFirstCard())this.enable(); else this.disable();
				lm.addEvent('firstcard', this.disable.bind(this));
				lm.addEvent('notfirstcard', this.enable.bind(this));
			}
		}
	},

	showPreviousCard:function () {
		if (this.applyTo) {
			this.applyTo.getLayout().showPreviousCard();
		}
	}
});/* ../ludojs/src/progress/datasource.js */
/**
 * Data source for progress bars
 * @namespace progress
 * @class DataSource
 * @augments dataSource.JSON
 */
ludo.progress.DataSource = new Class({
    Extends:ludo.dataSource.JSON,
    type:'progress.DataSource',
    singleton:true,
    autoload:false,
    progressId:undefined,
    stopped : false,
    pollFrequence : 1,

    resource:'LudoDBProgress',
    service:'read',
	listenTo:undefined,

    ludoConfig:function(config){
        this.parent(config);

		this.setConfigParams(config, ['pollFrequence','listenTo']);

        if(this.listenTo){
            ludo.remoteBroadcaster.withResourceService(this.listenTo).on('start', this.startProgress.bind(this));
        }
    },

    startProgress:function(){
		this.inject();
        this.stopped = false;
        this.fireEvent('start');
        this.load.delay(1000, this);
    },

	inject:function(){
		ludo.remoteInject.add(this.listenTo, {
			LudoDBProgressID : this.getNewProgressBarId()
		});
	},

    loadComplete:function (data) {
        this.fireEvent('load', data);
        if(data.percent<100 && !this.stopped){
            this.load.delay(this.pollFrequence * 1000, this);
        }else{
            if(data.percent>=100){
                this.finish();
            }
        }
    },

    getNewProgressBarId:function(){
        this.progressId = this.progressId = 'ludo-progress-' + String.uniqueID();
		this.arguments = this.progressId;
        return this.progressId;
    },

    getProgressId:function(){
        return this.progressId;
    },

    stop:function(){
        this.stopped = true;
        this.fireEvent('stop');
    },

    proceed : function(){
        this.stopped = false;
        this.load();
    },

    finish:function(){
        this.stopped = true;
        this.progressId = undefined;
        this.fireEvent('finish');
		this.inject();
    }
});/* ../ludojs/src/progress/base.js */
/**
 * Super class for all progress bar views
 * @namespace progress
 * @class Base
 * @augments View
 */
ludo.progress.Base = new Class({
    Extends:ludo.View,
	applyTo:undefined,
    pollFrequence:1,
    url:undefined,
    onLoadMessage:'',
    /**
     * Hide progress bar on finish
     * @attribute {Boolean} hideOnFinish
     */
    hideOnFinish:true,

    defaultDS:'progress.DataSource',

    ludoConfig:function (config) {
        this.parent(config);
        this.setConfigParams(config, ['applyTo','listenTo', 'pollFrequence','hideOnFinish']);

        if(this.applyTo)this.applyTo = ludo.get(this.applyTo);
        this.dataSource = this.dataSource || {};
        this.dataSource.pollFrequence = this.pollFrequence;
        this.dataSource.listenTo = this.listenTo;

        if(this.listenTo){
            ludo.remoteBroadcaster.withResourceService(this.listenTo).on('start', this.show.bind(this));
        }

        this.getDataSource().addEvents({
            'load' : this.insertJSON.bind(this),
            'start' : this.start.bind(this),
            'finish' : this.finishEvent.bind(this)
        });
    },

    start:function(){
        this.fireEvent('start');
        this.insertJSON({text:'',percent:0});
    },

    hideAfterDelay:function(){
        this.hide.delay(1000, this);
    },

    getProgressBarId:function () {
        return this.getDataSource().getProgressId();
    },

    stop:function () {
        this.getDataSource().stop();
    },

    proceed:function(){
        this.getDataSource().proceed();
    },
    /**
     * Finish progress bar manually
     * @function finish
     */
    finish:function () {
        this.getDataSource().finish();
    },

    finishEvent:function(){

        if (this.hideOnFinish) {
            this.hideAfterDelay();
        }

        /**
         * Event fired when progress bar is finished
         * @event render
         * @param Component this
         */
        this.fireEvent('finish');
        
    }
});/* ../ludojs/src/progress/bar.js */
/**
 * Progress bar class
 * @namespace progress
 * @class Bar
 * @augments progress.Base
 */
ludo.progress.Bar = new Class({
    Extends:ludo.progress.Base,
    type:'ProgressBar',
    width:300,
    height:35,
    progressBarWidth:0,
    currentPercent:0,
    stopped:false,
    hidden:true,
    fx:undefined,

    ludoRendered:function () {
        this.parent();

        this.createBackgroundForProgressBar();
        this.createMovablePartOfProgressBar();
        this.createTextElement();

        this.autoSetProgressWidth();
    },
    createBackgroundForProgressBar:function () {
        var el = this.els.progressBg = $('<div>');
        el.addClass('ludo-Progress-Bar-Bg');
        this.getBody().append(el);

        var left = this.els.progressBgRight = $('<div>');
        left.addClass('ludo-Progress-Bar-Bg-Left');
        el.append(left);

        var right = this.els.progressBgRight = $('<div>');
        right.addClass('ludo-Progress-Bar-Bg-Right');
        el.append(right);
    },

    createMovablePartOfProgressBar:function () {
        var el = this.els.progress = $('<div class="ludo-Progress-Bar">');
        this.els.progressBg.append(el);
        this.els.progress.css('width', '0px');

        var left = this.els.progressLeft = $('<div>');
        left.addClass('ludo-Progress-Bar-Left');
        el.append(left);

        var right = this.els.progressRight = $('<div>');
        right.addClass('ludo-Progress-Bar-Right');
        el.append(right);
    },

    createTextElement:function () {
        var percent = this.els.percent = $('<div>');
        percent.addClass('ludo-Progress-Bar-Percent');
        this.els.progressBg.append(percent);
	},

    resizeDOM:function () {
        this.parent();
        if (this.els.progressBg) {
            this.autoSetProgressWidth();
        }
    },

    insertJSON:function (json) {
        var data = json.data ? json.data : json;
        this.setPercent(data.percent);
    },

    startProgress:function () {
        this.parent();
        this.stopped = false;
        this.setPercent(0);
        this.els.progress.css('width',  '0');
        this.currentPercent = 0;
    },

    finish:function () {
        this.parent();
        this.setPercent(100);
    },

    autoSetProgressWidth:function () {
        if (!this.isVisible()) {
            return;
        }
        var width = parseInt(this.getBody().css('width').replace('px', ''));
        width -= ludo.dom.getMW(this.els.progressBg);
        this.setProgressBarWidth(width);
        this.setPercent(this.currentPercent);
    },

    setProgressBarWidth:function (width) {

        if (isNaN(width)) {
            return;
        }
        this.progressBarWidth = width;
        this.els.progressBg.css('width', width);

        this.progressBarWidth = width;
    },

    setPercent:function (percent) {
        if(percent == this.currentPercent)return;
		if(percent === 0 && this.currentPercent === 100){
			this.els.progress.css('width',  '0px');
		}else{
            this.els.progress.animate({
                width : percent + "%"
            }, 100);
		}

        this.currentPercent = percent;
        this.els.percent.html(percent + '%');
    },

    getCurrentPercent:function () {
        return this.currentPercent;
    },

    animate:function () {
        if (this.currentPercent < 100) {
            this.currentPercent++;
            this.setPercent(this.currentPercent);
            this.animate.delay(50, this);
        }
    }
});/* ../ludojs/src/card/progress-bar.js */
/**
 * Progress bar for cards in a deck. percentage will be position of current curd
 * relative to number of cards
 * @namespace card
 * @class ProgressBar
 * @augments progress.Bar
 */
ludo.card.ProgressBar = new Class({
    Extends: ludo.progress.Bar,
    hidden: false,
    applyTo: undefined,

    ludoEvents: function () {
        this.parent();
        if (this.applyTo) {
            this.applyTo.getLayout().registerButton(this);
            this.applyTo.getLayout().addEvent('showcard', this.setCardPercent.bind(this))
        }
    },

    ludoRendered: function () {
        this.parent();
        if (this.applyTo) {
            this.setCardPercent();
        }
    },

    setCardPercent: function () {
        this.setPercent(this.applyTo.getLayout().getPercentCompleted());
    },

    getProgressBarId: function () {
        return undefined;
    }
});/* ../ludojs/src/calendar/base.js */
/**
 * Base class for calendar related classes
 * @namespace calendar
 * @class ludo.calendar.Base
 */
ludo.calendar.Base = new Class({
    Extends: ludo.View,
    months : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    monthsLong:['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    days:['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    headerWeek : 'Week',

    ludoConfig:function(config){
        this.parent(config);
        this.date = new Date();
        this.translate();
    },

    translate:function(){
        for(var i=0;i<this.months.length;i++){
            this.months[i] = ludo.language.get(this.months[i]);
            this.monthsLong[i] = ludo.language.get(this.monthsLong[i]);
        }
        for(i=0;i<this.days.length;i++){
            this.days[i] = ludo.language.get(this.days[i]);
        }
        this.headerWeek = ludo.language.get(this.headerWeek);
    },

    setDate:function (date) {
        this.date = date;
    },
    getDate:function(){
        return this.date;
    },

    sendSetDateEvent:function(){
        this.fireEvent('setdate', [this.date, this]);
    },

    val:function(){

    }
});
/* ../ludojs/src/calendar/calendar.js */
/**
 * @namespace calendar
 * @class ludo.calendar.Calendar
 * @augments ludo.calendar.Base
 * @type {Class}
 */
ludo.calendar.Calendar = new Class({
    Extends:ludo.calendar.Base,
    layout:{
		type:'linear',
		orientation:'vertical'
	},

    value:undefined,
    children:[
        { type:'calendar.NavBar', name:'info'},
        // { type:'calendar.MonthYearSelector', name:'monthyear'},
        { type:'calendar.Days', name:'days'},
        // { type:'calendar.YearSelector', name:'year'},
        { type:'calendar.Today', name:'today'}
    ],
    /**
     * @attribute inputFormat
     * @type String
     * @default Y-m-d
     */
    inputFormat:'Y-m-d',

    /**
     * Initial date, example: '2012-02-28', "date" is alias to "value"
     * @attribute date
     * @type String
     */
    date:undefined,

    /**
     * minimum valid date, eg. '2011-01-01'
     * @attribute {String} minDate
     */
    minDate:undefined,
    /**
     * maximum valid date, eg. '2013-01-01'
     * @attribute maxDate
     * @type String
     */
    maxDate:undefined,

    ludoConfig:function (config) {
        this.parent(config);
        this.setConfigParams(config, ['inputFormat','value','minDate','maxDate','date']);
        this.date = this.date || this.value;
        this.date = this.date ?  Date.parse(this.date) : new Date();

        this.value = this.date;

        if (this.minDate)this.minDate = Date.parse(this.minDate);
        if (this.maxDate)this.maxDate = Date.parse(this.maxDate);
    },

    /**
     * Set year (4 digits)
     * @function setYear
     * @param {Number} year
     *
     */
    setYear:function (year) {
        this.date.set('year', year);
        this.setDate(this.date);
    },

    setDate:function(date, sentByComponent){
        this.date = date;
        for(var i=0;i<this.children.length;i++){
            if(!sentByComponent || this.children[i].id!==sentByComponent.id){
                this.children[i].setDate(this.date);
            }
        }
    },

    /**
     * Returns selected date as Date object
     * @function getDate
     * @return {Object} selected date
     */
    getDate : function(){
        return this.value;
    },

    val:function(date, sentByComponent){
        if(arguments.length == 0){
            return this.value.format(this.inputFormat);
        }
        this.value = Date.parse(date);
        this.fireEvent('change', [this.value, this]);
    },
    /**
     * Returns selected date
     * @function getValue
     * @return {String} selected date
     */
    getValue:function(){
        console.warn("Use of deprecated calendar.getValue");
        console.trace();
        return this.value.format(this.inputFormat);
    },
    /**
     * Set new current date
	 * @function setValue
     * @param {Date} date
     */
    setValue:function(date){
        console.warn("Use of deprecated calendar.setValue");
        console.trace();
        this.value = Date.parse(date);
        this.fireEvent('change', [this.value, this]);
    },

    /**
     * Set current month
	 * @function setMonth
     * @param {Number} month (1-12)
	 * @return void
     */
    setMonth:function (month) {
        month = month - 1;
        this.date.set('month', month);
        this.setDate(this.date);
    },

    ludoRendered:function () {
        this.parent();
        for(var i=0;i<this.children.length;i++){
            var c = this.children[i];
            c.setDate(this.date);
            c.val(this.date);
            c.addEvent('setdate', this.setDate.bind(this));
            c.addEvent('change', this.val.bind(this));
        }
		this.getLayout().resize();
    }
});/* ../ludojs/src/calendar/days.js */

/**
 * Class used to display days in a month
 * @namespace calendar
 * @class Days
 * @augments calendar.Base
 */
ludo.calendar.Days = new Class({
    Extends:ludo.calendar.Base,
    layout:{
        weight:1
    },
    date:undefined,
    colWidthFirst:16,
    colWidthRest:12,
    showWeeks:true,
    sundayFirst:false,
    overflow:'hidden',
    week:undefined,
    /**
     * selected date
     * @property object value
     */
    value:undefined,
    touch:{
        enabled:false
    },

    ludoRendered:function () {
        this.parent();
        this.createCalendarHeader();
        this.createCalendarView();
    },
    ludoDOM:function () {
        this.parent();
        this.getBody().addClass('ludo-calendar-view');
    },
    ludoEvents:function () {
        this.parent();
        if (ludo.util.isTabletOrMobile()) {
            var el = this.getBody();
            el.addEvent('touchstart', this.touchStart.bind(this));
            this.getEventEl().addEvent('touchmove', this.touchMove.bind(this));
            this.getEventEl().addEvent('touchend', this.touchEnd.bind(this));
        }
    },

    touchStart:function (e) {
        this.touch = {
            enabled:true,
            x1:e.pageX, x2:e.pageX,
            y1:e.pageY, y2:e.pageY
        };

        if (e.target.tagName.toLowerCase() == 'window') {
            return false;
        }
        return undefined;
    },
    touchMove:function (e) {
        if (this.touch.enabled) {
            this.touch.x2 = e.pageX;
            this.touch.y2 = e.pageY;

            var left = this.touch.x2 - this.touch.x1;
            var top = this.touch.y2 - this.touch.y1;

            if (Math.abs(left) > Math.abs(top)) {
                if (left > 100)left = 100;
                if (left < -100) left = -100;
                this.els.monthView.css('left',  left + 'px');
                this.els.monthView.css('top',  '0px');
            } else {
                if (top > 100)top = 100;
                if (top < -100) top = -100;
                this.els.monthView.css('top',  top + 'px');
                this.els.monthView.css('left',  '0px');
            }
            return false;
        }
        return undefined;
    },
    touchEnd:function () {
        if (this.touch.enabled) {
            this.touch.enabled = false;
            var diffX = this.touch.x2 - this.touch.x1;
            var diffY = this.touch.y2 - this.touch.y1;

            var absX = Math.abs(diffX);
            var absY = Math.abs(diffY);

            if (absX > 100 || absY > 100) {
                if (absX > absY) {
                    this.data[diffX > 0 ? 'decrement' : 'increment']('month', 1);
                } else {
                    this.data[diffY > 0 ? 'decrement' : 'increment']('year', 1);
                }
                this.sendSetDateEvent();
                this.showMonth();
            }
            this.els.monthView.css('left',  '0');
            this.els.monthView.css('top',  '0');
        }

    },
    createCalendarHeader:function () {
        var el = this.els.daysHeader = $('<div>');
        el.addClass('ludo-calendar-header');
        this.getBody().append(el);

        var html = ['<table ', 'cellpadding="0" cellspacing="0" border="0" width="100%">'];
        html.push(this.getColGroup().join(''));
        html.push('<tr>');
        var headers = this.getTextForHeader();
        for (var i = 0; i < headers.length; i++) {
            html.push('<td>' + headers[i] + '</td>');
        }
        html.push('</tr>');
        html.push('</table>');
        el.html( html.join(''));
    },

    resizeDOM:function () {
        if (!this.els.daysContainer) {
            this.resizeDOM.delay(10, this);
            return;
        }
        this.parent();
        var b = this.getBody();
        var h = this.els.daysHeader;
        var size = { x:b.width(),y:b.height() };

        var height = size.y - ludo.dom.getBH(b) - ludo.dom.getPH(b) - h.height() + ludo.dom.getMH(h);

        var c = this.els.daysContainer;
        height -= (ludo.dom.getMH(c) + ludo.dom.getPH(c) + ludo.dom.getBH(c));
        c.css('height',  height + 'px');
    },

    getColGroup:function () {
        var html = [];
        html.push('<colgroup>');
        html.push('<col ' + 'width="' + this.colWidthFirst + '%" />');
        for (var i = 0; i < 7; i++) {
            html.push('<col ' + 'width="' + this.colWidthRest + '%" />');
        }
        html.push('</colgroup>');
        return html;
    },

    getTextForHeader:function () {
        var ret = [this.headerWeek];
        if (this.sundayFirst) {
            ret.push(this.days[this.days.length - 1]);
            ret = ret.append(this.days.slice(0, this.days.length - 1));

        } else {
            ret = ret.append(this.days);
        }
        return ret;
    },

    createCalendarView:function () {
        var el = this.els.daysContainer = $('<div>');
        el.addClass('ludo-calendar-container-days');
        el.css({
            position:'relative',
            width:'100%',
            overflow:'hidden',
            left:0,
            top:0
        });
        el.on('mousemove', this.mouseOverDays.bind(this));
        el.on('mouseleave', this.removeClsFromMouseOverDay.bind(this));
        this.getBody().append(el);
    },
    showMonth:function () {
        if (this.els.monthView) {
            this.els.monthView.remove();
        }

        var el = this.els.monthView = $('<div>');
        el.on('click', this.selectDay.bind(this));
        el.addClass('ludo-calendar-body-days');
        this.resizeMonthView();
        el.css('position', 'absolute');

        this.els.daysContainer.append(el);

        var html = ['<table ', 'cellpadding="0" cellspacing="0" border="0" width="100%" style="height:100%">'];
        html.push(this.getColGroup().join(''));

        var days = this.getDaysForView();
        var cls = '';

        var selectedDay = 0;
        if (this.isValueMonth()) {
            selectedDay = this.value.get('date');
        }
        var today = 0;
        if (this.isOnTodaysMonth()) {
            today = new Date().get('date');
        }
        var thisMonthStarted = false;
        var nextMonthStarted = false;
        for (var i = 0; i < days.length; i++) {
            cls = '';
            if (i % 8 == 0) {
                if (i)html.push('</tr>');
                html.push('<tr>');
                cls = 'calendar-week';
            } else {
                if (days[i] == 1 && thisMonthStarted)nextMonthStarted = true;
                if (days[i] == 1)thisMonthStarted = true;
                cls = 'calendar-day';
                if (!thisMonthStarted || nextMonthStarted) {
                    cls = cls + ' calendar-day-inactive';
                } else {
                    if ((this.sundayFirst && (i - 1) % 8 == 0) || (!this.sundayFirst && (i + 1) % 8 == 0)) {
                        cls = cls + ' calendar-sunday';
                    }
                    if (days[i] == selectedDay) {
                        cls = cls + ' calendar-day-selected';
                    }
                    if (days[i] == today) {
                        cls = cls + ' calendar-day-today';
                    }
                    cls = cls + ' calendar-day-' + days[i];
                }
            }

            html.push('<td class="' + cls + '">' + days[i] + '</td>');
        }

        html.push('</table>');
        el.html( html.join(''));
        this.resizeMonthView.delay(20, this);

    },

    mouseOverDays:function (e) {
        var el = $(e.target);
        this.removeClsFromMouseOverDay();
        if (!el.hasClass('calendar-day') || el.hasClass('calendar-day-inactive')) {
            return;
        }
        el.addClass('calendar-day-mouse-over');
        this.els.mouseOverDay = el;
    },

    removeClsFromMouseOverDay:function () {
        if (this.els.mouseOverDay) {
            this.els.mouseOverDay.removeClass('calendar-day-mouse-over');
            this.els.mouseOverDay = undefined;
        }
    },

    isValueMonth:function () {
        return this.value ? this.value.get('month') == this.date.get('month') && this.value.get('year') == this.date.get('year') : false;
    },

    isOnTodaysMonth:function () {
        var today = new Date();
        return today.get('month') == this.date.get('month') && today.get('year') == this.date.get('year');
    },
    resizeMonthView:function () {
        this.els.monthView.css('width',  '100%');
    },

    getDaysForView:function () {
        var ret = [];
        var thisMonth = this.date.clone();
        thisMonth.setDate('1');

        var lastMonth = thisMonth.clone().decrement('day', 1);
        var daysInMonth = thisMonth.getLastDayOfMonth();

        var dayOfWeek = thisMonth.getUTCDay();

        if (this.sundayFirst) {
            dayOfWeek++;
            if (dayOfWeek > 6)dayOfWeek = 0;
        }
        var i;
        if (dayOfWeek > 0 || daysInMonth < 31) {
            this.setStartWeek(lastMonth.get('week'));
            var daysInLastMonth = lastMonth.getLastDayOfMonth();
            var count = dayOfWeek || 7;
            ret.push(this.getNextWeek());
            for (i = count - 1; i > 0; i--) {
                ret.push(daysInLastMonth - i);
            }
            if (ret.length % 8 == 0) {
                ret.push(this.getNextWeek());
            }
        } else {
            this.setStartWeek(thisMonth.get('week'));
            ret.push(this.getNextWeek());
        }

        for (i = 1; i <= daysInMonth; i++) {
            ret.push(i);
            if (ret.length % 8 == 0) {
                ret.push(this.getNextWeek());
            }
        }
        var len = ret.length;
        for (i = ret.length; i < 48; i++) {
            if (ret.length < 48) {
                if (ret.length % 8 == 0) {
                    ret.push(this.getNextWeek());
                }
                ret.push(i - len + 1);
            }
        }
        return ret;
    },

    selectDay:function (e) {
        var el = $(e.target);
        if (!el.hasClass('calendar-day')) {
            el = el.closest('.calendar-day');
            if (!el)return;
        }
        if (el.hasClass('calendar-day-inactive')) {
            return;
        }
        this.removeClsFromSelectedDay();

        el.addClass('calendar-day-selected');
        this.value = this.date.clone();
        this.value.set('date', el.get('html'));
        this.fireEvent('change', [this.value, this]);
    },

    removeClsFromSelectedDay:function () {
        if (this.els.monthView && this.isValueMonth()) {
            var el = this.els.monthView.find('.calendar-day-' + this.value.get('date'));
            if (el)el.removeClass('calendar-day-selected');
        }
    },

    addClsForSelectedDay:function () {
        if (this.els.monthView && this.isValueMonth()) {
            var el = this.els.monthView.find('.calendar-day-' + this.value.get('date'));
            if (el)el.addClass('calendar-day-selected');
        }
    },

    setStartWeek:function (week) {
        this.week = week;
    },

    getNextWeek:function () {
        var ret = this.week;
        this.week++;
        if (this.week > 53 || (this.week > 50 && this.date.get('month') == 0)) {
            this.week = 1;
        }
        return ret;
    },
    /**
     * Set currently viewed month
     * @function setDate
     * @param {Object} date
     * @return void
     */
    setDate:function (date) {
        this.date = date;
        this.showMonth();
    },
    /**
     * Set selected date
     * @function setValue
     * @param {Date} date
     */
    setValue:function (date) {
        this.removeClsFromSelectedDay();
        this.value = date.clone();
        this.addClsForSelectedDay();
    }
});/* ../ludojs/src/calendar/nav-bar.js */
/**
 * Displays nav-buttons for previous month and year to the left, a calendar.MonthYearSelector in the center and buttons for next month and next year to the right.
 * @namespace calendar
 * @class NavBar
 * @augments calendar.Base
 */
ludo.calendar.NavBar = new Class({
    Extends:ludo.calendar.Base,
    type:'calendar.NavBar',
    height:20,
    date:undefined,
    layout:{ type:'linear', orientation:'horizontal'},
    cls:'ludo-calendar-info-panel',

    children:[
        { type:'form.Button', size:'s', value:'<<', name:'previousyear', width:25},
        { type:'form.Button', size : 's', value:'<', name:'previous', width:25},
        { weight:1, name:'info', type:'calendar.MonthYearSelector' },
        { type:'form.Button', size : 's', name:'next', value:'>', width:25 },
        { type:'form.Button', size : 's', name:'nextyear', value:'>>', width:25 }
    ],

    ludoRendered:function () {
        this.parent();
        this.child['previous'].addEvent('click', this.goToPreviousMonth.bind(this));
        this.child['next'].addEvent('click', this.goToNextMonth.bind(this));
        this.child['nextyear'].addEvent('click', this.goToNextYear.bind(this));
        this.child['previousyear'].addEvent('click', this.goToPreviousYear.bind(this));
    },
    goToPreviousMonth:function () {
        this.setDate(this.date.decrement('month', 1));
        this.sendSetDateEvent();
    },
    goToNextMonth:function () {
        this.setDate(this.date.increment('month', 1));
        this.sendSetDateEvent();
    },

    goToPreviousYear:function () {
        this.setDate(this.date.decrement('year', 1));
        this.sendSetDateEvent();
    },

    goToNextYear:function () {
        this.setDate(this.date.increment('year', 1));
        this.sendSetDateEvent();
    },


    setDate:function (date) {
        this.date = date;
        this.showDate();
        this.child['info'].setDate(date);
    },

    sendDate:function (date) {
        this.date = date;
        this.sendSetDateEvent();
    },

    showDate:function () {
        this.child['info'].addEvent('setdate', this.sendDate.bind(this));
    }
});/* ../ludojs/src/calendar/selector.js */
/**
 * Super class for year and month-selectors
 * @namespace calendar
 * @class Selector
 * @augments calendar.Base
 */
ludo.calendar.Selector = new Class({
    Extends:ludo.calendar.Base,
    height:25,
    date:undefined,
    minDate:undefined,
    maxDate:undefined,
    overflow:'hidden',
    minDisplayedYear:undefined,
    maxDisplayedYear:undefined,
    fx:undefined,
    offsetOptions:13,
    calCls:'ludo-calendar-year-container',

    ludoConfig:function (config) {
        this.parent(config);
        this.els.options = [];
    },

    ludoRendered:function () {
        this.parent();
        this.createOptionsContainer();

        this.renderOptions();
        this.autoResize();
    },

    createOptionsContainer:function () {
        var el = this.els.calendarContainer = $('<div>');
        el.addClass(this.calCls);
        el.css({
            position:'absolute', width:'3000px', left:0, top:0
        });
        this.getBody().append(el);
    },
    autoResize:function () {
        var height = this.els.calendarContainer.height();
        height += ludo.dom.getMH(this.els.calendarContainer);
        this.layout.height = height + ludo.dom.getMBPH(this.getBody()) + ludo.dom.getMBPH(this.getEl());

    },

    resizeDOM:function () {
        this.parent();
        if (this.els.activeOption) {
            this.animateDomToCenter.delay(20, this, this.els.activeOption);
        }
    },

    removeOptions:function () {
        for (var i = 0; i < this.els.options.length; i++) {
            this.els.options[i].remove();
        }
        this.els.options = [];
    },

    centerDom:function (domEl) {
        domEl.parent().css('marginLeft',  this.getCenterPos(domEl) + 'px');
    },

    animateDomToCenter:function (domEl) {
        if(domEl && $(domEl).parent()){
            this.els.calendarContainer.animate(
            { 'margin-left' : this.getCenterPos(domEl)},
                200
            );
            // this.fx.start('margin-left', domEl.getParent().style.marginLeft, this.getCenterPos(domEl));
        }
    },

    getCenterPos:function (domEl) {
        return Math.round((this.getBody().clientWidth / 2) - domEl.offsetLeft - (domEl.offsetWidth / 2));
    },

    setMinDate:function (date) {
        this.minDate = date;
    },

    setMaxDate:function (date) {
        this.maxDate = date;
    }
});/* ../ludojs/src/calendar/month-selector.js */
/**
 * Class used to select month for a calendar.
 * @namespace calendar
 * @class MonthSelector
 * @augments calendar.Base
 * @type {Class}
 */
ludo.calendar.MonthSelector = new Class({
    Extends: ludo.calendar.Base,
    height:25,

    ludoRendered:function(){
        this.parent();
        this.createMonthContainer();
        this.renderMonths();
        this.autoResize();
    },

    autoResize:function(){
        var height = this.els.monthContainer.offsetHeight;
        height += ludo.dom.getMH(this.els.monthContainer) + ludo.dom.getMBPH(this.getBody()) + ludo.dom.getMBPH(this.getEl());
        this.layout.height = height;

    },
    createMonthTooltip:function(){
        var el = this.els.monthTip = $('<div>');
        el.setStyles({
            'position' : 'absolute',
            display:'none'
        });
        el.addClass('ludo-calendar-month-tip');
        el.addClass('ludo-calendar-month');
        el.addEvent('click', this.clickMonth.bind(this));
        this.els.monthContainer.append(el);
    },

    createMonthContainer:function(){
        var el = this.els.monthContainer = $('<div>');
        el.addClass('ludo-calendar-month-container');
        el.setStyles({
            position:'absolute', width : '3000px', left:0,top:0
        });
        this.getBody().append(el);
    },

    renderMonths:function(){
        this.els.monthContainer.html( '');
        this.createMonthTooltip();
        var month = this.date.get('month');

        for(var i=0;i<this.months.length;i++){
            var el = $('<div>');
            el.addClass('ludo-calendar-month');
            el.setProperty('month', i);
            this.els.monthContainer.append(el);

            if(i==month){
                el.addClass('ludo-calendar-month-selected');
                el.html( '<span>' + this.months[i] + '</span>');
                el.mouseenter(this.hideTooltip.bind(this));
            }else{
                el.mouseenter(this.showTooltip.bind(this));
                el.setProperty('title', this.months[i]);
                el.addClass('ludo-calendar-month-inactive');
            }
            el.addEvent('click', this.clickMonth.bind(this));
        }
        this.els.monthContainer.addEvent('mouseleave', this.hideTooltip.bind(this));
    },

    clickMonth:function(e){
        var el = this.getMonthEl(e.target);
        this.setMonth(el.attr('month'));
        this.sendSetDateEvent();
    },

    setDate:function(date){
        this.parent(date);
        this.renderMonths();
    },

    showTooltip:function(e){
        var el = this.getMonthEl(e.target);
        var tip = this.els.monthTip;
        tip.setProperty('month', el.attr('month'));
        var month = this.months[el.attr('month')];
        tip.html( month);
        tip.css('left',  Math.max(0, el.offsetLeft) + 'px');
        tip.css('display',  '');
    },

    hideTooltip:function(){
        this.els.monthTip.css('display', 'none');
    },

    getMonthEl:function(dom){
        if(!dom.hasClass('ludo-calendar-month'))dom = dom.getParent('.ludo-calendar-month');
        return dom;
    }
});/* ../ludojs/src/calendar/today.js */
/**
 * Display "Today" button inside a calendar. When clicked, date of calendar will be set to today's date.
 * @namespace calendar
 * @class Today
 * @augments calendar.Base
 */
ludo.calendar.Today = new Class({
    Extends:ludo.calendar.Base,
    layout : {
        type:'relative'
    },
    height:25,
    overflow:'hidden',
    css:{
        'margin-top' : 2
    },

    ludoRendered:function(){
        this.parent();
        this.child['today'].addEvent('click', this.setToday.bind(this));
    },

    getClassChildren:function(){
        return [{ name:'today', type:'form.Button', value : ludo.language.get('Today'), layout: { centerInParent:true}}];
    },

    setDate:function(){
        // this.date is always today's date which is set in ludoConfig
    },

    setToday:function(){
        this.date = new Date();
        this.sendSetDateEvent();
    }
});/* ../ludojs/src/calendar/year-selector.js */
/**
 * Class used to display years in a calendar
 * @namespace calendar
 * @class YearSelector
 * @augments calendar.Selector
 */
ludo.calendar.YearSelector = new Class({
    Extends:ludo.calendar.Selector,
    minDisplayedYear:undefined,
    maxDisplayedYear:undefined,

    resizeDOM:function () {
        this.parent();
        if (this.els.activeOption) {
            this.animateDomToCenter(this.els.activeOption);
        }
    },

    renderOptions:function () {
        this.removeOptions();
        this.els.activeOption = undefined;
        var year = this.date.get('year');
        for (var i = year - this.offsetOptions; i < year + this.offsetOptions; i++) {
            var el = this.getDomForAYear(i);
            this.els.calendarContainer.append(el);
            this.els.options.push(el);
        }
        this.setMinAndMaxDisplayed();
    },

    setMinAndMaxDisplayed:function () {
        this.minDisplayedYear = this.date.clone().decrement('year', this.offsetOptions).get('year');
        this.maxDisplayedYear = this.date.clone().increment('year', this.offsetOptions).get('year');
    },

    getDomForAYear:function (year) {
        var el = $('<div>');
        el.html( '<span>' + year + '</span>');
        el.setProperty('year', year);
        el.addClass('ludo-calendar-year');
        if (year == this.date.get('year')) {
            el.addClass('ludo-calendar-year-selected');
            this.els.activeOption = el;
        }
        el.addEvent('click', this.clickYear.bind(this));
        return el;
    },

    clickYear:function (e) {
        var el = e.target;
        if (!el.hasClass('ludo-calendar-year'))el = el.getParent('.ludo-calendar-year');
        this.date.set('year', el.attr('year'));
        this.setDate(this.date);
        this.sendSetDateEvent();
    },

    setDate:function (date) {
        this.date = date;
        this.addAndRemoveOptions();
        if (this.els.activeOption) {
            this.centerDom(this.els.activeOption);
            this.els.activeOption.removeClass('ludo-calendar-year-selected');
        }
        this.els.activeOption = this.getDomElForCurrentYear();
        if (this.els.activeOption) {
            this.els.activeOption.addClass('ludo-calendar-year-selected');
            this.animateDomToCenter.delay(20, this, this.els.activeOption);
        }
    },

    addAndRemoveOptions:function () {
        var year = this.date.get('year');
        var median = Math.round((this.maxDisplayedYear + this.minDisplayedYear) / 2);
        if (year < this.minDisplayedYear || year > this.maxDisplayedYear) {
            this.renderOptions();
        }
        else if (year < median) {
            this.insertYearsBefore(median - year);
        } else {
            this.insertYearsAfter(year - median);
        }

        this.setMinAndMaxDisplayed();
    },
    insertYearsBefore:function (count) {
        var els = [];
        for (var i = count; i > 0; i--) {
            var year = this.minDisplayedYear - i;
            var el = this.getDomForAYear(year);
            el.inject(this.els.options[0], 'before');
            els.push(el);
            this.els.options[this.els.options.length - 1].dispose();
            this.els.options.length--;
        }
        this.els.options = els.append(this.els.options);
    },
    insertYearsAfter:function (count) {
        for (var i = 1; i <= count; i++) {
            var year = this.maxDisplayedYear + i;
            var el = this.getDomForAYear(year);
            this.els.calendarContainer.append(el);
            this.els.options.push(el);
            this.els.options[i - 1].dispose();
        }
        this.els.options = this.els.options.slice(count);
    },

    getDomElForCurrentYear:function () {
        var year = this.date.get('year');
        var o = this.els.options;
        for (var i = 0; i < o.length; i++) {
            if (o[i].attr('year') == year) {
                return o[i];
            }
        }
		return undefined;
    }
});/* ../ludojs/src/calendar/month-year-selector.js */
/**
* Class used to select month and year for a calendar.
* @namespace calendar
* @class MonthYearSelector
* @augments calendar.Selector
*/
ludo.calendar.MonthYearSelector = new Class({
    Extends:ludo.calendar.Selector,
    height:25,
    minDisplayed:undefined,
    maxDisplayed:undefined,
    fx:undefined,
    date:undefined,
    calCls : 'ludo-calendar-month-year-container',

    renderOptions:function () {
        this.removeOptions();

        this.els.activeOption = undefined;
        for (var i = this.offsetOptions*-1; i <= this.offsetOptions; i++) {
            var el = this.getDomForAMonth(i);
            this.els.calendarContainer.append(el);
            this.els.options.push(el);
        }
        this.setMinAndMaxDisplayed();
    },

    setMinAndMaxDisplayed:function () {
        var d = this.date.clone();
        this.minDisplayed = d.decrement('month', this.offsetOptions);
        d = this.date.clone();
        this.maxDisplayed = d.increment('month', this.offsetOptions);
    },

    getDomForAMonth:function (monthFromCurrent) {
        var d = this.date.clone().increment('month', monthFromCurrent);
        var txt = this.months[d.get('month')];
        var el = $('<div>');

        el.attr({
            'year' : d.get('year'), 'month' : d.get('month')
        });
        el.addClass('ludo-calendar-month-year');
        if (monthFromCurrent == 0) {
            el.addClass('ludo-calendar-month-year-selected');
            this.els.activeOption = el;
        }
        el.html('<span>' + txt + '</span>');
        el.on('click', this.clickMonth.bind(this));
        return el;
    },

    clickMonth:function (e) {
        var el = e.target;
        if (!el.hasClass('ludo-calendar-month-year'))el = el.getParent('.ludo-calendar-month-year');

        this.setMonthAndYear(el.attr('month'), el.attr('year'));
        this.sendSetDateEvent();
    },

    setMonthAndYear:function(month, year){
        this.date.set('month', month);
        this.date.set('year', year);
        this.refreshView();
    },

    setDate:function(date){
        this.parent(date);
        this.refreshView();
    },

    refreshView:function () {
        this.addAndRemoveOptions();
        if (this.els.activeOption) {
            this.centerDom(this.els.activeOption);
            this.els.activeOption.html( this.months[this.els.activeOption.attr('month')]);
            this.els.activeOption.removeClass('ludo-calendar-month-year-selected');
        }
        this.els.activeOption = this.getNewActiveOption();
        this.populateActiveMonth();
        this.animateDomToCenter.delay(20, this, this.els.activeOption);
    },

    populateActiveMonth:function() {
        this.els.activeOption.addClass('ludo-calendar-month-year-selected');
        this.els.activeOption.html( this.months[this.date.get('month')] + ', ' + this.date.get('year'));
    },

    addAndRemoveOptions:function () {
        var min = this.date.clone().decrement('month', this.offsetOptions);
        var max = this.date.clone().increment('month', this.offsetOptions);
        if(max < this.minDisplayed || min > this.maxDisplayed){
            this.renderOptions();
        }else{
            var diff = this.date.diff(this.minDisplayed, 'month') + this.offsetOptions;
            if(diff > 0){
                this.insertMonthBefore(diff);
            }else{
                this.insertMonthAfter(diff*-1);
            }
        }
        this.setMinAndMaxDisplayed();
    },
    insertMonthBefore:function (count) {
        var els = [];
        for (var i = 0; i<count;i++) {
            var monthsFromCurrent = i - this.offsetOptions;
            var el = this.getDomForAMonth(monthsFromCurrent);
            el.insertBefore(this.els.options[0]);
            els.push(el);
            this.els.options[this.els.options.length - 1].remove();
            this.els.options.length--;
        }
        this.els.options = els.append(this.els.options);
    },
    insertMonthAfter:function (count) {
        for (var i = count; i > 0; i--) {
            var monthsFromCurrent = this.offsetOptions - i + 1;
            var el = this.getDomForAMonth(monthsFromCurrent);
            this.els.calendarContainer.append(el);
            this.els.options.push(el);
            this.els.options[i - 1].remove();
        }
        this.els.options = this.els.options.slice(count);
    },

    getNewActiveOption:function () {
        var year = this.date.get('year'), month = this.date.get('month');
        for (var i = 0; i < this.els.options.length; i++) {
            if (this.els.options[i].attr('year') == year && this.els.options[i].attr('month') == month) {
                return this.els.options[i];
            }
        }
		return undefined;
    }
});/* ../ludojs/src/util/geometry.js */

ludo.geometry = {

    degreesToRadians: function (degrees) {
        return (degrees * Math.PI) / 180;
    },

    radiansToDegrees: function (radians) {
        return radians * (180 / Math.PI);
    },

    getPointDistanceFrom:function(originX, originY, radiansFromOrigin, distance){
        var xDelta = distance * Math.cos(radiansFromOrigin);
        var yDelta = distance * Math.sin(radiansFromOrigin);

        return {
            x: originX + xDelta, y: originY + yDelta
        }
    },

    getPoint: function (originX, originY, degreesFromOrigin, distance) {
        return this.getPointDistanceFrom(originX, originY, this.degreesToRadians(degreesFromOrigin), distance);
    },

    distanceBetweenPoints: function (x1, y1, x2, y2) {

        var xDiff = Math.abs(x2 - x1);
        var yDiff = Math.abs(y2 - y1);

        return this.distanceBetweenVectors(xDiff, yDiff);
    },

    distanceBetweenVectors: function (vectorX, vectorY) {
        return Math.sqrt((vectorX * vectorX) + (vectorY * vectorY));

    },

    // Returns angle in degrees
    // @function getAngleFrom
    // @memberOf ludo.geometry
    getAngleFrom: function (fromX, fromY, toX, toY) {
        var angle = this.radiansToDegrees(Math.atan2(fromY - toY, fromX - toX));

        if (angle < 0) {
            angle += 360;
        }

        angle = ((angle - 90) + 360) % 360;

        return angle;

    },

    cosSinBetweenLocations:function(lat1, long1, lat2, long2) {
        var dLon = (long2 - long1);

        var y = Math.sin(dLon) * Math.cos(lat2);
        var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1)
            * Math.cos(lat2) * Math.cos(dLon);

        var brng = Math.atan2(y, x);

        // TODO this should be moved out
        // Temporary fix since 0 degrees(NORTH) is right in view
        brng -= this.degreesToRadians(90);

        return { x: Math.cos(brng), y: Math.sin(brng) };
    },

    bearingBetweenLocations: function (lat1, long1, lat2, long2) {
        var dLon = (long2 - long1);

        var y = Math.sin(dLon) * Math.cos(lat2);
        var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1)
            * Math.cos(lat2) * Math.cos(dLon);

        var brng = Math.atan2(y, x);
        brng = this.radiansToDegrees(brng);
        brng = (brng + 360) % 360;
        brng = 360 - brng;

        return brng;
    }


};/* ../ludojs/src/calendar/time-picker.js */
/**
 * Time Picker module
 * @module timeanddat
 * @namespace ludo.calendar
 * @class ludo.calendar.TimePicker
 * @param {object} config Config object
 * @param {number} config.hours Initial hours
 * @param {number} config.minutes Initial minutes
 * @param {String} config.clockBackground Background color of "Watch face"
 * @param {String} config.hourColor Color of hours text, default: #555555
 * @param {String} config.minuteColor Color for the minute text, default: #555555
 * @param {String} config.handColor Color of Arrow Hand indicating selected hours and minutes. default: #669900
 * @param {String} config.handTextColor Color of hour and minute text on the hour/minute hand. default: #FFFFFFF
 * @param {String} config.minuteDotColor Color of small dot inside the hour/minute hand., default: #FFFFFF
 *
 * @fires ludo.calendar.TimePicker#time
 * @fires ludo.calendar.TimePicker#mode
 */
ludo.calendar.TimePicker = new Class({

    Extends: ludo.View,
    origo: undefined,

    hours: undefined,
    minutes: undefined,

    hourPrefixed: undefined,
    minutePrefixed: undefined,

    area: undefined,

    initialArea: undefined,

    hourGroupInner: undefined,
    hourGroup: undefined,

    frontGroup: undefined,

    hourElements: undefined,
    minuteEls: undefined,

    centerDot: undefined,
    needle: undefined,
    needleCircle: undefined,
    needleText: undefined,
    clipPath: undefined,
    mode: undefined,

    dragActive: false,

    drag: undefined,

    outerSize: 0.85,
    hourInnerSize: 0.65,

    handColor: '#669900',
    minuteDotColor:'#ffffff',
    clockBackground: '#DDDDDD',
    handTextColor: '#ffffff',
    hourColor:'#555555',
    minuteColor:'#555555',

    ludoConfig: function (config) {
        this.parent(config);
        this.setConfigParams(config, ['hours', 'minutes','handColor', 'minuteDotColor', 'clockBackground','handTextColor',
        'hourColor', 'minuteColor']);

        var d = new Date();
        if (this.hours == undefined) {
            this.hours = d.getHours();
        }
        if (this.minutes == undefined) {
            this.minutes = d.getMinutes();
        }
        this.mode = 'hours';
    },


    ludoRendered: function () {
        this.parent();
        this.renderClock();
        this.notify();
    },

    setTime:function(hour, minutes){
        this.hours = hour;
        this.minutes = minutes;
        this.setPrefixed();
        this.restart();
        this.notify();
        this.updateNeedle();


    },

    /**
     * Show hours
     */
    restart: function () {
        this.showHours();
    },


    setPrefixed:function(){
        this.hourPrefixed= this.hours < 10 ? "0" + this.hours : this.hours;
        this.minutePrefixed = this.minutes < 10 ? "0" + this.minutes : this.minutes;
    },

    notify: function () {
        /**
         * Mode event, arguments can be "hours" or "minutes"
         * @event ludo.calendar.TimePicker#time
         * @property {Number} hours Current hours
         * @property {Number} minutes Current minutes
         * @property {String} timeString. Time in format HH:MM
         * @example
         * var t = new ludo.calendar.TimePicker({
         *      layout:{width:500,height:500},
         *      renderTo:document.body,
         *      listeners:{
         *          // Listener for the "time" event
         *          'time' : function(hour, minutes, timeAsString){
         *              // timeString in format HH:MM, example: 11:48
         *              console.log(timeAsString);
         *          }
         *
         * });
         *
         */

        this.fireEvent('time', [this.hours, this.minutes, this.hourPrefixed + ":" + this.minutePrefixed]);
    },

    mouseDown: function (e) {
        this.dragActive = true;

        var offset = this.getBody().offset();
        this.drag = {
            elX: offset.left + parseInt(this.getBody().css("paddingLeft")) + parseInt(this.getBody().css("border-left-width")),
            elY: offset.top + parseInt(this.getBody().css("paddingLeft")) + parseInt(this.getBody().css("border-top-width"))
        };
        this.updateTimeByEvent(e);
    },

    mouseMove: function (e) {
        if (!this.dragActive)return;
        this.updateTimeByEvent(e);

    },

    mouseUp: function () {
        if (this.dragActive) {
            if (this.mode == 'hours') {
                this.showMinutes();
            }
        }
        this.dragActive = false;
    },

    updateTimeByEvent: function (e) {


        var posX = e.pageX - this.drag.elX;
        var posY = e.pageY - this.drag.elY;

        var angle = ludo.geometry.getAngleFrom(this.origo.x, this.origo.y, posX, posY);
        var distance = ludo.geometry.distanceBetweenPoints(this.origo.x, this.origo.y, posX, posY);

        var hour = this.hours;
        var minute = this.minutes;

        if (this.mode == "hours") {
            var inner = distance < (this.area.size / 2) * (this.hourInnerSize * 1.05);
            hour = angle / 360 * 12;
            if (inner)hour += 12;
            hour = Math.round(hour);
            if (!inner && hour == 0)hour = 12;
            if (inner && hour == 12)hour = 0;
            if (hour == 24) hour = 0;

        } else {
            minute = angle / 360 * 60;
            minute = Math.round(minute) % 60;
        }
        if (hour != this.hours || minute != this.minutes) {
            this.hours = hour;
            this.minutes = minute;
            this.setPrefixed();
            this.notify();
            this.updateNeedle();

        }
    },

    updateNeedle: function () {

        var pos, txt;
        if (this.mode == 'hours') {
            var angle = this.getHourAngle(this.hours);
            var length = this.getHourDistance(this.hours);

            pos = ludo.geometry.getPointDistanceFrom(this.origo.x, this.origo.y, angle, length);
            txt = this.hourPrefixed;

            this.needleText.text(txt);

            this.needleText.set('x', pos.x);
            this.needleText.set('y', pos.y);

        } else {

            var a = this.getMinuteAngle(this.minutes);
            var l = this.area.size * this.outerSize / 2;
            pos = ludo.geometry.getPointDistanceFrom(this.origo.x, this.origo.y, a, l);

            var minute = Math.round(this.minutes / 5) * 5;
            if (minute == 60)minute = 0;
            var m = minute < 10 ? "0" + minute : minute;
            var a2 = this.getMinuteAngle(minute);
            var pos2 = ludo.geometry.getPointDistanceFrom(this.origo.x, this.origo.y, a2, l);

            this.needleText.set('x', pos2.x);
            this.needleText.set('y', pos2.y);

            this.needleCircleInnerMinutes.set('cx', pos.x);
            this.needleCircleInnerMinutes.set('cy', pos.y);

            if(pos.x != pos2.x){
                this.needleCircleInnerMinutes.show();
            }else{
                this.needleCircleInnerMinutes.hide();
            }

            this.needleText.text(m);
        }


        this.clipCircle.set('cx', pos.x);
        this.clipCircle.set('cy', pos.y);

        this.needle.set('x2', pos.x);
        this.needle.set('y2', pos.y);

        this.needleCircle.set('cx', pos.x);
        this.needleCircle.set('cy', pos.y);


    },



    renderClock: function () {
        var canvas = this.getCanvas();
        canvas.getNode().on(ludo.util.getDragStartEvent(), this.mouseDown.bind(this));
        $(document.body).on(ludo.util.getDragMoveEvent(), this.mouseMove.bind(this));
        $(document.body).on(ludo.util.getDragEndEvent(), this.mouseUp.bind(this));


        var size = Math.min(canvas.width, canvas.height);

        this.hourElements = [];
        this.minuteEls = [];

        this.origo = {
            x: canvas.width / 2,
            y: canvas.height / 2
        };

        this.area = {
            x: (canvas.width - size) / 2,
            y: (canvas.height - size) / 2,
            size: size
        };

        this.initialArea = {
            x: this.area.x, y: this.area.y, size: this.area.size
        };

        this.clipPath = new ludo.canvas.Node('clipPath', {});
        canvas.append(this.clipPath);
        this.clipCircle = new ludo.canvas.Circle({
            cx: this.origo.x, cy: this.origo.y, r: 5
        });
        this.clipPath.append(this.clipCircle);


        this.clockBackground = new ludo.canvas.Circle({
            cx: this.origo.x, cy: this.origo.y, r: this.area.size / 2,
            css: {
                'fill': this.clockBackground
            }
        });
        canvas.append(this.clockBackground);

        this.hourGroup = new ludo.canvas.Group({
            css: {
                'fill': this.hourColor,
                'stroke-width': 0

            }
        });

        var styles = {
            '-webkit-user-select': 'none',
            '-moz-user-select': 'none',
            '-ms-user-select': 'none',
            'user-select': 'none'
        };

        canvas.append(this.hourGroup);

        this.hourGroupInner = new ludo.canvas.Group({
            css: {
                'fill': this.hourColor,
                'stroke-width': 0
            }
        });
        canvas.append(this.hourGroupInner);

        var i;

        for (i = 1; i <= 12; i++) {
            var text = new ludo.canvas.Text("" + i, {
                css: styles
            });

            text.set("text-anchor", "middle");
            text.set("alignment-baseline", "middle");

            this.hourGroup.append(text);
            this.hourElements.push({
                hour: i,
                el: text
            });
        }

        for (i = 13; i <= 24; i++) {
            var txt = i == 24 ? "00" : "" + i;
            text = new ludo.canvas.Text(txt, {
                css: styles
            });
            text.set("text-anchor", "middle");
            text.set("alignment-baseline", "middle");
            this.hourElements.push({
                hour: i,
                el: text
            });
            this.hourGroupInner.append(text);
        }

        this.centerDot = new ludo.canvas.Circle({
            cx: this.origo.x, cy: this.origo.y,
            r: 2,
            css: {
                'fill': this.handColor, 'stroke-width': 0
            }
        });

        this.needle = new ludo.canvas.Node('line',
            {
                x1: this.origo.x, y1: this.origo.y,
                x2: 100, y2: 100,
                css: {
                    'stroke-linecap': "round",
                    'stroke': this.handColor,
                    'stroke-width': 2
                }
            }
        );
        canvas.append(this.needle);


        this.minuteGroup = new ludo.canvas.Group({
            css: {
                'fill': this.minuteColor,
                'stroke-width': 0
            }
        });
        canvas.append(this.minuteGroup);

        for (i = 0; i < 60; i += 5) {
            var m = "" + i;
            if (m.length == "1")m = "0" + m;
            text = new ludo.canvas.Text(m, {
                css: styles
            });
            text.set("text-anchor", "middle");
            text.set("alignment-baseline", "middle");
            this.minuteEls.push({
                minute: i,
                el: text
            });
            this.minuteGroup.append(text);
        }

        this.needleCircle = new ludo.canvas.Circle({
            cx: this.origo.x, cy: this.origo.y, r: 10,
            css: {
                'fill': this.handColor
            }
        });
        canvas.append(this.needleCircle);

        this.needleCircleInnerMinutes = new ludo.canvas.Circle({
            cx: this.origo.x, cy: this.origo.y, r: 1,
            css: {
                fill: this.minuteDotColor
            }
        });
        canvas.append(this.needleCircleInnerMinutes);



        this.needleText = new ludo.canvas.Text("", {
            'fill': this.handTextColor,
            css: styles

        });
        this.needleText.set("text-anchor", "middle");
        this.needleText.set("alignment-baseline", "middle");
        canvas.append(this.needleText);

        this.needleText.applyClipPath(this.clipPath);

        this.showHours();

        canvas.append(this.centerDot);

        this.resizeSVG();
    },

    positionHour: function (index) {
        var hour = this.hourElements[index].hour;
        var offset = this.getHourDistance(hour);
        var angle = this.getHourAngle(hour);
        var x = Math.cos(angle);
        var y = Math.sin(angle);
        this.hourElements[index].el.set('x', (x * offset) + this.origo.x);
        this.hourElements[index].el.set('y', (y * offset) + this.origo.y);
    },

    getHourDistance: function (hour) {
        return hour <= 12 && hour > 0 ? this.area.size * this.outerSize / 2 : this.area.size * this.hourInnerSize / 2;
    },

    getHourAngle: function (hour) {
        hour = hour % 12;
        var degrees = 360 / 12 * hour;
        degrees -= (360 * 3 / 12);
        return ludo.geometry.degreesToRadians(degrees);
    },

    getMinuteAngle: function (minute) {
        var degrees = 360 / 60 * minute;
        degrees -= 90;
        return ludo.geometry.degreesToRadians(degrees);
    },

    positionMinute: function (index) {
        var offset = this.area.size * this.outerSize / 2;
        var angle = this.getMinuteAngle(this.minuteEls[index].minute);
        var x = Math.cos(angle);
        var y = Math.sin(angle);
        this.minuteEls[index].el.set('x', (x * offset) + this.origo.x);
        this.minuteEls[index].el.set('y', (y * offset) + this.origo.y);
    },

    resizeDOM: function () {
        this.parent();
        if (!this.hourGroup)return;
        this.resizeSVG();
    },

    resizeSVG: function () {
        var canvas = this.getCanvas();
        canvas.fitParent();
        var size = Math.min(canvas.width, canvas.height);

        this.area = {
            x: (canvas.width - size) / 2,
            y: (canvas.height - size) / 2,
            size: size
        };

        this.hourGroup.css({
            'font-size': this.area.size / 20
        });
        this.hourGroupInner.css({
            'font-size': this.area.size / 25
        });

        this.needleCircle.set('r', this.area.size / 20);
        this.clipCircle.set('r', this.area.size / 20);

        this.origo = {
            x: canvas.width / 2,
            y: canvas.height / 2
        };

        for (i = 0; i < this.hourElements.length; i++) {
            this.positionHour(i);
            var s = i < 12 ? this.area.size / 20 : this.area.size / 25;
            this.hourElements[i].el.css("font-size", s);
        }
        for (i = 0; i < this.minuteEls.length; i++) {
            this.positionMinute(i);
            this.minuteEls[i].el.css("font-size", this.area.size / 20);
        }

        this.clockBackground.set('cx', this.origo.x);
        this.clockBackground.set('cy', this.origo.y);
        this.clockBackground.set('r', this.area.size / 2);

        this.centerDot.set('cx', this.origo.x);
        this.centerDot.set('cy', this.origo.y);
        this.centerDot.set('r', this.area.size / 70);
        this.needleCircleInnerMinutes.set('r', this.area.size / 150);

        this.needle.set('x1', this.origo.x);
        this.needle.set('y1', this.origo.y);

        this.needleText.css("font-size", this.area.size / 20);

        this.updateNeedle();
    },


    showMinutes: function () {
        this.mode = 'minutes';
        this.hourGroup.hide();
        this.hourGroupInner.hide();
        this.minuteGroup.show();
        this.needleCircleInnerMinutes.show();
        this.updateNeedle();

        this.fireEvent('mode', 'minutes');
    },

    showHours: function () {
        this.mode = 'hours';
        this.hourGroup.show();
        this.hourGroupInner.show();
        this.minuteGroup.hide();
        this.needleCircleInnerMinutes.hide();
        this.updateNeedle();

        /**
         * Mode event, arguments can be "hours" or "minutes"
         * @event ludo.calendar.TimePicker#mode
         * @property {string} mode - "hours" when hour is displayed, "minutes" when minutes is displayed
         * @example
         * var t = new ludo.calendar.TimePicker({
         *      layout:{width:500,height:500},
         *      renderTo:document.body,
         *      listeners:{
         *          'mode' : function(mode){
         *              console.log(mode);
         *          }
         *
         * });
         *
         */
        this.fireEvent('mode', 'hours');
    },

    getTimeString:function(){
        return this.hourPrefixed + ":" + this.minutePrefixed;
    },

    val:function(val){
        if(arguments.length > 0){
            var tokens = val.split(/:/g);
            this.setTime(parseInt(tokens[0]),parseInt(tokens[1]));
        }
        return this.hourPrefixed + ":" + this.minutePrefixed;
    }

});/* ../ludojs/src/menu/item.js */
/**
 * Class for menu items. MenuItems are created dynamically from config object(children of ludo.menu.Menu or ludo.menu.Context)
 * @namespace menu
 * @class MenuItem
 * @augments View
 */
ludo.menu.Item = new Class({
    Extends:ludo.View,
    type:'menu.Item',
    menu:null,
    subMenu:null,
    menuItems:[],
    spacer:undefined,
    /**
     Path to menu item icon or text placed in the icon placeholder. If icon contains one
     or more periods(.) it will be consider an image. Otherwise, config.icon will be displayed
     as plain text
     @config {String} icon
     @default undefined
     @example
        icon: 'my-icon.jpg'
     Sets icon to my-icon.jpg
     @example
        icon : '!'
     sets icon to the character "!", i.e. text
     */
    icon:undefined,
    orientation:'vertical',
    /**
     * Initially disable the menu item
     * @config {Boolean} disabled
     * @default false
     */
    disabled:false,

    /**
     * Text for menu item
     * @config {String} label
     * @default '' empty string
     */
    label:'',
    /**
     * Useful property if you want to apply only one click event for the menu
     * and then determine which menu item was clicked. example:
     *
     * switch(menuItem.action){
     *
     *
     *
     * }
     *
     * @Attribute {String} action
     * @type String
     * @default undefined
     */
    action:undefined,
    record:undefined,

    /**
     * Fire an event with this name on click
     * @config {String} fire
     * @default undefined
     */
    fire:undefined,

    ludoConfig:function (config) {
        this.parent(config);
        this.setConfigParams(config, ['orientation', 'icon', 'record', 'value', 'label', 'action', 'disabled', 'fire']);

        this._html = this._html || this.label;
        if (this._html === '|') {
            this.spacer = true;
            this.layout.height = 1;
		}else{
			this.layout.height = this.layout.height || this.orientation === 'vertical' ? 25 : 'matchParent';
        }

    },

    ludoEvents:function () {
        this.parent();
        if (!this.isSpacer()) {
            this.getEl().on("click", this.click.bind(this));
            this.getEl().mouseenter(this.mouseOver.bind(this));
            this.getEl().mouseleave(this.mouseOut.bind(this));
        }
    },

    resizeDOM:function(){
        this.parent();
        this.getBody().css('lineHeight', this.cachedInnerHeight + 'px');
    },
	resizeParent:function(){

	},

    ludoDOM:function () {
        this.parent();
        this.getEl().addClass('ludo-menu-item');

        if (this.isSpacer()) {
            if (this.orientation === 'horizontal') {
                this.getEl().css('width', 1);
            }
            this.getEl().addClass('ludo-menu-item-spacer-' + this.orientation);
        }

        this.getEl().addClass('ludo-menu-item-' + this.orientation);

        if (this.icon) {
            this.createIcon();
        }

        if (this.disabled) {
            this.disable();
        }

		if(this.children.length){
			var el = this.els.expand = $('<div>');
		    el.addClass('ludo-menu-item-expand');
		    el.addClass('-expand');
		    this.getEl().append(el);
		}
    },

    getLabel:function () {
        return this.label;
    },

    getRecord:function () {
        return this.record;
    },

    ludoRendered:function () {
        this.parent();
        if (this.isSpacer()) {
            this.getBody().css('visibility', 'hidden');
        }
    },

    click:function () {
        if (this.disabled) {
            return;
        }
        this.getEl().addClass('ludo-menu-item-down');
        this.fireEvent('click', this);
        if (this.fire)this.fireEvent(this.fire, this);
    },



    select:function () {
        this.getEl().addClass('ludo-menu-item-selected');
    },

    deselect:function () {
        this.getEl().removeClass('ludo-menu-item-selected');
    },

    /**
     * Disable menu item
     * @function disable
     * @return void
     */
    disable:function () {
        this.disabled = true;
        this.getEl().addClass('ludo-menu-item-disabled');
    },

    /**
     * Return disable state of menu item
     * @function isDisabled
     * @return {Boolean} disabled
     */
    isDisabled:function () {
        return this.disabled;
    },

    /**
     * Enable menu item
     * @function enable
     * @return void
     */
    enable:function () {
        this.disabled = false;
        this.getEl().removeClass('ludo-menu-item-disabled');
    },

    createIcon:function () {
        var el = this.els.icon = $('<div class="ludo-menu-item-icon">');
        el.css({
            'background-position':'center center',
            'background-repeat':'no-repeat',
            'position':'absolute',
            'text-align':'center',
            'left':0,
            'top':0,
            'height':'100%'
        });
        if (this.icon.indexOf('.') >= 0) {
            el.css('background-image', 'url(' + this.icon + ')');
        } else {
            el.html( this.icon);
        }
        this.getEl().append(el);
    },

    mouseOver:function () {
        if (!this.disabled) {
            this.getEl().addClass('ludo-menu-item-over');
        }
        this.fireEvent('enterMenuItem', this);
    },

    mouseOut:function () {
        if (!this.disabled) {
            this.getEl().removeClass('ludo-menu-item-over');
            this.getEl().removeClass('ludo-menu-item-down');
            this.fireEvent('leaveMenuItem', this);
        }
    },

    isSpacer:function () {
        return this.spacer;
    },

    showMenu:function () {
        this.menuHandler.showMenu(this);
    }
});/* ../ludojs/src/menu/menu.js */
/**
 * Menu class
 * @namespace menu
 * @class Menu
 * @augments View
 */
ludo.menu.Menu = new Class({
    Extends : ludo.View,
    type : 'menu.Menu',
    layout:{
		type:'Menu',
		orientation:'vertical',
		width:'wrap',
		height:'wrap'
	},

    addCoreEvents : function(){

    }
});


/* ../ludojs/src/menu/context.js */
/**
 Context menu class. You can create one or more context menus for a component by using the
 ludo.View.contextMenu config array,
 @namespace menu
 @class Context
 @augments menu.Menu
 @constructor
 @param {Object} config
 @example new ludo.Window({
           contextMenu:[{
               selector : '.my-selector',
               children:[{label:'Menu Item 1'},{label:'Menu item 2'}],
               listeners:{
                   click : function(menuItem, menu){
                       // Do something
                   }
               }

           }]
      });
 */
ludo.menu.Context = new Class({
	Extends:ludo.View,
	type:'menu.Context',

	layout:{
		type:'Menu',
		orientation:'vertical',
		width:'wrap',
		height:'wrap',
		active:true,
		isContext:true
	},

	renderTo:document.body,
	/**
	 Show context menu only for DOM nodes matching a CSS selector. The context menu will also
	 be shown if a match is found in one of the parent DOM elements.
	 @attribute selector
	 @type String
	 @default undefined
	 @example {@lang Javascript}
	 selector : '.selected-records'
	 */
	selector:undefined,
	component:undefined,

	// TODO change this code to record:{ keys that has to match }, example: record:{ type:'country' }

	/**
	 Show context menu for records with these properties
	 @config {Object} record
	 @default undefined
	 */
	record:undefined,
	/**
	 Show context menu only for records of a specific type. The component creating the context
	 menu has to have a getRecordByDOM method in order for this to work. These methods are already
	 implemented for tree.Tree and grid.Grid

	 @attribute recordType
	 @type String
	 @default undefined
	 @example {@lang Javascript}
	 recordType : 'city'
	 */
	recordType:undefined,

	/**
	 * Add context menu to this DOM element
	 * @config {String|HTMLElement} contextEl
	 * @default undefined
	 */
	contextEl:undefined,

	ludoConfig:function (config) {
		this.renderTo = document.body;
		this.parent(config);
		this.setConfigParams(config, ['selector', 'recordType', 'record', 'applyTo','contextEl']);
		if (this.recordType)this.record = { type:this.recordType };
	},

	ludoDOM:function () {
		this.parent();
		this.getEl().css('position', 'absolute');
	},
	ludoEvents:function () {
		this.parent();
		$(document.documentElement).on('click', this.hideAfterDelay.bind(this));
		if(this.contextEl){
			$(this.contextEl).on('contextmenu', this.show.bind(this));
		}
	},

	hideAfterDelay:function () {
		if (!this.isHidden()) {
			this.hide.delay(50, this);
		}
	},

	ludoRendered:function () {
		this.parent();
		this.hide();
	},

	/**
	 * when recordType property is defined, this will return the selected record of parent applyTo,
	 * example: record in a tree
	 * @function getSelectedRecord
	 * @return object record
	 */
	getSelectedRecord:function () {
		return this.selectedRecord;
	},

	show:function (e) {
		if (this.selector) {
			var domEl = this.getValidDomElement(e.target);
			if (!domEl) {
				return undefined;
			}
			this.fireEvent('selectorclick', domEl);
		}
		if (this.record) {
			var r = this.applyTo.getRecordByDOM(e.target);
			if (!r)return undefined;
			if (this.isContextMenuFor(r)) {
				this.selectedRecord = r;
			}
		}

        ludo.EffectObject.fireEvents();

		this.getLayout().hideAllMenus();
		this.parent();
		if (!this.getParent()) {
			var el = this.getEl();
			var pos = this.getXAndYPos(e);
			el.css({
				left : pos.x + 'px',
				top : pos.y + 'px'
			});

		}
		return false;
	},

	isContextMenuFor:function (record) {
		for (var key in this.record) {
			if (this.record.hasOwnProperty(key))
				if (!record[key] || this.record[key] !== record[key])return false;
		}
		return true;
	},

	getXAndYPos:function (e) {
		var ret = {
			x:e.pageX,
			y:e.pageY
		};
		var clientWidth = document.body.clientWidth;
		var clientHeight = document.body.clientHeight;
		var size = {
			x: this.getEl().width(), y: this.getEl().height()
		};
		var x = ret.x + size.x;
		var y = ret.y + size.y;

		if (x > clientWidth) {
			ret.x -= (x - clientWidth);
		}
		if (y > clientHeight) {
			ret.y -= (y - clientHeight);
		}
		return ret;
	},

	addCoreEvents:function () {

	},

	getValidDomElement:function (el) {
		el = $(el);
		if (!this.selector) {
			return true;
		}
		var selector = this.selector.replace(/[\.#]/g, '');
		if (el.hasClass(selector) || el.id == selector) {
			return el;
		}
		var parent = el.closest(this.selector);
		if (parent) {
			return parent;
		}
		return false;
	}
});/* ../ludojs/src/menu/drop-down.js */
/**
 * @namespace menu
 * @class DropDown
 * @augments menu.Menu
 *
 */
ludo.menu.DropDown = new Class({
    Extends:ludo.menu.Menu,
    type:'menu.DropDown',

    ludoConfig:function (config) {
        config.renderTo = document.body;
        this.parent(config);
		this.setConfigParams(config, ['applyTo']);
		this.layout.below = this.layout.below || this.applyTo;
		this.layout.alignLeft = this.layout.alignLeft || this.applyTo;
    },

    ludoEvents:function () {
        this.parent();
        document.id(document.documentElement).addEvent('click', this.hideAfterDelay.bind(this));
    },

    hideAfterDelay:function () {
        if (!this.isHidden()) {
            this.hide.delay(50, this);
        }
    },

    toggle:function(){
        if(this.isHidden()){
            this.show();
        }else{
            this.hide();
        }
    }
});/* ../ludojs/src/menu/button.js */
/**
 Menu button arrow which you can apply to DOM Element to have a menu drop down
 below it.
 @namespace menu
 @class Button
 @augments Core
 */
ludo.menu.Button = new Class({
    Extends: ludo.Core,
    width: 15,
    // TODO refactor this class
    /**
     * Render button to this element
     * @attribute renderTo
     * @type {String|DOMElement}
     * @default undefined
     */
    renderTo: undefined,

    /**
     * Button always visible. When false, it will be visible when mouse enters
     * parent DOM element and hidden when it leaves it
     * @attribute alwaysVisible
     * @type {Boolean}
     * default false
     */
    alwaysVisible: false,

    /**
     * Position button in this region. Valid values : 'nw','ne','sw' and 'se'
     * @attribute region
     * @type String
     * @default 'ne'
     */
    region: 'ne',

    el: undefined,

    /**
     * Configuration object for the object to show on click on button
     * @attribute menu
     * @type {View}
     * @default undefined
     */
    menu: undefined,

    menuCreated: false,

    autoPosition: true,

    toggleOnClick: false,

    ludoConfig: function (config) {
        this.parent(config);
        this.setConfigParams(config, ['alwaysVisible', 'region', 'renderTo', 'menu', 'autoPosition', 'toggleOnClick']);
    },

    ludoEvents: function () {
        this.parent();
        this.ludoDOM();
        this.createButtonEvents();
    },

    ludoDOM: function () {
        var el = this.el = $('<div>');
        el.id = 'ludo-menu-button-' + String.uniqueID();
        el.addClass('ludo-menu-button');
        $(this.renderTo).append(el);
        el.css({
            position: 'absolute',
            height: '100%'
        });
        this.createButtonEl();
        this.positionButton();
    },

    createButtonEvents: function () {
        this.buttonEl.on('click', this.toggle.bind(this));
        ludo.EffectObject.addEvent('start', this.hideMenu.bind(this));

        this.buttonEl.mouseenter(this.enterButton.bind(this));
        this.buttonEl.mouseleave(this.leaveButton.bind(this));

        if (!this.alwaysVisible) {
            var el = $(this.renderTo);
            el.on('mouseenter', this.show.bind(this));
            el.on('mouseleave', this.hide.bind(this));
            this.hide();
        } else {
            this.show();
        }
    },

    enterButton: function () {
        this.el.addClass('ludo-menu-button-over');
    },
    leaveButton: function () {
        this.el.removeClass('ludo-menu-button-over');
    },
    toggle: function (e) {
        e.stopPropagation();
        if (this.toggleOnClick && this.menuCreated) {
            this.menu[this.menu.isHidden() ? 'show' : 'hide']();
        } else {
            this.showMenu();
        }
    },

    createButtonEl: function () {
        var el = this.buttonEl = $('<div>');
        el.addClass('ludo-menu-button-arrow');
        this.getEl().append(el);
    },

    positionButton: function () {
        var e = this.getEl();
        var r = this.region;
        if (r == 'ne' || r == 'se')e.css('right', 0);
        if (r == 'nw' || r == 'sw')e.css('left', 0);
        if (r == 'se' || r == 'sw')e.css('bottom', 0);
        if (r == 'ne' || r == 'nw')e.css('top', 0);
    },

    getEl: function () {
        return this.el;
    },

    showMenu: function () {
        if (!this.menuCreated) {
            this.createMenuView();
        }
        if (this.menu._button && this.menu._button !== this.id) {
            var el = ludo.get(this.menu._button);
            if (el)el.hideButton();
        }

        this.menu._button = this.id;
        this.menu.show();

        this.positionMenu();
        this.fireEvent('show', this);
    },

    /**
     This method should be called from function added as event handler to "beforeShow"
     @function cancelShow
     @example
     button.addEvent('beforeShow', function(button){
	 		if(!this.isOkToShowButton()){
	 			button.cancel();
	 		}
	 	});
     */
    cancelShow: function () {
        this.okToShowButton = false;
    },

    hideMenu: function () {
        if (this.menu.hidden)return;
        if (this.menu.hide !== undefined) {
            if (this.menu.getLayout().hideAllMenus)this.menu.getLayout().hideAllMenus();
            this.menu.hide();
        }
        this.hide();
    },

    createMenuView: function () {
        if (this.menu.id) {
            var menu = ludo.get(this.menu.id);
            if (menu)this.menu = menu;
        }
        this.menuCreated = true;
        if (this.menu.getEl === undefined) {
            this.menu.renderTo = document.body;
            this.menu.type = this.menu.type || 'View';
            this.menu.hidden = true;
            this.menu = this.createDependency('menuForButton', this.menu);
            this.menu._button = this.getEl().id;
            $(document.body).on('mouseup', this.autoHideMenu.bind(this));
        } else {
            $(document.body).append(this.menu.getEl());
        }

        this.menu.addEvent('show', this.showIf.bind(this));
        this.menu.addEvent('hide', this.hideButton.bind(this));
        this.menu.getEl().css('position', 'absolute');
        this.menu.getEl().addClass('ludo-menu-button-menu');
    },

    positionMenu: function () {
        if (this.autoPosition) {

            var pos = this.el.offset();
            this.menu.resize({
                left: pos.left,
                top: pos.top + this.el.height()
            });
        }
    },

    showIf: function () {
        if (this.menu._button === this.id) {
            this.show();
        }
    },

    okToShowButton: false,

    show: function () {
        this.okToShowButton = true;
        /**
         * Event fired before button is shown. You can use this event and call
         * the cancel method if there are situations where you don't always want to show the button
         * @event beforeShow
         * @param {menu.Button} this
         */
        this.fireEvent('beforeShow', this);

        if (this.okToShowButton) {
            this.buttonEl.css('display', '');
            this.el.addClass('ludo-menu-button-active');
        }
    },

    hide: function () {
        if (this.menu === undefined || this.menu.isHidden === undefined || this.menu.isHidden()) {
            this.hideButton();
        } else if (this.menu._button !== this.id) {
            this.hideButton();
        }
    },

    hideButton: function () {
        if (this.alwaysVisible)return;
        this.buttonEl.css('display', 'none');
        this.el.removeClass('ludo-menu-button-active');
    },
    getMenuView: function () {
        return this.menu;
    },

    autoHideMenu: function (e) {
        if (!this.menu || this.menu.hidden)return;
        if (!ludo.dom.isInFamilies(e.target, [this.el.id, this.menu.getEl().id])) {
            this.hideMenu();
            this.hideButton();
        }
    }
});/* ../ludojs/src/data-source/tree-collection.js */
/**
 * Special collection class for tree structures.
 * @namespace dataSource
 * @class TreeCollection
 * @augments dataSource.Collection
 */
ludo.dataSource.TreeCollection = new Class({
	Extends:ludo.dataSource.Collection,
	type : 'dataSource.TreeCollection',
	searcherType:'dataSource.TreeCollectionSearch',
	/**
	 * Return children of parent with this id
	 * @function getChildren
	 * @param {String} parent id
	 * @return {Array|undefined} children
	 */
	getChildren:function (parent) {
		var p = this.findRecord(parent);
		if (p) {
			if (!p.children)p.children = [];
			return p.children;
		}
		return undefined;
	},

    fireSelect:function(record){
        this.fireEvent('select', this.getRecord(record));
    },

	addRecordEvents:function(record){
		this.parent(record);
		record.addEvent('addChild', this.indexRecord.bind(this));
		record.addEvent('insertBefore', this.indexRecord.bind(this));
		record.addEvent('insertAfter', this.indexRecord.bind(this));

		var events = ['insertBefore','insertAfter','addChild','removeChild'];
		for(var i=0;i<events.length;i++){
			record.addEvent(events[i], this.fireRecordEvent.bind(this));
		}
	},

	fireRecordEvent:function(record, otherRecord, eventName){
		this.fireEvent(eventName, [record, otherRecord]);
	},

	addSearcherEvents:function(){
        this.searcher.addEvent('match', function(record){
            this.fireEvent('show', this.getRecord(record));
        }.bind(this));
        this.searcher.addEvent('mismatch', function(record){
            this.fireEvent('hide', this.getRecord(record));
        }.bind(this));
	}
});/* ../ludojs/src/tree/tree.js */
/**
 * Tree widget
 * @namespace tree
 * @class Tree
 */
ludo.tree.Tree = new Class({
	Extends:ludo.CollectionView,
    type:'tree.Tree',
	nodeCache:{},
    renderedRecords: {},
	/**
	 String template for nodes in the tree
	 @config {String|Object}
	 @example
	 	tpl : '{title}
	 or as an object:
	 @example
	 	tpl:{
	 		tplKey : 'type',
	 		city : 'City : {city}',
	 		country : 'Country : {country}
	 	}
	 When using an object, "tplKey" is a reference to a common property of all objects, example "type". When type
	 for a node is "city", it will use the city : 'City : {city}' tpl. When it's "country", it will use the "country" tpl.
	 @example
	 	[
			{ id:1, "country":"Japan", "type":"country", "capital":"Tokyo", "population":"13,185,502",
				children:[
					{ id:11, city:'Kobe', "type":"city" },
					{ id:12, city:'Kyoto', "type":"city" },
					{ id:13, city:'Sapporo', "type":"city"},
					{ id:14, city:'Sendai', "type":"city"},
					{ id:15, city:'Kawasaki', "type":"city"}
				]},
			{id:2, "country":"South Korea", "capital":"Seoul", "population":"10,464,051", "type":"country",
				children:[
					{ id:21, city:'Seoul', "type":"city" }

				]},
			{id:3, "country":"Russia", "capital":"Moscow", "population":"10,126,424", "type":"country"},
		]
	 is an example of a data structure for this tpl.
	 */
	tpl : '<span class="ludo-tree-node-spacer"></span> {title}',
	tplKey:undefined,
	dataSource:{
	},
    defaultDS: 'dataSource.TreeCollection',

	/**
	 Default values when not present in node.
	 @config {Object} defaults
	 @default undefined
	 @example
	 	defaults:{
	 		"database" : {
	 			"icon" : "image.gif"
	 		}
	 	}
	 where "database" refers to the record attribute with name defined in categoryKey property of tree(default "type" ).
	 */
	defaults:undefined,

	/**
	 * Key used to defined nodes inside categories. This key is used for default values and node config
	 * @config {String} categoryKey
	 * @default "type"
	 */
	categoryKey : 'type',

	/**
	 Config of tree node categories
	 @config {Object} categoryConfig
	 @example
	 	categoryConfig:{
	 		"database":{
	 			"selectable" : false
	 		}
	 	}
	 */
	categoryConfig:undefined,

	ludoConfig:function(config){
		this.parent(config);
		this.setConfigParams(config, ['defaults','categoryConfig','categoryKey']);
	},

	ludoEvents:function () {
		this.parent();
		if (this.dataSource) {
            this.getDataSource().addEvents({
                'select' : this.selectRecord.bind(this),
                'deselect' : this.deSelectRecord.bind(this),
                'add' : this.addRecord.bind(this),
                'addChild' : this.addChild.bind(this),
                'dispose' : this.removeChild.bind(this),
                'removeChild' : this.removeChild.bind(this),
                'show' : this.showRecord.bind(this),
                'hide' : this.hideRecord.bind(this)
            });


		}
	},

	ludoDOM:function () {
		this.parent();
		this.getBody().css('overflowY', 'auto');
		this.getBody().on("click", this.onClick.bind(this));
		this.getBody().on("dblclick", this.onDblClick.bind(this));


	},

	onClick:function (e) {
		var record = this.getRecordByDOM(e.target);
		if (record) {
			if(e.target.tagName.toLowerCase() === 'span' && this.isSelectable(record)) {
				this.getDataSource().selectRecord(record);
            }
            if($(e.target).hasClass('ludo-tree-node-expand')){
                this.expandOrCollapse(record, e.target);
            }else{
                this.expand(record, e.target);
            }
		}
	},

	onDblClick:function(e){
		var record = this.getRecordByDOM(e.target);
		if(record){
			this.fireEvent('dblClick', record);
		}
	},

	selectRecord:function (record) {
        if(!record.getPlainRecord)record = this.getDataSource().getRecord(record);
		if(!record)return;
        if(!this.isRecordRendered(record))this.showRecord(record);
		var el = this.getDomElement(record, '.ludo-tree-node-plain');
		if (el)el.addClass('ludo-tree-selected-node');
	},

	deSelectRecord:function (record) {
		var el = this.getDomElement(record, '.ludo-tree-node-plain');
		if (el)el.removeClass('ludo-tree-selected-node');
	},

	getDomElement:function (record, cls) {
		var el = this.getDomByRecord(record);
		if (el)return $(el).find(cls).first();
		return undefined;
	},

	expandOrCollapse:function (record, el) {
        el = this.getExpandEl(record);
        var method = el.hasClass('ludo-tree-node-collapse') ? 'collapse' : 'expand';
        this[method](record,el);
	},

	expand:function (record, el) {
		el = this.getExpandEl(record);

        if(!this.areChildrenRendered(record)){

            this.renderChildrenOf(record);
        }
		el.addClass('ludo-tree-node-collapse');
		this.getCachedNode(record, 'children', 'child-container-').css('display', '');
	},

	collapse:function (record, el) {
		el = this.getExpandEl(record);
		el.removeClass('ludo-tree-node-collapse');
		this.getCachedNode(record, 'children', 'child-container-').css('display', 'none');
	},

	getExpandEl:function (record) {
		return this.getCachedNode(record, 'expand', 'expand-');
	},

	getChildContainer:function (record) {
		return this.getCachedNode(record, 'children', 'child-container-');
	},

	hideRecord:function (record) {
        if(this.isRecordRendered(record)){
            this.getCachedNode(record, 'node', '').css('display', 'none');
        }
	},

	showRecord:function (record) {
        if(!this.isRecordRendered(record)){
            this.showRecord(record.getParent());
            this.expand(record.getParent());
            this.showRecord(record.getParent());
        }
		this.getCachedNode(record, 'node', '').css('display', '');
	},

	getDomByRecord:function (record) {
		return record ? this.getCachedNode(record, 'node', '') : undefined;
	},

    isRecordRendered:function(record){
        return this.renderedRecords[record.getUID ? record.getUID() : record.uid] ? true : false;
    },

    areChildrenRendered:function(record){
		record =  record.getUID ? record.record : record;
        return record.children && record.children.length ? this.isRecordRendered(record.children[0]) : false;
    },

	getCachedNode:function (record, cacheKey, idPrefix) {
		if (this.nodeCache[cacheKey] === undefined)this.nodeCache[cacheKey] = {};
		var uid = record.getUID ? record.getUID() : record.uid;
		if (!this.nodeCache[cacheKey][uid]) {
			this.nodeCache[cacheKey][uid] = this.getBody().find("#" + idPrefix + uid);
		}
		return this.nodeCache[cacheKey][uid];
	},

	getRecordByDOM:function (el) {
		var b = this.getBody();
		while (el !== b && (!el.className || el.className.indexOf('ludo-tree-a-node') === -1)) {
			el = el.parentNode;
		}

		if (el)return this.getDataSource().getRecord(el.id);
		return undefined;
	},

	insertJSON:function () {

		this.nodeCache = {};
		this.renderedRecords = {};
		this.nodeContainer().html('');
		this.render();
	},

	render:function () {
		this.parent();
		var data = this.getDataSource().getData();

		this.nodeContainer().html(this.getHtmlForBranch(data));
	},

	getHtmlForBranch:function (branch) {
		var html = [];
		for (var i = 0; i < branch.length; i++) {
			html.push(this.getHtmlFor(branch[i], (i === branch.length - 1), true));
		}
		return html.join('');
	},

    renderChildrenOf:function(record){
        var p = this.getChildContainer(record);
        if(p){
			var c = record.getChildren();
            if(c)p.html(this.getHtmlForBranch(c));
        }
    },

	getHtmlFor:function (record, isLast, includeContainer) {
		var ret = [];

        this.renderedRecords[record.uid] = true;
		if (includeContainer) {
			ret.push('<div class="ludo-tree-a-node ludo-tree-node');
			if (isLast)ret.push(' ludo-tree-node-last-sibling');
			ret.push('" id="' + record.uid + '">');
		}
		ret.push('<div class="ludo-tree-node-plain">');

        ret.push(this.isSelectable(record) ? '<span class="ludo-tree-node-selectable">' : '<span>');
		ret.push(this.getNodeTextFor(record));
		ret.push('</span>');

		ret.push('<div class="ludo-tree-node-expand" id="expand-' + record.uid + '" style="position:absolute;display:' + (record.children && record.children.length ? '' : 'none') + '"></div>');
		ret.push('</div>');

		ret.push('<div class="ludo-tree-node-container" style="display:none" id="child-container-');
		ret.push(record.uid);
		ret.push('">');
		ret.push('</div>');

		if (includeContainer)ret.push('</div>');

        /**
         * Event fired when a node is created
         * @event createNode
         * @param {String} id of DOM node
         * @param {Object} record
         * @param {tree.Tree} tree
         */
        this.fireEvent('createNode', [record.uid, record, this]);
		return ret.join('');
	},

	isSelectable:function (record) {
		if(this.categoryConfig){
			record = record.getUID ? record.getData() : record;
			var config = this.categoryConfig[record[this.categoryKey]];
			return config && config.selectable !== undefined ? config.selectable : true
		}
		return true;
	},

	getNodeTextFor:function (record) {
		var tplFields = this.getTplFields(record);

		var ret = this.getTpl(record);

		for (var i = 0, count = tplFields.length; i < count; i++) {
			var field = tplFields[i];
			ret = ret.replace('{' + field + '}', record[field] ? record[field] : this.getDefaultValue(record, field));
		}

		ret = '<span class="ludo-tree-node-spacer"></span>' + ret;

		return ret;
	},

	getDefaultValue:function(record, field){
		if(this.defaults){
			var key = this.categoryKey;
			return record[key] && this.defaults && this.defaults[record[key]] ? this.defaults[record[key]][field] : '';
		}
		return "";

	},

	tpls:undefined,

	getTpl:function(record){
		return this.tpl['tplKey'] ? this.tpl[record[this.tplKey]] : this.tpl;
	},

	getTplFields:function (record) {
		if (!this.tplFields) {
			if(ludo.util.isString(this.tpl)){
				this.tplFields = this.getTplMatches(this.tpl);
			}else{
				this.tplFields = {};
				var tpl = Object.clone(this.tpl);
				this.tplKey = tpl.tplKey;
				for(var key in tpl){
					if(tpl.hasOwnProperty(key)){
						if(key != 'tplKey')this.tplFields[key] = this.getTplMatches(tpl[key]);
					}
				}
			}

		}
		return this.tplKey ? this.tplFields[record[this.tplKey]] : this.tplFields;
	},

	getTplMatches:function(tpl){
		var matches = tpl.match(/{([^}]+)}/g);
		for (var i = 0; i < matches.length; i++) {
			matches[i] = matches[i].replace(/[{}]/g, '');
		}
		return matches;
	},

	addRecord:function(record){
		this.addChild(record);
	},

	addChild:function (record, parentRecord) {
		var childContainer = parentRecord ? this.getChildContainer(parentRecord) : this.getBody();
		if (childContainer) {
			var node = this.getDomByRecord(record) || this.getNewNodeFor(record);
			childContainer.appendChild(node);
			this.cssBranch(parentRecord ? parentRecord.children : this.getDataSource().data);
			if(parentRecord)this.getExpandEl(parentRecord).style.display='';
		}
	},

	getNewNodeFor:function (record) {
		record = record.getUID ? record.record : record;
		if (!record.uid)this.getDataSource().indexRecord(record);
		return ludo.dom.create({
            cls : 'ludo-tree-a-node ludo-tree-node',
            html : this.getHtmlFor(record, false, false),
            id : record.uid
        });
	},

	cssBranch:function (nodes) {
		var count = nodes.length;
		for (var i = Math.max(0,count-2); i < count; i++) {
			var node = this.getDomByRecord(nodes[i]);
			if (node) {
				if (i < count - 1) {
					node.removeClass('ludo-tree-node-last-sibling');
				} else {
					node.addClass('ludo-tree-node-last-sibling');
				}
			}
		}
	},

	removeChild:function(record){
		var el = this.getDomByRecord(record);
		if(el){
			el.parentNode.removeChild(el);

            delete this.renderedRecords[this.getUID(record)];

			if(record.parentUid){
				var p = this.dataSource.findRecord(record.parentUid);
				if(p)this.cssBranch(p.children);
			}
		}
	},

    getUID:function(record){
        return record.getUID ? record.getUID() : record.uid;
    }
});/* ../ludojs/src/data-source/html.js */
/**
 * Class for remote data source.
 * @namespace dataSource
 * @class HTML
 * @augments dataSource.Base
 */
ludo.dataSource.HTML = new Class({
	Extends:ludo.dataSource.Base,
	type:'dataSource.HTML',

	getSourceType:function () {
		return 'HTML';
	},

	/**
	 * Reload data from server
	 * Components using this data-source will be automatically updated
	 * @function load
	 * @return void
	 */
	load:function () {
		this.parent();
		this.sendRequest(this.service, this.arguments, this.getPostData());

	},

	loadComplete:function (html) {
		this.parent();
		this.data = html;
		this.fireEvent('load', this.data);
	},

	_request:undefined,
	requestHandler:function () {
		if (this._request === undefined) {
			this._request = new ludo.remote.HTML({
				shim:this.shim,
				url:this.url,
				resource:this.resource,
				listeners:{
					"beforeload":function (request) {
						this.fireEvent("beforeload", request);
					},
					"success":function (request) {
						this.loadComplete(request.getResponseData(), request.getResponse());
					}.bind(this),
					"error":function (request) {
						/**
						 * Server error event. Fired when the server didn't handle the request
						 * @event servererror
						 * @param {String} error text
						 * @param {String} error message
						 */
						this.fireEvent('servererror', [request.getResponseMessage(), request.getResponseCode()]);
					}.bind(this)
				}
			});

		}
		return this._request;
	}
});/* ../ludojs/src/data-source/tree-collection-search.js */
/**
 Class created dynamically by dataSource.Collection.
 It is used to search and filter data in a tree collection.
 @namespace dataSource
 @class TreeCollectionSearch
 @augments Core
 */
ludo.dataSource.TreeCollectionSearch = new Class({
	Extends:ludo.dataSource.CollectionSearch,
	matchesFound : false,

	performSearch:function () {
		this.matchesFound = false;
		this.performSearchIn(this.getDataFromSource());
		if(!this.matchesFound){
			this.fireEvent('noMatches');
		}else{
			this.fireEvent('matches');
		}
	},

	performSearchIn:function (data) {
		for (var i = 0; i < data.length; i++) {
			if (this.isMatchingSearch(data[i])) {
				this.searchResult.push(data[i]);
				this.fireEvent('match', data[i]);
				this.matchesFound = true;
				if (data[i].children) {
					this.performSearchIn(data[i].children);
				}
			} else {
				this.fireEvent('mismatch', data[i]);
			}
		}
	}
});/* ../ludojs/src/controller/manager.js */
/**
 * This class connects view modules and controllers
 * @namespace controller
 * @class Manager
 * @augments Core
 */
ludo.controller.Manager = new Class({
    Extends: ludo.Core,
    controllers : [],
    components : [],

    registerController:function(controller){
        this.controllers.push(controller);
        for(var i=0;i<this.components.length;i++){
            var c = this.components[i];
            if(controller.shouldBeControllerFor(c)){
                this.assignControllerTo(controller,c);
            }
        }
    },

    registerComponent:function(component){
        if(!component.hasController()){
            this.components.push(component);
            var controller = this.getControllerFor(component);
            if(controller){
                this.assignControllerTo(controller,component);
            }
        }
    },

    getControllerFor:function(component){
        for(var i=0;i<this.controllers.length;i++){
            if(this.controllers[i].shouldBeControllerFor(component)){
                return this.controllers[i];
            }
        }
		return undefined;
    },

    assignSpecificControllerFor:function(controller, component){
        if (typeof controller === "string") {
            controller = ludo.get(controller);
            if(controller){
                this.assignControllerTo(controller,component);
            }
            return;
        }
        controller = component.createDependency('controller-' + String.uniqueID(), controller);
        this.assignControllerTo(controller,component);
    },

    assignControllerTo:function(controller, component){
        component.setController(controller);
        controller.addBroadcastFor(component);
        controller.addView(component);
    }
});

ludo.controllerManager = new ludo.controller.Manager();/* ../ludojs/src/controller/controller.js */
/**
 * Base class for controllers
 *
 * A controller is by default controller for all components in the same namespace where
 * the useController attribute is set to true. (namespace is
 * determined by component's "type" attribute)
 *
 * You can use the "applyTo" attribute to override this default  applyTo is
 * an array referring to the "module" and "submodule" property of components.
 *
 * example:
 * @example
 *  applyTo:["login", "register"]
 *
 * will set the controller as controller for all components in modules "login" and "register"
 *
 * When creating a new controller, you should extend this class and
 * implement an addView method which takes component as only argument
 * Example:
 *
 * @example
 *  addView:function(view){
 *      view.addEvent('someEvent', this.methodName.bind(this));
 *  }
 *
 * This methods add events to the component.
 *
 * To let the component listen to controller events, implement the addController method
 * for the component(it's defined in ludo.Core)
 *
 * @namespace controller
 * @class controller.Controller
 * @augments Core
 */

ludo.controller.Controller = new Class({
	Extends:ludo.Core,
	type:'controller.Controller',
	/**
	 * Apply controller to components in these modules.
	 * By default a controller will be set as controller for all component
	 * within the same namespace (name space is determined by parsing "type" attribute),
	 * Example:
	 *
	 * You have created a Image Crop module within ludo.app.crop. You have these components there
	 *
	 * ludo.crop.GUI ( View component with type set to "crop.GUI")
	 * ludo.crop.Coordinates (View component with type set to "crop.Coordinates")
	 * ludo.crop.Controller (Controller with type set to "crop.Controller")
	 *
	 * The controller will in this example be set as controller for all components within
	 * the "ludo.crop" namespace.
	 *
	 * (if useController for the component is set to true)
	 * This property is used to override the default
	 * @property applyTo
	 * @type Array
	 * @default undefined
	 */
	applyTo:undefined,
	id:undefined,
	components:[],
	controller:undefined,
	useController:false,

	/**
	 List of events which will be automatically broadcasted,i.e. re-fired by the controller

	 @property broadcast
	 @type Object
	 @example
	 	broadcast:{
			'ns.Component' : ['eventOne',{'viewEventName':'controllerEventName}],
			'ns.ComponentTwo' : ['send','receive']
		}
	 In this example, the controller will listen to "eventOne" and "viewEventName"  of view of "type"
	 ns.Component and re-fire them so that other views can listen to them. The "viewEventName" will
	 be re-fired as a "controllerEventName".
	 */
	broadcast:undefined,

	ludoConfig:function (config) {
		config = config || {};
        config.controller = undefined;
        config.useController = false;

		this.parent(config);
		if (config.broadcast)this.broadcast = config.broadcast;
		ludo.controllerManager.registerController(this);
		if (this['addView'] == undefined) {
			alert('You need to implement an addView method for the controller (' + this.type + ')');
		}
	},

	addBroadcastFor:function (component) {
		if (this.broadcast && this.broadcast[component.type] !== undefined) {
			var ev = this.broadcast[component.type];
			for (var i = 0; i < ev.length; i++) {
				var eventNames = this.getBroadcastEventNames(ev[i]);
				component.addEvent(eventNames.component, this.getBroadcastFn(eventNames.controller).bind(this));
			}
		}
	},

	getBroadcastFn:function (eventName) {
		return function () {
			this.fireEvent(eventName, arguments);
		}
	},

	getBroadcastEventNames:function (event) {
		if (typeof event == 'object') {
			for (var key in event) {
				if (event.hasOwnProperty(key)) {
					return { component:key, controller:event[key] };
				}
			}
		}
		return { component:event, controller:event };
	},

	shouldBeControllerFor:function (component) {
		if(component === this)return false;
		if (!this.applyTo) {
			return this.isInSameNamespaceAs(component);
		}
		var key = this.getModuleKeyFor(component);
		if (this.isAppliedDirectlyToModule(key)) {
			return true;
		}
		return this.isAppliedIndirectlyToModule(key);
	},

	getModuleKeyFor:function (component) {
		return component.module + (component.submodule ? '.' + component.submodule : '');
	},

	isAppliedDirectlyToModule:function (moduleKey) {
		return (this.applyTo.indexOf(moduleKey) === 0);
	},

	isAppliedIndirectlyToModule:function (moduleKey) {
		for (var i = 0; i < this.applyTo.length; i++) {
			if (moduleKey.indexOf(this.applyTo[i]) === 0) {
				return true;
			}
		}
		return false;
	},

	isInSameNamespaceAs:function (component) {
		return this.getNamespace() == component.getNamespace();
	}
});

ludo.getController = function (controller) {
	if (controller.substr) {
		controller = ludo.get(controller);
	}
	return controller;
};/* ../ludojs/src/progress/text.js */
/**
 * Component used to display text for a progress bar, example
 * Step 1 of 10
 * @namespace progress
 * @class Text
 * @augments progress.Base
 */
ludo.progress.Text = new Class({
    Extends:ludo.progress.Base,
    type:'progress.Text',
    width:300,
    height:30,
    stopped:false,
    hidden:true,

    /**
     * Template for text content, example {text}.
     * @property tpl
     * @type String
     */
    tpl : '{text}'
});/* ../ludojs/src/form/toggle-group.js */
/**
 * @namespace ludo.form
 * @class ToggleGroup
 * @augments Core
 */
ludo.form.ToggleGroup = new Class({
    Extends:ludo.Core,
    type:'form.ToggleGroup',
    singleton:true,
    buttons:[],
    activeButton:undefined,

    ludoConfig:function (config) {
        this.parent(config);
    },

    addButton:function (button) {
        this.buttons.push(button);
        button.addEvent('on', this.buttonClickEvent.bind(this));
        button.addEvent('off', this.buttonClickEvent.bind(this));
        if (button.isActive()) {
            this.buttonClick(button);
        }
    },

    buttonClickEvent:function (value, button) {
        this.buttonClick(button);
    },

    buttonClick:function (button) {
        if (this.activeButton && this.activeButton.isActive()) {
            this.activeButton.turnOff();
        }
        if (button.isActive()) {
            this.activeButton = button;
            /**
             * Turn toggle button on
             * @event on
             * @param {String} value, i.e. label of button
             * @param Component this
             */
            this.fireEvent('on', [button.getValue(), button]);
        } else {
            this.activeButton = undefined;
            /**
             * Turn toggle button off
             * @event off
             * @param {String} value, i.e. label of button
             * @param Component this
             */
            this.fireEvent('off', [button.getValue(), button]);
        }
    },
    /**
     * Turn a button in the toggle group on
	 * @function turnOn
     * @param button
     */
    turnOn:function (button) {
        if (button = this.getButton(button)) {
            button.turnOn();
        }
    },
    /**
     * Turn a button in the toggle group on
	 * @function turnOff
     * @param button
     */
    turnOff:function (button) {
        if (button = this.getButton(button)) {
            button.turnOff();
        }
    },

    getButton:function (button) {
        if (ludo.util.type(button) === 'String') {
            for (var i = 0; i < this.buttons.length; i++) {
                if (this.buttons[i].getValue() == button) {
                    return this.buttons[i];
                }
            }
        }
        return button;
    },

    getValue:function(){
        return this.activeButton.getValue();
    }
});/* ../ludojs/src/form/manager.js */
/**
 Form management class. An instance of this class is automatically created for a view if the config.form property is set or after
 after a call to view.getForm() is made.<br>
 new ludo.View({
 	form:{ ... }
 </code>
 You'll get access to the methods of this class from view.getForm().
 @namespace ludo.form
 @class ludo.form.Manager
 @param {Object} config
 @param {Object} config.listeners The form fires events when something is changed with one of the child form views(recursive).
It is convenient to place event handlers here instead of adding them to the individual form views.
 Example: create a form.change event to listen to all changes to child form views.
 @fires ludo.form.Manager#change Event fired when the value of one of the child form view is changed(recursive).
 @fires ludo.form.Manager#valid Event fired when all child form views have a valid value.
 @fires ludo.form.Manager#invalid Event fired when one or more child form views have invalid value.
 @fires ludo.form.Manager#clean A form is considered clean when none of it's values has changed from it's original. Otherwise it's considered dirty. The clean event
 is fired when the form is clean.
 @fires ludo.form.Manager#dirty Fired when the form is dirty.
 @example
var view = new ludo.View({
	children:[
		{ type:'form.Text', label:'First name', name:'firstname' },
		{ type:'form.Text', label:'Last name', name:'lastname' }
	]
});

view.getForm().val("firstname", "John"); // update all form views with name "firstname" with the value "John"
view.getForm().val("lastname", "Doe"); // update all form veiws with name "lastname" with the value "Doe"

// Return form values as JSON { "firstname": "John", "lastname": "Doe" }
var json = view.getForm().values();

 */
ludo.form.Manager = new Class({
	Extends:ludo.Core,
	/**
	 * @attribute {ludo.View} view Reference to the forms view
	 * @memberof ludo.form.Manager.prototype
	 */
	view:null,
	formComponents:[],
	map:{},
	fileUploadComponents:[],
	progressBar:undefined,
	invalidIds:[],
	dirtyIds:[],
	form:{
		method:'post'
	},

    method:undefined,
    url:undefined,
	currentId:undefined,
    /**
     * Autoload data from server on creation
     * @config {Boolean} autoLoad
     * @default false
     */
    autoLoad:false,
    /**
     Event listeners for the events fired by the form.
     user.
     @config {Object} listeners
     @default undefined
     @example
        new ludo.View({
            form:{
                "resource": "User",
                listeners:{
                    "saved": function(){
                        new ludo.Notification({ html : 'Your changes has been saved' });
                    }
                }
            },
            children:[
                {
                    type:"form.Text", name:"firstname"
                },
                {
                    type:"form.Text", name:"lastname"
                }
            ]
        });
     */
    listeners:undefined,

    /**
     Read arguments sent when autoLoad is set to true
     @config {String|Number} arguments
     @default undefined
     @example
        form:{
	 		url:'controller.php',
	 		resource:'Person',
	 		arguments:100,
	 		autoLoad:true
	 	}
     will send request 'Person/100/read' to controller.php.
     */
    arguments:undefined,

	ludoConfig:function (config) {
		this.view = config.view;
		config.form = config.form || {};

        this.setConfigParams(config.form, ['method', 'url','autoLoad']);

		this.id = String.uniqueID();

		if (config.form.listeners !== undefined) {
			this.addEvents(config.form.listeners);
		}
		this.getFormElements();

		if(this.autoLoad){
			this.read(config.form.arguments);
		}
	},

	/**
	 * Get all form elements, store them in an array and add valid and invalid events to them
	 * @function getFormElements
	 * @memberof ludo.form.Manager.prototype
	 */
	getFormElements:function () {
		if (!this.view.isRendered) {
			this.getFormElements.delay(100, this);
			return;
		}

		var children = this.view.getAllChildren();
		children.push(this.view);

		var c;
		for (var i = 0, len = children.length; i < len; i++) {
			c = children[i];
			if (c['getProgressBarId'] !== undefined) {
				this.registerProgressBar(c);
			}
			else if (c.isFormElement() && c.submittable) {
				this.registerFormElement(c);
			}
		}

		this.fireEvent((this.invalidIds.length == 0) ? 'valid' : 'invalid');
		this.fireEvent((this.dirtyIds.length == 0) ? 'clean' : 'dirty');
	},

	registerFormElement:function (c) {
		if (this.formComponents.indexOf(c) >= 0) {
			return;
		}

		this.map[c.name] = c;

		if(this.record && this.record[c.name]){
			c.val(this.record[c.name]);
		}

		if (c.isFileUploadComponent) {
			this.fileUploadComponents.push(c);
		}
		this.formComponents.push(c);

		c.addEvents({
			'valid':this.onValid.bind(this),
			'invalid':this.onInvalid.bind(this),
			'dirty':this.onDirty.bind(this),
			'clean':this.onClean.bind(this),
			'change':this.onChange.bind(this)
		});

		if (!c.isValid()) {
			this.invalidIds.push(c.getId());
		}

		if (c.isDirty()) {
			this.dirtyIds.push(c.getId());
		}
	},

	/**
	 * Populate form fields with data from JSON object
	 * @function populate
	 * @memberof ludo.form.Manager.prototype
	 * @param {Object} json JSON object
	 * @example
	 * var view = new ludo.View({
	 * 	renderTo:document.body,
	 * 	layout:{ type:'linear', orientation:'vertical', width:'matchParent', height:'matchParent' },
	 * 	children:[
	 * 		{ type:'form.Text', name:'firstname' },
	 * 		{ type:'form.Text', name:'lastname' }
	 * 	]
	 * });
	 * // Update form views firstname and lastname with values from JSON
	 * view.getForm.populate({
	 * 	"firstname" : "Jane", "lastname": "Anderson"
	 * });
	 *
     */
	populate:function(json) {
		$.each(json, this.set.bind(this));
	},


    /**
     * Set value of a form element
     * @function set
	 * @memberOf ludo.form.Manager.prototype
     * @param {String} name name of form element
     * @param {String|Number|Object} value
     */
	set:function(name, value){
		if(this.map[name]){
			this.map[name].val(value);
		}
	},

	/**
	 * Set OR get value of form component.
	 * Called with two arguments(key and value), a value will be set. Called with one argument(key), value will be returned.
	 * @function val
	 * @memberOf ludo.form.Manager.prototype
	 * @param key
	 * @param value
	 * @example
	 * view.getForm().val('firstname', 'Hannah');
	 * var firstneame = view.getForm().val('firstname');
     */
	val:function(key, value){
		if(arguments.length == 2){
			this.set(key, value);
		}

		return this.get(key);
	},

	/**
	 * Returns values of all form elements in JSON format.
	 * This method can be called on all views. It will return a JSON containing key-value pairs for all the views form elements(nested, i.e. children, grand children etc)
	 * @function values
	 * @memberOf ludo.form.Manager.prototype
	 * @returns {{}}
     */
	values:function(){
		var ret = {};
		for (var i = 0; i < this.formComponents.length; i++) {
			var el = this.formComponents[i];
			ret[el.getName()] = el.val();
		}

		return ret;
	},

    /**
     * Return value of form element.
     * @function get
	 * @memberOf ludo.form.Manager.prototype
     * @param {String} name Name of form element
     * @return {String|Number|Object}
     */
	get:function(name){
		return this.map[name] ? this.map[name].val() : undefined;
	},

	registerProgressBar:function (view) {
		if (!this.progressBar) {
			this.progressBar = view;
		}
	},

	onDirty:function (value, formComponent) {
		var elId = formComponent.getId();
		if (this.dirtyIds.indexOf(elId) == -1) {
			this.dirtyIds.push(elId);
		}
		/**
		 * @event dirty
		 * @description Fired when value of one or more form views are different from their original start value
		 * @param {Object} formComponent
		 */
		this.fireEvent('dirty', formComponent);
	},

	onClean:function (value, formComponent) {
		this.dirtyIds.erase(formComponent.getId());

		if (this.dirtyIds.length === 0) {
			/**
			 * @event clean
			 * @description Fired when value of all views are equal to their original start value
			 */
			this.fireEvent('clean');
		}
	},

	onChange:function (value, formComponent) {
		/**
		 * Event fired when a form element has been changed
		 * @event change
		 * @param {ludo.form.Manager} form
		 * @param {ludo.form.Element} form element
		 *
		 */
		this.fireEvent('change', [this, formComponent])
	},
	/**
	 * One form element is valid. Fire valid event if all form elements are valid
	 * @function onValid
	 * @private
	 * @param {String} value
	 * @param {object } formComponent
	 */
	onValid:function (value, formComponent) {
		this.invalidIds.erase(formComponent.getId());
		if (this.invalidIds.length == 0) {
			/**
			 * @event valid
			 * @param {Object} form.Manager
			 * @description form.SubmitButton listens to this event which is fired
			 * when all form elements inside a view are valid. The submit button will
			 * be enabled automatically when this event is fired.
			 */
			this.fireEvent('valid', this);
		}
	},
	/**
	 * Set view invalid when a form element inside it is invalid
	 *
	 * @function onInvalid
	 * @private
	 * @param {String} value
	 * @param {Object} formComponent
	 */
	onInvalid:function (value, formComponent) {
		var elId = formComponent.getId();
		if (this.invalidIds.indexOf(elId) == -1) {
			this.invalidIds.push(elId);
		}
		/**
		 * @event invalid
		 * @param {Object} form.Manager
		 * @description form.SubmitButton listens to this event which is fired
		 * when one or more form elements inside a view is invalid. The submit
		 * button will be disabled automatically when this event is fired.
		 */
		this.fireEvent('invalid', this);
	},
	/**
	 * Validate form and fire "invalid" or "valid" event
	 * @function validate
	 * @return void
	 */
	validate:function () {
		if (this.invalidIds.length > 0) {
			this.fireEvent('invalid', this);
		} else {
			this.fireEvent('valid', this);
		}
	},
	/**
	 * Returns true when all child form views are valid
	 * @function isValid
	 * @memberOf ludo.form.Manager.prototype
	 */
	isValid:function () {
		return this.invalidIds.length === 0;
	},

	/**
	 * Submit form to server
	 * @function submit
	 * @private
	 */
	submit:function () {
		this.save();
	},

	getUnfinishedFileUploadComponent:function () {
		for (var i = 0; i < this.fileUploadComponents.length; i++) {
			if (this.fileUploadComponents[i].hasFileToUpload()) {
				this.fileUploadComponents[i].addEvent('submit', this.save.bind(this));
				return this.fileUploadComponents[i];
			}
		}
		return undefined;
	},

	save:function () {
		if (this.getUrl() || ludo.config.getUrl()) {
			var el;
			if (el = this.getUnfinishedFileUploadComponent()) {
				el.upload();
				return;
			}

			this.fireEvent('invalid');
			this.fireEvent('beforeSave');
			this.beforeRequest();
			this.requestHandler().send('save', this.currentId, this.values(),
				{
					"progressBarId":this.getProgressBarId()
				}
			);
		}
	},

	/**
	 * Read form values from the server
	 * @function read
	 * @param {String|undefined} id
	 */
	read:function(id){
		this.fireEvent('beforeRead');
		this.beforeRequest();
		this.currentIdToBeSet = id;
		this.readHandler().sendToServer('read', id);
	},

	_readHandler:undefined,

	readHandler:function(){
		if(this._readHandler === undefined){
			this._readHandler = this.getDependency('readHandler', new ludo.remote.JSON({
				url:this.url,
				method:this.method ? this.method : 'post',
				service : 'read',
				listeners:{
					"success":function (request) {
						this.currentId = this.currentIdToBeSet;
						this.populate(this.record);
						this.commit();

						/**
						 * Event fired after data for the form has been read successfully
						 * To add listeners, use <br>
						 * ludo.View.getForm().addEvent('success', fn);
						 * @event read
						 * @param {Object} JSON response from server
						 */
						this.fireEvent('read', [request.getResponse(), this.view]);
						if (this.isValid()) {
							this.fireEvent('valid');
						}
						this.fireEvent('clean');

						this.afterRequest();

					}.bind(this),
					"failure":function (request) {
						this.fireEvent('failure', [request.getResponse(), this.view]);
						this.afterRequest();
					}.bind(this),
					"error":function (request) {
						this.fireEvent('servererror', [request.getResponseMessage(), request.getResponseCode()]);
						this.fireEvent('valid', this);
						this.afterRequest();
					}.bind(this)
				}
			}));
		}
		return this._readHandler;
	},

	_request:undefined,
	requestHandler:function () {
		if (this._request === undefined) {
			if (!this.resource)ludo.util.warn("Warning: form does not have a resource property. Falling back to default: 'Form'");
			this._request = this.createDependency('_request', new ludo.remote.JSON({
				url:this.url,
				method:this.method ? this.method : 'post',
				listeners:{
					"success":function (request) {
						this.commit();
						/**
						 * Event fired after a form has been saved successfully.
						 * To add listeners, use <br>
						 * ludo.View.getForm().addEvent('success', fn);
						 * @event saved
						 * @param {Object} JSON response from server
						 */
						this.fireEvent('saved', [request.getResponse(), this.view]);

						this.setCurrentId(request.getResponseData());

						this.fireEvent('success', [request.getResponse(), this.view]);
						if (this.isValid()) {
							this.fireEvent('valid');
						}
						this.fireEvent('clean');

						this.afterRequest();

					}.bind(this),
					"failure":function (request) {
						if (this.isValid()) {
							this.fireEvent('valid');
						}

						/**
						 * Event fired after form submission when success parameter in response is false.
						 * To add listeners, use <br>
						 * ludo.View.getForm().addEvent('failure', fn);<br>
						 * @event failure
						 * @param {Object} JSON response from server
						 * @param {Object} Component
						 */

						this.fireEvent('failure', [request.getResponse(), this.view]);

						this.afterRequest();
					}.bind(this),
					"error":function (request) {
						/**
						 * Server error event. Fired when the server didn't handle the request
						 * @event servererror
						 * @param {String} error text
						 * @param {String} error message
						 */
						this.fireEvent('servererror', [request.getResponseMessage(), request.getResponseCode()]);
						this.fireEvent('valid', this);

						this.afterRequest();
					}.bind(this)
				}
			}));
		}
		return this._request;
	},

	afterRequest:function(){
		/**
		 * Event fired after read, save and delete requests has been completed with or without failures
		 * @event requestComplete
		 */
		this.fireEvent('afterRequest');
	},

	beforeRequest:function(){
		/**
		 * Event fired before read, save and delete request
		 * @event requestComplete
		 */
		this.fireEvent('beforeRequest');
	},
	
	setCurrentId:function(data){

		if(!isNaN(data)){
			this.currentId = data;
		}
		if(ludo.util.isObject(data)){
			this.currentId = data.id;
		}
	},

	getProgressBarId:function () {
		return this.progressBar ? this.progressBar.getProgressBarId() : undefined;
	},

	/**
	 * Commit all form Views. This will reset the dirty flag. The dirty flag is true when on form view has been updated.
	 * A later call to {@link ludo.form.Manager#reset|reset} will reset all form Views back to the value it had when commit was called.
	 * with a new value.
	 * @function commit
	 * @memberof ludo.form.Manager.prototype
	 */
	commit:function () {
		for (var i = 0; i < this.formComponents.length; i++) {
			this.formComponents[i].commit();
		}
	},

	/**
	 * Reset value of all form Views back to it's original value. 
	 * @method reset
	 * @memberof ludo.form.Manager.prototype
	 */

	reset:function () {
		for (var i = 0; i < this.formComponents.length; i++) {
			this.formComponents[i].reset();
		}
		this.dirtyIds = [];
		this.fireEvent('clean');
		this.fireEvent('reset');
	},

	newRecord:function(){
		/**
		 * Event fired when newRecord is called, i.e. when the form is cleared and currentId unset.
		 * @event new
		 */
		this.fireEvent('new');
		this.currentId = undefined;
		this.clear();
	},

	/**
	 * Clear value of all child form views
	 * @function clear
	 * @memberof ludo.form.Manager.prototype
	 */
	clear:function () {
		for (var i = 0; i < this.formComponents.length; i++) {
			this.formComponents[i].clear();
		}

		this.dirtyIds = [];
		this.fireEvent('clean');
		this.fireEvent('clear');
	},

	/**
	 * Returns true if a form View has been updated with a new value. This is useful for handling disabling/enabling of buttons
	 * based on changes made to the form. The dirty flag can be reset by calling the {@link ludo.form.Manager#commit} method. This will
	 * call commit on all form views.
	 * @function isDirty
	 * @memberof ludo.form.Manager.prototype
	 */
	isDirty:function () {
		return this.dirtyIds.length > 0;
	}
});/* ../ludojs/src/form/submit-button.js */
/**
 * Special Button for form submission.
 * This button will automatically be disabled when a form is invalid, and automatically enabled when it's valid.
 * A form consists of all form elements of parent component, including form elements of child components.
 * @namespace ludo.form
 * @class SubmitButton
 * @augments ludo.form.Button
 */
ludo.form.SubmitButton = new Class({
	Extends:ludo.form.Button,
	type:'form.SubmitButton',
	value:'Submit',
	disableOnInvalid:true,
	/**
	 * Apply submit button to form of this LudoJS component. If not defined, it will be applied
     * to parent view.
	 * @config {String|View} applyTo
	 * @default undefined
	 */
	applyTo:undefined,
	ludoConfig:function(config){
		this.parent(config);
		this.setConfigParams(config, ['applyTo']);
	},

	ludoRendered:function () {
		this.parent();
		this.applyTo = this.applyTo ? ludo.get(this.applyTo) : this.getParentComponent();

		if (this.applyTo) {
            var form = this.applyTo.getForm();
			form.addEvent('valid', this.enable.bind(this));
			form.addEvent('invalid', this.disable.bind(this));
			form.addEvent('clean', this.disable.bind(this));
			form.addEvent('dirty', this.enable.bind(this));

            this.checkValidity.delay(100, this);
		}

		this.addEvent('click', this.submit.bind(this));
	},

    checkValidity:function(){
        if(this.applyTo.getForm().isValid()){
            this.enable();
        }else{
            this.disable();
        }
    },

	submit:function () {
		if (this.applyTo) {
			this.applyTo.getForm().submit();
		}
	}
});/* ../ludojs/src/form/cancel-button.js */
/**
 * Cancel button. This is a pre-configured ludo.form.Button which will close/hide parent view(or view defined in
 * applyTo) on click.
 * Default value of this button is "Cancel".
 * @namespace ludo.form
 * @class CancelButton
 * @augments ludo.form.Button
 */
ludo.form.CancelButton = new Class({
    Extends:ludo.form.Button,
    type:'form.CancelButton',
    /**
     * @attribute value
     * @description Default value of button
     * @default 'Cancel'
     */
    value:'Cancel',

	/**
	 * Apply cancel button to form of this LudoJS component. If not defined, it
     * will be applied to parent view.
	 * @config {String|View} applyTo
	 * @default undefined
	 */
	applyTo:undefined,

	ludoConfig:function(config){
		this.parent(config);
		this.setConfigParams(config, ['applyTo']);
	},

    ludoRendered:function () {
        this.parent();
        this.applyTo = this.applyTo ? ludo.get(this.applyTo) : this.getParentComponent();
        this.addEvent('click', this.hideComponent.bind(this));
    },

    hideComponent:function () {
        if (this.applyTo) {
            this.applyTo.hide();
        }
    }
});/* ../ludojs/src/form/text.js */
/**
 * Text Input View
 * This class inherits from <a href="ludo.form.Element.html">ludo.form.Element</a>.
 * @namespace ludo.form
 * @class ludo.form.Text
 * @description Form input text
 *  @param {Object} config Configuration when creating the View. These properties and properties from superclass is available
 * @param {String} config.name Name of element. A call to parentView.getForm().values() will return &lt;name> : &lt;value>.
 * @param {String} config.placeholder Placeholder attribute for the input. Displayed when value is empty. (Default:undefined)
 * @param {Number} config.minLength Defines required min length of value(count characters). (Default:undefined)
 * @param {Number} config.maxLength Defines required max length of value(count characters)
 * @param {Boolean} config.ucFirst True to automatically Uppercase first letter. (Default: false)
 * @param {RegExp} config.regex Regular expression used for validation, example: regex: /$[0-9]{3}^/ to require 3 digits. (Default:undefined)
 * @param {Boolean} config.readonly True to make this form field read only. (Default: false)
 * @param {Boolean} config.selectOnFocus Automatically make the text selected on focus. Default: false
 * @param {Boolean} config.validateKeyStrokes True to run validation after every key stroke(Default: false)

 * @augments ludo.form.Element
 *
 */
ludo.form.Text = new Class({
    Extends: ludo.form.Element,
    type: 'form.Text',
    labelWidth: 100,
    defaultValue: '',
    placeholder:'',
    /**
     * Max length of input field
     * @attribute maxLength
     * @type int
     * @default undefined
     */
    maxLength: undefined,

    /**
     * Minimum length of value. invalid event will be fired when
     * value is too short. The value will be trimmed before checking size
     * @attribute minLength
     * @type {Number}
     * @default undefined
     */
    minLength: undefined,

    /**
     * When true, capitalize first letter automatically
     * @attribute {Boolean} ucFirst
     * @default false
     */
    ucFirst: false,

    /**
     When true, capitalize first letter of every word while typing
     Note! ucWords is not an option for ludo.form.Textarea
     @attribute {Boolean} ucWords
     @default false
     */
    ucWords: false,

    inputType: 'text',
    inputTag: 'input',
    regex: undefined,
    validateKeyStrokes: false,
    formFieldWidth: undefined,

    /**
     * True to apply readonly attribute to element
     * @config {Boolean} readonly
     * @default false
     */
    readonly: false,
    selectOnFocus: false,


    ludoConfig: function (config) {
        this.parent(config);
        var keys = ['placeholder', 'selectOnFocus', 'regex', 'minLength', 'maxLength', 'defaultValue', 'validateKeyStrokes', 'ucFirst', 'ucWords', 'readonly'];
        this.setConfigParams(config, keys);
        if (this.regex && ludo.util.isString(this.regex)) {
            var tokens = this.regex.split(/\//g);
            var flags = tokens.length > 1 ? tokens.pop() : '';
            this.regex = new RegExp(tokens.join('/'), flags);
        }
        this.applyValidatorFns(['minLength', 'maxLength', 'regex']);

        if(this.layout.height == undefined){
            this.layout.height = 20;
        }

    },

    ludoDOM:function(){
        this.parent();
        if(this.placeholder){
            this.getFormEl().attr('placeholder', this.placeholder);
        }
    },

    ludoEvents: function () {
        this.parent();
        var el = this.getFormEl();
        if (this.ucFirst || this.ucWords) {
            this.addEvent('blur', this.upperCaseWords.bind(this));
        }
        this.addEvent('blur', this.validate.bind(this));
        if (this.validateKeyStrokes) {
            el.on('keydown', this.validateKey.bind(this));
        }
        el.parent().addClass('ludo-form-text-element');
        el.on('keyup', this.sendKeyEvent.bind(this));

        if (this.selectOnFocus) {
            el.on('focus', this.selectText.bind(this));
        }
    },

    sendKeyEvent: function () {
        /**
         * Event fired when a key is pressed
         * @event key
         * @param {String} value
         */
        this.fireEvent('key', this.els.formEl.val());
    },

    validateKey: function (e) {
        if (!e.control && !e.alt && this.regex && e.key && e.key.length == 1) {
            if (!this.regex.test(e.key)) {
                return false;
            }
        }
        return undefined;
    },
    /**
     * Return width of input field in pixels.
     * @function getFieldWidth
     * @return {Number} width
     */
    getFieldWidth: function () {
        return this.formFieldWidth;
    },
    /**
     * Focus form element
     * @function focus
     * @return void
     */
    focus: function () {
        this.parent();
        if (!this.getFormEl().is(":focus")) {
            this.getFormEl().focus();
        }
    },

    validate: function () {
        var valid = this.parent();
        if (!valid && !this._focus) {
            this.getEl().addClass('ludo-form-el-invalid');
        }
        return valid;
    },
    keyUp: function (e) {
        this.parent(e);
        if (this.validateKeyStrokes) {
            this.validate();
        }
    },

    upperCaseWords: function () {
        if (this.ucFirst || this.ucWords) {
            var val = this.getValueOfFormEl();
            if (val.length == 0) {
                return;
            }
            if (this.ucWords && val.length > 1) {
                var tokens = val.split(/\s/g);
                for (var i = 0; i < tokens.length; i++) {
                    if (tokens[i].length == 1) {
                        tokens[i] = tokens[i].toUpperCase();
                    } else {
                        tokens[i] = tokens[i].substr(0, 1).toUpperCase() + tokens[i].substr(1);
                    }
                }
                this.getFormEl().val(tokens.join(' '));
            }
            else {
                val = val.substr(0, 1).toUpperCase() + val.substr(1);
                this.getFormEl().val(val);
            }
        }
    },

    hasSelection: function () {
        var start = this.getSelectionStart();
        var end = this.getSelectionEnd();
        return end > start;
    },

    selectText: function () {
        this.getFormEl().select();
    },

    getSelectionStart: function () {
        if (this.els.formEl.createTextRange) {
            var r = document.selection.createRange().duplicate();
            r.moveEnd('character', this.els.formEl.val().length);
            if (r.text == '') return this.els.formEl.val().length;
            return this.els.formEl.val().lastIndexOf(r.text);
        } else return this.els.formEl.selectionStart;
    },

    getSelectionEnd: function () {
        if (this.els.formEl.createTextRange) {
            var r = document.selection.createRange().duplicate();
            r.moveStart('character', -this.els.formEl.val().length);
            return r.text.length;
        } else return this.els.formEl.selectionEnd;
    }
});
/* ../ludojs/src/form/combo.js */
/**
 * A text field with combo button. Click on the combo button will child view beneath the text input
 *
 * @namespace ludo.form
 * @class Combo
 * @augments ludo.form.Element
 */
ludo.form.Combo = new Class({
    Extends:ludo.form.Text,
    type:'form.Combo',
    layout:{
        type:'popup'
    },

	menuButton:undefined,

    /**
     Custom layout properties of child
     @config {Object} childLayout
     @default undefined
     @example
        childLayout:{
            width:300,height:300
        }
     Default layout properties will be applied when
     */
    childLayout:undefined,

    ludoConfig:function(config){
        this.parent(config);
        this.childLayout = config.childLayout || this.childLayout;
    },

    ludoRendered:function(){
        this.parent();

        ludo.Form.addEvent('focus', this.autoHide.bind(this));

        var c = this.children[0];
        c.layout = c.layout || {};
        if(this.childLayout)c.layout = Object.merge(c.layout, this.childLayout);

        c.layout.below = c.layout.below || this.getBody();
        if(c.left === undefined)c.layout.alignLeft = c.layout.alignLeft || this.getBody();
        if(!c.layout.width)c.layout.sameWidthAs = c.layout.sameWidthAs || this.getBody();
        c.layout.height = c.layout.height || 200;
        c.alwaysInFront = true;
        c.cls = c.cls ? c.cls + ' ' + 'form-combo-child' : 'form-combo-child';

		this.createDependency('menuButton', new ludo.menu.Button({
			type:'menu.Button',
			renderTo: this.getInputCell(),
			alwaysVisible:true,
			region:'ne',
			autoPosition:false,
			menu:this.children[0],
			toggleOnClick:true,
			listeners:{
				show:function(){
					this.fireEvent('showCombo');
				}.bind(this)
			}
		}));

        this.children[0].addEvent('show', this.focus.bind(this));
    },

    autoHide:function(focused){
        if(focused.isButton && focused.isButton())return;
        if(focused !== this && !focused.isChildOf(this.children[0])){
            this.children[0].hide();
        }
    },

    hideMenu:function(){
        this.children[0].hide();
    }
});
/* ../ludojs/src/form/date.js */
/**
 * Date picker
 * @namespace ludo.form
 * @class Date
 * @augments ludo.form.Combo
 */
ludo.form.Date = new Class({
    Extends: ludo.form.Combo,
    children:[{
       type:'calendar.Calendar'
    }],
    /**
     * Display format, example: Y/m/d
     * @config {String} displayFormat
     * @default Y-m-d
     */
    displayFormat : 'Y-m-d',
    /**
     * Format of date returned by getValue method.
     * @config {String} inputFormat
     * @default Y-m-d
     */
    inputFormat : 'Y-m-d',
    childLayout:{
        width:250,height:250
    },

    ludoConfig:function(config){
        this.parent(config);
        this.setConfigParams(config, ['displayFormat','inputFormat']);

        this.displayFormat = this.displayFormat.replace(/([a-z])/gi, '%$1');
        this.inputFormat = this.inputFormat.replace(/([a-z])/gi, '%$1');
        this.value = this.value ? ludo.util.parseDate(this.value, this.inputFormat) :undefined;
        this.initialValue = this.constructorValue = this.value;
    },


    ludoRendered:function(){
        this.parent();
        this.setFormElValue(this.value);
    },

    addChild:function(child){
        child.value = this.value || new Date();

        this.parent(child);
        this.children[0].addEvent('change', function(date){
            this._set(ludo.util.parseDate(date, this.inputFormat));
            this.blur();
        }.bind(this));
    },
    ludoEvents:function(){
        this.parent();
        this.addEvent('showCombo', function(){
            this.children[0].setDate(this.value ? ludo.util.parseDate(this.value, this.displayFormat) : new Date());
        }.bind(this));

    },

    setValue:function(value){
        console.warn("Use of deprecated setValue");
        console.trace();
        value = value ? ludo.util.parseDate(value, this.displayFormat) : value;
        if(value && value.getYear && isNaN(value.getYear()))value = undefined;
        this.parent(value);
    },
    getValue:function(){
        console.warn("Use of deprecated getValue");
        console.trace();
        return this.value ? ludo.util.parseDate(this.value, this.displayFormat).format(this.inputFormat) : undefined;
    },

    val:function(value){
        if(arguments.length == 0){
            return this.value ? ludo.util.parseDate(this.value, this.displayFormat).format(this.inputFormat) : undefined;
        }  
        this._set(value);
    },
    
    _set:function(value){
        value = value ? ludo.util.parseDate(value, this.displayFormat) : value;
        if(value && value.getYear && isNaN(value.getYear()))value = undefined;
        this.parent(value);
    },
    
    setFormElValue:function(value){
        if (this.els.formEl && this.els.formEl.val() !== value) {
            value = value ? ludo.util.isString(value) ? value : value.format(this.displayFormat) : '';
            this.els.formEl.val(value);
        }
        this.children[0].hide();
    }
});/* ../ludojs/src/form/color.js */
ludo.form.Color = new Class({
	Extends:ludo.form.Combo,
	regex:/^#[0-9A-F]{6}$/i,
	childLayout:{
		width:290, height:250
	},

	getClassChildren:function () {
		return [
			{
				layout:{
					'type':'tabs'
				},
				cls:'ludo-tabs-in-dropdown',
				bodyCls:'ludo-tabs-in-dropdown-body',
				children:[

					{
						title:ludo.language.get('RGB'),
						type:'color.RgbColors',
						name:'rgbColors',
						value:this.value,
						listeners:{
							'setColor':this.receiveColor.bind(this),
							'render':this.setInitialWidgetValue.bind(this)
						}
					},{
						title:ludo.language.get('Named Colors'),
						type:'color.NamedColors',
						name:'boxes',
						value:this.value,
						listeners:{
							'setColor':this.receiveColor.bind(this),
							'render':this.setInitialWidgetValue.bind(this)
						}
					},
					{
                        name:'slider',
						title:ludo.language.get('Color Slider'),
						type:'color.RGBSlider',
						value:this.value,
						listeners:{
							'setColor':this.receiveColor.bind(this),
							'render':this.setInitialWidgetValue.bind(this)
						}

					}
				]
			}
		];
	},

	setInitialWidgetValue:function (widget) {
		widget.setColor(this.value);
	},

	ludoEvents:function () {
		this.parent();
		this.addEvent('change', this.updateWidgets.bind(this));
	},

	updateWidgets:function () {
		var c = this.getColorWidgets();
		for (var i = 0; i < c.length; i++) {
			if (c[i].setColor) {
				c[i].setColor(this.value);
			}
		}
	},

	receiveColor:function (color) {
		this.val(color);
		this.hideMenu();
	},

	getColorWidgets:function () {
		return this.children[0].children;
	}
});/* ../ludojs/src/form/reset-button.js */
/**
 * Special Button used to reset all form fields of component back to it's original state.
 * This button will automatically be disabled when the form is "clean", and disabled when it's "dirty".
 * @namespace ludo.form
 * @class ResetButton
 * @augments ludo.form.Button
 */
ludo.form.ResetButton = new Class({
    Extends:ludo.form.Button,
    type:'form.ResetButton',
    /**
     * Value of button
     * @attribute {String} value
     * @default 'Reset'
     */
    value:'Reset',
    // TODO create parent class for ResetButton, DeleteButton etc.
    applyTo:undefined,

    ludoConfig:function(config){
        this.parent(config);
        this.setConfigParams(config, ['applyTo']);
    },
    
    ludoRendered:function () {
        this.parent();
        this.applyTo = this.applyTo ? ludo.get(this.applyTo) : this.getParentComponent();
        var manager = this.applyTo.getForm();
        if (this.applyTo) {
            manager.addEvent('dirty', this.enable.bind(this));
            manager.addEvent('clean', this.disable.bind(this));
        }

        if(!manager.isDirty()){
            this.disable();
        }
        this.addEvent('click', this.reset.bind(this));
    },

    reset:function () {
        if (this.applyTo) {
            this.applyTo.getForm().reset();
        }
    }
});/* ../ludojs/src/form/combo-tree.js */
/**
 * @namespace ludo.form
 * @class ComboTree
 * @description A "combo" where you select value from a tree. id of clicked tree node will be set as
 * value.
 * @augments ludo.form.Element
 */
ludo.form.ComboTree = new Class({
    Extends:ludo.form.Element,
    type:'form.ComboTree',
    cssSignature:'form-combo',
    /**
     * Configuration for tree panel. It can be a new config for ludo.tree.Tree or
     * a simple reference to your own pre-configured tree, example:
     * { width: 500, height: 500, type: 'myApp.tree.Folders'
     * 'myApp.tree.Folders' will here be  class named ludo.myApp.tree.Folders
     * This is an example of a custom made ludo.tree.Tree:<br>
     * ludo.chess.view.folder.Tree = new Class({<br>
     Extends:ludo.tree.Tree,<br>
     module:'folder.tree',<br>
     remote:{<br>
     url:window.ludo.chess.URL,<br>
     data:{<br>
     getFolders:1<br>
     }<br>
     },<br>
     nodeTpl:'<img src="' + window.ludo.chess.ROOT + 'images/{icon}"><span>{title}</span>',<br><br>

     recordConfig:{<br>
     'folder':{<br>
     selectable:false,<br>
     defaults:{<br>
     icon:'folder.png'<br>
     }<br>
     },<br>
     'database':{<br>
     selectable:true,<br>
     defaults:{<br>
     icon:'database.png'<br>
     }<br>
     }<br>
     },<br><br>

     treeConfig:{<br>
     defaultValues:{<br>
     icon:'folder.png'<br>
     }<br>
     },<br>
     <br>
     ludoEvents:function () {<br>
     this.parent();<br>
     this.addEvent('selectrecord', this.selectDatabase.bind(this));<br>
     },<br>
     <br>
     selectDatabase:function (record) {<br>
     this.fireEvent('selectdatabase', record);<br>
     }<br>
     });
     * @attribute treeConfig
	 * @type Object
     * @default undefined
     */
    treeConfig:undefined,

    /**
     * Text to display in combo when no value is selected
     * @attribute emptyText
	 * @type String
     * @default '' (empty string);
     */
    emptyText:'',

    width:400,
    height:26,
    /**
     *
     * @attribute Object inputConfig
     *
     */
    inputConfig:{
        fieldWidth:440,
        labelWidth:1,
        width:350
    },
    selectedRecord:undefined,
    layout:{
        type:'cols'
    },
    treePanel:undefined,
    input:undefined,
    searchable:false,
    timeStamp:0,
    currentSearchValue:'',

    ludoConfig:function (config) {
        this.parent(config);
        this.setConfigParams(config, ['searchable','inputConfig','treeConfig','emptyText']);

        if (this.treeConfig.type === undefined)this.treeConfig.type = 'tree.Tree';
        this.inputConfig.type = 'form.Text';
        this.inputConfig.stretchField = true;
    },

    ludoEvents:function () {
        this.parent();
        $(document.body).on('mousedown', this.autoHide.bind(this));
    },

    ludoDOM:function () {
        if (this.label) {
            this.addChild({
                html:'<label>' + this.label + ':</label>',
                width:this.labelWidth
            });
        }

        this.viewField = this.addChild({
            type:'form.ComboField',
            weight:1
        });
        this.viewField.addEvent('click', this.showTree.bind(this));

        this.input = this.addChild(this.inputConfig);
        this.input.addEvent('focus', this.showTree.bind(this));
        this.input.addEvent('focus', this.selectInputText.bind(this));
        this.input.addEvent('blur', this.blurInput.bind(this));
        this.input.addEvent('key_up', this.filter.bind(this));
        this.input.addEvent('key_down', this.keyDown.bind(this));
        this.input.hide();

        this.treePanel = new ludo.Window({
            cls:'ludo-Filter-Tree-Window',
            width:this.treeConfig.width,
            alwaysInFront:true,
            resizeTop:false,
            resizeLeft:false,
            minWidth:this.fieldWidth,
            height:this.treeConfig.height,
            titleBar:false,
            renderTo:document.body,
            layout:'fill',
            children:[this.treeConfig]
        });
        this.treePanel.hide();
        this.treePanel.addEvent('beforeresize', this.setBusy.bind(this));
        this.treePanel.addEvent('afterresize', this.setNotBusy.bind(this));

        this.treePanel.children[0].getDataSource().addEvent('select', this.receiveSelectedRecord.bind(this));

        this.parent();

        this.getEl().addClass('ludo-filter-tree');

        this.resize.delay(100, this);

        this.resizeChildren();
    },

    ludoRendered:function () {
        this.parent();
        if (this.emptyText) {
            this.setViewValue(this.emptyText);
        }
    },

    busyWithResize:false,

    setBusy:function () {
        this.busyWithResize = true;
    },

    setNotBusy:function () {
        this.setNotBusyAfterDelay.delay(500, this);
    },

    setNotBusyAfterDelay:function () {
        this.busyWithResize = false;
    },

    arrowClick:function () {
        if (this.treePanel.isHidden()) {
            this.selectInputText();
            this.showTree();
        } else {
            this.hideTree();
        }
    },

    selectInputText:function () {
        this.input.getFormEl().select();
    },
    blurInput:function () {
        this.input.getFormEl().removeClass('ludo-filter-tree-input-active');
    },

    autoHide:function (e) {
        if (this.busyWithResize) {
            return;
        }
        if (!this.treePanel.isVisible()) {
            return;
        }
        var el = e.target;

        if (el.id == this.input.getFormEl().id || el.hasClass('ludo-shim-resize')) {
            return;
        }
        var viewField = this.viewField.getEl();
        if (el.id == viewField.id || el.getParent('#' + viewField.id)) {
            return;
        }
        if (el.getParent('.ludo-shim-resize')) {
            return;
        }
        if (!el.getParent('#' + this.input.getFormEl().id) && !el.getParent('#' + this.treePanel.id)) {
            this.hideTree();
        }
    },

    hideTree:function () {
        this.treePanel.hide();
        if (this.searchable) {
            this.input.hide();
            this.viewField.show();
        }
    },

    keyDown:function (key) {
        if (key === 'esc' || key == 'tab') {
            this.hideTree();
        }
    },

    filter:function (key) {
        if (key === 'esc') {
            return;
        }
        this.treePanel.show();

        var val = this.input._get();
        if (val == this.currentSearchValue) {
            return;
        }
        var d = new Date();
        this.timeStamp = d.getTime();

        this.filterAfterDelay(this.input._get());
        this.currentSearchValue = val;
    },

    filterAfterDelay:function (val) {
        var d = new Date();
        if (d.getTime() - this.timeStamp < 200) {
            this.filterAfterDelay.delay(100, this, val);
            return;
        }
        this.timeStamp = d.getTime();
        if (val == this.input._get()) {
            this.treePanel.children[0].filter(this.input.val());
        }
    },

    showTree:function () {

        if (this.searchable) {
            this.viewField.hide();
            this.input.show();
            this.input.getFormEl().addClass('ludo-filter-tree-input-active');
            this.input.getFormEl().focus();
        }

        this.treePanel.show();

        this.positionTree();
        this.resizeChildren();

        this.treePanel.increaseZIndex();
    },

    setViewValue:function (value) {
        this.input.val(value);
        this.viewField.setViewValue(value);
    },

    positionTree:function () {
        var el;
        if (this.searchable) {
            el = this.input.getEl();

        } else {
            el = this.viewField.getEl();
        }
        var pos = el.getCoordinates();
        this.treePanel.setPosition({
            left:pos.left,
            top:pos.top + el.getSize().y
        });
    },

    getFormEl:function () {
          return this.input.getFormEl();
    },

    selectRecord:function (record) {
        this.treePanel.children[0].selectRecord(record);
    },

    receiveSelectedRecord:function (record) {

        this.val(record.get('id'));
        this.setViewValue(record.get('title'));
        this.fireEvent('selectrecord', [this, record.getData()]);
        this.hideTree.delay(100, this);
    },

    /**
     * No arguments = Return id of selected record
     * @function getValue
     * @return {String} id (tree.selectedRecord.id);
     */
    val:function(value){
        if(arguments.length == 0){
            return this.value;
        }
        this.parent(value);
    },

    /**
     * Return id of selected record
     * @function getValue
     * @return {String} id (tree.selectedRecord.id);
     */
    getValue:function () {
        console.warn("Use of deprecated getValue");
        console.trace();
        return this.value;
    },

    /**
     * Return selected record
     * @function getSelectedRecord
     * @return object record
     */
    getSelectedRecord:function () {
        return this.treePanel.children[0].getSelectedRecord();
    },

    getParentRecord:function (record) {
        return this.treePanel.children[0].getParentRecord(record);
    }
});

ludo.form.ComboField = new Class({
    Extends:ludo.View,
    cls:'ludo-Filter-Tree-Combo-Field',

    ludoEvents:function () {
        this.parent();
        this.getBody().addEvent('click', this.clickEvent.bind(this));
    },

    clickEvent:function () {
        this.fireEvent('click');
    },

    setViewValue:function (value) {
        this.els.valueField.html( value);
    },

    ludoDOM:function () {
        this.parent();
        var el = $('<div>');
        el.addClass('ludo-Filter-Tree-Field-Arrow');
        this.getBody().append(el);

        var left = $('<div>');
        left.addClass('ludo-Filter-Tree-Bg-Left');
        this.getBody().append(left);
        var right = $('<div>');
        right.addClass('ludo-Filter-Tree-Bg-Right');
        this.getBody().append(right);

        var valueField = this.els.valueField = $('<div>');
        valueField.addClass('ludo-Filter-Tree-Combo-Value');
        this.getBody().append(valueField);
    }
});/* ../ludojs/src/form/hidden.js */
ludo.form.Hidden = new Class({
    Extends: ludo.form.Element,
    type : 'form.Hidden',
    labelWidth : 0,
    defaultValue : '',
    hidden: false,

	elCss:{
		display : 'none'
	},

    ludoDOM : function() {
        this.parent();
        this.els.formEl = new Element('input');
        this.els.formEl.attr('type', 'hidden');
        this.els.formEl.id = this.getFormElId();
        this.getBody().append(this.els.formEl);
    },

    ludoRendered : function(){
        this.parent();
        this.hide();
    },
    getHeight : function(){
        return 0;
    },
    getWidth : function(){
        return 0;
    }
});/* ../ludojs/src/form/textarea.js */
/**
 * Text Area field
 * @namespace ludo.form
 * @class Textarea
 * @augments ludo.form.Element
 */
ludo.form.Textarea = new Class({
    Extends:ludo.form.Text,
    type:'form.Textarea',
    inputType:undefined,
    inputTag:'textarea',
    overflow:'hidden',

    ludoConfig:function (config) {
        this.parent(config);
        this.ucWords = false;
    },

    ludoRendered:function(){
        this.parent();
        this.els.formEl.css({
            paddingRight:0,paddingTop:0
        });
    },
    resizeDOM:function () {
        this.parent();
		/*
        var w;
        if (!this.label) {
            w = this.getInnerWidthOfBody();
            if (w <= 0)return;
        }else{
            var p = this.els.formEl.parentNode;
            w = (p.offsetWidth - ludo.dom.getBW(p) - ludo.dom.getPW(p));
        }

        if(this.stretchField)w-=10;

        this.els.formEl.setStyle('width', (w - 10) + 'px');
        */

        if (this.layout && this.layout.weight) {
            var height = this.getEl().offsetHeight;
            height -= (ludo.dom.getMBPH(this.getEl()) + ludo.dom.getMBPH(this.getBody()) + ludo.dom.getMH(this.els.formEl.parent()));
			height -=1;
            if (height > 0) {
                this.els.formEl.style.height = height+'px';
            }
        }
    }
});/* ../ludojs/src/form/display-field.js */
/**
 * Read only field, used for display only
 * @namespace ludo.form
 * @class DisplayField
 * @augments ludo.form.Text
 */
ludo.form.DisplayField = new Class({
	Extends:ludo.form.Element,
	type:'form.DisplayField',
	inputTag:'span',
	inputType:'',

	/** Custom tpl for the display field
	 @attribute tpl
	 @type String
	 @default ''
	 @example
	 	tpl:'<a href="mailto:{value}">{value}</a>'
	 {value} will in this example be replaced by value of DisplayField.
	 */
	tpl:'',
	setValue:function (value) {
		console.warn("Use of deprecated setValue");
		console.trace();
		if (!value) {
			this.getFormEl().html( '');
			return;
		}
		this.setTextContent(value);
	},

	val:function(value){
		if(arguments.length == 0){
			return this._get();
		}
		if (!value) {
			this.getFormEl().html( '');
			return;
		}
		this.setTextContent(value);
	},

	ludoRendered:function(){
		this.parent();
		this.setTextContent(this.value);
	},

	setTextContent:function(value){
        var html = this.tpl ? this.getTplParser().getCompiled({ value:value }) : value ? value : '';
        this.getFormEl().html( html);
	},

	isValid:function () {
		return true;
	},

	getValue:function () {
		return this.value;
	},

    supportsInlineLabel:function(){
        return false;
    }
});/* ../ludojs/src/form/checkbox.js */
/**
 * Class for checkbox form elements
 * @class ludo.form.Checkbox
 * @augments ludo.form.LabelElement
 */
ludo.form.Checkbox = new Class({
    Extends:ludo.form.LabelElement,
    type:'form.Checkbox',
    inputType:'checkbox',
    stretchField:false,
    labelWidth:undefined,
    /**
     * Image to be displayed above the checkbox-/radio button
     * @attribute image (Path to image).
     * @type string
     * @default null
     */
    image:undefined,
    /**
     * Initial state
     * @attribute {Boolean} checked
     * @type {Boolean}
     * @default false
     */
    checked:false,
    height:undefined,
    labelSuffix : '',

    fieldTpl:['<table ','cellpadding="0" cellspacing="0" border="0" width="100%">',
        '<tbody>',
        '<tr class="checkbox-image-row" style="display:none">',
        '<td colspan="2" class="input-image"></td>',
        '</tr>',
        '<tr class="input-row">',
        '<td class="input-cell" style="width:30px"></td>',
        '<td><label class="input-label"></label></td>',
        '<td class="suffix-cell" style="display:none"><label></label></td>',
        '</tr>',
        '</tbody>',
        '</table>'
    ],

    ludoConfig:function (config) {
        config = config || {};
        config.value = config.value || '1';
        this.parent(config);
        this.setConfigParams(config, ['inputType','image','checked']);
        this.initialValue = this.constructorValue = this.checked ? this.value : '';
    },

    ludoDOM:function () {
        this.parent();
        if (this.image) {
            this.addRadioImage();
        }
    },

    addInput:function () {
        var id = this.getFormElId();
        var radio;
        if (Browser.ie && parseInt(Browser.version) < 9) {
            radio = document.createElement('<input type="' + this.inputType + '" name="' + this.getName() + '" value="' + this.value + '" id="' + id + '">');
            this.getInputCell().append(radio);
            this.els.formEl = document.id(radio);
        } else {
            radio = this.els.formEl = $('<input type="' + this.inputType + '" id="' + id + '" value="' + this.value + '" name="' + this.getName() + '">');
            this.getInputCell().append(radio);

        }
        this.els.formEl.on('click', this.toggleImage.bind(this));
        if(this.inputType === 'checkbox'){
            this.els.formEl.on('click', this.valueChange.bind(this));
        }
        if (this.checked) {
            this.getFormEl().checked = true;
            this.toggleImage();
        }
    },

    addRadioImage:function () {
        var div = this.els.radioImageDiv = $('<div>');
        var radioDivInner = $('<div>');
        radioDivInner.addClass('ludo-radio-image-inner');
        radioDivInner.setStyles({
            'width':'100%',
            'height':'100%',
            'background' : 'url(' + this.image + ') no-repeat center center'
        });

        div.append(radioDivInner);
        div.addClass('ludo-radio-image');
        div.addEvent('click', this.clickOnImage.bind(this));
        this.getImageCell().append(div);
        this.getBody().getElement('.checkbox-image-row').style.display = '';
    },

    getImageCell:function () {
        return this.getCell('.input-image','imageCell');
    },

    setWidthOfLabel:function () {

    },

    clickOnImage:function () {
        if (this.inputType === 'checkbox') {
            this.setChecked(!this.isChecked());
        } else {
            this.check();
        }
    },
    /**
     * Return true if checkbox is checked, false otherwise
     * @function isChecked
     * @return {Boolean} checked
     */
    isChecked:function () {
        return this.getFormEl().attr('checked') ? true : false;
    },
    /**
     * Set checkbox to checked
     * @function check
     * @return void
     */
    check:function () {
        if (!this.isChecked()) {
            this.setChecked(true);
        }
    },
    /**
     * Uncheck checkbox
     * @function uncheck
     * @return void
     */
    uncheck:function () {
        if (this.isChecked()) {
            this.setChecked(false);
        }
    },

    focus:function () {

    },

    blur:function () {

    },

    getValue:function(){
        console.warn("Use of deprecated getValue");
        console.trace();
        return this.isChecked() ? this.getFormEl().val() : '';
    },

    _get:function () {
        return this.isChecked() ? this.getFormEl().val() : '';
    },
    /**
     * Set checkbox to checked or unchecked
     * @function setChecked
     * @param {Boolean} checked
     */
    setChecked:function (checked) {
        this.setCheckedProperty(checked);
        this.fireEvent('change', [this._get(), this]);
        this.value = this._get();
        this.toggleImage();
        this.toggleDirtyFlag();
    },

    setCheckedProperty:function(checked){
        if(checked){
            this.getFormEl().attr('checked', '1');
        }else{
            this.getFormEl().removeAttr('checked');
        }
    },

    valueChange:function(){
        this.value = this.isChecked() ? this.getFormEl().val() : '';
        this.toggleDirtyFlag();
    },

    reset:function(){
        this.setCheckedProperty(this.initialValue ? true : false);
        this.fireEvent('valueChange', [this._get(), this]);
        this.toggleImage();
    },

    toggleImage:function () {
        if (this.els.radioImageDiv) {
            if (this.isChecked()) {
                this.els.radioImageDiv.addClass('ludo-radio-image-checked');
            } else {
                this.els.radioImageDiv.removeClass('ludo-radio-image-checked');
            }
        }
    },

    supportsInlineLabel:function(){
        return false;
    }
});/* ../ludojs/src/form/radio.js */
/**
 * Radio button
 * @namespace ludo.form
 * @class Radio
 * @augments ludo.form.Checkbox
 */
ludo.form.Radio = new Class({
    Extends:ludo.form.Checkbox,
    type:'form.Radio',
    inputType:'radio'
});/* ../ludojs/src/external/md5.js */
/*
 Javascript MD5 library - version 0.4

 Coded (2011) by Luigi Galli - LG@4e71.org - http://faultylabs.com

 Thanks to: Roberto Viola

 The below code is PUBLIC DOMAIN - NO WARRANTY!

 Changelog:
            Version 0.4   - 2011-06-19
            + added compact version (md5_compact_min.js), this is a slower but smaller version
              (more than 4KB lighter before stripping/minification)
            + added preliminary support for Typed Arrays (see:
              https://developer.mozilla.org/en/JavaScript_typed_arrays and
              http://www.khronos.org/registry/typedarray/specs/latest/)
              MD5() now accepts input data as ArrayBuffer, Float32Array, Float64Array,
              Int16Array, Int32Array, Int8Array, Uint16Array, Uint32Array or Uint8Array
            - moved unit tests to md5_test.js
            - minor refactoring

            Version 0.3.* - 2011-06-##
            - Internal dev versions

            Version 0.2 - 2011-05-22
            ** FIXED: serious integer overflow problems which could cause a wrong MD5 hash being returned

            Version 0.1 - 2011
            -Initial version
*/

if (typeof faultylabs == 'undefined') {
    faultylabs = {}
}

/*
   MD5()

    Computes the MD5 hash for the given input data

    input :  data as String - (Assumes Unicode code points are encoded as UTF-8. If you
                               attempt to digest Unicode strings using other encodings
                               you will get incorrect results!)

             data as array of characters - (Assumes Unicode code points are encoded as UTF-8. If you
                              attempt to digest Unicode strings using other encodings
                              you will get incorrect results!)

             data as array of bytes (plain javascript array of integer numbers)

             data as ArrayBuffer (see: https://developer.mozilla.org/en/JavaScript_typed_arrays)

             data as Float32Array, Float64Array, Int16Array, Int32Array, Int8Array, Uint16Array, Uint32Array or Uint8Array (see: https://developer.mozilla.org/en/JavaScript_typed_arrays)

             (DataView is not supported yet)

   output: MD5 hash (as Hex Uppercase String)
*/

faultylabs.MD5 = function(data) {

    // convert number to (unsigned) 32 bit hex, zero filled string
    function to_zerofilled_hex(n) {
        var t1 = (n >>> 0).toString(16);
        return "00000000".substr(0, 8 - t1.length) + t1
    }

    // convert array of chars to array of bytes
    function chars_to_bytes(ac) {
        var retval = [];
        for (var i = 0; i < ac.length; i++) {
            retval = retval.concat(str_to_bytes(ac[i]))
        }
        return retval
    }


    // convert a 64 bit unsigned number to array of bytes. Little endian
    function int64_to_bytes(num) {
        var retval = [];
        for (var i = 0; i < 8; i++) {
            retval.push(num & 0xFF);
            num = num >>> 8;
        }
        return retval;
    }

    //  32 bit left-rotation
    function rol(num, places) {
        return ((num << places) & 0xFFFFFFFF) | (num >>> (32 - places));
    }

    // The 4 MD5 functions
    function fF(b, c, d) {
        return (b & c) | (~b & d);
    }

    function fG(b, c, d) {
        return (d & b) | (~d & c);
    }

    function fH(b, c, d) {
        return b ^ c ^ d;
    }

    function fI(b, c, d) {
        return c ^ (b | ~d);
    }

    // pick 4 bytes at specified offset. Little-endian is assumed
    function bytes_to_int32(arr, off) {
        return (arr[off + 3] << 24) | (arr[off + 2] << 16) | (arr[off + 1] << 8) | (arr[off])
    }

    /*
    Conver string to array of bytes in UTF-8 encoding
    See:
    http://www.dangrossman.info/2007/05/25/handling-utf-8-in-javascript-php-and-non-utf8-databases/
    http://stackoverflow.com/questions/1240408/reading-bytes-from-a-javascript-string
    How about a String.getBytes(<ENCODING>) for Javascript!? Isn't it time to add it?
    */
    function str_to_bytes(str) {
        var retval = [ ];
        for (var i = 0; i < str.length; i++)
            if (str.charCodeAt(i) <= 0x7F) {
                retval.push(str.charCodeAt(i))
            } else {
                var tmp = encodeURIComponent(str.charAt(i)).substr(1).split('%');
                for (var j = 0; j < tmp.length; j++) {
                    retval.push(parseInt(tmp[j], 0x10))
                }
            }
        return retval
    }


    // convert the 4 32-bit buffers to a 128 bit hex string. (Little-endian is assumed)
    function int128le_to_hex(a, b, c, d) {
        var ra = "";
        var t = 0;
        var ta = 0;
        for (var i = 3; i >= 0; i--) {
            ta = arguments[i];
            t = (ta & 0xFF);
            ta = ta >>> 8;
            t = t << 8;
            t = t | (ta & 0xFF);
            ta = ta >>> 8;
            t = t << 8;
            t = t | (ta & 0xFF);
            ta = ta >>> 8;
            t = t << 8;
            t = t | ta;
            ra = ra + to_zerofilled_hex(t);
        }
        return ra
    }

    // conversion from typed byte array to plain javascript array
    function typed_to_plain(tarr) {
        var retval = new Array(tarr.length);
        for (var i = 0; i < tarr.length; i++) {
            retval[i] = tarr[i];
        }
        return retval;
    }

    // check input data type and perform conversions if needed
    var databytes = null;
    // String
    var type_mismatch = null;
    if (typeof data == 'string') {
        // convert string to array bytes
        databytes = str_to_bytes(data);
    } else if (data.constructor == Array) {
        if (data.length === 0) {
            // if it's empty, just assume array of bytes
            databytes = data
        } else if (typeof data[0] == 'string') {
            databytes = chars_to_bytes(data);
        } else if (typeof data[0] == 'number') {
            databytes = data;
        } else {
            type_mismatch = typeof data[0];
        }
    } else if (typeof ArrayBuffer != 'undefined') {
        if (data instanceof ArrayBuffer) {
            databytes = typed_to_plain(new Uint8Array(data));
        } else if ((data instanceof Uint8Array) || (data instanceof Int8Array)) {
            databytes = typed_to_plain(data)
        } else if ((data instanceof Uint32Array) || (data instanceof Int32Array) ||
               (data instanceof Uint16Array) || (data instanceof Int16Array) ||
               (data instanceof Float32Array) || (data instanceof Float64Array)
         ) {
            databytes = typed_to_plain(new Uint8Array(data.buffer));
        } else {
            type_mismatch = typeof data;
        }
    } else {
        type_mismatch = typeof data;
    }

    if (type_mismatch) {
        alert('MD5 type mismatch, cannot process ' + type_mismatch)
    }

    function _add(n1, n2) {
        return 0x0FFFFFFFF & (n1 + n2)
    }


    return do_digest();

    function do_digest() {

        // function update partial state for each run
        function updateRun(nf, sin32, dw32, b32) {
            var temp = d;
            d = c;
            c = b;
            //b = b + rol(a + (nf + (sin32 + dw32)), b32)
            b = _add(b,
                rol(
                    _add(a,
                        _add(nf, _add(sin32, dw32))
                    ), b32
                )
            );
            a = temp
        }

        // save original length
        var org_len = databytes.length;

        // first append the "1" + 7x "0"
        databytes.push(0x80);

        // determine required amount of padding
        var tail = databytes.length % 64;
        // no room for msg length?
        if (tail > 56) {
            // pad to next 512 bit block
            for (var i = 0; i < (64 - tail); i++) {
                databytes.push(0x0);
            }
            tail = databytes.length % 64;
        }
        for (i = 0; i < (56 - tail); i++) {
            databytes.push(0x0);
        }
        // message length in bits mod 512 should now be 448
        // append 64 bit, little-endian original msg length (in *bits*!)
        databytes = databytes.concat(int64_to_bytes(org_len * 8));

        // initialize 4x32 bit state
        var h0 = 0x67452301;
        var h1 = 0xEFCDAB89;
        var h2 = 0x98BADCFE;
        var h3 = 0x10325476;

        // temp buffers
        var a = 0, b = 0, c = 0, d = 0;

        // Digest message
        for (i = 0; i < databytes.length / 64; i++) {
            // initialize run
            a = h0;
            b = h1;
            c = h2;
            d = h3;

            var ptr = i * 64;

            // do 64 runs
            updateRun(fF(b, c, d), 0xd76aa478, bytes_to_int32(databytes, ptr), 7);
            updateRun(fF(b, c, d), 0xe8c7b756, bytes_to_int32(databytes, ptr + 4), 12);
            updateRun(fF(b, c, d), 0x242070db, bytes_to_int32(databytes, ptr + 8), 17);
            updateRun(fF(b, c, d), 0xc1bdceee, bytes_to_int32(databytes, ptr + 12), 22);
            updateRun(fF(b, c, d), 0xf57c0faf, bytes_to_int32(databytes, ptr + 16), 7);
            updateRun(fF(b, c, d), 0x4787c62a, bytes_to_int32(databytes, ptr + 20), 12);
            updateRun(fF(b, c, d), 0xa8304613, bytes_to_int32(databytes, ptr + 24), 17);
            updateRun(fF(b, c, d), 0xfd469501, bytes_to_int32(databytes, ptr + 28), 22);
            updateRun(fF(b, c, d), 0x698098d8, bytes_to_int32(databytes, ptr + 32), 7);
            updateRun(fF(b, c, d), 0x8b44f7af, bytes_to_int32(databytes, ptr + 36), 12);
            updateRun(fF(b, c, d), 0xffff5bb1, bytes_to_int32(databytes, ptr + 40), 17);
            updateRun(fF(b, c, d), 0x895cd7be, bytes_to_int32(databytes, ptr + 44), 22);
            updateRun(fF(b, c, d), 0x6b901122, bytes_to_int32(databytes, ptr + 48), 7);
            updateRun(fF(b, c, d), 0xfd987193, bytes_to_int32(databytes, ptr + 52), 12);
            updateRun(fF(b, c, d), 0xa679438e, bytes_to_int32(databytes, ptr + 56), 17);
            updateRun(fF(b, c, d), 0x49b40821, bytes_to_int32(databytes, ptr + 60), 22);
            updateRun(fG(b, c, d), 0xf61e2562, bytes_to_int32(databytes, ptr + 4), 5);
            updateRun(fG(b, c, d), 0xc040b340, bytes_to_int32(databytes, ptr + 24), 9);
            updateRun(fG(b, c, d), 0x265e5a51, bytes_to_int32(databytes, ptr + 44), 14);
            updateRun(fG(b, c, d), 0xe9b6c7aa, bytes_to_int32(databytes, ptr), 20);
            updateRun(fG(b, c, d), 0xd62f105d, bytes_to_int32(databytes, ptr + 20), 5);
            updateRun(fG(b, c, d), 0x2441453, bytes_to_int32(databytes, ptr + 40), 9);
            updateRun(fG(b, c, d), 0xd8a1e681, bytes_to_int32(databytes, ptr + 60), 14);
            updateRun(fG(b, c, d), 0xe7d3fbc8, bytes_to_int32(databytes, ptr + 16), 20);
            updateRun(fG(b, c, d), 0x21e1cde6, bytes_to_int32(databytes, ptr + 36), 5);
            updateRun(fG(b, c, d), 0xc33707d6, bytes_to_int32(databytes, ptr + 56), 9);
            updateRun(fG(b, c, d), 0xf4d50d87, bytes_to_int32(databytes, ptr + 12), 14);
            updateRun(fG(b, c, d), 0x455a14ed, bytes_to_int32(databytes, ptr + 32), 20);
            updateRun(fG(b, c, d), 0xa9e3e905, bytes_to_int32(databytes, ptr + 52), 5);
            updateRun(fG(b, c, d), 0xfcefa3f8, bytes_to_int32(databytes, ptr + 8), 9);
            updateRun(fG(b, c, d), 0x676f02d9, bytes_to_int32(databytes, ptr + 28), 14);
            updateRun(fG(b, c, d), 0x8d2a4c8a, bytes_to_int32(databytes, ptr + 48), 20);
            updateRun(fH(b, c, d), 0xfffa3942, bytes_to_int32(databytes, ptr + 20), 4);
            updateRun(fH(b, c, d), 0x8771f681, bytes_to_int32(databytes, ptr + 32), 11);
            updateRun(fH(b, c, d), 0x6d9d6122, bytes_to_int32(databytes, ptr + 44), 16);
            updateRun(fH(b, c, d), 0xfde5380c, bytes_to_int32(databytes, ptr + 56), 23);
            updateRun(fH(b, c, d), 0xa4beea44, bytes_to_int32(databytes, ptr + 4), 4);
            updateRun(fH(b, c, d), 0x4bdecfa9, bytes_to_int32(databytes, ptr + 16), 11);
            updateRun(fH(b, c, d), 0xf6bb4b60, bytes_to_int32(databytes, ptr + 28), 16);
            updateRun(fH(b, c, d), 0xbebfbc70, bytes_to_int32(databytes, ptr + 40), 23);
            updateRun(fH(b, c, d), 0x289b7ec6, bytes_to_int32(databytes, ptr + 52), 4);
            updateRun(fH(b, c, d), 0xeaa127fa, bytes_to_int32(databytes, ptr), 11);
            updateRun(fH(b, c, d), 0xd4ef3085, bytes_to_int32(databytes, ptr + 12), 16);
            updateRun(fH(b, c, d), 0x4881d05, bytes_to_int32(databytes, ptr + 24), 23);
            updateRun(fH(b, c, d), 0xd9d4d039, bytes_to_int32(databytes, ptr + 36), 4);
            updateRun(fH(b, c, d), 0xe6db99e5, bytes_to_int32(databytes, ptr + 48), 11);
            updateRun(fH(b, c, d), 0x1fa27cf8, bytes_to_int32(databytes, ptr + 60), 16);
            updateRun(fH(b, c, d), 0xc4ac5665, bytes_to_int32(databytes, ptr + 8), 23);
            updateRun(fI(b, c, d), 0xf4292244, bytes_to_int32(databytes, ptr), 6);
            updateRun(fI(b, c, d), 0x432aff97, bytes_to_int32(databytes, ptr + 28), 10);
            updateRun(fI(b, c, d), 0xab9423a7, bytes_to_int32(databytes, ptr + 56), 15);
            updateRun(fI(b, c, d), 0xfc93a039, bytes_to_int32(databytes, ptr + 20), 21);
            updateRun(fI(b, c, d), 0x655b59c3, bytes_to_int32(databytes, ptr + 48), 6);
            updateRun(fI(b, c, d), 0x8f0ccc92, bytes_to_int32(databytes, ptr + 12), 10);
            updateRun(fI(b, c, d), 0xffeff47d, bytes_to_int32(databytes, ptr + 40), 15);
            updateRun(fI(b, c, d), 0x85845dd1, bytes_to_int32(databytes, ptr + 4), 21);
            updateRun(fI(b, c, d), 0x6fa87e4f, bytes_to_int32(databytes, ptr + 32), 6);
            updateRun(fI(b, c, d), 0xfe2ce6e0, bytes_to_int32(databytes, ptr + 60), 10);
            updateRun(fI(b, c, d), 0xa3014314, bytes_to_int32(databytes, ptr + 24), 15);
            updateRun(fI(b, c, d), 0x4e0811a1, bytes_to_int32(databytes, ptr + 52), 21);
            updateRun(fI(b, c, d), 0xf7537e82, bytes_to_int32(databytes, ptr + 16), 6);
            updateRun(fI(b, c, d), 0xbd3af235, bytes_to_int32(databytes, ptr + 44), 10);
            updateRun(fI(b, c, d), 0x2ad7d2bb, bytes_to_int32(databytes, ptr + 8), 15);
            updateRun(fI(b, c, d), 0xeb86d391, bytes_to_int32(databytes, ptr + 36), 21);

            // update buffers
            h0 = _add(h0, a);
            h1 = _add(h1, b);
            h2 = _add(h2, c);
            h3 = _add(h3, d)
        }
        // Done! Convert buffers to 128 bit (LE)
        return int128le_to_hex(h3, h2, h1, h0).toUpperCase()
    }

};/* ../ludojs/src/form/password.js */
// TODO indicate strength of password
/**
 Password field
 @namespace ludo.form
 @class Password
 @augments ludo.form.Text
 @constructor
 @description Form component for passwords.
 @param {Object} config
 @example
 	...
 	children:[
 		{type:'form.password',label:'Password',name:'password',md5:true },
 		{type:'form.password',label:'Repeat password',name:'password_repeated',md5:true }
 	]
 	...
 */
ludo.form.Password = new Class({
	Extends:ludo.form.Text,
	type:'form.Password',
	inputType:'password',

	/**
	 * Convert password to md5 hash
	 * getValue method will then return an md5 version of the password
	 * @attribute {Boolean} md5
	 */
	md5:false,

	ludoConfig:function (config) {
		this.parent(config);
		if (config.md5 !== undefined)this.md5 = config.md5;
	},

	getValue:function(){
		console.warn("Use of deprecated getValue");
		console.trace();
		return this._get();
	},

	_get:function () {
		var val = this.parent();
		if (val.length && this.md5) {
			return faultylabs.MD5(val);
		}
		return val;
	},

	reset:function () {
		this._set('');
	}
});
/* ../ludojs/src/form/strong-password.js */
/**
 Strong password field, i.e
 contain at least 1 upper case letter
 contain at least 1 lower case letter
 contain at least 1 number or special character
 contain at least 8 characters in length
 not limited in length
 
 @namespace ludo.form
 @class Password
 @augments ludo.form.Text
 @constructor
 @description Form component for passwords.
 @param {Object} config
 @example
 ...
 children:[
 {type:'form.password',label:'Password',name:'password',md5:true },
 {type:'form.password',label:'Repeat password',name:'password_repeated',md5:true }
 ]
 ...
 */
ludo.form.StrongPassword = new Class({
    Extends: ludo.form.Password,
    regex : '(?=^.{_length_,}$)((?=.*[0-9])|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$',
    /**
     * Custom minimum length of password
     * @config {Number} passwordLength
     * @default 8
     * @optional
     */
    passwordLength : 8,

    ludoConfig:function(config){
        config = config || {};
        this.passwordLength = config.passwordLength || this.passwordLength;
        this.regex = new RegExp(this.regex.replace('_length_', this.passwordLength));
        this.parent(config);
    }
});/* ../ludojs/src/form/number.js */
/**
 * A <a href="ludo.form.Text.html">ludo.form.Text</a> field accepting only numeric characters.
 * @namespace ludo.form
 * @class ludo.form.Number
 * @augments ludo.form.Text
 * @param {Object} config
 * @param {Number} config.minValue Optional minimum value
 * @param {Number} config.maxValue Optional maximum value
 */
ludo.form.Number = new Class({
    Extends:ludo.form.Text,
    type:'form.Number',
    regex:/^[0-9]+$/,
    validateKeyStrokes:true,
    formCss:{
        'text-align':'right'
    },
    /**
     * Stretch is default set to false for numbers
     * @attribute {Boolean} stretchField
     */
    stretchField:false,

    /**
     * Disable changing values using mousewheel
     * @attribute {Boolean} disableWheel
     * @default false
     */
    disableWheel:false,

    /**
     * Reverse wheel, i.e. down for larger value, up  for smaller
     * @attribute {Boolean} reverseWheel
     * @default false
     */
    reverseWheel:false,

    /**
     * Amount to increment/decrement when using mousewheel while pressing shift-key
     * @attribute {Number} shiftIncrement
     * @default 10
     */
    shiftIncrement:10,

    ludoConfig:function (config) {
        this.parent(config);
        this.setConfigParams(config, ['disableWheel','shiftIncrement','reverseWheel','minValue','maxValue']);

        if (this.minValue !== undefined)this.minValue = parseInt(this.minValue);
        if (this.maxValue !== undefined)this.maxValue = parseInt(this.maxValue);

        this.applyValidatorFns(['minValue','maxValue']);
    },

    ludoEvents:function () {
        this.parent();
        if (!this.disableWheel) {
            this.getFormEl().on('mousewheel', this._mouseWheel.bind(this));
        }
        this.getFormEl().on('keydown', this.keyIncrement.bind(this));
    },

    keyIncrement:function(e){
        if(e.key === 'up' || e.key === 'down'){
            if(e.key === 'up')this.incrementBy(1, e.shift);
            if(e.key === 'down')this.incrementBy(-1, e.shift);
            return false;
        }
        return undefined;
    },

    blur:function(){
        var value = this.getFormEl().val();
        if(!this.isValid(value)){
            if (this.minValue!==undefined && parseInt(value) < this.minValue) {
                value = this.minValue;
            }
            if (this.maxValue!==undefined && parseInt(value) > this.maxValue) {
                value = this.maxValue;
            }
            this._set(value);
        }
        this.parent();
    },

    _mouseWheel:function (e) {
        var delta = (e.originalEvent.wheelDelta || e.originalEvent.detail) / 120;
        if(delta == 0)return;
        this.incrementBy(delta >0 ? 1 : -1, e.shift);	// Math.ceil because of a mystery error in either firefox or mootools
        return false;
    },
    /**
     * Increment value by
	 * @function incrementBy
     * @param {Number} value
     * @param {Boolean} shift
     */
    incrementBy:function (value, shift) {
        if(!this.value){
            if(this.minValue){
                this._set(this.minValue);
                return;
            }
            this._set(0);
        }

        if(this.reverseWheel)value = value * -1;
        value = parseInt(this.value) + (shift ? value * this.shiftIncrement : value);
        if(this.maxValue && value > this.maxValue)value = this.maxValue;
        if(this.minValue !== undefined && value < this.minValue)value = this.minValue;
        if(this.isValid(value)){
            this._set(value);
			this.fireEvent('change', [ value, this ]);
        }
    }
});/* ../ludojs/src/form/email.js */
/**
 * @namespace ludo.form
 * @class Email
 * @description A customized text field with automatic validation of e-mail addresses
 * @augments ludo.form.Text
 */
ludo.form.Email = new Class({
    Extends:ludo.form.Text,
    type:'form.Email',
    regex:/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.(?:[A-Z]{2}|com|org|net|edu|gov|mil|biz|info|mobi|name|aero|asia|jobs|museum)$/i,
    validateKeyStrokes:false
});/* ../ludojs/src/form/spinner.js */
// TODO this class should be rewritten
/* Create spinner with buttons on each side */
/**
 * Special form component used for Numbers. It will display control buttons
 * to the right of the input fields and you will be able to increment and decrement by
 * using the mouse wheel or by "nudging" the label.
 * @namespace ludo.form
 * @class Spinner
 * @augments ludo.form.Number
 */
ludo.form.Spinner = new Class({
    Extends:ludo.form.Number,
    type:'form.Spinner',
    inputTag:'input',
    inputType:'text',
    stretchField:false,
    regex:undefined,
    /**
     * Minimum value
     * @attribute maxValue
     * @type int
     * @default 0
     */
    maxValue:100,
    /**
     * Minimum value
     * @attribute {Number} minValue
     * @default 0
     */
    minValue:0,
    /**
     * amount of increment by click on arrow buttons or by rolling mouse wheel
     * @attribute increment
     * @type int
     * @default 1
     */
    increment:1,

    /**
     * Number of decimals
     * @config {Number|undefined} decimals
     * @default 0
     */
    decimals:0,


    ludoConfig:function (config) {
        this.parent(config);
        this.setConfigParams(config, ['increment', 'decimals']);
    },

    mode:{},

    ludoRendered:function () {
        this.parent();
        this.createSpinnerElements();

        if (!this.fieldWidth) {
            this.getFormEl().css('width', (this.maxValue + '').length * 15);
        }
        this._css();
        this._createEvents();
        this._clearMode();
        this.setSpinnerValue(this.value);
        this._setContainerSize();
    },

    createSpinnerElements:function () {
        this.createSpinnerContainer();
        var input = this.getFormEl();
        input.attr('maxlength', (this.maxValue + '').length);
        input.addClass('ludo-spinbox-input');

        var p = this.els.spinnerContainer;
        this.els.arrowsContainer = this._createContainer({
            cls:'ludo-spinbox-arrows-container',
            renderTo:p
        });
        this.els.upArrow = this._createContainer({
            cls:'ludo-spinbox-arrow-up',
            renderTo:this.els.arrowsContainer
        });
        this.els.downArrow = this._createContainer({
            cls:'ludo-spinbox-arrow-down',
            renderTo:this.els.arrowsContainer
        });
        this.els.arrowSeparator = this._createContainer({
            cls:'ludo-spinbox-arrow-separator',
            renderTo:this.els.arrowsContainer
        });
    },

    _clearMode:function () {
        this.mode = {
            name:false,
            modeElement:null,
            shiftKey:false,
            timeout:false
        }
    },

    createSpinnerContainer:function () {
        var el = this.els.spinnerContainer = $('<div class="ludo.spinbox-container"></div>');
        this.getFormEl().parent().append(el);
        el.append(this.getFormEl());
    },

    _createContainer:function (config) {
        config = Object.merge({
            tag:'div',
            cls:''
        }, config);

        var el = $('<' + config.tag + '>');
        el.addClass(config.cls);

        if (config.renderTo) {
            config.renderTo.append(el);
        }
        return el;
    },

    _css:function () {
        this.els.spinnerContainer.css('position', 'relative');
        this.getFormEl().css({
            border:'0px'
        });
        this.els.arrowsContainer.css({
            position:'absolute',
            top:'0px',
            height:'100%',
            right:'0px'
        });
        this.els.upArrow.css({
            'position':'absolute',
            'background-repeat':'no-repeat',
            'background-position':'center center',
            'height':' 50%',
            'top':'0px'
        });
        this.els.downArrow.css({
            'position':'absolute',
            'background-repeat':'no-repeat',
            'background-position':'center center',
            'height':'50%',
            'bottom':'0px'
        });
        this.els.arrowSeparator.css({
            'position':'absolute',
            'top':'50%'
        });

        this.els.spinnerContainer.css('width', this.fieldWidth);
    },
    _initNudge:function (e) {
        this._startMode({
            name:'nudge',
            x:e.page.x,
            initValue:parseInt(this.getValue()),
            labelWidth:this.els.label.width()
        });
        return false;
    },
    _nudge:function (e) {
        if (this.mode.name == 'nudge') {
            var movement = e.page.x - this.mode.x;
            var multiply = (this.maxValue - this.minValue) / this.mode.labelWidth;
            var value = this.mode.initValue + (movement * multiply);

            if (this.increment > 1) {
                value = Math.round(value);
                if (value > 0 && (value % this.increment)) {

                    value = value - (value % this.increment) + this.increment;
                    if (value > this.maxValue) {
                        value = this.maxValue;
                    }
                }
            }
            this.setSpinnerValue(value);

            var currentValue = this.getValue();
            if (currentValue == this.maxValue || currentValue == this.minValue) {
                this._initNudge(e);
            }
        }
    },
    _setContainerSize:function () {
        var width = this.getFormEl().width();
        if (!width)return;

        if (this.stretchField) {
            width -= 11;
        }
        width++;
        this.els.spinnerContainer.width(width);
    },
    _createEvents:function () {
        if (!this.disableWheel) {
            this.getFormEl().on('mousewheel', this._mouseWheel.bind(this));
        }
        this.getFormEl().on('keydown', this._validateKeyStroke.bind(this));
        this.els.upArrow.on('mouseover', this._arrowMouseOver.bind(this));
        this.els.upArrow.on('mouseout', this._arrowMouseOut.bind(this));
        this.els.upArrow.on('mousedown', this._arrowMouseDown.bind(this));
        this.els.upArrow.on('mouseup', this._arrowMouseUp.bind(this));

        this.els.downArrow.on('mouseover', this._arrowMouseOver.bind(this));
        this.els.downArrow.on('mouseout', this._arrowMouseOut.bind(this));
        this.els.downArrow.on('mousedown', this._arrowMouseDown.bind(this));
        this.els.downArrow.on('mouseup', this._arrowMouseUp.bind(this));

        $(document.documentElement).on('mouseup', this._clearMode.bind(this));

        if (this.els.label) {
            this.els.label.css('cursor', 'w-resize');
            $(this.els.label).on({
                'mousedown':this._initNudge.bind(this),
                'selectstart':function () {
                    return false;
                }
            });
            $(document.documentElement).on('mousemove', this._nudge.bind(this));
        }
    },
    _arrowMode:function () {

        if (this.mode.name) {
            switch (this.mode.mode) {
                case "up":
                    this.incrementBy(1, this.mode.shiftKey);
                    break;
                case "down":
                    this.incrementBy(-1, this.mode.shiftKey);
                    break;
                default:

            }
            this.mode.timeout = Math.max(Math.round(this.mode.timeout * 0.8), 15);
            setTimeout(this._arrowMode.bind(this), this.mode.timeout);
        }
    },
    _startMode:function (modeConfig) {
        this.mode = modeConfig;
        switch (this.mode.name) {
            case 'mousedown':
                this._arrowMode();
                break;
            default:
        }
    },
    _arrowMouseDown:function (e) {
        $(e.target).addClass('ludo-spinbox-arrow-downeffect');
        var m = $(e.target).hasClass("ludo-spinbox-arrow-up") ? "up":"down";
        this._startMode({
            name:'mousedown',
            mode: m,
            modeElement:e.target,
            shiftKey:e.shift,
            timeout:400
        });
    },
    _arrowMouseUp:function (e) {
        $(e.target).removeClass('ludo-spinbox-arrow-downeffect');
    },
    _arrowMouseOver:function (e) {
        $(e.target).addClass('ludo-spinbox-arrow-overeffect');
    },
    _arrowMouseOut:function (e) {
        $(e.target).removeClass('ludo-spinbox-arrow-overeffect');
    },
    incrementBy:function (value, shiftKey) {
        value = value * (shiftKey ? this.shiftIncrement : this.increment);
            console.log(value);
        this.setSpinnerValue(parseInt(this._get()) + value);
    },
    validateSpinnerValue:function (value) {
        value = value || 0;
        if (value < this.minValue)value = this.minValue;
        if (value > this.maxValue)value = this.maxValue;
        return parseInt(value);
    },
    setSpinnerValue:function (value) {
        this.value = this.validateSpinnerValue(value).toFixed(this.decimals);
        this.getFormEl().val(this.value);
        /**
         * Change event fired when value is changed
         * @event change
         * @param value
         * @param Component this
         */
        this.fireEvent('change', value, this);
    },

    _validateKeyStroke:function (e) {
        if (e.key == 'backspace' || e.key == 'delete' || e.key == 'tab') {
            return true;
        }

        if (this.minValue < 0 && this.html.el.value.indexOf('-') == -1 && e.key == '-') {
            return true;
        }
        if (this.decimals && (e.code == 190 || e.code == 46) && this.html.el.value.indexOf('.') == -1) {
            return true;
        }
        if (Event.Keys.hasOwnProperty(e.key)) {
            return true;
        }

        return Event.Keys.hasOwnProperty(e.key) ? true : /[0-9]/.test(e.key);
    },

    resizeDOM:function () {
        this.parent();
        if (this.stretchField) {
            this._setContainerSize();
        }
    }
});/* ../ludojs/src/form/select.js */
/**
 Select box (&lt;select>)
 @namespace ludo.form
 @class Select
 @augments ludo.form.Element
 @constructor
 @param {Object} config
 @example
	 {
		 type:'form.Select',
		 name:'country',
		 valueKey:'id',
		 textKey:'title',
		 emptyItem:{
			 id:'',title:'Where do you live?'
		 },
		 dataSource:{
			 resource:'Country',
			 service:'read'
		 }
	 }
 to populate the select box from the Country service on the server. The "id" column will be used as value for the options
 and title for the displayed text.

 @example
	 {
		 type:'form.Select',
		 emptyItem:{
			 value:'',text:'Please select an option'
		 },
		 options:[
			 { value:'1',text : 'Option a' },
			 { value:'2',text : 'Option b' },
			 { value:'3',text : 'Option c' }
		 ]
	 }
 */
ludo.form.Select = new Class({
    Extends:ludo.form.LabelElement,
    type:'form.Select',
    labelWidth:100,
    /**
     First option in the select box, usually with an empty value. You should use the same
     keys for empty item as for the rest of the options. Value is defined by the valueKey property
     (default "value"), and text by textKey(default "text").
     @config {Object} emptyItem
     @default undefined
     @example
		 {
			 id : '',
			 title : 'Please select an option'

		 }
     */
    emptyItem:undefined,

    /**
     Name of column for the values of the select box. This option is useful when populating select box using a collection data source.
     @config {String} valueKey
	 @default 'id'
     @example
     	valueKey : 'id'
     */
    valueKey:'value',
    /**
     * Name of column for the displayed text of the options in the select box
	 * @config {String} textKey
	 * @default 'text'
     */
    textKey:'text',

    inputTag:'select',
    inputType:'',
    /**
     * Config of dataSource.Collection object used to populate the select box from external data
     * @config {Object|ludo.dataSource.Collection} dataSource
     * @default {}
     */
	dataSource:{},

    /**
     Array of options used to populate the select box
     @config {Array} options
     @default undefined
     @example
		 options:[
			 { value:'1',text: 'Option number 1' },
			 { value:'2','text: Option number 2' },
			 { value:'3',text: 'Option number 3' }
		 ]
     */
    options:undefined,

	defaultDS:'dataSource.Collection',

    ludoConfig:function (config) {
        this.parent(config);
        this.setConfigParams(config, ['emptyItem', 'options', 'valueKey', 'textKey']);
        if(!this.emptyItem && this.inlineLabel){
            this.emptyItem = {};
            this.emptyItem[this.textKey] = this.inlineLabel;
            this.inlineLabel = undefined;
        }
    },

    ludoEvents:function () {
        this.parent();
        if (this.dataSource) {
            if (this.options && this.dataSourceObj) {
                for (var i = 0; i < this.options.length; i++) {
                    this.dataSourceObj.addRecord(this.options[i]);
                }
            }
			this.populate();
            var ds = this.getDataSource();
            ds.addEvent('select', this.selectRecord.bind(this));
            ds.addEvent('update', this.populate.bind(this));
            ds.addEvent('delete', this.populate.bind(this));
            ds.addEvent('sort', this.populate.bind(this));
        }
    },

    selectRecord:function (record) {
        this._set(record[this.valueKey]);
        this.toggleDirtyFlag();
    },

    populate:function () {
        var data = this.dataSourceObj.getData() || [];

        this.getFormEl().find('option').remove();
        if (this.emptyItem) {
            this.addOption(this.emptyItem[ this.valueKey ], this.emptyItem[ this.textKey ]);
        }
        for (var i = 0, count = data.length; i < count; i++) {
            this.addOption(data[i][ this.valueKey ], data[i][ this.textKey ]);
        }

        if (this.value) {
            this._set(this.value);
			this.setFormElValue(this.value);
        }
    },

    /**
     * Add new option element
     * @function addOption
     * @param {String} value
     * @param {String} text
     */
    addOption:function (value, text) {
        var option = $('<option value="' + value + '">' + text + '</option>');
        this.getFormEl().append(option);
    },

    resizeDOM:function () {
        this.parent();
    }
});/* ../ludojs/src/form/filter-text.js */
/**
 * @namespace ludo.form
 * @class FilterText
 * @augments ludo.form.Text
 * TODO this class is not working properly loading data from server. fix later
 */
ludo.form.FilterText = new Class({
    Extends:ludo.form.Text,
    type:'form.FilterText',

    /**
     * Suggest selected record.
     * @attribute autoComplete
     * @type {Boolean}
     * @default true
     */
    autoComplete:true,

    /**
     * value and title to display when no records are selected
     * @attribute emptyItem
	 * @type Object
     */
    emptyItem:{
        /**
         * value of empty item
         * @attribute emptyItem.value
         * @type string
         * @default empty string
         */
        value:'',
        /**
         * display value of empty item
         * @attribute emptyItem.title
         * @type string
         * @default empty string
         */
        title:''
    },

    /**
     * When set to true, filtering should be done on the server. When set to false, the script will search initial records sent to constructor using config.data
     * or the records it got from the server during when constructing the component
     * @attribute filterOnServer
     * @type {Boolean}
     * @default false
     */
    filterOnServer:false,
    /**
     * When search for records on the server is enabled or you have sent collection of records to the component on creation using config.data,
     * this property specifies maximum number of filtered records to be displayed below the component. For standard text fields, this property is of no interest.
     * @attribute maxDisplayed
     * @type int
     * @default 10
     */
    maxDisplayed:10,
    /**
     * "id" field of records used for filtering, this will also be the value of the text field. Example:
     * [{ id: 100, Title: 'Norway' }] will return 100 when calling component.getValue()
     * @attribute idField
     * @type string
     * @default "id"
     */
    idField:'id',
    /**
     * name of "display" field when filtering is enabled. This identified the column used in list box below input field,
     * example: displayField set to "firstname" will be display "John" and "Jane" for these records: [{ id:1, firstname: 'John', lastname: 'Doe' }, {id:2, firstname: 'Jane', lastname: 'Doe'} ]
     * @attribute displayField
     * @type string
     * @default "title"
     */
    displayField:'title',
    selectedRecord:undefined,
    timeStamp:0,
    remote:{},

    ludoConfig:function (config) {
        this.filterOnServer = config.filterOnServer || this.filterOnServer;
        if (config.remote) {
            config.remote.isJSON = true;
            this.remote.queryParam = config.remote.queryParam || this.remote.queryParam;
            this.remote.queryParamRecord = config.remote.queryParamRecord || config.remote.queryParamRecord;
        }
        this.emptyItem = config.emptyItem || this.emptyItem;
        this.parent(config);
        if (this.filterOnServer) {
            this.remote.autoLoad = false;
        }
        this.autoComplete = config.autoComplete || this.autoComplete;
    },


    ludoRendered:function () {
        this.parent();

        var cell = this.els.cellInput;

        var size = ludo.dom.getNumericStyle(this.els.formEl, 'width') + ludo.dom.getPW(this.els.formEl) + ludo.dom.getBW(this.els.formEl) + ludo.dom.getMW(this.els.formEl);

        var container = this.els.inputContainer = $('<div>');
        cell.append(container);
        container.append(this.els.formEl);
        container.addClass('ludo-form-text-autocomplete-container');
        if (!isNaN(size)) {
            container.css({
                'width':size
            });
        }

        this.createFilterComponent();
        this.createHiddenInput();

        this.getFormEl().addClass('ludo-form-text-autocomplete');
        this.getFormEl().attr('autocomplete', 'off');

        this.getFormEl().css({
            'background-color':'transparent',
            'z-index':100
        });

        var el = this.els.autoComplete = $('<input>');
        el.addClass('ludo-form-text-autocomplete');
        el.disabled = true;
        el.css('zIndex', 99);
        el.css('color', 'silver');
        el.css('cursor', 'none');
        this.els.inputContainer.append(el);

        this.els.formElDiv = $('<div>');
        this.els.hiddenEl = $('<div>');
        this.setRecord(this.getEmptyItem());
    },

    getEmptyItem:function () {
        var ret = {};
        ret[this.idField] = this.emptyItem[this.idField] === undefined ? this.emptyItem.value : this.emptyItem[this.idField];
        ret[this.displayField] = this.emptyItem.title || this.emptyItem.text;
        return ret;
    },

    createHiddenInput:function () {
        var hiddenInput = this.els.hiddenInput = $('<input type="hidden">');
        hiddenInput.val(this.value);
        this.getEl().append(hiddenInput);
    },

    getHiddenInput:function () {
        if (this.els.hiddenInput) {
            return this.els.hiddenInput;
        }
        return null;
    },


    setAutoCompleteRecord:function (record) {
        this.els.autoComplete.val(record[this.displayField]);
    },

    createFilterComponent:function () {
        this.getFormEl().on('keyup', this.filter.bind(this));
        this.getFormEl().on('keydown', this.filterKeyEvents.bind(this));
        this.getFormEl().on('focus', this.hideFilter.bind(this));

        this.getEventEl().on('mousedown', this.autoHideFilter.bind(this));
        this.getFormEl().on('blur', this.chooseSelectedRecord.bind(this));
        if (this.getParent()) {
            this.getParent().addEvent('startmove', this.hideFilter.bind(this));
        }

        this.filterComponent = new ludo.form.TextFilterContainer({
            formComponent:this,
            width:this.getFormEl().width(),
            height:300,
            maxDisplayed:this.maxDisplayed
        });

        this.hideFilter();
    },

    filterKeyEvents:function (e) {
        this.timeStamp = new Date().getTime();
        if (e.key == 'esc') {
            this.clearSelectedRecord();
            this.setRecord(this.getEmptyItem());
            this.filterComponent.hide();
        }
        if (e.key == 'enter' || e.key == 'tab') {
            var rec = this.filterComponent.getSelectedRecord();
            if (rec)this.setRecord(rec);
            this.hideFilter();

            if (e.key === 'enter') {
                var cmp = ludo.Form.getNext(this);
                if (cmp) {
                    cmp.focus();
                }
                return false;
            }
        }

        if (e.key == 'up') {
            this.filterComponent.selectPrevious();
        }
        if (e.key == 'down') {
            this.filterComponent.selectNext();
        }
        return undefined;
    },

    autoHideFilter:function (e) {
        var t = $(e.target);
        var id = t.attr("id");
        if (id && id == this.getFormEl().attr("id")) {
            return;
        }
        if (t.hasClass('ludo-filter-text-options') || t.parent('.ludo-filter-text-options')) {
            return;
        }
        this.filterComponent.hide();
    },

    filter:function (e) {
        if (e && e.key) {
            if (e.key == 'up' || e.key == 'down' || e.key == 'enter' || e.key == 'esc' || e.key == 'tab')return;
        }
        this.getHiddenInput().val(this.getFormEl().value);
        this.filterData(this.getFormEl().value);
    },

    getFieldWidth:function () {
        return this.formFieldWidth + ludo.dom.getBW(this.els.inputContainer) + ludo.dom.getPW(this.els.inputContainer);
    },
    reset:function () {
        this.parent();
        this.filter();
    },

    getValue:function(){
        console.warn("Use of deprecated getValue");
        console.warn();
    },
    /**
     * Return value of text field. On standard text fields the visible value will be returned. Otherwise the id of selected record will be returned
     * @function getValue
     * @return string value
     */
    _get:function () {
        var hiddenInput = this.getHiddenInput();

        if (hiddenInput) {
            return hiddenInput.get('value');
        }
        return this.parent();
    },

    /**
     * If record is part of data collection in memory(config.data or remotely loaded records), it will be shown,
     * if remote.url is set it will search for request to the server for the record. The query will look like this:
     * { getRecord : { id: 100 } } and it expects response from server in this format:
     *  { success: true, data : { id: 100, title: 'John Doe' } }
     * @function setValue
     * @param {String} value
     */
    _set:function (value) {
        if (this.remote.url) {
            var obj = {};
            obj[this.idField] = value;
            this.setRecord(obj);
        } else {
            this.parent(value);
        }
    },
    
    

    setRecord:function (record) {
        this.selectedRecord = record;
        if (record[this.idField] !== undefined && record[this.displayField] === undefined) {
            this.loadSingleRecordRemote(record);
        } else {
            this.chooseSelectedRecord();
            this.filterComponent.hide();
        }
    },

    loadSingleRecordRemote:function (record) {
        if(!this.remote.url){
            return;
        }
        var remoteConfig = {
            url:this.getUrl(),
            method:'post',
            onSuccess:function (json) {
                var record = json.data;
                if (this.idField && record[this.idField]!==undefined && record[this.displayField]) {
                    this.setRecord(record);
                }
            }.bind(this)
        };
        remoteConfig.params = {};
        remoteConfig.params[this.idField] = record.id;
        remoteConfig.params[this.remote.queryParamRecord] = record;

        this.JSONRequest(remoteConfig);
    },

    chooseSelectedRecord:function () {
        var record = this.getSelectedRecord();
        if (record) {
            var realValue = record[this.displayField];
            if (this.isEmptyRecord(record)) {
                realValue = '';
            }
            this.getFormEl().val(realValue);

            this.els.autoComplete.val(record[this.displayField]);
            this.getHiddenInput().val(record[this.idField]);
        }
    },

    isEmptyRecord:function (record) {
        return record[this.idField].length === 0;
    },

    originalSearch:undefined,
    filterData:function (search) {
        this.originalSearch = search;
        search = search.toLowerCase();

        if (search.length == 0) {
            this.clearSelectedRecord();
            this.setRecord(this.getEmptyItem());
            this.filterComponent.hide();
            return;
        }

        this.clearSelectedRecord();

        if (!this.data && !this.filterOnServer) {
            return;
        }

        if (this.filterOnServer) {
            this.filterRemote(search);
        } else {
            var filteredRecords = this.getFilteredRecords(search);
            if (filteredRecords.length > 0) {
                this.showSuggestionAndPopulateDropDown(search, filteredRecords);
            } else {
                this.clearSelectedRecord();
                this.filterComponent.hide();
            }
        }
    },

    filterRemote:function (search) {
        if (this.filterCache[search]) {
            this.showSuggestionAndPopulateDropDown(search, this.filterCache[search]);
            return;
        }
        var d = new Date();
        if (d.getTime() - this.timeStamp < 500) {
            if (search == this.getFormEl().value.toLowerCase()) {
                this.filterRemote.delay(100, this, [search]);
            }
            return;
        }

        this.filterCache[search] = [];
        if(!this.remote.url){
            return;
        }
        var remoteConfig = {
            url:this.remote.url,
            method:'post',
            onSuccess:function (json) {
                this.filterCache[search] = json.data;
                this.showSuggestionAndPopulateDropDown(search, json.data);
            }.bind(this)
        };
        remoteConfig.params = this.remote.data;
        remoteConfig.params[this.remote.queryParam] = search;
        remoteConfig.params.maxDisplayed = this.maxDisplayed;

        this.JSONRequest(remoteConfig);
    },

    showSuggestionAndPopulateDropDown:function (search, records) {
        if (records.length == 0) {
            this.filterComponent.hide();
            this.clearSelectedRecord();
            return;
        }

        var suggestedRecord = this.getSuggestedRecord(records);
        if (suggestedRecord) {
            this.selectedRecord = suggestedRecord;
            this.els.autoComplete.val(suggestedRecord[this.displayField]);
        } else {
            this.clearSelectedRecord();
        }
        this.filterComponent.position();
        this.filterComponent.populate(records);
        this.filterComponent.show();
    },

    getSuggestedRecord:function (records) {
        var len = Math.min(this.maxDisplayed, records.length);
        for (var i = 0; i < len; i++) {
            if (records[i][this.displayField].indexOf(this.originalSearch) == 0) {
                return records[i];
            }
        }
        return null;
    },

    clearSelectedRecord:function () {
        this.els.autoComplete.val('');
        this.selectedRecord = undefined;
    },

    getSelectedRecord:function () {
        return this.selectedRecord;
    },

    filterCache:{},
    getFilteredRecords:function (search) {
        if (!this.filterCache[search]) {
            this.filterCache[search] = [];

            for (var i = 0; i < this.data.length; i++) {
                if (this.data[i].searchString.indexOf(search) >= 0) {
                    this.filterCache[search].push(this.data[i]);
                }
            }
        }

        return this.filterCache[search];
    },

    hideFilter:function () {
        this.filterComponent.hide.delay(200, this.filterComponent);
    },

    resizeDOM:function () {
        this.parent();
        this.els.inputContainer.css('width', this.getFormEl().width());
    },

    populate:function (data) {
        this.data = data;
        for (var i = 0; i < data.length; i++) {
            this.data[i].searchString = this.data[i][this.displayField].toLowerCase();
        }
    }
});

ludo.form.TextFilterContainer = new Class({
    Extends:ludo.View,
    type:'form.TextFilterContainer',
    formComponent:undefined,
    width:500,
    height:300,
    titleBar:false,
    hidden:true,
    maxDisplayed:10,
    tpl:'<div>{title}</div>',
    records:[],
    selectedIndex:undefined,

    elCss:{
        position:'absolute',
        border:'1px solid #AAA',
        'background-color':'#FFF'
    },
    ludoConfig:function (config) {
        this.formComponent = config.formComponent;
        config.els = config.els || {};
        config.renderTo = document.body;
        this.parent(config);
        this.alwaysInFront = true;
        this.maxDisplayed = config.maxDisplayed;

    },

    ludoRendered:function () {
        this.parent();
        this.resize({
            width:this.layout.width,
            height:this.layout.height
        });

        this.getBody().css('overflow', 'hidden');
        this.getBody().addClass('ludo-filter-text-options');
    },

    keyUp:function(){

    },

    position:function () {
        var pos = this.getFormEl().els.inputContainer.getCoordinates(this.renderTo);
        this.setPosition({
            left:pos.left,
            top:pos.top + pos.height
        });
    },

    getFormEl:function () {
        return this.formComponent;
    },

    populate:function (records) {
        this.records = records;
        this.getBody().html( '');


        this.els.recordNodes = [];
        this.selectedIndex = undefined;
        var len = Math.min(records.length, this.maxDisplayed);

        for (var i = 0; i < len; i++) {
            var div = this.els.recordNodes[i] = $('<div>');
            div.attr('recordIndex', i);
            div.className = 'ludo-form-autocomplete-suggestion';
            div.html( records[i][this.formComponent.displayField]);
            this.getBody().append(div);
            div.on('click', this.setRecord.bind(this));
            div.mouseenter(this.mouseEnterRecord.bind(this));
            div.mouseleave(this.mouseLeaveRecord.bind(this));
        }

        this.autoResize.delay(30, this, len);
    },

    autoResize:function (countRecords) {
        var div = this.getBody().getElement('.ludo-form-autocomplete-suggestion');
        var height = countRecords * this.getHeightOfSuggestionElement(div);
        height += ludo.dom.getMH(this.getEl());
        height += ludo.dom.getMH(this.getBody());
        height += ludo.dom.getBH(this.getBody());
        height += ludo.dom.getPH(this.getBody());


        this.resize({
            width:this.formComponent.getFieldWidth(),
            height:height
        });
    },

    selectNext:function () {
        if (this.records.length === 0) {
            return;
        }
        if (this.selectedIndex === undefined || this.selectedIndex == this.records.length - 1) {
            this.selectedIndex = 0;
        } else {
            this.selectedIndex++;
        }
        this.highlightRecord(this.selectedIndex);
    },
    selectPrevious:function () {
        if (this.records.length === 0) {
            return;
        }
        if (this.selectedIndex === undefined || this.selectedIndex == 0) {
            this.selectedIndex = this.records.length - 1;
        } else {
            this.selectedIndex--;
        }
        this.highlightRecord(this.selectedIndex);

    },
    mouseEnterRecord:function (e) {
        this.selectedIndex = e.target.getProperty('recordIndex');
        this.highlightRecord(this.selectedIndex);
    },

    mouseLeaveRecord:function (e) {
        e.target.removeClass('ludo-form-autocomplete-suggestion-over');
    },

    highlightRecord:function (recordIndex) {
        if (this.highlightedRecord) {
            this.highlightedRecord.removeClass('ludo-form-autocomplete-suggestion-over')
        }
        this.highlightedRecord = this.els.recordNodes[recordIndex];
        this.highlightedRecord.addClass('ludo-form-autocomplete-suggestion-over')
    },

    getSelectedRecord:function () {
        if (this.selectedIndex !== undefined && this.records[this.selectedIndex]) {
            return this.records[this.selectedIndex];
        }
        return undefined;
    },

    setRecord:function (e) {
        var index = e.target.getProperty('recordIndex');
        this.formComponent.setRecord(this.records[index]);
        this.formComponent.hideFilter();
    },

    heightOfSuggestionElement:undefined,

    getHeightOfSuggestionElement:function (el) {
        if (this.layout.heightOfSuggestionElement === undefined) {
            this.layout.heightOfSuggestionElement = el.measure(function () {

                return this.getSize().y;
            });
        }
        return this.layout.heightOfSuggestionElement;
    }
});/* ../ludojs/src/form/radio-group.js */
/**
 * @namespace ludo.form
 * @class RadioGroup
 * @description class for a group of radio buttons. Config for the radio buttons should be passed to the
 * constructor or loaded remotely. Here's an example of format:
 * [{ value: 1, text : 'my radio', image: 'images/my-radio-image.png' }]
 * @augments ludo.form.Select
 */
ludo.form.RadioGroup = new Class({
    Extends: ludo.form.Select,
    type : 'form.RadioGroup',
    checkboxes : [],
    height : undefined,
    inputTag:'',

    ludoDOM : function() {
        this.parent();
        var table = $('<table>');
        this.getInputCell().append(table);
        var tbody = this.els.tBody = $('<tbody>');
        table.append(tbody);

    },

    populate : function(){
        var data = this.dataSource ? this.getDataSource().getData() || [] : [];
        var row = $('<tr>');
        this.els.tBody.html('');
        this.els.tBody.append(row);
        this.disposeCheckboxes();
        for(var i=0;i<data.length;i++){
            var cell = $('<td>');
            row.append(cell);

            var radio = new ludo.form.Checkbox({
                inputType : 'radio',
                name : this.getName(),
                value : data[i][this.valueKey],
                label : data[i][this.textKey],
                image : data[i].image ? data[i].image : null,
                listeners : {
                    change : this.valueChange.bind(this)
                }
            });
            this.checkboxes.push(radio);
            cell.append(radio.getEl());
        }

        if (this.value) {
            this._set(this.value);
        }
    },

    disposeCheckboxes:function(){
        for(var i=0;i<this.checkboxes.length;i++){
            this.checkboxes[i].dispose();
        }
        this.checkboxes = [];
    },

    valueChange : function(value){
        this.value = value;
        for(var i=0;i<this.checkboxes.length;i++){
            this.checkboxes[i].toggleImage();
        }

        /**
         * @event change
         * @description Value has changed
         * @param {String} value
         * @param {Object} this component
         */
        this.fireEvent('change', [ this.value, this ]);
        this.toggleDirtyFlag();
    },

    ludoRendered : function() {
        this.parent();
        if(this.checkboxes.length > 0 && !this.isChecked()){
            this.checkboxes[0].check();
        }
    },

    isChecked : function() {
        for(var i=0;i<this.checkboxes.length;i++){
            if(this.checkboxes[i].isChecked()){
                return true;
            }
        }
        return false;
    },

    disable : function(){
        for(var i=0;i<this.checkboxes.length;i++){
            this.checkboxes[i].disable();
        }
    },

    enable : function(){
        for(var i=0;i<this.checkboxes.length;i++){
            this.checkboxes[i].enable();
        }
    },
    /**
     * Get value of selected radio input
     * @function getValue
     * @return String value
     */
    getValue : function() {
        var radio = this.getCheckedRadio();
        if(radio){
            return radio._get();
        }
        return undefined;
    },
    /**
     * Return reference to selected radio button component
     * @function getCheckedRadio
     * @return {Object} ludo.form.Radio component
     */
    getCheckedRadio : function() {
        for(var i=0;i<this.checkboxes.length;i++){
            if(this.checkboxes[i].isChecked()){
                return this.checkboxes[i];
            }
        }
        return undefined;
    },
    /**
     * The radio button with the chose value will be checked
     * @function val
     * @param {String} value
     * @return void|string
     */
    val : function(value){
        if(arguments.length == 0){
            return this._get();
        }
        this._set(value);
    },

    _set:function(value){
        // TODO reset in form-components.php is not working for radio group
        for(var i=0;i<this.checkboxes.length;i++){
            if(this.checkboxes[i].getFormEl().get('value') == value){
                return this.checkboxes[i].check();
            }
        }
        this.parent(value);
    },

    supportsInlineLabel:function(){
        return false;
    }
});/* ../ludojs/src/form/on-off-switch.js */
/**
 * On off switch
 * @namespace ludo.form
 * @class ludo.form.OnOffSwitch
 * @memberOf ludo.form
 *
 */
ludo.form.OnOffSwitch = new Class({
    Extends: ludo.form.Element,

    listener: undefined,
    trackBorderColor: undefined,

    checked: false,

    /**
     * @memberof ludo.form.OnOffSwitch.prototype
     * Border width in pixels. Default is 1
     * @param {Number} textSizeRatio
     * @default 1
     */
    trackBorderWidth: 1,

    /**
     * @memberof ludo.form.OnOffSwitch.prototype
     * Text size ratio relative to height. Default is 0.45
     * @param {Number} textSizeRatio
     * @default 0.45
     */
    textSizeRatio: 0.45,

    /**
     * @memberof ludo.form.OnOffSwitch.prototype
     * Track color - ON state. Default is orange
     * @param {string} trackColorOn
     * @default #F57C00
     */
    trackColorOn: '#F57C00',

    /**
     * Track color - OFF state. Default is dark gray
     * @param {string} trackColorOff
     * @memberof ludo.form.OnOffSwitch.prototype
     * @default #666
     */
    trackColorOff: '#666',

    /**
     * Text color in on state
     * @param {string} v
     * @default #fff
     * @memberof ludo.form.OnOffSwitch.prototype
     */
    textColorOn: undefined,

    /**
     * Text color in off state
     * @param {string} textColorOff
     * @default #fff
     * @memberof ludo.form.OnOffSwitch.prototype
     */
    textColorOff: '#fff',

    el: undefined,
    track: undefined,
    thumb: undefined,
    thumbColor: undefined,
    onTextEl: undefined,
    offTextEl: undefined,
    onOffTrackContainer: undefined,

    /**
     * Text when switch is turned on
     * @memberof ludo.form.OnOffSwitch.prototype
     * @param {string} textOn
     * @default ""
     */
    textOn: "",

    /**
     * @memberof ludo.form.OnOffSwitch.prototype
     * Text when switch is turned off
     * @param {string} textOff
     * @default ""
     */
    textOff: "",

    minX: 0,
    maxX: 0,

    trackOn: undefined,
    trackOff: undefined,

    innerTrackWidth: 0,

    dragCurrentX: 0,
    borderSize: 0,

    /**
     * Value when checked
     * @memberof ludo.form.OnOffSwitch.prototype
     * @param {string} checkedVal
     * @type {string}
     * @default '1'
     */
    checkedVal:'1',

    /**
     * Value when unchecked
     * @memberof ludo.form.OnOffSwitch.prototype
     * @param {string} uncheckedVal
     * @type {string}
     * @default ''
     */
    uncheckedVal: '',

    ludoConfig:function(config){
        this.parent(config);
        this.setConfigParams(config, ["textOn", "textOff", "trackColorOn", "trackColorOff",
            "textColorOn", "textColorOff", "listeners", "trackBorderColor", "textSizeRatio","checked",
        "checkedVal","uncheckedVal"]);
    },

    ludoDOM:function(){

        this.parent();

        this.width = 100;
        this.height= 30;

        this.el = $('<div class="on-off-switch"></div>');
        this.getBody().append(this.el);

        this.renderTrack();
        this.renderThumb();

        this.el.on('selectStart', this.cancelEvent);

        this.track.on("click", this.toggle.bind(this));
        this.track.on("touchend", this.toggle.bind(this));

    },

    ludoEvents:function(){
        this.parent();

        this.thumb.on("mousedown", this.startDragging.bind(this));
        this.thumb.on("touchstart", this.startDragging.bind(this));

        this.thumb.on("mouseenter", this.enterThumb.bind(this));
        this.thumb.on("mouseleave", this.leaveThumb.bind(this));

        $(document.documentElement).on("touchmove", this.drag.bind(this));
        $(document.documentElement).on("mousemove", this.drag.bind(this));
        $(document.documentElement).on("mouseup", this.endDrag.bind(this));
        $(document.documentElement).on("touchend", this.endDrag.bind(this));
    },

    ludoRendered:function(){
        this.parent();
        this.setChecked(this.checked);
    },

    resizeDOM:function(){
        this.parent();
        var width = this.width = this.getBody().width() - (this.trackBorderWidth * 2);
        var height = this.height = this.getBody().height() - (this.trackBorderWidth * 2);

        var trackWidth = width - (this.trackBorderWidth * 2);
        var innerTrackWidth = trackWidth - (this.height / 2);
        this.innerTrackWidth = trackWidth;
        var trackHeight = height - (this.trackBorderWidth * 2);
        var borderRadius = height / 2;

        this.el.css({
            width: width,
            height: height
        });

        this.track.css({
            width: trackWidth, height:trackHeight,
            borderRadius: borderRadius
        });

        this.onOffTrackContainer.css({
            height:trackHeight, width: (innerTrackWidth * 2)
        });

        this.trackOn.css({
            width: innerTrackWidth,
            height: trackHeight
        });

        this.trackOff.css({
            width:this.width,
            height:trackHeight,
            left: (innerTrackWidth - (this.height / 2))
        });

        this.styleText(this.onTextEl);
        this.styleText(this.offTextEl);

        var whiteHeight = this.height / 2;
        var whiteBorderRadius = whiteHeight / 2;
        var horizontalOffset = whiteBorderRadius / 2;
        var whiteWidth = this.width - (horizontalOffset * 2);

        this.whiteEl.css({
            top:this.height / 2,
            left:horizontalOffset,
            width:whiteWidth,
            height:whiteHeight,
            borderRadius: whiteBorderRadius
        });

        this.whiteEl2.css({
            top:this.height / 2,
            left:horizontalOffset,
            width:whiteWidth,
            height:whiteHeight,
            borderRadius: whiteBorderRadius
        });
        this.maxX = this.width - this.height;
        borderRadius = (this.height - this.height % 2) / 2;
        var borderSize = this.getBorderSize();

        this.thumb.css({
            width: this.height + 'px',
            height:this.height + 'px',
            borderRadius: borderRadius
        });

        var size = this.height - (borderSize * 2);

        this.thumbShadow.css({
            width: this.height + 'px',
            height:this.height + 'px',
            borderRadius: borderRadius
        });

        this.thumbColor.css({
            width: size + 'px',
            height:size + 'px',
            borderRadius: borderRadius
        });

        this.applyStyles();
    },

    enterThumb: function () {
        this.thumbColor.addClass("on-off-switch-thumb-over");
    },

    leaveThumb: function () {
        this.thumbColor.removeClass("on-off-switch-thumb-over");
    },

    renderTrack: function () {

        this.track = $('<div class="on-off-switch-track" style="border-width:' + this.trackBorderWidth + 'px"></div>');

        if (this.trackBorderColor) {
            this.track.css("border-color", this.trackBorderColor);
        }
        this.el.append(this.track);

        this.onOffTrackContainer = $('<div style="position:absolute"></div>');
        this.track.append(this.onOffTrackContainer);


        this.trackOn = $('<div class="on-off-switch-track-on" style="border-radius:' + 0 + 'px;border-width:' + this.trackBorderWidth + 'px"><div class="track-on-gradient"></div></div>');
        this.onOffTrackContainer.append(this.trackOn);
        this.onTextEl = $('<div class="on-off-switch-text on-off-switch-text-on">' + this.textOn + '</div>');
        this.trackOn.append(this.onTextEl);

        if (this.textColorOn) {
            this.onTextEl.css("color", this.textColorOn);
        }

        this.trackOff = $('<div class="on-off-switch-track-off" style="overflow:hidden;border-radius:' + 0 + 'px;border-width:' + this.trackBorderWidth + 'px"><div class="track-off-gradient"></div></div>');
        this.offTextEl = $('<div class="on-off-switch-text on-off-switch-text-off">' + this.textOff + '</div>');
        this.onOffTrackContainer.append(this.trackOff);
        this.trackOff.append(this.offTextEl);

        if (this.textColorOff) {
            this.offTextEl.css("color", this.textColorOff);
        }

        this.styleText(this.onTextEl);
        this.styleText(this.offTextEl);

        this.whiteEl = $('<div class="on-off-switch-track-white"></div>');
        this.whiteEl2 = $('<div class="on-off-switch-track-white"></div>');
        this.trackOn.append(this.whiteEl);
        this.trackOff.append(this.whiteEl2);

        this.maxX = this.width - this.height;
    },

    styleText: function (el) {
        var textHeight = Math.round(this.height * this.textSizeRatio);
        var textWidth = Math.round(this.width - this.height);
        el.css({
            'line-height' : (this.height - (this.trackBorderWidth * 2)) + "px",
            'font-size' : textHeight + 'px',
            'left' : (this.height/2),
            'width':  textWidth
        });
    },

    renderThumb: function () {
        var borderSize = this.getBorderSize();
        this.thumb = $('<div class="on-off-switch-thumb" ></div>');
        var shadow = this.thumbShadow = $('<div class="on-off-switch-thumb-shadow" style="border-width:' + borderSize + 'px;"></div>');
        this.thumb.append(shadow);
        this.thumbColor = $('<div class="on-off-switch-thumb-color" style="left:' + borderSize + 'px;top:' + borderSize + 'px"></div>');
        this.thumb.append(this.thumbColor);
        if (this.trackColorOff) {
            this.trackOff.css("background-color", this.trackColorOff);
        }
        if (this.trackColorOn) {
            this.trackOn.css("background-color", this.trackColorOn);
        }
        this.el.append(this.thumb);
    },


    getBorderSize: function () {
        if (this.borderSize == 0) {
            this.borderSize = Math.round(this.height / 40);
        }
        return this.borderSize;
    },

    applyStyles: function () {
        var t = this.thumbColor;
        t.removeClass("on-off-switch-thumb-on");
        t.removeClass("on-off-switch-thumb-off");
        t.removeClass("on-off-switch-thumb-over");

        if (this.checked) {
            t.addClass("on-off-switch-thumb-on");
            this.thumb.css("left", this.width - this.height);
            this.onOffTrackContainer.css("left", 0);
        }
        else {
            this.onOffTrackContainer.css("left", this.getTrackPosUnchecked());
            t.addClass("on-off-switch-thumb-off");
            this.thumb.css("left", 0);
        }

    },

    isDragging: false,
    hasBeenDragged: false,
    startDragging: function (e) {

        this.isDragging = true;
        this.hasBeenDragged = false;

        this.startCoordinates = {
            x: this.getX(e),
            elX: this.thumb.position().left
        };
        return false;
    },

    drag: function (e) {
        if (!this.isDragging) {
            return;
        }

        this.hasBeenDragged = true;
        var x = this.startCoordinates.elX + this.getX(e) - this.startCoordinates.x;

        if (x < this.minX)x = this.minX;
        if (x > this.maxX)x = this.maxX;

        this.onOffTrackContainer.css("left", x - this.width + (this.height));
        this.thumb.css("left", x);
        return false;
    },

    getX: function (e) {
        var x = e.pageX;

        if (e.type && (e.type == "touchstart" || e.type == "touchmove")) {
            x = e.originalEvent.touches[0].pageX;
        }

        this.dragCurrentX = x;

        return x;

    },

    endDrag: function () {
        if (!this.isDragging)return;

        if (!this.hasBeenDragged) {
            this.toggle();
        } else {
            var x = this.startCoordinates.elX + this.dragCurrentX - this.startCoordinates.x;
            if (x < (this.width / 2 - (this.height / 2))) {
                this.animateLeft();
            } else {
                this.animateRight();
            }
        }
        this.isDragging = false;
    },

    getTrackPosUnchecked: function () {
        return 0 - this.width + this.height;
    },

    animateLeft: function () {
        this.onOffTrackContainer.animate({left: this.getTrackPosUnchecked()}, 100);
        this.thumb.animate({left: 0}, 100,"swing", this.uncheck.bind(this));
    },

    animateRight: function () {
        this.onOffTrackContainer.animate({left: 0}, 100);
        this.thumb.animate({left: this.maxX}, 100, "swing", this.check.bind(this));
    },

    check: function () {
        this.setChecked(true);
        this.applyStyles();
    },

    uncheck: function () {
        this.setChecked(false);
        this.applyStyles();
    },
    
    setChecked:function(checked){
        if(checked != this.checked){
            this.checked = checked;
            this.fireEvent('change', [this._get(), this]);
            this._set(this.checked ? this.checkedVal : this.uncheckedVal);
            this.change();
        }
    },

    _get:function(){
        return this.checked ? this.checkedVal: this.uncheckedVal;
    },
    
    toggle: function () {
        if (!this.checked) {
            this.checked = true;
            this.animateRight();
        } else {
            this.checked = false;
            this.animateLeft();
        }
        this._set(this.checked ? this.checkedVal : this.uncheckedVal);
        this.change();
    },

    val: function (val) {
        if(arguments.length == 1){
            if(val == this.checkedVal)this.setChecked(true); else this.setChecked(false);
        }
        return this._get();
    }
});/* ../ludojs/src/form/seekbar.js */
/**
 * Seekbar form view.
 * For live example, see <a href="../demo/form/seekbar.php">Seekbar demo</a>
 * @namespace ludo.form
 * @class ludo.form.Seekbar
 * @augments ludo.form.Element
 * @memberOf ludo.form
 * @param {object} config
 * @param {number} config.value Initial value, default 0
 * @param {number} config.orientation Orientation of seekbar, "horizontal" or "vertical", default: "vertical"
 * @param {number} config.minValue Minimum value, default 0
 * @param {number} config.maxValue Maximum value, default 10
 * @param {number} config.negativeColor color of seekbar line below(vertical) and left(horizontal mode), default: #888
 * @param {number} config.positiveColor color of seekbar line above(vertical) and right of(horizontal mode), default: #CCC
 * @param {number} config.thumbColor Color of thumb, default: #888
 * @param {number} config.thumbAlpha Alpha(opacity) of thumb in range 0-1 while dragging, default: 1
 * @param {number} config.barSize Size(height or width) of bar in pixels, default: 2
 * @param {number} config.needleSize Fraction size of of needle(circle inside thumb) relative to thumb size, default: 0.2
 * @param {number} config.increments Optional increment value. If you want to disable decimals, set this value to 1
 *
 * @fires change Event fired when value is changed.
 *
 * @example
 * new ludo.form.Seekbar({
        renderTo:document.body,
        orientation:"vertical",
        layout:{
            width:50, height:300
        },
        id: 'red', // id of view for easy access using ludo.get('red') later
        minValue:0,maxValue:255, // Min value set to 0, max set to 255
        thumbColor:'#D32F2F', // Red color of seekbar thumb
        negativeColor:'#D32F2F', // Same red color on the seekbar(below thumb)
        type: 'form.Seekbar', // Type of view is form.Seekbar
        stateful:true, // value will be saved, i.e. saved
        value:100, // Sets a default red value of 100
        css:{
            'padding-left': 5,'padding-right':5 // some space between the seekbars
        },
        listeners:{
            change:updateColor // call the updateColor function above when red value is changed
        }
    });
 */


ludo.form.Seekbar = new Class({
    Extends: ludo.form.Element,
    thumbAlpha: 1,
    negativeColor: '#888',
    positiveColor: '#ccc',
    thumbColor: '#888',
    minValue: 0,
    maxValue: 10,
    value: 0,

    barSize: 2,

    el: undefined,
    elNegative: undefined,
    elPositive: undefined,

    thumb: undefined,
    thumbInner: undefined,
    thumbOuter: undefined,
    needleSize: 0.2,

    area: {width: 0, height: 0, max: 0},
    valueArea: {min: 0, max: 0, width: 0},

    thumbSize: 0,
    isActive: false,

    startCoordinates: undefined,

    valueListener: undefined,

    reverse:false,
    increments:undefined,
    orientation : 'vertical',

    ludoConfig:function(config){
        this.parent(config);
        this.setConfigParams(config, ["increments", "orientation", "reverse", "minValue", "maxValue", "value", "valueListener", "negativeColor", "positiveColor", "needleSize", "barSize"]);

        if (config.thumbColor != undefined) {
            if (config.thumbColor.length == 9) {
                var alpha = config.thumbColor.substr(1, 2);
                this.thumbAlpha = parseInt(alpha, 16) / 255;
                config.thumbColor = "#" + config.thumbColor.substr(3);
            }
            this.thumbColor = config.thumbColor;
        }
    },

    renderSeekbar:function(){
        this.el = $('<div class="dhtmlgoodies-seekbar" style="position:relative;width:100%;height:100%"></div>');

        this.getBody().append(this.el);

       // this.orientation = this.getWidth() >= this.getHeight() ? 'horizontal' : 'vertical';

        this.elNegative = $('<div class="seekbar-negative" style="position:absolute;z-index:1"></div>');
        this.elPositive = $('<div class="seekbar-positive" style="position:absolute;z-index:1"></div>');

        if (this.negativeColor != undefined) {
            this.elNegative.css("background-color", this.negativeColor);
        }
        if (this.positiveColor != undefined) {
            this.elPositive.css("background-color", this.positiveColor);
        }

        this.thumb = $('<div style="position:absolute;z-index:4"></div>');
        this.thumbInner = $('<div class="seekbar-thumb-needle" style="position:absolute;z-index:5;background-color:' + this.thumbColor + '"></div>');
        this.thumbOuter = $('<div class="seekbar-thumb" style="position:absolute;z-index:5;width:100%;height:100%;background-color:' + this.thumbColor + '"></div>');

        if (this.thumbColor != undefined) {
            this.thumbInner.css("background-color", this.thumbColor);
            this.thumbOuter.css("background-color", this.thumbColor);

        }

        this.updateAlpha();

        this.thumb.append(this.thumbInner);
        this.thumb.append(this.thumbOuter);

        this.el.append(this.elNegative);
        this.el.append(this.elPositive);
        this.el.append(this.thumb);

        this.eventEl = $('<div style="position:absolute;z-index:3;width:100%;height:100%"></div>');
        this.el.append(this.eventEl);
        this.eventEl.on("click", this.clickOnBar.bind(this));


        this.thumb.on(ludo.util.getDragStartEvent(), this.startDragging.bind(this));
        $(document.documentElement).on(ludo.util.getDragMoveEvent(), this.drag.bind(this));
        $(document.documentElement).on(ludo.util.getDragEndEvent(), this.endDrag.bind(this));

    },

    clickOnBar: function (e) {
        var pos = this.orientation == "vertical" ? this.area.size - e.offsetY  - e.currentTarget.offsetTop : e.offsetX;

        pos -= (this.thumbSize / 2);

        if (e.target && e.target.className == "seekbar-thumb")return;

        var value = this.minValue + (pos / this.valueArea.size * (this.maxValue - this.minValue));
        if(this.reverse){
            value = this.maxValue - value;
        }
        value = Math.min(this.maxValue, Math.max(this.minValue, value));
        this.val(value);

        if (this.valueListener != undefined) {
            this.valueListener.call(this, this.value);
        }
    },

    /**
     * Function to set or get value
     * @member {function}
     * @inner
     * @param {Number} value Optional, when set, the seekbar will be updated with this value
     * @memberof ludo.form.Seekbar
     * @returns {number}
     * @example
     * // set value
     * ludo.get("seekbar").val(100);
     * // get value
     * var val = ludo.get("seekbar").val();
     */
    val: function (value) {
        if(arguments.length != 0){
            this._set(value);
            this.change();
        }

        return this.value;
    },


    _set:function(value){
        if(this.increments != undefined){
            value -= (value % this.increments);
        }

        value = Math.max(this.minValue, value);
        value = Math.min(this.maxValue, value);

        value = this.parent(value);

        this.positionBars();
        this.positionThumb();

        return value;
    },

    ludoRendered:function(){
        this.renderSeekbar();
        this.parent();
    },

    resizeDOM:function(){
        this.parent();



        this.positionItems();
    },

    positionItems: function () {
        
        this.area.width = this.el.width();
        this.area.height = this.el.height();
        this.area.size = Math.max(this.area.width, this.area.height);

        this.thumbSize = Math.min(this.area.height, this.area.width);
        this.thumbSize += this.thumbSize % 2;
        var size = Math.max(this.area.width, this.area.height);

        this.thumbOuter.css({
            'width': this.thumbSize, 'height': this.thumbSize, 'border-radius': this.thumbSize / 2
        });
        this.thumb.css({
            'width': this.thumbSize, 'height': this.thumbSize, 'border-radius': this.thumbSize / 2
        });

        var needleSize = Math.round(this.thumbSize * this.needleSize);
        needleSize += needleSize % 2;
        var pos = (this.thumbSize / 2) - (needleSize / 2);

        this.thumbInner.css({
            width: needleSize, height: needleSize, borderRadius: needleSize / 2, left: pos, top: pos
        });

        this.valueArea.min = this.thumbSize / 2;
        this.valueArea.max = size - this.thumbSize / 2;
        this.valueArea.size = this.valueArea.max - this.valueArea.min;

        var barPos = (this.thumbSize / 2) - (this.barSize / 2);
        if (this.orientation == 'horizontal') {

            this.elNegative.css({
                "left": this.valueArea.min, top: barPos, height: this.barSize
            });
            this.elPositive.css({
                "left": this.valueArea.min, top: barPos, height: this.barSize
            });
        } else {

            this.elNegative.css({
                "top": 0, width: this.barSize, left: barPos
            });

            this.elPositive.css({
                "top": this.valueArea.min, width: this.barSize, left: barPos
            });
        }
        var br = Math.floor(this.barSize / 2) + this.barSize % 2;

        this.elNegative.css("border-radius", br);
        this.elPositive.css("border-radius", br);

        this.positionBars();
        this.positionThumb();

    },


    positionThumb: function () {
        var pos = this.getValuePos();
        if (this.orientation == 'horizontal') {
            this.thumb.css("left", pos);
        } else {
            this.thumb.css("top", pos);
        }
    },

    positionBars: function () {
        var pos = this.getValuePos();

        if (this.orientation == 'horizontal') {
            if(this.reverse){
                this.elNegative.css({
                    left : pos + this.valueArea.min,
                    width: this.valueArea.size - pos
                });

                this.elPositive.css(
                    {"left": this.valueArea.min,
                        "width": pos}
                );

            }else{
                this.elNegative.css("width", pos);
                this.elPositive.css({"left": pos + this.valueArea.min, "width": this.valueArea.size - pos});

            }



        } else {

            if(this.reverse){
                this.elPositive.css({
                    "height" :this.valueArea.size - pos,
                    top:pos + this.valueArea.min
                });
                this.elNegative.css({
                    top:this.valueArea.min,
                    height: pos
                });
            }else{
                this.elPositive.css("height", pos);
                this.elNegative.css({
                    top: pos + this.valueArea.min,
                    height: this.valueArea.size - pos
                });
            }

        }

    },

    getValuePos: function () {
        if (this.orientation == 'horizontal') {
            var ratio = (this.value - this.minValue) / this.maxValue;
            var val = (this.valueArea.size * ratio);
            return this.reverse ? this.valueArea.size - val : val;
        } else {
            if(this.reverse){
                return (this.valueArea.min + (this.valueArea.size * (this.value - this.minValue) / this.maxValue)) - this.valueArea.min;
            }else{
                return this.valueArea.max - (this.valueArea.min + (this.valueArea.size * (this.value - this.minValue) / this.maxValue));

            }
        }
    },

    startDragging: function (e) {
        this.thumbOuter.css("opacity", "");
        this.thumbOuter.addClass("seekbar-thumb-over");
        this.active = true;

        var position = this.thumb.position();

        var x = e.pageX;
        var y = e.pageY;

        if (e.type && e.type == "touchstart") {
            x = e.originalEvent.touches[0].pageX;
            y = e.originalEvent.touches[0].pageY;
        }

        this.startCoordinates = {x: x, y: y, elX: position.left, elY: position.top};

        return false;
    },

    drag: function (e) {
        if (!this.active)return;

        var x = e.pageX;
        var y = e.pageY;

        if (e.type && e.type == "touchmove") {
            x = e.originalEvent.touches[0].pageX;
            y = e.originalEvent.touches[0].pageY;
        }

        var pos = 0;
        if (this.orientation == 'horizontal') {
            pos = this.startCoordinates.elX + x - this.startCoordinates.x;

        } else {
            pos = this.startCoordinates.elY + y - this.startCoordinates.y;
        }


        if (pos < 0)pos = 0;
        if (pos > this.area.size - this.thumbSize)pos = this.area.size - this.thumbSize;

        var value =  this.minValue + (pos / this.valueArea.size * (this.maxValue - this.minValue));

        if ((this.orientation == 'vertical' && !this.reverse) || (this.orientation == "horizontal" && this.reverse)) {
            value = this.maxValue - value;
        }


        this.val(value);



        this.positionBars();

        if (this.orientation == 'horizontal') {

            this.thumb.css("left", this.getValuePos());
        } else {
            this.thumb.css("top", this.getValuePos());
        }

        return false;
    },

    updateAlpha: function () {
        if (this.thumbAlpha < 1) {
            this.thumbOuter.css("opacity", this.thumbAlpha);
        }
    },

    endDrag: function () {
        if (!this.active)return;

        this.updateAlpha();

        this.thumbOuter.removeClass("seekbar-thumb-over");

        this.active = false;
    }

});
/* ../ludojs/src/form/file.js */
/**
 File upload component<br>
 This components submits the file to an iframe. The url of this iframe is by default.<br>
 LUDOJS_CONFIG.fileupload.url. You can override it with remote.url config property.

 The file upload component should be implemented this way:

 1) File is uploaded to the server<br>
 2) You copy the file to a temporary area and save a reference to it in a database<br>
 3) You return the reference to the file, example id of database row(e.g. 1000)<br>
 4) The reference(1000) will be sent back from the server and saved as value of file upload component.<br>

 A PHP implementation of the PHP code of this can be obtained by contacting post[at]dhtmlgoodies.com.

 @namespace ludo.form
 @class File
 @augments ludo.form.Element
 @constructor
 @param {Object} config
 @example
	 ...
	 children:[{
		 type:'form.File', label:'Pgn File', name:'pgnfile', required:true, labelButton:'Find Pgn file', buttonWidth:100
	 }]
 	 ...
 is example of code used to add a file components as child of a component.

 When the file is uploaded to the server(happens instantly when instantUpload is set to true), the name
 of the file will be sent in POST variable ludo-file-upload-name. The actual file should be available in the
 FILES array sent to the server.

 Example of code sent to server:
 	{
		ludo-file-upload-name : '<name of file>',
		'name-of-file-upload-component' : 'pgnfile'
    }


 Example of PHP Code used to handle the file:

 @example

	 if(isset($_POST['ludo-file-upload-name'])){
		 header('Content-Type: text/html; charset=utf-8');
		 $uploadInfo = FileUpload::uploadFile($_FILES[$_POST['ludo-file-upload-name']]);

		 $data = array('success' => true, 'message' => '', 'data' => $uploadInfo);

		 die(utf8_encode(json_encode($data)));
	 }
 Response from server may look like this:

 @example
	 {
	 	success : true,
	 	value : '100'
	 }

 where success indicates if the upload was successful and value is a reference to the file. When the form with this
 file upload component is later submitted,

 */
ludo.form.File = new Class({
	Extends:ludo.form.LabelElement,
	type:'form.File',

	inputTag:'input',
	inputType:'file',

	/**
	 * Label of "Browse" button
	 * @attribute labelButton
	 * @type String
	 * @default "Browse"
	 */
	labelButton:'Browse',

	/**
	 * Label for "Remove" new file link
	 * @attribute labelRemove
	 * @type String
	 * @default Remove
	 */
	labelRemove:'Remove',
	/**
	 * Label for "Delete" new file link
	 * @attribute {String} labelDelete
	 * @default Delete
	 */
	labelDelete:'Delete',

	/**
	 * Private property for displayed file name. The file upload component is read only. It will only
	 * submit a value if a new file has been selected.
	 * @property valueForDisplay
	 * @private
	 */
	valueForDisplay:'',
	/**
	 * Upload instantly when selecting file. During upload the form component will be flagged
	 * as invalid, i.e. submit button will be disabled during file upload.
	 * @attribute instantUpload
	 * @type {Boolean}
	 * @default true
	 */
	instantUpload:true,

	uploadInProgress:false,

	/**
	 * false when a file has been selected but not uploaded. Happens
	 * when instantUpload is set to false
	 * @property fileUploadComplete
	 * @type {Boolean}
	 */
	fileUploadComplete:true,

	/*
	 * Property used to identify file upload components
	 */
	isFileUploadComponent:true,

	/**
	 * Width of browse button
	 * @attribute buttonWidth
	 * @type {Number}
	 * @default 80
	 */
	buttonWidth:80,

	/**
	 * Comma separated string of valid extensions, example : 'png,gif,bmp'
	 * @attribute accept
	 * @type String
	 */
	accept:undefined,

    /**
     * Name of resource on server to handle uploaded file.
     * @config {String} FileUpload
     * @default 'FileUpload'
     */
    resource:'FileUpload',

	ludoConfig:function (config) {
		this.parent(config);
        this.setConfigParams(config, ['resource','instantUpload','labelButton','labelRemove','labelDelete','buttonWidth']);
		if (config.accept) {
			this.accept = config.accept.toLowerCase().split(/,/g);
		}
		if (config.value) {
			this.valueForDisplay = config.value;
		}
		this.value = '';
	},

	ludoRendered:function () {
		this.parent();

		var cell = $('<td>');
		cell.width = this.buttonWidth;
		cell.css('textAlign', 'right');
		this.getInputRow().append(cell);
		cell.append(this.getFormEl());

		var btn = new ludo.form.Button({
			type:'form.Button',
			layout:{
				height:30,
				width:this.buttonWidth
			},
			value:this.labelButton,
			overflow:'hidden',
			renderTo:cell
		});

		var fe = this.getFormEl();
		fe.css({
			opacity:0,
			'-moz-opacity':0,
			height:'100%',
			'position':'absolute',
			'right':0,
			top:0,
			'z-index':100000,
			cursor:'pointer',
			filter:'alpha(opacity=0)'
		});

		fe.on('mouseover', btn.mouseOver.bind(btn));
		fe.on('mouseout', btn.mouseOut.bind(btn));
		fe.on('mousedown', btn.mouseDown.bind(btn));
		fe.on('mouseup', btn.mouseUp.bind(btn));
		fe.on('change', this.selectFile.bind(this));



		btn.getEl().append(fe);

		this.createIframe();
		this.createFormElementForComponent();

		if (this.valueForDisplay) {
			this.displayFileName();
		}
	},

	createFormElementForComponent:function () {
		var formEl = this.els.form = $('<form method="post action="' + this.getUploadUrl() + '" enctype="multipart/form-data" target="' + this.getIframeName() + '">');

		formEl.css({ margin:0, padding:0, border:0});
		this.getEl().append(formEl);
		formEl.append(this.getBody());

		this.addElToForm('ludo-file-upload-name',this.getName());
		this.addElToForm('request', this.getResource() + '/save');

	},

    getResource:function(){
        return this.resource || 'FileUpload';
    },

	addElToForm:function(name,value){
		var el =$('<input type="hidden" name="' + name + '">');
		el.val(value);
		this.els.form.append(el);
	},

	createIframe:function () {
		this.iframeName = this.getIframeName();
		var el = this.els.iframe = $('<iframe name="' + this.iframeName + '">');
		el.css({
			width:1, height:1,
			visibility:'hidden',
			position:'absolute'
		});
		this.getEl().append(el);
		el.on('load', this.onUploadComplete.bind(this));

	},

	getIframeName:function () {
		return 'iframe-' + this.getId();
	},

	onUploadComplete:function () {
		this.fileUploadComplete = true;
		if (window.frames[this.iframeName].location.href.indexOf('http:') == -1) {
			return;
		}
		try {
			var json = JSON.parse(window.frames[this.iframeName].document.body.innerHTML);
			if (json.success) {
				this.value = json.response;
				/**
				 * Event fired after a successful file upload, i.e. no server errors and json.success in
				 * response is true
				 * @event submit
				 * @param {Object} JSON from server (json.response)
				 * @param {Object} ludo.form.file
				 */
				this.fireEvent('submit', [json.response, this]);
			} else {
				/**
				 * Event fired after an unsuccessful file upload because json.success was false
				 * @event submitfail
				 * @param {Object} json from server
				 * @param {Object} ludo.form.file
				 */
				this.fireEvent('submitfail', [json, this]);
			}

			this.fireEvent('valid', ['', this]);
		} catch (e) {
			var html = '';
			try {
				html = window.frames[this.iframeName].document.body.innerHTML;
			} catch (e) {
			}
			/**
			 * Event fired when upload failed
			 * @event fail
			 * @param {Object} Exception
			 * @param {String} response from server
			 * @param {Object} ludo.form.file
			 */
			this.fireEvent('fail', [e, html, this]);

		}

		this.uploadInProgress = false;
		this.displayFileName();

        this.validate();
	},

	isValid:function () {
		if (this.required && !this.getValue() && !this.hasFileToUpload()) {
			return false;
		}
		if (!this.hasValidExtension())return false;
		return !this.uploadInProgress;
	},

	hasValidExtension:function () {
		if (!this.hasFileToUpload() || this.accept === undefined) {
			return true;
		}
		return this.accept.indexOf(this.getExtension()) >= 0;

	},

	getExtension:function () {
		var file = this._get();
		var tokens = file.split(/\./g);
        return tokens.pop().toLowerCase();
	},

	getUploadUrl:function () {
        var url = ludo.config.getFileUploadUrl() || this.getUrl();
        if (!url) {
            ludo.util.warn('No url defined for file upload. You can define it with the code ludo.config.setFileUploadUrl(url)');
        }
		return url;
	},

	selectFile:function () {
		this.value = this.valueForDisplay = this.getFormEl().get('value');
		this.fileUploadComplete = false;
		this.displayFileName();
		this.setDirty();
		if (this.instantUpload) {
			this.upload();
		}

	},

	displayFileName:function () {
        var ci = this.els.cellInput;
		ci.html( '');
		ci.removeClass('ludo-input-file-name-new-file');
		ci.removeClass('ludo-input-file-name-initial');
		ci.removeClass('ludo-input-file-name-not-uploaded');
		if (this.valueForDisplay) {

            var span = ludo.dom.create({
                tag:'span',
                html : this.valueForDisplay + ' ',
                renderTo:ci
            });

			var deleteLink = new Element('a');
			deleteLink.addEvent('click', this.removeFile.bind(this));
			deleteLink.set('href', '#');
			var html = this.labelRemove;
			if (this.valueForDisplay == this.initialValue) {
				html = this.labelDelete;
				ci.addClass('ludo-input-file-name-initial');
			} else {
				ci.addClass('ludo-input-file-name-new-file');
			}
			if (!this.fileUploadComplete) {
				ci.addClass('ludo-input-file-name-not-uploaded');
			}
			deleteLink.html( html);
			ci.append(deleteLink);
		}
	},
	resizeDOM:function () {
		/* No DOM resize necessary for this component */
	},
	upload:function () {
		if (!this.hasValidExtension()) {
			return;
		}
		this.fireEvent('invalid', ['', this]);
		this.uploadInProgress = true;
		this.els.form.submit();
	},

	getValue:function () {
		console.warn("Use of deprecated getValue");
		console.trace();
		return this.value;
	},


	_get:function(){
		return this.value;
	},
	/**
	 * setValue for file inputs is display only. File inputs are readonly
	 * @function setValue
	 * @param {Object} value
	 */
	setValue:function (value) {
		console.warn("Use of deprecated setValue");
		this.valueForDisplay = value;
		this.displayFileName();
		this.validate();
	},

	/**
	 * "set" is readonly for file inputs. It will update the displayed file name, not the file input it's self.
	 * Method without arguments returns the file input value
	 * @function val
	 * @param {Object} value
	 */
	val:function(value){
		if(arguments.length == 0){
			return this._get();
		}

		this.valueForDisplay = value;
		this.displayFileName();
		this.validate();
	},

	commit:function () {
		this.initialValue = this.valueForDisplay;
		this.displayFileName();
	},

	removeFile:function () {
        this.valueForDisplay = this.valueForDisplay === this.initialValue ? '' : this.initialValue;
		this.value = '';
		this.displayFileName();
		this.validate();
		return false;
	},

	hasFileToUpload:function () {
		return !this.fileUploadComplete;
	},

	blur:function () {

	},

    supportsInlineLabel:function(){
        return false;
    }
});
/* ../ludojs/src/form/search-field.js */
/**
 * Form field designed to search in dataSource.Collection
 * @namespace ludo.form
 * @class SearchField
 * @augments ludo.form.Text
 */
ludo.form.SearchField = new Class({
	Extends:ludo.form.Text,
	type:'form.SearchField',

	/**
	 * Collection to search in
	 * @config {dataSource.Collection} searchIn
	 * @default undefined
	 */
	searchIn:undefined,

	/**
	 * Delay in seconds from key press to search is executed.
	 * @config {Number} delay
	 * @default 0
	 */
	delay:0,

	lastValue:undefined,

	/**
	 Custom search fn to execute instead of plain text search
	 @config {Function} searchFn
	 @default undefined
	 @example
	 	searchFn:function(record){
	 		return record.value = this.value && record.active === true
	 	}
	 note that "this" inside the function is a reference to search field.
	 */
	searchFn:undefined,

	remote:false,

	lastSearch:undefined,

	ludoConfig:function (config) {
		this.parent(config);
        this.setConfigParams(config, ['searchIn','delay','searchFn','remote']);

		if (this.searchFn !== undefined)this.searchFn = this.searchFn.bind(this);
		this.addEvent('key', this.queue.bind(this));

		this.setDataSource();
	},

	setDataSource:function(){
		if(ludo.util.isString(this.searchIn)){
			var s = ludo.get(this.searchIn);
			if(!s){
				this.setDataSource.delay(100, this);
			}else{
				this.searchIn = ludo.get(this.searchIn);
			}
		}
	},

	queue:function (value) {
		this.value = value;
		if (this.delay === 0) {
			this.search();
		} else {
			this.lastValue = value;
			this.execute.delay(this.delay * 1000, this, value);
		}
	},

	execute:function (value) {
		if (value != this.lastValue || value == this.lastSearch)return undefined;
		this.lastSearch =  this._get();
		return this.search();
	},

	/**
	 * Executes search in data source
	 * @function search
	 */
	search:function () {
		if(this.remote){
			this.searchIn.remoteSearch(this._get());
			return undefined;
		}
		else {
			return this.searchIn.getSearcher().search(this.searchFn ? this.searchFn : this._get());
		}
	}
});/* ../ludojs/src/form/validator/base.js */
/**
 * Base class for form component validators
 * @namespace ludo.form.validator
 * @class Base
 * @augments Core
 */
ludo.form.validator.Base = new Class({
	Extends:ludo.Core,

	value:undefined,

	/**
	 * Validator is applied to this component
	 * @attribute object applyTo
	 * @default undefined
	 */
	applyTo:undefined,

	ludoConfig:function (config) {
		this.parent(config);
		if (config.value !== undefined)this.value = config.value;
		if (config.applyTo !== undefined)this.applyTo = config.applyTo;
		if (!this.value) {
			this.loadValue();
		}
	},

	/**
	 Loading valid value from server.
	 @function loadValue
	 Request to server example:
	 @example
		{
			getValidatorValueFor:'nameOfView',
		}
	 Response from server example:
	 @example
	 	{ success:true, data : { value : 'valid value} }

	*/
	loadValue:function () {
		new ludo.remote.JSON({
			url:this.getUrl,
			data:{
				"request": ["Md5Validation",this.applyTo.getName(),"read"].join('/'),
				"data": {
					"md5Validation" : true,
					"getValidatorValueFor": this.applyTo.getName()
				}
			},
			"listeners":{
				"success":  function(request){
					this.value = request.getData().value;
					/**
					 * Event fired after validator value has been loaded from server
					 * @event loadValue
					 * @param form.validator.Base this
					 */
					this.fireEvent('loadValue', this);
				}.bind(this)
			}
		});
	},

	isValid:function (value) {
		return value == this.value;
	}
});/* ../ludojs/src/form/validator/md5.js */
/**
 * Md5 validator for form elements
 * When used, the associated form element will be flagged as invalid if MD5(value) doesn't match value of this validator.
 * If no value is sent to the constructor of form.validator.Md5, it will send a request to the server and ask for it.
 * @class Md5
 * @augments ludo.form.validator.Base
 *
 */
ludo.form.validator.Md5 = new Class({
    Extends:ludo.form.validator.Base,
    type : 'form.validator.Md5',

    /**
     * MD5 value to validate against. Component will be valid only when
     * md5(formElement.value) matches this value
     * @attribute value
     * @default undefined
     */
    value:undefined,

    isValid : function(value){
        return faultylabs.MD5(value) == this.value;
    }
});/* ../ludojs/src/paging/button.js */
/**
 * Base class, paging buttons for datasource.Collection
 * Assign a paging element to a data source by sending "id" or config object of
 * the source using the dataSource constructor property
 * @namespace paging
 * @class Button
 * @augments form.Button
 */
ludo.paging.Button = new Class({
    Extends: ludo.form.Button,
    type : 'grid.paging.Next',
    width:25,
    buttonCls : '',
	tpl:undefined,
	onLoadMessage:undefined,

    ludoDOM:function(){
        this.parent();
        this.getBody().addClass(this.buttonCls);
    },

    ludoEvents:function(){
        this.parent();
        this.dataSourceEvents();
    },

    dataSourceEvents:function(){
        var ds = ludo.get(this.dataSource);
        if(ds){
            this.addDataSourceEvents();
        }else{
            this.dataSourceEvents.delay(100, this);
        }
    },

    addDataSourceEvents:function(){},

	insertJSON:function(){}
});/* ../ludojs/src/paging/next.js */
/**
 Button used to navigate to next page in a dataSource.Collection
 @namespace paging
 @class Next
 @augments paging.Button
 @constructor
 @param {Object} config
 @example
 	children:[
 		...
		 {
			 type:'paging.Next',
			 dataSource:'myDataSource'
		 }
 		...
 	}
 where 'myDataSource' is the id of a dataSource.Collection object used by a view.
 */
ludo.paging.Next = new Class({
	Extends:ludo.paging.Button,
	type:'grid.paging.Next',
	buttonCls:'ludo-paging-next',

	addDataSourceEvents:function () {
		this.addEvent('click', this.nextPage.bind(this));
		var ds = this.getDataSource();
		ds.addEvent('lastPage', this.disable.bind(this));
		ds.addEvent('notLastPage', this.enable.bind(this));
	},

	/**
	 * Calls nextPage() method of data source
	 * @function nextPage
	 */
	nextPage:function () {
		this.getDataSource().nextPage();
	}
});/* ../ludojs/src/paging/previous.js */
/**
 Button used to navigate to previous page in a dataSource.Collection
 @namespace paging
 @class Last
 @augments paging.Button
 @constructor
 @param {Object} config
 @example
 	children:[
 		...
		 {
			 type:'paging.Previous',
			 dataSource:'myDataSource'
		 }
 		...
 	}
 where 'myDataSource' is the id of a dataSource.Collection object used by a view.
 */
ludo.paging.Previous = new Class({
	Extends:ludo.paging.Button,
	type:'grid.paging.Previous',
	buttonCls:'ludo-paging-previous',

	addDataSourceEvents:function () {
		this.addEvent('click', this.nextPage.bind(this));
		var ds = this.getDataSource();
		ds.addEvent('firstPage', this.disable.bind(this));
		ds.addEvent('notFirstPage', this.enable.bind(this));

		if (ds.isOnFirstPage()) {
			this.disable();
		}
	},

	nextPage:function () {
		this.getDataSource().previousPage();
	}

});/* ../ludojs/src/paging/last.js */
/**
 Button used to navigate to last page in a dataSource.Collection
 @namespace paging
 @class Last
 @augments paging.Button
 @constructor
 @param {Object} config
 @example
 	children:[
 		...
		 {
			 type:'paging.Last',
			 dataSource:'myDataSource'
		 }
 		...
 	}
 where 'myDataSource' is the id of a dataSource.Collection object used by a view.
 */
ludo.paging.Last = new Class({
	Extends:ludo.paging.Button,
	type:'grid.paging.Last',
	buttonCls:'ludo-paging-last',

	addDataSourceEvents:function () {
		this.addEvent('click', this.nextPage.bind(this));
		var ds = this.getDataSource();
		ds.addEvent('lastPage', this.disable.bind(this));
		ds.addEvent('notLastPage', this.enable.bind(this));
	},

	nextPage:function () {
		this.getDataSource().lastPage();
	}
});/* ../ludojs/src/paging/first.js */
/**
 Button used to navigate to first page in a dataSource.Collection
 @namespace paging
 @class First
 @augments paging.Button
 @constructor
 @param {Object} config
 @example
 	children:[
 		...
		 {
			 type:'paging.First',
			 dataSource:'myDataSource'
		 }
 		...
 	}
 where 'myDataSource' is the id of a dataSource.Collection object used by a view.
 */
ludo.paging.First = new Class({
	Extends:ludo.paging.Button,
	type:'grid.paging.First',
	buttonCls:'ludo-paging-first',

	addDataSourceEvents:function () {
		this.addEvent('click', this.firstPage.bind(this));
		var ds = this.getDataSource();
		ds.addEvent('firstPage', this.disable.bind(this));
		ds.addEvent('notFirstPage', this.enable.bind(this));

		if (ds.isOnFirstPage()) {
			this.disable();
		}
	},

	firstPage:function () {
		this.getDataSource().firstPage();
	}

});/* ../ludojs/src/paging/page-input.js */
/**
 * Text input for navigating to a specific page in a datasource.Collection
 * @namespace paging
 * @class PageInput
 * @augments form.Number
 */
ludo.paging.PageInput = new Class({
    Extends: ludo.form.Number,
    type : 'grid.paging.PageInput',
    width: 35,
    fieldWidth:30,
    minValue : 1,
    reverseWheel:true,

    ludoEvents:function(){
        this.parent();
        this.dataSourceEvents();
    },

    dataSourceEvents:function(){
        if(ludo.get(this.dataSource)){
            var ds = this.getDataSource();
            if(ds){
                ds.addEvent('page', this.setPageNumber.bind(this));
                ds.addEvent('load', this.updateMaxValue.bind(this));
                this.setPageNumber(ds.getPageNumber());
                this.addEvent('change', this.updateDataSourcePageNumber.bind(this));
                this.updateMaxValue();
            }

        }else{
            this.dataSourceEvents.delay(100, this);
        }
    },
    setPageNumber:function(number){
        this.value = number;
        this.els.formEl.val(number);
    },

    updateDataSourcePageNumber:function(){
        this.getDataSource().toPage(this.val());
    },

    updateMaxValue:function(){
        this.maxValue = this.getDataSource().getPageCount();
    },

	insertJSON:function(){

	}
});/* ../ludojs/src/paging/current-page.js */
/**
 Displays current page number shown in a collection
 @class paging.TotalPages
 @augments View
 @constructor
 @param {Object} config
 @example
 children:[
 ...
 {
			  type:'paging.TotalPages',
			  dataSource:'myDataSource'
		  }
 ...
 }
 where 'myDataSource' is the id of a dataSource.Collection object used by a view.
 */
ludo.paging.CurrentPage = new Class({
	Extends:ludo.View,
	type:'grid.paging.CurrentPage',
	width:25,
	onLoadMessage:'',
	/**
	 * Text template for view. {pages} is replaced by number of pages in data source.
	 * @attribute {String} tpl
	 * @default '/{pages}'
	 */
	tpl:'{page}',

	ludoDOM:function () {
		this.parent();
		this.getEl().addClass('ludo-paging-text');
		this.getEl().addClass('ludo-paging-current-page');
	},

	ludoEvents:function () {
		this.parent();
        this.dataSourceEvents();
	},

    dataSourceEvents:function(){
        if(ludo.get(this.dataSource)){
            var ds = this.getDataSource();
            if (ds) {
                ds.addEvent('page', this.setPageNumber.bind(this));
                this.setPageNumber(ds.getPageNumber());
            }
        }else{
            this.dataSourceEvents.delay(100, this);
        }
    },

	setPageNumber:function () {
		this.html(this.tpl.replace('{page}', this.getDataSource().getPageNumber()));
	},

	insertJSON:function () {

	}
});/* ../ludojs/src/paging/total-pages.js */
/**
 Displays number of pages in a data source
 @class paging.TotalPages
 @augments View
 @constructor
 @param {Object} config
 @example
 children:[
 ...
 {
			  type:'paging.TotalPages',
			  dataSource:'myDataSource'
		  }
 ...
 }
 where 'myDataSource' is the id of a dataSource.Collection object used by a view.
 */
ludo.paging.TotalPages = new Class({
	Extends:ludo.View,
	type:'grid.paging.TotalPages',
	width:25,
	onLoadMessage:'',
	/**
	 * Text template for view. {pages} is replaced by number of pages in data source.
	 * @attribute {String} tpl
	 * @default '/{pages}'
	 */
	tpl:'/{pages}',

	ludoDOM:function () {
		this.parent();
		this.getEl().addClass('ludo-paging-text');
		this.getEl().addClass('ludo-paging-total-pages');
	},

	ludoEvents:function () {
		this.parent();
        this.dataSourceEvents();
	},

    dataSourceEvents:function(){
        if(ludo.get(this.dataSource)){
            var ds = this.getDataSource();
            if (ds) {
                ds.addEvent('load', this.setPageNumber.bind(this));
                ds.addEvent('pageCount', this.setPageNumber.bind(this));
                this.setPageNumber(ds.getPageNumber());
            }
        }else{
            this.dataSourceEvents.delay(100, this);
        }
    },

	setPageNumber:function () {
		this.html(this.tpl.replace('{pages}', this.getDataSource().getPageCount()));
	},

	insertJSON:function () {

	}
});/* ../ludojs/src/paging/nav-bar.js */
/**
 A view containing buttons and views for navigating in a dataSource.Collection.
 default children: ['paging.First','paging.Previous','paging.PageInput','paging.TotalPages','paging.Next','paging.Last']
 You can customize which views to show by using the children constructor property.
 @namespace paging
 @class NavBar
 @augments View
 @constructor
 @param {Object} config
 @example
 	children:[
 		{
			type:'grid.Grid',
			columnManager:{
				...
			},
			dataSource:{
				url:'data-source/grid.php',
				id:'myDataSource'
			}

 		},
 		...
 		...
		{
			type:'paging.NavBar',
			dataSource:'myDataSource'
		}
 		...
 	}
 where 'myDataSource' is the id of a dataSource.Collection object used by the Grid above.
 */
ludo.paging.NavBar = new Class({
	Extends:ludo.View,
	type:'paging.NavBar',
	layout:'cols',
	height:25,

	children:[
		{
			type:'paging.First'
		},
		{
			type:'paging.Previous'
		},
		{
			type:'paging.PageInput'
		},
		{
			type:'paging.TotalPages'
		},
		{
			type:'paging.Next'
		},
		{
			type:'paging.Last'
		}
	],

	ludoConfig:function (config) {
		this.parent(config);

		if (config.dataSource) {
			for (var i = 0; i < config.children.length; i++) {
				config.children[i].dataSource = config.dataSource;
			}
			this.dataSource = undefined;
		}
	},

	insertJSON:function(){

	}
});/* ../ludojs/src/paging/page-size.js */
/**
 * Select box for setting page size of a Collection
 * @namespace paging
 * @class PageSize
 */
ludo.paging.PageSize = new Class({
	Extends: ludo.form.Select,

	options:[
		{ value : 10, text : '10' },
		{ value : 25, text : '25' },
		{ value : 50, text : '50' },
		{ value : 100, text : '100' }
	],

	label : 'Page size',
	applyTo:undefined,

	ludoConfig:function(config){
		this.applyTo = ludo.get(config.dataSource || this.applyTo);
		config.dataSource = undefined;
		this.parent(config);
	},

	ludoEvents:function(){
		this.parent();
		this.addEvent('change', this.setPageSize.bind(this));
	},

	setPageSize:function(){
		if(this.applyTo){
			this.applyTo.setPageSize(this.val());
		}
	}

});/* ../ludojs/src/panel.js */
/**
 * A Panel
 * A Panel is a component where the body element is a &lt;fieldset> with a &lt;legend>
 * @class Panel
 * @augments View
 */
ludo.Panel = new Class({
	Extends:ludo.View,
	tagBody:'fieldset',

	_createDOM:function () {
		this.parent();
		this.getEl().addClass('ludo-panel');
		this.els.legend = new Element('legend');
		this.els.body.append(this.els.legend);
		this.getEl().addClass('ludo-panel');
	},

	ludoDOM:function () {
		this.parent();
		this.setTitle(this.title);
	},

	ludoRendered:function () {
		this.parent();
		this.getBody().setStyle('display', 'block');
	},
	autoSetHeight:function () {
		this.parent();
		var sizeLegend = this.els.legend.measure(function () {
			return this.getSize();
		});
		this.layout.height += sizeLegend.y;

	},

	getInnerHeightOfBody:function () {
		return this.parent() - this.getHeightOfLegend() - 5;
	},

	heightOfLegend:undefined,
	getHeightOfLegend:function () {
		if (this.layout.heightOfLegend === undefined) {
			this.layout.heightOfLegend = this.els.legend.offsetHeight;
		}
		return this.layout.heightOfLegend;
	},

	resizeDOM:function () {
		var height = this.getHeight();
		if (height == 0) {
			return;
		}

		height -= (ludo.dom.getMBPH(this.getBody()) + ludo.dom.getMBPH(this.getEl()));
		if (height > 0 && !isNaN(height)) {
			this.getBody().style.height = height + 'px';
		}

		var width = this.getWidth();
		width -= (ludo.dom.getMBPW(this.getBody()) + ludo.dom.getMBPW(this.getEl()));

		if (width > 0 && !isNaN(width)) {
			this.getBody().style.width = width + 'px';
		}
	},

	setTitle:function (title) {
		this.parent(title);
		this.els.legend.html( title);
	}
});/* ../ludojs/src/anchor.js */
/**
 * Anchor Component
 * @class Anchor
 * @augments View
 */
ludo.Anchor = new Class({
    Extends:ludo.View,
    type:'Anchor',
    height:15,
    ludoConfig:function (config) {
        this.parent(config);
        this.anchorText = config.anchorText;
    },

    ludoDOM:function () {
        this.parent();
        this.els.anchor = new Element('a');
        this.els.anchor.addClass('ludo-anchor-text');
        this.els.anchor.html( this._html);
        this.els.anchor.setProperty('href', '#');
        this.els.anchor.addEvent('click', this.anchorClick.bind(this));
        this.getBody().append(this.els.anchor);
    },

    ludoEvents:function () {
        this.parent();
        this.getBody().addEvent('click', this.anchorClick.bind(this))
    },

    getAnchorTag:function () {
        return this.els.anchor;
    },

    anchorClick:function () {
        /**
         * Click on anchor
         * @event click
         * @param {Object} component
         */
        this.fireEvent('click', this);
        return false;
    }

});/* ../ludojs/src/dialog/dialog.js */
/**
 * Basic dialog class and base class for all other dialogs. This class extends
 * <a href="ludo.Window.html">ludo.Window</a>.
 * @class ludo.dialog.Dialog
 * @param {object} config
 * @augments Window
 */
ludo.dialog.Dialog = new Class({
	Extends:ludo.Window,
	type:'dialog.Dialog',
	/**
	 * Show modal version of dialog
	 * @attribute {Boolean} modal
	 * @optional
	 * @default true
	 */
	modal:true,
	/**
	 * Auto dispose/erase component on close
	 * @attribute {Boolean} autoRemove
	 * @optional
	 * @default true
	 */
	autoRemove:true,
	/**
	 * Auto hide component on button click. If autoRemove is set to true, the component
	 * will be deleted
	 * @attribute {Boolean} autoHideOnBtnClick
	 * @optional
	 * @default true
	 */
	autoHideOnBtnClick:true,

	/**
	  Camel case string config for buttons.<br>
	  example: YesNoCancel for three buttons labeled "Yes", "No" and "Cancel"<br>
	  Example of use: <br>

	  @attribute {String} buttonConfig
	  @default undefined
      @example
         new ludo.dialog.Dialog({
              html : 'Do you want to save your work?',
               buttonConfig : 'YesNoCancel'
               listeners : {
                   'yes' : this.saveWork.bind(this),
                   'no' : this.discardWork.bind(this),
                   'cancel' : this.hide.bind(this)
               }
          });
	 */
	buttonConfig:undefined,


	movable:true,
	closable:false,
	minimizable:false,

	ludoConfig:function (config) {
		// TODO use buttons instead of buttonConfig and check for string
		config.buttonConfig = config.buttonConfig || this.buttonConfig;
		if (config.buttonConfig) {
			var buttons = config.buttonConfig.replace(/([A-Z])/g, ' $1');
			buttons = buttons.trim();
			buttons = buttons.split(/\s/g);
			config.buttons = [];
			for (var i = 0; i < buttons.length; i++) {
				config.buttons.push({
					value:buttons[i]
				});
			}
		}
		this.parent(config);
        this.setConfigParams(config, ['modal','autoRemove','autoHideOnBtnClick']);
	},

	ludoDOM:function () {
		this.parent();
		this.getEl().addClass('ludo-dialog');
	},

    getShim:function(){
        if(this.els.shim === undefined){
            var el = this.els.shim = ludo.dom.create({
                cls : 'ludo-dialog-shim',
                renderTo:document.body
            });
            el.css('display', 'none');
        }
        return this.els.shim;
    },

	ludoEvents:function () {
		this.parent();
		if (this.isModal()) {
			this.getEventEl().on('resize', this.resizeShim.bind(this));
		}
	},

	ludoRendered:function () {
		this.parent();
		if (!this.isHidden()) {
            this.center();
			this.showShim();
		}
		var buttons = this.getButtons();

		for (var i = 0; i < buttons.length; i++) {
			buttons[i].addEvent('click', this.buttonClick.bind(this));
		}
	},

	isModal:function () {
		return this.modal;
	},
	show:function () {

        this.showShim();
		this.parent();

	},

	hide:function () {
		this.parent();
		this.hideShim();
		if (this.autoRemove) {
			this.dispose.delay(1000, this);
		}
	},

	showShim:function () {
        this.center();
		if (this.isModal()) {
			this.getShim().css({
				display:'',
				'z-index' : this.getEl().css('z-index') -1
			});
			this.resizeShim();
		}
	},

	resizeShim:function () {
		var b = $(document.body);
		var size = { x: b.width(), y: b.height() };
        this.getShim().css('width',  size.x);
        this.getShim().css('height',  size.y + 'px');
	},

	hideShim:function () {
		if (this.isModal()) {
            this.getShim().css('display', 'none');
		}
	},

	buttonClick:function (value, button) {
		/**
		 * This event is fired when a button is clicked.
		 * The name of the button is lowercase version of button value with white space removed
		 * Example: for a button with value "OK", an "ok" event will be sent.
		 *
		 * Name of event is value of button in lowercase
		 * @event buttonvalue
		 * @param {Object} ludo.View (Parent component of button)
		 */
		this.fireEvent(button._get().replace(/\s/g, '').toLowerCase(), this);
		if (this.autoHideOnBtnClick) {
			this.hide();
		}
	}
});/* ../ludojs/src/dialog/confirm.js */
/**
  Standard confirm dialog with default "OK" and "Cancel" buttons
  @namespace dialog
  @class Confirm
  @augments Dialog
  @constructor
  @param {Object} config
  @example
 	new ludo.dialog.Confirm({
 		html : 'Do you want to quit',
 		buttons:[
 			{
 				value:'Yes,'type':'form.Button',width:60
 			},
 			{
 				value:'No,'type':'form.Button',width:60
 			}
 		],
 		listeners:{
 			'yes':this.quit.bind(this)
 		}
 	});
  will create a confirm dialog with two buttons, "Yes" and "No". When click on "Yes", the dialog will be
 closed and disposed and the quit method of the object creating the dialog will be called. On click on "No"
 the dialog will be closed and disposed(it's default behavior on button click) and the nothing else will happen.
 */
ludo.dialog.Confirm = new Class({
    Extends: ludo.dialog.Dialog,
    type : 'dialog.Confirm',

    ludoConfig : function(config){
        if(!config.buttons && !config.buttonConfig && !config.buttonBar){
            config.buttons = [
                {
                    value : 'OK',
                    width : 60,
					defaultSubmit:true,
                    type : 'form.Button'
                },
                {
                    value : 'Cancel',
                    width : 60
                }
            ]
        }
        this.parent(config);
    }
});

/* ../ludojs/src/dialog/alert.js */
/**
 @namespace ludo.dialog
 @class ludo.dialog.Alert
 @augments Dialog
 @description Alert dialog. This component has by default one button "OK" and will fire an
 "ok" event when this button is clicked
 @param {Object} config
 @example
	 new ludo.dialog.Alert(
	 	{ html: 'Well done! You solved this puzzle. Click OK to load next' }
	 	listeners : {
		   'ok' : this.loadNextPuzzle.bind(this)
		  }
	 });
 will display a dialog in default size with a listener attached to the "OK" button. When clicked
 it will call the loadNextPuzzle method of the object creating the alert dialog.
 */
ludo.dialog.Alert = new Class({
	Extends:ludo.dialog.Dialog,
	type:'dialog.Alert',
	buttonConfig:undefined,
	width:300,
	height:150,

	resizable:false,

	ludoConfig:function (config) {
		if (config.substr) {
			config = {
				html:config
			}
		}
		if (!config.buttons) {
			config.buttons = [
				{
					value:'OK',
					width:60
				}
			]
		}
		this.parent(config);
	}
});

/* ../ludojs/src/dialog/prompt.js */
/**
 * Dialog with one text field. Default buttons are "OK" and "Cancel"
 * @namespace dialog
 * @class Prompt
 * @augments Dialog
 */
ludo.dialog.Prompt = new Class({
    Extends: ludo.dialog.Dialog,
    type : 'dialog.Prompt',
    input : undefined,
    inputConfig : {},
    label:'',
    value:'',
    ludoConfig : function(config){
        if(!config.buttons && !config.buttonConfig && !config.buttonBar){
            config.buttons = [
                {
                    value : 'OK',
                    width : 60,
					defaultSubmit:true,
                    type:'form.Button'
                },
                {
                    value : 'Cancel',
                    width : 60
                }
            ]
        }
        this.setConfigParams(config, ['label','value','inputConfig']);
        this.parent(config);
    },

    ludoRendered : function(){
        this.parent();
        var inputConfig = Object.merge(this.inputConfig, {
            type : 'form.Text',
            label : this.label,
            value : this.value
        });

        this.input = this.addChild(inputConfig);
        this.input.focus();
    },
    /**
     * Return value of input field
     * @function getValue
     * @return String value
     */
    getValue : function(){
        return this.input.getValue()
    },

    buttonClick : function(value, button){
        /**
         * Event fired on when clicking on dialog button
         * @event lowercase name of button with white space removed
         * @param {String} value of input field
         * @param {Object} ludo.dialog.Prompt
         *
         */
        this.fireEvent(button.value.toLowerCase(), [this.getValue(), this]);
        if (this.autoHideOnBtnClick) {
            this.hide();
        }
    }

});/* ../ludojs/src/video/video.js */
/**
 Base class for Video Player components
 @namespace video
 @class Video
 @augments View
 */
ludo.video.Video = new Class({
	Extends:ludo.View,
	type:'video.Video',
	/**
	 * ID of movie, to show, example an YouTube id
	 * @attribute movieId
	 * @type String
	 * @default undefined
	 */
	movieId:undefined,

	ludoConfig:function (config) {
		this.parent(config);
		if (config.movieId)this.movieId = config.movieId;
	},

	setContent:function () {
		var el = this.els.body;
		var obj = $('<object>');
		obj.attr({
			'width':'100%',
			'height':'100%'
		});
		el.append(obj);

		var param = $('<param>');
		param.attr({
			'name':'movie',
			'value':this.getUrl()
		});
		obj.append(param);

		var param2 = $('<param>');
		param2.attr({
			'name':'wmode',
			'value':'transparent'
		});
		obj.append(param2);

		var embed = this.els.embed = $('<embed>');
		embed.attr({
			'src':this.getVideoUrl(),
			'type':'application/x-shockwave-flash',
			'wmode':'transparent',
			'width':'100%',
			'height':'100%'
		});
		obj.append(embed);
		el.css('overflow', 'hidden');
		return el;
	},
	/**
	 * Load a new movie
	 * @function loadMovie
	 * @param {String} movieId
	 * @return undefined
	 */
	loadMovie:function (movieId) {
		this.movieId = movieId;
		this.els.embed.attr('src', this.getVideoUrl());
	}
});/* ../ludojs/src/video/you-tube.js */
/**
 YouTube video player component
 @namespace video
 @class YouTube
 @augments video.Video
 @constructor
 @param {Object} config
 @example
	 var win = new ludo.Window({
		 left:100, top:50,
		 hideBodyOnMove:true,
		 title:'YouTube Video',
		 aspectRatio:1.6,
		 preserveAspectRatio:true,
		 width:600,
		 layout:'rows',
		 children:[
			 { name:'youtubevideo', weight:1, type:'video.YouTube',movieId:'fPTLa3ylmuw' }
		 ]
	 });
 Shows a YouTube video inside a window.
 */
ludo.video.YouTube = new Class({
	Extends:ludo.video.Video,
	type:'video.YouTube',

	getVideoUrl:function () {
		return 'http://www.youtube.com/v/' + this.movieId;
	}

});/* ../ludojs/src/canvas/gradient.js */
/**
Class for linear gradients
@namespace canvas
@class Gradient
@augments canvas.NamedNode
@constructor
@param {Object} config
@example
	var gradient = new ludo.canvas.Gradient({
		id:'myGradient'
	});
	gradient.addStop('0%', 'red');
	gradient.addStop('100%', '#FFF', 1);

 */
ludo.canvas.Gradient = new Class({
	Extends:ludo.canvas.NamedNode,
	tagName:'linearGradient',
	stopTags:[],

	/**
	 Add stop point
	 @function addStop
	 @param {String} offset
	 @param {String} stopColor
	 @param {Number|undefined} stopOpacity
	 @return {ludo.canvas.Stop} stop
	 @example
		 var gradient = new ludo.canvas.Gradient({
			id:'myGradient'
		 });
		 gradient.addStop('0%', 'red');
		 gradient.addStop('100%', '#FFF', 1);
	 	 canvas.append(gradient);
	 */
	addStop:function (offset, stopColor, stopOpacity) {
		var attr = {
			offset:offset,
			'stop-color':stopColor
		};
		if (stopOpacity !== undefined) {
			if (stopOpacity > 1)stopOpacity = stopOpacity / 100;
			attr['stop-opacity'] = stopOpacity
		}
		var stopTag = new ludo.canvas.Stop(attr);
		this.append(stopTag);
		this.stopTags.push(stopTag);
		return stopTag;
	},

	/**
	 * Get stop node by index
	 * @function getStop
	 * @param {Number} index
	 * @return {canvas.Stop} stop
	 */
	getStop:function (index) {
		return this.stopTags[index];
	}

});/* ../ludojs/src/canvas/radial-gradient.js */
/**
 Class for creating Radial Gradients,
 see: http://www.w3.org/TR/SVG/pservers.html#RadialGradientElement
 @namespace canvas
 @class RadialGradient
 @augments canvas.Gradient
 @example
 	var gradient = new ludo.canvas.RadialGradient({
		cx:400,cy:200,r:300,fx:400,fy:200
	});
 	gradient.addStop('0%', 'red');
 	gradient.addStop('50%', 'blue');
 	gradient.addStop('100%', 'red');
 */
ludo.canvas.RadialGradient = new Class({
	Extends:ludo.canvas.Gradient,
	tagName:'radialGradient',

	initialize:function (config) {
		config = config || {};
		config.gradientUnits = config.gradientUnits || 'userSpaceOnUse';
		this.parent(config);
	},

	setCx:function (value) {
		this.set('cx', value);
	},

	setCy:function (value) {
		this.set('cy', value);
	},

	setR:function (value) {
		this.set('r', value);
	},

	setFx:function (value) {
		this.set('fx', value);
	},

	setFy:function (value) {
		this.set('fy', value);
	}
});/* ../ludojs/src/canvas/stop.js */
/**
 * Stop tag used by gradients
 * @namespace canvas
 * @class Stop
 * @augments ludo.canvas.Node
 */
ludo.canvas.Stop = new Class({
	Extends: ludo.canvas.Node,

	initialize:function(config){
		this.parent('stop', config);
	},

	/**
	 Set new offset
	 @function setOffset
	 @param {String} offset
	 @example
	 	gradient.getStop(0).setOffset('10%');
	 */
	setOffset:function(offset){
		this.set('offset', offset);
	},
	/**
	 Set new stop color
	 @function setStopColor
	 @param {String} stopColor
	 @example
	 	gradient.getStop(0).setStopColor('#FFFFFF');
	 */
	setStopColor:function(stopColor){
		this.set('stop-color', stopColor);
	},

	/**
	 * Returns value of offset attribute
	 * @function getOffset
	 * @return {String} offset
	 */
	getOffset:function(){
		return this.get('offset');
	},

	/**
	 * Returns value of stop-color attribute
	 * @function getStopColor
	 * @return {String} stop color
	 */
	getStopColor:function(){
		return this.get('stop-color');
	},

	/**
	 * Set new stop opacity(0 = transparent, 1 = full opacity)
	 * @function setStopOpacity
	 * @param {Number} stopOpacity
	 */
	setStopOpacity:function(stopOpacity){
		this.set('stop-opacity', stopOpacity);
	},

	/**
	 * Returns value of stop-opacity property
	 * @function getStopOpacity
	 * @return {Number} stop opacity
	 */
	getStopOpacity:function(){
		return this.get('stop-opacity');
	}
});/* ../ludojs/src/canvas/drag.js */
/**
 Class for dragging {{#crossLink "canvas/Node"}}{{/crossLink}} elements.
 @namespace canvas
 @class Drag
 @augments effect.Drag
 @constructor
 @param {Object} config, see {{#crossLink "effect/Drag"}}{{/crossLink}}
 @example
    var canvas = new ludo.canvas.Canvas({
    	renderTo:document.body
    });

	var paintThree = new ludo.canvas.Paint({
	  autoUpdate:true,
	  css:{
	  	  'fill' : '#DEF',
		  'stroke':'#888',
		  'stroke-width':'5',
		  cursor:'pointer'
	  }
	});
 	var circle = new ludo.canvas.Circle({cx:280, cy:280, r:85}, { paint:paintThree });
    canvas.append(circle);

 	var drag = new ludo.canvas.Drag();
 	drag.add(circle);
*/
ludo.canvas.Drag = new Class({
	Extends:ludo.effect.Drag,

	ludoEvents:function () {
		this.parent();
		this.addEvent('before', this.setStartTranslate.bind(this));
	},

	setStartTranslate:function (node) {
		this.dragProcess.startTranslate = node.el.getTransformation('translate') || {x:0, y:0};
	},

	/**
	 * Add node
	 * @function add
	 * @param {ludo.effect.DraggableNode} node
	 * @return {effect.DraggableNode} added node
	 */
	add:function (node) {
		node = this.getValidNode(node);
		if (!node.handle)node.handle = node.el;
		var id = node.el.getEl().id;

		this.els[id] = Object.merge(node, {
			handle:node.handle
		});
		this.els[id].handle.on(ludo.util.getDragStartEvent(), this.startDrag.bind(this));
		return this.els[id];
	},

	getValidNode:function (node) {
		if (!this.isElConfigObject(node)) {
			node = {
				el:node
			};
		}
		node.el.set('forId', node.el.getEl().id);
		return node;
	},

	isElConfigObject:function (config) {
		return config.getEl === undefined;
	},

	getPositionedParent:function () {
		return undefined;
	},

	getIdByEvent:function (e) {
		var el = e.target || e.event.srcElement['correspondingUseElement'];
		var id = el.id;

		while(!this.els[id] && el.parentNode){
			el = el.parentNode;
			id = el.id;
		}

		return id;
	},
    transformationExists:false,
    startDrag:function(e){
        this.parent(e);

        this.transformationExists = this.hasTransformation();
    },

    hasTransformation:function(){
        //
        var translate = this.els[this.dragProcess.dragged].el.get('transform');
        if(translate){
            var items = translate.split(/\s([a-z])/g);
            if(items.length > 1)return true;
            if(items.length === 0)return false;
            return items[0].split(/\(/g)[0] !== 'translate';
        }
        return false;
    },

	move:function (pos) {
		var node = this.els[this.dragProcess.dragged].el;
		var translate = {
			x:this.dragProcess.startTranslate.x,
			y:this.dragProcess.startTranslate.y
		};


		if (pos.x !== undefined) {
			translate.x = pos.x;
			this.dragProcess.currentX = pos.x;
		}
		if (pos.y !== undefined) {
			translate.y = pos.y;
			this.dragProcess.currentY = pos.y;
		}
		// return node.translate(translate.x, translate.y);
        if(this.transformationExists){
			node.translate(translate.x, translate.y);
            node.setTransformation('translate', translate.x + ' ' + translate.y);
        }else{
            node.el.setAttribute('transform', ['translate(', translate.x, ' ', translate.y, ')'].join('') );
            this.lastTranslate = translate;
        }
	},

    endDrag:function(e){
        if (this.dragProcess.active) {
            if(this.lastTranslate !== undefined){
                var node = this.els[this.dragProcess.dragged].el;
                node.setTransformation('translate', this.lastTranslate.x + ' ' + this.lastTranslate.y);
            }
            this.parent(e);
        }
    },

	getPositionOf:function (node) {
		var ret =  node.getTransformation('translate') || {x:0, y:0}
		return { left:ret.x, top: ret.y };
	}
});/* ../ludojs/src/canvas/event-manager.js */
ludo.canvas.EventManager = new Class({
	nodes:{},
	currentNodeId:undefined,
    currentNodeFn:undefined,

	addMouseEnter:function (node, fn) {
		node.on('mouseover', this.getMouseOverFn(fn));
		node.on('mouseout', this.clearCurrent.bind(this, node));
	},

	addMouseLeave:function(node, fn){
		node.on('mouseout', this.getMouseOutFn(fn));
		node.on('mouseout', this.clearCurrent.bind(this, node));
	},

	clearCurrent:function(node){
		if(node.getEl().id === this.currentNodeId)this.currentNodeId = undefined;
	},

	getMouseOverFn:function (fn) {
		return function (e, node) {
            if(this.okToEnterAndLeave(fn, node)){
				this.currentNodeId = node.getEl().id;
                this.currentNodeFn = fn;
				fn.call(node, e, node);
			}else{
			}
		}.bind(this)
	},

	getMouseOutFn:function (fn) {
		return function (e, node) {
            if(this.okToEnterAndLeave(fn, node)){
				this.currentNodeId = undefined;
                this.currentNodeFn = undefined;
				fn.call(node, e, node);
			}
		}.bind(this)
	},

    okToEnterAndLeave:function(fn, node){
        return fn && (!this.isInCurrentBranch(node) || fn != this.currentNodeFn);
    },

	isInCurrentBranch:function(leaf){
		if(!this.currentNodeId)return false;
		if(leaf.getEl().id === this.currentNodeId)return true;
		leaf = leaf.parentNode;
		while(leaf){
			if(leaf.getEl().id === this.currentNodeId)return true;
			leaf = leaf.parentNode;
		}
		return false;

	}
});
ludo.canvasEventManager = new ludo.canvas.EventManager();/* ../ludojs/src/canvas/circle.js */
/**
 Class for circle tags. It extends canvas.Node by adding setter and getter methods
 for radius, center x and center y.
 @namespace canvas
 @class Circle
 @augments canvas.Node
 @constructor
 @param {Object} coordinates
 @param {canvas.NodeConfig} config
 @example
	 var circle = new ludo.canvas.Circle(
 		{ cx:100, cy:100, r:200 },
	 	{ paint:paintObject }
 	 );
 */
ludo.canvas.Circle = new Class({
	Extends:ludo.canvas.NamedNode,
	tagName:'circle',

	/**
	 * Set new radius
	 * @function setRadius
	 * @param {Number} radius
	 */
	setRadius:function (radius) {
		this.set('r', radius);
	},

	/**
	 * Return curent radius
	 * @function getRadius
	 * @return {String|Number} radius
	 */
	getRadius:function () {
		return this.el.r.animVal.value;
	},

	/**
	 * Set new center X
	 * @function setCx
	 * @param {Number} x
	 */
	setCx:function (x) {
		this.set('cx', x);
	},
	/**
	 * Return current center X
	 * @function getX
	 * @return {String|Number} cx
	 */
	getCx:function () {
		return this.el.cx.animVal.value;
	},

	/**
	 * Set new center Y
	 * @function setCy
	 * @param {Number} y
	 */
	setCy:function (y) {
		this.set('cy', y);
	},
	/**
	 * Return current center Y
	 * @function getCy
	 * @return {String|Number} cy
	 */
	getCy:function () {
		return this.el.cy.animVal.value;
	},

	/**
	 * Return position on canvas
	 * @function getPosition()
	 * @return {Object} x and y
	 */
	getPosition:function(){
		var translate = this.getTranslate();
		var r = this.getRadius();
		return {
			x: this.getCx() - r + translate.x,
			y: this.getCy() - r + translate.y
		}
	},

	getSize:function(){
		var r = this.getRadius();
		return {
			x: r*2,
			y: r*2
		}
	}
});/* ../ludojs/src/canvas/polyline.js */
/**
 Class for drawing polylines.
 @namespace canvas
 @class Polyline
 @augments canvas.NamedNode
 @constructor
 @param {String} points
 @param {canvas.NodeConfig} config
 @example
 	var polyline = new ludo.canvas.Polyline('20,20 40,25 60,40 80,120 120,140 200,180');
 */
ludo.canvas.Polyline = new Class({
	Extends: ludo.canvas.NamedNode,
	tagName : 'polyline',
	pointString : '',
	pointArray : undefined,
	size:undefined,
	position:undefined,

	initialize:function(points, properties){
		properties = properties || {};
		properties.points = points;
		this.parent(properties);
		this.pointString = points;
	},

	/**
	 * Return x and y of a point
	 * @function getPoint
	 * @param {Number} index
	 * @return {Object|undefined} x and y
	 */
	getPoint:function(index){
		if(this.pointArray === undefined)this.buildPointArray();
		index *=2;
		if(index > this.pointArray.length-2)return undefined;
		return {
			x : this.pointArray[index],
			y : this.pointArray[index+1]
		}
	},

	/**
	 Set new x and y for one of the points.
	 @function setPoint
	 @param {Number} index
	 @param {Number} x
	 @param {Number} y
	 @example
		 var polyline = new ludo.canvas.Polyline('20,20 40,25 60,40 80,120 120,140 200,180');
	     polyline.setPoint(0,10,5);
	     polyline.setPoint(1,120,40);
	 will change the points to
	 @example
	 	'10,5 120,40 60,40 80,120 120,140 200,180'
	 */
	setPoint:function(index, x, y){
		if(this.pointArray === undefined)this.buildPointArray();
		index *=2;
		if(index > this.pointArray.length-2)return;
		this.pointArray[index] = x;
		this.pointArray[index+1] = y;
		this.set('points', this.pointArray.join(' '));
		this.size = undefined;
		this.position = undefined;
	},

	buildPointArray:function(){
		var points = this.pointString.replace(/,/g,' ');
		points = points.replace(/\s+/g,' ');
		this.pointArray = points.split(/\s/g);
	},
	/**
	 * Get size of polyline (max X - min X) and (max X - min Y)
	 * @function getSize
	 * @return {Object} x and y
	 */
	getSize:function(){
		if(this.size === undefined){
			var minMax = this.getMinAndMax();
			this.size = {
				x : Math.abs(minMax.maxX - minMax.minX),
				y : Math.abs(minMax.maxY - minMax.minY)
			};
		}
		return this.size;
	},
	/**
	 * Get position of polyline, min X and min Y)
	 * @function getPosition
	 * @return {Object} x and y
	 */
	getPosition:function(){
		if(this.position === undefined){
			var minMax = this.getMinAndMax();
			this.position = {
				x : minMax.minX,
				y : minMax.minY
			};
		}
		return this.position;
	},

	getMinAndMax:function(){
		if(this.pointArray === undefined)this.buildPointArray();
		var p = this.pointArray;
		var minX = 10000, maxX = -100000;
		var minY = 10000, maxY = -100000;
		for(var i=0;i< p.length;i+=2){
			minX = Math.min(minX, p[i]);
			maxX = Math.max(maxX, p[i]);
			minY = Math.min(minY, p[i+1]);
			maxY = Math.max(maxY, p[i+1]);
		}
		return {
			minX: minX, minY: minY,
			maxX: maxX, maxY: maxY
		}
	}
});/* ../ludojs/src/canvas/polygon.js */
/**
 Class for drawing polygons.
 @namespace canvas
 @class Polygon
 @augments canvas.Polyline
 @constructor
 @param {String} points
 @param {canvas.NodeConfig} config
 @example
 	var polyline = new ludo.canvas.Polygon('20,20 40,25 60,40 80,120 120,140 200,180');
 */
ludo.canvas.Polygon = new Class({
	Extends: ludo.canvas.Polyline,
	tagName: 'polygon'
});/* ../ludojs/src/canvas/ellipse.js */
/**
 Class for drawing ellipses.
 @namespace canvas
 @class Ellipse
 @augments canvas.NamedNode
 @constructor
 @param {Object} coordinates
 @param {canvas.NodeConfig} config
 @example
 	var ellipse = new ludo.canvas.Ellipse({ cx:500, cy:425, rx:250, ry:200 }, { paint: paintObject } );
 */
ludo.canvas.Ellipse = new Class({
	Extends:ludo.canvas.NamedNode,
	tagName:'ellipse',

	/**
	 * Set new x-radius
	 * @function setRadiusX
	 * @param {Number} radius
	 */
	setRadiusX:function (radius) {
		this.set('rx', radius);
	},

	/**
	 * Set new y-radius
	 * @function setRadiusY
	 * @param {Number} radius
	 */
	setRadiusY:function (radius) {
		this.set('ry', radius);
	},

	/**
	 * Return curent radius
	 * @function getRadiusX
	 * @return {String|Number} x-radius
	 */
	getRadiusX:function () {
		return this.el.rx.animVal.value;
	},

	/**
	 * Return curent y-radius
	 * @function getRadiusY
	 * @return {String|Number} y-radius
	 */
	getRadiusY:function () {
		return this.el.ry.animVal.value;
	},

	/**
	 * Set new center X
	 * @function setCx
	 * @param {Number} x
	 */
	setCx:function (x) {
		this.set('cx', x);
	},
	/**
	 * Return current center X
	 * @function getX
	 * @return {String|Number} cx
	 */
	getCx:function () {
		return this.el.cx.animVal.value;
	},

	/**
	 * Set new center Y
	 * @function setCy
	 * @param {Number} y
	 */
	setCy:function (y) {
		this.set('cy', y);
	},
	/**
	 * Return current center Y
	 * @function getCy
	 * @return {String|Number} cy
	 */
	getCy:function () {
		return this.el.cy.animVal.value;
	},

	/**
	 * Return position on canvas
	 * @function getPosition()
	 * @return {Object} x and y
	 */
	getPosition:function () {
		var translate = this.getTranslate();
		return {
			x:this.getCx() - this.getRadiusX() + translate.x,
			y:this.getCy() - this.getRadiusY() + translate.y
		}
	},

	/**
	 Return size of ellipse
	 @function getSize
	 @return {Object} x and y
	 @example
	 	var ellipse = new ludo.canvas.Ellipse({ cx:500, cy:425, rx:250, ry:200 });
	 	var size = ellipse.geSize(); // will return {x: 500, y: 400}
	 which is rx*2 and ry*2

	 */
	getSize:function () {
		return {
			x:this.getRadiusX() * 2,
			y:this.getRadiusY() * 2
		}
	}
});/* ../ludojs/src/canvas/path.js */
/**
 * Returns a path SVG element which can be adopted to a canvas.
 * @namespace canvas
 * @class Path
 */
ludo.canvas.Path = new Class({
    Extends:ludo.canvas.NamedNode,
    tagName:'path',
    pointString:undefined,
    pointArray:undefined,
    size:undefined,
    position:undefined,

    initialize:function (points, properties) {
        properties = properties || {};
        if (points) {
            points = this.getValidPointString(points);
            properties.d = points;
        }
        this.parent(properties);
        this.pointString = points;
    },

    getValidPointString:function (points) {
        return points.replace(/([A-Z])/g, '$1 ').trim().replace(/,/g, ' ').replace(/\s+/g, ' ');
    },

    setPath:function (path) {
        this.pointString = this.getValidPointString(path);
        this.pointArray = undefined;
        this.set('d', this.pointString);
    },

    getPoint:function (index) {
        if (this.pointArray === undefined)this.buildPointArray();
        index *= 3;
        return {
            x:this.pointArray[index + 1],
            y:this.pointArray[index + 2]
        };
    },

    setPoint:function (index, x, y) {
        if (this.pointArray === undefined)this.buildPointArray();
        index *= 3;
        if (index < this.pointArray.length - 3) {
            this.pointArray[index + 1] = x;
            this.pointArray[index + 2] = y;
            this.pointString = this.pointArray.join(' ');
            this.set('d', this.pointString);
            this.size = undefined;
            this.position = undefined;
        }
    },

    buildPointArray:function () {
        var points = this.pointString.replace(/,/g, ' ').replace(/\s+/g, ' ');
        this.pointArray = points.split(/([A-Z\s])/g).erase(" ").erase("");
    },
    /**
     * Get size of polyline (max X - min X) and (max X - min Y)
     * @function getSize
     * @return {Object} x and y
     */
    getSize:function () {
        if (this.size === undefined) {
            var minMax = this.getMinAndMax();
            this.size = {
                x:Math.abs(minMax.maxX - minMax.minX),
                y:Math.abs(minMax.maxY - minMax.minY)
            };
        }
        return this.size;
    },

    getPosition:function () {
        if (this.position === undefined) {
            var minMax = this.getMinAndMax();
            this.position = {
                x:minMax.minX,
                y:minMax.minY
            };
        }
        return this.position;
    },

    getMinAndMax:function () {
        if (this.pointArray === undefined)this.buildPointArray();
        var p = this.pointArray;
        var x = [];
        var y = [];
        for (var i = 0; i < p.length - 2; i += 3) {
            x.push(p[i + 1]);
            y.push(p[i + 2]);
        }
        return {
            minX:Math.min.apply(this, x), minY:Math.min.apply(this, y),
            maxX:Math.max.apply(this, x), maxY:Math.max.apply(this, y)
        };
    }
});/* ../ludojs/src/canvas/text.js */
/**
 * @class ludo.canvas.Text
 * @config {String} text
 * @config {Object} config
 * @config {Object} config.css layout properties
 * @config {Number} config.x left position
 * @config {Number} config.y top position
 */
ludo.canvas.Text = new Class({
	Extends: ludo.canvas.NamedNode,
	tagName : 'text',

	initialize:function(text, attributes){
		this.parent(attributes, text);
		this.fireSize();
	},

	fireSize:function(){
		if(this.getEl().parentNode){
			this.fireEvent('textSize', this.getSize());
		}
	},

	/**
	 * Set text anchor to start, middel, end or inherit
	 * @function textAnchor
	 * @memberof ludo.canvas.Text
	 * @param anchor
     */
	textAnchor:function(anchor){
		this.set("text-anchor", anchor);
	}
});/* ../ludojs/src/canvas/filter.js */
/**
 Class for SVG filter effects, example Drop Shadow
 Note! Filters will produce raster graphic, not Vector.
 Note! Filters are not supported by IE 9 and lower. (Support is added to IE10).
 Ref: http://caniuse.com/svg-filters
 @namespace canvas
 @class Filter
 @augments canvas.NamedNode
 @constructor
 @param {Object} attributes
 @param {Object} config options
 *
 */
ludo.canvas.Filter = new Class({
	Extends:ludo.canvas.NamedNode,
	tagName:'filter',
	mergeTags:{},
	mergeTagsOrder : [
		'dropShadow', 'SourceGraphic'
	],

	effectNodes:{
		'dropShadow' : ['feGaussianBlur', 'feOffset']
	},
	nodes:{
		'dropShadow' : undefined
	},

	initialize:function(properties){
		properties = properties || {};
		if( properties.x === undefined)  properties.x = '-40%';
		if( properties.y === undefined)  properties.y = '-40%';
		properties.width = properties.width || '180%';
		properties.height = properties.height || '180%';
		this.parent(properties);
	},
	/**
	 Set drop shadow
	 @function setDropShadow
	 @param {Object} properties
	 @example
	 	filter.setDropShadow({
	 		x: 2, y: 2, // Offset
	 		deviation: 2, // blur
	 		color : '#000'
	 	});
	 */
	setDropShadow:function (properties) {
		var nodes = this.getNodesForEffect('dropShadow');
		var blur = nodes['feGaussianBlur'];
		blur.set('in', 'SourceAlpha');
		blur.set('result', 'dropShadowBlur');
		blur.set('stdDeviation', properties.deviation);

		var o = nodes['feOffset'];
		o.set('dx', properties.x || 2);
		o.set('dy', properties.y || 2);
		o.set('in', 'dropShadowBlur');
		o.set('result', 'dropShadow');

	},



	getNodesForEffect:function(effect){
		var n = this.nodes[effect];
		if(n === undefined){
			n = {};
			var keys = this.effectNodes[effect];
			for(var i=0;i<keys.length;i++){
				n[keys[i]] = new ludo.canvas.Node(keys[i]);
				this.append(n[keys[i]]);
			}
			this.addFeMergeNode('SourceGraphic');
			this.addFeMergeNode(effect);

		}
		return n;
	},

	updateMergeTag:function () {
		var m = this.getMergeTag();
		var o = this.mergeTagsOrder;
		for(var i=0;i<o.length;i++){
			if(this.mergeTags[o[i]] !== undefined){
				ludo.canvasEngine.toFront(this.mergeTags[o[i]].el);
			}
		}
		ludo.canvasEngine.toFront(m.el);
	},
	mergeTag:undefined,
	getMergeTag:function () {
		if (this.mergeTag === undefined) {
			this.mergeTag = new ludo.canvas.Node('feMerge');
			this.append(this.mergeTag);

		}
		return this.mergeTag;
	},

	/**
	 * Adds a new feMergeNode DOM node to the feMerge node
	 * @function addFeMergeNode
	 * @param {String} key
	 * @return {canvas.Node} feMergeNode
	 */
	addFeMergeNode:function (key) {
		if (this.mergeTags[key] === undefined) {
			this.mergeTags[key] = new ludo.canvas.Node('feMergeNode', { "in":key });
			this.getMergeTag().append(this.mergeTags[key]);
			this.updateMergeTag();
		}
		return this.mergeTags[key];
	}
});/* ../ludojs/src/canvas/mask.js */
/**
 Class for masking of SVG DOM nodes
 @namespace canvas
 @class Mask
 @constructor
 @param {Object} properties
 @example
	 var mask = new ludo.canvas.Mask({ id : 'Mask' });
	 canvas.appendDef(mask); // canvas is a ludo.canvas.Canvas object

	 var gr = new ludo.canvas.Gradient({
		 id:'gradient'
	 });
	 gr.addStop('0%', 'white', 0);
	 gr.addStop('100%', 'white', 1);
 	 canvas.append(gr);

	 var rect2 = new ludo.canvas.Rect({ x:0,y:0, width:500,height:500, fill:gr });
	 mask.append(rect2); // Append rect to mask
	 // create ellipsis with reference to mask
 	 var ellipse = new ludo.canvas.Ellipse({ cx:100, cy:125, rx:50, ry:70,mask:mask });

 */
ludo.canvas.Mask = new Class({
	Extends: ludo.canvas.NamedNode,
	tagName : 'mask'
});/* ../ludojs/src/canvas/curtain.js */
/**
 Special animation class for SVG elements
 @namespace canvas
 @class Curtain
 @constructor
 @param {ludo.canvas.Node} node
 @example
	node.curtain().open('LeftRight');
 */
ludo.canvas.Curtain = new Class({
	Extends:ludo.canvas.Node,
	applyTo:undefined,
	nodes:{},
	bb:undefined,
	animation:undefined,
	action:undefined,

	initialize:function (node) {
		this.parent('clipPath');
		this.applyTo = node;

		var g = new ludo.canvas.Node('g');
		g.append(this);
		this.applyTo.getCanvas().appendChild(g.getEl());

	},

	/**
	 * Open curtains, i.e. show element
	 * @function open
	 * @param {String} direction (LeftRight, TopBottom, BottomTop or RightLeft),
	 * @param {Number} duration in seconds
	 * @optional
	 * @default 1
	 * @param {Number} fps (Frames per second)
	 * @optional
	 * @default 33
	 */
	open:function (direction, duration, fps) {
		this.onStart();
		this.action = 'open';
		this.getAnimation().animate(this.getCoordinates(direction), duration, fps);

	},

	/**
	 * Close curtains, i.e. hide element
	 * @function close
	 * @param {String} direction (LeftRight, TopBottom, BottomTop or RightLeft),
	 * @param {Number} duration in seconds
	 * @optional
	 * @default 1
	 * @param {Number} fps (Frames per second)
	 * @optional
	 * @default 33
	 */
	close:function (direction, duration, fps) {
		this.onStart();
		this.action = 'close';
		this.getAnimation().animate(this.getCoordinates(direction, true), duration, fps);
	},

	onStart:function(){
		this.applyTo.show();
		this.setBB();
		this.applyTo.applyClipPath(this);
	},

	getAnimation:function () {
		if (this.animation === undefined) {
			this.animation = this.rect().animation();
			this.animation.addEvent('finish', this.removeClipPath.bind(this));
		}
		this.rect().setProperties(this.bb);
		return this.animation;
	},

	setBB:function () {
		this.bb = this.applyTo.getBBox();

	},

	removeClipPath:function () {
		if (this.action === 'close') {
			this.applyTo.hide();
		}
		this.applyTo.remove('clip-path');

	},

	getCoordinates:function (direction, close) {
		var ret;

		if(close){
			var tokens = this.getDirections(direction);
			direction = tokens[1]+tokens[0];
		}
		switch (direction) {
			case 'RightLeft':
				ret = {
					width:{
						from:0, to:this.bb.width
					},
					x:{
						from:this.bb.width + this.bb.x,
						to:this.bb.x
					}
				};
				break;
			case 'TopBottom':
				ret = {
					height:{
						from:0, to:this.bb.height
					}
				};
				break;
			case 'BottomTop':
				ret = {
					height:{
						from:0, to:this.bb.height
					},
					y:{
						from:this.bb.height + this.bb.y,
						to:this.bb.y
					}
				};
				break;

			default:
				ret = {
					width:{
						from:0, to:this.bb.width
					}
				};
		}

		if(close){
			var keys = ['width','height','x','y'];
			for(var i=0;i<keys.length;i++){
				if(ret[keys[i]] !== undefined){
					var f = ret[keys[i]].from;
					ret[keys[i]].from = ret[keys[i]].to;
					ret[keys[i]].to = f;
				}
			}
		}

		return ret;
	},

	getDirections:function (direction) {
		return direction.replace(/([A-Z])/g, ' $1').trim().split(/\s/g);
	},

	rect:function () {
		if (this.nodes['rect'] === undefined) {
			this.nodes['rect'] = new ludo.canvas.Rect({
				x:this.bb.x, y:this.bb.y,
				width:this.bb.width,
				height:this.bb.height
			});
			this.append(this.nodes['rect'])
		}
		return this.nodes['rect'];
	}

});/* ../ludojs/src/canvas/animation.js */
ludo.canvas.Animation = new Class({
	Extends: Events,
	fps:33,
	el:undefined,

	initialize:function(el){
		this.el = el;
	},

	animate:function(properties, duration, fps){
		duration = duration || 1;
		fps = fps || 33;
		this.execute(this.getAnimationSteps(properties,duration,fps), 0);

	},

	execute:function(steps, current){
		var step = steps.values[current];

		if(current < steps.values.length - 1){
			this.execute.delay(steps.fps, this, [steps, current+1]);
		}

		for(var i=0;i<step.length;i++){
			if(step[i].key === 'width' || step[i].key === 'height' && step[i].value < 0){
				step[i].value = 0;
			}
			if(this.el.set == undefined){
				ludo.canvasEngine.set(this.el, step[i].key, step[i].value);
			}else{
				this.el.set(step[i].key, step[i].value);

			}
		}

		if(current === steps.values.length -1 ){
			this.fireEvent('finish', this);
		}

	},
    // TODO this should be available not only to canvas
	getAnimationSteps:function(properties, duration, fps){

		var count = duration * fps;
		var ret = [];
		var inc = this.getIncrements(properties, duration, fps);

		var currentValues = {};

		for(var key in properties){
			if(properties.hasOwnProperty(key)){
				for(var i=0;i<=count;i++){
					if(!ret[i])ret[i] = [];
					if(!currentValues[key]){
						currentValues[key] = properties[key].from;
					}

					var value = currentValues[key];
					if(properties[key].units)value += properties[key].units;

					ret[i].push({
						key:key, value: value
					});

					currentValues[key] += inc[key];
				}
			}
		}

		return {
			values : ret,
			fps : fps
		};
	},

	getIncrements:function(properties, duration, fps){
		var count = duration * fps;
		var ret = {};
		for(var key in properties){
			if(properties.hasOwnProperty(key)){
				ret[key] = (properties[key].to - properties[key].from) / count;
			}
		}
		return ret;
	}
});