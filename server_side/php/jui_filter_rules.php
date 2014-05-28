<?php
/**
 * jui_filter_rules, helper class for jquery.jui_filter_rules plugin, handles AJAX requests.
 *
 * Da Capo database wrapper is required https://github.com/pontikis/dacapo
 *
 * @version 1.0.5 (27 May 2014)
 * @author Christos Pontikis http://www.pontikis.net
 * @license http://opensource.org/licenses/MIT MIT License
 **/
class jui_filter_rules {

	/** @var bool Use prepared statements or not */
	private $usePreparedStatements;
	/** @var string Prepared statements placeholder type ('question_mark' or 'numbered') */
	private $pst_placeholder;
	/** @var string RDBMS in use (one of 'MYSQLi', 'POSTGRES') */
	private $rdbms;
	/**
	 * @var array last_error
	 *
	 * array(
	 *    'element_rule_id' => 'the id of rule li element',
	 *    'error_message' => 'error message'
	 * )
	 *
	 */
	private $last_error;

	/**
	 * @param dacapo $ds
	 */
	public function __construct(dacapo $ds) {
		$this->ds = $ds;
		$this->usePreparedStatements = $ds->use_pst;
		$this->pst_placeholder = $ds->pst_placeholder;
		$this->last_error = array(
			'element_rule_id' => null,
			'error_message' => null
		);
	}

	/**
	 * @return array
	 */
	public function get_last_error() {
		return $this->last_error;
	}

	/**
	 * Parse rules array from given JSON object and returns WHERE SQL clause and bind params array (used on prepared statements).
	 * Recursion is used.
	 *
	 * @param array $a_rules The rules array
	 * @param bool $is_group If current rule belogns to group (except first group)
	 * @return array
	 */
	public function parse_rules($a_rules, $is_group = false) {
		static $sql;
		static $bind_params = array();
		static $bind_param_index = 1;

		// WHERE clause
		if(is_null($sql)) {
			$sql = 'WHERE ';
		}
		$a_len = count($a_rules);

		foreach($a_rules as $i => $rule) {
			if(!isset($rule['condition'][0])) {
				$sql .= PHP_EOL;

				// parentheses
				$sql .= ($is_group && $i == 0 ? '(' : '');

				// condition
				$sql .= $rule['condition']['field'];

				// operator
				$sql .= $this->create_operator_sql($rule['condition']['operator']);

				// filter value
				$filter_value_conversion_server_side = array_key_exists('filter_value_conversion_server_side', $rule) ? $rule['filter_value_conversion_server_side'] : null;
				$filter_value = array_key_exists('filterValue', $rule['condition']) ? $rule['condition']['filterValue'] : null;
				$filter_type = array_key_exists('filterType', $rule['condition']) ? $rule['condition']['filterType'] : null;
				$number_type = array_key_exists('numberType', $rule['condition']) ? $rule['condition']['numberType'] : null;

				$filter_value_sql = $this->create_filter_value_sql($rule['condition']['filterType'],
					$rule['condition']['operator'],
					$filter_value,
					$filter_value_conversion_server_side,
					array_key_exists('element_rule_id', $rule) ? $rule['element_rule_id'] : 'element_rule_id: not given');

				if($this->usePreparedStatements) {

					if(!in_array($rule['condition']['operator'], array('is_null', 'is_not_null'))) {

						if(in_array($rule['condition']['operator'], array('in', 'not_in'))) {
							$sql .= '(';
							$filter_value_len = count($filter_value);
							for($v = 0; $v < $filter_value_len; $v++) {
								switch($this->pst_placeholder) {
									case 'question_mark':
										$sql .= '?';
										break;
									case 'numbered':
										$sql .= '$' . $bind_param_index;
										$bind_param_index++;
								}
								if($v < $filter_value_len - 1) {
									$sql .= ',';
								}

								// set param type
								$bind_param = $this->set_bind_param_type($filter_value[$v], $filter_type, $number_type);
								array_push($bind_params, $bind_param);
							}
							$sql .= ')';
						} else {
							switch($this->pst_placeholder) {
								case 'question_mark':
									$sql .= '?';
									break;
								case 'numbered':
									$sql .= '$' . $bind_param_index;
									$bind_param_index++;
							}

							if(in_array($rule['condition']['operator'], array('is_empty', 'is_not_empty'))) {
								array_push($bind_params, '');
							} else {
								// set param type
								$bind_param = $this->set_bind_param_type($filter_value_sql, $filter_type, $number_type);
								array_push($bind_params, $bind_param);
							}

						}

					}

				} else {

					if(!in_array($rule['condition']['operator'], array('is_null', 'is_not_null'))) {

						if(in_array($rule['condition']['operator'], array('is_empty', 'is_not_empty'))) {
							$sql .= "''";
						} else {
							$sql .= $filter_value_sql;
						}

					}
				}

			} else {
				$this->parse_rules($rule['condition'], true);
			}

			// logical operator (between rules)
			$sql .= ($i < $a_len - 1 ? ' ' . $rule['logical_operator'] : '');

			// parentheses
			$sql .= ($is_group && $i == $a_len - 1 ? ')' : '');
		}
		return array('sql' => $sql, 'bind_params' => $bind_params);
	}


