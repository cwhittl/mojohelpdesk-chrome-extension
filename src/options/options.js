function CB_Mojo_Extension_Options() {
    var cb_options = this; //for function confusion
    this.default_custom_fields_object = {"custom_field_sub_category":{"dependent_to":"ticket_type_id","field_type":"select","options":{"66168":{"enhancement request/feedback":"Enhancement Request/feedback","how to/training issue":"How To/training Issue","issue":"Issue","user error":"User Error"},"66169":{"application issue or failure":"Application Issue or Failure","hardware issue or failure":"Hardware Issue or Failure","network issue or failure":"Network Issue or Failure"},"66170":{"bug":"Bug","duplicate":"Duplicate","known error":"Known Error"},"66171":{"account/identity management task":"Account/identity Management Task","enhancement task":"Enhancement Task","enhancement task ":"Enhancement Task","support/training task":"Support/training Task"}},"pretty_name":"Sub Category"}};
    // Saves options to chrome.storage
    this.save_options = function() {
        var $reset_options = $('#reset_options').is(':checked');
        var $status = $('#status');
        if (reset_options == true) {
            chrome.storage.sync.clear();
            $('#reset_options').prop('checked', false);
            $status.html('Options Reset, may God have mercy on your soul.');
            restore_options();
            setTimeout(function() {
                $status.textContent = '';
            }, 750);
        } else {
            var api_key = $('#api_key').val();
            var debug_mode = $('#debug_mode').prop('checked');
            var use_custom_fields = $('#use_custom_fields').prop('checked');
            var mojo_domain = $('#mojo_domain').val();
            var title_selector = $('#title_selector').val();
            var email_address = $('#email_address').val();
            var mojo_agent_id = $('#mojo_agent_id').val();
            var custom_fields_json = $('#custom_fields_json').val();
            if (typeof(custom_fields_json) == "string" && custom_fields_json != "") {
                custom_fields_json = JSON.parse(custom_fields_json);
            }
            
            if (api_key != "" && mojo_domain != "" && email_address != "") {}
            chrome.storage.sync.set({
                api_key: api_key,
                debug_mode: debug_mode,
                mojo_domain: mojo_domain,
                use_custom_fields: use_custom_fields,
                custom_fields_json: custom_fields_json,
                email_address: email_address,
                mojo_agent_id: mojo_agent_id,
                title_selector: title_selector
            }, function() {
                // Update status to let user know options were saved.
                $status.html('Options saved.');
                setTimeout(function() {
                    $status.html('');
                }, 750);
            });
        }
    }
    this.domain_change = function() {
        var $dependent_on_domain = $(".dependent_on_domain");

        console.log($('#mojo_domain').val());
        if ($('#mojo_domain').val() != "") {
            //$('#mojo_domain').val(new URL($('#mojo_domain').val()).hostname);
            $dependent_on_domain.show();
        } else {
            $dependent_on_domain.hide();
        }
    }
    this.use_custom_fields_change = function() {
        if ($('#use_custom_fields').is(':checked') == true) {
            $('.custom_fields_json_container').show();
        } else {
            $('.custom_fields_json_container').hide();
        }
    }
    // Restores select box and checkbox state using the preferences
    // stored in chrome.storage.
    this.restore_options = function() {
        // Use default value color = 'red' and likesColor = true.
        chrome.storage.sync.get({
            api_key: '',
            debug_mode: false,
            mojo_domain: '',
            custom_fields_json: this.default_custom_fields_object,
            use_custom_fields: true,
            email_address: '',
            mojo_agent_id: '',
            title_selector: 'Collective Bias Helpdesk'
        }, function(items) {
            //alert();
            $('#api_key').val(items.api_key);
            $('#debug_mode').prop('checked', items.debug_mode);
            $('#use_custom_fields').prop('checked', items.use_custom_fields);
            $('#mojo_domain').val(items.mojo_domain);
            $('#email_address').val(items.email_address);
            $('#mojo_agent_id').val(items.mojo_agent_id);
            $('#title_selector').val(items.title_selector);
            var custom_fields_json = "";
            if (typeof(items.custom_fields_json) == "object") {
                custom_fields_json = JSON.stringify(items.custom_fields_json);
            }
            $('#custom_fields_json').val(custom_fields_json);
            cb_options.domain_change();
            cb_options.use_custom_fields_change();
        });
    }
    this.init = function() {
        $('#save').on('click', cb_options.save_options);
        $('#mojo_domain').on('change', cb_options.domain_change);
        $('#use_custom_fields').on('change', cb_options.use_custom_fields_change);
        $('.help_tags a').on('click', function() {
            $(this).closest('.help_tags').find(':not(a)').toggle();
        });
        cb_options.restore_options();
    }
    cb_options.init();
}
new CB_Mojo_Extension_Options();