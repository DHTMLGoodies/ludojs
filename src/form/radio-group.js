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

    __rendered : function() {
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
});