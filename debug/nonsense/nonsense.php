<?

# Nonsense Generator 2.0.3
# http://www.jholman.com/scripts/nonsense/
# Copyright © 2002-2004 Jeff Holman
#
# This program is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License
# as published by the Free Software Foundation; either version 2
# of the License, or (at your option) any later version.
#
# See license.txt for the terms of the GNU GPL.
# 
# See help.html for installation and usage instructions.

$this_path = get_included_path('nonsense.php');
define("NONSENSE_PATH", "{$this_path}db/"); // Edit this line if you moved the word lists (*.txt) to another folder.			

function nonsense($numSentences = 1) {
	$lists = array("interjections", "determiners", "adjectives", "nouns", "adverbs", "verbs", "prepositions", "conjunctions", "comparatives");
	$vowels = array('a','e','i','o','u');
	$type = rand(0,1);
	
	foreach ($lists as $part) ${$part} = file(NONSENSE_PATH."$part.txt");
	
	for ($i=0; $i<2; $i++) {
		foreach ($lists as $part) ${$part}[$i]	= trim(${$part}[rand(0,count(${$part}) - 1)]);
	
		if ($determiners[$i] == "a")
			foreach ($vowels as $vowel)
				if (($type && ($adjectives[$i][0] == $vowel)) || (!$type && ($nouns[$i][0] == $vowel))) $determiners[$i] = "an";
		
	}
	
	$sentence = ($type ?
	"$interjections[0], $determiners[0] $adjectives[0] $nouns[0] $adverbs[0] $verbs[0] $prepositions[0] $determiners[1] $adjectives[1] $nouns[1]." :
	"$interjections[0], $determiners[0] $nouns[0] is $comparatives[0] $adjectives[0] than $determiners[1] $adjectives[1] $nouns[1].");
	
	if ($numSentences > 1) return $sentence." ".nonsense($numSentences-1);
	return $sentence;
}

function nonsense_word($numWords = 1) {
	$lists = array("interjections", "determiners", "adjectives", "nouns", "adverbs", "verbs", "prepositions", "conjunctions", "comparatives");
	foreach ($lists as $part) $wordlists[] = file(NONSENSE_PATH."$part.txt");
	
	$word_list = '';
	
	for ($count = 1; $count <= $numWords; $count++) {
		if ($count > 1) $word_list .= ' ';
		$list_to_use = mt_rand(0, sizeof($wordlists) - 1);
		$word_to_use = mt_rand(0, sizeof($wordlists[$list_to_use]) - 1);
		
		$word = $wordlists[$list_to_use][$word_to_use];
		
		if (strpos($word, ' ')) {
			$word = substr_replace($word, '', strpos($word, ' '));
		}
		
		$word = trim($word);
		$word_list .= strtolower($word);
	}
	return $word_list;
}

class Nonsense {
	function Nonsense() {
		$this->lists = array("interjections", "determiners", "adjectives", "nouns", "adverbs", "verbs", "prepositions", "conjunctions", "comparatives");
		$this->vowels = array('a','e','i','o','u');
		$this->wordlists = array();
		$this->output = '';

		foreach ($this->lists as $part) {
			$this->wordlists[$part] = file(NONSENSE_PATH."$part.txt");
		}
	}

	function sentence($numSentences = 1) {
		$type = mt_rand(0,1);
		
		for ($i=0; $i<2; $i++) {
			foreach ($this->lists as $part) {
				${$part}[$i] = trim($this->wordlists[$part][mt_rand(0,count($this->wordlists[$part]) - 1)]);
			}
		
			if ($determiners[$i] == "a") {
				foreach ($this->vowels as $vowel) {
					if (($type && ($adjectives[$i][0] == $vowel)) || (!$type && ($nouns[$i][0] == $vowel))) {
						$determiners[$i] = "an";
					}
				}
			}
		}
		
		$sentence = ($type ?
		"$interjections[0], $determiners[0] $adjectives[0] $nouns[0] $adverbs[0] $verbs[0] $prepositions[0] $determiners[1] $adjectives[1] $nouns[1]." :
		"$interjections[0], $determiners[0] $nouns[0] is $comparatives[0] $adjectives[0] than $determiners[1] $adjectives[1] $nouns[1].");
		
		if ($numSentences > 1) {
			$sentence .= " " . $this->sentence($numSentences-1);
			$this->output = $sentence;
			return $this->output;
		}
		return $sentence;
	}
	
	function word($numWords = 1) {
		$word_list = '';
		
		for ($count = 1; $count <= $numWords; $count++) {
			if ($count > 1) {
				$word_list .= ' ';
			}
			$list_to_use = mt_rand(0, sizeof($this->wordlists) - 1);
			$word_to_use = mt_rand(0, sizeof($this->wordlists[$this->lists[$list_to_use]]) - 1);
			
			$word = $this->wordlists[$this->lists[$list_to_use]][$word_to_use];
			
			if (strpos($word, ' ')) {
				$word = substr_replace($word, '', strpos($word, ' '));
			}
			
			$word = trim($word);
			$word_list .= strtolower($word);
		}
		$this->output = $word_list;
		return $this->output;
	}
}

function get_included_path($file_name) {
	$included_files = get_included_files();
	$path = '';
	foreach ($included_files as $file) {
		if (preg_match("/({$file_name})$/", $file)) {
			$path = preg_replace("/({$file_name})$/", '', $file);
		}
	}
	return $path;
}
?>