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

    var pluginName = 'jui_filter_rules';

    var filter_types = [
        "text",
        "number",
        "date"
    ];

    var operators = [
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

                var container_id = elem.attr("id");

                // simple validation
                //validate_input(container_id);

                // bind events
                //elem.unbind("onCustomEvent1").bind("onCustomEvent1", settings.onCustomEvent1);

                var i, flt_html = '',
                    filters = settings.filters,
                    filter_rules = settings.filter_rules;

                if(filters.length > 0 || filter_rules.length > 0) {
                    flt_html += '<ul>';

                    for(i in filter_rules) {
                        flt_html += '<li>';

                        flt_html += filters[i].filterLabel;

                        flt_html += '</li>';
                    }


                    flt_html += '<li>';

                    flt_html += '<div class="' + settings.filterContainerClass + '">';
                    flt_html += create_filters_list(container_id);
                    flt_html += '</div>';

                    flt_html += '<div class="' + settings.operatorContainerClass + '">';
                    flt_html += '<select id="operators_list"></select>';
                    flt_html += '</div>';

                    flt_html += '<div id="filter_value" class="' + settings.filterValueClass + '">';
                    flt_html += '</div>';


                    flt_html += '</li>';

                    flt_html += '</ul>';
                }

                elem.html(flt_html);



                $("#operators_list").html(create_operators_list(filters[0].filterType));

                $("#filter_value").html(create_filter_value(container_id, 0, $("#operators_list").val()));

                $("#filters_list").change(function() {
                    var filter_index = $(this).prop('selectedIndex');
                    $("#operators_list").html(create_operators_list(filters[filter_index].filterType));
                    $("#filter_value").html(create_filter_value(container_id, filter_index, $("#operators_list").val()));
                })

                $("#operators_list").change(function() {
                    $("#filter_value").html(create_filter_value(container_id, $("#filters_list").prop('selectedIndex'), $("#operators_list").val()));
                })


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

                filterContainerClass: "filter_container",
                operatorContainerClass: "operator_container",
                filterValueClass: "filter_value_container",

                filterInputTextClass: "filter_input_text",
                filterInputNumberClass: "filter_input_number",
                filterInputDateClass: "filter_input_date"
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


    var create_filters_list = function(container_id) {
        var elem = $("#" + container_id),
            filters = elem.jui_filter_rules('getOption', 'filters'),
            i, f_html = '';

        f_html += '<select id="filters_list">';
        for(i in filters) {
            f_html += '<option value="' + filters[i].filterName + '">' + filters[i].filterLabel + '</option>';
        }
        f_html += '</select>';

        return f_html;

    };

    var create_operators_list = function(filter_type) {
        var oper = {}, i, len, class_html = '', f_oper = '';

        oper = getOperators(filter_type);
        len = oper.length;

        for(i in oper) {
            if(oper[i].start_a_group == "yes") {
                f_oper += '<optgroup label="&raquo;" class="operator_list_option_group">';
            }
            f_oper += '<option value="' + oper[i].operator_type + '"' + ' class="operator_list_option"' + '>' + oper[i].operator_label + '</option>';
            if(i < len - 1 && oper[parseInt(i) + 1].start_a_group == "yes") {
                f_oper += '</optgroup>';
            }
        }

        return f_oper;

    };


    var create_filter_value = function(container_id, filter_index, operator_type) {
        var elem = $("#" + container_id),
            filters = elem.jui_filter_rules('getOption', 'filters'),
            operator,
            f_html = '', class_html = '', class_name,
            i, filter_type,filter_element;

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