<?php
if(!isset($prefix)){
    if($sub)$prefix = '../'; else $prefix = '';
}
if(isset($_GET['skin']))$skin = $_GET['skin'];
$skin = isset($skin) ? $skin : 'twilight';

header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?php echo $pageTitle; ?></title>

    <script class="analytics" type="text/javascript">

        if(location.hostname.indexOf('ludojs.com') >=0){
            var _gaq = _gaq || [];
            _gaq.push(['_setAccount', 'UA-34153510-1']);
            _gaq.push(['_trackPageview']);

            (function() {
                var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
                ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
                var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
            })();

        }

    </script>

    <script type="text/javascript" src="<?php echo $prefix; ?>../jquery/jquery-3.1.0.min.js"></script>

    <link rel="icon" type="image/gif" href="<?php echo $prefix; ?>../images/favicon.png?rnd=1" />

    <style type="text/css">
    body{
        font-family:arial,serif;
    }
    body,html{
        height:100%;margin:0;padding:0;
    }
    </style>


    <?php
    if(isset($_GET["debug"])){
        ?>

        <?php

        require_once("all-js-include.php");
    }else {

        $ver = file_get_contents($prefix. "../zip/current-zip.txt");
        ?>
       <script type="text/javascript" src="<?php echo $prefix; ?>../js/ludojs<?php echo isset($_GET['fullSource']) ? "" : "-minified"; ?>.js?ver=<?php echo $ver; ?>git"></script>
        <?php

    }


    if(isset($_GET['blue'])){
        $skin = "blue";
        ?>
        <link rel="stylesheet" href="<?php echo $prefix; ?>../css/ludojs.css" type="text/css">
        <link rel="stylesheet" href="<?php echo $prefix; ?>../css-source/skin/blue.css" type="text/css">
        <?php

    }else if(isset($_GET['generated'])){
        $skin = "generated";
        ?>
        <link rel="stylesheet" href="<?php echo $prefix; ?>../css/ludojs.css" type="text/css">
        <link rel="stylesheet" href="<?php echo $prefix; ?>../css/ludojs-generated.css?rnd=2" type="text/css">
        <?php

    }else if(isset($_GET['gray'])){
        $skin = "gray";
        ?>
        <link rel="stylesheet" href="<?php echo $prefix; ?>../css/ludojs.css" type="text/css">
        <link rel="stylesheet" href="<?php echo $prefix; ?>../css-source/skin/gray.css" type="text/css">
        <?php

    }else if(isset($_GET['light-gray'])){
        $skin = "light-gray";
        ?>
        <link rel="stylesheet" href="<?php echo $prefix; ?>../css/ludojs.css" type="text/css">
        <link rel="stylesheet" href="<?php echo $prefix; ?>../css-source/skin/light-gray.css" type="text/css">
        <?php

    }else if(isset($_GET['twilight'])){
        $skin = "twilight";
        ?>
        <link rel="stylesheet" href="<?php echo $prefix; ?>../css/ludojs.css" type="text/css">
        <link rel="stylesheet" href="<?php echo $prefix; ?>../css-source/skin/twilight.css" type="text/css">
        <?php

    }else{
        ?>
        <link rel="stylesheet" href="<?php echo $prefix; ?>../css/ludojs-all.css?rnd=3" type="text/css">
        <?php
    }


    ?>
    <script type="text/javascript" src="<?php echo $prefix; ?>code-highlight/code-highlight.js"></script>
    <style type="text/css">
        div.source-code-preview{
            background-color:#FFF;
            padding:5px;
        }
        .ludo-twilight div.source-code-preview{
            background-color:#424242;
        }
        .source-code-preview-parent .ludo-body{
            color:#333;
        }
        .source-code-preview-parent{
            border-top:1px solid #ddd;
            background-color:#aaa;
        }

        
        .h-keywords{
            color:#000080;
            font-weight:bold;
        }
        .h-configs{
            color:#660e7a;
            font-weight:bold;
        }
        .h-numbers{
            color:#00F;
        }
        .h-text{
            color:#008000;
        }
        .h-comments{
            color:#888;
        }
        .h-methods{
            color:#7a7a2b;
        }
        .h-variables{
            color:#458383;
        }


        .ludo-twilight .source-code-preview-parent{
            border-top:1px solid #424242;
            background-color:#aaa;
        }

        .ludo-twilight .source-code-preview{
            color:#629755;
            font-size:1.1em;

        }

        .ludo-twilight .h-keywords{
            color:#cc7832;
        }

        .ludo-twilight .h-configs{
            color:#ffc66d;
        }

        .ludo-twilight .h-comments{
            color:#aaa;
        }
        .ludo-twilight .h-numbers{
            color:#6897bb;
        }

        .ludo-twilight .h-text{
            color:#629755;
        }

        .ludo-twilight .h-methods{
            color:#ffc66d;
        }
        /**
            cls:{
        keyWords:"h-keywords",
        configs:"h-configs",
        numbers:"h-numbers2",
        text:"h-text",
        comments:"h-comments",
        methods:"h-methods",
        variables:"h-variables"           
    },
    
    styling:{
        keyWords:{ color:'#000080', 'font-weight':'bold' },
        configs:{ color:'#660e7a', 'font-weight':'bold' },
        numbers:{ color:'#00F' },
        text:{ color:'#008000' },
        comments:{ color:'#888' },
        methods:{ color:'#7a7a2b' },
        variables:{ color:'#458383' }
    },
    
    </style>



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
            cls: 'source-code-preview-parent',
            bodyCls : 'source-code-preview',
            __rendered:function(){
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

<body class="ludo-<?php echo $skin; ?>">