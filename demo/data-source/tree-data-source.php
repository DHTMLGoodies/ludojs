<?php

$countries = array('Norway','Sweden','Spain','USA','United Kingdom','Ireland','Portugal','Israel');

$cities = array('Oslo','Stockholm','Detroit','Chicago','Houston','Santa Fe','Phoenix','Washington','New York','London',
'Barcelona','Madrid','Copenhagen','Helsinki');

$nodes = array('alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega');

$ret = array();
for($i=0;$i<50;$i++){

    $node = array('id' => $i, 'type' => 'country', 'title' =>$countries[rand(0,count($countries)-1)]);
    $node['children'] = array();

    for($j=0;$j<10;$j++){
        $subNode = array('id' => $i."_".$j, 'type' => 'city', 'title' =>$cities[rand(0,count($cities)-1)]);
        $subNode['children'] = array();
        for($k=0;$k<4;$k++){
            $subNode2 = array('id' => $i."_".$j."_".$k, 'type' => 'letter', 'title' =>$nodes[rand(0,count($nodes)-1)]);
            $subNode['children'][] = $subNode2;
        }

        $node['children'][] = $subNode;
    }
    $ret[] = $node;
}

$data = array('success'=>true, 'response' => $ret);

echo json_encode($data);




