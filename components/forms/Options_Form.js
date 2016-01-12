var Options_Form = React.createClass({
    displayName: 'Options_Form',
    getInitialState: function() {
        console.log(this.props.cb_mojo_ext);
        var custom_fields_json = this.props.cb_mojo_ext.custom_fields_json;
        if (Shared.isObject(this.props.cb_mojo_ext.custom_fields_json)) {
            custom_fields_json = JSON.stringify(this.props.cb_mojo_ext.custom_fields_json);
        }
        return {
            api_key: this.props.cb_mojo_ext.api_key,
            debug_mode: this.props.cb_mojo_ext.debug_mode,
            mojo_domain: this.props.cb_mojo_ext.mojo_domain,
            use_custom_fields: this.props.cb_mojo_ext.use_custom_fields,
            custom_fields_json: custom_fields_json,
            email_address: this.props.cb_mojo_ext.email_address,
            mojo_agent_id: this.props.cb_mojo_ext.mojo_domain,
            title_selector: this.props.cb_mojo_ext.title_selector,
            reset_options: false
        };
    },
    componentDidMount: function() {},
    updateForm: function(event) {
        console.log("update form");
        event.preventDefault();
        var status = "Options saved.";
        if (this.state.reset_options == true) {
            chrome.storage.sync.clear();
            this.replaceState({});
            status = "Options Reset, may God have mercy on your soul.";
        } else {
            chrome.storage.sync.set({
                api_key: this.state.api_key,
                debug_mode: this.state.debug_mode,
                mojo_domain: this.state.mojo_domain,
                use_custom_fields: this.state.use_custom_fields,
                custom_fields_json: JSON.parse(this.state.custom_fields_json),
                email_address: this.state.email_address,
                title_selector: this.state.title_selector
            });
        }
        // Update status to let user know options were saved.
        this.state.status = status;
        setTimeout(() => {
            this.state.status = "";
        }, 10000);
    },
    handleInputChange: function(event) {
        var stateObject = function() {
            returnObj = {};
            returnObj[this.target.id] = this.target.value;
            return returnObj;
        }.bind(event)();
        this.setState(stateObject);
    },
    handleCheckboxChange: function(event) {
        var stateObject = function() {
            returnObj = {};
            returnObj[this.target.id] = this.target.checked;
            return returnObj;
        }.bind(event)();
        this.setState(stateObject);
    },
    render_content: function(event) {
        var R = React.DOM;
        var form = R.form;
        var input = R.input;
        var div = R.div;
        var img = R.img;
        var domain_fieldset = Shared.createFieldSet({
            label_text: "Please enter your Mojo Helpdesk domain (no http(s):// just the domain)",
            id: "mojo_domain",
        }, R.input({
            className: "form-control",
            id: "mojo_domain",
            key: "mojo_domain",
            type: "text",
            placeholder: "Please Enter Mojo Domain",
            value: this.state.mojo_domain,
            onChange: this.handleInputChange
        }));
        var email_fieldset = Shared.createFieldSet({
            label_text: "Please enter the email address you are associated with your Mojo Helpdesk account",
            id: "email_address",
        }, R.input({
            className: "form-control",
            id: "email_address",
            key: "email_address",
            type: "email",
            placeholder: "Please enter your Mojo email address",
            value: this.state.email_address,
            onChange: this.handleInputChange
        }));
        var api_fieldset = Shared.createFieldSet({
            label_text: "Your Mojo Helpdesk API key",
            id: "api_key",
        }, R.input({
            className: "form-control",
            id: "api_key",
            key: "api_key",
            type: "text",
            placeholder: "Please enter your personal Mojo Helpdesk API key",
            value: this.state.api_key,
            onChange: this.handleInputChange
        }));
        var title_selector_fieldset = Shared.createFieldSet({
            label_text: "Please enter Regex to retrieve the ticket number from the subject of Mojo emails",
            id: "title_selector",
        }, R.input({
            className: "form-control",
            id: "title_selector",
            key: "title_selector",
            type: "text",
            placeholder: "HelpDesk Ticket Subject Regext",
            value: this.state.title_selector,
            onChange: this.handleInputChange
        }));
        var custom_fields_fieldset = Shared.createFieldSet({
            label_text: "Are you using custom fields?",
            id: "use_custom_fields",
        }, R.input({
            className: "form-control",
            id: "use_custom_fields",
            key: "use_custom_fields",
            type: "checkbox",
            checked: this.state.use_custom_fields,
            onChange: this.handleCheckboxChange
        }));
        var custom_fields_json_fieldset = Shared.createFieldSet({
            label_text: "Custom Fields JSON",
            id: "custom_fields_json",
        }, R.textarea({
            className: "form-control",
            id: "custom_fields_json",
            key: "custom_fields_json",
            value: this.state.custom_fields_json,
            placeholder: "Custom Fields JSON",
            onChange: this.handleInputChange
        }));
        var debug_mode_fieldset = Shared.createFieldSet({
            label_text: "Enable debug mode?",
            id: "debug_mode",
        }, R.input({
            className: "form-control",
            id: "debug_mode",
            key: "debug_mode",
            type: "checkbox",
            checked: this.state.debug_mode,
            onChange: this.handleCheckboxChange
        }));
        var reset_options_fieldset = Shared.createFieldSet({
            label_text: "Reset All Options",
            id: "reset_options",
            style: {
                backgroundColor: "red"
            }
        }, R.input({
            className: "form-control",
            id: "reset_options",
            key: "reset_options",
            type: "checkbox",
            checked: this.state.reset_options,
            onChange: this.handleCheckboxChange
        }));
        var submit = input({
            type: "submit",
            key: "submit",
            value: "Update Options",
            onClick: this.updateForm
        })
        var controls = [];
        controls.push(R.h4({
            key: "status",
            className: "Status"
        }, this.state.status));
        controls.push(domain_fieldset);
        if (!Shared.isEmpty(this.state.mojo_domain) && Shared.isValidDomain(this.state.mojo_domain)) {
            controls.push(email_fieldset);
            controls.push(api_fieldset);
            controls.push(title_selector_fieldset);
            controls.push(custom_fields_fieldset);
            if (this.state.use_custom_fields == true) {
                controls.push(custom_fields_json_fieldset);
            }
            controls.push(debug_mode_fieldset);
            controls.push(reset_options_fieldset);
            controls.push(submit);
        } else {}
        return form({
            className: "optionsForm"
        }, div({
            className: "options_header"
        }, "Welcome to The Mojo HelpDesk Extension by Collective Bias"), img({
            className: "options_logo",
            src: "../../icons/icon128.png"
        }), R.hr({}), controls);
    },
    render: function() {
        return this.render_content();
    }
});
new CB_Mojo_Extension(function(cb_mojo_ext) {
    ReactDOM.render(React.createElement(Options_Form, {
        cb_mojo_ext: cb_mojo_ext
    }), document.querySelector('#container'));
});