/*
* User specific config properties for ludo web tools
*/

LUDO_APP_CONFIG = {
    /* Config properties for forms */
    rootUrl : '/',
    url : 'controller.php',
    form : {
        /* This will be the default url for form submission if no url is specified in form config object */
        url : 'default-form-submit-url.php'
    },
    socket : {
        url : 'http://your-node-js-server-url:8080/'
    },

    model : {
        save : {
            url : '/portal-controller.php'
        },
        load :{
            url : '/portal-controller.php'
        }
    },

    fileupload : {
        url : '/file-upload-controller.php'
    },

    debugMode : 1

};