/**
 * @namespace form
 * @class ToggleButton
 * @extends form.Button
 */
ludo.form.ToggleButton = new Class({
    Extends:ludo.form.Button,
    type:'form.ToggleButton',
    toggle:true,
    active:false,

    ludoConfig:function (config) {
        this.parent(config);
    },

    ludoRendered:function () {
        this.parent()
    },
    /**
     * Trigger click on button
     * @method click
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