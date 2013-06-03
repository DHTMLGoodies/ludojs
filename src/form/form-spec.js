/**
 * This document describes the available "form" config properties of ludo.View.
 *
 * You cannot create instances of ludo.form.FormSpec.
 *
 * @namespace form
 * @class FormSpec
 */
ludo.form.FormSpec = new Class({
    /**
     Name of form element which represents the id of a record
     @config {String} idField
     @default undefined
     @example
        new ludo.View({
            form:{
                autoLoad:true,
                arguments:100,
                "resource": "Player"
            },
            children:[
                {
                     type: "form.Hidden", name:"id"
                },
                {
                    type:"form.Text", name:"firstname"
                },
                {
                    type:"form.Text", name:"lastname"
                }
            ]
        });
     */
    idField:undefined,
    /**
     Name of server side resource(example a class) which handles form data.
     Example: "User" when you have a form representing the details of a
     user.
     @config {String} resource
     @default undefined
     @example
     new ludo.View({
            form:{
                "resource": "User",
                "autoLoad" : true,
                "arguments" : 100
            },
            children:[
                {
                    type:"form.Text", name:"firstname"
                },
                {
                    type:"form.Text", name:"lastname"
                }
            ]
        });
     */
    resource:undefined,
    /**
     Event listeners for the events fired by the form.
     user.
     @config {Object} listeners
     @default undefined
     @example
     new ludo.View({
            form:{
                "resource": "User",
                listeners:{
                    "saved": function(){
                        new ludo.Notification({ html : 'Your changes has been saved' });
                    }
                }
            },
            children:[
                {
                    type:"form.Text", name:"firstname"
                },
                {
                    type:"form.Text", name:"lastname"
                }
            ]
        });
     */
    listeners:undefined,

	/**
	 * Autoload data from server on creation
	 * @config {Boolean} autoLoad
	 * @default false
	 */
	autoLoad:false,

	/**
	 Arguments sent to server when autoLoad is set to true
	 @config {String|Number} arguments
	 @example
	 	form:{
	 		url:'controller.php',
	 		resource:'Person',
	 		arguments:100,
	 		autoLoad:true
	 	}
	 will send request 'Person/100/read' to controller.php.
	 */
	arguments:undefined


});