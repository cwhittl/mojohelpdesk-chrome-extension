function CB_Mojo_Extension(afterLoadFunction) {
    cb_mojo_ext = this; //Helps keep the confusion down in the functions
    cb_mojo_ext.api_key = "";
    cb_mojo_ext.debug_mode = false;
    cb_mojo_ext.use_custom_fields = true;
    cb_mojo_ext.mojo_domain = "";
    cb_mojo_ext.custom_fields_json = {
        "custom_field_sub_category": {
            "pretty_name": "Sub Category",
            "dependent_to": "ticket_type_id",
            "field_type": "select",
            "options": {
                "66168": [{
                    key: "enhancement request/feedback",
                    value: "Enhancement Request/feedback"
                }, {
                    key: "how to/training issue",
                    value: "How To/training Issue"
                }, {
                    key: "issue",
                    value: "Issue"
                }, {
                    key: "user error",
                    value: "User Error"
                }],
                "66169": [{
                    key: "application issue or failure",
                    value: "Application Issue or Failure"
                }, {
                    key: "hardware issue or failure",
                    value: "Hardware Issue or Failure"
                }, {
                    key: "network issue or failure",
                    value: "Network Issue or Failure"
                }],
                "66170": [{
                    key: "bug",
                    value: "Bug"
                }, {
                    key: "duplicate",
                    value: "Duplicate"
                }, {
                    key: "known error",
                    value: "Known Error"
                }],
                "66171": [{
                    key: "account/identity management task",
                    value: "Account/identity Management Task"
                }, {
                    key: "enhancement task",
                    value: "Enhancement Task"
                }, {
                    key: "support/training task",
                    value: "Support/training Task"
                }]
            }
        }
    };
    cb_mojo_ext.email_address = "";
    cb_mojo_ext.mojo_agent_id = "";
    cb_mojo_ext.optionsUrl = chrome.extension.getURL("options/options.html");
    cb_mojo_ext.automated_avatar_url = chrome.extension.getURL("icons/optimus.gif");
    cb_mojo_ext.default_user_avatar_url = chrome.extension.getURL("icons/default_user.png");
    cb_mojo_ext.title_selector = "";
    cb_mojo_ext.ticket_id = "";
    cb_mojo_ext.queues = [];
    cb_mojo_ext.ticket_options = [{
        key: 66169,
        value: "Incident"
    }, {
        key: 66170,
        value: "Problem"
    }, {
        key: 66168,
        value: "Question"
    }, {
        key: 66171,
        value: "Task"
    }];
    cb_mojo_ext.status_options = [{
        key: 10,
        value: "new"
    }, {
        key: 20,
        value: "in progress"
    }, {
        key: 40,
        value: "information requested"
    }, {
        key: 50,
        value: "solved"
    }, {
        key: 30,
        value: "on hold"
    }, {
        key: 60,
        value: "closed"
    }];
    chrome.storage.sync.get({
        api_key: '',
        debug_mode: false,
        mojo_domain: '',
        custom_fields_json: {
            "custom_field_sub_category": {
                "pretty_name": "Sub Category",
                "dependent_to": "ticket_type_id",
                "field_type": "select",
                "options": {
                    "66168": [{
                        key: "enhancement request/feedback",
                        value: "Enhancement Request/feedback"
                    }, {
                        key: "how to/training issue",
                        value: "How To/training Issue"
                    }, {
                        key: "issue",
                        value: "Issue"
                    }, {
                        key: "user error",
                        value: "User Error"
                    }],
                    "66169": [{
                        key: "application issue or failure",
                        value: "Application Issue or Failure"
                    }, {
                        key: "hardware issue or failure",
                        value: "Hardware Issue or Failure"
                    }, {
                        key: "network issue or failure",
                        value: "Network Issue or Failure"
                    }],
                    "66170": [{
                        key: "bug",
                        value: "Bug"
                    }, {
                        key: "duplicate",
                        value: "Duplicate"
                    }, {
                        key: "known error",
                        value: "Known Error"
                    }],
                    "66171": [{
                        key: "account/identity management task",
                        value: "Account/identity Management Task"
                    }, {
                        key: "enhancement task",
                        value: "Enhancement Task"
                    }, {
                        key: "support/training task",
                        value: "Support/training Task"
                    }]
                }
            }
        },
        email_address: "",
        mojo_agent_id: "",
        use_custom_fields: true,
        title_selector: "[* Helpdesk]\\(#(.*)\\)"
    }, function(items) {
        cb_mojo_ext.api_key = items.api_key;
        cb_mojo_ext.debug_mode = items.debug_mode;
        cb_mojo_ext.mojo_domain = items.mojo_domain;
        cb_mojo_ext.email_address = items.email_address;
        cb_mojo_ext.mojo_agent_id = items.mojo_agent_id;
        cb_mojo_ext.custom_fields_json = items.custom_fields_json;
        cb_mojo_ext.use_custom_fields = items.use_custom_fields;
        cb_mojo_ext.title_selector = items.title_selector;
        cb_mojo_ext.baseURI = null;
        if (cb_mojo_ext.debug_mode == true) {
            console.log(items);
        }
        afterLoadFunction(cb_mojo_ext);
    });
}