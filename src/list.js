ludo.List = new Class({
    Extends:ludo.CollectionView,
    defaultDS:'dataSource.Collection',
    overflow:'scroll',
    highlighted:undefined,
    recordMap:{},

    ludoConfig:function (config) {
        this.parent(config);
    },

    ludoEvents:function () {
        this.parent();
        this.getBody().addEvent('click', this.onClick.bind(this));
    },

    ludoRendered:function () {
        this.parent();

        if (this.dataSource) {
            if (this.dataSourceObj && this.dataSourceObj.hasData()) {
                this.render();
            }
            this.getDataSource().addEvents({
                'change':this.render.bind(this),
                'select':this.select.bind(this),
                'deselect':this.deselect.bind(this),
                'update':this.update.bind(this),
                'delete':this.remove.bind(this)
            });
        }
    },

    render:function () {

        var d = this.getDataSource().getData();

        var data = this.getTplParser().getCompiled(d, this.tpl);
        var b = this.nodeContainer();
        b.innerHTML = '';

        for (var i = 0; i < data.length; i++) {
            var el = document.id(ludo.dom.create({
                tag:'div',
                id : 'list-' + d[i].uid,
                html:data[i],
                css:{ "cursor": "pointer" },
                cls : 'ludo-list-item',
                renderTo:b
            }));
            this.recordMap[d[i].uid] = el.id;

            el.addEvent('mouseenter', this.enter.bind(this));
            el.addEvent('mouseleave', this.leave.bind(this));
        }

        var selected = this.getDataSource().getSelectedRecord();
        if(selected){
            this.select(selected);
        }
    },

    enter:function(e){
        var el = this.getRecordDOM(e.target);
        if(el)ludo.dom.addClass(el, 'ludo-list-item-highlighted');
    },

    leave:function(e){
        var el = this.getRecordDOM(e.target);
        if(el)ludo.dom.removeClass(el, 'ludo-list-item-highlighted');
    },

    getRecordDOM:function(el){
        if(!ludo.dom.hasClass(el, 'ludo-list-item')){
            el = el.getParent('.ludo-list-item');
        }
        return el;
    },

    getRecordId:function(el){
        el = this.getRecordDOM(el);
        if(el){
            return el.id.replace('list-', '');
        }
        return undefined;
    },

    getDOMForRecord:function(record){
        return this.recordMap[record.uid] ? document.id(this.recordMap[record.uid]) : undefined;

    },

    select:function (record) {
        var el = this.getDOMForRecord(record);
        if(el)ludo.dom.addClass(el, 'ludo-list-item-selected');
    },

    deselect:function (record) {
        var el = this.getDOMForRecord(record);
        if(el)ludo.dom.removeClass(el, 'ludo-list-item-selected');
    },

    update:function (record) {
        var el = this.getDOMForRecord(record);
        if(el){
            var content = this.getTplParser().asString(record, this.tpl);
            el.set('html', content);
        }
    },

    remove:function (record) {
        var el = this.getDOMForRecord(record);
        if(el){
            el.dispose();
            this.recordMap[record.uid] = undefined;
        }
    },

    onClick:function (e) {
        var recId = this.getRecordId(e.target);
        if(recId)this.getDataSource().getRecord(recId).select();
    }
});