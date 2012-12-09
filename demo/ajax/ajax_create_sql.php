<?php

// prevent direct access
$isAjax = isset($_SERVER['HTTP_X_REQUESTED_WITH']) AND
	strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
if(!$isAjax) {
	print 'Access denied - not an AJAX request...' . ' (' . __FILE__ . ')';
	exit;
}

require_once '../mysql/settings.php';
require_once '../lib/adodb_5.18a/adodb.inc.php';

$a_rules = $_POST['a_rules'];

if(count($a_rules) == 0) {
	exit;
}

// connect to database
$dsn = $mysql_driver . '://' . $mysql_user . ':' . rawurlencode($mysql_passwd) . '@' . $mysql_server . '/' . $mysql_db . '?fetchmode=' . ADODB_FETCH_ASSOC;
$conn = NewADOConnection($dsn);
$conn->execute('SET NAMES UTF8');


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
			$sql .= PHP_EOL;
			$sql .= ($is_group && $i == 0 ? '(' : '');
			$sql .= $rule['condition']['field'];
			$sql .= create_operator_sql($rule['condition']['operator']);
			$sql .= create_filter_value_sql($rule['condition']['filterType'], $rule['condition']['operator'], $rule['condition']['filterValue']);
		} else {
			parse_rules($rule['condition'], true);
		}
		$sql .= ($i < $a_len - 1 ? ' ' . $rule['logical_operator'] : '');
		$sql .= ($is_group && $i == $a_len - 1 ? ')' : '');
	}
	return $sql;
}

/**
 * @param $filter_type string (on of "text", "number", "date" - see documentation)
 * @param $operator_type string (see documentation for available operators)
 * @param $a_values array the values array
 * @return string
 */
function create_filter_value_sql($filter_type, $operator_type, $a_values) {
	global $conn;
	$res = '';
	$vlen = count($a_values);
	if($vlen == 0) {
		if(in_array($operator_type, array("is_empty", "is_not_empty"))) {
			$res = "''";
		}
	} else {
		if(in_array($operator_type, array("equal", "not_equal", "less", "not_equal", "less_or_equal", "greater", "greater_or_equal"))) {
			$res = ($filter_type == "number" ? $a_values[0] : $conn->qstr($a_values[0]));
		} else if(in_array($operator_type, array("begins_with", "not_begins_with"))) {
			$res = $conn->qstr($a_values[0] . '%');
		} else if(in_array($operator_type, array("contains", "not_contains"))) {
			$res = $conn->qstr('%' . $a_values[0] . '%');
		} else if(in_array($operator_type, array("ends_with", "not_ends_with"))) {
			$res = $conn->qstr('%' . $a_values[0]);
		} else if(in_array($operator_type, array("in", "not_in"))) {
			$res = '(' . implode(",", $a_values) . ')';
		}
	}
	return $res;
}

/**
 * @param $operator_type
 * @return string
 */
function create_operator_sql($operator_type) {
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

?>