<?php
/**
 *
 * User: Alf Magne
 * Date: 11.02.13
 * Time: 16:39
 */
class FileUpload implements LudoDBService
{
    public function getValidServices(){
        return array('save');
    }

    public function save(){
        return array('1');
    }

    public function validateArguments($service, $arguments){
        return isset($_POST['ludo-file-upload-name']);
    }

    public function validateServiceData($service, $data){
        return true;
    }
    public function cacheEnabled(){
        return false;
    }

    public function getOnSuccessMessageFor($service){
        return "";
    }
    public function cacheEnabledFor($service){
        return false;
    }
}
