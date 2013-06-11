<?php
/**
 *
 * User: Alf Magne
 * Date: 11.06.13
 * Time: 15:32
 */
class Countries extends LudoDBCollection implements LudoDBService
{
    protected $config = array(
        "sql" => "select * from country order by name"
    );

    public function getValidServices(){
        return array("read");
    }

    public function validateArguments($service, $arguments){
        return empty($arguments);
    }

    public function validateServiceData($service, $data){
        return empty($data);
    }
}
