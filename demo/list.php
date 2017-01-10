<?php
$sub = false;
$pageTitle = 'Searchable list';
require_once("includes/demo-header.php");
?>


<script type="text/javascript" src="../src/tpl/parser.js"></script>
<script type="text/javascript" src="../src/list-view.js"></script>
<script type="text/javascript" src="../src/data-source/collection.js"></script>
<style type="text/css">
    .ludo-list-item {

        border: 1px solid transparent;
        border-bottom-color: #444;
        overflow: hidden;

    }

    .ludo-list-item-front {
        background-color: #535353;
        padding: 3px;
        padding-bottom: 8px;

    }

    .ludo-list-item-front {
        font-size: 0.8em;

    }

    .ludo-list-item-back-left{
        background-color:#388E3C;
        color:#FFF;
    }

    .ludo-list-item-back-right{
        background-color:#D32F2F;
        color:#FFF;
    }
    
    .ludo-list-item-back-undo{
        background-color:#455A64;
        color:#FFF;
    }

    div.ludo-list-item-highlighted .ludo-list-item-front {
        background-color: #666;
    }

    div.ludo-list-item-selected .ludo-list-item-front {
        background-color: #444;
        color: #ccc;

    }

    .input-cell input {
        height: 15px;
    }

    .ludo-grid-resize-handle {
        background-color: transparent;
    }

    .ludo-twilight .ludo-list-view-body {
        overflow-y: auto;
    }
</style>
<script type="text/javascript" class="source-code skip-copy">

    var d = new Date();

    var dataSource = new ludo.dataSource.Collection({
        /** The url below contains an array of json objects like so:
         * [
         {
           "from": "Collins, Vickie",
           "subject": "Darn, that mastodon is far more playful than this thoughtful sloth.",
           "message": "<p>Hmm, the panda is more masterful than this jaded gecko.<\/p><p>Oh, this bald eagle is more malicious than a heinous gorilla.<\/p><p>Goodness, some turtle is more promiscuous than this articulate jellyfish.<\/p><p>Gosh, that cardinal is much less soulful than a judicious wallaby.<\/p><p>Yikes, one bluebird is much more comfortable than that sleek lantern fish.<\/p>",
           "date": "2017-01-10 12:28:02"
         },
         {
           "from": "Foster, Elin",
           "subject": "Hi, that airy kangaroo diplomatically gnashed on account of the proper bluebird.",
           "message": "<p>Hello, that dense guinea pig conservatively nodded owing to one characteristic human.<\/p><p>Hello, one foul limpet delinquently fired onto the equal woolly mammoth.<\/p><p>Jeez, the incredible hippopotamus immeasurably arose in this perceptible gecko.<\/p><p>Er, some tortoise is more formidable than that unblushing bird.<\/p><p>Darn, the dove is far less airy than one waspish hound.<\/p>",
           "date": "2017-01-10 11:04:42"
         }
         ]
         */
        url:'data/list-data.json',
        id: 'myDataSource',
        searchConfig: {
            index: ['firstname', 'from', 'subject'],
            delay: .5
        },
        listeners: {
            count: function (countRecords) {
                if (ludo.get('gridWindowSearchable')) {
                    var suffix = countRecords > 1 ? 'records' : 'record';
                    ludo.get('gridWindowSearchable').setTitle('ListView sample (' + countRecords + ' ' + suffix + ')');
                }
            },
            select: function (record) {
                ludo.$('mainView').JSON(record, '<h1>{subject}</h1><p>{message}</p>');
            }
        }
    });

    var w = new ludo.FramedView({
        renderTo: document.body,
        id: 'gridWindowSearchable',
        title: 'List - capital and population (' + dataSource.getCount() + ' records)',
        layout: {
            width: 'matchParent', height: 'matchParent',
            type: 'tab'
        },

        children: [
            {
                title: 'List demo',
                layout: {
                    type: 'linear',
                    orientation: 'horizontal'
                },

                children: [
                    {
                        layout: {
                            type: 'linear',
                            orientation: 'vertical',
                            width: 200,
                            resizable: true
                        },
                        css: {
                            'border-right': '1px solid ' + ludo.$C('border')
                        },
                        children: [
                            {
                                layout: {
                                    height: 27,
                                    alignParentTop: true,
                                    alignParentLeft: true
                                },
                                id: 'searchField',
                                labelWidth: 50,
                                type: 'form.Text',
                                placeholder: 'Search',
                                listeners: {
                                    key: function (value) {
                                        ludo.get('myDataSource').search(value);
                                    }
                                }
                            },
                            {
                                id: 'myList',
                                type: 'ListView',
                                /* Items are swipable */

                                swipable: true,
                                emptyText:'No data found',
                                undoTimeout:2000, /* Time to undo swipe before swipe event is triggered */
                                /** Function returning HTML for a record. This method may return jQuery DOM */
                                itemRenderer: function (record) {
                                    return '<div><strong>' + record.from + '</strong><br>' + record.subject + '</div> '
                                },

                                /** Function returning back side when swiping to the left */
                                backSideLeft:function(record){
                                    return '<div style="position:absolute;top:50%;margin-top:-10px;left:10px">Archive</div>';
                                },

                                /** Function returning background when swiping to the right */
                                backSideRight:function(record){
                                    return '<div style="position:absolute;top:50%;margin-top:-10px;right:10px">Delete</div>';
                                },

                                /** Function returning UNDO html after swipe. If not set, the swipe event will be triggered immediately */
                                backSideUndo:function(record){
                                    return '<div style="position:absolute;top:50%;margin-top:-10px;left:10px">Undo</div>';
                                },

                                layout: {
                                    weight: 1
                                },
                                css: {
                                    'overflow-y': 'auto'
                                },
                                dataSource: 'myDataSource',

                                listeners:{
                                    /** Event fired after swiping left
                                     *
                                     * You also have the "swipe" event which
                                     * is triggered both on swipeLeft and swipeRight
                                     *
                                     * */

                                    'swipeLeft': function(record){
                                        ludo.$('myDataSource').remove(record);
                                        new ludo.Notification({
                                           html: 'Item deleted'
                                        });
                                    },
                                    'swipeRight' : function(record){
                                        ludo.$('myDataSource').remove(record);
                                        new ludo.Notification({
                                            html: 'Item archived'
                                        });
                                    }
                                }

                            }

                        ]
                    },
                    {
                        id: 'mainView',
                        html: 'Main View',
                        layout: {
                            weight: 1
                        },
                        css: {
                            padding: 5,
                            'border-left': '1px solid ' + ludo.$C('border')
                        }
                    }
                ]
            },
            {
                type: 'SourceCodePreview'
            }


        ]
    });

</script>

</body>
</html>