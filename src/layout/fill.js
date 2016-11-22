ludo.layout.Fill = new Class({
    Extends: ludo.layout.Relative,


    addChild: function (child, insertAt, pos) {
        if (child.layout == undefined)child.layout = {};
        child.layout.width = child.layout.height = 'matchParent';
        child.layout.alignParentTop = true;
        child.layout.alignParentLeft = true;

        return this.parent(child, insertAt, pos);
    }
});