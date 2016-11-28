/**
 * Component used to display text for a progress bar, example
 * Step 1 of 10
 * @namespace progress
 * @class ludo.progress.Text
 * @augments ludo.progress.Base
 * @param {Object} config
 * @param {String} tpl JSON template, default: "{text}"
 */
ludo.progress.Text = new Class({
    Extends:ludo.progress.Base,
    type:'progress.Text',
    width:300,
    height:30,
    stopped:false,
    hidden:true,

    tpl : '{text}'
});