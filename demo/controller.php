<?php
/**
 * Controller for Ajax requests
 * User: Alf Magne
 * Date: 11.02.13
 * Time: 14:44
 */

require_once __DIR__."/autoload.php";

$handler = new LudoDBRequestHandler();
$request = array(
    "request" => $_POST['request'],
    "data" => $_POST['data']
);
echo $handler->handle($request);