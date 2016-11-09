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
        height:100%;margin:0;padding:0;
    }
    </style>
    <!--<script type="text/javascript" src="<?php echo $prefix; ?>../js/ludojs<?php echo isset($_GET['fullSource']) ? "" : "-minified"; ?>.js"></script>-->

    <?php
    require_once("all-js-include.php");
    
    ?>
    
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
            type:'SourceCodePreview',
            title : 'Source code',
            bodyCls : 'source-code-preview',
            elCss:{
                'border-top': '1px solid #ddd',
                'background-color': '#aaa'
            },
            css:{
                'background-color' : '#fff',
                'padding' : 5
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