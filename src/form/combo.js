/**
 * A text field with combo button. Click on the combo button will show child view beneath the text input
 *
 * This class extends ludo.form.Text.
 * @param {Object} config
 * @param {Object} config.childLayout Layout for child, example:
 * <code>
 * childLayout:{
            width:300,height:300
   }
 *
 * </code>
 *
 * @class ludo.form.Combo
 */
ludo.form.Combo = new Class({
    Extends:ludo.form.Text,
    type:'form.Combo',
    layout:{
        type:'popup'
    },

	menuButton:undefined,
    childLayout:undefined,

    __construct:function(config){
        this.parent(config);
        this.childLayout = config.childLayout || this.childLayout;
    },

    __rendered:function(){
        this.parent();

        ludo.Form.addEvent('focus', this.autoHide.bind(this));

        var c = this.children[0];
        c.layout = c.layout || {};
        if(this.childLayout)c.layout = Object.merge(c.layout, this.childLayout);

        c.layout.below = c.layout.below || this.$b();
        if(c.left === undefined)c.layout.alignLeft = c.layout.alignLeft || this.$b();
        if(!c.layout.width)c.layout.sameWidthAs = c.layout.sameWidthAs || this.$b();
        c.layout.height = c.layout.height || 200;
        c.alwaysInFront = true;
        c.cls = c.cls ? c.cls + ' ' + 'form-combo-child' : 'form-combo-child';

		this.createDependency('menuButton', new ludo.menu.Button({
			type:'menu.Button',
			renderTo: this.getInputCell(),
			alwaysVisible:true,
			region:'ne',
			autoPosition:false,
			menu:this.children[0],
			toggleOnClick:true,
			listeners:{
				show:function(){
					this.fireEvent('showCombo');
                    this.children[0].getLayout().getRenderer().resize();
				}.bind(this)
			}
		}));

        this.children[0].addEvent('show', this.focus.bind(this));
    },

    autoHide:function(focused){
        if(focused.isButton && focused.isButton())return;
        if(focused !== this && !focused.isChildOf(this.children[0])){
            this.children[0].hide();
        }
    },

    hideMenu:function(){
        this.children[0].hide();
    }
});
