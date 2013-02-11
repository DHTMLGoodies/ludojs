<?php
/**
 *
 * User: Alf Magne
 * Date: 11.02.13
 * Time: 16:39
 */
class FileUpload implements LudoDBService
{
    public static function getValidServices(){
        return array('save');
    }

    public function save(){
        return array('1');
    }

    public function validateService($service, $arguments){
        return isset($_POST['ludo-file-upload-name']);
    }

    public function cacheEnabled(){
        return false;
    }
}
