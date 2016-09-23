<?php
if($sub)$prefix = '../'; else $prefix = '';
if(isset($_GET['skin']))$skin = $_GET['skin'];
$skin = isset($skin) ? $skin : 'light-gray';
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title><?php echo $pageTitle; ?></title>

    <script type="text/javascript" src="<?php echo $prefix; ?>../jquery/jquery-3.1.0.min.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../mootools/mootools-core-1.6.0.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../mootools/mootools-More-1.6.0.js"></script>
    <link rel="icon" type="image/gif" href="<?php echo $prefix; ?>../images/favicon.png" />
    <style type="text/css">
    body{
        font-family:arial,serif;
    }
    body,html{
        height:100%;
    }
    </style>
    <!--<script type="text/javascript" src="<?php echo $prefix; ?>../js/ludojs<?php echo isset($_GET['fullSource']) ? "" : "-minified"; ?>.js"></script>-->

    <script type="text/javascript" src="<?php echo $prefix; ?>../src/ludo.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/util.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/registry.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/object-factory.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/config.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/dom.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/core.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/view.js"></script>


    <script type="text/javascript" src="<?php echo $prefix; ?>../src/canvas/engine.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/canvas/node.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/canvas/named-node.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/canvas/element.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/canvas/canvas.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/canvas/filter.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/canvas/gradient.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/canvas/mask.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/canvas/polyline.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/canvas/polygon.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/canvas/paint.js"></script>


    <script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/base.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/linear.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/grid.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/card.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/linear-horizontal.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/linear-vertical.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/relative.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/resizer.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/renderer.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/slide-in.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/fill.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/factory.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/popup.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/canvas.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/tab.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/tab-strip.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/text-box.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/menu.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/menu-vertical.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/menu-container.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/collapse-bar.js"></script>





    <script type="text/javascript" src="<?php echo $prefix; ?>../src/effect/effect.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/effect/drag.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/effect/drag-drop.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/effect/resize.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/effect.js"></script>

    <script type="text/javascript" src="<?php echo $prefix; ?>../src/tpl/parser.js"></script>


    <script type="text/javascript" src="<?php echo $prefix; ?>../src/view/shim.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/framed-view.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/window.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/video/video.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/video/you-tube.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/view/title-bar.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/view/button-bar.js"></script>

    <script type="text/javascript" src="<?php echo $prefix; ?>../src/form/manager.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/form/element.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/form/label-element.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/form/button.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/form/text.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/form/textarea.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/form/number.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/form/spinner.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/form/filter-text.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/form/email.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/form/password.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/form/checkbox.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/form/select.js"></script>

    <script type="text/javascript" src="<?php echo $prefix; ?>../src/remote/base.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/remote/json.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/remote/broadcaster.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/remote/shim.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/remote/inject.js"></script>

    <script type="text/javascript" src="<?php echo $prefix; ?>../src/form/validator/base.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/form/validator/fns.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/form/validator/md5.js"></script>

    <script type="text/javascript" src="<?php echo $prefix; ?>../src/data-source/base.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/data-source/json.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/data-source/collection.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/data-source/collection-search.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/data-source/search-parser.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/data-source/html.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/data-source/record.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/data-source/tree-collection.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/data-source/tree-collection-search.js"></script>


    <script type="text/javascript" src="<?php echo $prefix; ?>../src/progress/base.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/progress/bar.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/progress/datasource.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/progress/text.js"></script>



    <script type="text/javascript" src="<?php echo $prefix; ?>../src/card/button.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/card/finish-button.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/card/next-button.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/card/previous-button.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/card/progress-bar.js"></script>


    <script type="text/javascript" src="<?php echo $prefix; ?>../src/notification.js"></script>

    <script type="text/javascript" src="<?php echo $prefix; ?>../src/calendar/base.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/calendar/calendar.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/calendar/selector.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/calendar/year-selector.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/calendar/month-year-selector.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/calendar/month-selector.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/calendar/days.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/calendar/nav-bar.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/calendar/today.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/language/default.js"></script>

    <script type="text/javascript" src="<?php echo $prefix; ?>../src/menu/button.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/menu/menu.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/menu/item.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/menu/menu-item.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/menu/drop-down.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/menu/context.js"></script>


    <script type="text/javascript" src="<?php echo $prefix; ?>../src/grid/grid.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/grid/grid-header.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/grid/menu.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/grid/column-manager.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/grid/row-manager.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/grid/column-move.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/grid/column.js"></script>

    <script type="text/javascript" src="<?php echo $prefix; ?>../src/scroller.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/col-resize.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/storage/storage.js"></script>

    <script type="text/javascript" src="<?php echo $prefix; ?>../src/paging/button.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/paging/first.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/paging/next.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/paging/previous.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/paging/last.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/paging/page-input.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/paging/page-size.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/paging/current-page.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../src/paging/total-pages.js"></script>

    <script type="text/javascript" src="<?php echo $prefix; ?>code-highlight/code-highlight.js"></script>
    
    
    <link rel="stylesheet" href="<?php echo $prefix; ?>../css/ludojs-<?php echo $skin; ?>.css" type="text/css">
    <script type="text/javascript">
        ludo.appConfig = {
            fileupload:{
                url:'file-upload-controller.php'
            }
        };
    </script>
    <script type="text/javascript">

        ludo.SourceCodePreview = new Class({
            Extends: ludo.View,
            title : 'Source code',
            bodyCls : 'source-code-preview',
            css:{
                'background-color' : '#fff',
                'padding' : 3
            },
            ludoRendered:function(){
                var el = $(document.body).find('.source-code');
                if(el){
                    this.getBody().html(el.html());
                    new ludo.CodeHighlight(this.getBody());
                }
            }


        });

        var hostname = location.hostname.toLowerCase();
        if (hostname.indexOf('ludojs.com') >= 0) {
            var _gaq = _gaq || [];
            _gaq.push(['_setAccount', 'UA-34153510-1']);
            _gaq.push(['_trackPageview']);

            (function () {
                var ga = document.createElement('script');
                ga.type = 'text/javascript';
                ga.async = true;
                ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
                var s = document.getElementsByTagName('script')[0];
                s.parentNode.insertBefore(ga, s);
            })();
        }

    </script>
    <script type="text/javascript">
    ludo.config.setUrl('../controller.php');
    </script>
</head>