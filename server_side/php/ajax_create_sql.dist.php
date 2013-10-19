<?php
/**
 * ajax_create_sql.dist.php, jui_filter_rules ajax creating sql template script
 *
 * Sample php file creating sql from given rules
 * MYSQLi is used for RDBMS (one of "MYSQLi", "MYSQL_PDO", "MYSQL", "ADODB", "POSTGRES")
 *
 * @version 1.0.3 (19 Oct 2013)
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

// Get params
$a_rules = $_POST['a_rules'];
$use_ps = ($_POST['use_ps'] == "yes" ? true : false);
$pst_placeholder = $_POST['pst_placeholder'];

if(count($a_rules) == 0) {
	exit;
}

// required
require_once '/path/to/jui_filter_rules.php';                       // CONFIGURE

// configuration
define("RDBMS", "MYSQLi");                                          // CONFIGURE

// connect to database                                              // CONFIGURE
$conn = new mysqli('db_server', 'db_user', 'db_passwd', 'db_name');
if ($conn->connect_error) {
	echo 'Database connection failed: '  . $conn->connect_error;
	exit;
}
$conn->set_charset('utf8');

// print result
$jfr = new jui_filter_rules($conn, $use_ps, $pst_placeholder, RDBMS);
$result = $jfr->parse_rules($a_rules);

$last_error = $jfr->get_last_error();

if(!is_null($last_error['error_message'])) {
	$result['error'] = $last_error;
}

echo json_encode($result);
?>