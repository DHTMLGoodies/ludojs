/**
 * Component used to display text for a progress bar, example
 * Step 1 of 10
 * @namespace progress
 * @class Text
 * @extends progress.Base
 */
ludo.progress.Text = new Class({
    Extends:ludo.progress.Base,
    type:'progress.Text',
    width:300,
    height:30,
    stopped:false,
    hidden:true,

    /**
     * Template for text content, example {text}.
     * @property tpl
     * @type String
     */
    tpl : '{text}'
});