
ludo.form.CursorCommands = new Class({
    el : undefined,
    initialize : function(el){
        this.el = $(el);
    },

    getCaretPosition : function(){
        return this.getSelectionStart();
    },

    hasSelection : function(){
        return this.getSelectionStart() != this.getSelectionEnd();
    },

    getSelectedText : function(){
        var value = this.el.value;
        var start = this.getSelectionStart();
        var end = this.getSelectionEnd();

        if(end > start){
            return value.substring(start, end);
        }
        return '';
    },

    getSelectionStart : function() {
        if (this.el.createTextRange) {
            var r = document.selection.createRange().duplicate();
            r.moveEnd('character', this.el.value.length);
            if (r.text == '') return this.el.value.length;
            return this.el.value.lastIndexOf(r.text);
        } else return this.el.selectionStart;
    },
    
    getSelectionEnd : function(){
        if (this.el.createTextRange) {
       		var r = document.selection.createRange().duplicate();
       		r.moveStart('character', -this.el.value.length);
       		return r.text.length;
       	} else return this.el.selectionEnd;
    }
});
