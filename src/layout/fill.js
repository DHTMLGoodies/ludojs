ludo.layout.Fill = new Class({
    Extends: ludo.layout.Base,

    resize: function () {
        var height = this.view.getBody().height();
        if (height <= 0)return;
        for (var i = 0; i < this.view.children.length; i++) {
            this.view.children[i].resize({height: height});
        }
    }
});