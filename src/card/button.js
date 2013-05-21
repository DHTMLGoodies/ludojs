/**
 * Special Button for card.Deck component
 * @namespace card
 * @class Button
 * @extends form.Button
 */
ludo.card.Button = new Class({
    Extends:ludo.form.Button,
    type:'card.Button',

    component:undefined,
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
        if (config.autoHide !== undefined)this.autoHide = config.autoHide;
        if (config.applyTo !== undefined){
            this.applyTo = ludo.get(config.applyTo);
        }else{
            this.applyTo = this.getParentComponent();
        }

		if(this.applyTo)this.applyTo.getLayout().registerButton(this);
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
});