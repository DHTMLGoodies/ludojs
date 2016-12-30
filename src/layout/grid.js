/**
 * This layout arranges child views in a grid layout. It is similar to the Table Layout, but a bit simpler.
 * It creates a coordinate system based on given number of columns and rows. All the columns has the
 * same width, and all rows has the same height. You position child views inside the coordinate system
 * by specifying a value for x and y. Child views can also span multiple columns and/or rows using
 * the colspan and rowspan attribute.
 *
 * Spacing between columns and rows are controlled by the padX and padY attribute.
 *
 * For demo, see <a href="../demo/layout/grid.php">Grid layout demo</a>.
 * @class ludo.layout.Grid
 * @param {object} config
 * @param {Number} config.columns Number of columns
 * @param {Number} config.rows Number of rows
 * @param {Number} config.padX Optional horizontal spacing between columns
 * @param {Number} config.padY Optional vertical spacing between columns
 * @param {Number} config.x Parameter for child view, x coordinate, 0 = first column.
 * @param {Number} config.y Parameter for child view, y coordinate, y = first row.
 * @param {Number} config.colspan Parameter for child view. Span these many columns, default = 1
 * @param {Number} config.rowspan Parameter for child view. Span these many rows, default = 1
 */
ludo.layout.Grid = new Class({
    Extends: ludo.layout.Base,
    columns: undefined,
    rows: undefined,
    colWidth: undefined,
    rowHeight: undefined,

    padX: undefined,
    padY: undefined,

    onCreate: function () {
        var l = this.view.layout;
        this.columns = l.columns || 5;
        this.rows = l.rows || 5;

        this.padX = l.padX || 0;
        this.padY = l.padY || 0;

        this.view.getBody().css('position', 'relative');
    },

    addChild: function (child, insertAt, pos) {
        child.layout = child.layout || {};
        
        child.layout.colspan = child.layout.colspan ||1;
        child.layout.rowspan = child.layout.rowspan ||1;
        child.layout.x = child.layout.x || 0;
        child.layout.y = child.layout.y || 0;
        return this.parent(child, insertAt, pos);
    },

    resize: function () {
        this.storeSize();

        for (var i = 0; i < this.view.children.length; i++) {
            var c = this.view.children[i];
            var r = this.pos(c);
            r.width = this.widthOfView(c);
            r.height = this.heightOfView(c);

            c.resize(r);
        }
    },

    pos:function(child){
        return {
            left: child.layout.x * this.colWidth,
            top: child.layout.y * this.rowHeight
        }
    },

    widthOfView:function(child){
        var colspan = child.layout.colspan || 1;
        var width = colspan * this.colWidth;
        return width - this.padX;
    },

    heightOfView:function(child){
        var rowspan = child.layout.rowspan || 1;
        return (rowspan * this.rowHeight) - this.padY;
    },

    storeSize: function () {
        this.colWidth = this.viewport.width / this.columns;
        this.rowHeight = this.viewport.height / this.rows;
    },

    onNewChild: function (child) {
        child.getEl().css('position', 'absolute');
    }
});