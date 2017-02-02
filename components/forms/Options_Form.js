var Options_Form = React.createClass({
    displayName: 'Options_Form',
    getInitialState: function() {
        //debug.info(this.props.cb_mojo_ext);
        var custom_fields_json = this.props.cb_mojo_ext.custom_fields_json;
        if (Shared.isObject(this.props.cb_mojo_ext.custom_fields_json)) {
            custom_fields_json = JSON.stringify(this.props.cb_mojo_ext.custom_fields_json);
        }
        return {
            help_image: "../../options/images/default.png",
            help_text: "An example view",
            api_key: this.props.cb_mojo_ext.api_key,
            debug_mode: this.props.cb_mojo_ext.debug_mode,
            mojo_domain: this.props.cb_mojo_ext.mojo_domain,
            email_domain: this.props.cb_mojo_ext.email_domain,
            use_custom_fields: this.props.cb_mojo_ext.use_custom_fields,
            custom_fields_json: custom_fields_json,
            email_address: this.props.cb_mojo_ext.email_address,
            mojo_agent_id: this.props.cb_mojo_ext.mojo_domain,
            enforce_slas: this.props.cb_mojo_ext.enforce_slas,
            emergency_due_on_days: this.props.cb_mojo_ext.emergency_due_on_days,
            emergency_scheduled_on_days: this.props.cb_mojo_ext.emergency_scheduled_on_days,
            urgent_due_on_days: this.props.cb_mojo_ext.urgent_due_on_days,
            urgent_scheduled_on_days: this.props.cb_mojo_ext.urgent_scheduled_on_days,
            normal_due_on_days: this.props.cb_mojo_ext.normal_due_on_days,
            normal_scheduled_on_days: this.props.cb_mojo_ext.normal_scheduled_on_days,
            low_due_on_days: this.props.cb_mojo_ext.low_due_on_days,
            low_scheduled_on_days: this.props.cb_mojo_ext.low_scheduled_on_days,
            reset_options: false
        };
    },
    componentDidMount: function() {},
    updateForm: function(event) {
        event.preventDefault();
        var status = "Options saved.";
        if (this.state.reset_options == true) {
            Shared.clearStorage();
            this.replaceState({});
            status = "Options Reset, may God have mercy on your soul.";
            setTimeout(function() {
                window.location.reload(false);
            }, 500);
        } else {
            Shared.setStorage({
                api_key: this.state.api_key,
                debug_mode: this.state.debug_mode,
                mojo_domain: this.state.mojo_domain,
                email_domain: this.state.email_domain,
                use_custom_fields: this.state.use_custom_fields,
                custom_fields_json: JSON.parse(this.state.custom_fields_json),
                enforce_slas: this.state.enforce_slas,
                emergency_due_on_days: this.state.emergency_due_on_days,
                emergency_scheduled_on_days: this.state.emergency_scheduled_on_days,
                urgent_due_on_days: this.state.urgent_due_on_days,
                urgent_scheduled_on_days: this.state.urgent_scheduled_on_days,
                normal_due_on_days: this.state.normal_due_on_days,
                normal_scheduled_on_days: this.state.normal_scheduled_on_days,
                low_due_on_days: this.state.low_due_on_days,
                low_scheduled_on_days: this.state.low_scheduled_on_days,
                email_address: this.state.email_address
            });
        }
        // Update status to let user know options were saved.
        this.setState({option_status: status});
        jQuery(".optionsForm").animate({
            scrollTop: '0px'
        }, 'fast');
        setTimeout(() => {
            this.setState({option_status: ""});
        }, 7000);
    },
    onHelp: function(target) {
        //debug.info(target);
        this.setState({help_text: target.help_text, help_image: target.help_image});
        //this.setState(stateObject);
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
        var mojo_domain_fieldset = Shared.createFieldSet({
            label_text: "Please enter your Mojo Helpdesk domain (no http(s):// just the domain)",
            id: "mojo_domain",
            labelChild: Shared.createMoreInfo({help_image: "../../options/images/domain.png", help_text: "This is the domain you use for Mojo Helpdesk and can be found in the search bar of you your browser while on the site.  Make sure you just put the domain and not the http:// or https://", onHelp: this.onHelp})
        }, R.input({
            className: "form-control",
            id: "mojo_domain",
            key: "mojo_domain",
            type: "text",
            placeholder: "Please Enter Mojo Domain",
            value: this.state.mojo_domain,
            onChange: this.handleInputChange
        }));
        var email_domain_fieldset = Shared.createFieldSet({
            label_text: "Please enter your Email domain (no http(s):// just the domain)",
            id: "email_domain",
            labelChild: Shared.createMoreInfo({help_image: "../../options/images/email_domain.png", help_text: "This is the domain you use for email and can be found in the search bar of you your browser when you check your email.  Make sure you just put the domain and not the http:// or https://", onHelp: this.onHelp})
        }, R.input({
            className: "form-control",
            id: "email_domain",
            key: "email_domain",
            type: "text",
            placeholder: "Please Enter Email Domain",
            value: this.state.email_domain,
            onChange: this.handleInputChange
        }));
        var email_fieldset = Shared.createFieldSet({
            label_text: "Please enter the email address you are associated with your Mojo Helpdesk account",
            id: "email_address",
            labelChild: Shared.createMoreInfo({help_image: "../../options/images/email.png", help_text: "This is the email that you, as an agent, have associated with Mojo Helpdesk. You can find it in your profile if you don't know it off the top of your head.", onHelp: this.onHelp})
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
            labelChild: Shared.createMoreInfo({help_image: "../../options/images/apikey.png", help_text: "This is the api key that Mojo creates for you, it is in your profile.", onHelp: this.onHelp})
        }, R.input({
            className: "form-control",
            id: "api_key",
            key: "api_key",
            type: "text",
            placeholder: "Please enter your personal Mojo Helpdesk API key",
            value: this.state.api_key,
            onChange: this.handleInputChange
        }));
        var custom_fields_fieldset = Shared.createFieldSet({
            label_text: "Are you using custom fields?",
            id: "use_custom_fields",
            labelChild: Shared.createMoreInfo({help_image: "../../options/images/usecustomfields.png", help_text: "This one gets even more complicated, please ask your IT Admin if you are using any before you enable this.", onHelp: this.onHelp})
        }, R.input({
            className: "form-control",
            id: "use_custom_fields",
            key: "use_custom_fields",
            type: "checkbox",
            checked: this.state.use_custom_fields,
            onChange: this.handleCheckboxChange
        }));
        var emergency_sla_row = R.tr({}, R.td({}, R.h5({}, "Emergency")), R.td({}, Shared.create_input("emergency_due_on_days", "number", this.state.emergency_due_on_days, this.handleInputChange, "due on")), R.td({}, Shared.create_input("emergency_scheduled_on_days", "number", this.state.emergency_scheduled_on_days, this.handleInputChange, "scheduled on")));
        var urgent_sla_row = R.tr({}, R.td({}, R.h5({}, "Urgent")), R.td({}, Shared.create_input("urgent_due_on_days", "number", this.state.urgent_due_on_days, this.handleInputChange, "due on")), R.td({}, Shared.create_input("urgent_scheduled_on_days", "number", this.state.urgent_scheduled_on_days, this.handleInputChange, "scheduled on")));
        var normal_sla_row = R.tr({}, R.td({}, R.h5({}, "Normal")), R.td({}, Shared.create_input("normal_due_on_days", "number", this.state.normal_due_on_days, this.handleInputChange, "due on")), R.td({}, Shared.create_input("normal_scheduled_on_days", "number", this.state.normal_scheduled_on_days, this.handleInputChange, "scheduled on")));
        var low_sla_row = R.tr({}, R.td({}, R.h5({}, "Low")), R.td({}, Shared.create_input("low_due_on_days", "number", this.state.low_due_on_days, this.handleInputChange, "due on")), R.td({}, Shared.create_input("low_scheduled_on_days", "number", this.state.low_scheduled_on_days, this.handleInputChange, "scheduled on")));
        var sla_table = R.table({
            style: {
                width: "100%"
            }
        }, R.tr({}, R.td({}, R.label({}, "Priority")), R.td({}, R.label({}, "How many days due after creation")), R.td({}, R.label({}, "How many days scheduled after creation"))), emergency_sla_row, urgent_sla_row, normal_sla_row, low_sla_row);
        var slas_fieldset = Shared.createFieldSet({
            label_text: "Service Level Agreements",
            id: "slas",
            labelChild: Shared.createMoreInfo({help_image: "../../options/images/slas.png", help_text: "Define the service level agreements for each priority.", onHelp: this.onHelp})
        }, sla_table);
        var enforce_slas_fieldset = Shared.createFieldSet({
            label_text: "Enforce SLAs?",
            id: "enforce_slas",
            labelChild: Shared.createMoreInfo({help_image: "../../options/images/detailed_slas.jpg", help_text: "Do you want to enforce the SLAs noted above (This will lock down the dates and only change with priority)?", onHelp: this.onHelp})
        }, R.input({
            className: "form-control",
            id: "enforce_slas",
            key: "enforce_slas",
            type: "checkbox",
            checked: this.state.enforce_slas,
            onChange: this.handleCheckboxChange
        }));
        var custom_fields_json_fieldset = Shared.createFieldSet({
            label_text: "Custom Fields JSON",
            id: "custom_fields_json"
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
            labelChild: Shared.createMoreInfo({help_image: "../../options/images/debug.jpg", help_text: "This is only needed if you are experiencing catastrophic problems and are needing help from the developer of the extension", onHelp: this.onHelp})
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
            },
            labelChild: Shared.createMoreInfo({help_image: "../../options/images/reset.jpg", help_text: "It's time to start over, all settings will go back to their defaults.", onHelp: this.onHelp})
        }, R.input({
            className: "form-control",
            id: "reset_options",
            key: "reset_options",
            type: "checkbox",
            checked: this.state.reset_options,
            onChange: this.handleCheckboxChange
        }));

        var controls = [];
        controls.push(R.h4({
            key: "status",
            className: "Status"
        }, this.state.status));
        controls.push(mojo_domain_fieldset);
        if (!Shared.isEmpty(this.state.mojo_domain) && Shared.isValidDomain(this.state.mojo_domain)) {
            controls.push(email_domain_fieldset);
            controls.push(email_fieldset);
            controls.push(api_fieldset);
            controls.push(slas_fieldset);
            controls.push(enforce_slas_fieldset);
            controls.push(custom_fields_fieldset);
            if (this.state.use_custom_fields == true) {
                controls.push(custom_fields_json_fieldset);
            }
            controls.push(debug_mode_fieldset);
            controls.push(reset_options_fieldset);
        } else {}
        var submit = input({type: "submit", key: "submit", value: "Update Options", onClick: this.updateForm})
        return R.div({
            className: "optionsContainer"
        }, form({
            className: "optionsForm"
        }, div({
            className: "options_header"
        }, "Welcome to The Mojo HelpDesk Extension by Collective Bias"), img({className: "options_logo", src: "../../images/icons/icon128.png"}), R.hr({}), div({
            className: "option_status"
        }, this.state.option_status), R.div({
            className: "controls"
        }, controls), R.div({
            className: "help_area"
        }, R.div({
            className: "help_image",
            style: {
                backgroundImage: "url(" + this.state.help_image + ")"
            }
        }), R.textarea({
            rows: (this.state.help_text.length / 40),
            disabled: true,
            className: "help_text",
            value: this.state.help_text
        }))), submit);
    },
    render: function() {
        return this.render_content();
    }
});
new CB_Mojo_Extension(function(cb_mojo_ext) {
    ReactDOM.render(React.createElement(Options_Form, {cb_mojo_ext: cb_mojo_ext}), document.querySelector('#container'));
});
