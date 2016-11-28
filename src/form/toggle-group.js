/**
 * @namespace ludo.form
 * @class ludo.form.ToggleGroup
 * @augments Core
 * @fires ludo.form.ToggleGroup#on Fired on button click. Arguments: 1) button value, 2) ludo.form.Button
 * @fires ludo.form.ToggleGroup#off Fired when button is no longer clicked. Arguments: 1) button value, 2) ludo.form.Button
 */
ludo.form.ToggleGroup = new Class({
    Extends:ludo.Core,
    type:'form.ToggleGroup',
    singleton:true,
    buttons:[],
    activeButton:undefined,

    __construct:function (config) {
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

            this.fireEvent('on', [button.getValue(), button]);
        } else {
            this.activeButton = undefined;

            this.fireEvent('off', [button.getValue(), button]);
        }
    },
    /**
     * Turn a button in the toggle group on
	 * @function turnOn
     * @param button
     * @memberof ludo.form.ToggleGroup.prototype
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
     * @memberof ludo.form.ToggleGroup.prototype
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