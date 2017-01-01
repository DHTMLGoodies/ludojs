<?php
/**
 * Created by IntelliJ IDEA.
 * User: alfmagne1
 * Date: 30/12/2016
 * Time: 16:55
 */



function deleteDir($dirPath) {

    if (! is_dir($dirPath)) {
        throw new InvalidArgumentException("$dirPath must be a directory");
    }
    if (substr($dirPath, strlen($dirPath) - 1, 1) != '/') {
        $dirPath .= '/';
    }
    $files = glob($dirPath . '*', GLOB_MARK);
    foreach ($files as $file) {
        if (is_dir($file)) {

            deleteDir($file);
        } else {

            unlink($file);
        }
    }
    echo $dirPath."<br>";;

    if($dirPath != "samples/"){
        rmdir($dirPath);

    }
}

deleteDir("samples");
// mkdir("samples");

chdir("demo");

$path = "./";


function extension($file)
{
    $tokens = explode(".", $file);
    if (count($tokens) == 1) return "";
    return strtolower(array_pop($tokens));
}

function getHTMLContent($path)
{

    $url = "http://localhost/ludojs/demo/" . $path;

    $options = array(
        'http' => array(
            'header' => "Content-type: application/x-www-form-urlencoded\r\n",
            'method' => 'POST',
            'content' => ''
        )
    );
    $context = stream_context_create($options);


    $result = file_get_contents($url, false, $context);
    $result = preg_replace('/<script class="analytics.*?<\/script>/si', '', $result);

    return $result;

}

function shouldBeParsed($path){
    $ext = extension($path);
    if($ext != "php")return false;
    $data = file_get_contents($path);
    return strstr($data, '<script');
}

function move($path)
{

    $destination = "../samples/" . $path;

    if (shouldBeParsed($path)) {
        $destination = str_replace(".php", ".html", $destination);
        $content = getHTMLContent($path);
        file_put_contents($destination, $content);
        echo "Moving " . $path . " to " . $destination . "<br>";
    } else {
        echo "Copy directly " . $path . " to " . $destination . "<br>";
        $data = file_get_contents($path);
        file_put_contents($destination, $data);
    }

    chmod($destination, 0755);
}

function createDirectory($dir)
{
    if ($dir != './') {
        if (!file_exists("../samples/" . $dir)) {
            mkdir("../samples/" . $dir);
        }
    }
}

function parseDirectory($dir)
{
    echo "<h1>Parsing $dir </h1>";
    createDirectory($dir);

    if ($handle = opendir($dir)) {
        /* This is the correct way to loop over the directory. */
        while (false !== ($entry = readdir($handle))) {



            if (is_dir($dir . $entry)) {

                if (!strstr($entry, "..") && strlen($entry) > 2) {

                    parseDirectory($dir . $entry . "/");
                }
                //
            }else{
                move($dir . $entry);
            }
        }

        closedir($handle);
    }
}

parseDirectory($path);
