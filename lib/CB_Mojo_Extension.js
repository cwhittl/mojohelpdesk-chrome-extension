function CB_Mojo_Extension(afterLoadFunction) {
    cb_mojo_ext = this; //Helps keep the confusion down in the functions
    cb_mojo_ext.api_key = "";
    cb_mojo_ext.debug_mode = false;
    cb_mojo_ext.use_custom_fields = true;
    cb_mojo_ext.mojo_domain = "";
    cb_mojo_ext.custom_fields_json = "";
    cb_mojo_ext.email_address = "";
    cb_mojo_ext.mojo_agent_id = "";
    cb_mojo_ext.optionsUrl = chrome.extension.getURL("options.html");
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
                "dependent_to": "ticket_type_id",
                "field_type": "select",
                "options": {
                    "66168": {
                        "enhancement request/feedback": "Enhancement Request/feedback",
                        "how to/training issue": "How To/training Issue",
                        "issue": "Issue",
                        "user error": "User Error"
                    },
                    "66169": {
                        "application issue or failure": "Application Issue or Failure",
                        "hardware issue or failure": "Hardware Issue or Failure",
                        "network issue or failure": "Network Issue or Failure"
                    },
                    "66170": {
                        "bug": "Bug",
                        "duplicate": "Duplicate",
                        "known error": "Known Error"
                    },
                    "66171": {
                        "account/identity management task": "Account/identity Management Task",
                        "enhancement task": "Enhancement Task",
                        "support/training task": "Support/training Task"
                    }
                },
                "pretty_name": "Sub Category"
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