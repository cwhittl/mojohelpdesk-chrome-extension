var default_custom_fields_object = {
    "custom_field_sub_category": {
        "pretty_name": "Sub Category",
        "field_type": "select",
        "dependent_to": "ticket_type_id",
        "options": {
            "66168": {
                "howto-training": "How To/training Issue",
                "general": "General Issue",
                "user-error": "User Error",
                "enhancement-feedback": "Enhancement Request/feedback"
            },
            "66169": {
                "hardware": "Hardware Issue or Failure",
                "network": "Network Issue or Failure",
                "application": "Application Issue or Failure"
            },
            "66170": {
                "known-error": "Known Error",
                "bug": "Bug"
            },
            "66171": {
                "account-identity-management-task": "Account/identity Management Task",
                "support-training-task": "Support/training Task",
                "enhancement-task": "Enhancement Task"
            }
        }
    }
};
// Saves options to chrome.storage
function save_options() {
    var reset_options = document.getElementById('reset_options').checked;
    var status = document.getElementById('status');
    if (reset_options == true) {
        chrome.storage.sync.clear();
        document.getElementById('reset_options').checked = false;
        status.textContent = 'Options Reset, may God have mercy on your soul.';
        restore_options();
        setTimeout(function() {
            status.textContent = '';
        }, 750);
    } else {
        var api_key = document.getElementById('api_key').value;
        var debug_mode = document.getElementById('debug_mode').checked;
        var use_custom_fields = document.getElementById('use_custom_fields').checked;
        var mojo_domain = document.getElementById('mojo_domain').value;
        var email_address = document.getElementById('email_address').value;
        var mojo_agent_id = document.getElementById('mojo_agent_id').value;
        var custom_fields_json = document.getElementById('custom_fields_json').value;
        if (typeof(custom_fields_json) == "string" && custom_fields_json != "") {
            custom_fields_json = JSON.parse(custom_fields_json);
        }
        chrome.storage.sync.set({
            api_key: api_key,
            debug_mode: debug_mode,
            mojo_domain: mojo_domain,
            use_custom_fields: use_custom_fields,
            custom_fields_json: custom_fields_json,
            email_address: email_address,
            mojo_agent_id: mojo_agent_id
        }, function() {
            // Update status to let user know options were saved.
            status.textContent = 'Options saved.';
            setTimeout(function() {
                status.textContent = '';
            }, 750);
        });
    }
}
function use_custom_fields_change() {
    if (document.getElementById('use_custom_fields').checked == true) {
        document.getElementById('custom_fields_json_container').style.display = "";
    } else {
        document.getElementById('custom_fields_json_container').style.display = "none";
    }
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    document.getElementById('use_custom_fields').addEventListener('change', use_custom_fields_change);
    chrome.storage.sync.get({
        api_key: '',
        debug_mode: false,
        mojo_domain: '',
        custom_fields_json: default_custom_fields_object,
        use_custom_fields: true,
        email_address: '',
        mojo_agent_id: ''
    }, function(items) {
        document.getElementById('api_key').value = items.api_key;
        document.getElementById('debug_mode').checked = items.debug_mode;
        document.getElementById('use_custom_fields').checked = items.use_custom_fields;
        document.getElementById('mojo_domain').value = items.mojo_domain;
        document.getElementById('email_address').value = items.email_address;
        document.getElementById('mojo_agent_id').value = items.mojo_agent_id;
        var custom_fields_json = "";
        if (typeof(items.custom_fields_json) == "object") {
            custom_fields_json = JSON.stringify(items.custom_fields_json);
        }
        document.getElementById('custom_fields_json').value = custom_fields_json;
        use_custom_fields_change();
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);