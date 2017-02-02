var Gmail_Sidebar = React.createClass({
    displayName: 'Gmail Sidebar',
    getInitialState: function() {
        return {
            ticket_description_form_minimized: true,
            ticket_update_form_minimized: false,
            ticket_messages_form_minimized: true,
            ticket_send_message_form_minimized: true,
            ticket_attachments_form_minimized: true,
            ticket: null,
            error_message: ""
        }
    },
    handleError: function(event) {
        var message = "Unknown Error, Please Enable Debug and Check Javascript Console";
        if (event.hasOwnProperty("responseText")) {
            message = "Message From Mojo -- " + event.responseText;
        } else {
            debug.error(event);
        }
        this.setState({error_message: message});
    },
    handleUpdate: function() {
        API_Connector.get_ticket(this.props.cb_mojo_ext, this.getTicket, this.handleError);
    },
    componentDidMount: function() {
        this.handleUpdate();
        var ticket_timer = setInterval(() => {
            console.log("Getting Newest Ticket Info");
            this.handleUpdate();
        }, 180000);
        this.setState({ticket_timer: ticket_timer});
    },
    componentWillUnmount: function() {
        console.log("Unloading Ticket Timeout");
        clearInterval(this.state.ticket_timer);
    },
    getTicket: function(response) {
        var ticket = response.ticket;
        debug.info(ticket);
        this.setState({ticket: ticket});
    },
    handleMinimize: function(event,portlet_name) {
        var oldState = this.state;
        var available_portlets = ["ticket_update_form", "ticket_messages_form", "ticket_description_form", "ticket_attachments_form", "ticket_send_message_form"];
        var stateObject = function() {
            var one_not_minimized = true;
            returnObj = {};
            for (var i = 0; i < available_portlets.length; i++) {
                var state_name = available_portlets[i] + "_minimized";
                var state_value = true;
                console.log(portlet_name + "==" + available_portlets[i]);
                console.log(portlet_name == available_portlets[i]);
                if (portlet_name == available_portlets[i]) {
                    console.log(state_name);
                    state_value = !oldState[state_name];
                }
                returnObj[state_name] = state_value;
                if (state_value == false) {
                    one_not_minimized = false;
                }
            }
            //We want one always loaded and the update is the most popular
            if (one_not_minimized == true) {
                returnObj["ticket_update_form_minimized"] = false;
            }
            return returnObj;
        }.bind(event)();
        this.setState(stateObject);
    },
    render: function() {
        var R = React.DOM;
        var div = R.div;
        var cb_mojo_ext = this.props.cb_mojo_ext;
        var portlets = [];
        if (cb_mojo_ext.access_key == "" || cb_mojo_ext.email_address == "") {
            portlets = React.createElement("a", {
                id: "load_error",
                href: cb_mojo_ext.optionsUrl
            }, "Please Configure and Refresh");
            console.log("Error Loading Mojo HelpDesk Extension by Collective Bias - Missing Options");
        } else if (this.state.error_message != "") {
            portlets = React.createElement("div", {
                id: "ajax_error"
            }, this.state.error_message);
        } else if (this.state.ticket != null) {
            var submitter_full_name = this.state.ticket.related_data.user.full_name;
            var submitter_picture_url = this.state.ticket.related_data.user.picture_url;

            portlets.push(Shared.create_user_info({
                user_id: this.state.ticket.user_id,
                updated_on: this.state.ticket.created_on,
                related_data: {
                    user: {
                        full_name: submitter_full_name,
                        picture_url: submitter_picture_url
                    }
                }
            }));
            portlets.push(React.createElement(Ticket_Description_Form, {
                cb_mojo_ext: cb_mojo_ext,
                ticket: this.state.ticket,
                key: "Ticket_Description_Form",
                handleMinimize: this.handleMinimize,
                minimized: this.state.ticket_description_form_minimized
            }));
            portlets.push(React.createElement(Ticket_Messages_Form, {
                cb_mojo_ext: cb_mojo_ext,
                ticket: this.state.ticket,
                key: "Ticket_Messages_Form",
                handleMinimize: this.handleMinimize,
                minimized: this.state.ticket_messages_form_minimized
            }));
            portlets.push(React.createElement(Ticket_Attachments_Form, {
                cb_mojo_ext: cb_mojo_ext,
                ticket: this.state.ticket,
                key: "Ticket_Attachments_Form",
                handleUpdate: this.handleUpdate,
                handleMinimize: this.handleMinimize,
                minimized: this.state.ticket_attachments_form_minimized
            }));
            portlets.push(React.createElement(Ticket_Update_Form, {
                cb_mojo_ext: cb_mojo_ext,
                ticket: this.state.ticket,
                key: "Ticket_Update_Form",
                handleUpdate: this.handleUpdate,
                handleMinimize: this.handleMinimize,
                minimized: this.state.ticket_update_form_minimized
            }));
            portlets.push(React.createElement(Ticket_Send_Message_Form, {
                cb_mojo_ext: cb_mojo_ext,
                ticket: this.state.ticket,
                key: "Ticket_Send_Message_Form",
                handleUpdate: this.handleUpdate,
                handleMinimize: this.handleMinimize,
                minimized: this.state.ticket_send_message_form_minimized
            }));
        } else {
            //TODO LOADING Message
        }
        //This is done just in case there is an issue with the ticket being Loaded
        //The link can be used as a last resort.
        var open_ticket = null;
        if (cb_mojo_ext.ticket_id != "") {
            open_ticket = R.a({
                target: "_ticket",
                id: "launch_ticket",
                key: "launch_ticket",
                href: "https://" + this.props.cb_mojo_ext.mojo_domain + "/tech/#" + cb_mojo_ext.ticket_id
            }, "Open " + cb_mojo_ext.ticket_id + " in Mojo");
        }
        return div({
            className: "mojo_gmail_sidebar"
        }, div({
            className: "mojo_gmail_sidebar_title",
            key: "mojo_gmail_sidebar_title"
        }, "Mojo Help Desk"), open_ticket, portlets);
    }
});
