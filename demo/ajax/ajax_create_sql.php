<?php

$a_rules = $_POST['a_rules'];

if(count($a_rules) == 0) {
	exit;
}

echo parse_rules($a_rules);

/**
 * @param $operator_type
 * @return string
 */
function create_sql_operator($operator_type) {
	$operator = '';
	switch($operator_type) {
		case 'equal':
			$operator = '=';
			break;
		case 'not_equal':
			$operator = '!=';
			break;
		case 'in':
			$operator = 'IN';
			break;
		case 'not_in':
			$operator = 'NOT IN';
			break;
		case 'less':
			$operator = '<';
			break;
		case 'less_or_equal':
			$operator = '<=';
			break;
		case 'greater':
			$operator = '>';
			break;
		case 'greater_or_equal':
			$operator = '>=';
			break;
		case 'begins_with':
			$operator = 'LIKE';
			break;
		case 'not_begins_with':
			$operator = 'NOT LIKE';
			break;
		case 'contains':
			$operator = 'LIKE';
			break;
		case 'not_contains':
			$operator = 'NOT LIKE';
			break;
		case 'ends_with':
			$operator = 'LIKE';
			break;
		case 'not_ends_with':
			$operator = 'NOT LIKE';
			break;
		case 'is_empty':
			$operator = '=';
			break;
		case 'is_not_empty':
			$operator = '!=';
			break;
		case 'is_null':
			$operator = 'IS NULL';
			break;
		case 'is_not_null':
			$operator = 'IS NOT NULL';
			break;
	}

	$operator = ' ' . $operator . ' ';
	return $operator;

}

/**
 * @param $operator_type
 * @param $a_values
 */
function create_filter_value($operator_type, $a_values) {

}

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
			$sql .= PHP_EOL;
			$sql .= ($is_group && $i == 0 ? '(' : '');
			$sql .= $rule['condition']['field'];
			$sql .= create_sql_operator($rule['condition']['operator']);
			$sql .= $rule['condition']['filterValue'];
		} else {
			parse_rules($rule['condition'], true);
		}
		$sql .= ($i < $a_len - 1 ? ' ' . $rule['logical_operator'] : '');
		$sql .= ($is_group && $i == $a_len - 1 ? ')' : '');
	}
	return $sql;
}

?>