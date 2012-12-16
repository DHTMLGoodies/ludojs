/**
 * @namespace form
 * @class RadioGroup
 * @description class for a group of radio buttons. Config for the radio buttons should be passed to the
 * constructor or loaded remotely. Here's an example of format:
 * [{ value: 1, text : 'my radio', image: 'images/my-radio-image.png' }]
 * @extends form.Element
 */
ludo.form.RadioGroup = new Class({
    Extends: ludo.form.Element,
    type : 'form.RadioGroup',
    labelWidth : 100,
    checkboxes : [],
    height : undefined,
    /**
     * record keys to use for value and text of the radio buttons
     * @attribute fieldConfig
     * @default { value : 'value', text : 'text' }
     */
    fieldConfig : {
        value : 'value',
        text : 'text'
    },

    ludoDOM : function() {
        this.parent();
        var table = new Element('table');
        this.getBody().adopt(table);
        var tbody = this.els.tBody = new Element('tbody');
        table.adopt(tbody);
    },

    populate : function(data){
        var row = new Element('tr');
        this.els.tBody.adopt(row);

        for(var i=0;i<data.length;i++){
            var cell = new Element('td');
            row.adopt(cell);

            var radio = new ludo.form.Checkbox({
                inputType : 'radio',
                name : this.getName(),
                value : data[i][this.fieldConfig.value],
                label : data[i][this.fieldConfig.text],
                checked  : data[i].checked ? true : false,
                image : data[i].image ? data[i].image : null,
                listeners : {
                    change : this.valueChange.bind(this)
                }
            });
            this.checkboxes.push(radio);
            cell.adopt(radio.getEl());
        }

        if(data.length > 0){
            var cellHeight = cell.getSize().y;
            if(cellHeight > this.getHeight()){
                this.resize({
                    height : cellHeight
                })
            }
        }

    },

    valueChange : function(){
        for(var i=0;i<this.checkboxes.length;i++){
            this.checkboxes[i].toggleImage();
        }
        /**
         * @event change
         * @description Value has changed
         * @param {String} value
         * @param {Object} this component
         */
        this.fireEvent('change', [ this.getValue(), this ]);
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
     * @method getValue
     * @return String value
     */
    getValue : function() {
        var radio = this.getCheckedRadio();
        if(radio){
            return radio.getValue();
        }
        return null;
    },
    /**
     * Return reference to selected radio button component
     * @method getCheckedRadio
     * @return {Object} ludo.form.Radio component
     */
    getCheckedRadio : function() {
        for(var i=0;i<this.checkboxes.length;i++){
            if(this.checkboxes[i].isChecked()){
                return this.checkboxes[i];
            }
        }
        return null;
    },
    /**
     * The radio button with the chose value will be checked
     * @method setvalue
     * @param {String} value
     * @return void
     */
    setValue : function(value){
        for(var i=0;i<this.checkboxes.length;i++){
            if(this.checkboxes[i].getFormEl().get('value') == value){
                return this.checkboxes[i].check();
            }
        }
    }


});