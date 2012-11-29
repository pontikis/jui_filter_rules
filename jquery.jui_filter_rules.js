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
            {type: "between", accept_values: "yes", apply_to: ["number", "date"], start_a_group: "yes"},
            {type: "not_between", accept_values: "yes", apply_to: ["number", "date"], start_a_group: "no"},
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
                //validate_input(container_id);

                // bind events
                //elem.unbind("onCustomEvent1").bind("onCustomEvent1", settings.onCustomEvent1);

                var filters = settings.filters,
                    filter_rules = settings.filter_rules,
                    rule_li_id_prefix = create_id(elem.jui_filter_rules("getOption", "rule_li_id_prefix"), container_id) + '_',
                    filters_list_id_prefix = create_id(elem.jui_filter_rules("getOption", "filters_list_id_prefix"), container_id) + '_',
                    operators_list_id_prefix = create_id(elem.jui_filter_rules("getOption", "operators_list_id_prefix"), container_id) + '_',
                    filter_value_id_prefix = create_id(elem.jui_filter_rules("getOption", "filter_value_id_prefix"), container_id) + '_',
                    tools_container_id_prefix = create_id(elem.jui_filter_rules("getOption", "tools_container_id_prefix"), container_id) + '_',
                    tools_id_prefix = create_id(elem.jui_filter_rules("getOption", "tools_id_prefix"), container_id) + '_',
                    rule_li_id, filters_list_id, operators_list_id, filter_value_id, tools_container_id,tools_id,
                    elem_rule_li, elem_filters_list, elem_operators_list, elem_filter_value, elem_tools_container,elem_tools,
                    selector, len, rule_id, filter_index;

                if(elem.data(pluginStatus)['rule_id'] == 0) {
                    if(filters.length > 0 || filter_rules.length > 0) {

                        elem.html(createRulesGroup(container_id));

                        operators_list_id = operators_list_id_prefix + '1';
                        filter_value_id = filter_value_id_prefix + '1';
                        elem_operators_list = $("#" + operators_list_id);
                        elem_filter_value = $("#" + filter_value_id);

                        elem_operators_list.html(create_operators_list(filters[0].filterType));
                        elem_filter_value.html(create_filter_value(container_id, 0, elem_operators_list.val()));
                    }
                }

                elem.addClass(settings.containerClass);

                /* EVENTS --------------------------------------------------- */
                selector = '[id^="' + rule_li_id_prefix + '"]';
                len = rule_li_id_prefix.length;
                $(selector).hover(function() {
                    rule_id = $(this).attr("id").substr(len);
                    tools_container_id = tools_container_id_prefix + rule_id;
                    elem_tools_container = $("#" + tools_container_id);
                    console.log(tools_container_id);
                    elem_tools_container.toggle();
                });


                selector = '[id^="' + tools_id_prefix + '"]';
                len = rule_li_id_prefix.length;
                $(selector).click(function() {
                    console.log(tools_id_prefix);
                    $(this).closest('li').unbind('hover');
                });

