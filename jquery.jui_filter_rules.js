/**
 * @fileOverview jui_filter_rules - Create rules to filter dataset using jquery
 *               <p>License MIT
 *               <br />Copyright 2012 Christos Pontikis <a href="http://pontikis.net">http://pontikis.net</a>
 *               <br />Project page <a href="https://github.com/pontikis/jui_filter_rules">https://github.com/pontikis/jui_filter_rules</a>
 * @version 1.00
 * @author Christos Pontikis http://pontikis.net
 * @requires jquery, jquery-ui
 */

/**
 * See <a href="http://jquery.com">http://jquery.com</a>.
 * @name $
 * @class
 * See the jQuery Library  (<a href="http://jquery.com">http://jquery.com</a>) for full details.  This just
 * documents the function and classes that are added to jQuery by this plug-in.
 */

/**
 * See <a href="http://jquery.com">http://jquery.com</a>
 * @name fn
 * @class
 * See the jQuery Library  (<a href="http://jquery.com">http://jquery.com</a>) for full details.  This just
 * documents the function and classes that are added to jQuery by this plug-in.
 * @memberOf $
 */

/**
 * Pseudo-Namespace containing private methods (for documentation purposes)
 * @name _private_methods
 * @namespace
 */
"use strict";
(function($) {

    var pluginName = 'jui_filter_rules',
        pluginStatus = 'jui_filter_rules_status',
        filter_types = [
            "text",
            "number",
            "date"
        ], operators = [
            {type: "equal", accept_values: "yes", apply_to: ["text", "number", "date"], start_a_group: "yes"},
            {type: "not_equal", accept_values: "yes", apply_to: ["text", "number", "date"], start_a_group: "no"},
            {type: "in", accept_values: "yes", apply_to: ["text", "number", "date"], start_a_group: "yes"},
            {type: "not_in", accept_values: "yes", apply_to: ["text", "number", "date"], start_a_group: "no"},
            {type: "less", accept_values: "yes", apply_to: ["number", "date"], start_a_group: "yes"},
            {type: "less_or_equal", accept_values: "yes", apply_to: ["number", "date"], start_a_group: "no"},
            {type: "greater", accept_values: "yes", apply_to: ["number", "date"], start_a_group: "no"},
            {type: "greater_or_equal", accept_values: "yes", apply_to: ["number", "date"], start_a_group: "no"},
            {type: "begins_with", accept_values: "yes", apply_to: ["text"], start_a_group: "yes"},
            {type: "not_begins_with", accept_values: "yes", apply_to: ["text"], start_a_group: "no"},
            {type: "contains", accept_values: "yes", apply_to: ["text"], start_a_group: "no"},
            {type: "not_contains", accept_values: "yes", apply_to: ["text"], start_a_group: "no"},
            {type: "ends_with", accept_values: "yes", apply_to: ["text"], start_a_group: "no"},
            {type: "not_ends_with", accept_values: "yes", apply_to: ["text"], start_a_group: "no"},
            {type: "is_empty", accept_values: "no", apply_to: ["text"], start_a_group: "yes"},
            {type: "is_not_empty", accept_values: "no", apply_to: ["text"], start_a_group: "no"},
            {type: "is_null", accept_values: "no", apply_to: ["text", "number", "date"], start_a_group: "yes"},
            {type: "is_not_null", accept_values: "no", apply_to: ["text", "number", "date"], start_a_group: "no"}
        ];


    /* public methods ------------------------------------------------------- */
    var methods = {

        /**
         * @lends $.fn.jui_filter_rules
         */
        init: function(options) {

            var elem = this;

            return this.each(function() {

                /**
                 * settings and defaults
                 * using $.extend, settings modification will affect elem.data() and vive versa
                 */
                var settings = elem.data(pluginName);
                if(typeof(settings) == 'undefined') {
                    var defaults = elem.jui_filter_rules('getDefaults');
                    settings = $.extend({}, defaults, options);
                } else {
                    settings = $.extend({}, settings, options);
                }
                elem.data(pluginName, settings);

                // initialize plugin status
                if(typeof  elem.data(pluginStatus) === 'undefined') {
                    elem.data(pluginStatus, {});
                    elem.data(pluginStatus)['rule_id'] = 0;
                }

                var container_id = elem.attr("id");

                // simple validation
                validate_input(container_id);

                // bind events
                //elem.unbind("onCustomEvent1").bind("onCustomEvent1", settings.onCustomEvent1);

                var filters = settings.filters,

                    filters_list_id_prefix = create_id(settings.filters_list_id_prefix, container_id) + '_',
                    operators_container_id_prefix = create_id(settings.operators_container_id_prefix, container_id) + '_',
                    operators_list_id_prefix = create_id(settings.operators_list_id_prefix, container_id) + '_',
                    filter_value_id_prefix = create_id(settings.filter_value_id_prefix, container_id) + '_',
                    group_tools_id_prefix = create_id(settings.group_tools_id_prefix, container_id) + '_',
                    rule_tools_id_prefix = create_id(settings.rule_tools_id_prefix, container_id) + '_',
                    filters_list_id, operators_list_id, operators_container_id, filter_value_id,
                    elem_filters_list, elem_operators_list, elem_operators_container, elem_filter_value,
                    selector, len, rule_id, filter_index, group_selected, tool_selected;

                if(elem.data(pluginStatus)['rule_id'] == 0) {
                    if(filters.length > 0) {
                        elem.html(createRulesGroup(container_id));
                    }
                }

                elem.addClass(settings.containerClass);

                /* EVENTS --------------------------------------------------- */
                // rule group actions
                selector = '[id^="' + group_tools_id_prefix + '"]';
                elem.off('change', selector).on('change', selector, function() {
                    len = group_tools_id_prefix.length;
                    rule_id = $(this).attr("id").substr(len);
                    group_selected = $(this).val();

                    switch(group_selected) {
                        case "rule_insert_before":
                            $(this).closest("dt").parent("dl").before(createRule(container_id));
                            break;
                        case "rule_insert_after":
                            $(this).closest("dt").parent("dl").after(createRule(container_id));
                            break;
                        case "rule_insert_inside":
                            $(this).closest("dt").next("dd:first").find("ul:first").prepend(createRule(container_id));
                            break;
                        case "group_insert_before":
                            $(this).closest("dl").before(createRulesGroup(container_id));
                            break;
                        case "group_insert_after":
                            $(this).closest("dl").after(createRulesGroup(container_id));
                            break;
                        case "group_insert_inside":
                            $(this).closest("dt").next("dd:first").find("ul:first").prepend(createRulesGroup(container_id));
                            break;
                        case "group_delete":
                            $(this).closest("dl").remove();
                            break;
                    }

                    $(this).prop("selectedIndex", 0);

                });

                // rule actions
                selector = '[id^="' + rule_tools_id_prefix + '"]';
                elem.off('change', selector).on('change', selector, function() {
                    len = rule_tools_id_prefix.length;
                    rule_id = $(this).attr("id").substr(len);
                    tool_selected = $(this).val();

                    switch(tool_selected) {
                        case "rule_insert_before":
                            $(this).closest("li").before(createRule(container_id));
                            break;
                        case "rule_insert_after":
                            $(this).closest("li").after(createRule(container_id));
                            break;
                        case "rule_clear":
                            filters_list_id = filters_list_id_prefix + rule_id;
                            operators_container_id = operators_container_id_prefix + rule_id;
                            filter_value_id = filter_value_id_prefix + rule_id;
                            elem_filters_list = $("#" + filters_list_id);
                            elem_operators_container = $("#" + operators_container_id);
                            elem_filter_value = $("#" + filter_value_id);

                            elem_filters_list.prop("selectedIndex", 0);
                            elem_operators_container.html('');
                            elem_filter_value.html('');
                            break;
                        case "rule_delete":
                            $(this).closest("li").remove();
                            break;
                        case "group_insert_before":
                            $(this).closest("li").before(createRulesGroup(container_id));
                            break;
                        case "group_insert_after":
                            $(this).closest("li").after(createRulesGroup(container_id));
                            break;
                    }

                    $(this).prop("selectedIndex", 0);

                });


                // change filter
                selector = '[id^="' + filters_list_id_prefix + '"]';
                elem.off('change', selector).on('change', selector, function() {
                    len = filters_list_id_prefix.length;
                    rule_id = $(this).attr("id").substr(len);
                    filter_index = $(this).prop('selectedIndex') - 1;

                    operators_container_id = operators_container_id_prefix + rule_id;
                    operators_list_id = operators_list_id_prefix + rule_id;
                    filter_value_id = filter_value_id_prefix + rule_id;
                    elem_operators_container = $("#" + operators_container_id);
                    elem_filter_value = $("#" + filter_value_id);

                    if(filter_index >= 0) {
                        elem_operators_container.html(create_operators_list(container_id, rule_id, filters[filter_index].filterType));
                        elem_operators_list = $("#" + operators_list_id);
                        elem_filter_value.html(create_filter_value(container_id, filter_index, elem_operators_list.val()));
                    } else {
                        elem_operators_container.html('');
                        elem_filter_value.html('');
                    }

                });

                // change operator
                selector = '[id^="' + operators_list_id_prefix + '"]';
                elem.off('change', selector).on('change', selector, function() {
                    len = operators_list_id_prefix.length;
                    rule_id = $(this).attr("id").substr(len);

                    filters_list_id = filters_list_id_prefix + rule_id;
                    operators_list_id = operators_list_id_prefix + rule_id;
                    filter_value_id = filter_value_id_prefix + rule_id;
                    elem_filters_list = $("#" + filters_list_id);
                    elem_operators_list = $("#" + operators_list_id);
                    elem_filter_value = $("#" + filter_value_id);

                    filter_index = elem_filters_list.prop('selectedIndex') - 1;
                    if(filter_index >= 0) {
                        elem_filter_value.html(create_filter_value(container_id, filter_index, elem_operators_list.val()));
                    } else {
                        elem_filter_value.html('');
                    }

                });


            });

        },

        /**
         * Get default values
         * @example $(element).jui_filter_rules('getDefaults');
         * @return {Object}
         */
        getDefaults: function() {
            return {
                filters: [],

                // styles
                containerClass: "filter_rules_container",

                rulesGroupContainerClass: "rules_group_container",
                rulesGroupHeaderClass: "rules_group_header",
                rulesGroupBodyClass: "rules_group_body",

                rulesGroupConditionContainerClass: "rules_group_condition_container",
                rulesGroupConditionListClass: "rules_group_condition_list",

                rulesGroupToolsContainerClass: "rules_group_tools_container",
                rulesGroupToolsListClass: "rules_group_tools_list",

                rulesListClass: "rules_list",
                rulesListLiClass: "rules_list_li",

                filterContainerClass: "filter_container",
                filterListClass: "filter_list",

                operatorsListContainerClass: "operators_list_container",
                operatorsListClass: "operators_list",

                filterValueContainerClass: "filter_value_container",
                filterInputTextClass: "filter_input_text",
                filterInputNumberClass: "filter_input_number",
                filterInputDateClass: "filter_input_date",

                ruleToolsContainerClass: "rule_tools_container",
                ruleToolsClass: "rule_tools_list",

                // elements id prefix
                group_tools_id_prefix: "group_tools_",
                rule_li_id_prefix: "rule_",
                filters_list_id_prefix: "filters_list_",
                operators_container_id_prefix: "oper_wrap_",
                operators_list_id_prefix: "oper_list_",
                filter_value_id_prefix: "filter_value_",
                rule_tools_id_prefix: "rule_tools_",

                filter_ui_property_prefix: "flt_" // useful to prevent using of javascript preserved words
            };
        },

        /**
         * Get any option set to plugin using its name (as string)
         * @example $(element).jui_filter_rules('getOption', some_option);
         * @param opt
         * @return {*}
         */
        getOption: function(opt) {
            var elem = this;
            return elem.data(pluginName)[opt];
        },

        /**
         * Get all options
         * @example $(element).jui_filter_rules('getAllOptions');
         * @return {*}
         */
        getAllOptions: function() {
            var elem = this;
            return elem.data(pluginName);
        },

        /**
         * Set option
         * @example $(element).jui_filter_rules('setOption', 'option_name',  'option_value',  reinit);
         * @param opt {string} option names
         * @param val
         * @param reinit {boolean}
         */
        setOption: function(opt, val, reinit) {
            var elem = this;
            elem.data(pluginName)[opt] = val;
            if(reinit) {
                elem.jui_filter_rules('init');
            }
        },

        /**
         * Destroy plugin
         * @example $(element).jui_filter_rules('destroy');
         * @return {*|jQuery}
         */
        destroy: function() {
            return $(this).each(function() {
                var $this = $(this);

                $this.removeData(pluginName);
            });
        },

        /**
         * Get rules
         * @example $(element).jui_filter_rules("getRules", 0, []);
         * @param rules_group_index (Number} the index of rules group
         * @param a_rules {Array} rules array
         * @return {*} {Array}
         */
        getRules: function(rules_group_index, a_rules) {
            var elem = this,
                container_id = elem.attr("id"),
                rules_group, group_logical_operator,
                a_group_rules, r, group_rule,
                current_rule, filter_name, filter_operator, current_filter,
                pos, i;

            rules_group = elem.find("dl").eq(rules_group_index);
            group_logical_operator = rules_group.find("dt:first").find("select:first").val();

            a_group_rules = rules_group.find("dd:first").find("ul:first").children().get();
            for(r in a_group_rules) {
                group_rule = a_group_rules[r];

                current_rule = {};
                if(group_rule.tagName == 'LI') {
                    // no filter set
                    if($(group_rule).find("select:first").prop("selectedIndex") == 0) {
                        continue;
                    }

                    current_rule.condition = {};

                    filter_name = $(group_rule).find("select:first").val();
                    current_filter = getFilterByName(container_id, filter_name);
                    filter_operator = $(group_rule).find("select").eq(1).val();

                    current_rule.condition.filterType = current_filter.filterType;
                    current_rule.condition.field = current_filter.field;
                    current_rule.condition.operator = filter_operator;
                    current_rule.condition.filterValue = "value";
                    current_rule.logical_operator = group_logical_operator;
                    a_rules.push(current_rule);
                } else if(group_rule.tagName == 'DL') {
                    current_rule.condition = [];
                    current_rule.logical_operator = group_logical_operator;
                    a_rules.push(current_rule);
                    pos = a_rules.length - 1;

                    rules_group_index = parseInt(rules_group_index) + 1;
                    elem.jui_filter_rules("getRules", rules_group_index, a_rules[pos].condition);

                    // cleanup empty groups
                    cleanup_empty_groups(a_rules);
                }
            }

            return a_rules;
        }
    };

    /* private methods ------------------------------------------------------ */

    /**
     * @lends _private_methods
     */

    /**
     * Validate input values
     * @param container_id
     */
    var validate_input = function(container_id) {
        var elem = $("#" + container_id),
            err_msg, i,
            filters = elem.jui_filter_rules("getOption", "filters"), filternames = [];

        // unique filter name
        for(i in filters) {
            filternames.push(filters[i].filterName);
        }
        if(array_has_duplicates(filternames)) {
            err_msg = 'Filternames are not unique...';
            elem.html('<span style="color: red;">' + 'ERROR: ' + err_msg + '</span>');
            $.error(err_msg);
        }

    };

    /**
     * Create element id
     * @param prefix
     * @param plugin_container_id
     * @return {*}
     */
    var create_id = function(prefix, plugin_container_id) {
        return prefix + plugin_container_id;
    };


    /**
     * Check array for duplicated values
     * @param arr
     * @return {Boolean}
     */
    function array_has_duplicates(arr) {

        var x = {}, len = arr.length, i;
        for (i = 0; i < len; i++) {
            if (x[arr[i]] === true) {
                return true;
            }
            x[arr[i]] = true;
        }
        return false;
    }

    /**
     * Remove empty rule groups
     * @param {Array} a_rules
     */
    var cleanup_empty_groups = function(a_rules) {
        var i, condition;
        for(i in a_rules) {
            condition = a_rules[i].condition;
            if($.isArray(condition)) {
                if(condition.length == 0) {
                    a_rules.splice(i,1);
                } else {
                    cleanup_empty_groups(condition);
                }
            }
        }

    };

    /**
     * Get filter attributes by filter name
     * @param {String} container_id
     * @param {String} filter_name
     * @return {*} filter object or undefined
     */
    var getFilterByName = function(container_id, filter_name) {
        var elem = $("#" + container_id),
            i, filters = elem.jui_filter_rules("getOption", "filters"),
            flt = undefined;

        for(i in filters) {
            if(filters[i].filterName == filter_name) {
                flt = filters[i];
                break;
            }
        }
        return flt;
    };

    /**
     * Get operators for filter type
     * @param filter_type {string}
     * @return {Array}
     */
    var getOperators = function(filter_type) {
        var i, oper = [], item;
        for(i in operators) {
            if($.inArray(filter_type, operators[i].apply_to) > -1) {
                item = {};
                item.operator_type = operators[i].type;
                item.operator_label = rsc_jui_fr['operator_' + operators[i].type];
                item.start_a_group = operators[i].start_a_group;
                oper.push(item);
            }
        }
        return oper;

    };

    /**
     * Get operator attributes
     * @param operator_type
     * @return {*} operator object or undefined
     */
    var getOperator = function(operator_type) {
        var i, oper = undefined;

        for(i in operators) {
            if(operators[i].type == operator_type) {
                oper = operators[i];
                break;
            }
        }
        return oper;
    };

    /**
     * Create rules group condition select (AND - OR)
     * @return {String}
     */
    var create_group_condition = function(container_id) {
        var elem = $("#" + container_id),
            rulesGroupConditionContainerClass = elem.jui_filter_rules('getOption', 'rulesGroupConditionContainerClass'),
            rulesGroupConditionListClass = elem.jui_filter_rules('getOption', 'rulesGroupConditionListClass'),
            gc_html = '';

        gc_html += '<div class="' + rulesGroupConditionContainerClass + '">';
        gc_html += '<select class="' + rulesGroupConditionListClass + '">';
        gc_html += '<option value="AND">' + rsc_jui_fr.rules_group_AND + ':' + '</option>';
        gc_html += '<option value="OR">' + rsc_jui_fr.rules_group_OR + ':' + '</option>';
        gc_html += '</select>';
        gc_html += '</div>';
        return gc_html;

    };

    /**
     * Cgeate rules group tools dropdown list
     * @param container_id {String}
     * @return {String}
     */
    var create_rules_group_tools = function(container_id) {
        var elem = $("#" + container_id),
            rule_id = parseInt(elem.data(pluginStatus)["rule_id"]),

            rulesGroupToolsContainerClass = elem.jui_filter_rules("getOption", "rulesGroupToolsContainerClass"),
            rulesGroupToolsListClass = elem.jui_filter_rules("getOption", "rulesGroupToolsListClass"),

            group_tools_id = create_id(elem.jui_filter_rules("getOption", "group_tools_id_prefix"), container_id) + '_' + rule_id,

            disabled_html = (rule_id == 0 ? ' disabled="disabled"' : ''),
            shrink_class_html = ($.browser.msie && parseInt($.browser.version) < 9 ? '' : ' tools_list_shrink'),
            tools_html = '';

        tools_html += '<div class="' + rulesGroupToolsContainerClass + '">';
        tools_html += '<select id="' + group_tools_id + '" class="' + rulesGroupToolsListClass + shrink_class_html + '">';

        tools_html += '<option value="please_select">' + rsc_jui_fr.tools_please_select + '</option>';

        tools_html += '<optgroup label="' + rsc_jui_fr.rule + '">';
        tools_html += '<option value="rule_insert_before"' + disabled_html + '>' + rsc_jui_fr.rule_insert_before + '</option>';
        tools_html += '<option value="rule_insert_after"' + disabled_html + '>' + rsc_jui_fr.rule_insert_after + '</option>';
        tools_html += '<option value="rule_insert_inside">' + rsc_jui_fr.rule_insert_inside + '</option>';
        tools_html += '</optgroup>';

        tools_html += '<optgroup label="' + rsc_jui_fr.group + '">';
        tools_html += '<option value="group_insert_before"' + disabled_html + '>' + rsc_jui_fr.group_insert_before + '</option>';
        tools_html += '<option value="group_insert_after"' + disabled_html + '>' + rsc_jui_fr.group_insert_after + '</option>';
        tools_html += '<option value="group_insert_inside">' + rsc_jui_fr.group_insert_inside + '</option>';
        tools_html += '<option value="group_delete"' + disabled_html + '>' + rsc_jui_fr.group_delete + '</option>';
        tools_html += '</optgroup>';

        tools_html += '</select>';
        tools_html += '</div>';

        return tools_html;
    };

    /**
     * Create filters list
     * @param container_id {string}
     * @return {String} filter list html
     */
    var create_filters_list = function(container_id) {
        var elem = $("#" + container_id),
            rule_id = parseInt(elem.data(pluginStatus)["rule_id"]),
            filters = elem.jui_filter_rules('getOption', 'filters'),
            filterContainerClass = elem.jui_filter_rules("getOption", "filterContainerClass"),
            filterListClass = elem.jui_filter_rules("getOption", "filterListClass"),
            filters_list_id = create_id(elem.jui_filter_rules("getOption", "filters_list_id_prefix"), container_id) + '_' + rule_id,
            i, f_html = '';

        f_html += '<div class="' + filterContainerClass + '">';
        f_html += '<select id="' + filters_list_id + '" class="' + filterListClass + '">';
        f_html += '<option value="no_filter">' + rsc_jui_fr.filter_please_select + '</option>';
        for(i in filters) {
            f_html += '<option value="' + filters[i].filterName + '">' + filters[i].filterLabel + '</option>';
        }
        f_html += '</select>';
        f_html += '</div>';

        return f_html;

    };

    /**
     * Create operator list
     * @param filter_type {String}
     * @return {String}
     */
    var create_operators_list = function(container_id, rule_id, filter_type) {
        var elem = $("#" + container_id),
            operatorsListClass = elem.jui_filter_rules("getOption", "operatorsListClass"),
            operators_list_id_prefix = create_id(elem.jui_filter_rules("getOption", "operators_list_id_prefix"), container_id) + '_',
            operators_list_id = operators_list_id_prefix + rule_id,
            oper, i, len, oper_html = '';

        oper = getOperators(filter_type);
        len = oper.length;

        oper_html += '<select id="' + operators_list_id + '" class="' + operatorsListClass + '">';
        for(i in oper) {
            if(oper[i].start_a_group == "yes") {
                oper_html += '<optgroup label="&raquo;">';
            }
            oper_html += '<option value="' + oper[i].operator_type + '"' + '>' + oper[i].operator_label + '</option>';
            if(i < len - 1 && oper[parseInt(i) + 1].start_a_group == "yes") {
                oper_html += '</optgroup>';
            }
        }
        oper_html += '</select>';

        return oper_html;
    };


    /**
     * Create inputs or widgets for the user to set filter values
     * @param container_id
     * @param filter_index
     * @param operator_type
     * @return {String}
     */
    var create_filter_value = function(container_id, filter_index, operator_type) {
        var elem = $("#" + container_id),
            filters = elem.jui_filter_rules('getOption', 'filters'),
            operator,
            f_html = '', class_html = '', class_name,
            i, filter_type, filter_element;

        filter_type = filters[filter_index].filterType;

        operator = getOperator(operator_type);

        if(filter_type == "text") {
            if(operator.accept_values == "yes") {
                for(i in filters[filter_index].interface_common) {
                    filter_element = filters[filter_index].interface_common[i].element;
                    if(filter_element == "input") {
                        class_name = elem.jui_filter_rules('getOption', 'filterInputTextClass');
                        if(filters[filter_index].interface_common[i].className !== undefined) {
                            class_name = filters[filter_index].interface_common[i].className;
                            if(class_name == "") {
                                class_name = elem.jui_filter_rules('getOption', 'filterInputTextClass');
                            }
                        }
                        class_html = ' class="' + class_name + '"';
                        f_html += '<input type="' + filters[filter_index].interface_common[i].type + '"' + class_html + '>';
                    }
                }
            }
        }

        if(filter_type == "number") {
            if(operator.accept_values == "yes") {
                for(i in filters[filter_index].interface_common) {
                    filter_element = filters[filter_index].interface_common[i].element;
                    if(filter_element == "input") {
                        class_name = elem.jui_filter_rules('getOption', 'filterInputNumberClass');
                        if(filters[filter_index].interface_common[i].className !== undefined) {
                            class_name = filters[filter_index].interface_common[i].class;
                            if(class_name == "") {
                                class_name = elem.jui_filter_rules('getOption', 'filterInputNumberClass');
                            }
                        }
                        class_html = ' class="' + class_name + '"';
                        f_html += '<input type="' + filters[filter_index].interface_common[i].type + '"' + class_html + '>';
                    }
                }
            }
        }

        if(filter_type == "date") {
            if(operator.accept_values == "yes") {
                for(i in filters[filter_index].interface_common) {
                    filter_element = filters[filter_index].interface_common[i].element;
                    if(filter_element == "input") {
                        class_name = elem.jui_filter_rules('getOption', 'filterInputDateClass');
                        if(filters[filter_index].interface_common[i].className !== undefined) {
                            class_name = filters[filter_index].interface_common[i].class;
                            if(class_name == "") {
                                class_name = elem.jui_filter_rules('getOption', 'filterInputDateClass');
                            }
                        }
                        class_html = ' class="' + class_name + '"';
                        f_html += '<input type="' + filters[filter_index].interface_common[i].type + '"' + class_html + '>';
                    }
                }
            }
        }

        return f_html;

    };

    /**
     * Create rule tools dropdown list
     * @param container_id {string}
     * @return {String}
     */
    var create_rule_tools = function(container_id) {
        var elem = $("#" + container_id),
            rule_id = parseInt(elem.data(pluginStatus)["rule_id"]),

            ruleToolsContainerClass = elem.jui_filter_rules("getOption", "ruleToolsContainerClass"),
            ruleToolsClass = elem.jui_filter_rules("getOption", "ruleToolsClass"),

            rule_tools_id = create_id(elem.jui_filter_rules("getOption", "rule_tools_id_prefix"), container_id) + '_' + rule_id,

            shrink_class_html = ($.browser.msie && parseInt($.browser.version) < 9 ? '' : ' tools_list_shrink'),
            tools_html = '';

        tools_html += '<div class="' + ruleToolsContainerClass + '">';
        tools_html += '<select id="' + rule_tools_id + '" class="' + ruleToolsClass + shrink_class_html + '">';

        tools_html += '<option value="please_select">' + rsc_jui_fr.tools_please_select + '</option>';

        tools_html += '<optgroup label="' + rsc_jui_fr.rule + '">';
        tools_html += '<option value="rule_insert_before">' + rsc_jui_fr.rule_insert_before + '</option>';
        tools_html += '<option value="rule_insert_after">' + rsc_jui_fr.rule_insert_after + '</option>';
        tools_html += '<option value="rule_clear">' + rsc_jui_fr.rule_clear + '</option>';
        tools_html += '<option value="rule_delete">' + rsc_jui_fr.rule_delete + '</option>';
        tools_html += '</optgroup>';

        tools_html += '<optgroup label="' + rsc_jui_fr.group + '">';
        tools_html += '<option value="group_insert_before">' + rsc_jui_fr.group_insert_before + '</option>';
        tools_html += '<option value="group_insert_after">' + rsc_jui_fr.group_insert_after + '</option>';
        tools_html += '</optgroup>';

        tools_html += '</select>';
        tools_html += '</div>';

        return tools_html;
    };


    /**
     * Create a group of rules (with the first rule)
     * @param container_id
     * @return {String}
     */
    var createRulesGroup = function(container_id) {
        var elem = $("#" + container_id),
            rulesGroupContainerClass = elem.jui_filter_rules("getOption", "rulesGroupContainerClass"),
            rulesGroupHeaderClass = elem.jui_filter_rules("getOption", "rulesGroupHeaderClass"),
            rulesGroupBodyClass = elem.jui_filter_rules("getOption", "rulesGroupBodyClass"),
            rulesListClass = elem.jui_filter_rules("getOption", "rulesListClass"),
            rg_html = '';

        rg_html += '<dl class="' + rulesGroupContainerClass + '">';

        rg_html += '<dt class="' + rulesGroupHeaderClass + '">';
        rg_html += create_group_condition(container_id);
        rg_html += create_rules_group_tools(container_id);
        rg_html += '</dt>';

        rg_html += '<dd class="' + rulesGroupBodyClass + '">';
        rg_html += '<ul class="' + rulesListClass + '">';
        rg_html += createRule(container_id);
        rg_html += '</ul>';
        rg_html += '</dd>';

        rg_html += '</dl>';

        return rg_html;

    };

    /**
     * Create rule
     * @param container_id {String}
     * @return {String}
     */
    var createRule = function(container_id) {
        var elem = $("#" + container_id),
            rulesListLiClass = elem.jui_filter_rules("getOption", "rulesListLiClass"),
            operatorsListContainerClass = elem.jui_filter_rules("getOption", "operatorsListContainerClass"),
            filterValueContainerClass = elem.jui_filter_rules("getOption", "filterValueContainerClass"),
            rule_li_id_prefix = create_id(elem.jui_filter_rules("getOption", "rule_li_id_prefix"), container_id) + '_',
            operators_container_id_prefix = create_id(elem.jui_filter_rules("getOption", "operators_container_id_prefix"), container_id) + '_',
            filter_value_id_prefix = create_id(elem.jui_filter_rules("getOption", "filter_value_id_prefix"), container_id) + '_',
            rule_li_id, operators_container_id, filter_value_id,
            r_html = '';

        var rule_id = parseInt(elem.data(pluginStatus)["rule_id"]) + 1;
        elem.data(pluginStatus)["rule_id"] = rule_id;

        operators_container_id = operators_container_id_prefix + rule_id;
        filter_value_id = filter_value_id_prefix + rule_id;
        rule_li_id = rule_li_id_prefix + rule_id;

        r_html += '<li id="' + rule_li_id + '" class="' + rulesListLiClass + '">';

        r_html += create_filters_list(container_id);

        r_html += '<div id="' + operators_container_id + '" class="' + operatorsListContainerClass + '">';
        r_html += '</div>';

        r_html += '<div id="' + filter_value_id + '" class="' + filterValueContainerClass + '">';
        r_html += '</div>';

        r_html += create_rule_tools(container_id);

        r_html += '</li>';

        return r_html;

    };


    /**
     * jui_filter_rules - Create rules to filter dataset using jquery.
     *
     * @class jui_filter_rules
     * @memberOf $.fn
     */
    $.fn.jui_filter_rules = function(method) {

        // OPTIONAL
        if(this.size() != 1) {
            var err_msg = 'You must use this plugin (' + pluginName + ') with a unique element (at once)';
            this.html('<span style="color: red;">' + 'ERROR: ' + err_msg + '</span>');
            $.error(err_msg);
        }

        // Method calling logic
        if(methods[method]) {
            return methods[ method ].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if(typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.' + pluginName);
        }

    };

})(jQuery);