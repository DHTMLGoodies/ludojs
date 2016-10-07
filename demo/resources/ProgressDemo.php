<?php
/**
 *
 * User: Alf Magne
 * Date: 17.06.13
 * Time: 15:20
 */
class ProgressDemo implements LudoDBService
{

    private $current = 0;

    public function getValidServices(){
        return array('save');
    }

    public function save(){
        $instance = LudoDBProgress::getInstance();
        $instance->setSteps(100, 'Progress demo');
        $this->increment();
        return null;
    }

    private function increment(){
        $instance = LudoDBProgress::getInstance();
        $instance->increment(2, 'Text for step ' . $this->current);
        $this->current+=2;
        if($this->current < 100){
            usleep(100000);
            $this->increment();
        }
    }

    public function shouldCache($service){
        return false;
    }

    public function getOnSuccessMessageFor($service){
        return "";
    }

    public function validateArguments($service, $arguments){
        return true;
    }

    public function validateServiceData($service, $data){
        return true;
    }
}
