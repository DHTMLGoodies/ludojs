/**
 * Show error messages from remote requests
 * @namespace remote
 * @class ErrorMessage
 * @extends ludo.remote.Message
 */
ludo.remote.ErrorMessage = new Class({
    Extends:ludo.remote.Message,
    messageTypes:['failure','serverError']
});