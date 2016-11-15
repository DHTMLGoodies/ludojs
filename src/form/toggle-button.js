/**
 * @namespace ludo.form
 * @class ToggleButton
 * @augments ludo.form.Button
 */
ludo.form.ToggleButton = new Class({
    Extends:ludo.form.Button,
    type:'form.ToggleButton',
    toggle:true,
    active:false,

    __construct:function (config) {
        this.parent(config);
    },

    __rendered:function () {
        this.parent()
    },
    /**
     * Trigger click on button
     * @function click
     */
    click:function () {
        this.parent();
        if (!this.isDisabled()) {
            if (!this.active) {
                this.turnOn();
            } else {
                this.turnOff();
            }
        }
    }
});