/*                selector = '[id^="' + rule_li_id_prefix + '"]';
                len = rule_li_id_prefix.length;
                $(selector).hover(
                    //mouseover
                    function() {
                        rule_id = $(this).attr("id").substr(len);
                        tools_container_id = tools_container_id_prefix + rule_id;
                        elem_tools = $("#" + tools_container_id);
                        console.log(tools_container_id);
                        elem_tools.show();
                    },

                    //mouseout
                    function() {
                        rule_id = $(this).attr("id").substr(len);
                        tools_container_id = tools_container_id_prefix + rule_id;
                        elem_tools = $("#" + tools_container_id);
                        console.log(tools_container_id);
                        elem_tools.hide();
                    }
                );*/

                // change filter
                selector = '[id^="' + filters_list_id_prefix + '"]';
                elem.off('change', selector).on('change', selector, function() {
                    len = filters_list_id_prefix.length;
                    rule_id = $(this).attr("id").substr(len);
                    filter_index = $(this).prop('selectedIndex');

                    operators_list_id = operators_list_id_prefix + rule_id;
                    filter_value_id = filter_value_id_prefix + rule_id;
                    elem_operators_list = $("#" + operators_list_id);
                    elem_filter_value = $("#" + filter_value_id);

                    elem_operators_list.html(create_operators_list(filters[filter_index].filterType));
                    elem_filter_value.html(create_filter_value(container_id, filter_index, elem_operators_list.val()));

                });

                // change operator
                selector = '[id^="' + operators_list_id_prefix + '"]';
                elem.off('change', selector).on('change', selector, function() {
                    len = operators_list_id_prefix.length;
                    rule_id = $(this).attr("id").substr(len);
                    filter_index = $(this).prop('selectedIndex');

                    filters_list_id = filters_list_id_prefix + rule_id;
                    operators_list_id = operators_list_id_prefix + rule_id;
                    filter_value_id = filter_value_id_prefix + rule_id;
                    elem_filters_list = $("#" + filters_list_id);
                    elem_operators_list = $("#" + operators_list_id);
                    elem_filter_value = $("#" + filter_value_id);

                    elem_filter_value.html(create_filter_value(container_id, elem_filters_list.prop('selectedIndex'), elem_operators_list.val()));

                });


                $("#insert").click(function() {
                    //var h = createRule(container_id);
                    //$(this).closest("li").before(h);

                    $(this).closest("li").remove();
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
                filter_rules: [],

                containerClass: "filter_rules_container",
                rulesGroupConditionContainerClass: "rules_group_condition_container",

                // styles
                rulesListClass: "rules_list",
                rulesListLiClass: "rules_list_li",

                filterContainerClass: "filter_container",
                operatorContainerClass: "operator_container",
                filterValueContainerClass: "filter_value_container",
                toolsContainerClass: "tools_container",

                filterInputTextClass: "filter_input_text",
                filterInputNumberClass: "filter_input_number",
                filterInputDateClass: "filter_input_date",

                // element id prefix
                rule_li_id_prefix: "rule_",
                filters_list_id_prefix: "filters_list_",
                operators_list_id_prefix: "oper_list_",
                filter_value_id_prefix: "filter_value_",
                tools_container_id_prefix: "tools_container_",
                tools_id_prefix: "tools_"
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
        // your code here (OPTIONAL)
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
     * Create rules group condition select (AND - OR)
     * @return {String}
     */
    var create_group_condition = function() {
        var f_html = '';
        f_html += '<select>';
        f_html += '<option value="AND">' + rsc_jui_fr.rules_group_AND + ':' + '</option>';
        f_html += '<option value="OR">' + rsc_jui_fr.rules_group_OR + ':' + '</option>';
        f_html += '</select>';
        return f_html;

    };

    /**
     * Create filters list
     * @param container_id {string}
     * @param rule_id {number}
     * @return {String}
     */
    var create_filters_list = function(container_id, rule_id) {
        var elem = $("#" + container_id),
            filters = elem.jui_filter_rules('getOption', 'filters'),
            filters_list_id_prefix = create_id(elem.jui_filter_rules("getOption", "filters_list_id_prefix"), container_id) + '_',
            filters_list_id = filters_list_id_prefix + rule_id,
            i, f_html = '';

        f_html += '<select id="' + filters_list_id + '">';
        for(i in filters) {
            f_html += '<option value="' + filters[i].filterName + '">' + filters[i].filterLabel + '</option>';
        }
        f_html += '</select>';

        return f_html;

    };

    /**
     * Create operator list
     * @param filter_type {String}
     * @return {String}
     */
    var create_operators_list = function(filter_type) {
        var oper = {}, i, len, oper_html = '';

        oper = getOperators(filter_type);
        len = oper.length;

        for(i in oper) {
            if(oper[i].start_a_group == "yes") {
                oper_html += '<optgroup label="&raquo;" class="operator_list_option_group">';
            }
            oper_html += '<option value="' + oper[i].operator_type + '"' + ' class="operator_list_option"' + '>' + oper[i].operator_label + '</option>';
            if(i < len - 1 && oper[parseInt(i) + 1].start_a_group == "yes") {
                oper_html += '</optgroup>';
            }
        }
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
                for(i in filters[filter_index].interface) {
                    filter_element = filters[filter_index].interface[i].element;
                    if(filter_element == "input") {
                        class_name = elem.jui_filter_rules('getOption', 'filterInputTextClass');
                        if(filters[filter_index].interface[i].hasOwnProperty("class")) {
                            class_name = filters[filter_index].interface[i].class;
                            if(class_name == "") {
                                class_name = elem.jui_filter_rules('getOption', 'filterInputTextClass');
                            }
                        }
                        class_html = ' class="' + class_name + '"';
                        f_html += '<input type="' + filters[filter_index].interface[i].type + '"' + class_html + '>';
                    }
                }
            }

        }

        if(filter_type == "number") {
            if(operator.accept_values == "yes") {
                for(i in filters[filter_index].interface) {
                    filter_element = filters[filter_index].interface[i].element;
                    if(filter_element == "input") {
                        class_name = elem.jui_filter_rules('getOption', 'filterInputNumberClass');
                        if(filters[filter_index].interface[i].hasOwnProperty("class")) {
                            class_name = filters[filter_index].interface[i].class;
                            if(class_name == "") {
                                class_name = elem.jui_filter_rules('getOption', 'filterInputNumberClass');
                            }
                        }
                        class_html = ' class="' + class_name + '"';
                        f_html += '<input type="' + filters[filter_index].interface[i].type + '"' + class_html + '>';
                    }
                }
            }

        }

        return f_html;

    };


    /**
     * Get operators for filter type
     * @param filter_type {string}
     * @return {Array}
     */
    var getOperators = function(filter_type) {
        var i, oper = [], item = {};
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
     * @return {*}
     */
    var getOperator = function(operator_type) {
        var i, oper;
        for(i in operators) {
            if(operators[i].type == operator_type) {
                oper = operators[i];
                break;
            }
        }
        return oper;
    };


    /**
     * Create rule tools dropdown list
     * @param container_id {string}
     * @param rule_id {number}
     * @return {String}
     */
    var create_tools = function(container_id, rule_id) {
        var elem = $("#" + container_id),
            toolsContainerClass = elem.jui_filter_rules("getOption", "toolsContainerClass"),
            tools_id_prefix = create_id(elem.jui_filter_rules("getOption", "tools_id_prefix"), container_id) + '_',
            tools_container_id_prefix = create_id(elem.jui_filter_rules("getOption", "tools_container_id_prefix"), container_id) + '_',
            tools_container_id = tools_container_id_prefix + rule_id,
            tools_id = tools_id_prefix + rule_id,
            tools_html = '';

        tools_html += '<div id="' + tools_container_id + '" class="' + toolsContainerClass + '">';
        tools_html += '<select id="' + tools_id + '">';

        tools_html += '<option value="please_select">' + rsc_jui_fr.tools_please_select + '</option>';

        tools_html += '<optgroup label="' + rsc_jui_fr.rule + '">';
        tools_html += '<option value="rule_insert_before">' + rsc_jui_fr.rule_insert_before + '</option>';
        tools_html += '<option value="rule_insert_after">' + rsc_jui_fr.rule_insert_after + '</option>';
        tools_html += '<option value="rule_clear">' + rsc_jui_fr.rule_clear + '</option>';
        if(rule_id == 1) {
            tools_html += '<option value="rule_delete" disabled="disabled">' + rsc_jui_fr.rule_delete + '</option>';
        } else {
            tools_html += '<option value="rule_delete">' + rsc_jui_fr.rule_delete + '</option>';
        }

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
            rulesListClass = elem.jui_filter_rules("getOption", "rulesListClass"),
            rg_html = '';

        rg_html += '<dl>';

        rg_html += '<dd>';
        rg_html += create_group_condition();
        rg_html += '</dd>';

        rg_html += '<dd>';
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
            filterContainerClass = elem.jui_filter_rules("getOption", "filterContainerClass"),
            operatorContainerClass = elem.jui_filter_rules("getOption", "operatorContainerClass"),
            filterValueContainerClass = elem.jui_filter_rules("getOption", "filterValueContainerClass"),
            rule_li_id_prefix = create_id(elem.jui_filter_rules("getOption", "rule_li_id_prefix"), container_id) + '_',
            operators_list_id_prefix = create_id(elem.jui_filter_rules("getOption", "operators_list_id_prefix"), container_id) + '_',
            filter_value_id_prefix = create_id(elem.jui_filter_rules("getOption", "filter_value_id_prefix"), container_id) + '_',
            rule_li_id, operators_list_id, filter_value_id,
            r_html = '';

        var rule_id = parseInt(elem.data(pluginStatus)["rule_id"]) + 1;
        elem.data(pluginStatus)["rule_id"] = rule_id;
        operators_list_id = operators_list_id_prefix + rule_id;
        filter_value_id = filter_value_id_prefix + rule_id;
        rule_li_id = rule_li_id_prefix + rule_id;

        r_html += '<li id="' + rule_li_id + '" class="' + rulesListLiClass + '">';

        r_html += '<div class="' + filterContainerClass + '">';
        r_html += create_filters_list(container_id, rule_id);
        r_html += '</div>';

        r_html += '<div class="' + operatorContainerClass + '">';
        r_html += '<select id="' + operators_list_id + '"></select>';
        r_html += '</div>';

        r_html += '<div id="' + filter_value_id + '" class="' + filterValueContainerClass + '">';
        r_html += '</div>';

        r_html += create_tools(container_id, rule_id);

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