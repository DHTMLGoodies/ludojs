/**
 * When layout.type is set to "table", children will be arranged in a table layout.
 * For demo, see <a href="../demo/layout/table.php">Table layout demo</a>.
 * @namespace ludo.layout
 * @class ludo.layout.Table
 * @param {Object} config
 * @param {Object} config.columns Column configuration for the table layout. These layout options are added to the parent View.
 * @param {Number} config.columns.width Optional width of column
 * @param {Number} config.columns.weight Optional width weight of columns. "weight" means use remaining space.
 * In a view where width is 400, and you have three columns, one with fixed with of 100,
 * one with weight of 1 and one width weight of 2, the first column will use get its fixed with of 100.
 * The second one will get a width of 100(300(remaining width) * 1(weight) / 3(total weight)) and last column a width of 200
 * (300(remaining width) * 2(weight) / 3(total weight))
 * @param {Number} config.rowHeight Optional fixed height of every row
 * @param {Number} config.row true to create a new row. (Option for child layout)
 * @param {Number} config.vAlign Optional Vertical alignment of View(top|middle|bottom|baseline). Default: "top"(Option for child layout)
 * @param {Number} config.simple true when there are no colspan or rowspan. When this option is true, you don't need to set row:true to specify new rows.
 * @example
 var w = new ludo.Window({
        title: 'Table layout',
        layout: {
            // position and size of this window
            left: 20, top: 20,width: 600, height: 600,
            // render children in a table layout
            type: 'table',
            // Define columns, weight means use remaining space
            columns: [
                {width: 100}, {width: 200}, {weight: 1}
            ]
        },
        css: {
            border: 0
        },
        children: [
            {html: 'First row 1 '},
            {html: 'First row 2 '},
            // Table picker below spans 3 rows
            {
                type: 'calendar.TimePicker',
                layout: {
                    height: 200,
                    weight:1,
                    rowspan: 3
                }
            },
            // Place the cell below in a new row
            {html: 'Second row 1 ', layout: {row: true, vAlign : 'top' }},
            {html: 'Second row 2 '},
            {html: 'Third row 1 ', layout: {row: true, colspan : 2}}
        ]
    });
 */
ludo.layout.Table = new Class({
    Extends: ludo.layout.Base,

    table: undefined,
    tbody: undefined,
    countChildren: undefined,
    cols: undefined,
    currentRow: undefined,

    fixedWidth: undefined,
    totalWeight: undefined,
    countCellsInNextRow: undefined,
    simple: false,
    rowHeight: undefined,

    onCreate: function () {
        this.parent();

        this.countChildren = 0;
        this.cols = this.view.layout.columns;
        if (this.view.layout.rowHeight != undefined)this.rowHeight = this.view.layout.rowHeight;
        this.fixedWidth = 0;
        this.totalWeight = 0;
        this.simple = this.view.layout.simple || this.simple;
        var cols = [];
        for (var i = 0; i < this.cols.length; i++) {
            var col = this.cols[i];
            var numWidth = col.width != undefined ? col.width : 0;
            this.fixedWidth += numWidth;
            this.totalWeight += (col.weight != undefined ? col.weight : 0);
            var width = numWidth != undefined && numWidth > 0 ? ' width="' + numWidth + '"' : "";
            cols.push('<col' + width + '>');
        }

        this.table = jQuery('<table style="padding:0;margin:0;border-collapse: collapse"><colgroup>' + (cols.join('')) + '</table>');
        this.tbody = jQuery('<tbody></tbody>');
        this.table.append(this.tbody);

        this.view.$b().append(this.table);

    },

    addChild: function (child, insertAt, pos) {
        return this.parent(child, insertAt, pos);
    },

    getParentForNewChild: function (child) {
        if (this.countChildren == 0 || child.layout.row || (this.simple && this.countChildren % this.cols.length == 0)) {
            child.layout.row = true;
            this.currentRow = jQuery('<tr style="border:none;padding:0;margin:0"></tr>');
            this.tbody.append(this.currentRow);
            this.countCellsInNextRow = this.cols.length;

        }
        var colspan = child.layout.colspan ? child.layout.colspan : 1;
        var rowspan = child.layout.rowspan ? child.layout.rowspan : 1;

        var vAlign = child.layout.vAlign ? child.layout.vAlign : "top";

        var cell = jQuery('<td style="vertical-align:' + vAlign + ';margin:0;padding:0" colspan="' + colspan + '" rowspan="' + rowspan + '"></td>');
        this.currentRow.append(cell);
        this.countChildren+= colspan;
        return cell;
    },

    resize: function () {

        var c = this.view.children;
        var curCellIndex = 0;
        for (var i = 0; i < c.length; i++) {
            var child = c[i];

            if (child.layout.row)curCellIndex = 0;

            var config = {};
            if (this.rowHeight != undefined)config.height = this.rowHeight;
            if (child.layout.height != undefined)config.height = child.layout.height;

            config.width = this.getWidthOfChild(child, curCellIndex);

            child.resize(config);
            child.saveState();
            curCellIndex += child.layout.colspan ? child.layout.colspan : 1;
        }

    },

    getWrappedHeight: function () {
        return this.parent() + this.table.outerHeight();
    },

    getWidthOfChild: function (child, colIndex) {
        var colspan = child.layout.colspan ? child.layout.colspan : 1;
        if (child.layout.width)return child.layout.width;
        var width = 0;
        var totalWidth = this.view.$b().width();
        var weightWidth = totalWidth - this.fixedWidth;
        for (var i = colIndex; i < colIndex + colspan; i++) {
            if (this.cols[i].width) {
                width += this.cols[i].width;
            } else if (this.cols[i].weight) {
                width += (weightWidth * this.cols[i].weight / this.totalWeight);
            }

        }
        return width;
    }

});