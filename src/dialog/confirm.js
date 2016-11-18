/**
  Standard confirm dialog with default "OK" and "Cancel" buttons
  @namespace dialog
  @class ludo.dialog.Confirm
  @augments ludo.dialog.Dialog
  @param {Object} config
  @example
 	new ludo.dialog.Confirm({
 		html : 'Do you want to quit',
 		buttons:[
 			{
 				value:'Yes,'type':'form.Button',width:60
 			},
 			{
 				value:'No,'type':'form.Button',width:60
 			}
 		],
 		listeners:{
 			'yes':this.quit.bind(this)
 		}
 	});
  will create a confirm dialog with two buttons, "Yes" and "No". When click on "Yes", the dialog will be
 closed and disposed and the quit method of the object creating the dialog will be called. On click on "No"
 the dialog will be closed and disposed(it's default behavior on button click) and the nothing else will happen.
 */
ludo.dialog.Confirm = new Class({
    Extends: ludo.dialog.Dialog,
    type : 'dialog.Confirm',

    __construct : function(config){
        if(!config.buttons && !config.buttonConfig && !config.buttonBar){
            config.buttons = [
                {
                    value : 'OK',
                    width : 60,
					defaultSubmit:true,
                    type : 'form.Button'
                },
                {
                    value : 'Cancel',
                    width : 60
                }
            ]
        }
        this.parent(config);
    }
});

