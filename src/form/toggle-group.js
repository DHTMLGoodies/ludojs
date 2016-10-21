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
});