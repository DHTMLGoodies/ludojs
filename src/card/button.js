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

        if (cmp.layout === undefined || (cmp.layout.type.toLowerCase()!=='viewpager')) {
            for (var i = 0; i < cmp.children.length; i++) {

                if (cmp.children[i].layout && cmp.children[i].layout.type.toLowerCase()==='viewpager') {
                    return cmp.children[i];
                }
            }
        }
        return cmp.layout && cmp.layout.type.toLowerCase()!=='viewpager' ? cmp : undefined;
    }
});