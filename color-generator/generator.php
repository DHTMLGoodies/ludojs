<?php

/**
 * Created by IntelliJ IDEA.
 * User: alfmagne1
 * Date: 26/10/2016
 * Time: 12:13
 */
class ColorScheme
{

    private $name;
    private $colors;

    public function __construct($name)
    {
        $this->name = $name;
    }

    public function add($colorName, $color)
    {
        if (empty($this->colors)) {
            $this->colors = array();
        }

        $this->colors[$colorName] = "#" . $color;
    }

    public function asArray()
    {
        return array(
            $this->name => $this->colors
        );
    }

    public function getName()
    {
        return $this->name;
    }

    public function getFileName()
    {
        return strtolower(preg_replace('/[^a-z]/si', '', $this->name)) . ".json";
    }

    public function toString()
    {
        return json_encode($this->asArray());
    }

    public function getColors()
    {
        return $this->colors;
    }
}

class Schemes
{

    private $schemes;

    /**
     * @param ColorScheme $scheme
     */
    public function add($scheme)
    {
        if (empty($this->schemes)) {
            $this->schemes = array();
        }
        $this->schemes[] = $scheme;
    }

    public function toString()
    {
        $ret = array();

        foreach ($this->schemes as $scheme) {
            /**
             * @var ColorScheme $scheme
             */
            $name = strtolower(preg_replace('/[^a-z]/si', '', $scheme->getName()));
            $ret[$name] = $scheme->getColors();
        }

        return json_encode($ret);

    }
}

$schemes = new Schemes();


$colorArray = array();

$data = file_get_contents("colors.txt");
$data = trim($data);

$lines = preg_split('/\n/s', $data);

$currentScheme = null;

foreach ($lines as $line) {
    $tokens = preg_split('/#/s', $line);

    if (count($tokens) == 1) {
        if (!empty($currentScheme)) {
            $schemes->add($currentScheme);
        }
        $currentScheme = new ColorScheme(trim($tokens[0]));

    } else {

        if (!empty($currentScheme)) {
            $num = trim($tokens[0]);
            $color = trim($tokens[1]);
            $currentScheme->add($num, $color);
        }
    }
}

if (!empty($currentScheme)) {
    $schemes->add($currentScheme);
}


echo $schemes->toString();