	/**
	 * Set bind_param type
	 *
	 * @param $bind_param
	 * @param $filter_type
	 * @param $number_type
	 * @return mixed
	 */
	private function set_bind_param_type($bind_param, $filter_type, $number_type) {
		if($filter_type == 'number') {
			if($number_type == 'integer') {
				settype($bind_param, 'int');
			} else {
				settype($bind_param, 'float');
			}
		} else {
			settype($bind_param, 'string');
		}
		return $bind_param;
	}


	/**
	 * Return current rule filter value as a string suitable for SQL WHERE clause
	 *
	 * @param string $filter_type (one of 'text', 'number', 'date' - see documentation)
	 * @param string $operator_type (see documentation for available operators)
	 * @param array|null $a_values the values array
	 * @param array|null $filter_value_conversion_server_side
	 * @param string $element_rule_id
	 * @return string|null
	 */
	private function create_filter_value_sql($filter_type, $operator_type, $a_values, $filter_value_conversion_server_side, $element_rule_id) {

		$ds = $this->ds;
		$res = '';

		if(in_array($operator_type, array('is_empty', 'is_not_empty', 'is_null', 'is_not_null'))) {
			return null;
		}

		// apply filter value conversion (if any)
		$vlen = count($a_values);
		if(is_array($filter_value_conversion_server_side)) {
			$function_name = $filter_value_conversion_server_side['function_name'];
			$args = $filter_value_conversion_server_side['args'];
			$arg_len = count($args);

			for($i = 0; $i < $vlen; $i++) {
				// create arguments values for this filter value
				$conversion_args = array();
				for($a = 0; $a < $arg_len; $a++) {
					if(array_key_exists('filter_value', $args[$a])) {
						array_push($conversion_args, $a_values[$i]);
					}
					if(array_key_exists('value', $args[$a])) {
						array_push($conversion_args, $args[$a]['value']);
					}
				}
				// execute user function and assign return value to filter value
				try {
					$a_values[$i] = call_user_func_array($function_name, $conversion_args);
				} catch(Exception $e) {
					$this->last_error = array(
						'element_rule_id' => $element_rule_id,
						'error_message' => $e->getMessage()
					);
					break;
				}
			}
		}

		if($this->usePreparedStatements) {
			if(in_array($operator_type, array('equal', 'not_equal', 'less', 'not_equal', 'less_or_equal', 'greater', 'greater_or_equal'))) {
				$res = $a_values[0];
			} else if(in_array($operator_type, array('begins_with', 'not_begins_with'))) {
				$res = $a_values[0] . '%';
			} else if(in_array($operator_type, array('contains', 'not_contains'))) {
				$res = '%' . $a_values[0] . '%';
			} else if(in_array($operator_type, array('ends_with', 'not_ends_with'))) {
				$res = '%' . $a_values[0];
			} else if(in_array($operator_type, array('in', 'not_in'))) {
				for($i = 0; $i < $vlen; $i++) {
					$res .= ($i == 0 ? '(' : '');
					$res .= $a_values[$i];
					$res .= ($i < $vlen - 1 ? ',' : ')');
				}
			}
		} else {
			if(in_array($operator_type, array('equal', 'not_equal', 'less', 'not_equal', 'less_or_equal', 'greater', 'greater_or_equal'))) {
				$res = ($filter_type == 'number' ? $a_values[0] : $ds->qstr($a_values[0]));
			} else if(in_array($operator_type, array('begins_with', 'not_begins_with'))) {
				$res = $ds->qstr($a_values[0] . '%');
			} else if(in_array($operator_type, array('contains', 'not_contains'))) {
				$res = $ds->qstr('%' . $a_values[0] . '%');
			} else if(in_array($operator_type, array('ends_with', 'not_ends_with'))) {
				$res = $ds->qstr('%' . $a_values[0]);
			} else if(in_array($operator_type, array('in', 'not_in'))) {
				for($i = 0; $i < $vlen; $i++) {
					$res .= ($i == 0 ? '(' : '');
					$res .= ($filter_type == 'number' ? $a_values[$i] : $ds->qstr($a_values[$i]));
					$res .= ($i < $vlen - 1 ? ',' : ')');
				}
			}
		}
		return $res;
	}

	/**
	 * Create rule operator SQL substring
	 *
	 * @param string $operator_type
	 * @return string
	 */
	private function create_operator_sql($operator_type) {
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

}