<?php
/**
 *
 * User: Alf Magne
 * Date: 11.06.13
 * Time: 15:14
 */
class User extends LudoDBModel implements LudoDBService
{

    protected $config = array(
        "sql" => "select * from user where id=?",
        'table' => 'user',
        'columns' => array(
            'id' => 'int auto_increment not null primary key',
            'firstname' => array(
                'db' => 'varchar(128)',
                'access' => 'rw'
            ),
            'lastname' => array(
                'db' => 'varchar(128)',
                'access' => 'rw'
            ),
            'address' => array(
                'db' => 'text',
                'access' => 'rw'
            ),
            'country' => array(
                "db" => "int",
                "access" => "rw",
                "references" => "country(ID) on delete cascade"
            ),
            "gender" => array(
                "db" => "char(1)",
                "access" => "rw"
            )
        ),
        "data" => array(
            array("firstname" => "John", "lastname" => "Johnson", "address" => "Main street 1", "country" => 187, "gender" =>"m"),
            array("firstname" => "Hannah", "lastname" => "Pettersen", "address" => "Main road 21", "country" => 131, "gender" =>"f"),
            array("firstname" => "Peter", "lastname" => "Luna", "address" => "Aloha road 21", "country" => 187, "gender" =>"m"),
            array("firstname" => "Sammy", "lastname" => "Svenson", "address" => "Aloha road 21", "country" => 131, "gender" =>"m"),
            array("firstname" => "Pam", "lastname" => "Robertson", "address" => "Aloha road 311", "country" => 187, "gender" =>"f"),
            array("firstname" => "Albert", "lastname" => "Phoenix", "address" => "Aloha road 43", "country" => 187, "gender" =>"m"),
            array("firstname" => "Anna", "lastname" => "Karenina", "address" => "Park street 34", "country" => 187, "gender" =>"f"),
            array("firstname" => "Bob", "lastname" => "Connery", "address" => "Queens corner 245", "country" => 187, "gender" =>"m"),
            array("firstname" => "Laura", "lastname" => "Doe", "address" => "Union Square 124", "country" => 187, "gender" =>"f"),
            array("firstname" => "Robert", "lastname" => "Peterson", "address" => "21st street 245", "country" => 187, "gender" =>"m"),
            array("firstname" => "Angie", "lastname" => "Olsen", "address" => "Aloha road 21", "country" => 187, "gender" =>"f"),
            array("firstname" => "Clint", "lastname" => "Westwood", "address" => "Park road 3", "country" => 187, "gender" =>"m"),
            array("firstname" => "Alf", "lastname" => "Kalleland", "address" => "Park avenue 22", "country" => 131, "gender" =>"m"),
        )
    );


    public function getValidServices(){
        return array("read","save");
    }



    public function validateServiceData($service, $data){
        switch($service){
            case "read":
                return empty($data);
            default:
                return !empty($data) && is_array($data);
        }
    }

    public function validateArguments($service, $arguments){
        switch($service){
            case "read":
                return !empty($arguments) && count($arguments) === 1 && is_numeric($arguments[0]);
            case "save":
                return empty($arguments) || (count($arguments) === 1 && is_numeric($arguments[0]));
            default:
                return false;
        }
    }
}
