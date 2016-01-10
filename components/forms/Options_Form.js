var Options_Form = React.createClass({
    displayName: 'Options_Form',
    getInitialState: function() {
        console.log(this.props.cb_mojo_ext);
        return {
            api_key: this.props.cb_mojo_ext.api_key,
            debug_mode: this.props.cb_mojo_ext.debug_mode,
            mojo_domain: this.props.cb_mojo_ext.mojo_domain,
            use_custom_fields: this.props.cb_mojo_ext.use_custom_fields,
            custom_fields_json: this.props.cb_mojo_ext.custom_fields_json,
            email_address: this.props.cb_mojo_ext.email_address,
            mojo_agent_id: this.props.cb_mojo_ext.mojo_domain,
            title_selector: this.props.cb_mojo_ext.title_selector
        };
    },
    componentDidMount: function() {},
    updateForm: function(event) {
        console.log("update form");
        event.preventDefault();
        chrome.storage.sync.set({
            api_key: this.state.api_key,
            debug_mode: this.state.debug_mode,
            mojo_domain: this.state.mojo_domain,
            use_custom_fields: this.state.use_custom_fields,
            custom_fields_json: this.state.custom_fields_json,
            email_address: this.state.email_address,
            title_selector: this.state.title_selector
        });
        // Update status to let user know options were saved.
        this.state.status = "Options saved.";
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
            label_text: "Mojo Domain (no http(s):// just the domain)",
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
            label_text: "Email Address associated with your Mojo Helpdesk Account",
            id: "email_address",
        }, R.input({
            className: "form-control",
            id: "email_address",
            key: "email_address",
            type: "email",
            placeholder: "Please Enter Your Mojo Email Address",
            value: this.state.email_address,
            onChange: this.handleInputChange
        }));
        var api_fieldset = Shared.createFieldSet({
            label_text: "Your Personal Mojo Helpdesk API Key",
            id: "api_key",
        }, R.input({
            className: "form-control",
            id: "api_key",
            key: "api_key",
            type: "text",
            placeholder: "Please Enter Your Personal Mojo Helpdesk API Key",
            value: this.state.api_key,
            onChange: this.handleInputChange
        }));
        var title_selector_fieldset = Shared.createFieldSet({
            label_text: "HelpDesk Ticket Subject Regext",
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
            label_text: "Use Custom Fields",
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
            value: JSON.stringify(this.state.custom_fields_json),
            placeholder: "Custom Fields JSON",
            onChange: this.handleInputChange
        }));
        var debug_mode_fieldset = Shared.createFieldSet({
            label_text: "Use Debug Mode",
            id: "debug_mode",
        }, R.input({
            className: "form-control",
            id: "debug_mode",
            key: "debug_mode",
            type: "checkbox",
            checked: this.state.debug_mode,
            onChange: this.handleCheckboxChange
        }));
        var submit = input({
            type: "submit",
            key:"submit",
            value: "Update Options",
            onClick: this.updateForm
        })
        var controls = [];
        controls.push(R.h4({
            key:"status",
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
            controls.push(submit);
        } else {}
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
new CB_Mojo_Extension(function(cb_mojo_ext) {
    ReactDOM.render(React.createElement(Options_Form, {
        cb_mojo_ext: cb_mojo_ext
    }), document.querySelector('#container'));
});
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