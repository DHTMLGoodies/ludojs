/**
 * Show error messages from remote requests
 * @namespace ludo.remote
 * @class ludo.remote.ErrorMessage
 * @augments ludo.remote.Message
 */
ludo.remote.ErrorMessage = new Class({
    Extends:ludo.remote.Message,
    messageTypes:['failure','serverError']
});