var Options_Form = React.createClass({
    displayName: 'Options_Form',
    getInitialState: function() {
        return {
            api_key: null,
            debug_mode: false,
            mojo_domain: "",
            use_custom_fields: false,
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
                            "enhancement task ": "Enhancement Task",
                            "support/training task": "Support/training Task"
                        }
                    },
                    "pretty_name": "Sub Category"
                }
            },
            email_address: "",
            mojo_agent_id: "",
            title_selector: ""
        };
    },
    componentDidMount: function() {},
    updateForm: function(event) {
        event.preventDefault();
        console.log("HI!");
        /*
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
	*/
    },
    createFieldSet: function(in_props) {
        var default_props = {
            type: "text",
            validation_pattern: "",
            placeholder: "Please Enter " + in_props.label_text
        }
        var props = Shared.merge_options(default_props, in_props);
        var R = React.DOM;
        var label = R.label({
            htmlFor: props.id
        }, props.label_text);
        return R.fieldset({
            className: "form-group",
            key: "group-" + props.id,
            id: "group-" + props.id
        }, label, R.input({
            className: "form-control",
            id: props.id,
            key: props.id,
            type: props.type,
            pattern: props.validation_pattern,
            placeholder: props.placeholder,
            onChange: props.changeHandler
        }));
    },
    handleInputChange: function(event) {
        console.log(event);
        if (event.target.validity.valid) {
            console.log("good");
            var stateObject = function() {
                returnObj = {};
                returnObj[this.target.id] = this.target.value;
                return returnObj;
            }.bind(event)();
            this.setState(stateObject);
        }
        console.log(this.state);
    },
    render_content: function(event) {
        var R = React.DOM;
        var form = R.form;
        var input = R.input;
        var div = R.div;
        var img = R.img;
        var domain_fieldset = this.createFieldSet({
            id: "mojo_domain",
            label_text: "Mojo Domain (no http(s):// just the domain)",
            value: this.state.mojo_domain,
            placeholder: "Please Enter Your Mojo Domain",
            help_text: "",
            message: "",
            validation_pattern: "^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\\\.[a-zA-Z]{2,})+$",
            changeHandler: this.handleInputChange
        });
        var email_fieldset = this.createFieldSet({
            id: "email_address",
            label_text: "Email Address",
            value: this.state.email_address,
            placeholder: "Please Enter The Email Address Associated With You Mojo Account",
            help_text: "",
            type: "url",
            message: "",
            changeHandler: this.handleInputChange
        });
        var api_fieldset = this.createFieldSet({
            id: "api_key",
            label_text: "Your Personal Mojo Helpdesk API Key",
            value: this.state.api_key,
            help_text: "",
            message: "",
            changeHandler: this.handleInputChange
        });
        var custom_fields_fieldset = this.createFieldSet({
            id: "use_custom_fields",
            label_text: "Use Custom Fields",
            value: this.state.use_custom_fields,
            help_text: "",
            type: "checkbox",
            message: "",
            changeHandler: this.handleInputChange
        });
        var submit = input({
            type: "submit",
            value: "Update Options",
            onClick: this.updateForm
        })
        var controls = [];
        controls.push(domain_fieldset);
        if (this.state.mojo_domain == "") {} else {
            controls.push(email_fieldset);
            controls.push(api_fieldset);
            controls.push(custom_fields_fieldset);
            controls.push(submit);
        }
        return form({
            className: "optionsForm"
        }, div({
            className: ""
        }, "Welcome to The Mojo HelpDesk Extension by Collective Bias"), img({
            src: "../../icons/icon128.png"
        }), controls);
    },
    render: function() {
        return this.render_content();
    }
});
ReactDOM.render(React.createElement(Options_Form), document.querySelector('#container'));
/*<div style="text-align:center">
        <table style="width:75%;margin-left:auto;margin-right:auto;">
            <tr>
                <td style="width:50%;">
                    <h1>Welcome to The Mojo HelpDesk Extension by Collective Bias</h1>
                </td>
                <td>
                    <img src="../../icons/icon128.png">
                </td>
            </tr>
            <tr>
                <td>
                    <label>
                        Please Enter Your Mojo Helpdesk Domain (no http(s):// just the domain)
                    </label>
                </td>
                <td>
                    <input type="textbox" id="mojo_domain" style="width:100%"  placeholder="Mojo Helpdesk Domain To Continue"/>
                </td>
            </tr>
            <tr>
                <td colspan="2" class='help_tags'>
                    <a  href="#">How Do I Get The Domain?</a>
                    <img src="images/Domain.png">
                </td>
            </tr>
            <tr class='dependent_on_domain'>
                <td>
                    <label>
                        Please Enter Your Email Address
                    </label>
                </td>
                <td>
                    <input type="textbox" id="email_address" style="width:100%"/>
                    <input type="hidden" id="mojo_agent_id" />
                </td>
            </tr>
            <tr class='dependent_on_domain'>
                <td>
                    <label>
                        Please Enter Your Personal Mojo Helpdesk API Key
                    </label>
                </td>
                <td>
                    <input type="textbox" id="api_key" style="width:100%"/>
                </td>
            </tr>
            <tr class='dependent_on_domain'>
                <td colspan="2" class='help_tags'>
                    <a href="#">How Do I Get My API Key?</a>
                    <img src="images/ProfilePage.png">
                </td>
            </tr>
            <tr class='dependent_on_domain'>
                <td>
                    <label>
                        Please Something Unique in Email Subject To Determine A HelpDesk Ticket
                    </label>
                </td>
                <td>
                    <input type="textbox" id="title_selector" style="width:100%"/>
                </td>
            </tr>
            <tr>
                <td colspan="2" class='help_tags dependent_on_domain'>
                    <a href="#">How Do I Set Up The Email Title?</a>
                    <div>
                        You need to add (#{{ticket.id}}) somewhere in the title of ALL the email messages as well as something unique. See below for an example.
                    </div>
                    <img src="images/EmailTitles.png">
                </td>
            </tr>
            <tr class='dependent_on_domain'>
                <td>
                    <label>
                        Use Custom Fields
                    </label>
                </td>
                <td>
                    <input type="checkbox" id="use_custom_fields" >
                </td>
            </tr>
            <tr class='dependent_on_domain'>
                <td class='custom_fields_json_container' >
                    <label>
                        Custom Fields JSON
                    </label>
                </td>
                <td class='custom_fields_json_container'>
                    <textarea id="custom_fields_json" style="width:100%;min-height:200px"></textarea>
                </td>
            </tr>
            <tr class='dependent_on_domain'>
                <td>
                    <label>
                        Enable Debug Mode
                    </label>
                </td>
                <td>
                    <input type="checkbox" id="debug_mode">
                </td>
            </tr>
            <tr class='dependent_on_domain'>
                <td>
                    <label style="color:red">
                        Reset All Options (Last resort)
                    </label>
                </td>
                <td>
                    <input type="checkbox" id="reset_options" style="color:red">
                </td>
            </tr>
            <tr class='dependent_on_domain'>
                <td colspan="2"><button id="save" style="width:100%">Update Options</button></td>
            </tr>
        </table>
        <div id="status"></div>

    </div>
    */