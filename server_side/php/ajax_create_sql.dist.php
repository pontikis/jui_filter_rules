<?php
/**
 * ajax_create_sql.dist.php, jui_filter_rules ajax creating sql template script
 *
 * Sample php file creating sql from given rules
 * RDBMS compatible: "MYSQLi", "POSTGRES"
 *
 * Da Capo database wrapper is required https://github.com/pontikis/dacapo
 *
 * @version 1.0.5 (27 May 2014)
 * @author Christos Pontikis http://pontikis.net
 * @license  http://opensource.org/licenses/MIT MIT license
 **/

// PREVENT DIRECT ACCESS (OPTIONAL) --------------------------------------------
$isAjax = isset($_SERVER['HTTP_X_REQUESTED_WITH']) AND
strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
if(!$isAjax) {
	print 'Access denied - not an AJAX request...' . ' (' . __FILE__ . ')';
	exit;
}

// required
require_once '/path/to/dacapo.php';
require_once '/path/to/jui_filter_rules.php';

// Get params
$a_rules = $_POST['a_rules'];
if(count($a_rules) == 0) {
	exit;
}
// create new datasource                                            // CONFIGURE
$db_settings = array(
	'rdbms' => 'MYSQLi',
	'db_server' => 'localhost',
	'db_user' => 'DB_USER_HERE',
	'db_passwd' => 'DB_PASS_HERE',
	'db_name' => 'DB_NAME',
	'db_port' => '3306',
	'charset' => 'utf8',
	'use_pst' => true,
	'pst_placeholder' => 'question_mark'
);
$ds = new dacapo($db_settings, null);

// print result
$jfr = new jui_filter_rules($ds);
$result = $jfr->parse_rules($a_rules);

$last_error = $jfr->get_last_error();

if(!is_null($last_error['error_message'])) {
	$result['error'] = $last_error;
}
echo json_encode($result);