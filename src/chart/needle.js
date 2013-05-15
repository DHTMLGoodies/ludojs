ludo.chart.Needle = new Class({
    Extends: ludo.chart.Fragment,

    createNodes:function(){
        var node = this.createNode('g');
        node.setStyles({
            'fill' : '#f00',
            'stroke' : '#000',
            'line-join' : 'round'
        });
        this.path = new ludo.canvas.Path();
        node.adopt(this.path);
        this.resize();
    },

    getPath:function(){
        var size = this.getParent().getSquareSize() / 2 - 20;
        return 'M 0 -20 L -3 20 L -1 ' + size + ' L 1 ' + size + ' L 3 10 Z';
    },

    resize:function(){
        this.path.set('d', this.getPath());
        var center = this.getParent().getCenter();
        this.nodes[0].translate(center.x,center.y);

        this.nodes[0].rotate(180, 0, 0);
    }
});