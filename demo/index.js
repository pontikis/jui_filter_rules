$(function() {

    var elem_dlg_rules = $("#dlg_rules");

    // theme switcher ----------------------------------------------------------
    $("#ui-theme-switcher").change(function() {
        var theme_url = $(this).val();
        $("#ui-theme").attr("href", theme_url);
    });

    // demo_rules1 -------------------------------------------------------------
    $("#demo_rules1").jui_filter_rules({

        filters: [
            {
                filterName: "Lastname", "filterType": "text", field: "lastname", filterLabel: "Last name",
                use_operators: [],
                interface: [
                    {element: "input", type: "text", className: "test1"}
                ],
                interface_in: [
                    {element: "input", type: "checkbox", option: "lbl1", value: 1},
                    {element: "input", type: "checkbox", option: "lbl2", value: 2},
                    {element: "input", type: "checkbox", option: "lbl3", value: 3}
                ],
                interface_between: [
                    {element: "input", type: "text", label: "From"},
                    {element: "input", type: "text", label: "Until"}
                ]
            },
            {
                filterName: "Firstname", "filterType": "number", field: "firstname", filterLabel: "First name",
                interface: [
                    {element: "input", type: "text"}
                ]
            }
        ],

        filter_rules: [],

        filters1: [
            {
                filterName: "Lastname", "filterType": "text", field: "lastname",
                html: [
                    {
                        element: "",
                        type: "text",
                        label: "aaa"
                    }
                ],
                widgets: [
                    {
                        type: "datepicker",
                        dateformat: "aaaa",
                        timeformat: ""
                    }
                ],
                repeat: 0, // a number or 'auto' according to values_predefined or values_ajax_url (0 = no repeat)
                values_predefined: [
                    {
                        option: "aaaa",
                        value: ""
                    }
                ],
                values_ajax_url: ""
            }
        ],

        filter_rules1: [
            {filterName: "Lastname", operator: "", value: []},
            {filterName: "Lastname", operator: "", value: []},
            {filterName: "Firstname", operator: "", value: []}
        ]

    });


    elem_dlg_rules.dialog({
        autoOpen: false,
        width: 250,
        height: 200,
        position: {
            my: "left",
            at: "right",
            of: '#demo_rules1'
        },
        title: "Rules",
        open: function() {
            createrules(elem_dlg_rules)
        }
    });

    $("#show_rules").click(function() {
        elem_dlg_rules.dialog("open");
        return false;
    });



});

function createrules(elem_dlg_rules) {
    elem_dlg_rules.html('<p>Hello world!');
}