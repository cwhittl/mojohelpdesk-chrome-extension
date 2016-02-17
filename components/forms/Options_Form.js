var Options_Form = React.createClass({
    displayName: 'Options_Form',
    getInitialState: function() {
        console.log(this.props.cb_mojo_ext);
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
        event.preventDefault();
        var status = "Options saved.";
        if (this.state.reset_options == true) {
            chrome.storage.sync.clear();
            this.replaceState({});
            status = "Options Reset, may God have mercy on your soul.";
            setTimeout(function() {
                window.location.reload(false);
            }, 500);
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
        this.setState({
            option_status: status
        });
        setTimeout(() => {
            this.setState({
                option_status: ""
            });
        }, 5000);
    },
    onHelp: function(target) {
        console.log(target);
        this.setState({
            help_text: target.help_text,
            help_image: target.help_image
        });
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
        var domain_fieldset = Shared.createFieldSet({
            label_text: "Please enter your Mojo Helpdesk domain (no http(s):// just the domain)",
            id: "mojo_domain",
            labelChild: Shared.createMoreInfo({
                help_image: "../../options/images/domain.png",
                help_text: "This is the domain you use for Mojo Helpdesk and can be found in the search bar of you your browser while on the site.  Make sure you just put the domain and not the http:// or https://",
                onHelp: this.onHelp
            })
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
            labelChild: Shared.createMoreInfo({
                help_image: "../../options/images/email.png",
                help_text: "This is the email that you as an agent have associated with Mojo Helpdesk, you can find it in your profile if you don't know it off the top of your head.",
                onHelp: this.onHelp
            })
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
            labelChild: Shared.createMoreInfo({
                help_image: "../../options/images/apikey.png",
                help_text: "This is the api key that Mojo creates for you, it is in your profile.",
                onHelp: this.onHelp
            })
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
            labelChild: Shared.createMoreInfo({
                help_image: "../../options/images/regex.png",
                help_text: "This one gets a little more complicated, the extension needs to know when it's in a help desk ticket. The best way we have found is to use regex against the subject (which gmail puts in the title).\nYou can follow our example (above) and in all email templates put (# {{ticket. id}}) at the end of the subject and then leave the regex to its default",
                onHelp: this.onHelp
            })
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
            labelChild: Shared.createMoreInfo({
                help_image: "../../options/images/usecustomfields.png",
                help_text: "This one gets even more complicated, please ask your IT Admin if you are using any before you enable this.",
                onHelp: this.onHelp
            })
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
            labelChild: Shared.createMoreInfo({
                help_image: "../../options/images/debug.jpg",
                help_text: "This is only needed if you are experiencing catastrophic problems and are needing help from the developer of the extension",
                onHelp: this.onHelp
            })
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
            labelChild: Shared.createMoreInfo({
                help_image: "../../options/images/reset.jpg",
                help_text: "It's time to start over, all settings will go back to their defaults.",
                onHelp: this.onHelp
            })
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
            src: "../../images/icons/icon128.png"
        }), R.hr({}), div({
            className: "option_status"
        }, this.state.option_status), R.div({
            className: "controls"
        }, controls), R.div({
            className: "help_area"
        }, R.div({
            className:"help_image",
            style: {
                backgroundImage:"url("+this.state.help_image+")"
            }
        }), R.textarea({
            rows: (this.state.help_text.length / 40),
            disabled: true,
            className: "help_text",
            value: this.state.help_text
        })));
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