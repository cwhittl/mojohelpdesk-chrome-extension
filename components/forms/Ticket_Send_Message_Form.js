var Ticket_Send_Message_Form = React.createClass({
    displayName: 'Message Form',
    getInitialState: function() {
        return {message: ''};
    },
    handleChange: function(event) {
        this.setState({message: event.target.value});
    },
    sendPrivateMessage: function(event) {
        event.preventDefault();
        debug.info("Private Message");
        API_Connector.send_message(this, true, this.props.cb_mojo_ext, this.onSent);
    },
    sendMessage: function(event) {
        event.preventDefault();
        debug.info("Message");
        API_Connector.send_message(this, false, this.props.cb_mojo_ext, this.onSent);
    },
    onSent: function() {
        this.setState({message: ""});
        if (this.props.handleUpdate) {
            this.props.handleUpdate();
        }
    },
    render: function() {
        var R = React.DOM;
        var form = R.form;
        var textarea = R.textarea;
        var button = R.button;
        var content = form({
            className: "messageForm"
        }, R.span({
            className: this.state.status_type,
            id: "update_ticket_status_message",
            key: "status"
        }, this.state.status_message), textarea({id: "message", value: this.state.message, placeholder: "Message", onChange: this.handleChange}), button({
            type: "button",
            className: "private",
            onClick: this.sendPrivateMessage
        }, "Private Message"), button({
            type: "button",
            onClick: this.sendMessage
        }, "Message"));
        return React.createElement(Portlet, {
            title: "Send Message",
            id: "ticket_send_message_form",
            disable_close: true,
            disable_maximize: true,
            draggable: false,
            minimized: this.props.minimized,
            handleMaximize: this.props.handleMaximize,
            handleMinimize: this.props.handleMinimize
        }, content);
    }
});
