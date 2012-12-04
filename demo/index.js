$(function() {

    var elem_dlg_rules = $("#dlg_rules");
    var elem_dlg_sql = $("#dlg_sql");

    // theme switcher ----------------------------------------------------------
    $("#ui-theme-switcher").change(function() {
        var theme_url = $(this).val();
        $("#ui-theme").attr("href", theme_url);
    });

    // demo_rules1 -------------------------------------------------------------
    $("#demo_rules1").jui_filter_rules({


        test_filters: [
            {
                filterName: "Lastname", "filterType": "text", field: "lastname", filterLabel: "Last name",
                exclude_operators: ["in","not_in"],
                filter_interface: [
                    {
                        operators: [],
                        filter_html: {
                            filter_element: "input", filter_element_prop: {flt_type: "text", flt_class: "test1"},
                            filter_element_repeat: false,
                            predefined_values: [],
                            predefined_values_ajax_url: "",
                            filter_widget: "foo", filter_widget_prop: {flt_type: "text", flt_class: "test1"}
                        }
                    },
                    {
                        operators: ["in","not_in"],
                        hhh: {flt_element: "input", type: "text", className: "test1"}
                    }
                ]
            }
        ],


        filters: [
            {
                filterName: "Lastname", "filterType": "text", field: "lastname", filterLabel: "Last name",
                excluded_operators: ["in","not_in"],
                interface_common: [
                    {element: "input", type: "text", className: ""}
                ],
                interface_in: [
                    {element: "input", type: "checkbox", option: "lbl1", value: 1},
                    {element: "input", type: "checkbox", option: "lbl2", value: 2},
                    {element: "input", type: "checkbox", option: "lbl3", value: 3}
                ]
            },
            {
                filterName: "AgeInYears", "filterType": "number", field: "age", filterLabel: "Age (years)",
                interface_common: [
                    {element: "input", type: "text"}
                ]
            },
            {
                filterName: "DateInserted", "filterType": "date", field: "date_inserted", filterLabel: "Date inserted",
                excluded_operators: ["in","not_in"],
                interface_common: [
                    {element: "input", type: "text"}
                ]
            }
        ],

        containerClass: "rules1_container"

    });

    elem_dlg_rules.dialog({
        autoOpen: false,
        width: 650,
        height: 250,
        position: {
            my: "top",
            at: "top",
            of: '#demo_rules1'
        },
        title: "Rules",
        open: function() {
            elem_dlg_rules.html('<pre>' + JSON.stringify($("#demo_rules1").jui_filter_rules("getRules", 0, []), null, '    ') + '</pre>');
        }
    });

    elem_dlg_sql.dialog({
        autoOpen: false,
        width: 650,
        height: 250,
        position: {
            my: "top",
            at: "top",
            of: '#demo_rules1'
        },
        title: "SQL",
        open: function() {
            var a_rules = $("#demo_rules1").jui_filter_rules("getRules", 0, []);

            $.ajax({
                type: 'POST',
                url: "ajax/ajax_create_sql.php",
                data: {
                    a_rules: a_rules
                },
                success: function(data) {
                    elem_dlg_sql.html('<pre>' + data + '</pre>');
                }
            });

        }
    });


    $("#show_rules").click(function() {
        elem_dlg_rules.dialog("open");
        return false;
    });

    $("#create_sql_php").click(function() {
        elem_dlg_sql.dialog("open");
        return false;
    });


});
