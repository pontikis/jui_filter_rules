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
                validate_input(container_id);

                // bind events
                //elem.unbind("onCustomEvent1").bind("onCustomEvent1", settings.onCustomEvent1);


            });

        },

        /**
         * Get default values
         * @example $(element).jui_filter_rules('getDefaults');
         * @return {Object}
         */
        getDefaults: function() {
            return {
                opt1: 1,
                opt2: 'opt2_value'
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