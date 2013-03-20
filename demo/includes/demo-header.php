<?php
if($sub)$prefix = '../'; else $prefix = '';
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title><?php echo $pageTitle; ?></title>

    <script type="text/javascript" src="<?php echo $prefix; ?>../mootools/mootools-core-1.4.5.js"></script>
    <script type="text/javascript" src="<?php echo $prefix; ?>../mootools/mootools-more-1.4.0.1.js"></script>
    <style type="text/css">
    body{
        font-family:arial,serif;
    }
    body,html{
        height:100%;
    }
    </style>
    <script type="text/javascript" src="<?php echo $prefix; ?>../js/ludojs.js"></script>

    <script type="text/javascript" src="<?php echo $prefix; ?>code-highlight/code-highlight.js"></script>
    <link rel="stylesheet" href="<?php echo $prefix; ?>../css/ludojs-light-gray.css" type="text/css">
    <script type="text/javascript">
        ludo.appConfig = {
            fileupload:{
                url:'file-upload-controller.php'
            }
        };
    </script>
    <script type="text/javascript">
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