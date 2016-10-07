<?php
/**
 * Controller for Ajax requests
 * User: Alf Magne
 * Date: 11.02.13
 * Time: 14:44
 */

require_once __DIR__."/autoload.php";
ini_set('display_errors','on');

if(file_exists("connect.php")){
    require("connect.php");

    $user = new LudoJSUser();
    if(!$user->exists()){
        $util = new LudoDBUtility();
        $util->dropAndCreate(array("LudoJSCountry","LudoJSUser"));
    }
}


$handler = new LudoDBRequestHandler();
echo $handler->handle($_POST['request'], isset($_POST['data']) ? $_POST['data'] : null);