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
};