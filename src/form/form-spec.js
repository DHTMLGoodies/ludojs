/**
 * Specification of available properties for the "form" config property of views.
 * You cannot create instances of this class.
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
                "idField" : "id",
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
                "idField" : "id",
                "resource": "User"
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
    resource:undefined,
    /**
     Event listeners for the events fired by the form.
     user.
     @config {Object} listeners
     @default undefined
     @example
     new ludo.View({
            form:{
                "idField" : "id",
                "resource": "User",
                listeners:{
                    "saved": function(){
                        new ludo.Notification({ html : 'Your changes has been saved' });
                    }
                }
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
    listeners:undefined


});