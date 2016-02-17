var Gmail_Sidebar = React.createClass({
    displayName: 'Gmail Sidebar',
    getInitialState: function() {
        return {
            ticket_update_minimized: false,
            ticket_messages_minimized: true,
            ticket_private_messsages_minimized: true
        }
    },
    handleTicketUpdateMinimize: function(event) {
        var current_state = this.state.ticket_update_minimized;
        console.log(current_state);
        this.setState({
            ticket_update_minimized: !current_state,
            ticket_messages_minimized: true,
            ticket_private_messsages_minimized: true
        });
        this.forceUpdate();
    },
    handleMessagesMinimize: function(event) {
        var current_state = this.state.ticket_messages_minimized;
        this.setState({
            ticket_update_minimized: true,
            ticket_messages_minimized: !current_state,
            ticket_private_messsages_minimized: true
        });
        this.forceUpdate();
    },
    handlePrivateMessageMinimize: function(event) {
        var current_state = this.state.ticket_private_messsages_minimized;
        console.log(current_state);
        this.setState({
            ticket_update_minimized: true,
            ticket_messages_minimized: true,
            ticket_private_messsages_minimized: !current_state,
        });
        this.forceUpdate();
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
        } else {
            var ticket_update_form = React.createElement(Ticket_Update_Form, {
                cb_mojo_ext: cb_mojo_ext,
                key: "Ticket_Update_Form",
                handleMinimize: this.handleTicketUpdateMinimize,
                minimized: this.state.ticket_update_minimized
            });
            var ticket_message_form = React.createElement(Ticket_Messages_Form, {
                cb_mojo_ext: cb_mojo_ext,
                key: "Ticket_Messages_Form",
                handleMinimize: this.handleMessagesMinimize,
                minimized: this.state.ticket_messages_minimized
            });
            var ticket_private_messages_form = React.createElement(Ticket_Private_Message_Form, {
                cb_mojo_ext: cb_mojo_ext,
                key: "Ticket_Private_Message_Form",
                handleMinimize: this.handlePrivateMessageMinimize,
                minimized: this.state.ticket_private_messsages_minimized
            });
            portlets.push(ticket_update_form);
            portlets.push(ticket_message_form);
            portlets.push(ticket_private_messages_form);
        }
        return div({
            className: "mojo_gmail_sidebar"
        }, div({
            className: "mojo_gmail_sidebar_title",
            key: "mojo_gmail_sidebar_title"
        }, "Mojo Help Desk"), portlets);
    }
});