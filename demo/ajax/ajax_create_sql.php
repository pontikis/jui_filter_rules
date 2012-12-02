<?php

$a_rules = $_POST['a_rules'];

if(count($a_rules) == 0) {
	exit;
}

echo parse_rules($a_rules);


/**
 * @param $a_rules
 * @param bool $is_group
 * @return string
 */
function parse_rules($a_rules, $is_group = false) {
	static $sql;
	if(is_null($sql)) {
		$sql = 'WHERE ';
	}
	$a_len = count($a_rules);

	foreach($a_rules as $i => $rule) {
		if(!is_array($rule['condition'][0])) {
			$sql .= PHP_EOL .
				($is_group && $i == 0 ? '(' : '') .
				$rule['condition']['field'] . ' ' .
				$rule['condition']['operator'] . ' ' .
				$rule['condition']['filterValue'] .
				($i < $a_len - 1 ? ' ' . $rule['logical_operator'] : '') .
				($is_group && $i == $a_len - 1 ? ')' : '');
		} else {
			parse_rules($rule['condition'], true);
			$sql .= ($i < $a_len - 1 ? ' ' . $rule['logical_operator'] : '') .
				($is_group && $i == $a_len - 1 ? ')' : '');
		}
	}
	return $sql;
}

?>